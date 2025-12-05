---
id: plan-implementacao-modulo-criacao
status: active
ai_update_goal: "Implementar o módulo de criação (Ideias, Planejamento PREVC, Tarefas de Criação) desenvolvido no protótipo app-gerenciamento_prototips na aplicação principal de demandas."
required_inputs:
  - "Protótipo funcional em .cursor/app-gerenciamento_prototips/"
  - "Aplicação principal com estrutura React + Vite em src/"
  - "Sistema de rotas existente em src/router.js"
  - "Store e Firebase já configurados"
success_criteria:
  - "Módulo de Ideias (Kanban) totalmente integrado e funcional"
  - "Sistema de Planejamento PREVC com templates implementado"
  - "Tarefas de Criação com contextos funcionando"
  - "Importação de tarefas via IA operacional"
  - "Sincronização com Firebase funcionando para os novos dados"
  - "Testes E2E passando para as novas funcionalidades"
related_agents:
  - "feature-developer"
  - "frontend-specialist"
  - "test-writer"
  - "refactoring-specialist"
---

<!-- agent-update:start:plan-implementacao-modulo-criacao -->
# Plano de Implementação - Módulo de Criação

> Migrar e integrar o sistema completo de gerenciamento criativo (Ideias, Planejamento PREVC, Tarefas de Criação) do protótipo para a aplicação principal, mantendo compatibilidade com a arquitetura existente e adicionando persistência Firebase.

## Task Snapshot
- **Primary goal:** Implementar completamente o módulo de criação na aplicação principal com persistência de dados e integração com a arquitetura existente.
- **Success signal:** Usuários podem criar, editar e gerenciar ideias, planejamentos e tarefas de criação com sincronização em tempo real via Firebase.
- **Key references:**
  - [Protótipo Source](../.cursor/app-gerenciamento_prototips/)
  - [Documentação do Projeto](../docs/README.md)
  - [Plans Index](./README.md)

## Agent Lineup
| Agent | Role in this plan | Playbook | First responsibility focus |
| --- | --- | --- | --- |
| Feature Developer | Implementar as novas views e componentes do módulo de criação | [Feature Developer](../agents/feature-developer.md) | Criar estrutura de arquivos e componentes base |
| Frontend Specialist | Garantir UI/UX consistente e responsiva | [Frontend Specialist](../agents/frontend-specialist.md) | Adaptar estilos para manter coerência com design system |
| Refactoring Specialist | Refatorar código duplicado e otimizar reutilização | [Refactoring Specialist](../agents/refactoring-specialist.md) | Identificar componentes reutilizáveis entre protótipo e app |
| Test Writer | Criar testes E2E para novas funcionalidades | [Test Writer](../agents/test-writer.md) | Escrever specs do Playwright para fluxos críticos |

## Documentation Touchpoints
| Guide | File | Task Marker | Primary Inputs |
| --- | --- | --- | --- |
| Project Overview | [project-overview.md](../docs/project-overview.md) | agent-update:project-overview | Nova seção sobre módulo de criação |
| Architecture Notes | [architecture.md](../docs/architecture.md) | agent-update:architecture-notes | Diagrama de store para novos modelos |
| Development Workflow | [development-workflow.md](../docs/development-workflow.md) | agent-update:development-workflow | Workflow de migração de protótipos |
| Testing Strategy | [testing-strategy.md](../docs/testing-strategy.md) | agent-update:testing-strategy | Cobertura E2E para módulo de criação |

## Risk Assessment

### Identified Risks
| Risk | Probability | Impact | Mitigation Strategy | Owner |
| --- | --- | --- | --- | --- |
| **CRÍTICO: Protótipo é React, App é Vanilla JS** | High | High | Converter componentes React para Vanilla JS seguindo arquitetura existente (Views como classes) | Feature Developer |
| Conflitos de estilo CSS entre protótipo e app principal | High | Medium | Isolar estilos com prefixos específicos, revisar classes duplicadas | Frontend Specialist |
| Incompatibilidade de estrutura de dados com Firebase | Medium | High | Mapear schemas antes da migração, criar converters | Feature Developer |
| Complexidade na conversão de hooks React para Vanilla JS | Medium | High | Usar padrão de classes com lifecycle methods (mount/destroy) | Feature Developer |
| Performance com muitos dados no Kanban | Low | Medium | Implementar virtualização se necessário, limitar items renderizados | Frontend Specialist |

### Dependencies
- **Internal:** 
  - Sistema de rotas em `src/router.js` precisa aceitar novas rotas
  - Store precisa ser expandido para novos tipos de dados (ideas, plannings, templates)
  - Firebase service precisa suportar novas collections
