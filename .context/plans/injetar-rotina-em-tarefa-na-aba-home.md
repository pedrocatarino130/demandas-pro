---
id: plan-injetar-rotina-em-tarefa-na-aba-home
ai_update_goal: "Define the stages, owners, and evidence required to complete Injetar Rotina Em Tarefa Na Aba Home."
required_inputs:
  - "Task summary or issue link describing the goal"
  - "Relevant documentation sections from docs/README.md"
  - "Matching agent playbooks from agents/README.md"
success_criteria:
  - "Stages list clear owners, deliverables, and success signals"
  - "Plan references documentation and agent resources that exist today"
  - "Follow-up actions and evidence expectations are recorded"
related_agents:
  - "feature-developer"
  - "frontend-specialist"
  - "code-reviewer"
  - "test-writer"
---

<!-- agent-update:start:plan-injetar-rotina-em-tarefa-na-aba-home -->
# Injetar Rotina Em Tarefa Na Aba Home Plan

> Implementar funcionalidade para transformar itens de rotina em tarefas do Home, permitindo converter tarefas recorrentes em tarefas pontuais gerenciáveis na aba Home.

## Task Snapshot
- **Primary goal:** Adicionar ação nos cards de tarefas de rotina (Rotina.js) que permite injetar/copiar a tarefa para a lista de tarefas do Home (tarefasHome), convertendo tarefas recorrentes em tarefas pontuais.
- **Success signal:**
  - Botão "Adicionar ao Home" visível em cada TaskCard na view Rotina
  - Ao clicar, tarefa é copiada para tarefasHome mantendo informações (título, descrição, prioridade, data/hora)
  - Tarefa aparece na aba Home imediatamente
  - Toast de confirmação exibido ao usuário
  - Não há duplicação de IDs (novo ID gerado para tarefa no Home)
- **Key references:**
  - [Home.js](../../src/views/Home.js) - View de destino onde tarefas serão injetadas
  - [Rotina.js](../../src/views/Rotina.js) - View de origem com tarefas de rotina
  - [TaskCard.js](../../src/components/TaskCard.js) - Componente que precisa do novo botão de ação
  - [store.js](../../src/store.js) - Sistema de estado global (tarefasRotina → tarefasHome)

## Agent Lineup
| Agent | Role in this plan | Playbook | First responsibility focus |
| --- | --- | --- | --- |
| Feature Developer | Implementar nova funcionalidade de injeção de tarefas | [Feature Developer](../agents/feature-developer.md) | Adicionar método de injeção e integração entre views |
| Frontend Specialist | Garantir UX/UI consistente com design cyberpunk | [Frontend Specialist](../agents/frontend-specialist.md) | Criar botão de ação no TaskCard e feedback visual |
| Code Reviewer | Revisar implementação e padrões de código | [Code Reviewer](../agents/code-reviewer.md) | Verificar consistência com arquitetura existente |
| Test Writer | Criar testes para validar funcionalidade | [Test Writer](../agents/test-writer.md) | Testar fluxo completo de injeção de tarefas |

## Documentation Touchpoints
| Guide | File | Task Marker | Primary Inputs |
| --- | --- | --- | --- |
| Project Overview | [project-overview.md](../docs/project-overview.md) | agent-update:project-overview | Roadmap, README, stakeholder notes |
| Architecture Notes | [architecture.md](../docs/architecture.md) | agent-update:architecture-notes | Store pattern, view communication |

## Risk Assessment
Identify potential blockers, dependencies, and mitigation strategies before beginning work.

### Identified Risks
| Risk | Probability | Impact | Mitigation Strategy | Owner |
| --- | --- | --- | --- | --- |
| Conflito de IDs entre tarefasRotina e tarefasHome | Medium | High | Gerar novo ID baseado em contadorHome ao injetar | Developer |
| Perda de dados de recorrência ao converter | Low | Medium | Documentar que tarefa injetada não mantém recorrência | Developer |
| Inconsistência de estado entre cache e Firestore | Low | Medium | Usar métodos do store.js que já gerenciam sincronização | Developer |

### Dependencies
- **Internal:** Sistema de Store (store.js) deve estar funcionando corretamente
- **Technical:**
  - TaskCard.js deve suportar ações customizadas adicionais
  - Sistema de Toast para feedback visual
  - Rotina.js e Home.js devem estar atualizados com padrão redesign

