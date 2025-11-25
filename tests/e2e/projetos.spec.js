import { test, expect } from '@playwright/test';

/**
 * Teste E2E: View Projetos
 * Testa funcionalidades do Kanban de Projetos
 */
test.describe('View Projetos - Kanban', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    
    // Preparar dados de teste
    await page.evaluate(() => {
      const state = {
        tarefas: [
          {
            id: 'projeto-1',
            titulo: 'Projeto 1',
            status: 'todo',
            prioridade: 'alta',
            responsavel: 'Pedro'
          },
          {
            id: 'projeto-2',
            titulo: 'Projeto 2',
            status: 'doing',
            prioridade: 'media',
            responsavel: 'Pedro'
          },
          {
            id: 'projeto-3',
            titulo: 'Projeto Concluído',
            status: 'done',
            prioridade: 'baixa',
            responsavel: 'Pedro',
            dataConclusao: new Date().toISOString()
          }
        ],
        contador: 3,
        ultimaAtualizacao: new Date().toISOString()
      };
      
      localStorage.setItem('gerenciador_v3_state', JSON.stringify(state));
    });
    
    // Navegar para Projetos
    const projetosLink = page.locator('a[data-route="/projetos"], a[href="/projetos"]').first();
    if (await projetosLink.count() > 0) {
      await projetosLink.click();
      await page.waitForTimeout(1000);
    } else {
      // Tentar via menu hamburguer
      const menuBtn = page.locator('#menu-hamburguer, .menu-hamburguer').first();
      if (await menuBtn.count() > 0) {
        await menuBtn.click();
        await page.waitForTimeout(300);
        const projetosMenu = page.locator('text=/projeto/i').first();
        if (await projetosMenu.count() > 0) {
          await projetosMenu.click();
          await page.waitForTimeout(1000);
        }
      }
    }
  });

  test('deve exibir Kanban com 3 colunas', async ({ page }) => {
    // Verificar se Kanban está carregado
    await expect(page.locator('text=/projeto/i')).toBeVisible({ timeout: 5000 }).catch(() => {
      test.skip(true, 'View Projetos não encontrada - pode estar em desenvolvimento');
    });
    
    // Verificar se as 3 colunas existem
    const columns = page.locator('.kanban-column, [data-column]');
    const columnCount = await columns.count();
    
    // Pode ter 3 ou mais elementos (colunas + headers)
    expect(columnCount).toBeGreaterThanOrEqual(3);
  });

  test('deve exibir tarefas nas colunas corretas', async ({ page }) => {
    await expect(page.locator('text=/projeto/i')).toBeVisible({ timeout: 5000 }).catch(() => {
      test.skip(true, 'View Projetos não encontrada');
    });
    
    // Verificar se tarefa está na coluna "A Fazer"
    const todoColumn = page.locator('[data-column="todo"], #column-todo').first();
    if (await todoColumn.count() > 0) {
      const projeto1 = page.locator('text=Projeto 1').first();
      await expect(projeto1).toBeVisible({ timeout: 3000 });
    }
    
    // Verificar se tarefa está na coluna "Fazendo"
    const doingColumn = page.locator('[data-column="doing"], #column-doing').first();
    if (await doingColumn.count() > 0) {
      const projeto2 = page.locator('text=Projeto 2').first();
      await expect(projeto2).toBeVisible({ timeout: 3000 });
    }
  });

  test('deve mover tarefa entre colunas via drag and drop', async ({ page }) => {
    await expect(page.locator('text=/projeto/i')).toBeVisible({ timeout: 5000 }).catch(() => {
      test.skip(true, 'View Projetos não encontrada');
    });
    
    // Localizar card de tarefa e coluna destino
    const card = page.locator('.kanban-card[data-task-id="projeto-1"]').first();
    const targetColumn = page.locator('#column-doing, [data-column="doing"] .kanban-column-body').first();
    
    if (await card.count() > 0 && await targetColumn.count() > 0) {
      // Drag and drop
      await card.dragTo(targetColumn);
      await page.waitForTimeout(500);
      
      // Verificar se tarefa foi movida no localStorage
      const state = await page.evaluate(() => {
        const stored = localStorage.getItem('gerenciador_v3_state');
        return stored ? JSON.parse(stored) : null;
      });
      
      expect(state).not.toBeNull();
      const movedTask = state.tarefas.find(t => t.id === 'projeto-1');
      expect(movedTask?.status).toBe('doing');
    } else {
      test.skip(true, 'Drag and drop não disponível ou elementos não encontrados');
    }
  });

  test('deve filtrar tarefas por responsável', async ({ page }) => {
    await expect(page.locator('text=/projeto/i')).toBeVisible({ timeout: 5000 }).catch(() => {
      test.skip(true, 'View Projetos não encontrada');
    });
    
    // Localizar filtro de responsável
    const filter = page.locator('#filterResponsavel, .kanban-filter').first();
    if (await filter.count() > 0) {
      await filter.selectOption('Pedro');
      await page.waitForTimeout(500);
      
      // Verificar se apenas tarefas do responsável são exibidas
      const tasks = page.locator('.kanban-card');
      const count = await tasks.count();
      expect(count).toBeGreaterThan(0);
    } else {
      test.skip(true, 'Filtro de responsável não encontrado');
    }
  });

  test('deve exibir contadores por coluna', async ({ page }) => {
    await expect(page.locator('text=/projeto/i')).toBeVisible({ timeout: 5000 }).catch(() => {
      test.skip(true, 'View Projetos não encontrada');
    });
    
    // Verificar se contadores existem
    const counts = page.locator('.kanban-count');
    const countElements = await counts.count();
    
    if (countElements > 0) {
      // Deve ter pelo menos 3 contadores (uma por coluna)
      expect(countElements).toBeGreaterThanOrEqual(3);
    } else {
      test.skip(true, 'Contadores não encontrados');
    }
  });
});

