import { useEffect, useRef } from 'react';

const SIM_SIZE = 512;

// ── Shaders ────────────────────────────────────────────────────────────────

const VERT_SRC = `#version 300 es
in vec2 aPos;
out vec2 vUV;
void main() {
  vUV = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

// Wave equation: h[n+1] = 2 * avg(neighbors[n]) - h[n-1], with damping
const UPDATE_FRAG = `#version 300 es
precision highp float;
uniform sampler2D uTex;
uniform vec2 uDelta;
uniform float uDamping;
uniform float uSpeedMix;
in vec2 vUV;
out vec4 fragColor;
void main() {
  vec4 info  = texture(uTex, vUV);
  float left  = texture(uTex, vUV + vec2(-uDelta.x, 0.0)).r;
  float right = texture(uTex, vUV + vec2( uDelta.x, 0.0)).r;
  float up    = texture(uTex, vUV + vec2(0.0,  uDelta.y)).r;
  float down  = texture(uTex, vUV + vec2(0.0, -uDelta.y)).r;
  float calculatedH = (left + right + up + down) * 0.5 - info.g;
  float newH = mix(info.r, calculatedH, uSpeedMix);
  newH *= uDamping;
  fragColor = vec4(newH, info.r, 0.0, 1.0);
}`;

// Add a circular drop to the height field
const DROP_FRAG = `#version 300 es
precision highp float;
uniform sampler2D uTex;
uniform vec2 uCenter;
uniform float uRadius;
uniform float uStrength;
in vec2 vUV;
out vec4 fragColor;
void main() {
  vec4 info = texture(uTex, vUV);
  float dist = length(vUV - uCenter);
  if (dist < uRadius) {
    float t = 1.0 - dist / uRadius;
    info.r += pow(t, 2.5) * uStrength;
  }
  fragColor = info;
}`;

// Render water surface as a semi-transparent light/caustic overlay
const RENDER_FRAG = `#version 300 es
precision highp float;
uniform sampler2D uTex;
uniform vec2 uDelta;
uniform float uNormalZ;
in vec2 vUV;
out vec4 fragColor;
void main() {
  vec4 info   = texture(uTex, vUV);
  float left  = texture(uTex, vUV + vec2(-uDelta.x, 0.0)).r;
  float right = texture(uTex, vUV + vec2( uDelta.x, 0.0)).r;
  float up    = texture(uTex, vUV + vec2(0.0,  uDelta.y)).r;
  float down  = texture(uTex, vUV + vec2(0.0, -uDelta.y)).r;

  vec3 normal   = normalize(vec3(right - left, up - down, uNormalZ));
  vec3 lightDir = normalize(vec3(0.4, 0.9, 1.5));
  vec3 eyeDir   = vec3(0.0, 0.0, 1.0);

  float diffuse  = max(0.0, dot(normal, lightDir));
  float specular = pow(max(0.0, dot(reflect(-lightDir, normal), eyeDir)), 80.0);

  float wave  = abs(info.r) * 9.0;
  float alpha = clamp(wave * (diffuse * 0.35 + specular * 1.1), 0.0, 0.72);

  vec3 color = mix(vec3(0.18, 0.52, 0.88), vec3(0.88, 0.96, 1.0), specular);
  fragColor = vec4(color, alpha);
}`;

// ── WebGL helpers ──────────────────────────────────────────────────────────

function compileShader(gl, type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error('[WaterRipple] shader error:', gl.getShaderInfoLog(s));
        return null;
    }
    return s;
}

function linkProgram(gl, vertSrc, fragSrc) {
    const p = gl.createProgram();
    gl.attachShader(p, compileShader(gl, gl.VERTEX_SHADER, vertSrc));
    gl.attachShader(p, compileShader(gl, gl.FRAGMENT_SHADER, fragSrc));
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
        console.error('[WaterRipple] program error:', gl.getProgramInfoLog(p));
        return null;
    }
    return p;
}

// ── Component ──────────────────────────────────────────────────────────────

export default function WaterRipple({ config }) {
    const canvasRef = useRef(null);
    const configRef = useRef(config);

    useEffect(() => {
        configRef.current = config;
    }, [config]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const gl = canvas.getContext('webgl2', { alpha: true, premultipliedAlpha: false });
        if (!gl) {
            console.warn('[WaterRipple] WebGL2 not supported — effect disabled.');
            return;
        }

        // Extension for rendering to float textures
        const ext = gl.getExtension('EXT_color_buffer_float');
        if (!ext) {
            console.warn('[WaterRipple] EXT_color_buffer_float not supported — effect might be degraded.');
        }

        const onResize = () => {
            canvas.width  = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        onResize();
        window.addEventListener('resize', onResize);

        // Programs
        const updateProg = linkProgram(gl, VERT_SRC, UPDATE_FRAG);
        const dropProg   = linkProgram(gl, VERT_SRC, DROP_FRAG);
        const renderProg = linkProgram(gl, VERT_SRC, RENDER_FRAG);
        if (!updateProg || !dropProg || !renderProg) return;

        // Fullscreen quad in NDC
        const quadVBO = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, quadVBO);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

        function makeTexture() {
            const t = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, t);
            // Use RGBA16F with HALF_FLOAT or FLOAT
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, SIM_SIZE, SIM_SIZE, 0, gl.RGBA, gl.FLOAT, null);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            return t;
        }

        function makeFBO(tex) {
            const f = gl.createFramebuffer();
            gl.bindFramebuffer(gl.FRAMEBUFFER, f);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            return f;
        }

        let texA = makeTexture(), texB = makeTexture();
        let fboA = makeFBO(texA), fboB = makeFBO(texB);
        let [readTex, writeTex] = [texA, texB];
        let [readFBO, writeFBO] = [fboA, fboB];

        const delta = new Float32Array([1 / SIM_SIZE, 1 / SIM_SIZE]);

        function bindQuad(prog) {
            const loc = gl.getAttribLocation(prog, 'aPos');
            gl.bindBuffer(gl.ARRAY_BUFFER, quadVBO);
            gl.enableVertexAttribArray(loc);
            gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
        }

        function swap() {
            [readTex, writeTex] = [writeTex, readTex];
            [readFBO, writeFBO] = [writeFBO, readFBO];
        }

        function addDrop(nx, ny, radius = 0.035, strength = 0.15) {
            gl.useProgram(dropProg);
            bindQuad(dropProg);
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, readTex);
            gl.uniform1i(gl.getUniformLocation(dropProg, 'uTex'), 0);
            gl.uniform2f(gl.getUniformLocation(dropProg, 'uCenter'), nx, ny);
            gl.uniform1f(gl.getUniformLocation(dropProg, 'uRadius'), radius);
            gl.uniform1f(gl.getUniformLocation(dropProg, 'uStrength'), strength);
            gl.bindFramebuffer(gl.FRAMEBUFFER, writeFBO);
            gl.viewport(0, 0, SIM_SIZE, SIM_SIZE);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            swap();
        }

        function stepSim() {
            gl.useProgram(updateProg);
            bindQuad(updateProg);
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, readTex);
            gl.uniform1i(gl.getUniformLocation(updateProg, 'uTex'), 0);
            gl.uniform2fv(gl.getUniformLocation(updateProg, 'uDelta'), delta);
            gl.uniform1f(gl.getUniformLocation(updateProg, 'uDamping'), configRef.current.ripple.damping);
            gl.uniform1f(gl.getUniformLocation(updateProg, 'uSpeedMix'), configRef.current.ripple.speed);
            gl.bindFramebuffer(gl.FRAMEBUFFER, writeFBO);
            gl.viewport(0, 0, SIM_SIZE, SIM_SIZE);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            swap();
        }

        function renderWater() {
            gl.useProgram(renderProg);
            bindQuad(renderProg);
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, readTex);
            gl.uniform1i(gl.getUniformLocation(renderProg, 'uTex'), 0);
            gl.uniform2fv(gl.getUniformLocation(renderProg, 'uDelta'), delta);
            gl.uniform1f(gl.getUniformLocation(renderProg, 'uNormalZ'), configRef.current.ripple.normalZ);
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            gl.viewport(0, 0, canvas.width, canvas.height);
            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            gl.disable(gl.BLEND);
        }

        // Touch / click input
        const onPointer = (e) => {
            const pts = e.changedTouches ? Array.from(e.changedTouches) : [e];
            for (const p of pts) {
                const nx = p.clientX / window.innerWidth;
                const ny = 1.0 - p.clientY / window.innerHeight; // flip Y for WebGL
                addDrop(nx, ny, configRef.current.ripple.radius, configRef.current.ripple.strength);
            }
        };

        const onMouseMove = (e) => {
            if (e.buttons === 1) onPointer(e);
        };

        window.addEventListener('touchstart', onPointer, { passive: false });
        window.addEventListener('touchmove',  onPointer, { passive: false });
        window.addEventListener('mousedown',  onPointer);
        window.addEventListener('mousemove',  onMouseMove);

        let raf;
        function loop() {
            stepSim();
            renderWater();
            raf = requestAnimationFrame(loop);
        }
        raf = requestAnimationFrame(loop);

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('resize',     onResize);
            window.removeEventListener('touchstart', onPointer);
            window.removeEventListener('touchmove',  onPointer);
            window.removeEventListener('mousedown',  onPointer);
            window.removeEventListener('mousemove',  onMouseMove);
            gl.deleteTexture(texA);
            gl.deleteTexture(texB);
            gl.deleteFramebuffer(fboA);
            gl.deleteFramebuffer(fboB);
            gl.deleteBuffer(quadVBO);
            [updateProg, dropProg, renderProg].forEach(p => gl.deleteProgram(p));
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                inset: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 9999,
            }}
        />
    );
}