### Assumptions
- Assume que o store.js já gerencia corretamente tarefasRotina e tarefasHome separadamente
- Assume que contadorHome é incrementado automaticamente ao adicionar tarefas
- Assume que usuário deseja converter tarefa de rotina em tarefa pontual (sem recorrência)
- Se tarefa já existir no Home com mesmo título, será criada duplicada (comportamento aceitável)

## Resource Estimation

### Time Allocation
| Phase | Estimated Effort | Calendar Time | Team Size |
| --- | --- | --- | --- |
| Phase 1 - Discovery | 1-2 hours | Meio dia | 1 pessoa |
| Phase 2 - Implementation | 3-4 hours | 1 dia | 1 pessoa |
| Phase 3 - Validation | 1-2 hours | Meio dia | 1 pessoa |
| **Total** | **5-8 hours** | **1-2 dias** | **-** |

### Required Skills
- JavaScript/ES6+ (classes, async/await, destructuring)
- Conhecimento do padrão Store/State Management
- HTML/CSS (para botão de ação no card)
- Experiência com event delegation e event handlers
- Familiaridade com o sistema de componentes do projeto

### Resource Availability
- **Available:** Developer com conhecimento do projeto
- **Blocked:** Nenhum bloqueio identificado
- **Escalation:** Product Owner se requisitos mudarem

## Working Phases

### Phase 1 — Discovery & Alignment
**Steps**
1. **Analisar estrutura atual do TaskCard** (Owner: Developer)
   - Verificar como actions são implementadas (onEdit, onDelete)
   - Identificar onde adicionar nova ação "Adicionar ao Home"
   - Verificar se há limitações no número de ações visíveis

2. **Mapear estrutura de dados** (Owner: Developer)
   - Comparar estrutura de tarefasRotina vs tarefasHome
   - Identificar campos que devem ser copiados
   - Identificar campos que devem ser transformados/gerados (id, contador)
   - Verificar se há campos específicos que não devem ser copiados (recurrence)

3. **Definir UX do fluxo** (Owner: Frontend Specialist)
   - Onde o botão aparece (sempre visível ou apenas em hover?)
   - Ícone a ser usado (exemplo: ➜, ↗, ou similar)
   - Mensagem de confirmação/toast
   - Comportamento após injeção (scroll para Home? feedback visual?)

**Open Questions:**
- O botão deve aparecer apenas em tarefas não concluídas?
- Devemos permitir injetar tarefas já adiadas (postponed)?
- O botão deve estar disponível em todas as views ou só em Rotina?

**Commit Checkpoint**
- After completing this phase, capture the agreed context and create a commit:
  `git commit -m "chore(plan): complete phase 1 discovery - inject rotina to home"`

### Phase 2 — Implementation & Iteration

**Steps**

1. **Atualizar TaskCard.js** (Owner: Frontend Specialist)
   - Adicionar nova opção `onInjectToHome` nas options do construtor
   - Criar botão de ação "Adicionar ao Home" na seção de actions
   - Usar ícone apropriado (SVG inline como outros botões)
   - Adicionar event listener que chama `this.options.onInjectToHome(this.task)`
   - Garantir que botão só aparece quando callback é fornecido

2. **Atualizar Rotina.js** (Owner: Feature Developer)
   - Importar método toast para feedback
   - Adicionar método `handleInjectToHome(task)` na classe RotinaView
   - Implementar lógica de conversão:
     ```javascript
     handleInjectToHome(task) {
       const state = store.getState();
       const newId = (state.contadorHome || 0) + 1;

       // Converter tarefa de rotina para tarefa do Home
       const homeTask = {
         id: newId,
         contador: newId,
         titulo: task.titulo || task.nome,
         descricao: task.descricao || '',
         prioridade: task.prioridade || 'media',
         responsavel: task.responsavel || '',
         tags: Array.isArray(task.tags) ? [...task.tags] : [],
         status: 'todo',
         completed: false,
         time: task.time || new Date().toISOString(),
         createdAt: new Date().toISOString(),
       };

       // Adicionar ao Home
       store.addItem('tarefasHome', homeTask);
       store.setState({ contadorHome: newId });

       // Feedback
       toast.success(`"${homeTask.titulo}" adicionada ao Home!`, {
         duration: 3000,
       });
     }
     ```
   - Passar callback `onInjectToHome` ao criar TaskCard no renderTasksSection

3. **Atualizar estilos (se necessário)** (Owner: Frontend Specialist)
   - Verificar se botão precisa de estilos específicos
   - Garantir consistência visual com design cyberpunk
   - Testar responsividade em mobile

