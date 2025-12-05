# Product Requirements Document (PRD)
## Gerenciador Pedro v3.0 - Estrutura Geral

**Versão:** 3.0.0  
**Data:** Novembro 2025  
**Status:** Em Produção

---

## 1. Visão Geral do Produto

### 1.1 Descrição
O **Gerenciador Pedro v3.0** é uma aplicação web progressiva (PWA) de gerenciamento pessoal focada em produtividade e uso diário. O sistema oferece uma plataforma unificada para gerenciamento de tarefas, estudos, projetos, rotinas e acompanhamento terapêutico, com suporte offline-first e sincronização em nuvem.

### 1.2 Proposta de Valor
- **Produtividade Pessoal**: Sistema centralizado para gerenciar múltiplos aspectos da vida pessoal
- **Offline-First**: Funciona completamente offline com sincronização automática quando online
- **Mobile-First**: Interface otimizada para dispositivos móveis com gestos touch
- **Sem Dependências de Framework**: Implementação vanilla JavaScript para performance e portabilidade
- **PWA**: Instalável como aplicativo nativo em dispositivos móveis e desktop

### 1.3 Público-Alvo
- Usuário individual (uso pessoal)
- Foco em produtividade e organização pessoal
- Necessidade de sincronização entre dispositivos
- Preferência por aplicações leves e rápidas

---

## 2. Objetivos e Escopo

### 2.1 Objetivos Principais
1. **Centralização**: Unificar múltiplos aspectos de gerenciamento pessoal em uma única aplicação
2. **Acessibilidade**: Funcionar em qualquer dispositivo com navegador moderno
3. **Confiabilidade**: Garantir persistência de dados mesmo em condições offline
4. **Performance**: Interface responsiva e rápida, mesmo em dispositivos de baixo poder
5. **Manutenibilidade**: Código limpo, documentado e testável

### 2.2 Escopo do Produto

#### Incluído
- ✅ Dashboard principal com visão geral
- ✅ Módulo de Estudos (para mpv colocar apenas um input sera implementado.)
- ✅ Módulo de Projetos (Kanban 3 colunas)
- ✅ Módulo de Rotina
- ✅ Módulo Terapêutico (apenas redirecionara para um site já criado.)
- ✅ Sincronização Firebase Firestore (sincronizar modulo estudos,projetos,rotina.)
- ✅ Cache local (IndexedDB)
- ✅ Service Worker para offline
- ✅ PWA com manifest
- ✅ Testes E2E com Playwright


---

## 3. Arquitetura e Estrutura Técnica

### 3.1 Stack Tecnológico

#### Frontend
- **Runtime**: JavaScript ES6+ (Vanilla JS)
- **Build Tool**: Vite 5.0+
- **CSS**: CSS3 com variáveis customizadas (Design System)
- **Roteamento**: Router SPA customizado (lazy loading)
- **Estado**: Store global com padrão Observer

#### Persistência
- **Cloud**: Firebase Firestore
- **Cache Local**: IndexedDB (via biblioteca `idb`)
- **Fallback**: localStorage (migração v2→v3)

#### Testes
- **E2E**: Playwright 1.40+
- **Cobertura**: Testes de fluxos críticos

#### DevOps
- **CI/CD**: GitHub Actions
- **Deploy**: GitHub Pages
- **Build**: Vite build otimizado

### 3.2 Arquitetura de Alto Nível

```
┌─────────────────────────────────────────────────┐
│              Browser (PWA)                      │
├─────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐            │
│  │  index.html  │  │ estudos.html │            │
│  └──────┬───────┘  └──────┬───────┘            │
│         │                  │                     │
│  ┌──────▼──────────────────▼───────┐            │
│  │      Router (SPA)               │            │
│  └──────┬──────────────────────────┘            │
│         │                                         │
│  ┌──────▼──────────────────────────┐            │
│  │      Views (Home, Estudos, etc) │            │
│  └──────┬──────────────────────────┘            │
│         │                                         │
│  ┌──────▼──────────────────────────┐            │
│  │      Components                 │            │
│  └──────┬──────────────────────────┘            │
│         │                                         │
│  ┌──────▼──────────────────────────┐            │
│  │      Store (Estado Global)      │            │
│  └──────┬──────────────────────────┘            │
│         │                                         │
│  ┌──────▼──────────────────────────┐            │
│  │   Firebase Service              │            │
│  └──────┬──────────────────────────┘            │
│         │                                         │
│  ┌──────▼──────────┐  ┌──────────────┐        │
│  │  Firebase Cache │  │ Firebase Sync│        │
│  │  (IndexedDB)    │  │  (Offline)    │        │
│  └──────────────────┘  └──────────────┘        │
└─────────────────────────────────────────────────┘
         │                    │
         ▼                    ▼
┌─────────────────┐  ┌─────────────────┐
│  Firebase       │  │  Service Worker│
│  Firestore      │  │  (Cache Assets) │
└─────────────────┘  └─────────────────┘
```

