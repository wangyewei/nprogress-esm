import { defineConfig } from 'vitest/dist/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'json', 'html'],
      exclude: ['scripts/', 'playgrounds/*'],
    },
  },
})