4. **Adicionar validações** (Owner: Feature Developer)
   - Verificar se tarefa tem dados mínimos necessários
   - Validar que store está inicializado
   - Tratar erros graciosamente com toast de erro

**Reference Docs:**
- Seguir padrão de event handlers usado em handleTaskEdit e handleTaskDelete
- Usar sistema de toast existente para feedback consistente
- Manter padrão de geração de IDs usado em handleTaskAdd

**Commit Checkpoint**
- Summarize progress and create a commit:
  `git commit -m "feat: add inject to home functionality in rotina tasks"`

### Phase 3 — Validation & Handoff

**Steps**

1. **Testes manuais** (Owner: Test Writer)
   - [ ] Criar tarefa de rotina
   - [ ] Clicar em "Adicionar ao Home"
   - [ ] Verificar que tarefa aparece no Home
   - [ ] Confirmar que IDs são diferentes
   - [ ] Verificar que modificar tarefa no Home não afeta a tarefa de rotina
   - [ ] Testar com tarefas de diferentes prioridades
   - [ ] Testar com tarefas com e sem tags
   - [ ] Testar com tarefas recorrentes (verificar que recorrência não é copiada)
   - [ ] Testar feedback visual (toast)

2. **Testes de integração** (Owner: Test Writer)
   - Verificar que sincronização com Firestore funciona
   - Testar modo offline (deve funcionar via cache)
   - Verificar contadores (contadorRotina e contadorHome separados)

3. **Code review** (Owner: Code Reviewer)
   - Revisar padrões de código
   - Verificar tratamento de erros
   - Validar que não há memory leaks (event listeners)
   - Confirmar que mudanças seguem arquitetura existente

4. **Documentação** (Owner: Developer)
   - Adicionar comentários no código explicando a conversão
   - Atualizar glossary.md se necessário com novo termo
   - Documentar limitações conhecidas (não copia recorrência)

**Commit Checkpoint**
- Record the validation evidence:
  `git commit -m "chore(plan): complete phase 3 validation - inject to home tested"`

## Rollback Plan

### Rollback Triggers
When to initiate rollback:
- Erros críticos ao adicionar tarefas ao Home
- Perda de dados de tarefas
- Conflitos de ID causando sobrescrita de tarefas
- Performance degradada no rendering de TaskCards

### Rollback Procedures

#### Phase 2 Rollback
- **Action:** Reverter commits da feature, remover botão do TaskCard
- **Data Impact:** Nenhum (apenas UI changes, dados não são migrados)
- **Estimated Time:** < 30 minutos
- **Steps:**
  1. `git revert <commit-hash>`
  2. Remover callback `onInjectToHome` de Rotina.js
  3. Remover botão de TaskCard.js
  4. Rebuild e redeploy

#### Phase 3 Rollback
- **Action:** Feature flag disable ou revert completo
- **Data Impact:** Tarefas já injetadas permanecem no Home (aceitável)
- **Estimated Time:** < 1 hora
- **Steps:**
  1. Se houver feature flag, desabilitar
  2. Caso contrário, executar Phase 2 Rollback
  3. Notificar usuários via changelog

### Post-Rollback Actions
1. Document reason for rollback in incident report
2. Notify product owner
3. Collect user feedback on issue
4. Fix root cause before re-enabling

<!-- agent-readonly:guidance -->
## Agent Playbook Checklist
1. Feature Developer: Implement core injection logic in Rotina.js
2. Frontend Specialist: Add UI button in TaskCard.js with proper styling
3. Code Reviewer: Review implementation for consistency and best practices
4. Test Writer: Validate end-to-end flow and edge cases

## Evidence & Follow-up
**Artifacts to collect:**
- [ ] Screenshot/recording of successful injection flow
- [ ] Code diff showing TaskCard and Rotina changes
- [ ] Test results (manual test checklist completed)
- [ ] Toast notification working correctly
- [ ] Verification that tarefasHome counter increments properly

**Follow-up actions:**
- Consider adding batch injection (multiple tasks at once)
- Evaluate if same feature should be available in other views
- Monitor user feedback for UX improvements
- Consider adding confirmation dialog for accidental clicks

**Owners:**
- Implementation: Frontend Developer
- Testing: QA/Developer
- Review: Tech Lead
- Documentation: Developer

<!-- agent-update:end -->