### 3.3 Estrutura de Diretórios

```
demandas/
├── src/                          # Código fonte principal
│   ├── main.js                  # Entry point da aplicação
│   ├── main-estudos.js          # Entry point do módulo Estudos
│   ├── router.js                # Sistema de roteamento SPA
│   ├── store.js                 # Estado global com Firebase
│   ├── config/                  # Configurações
│   │   └── firebase.js          # Configuração Firebase
│   ├── services/                # Serviços
│   │   ├── firebase-service.js  # Serviço principal Firebase
│   │   ├── firebase-cache.js    # Cache local (IndexedDB)
│   │   └── firebase-sync.js     # Sincronização offline/online
│   ├── components/              # Componentes reutilizáveis
│   │   ├── Breadcrumb.js        # Navegação contextual
│   │   ├── Checkbox.js          # Checkbox base
│   │   ├── MenuHamburguer.js    # Menu mobile
│   │   ├── Sidebar.js           # Sidebar de navegação
│   │   ├── TaskCard.js          # Card de tarefa
│   │   ├── Toast.js             # Notificações
│   │   ├── ios-cards.js         # Cards estilo iOS
│   │   ├── ios-checkbox.js      # Checkbox estilo iOS
│   │   └── estudos/             # Componentes do módulo Estudos
│   │       ├── QuickAddInput.js # Input de criação rápida
│   │       ├── QuickAddParser.js# Parser de comandos naturais
│   │       ├── KanbanEstudos.js # Kanban 4 colunas
│   │       ├── PomodoroTimer.js # Timer Pomodoro
│   │       ├── NotasRapidas.js  # Campo de notas
│   │       └── RevisaoEspacada.js # Sistema de revisão
│   ├── views/                   # Views/Páginas
│   │   ├── Home.js              # Dashboard principal
│   │   ├── Rotina.js            # Tarefas de rotina
│   │   ├── Projetos.js          # Projetos (Kanban)
│   │   ├── Estudos.js            # Módulo de Estudos
│   │   ├── EstudosView.js       # View principal de Estudos
│   │   └── Terapeutico.js       # Módulo terapêutico
│   ├── utils/                   # Utilitários
│   │   ├── dateUtils.js         # Funções de data
│   │   ├── taskFilters.js       # Filtros de tarefas
│   │   ├── estudos-store.js     # Store específico de Estudos
│   │   ├── kanban-3-colunas.js  # Utilitário Kanban
│   │   ├── swipe-gestures.js    # Gestos touch
│   │   └── migrate-localStorage-to-firebase.js # Script de migração
│   └── styles/                  # Estilos CSS
│       ├── variables.css        # Variáveis CSS (design system)
│       ├── reset.css            # Reset CSS
│       ├── components.css       # Estilos de componentes
│       ├── mobile.css           # Estilos mobile-first
│       ├── sidebar.css          # Estilos da sidebar
│       ├── breadcrumb.css       # Estilos de breadcrumb
│       ├── task-card.css        # Estilos de cards
│       ├── home.css             # Estilos do dashboard
│       ├── checkbox.css         # Estilos de checkbox
│       ├── toast.css            # Estilos de toast
│       ├── estudos.css          # Estilos do módulo Estudos
│       ├── rotina.css           # Estilos da view Rotina
│       ├── projetos.css         # Estilos da view Projetos
│       └── app.css              # Estilos globais
├── public/                      # Arquivos estáticos públicos
│   ├── manifest.json            # Manifest do PWA
│   └── service-worker.js        # Service Worker (offline)
├── sprint2/                     # Código do Sprint 2 (referência)
├── sprint3/                     # Código do Sprint 3 (referência)
├── tests/                       # Testes E2E
│   └── e2e/
│       ├── dashboard.spec.js    # Testes do dashboard
│       ├── navigation.spec.js  # Testes de navegação
│       ├── persistence.spec.js # Testes de persistência
│       ├── quick-add.spec.js   # Testes do Quick Add
│       ├── estudos.spec.js     # Testes do módulo Estudos
│       ├── projetos.spec.js    # Testes do módulo Projetos
│       ├── rotina.spec.js      # Testes do módulo Rotina
│       └── README.md           # Documentação dos testes
├── .context/                    # Contexto para AI Agents
│   ├── docs/                    # Documentação técnica
│   └── agents/                  # Playbooks de agentes especializados
├── index.html                   # HTML principal
├── estudos.html                 # HTML do módulo Estudos
├── vite.config.js              # Configuração do Vite
├── package.json                 # Dependências e scripts
├── playwright.config.js         # Configuração do Playwright
└── README.md                    # Documentação do projeto
```

