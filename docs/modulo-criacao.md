# Módulo de Criação

## Visão Geral

O Módulo de Criação é um sistema completo de gerenciamento criativo que integra três componentes principais:

1. **Ideias** - Sistema Kanban para captura, análise e priorização de ideias
2. **Planejamento** - Metodologia PREVC (5 etapas) para estruturar projetos
3. **Tarefas de Criação** - Gerenciamento de tarefas de execução com contextos e checklists

## Arquitetura

### Estrutura de Arquivos

```
src/
├── views/
│   ├── Criacao.js              # Home - Tarefas de Criação (Kanban)
│   ├── CriacaoIdeias.js        # Kanban de Ideias
│   └── CriacaoPlanejamento.js  # Sistema PREVC
├── types.js                     # Tipos e enums compartilhados
├── styles/
│   ├── criacao.css             # Estilos da home de tarefas
│   ├── criacao-ideias.css      # Estilos do Kanban de Ideias
│   └── criacao-planejamento.css # Estilos do PREVC
└── store.js                     # State management (já inclui métodos do módulo)
```

### Rotas

- `/criacao` - Home do módulo (Tarefas de Criação)
- `/criacao/ideias` - Kanban de Ideias
- `/criacao/planejamento` - Sistema PREVC

### Data Models

#### Idea
```javascript
{
  id: string,
  title: string,
  description: string,
  context: CreationContext,     // Dev, Conteúdo, Negócio, Pessoal
  stage: IdeaStage,             // Inbox, Analisando, Validada, Executando, Congelada, Descartada
  tags: string[],
  attachments: string[],
  impact: number (1-5),         // Impacto da ideia
  effort: number (1-5),         // Esforço necessário
  score: number,                // Calculado: impact / effort
  source: string,               // Fonte/Inspiração
  createdAt: ISO string,
  updatedAt: ISO string
}
```

#### Planning
```javascript
{
  id: string,
  title: string,
  descriptionOrObjective: string,
  deadline: ISO date string,
  currentStep: number,          // Etapa atual (1-5 para PREVC)
  status: PlanningStatus,       // Ativo, Pausado, Concluído, Cancelado
  templateUsedId: string,       // Referência ao template usado
  steps: Step[],                // Cópia das etapas do template
  tags: string[],
  attachments: string[],
  createdAt: ISO string,
  updatedAt: ISO string
}
```

#### Step (dentro de Template ou Planning)
```javascript
{
  order: number,
  name: string,
  emoji: string,
  guide: string                 // Orientação sobre o que fazer nesta etapa
}
```

#### CreationTask
```javascript
{
  id: string,
  title: string,
  description: string,
  priority: Priority,           // Alta, Média, Baixa
  status: Status,               // Inbox, A Fazer, Em Progresso, Concluído
  context: CreationContext,
  dueDate: ISO date string,
  checklist: ChecklistItem[],
  tags: string[],
  attachments: string[],
  visibleOnGeneralHome: boolean, // Se deve aparecer na home geral
  createdAt: ISO string,
  updatedAt: ISO string
}
```

#### Template
```javascript
{
  id: string,
  name: string,
  description: string,
  context: CreationContext,
  steps: Step[],
  createdAt: ISO string,
  updatedAt: ISO string
}
```

#### TaskTemplate
```javascript
{
  id: string,
  name: string,
  context: CreationContext,
  aiPrompt: string,            // Prompt para copiar e usar com IA
  createdAt: ISO string,
  updatedAt: ISO string
}
```

## Funcionalidades

### 1. Ideias (Kanban)

#### Quick Capture
- Input de captura rápida com tecla Enter
- Ideias vão direto para coluna "Inbox"
- Zero fricção para não perder ideias

#### Sistema de Scoring
- **Impacto** (1-5): Qual o valor/benefício da ideia?
- **Esforço** (1-5): Quanto trabalho/tempo será necessário?
- **Score** = Impacto / Esforço
  - Score >= 3.0: Alta prioridade (verde)
  - Score >= 1.5: Média prioridade (amarelo)
  - Score < 1.5: Baixa prioridade (vermelho)

