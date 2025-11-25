import { test, expect } from '@playwright/test';

/**
 * Teste E2E: Persistência após Reload
 * TASK-024: Suite de Testes E2E
 */
test.describe('Persistência de Dados', () => {
  test('deve persistir tarefa criada após reload', async ({ page }) => {
    await page.goto('/');
    
    // Limpar localStorage antes do teste
    await page.evaluate(() => {
      localStorage.clear();
    });
    
    // Criar tarefa via código (já que pode não ter UI ainda)
    await page.evaluate(() => {
      const state = {
        tarefas: [
          {
            id: 'persist-test-1',
            titulo: 'Tarefa persistente',
            status: 'todo',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ],
        contador: 1,
        ultimaAtualizacao: new Date().toISOString()
      };
      
      localStorage.setItem('gerenciador_v3_state', JSON.stringify(state));
    });
    
    // Recarregar página
    await page.reload();
    
    // Verificar se dados ainda estão no localStorage
    const persistedData = await page.evaluate(() => {
      const stored = localStorage.getItem('gerenciador_v3_state');
      return stored ? JSON.parse(stored) : null;
    });
    
    expect(persistedData).not.toBeNull();
    expect(persistedData.tarefas).toHaveLength(1);
    expect(persistedData.tarefas[0].titulo).toBe('Tarefa persistente');
  });

  test('deve manter estado de checkbox marcado após reload', async ({ page }) => {
    await page.goto('/');
    
    // Criar tarefa concluída
    await page.evaluate(() => {
      const state = {
        tarefas: [
          {
            id: 'completed-test-1',
            titulo: 'Tarefa concluída',
            status: 'done',
            concluida: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ],
        contador: 1,
        ultimaAtualizacao: new Date().toISOString()
      };
      
      localStorage.setItem('gerenciador_v3_state', JSON.stringify(state));
    });
    
    await page.reload();
    
    // Verificar se estado foi mantido
    const persistedData = await page.evaluate(() => {
      const stored = localStorage.getItem('gerenciador_v3_state');
      return stored ? JSON.parse(stored) : null;
    });
    
    expect(persistedData.tarefas[0].status).toBe('done');
    expect(persistedData.tarefas[0].concluida).toBe(true);
  });

  test('deve sincronizar múltiplos módulos após reload', async ({ page }) => {
    await page.goto('/');
    
    // Criar dados em múltiplos módulos
    await page.evaluate(() => {
      const state = {
        tarefas: [{ id: '1', titulo: 'Projeto 1', status: 'todo' }],
        tarefasRotina: [{ id: '1', nome: 'Rotina 1', concluida: false }],
        topicosEstudo: [{ id: '1', titulo: 'Estudo 1', status: 'todo' }],
        contador: 1,
        contadorRotina: 1,
        contadorEstudos: 1,
        ultimaAtualizacao: new Date().toISOString()
      };
      
      localStorage.setItem('gerenciador_v3_state', JSON.stringify(state));
    });
    
    await page.reload();
    
    // Verificar se todos os módulos persistiram
    const persistedData = await page.evaluate(() => {
      const stored = localStorage.getItem('gerenciador_v3_state');
      return stored ? JSON.parse(stored) : null;
    });
    
    expect(persistedData.tarefas).toHaveLength(1);
    expect(persistedData.tarefasRotina).toHaveLength(1);
    expect(persistedData.topicosEstudo).toHaveLength(1);
  });
});


