# Component Mapping Document

Este documento mapeia os componentes do design protótipo React/TypeScript (`re-desing/`) para os componentes existentes em JavaScript vanilla (`src/components/`).

## Visão Geral

O design protótipo usa React/TypeScript com Tailwind CSS, enquanto a implementação atual usa JavaScript vanilla com CSS customizado. Este mapeamento identifica correspondências e diferenças entre os componentes.

## Mapeamento de Componentes

### 1. Sidebar

| Protótipo (React) | Implementação Atual (Vanilla JS) | Status |
|-------------------|----------------------------------|--------|
| `re-desing/components/Sidebar.tsx` | `src/components/Sidebar.js` | ✅ Existe |
| **Props/Features:** | **Features:** | |
| - `activeTab: string` | - `updateActiveRoute(path)` | ✅ Compatível |
| - `setActiveTab: (tab: string) => void` | - Navegação via router | ✅ Compatível |
| - Menu items: home, projects, studies, routine, therapy | - Mesmos menu items | ✅ Compatível |
| - Logo com gradiente e ícone Zap | - Logo com emoji 🎯 | ⚠️ Precisa atualizar |
| - Footer com Settings e LogOut | - Não tem footer | ⚠️ Precisa adicionar |
| - Glassmorphism e bordas animadas | - Estilo simples | ⚠️ Precisa atualizar |

**Ações Necessárias:**
- Atualizar logo para usar gradiente e ícone SVG (Zap)
- Adicionar footer com botões Settings e LogOut
- Aplicar glassmorphism e efeitos de borda
- Atualizar cores e espaçamento conforme design tokens

### 2. TaskCard

| Protótipo (React) | Implementação Atual (Vanilla JS) | Status |
|-------------------|----------------------------------|--------|
| `re-desing/components/TaskCard.tsx` | `src/components/TaskCard.js` | ✅ Existe |
| **Props/Features:** | **Features:** | |
| - `task: Task` | - `task` object | ✅ Compatível |
| - `onToggleStatus: (id: string) => void` | - Checkbox com event listener | ✅ Compatível |
| - `onDelete: (id: string) => void` | - Botão delete com data-action | ✅ Compatível |
| - `onEdit: (task: Task) => void` | - Botão edit com data-action | ✅ Compatível |
| - Top graphic area com ícone | - Header com time/date | ⚠️ Estrutura diferente |
| - Priority badge no topo | - Priority badge no header | ✅ Compatível |
| - Tags com hover effects | - Tags simples | ⚠️ Precisa animações |
| - Meta info (date, assignee) | - Footer com module, duration | ⚠️ Estrutura diferente |
| - Botões edit/delete no hover | - Botões edit/delete no footer | ⚠️ Precisa mover para hover |

**Ações Necessárias:**
- Redesenhar estrutura: adicionar top graphic area com ícone
- Mover priority badge para topo direito
- Adicionar animações de hover nos tags
- Mover botões edit/delete para aparecer apenas no hover
- Atualizar cores e glassmorphism

### 3. NeonButton

| Protótipo (React) | Implementação Atual (Vanilla JS) | Status |
|-------------------|----------------------------------|--------|
| `re-desing/components/NeonButton.tsx` | `src/components/NeonButton.js` | ✅ Existe |
| **Props/Features:** | **Features:** | |
| - `variant: 'primary' | 'secondary' | 'danger'` | - `variant: 'primary' | 'secondary' | 'danger'` | ✅ Compatível |
| - Glow effect no hover (primary) | - Glow effect no hover (primary) | ✅ Compatível |
| - Border animado | - Border simples | ⚠️ Precisa animação |
| - Transform scale no active | - Não tem | ⚠️ Precisa adicionar |

**Ações Necessárias:**
- Adicionar animação de border
- Adicionar transform scale no active
- Atualizar cores conforme design tokens

### 4. NeonCheckbox

| Protótipo (React) | Implementação Atual (Vanilla JS) | Status |
|-------------------|----------------------------------|--------|
| `re-desing/components/NeonCheckbox.tsx` | `src/components/Checkbox.js` | ⚠️ Parcialmente existe |
| **Props/Features:** | **Features:** | |
| - `checked: boolean` | - `checked` state | ✅ Compatível |
| - `onChange: () => void` | - `onChange` callback | ✅ Compatível |
| - Animação de checkmark | - Usa iOS checkbox | ⚠️ Precisa substituir |
| - Glow effect | - Não tem | ⚠️ Precisa adicionar |
| - Dots decorativos no hover | - Não tem | ⚠️ Precisa adicionar |

**Ações Necessárias:**
- Criar novo componente NeonCheckbox baseado no protótipo
- Substituir uso de iOS checkbox pelo NeonCheckbox
- Adicionar animações e glow effects

### 5. Modal

| Protótipo (React) | Implementação Atual (Vanilla JS) | Status |
|-------------------|----------------------------------|--------|
| `re-desing/components/Modal.tsx` | `src/components/TaskEditModal.js` | ✅ Existe |
| **Props/Features:** | **Features:** | |
| - `isOpen: boolean` | - `open()` / `close()` methods | ✅ Compatível |
| - `onClose: () => void` | - Event listeners | ✅ Compatível |
| - `onSave: (task: Partial<Task>) => void` | - `onSave` callback | ✅ Compatível |
| - `initialData?: Task` | - `currentTask` | ✅ Compatível |
| - Spinning border effect | - Border simples | ⚠️ Precisa animação |
| - Backdrop blur | - Backdrop simples | ⚠️ Precisa blur |
| - Form inputs com glow | - Inputs simples | ⚠️ Precisa glow effects |