- **External:** 
  - Nenhuma dependência externa nova (lucide-react já presente)
- **Technical:** 
  - React 19.2+ (já presente)
  - Vite como bundler (já configurado)

### Assumptions
- A estrutura atual de store (store.js) pode ser expandida sem breaking changes
- O sistema de autenticação Firebase já existente será reutilizado
- Os usuários da aplicação principal estão familiarizados com conceitos de gerenciamento de tarefas
- Se a estrutura de store precisar de refatoração significativa, será feito incrementalmente

## Resource Estimation

### Time Allocation
| Phase | Estimated Effort | Calendar Time | Team Size |
| --- | --- | --- | --- |
| Phase 1 - Discovery & Setup | 2 person-hours | 1 dia | 1 pessoa |
| Phase 2 - Implementation | 8 person-hours | 2-3 dias | 1-2 pessoas |
| Phase 3 - Testing & Refinement | 4 person-hours | 1-2 dias | 1 pessoa |
| **Total** | **14 person-hours** | **4-6 dias** | **-** |

### Required Skills
- React expertise (hooks, context, state management)
- CSS/Tailwind proficiency
- Firebase Firestore knowledge
- Playwright para testes E2E

### Resource Availability
- **Available:** Developer com conhecimento completo do protótipo e da aplicação
- **Blocked:** Nenhum bloqueio identificado
- **Escalation:** Product Owner caso haja decisões sobre priorização de features

## Working Phases

### Phase 1 — Discovery & Alignment
**Steps**
1. **Audit de Componentes Duplicados** (Owner: Refactoring Specialist)
   - Comparar componentes do protótipo (Modal, TaskCard, NeonButton, etc) com os da app principal
   - Documentar diferenças e decidir qual versão manter
   - Identificar componentes únicos que precisam ser migrados (ComplexSearch do protótipo?)

2. **Mapeamento de Store & Firebase** (Owner: Feature Developer)
   - Desenhar schema Firestore para:
     - `ideas` collection (title, description, context, stage, impact, effort, score, tags, attachments)
     - `plannings` collection (title, objective, deadline, currentStep, status, steps, tags, attachments)
     - `creation-tasks` collection (similar a tasks mas com context e checklist)
     - `templates` collection (name, description, steps, context)
     - `task-templates` collection (name, aiPrompt, context)
   - Criar interfaces TypeScript/JSDoc se necessário

3. **Planejamento de Rotas** (Owner: Frontend Specialist)
   - Adicionar rotas para:
     - `/criacao` - Home do módulo (renderCreationHome)
     - `/criacao/ideias` - Kanban de Ideias
     - `/criacao/planejamento` - PREVC Planning
   - Atualizar Sidebar com nova seção "Criação"

**Commit Checkpoint**
- `git commit -m "docs(plan): complete phase 1 - discovery for creation module"`

### Phase 2 — Implementation & Iteration
**Steps**

1. **Consolidar Componentes Base** (Owner: Refactoring Specialist)
   - Mesclar Modal.jsx (versão do protótipo é mais completa)
   - Mesclar TaskCard.jsx (adicionar suporte a checklist e attachments da versão protótipo)
   - Validar NeonButton, NeonCheckbox estão consistentes
   - Mover componentes únicos (se houver)

2. **Criar Models & Store Extensions** (Owner: Feature Developer)
   - Adicionar ao `src/store.js`:
     ```javascript
     ideas: [],
     plannings: [],
     creationTasks: [],
     templates: [],
     taskTemplates: []
     ```
   - Criar actions: `addIdea`, `updateIdea`, `deleteIdea`, `moveIdeaStage`, etc
   - Implementar persistence helpers em `src/services/firebase-service.js`

3. **Implementar Views de Criação** (Owner: Feature Developer)
   - Criar `src/views/Criacao.js` (Home do módulo)
   - Criar `src/views/CriacaoIdeias.js` (Kanban de Ideias)
   - Criar `src/views/CriacaoPlanejamento.js` (PREVC)
   - Portar lógica de estado do App.jsx do protótipo para as novas views
   - Conectar com store global ao invés de useState local

4. **Integrar Firebase Sync** (Owner: Feature Developer)
   - Adicionar listeners em `src/services/firebase-sync.js` para novas collections
   - Implementar cache strategy similar à existente
   - Adicionar sync status para novos tipos de dados

5. **Atualizar Sidebar & Router** (Owner: Frontend Specialist)
   - Adicionar seção "Criação" na Sidebar com sub-itens
   - Registrar novas rotas em `src/router.js`
   - Adicionar ícones e navegação

