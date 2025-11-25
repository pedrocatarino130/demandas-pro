import { defineConfig, devices } from '@playwright/test';

/**
 * Configuração do Playwright para testes E2E
 * TASK-024: Suite de Testes E2E
 */
export default defineConfig({
  testDir: './tests/e2e',
  
  // Timeout para cada teste
  timeout: 30 * 1000,
  
  // Expect timeout
  expect: {
    timeout: 5000
  },
  
  // Execução em paralelo
  fullyParallel: true,
  
  // Não continuar após falhas
  forbidOnly: !!process.env.CI,
  
  // Re-executar apenas falhas em CI
  retries: process.env.CI ? 2 : 0,
  
  // Workers em CI vs local
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter
  reporter: [
    ['html'],
    ['list'],
    ...(process.env.CI ? [['github']] : [])
  ],
  
  // Configurações compartilhadas
  use: {
    // Base URL da aplicação
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    
    // Timeout para ações
    actionTimeout: 10 * 1000,
    
    // Trace para debug
    trace: 'on-first-retry',
    
    // Screenshot em falhas
    screenshot: 'only-on-failure',
    
    // Video em falhas
    video: 'retain-on-failure',
  },

  // Configuração de projetos (browsers)
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    
    // Mobile
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  // Servidor web para desenvolvimento
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});


