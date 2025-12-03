---
id: plan-melhoria-dados-sincronia
ai_update_goal: "Definir e executar melhorias na sincronia de dados, armazenamento, usabilidade e garantir que modais e requisições estejam corretamente configurados."
required_inputs:
  - "Análise da arquitetura atual (Firebase + IndexedDB)"
  - "Mapeamento de todos os modais e formulários"
  - "Métricas de performance e sincronização"
related_agents:
  - "performance-optimizer"
  - "backend-specialist"
  - "frontend-specialist"
  - "architect-specialist"
  - "test-writer"
success_criteria:
  - "Sincronização de dados 40% mais rápida com batching otimizado"
  - "Redução de 60% no uso de espaço de armazenamento com compressão"
  - "100% dos modais validados e funcionando corretamente"
  - "Zero operações perdidas em modo offline"
  - "Feedback visual claro do status de sincronização em todas as telas"
---

<!-- agent-update:start:plan-melhoria-dados-sincronia -->
# Plano de Melhoria: Sincronia de Dados & Armazenamento

> Este plano visa otimizar a arquitetura de sincronização Firebase + IndexedDB, melhorar estratégias de cache, aprimorar a experiência do usuário em modais e formulários, e garantir zero perda de dados em cenários offline/online.

## Task Snapshot
- **Primary goal:** Implementar melhorias críticas em sincronia, armazenamento e usabilidade de dados para garantir um sistema robusto, rápido e confiável.
- **Success signal:** Sistema sincronizando em < 2 segundos, armazenamento otimizado com compressão, todos modais validados, e feedback visual em tempo real para o usuário.
- **Key references:**
  - [Documentation Index](../docs/README.md)
  - [Agent Handbook](../agents/README.md)
  - [Architecture Notes](../docs/architecture.md)

## Agent Lineup
| Agent | Role in this plan | Playbook | First responsibility focus |
| --- | --- | --- | --- |
| Architect Specialist | Revisar arquitetura de sincronização e propor melhorias estruturais | [Architect Specialist](../agents/architect-specialist.md) | Analisar padrões de sincronização Firebase + IndexedDB e identificar gargalos arquiteturais |
| Backend Specialist | Otimizar operações de sincronização e estratégias de retry | [Backend Specialist](../agents/backend-specialist.md) | Implementar batching inteligente e estratégias de compressão para Firestore |
| Frontend Specialist | Melhorar UX de modais, formulários e feedback de sincronização | [Frontend Specialist](../agents/frontend-specialist.md) | Auditar e validar todos os modais (TaskEditModal, ConfirmModal) e adicionar feedback visual |
| Performance Optimizer | Otimizar cache strategy e reduzir latência de operações | [Performance Optimizer](../agents/performance-optimizer.md) | Implementar cache de leitura agressivo e lazy loading para coleções grandes |
| Test Writer | Criar testes para cenários offline/online e validação de dados | [Test Writer](../agents/test-writer.md) | Escrever testes E2E para sincronização offline e consistência de dados |

## Documentation Touchpoints
| Guide | File | Task Marker | Primary Inputs |
| --- | --- | --- | --- |
| Architecture Notes | [architecture.md](../docs/architecture.md) | agent-update:architecture-notes | Diagrama de sincronização, fluxo Firebase↔IndexedDB |
| Data Flow & Integrations | [data-flow.md](../docs/data-flow.md) | agent-update:data-flow | Mapeamento de coleções Firestore, estratégias de cache |
| Testing Strategy | [testing-strategy.md](../docs/testing-strategy.md) | agent-update:testing-strategy | Testes de sincronização offline, validação de modais |
| Tooling & Productivity Guide | [tooling.md](../docs/tooling.md) | agent-update:tooling | Scripts de diagnóstico Firebase, ferramentas de debug |

## Risk Assessment

### Identified Risks
| Risk | Probability | Impact | Mitigation Strategy | Owner |
| --- | --- | --- | --- | --- |
| Perda de dados durante migração de estratégia de cache | Baixa | Alto | Backup automático antes de mudanças, testes extensivos em staging | Backend Specialist |
| Conflitos de sincronização em edições simultâneas | Média | Médio | Implementar timestamps e last-write-wins com notificação ao usuário | Backend Specialist |
| Degradação de performance com filas grandes | Média | Médio | Limitar tamanho de fila, processar em batches, adicionar circuit breaker | Performance Optimizer |
| Modais com validação inconsistente | Baixa | Baixo | Centralizar lógica de validação, criar helper reutilizável | Frontend Specialist |