#### Colunas do Kanban
1. **Inbox**: Ideias recém-capturadas
2. **Analisando**: Em análise de viabilidade
3. **Validada**: Ideia validada, pronta para executar
4. **Executando**: Em desenvolvimento/execução
5. **Congelada**: Pausada temporariamente
6. **Descartada**: Arquivada/rejeitada

#### Recursos
- Movimentação entre colunas com botões de navegação
- Edição inline de título e descrição
- Anexos (links, arquivos, áudio)
- Tags para categorização
- Contexto (Dev, Conteúdo, Negócio, Pessoal)

### 2. Planejamento (PREVC)

#### Metodologia PREVC (5 Etapas)
1. **📋 Planejamento**: Criar escopo/PRD inicial, definir requisitos
2. **🔍 Revisão**: Revisar com IA, remover excessos, validar escopo
3. **⚡ Execução**: Executar as tarefas/fases planejadas
4. **✅ Validação**: Verificar se entregou o esperado
5. **🎯 Confirmação**: Confirmar conclusão, ajustes finais

#### Templates
- Sistema flexível de templates de metodologia
- Template padrão: PREVC (5 etapas)
- Possibilidade de criar templates personalizados
- Cada template define: nome, etapas (ordem, emoji, guia)

#### Controles de Planejamento
- **Barra de progresso**: Visual da etapa atual
- **Navegação de etapas**: Avançar/voltar entre etapas
- **Status**: Ativo, Pausado, Concluído, Cancelado
- **Deadline**: Data estimada de conclusão
- **Recursos**: Anexos e links relacionados

### 3. Tarefas de Criação

#### Kanban de 4 Colunas
1. **Inbox**: Tarefas recém-criadas
2. **A Fazer**: Backlog organizado
3. **Em Progresso**: Trabalho ativo
4. **Concluído**: Tarefas finalizadas

#### Filtros
- **Por Contexto**: Dev, Conteúdo, Negócio, Pessoal
- **Por Prioridade**: Alta, Média, Baixa

#### Checklist
- Sub-tarefas dentro de uma tarefa de criação
- Progresso visual (N/M completos)
- Ideal para quebrar tarefas complexas

#### Importação de IA
- Cole lista de tarefas gerada por ChatGPT/Claude
- Parser automático identifica cada linha como tarefa
- Tarefas vão para Inbox com tag "Importado-IA"
- Templates de prompts reutilizáveis

## Store (State Management)

### Métodos do Store

#### Ideas
```javascript
store.addIdea(idea)              // Criar nova ideia
store.updateIdea(id, updates)    // Atualizar ideia existente
store.deleteIdea(id)             // Excluir ideia
store.moveIdeaStage(id, direction) // Mover entre colunas ('next'/'prev')
```

#### Plannings
```javascript
store.addPlanning(planning)      // Criar novo planejamento
store.updatePlanning(id, updates) // Atualizar planejamento
store.deletePlanning(id)         // Excluir planejamento
store.movePlanningStep(id, direction) // Avançar/voltar etapas
store.changePlanningStatus(id, newStatus) // Mudar status
```

#### Creation Tasks
```javascript
store.addCreationTask(task)      // Criar nova tarefa
store.batchAddCreationTasks(tasks[]) // Criar múltiplas tarefas (IA)
store.updateCreationTask(id, updates) // Atualizar tarefa
store.deleteCreationTask(id)     // Excluir tarefa
```

#### Templates
```javascript
store.addTemplate(template)      // Criar novo template de metodologia
store.updateTemplate(id, updates) // Atualizar template
store.deleteTemplate(id)         // Excluir template
```

#### Task Templates
```javascript
store.addTaskTemplate(template)  // Criar template de prompt IA
store.updateTaskTemplate(id, updates) // Atualizar
store.deleteTaskTemplate(id)     // Excluir
```

### Sincronização Firebase

Todas as operações são automaticamente sincronizadas com Firestore:

- **Collections**:
  - `ideas`
  - `plannings`
  - `creationTasks`
  - `templates`
  - `taskTemplates`

- **Estratégia**: Offline-first
  - Salva localmente primeiro (IndexedDB)
  - Sincroniza com Firebase quando online
  - Listeners real-time para atualizações de outros dispositivos

