import { defineConfig } from '@tanstack/start/config'

export default defineConfig({
  server: {
    preset: 'netlify' // Forces output into Netlify-compatible functions instead of Wrangler
  }
})
