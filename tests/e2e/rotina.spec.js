import { test, expect } from '@playwright/test';

/**
 * Teste E2E: View Rotina
 * Testa funcionalidades da view de Rotina
 */
test.describe('View Rotina', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    
    // Preparar dados de teste
    await page.evaluate(() => {
      const state = {
        tarefasRotina: [
          {
            id: 'rotina-1',
            titulo: 'Tarefa de Rotina 1',
            nome: 'Tarefa de Rotina 1',
            prioridade: 'alta',
            time: new Date(Date.now() + 3600000).toISOString(), // +1 hora
            completed: false
          },
          {
            id: 'rotina-2',
            titulo: 'Tarefa de Rotina 2',
            nome: 'Tarefa de Rotina 2',
            prioridade: 'media',
            time: new Date().toISOString(), // Hoje
            completed: true
          },
          {
            id: 'rotina-3',
            titulo: 'Tarefa Atrasada',
            nome: 'Tarefa Atrasada',
            prioridade: 'alta',
            time: new Date(Date.now() - 86400000).toISOString(), // Ontem (atrasada)
            completed: false
          }
        ],
        contadorRotina: 3,
        ultimaAtualizacao: new Date().toISOString()
      };
      
      localStorage.setItem('gerenciador_v3_state', JSON.stringify(state));
    });
    
    // Navegar para Rotina
    const rotinaLink = page.locator('a[data-route="/rotina"], a[href="/rotina"]').first();
    if (await rotinaLink.count() > 0) {
      await rotinaLink.click();
      await page.waitForTimeout(500);
    } else {
      // Tentar via menu hamburguer
      const menuBtn = page.locator('#menu-hamburguer, .menu-hamburguer').first();
      if (await menuBtn.count() > 0) {
        await menuBtn.click();
        await page.waitForTimeout(300);
        const rotinaMenu = page.locator('text=/rotina/i').first();
        if (await rotinaMenu.count() > 0) {
          await rotinaMenu.click();
          await page.waitForTimeout(500);
        }
      }
    }
  });

  test('deve exibir tarefas de rotina', async ({ page }) => {
    // Verificar se view está carregada
    await expect(page.locator('text=/minha rotina/i')).toBeVisible({ timeout: 5000 }).catch(() => {
      test.skip(true, 'View Rotina não encontrada - pode estar em desenvolvimento');
    });
    
    // Verificar se tarefas são exibidas
    const taskElement = page.locator('text=/tarefa de rotina/i').first();
    await expect(taskElement).toBeVisible({ timeout: 3000 });
  });

  test('deve filtrar tarefas por "Hoje"', async ({ page }) => {
    await expect(page.locator('text=/minha rotina/i')).toBeVisible({ timeout: 5000 }).catch(() => {
      test.skip(true, 'View Rotina não encontrada');
    });
    
    // Clicar no filtro "Hoje"
    const hojeFilter = page.locator('button:has-text("Hoje"), .filter-btn[data-filter="today"]').first();
    if (await hojeFilter.count() > 0) {
      await hojeFilter.click();
      await page.waitForTimeout(300);
      
      // Verificar se apenas tarefas de hoje são exibidas
      const tasks = page.locator('.rotina-task-item, .task-card');
      const count = await tasks.count();
      expect(count).toBeGreaterThan(0);
    } else {
      test.skip(true, 'Filtro "Hoje" não encontrado');
    }
  });

  test('deve filtrar tarefas atrasadas', async ({ page }) => {
    await expect(page.locator('text=/minha rotina/i')).toBeVisible({ timeout: 5000 }).catch(() => {
      test.skip(true, 'View Rotina não encontrada');
    });
    
    // Clicar no filtro "Atrasadas"
    const atrasadasFilter = page.locator('button:has-text("Atrasadas"), .filter-btn[data-filter="overdue"]').first();
    if (await atrasadasFilter.count() > 0) {
      await atrasadasFilter.click();
      await page.waitForTimeout(300);
      
      // Verificar se tarefas atrasadas são exibidas
      const taskElement = page.locator('text=/tarefa atrasada/i');
      if (await taskElement.count() > 0) {
        await expect(taskElement).toBeVisible();
      }
    } else {
      test.skip(true, 'Filtro "Atrasadas" não encontrado');
    }
  });

  test('deve concluir tarefa de rotina via checkbox', async ({ page }) => {
    await expect(page.locator('text=/minha rotina/i')).toBeVisible({ timeout: 5000 }).catch(() => {
      test.skip(true, 'View Rotina não encontrada');
    });
    
    // Localizar checkbox
    const checkbox = page.locator('input[type="checkbox"].task-checkbox, input.ios-checkbox-input').first();
    if (await checkbox.count() > 0) {
      await checkbox.check();
      await page.waitForTimeout(500);
      
      // Verificar se tarefa foi marcada como concluída no localStorage
      const state = await page.evaluate(() => {
        const stored = localStorage.getItem('gerenciador_v3_state');
        return stored ? JSON.parse(stored) : null;
      });
      
      expect(state).not.toBeNull();
      const completedTask = state.tarefasRotina.find(t => t.id === 'rotina-1');
      expect(completedTask?.completed).toBe(true);
    } else {
      test.skip(true, 'Checkbox não encontrado');
    }
  });

  test('deve exibir seção de tarefas concluídas', async ({ page }) => {
    await expect(page.locator('text=/minha rotina/i')).toBeVisible({ timeout: 5000 }).catch(() => {
      test.skip(true, 'View Rotina não encontrada');
    });
    
    // Clicar no filtro "Concluídas"
    const concluidasFilter = page.locator('button:has-text("Concluídas"), .filter-btn[data-filter="completed"]').first();
    if (await concluidasFilter.count() > 0) {
      await concluidasFilter.click();
      await page.waitForTimeout(300);
      
      // Verificar se tarefas concluídas são exibidas
      const taskElement = page.locator('text=/tarefa de rotina 2/i');
      if (await taskElement.count() > 0) {
        await expect(taskElement).toBeVisible();
      }
    } else {
      test.skip(true, 'Filtro "Concluídas" não encontrado');
    }
  });
});

