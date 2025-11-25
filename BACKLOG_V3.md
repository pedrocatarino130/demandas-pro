# 📋 BACKLOG v3.0 - Gerenciador Pedro

**Versão:** 3.0.0  
**Data de Criação:** 22/11/2025  
**Status:** 📋 Em Planejamento  

---

## 📊 RESUMO EXECUTIVO

### Visão Geral

Este backlog contém **24 tarefas** organizadas em **3 sprints de 2 semanas cada**, totalizando **~152 horas** de desenvolvimento estimadas.

### Distribuição por Sprint

| Sprint | Tarefas | Horas | Complexidade |
|--------|---------|-------|--------------|
| **Sprint 1: Base Sólida** | 11 | 60h | 3P, 7M, 1G |
| **Sprint 2: Estudos Útil** | 6 | 44h | 1P, 4M, 1G |
| **Sprint 3: Polimento** | 7 | 48h | 1P, 6M |
| **TOTAL** | **24** | **~152h** | **5P, 17M, 2G** |

### Objetivo Principal

Criar um sistema que Pedro **USE TODO DIA**, com foco em:
- ✅ Entrada rápida de dados (menos cliques)
- ✅ Clareza visual profissional
- ✅ Dashboard central "O que fazer AGORA"
- ✅ Módulo Estudos útil e rápido

### Métricas de Sucesso

- **Uso diário consistente por 30 dias** (vs. 7 dias atual)
- **Tempo de cadastro de tópico de estudo: < 30 segundos** (vs. horas)
- **NPS do próprio Pedro: 9/10** (vs. atual ~3/10 estimado)

---

## 🚀 SPRINT 1: "BASE SÓLIDA" (Semanas 1-2)

**Meta:** Home funcional + Navegação clara = Pedro sabe "o que fazer agora" em < 3 segundos

### 📦 ÉPICO 1.1: INFRAESTRUTURA BASE

#### [TASK-001] Setup Ambiente de Desenvolvimento v3.0

**Status:** ⬜ Pendente  
**Prioridade:** 🔴 Crítica  
**Estimativa:** P (4h)  
**Dependências:** Nenhuma

**Descrição:**  
Configurar branch isolado e estrutura base do projeto v3.0

**Contexto:**  
Necessário para manter v2 funcional enquanto desenvolve v3

**Critérios de Aceitação:**
- [ ] Branch `v3-refactor` criado a partir da main
- [ ] Estrutura de pastas reorganizada (components/, views/, utils/, styles/)
- [ ] Vite configurado para build otimizado
- [ ] ESLint + Prettier configurados
- [ ] README v3.0 com instruções de desenvolvimento

**Técnico:**
- Stack: Vite, ESLint, Prettier
- Padrão: Feature-based folder structure
- Comando: `npm create vite@latest gerenciador-v3 -- --template vanilla`

---

#### [TASK-002] Sistema de Roteamento SPA

**Status:** ⬜ Pendente  
**Prioridade:** 🔴 Crítica  
**Estimativa:** M (8h)  
**Dependências:** TASK-001

**Descrição:**  
Implementar router client-side para navegação sem refresh

**Contexto:**  
Base para menu hamburguer e navegação fluida

**Critérios de Aceitação:**
- [ ] Router vanilla JS implementado (ou biblioteca leve como page.js)
- [ ] Rotas: /, /projetos, /estudos, /rotina, /terapeutico
- [ ] Navegação sem refresh de página
- [ ] Histórico do browser funcionando (back/forward)
- [ ] Deep linking suportado

**Técnico:**
```javascript
// router.js
const routes = {
  '/': () => import('./views/Home.js'),
  '/estudos': () => import('./views/Estudos.js'),
  // ...lazy loading
}
```

---

#### [TASK-003] Sistema de Estado Global

**Status:** ⬜ Pendente  
**Prioridade:** 🔴 Crítica  
**Estimativa:** M (8h)  
**Dependências:** TASK-001

**Descrição:**  
Implementar store centralizada para dados compartilhados

**Contexto:**  
Necessário para sincronizar dados entre Dashboard e módulos

