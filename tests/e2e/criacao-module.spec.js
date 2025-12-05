/**
 * E2E Tests - Módulo de Criação
 * Testes para Ideias, Planejamento e Tarefas de Criação
 */

import { test, expect } from '@playwright/test';

test.describe('Módulo de Criação - Ideias', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Navegar para a página de ideias
    await page.click('[data-route="/criacao/ideias"]');
    await expect(page).toHaveURL('/criacao/ideias');
  });

  test('deve exibir a view de Ideias corretamente', async ({ page }) => {
    // Verificar título
    await expect(page.locator('.criacao-ideias-title')).toContainText('Ideias');
    
    // Verificar input de quick capture
    const quickInput = page.locator('#quick-idea-input');
    await expect(quickInput).toBeVisible();
    await expect(quickInput).toHaveAttribute('placeholder', /Captura rápida/);
  });

  test('deve criar uma ideia via quick capture', async ({ page }) => {
    // Digitar no input de quick capture
    const quickInput = page.locator('#quick-idea-input');
    await quickInput.fill('Minha nova ideia de teste');
    
    // Pressionar Enter para criar
    await quickInput.press('Enter');
    
    // Verificar que o input foi limpo
    await expect(quickInput).toHaveValue('');
    
    // Aguardar a ideia aparecer no kanban (coluna Inbox)
    const ideaCard = page.locator('.ideias-kanban-card').filter({ hasText: 'Minha nova ideia de teste' });
    await expect(ideaCard).toBeVisible();
  });

  test('deve mover ideia entre colunas do kanban', async ({ page }) => {
    // Criar uma ideia primeiro
    await page.locator('#quick-idea-input').fill('Ideia para mover');
    await page.locator('#quick-idea-input').press('Enter');
    
    // Aguardar aparecer
    const ideaCard = page.locator('.ideias-kanban-card').filter({ hasText: 'Ideia para mover' }).first();
    await expect(ideaCard).toBeVisible();
    
    // Hover no card para mostrar controles
    await ideaCard.hover();
    
    // Clicar no botão "next" para mover para próxima coluna
    const nextBtn = ideaCard.locator('[data-action="move-next"]');
    await expect(nextBtn).toBeVisible();
    await nextBtn.click();
    
    // Verificar que mudou de coluna (não está mais em Inbox)
    const inboxColumn = page.locator('.column-inbox .ideias-kanban-body');
    await expect(inboxColumn.locator('.ideias-kanban-card').filter({ hasText: 'Ideia para mover' })).not.toBeVisible();
  });

  test('deve excluir uma ideia', async ({ page }) => {
    // Criar uma ideia
    await page.locator('#quick-idea-input').fill('Ideia para excluir');
    await page.locator('#quick-idea-input').press('Enter');
    
    const ideaCard = page.locator('.ideias-kanban-card').filter({ hasText: 'Ideia para excluir' }).first();
    await ideaCard.hover();
    
    // Clicar no botão de excluir
    const deleteBtn = ideaCard.locator('[data-action="delete"]');
    await deleteBtn.click();
    
    // Confirmar no modal de confirmação (se houver)
    // Aguardar um momento para o modal aparecer
    await page.waitForTimeout(200);
    
    // Se houver modal de confirmação, clicar em confirmar
    const confirmBtn = page.locator('button:has-text("Excluir"), button:has-text("Confirmar")');
    if (await confirmBtn.isVisible()) {
      await confirmBtn.click();
    }
    
    // Verificar que não existe mais
    await expect(ideaCard).not.toBeVisible();
  });
});

test.describe('Módulo de Criação - Planejamento', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.click('[data-route="/criacao/planejamento"]');
    await expect(page).toHaveURL('/criacao/planejamento');
  });

  test('deve exibir a view de Planejamento corretamente', async ({ page }) => {
    // Verificar título
    await expect(page.locator('.criacao-planejamento-title')).toContainText('Planejamento');
    
    // Verificar sidebar de templates
    await expect(page.locator('.planejamento-sidebar-header')).toBeVisible();
    
    // Verificar filtros de status
    await expect(page.locator('.criacao-planejamento-filter')).toBeVisible();
  });

  test('deve exibir templates padrão (PREVC)', async ({ page }) => {
    // Verificar que o template PREVC existe na sidebar
    const prevcTemplate = page.locator('.planejamento-template-card').filter({ hasText: 'PREVC' });
    await expect(prevcTemplate).toBeVisible();
  });

  test('deve filtrar planejamentos por status', async ({ page }) => {
    // Clicar no filtro "Pausado"
    await page.click('.planejamento-filter-btn:has-text("Pausado")');
    
    // Verificar que o botão está ativo
    await expect(page.locator('.planejamento-filter-btn:has-text("Pausado")')).toHaveClass(/active/);
  });
});

test.describe('Módulo de Criação - Tarefas de Criação', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.click('[data-route="/criacao"]');
    await expect(page).toHaveURL('/criacao');
  });

  test('deve exibir a view de Tarefas de Criação', async ({ page }) => {
    // Verificar título
    await expect(page.locator('.criacao-title')).toBeVisible();
    
    // Verificar kanban com colunas
    await expect(page.locator('.criacao-kanban')).toBeVisible();
    await expect(page.locator('.criacao-kanban-column')).toHaveCount(4); // Inbox, A Fazer, Em Progresso, Concluído
  });

  test('deve filtrar tarefas por contexto', async ({ page }) => {
    // Selecionar filtro de contexto
    const contextFilter = page.locator('#criacao-context-filter');
    await expect(contextFilter).toBeVisible();
    
    // Selecionar "Dev"
    await contextFilter.selectOption('Dev');
    
    // Verificar que o filtro foi aplicado (value mudou)
    await expect(contextFilter).toHaveValue('Dev');
  });

  test('deve filtrar tarefas por prioridade', async ({ page }) => {
    // Selecionar filtro de prioridade
    const priorityFilter = page.locator('#criacao-priority-filter');
    await expect(priorityFilter).toBeVisible();
    
    // Selecionar "Alta"
    await priorityFilter.selectOption('Alta');
    
    // Verificar que o filtro foi aplicado
    await expect(priorityFilter).toHaveValue('Alta');
  });

  test('deve abrir modal de importação de IA', async ({ page }) => {
    // Clicar no botão "Importar de IA"
    const importBtn = page.locator('button:has-text("Importar de IA")');
    await expect(importBtn).toBeVisible();
    
    // TODO: Implementar quando modal estiver funcionando
    // await importBtn.click();
    // await expect(page.locator('.modal')).toBeVisible();
  });
});

test.describe('Navegação do Módulo de Criação', () => {
  test('deve navegar entre as seções do módulo', async ({ page }) => {
    await page.goto('/');
    
    // Ir para Criação (Tarefas)
    await page.click('[data-route="/criacao"]');
    await expect(page).toHaveURL('/criacao');
    await expect(page.locator('.criacao-title')).toBeVisible();
    
    // Ir para Ideias
    await page.click('[data-route="/criacao/ideias"]');
    await expect(page).toHaveURL('/criacao/ideias');
    await expect(page.locator('.criacao-ideias-title')).toBeVisible();
    
    // Ir para Planejamento
    await page.click('[data-route="/criacao/planejamento"]');
    await expect(page).toHaveURL('/criacao/planejamento');
    await expect(page.locator('.criacao-planejamento-title')).toBeVisible();
  });
});