6. **Implementar Importação de IA** (Owner: Feature Developer)
   - Garantir modal 'ai-task-import' funciona
   - Adicionar task-templates ao sistema
   - Testar parser de texto para lista de tarefas

**Commit Checkpoint**
- `git commit -m "feat(creation): implement ideas, planning and creation tasks module"`

### Phase 3 — Testing & Refinement
**Steps**

1. **Testes E2E** (Owner: Test Writer)
   - Criar `tests/e2e/criacao-ideias.spec.js`:
     - Captura rápida de ideia
     - Movimentação no Kanban
     - Edição e scoring
   - Criar `tests/e2e/criacao-planejamento.spec.js`:
     - Criação de planejamento com template
     - Navegação entre etapas PREVC
     - Mudança de status (pausar/retomar)
   - Criar `tests/e2e/criacao-tarefas.spec.js`:
     - Criar tarefa com checklist
     - Importar tarefas via IA
     - Filtros por contexto e prioridade

2. **Verificação de Performance** (Owner: Frontend Specialist)
   - Testar Kanban com 50+ ideias
   - Verificar re-renders desnecessários
   - Otimizar se necessário (React.memo, useMemo)

3. **Testes Manuais de UX** (Owner: Frontend Specialist)
   - Testar em mobile (responsividade)
   - Validar animações e transições
   - Verificar estados de loading e erro

4. **Documentação Final** (Owner: Feature Developer)
   - Atualizar README com seção sobre módulo de criação
   - Documentar novos componentes em comments
   - Criar guide de uso do sistema PREVC

**Commit Checkpoint**
- `git commit -m "test(creation): add E2E tests and documentation for creation module"`

## Rollback Plan

### Rollback Triggers
- Firebase sync causando loop infinito ou perda de dados
- Performance degradação crítica (FPS < 30 em operações básicas)
- Bugs bloqueantes que impedem uso de outras funcionalidades
- Testes E2E falhando em mais de 30% dos casos

### Rollback Procedures

#### Phase 1 Rollback
- Action: Descartar branch de feature, reverter commits de documentação
- Data Impact: Nenhum (sem mudanças em produção)
- Estimated Time: < 30 minutos

#### Phase 2 Rollback
- Action: Reverter commits da feature, remover rotas adicionadas, limpar store
- Data Impact: Possível perda de dados de teste em Firebase (collections ideas, plannings)
- Estimated Time: 1-2 horas
- Procedure:
  1. `git revert <commits-range>`
  2. Remover collections Firebase manualmente via console
  3. Rebuild e deploy da versão anterior
  4. Notificar usuários beta (se houver)

#### Phase 3 Rollback
- Action: Rollback completo da feature para versão estável anterior
- Data Impact: Dados criados por usuários em produção podem ser perdidos (fazer backup antes)
- Estimated Time: 2-3 horas
- Procedure:
  1. Export Firestore data: `gcloud firestore export gs://backup-bucket`
  2. Deploy da versão anterior do app
  3. Manter collections no Firebase (dados preservados para retry futuro)
  4. Documentar bugs em GitHub Issues

### Post-Rollback Actions
1. Criar incident report detalhado com logs e screenshots
2. Comunicar stakeholders e usuários afetados
3. Agendar post-mortem em até 48h
4. Atualizar este plano com lessons learned antes de retry
5. Avaliar se é necessário revisitar fase de Discovery

## Evidence & Follow-up

### Artifacts to Collect
- Screenshots/GIFs de cada view funcionando (Ideias, Planejamento, Tarefas)
- Link para PR no GitHub com código review aprovado
- Relatório de cobertura de testes (Playwright test results)
- Logs do Firebase mostrando sync funcionando
- Performance profile (Chrome DevTools) do Kanban com dados
- Documentação final em Markdown

### Follow-up Actions
- **Week 1 post-launch:** Monitorar logs de erro no Firebase/Sentry
- **Week 2 post-launch:** Coletar feedback de usuários beta
- **Month 1:** Revisar métricas de uso (quantas ideias criadas, planejamentos ativos)
- **Q2 2025:** Avaliar expansão (templates da comunidade? integração com IA nativa?)

### Success Metrics
- ✅ 0 erros críticos em 48h pós-deploy
- ✅ > 80% dos testes E2E passando consistentemente
- ✅ Tempo de carregamento do Kanban < 1s com 100 items
- ✅ > 5 usuários criaram pelo menos 1 planejamento na primeira semana
- ✅ Sync Firebase funcionando com latência < 2s

<!-- agent-update:end -->

