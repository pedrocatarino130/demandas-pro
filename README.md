# Gerenciador Pedro v3.0

Sistema de gerenciamento pessoal focado em produtividade e uso diário.

## 🚀 Início Rápido

### Pré-requisitos

- **Node.js** 18+ e npm (ou yarn/pnpm)
- **Git** para clonar o repositório
- **Conta Firebase** (para persistência de dados)

### Instalação

```bash
# Clonar repositório (se necessário)
git clone <repository-url>
cd demandas

# Instalar dependências
npm install

# Configurar Firebase (ver Doc/FIREBASE_SETUP.md)
# Criar arquivo .env.local com as credenciais do Firebase

# Iniciar servidor de desenvolvimento
npm run dev

# O servidor estará disponível em http://localhost:3000
```

### Build para Produção

```bash
# Criar build otimizado
npm run build

# Preview do build localmente
npm run preview
```

O build será gerado na pasta `dist/`, pronta para deploy.

### Deploy no GitHub Pages

**⚠️ IMPORTANTE**: O projeto precisa ser buildado antes de ser servido. Não tente servir os arquivos fonte diretamente.

#### Opção 1: Deploy Manual

1. **Build do projeto**:
   ```bash
   # Para GitHub Pages em subdiretório (ex: /demandas-pro/)
   BASE_URL=/demandas-pro/ npm run build
   
   # Para GitHub Pages na raiz
   npm run build
   ```

2. **Copiar conteúdo de `dist/` para a branch `gh-pages`** ou configurar GitHub Pages para servir da pasta `dist/`

3. **Configurar GitHub Pages** no repositório para servir da branch `gh-pages` ou da pasta `dist/`

#### Opção 2: GitHub Actions (Recomendado)

Crie `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: BASE_URL=/demandas-pro/ npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

**Nota**: Substitua `/demandas-pro/` pelo caminho correto do seu repositório no GitHub Pages.

## 📁 Estrutura do Projeto

```
demandas/
├── src/
│   ├── main.js                    # Entry point da aplicação
│   ├── router.js                  # Sistema de roteamento SPA
│   ├── store.js                   # Estado global com Firebase Firestore
│   ├── config/                    # Configurações
│   │   └── firebase.js           # Configuração do Firebase
│   ├── services/                  # Serviços
│   │   ├── firebase-service.js   # Serviço principal do Firebase
│   │   ├── firebase-cache.js     # Cache local (IndexedDB)
│   │   └── firebase-sync.js      # Sincronização offline/online
│   ├── components/                # Componentes reutilizáveis
│   │   ├── Breadcrumb.js          # Navegação contextual
│   │   ├── Checkbox.js             # Checkbox base
│   │   ├── MenuHamburguer.js      # Menu mobile
│   │   ├── Sidebar.js             # Sidebar de navegação
│   │   ├── TaskCard.js            # Card de tarefa
│   │   ├── Toast.js               # Notificações
│   │   ├── ios-cards.js           # Cards estilo iOS
│   │   ├── ios-checkbox.js        # Checkbox estilo iOS
│   │   └── estudos/               # Componentes do módulo Estudos
│   │       ├── QuickAddInput.js   # Input de criação rápida
│   │       ├── QuickAddParser.js  # Parser de comandos naturais
│   │       ├── KanbanEstudos.js   # Kanban 4 colunas
│   │       ├── PomodoroTimer.js   # Timer Pomodoro
│   │       ├── NotasRapidas.js    # Campo de notas
│   │       └── RevisaoEspacada.js # Sistema de revisão
│   ├── views/                     # Views/Páginas da aplicação
│   │   ├── Home.js                # Dashboard principal
│   │   ├── Rotina.js              # Tarefas de rotina
│   │   ├── Projetos.js            # Projetos (Kanban)
│   │   ├── Estudos.js             # Módulo de Estudos
│   │   ├── EstudosView.js         # View principal de Estudos
│   │   └── Terapeutico.js         # Módulo terapêutico
│   ├── utils/                     # Utilitários
│   │   ├── dateUtils.js           # Funções de data
│   │   ├── taskFilters.js         # Filtros de tarefas
│   │   ├── estudos-store.js       # Store específico de Estudos
│   │   └── migrate-localStorage-to-firebase.js  # Script de migração
│   │   └── swipe-gestures.js      # Gestos touch
│   └── styles/                    # Estilos CSS
│       ├── variables.css          # Variáveis CSS (design system)
│       ├── reset.css              # Reset CSS
│       ├── components.css         # Estilos de componentes
│       ├── mobile.css             # Estilos mobile-first
│       ├── sidebar.css            # Estilos da sidebar
│       ├── breadcrumb.css         # Estilos de breadcrumb
│       ├── task-card.css          # Estilos de cards
│       ├── home.css               # Estilos do dashboard
│       ├── checkbox.css           # Estilos de checkbox
│       ├── toast.css              # Estilos de toast
│       ├── estudos.css            # Estilos do módulo Estudos
│       ├── rotina.css             # Estilos da view Rotina
│       ├── projetos.css           # Estilos da view Projetos
│       └── app.css                # Estilos globais
├── public/                        # Arquivos estáticos públicos
│   ├── manifest.json              # Manifest do PWA
│   └── service-worker.js          # Service Worker (offline)
├── sprint2/                       # Código do Sprint 2 (arquivos de referência)
├── sprint3/                       # Código do Sprint 3 (arquivos de referência)
├── tests/                         # Testes E2E
│   └── e2e/
│       ├── dashboard.spec.js      # Testes do dashboard
│       ├── navigation.spec.js     # Testes de navegação
│       ├── persistence.spec.js    # Testes de persistência
│       ├── quick-add.spec.js      # Testes do Quick Add
│       └── README.md              # Documentação dos testes
├── index.html                     # HTML principal
├── vite.config.js                 # Configuração do Vite
├── package.json                   # Dependências e scripts
└── playwright.config.js           # Configuração do Playwright
```

## 🛠️ Scripts Disponíveis

### Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento (porta 3000)
npm run dev

# Servidor com auto-reload e hot module replacement
```