### Dependencies
- **Internal:** Store.js (gerenciamento de estado), firebase-sync.js (fila de sincronização), firebase-cache.js (IndexedDB)
- **External:** Firebase Firestore (disponibilidade e latência), IndexedDB (suporte do browser)
- **Technical:** 
  - Vite 5.x (build system)
  - idb 8.x (wrapper IndexedDB)
  - Firebase SDK 12.x

### Assumptions
- Firebase Firestore continua disponível e estável (SLA 99.95%)
- Usuários têm browsers modernos com suporte completo a IndexedDB
- Volume de dados por usuário não ultrapassa 50MB (limite razoável para IndexedDB)
- Se Firebase ficar indisponível, sistema continua funcional em modo local apenas

## Resource Estimation

### Time Allocation
| Phase | Estimated Effort | Calendar Time | Team Size |
| --- | --- | --- | --- |
| Phase 1 - Auditoria & Design | 3 person-days | 1 semana | 2 pessoas (Architect + Backend) |
| Phase 2 - Implementação Core | 8 person-days | 2 semanas | 3 pessoas (Backend + Frontend + Performance) |
| Phase 3 - Testes & Validação | 4 person-days | 1 semana | 2 pessoas (Test Writer + Frontend) |
| Phase 4 - Documentação & Handoff | 2 person-days | 3 dias | 1-2 pessoas |
| **Total** | **17 person-days** | **4-5 semanas** | **-** |

### Required Skills
- **Essencial:**
  - Experiência com Firebase Firestore (queries, batching, real-time listeners)
  - Conhecimento profundo de IndexedDB e estratégias de cache
  - JavaScript assíncrono (Promises, async/await, event loops)
  - Testing (Playwright, Jest para testes offline/online)
- **Desejável:**
  - Experiência com PWA e Service Workers
  - Conhecimento de padrões de sincronização (Conflict-free Replicated Data Types)
  - UX para estados de loading e feedback visual

### Resource Availability
- **Available:** Equipe full-stack com conhecimento de Firebase e JavaScript moderno
- **Blocked:** Nenhum bloqueio identificado no momento
- **Escalation:** Pedro (project owner) para decisões arquiteturais críticas

## Working Phases

### Phase 1 — Auditoria & Design (1 semana)

**Objetivos:**
1. Auditar sistema atual de sincronização e identificar gargalos
2. Mapear todos os modais e validar requisições
3. Definir métricas de sucesso e criar plano técnico detalhado

**Steps:**

#### 1.1 Auditoria de Sincronização
**Owner:** Backend Specialist + Architect

- [ ] Analisar `firebase-sync.js`: identificar bottlenecks no processamento de fila
- [ ] Revisar `store.js`: mapear todos os pontos de chamada `saveToFirestore()`
- [ ] Medir tempo médio de sincronização (adicionar métricas de performance)
- [ ] Identificar coleções grandes que causam lentidão (`tarefas`, `historico`, etc.)
- [ ] Documentar fluxo completo: User Action → Store → Firebase Sync → Firestore → Cache

**Deliverables:**
- Relatório de auditoria com gargalos identificados
- Diagrama de fluxo atualizado (Mermaid ou similar)
- Métricas baseline: tempo de sync, tamanho de filas, cache hit rate

#### 1.2 Mapeamento de Modais e Formulários
**Owner:** Frontend Specialist

- [ ] Listar todos os modais do sistema:
  - `TaskEditModal.js` (edição de tarefas em Projetos)
  - `ConfirmModal.js` (confirmações gerais)
  - Modais em Estudos (KanbanEstudos, NotasRapidas, etc.)
  - Modais em Rotina
- [ ] Validar cada modal:
  - Campos obrigatórios estão validados?
  - Feedback de erro está claro?
  - Salvamento está usando Store corretamente?
  - Loading states estão implementados?
- [ ] Identificar inconsistências na validação entre modais
- [ ] Listar requisições críticas (Firebase reads/writes, cache operations)

**Deliverables:**
- Planilha com todos os modais e status de validação
- Lista de inconsistências a corrigir
- Checklist de boas práticas para modais

#### 1.3 Design de Melhorias
**Owner:** Architect Specialist + Performance Optimizer