### 3.4 Padrões Arquiteturais

#### 3.4.1 Padrão Observer
- **Store**: Gerencia estado global com subscribers
- **Router**: Notifica mudanças de rota para componentes

#### 3.4.2 Lazy Loading
- **Views**: Carregamento sob demanda via dynamic imports
- **Componentes**: Importação apenas quando necessário

#### 3.4.3 Offline-First
- **Cache First**: Dados carregados do cache local primeiro
- **Sync Queue**: Operações offline enfileiradas para sincronização
- **Service Worker**: Cache de assets estáticos

#### 3.4.4 Mobile-First
- **CSS**: Estilos mobile como base, desktop como enhancement
- **Touch Gestures**: Suporte a gestos swipe
- **Responsive**: Breakpoints para mobile, tablet e desktop

---

## 4. Funcionalidades Principais

### 4.1 Dashboard (Home)

#### 4.1.1 Visão Geral
- **Timeline "AGORA"**: Tarefas que devem ser feitas agora
- **Tarefas Atrasadas**: Lista de tarefas com prazo vencido
- **Métricas**: Contadores de tarefas por status
- **Quick Actions**: Ações rápidas para criação de tarefas

#### 4.1.2 Requisitos Funcionais
- RF-HOME-001: Exibir tarefas do dia atual na timeline "AGORA"
- RF-HOME-002: Destacar tarefas atrasadas com indicador visual
- RF-HOME-003: Exibir métricas atualizadas em tempo real
- RF-HOME-004: Permitir criação rápida de tarefas via Quick Add

### 4.2 Módulo de Estudos

#### 4.2.1 Visão Geral
Sistema completo para gerenciamento de estudos, focado em aprendizado contínuo e revisão.

#### 4.2.2 Funcionalidades Implementadas
- **Kanban de Estudos**: Fluxo de 4 colunas (A Fazer, Em foco, Revisão, Concluído)
- **Pomodoro Timer**: Timer integrado para sessões de foco
- **Revisão Espaçada**: Sistema de agendamento de revisões automáticas
- **Notas Rápidas**: Captura de insights durante o estudo
- **Quick Add**: Adição rápida de tópicos com parser de texto natural

### 4.3 Módulo de Projetos

#### 4.3.1 Visão Geral
Kanban simplificado de 3 colunas para gerenciamento de projetos.

#### 4.3.2 Funcionalidades
- RF-PROJ-001: Kanban 3 colunas: A Fazer | Fazendo | Feito
- RF-PROJ-002: Drag & drop entre colunas
- RF-PROJ-003: Cards com informações do projeto
- RF-PROJ-004: Filtros e busca de projetos
- RF-PROJ-005: Indicadores de progresso

### 4.4 Módulo de Rotina

#### 4.4.1 Visão Geral
Gerenciamento de tarefas rotineiras com categorias e histórico.

#### 4.4.2 Funcionalidades
- RF-ROT-001: Lista de tarefas rotineiras
- RF-ROT-002: Categorização de tarefas
- RF-ROT-003: Histórico de execução
- RF-ROT-004: Estatísticas de frequência
- RF-ROT-005: Marcação de conclusão com data/hora

### 4.5 Módulo de Criação

#### 4.5.1 Visão Geral
Workspace dedicado para tarefas criativas e desenvolvimento de ideias, separado do fluxo operacional diário.