### Build e Deploy

```bash
# Criar build de produção (gera pasta dist/)
npm run build

# Preview do build localmente
npm run preview
```

### Qualidade de Código

```bash
# Verificar código com ESLint
npm run lint

# Formatar código com Prettier
npm run format
```

### Testes

```bash
# Executar todos os testes E2E
npm run test:e2e

# Executar testes com UI do Playwright
npm run test:e2e:ui

# Executar testes em modo headed (ver navegador)
npm run test:e2e:headed
```

## 🔥 Firebase Firestore

O projeto utiliza **Firebase Firestore** para persistência de dados com suporte offline-first:

- **Armazenamento em nuvem** com sincronização automática
- **Cache local** usando IndexedDB para funcionamento offline
- **Fila de sincronização** para operações offline
- **Migração automática** de dados do localStorage

### Configuração Inicial

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com/)
2. Configure o Firestore Database
3. Obtenha as credenciais da aplicação web
4. Crie o arquivo `.env.local` com as credenciais (veja `Doc/FIREBASE_SETUP.md`)

Para instruções detalhadas, consulte: [`Doc/FIREBASE_SETUP.md`](Doc/FIREBASE_SETUP.md)

## 📋 Funcionalidades Implementadas

### Sprint 1: Base Sólida ✅

- ✅ **Infraestrutura base**: Vite, ESLint, Prettier configurados
- ✅ **Sistema de roteamento SPA**: Navegação sem refresh
- ✅ **Estado global**: Store com localStorage e migração v2→v3
- ✅ **Navegação mobile-first**: Menu hamburguer e sidebar responsiva
- ✅ **Dashboard Home**: Timeline "AGORA", tarefas atrasadas, métricas
- ✅ **Design system**: Variáveis CSS, componentes base
- ✅ **Componentes touch-friendly**: Áreas de toque adequadas (44x44px)

### Sprint 2: Estudos Útil ✅

- ✅ **Parser Natural Language**: Comandos tipo `"Python @udemy #urgente :2h"`
- ✅ **Input Universal com Autocomplete**: Campo inteligente com sugestões
- ✅ **Kanban 4 Colunas**: Prioridade | Revisões | Em Andamento | Concluídos
- ✅ **Sistema de Revisão Espaçada**: Algoritmo SM-2 simplificado
- ✅ **Timer Pomodoro**: Cronômetro integrado com auto-save
- ✅ **Campo de Notas Rápidas**: Anotações com markdown básico

### Sprint 3: Polimento ✅

- ✅ **Cards Estilo iOS**: Visual moderno com sombras e bordas arredondadas
- ✅ **Checkbox Animado iOS-Style**: Checkbox circular com animações
- ✅ **Kanban 3 Colunas**: Simplificação para Projetos (A Fazer | Fazendo | Feito)
- ✅ **Service Worker Offline-First**: Cache de assets e funcionamento offline
- ✅ **Swipe Gestures Mobile**: Gestos touch para ações rápidas
- ✅ **Views Completas**: Rotina e Projetos implementadas

## 🔄 Migrações de Dados

### Migração v2 → v3

O sistema possui migração automática de dados da versão 2 para versão 3.

### Migração localStorage → Firebase

Na primeira inicialização, o sistema migra automaticamente todos os dados do localStorage para o Firebase Firestore. Os dados originais são preservados no localStorage como backup.

### Como Funciona

1. **Migração Automática**: Ao inicializar a aplicação, o `store.js` verifica dados v2 no localStorage
2. **Dados Migrados**:
   - `tarefas_projetos_v2` → `tarefas` (no estado v3)
   - `tarefas_rotina_v5` → `tarefasRotina`
   - `historico_rotina_v5` → `historico`
   - `categorias_rotina_v4` → `categorias`
   - `estudos_dados_v2` → `areasEstudo`, `topicosEstudo`, etc.
   - `avaliacoes_diarias_v1` → `avaliacoesDiarias`

3. **Flag de Migração**: Após migrar, uma flag `gerenciador_v3_migrated` é setada para evitar migrações duplicadas

4. **Backup Automático**: Os dados originais do v2 são mantidos no localStorage (não deletados)

### Migração Manual (Script Standalone)

