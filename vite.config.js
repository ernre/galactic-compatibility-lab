import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Set VITE_BASE_PATH=/your-repository-name/ when publishing to GitHub Pages.
export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [react()],
})