**Critérios de Aceitação:**
- [ ] Store pattern implementado (Vanilla JS ou Zustand-like)
- [ ] localStorage sincronizado automaticamente
- [ ] Observers para atualização de UI
- [ ] Debounce para saves (evitar múltiplas escritas)
- [ ] Migração de dados v2 → v3

**Técnico:**
```javascript
// store.js
class Store {
  constructor() {
    this.state = this.loadFromStorage() || defaultState;
    this.subscribers = [];
  }
  
  subscribe(callback) {
    this.subscribers.push(callback);
  }
  
  setState(updates) {
    this.state = {...this.state, ...updates};
    this.saveToStorage();
    this.notify();
  }
}
```

---

### 📦 ÉPICO 1.2: NAVEGAÇÃO MOBILE-FIRST

#### [TASK-004] Menu Hamburguer + Sidebar

**Status:** ⬜ Pendente  
**Prioridade:** 🔴 Crítica  
**Estimativa:** M (6h)  
**Dependências:** TASK-002

**Descrição:**  
Implementar navegação responsiva com menu lateral

**Contexto:**  
Pedro se perde entre abas, precisa navegação clara

**Critérios de Aceitação:**
- [ ] Hamburguer menu mobile (< 768px)
- [ ] Sidebar fixa desktop (> 1024px)
- [ ] Animação slide-in suave (transform: translateX)
- [ ] Overlay escuro ao abrir mobile
- [ ] Fecha ao clicar fora ou em item
- [ ] Estado ativo destacado

**Técnico:**
- CSS Variables para breakpoints
- Transform + transition para animações
- Event delegation para clicks

---

#### [TASK-005] Breadcrumbs Contextuais

**Status:** ⬜ Pendente  
**Prioridade:** 🟠 Alta  
**Estimativa:** P (3h)  
**Dependências:** TASK-002

**Descrição:**  
Implementar trilha de navegação para orientação

**Contexto:**  
Usuário precisa saber onde está na aplicação

**Critérios de Aceitação:**
- [ ] Componente Breadcrumb reutilizável
- [ ] Formato: Home > Módulo > Item
- [ ] Links clicáveis (exceto atual)
- [ ] Mobile: mostrar só último nível
- [ ] Desktop: mostrar caminho completo

---

### 📦 ÉPICO 1.3: DASHBOARD HOME

#### [TASK-006] Timeline "AGORA" (Próximas 2h)

**Status:** ⬜ Pendente  
**Prioridade:** 🔴 Crítica  
**Estimativa:** M (8h)  
**Dependências:** TASK-003

**Descrição:**  
Implementar seção principal do dashboard com tarefas imediatas

**Contexto:**  
Responder "O que fazer AGORA?" é o core value

**Critérios de Aceitação:**
- [ ] Filtro automático baseado em hora atual
- [ ] Mostra próximas 2h de tarefas
- [ ] Card com: horário, título, módulo, prioridade, duração
- [ ] Atualização automática a cada 1 minuto
- [ ] Badge visual para tarefa atual (borda pulsante)

**Técnico:**
```javascript
const getUpcomingTasks = (tasks, hoursAhead = 2) => {
  const now = new Date();
  const limit = addHours(now, hoursAhead);
  return tasks
    .filter(t => t.time >= now && t.time <= limit)
    .sort((a, b) => a.time - b.time);
}
```

---

#### [TASK-007] Seção "ATRASADAS"

**Status:** ⬜ Pendente  
**Prioridade:** 🔴 Crítica  
**Estimativa:** P (4h)  
**Dependências:** TASK-006

**Descrição:**  
Destacar tarefas pendentes com prazo vencido

**Contexto:**  
Visibilidade de débito técnico pessoal

**Critérios de Aceitação:**
- [ ] Badge vermelho com contagem
- [ ] Cards com indicador de atraso (X dias)
- [ ] Ordenação por prioridade + idade
- [ ] Ação rápida: adiar ou concluir
- [ ] Colapsar se > 5 tarefas

---

#### [TASK-008] Checkbox Inline (Conclusão Rápida)

