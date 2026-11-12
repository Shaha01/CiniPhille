import fs from 'node:fs'
import { execSync } from 'node:child_process'

fs.copyFileSync('index.src.html', 'index.html')
execSync('npx vite build', { stdio: 'inherit' })

if (fs.existsSync('assets')) {
  fs.rmSync('assets', { recursive: true, force: true })
}
fs.cpSync('dist/assets', 'assets', { recursive: true })
fs.copyFileSync('dist/index.html', 'index.html')
fs.copyFileSync('dist/index.html', '404.html')
if (fs.existsSync('dist/favicon.ico')) {
  fs.copyFileSync('dist/favicon.ico', 'favicon.ico')
}

console.log('GitHub Pages root build updated successfully.')

