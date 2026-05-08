import { defineConfig, devices } from '@playwright/test'

// baseURL resolution order:
//   1. PLAYWRIGHT_BASE_URL env var (CI / per-run override)
//   2. dev_server_url written here by scaffold-agent from workshop-stack.md
//   3. http://localhost:5173 fallback (Vite default — only used before scaffold-agent runs)
const baseURL =
  process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:5173'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: [['html', { outputFolder: 'docs/test-reports', open: 'never' }]],
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
})
