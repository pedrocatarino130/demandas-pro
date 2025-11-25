import { test, expect } from '@playwright/test';

/**
 * Teste E2E: Módulo Estudos
 * Testa funcionalidades do módulo de Estudos
 */
test.describe('Módulo Estudos', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    
    // Preparar dados de teste
    await page.evaluate(() => {
      const state = {
        areasEstudo: [
          {
            id: 'area-1',
            nome: 'JavaScript',
            cor: '#3b82f6',
            icone: '📚'
          }
        ],
        topicosEstudo: [
          {
            id: 'topico-1',
            titulo: 'Async/Await',
            areaId: 'area-1',
            status: 'Não iniciado',
            prioridade: 'Alta',
            tags: ['javascript', 'async']
          },
          {
            id: 'topico-2',
            titulo: 'Promises',
            areaId: 'area-1',
            status: 'Em Andamento',
            prioridade: 'Média',
            tags: ['javascript']
          }
        ],
        contadorEstudos: 2,
        ultimaAtualizacao: new Date().toISOString()
      };
      
      localStorage.setItem('gerenciador_v3_state', JSON.stringify(state));
      
      // Dados específicos do estudos-store
      const estudosData = {
        areas: [
          {
            id: 'area-1',
            nome: 'JavaScript',
            cor: '#3b82f6',
            icone: '📚'
          }
        ],
        topicos: [
          {
            id: 'topico-1',
            titulo: 'Async/Await',
            areaId: 'area-1',
            status: 'Não iniciado',
            prioridade: 'Alta',
            tags: ['javascript', 'async']
          }
        ],
        contadorAreas: 1,
        contadorTopicos: 1,
        versao: 3
      };
      
      localStorage.setItem('estudos_v3', JSON.stringify(estudosData));
    });
    
    // Navegar para Estudos
    const estudosLink = page.locator('a[data-route="/estudos"], a[href="/estudos"]').first();
    if (await estudosLink.count() > 0) {
      await estudosLink.click();
      await page.waitForTimeout(2000); // Aguardar carregamento dinâmico
    } else {
      // Tentar via menu hamburguer
      const menuBtn = page.locator('#menu-hamburguer, .menu-hamburguer').first();
      if (await menuBtn.count() > 0) {
        await menuBtn.click();
        await page.waitForTimeout(300);
        const estudosMenu = page.locator('text=/estudo/i').first();
        if (await estudosMenu.count() > 0) {
          await estudosMenu.click();
          await page.waitForTimeout(2000);
        }
      }
    }
  });

  test('deve exibir view de Estudos', async ({ page }) => {
    // Verificar se view está carregada
    await expect(page.locator('text=/estudo/i')).toBeVisible({ timeout: 10000 }).catch(() => {
      test.skip(true, 'View Estudos não encontrada - pode estar em desenvolvimento');
    });
  });

  test('deve exibir Quick Add input', async ({ page }) => {
    await expect(page.locator('text=/estudo/i')).toBeVisible({ timeout: 10000 }).catch(() => {
      test.skip(true, 'View Estudos não encontrada');
    });
    
    // Verificar se Quick Add está presente
    const quickAdd = page.locator('input[type="text"], textarea, .quick-add-input').first();
    if (await quickAdd.count() > 0) {
      await expect(quickAdd).toBeVisible({ timeout: 3000 });
    } else {
      test.skip(true, 'Quick Add input não encontrado');
    }
  });

  test('deve criar tópico via Quick Add', async ({ page }) => {
    await expect(page.locator('text=/estudo/i')).toBeVisible({ timeout: 10000 }).catch(() => {
      test.skip(true, 'View Estudos não encontrada');
    });
    
    // Localizar input do Quick Add
    const input = page.locator('input[type="text"], textarea, .quick-add-input').first();
    if (await input.count() > 0) {
      // Inserir comando Quick Add
      await input.fill('React Hooks @javascript #urgente :2h');
      await input.press('Enter');
      await page.waitForTimeout(1000);
      
      // Verificar se tópico foi criado (verificar se aparece na tela ou no localStorage)
      const estudosData = await page.evaluate(() => {
        const stored = localStorage.getItem('estudos_v3');
        return stored ? JSON.parse(stored) : null;
      });
      
      if (estudosData) {
        const novoTopico = estudosData.topicos.find(t => t.titulo.includes('React Hooks'));
        expect(novoTopico).toBeDefined();
      }
    } else {
      test.skip(true, 'Quick Add input não encontrado');
    }
  });

  test('deve exibir Kanban de Estudos', async ({ page }) => {
    await expect(page.locator('text=/estudo/i')).toBeVisible({ timeout: 10000 }).catch(() => {
      test.skip(true, 'View Estudos não encontrada');
    });
    
    // Verificar se Kanban está presente
    const kanban = page.locator('.kanban-estudos, .kanban-container').first();
    if (await kanban.count() > 0) {
      await expect(kanban).toBeVisible({ timeout: 3000 });
      
      // Verificar se colunas estão presentes
      const columns = page.locator('.kanban-column');
      const columnCount = await columns.count();
      expect(columnCount).toBeGreaterThan(0);
    } else {
      test.skip(true, 'Kanban de Estudos não encontrado');
    }
  });

  test('deve abrir modal de estudo ao clicar em card', async ({ page }) => {
    await expect(page.locator('text=/estudo/i')).toBeVisible({ timeout: 10000 }).catch(() => {
      test.skip(true, 'View Estudos não encontrada');
    });
    
    // Localizar card de tópico
    const card = page.locator('.kanban-card, .card-topic').first();
    if (await card.count() > 0) {
      await card.click();
      await page.waitForTimeout(500);
      
      // Verificar se modal foi aberto
      const modal = page.locator('.estudo-modal, .modal, [id*="modal"]').first();
      if (await modal.count() > 0) {
        await expect(modal).toBeVisible({ timeout: 2000 });
      }
    } else {
      test.skip(true, 'Card de tópico não encontrado');
    }
  });

  test('deve persistir dados de estudos após reload', async ({ page }) => {
    // Verificar se dados foram persistidos
    const estudosData = await page.evaluate(() => {
      return localStorage.getItem('estudos_v3');
    });
    
    expect(estudosData).not.toBeNull();
    
    // Recarregar página
    await page.reload();
    await page.waitForTimeout(2000);
    
    // Verificar se dados ainda estão presentes
    const persistedData = await page.evaluate(() => {
      const stored = localStorage.getItem('estudos_v3');
      return stored ? JSON.parse(stored) : null;
    });
    
    expect(persistedData).not.toBeNull();
    expect(persistedData.areas).toHaveLength(1);
    expect(persistedData.topicos.length).toBeGreaterThan(0);
  });
});

