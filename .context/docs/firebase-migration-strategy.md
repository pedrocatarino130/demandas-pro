# Estratégia de Migração de Dados - Firebase

> **Status:** Fase 1 - Discovery & Alignment  
> **Data:** Novembro 2025  
> **Owner:** Feature Developer + Database Specialist

## Visão Geral

Este documento descreve a estratégia completa de migração de dados do sistema local (IndexedDB/localStorage) para Firebase Firestore. A migração deve ser segura, reversível e sem perda de dados.

## Objetivos da Migração

1. **Preservar Dados**: Nenhum dado existente deve ser perdido
2. **Reversível**: Possibilidade de rollback se migração falhar
3. **Incremental**: Migrar módulo por módulo para validar cada etapa
4. **Transparente**: Feedback claro ao usuário sobre progresso
5. **Automática**: Executar automaticamente na primeira execução (com possibilidade de cancelar)

## Estrutura de Dados Atual

### IndexedDB (firebase-cache.js)

```javascript
{
  'store-state': {
    tarefas: [...],
    tarefasRotina: [...],
    historico: [...],
    categorias: [...],
    areasEstudo: [...],
    topicosEstudo: [...],
    sessoesEstudo: [...],
    tagsEstudo: [...],
    configEstudos: {...},
    streak: 0,
    conquistas: {...},
    avaliacoesDiarias: [...],
    darkMode: false,
    // ...
  }
}
```

### localStorage (Legado v2)

Chaves identificadas no código:
- `tarefas_projetos_v2`
- `tarefas_rotina_v5`
- `historico_rotina_v5`
- `categorias_rotina_v4`
- `estudos_dados_v2`
- `avaliacoes_diarias_v1`
- `gerenciador_v3_state`

## Estrutura de Dados no Firestore

```
/users/default/
  ├── tarefas/{tarefaId}
  ├── tarefasRotina/{tarefaId}
  ├── historico/{entryId}
  ├── categorias/{categoriaId}
  ├── areasEstudo/{areaId}
  ├── topicosEstudo/{topicoId}
  ├── sessoesEstudo/{sessaoId}
  ├── tagsEstudo/{tagId}
  ├── configEstudos/{configId}
  └── metadados/{metadataId}
```

## Processo de Migração

### Fase 1: Preparação e Backup

```javascript
1. Criar backup completo do IndexedDB
   - Exportar estado completo para JSON
   - Salvar backup no IndexedDB com timestamp
   - Opcional: Permitir download do backup como arquivo

2. Criar backup do localStorage (se existir)
   - Exportar todas as chaves relevantes
   - Salvar no IndexedDB como backup

3. Verificar se Firebase está configurado
   - Testar conexão com Firestore
   - Validar credenciais

4. Verificar se migração já foi executada
   - Checar flag `firestore-migrated` no IndexedDB
   - Se já migrado, pular migração
```

### Fase 2: Migração Incremental por Módulo

A migração será executada módulo por módulo para facilitar validação e rollback:

#### Módulo 1: Tarefas (Projetos)
```javascript
1. Ler dados do IndexedDB: store-state.tarefas
2. Para cada tarefa:
   - Adicionar metadados (_lastModified, _userId)
   - Criar documento no Firestore: /users/default/tarefas/{tarefaId}
3. Validar: Contar documentos criados vs. tarefas originais
4. Se validação OK: Marcar módulo como migrado
```

#### Módulo 2: Tarefas Rotina
```javascript
1. Ler dados: store-state.tarefasRotina
2. Migrar para: /users/default/tarefasRotina/{tarefaId}
3. Validar e marcar como migrado
```

#### Módulo 3: Histórico
```javascript
1. Ler dados: store-state.historico
2. Migrar para: /users/default/historico/{entryId}
3. Validar e marcar como migrado
```

#### Módulo 4: Categorias
```javascript
1. Ler dados: store-state.categorias
2. Migrar para: /users/default/categorias/{categoriaId}
3. Validar e marcar como migrado
```

#### Módulo 5: Estudos
```javascript
1. Ler dados: 
   - store-state.areasEstudo → /users/default/areasEstudo/{areaId}
   - store-state.topicosEstudo → /users/default/topicosEstudo/{topicoId}
   - store-state.sessoesEstudo → /users/default/sessoesEstudo/{sessaoId}
   - store-state.tagsEstudo → /users/default/tagsEstudo/{tagId}
   - store-state.configEstudos → /users/default/configEstudos/default
2. Validar cada sub-módulo
3. Marcar como migrado
```

#### Módulo 6: Metadados e Configurações
```javascript
1. Ler dados:
   - store-state.streak → /users/default/metadados/streak
   - store-state.conquistas → /users/default/metadados/conquistas
   - store-state.avaliacoesDiarias → /users/default/avaliacoesDiarias/{avaliacaoId}
   - store-state.darkMode → /users/default/metadados/ui
2. Migrar e validar
```

### Fase 3: Validação Final

```javascript
1. Comparar contagens:
   - Tarefas migradas vs. originais
   - Tarefas Rotina migradas vs. originais
   - Histórico migrado vs. original
   - etc.

2. Validar integridade:
   - Verificar se IDs foram preservados
   - Verificar se campos obrigatórios estão presentes
   - Verificar se metadados foram adicionados

3. Testar leitura:
   - Ler dados do Firestore
   - Comparar com dados originais

4. Se tudo OK: Marcar migração como completa
```

### Fase 4: Atualização do Store

