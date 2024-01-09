import { defineConfig } from 'vitest/dist/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    coverage: {
      include: ['**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    },
  },
})
