import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { resolve } from 'path'

const DATA_PATH = resolve(__dirname, 'src/utils/data.json')

function jsonStoragePlugin() {
  return {
    name: 'json-storage',
    configureServer(server) {
      server.middlewares.use('/api/data', (req, res) => {
        res.setHeader('Content-Type', 'application/json')

        if (req.method === 'GET') {
          const content = existsSync(DATA_PATH) ? readFileSync(DATA_PATH, 'utf-8') : '{}'
          res.end(content)
        } else if (req.method === 'POST') {
          let body = ''
          req.on('data', chunk => (body += chunk))
          req.on('end', () => {
            writeFileSync(DATA_PATH, body, 'utf-8')
            res.end('ok')
          })
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), jsonStoragePlugin()],
  server: {
    watch: {
      // Évite que Vite recharge la page à chaque écriture du fichier
      ignored: ['**/src/utils/data.json'],
    },
  },
})
