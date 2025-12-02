# Arquitetura de Sincronização Firebase

> **Status:** ✅ Implementação Completa  
> **Data de Conclusão:** Novembro 2023  
> **Última Atualização:** Novembro 2023

## Visão Geral

Este documento define a arquitetura de sincronização Firebase Firestore para o Gerenciador Pedro v3.0. O sistema implementa uma abordagem **offline-first** com cache local em IndexedDB e sincronização bidirecional com Firestore.

## Princípios Arquiteturais

1. **Offline-First**: Sistema funciona completamente offline, sincronizando quando online
2. **Cache Local**: IndexedDB como fonte primária de verdade local
3. **Sincronização Bidirecional**: Mudanças locais e remotas são sincronizadas
4. **Last-Write-Wins**: Estratégia de resolução de conflitos baseada em timestamps
5. **Fila de Sincronização**: Operações offline são enfileiradas e processadas quando online

## Componentes Principais

### 1. Firebase Service (`src/services/firebase-service.js`)

Serviço de baixo nível para interação com Firestore.

**Responsabilidades:**
- CRUD básico de documentos
- Queries e filtros
- Batch operations
- Listeners real-time

**Métodos Principais:**
- `getDocument(collection, docId)` - Buscar documento
- `setDocument(collection, docId, data, merge)` - Criar/atualizar documento
- `updateDocument(collection, docId, updates)` - Atualizar campos específicos
- `deleteDocument(collection, docId)` - Deletar documento
- `getCollection(collection, filters, orderBy)` - Buscar coleção com filtros
- `batchWrite(operations)` - Operações em lote
- `subscribeToDocument(collection, docId, callback)` - Listener real-time de documento
- `subscribeToCollection(collection, callback, filters)` - Listener real-time de coleção

### 2. Firebase Sync (`src/services/firebase-sync.js`)

Gerenciador de sincronização offline/online.

**Responsabilidades:**
- Detecção de status online/offline
- Fila de sincronização persistente (IndexedDB)
- Processamento de fila quando online
- Retry logic para falhas
- Notificação de status de sincronização

**Estrutura da Fila:**
```javascript
{
  id: 'unique-operation-id',
  type: 'CREATE' | 'UPDATE' | 'DELETE',
  collection: 'tarefas',
  docId: 'doc-id',
  data: { ... },
  timestamp: '2023-11-XX...',
  retries: 0,
  status: 'PENDING' | 'SYNCING' | 'FAILED'
}
```

**Métodos Principais:**
- `addToQueue(operation)` - Adicionar operação à fila
- `sync()` - Processar fila de sincronização
- `getOnlineStatus()` - Verificar status online/offline
- `hasPendingOperations()` - Verificar se há operações pendentes
- `subscribe(callback)` - Notificar mudanças de status

### 3. Firebase Cache (`src/services/firebase-cache.js`)

Cache local usando IndexedDB (já implementado).

**Responsabilidades:**
- Armazenamento persistente local
- Cache de estado completo
- Cache de documentos individuais
- Fallback quando offline

### 4. Store (`src/store/store.js`)

Estado global integrado com sincronização.

**Modificações Necessárias:**
- Integração com Firebase Service quando online
- Uso de Firebase Sync para operações
- Manter compatibilidade com código existente
- Sincronização automática após mudanças

## Schema do Firestore

### Estrutura de Coleções

```
/users/{userId}/
  ├── tarefas/{tarefaId}
  ├── tarefasRotina/{tarefaId}
  ├── historico/{entryId}
  ├── categorias/{categoriaId}
  ├── areasEstudo/{areaId}
  ├── topicosEstudo/{topicoId}
  ├── sessoesEstudo/{sessaoId}
  ├── tagsEstudo/{tagId}
  └── config/{configId}
```

**Nota:** Para MVP inicial, usar `userId = 'default'` (single-user). Suporte multi-usuário será adicionado futuramente.

### Estrutura de Documentos

#### Tarefas (Projetos)
```javascript
{
  id: 'string',
  titulo: 'string',
  descricao: 'string',
  status: 'a-fazer' | 'fazendo' | 'feito',
  prioridade: 'baixa' | 'media' | 'alta' | 'urgente',
  dataCriacao: Timestamp,
  dataConclusao: Timestamp | null,
  _lastModified: Timestamp, // Para resolução de conflitos
  _userId: 'default' // Para futura autenticação
}
```

#### Tarefas Rotina
```javascript
{
  id: 'string',
  titulo: 'string',
  categoria: 'string',
  frequencia: 'diaria' | 'semanal' | 'mensal',
  dataUltimaExecucao: Timestamp | null,
  _lastModified: Timestamp,
  _userId: 'default'
}
```

#### Histórico
```javascript
{
  id: 'string',
  tarefaId: 'string',
  dataExecucao: Timestamp,
  _lastModified: Timestamp,
  _userId: 'default'
}
```

**Padrão de Metadados:**
- Todos os documentos incluem `_lastModified: Timestamp` (serverTimestamp)
- Todos os documentos incluem `_userId: string` para futura autenticação
- IDs são gerados no cliente (UUID ou similar)

## Fluxo de Sincronização

### 1. Escrita Local (Offline)

