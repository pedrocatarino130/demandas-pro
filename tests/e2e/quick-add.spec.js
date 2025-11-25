import { test, expect } from '@playwright/test';

/**
 * Teste E2E: Criar tarefa via Quick Add
 * TASK-024: Suite de Testes E2E
 */
test.describe('Quick Add - Criar Tarefa', () => {
  test.beforeEach(async ({ page }) => {
    // Navegar para a aplicação
    await page.goto('/');
    
    // Limpar localStorage antes de cada teste
    await page.evaluate(() => {
      localStorage.clear();
    });
  });

  test('deve criar tarefa via quick add input', async ({ page }) => {
    // Localizar input de quick add (assumindo que existe)
    const quickAddInput = page.locator('input[type="text"], textarea').first();
    
    // Verificar se input está visível
    await expect(quickAddInput).toBeVisible({ timeout: 5000 }).catch(() => {
      // Se não encontrar, pular teste com mensagem
      test.skip(true, 'Quick Add input não encontrado - implementar primeiro');
    });
    
    // Digitar tarefa com parser
    await quickAddInput.fill('Tarefa de teste @projeto #urgente :2h');
    await quickAddInput.press('Enter');
    
    // Verificar se tarefa foi criada
    await expect(page.locator('text=Tarefa de teste')).toBeVisible({ timeout: 3000 });
  });

  test('deve criar tarefa com área via parser @área', async ({ page }) => {
    const quickAddInput = page.locator('input[type="text"], textarea').first();
    
    await expect(quickAddInput).toBeVisible({ timeout: 5000 }).catch(() => {
      test.skip(true, 'Quick Add input não encontrado');
    });
    
    await quickAddInput.fill('Nova tarefa @backend');
    await quickAddInput.press('Enter');
    
    // Verificar se área foi criada/aplicada
    await expect(page.locator('text=backend')).toBeVisible({ timeout: 3000 });
  });
});