#### 4.5.2 Funcionalidades
- **Kanban de Criação**: Inbox, A Fazer, Em Progresso, Feito
- **Filtros de Contexto**: Filtragem por contexto (Dev, Design, Writing, etc.)
- **Templates**: Criação de tarefas baseadas em modelos reutilizáveis
- **Integração IA**: Funcionalidade para importar/gerar tarefas via IA (placeholder/botão)
- **Inbox Zero**: Ferramentas para processar e limpar a caixa de entrada

### 4.6 Módulo Terapêutico

#### 4.6.1 Visão Geral
Espaço reservado para integração futura com ferramentas de bem-estar. Atualmente implementado como uma view informativa (stub).

### 4.7 Sistema de Navegação

#### 4.6.1 Funcionalidades
- RF-NAV-001: Sidebar responsiva com menu hamburguer
- RF-NAV-002: Breadcrumb contextual
- RF-NAV-003: Navegação SPA sem refresh
- RF-NAV-004: Histórico do browser (back/forward)
- RF-NAV-005: Links ativos destacados

### 4.7 Persistência e Sincronização

#### 4.7.1 Funcionalidades
- RF-SYNC-001: Sincronização automática com Firebase Firestore
- RF-SYNC-002: Cache local em IndexedDB
- RF-SYNC-003: Funcionamento offline completo
- RF-SYNC-004: Fila de sincronização para operações offline
- RF-SYNC-005: Migração automática de dados v2→v3
- RF-SYNC-006: Migração automática localStorage→Firebase
- RF-SYNC-007: Indicador visual de status online/offline
- RF-SYNC-008: Resolução de conflitos (last-write-wins)

---

## 5. Requisitos Não-Funcionais


### 5.2 Usabilidade
- **RNF-USAB-001**: Interface mobile-first otimizada para touch
- **RNF-USAB-002**: Áreas de toque mínimas de 44x44px
- **RNF-USAB-003**: Feedback visual imediato em todas as ações
- **RNF-USAB-004**: Mensagens de erro claras e acionáveis
- **RNF-USAB-005**: Navegação intuitiva com breadcrumbs

### 5.3 Acessibilidade
- **RNF-ACESS-001**: Suporte a leitores de tela (ARIA labels)
- **RNF-ACESS-002**: Navegação por teclado
- **RNF-ACESS-003**: Contraste adequado (WCAG AA)
- **RNF-ACESS-004**: Tamanho de fonte configurável (mínimo 16px)

### 5.4 Confiabilidade
- **RNF-CONF-001**: Funcionamento offline completo
- **RNF-CONF-002**: Persistência garantida mesmo em falhas
- **RNF-CONF-003**: Sincronização automática quando online
- **RNF-CONF-004**: Tratamento de erros de rede
- **RNF-CONF-005**: Backup automático de dados críticos

### 5.5 Segurança
- **RNF-SEG-001**: Dados sensíveis armazenados localmente (não enviados)
- **RNF-SEG-002**: Regras de segurança Firebase configuradas
- **RNF-SEG-003**: HTTPS obrigatório em produção
- **RNF-SEG-004**: Validação de inputs do usuário

### 5.6 Compatibilidade
- **RNF-COMP-001**: Suporte a navegadores modernos (Chrome, Firefox, Safari, Edge)
- **RNF-COMP-002**: Suporte a dispositivos móveis (iOS, Android)
- **RNF-COMP-003**: PWA instalável em mobile e desktop
- **RNF-COMP-004**: Responsive design (mobile, tablet, desktop)

### 5.7 Manutenibilidade
- **RNF-MANT-001**: Código documentado e comentado
- **RNF-MANT-002**: Padrões de código consistentes (ESLint, Prettier)
- **RNF-MANT-003**: Testes E2E para fluxos críticos
- **RNF-MANT-004**: Estrutura modular e reutilizável
- **RNF-MANT-005**: Documentação técnica atualizada

---

## 6. Estrutura de Dados

### 6.1 Estado Global (Store)