```
1. Usuário faz alteração (ex: criar tarefa)
   ↓
2. Store atualiza estado local
   ↓
3. IndexedDB salva estado (imediato)
   ↓
4. Firebase Sync adiciona operação à fila
   ↓
5. Se offline: operação fica na fila
   Se online: tenta sincronizar imediatamente
```

### 2. Sincronização Online

```
1. Firebase Sync detecta conexão restaurada
   ↓
2. Carrega fila de operações do IndexedDB
   ↓
3. Para cada operação pendente:
   - Tenta aplicar no Firestore
   - Se sucesso: remove da fila
   - Se falha: incrementa retries, mantém na fila
   ↓
4. Notifica UI sobre status de sincronização
```

### 3. Leitura Remota (Online)

```
1. Store solicita dados
   ↓
2. Se online: busca do Firestore + atualiza IndexedDB
   Se offline: busca do IndexedDB apenas
   ↓
3. Store atualiza estado local
   ↓
4. Notifica subscribers
```

### 4. Listeners Real-Time

```
1. Store configura listeners do Firestore (quando online)
   ↓
2. Quando documento/coleção muda no Firestore:
   - Listener recebe mudança
   - Atualiza IndexedDB local
   - Atualiza Store
   - Notifica subscribers
   ↓
3. Conflitos são resolvidos por last-write-wins (_lastModified)
```

## Resolução de Conflitos

### Estratégia: Last-Write-Wins

1. **Timestamps**: Todos os documentos usam `serverTimestamp()` para `_lastModified`
2. **Comparação**: Ao receber mudança remota, comparar `_lastModified`
3. **Decisão**: Documento com timestamp mais recente prevalece
4. **Merge**: Para atualizações parciais, fazer merge de campos não conflitantes

### Exemplo de Conflito

```
Dispositivo A (offline):
  - Edita tarefa às 10:00 (local)
  - Sincroniza às 11:00
  - _lastModified = 11:00

Dispositivo B (online):
  - Edita mesma tarefa às 10:30 (remote)
  - _lastModified = 10:30

Resultado: Dispositivo A prevalece (11:00 > 10:30)
```

### Limitações

- **Perda de dados**: Mudanças mais antigas podem ser sobrescritas
- **Single-user**: Assumindo um usuário por vez ou aceitação de sobrescrita
- **Futuro**: Pode implementar 3-way merge ou merge manual se necessário

## Performance e Otimizações

### 1. Sincronização Incremental

- Sincronizar apenas documentos modificados desde última sync
- Usar `_lastModified` para queries incrementais

### 2. Batch Operations

- Agrupar múltiplas operações em batch writes
- Reduzir número de round-trips ao Firestore

### 3. Paginação

- Para coleções grandes, implementar paginação
- Carregar dados sob demanda

### 4. Índices

Criar índices compostos no Firestore:
- `tarefas`: `[_userId, status, _lastModified]`
- `tarefasRotina`: `[_userId, categoria, _lastModified]`
- `historico`: `[_userId, dataExecucao]`

## Segurança

### Regras de Segurança Firestore

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir acesso apenas aos próprios dados do usuário
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Para MVP single-user (default): acesso permissivo para desenvolvimento
    match /users/default/{document=**} {
      allow read, write: if true; // Em produção, integrar autenticação e restringir ao usuário autenticado
    }
  }
}
```

**Nota:** Para MVP, usar regras permissivas com `userId = 'default'`. Em produção, integrar autenticação Firebase e ativar restrições baseadas em UID.

## Migração de Dados

### Estratégia de Migração

1. **Backup**: Criar backup completo do IndexedDB/localStorage antes de migrar
2. **Migração Incremental**: Migrar módulo por módulo (tarefas, rotina, estudos)
3. **Validação**: Verificar integridade dos dados após migração
4. **Rollback**: Manter backup para possível reversão

### Processo de Migração

```
1. Usuário acessa aplicação
   ↓
2. Sistema detecta que migração não foi feita
   ↓
3. Cria backup do IndexedDB/localStorage
   ↓
4. Para cada módulo:
   - Lê dados do IndexedDB
   - Cria documentos no Firestore
   - Marca como migrado
   ↓
5. Atualiza Store com dados do Firestore
   ↓
6. Marca migração como completa
```

## Monitoramento e Logs

### Métricas a Monitorar

- Taxa de sucesso de sincronização
- Número de operações pendentes na fila
- Latência de sincronização
- Erros de sincronização
- Uso de quota do Firestore

### Logs

- Todas as operações de sincronização devem ser logadas
- Erros devem incluir contexto suficiente para debugging
- Status de sincronização deve ser visível na UI

## Questões Abertas

1. **Autenticação**: Single-user (default) ou multi-usuário desde o início?
2. **Limites de Dados**: Quantas tarefas/projetos por usuário? (para otimização)
3. **Particionamento**: Uma coleção por módulo ou estrutura flat?
4. **Frequência de Sync**: Real-time ou batch periódico?
5. **Offline First**: Qual é o limite de dados offline? (para IndexedDB)

## Próximos Passos

1. ✅ Definir arquitetura (este documento)
2. ✅ Implementar Firebase Service
3. ✅ Implementar Firebase Sync
4. ✅ Integrar com Store
5. ✅ Implementar migração de dados
6. ✅ Testes E2E de sincronização