## UI/UX

### Design System

#### Cores por Contexto
- **Dev**: Rosa/Pink (#f441a5)
- **Conteúdo**: Azul (#3b82f6)
- **Negócio**: Roxo (#a855f7)
- **Pessoal**: Verde (#22c55e)

#### Colunas Kanban (Ideias)
- **Inbox**: Amarelo (#fbbf24)
- **Analisando**: Azul (#60a5fa)
- **Validada**: Verde (#4ade80)
- **Executando**: Índigo (#818cf8)
- **Congelada/Descartada**: Cinza (opacidade reduzida)

#### Animações
- Hover: Transform translateY(-2px)
- Cards: Fade-in com slide
- Progresso: Transições suaves (500ms)

### Responsividade

#### Desktop (>1024px)
- Grid de 4 colunas para Ideias
- Grid de 2 colunas para Planejamentos
- Sidebar de templates visível

#### Tablet (768-1024px)
- Grid de 2-3 colunas
- Sidebar de templates colapsável

#### Mobile (<768px)
- Coluna única
- Menu hamburguer para navegação
- Sidebar overlay

## Testes E2E

Localização: `tests/e2e/criacao-module.spec.js`

### Cobertura

#### Ideias
- ✅ Renderização da view
- ✅ Quick capture de ideias
- ✅ Movimentação no Kanban
- ✅ Exclusão de ideias

#### Planejamento
- ✅ Renderização da view
- ✅ Exibição de templates
- ✅ Filtros por status

#### Tarefas de Criação
- ✅ Renderização do Kanban
- ✅ Filtros por contexto e prioridade
- ✅ Modal de importação de IA (placeholder)

#### Navegação
- ✅ Troca entre seções do módulo

### Executar Testes
```bash
npm run test:e2e
```

## Extensões Futuras

### Planejadas
- [ ] Modal completo de edição de Ideias (atualmente usa prompt)
- [ ] Modal de edição de Planejamentos com todos os campos
- [ ] Modal de Templates com editor visual de etapas
- [ ] Drag & Drop para reordenar tarefas no Kanban
- [ ] Busca/filtro global de ideias e planejamentos
- [ ] Exportação de planejamentos para Markdown
- [ ] Integração nativa com APIs de IA (sem copiar/colar)
- [ ] Estatísticas: quantas ideias por contexto, taxa de conversão, etc
- [ ] Colaboração: comentários em ideias/planejamentos
- [ ] Notificações: lembrete de deadlines de planejamentos

### Possíveis (Backlog)
- [ ] Templates da comunidade (galeria compartilhada)
- [ ] Versionamento de planejamentos
- [ ] Integração com Git Issues/PRs
- [ ] Time tracking integrado nas tarefas de criação
- [ ] Relatórios de produtividade semanal/mensal

## Troubleshooting

### Ideias não aparecem após criar
- **Causa**: Store não está notificando subscribers
- **Solução**: Verificar se `store.subscribe()` está sendo chamado no `mount()`

### Erros ao mover ideias/planejamentos
- **Causa**: Métodos do store usando assinatura incorreta
- **Solução**: Garantir que `updateItem` e `removeItem` usam predicates

### Firebase não sincroniza
- **Causa**: Collections não adicionadas ao mapeamento
- **Solução**: Verificar `_saveCollectionsToFirestore` e `setupRealtimeListeners` no store

### CSS não carrega
- **Causa**: Arquivo não importado no `index.html`
- **Solução**: Adicionar `<link rel="stylesheet">` no head do HTML

## Contribuindo

Ao adicionar features ao módulo:

1. Atualizar data models neste documento
2. Adicionar testes E2E para novas funcionalidades
3. Documentar novos métodos do store
4. Atualizar CSS com comentários sobre novas classes
5. Considerar impacto mobile (responsividade)

## Referências

- [Plano de Implementação](.context/plans/implementacao-modulo-criacao.md)
- [Protótipo Original](.cursor/app-gerenciamento_prototips/)
- [Arquitetura do Projeto](./architecture.md)

---

**Status**: ✅ Implementado e Funcionando  
**Versão**: 1.0.0  
**Data**: Dezembro 2024