- [ ] Propor estratégia de batching otimizada (reduzir writes para Firestore)
- [ ] Projetar sistema de compressão para dados grandes (JSON → LZ-string?)
- [ ] Definir cache strategy:
  - Cache-first para leituras
  - Write-through para escritas
  - TTL para invalidação automática
- [ ] Desenhar feedback visual de sincronização (widget já existe, melhorar)
- [ ] Propor melhorias em `SyncStatusWidget.js`

**Deliverables:**
- Documento técnico com propostas de melhoria
- Protótipos de código (POCs) para compressão e batching
- Wireframes/mockups para feedback visual aprimorado

**Commit Checkpoint:**
- Após completar esta fase, criar commit: `chore(plan): fase 1 - auditoria e design concluída`
- Documentar descobertas em `.context/docs/architecture.md` e `.context/docs/data-flow.md`

---

### Phase 2 — Implementação Core (2 semanas)

**Objetivos:**
1. Implementar melhorias em sincronização (batching, compressão)
2. Otimizar armazenamento com estratégias de cache avançadas
3. Corrigir e padronizar todos os modais
4. Adicionar feedback visual de sincronização em tempo real

**Steps:**

#### 2.1 Otimização de Sincronização Firebase
**Owner:** Backend Specialist

**Tarefas:**
- [ ] **Batching Inteligente:** Implementar agrupamento de operações similares
  ```javascript
  // Exemplo: Agrupar 10 updates de tarefas em 1 batch write
  // Em vez de 10 writes individuais → 1 batch write
  ```
  - Modificar `firebase-sync.js` para agrupar operações por coleção
  - Implementar debouncing adicional para operações rápidas
  - Limitar batch size para evitar timeout (max 500 ops por batch)

- [ ] **Compressão de Dados:** Adicionar compressão para coleções grandes
  ```javascript
  // Usar LZ-string ou similar para comprimir JSON antes de salvar no IndexedDB
  import LZString from 'lz-string';
  ```
  - Instalar dependência: `npm install lz-string`
  - Criar wrapper em `firebase-cache.js` para comprimir/descomprimir automaticamente
  - Aplicar apenas para dados > 1KB (evitar overhead)

- [ ] **Estratégia de Retry Melhorada:**
  - Implementar exponential backoff (atualmente é linear)
  - Adicionar circuit breaker: se 5+ falhas consecutivas, pausar sync por 1 min
  - Notificar usuário se fila ultrapassar 50 itens

- [ ] **Otimizar Listeners Real-time:**
  - Revisar `setupRealtimeListeners()` em `store.js`
  - Implementar unsubscribe automático quando usuário sai da tela
  - Adicionar throttling para updates rápidos (evitar re-renders desnecessários)

**Métricas de Sucesso:**
- Tempo de sync médio reduzido em 40%
- Tamanho de armazenamento IndexedDB reduzido em 60%
- Zero timeout errors em batch writes

#### 2.2 Melhorias em Cache e Armazenamento
**Owner:** Performance Optimizer

**Tarefas:**
- [ ] **Cache Strategy Avançada:**
  - Implementar TTL (Time To Live) para entradas de cache
  - Adicionar cache de leitura agressivo: carregar do cache primeiro, depois atualizar do Firestore em background
  - Implementar cache invalidation automática quando dados são editados

- [ ] **Lazy Loading:**
  - Para coleções grandes (`historico`, `sessoesEstudo`), implementar paginação
  - Carregar apenas últimos 30 dias de histórico por padrão
  - Adicionar botão "Carregar mais" para histórico antigo

- [ ] **Limpeza Automática:**
  ```javascript
  // Criar tarefa periódica para limpar dados antigos
  // Ex: Remover histórico > 1 ano do IndexedDB (manter no Firestore)
  ```
  - Adicionar função `cleanOldData()` em `firebase-cache.js`
  - Executar limpeza ao inicializar app (1x por dia)

- [ ] **Monitoramento de Quota:**
  - Verificar quota do IndexedDB e alertar usuário se > 80% usado
  - Adicionar indicador visual de uso de armazenamento nas configurações

**Métricas de Sucesso:**
- Cache hit rate > 85%
- Tempo de carregamento inicial < 1 segundo
- Uso de armazenamento otimizado e monitorado

#### 2.3 Padronização e Correção de Modais
**Owner:** Frontend Specialist

