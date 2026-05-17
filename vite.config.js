import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { resolve } from 'path'

const DATA_PATH     = resolve(__dirname, 'src/utils/data.json')
const FINANCE_PATH  = resolve(__dirname, 'src/utils/finances.json')

function makeEndpoint(server, route, filePath, empty) {
  server.middlewares.use(route, (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    if (req.method === 'GET') {
      res.end(existsSync(filePath) ? readFileSync(filePath, 'utf-8') : empty)
    } else if (req.method === 'POST') {
      let body = ''
      req.on('data', chunk => (body += chunk))
      req.on('end', () => { writeFileSync(filePath, body, 'utf-8'); res.end('ok') })
    }
  })
}

function jsonStoragePlugin() {
  return {
    name: 'json-storage',
    configureServer(server) {
      makeEndpoint(server, '/api/data',     DATA_PATH,    '{}')
      makeEndpoint(server, '/api/finances', FINANCE_PATH, 'null')
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), jsonStoragePlugin()],
  server: {
    watch: {
      ignored: ['**/src/utils/data.json', '**/src/utils/finances.json'],
    },
  },
})