**Ações Necessárias:**
- Adicionar spinning border effect
- Adicionar backdrop blur
- Adicionar glow effects nos inputs
- Atualizar cores e espaçamento

### 6. ComplexSearch

| Protótipo (React) | Implementação Atual (Vanilla JS) | Status |
|-------------------|----------------------------------|--------|
| `re-desing/components/ComplexSearch.tsx` | `src/components/ComplexSearch.js` | ✅ Existe |
| **Props/Features:** | **Features:** | |
| - `value: string` | - `value` property | ✅ Compatível |
| - `onChange: (val: string) => void` | - `onChange` callback | ✅ Compatível |
| - Conic gradient borders animados | - Conic gradient borders | ✅ Compatível |
| - Filter button com spinning border | - Filter button | ✅ Compatível |
| - Glow effects | - Glow effects | ✅ Compatível |

**Ações Necessárias:**
- Verificar se animações estão funcionando corretamente
- Ajustar timing e easing das animações
- Garantir compatibilidade cross-browser

### 7. Breadcrumb

| Protótipo (React) | Implementação Atual (Vanilla JS) | Status |
|-------------------|----------------------------------|--------|
| Não existe no protótipo | `src/components/Breadcrumb.js` | ⚠️ Não mapeado |
| **Nota:** O protótipo não inclui breadcrumb, mas a implementação atual tem. Decidir se manter ou remover. | | |

### 8. Views

| Protótipo (React) | Implementação Atual (Vanilla JS) | Status |
|-------------------|----------------------------------|--------|
| `re-desing/App.tsx` (renderHome, renderKanban) | `src/views/Home.js` | ✅ Existe |
| **Features do Protótipo:** | **Features Atuais:** | |
| - Dashboard com filtros (urgent, delayed, future, completed) | - Timeline, overdue, completed, postponed | ⚠️ Estrutura diferente |
| - Welcome card com gradiente | - Seções separadas | ⚠️ Precisa adicionar |
| - Produtividade card com progress bar | - Metrics section | ✅ Compatível |
| - Kanban view para projects/studies | - Não tem kanban view | ⚠️ Precisa adicionar |

**Ações Necessárias:**
- Adicionar welcome card no topo
- Reorganizar dashboard com filtros de abas
- Adicionar kanban view para projects/studies
- Atualizar layout e espaçamento

## Componentes Não Mapeados

### Componentes no Protótipo que não existem na implementação atual:
- Nenhum (todos os componentes principais têm correspondência)

### Componentes na implementação atual que não existem no protótipo:
- `Breadcrumb.js` - Decidir se manter ou remover
- `ConfirmModal.js` - Manter (funcionalidade necessária)
- `Toast.js` - Manter (funcionalidade necessária)
- `MenuHamburguer.js` - Integrar na Sidebar

## Estrutura de Dados

### Task Interface (Protótipo)
```typescript
interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority; // 'Alta' | 'Média' | 'Baixa'
  status: Status; // 'A Fazer' | 'Em Progresso' | 'Concluído' | 'Adiada'
  tags: string[];
  dueDate: string; // ISO date string
  assignee?: string;
}
```

### Task Object (Implementação Atual)
```javascript
{
  id: number | string,
  contador: number,
  titulo: string,
  descricao: string,
  prioridade: string, // 'urgente' | 'alta' | 'media' | 'baixa'
  status: string, // 'todo' | 'doing' | 'done'
  tags: string[],
  time: string, // ISO date string
  responsavel: string,
  modulo: string,
  duracao: string,
  completed: boolean,
  createdAt: string,
  updatedAt: string
}
```

**Diferenças:**
- Nomes de campos diferentes (title/titulo, description/descricao)
- Status values diferentes
- Prioridade values diferentes
- Campos adicionais na implementação atual (modulo, duracao, completed)

**Ações Necessárias:**
- Criar adaptador para mapear entre os dois formatos se necessário
- Ou padronizar para um formato único

## Animações e Interações

### Animações no Protótipo:
1. **Fade-in/Slide-in** - Componentes aparecem com animação
2. **Hover effects** - Glow, border animations, scale
3. **Checkbox animation** - Rotação e scale no check
4. **Modal entrance** - Zoom-in e fade
5. **Search border rotation** - Conic gradient rotation
6. **Button glow** - Glow effect no hover

### Animações na Implementação Atual:
1. **Swipe gestures** - Para completar/adiar tarefas
2. **Checkbox animations** - iOS-style
3. **Toast notifications** - Slide-in
4. **Modal fade** - Simples

**Ações Necessárias:**
- Adicionar todas as animações do protótipo
- Manter swipe gestures (funcionalidade adicional)
- Garantir performance (usar transform e opacity)

## Próximos Passos

1. ✅ Criar este documento de mapeamento
2. ⏳ Extrair design tokens para CSS variables
3. ⏳ Criar plano de migração incremental
4. ⏳ Começar migração componente por componente