**Tarefas:**
- [ ] **Criar Helper de Validação Centralizado:**
  ```javascript
  // src/utils/form-validation.js
  export const validateForm = (fields, rules) => { ... }
  ```
  - Validar campos obrigatórios
  - Validar formato (email, data, hora)
  - Retornar mensagens de erro padronizadas

- [ ] **Auditar e Corrigir TaskEditModal.js:**
  - ✅ Validação de título (já está implementada)
  - [ ] Adicionar validação de data (não pode ser no passado distante)
  - [ ] Melhorar feedback de salvamento (mostrar spinner durante save)
  - [ ] Garantir que `time` seja salvo corretamente quando fornecido
  - [ ] Testar modo redesign e modo clássico

- [ ] **Auditar ConfirmModal.js:**
  - [ ] Garantir que callbacks são sempre executados
  - [ ] Adicionar opção de loading state
  - [ ] Prevenir múltiplos cliques (debouncing)

- [ ] **Auditar Modais de Estudos:**
  - [ ] Validar formulários em `NotasRapidas.js`
  - [ ] Validar formulários em `KanbanEstudos.js`
  - [ ] Garantir sincronização correta com Store

- [ ] **Feedback Visual Consistente:**
  - [ ] Adicionar classe `.loading` em botões durante salvamento
  - [ ] Mostrar toast de sucesso/erro após cada operação
  - [ ] Usar Toast.js de forma consistente em todos os modais

**Checklist de Validação (aplicar a TODOS os modais):**
- [ ] Campos obrigatórios validados antes de salvar
- [ ] Mensagens de erro claras e visíveis
- [ ] Loading state durante operações assíncronas
- [ ] Toast de confirmação após sucesso
- [ ] Prevenir submit duplo (disabled durante salvamento)
- [ ] Fechar modal apenas após salvamento bem-sucedido
- [ ] ESC para fechar (já implementado em TaskEditModal)

#### 2.4 Feedback Visual de Sincronização
**Owner:** Frontend Specialist + Performance Optimizer

**Tarefas:**
- [ ] **Melhorar SyncStatusWidget.js:**
  - [ ] Adicionar indicador de progresso (X/Y operações sincronizadas)
  - [ ] Mostrar timestamp da última sincronização bem-sucedida
  - [ ] Adicionar botão "Forçar Sincronização"
  - [ ] Indicador visual mais claro:
    - 🟢 Verde: Sincronizado e online
    - 🟡 Amarelo: Sincronizando (mostrar progresso)
    - 🔴 Vermelho: Offline ou erro
    - 🔵 Azul: Modo local apenas (Firebase não configurado)

- [ ] **Adicionar Indicadores em Lista de Tarefas:**
  - [ ] Mostrar ícone de "pendente sincronização" em tarefas recém-criadas
  - [ ] Remover ícone após sincronização bem-sucedida
  - [ ] Tooltip explicando status

- [ ] **Toast de Sincronização:**
  - [ ] Notificar usuário quando volta online e sync é retomado
  - [ ] Alertar se fila de sincronização ultrapassar 25 itens
  - [ ] Mostrar erro se operação falhar após MAX_RETRIES

**Commit Checkpoint:**
- Após completar esta fase, criar commit: `feat(sync): implementa melhorias de sincronização e armazenamento`
- Atualizar documentação técnica em `.context/docs/data-flow.md`

---

### Phase 3 — Testes & Validação (1 semana)

**Objetivos:**
1. Testar cenários offline/online extensivamente
2. Validar consistência de dados
3. Testar todos os modais e formulários
4. Garantir zero perda de dados em edge cases

**Steps:**

#### 3.1 Testes de Sincronização Offline/Online
**Owner:** Test Writer + Backend Specialist

**Tarefas:**
- [ ] **Criar Suite de Testes Playwright:**
  ```javascript
  // tests/sync-offline-online.spec.js
  test('Criar tarefa offline e sincronizar ao voltar online', async ({ page, context }) => {
    // 1. Simular offline (context.setOffline(true))
    // 2. Criar tarefa
    // 3. Verificar que aparece na UI
    // 4. Voltar online (context.setOffline(false))
    // 5. Aguardar sincronização
    // 6. Verificar no Firestore que tarefa foi salva
  });
  ```