```javascript
{
  // Tarefas
  tarefas: [
    {
      id: string,
      titulo: string,
      descricao?: string,
      status: 'pendente' | 'em-andamento' | 'concluida',
      prioridade: 'baixa' | 'media' | 'alta' | 'urgente',
      prazo?: timestamp,
      projeto?: string,
      categoria?: string,
      criadoEm: timestamp,
      atualizadoEm: timestamp
    }
  ],
  
  // Rotina
  tarefasRotina: [
    {
      id: string,
      titulo: string,
      categoria: string,
      frequencia: 'diaria' | 'semanal' | 'mensal',
      ultimaExecucao?: timestamp,
      historico: timestamp[]
    }
  ],
  
  historico: [
    {
      id: string,
      tarefaId: string,
      data: timestamp,
      observacoes?: string
    }
  ],
  
  categorias: [
    {
      id: string,
      nome: string,
      cor?: string,
      icone?: string
    }
  ],
  
  // Estudos
  areasEstudo: [
    {
      id: string,
      nome: string,
      descricao?: string
    }
  ],
  
  
  // Configurações
  configuracoes: {
    tema: 'claro' | 'escuro' | 'auto',
    notificacoes: boolean,
    pomodoroDuracao: number, // minutos
    // ...
  }
}
```

### 6.2 Estrutura Firebase Firestore

```
/users/{userId}/
  /tarefas/{tarefaId}
  /tarefasRotina/{tarefaId}
  /historico/{historicoId}
  /categorias/{categoriaId}
  /areasEstudo/{areaId}
  /topicosEstudo/{topicoId}
  /avaliacoesDiarias/{avaliacaoId}
  /configuracoes
```

### 6.3 Cache Local (IndexedDB)

```
gerenciador-v3-cache/
  /state (estado completo)
  /sync-queue (fila de sincronização)
  /metadata (metadados de cache)
```

---

## 7. Fluxos de Dados

### 7.1 Fluxo de Criação de Tarefa

```
1. Usuário cria tarefa via UI
   ↓
2. Componente atualiza Store local
   ↓
3. Store notifica subscribers (UI atualiza)
   ↓
4. Store salva no IndexedDB (cache)
   ↓
5. Store envia para Firebase (se online)
   ↓
6. Firebase retorna confirmação
   ↓
7. Store atualiza estado com ID do Firebase
```

### 7.2 Fluxo Offline

```
1. Usuário cria tarefa (offline)
   ↓
2. Store salva no IndexedDB
   ↓
3. Store adiciona à fila de sincronização
   ↓
4. Service Worker detecta conexão
   ↓
5. Store processa fila de sincronização
   ↓
6. Dados sincronizados com Firebase
   ↓
7. Fila limpa após sucesso
```

### 7.3 Fluxo de Carregamento Inicial

```
1. Aplicação inicia
   ↓
2. Store carrega do IndexedDB (cache)
   ↓
3. UI renderiza com dados do cache
   ↓
4. Store verifica conexão
   ↓
5. Se online: sincroniza com Firebase
   ↓
6. Atualiza cache local com dados do Firebase
   ↓
7. UI atualiza se houver mudanças
```

### 7.4 Fluxo de Migração v2→v3

```
1. Aplicação detecta dados v2 no localStorage
   ↓
2. Executa script de migração
   ↓
3. Converte estrutura v2 para v3
   ↓
4. Salva no estado v3
   ↓
5. Migra para Firebase (se configurado)
   ↓
6. Mantém backup no localStorage
   ↓
7. Marca flag de migração concluída
```

---

## 8. Integrações

### 8.1 Firebase Firestore

#### 8.1.1 Propósito
- Persistência em nuvem
- Sincronização entre dispositivos
- Backup automático

#### 8.1.2 Configuração
- Credenciais via `.env.local`
- Regras de segurança configuradas
- Estrutura de coleções documentada

#### 8.1.3 Autenticação
- Atualmente: usuário único (default)
- Futuro: suporte multi-usuário

### 8.2 Service Worker

#### 8.2.1 Propósito
- Cache de assets estáticos
- Funcionamento offline
- Atualizações em background

#### 8.2.2 Estratégia
- **Cache First**: Assets estáticos
- **Network First**: Dados dinâmicos (com fallback para cache)

### 8.3 IndexedDB (via idb)

#### 8.3.1 Propósito
- Cache local de dados
- Funcionamento offline
- Performance (acesso rápido)

#### 8.3.2 Estrutura
- Store de estado completo
- Fila de sincronização
- Metadados de cache

---

## 9. Design System

### 9.1 Cores

