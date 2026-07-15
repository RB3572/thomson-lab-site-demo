import { fileURLToPath, URL } from 'node:url'
import { writeFileSync } from 'node:fs'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { events, toICS } from './src/lib/events.ts'

/**
 * Emit a static calendar feed at /thomson-lab-events.ics so calendar apps can
 * subscribe to a stable URL (webcal://). Regenerated from the events data on
 * every dev start and production build, so subscribers get updates on redeploy.
 */
function labCalendarFeed(): Plugin {
  const write = () =>
    writeFileSync(
      fileURLToPath(new URL('./public/thomson-lab-events.ics', import.meta.url)),
      toICS(events),
    )
  return {
    name: 'lab-calendar-feed',
    buildStart: write,
    configureServer: write,
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), labCalendarFeed()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
