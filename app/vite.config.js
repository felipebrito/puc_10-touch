import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'save-config',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === '/api/save-config' && req.method === 'POST') {
            let body = ''
            req.on('data', chunk => { body += chunk.toString() })
            req.on('end', () => {
              try {
                const configPath = path.resolve(__dirname, 'src/data/designConfig.json')
                fs.writeFileSync(configPath, body, 'utf8')
                console.log('✅ Design config saved to disk')
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ message: 'Saved successfully' }))
              } catch (err) {
                console.error('❌ Error saving config:', err)
                res.statusCode = 500
                res.end(JSON.stringify({ error: err.message }))
              }
            })
          } else {
            next()
          }
        })
      }
    }
  ],
})