**Status:** ⬜ Pendente  
**Prioridade:** 🔴 Crítica  
**Estimativa:** P (4h)  
**Dependências:** TASK-006

**Descrição:**  
Permitir conclusão de tarefas sem sair do dashboard

**Contexto:**  
Reduzir cliques de 5 para 1

**Critérios de Aceitação:**
- [ ] Checkbox clicável em cada card
- [ ] Animação de conclusão (scale + fade)
- [ ] Confetti animation opcional
- [ ] Atualização imediata do estado
- [ ] Desfazer por 5 segundos (toast)

**Técnico:**
- CSS animations para feedback visual
- Optimistic updates (atualiza UI antes de salvar)

---

#### [TASK-009] Métricas do Dia (Rodapé Dashboard)

**Status:** ⬜ Pendente  
**Prioridade:** 🟡 Média  
**Estimativa:** P (3h)  
**Dependências:** TASK-006

**Descrição:**  
Gamificação sutil com progresso diário

**Contexto:**  
Motivação para manter streak

**Critérios de Aceitação:**
- [ ] Contador: X/Y tarefas concluídas hoje
- [ ] Streak de dias consecutivos
- [ ] Barra de progresso visual
- [ ] Animação ao completar 100%

---

### 📦 ÉPICO 1.4: CSS MOBILE-FIRST

#### [TASK-010] Design System Base

**Status:** ⬜ Pendente  
**Prioridade:** 🔴 Crítica  
**Estimativa:** M (6h)  
**Dependências:** TASK-001

**Descrição:**  
Estabelecer variáveis CSS e componentes base

**Contexto:**  
Consistência visual e manutenibilidade

**Critérios de Aceitação:**
- [ ] CSS Variables: cores, espaçamentos, tipografia
- [ ] Utility classes básicas
- [ ] Reset/Normalize CSS
- [ ] Tema claro implementado
- [ ] Preparação para dark mode (variáveis)

**Técnico:**
```css
:root {
  --color-primary: #007AFF;
  --spacing-unit: 4px;
  --radius-default: 12px;
  --font-family: 'Inter', -apple-system, sans-serif;
}
```

---

#### [TASK-011] Componentes Mobile Touch-Friendly

**Status:** ⬜ Pendente  
**Prioridade:** 🔴 Crítica  
**Estimativa:** P (4h)  
**Dependências:** TASK-010

**Descrição:**  
Garantir usabilidade mobile com áreas de toque adequadas

**Contexto:**  
Pedro usa principalmente mobile

**Critérios de Aceitação:**
- [ ] Botões mínimo 44x44px
- [ ] Espaçamento entre elementos: 16px+
- [ ] Font-size base: 16px (evita zoom iOS)
- [ ] Modals fullscreen mobile
- [ ] Safe areas para iPhone X+

---

## 📚 SPRINT 2: "ESTUDOS ÚTIL" (Semanas 3-4)

**Meta:** Cadastro em 30s + Uso 3x na primeira semana

### 📦 ÉPICO 2.1: QUICK ADD INTELIGENTE

#### [TASK-012] Parser de Comandos Natural Language

**Status:** ⬜ Pendente  
**Prioridade:** 🔴 Crítica  
**Estimativa:** M (8h)  
**Dependências:** Nenhuma

**Descrição:**  
Implementar interpretador de texto para criação rápida

**Contexto:**  
Reduzir tempo de cadastro de 2min para 30s