Existe um script standalone em `sprint3/epico-3.4/migracao-v2-v3.js` que pode ser executado manualmente se necessário:

```javascript
// Exemplo de uso (seria executado em contexto apropriado)
import { migrateFromV2 } from './sprint3/epico-3.4/migracao-v2-v3.js';
migrateFromV2();
```

### Rollback

Se necessário reverter a migração:

1. Os dados v2 originais ainda estão no localStorage
2. Limpar a flag `gerenciador_v3_migrated`: `localStorage.removeItem('gerenciador_v3_migrated')`
3. Limpar dados v3: `localStorage.removeItem('gerenciador_v3_state')`
4. Recarregar a aplicação

## 🎨 Design System

### Cores

```css
--color-primary: #007AFF         /* Cor primária */
--color-success: #34C759         /* Sucesso */
--color-danger: #FF3B30          /* Erro/Perigo */
--color-warning: #FF9500         /* Aviso */
```

### Espaçamento

Sistema baseado em múltiplos de 4px:

```css
--spacing-xs: 4px    /* 1 unidade */
--spacing-sm: 8px    /* 2 unidades */
--spacing-md: 16px   /* 4 unidades */
--spacing-lg: 24px   /* 6 unidades */
--spacing-xl: 32px   /* 8 unidades */
```

### Tipografia

```css
--font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
--font-size-base: 16px    /* Base (evita zoom iOS) */
--font-weight-medium: 500
--font-weight-semibold: 600
```

### Breakpoints

```css
--breakpoint-mobile: 768px
--breakpoint-tablet: 1024px
--breakpoint-desktop: 1280px
```

## 📱 PWA (Progressive Web App)

O aplicativo funciona como PWA:

- **Service Worker**: Cache de assets e funcionamento offline
- **Manifest**: Configuração para instalação
- **Offline Support**: Indicador visual de status online/offline

### Instalação como PWA

1. Acessar o site no navegador mobile ou desktop
2. Selecionar "Adicionar à tela inicial" / "Install App"
3. O aplicativo será instalado e funcionará offline

## 🧪 Testes

### E2E com Playwright

Os testes E2E cobrem os principais fluxos:

- **Dashboard**: Criação e conclusão de tarefas
- **Navegação**: Navegação entre módulos
- **Persistência**: Salvamento no localStorage
- **Quick Add**: Criação rápida de tópicos de estudo

### Executar Testes

```bash
# Todos os testes
npm run test:e2e

# Com interface visual
npm run test:e2e:ui

# Ver navegador
npm run test:e2e:headed
```

### Adicionar Novos Testes

Criar arquivo em `tests/e2e/nome-do-teste.spec.js`:

```javascript
import { test, expect } from '@playwright/test';

test('descrição do teste', async ({ page }) => {
  await page.goto('/');
  // ... ações e asserções
});
```

## 🔧 Desenvolvimento

### Adicionar Nova View

1. Criar arquivo em `src/views/NovaView.js`
2. Exportar função `renderNovaView()` compatível com o router
3. Adicionar rota em `src/router.js`:

```javascript
export const routes = {
  '/nova': () => import('./views/NovaView.js').then(m => m.default),
  // ...
};
```

### Adicionar Novo Componente

1. Criar arquivo em `src/components/NovoComponente.js`
2. Exportar classe ou função
3. Importar onde necessário
4. Adicionar estilos em `src/styles/` se necessário

### Padrões de Código

- **ES6 Modules**: Usar `import/export`
- **Componentes**: Classes ou funções puras
- **CSS**: Variáveis CSS para temas e consistência
- **Mobile-First**: Sempre desenvolver pensando mobile primeiro
- **Acessibilidade**: Labels apropriados, ARIA quando necessário

## 📝 Notas de Desenvolvimento

- **Vanilla JS**: Sem frameworks, apenas JavaScript moderno
- **Vite**: Build tool rápido com HMR
- **Firebase Firestore**: Persistência em nuvem com suporte offline
- **IndexedDB**: Cache local para funcionamento offline completo
- **PWA Ready**: Funciona offline e pode ser instalado
- **iOS-like Design**: Visual inspirado no iOS 17

## 🐛 Troubleshooting

### Dados não persistem

- Verificar se as credenciais do Firebase estão configuradas (`.env.local`)
- Verificar as regras de segurança do Firestore no Firebase Console
- Verificar a conexão com a internet
- Os dados são salvos em cache local mesmo offline

### Service Worker não atualiza

- Fechar todas as abas do site
- Limpar cache do navegador
- Recarregar a página

### Rotas não funcionam

- Verificar se está usando `data-route` nos links
- Ou usar o método `router.navigate('/rota')`

## 📚 Recursos Adicionais

- **BACKLOG_V3.md**: Documento completo do backlog v3.0
- **Doc/**: Documentação adicional dos módulos
- **tests/e2e/README.md**: Documentação dos testes

## 📄 Licença

Projeto pessoal - Uso interno

## 🤝 Contribuindo

Este é um projeto pessoal, mas sugestões são bem-vindas!

---

**Última atualização**: Novembro 2025  
**Versão**: 3.0.0