- [ ] **Testes de Cenários Críticos:**
  - [ ] Criar 10 tarefas offline → sincronizar em batch
  - [ ] Editar tarefa enquanto sincronização está em progresso
  - [ ] Deletar tarefa que ainda não foi sincronizada
  - [ ] Conflito: Editar mesma tarefa em 2 dispositivos
  - [ ] Fila grande: 50+ operações pendentes
  - [ ] Interromper sincronização no meio (simular crash)

- [ ] **Testes de Consistência:**
  - [ ] Verificar que IndexedDB e Firestore convergem após sync
  - [ ] Garantir que não há duplicatas de dados
  - [ ] Validar que timestamps (_lastModified) são corretos

#### 3.2 Testes de Modais e Formulários
**Owner:** Test Writer + Frontend Specialist

**Tarefas:**
- [ ] **Testes para TaskEditModal:**
  ```javascript
  test('Validação de campo obrigatório (título)', async ({ page }) => {
    // Abrir modal, tentar salvar sem título, verificar erro
  });
  
  test('Salvar tarefa com sucesso e verificar toast', async ({ page }) => {
    // Preencher todos campos, salvar, verificar toast e que modal fecha
  });
  ```

- [ ] **Testes para ConfirmModal:**
  - [ ] Callback de confirmação é executado
  - [ ] Callback de cancelamento é executado
  - [ ] Modal fecha após confirmação

- [ ] **Testes para Modais de Estudos:**
  - [ ] NotasRapidas: criar/editar/deletar nota
  - [ ] KanbanEstudos: criar/mover/deletar card
  - [ ] PomodoroTimer: iniciar/pausar/concluir

- [ ] **Testes de Integração:**
  - [ ] Criar tarefa via modal → verificar em lista → editar → verificar mudanças
  - [ ] Testar modo redesign e modo clássico

#### 3.3 Testes de Performance
**Owner:** Performance Optimizer

**Tarefas:**
- [ ] **Benchmark de Sincronização:**
  - Medir tempo de sync para 10, 50, 100 operações
  - Verificar que não há degradação linear (deve ser sub-linear com batching)

- [ ] **Benchmark de Cache:**
  - Medir tempo de leitura: cache vs Firestore
  - Verificar cache hit rate em uso normal

- [ ] **Teste de Carga:**
  - Simular 1000 tarefas no sistema
  - Verificar performance de carregamento e busca

- [ ] **Lighthouse/WebPageTest:**
  - Rodar Lighthouse e garantir score > 90 em Performance
  - Verificar que não há memory leaks

**Métricas de Validação:**
| Métrica | Target | Como Medir |
| --- | --- | --- |
| Tempo de sync (10 ops) | < 1s | Playwright + performance.now() |
| Tempo de sync (50 ops) | < 3s | Playwright + performance.now() |
| Cache hit rate | > 85% | Logs de firebase-cache.js |
| Carregamento inicial | < 1.5s | Lighthouse |
| Operações perdidas | 0 | Testes offline/online |

**Commit Checkpoint:**
- Após completar esta fase, criar commit: `test(sync): adiciona suite completa de testes de sincronização`
- Documentar estratégia de testes em `.context/docs/testing-strategy.md`

---

### Phase 4 — Documentação & Handoff (3 dias)

**Objetivos:**
1. Documentar todas as melhorias implementadas
2. Criar guias de troubleshooting
3. Treinar equipe nas novas funcionalidades
4. Preparar handoff para manutenção

**Steps:**

#### 4.1 Documentação Técnica
**Owner:** Architect Specialist

**Tarefas:**
- [ ] **Atualizar Architecture.md:**
  - Diagrama de sincronização atualizado
  - Explicar estratégia de batching
  - Documentar compressão de dados
  - Descrever cache strategy

- [ ] **Atualizar Data-Flow.md:**
  - Fluxo detalhado: User Action → Store → Sync Queue → Firestore
  - Tabela de coleções Firestore e suas finalidades
  - Estratégias de retry e circuit breaker

- [ ] **Criar Troubleshooting Guide:**
  ```markdown
  ## Troubleshooting: Sincronização
  
  ### Problema: Fila de sincronização crescendo infinitamente
  **Causa:** Firebase offline ou credenciais inválidas
  **Solução:** 
  1. Verificar console: erros de Firebase Auth?
  2. Verificar `SyncStatusWidget`: status vermelho?
  3. Forçar limpeza de fila: `firebaseSync.clearQueue()`
  
  ### Problema: Dados não sincronizando após voltar online
  ...
  ```

