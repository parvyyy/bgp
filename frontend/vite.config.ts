import fs from 'node:fs'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type Connect, type Plugin } from 'vite'

// Keeps the connect four score in score.json.
//   GET  /api/score                      -> { "you": 3, "me": 5 }
//   POST /api/score  { "winner": "you" } -> adds a win, returns the new score
// Only works while `pnpm dev` or `pnpm preview` is running: a static host
// can't write files.
function scoreFile(): Plugin {
  const file = new URL('./score.json', import.meta.url)

  const handle: Connect.NextHandleFunction = (req, res, next) => {
    if (req.url !== '/api/score') return next()
    const score = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : { you: 0, me: 0 }
    const reply = () => {
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(score))
    }
    if (req.method !== 'POST') return reply()

    let body = ''
    req.on('data', (chunk) => (body += chunk))
    req.on('end', () => {
      const winner = JSON.parse(body || '{}').winner
      if (winner === 'you' || winner === 'me') {
        score[winner] += 1
        fs.writeFileSync(file, JSON.stringify(score, null, 2) + '\n')
      }
      reply()
    })
  }

  return {
    name: 'score-file',
    // Otherwise writing the file makes the dev server reload the page.
    config: () => ({ server: { watch: { ignored: ['**/score.json'] } } }),
    configureServer: (server) => void server.middlewares.use(handle),
    configurePreviewServer: (server) => void server.middlewares.use(handle),
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), scoreFile()],
})