```css
--color-primary: #007AFF         /* Cor primária (iOS blue) */
--color-success: #34C759         /* Sucesso */
--color-danger: #FF3B30          /* Erro/Perigo */
--color-warning: #FF9500         /* Aviso */
--color-info: #5AC8FA            /* Informação */
--color-background: #F2F2F7       /* Fundo (iOS gray) */
--color-surface: #FFFFFF         /* Superfície */
--color-text: #000000            /* Texto principal */
--color-text-secondary: #8E8E93  /* Texto secundário */
```

### 9.2 Espaçamento

Sistema baseado em múltiplos de 4px:

```css
--spacing-xs: 4px    /* 1 unidade */
--spacing-sm: 8px    /* 2 unidades */
--spacing-md: 16px   /* 4 unidades */
--spacing-lg: 24px   /* 6 unidades */
--spacing-xl: 32px   /* 8 unidades */
--spacing-2xl: 48px  /* 12 unidades */
```

### 9.3 Tipografia

```css
--font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
--font-size-xs: 12px
--font-size-sm: 14px
--font-size-base: 16px    /* Base (evita zoom iOS) */
--font-size-lg: 18px
--font-size-xl: 20px
--font-size-2xl: 24px
--font-weight-regular: 400
--font-weight-medium: 500
--font-weight-semibold: 600
--font-weight-bold: 700
```

### 9.4 Breakpoints

```css
--breakpoint-mobile: 768px
--breakpoint-tablet: 1024px
--breakpoint-desktop: 1280px
```

### 9.5 Componentes Base

- **Cards**: Estilo iOS com sombras e bordas arredondadas
- **Checkbox**: Circular com animações iOS-style
- **Buttons**: Touch-friendly (mínimo 44x44px)
- **Inputs**: Estilo iOS com foco visual
- **Toast**: Notificações não-intrusivas

---

## 10. Testes

### 10.1 Estratégia de Testes

#### 10.1.1 Testes E2E (Playwright)
- **Cobertura**: Fluxos críticos de usuário
- **Ambiente**: Navegadores modernos (Chromium, Firefox, WebKit)
- **Execução**: CI/CD e local

#### 10.1.2 Testes Manuais
- **Responsividade**: Diferentes tamanhos de tela
- **Offline**: Funcionamento sem conexão
- **Sincronização**: Múltiplos dispositivos

### 10.2 Casos de Teste Principais

#### 10.2.1 Dashboard
- TC-DASH-001: Exibição de tarefas do dia
- TC-DASH-002: Criação rápida de tarefa
- TC-DASH-003: Navegação entre módulos

#### 10.2.2 Estudos
- TC-EST-001: Criação de tópico via Quick Add
- TC-EST-002: Parser de comandos naturais
- TC-EST-003: Drag & drop no Kanban
- TC-EST-004: Timer Pomodoro
- TC-EST-005: Sistema de revisão espaçada

#### 10.2.3 Persistência
- TC-PERS-001: Salvamento offline
- TC-PERS-002: Sincronização online
- TC-PERS-003: Migração v2→v3
- TC-PERS-004: Recuperação após falha

---



## 14. Glossário

- **PWA**: Progressive Web App - Aplicação web que funciona como app nativo
- **SPA**: Single Page Application - Aplicação de página única
- **Firestore**: Banco de dados NoSQL do Firebase
- **IndexedDB**: API de banco de dados do navegador
- **Service Worker**: Script que roda em background para cache e offline
- **Lazy Loading**: Carregamento sob demanda de recursos
- **Offline-First**: Arquitetura que prioriza funcionamento offline
- **SM-2**: Algoritmo de repetição espaçada para memorização
- **Pomodoro**: Técnica de gerenciamento de tempo (25min de foco)

---

## 15. Referências

### 15.1 Documentação Técnica
- [Architecture Notes](.context/docs/architecture.md)
- [Data Flow](.context/docs/data-flow.md)
- [Tooling Guide](.context/docs/tooling.md)
- [README Principal](README.md)

### 15.2 Recursos Externos
- [Vite Documentation](https://vitejs.dev/)
- [Firebase Firestore](https://firebase.google.com/docs/firestore)
- [Playwright](https://playwright.dev/)
- [PWA Guide](https://web.dev/progressive-web-apps/)

---

**Documento mantido por**: Equipe de Desenvolvimento  
**Última atualização**: Novembro 2025  
**Próxima revisão**: Conforme evolução do produto

