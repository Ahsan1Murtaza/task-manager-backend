import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    // Run test files sequentially
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
    // Global setup/teardown via setupFiles
    setupFiles: ['./tests/setup.js'],
    // Timeout per test (mongodb-memory-server can be slow on first launch)
    testTimeout: 30000,
    hookTimeout: 30000,
    // Per-file coverage
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['controllers/**', 'middlewares/**', 'routes/**', 'config/**'],
      exclude: ['node_modules/**', 'tests/**'],
    },
    // Sequential to avoid flaky parallel DB state
    sequence: {
      concurrent: false,
    },
    environment: 'node',
  },
})