```javascript
1. Desabilitar salvamento local (temporariamente)
2. Carregar dados do Firestore
3. Atualizar Store com dados do Firestore
4. Configurar listeners real-time
5. Reabilitar salvamento (agora sincronizado com Firebase)
```

## Implementação Técnica

### Estrutura do Script de Migração

```javascript
// migrate-to-firestore.js

class MigrationManager {
  constructor() {
    this.firebaseService = firebaseService;
    this.firebaseCache = firebaseCache;
    this.backupId = null;
    this.progress = {
      current: 0,
      total: 0,
      module: null
    };
  }

  async execute() {
    // Fase 1: Backup
    await this.createBackup();
    
    // Fase 2: Migração
    await this.migrateAllModules();
    
    // Fase 3: Validação
    const isValid = await this.validateMigration();
    
    if (isValid) {
      await this.completeMigration();
    } else {
      await this.rollback();
    }
  }

  async createBackup() { /* ... */ }
  async migrateAllModules() { /* ... */ }
  async validateMigration() { /* ... */ }
  async completeMigration() { /* ... */ }
  async rollback() { /* ... */ }
}
```

### Função de Migração por Módulo

```javascript
async function migrateModule(moduleName, data, collectionPath) {
  const batch = firebaseService.db.batch();
  const batchSize = 500; // Limite do Firestore
  let batchCount = 0;
  let docCount = 0;

  for (const item of data) {
    const docRef = firebaseService.db
      .collection('users')
      .doc('default')
      .collection(collectionPath)
      .doc(item.id || generateId());

    const docData = {
      ...item,
      _lastModified: firebase.firestore.FieldValue.serverTimestamp(),
      _userId: 'default'
    };

    batch.set(docRef, docData, { merge: true });
    batchCount++;
    docCount++;

    // Commit batch quando atingir limite
    if (batchCount >= batchSize) {
      await batch.commit();
      batchCount = 0;
    }
  }

  // Commit batch final
  if (batchCount > 0) {
    await batch.commit();
  }

  return docCount;
}
```

## Interface de Usuário Durante Migração

### Opção 1: Modal de Progresso (Recomendado)

```javascript
// Mostrar modal com:
- Título: "Migrando dados para Firebase..."
- Barra de progresso: X de Y módulos migrados
- Status atual: "Migrando tarefas..."
- Botão "Cancelar" (desabilitado após início)
- Botão "Fazer backup" (antes de iniciar)
```

### Opção 2: Notificação Toast

```javascript
// Para migração rápida (< 5 segundos):
- Toast: "Migrando dados... ⏳"
- Toast: "Migração concluída! ✅"
```

### Opção 3: Híbrida

```javascript
- Se migração rápida (< 5s): Usar Toast
- Se migração lenta (> 5s): Usar Modal com progresso
```

## Tratamento de Erros

### Erro na Migração

```javascript
1. Capturar erro específico
2. Salvar estado de progresso atual
3. Oferecer opções:
   - Retry (tentar novamente)
   - Rollback (reverter para estado anterior)
   - Continuar (migrar módulos restantes)
4. Logar erro detalhado para debugging
```

### Validação Falhou

```javascript
1. Comparar dados originais vs. migrados
2. Identificar discrepâncias
3. Tentar corrigir automaticamente (se possível)
4. Se não conseguir: Oferecer rollback
```

### Conexão Perdida Durante Migração

```javascript
1. Detectar perda de conexão
2. Salvar progresso atual
3. Pausar migração
4. Quando conexão restaurar:
   - Verificar o que já foi migrado
   - Continuar de onde parou
   - Validar integridade
```

## Rollback

### Procedimento de Rollback

```javascript
1. Verificar se backup existe
2. Parar listeners do Firestore
3. Limpar dados do Firestore (opcional - manter como backup)
4. Restaurar dados do IndexedDB a partir do backup
5. Remover flag de migração
6. Reiniciar aplicação em modo local
```

### Quando Fazer Rollback

- Erro crítico durante migração
- Validação falhou e não pode ser corrigida
- Usuário solicitou explicitamente
- Dados corrompidos após migração

## Flags e Metadados

### Flags no IndexedDB

```javascript
{
  'firestore-migration-backup': {
    timestamp: '2025-11-XX...',
    backupId: 'backup-123',
    modules: ['tarefas', 'rotina', ...]
  },
  'firestore-migration-progress': {
    currentModule: 'tarefas',
    completedModules: [],
    failedModules: [],
    startTime: '2025-11-XX...'
  },
  'firestore-migrated': true // Flag final
}
```

## Testes da Migração

### Testes Unitários

```javascript
- Testar migração de cada módulo isoladamente
- Testar validação de dados
- Testar rollback
- Testar tratamento de erros
```

### Testes E2E

```javascript
- Testar migração completa com dados reais
- Testar migração com dados grandes (1000+ itens)
- Testar migração com conexão instável
- Testar rollback completo
```

## Estimativa de Tempo

- **Backup**: < 1 segundo
- **Migração por módulo**: 1-5 segundos (depende do tamanho)
- **Validação**: < 1 segundo
- **Total**: 5-30 segundos (para usuário médio)

## Próximos Passos

1. ✅ Documentar estratégia (este documento)
2. ⏭️ Implementar MigrationManager
3. ⏭️ Implementar função de backup
4. ⏭️ Implementar migração por módulo
5. ⏭️ Implementar validação
6. ⏭️ Implementar UI de progresso
7. ⏭️ Testes unitários e E2E