- [ ] **Atualizar README.md:**
  - Seção sobre sincronização offline/online
  - Como verificar status de sincronização
  - Limitações conhecidas

#### 4.2 Guias de Usuário
**Owner:** Frontend Specialist

**Tarefas:**
- [ ] **Criar FAQ de Sincronização:**
  - "Como sei se meus dados estão sincronizados?"
  - "O que acontece se eu ficar offline?"
  - "Posso perder dados?"
  - "Como forçar sincronização?"

- [ ] **Tooltip e Help Text:**
  - Adicionar tooltips no SyncStatusWidget
  - Ajuda contextual em modais (ícone "?" com explicação)

- [ ] **Release Notes:**
  - Listar melhorias implementadas
  - Benefícios para o usuário final
  - Mudanças visíveis na UI

#### 4.3 Handoff e Treinamento
**Owner:** Todo o time

**Tarefas:**
- [ ] **Session de Demo:**
  - Apresentar melhorias para stakeholders
  - Demonstrar cenários offline/online
  - Mostrar feedback visual aprimorado

- [ ] **Code Review:**
  - Revisar todo código novo
  - Garantir que segue padrões do projeto
  - Validar comentários e documentação inline

- [ ] **Deploy Checklist:**
  - [ ] Testes passando (Playwright + Jest)
  - [ ] Lighthouse score > 90
  - [ ] Sem linter errors
  - [ ] README e docs atualizados
  - [ ] Firebase config validada
  - [ ] Backup de dados antes de deploy

**Commit Checkpoint:**
- Após completar esta fase, criar commit: `docs(sync): documenta melhorias de sincronização e armazenamento`
- Tag de release: `v3.1.0-sync-improvements`

---

## Rollback Plan

### Rollback Triggers
- **Crítico:** Perda de dados detectada (usuários reportando tarefas sumidas)
- **Alto:** Sincronização completamente quebrada (nenhum dado sincroniza por > 30 min)
- **Médio:** Performance degradada em > 50% (tempo de sync 2x maior que antes)
- **Baixo:** Bugs em modais que impedem salvamento

### Rollback Procedures

#### Phase 1 Rollback (Auditoria & Design)
- **Action:** Descartar branch, restaurar documentação anterior
- **Data Impact:** Nenhum (sem mudanças em produção)
- **Estimated Time:** < 30 minutos

#### Phase 2 Rollback (Implementação)
- **Action:** 
  1. Revert commits de sync improvements: `git revert <commit-range>`
  2. Restaurar versões anteriores de `firebase-sync.js`, `store.js`, `firebase-cache.js`
  3. Se compressão foi ativada, descomprimir dados do IndexedDB antes de reverter
- **Data Impact:** 
  - Potencial perda de dados em fila de sincronização não processada
  - Necessário forçar sync completo após rollback
- **Estimated Time:** 1-2 horas
- **Procedimento de Dados:**
  ```javascript
  // Script de emergência para forçar sync antes de rollback
  await firebaseSync.sync(); // Processar fila
  await store.forceSave(); // Salvar tudo
  // Aguardar 2 minutos
  // Então fazer rollback
  ```

#### Phase 3 Rollback (Testes)
- **Action:** Revert branch de testes, restaurar suite anterior
- **Data Impact:** Nenhum
- **Estimated Time:** < 1 hora

#### Full Rollback (Produção)
- **Action:**
  1. Deploy de versão anterior (tag de release anterior)
  2. Executar script de migração reversa se necessário
  3. Notificar todos usuários ativos via toast
- **Data Impact:** 
  - Dados criados após last sync podem ser perdidos
  - Recomendado export de dados antes de rollback
- **Estimated Time:** 2-4 horas (incluindo comunicação)

### Post-Rollback Actions
1. **Incident Report:** Documentar causa raiz em `.context/docs/incidents/`
2. **Backup de Dados:** Exportar estado do Firestore e IndexedDB para análise
3. **Post-Mortem:** Reunião com time para entender o que falhou
4. **Fix Forward:** Criar branch `hotfix/` com correção, testar extensivamente
5. **Atualizar Plano:** Adicionar lições aprendidas antes de retry

---

## Checklist de Pré-Deployment

### Código
- [ ] Todos testes passando (100% success rate)
- [ ] Code review aprovado por 2+ membros
- [ ] Sem linter errors ou warnings críticos
- [ ] Documentação inline completa e clara
- [ ] Console logs de debug removidos

