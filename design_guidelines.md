# 🎨 PUC Trilho App — Design System & Visual Guidelines

> **Propósito:** Documento de referência completo para replicar com fidelidade o padrão visual da aplicação *PUC Gigantes — Trilho App* em novas aplicações. Cada seção contém os valores exatos utilizados no projeto original.

---

## 📋 Sumário

1. [Stack Tecnológico](#1-stack-tecnológico)
2. [Canvas & Viewport](#2-canvas--viewport)
3. [Tipografia](#3-tipografia)
4. [Paleta de Cores](#4-paleta-de-cores)
5. [Reset & Estilos Globais](#5-reset--estilos-globais)
6. [Componentes Reutilizáveis](#6-componentes-reutilizáveis)
7. [Templates de Telas (Views)](#7-templates-de-telas-views)
8. [Sistema de Animações](#8-sistema-de-animações)
9. [Elementos Gráficos & Decorativos](#9-elementos-gráficos--decorativos)
10. [Estrutura de Dados](#10-estrutura-de-dados)
11. [Estrutura de Diretórios](#11-estrutura-de-diretórios)
12. [Checklist para Nova Aplicação](#12-checklist-para-nova-aplicação)

---

## 1. Stack Tecnológico

| Camada | Tecnologia | Versão |
|---|---|---|
| Framework | React | 19.x |
| Build Tool | Vite | 7.x |
| Animações | Framer Motion | 12.x |
| Comunicação | Socket.IO Client | 4.x |
| Linguagem | JavaScript (JSX) | ES2022+ |
| Estilização | Vanilla CSS (módulos por componente) | — |

> [!IMPORTANT]
> **Sem Tailwind, sem CSS-in-JS, sem pré-processadores.** Cada componente possui seu próprio arquivo `.css` importado diretamente no `.jsx`. O design system é definido via CSS Custom Properties (variáveis) no `:root`.

---

## 2. Canvas & Viewport

A aplicação é desenhada **pixel-perfect** para totens verticais (kiosk):

```
Resolução de Design:  1080 × 1920 px
Aspect Ratio:         9:16
Orientação:           Retrato (Portrait)
```

### Implementação do Container Principal

```css
html, body, #root {
    width: 100%;
    height: 100%;
    overflow: hidden;
}

#root {
    display: flex;
    flex-direction: column;
    position: relative;
    max-width: 1080px;
    margin: 0 auto;
    aspect-ratio: 9 / 16;
    background-color: var(--color-bg-dark);
}
```

> [!NOTE]
> O `max-width: 1080px` com `margin: 0 auto` centraliza o totem quando visualizado em telas mais largas. O `aspect-ratio: 9 / 16` garante a proporção mesmo em resoluções diferentes. O `overflow: hidden` impede scrollbars.

---

## 3. Tipografia

### 3.1 Famílias de Fontes

A aplicação utiliza **4 famílias tipográficas**, cada uma com propósito distinto:

| Variável CSS | Família | Peso(s) Utilizados | Propósito |
|---|---|---|---|
| `--font-primary` | **Blender Pro Heavy** | 900 | Títulos principais, headings, nomes de espécies |
| *(inline)* | **Blender Pro Medium** | 500 | Subtítulos, labels intermediários |
| *(inline)* | **Blender Pro Book** | 300 | Labels leves, subtítulos de período |
| `--font-canva` | **Canva Sans Regular** | 400 | Corpo de texto, descrições, parágrafos |
| `--font-body` | **Georgia, Times New Roman, serif** | 400 | Textos descritivos (visual museu, tipografia serifada) |

### 3.2 Fontes de Fallback (Google Fonts — HTML)

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Rajdhani:wght@400;500;600;700&display=swap" rel="stylesheet">
```

- **Inter** — Utilizada pontualmente para destaques em texto (ex.: `85% de todas as espécies` no slide de extinção).
- **Rajdhani** — Carregada como fallback adicional.

### 3.3 Declarações `@font-face`

```css
@font-face {
    font-family: 'Blender Pro Book';
    src: url('/assets/fonts/BlenderPro-Book.ttf') format('truetype');
}

@font-face {
    font-family: 'Blender Pro Medium';
    src: url('/assets/fonts/BlenderPro-Medium.ttf') format('truetype');
}

@font-face {
    font-family: 'Blender Pro Heavy';
    src: url('/assets/fonts/BlenderPro-Heavy.ttf') format('truetype');
}

@font-face {
    font-family: 'Canva Sans Regular';
    src: url('/assets/fonts/CanvaSans-Regular.otf') format('opentype');
}
```

### 3.4 Escala Tipográfica Completa

A escala é **fixa em pixels absolutos** (não relativa) para garantir fidelidade pixel-perfect no totem:

| Contexto | `font-size` | `font-family` | `font-weight` | `letter-spacing` | `line-height` |
|---|---|---|---|---|---|
| **Título Principal (Home)** | `143px` | Blender Pro Heavy | 900 | `9.7px` | `0.9` |
| **Título Descritivo (Home)** | `96px` | Blender Pro Medium | normal | `-3px` | — |
| **Subtítulo Período (Home)** | `73px` | Blender Pro Book | 300 | `7.8px` | — |
| **Sub-descrição (Home)** | `50px` | Canva Sans Regular | normal | — | — |
| **Heading de Seção** | `96px` | Blender Pro Heavy | 900 | — | `1.05` |
| **Nome do Período (Seção)** | `60px` | Blender Pro Heavy | 900 | `5px` | `1` |
| **Label de Período (Seção)** | `30px` | Blender Pro Book | 300 | `7px` | — |
| **Corpo de Texto (Seção)** | `48px` | Canva Sans Regular | 400 | `-0.5px` | `1.3` |
| **Nome de Espécime** | `88.8px` | Blender Pro Heavy | 900 | `3px` | `1` |
| **Subtítulo de Espécime** | `57.3px` | Blender Pro Medium | 500 | `0px` | `1` |
| **Descrição de Espécime** | `40px` | Canva Sans Regular | 400 | — | `50px` |
| **Header Bar (Siluriano)** | `50px` | Blender Pro Heavy | 900 | `0.15em` | — |
| **Intro Text (Siluriano)** | `38px` | Canva Sans Regular | 400 | — | `1.33` |
| **Description (Siluriano)** | `37.33px` | Georgia (serif) | 400 | — | `48px` |
| **Globe Description** | `38.5px` | Canva Sans Regular | 400 | — | `47px` |
| **Extinction Body Text** | `37.33px` | Canva Sans Regular | 400 | `0em` | `47px` |
| **Event Title** | `140px` | Blender Pro Heavy | 900 | `5px` | — |
| **Event Subtitle** | `50px` | Blender Pro Book | 300 | `5px` | — |
| **Event Detail Title** | `88px` | Blender Pro Heavy | 900 | `3px` | — |
| **Event Detail Text** | `40px` | Canva Sans Regular | 400 | — | `50px` |
| **Botão Home** | `41px` | Blender Pro Medium | normal | `2px` | — |
| **Botão Ícone** | `50px` | Canva Sans Regular | — | — | — |
| **Caption (Extinção)** | `24px` | Canva Sans Regular | 600 | — | `1.3` |

### 3.5 Regras Tipográficas Globais

```css
h1, h2, h3 {
    font-family: 'Blender Pro Heavy', sans-serif;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}
```

> [!TIP]
> Headings são **sempre uppercase**. Corpo de texto e descrições **nunca** usam uppercase.

---

## 4. Paleta de Cores

### 4.1 CSS Custom Properties

```css
:root {
    --color-bg-dark:       #070d19;    /* Fundo escuro principal */
    --color-bg-light:      #f4f4f4;    /* Fundo claro (telas de conteúdo) */
    --color-primary-blue:  #005fff;    /* Azul primário (destaques, botões, linhas) */
    --color-white:         #ffffff;    /* Texto sobre fundos escuros */
    --color-text-dark:     #0b0e21;    /* Texto sobre fundos claros */
}
```

### 4.2 Tabela de Cores Completa

| Nome | Hex | RGB | Uso |
|---|---|---|---|
| **Background Dark** | `#070d19` | `rgb(7, 13, 25)` | Fundo principal das telas escuras, overlay de vídeo |
| **Background Light** | `#f4f4f4` | `rgb(244, 244, 244)` | Fundo das telas de conteúdo (espécimes, globo) |
| **Primary Blue** | `#005fff` | `rgb(0, 95, 255)` | Cor de destaque: botões, linhas, nomes de espécie, header bars |
| **Secondary Blue** | `#006eff` | `rgb(0, 110, 255)` | Header bar do Siluriano, linhas decorativas escalonadas |
| **White** | `#ffffff` | `rgb(255, 255, 255)` | Texto em fundo escuro, linhas de underline |
| **Dark Navy** | `#0b0e21` | `rgb(11, 14, 33)` | Texto em fundo claro, background de seções de imagem |
| **Muted Blue** | `rgba(0, 85, 255, 0.4)` | — | Dots inativos (MorphingPageDots) |
| **Blue Ripple** | `rgba(0, 85, 255, 0.3)` | — | Efeito ripple dos dots ativos |
| **Dark Blue Hover** | `#0033cc` | — | Hover dos chevrons de navegação |
| **Overlay Gradient** | `rgba(7,13,25,0.4)` → `rgba(7,13,25,0.6)` | — | Overlay sobre vídeos |
| **Glass** | `rgba(0, 0, 0, 0.5)` | — | Cards com backdrop-filter blur |
| **Divider** | `rgba(255, 255, 255, 0.3)` | — | Linhas divisórias sutis |
| **Caption Dark** | `#2b2b2b` | — | Texto de captions de menor destaque |

### 4.3 Esquema de Cores (Color Scheme)

```css
:root {
    color-scheme: light dark;
}
```

> [!NOTE]
> A aplicação alterna entre fundos escuros (telas home, intro, evento) e claros (espécimes, globo, extinção). A distinção é feita por **classe** no componente, não por media query.

---

## 5. Reset & Estilos Globais

```css
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

:root {
    line-height: 1.5;
    font-weight: 400;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
}

a {
    text-decoration: none;
    color: inherit;
}

button {
    cursor: pointer;
    border: none;
    outline: none;
    font-family: inherit;
}

button:focus {
    outline: none;
}
```

### Animação Global — Fade In

```css
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-in {
    animation: fadeIn 0.6s ease-out forwards;
}

.delay-100 { animation-delay: 0.1s; }
.delay-200 { animation-delay: 0.2s; }
.delay-300 { animation-delay: 0.3s; }
```

---

## 6. Componentes Reutilizáveis

### 6.1 TopBar (Cabeçalho)

Imagem estática fixada no topo.

```css
.top-bar {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 100;
    display: flex;
}

.header-image {
    width: 100%;
    height: auto;
    object-fit: contain;
}
```

**Asset:** `/assets/cabeçalho.png` *(barra azul institucional com logo)*

---

### 6.2 BottomBar (Rodapé)

Imagem estática fixada no bottom, com `pointer-events: none`.

```css
.bottom-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 9999 !important;
    display: flex;
    pointer-events: none;
}

.footer-image {
    width: 100%;
    height: auto;
    object-fit: contain;
}
```

**Asset:** `/assets/rodapé.png` *(barra com logos institucionais)*

---

### 6.3 BackgroundVideo

Vídeo de fundo com overlay gradiente. Duas variantes:

| Variante | Altura | Clip-path |
|---|---|---|
| `full` | `100vh` | Nenhum |
| `split` | `55vh` | Angular cut diagonal |

```css
.variant-full {
    height: 100vh;
}

.variant-split {
    height: 55vh;
    clip-path: polygon(
        0 0,
        100% 0,
        100% calc(100% - 40px),
        calc(100% - 250px) calc(100% - 40px),
        calc(100% - 280px) 100%,
        0 100%
    );
}

.video-overlay {
    background: linear-gradient(
        to bottom,
        rgba(7, 13, 25, 0.4) 0%,
        rgba(7, 13, 25, 0.6) 100%
    );
}
```

**Comportamento:** `autoPlay`, `loop`, `muted`, `playsInline`, `playbackRate: 0.8`

---

### 6.4 Button (Botão Genérico)

Botão com recorte angular (clip-path) no estilo sci-fi:

```css
.btn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-md) var(--spacing-xl);
    font-size: 1.1rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    border: none;
    transition: all 0.3s ease;
    clip-path: polygon(
        15px 0, 100% 0,
        100% calc(100% - 15px),
        calc(100% - 15px) 100%,
        0 100%, 0 15px
    );
    min-width: 200px;
}
```

**Variantes disponíveis:**

| Variante | Background | Cor do Texto |
|---|---|---|
| `btn-primary` | `#005fff` | `#ffffff` |
| `btn-secondary` | `#d1d5db` | `#0b0e21` |
| `btn-ghost` | Transparente + border branco | `#ffffff` |

**Efeitos:**
- Hover: `translateY(-2px)` + `box-shadow: 0 10px 20px rgba(0,0,0,0.2)`
- Active: `translateY(1px)`

---

### 6.5 Button Home (Botão de Menu)

Botão de menu estilo kiosk com imagem de fundo para estado ativo:

```css
.btn-home {
    width: 860px;
    height: 89px;
    padding: 0 45px;
    font-size: 41px;
    font-family: 'Blender Pro Medium', sans-serif;
    text-transform: uppercase;
    letter-spacing: 2px;
    background-size: 110% 100%;
    transition: transform 0.2s ease;
}

/* Estado ativo — imagem de fundo customizada */
.btn-home-active {
    background-image: url('/assets/botaoON.png');
    color: #0b0e21;
}

/* Estado inativo — azul sólido */
.btn-home-inactive {
    background-color: var(--color-primary-blue);
    border-radius: 10px;
    color: var(--color-white);
}
```

**Assets:** `/assets/botaoON.png`, `/assets/botaoOFF.png`

---

### 6.6 MorphingPageDots (Paginação)

Dots de navegação com spring animation (Framer Motion):

```css
.morphing-dots-container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;
    padding: 1.5rem 0;
}

.morphing-dot {
    cursor: pointer;
    background-color: rgba(0, 85, 255, 0.4);  /* Inativo */
}

.morphing-dot.active {
    background-color: var(--color-primary-blue);  /* Ativo */
}
```

**Dimensões animadas (Framer Motion):**

| Estado | Width | Height | Border Radius |
|---|---|---|---|
| Inativo | `10px` | `10px` | `9999px` |
| Ativo | `28px` | `10px` | `9999px` |

**Transição:** `type: "spring", stiffness: 300, damping: 24`

**Ripple do dot ativo:**
- `initial: { scale: 0.8, opacity: 0.6 }`
- `animate: { scale: 1.6, opacity: 0 }`
- `duration: 0.6s`

**Chevrons de navegação:** SVG inline com `width: 2rem`, cor `--color-primary-blue`, hover `#0033cc`.

---

### 6.7 Typewriter

Componente de texto com efeito de digitação caractere por caractere.

**Props:**

| Prop | Tipo | Default | Descrição |
|---|---|---|---|
| `text` | string | — | O texto a ser "digitado" |
| `delay` | number | `30` | Intervalo em ms entre cada caractere |
| `initialDelay` | number | `0` | Delay antes de começar a digitar |
| `className` | string | `''` | Classe CSS extra |

**Valores típicos usados:**

| Contexto | `delay` | `initialDelay` |
|---|---|---|
| Título do espécime | 50ms | 300ms |
| Subtítulo | 30ms | 1000ms |
| Descrição | 15ms | 2000ms |
| Heading de seção | 50ms | 300ms |
| Texto de seção | 15ms | 1500ms |

---

## 7. Templates de Telas (Views)

### 7.1 Home (Tela Inicial do Período)

```
┌──────────────────────────────┐
│ [TopBar - Cabeçalho PNG]     │  z-index: 100
│                              │
│ [BackgroundVideo: full]      │
│                              │
│  padding: 0 97px             │
│                              │
│  margin-top: 592px           │
│  ┌─────────────────────┐     │
│  │ PERÍODO              │ 73px, Blender Book, ls: 7.8px
│  │ ORDOVICIANO          │ 143px, Blender Heavy, ls: 9.7px
│  │ ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬   │ 610px × 5px branco
│  │ 440 milhões de anos  │ 96px, Blender Medium
│  │ A 1ª extinção...     │ 50px, Canva Sans
│  │ [linha gráfica.png]  │ 820px
│  └─────────────────────┘     │
│                              │
│  ┌─ Menu ──────────────┐     │  top: 1278px, left: 110px
│  │ [BIODIVERSIDADE   ›] │     │  860×89px, gap: 21px
│  │ [A EXTINÇÃO       ›] │     │
│  │ [E DEPOIS?        ›] │     │
│  └──────────────────────┘     │
│                              │
│ [BottomBar - Rodapé PNG]     │  z-index: 9999
└──────────────────────────────┘
```

---

### 7.2 SectionIntro (Introdução de Seção)

```
┌──────────────────────────────┐
│ [Background Image/Video]     │  opacity: 0.47 (imagem)
│  bg-color: #0b0e21           │
│                              │
│  content: top 154px, left 70px, 900×1500px
│                              │
│  ┌── Header ────────────┐    │  top: 40px
│  │ PERÍODO (30px Book)  │    │
│  │ ORDOVICIANO (60px H) │    │
│  │ [linha.svg]           │    │
│  └──────────────────────┘    │
│                              │
│  ┌── Body ─────────────┐    │  top: 540px
│  │ A BIODIVERSIDADE     │    │  96px, Heavy, uppercase
│  │ DA ÉPOCA             │    │
│  │ [linha.svg]           │    │
│  │ [Typewriter: texto]  │    │  48px, Canva Sans
│  │ [linha.svg]           │    │
│  └──────────────────────┘    │
└──────────────────────────────┘
```

---

### 7.3 SpecimenDetail (Detalhe de Espécie — Layout Split)

```
┌──────────────────────────────┐
│ [BackgroundVideo: split]     │  55vh com clip-path diagonal
│                              │
│                              │
├─── Corte angular ───────────┤
│ [baseInternaBranca.svg]      │  Fundo branco com recorte
│                              │
│  ┌── Text Overlay ──────┐    │  top: 115px, left: 106px
│  │ NOME DO ESPÉCIME     │    │  88.8px, Heavy, azul #005fff
│  │ Subtítulo             │    │  57.3px, Medium, azul
│  │                       │    │
│  │ Descrição do corpo... │    │  40px, Canva Sans, #0b0e21
│  └──────────────────────┘    │
│                              │
│  [ ◀ ● ●━● ● ▶ ]           │  MorphingPageDots, bottom: 100px
└──────────────────────────────┘
```

---

### 7.4 SilurianSpecimen (Espécime — Layout Interlocking)

```
┌──────────────────────────────┐
│ [Header Bar: azul #006eff]   │  124px, texto 50px Heavy
│                              │
│ [Intro Text Box]              │  padding: 60px 100px
│  38px, Canva Sans             │
│                              │
│ ┌── Image Section ──────┐    │  700px altura, bg: #0b0e21
│ │ [Imagem do Espécime]   │    │  clip-path: diagonal
│ │ ┌── Name Overlay ──┐  │    │  posição centralizada
│ │ │ DALMANITES SP.    │  │    │  71.7px, Heavy, branco
│ │ │ Subtítulo         │  │    │  38.3px, Medium
│ │ └──────────────────┘  │    │
│ └────────────────────────┘    │
│                              │
│ ┌── Description Box ────┐    │  bg: branco, margin-top: -60px
│ │ Texto serifa...        │    │  37.33px, Georgia
│ │                        │    │
│ │ [Stepped Line ▬▬/▬]   │    │  Azul #006eff, 4px
│ └────────────────────────┘    │
└──────────────────────────────┘
```

---

### 7.5 ExtinctionContent (Conteúdo de Extinção)

```
┌──────────────────────────────┐
│ [Header Bar: azul #005fff]   │  123.81px
│                              │
│ [Texto Topo: 37.33px]        │  Canva Sans, #0b0e21
│  position: 108px, 180.7px    │
│                              │
│ ┌── Imagem do Mapa ─────┐   │  975.7×487.8px
│ │ [extinction_map.png]   │   │  blur entrance animation
│ └────────────────────────┘   │
│                              │
│ [Caption: 1.7em, bold]       │  top: 1143px
│ [Linha azul: 890.5×4px]      │  top: 1246px, #005fff
│                              │
│ [Texto Inferior: 37.33px]    │  top: 1307px
│  Destaque: Inter bold, azul  │
│                              │
│ [Logos: PUC + Museu]         │  bottom area
└──────────────────────────────┘
```

---

### 7.6 SilurianGlobe (Globo Terrestre)

```
┌──────────────────────────────┐
│ [Header Bar: azul #006eff]   │  124px
│                              │
│  padding-top: 60px           │
│ ┌── Globe Container ────┐   │
│ │ [Imagem do Globo]      │   │  1080px wide
│ └────────────────────────┘   │
│                              │
│ ┌── Text Container ─────┐   │  930px
│ │ Descrição: 38.5px      │   │  Canva Sans, #0b0e21
│ │ line-height: 47px      │   │
│ │                        │   │
│ │ [Linha azul: 890×4px]  │   │  #006eff
│ └────────────────────────┘   │
│                              │
│ [Logos no Footer]            │  bottom: 120px
└──────────────────────────────┘
```

---

### 7.7 EventHeader (Evento Dramático)

```
┌──────────────────────────────┐
│ [BackgroundVideo: full]      │
│                              │
│         Centralizado         │
│  ┌──────────────────┐        │
│  │ PERÍODO (50px)    │        │  Blender Book, branco
│  │ DEVONIANO (140px) │        │  Blender Heavy, azul
│  │ ▬▬▬▬ (200×4px)   │        │  branco
│  │ Descrição (32px)  │        │  Blender Book, branco
│  └──────────────────┘        │
│                              │
└──────────────────────────────┘
```

---

### 7.8 EventDetail (Detalhe de Evento)

```
┌──────────────────────────────┐
│ [BackgroundVideo: full]      │
│                              │
│   ┌── Glass Card ─────────┐  │  800px, bg: rgba(0,0,0,0.5)
│   │ border-radius: 20px   │  │  backdrop-filter: blur(10px)
│   │ padding: 60px         │  │
│   │                       │  │
│   │ TÍTULO (88px Heavy)   │  │  Azul #005fff
│   │ ▬▬ (100×4px branco)  │  │
│   │ Texto (40px Canva)    │  │  Branco, line-height: 50px
│   └───────────────────────┘  │
└──────────────────────────────┘
```

---

### 7.9 DoubleSpecimenDetail (Duas Espécies)

```
┌──────────────────────────────┐
│ [BackgroundVideo: full]      │
│                              │
│  ┌── Top Species ────────┐   │  padding: 0 100px
│  │ [SVG branco base]     │   │  background baseInternaBranca.svg
│  │ NOME (72px Heavy)     │   │  #005fff
│  │ Subtítulo (46px Med)  │   │
│  │ Descrição (32px)      │   │  #0b0e21
│  └───────────────────────┘   │
│                              │
│  ▬▬ Divider (80%, 2px) ▬▬   │  rgba(255,255,255,0.3)
│                              │
│  ┌── Bottom Species ─────┐   │
│  │ (mesmo layout)        │   │
│  └───────────────────────┘   │
│                              │
│  [ ◀ ● ●━● ● ▶ ]           │
└──────────────────────────────┘
```

---

## 8. Sistema de Animações

### 8.1 Transições de Slide (Framer Motion)

Transição direcional (left/right/up/down) para troca de slides:

```javascript
const slideVariants = {
    initial: (dir) => {
        let x = 0, y = 0;
        if (dir === 'right') x = 1080;     // Entra pela direita
        if (dir === 'left')  x = -1080;    // Entra pela esquerda
        if (dir === 'down')  y = -1920;    // Entra por cima
        if (dir === 'up')    y = 1920;     // Entra por baixo
        return { x, y, opacity: 0, position: 'absolute', width: '100%', height: '100%', zIndex: 5 };
    },
    animate: {
        x: 0, y: 0, opacity: 1, zIndex: 10,
        transition: { duration: 0.6, ease: [0.33, 1, 0.68, 1] }
    },
    exit: (dir) => {
        let x = 0, y = 0;
        if (dir === 'right') x = -1080;
        if (dir === 'left')  x = 1080;
        if (dir === 'down')  y = 1920;
        if (dir === 'up')    y = -1920;
        return { x, y, opacity: 0, zIndex: 0, transition: { duration: 0.6, ease: [0.33, 1, 0.68, 1] } };
    }
};
```

> [!IMPORTANT]
> **Easing:** `[0.33, 1, 0.68, 1]` — Cubic Bezier personalizado. Equivalente a um ease-out suave.
> **Duração:** `0.6s` para todas as transições de slide.

---

### 8.2 Stagger de Conteúdo

Elementos filhos aparecem em sequência (stagger):

```javascript
const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, filter: 'blur(15px)', y: 20 },
    visible: {
        opacity: 1, filter: 'blur(0px)', y: 0,
        transition: { duration: 0.8, ease: 'easeOut' }
    }
};
```

**Padrão:** `staggerChildren: 0.15s`, cada item faz `0.8s` de animação com blur de entrada.

---

### 8.3 Blur de Entrada (Imagens)

Variante especial para imagens que entram com desfoque:

```javascript
const blurVariants = {
    hidden: { opacity: 0, filter: 'blur(20px)', y: 20 },
    visible: {
        opacity: 1, filter: 'blur(0px)', y: 0,
        transition: { duration: 1.4, ease: 'easeOut' }
    }
};
```

---

### 8.4 Scale de Entrada

Variante com scale sutil para conteúdo de extinção:

```javascript
const itemVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
        opacity: 1, scale: 1, y: 0,
        transition: { duration: 0.8, ease: 'easeOut' }
    }
};
```

---

## 9. Elementos Gráficos & Decorativos

### 9.1 Clip-Paths

| Elemento | Clip-Path |
|---|---|
| **Vídeo Split** | `polygon(0 0, 100% 0, 100% calc(100%-40px), calc(100%-250px) calc(100%-40px), calc(100%-280px) 100%, 0 100%)` |
| **Botão Angular** | `polygon(15px 0, 100% 0, 100% calc(100%-15px), calc(100%-15px) 100%, 0 100%, 0 15px)` |
| **Seção de Imagem** | `polygon(0 0, 100% 0, 100% 88%, 90% 100%, 0 100%)` |

### 9.2 Linhas Decorativas

| Tipo | Dimensão | Cor |
|---|---|---|
| **Title Underline** | `610px × 5px` | `#ffffff` |
| **Section Line (SVG)** | `/assets/linha.svg` | Azul (imagem) |
| **Stepped Line** | 3 segmentos: `540px` + slant `40px` + flex | `#006eff` |
| **Footer Line** | `80% × 2px` + 45° tail | `#005fff` |
| **Extinction Separator** | `864px × 3px` | `#005fff` |
| **Event Line** | `200px × 4px` | `#ffffff` |
| **Globe Bottom Line** | `890px × 4px` | `#006eff` |

### 9.3 Stepped Line (Linha Escalonada)

```css
.silurian-stepped-line {
    margin-top: 80px;
    width: 864px;
    height: 40px;
    display: flex;
    align-items: flex-end;
}

.segment-left   { flex: 0 0 540px; height: 4px; background: rgb(0,110,255); }
.segment-slant   { width: 40px; height: 40px; border-top: 4px solid rgb(0,110,255); border-left: 4px solid rgb(0,110,255); transform: skewX(-45deg); }
.segment-right   { flex: 1; height: 4px; background: rgb(0,110,255); margin-bottom: 34px; }
```

### 9.4 SVGs e Imagens Decorativas

| Asset | Caminho | Uso |
|---|---|---|
| Cabeçalho | `/assets/cabeçalho.png` | Barra superior com logo |
| Rodapé | `/assets/rodapé.png` | Barra inferior com logos institucionais |
| Linha gráfica | `/assets/linha.png` | Grafismo decorativo na Home |
| Linha SVG | `/assets/linha.svg` | Separadores nas seções |
| Linha 2 | `/assets/linha2.png` | Linha fina alternativa |
| Barra branca | `/assets/barrabranca.png` | Detalhe visual em espécimes |
| Base interna | `/assets/baseInternaBranca.svg` | Fundo SVG branco com recorte |
| Botão ON | `/assets/botaoON.png` | Estado ativo do botão de menu |
| Botão OFF | `/assets/botaoOFF.png` | Estado inativo do botão de menu |
| Background | `/assets/bg.png` | Textura de fundo (home) |
| Page 2 SVG | `/assets/pg2.svg` | SVG decorativo da página 2 |
| Ref 1 | `/assets/ref1.png` | Layout reference overlay |

---

## 10. Estrutura de Dados

### 10.1 Slide Object

Cada slide segue este schema:

```javascript
{
    type: 'single_species' | 'home' | 'home_devonian' | 'home_permiano' |
          'section_intro' | 'extinction_content' | 'extinction_content_devonian' |
          'silurian_globe' | 'silurian_specimen' | 'silurian_double_specimen' |
          'event_header' | 'event_detail' | 'double_species',

    period: 'ordoviciano' | 'devoniano' | 'permiano',

    section: 'home' | 'biodiversidade' | 'extincao' | 'pos_extincao',

    // Campos opcionais dependendo do type:
    id: 'string',               // Identificador único da espécie
    name: 'string',             // Nome em uppercase
    subtitle: 'string',         // Subtítulo descritivo
    title: 'string',            // Título da seção
    description: 'string',      // Texto de corpo
    content: 'string',          // Texto de conteúdo alternativo
    videoSrc: 'string',         // Caminho do vídeo MP4
    imageSrc: 'string',         // Caminho da imagem PNG/JPG
    bgImage: 'string',          // Background image para SectionIntro
    introText: 'string',        // Texto introdutório (Silurian)
    topText: 'string',          // Texto topo (Extinction)
    bottomText: 'string',       // Texto inferior (Extinction)
    imageCaption: 'string',     // Legenda da imagem
    periodLabel: 'string',      // "PERÍODO" ou customizado
    periodName: 'string',       // Nome do período para display

    // Para double specimens:
    speciesLeft: { name, subtitle, description, imageSrc },
    speciesRight: { name, subtitle, description, imageSrc }
}
```

### 10.2 Navegação

- **Horizontal (left/right):** Navega entre slides da mesma `section` e `period`.
- **Vertical (down):** Retorna ao inicio do `period` atual (tela Home).
- **Vertical (up):** Avança para um slide absoluto específico.
- **Atalhos numéricos:** `1` → Ordoviciano, `2` → Devoniano, `3` → Permiano.

---

## 11. Estrutura de Diretórios

```
trilho_app/
├── index.html                  # HTML entry point com Google Fonts
├── vite.config.js              # Configuração Vite (apenas react plugin)
├── package.json                # Dependências
│
├── public/
│   ├── assets/
│   │   ├── fonts/              # Fontes locais (TTF, OTF)
│   │   │   ├── BlenderPro-Book.ttf
│   │   │   ├── BlenderPro-Medium.ttf
│   │   │   ├── BlenderPro-Heavy.ttf
│   │   │   └── CanvaSans-Regular.otf
│   │   ├── videos/             # Vídeos MP4 das espécies
│   │   ├── cabeçalho.png       # TopBar
│   │   ├── rodapé.png          # BottomBar
│   │   ├── botaoON.png         # Botão ativo
│   │   ├── botaoOFF.png        # Botão inativo
│   │   ├── baseInternaBranca.svg  # Base branca SVG
│   │   ├── linha.svg           # Linha decorativa SVG
│   │   ├── linha.png           # Grafismo Home
│   │   ├── extinction_map.png  # Mapa extinção
│   │   ├── mapa-depois.png     # Globo pós-extinção
│   │   └── [espécies].png      # Imagens dos espécimes
│   └── fonts/
│       ├── blender-pro/        # Família completa Blender Pro
│       └── Canva-Sans-Regular/ # Canva Sans
│
└── src/
    ├── main.jsx                # Entry point React
    ├── index.css               # CSS global + variáveis + fonts
    ├── App.jsx                 # Componente raiz + navegação
    ├── App.css                 # Estilos mínimos do App
    │
    ├── components/             # Componentes reutilizáveis
    │   ├── TopBar.jsx/.css
    │   ├── BottomBar.jsx/.css
    │   ├── Button.jsx/.css
    │   ├── BackgroundVideo.jsx/.css
    │   ├── MorphingPageDots.jsx/.css
    │   └── Typewriter.jsx
    │
    ├── views/                  # Telas/layouts
    │   ├── Home.jsx/.css
    │   ├── HomeDevonian.jsx/.css
    │   ├── HomePermian.jsx/.css
    │   ├── SectionIntro.jsx/.css
    │   ├── SpecimenDetail.jsx/.css
    │   ├── SilurianGlobe.jsx/.css
    │   ├── SilurianSpecimen.jsx/.css
    │   ├── SilurianDoubleSpecimen.jsx/.css
    │   ├── ExtinctionContent.jsx/.css
    │   ├── ExtinctionContentDevonian.jsx/.css
    │   ├── EventHeader.jsx/.css
    │   ├── EventDetail.jsx/.css
    │   └── DoubleSpecimenDetail.jsx/.css
    │
    └── data/                   # Dados dos slides
        ├── slides.js           # Todos os slides (Ordoviciano + Devoniano + Permiano)
        └── species.js          # Dados auxiliares de espécies
```

---

## 12. Checklist para Nova Aplicação

Use esta lista para garantir que a nova aplicação siga o mesmo padrão visual:

### Fundação
- [ ] Criar projeto com **Vite + React** (`npx -y create-vite@latest ./ --template react`)
- [ ] Instalar **Framer Motion** (`npm install framer-motion`)
- [ ] Instalar **Socket.IO Client** se necessário (`npm install socket.io-client`)
- [ ] Copiar as fontes `BlenderPro-Book.ttf`, `BlenderPro-Medium.ttf`, `BlenderPro-Heavy.ttf`, `CanvaSans-Regular.otf` para `/public/assets/fonts/`
- [ ] Adicionar link do Google Fonts (Inter + Rajdhani) no `index.html`
- [ ] Copiar assets decorativos: `cabeçalho.png`, `rodapé.png`, `botaoON.png`, `baseInternaBranca.svg`, `linha.svg`

### CSS Global (`index.css`)
- [ ] Declarar os 4 `@font-face`
- [ ] Definir variáveis CSS no `:root` (cores, fontes)
- [ ] Implementar reset (`*, html, body, #root`)
- [ ] Configurar container `#root` com `max-width: 1080px`, `aspect-ratio: 9/16`, `margin: 0 auto`
- [ ] Definir regras tipográficas globais (h1–h3 uppercase)
- [ ] Adicionar keyframe `fadeIn` e classes utilitárias

### Componentes Obrigatórios
- [ ] `TopBar` — Header fixo com imagem
- [ ] `BottomBar` — Footer fixo com imagem, `pointer-events: none`
- [ ] `BackgroundVideo` — Variantes `full` e `split` com overlay gradiente
- [ ] `Button` — Com clip-path angular + 3 variantes (primary, secondary, ghost)
- [ ] `MorphingPageDots` — Paginação com spring animation (Framer Motion)
- [ ] `Typewriter` — Efeito de digitação para textos

### Padrões Visuais
- [ ] Fundo escuro `#070d19` para telas dramáticas (home, extinção, eventos)
- [ ] Fundo claro `#f4f4f4` para telas informativas (espécimes, globo)
- [ ] Azul `#005fff` para todos os destaques, linhas e elementos interativos
- [ ] Clip-paths para recortes angulares (botão, vídeo split, seção de imagem)
- [ ] Backdrop-filter glass effect para cards sobre vídeo (`rgba(0,0,0,0.5)` + `blur(10px)`)
- [ ] Stepped lines como separadores azuis (#006eff) com segmentos + slant

### Animações
- [ ] Transições de slide via `AnimatePresence` com 4 direções e easing `[0.33, 1, 0.68, 1]`
- [ ] Stagger de conteúdo (`staggerChildren: 0.15`)
- [ ] Blur entrance para imagens (`filter: blur(20px)` → `blur(0px)`, 1.4s)
- [ ] Spring animation nos dots de paginação (`stiffness: 300, damping: 24`)
- [ ] Typewriter com timings escalonados (título → subtítulo → descrição)
- [ ] Vídeo de fundo com `playbackRate: 0.8` para atmosfera lenta

### Qualidade
- [ ] `text-rendering: optimizeLegibility`
- [ ] `-webkit-font-smoothing: antialiased`
- [ ] `overflow: hidden` em html, body e #root
- [ ] Todos os tamanhos de fonte em **px absolutos** (não rem/em) para pixel-perfect
- [ ] `object-fit: cover` para imagens, `object-fit: contain` para SVGs

---

> [!CAUTION]
> **Não usar `rem` ou `em` para tamanhos tipográficos.** A aplicação é desenhada para uma resolução fixa de 1080×1920 e todos os tamanhos são em `px` absolutos para manter a fidelidade pixel-perfect com os layouts desenhados no Canva.

> [!TIP]
> Ao criar uma nova aplicação, comece sempre pelo `index.css` com todas as variáveis e fonts, depois crie os componentes base (TopBar, BottomBar, BackgroundVideo), e só depois monte as views/telas. Cada view deve ter seu próprio `.css` co-localizado com o `.jsx`.
