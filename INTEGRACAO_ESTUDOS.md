# Integração do Módulo de Estudos - Sprint 2

## Arquivos Criados

### Componentes
- `src/components/estudos/QuickAddParser.js` - Parser de comandos natural language
- `src/components/estudos/QuickAddInput.js` - Input com autocomplete
- `src/components/estudos/KanbanEstudos.js` - Kanban 4 colunas
- `src/components/estudos/RevisaoEspacada.js` - Sistema de revisão espaçada
- `src/components/estudos/PomodoroTimer.js` - Timer Pomodoro
- `src/components/estudos/NotasRapidas.js` - Editor de notas com markdown

### Utils
- `src/utils/estudos-store.js` - Gerenciamento de estado com localStorage

### Views
- `src/views/EstudosView.js` - View principal que integra todos os componentes

### Styles
- `src/styles/estudos.css` - Estilos mobile-first para todos os componentes

## Como Integrar

### Opção 1: Usar como módulo ES6 (Recomendado)

No seu `index.html` ou arquivo principal:

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Gerenciador Pedro v3.0</title>
    <link rel="stylesheet" href="/src/styles/variables.css" />
    <link rel="stylesheet" href="/src/styles/estudos.css" />
</head>
<body>
    <div id="estudosView"></div>
    
    <!-- Carregar componentes -->
    <script type="module">
        import { EstudosStore } from './src/utils/estudos-store.js';
        import { EstudosView } from './src/views/EstudosView.js';
        
        // Carregar componentes globais
        await import('./src/components/estudos/QuickAddParser.js');
        await import('./src/components/estudos/QuickAddInput.js');
        await import('./src/components/estudos/KanbanEstudos.js');
        await import('./src/components/estudos/RevisaoEspacada.js');
        await import('./src/components/estudos/PomodoroTimer.js');
        await import('./src/components/estudos/NotasRapidas.js');
        
        const container = document.getElementById('estudosView');
        const store = new EstudosStore();
        const view = new EstudosView(container, store);
    </script>
</body>
</html>
```

### Opção 2: Usar como scripts globais

No seu `index.html`:

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Gerenciador Pedro v3.0</title>
    <link rel="stylesheet" href="/src/styles/variables.css" />
    <link rel="stylesheet" href="/src/styles/estudos.css" />
</head>
<body>
    <div id="estudosView"></div>
    
    <!-- Carregar componentes na ordem correta -->
    <script src="/src/components/estudos/QuickAddParser.js"></script>
    <script src="/src/components/estudos/QuickAddInput.js"></script>
    <script src="/src/components/estudos/RevisaoEspacada.js"></script>
    <script src="/src/components/estudos/KanbanEstudos.js"></script>
    <script src="/src/components/estudos/PomodoroTimer.js"></script>
    <script src="/src/components/estudos/NotasRapidas.js"></script>
    <script src="/src/utils/estudos-store.js"></script>
    <script src="/src/views/EstudosView.js"></script>
    
    <script>
        // Inicializar quando DOM estiver pronto
        document.addEventListener('DOMContentLoaded', () => {
            const container = document.getElementById('estudosView');
            const store = new EstudosStore();
            const view = new EstudosView(container, store);
        });
    </script>
</body>
</html>
```

## Funcionalidades

### Quick Add
- Digite: `Python @udemy #urgente :2h !alta`
- Atalho: `Ctrl+N` (ou `Cmd+N` no Mac)
- Auto-complete de áreas e tags
- Preview em tempo real

### Kanban
- 4 colunas: Prioridade | Revisões | Em Andamento | Concluídos
- Drag & drop entre colunas
- Contadores por coluna
- Badge de revisão pendente

### Modal de Estudo
- Abre ao clicar em card do Kanban
- Pomodoro Timer integrado
- Notas Rápidas com markdown
- Salvar sessão ao finalizar

### Revisão Espaçada
- Agenda automaticamente ao concluir tópico
- Intervalos: 1, 3, 7, 15, 30 dias
- Ajusta baseado em dificuldade
- Mostra revisões pendentes no Kanban

## Armazenamento

Os dados são salvos no `localStorage` com a chave `estudos_v3`.

Estrutura:
```json
{
  "areas": [...],
  "topicos": [...],
  "contadorAreas": 0,
  "contadorTopicos": 0,
  "versao": 3
}
```

## Migração de Dados v2

O sistema detecta automaticamente dados da versão 2 (`estudos_v2`) e migra para v3 na primeira inicialização.

## Compatibilidade

- ✅ Mobile-first (stack vertical no mobile)
- ✅ Touch-friendly (botões mínimo 44x44px)
- ✅ Compatível com dados v2
- ✅ Funciona offline (localStorage)