### Performance
- [ ] Lighthouse Performance > 90
- [ ] Tempo de sync validado (< 2s para 10 ops)
- [ ] Sem memory leaks (testar com DevTools)
- [ ] Bundle size não aumentou > 10%

### Funcionalidade
- [ ] Todos modais testados manualmente
- [ ] Cenário offline/online validado
- [ ] SyncStatusWidget funcionando corretamente
- [ ] Toast de feedback aparece em todas operações

### Dados
- [ ] Backup do Firestore criado
- [ ] Script de migração testado em staging
- [ ] Rollback plan validado
- [ ] Monitoramento configurado (alertas Firebase)

### Documentação
- [ ] README.md atualizado
- [ ] `.context/docs/` atualizado
- [ ] Release notes preparadas
- [ ] FAQ de troubleshooting criado

---

## Métricas de Sucesso (KPIs)

| Métrica | Baseline (Antes) | Target (Depois) | Como Medir |
| --- | --- | --- | --- |
| Tempo médio de sincronização (10 ops) | ~3s | < 1.5s | Performance API + logs |
| Tempo médio de sincronização (50 ops) | ~8s | < 3s | Performance API + logs |
| Tamanho médio de dados no IndexedDB | 5MB | < 2MB | Storage API |
| Cache hit rate | ~60% | > 85% | Logs de firebase-cache.js |
| Operações perdidas (offline→online) | 2-3% | 0% | Testes E2E |
| Feedback visual de sincronização | Básico | Avançado (progresso + timestamp) | Review UX |
| Erros de validação em modais | 10-15% | < 3% | Analytics + testes |
| User satisfaction (NPS) | TBD | +15 pontos | Survey pós-deployment |

---

## Evidence & Follow-up

### Artifacts to Collect
- [ ] **Logs de Performance:**
  - Screenshots do DevTools Performance
  - Lighthouse reports (antes vs depois)
  - Métricas de sincronização (CSV com tempos)

- [ ] **Screenshots/Videos:**
  - Demo de sincronização offline/online
  - SyncStatusWidget em ação
  - Modais com feedback visual

- [ ] **Code Artifacts:**
  - PRs com diffs das mudanças
  - Cobertura de testes (coverage report)
  - Bundle analyzer report

- [ ] **Documentation:**
  - Architecture diagrams atualizados
  - Data flow diagrams
  - Troubleshooting guide

### Follow-up Actions
- [ ] **1 semana após deploy:** Revisar métricas de performance em produção
- [ ] **2 semanas após deploy:** Coletar feedback de usuários (survey)
- [ ] **1 mês após deploy:** Post-mortem celebration (o que deu certo?)
- [ ] **Contínuo:** Monitorar alertas Firebase e erros de sincronização

### Owners para Manutenção
- **Backend Specialist:** Monitorar fila de sincronização e erros Firebase
- **Frontend Specialist:** Monitorar erros em modais e feedback de usuários
- **Performance Optimizer:** Revisar métricas semanalmente e propor micro-otimizações

---

## Notas Adicionais

### Considerações de Segurança
- [ ] Validar que dados sensíveis não são logados no console
- [ ] Garantir que Firebase rules estão corretas (usuário só acessa seus dados)
- [ ] Adicionar rate limiting se necessário (prevenir spam de writes)

### Acessibilidade
- [ ] Modais são navegáveis por teclado (Tab, Enter, ESC)
- [ ] Feedback visual também tem feedback textual (screen readers)
- [ ] Cores de status seguem WCAG (contraste suficiente)

### Internacionalização (Futuro)
- [ ] Mensagens de erro e feedback estão em português (OK para agora)
- [ ] Preparar para i18n: extrair strings para arquivo separado

---

<!-- agent-readonly:guidance -->
## Agent Playbook Checklist
1. Ler este plano completo antes de começar qualquer fase
2. Seguir ordem das fases (não pular etapas)
3. Criar commits ao final de cada fase
4. Atualizar documentação em `.context/docs/` conforme avança
5. Reportar bloqueios imediatamente ao project owner
6. Validar métricas de sucesso ao final de cada fase

## Emergency Contacts
- **Project Owner:** Pedro
- **Technical Lead:** (TBD)
- **Escalation:** Verificar `.context/docs/project-overview.md` para contatos

---

<!-- agent-update:end -->