**Critérios de Aceitação:**
- [ ] Parser reconhece: @área, #tag, :tempo, !prioridade
- [ ] Suporte a múltiplas tags
- [ ] Auto-criar área se não existir
- [ ] Inferir prioridade de tags (#urgente = alta)
- [ ] Testes unitários cobrindo casos edge

**Técnico:**
```javascript
// parser.js
const parseQuickAdd = (input) => {
  const patterns = {
    area: /@(\w+)/g,
    tags: /#(\w+)/g,
    time: /:(\d+[dhm])/g,
    priority: /!(\w+)/g
  };
  // ... extract and return structured data
}
```

---

#### [TASK-013] Input Universal com Autocomplete

**Status:** ⬜ Pendente  
**Prioridade:** 🔴 Crítica  
**Estimativa:** M (6h)  
**Dependências:** TASK-012

**Descrição:**  
Campo de entrada inteligente com sugestões

**Contexto:**  
UX similar a Todoist/Notion

**Critérios de Aceitação:**
- [ ] Input sempre visível no topo
- [ ] Autocomplete de áreas e tags existentes
- [ ] Shortcuts: Ctrl+N abre de qualquer tela
- [ ] Preview do que será criado
- [ ] Histórico de comandos recentes

---

### 📦 ÉPICO 2.2: KANBAN ESTUDOS

#### [TASK-014] View Kanban 4 Colunas

**Status:** ⬜ Pendente  
**Prioridade:** 🔴 Crítica  
**Estimativa:** G (12h)  
**Dependências:** TASK-003

**Descrição:**  
Layout de cards organizados por status

**Contexto:**  
Visualização clara do pipeline de estudos

**Critérios de Aceitação:**
- [ ] Colunas: Prioridade | Revisões | Em Andamento | Concluídos
- [ ] Cards mostram: título, %, última sessão, tags
- [ ] Drag & drop entre colunas
- [ ] Responsivo: stack vertical mobile
- [ ] Contadores por coluna

---

#### [TASK-015] Sistema de Revisão Espaçada

**Status:** ⬜ Pendente  
**Prioridade:** 🟠 Alta  
**Estimativa:** M (8h)  
**Dependências:** TASK-014

**Descrição:**  
Algoritmo de repetição para retenção

**Contexto:**  
Incentivar revisões periódicas (7, 15, 30 dias)

**Critérios de Aceitação:**
- [ ] Auto-agendar revisão após sessão
- [ ] Intervalos: 1, 3, 7, 15, 30 dias
- [ ] Notificação visual de revisões pendentes
- [ ] Ajuste baseado em dificuldade
- [ ] Histórico de revisões

**Técnico:**
- Algoritmo SM-2 simplificado
- Armazenar: lastReview, nextReview, difficulty

---

### 📦 ÉPICO 2.3: MODAL ESTUDO

#### [TASK-016] Timer Pomodoro Integrado

**Status:** ⬜ Pendente  
**Prioridade:** 🟠 Alta  
**Estimativa:** M (6h)  
**Dependências:** Nenhuma

**Descrição:**  
Cronômetro para sessões de estudo

**Contexto:**  
Gamificar e medir progresso real

**Critérios de Aceitação:**
- [ ] Timer configurável (25min padrão)
- [ ] Pausa/Resume
- [ ] Som ao finalizar
- [ ] Auto-save progresso a cada 5min
- [ ] Modo foco (esconde outras infos)

---

#### [TASK-017] Campo de Notas Rápidas

**Status:** ⬜ Pendente  
**Prioridade:** 🟡 Média  
**Estimativa:** P (4h)  
**Dependências:** TASK-016

**Descrição:**  
Área para anotações durante estudo

**Contexto:**  
Capturar insights sem sair do fluxo

**Critérios de Aceitação:**
- [ ] Textarea com markdown básico
- [ ] Auto-save a cada 30s
- [ ] Snippets/templates comuns
- [ ] Exportar notas como .md
- [ ] Busca em notas antigas

---

## 🎨 SPRINT 3: "POLIMENTO" (Semanas 5-6)

**Meta:** Visual profissional + Mobile perfeito = Uso diário por 30 dias

### 📦 ÉPICO 3.1: REDESIGN ROTINA iOS-LIKE

#### [TASK-018] Cards Estilo iOS 17

**Status:** ⬜ Pendente  
**Prioridade:** 🟠 Alta  
**Estimativa:** M (6h)  
**Dependências:** TASK-010

**Descrição:**  
Refatorar visual dos cards de rotina

**Contexto:**  
Visual "amador" é principal reclamação

**Critérios de Aceitação:**
- [ ] Bordas arredondadas (radius: 16px)
- [ ] Sombras suaves (0 4px 20px rgba)
- [ ] Tipografia SF Pro ou Inter
- [ ] Espaçamento generoso (padding: 20px)
- [ ] Cores saturadas para prioridades

**Técnico:**
```css
.task-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  padding: 20px;
  transition: transform 0.2s ease;
}
```

---

#### [TASK-019] Checkbox Animado iOS-Style

**Status:** ⬜ Pendente  
**Prioridade:** 🟠 Alta  
**Estimativa:** P (4h)  
**Dependências:** TASK-018

**Descrição:**  
Checkbox circular com animação de check

**Contexto:**  
Detalhe que traz sensação premium

**Critérios de Aceitação:**
- [ ] Círculo → checkmark animado
- [ ] Bounce effect ao marcar
- [ ] Cores baseadas em prioridade
- [ ] Haptic feedback (se suportado)
- [ ] Accessibility: label apropriado

---

### 📦 ÉPICO 3.2: SIMPLIFICAÇÃO PROJETOS

#### [TASK-020] Refatorar Kanban para 3 Colunas

**Status:** ⬜ Pendente  
**Prioridade:** 🟡 Média  
**Estimativa:** M (6h)  
**Dependências:** TASK-003

**Descrição:**  
Simplificar board removendo colunas não usadas

**Contexto:**  
5 colunas causam poluição visual

**Critérios de Aceitação:**
- [ ] Migrar dados: Revisão → Fazendo, Bloqueado → tag
- [ ] 3 colunas: A Fazer | Fazendo | Feito
- [ ] Cards minimalistas
- [ ] Filtros por responsável
- [ ] Arquivar cards > 30 dias em Feito

---

### 📦 ÉPICO 3.3: PWA MELHORADO

#### [TASK-021] Service Worker Offline-First

**Status:** ⬜ Pendente  
**Prioridade:** 🟡 Média  
**Estimativa:** M (8h)  
**Dependências:** TASK-001

**Descrição:**  
Implementar cache strategy para funcionamento offline

**Contexto:**  
PWA precisa funcionar sem internet

**Critérios de Aceitação:**
- [ ] Cache de assets estáticos
- [ ] localStorage como fallback
- [ ] Background sync quando voltar online
- [ ] Indicador visual de modo offline
- [ ] Update prompt quando nova versão

**Técnico:**
- Workbox para service worker
- Cache-first strategy
- IndexedDB para dados grandes

---

#### [TASK-022] Swipe Gestures Mobile

**Status:** ⬜ Pendente  
**Prioridade:** 🟡 Média  
**Estimativa:** M (8h)  
**Dependências:** Nenhuma

**Descrição:**  
Implementar gestos touch para ações rápidas

**Contexto:**  
Experiência mobile nativa

**Critérios de Aceitação:**
- [ ] Swipe left: concluir tarefa
- [ ] Swipe right: adiar 1 dia
- [ ] Visual feedback durante swipe
- [ ] Threshold mínimo (evitar acidentes)
- [ ] Fallback para desktop (hover buttons)

**Técnico:**
- Touch events API
- RequestAnimationFrame para smooth
- Hammer.js como alternativa

---

### 📦 ÉPICO 3.4: MIGRAÇÃO E TESTES

#### [TASK-023] Script de Migração v2 → v3

**Status:** ⬜ Pendente  
**Prioridade:** 🔴 Crítica  
**Estimativa:** M (6h)  
**Dependências:** TASK-003

**Descrição:**  
Converter dados do formato antigo

**Contexto:**  
Preservar histórico do usuário

**Critérios de Aceitação:**
- [ ] Backup automático antes de migrar
- [ ] Mapear estrutura antiga → nova
- [ ] Validação de integridade
- [ ] Rollback se falhar
- [ ] Log detalhado do processo

---

#### [TASK-024] Suite de Testes E2E

**Status:** ⬜ Pendente  
**Prioridade:** 🟠 Alta  
**Estimativa:** M (8h)  
**Dependências:** Todos os épicos anteriores

**Descrição:**  
Testes automatizados dos fluxos principais

**Contexto:**  
Garantir que refatoração não quebra funcionalidades

**Critérios de Aceitação:**
- [ ] Setup Playwright
- [ ] Teste: criar tarefa via quick add
- [ ] Teste: concluir tarefa no dashboard
- [ ] Teste: navegação entre módulos
- [ ] Teste: persistência após reload

---

## 📊 LEGENDA E CONVENÇÕES

### Status das Tarefas

- ⬜ **Pendente** - Ainda não iniciada
- 🟡 **Em Progresso** - Trabalho em andamento
- ✅ **Concluída** - Finalizada e testada
- ⏸️ **Pausada** - Temporariamente interrompida
- ❌ **Cancelada** - Não será implementada

### Prioridades

- 🔴 **Crítica** - Bloqueia outras tarefas ou é core value
- 🟠 **Alta** - Importante para o objetivo do sprint
- 🟡 **Média** - Melhoria significativa mas não bloqueante
- 🟢 **Baixa** - Nice to have, pode ser adiada

### Estimativas

- **P (Pequeno)** - 2-4 horas
- **M (Médio)** - 6-8 horas
- **G (Grande)** - 10-12 horas

### Dependências

As dependências indicam tarefas que devem ser concluídas antes de iniciar a tarefa atual. Use a ordem numérica (TASK-001, TASK-002, etc.) para identificar a sequência correta.

---

## 🗓️ ROADMAP VISUAL

```
Semanas 1-2: SPRINT 1 - BASE SÓLIDA
├── Épico 1.1: Infraestrutura Base (TASK-001, 002, 003)
├── Épico 1.2: Navegação Mobile-First (TASK-004, 005)
├── Épico 1.3: Dashboard Home (TASK-006, 007, 008, 009)
└── Épico 1.4: CSS Mobile-First (TASK-010, 011)

Semanas 3-4: SPRINT 2 - ESTUDOS ÚTIL
├── Épico 2.1: Quick Add Inteligente (TASK-012, 013)
├── Épico 2.2: Kanban Estudos (TASK-014, 015)
└── Épico 2.3: Modal Estudo (TASK-016, 017)

Semanas 5-6: SPRINT 3 - POLIMENTO
├── Épico 3.1: Redesign Rotina iOS-Like (TASK-018, 019)
├── Épico 3.2: Simplificação Projetos (TASK-020)
├── Épico 3.3: PWA Melhorado (TASK-021, 022)
└── Épico 3.4: Migração e Testes (TASK-023, 024)
```

---

## 📈 MÉTRICAS DE PROGRESSO

### Progresso Geral

- **Tarefas Concluídas:** 0/24 (0%)
- **Horas Trabalhadas:** 0/152h (0%)
- **Sprint Atual:** Sprint 1

### Progresso por Sprint

| Sprint | Concluídas | Total | % |
|--------|------------|-------|---|
| Sprint 1 | 0 | 11 | 0% |
| Sprint 2 | 0 | 6 | 0% |
| Sprint 3 | 0 | 7 | 0% |

### Progresso por Prioridade

| Prioridade | Concluídas | Total | % |
|------------|------------|-------|---|
| 🔴 Crítica | 0 | 12 | 0% |
| 🟠 Alta | 0 | 6 | 0% |
| 🟡 Média | 0 | 6 | 0% |

---

## 🔗 LINKS ÚTEIS

- **PRD Completo:** Ver documento original do PRD
- **Repositório:** [GitHub - demandas](https://github.com/pedro/demandas)
- **Branch v3:** `v3-refactor` (a ser criado)

---

## 📝 NOTAS

### Decisões Técnicas Importantes

1. **PWA vs Nativo:** Continuar com PWA melhorado (decisão do PRD)
2. **Parser Quick Add:** Formato `"Python @udemy #urgente"` (validar com Pedro)
3. **Visual:** Estilo iOS 17 (confirmar preferência)

### Riscos Identificados

1. **Migração de Dados:** Backup obrigatório antes de TASK-023
2. **Parser Inteligente:** Fallback para formulário se parser falhar
3. **Mobile:** Testar em device real a cada build

---

**Última Atualização:** 22/11/2025  
**Próxima Revisão:** Após conclusão do Sprint 1


