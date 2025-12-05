# Schemas do Módulo de Criação

## Collections Firestore

### `ideas`
```javascript
{
  id: string,                    // ID único
  title: string,                  // Título da ideia
  description: string,            // Descrição detalhada
  context: string,                // 'Dev' | 'Conteúdo' | 'Negócio' | 'Pessoal'
  stage: string,                  // 'Inbox' | 'Analisando' | 'Validada' | 'Executando' | 'Congelada' | 'Descartada'
  impact: number,                 // 1-5 (decimal)
  effort: number,                 // 1-5 (decimal)
  score: number,                  // impact / effort (calculado)
  source: string,                 // Fonte da ideia (opcional)
  tags: string[],                 // Array de tags
  attachments: string[],          // Array de URLs/filenames
  createdAt: timestamp,
  updatedAt: timestamp,
  userId: string                  // Para futuro suporte multi-user
}
```

### `plannings`
```javascript
{
  id: string,
  title: string,                          // Título do planejamento
  descriptionOrObjective: string,         // Objetivo/descrição
  deadline: string,                       // ISO date
  currentStep: number,                    // Etapa atual (1-based)
  status: string,                         // 'Ativo' | 'Pausado' | 'Concluído' | 'Cancelado'
  templateUsedId: string,                 // ID do template usado
  steps: Array<{                          // Cópia das etapas do template
    order: number,
    name: string,
    emoji: string,
    guide: string
  }>,
  tags: string[],
  attachments: string[],
  createdAt: timestamp,
  updatedAt: timestamp,
  userId: string
}
```

### `templates`
```javascript
{
  id: string,
  name: string,                           // Nome do template (ex: "PREVC Padrão")
  description: string,                    // Descrição do método
  context: string,                        // Contexto sugerido
  steps: Array<{
    order: number,
    name: string,
    emoji: string,
    guide: string
  }>,
  createdAt: timestamp,
  updatedAt: timestamp,
  userId: string
}
```

### `creationTasks`
```javascript
{
  id: string,
  title: string,
  description: string,
  priority: string,                       // 'Alta' | 'Média' | 'Baixa'
  status: string,                         // 'Inbox' | 'A Fazer' | 'Em Progresso' | 'Concluído' | 'Cancelado'
  context: string,                        // 'Dev' | 'Conteúdo' | 'Negócio' | 'Pessoal'
  dueDate: string,                        // ISO date
  checklist: Array<{
    id: string,
    text: string,
    done: boolean
  }>,
  tags: string[],
  attachments: string[],
  visibleOnGeneralHome: boolean,          // Se deve aparecer no Home geral
  createdAt: timestamp,
  updatedAt: timestamp,
  userId: string
}
```

### `taskTemplates`
```javascript
{
  id: string,
  name: string,                           // Nome do template
  context: string,                        // Contexto padrão
  aiPrompt: string,                       // Prompt para copiar e usar em IA
  createdAt: timestamp,
  updatedAt: timestamp,
  userId: string
}
```

## Rotas Planejadas

| Rota | View | Descrição |
|------|------|-----------|
| `/criacao` | `CriacaoView` | Home do módulo com overview e tarefas de criação (Kanban) |
| `/criacao/ideias` | `CriacaoIdeiasView` | Kanban de ideias com 6 colunas |
| `/criacao/planejamento` | `CriacaoPlanejamentoView` | Gerenciamento de planejamentos PREVC |

## Estado Local (Store)

Adicionar ao `src/store.js`:

```javascript
// Novos campos de estado
ideas: [],
plannings: [],
creationTasks: [],
templates: [
  // Template PREVC padrão inicializado
],
taskTemplates: []
```

## Ações do Store

```javascript
// Ideas
addIdea(idea)
updateIdea(id, updates)
deleteIdea(id)
moveIdeaStage(id, direction) // 'next' | 'prev'

// Plannings
addPlanning(planning)
updatePlanning(id, updates)
deletePlanning(id)
movePlanningStep(id, direction)
changePlanningStatus(id, newStatus)

// Creation Tasks
addCreationTask(task)
updateCreationTask(id, updates)
deleteCreationTask(id)
batchAddCreationTasks(tasks[]) // Para importação de IA

// Templates
addTemplate(template)
updateTemplate(id, updates)
deleteTemplate(id)

// Task Templates
addTaskTemplate(template)
updateTaskTemplate(id, updates)
deleteTaskTemplate(id)
```




