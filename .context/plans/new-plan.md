---
id: plan-new-plan
ai_update_goal: "Define the stages, owners, and evidence required to complete New Plan."
required_inputs:
  - "Task summary or issue link describing the goal"
  - "Relevant documentation sections from docs/README.md"
  - "Matching agent playbooks from agents/README.md"
success_criteria:
  - "Stages list clear owners, deliverables, and success signals"
  - "Plan references documentation and agent resources that exist today"
  - "Follow-up actions and evidence expectations are recorded"
related_agents:
  - "code-reviewer"
  - "bug-fixer"
  - "feature-developer"
  - "refactoring-specialist"
  - "test-writer"
  - "documentation-writer"
  - "performance-optimizer"
  - "security-auditor"
  - "backend-specialist"
  - "frontend-specialist"
  - "architect-specialist"
  - "devops-specialist"
  - "database-specialist"
  - "mobile-specialist"
---

<!-- agent-update:start:plan-new-plan -->
# New Plan Plan

> Criar um fluxo de deploy confiável que publique o Gerenciador Pedro v3 no GitHub Pages com suporte completo a SPA, service worker e Firebase, eliminando os erros atuais de registro do SW e rotas quebradas após o build.

## Task Snapshot
- **Primary goal:** Publicar o build gerado por `vite build` em GitHub Pages (subpasta do repositório) com roteamento funcional, service worker registrado e integrações Firebase configuradas via secrets.
- **Success signal:** A URL pública abre sem erros no console, mantém navegação/refresh em rotas internas, registra o SW (`navigator.serviceWorker.register` devolve escopo correto) e consegue autenticar no Firebase usando variáveis `VITE_FIREBASE_*`.
- **Key references:**
  - [Documentation Index](../docs/README.md) – links para guias atualizados.
  - [Agent Handbook](../agents/README.md) – playbooks aplicados abaixo.
  - [Plans Index](./README.md) – protocolo de execução de planos.
  - `README.md` – seção “Deploy no GitHub Pages”.
  - `vite.config.js` – configuração de `base` e plugin de manifest.
  - `src/main.js` / `public/service-worker.js` – registro e escopo do SW.
  - `.context/docs/development-workflow.md` – convenções de CI/CD.

## Agent Lineup
| Agent | Role in this plan | Playbook | First responsibility focus |
| --- | --- | --- | --- |
| Code Reviewer | Garante que ajustes em `main.js`, `router.js`, SW e workflows sigam padrões e não introduzam regressões. | [Code Reviewer](../agents/code-reviewer.md) | Revisar PR do deploy antes de merge. |
| Bug Fixer | Reproduz o erro atual (SW 404 em GitHub Pages) e confirma que o fix elimina alertas. | [Bug Fixer](../agents/bug-fixer.md) | Depurar falha de rota/SW no ambiente publicado. |
| Feature Developer | Implementa suporte a base path dinâmico e fallback `404.html`. | [Feature Developer](../agents/feature-developer.md) | Entregar código que funciona tanto local quanto hospedado. |
| Refactoring Specialist | Extrai utilidade compartilhada de base path para evitar strings hard-coded como `/demandas-pro/`. | [Refactoring Specialist](../agents/refactoring-specialist.md) | Simplificar lógica de deteção de base. |
| Test Writer | Amplia Playwright para cobrir refresh direto em `/projetos` e valida `service worker` ativo. | [Test Writer](../agents/test-writer.md) | Automatizar a verificação de rotas/deploy. |
| Documentation Writer | Atualiza `README.md` e `.context/docs/development-workflow.md` descrevendo `BASE_URL`, GitHub Actions e secrets Firebase. | [Documentation Writer](../agents/documentation-writer.md) | Registrar passos claros de deploy. |
| Performance Optimizer | Analisa impacto de cache do SW após mudança de base path, evitando duplicação de assets. | [Performance Optimizer](../agents/performance-optimizer.md) | Revisar lista de assets em `STATIC_ASSETS`. |
| Security Auditor | Define como expor variáveis `VITE_FIREBASE_*` (públicas) e garante que a Action não faça log de segredos reais. | [Security Auditor](../agents/security-auditor.md) | Revisar workflow e docs de secrets. |
| Backend Specialist | Confirma que fallback offline e mensagens do Firebase permanecem consistentes quando o deploy ocorre sem Firestore. | [Backend Specialist](../agents/backend-specialist.md) | Validar `firebase.js` e `sync` após build. |
| Frontend Specialist | Testa UI/UX pós-deploy (SyncStatusWidget, indicator offline, ícones PWA). | [Frontend Specialist](../agents/frontend-specialist.md) | Garantir feedback adequado ao usuário final. |
| Architect Specialist | Mantém visão geral da arquitetura SPA + GitHub Pages, definindo contrato único de base path. | [Architect Specialist](../agents/architect-specialist.md) | Aprovar novo util de base e estratégia de fallback. |
| Devops Specialist | Cria `.github/workflows/deploy.yml` usando `actions/deploy-pages`, configurando build com `BASE_URL=/<repo>/`. | [Devops Specialist](../agents/devops-specialist.md) | Automatizar publicação contínua. |
| Database Specialist | Checa se coleções/índices Firestore usados pelo app estão acessíveis após deploy e documenta requisitos. | [Database Specialist](../agents/database-specialist.md) | Validar dependências de dados. |
| Mobile Specialist | Testa instalação do PWA via GitHub Pages para garantir que `manifest` e ícones relativos funcionem. | [Mobile Specialist](../agents/mobile-specialist.md) | Confirmar UX mobile/offline. |

## Documentation Touchpoints
| Guide | File | Task Marker | Primary Inputs |
| --- | --- | --- | --- |
| Project Overview | [project-overview.md](../docs/project-overview.md) | agent-update:project-overview | Contexto do produto e motivação para hosting público |
| Architecture Notes | [architecture.md](../docs/architecture.md) | agent-update:architecture-notes | Descrever como SPA + Firebase funcionam em ambiente estático |
| Development Workflow | [development-workflow.md](../docs/development-workflow.md) | agent-update:development-workflow | Processo de build, secrets e acionamento da Action |
| Testing Strategy | [testing-strategy.md](../docs/testing-strategy.md) | agent-update:testing-strategy | Cenários E2E cobrindo refresh/rotas em Pages |
| Tooling & Productivity | [tooling.md](../docs/tooling.md) | agent-update:tooling | Comandos `npm run build/test` + uso de `BASE_URL` |
| Security & Compliance | [security.md](../docs/security.md) | agent-update:security | Documentar uso seguro de secrets Firebase |
| Data Flow & Integrations | [data-flow.md](../docs/data-flow.md) | agent-update:data-flow | Atualizar fluxos envolvendo Firebase após deploy |

## Risk Assessment
Identify potential blockers, dependencies, and mitigation strategies before beginning work.

### Identified Risks
| Risk | Probability | Impact | Mitigation Strategy | Owner |
| --- | --- | --- | --- | --- |
| SW registrado em `/service-worker.js` (root) gera 404 em GitHub Pages, quebrando PWA. | High | High | Usar `new URL('service-worker.js', import.meta.env.BASE_URL)` e testes Playwright. | Devops Specialist |
| Refresh em rotas internas retorna 404 (sem fallback) | Medium | High | Criar `404.html` que redireciona para `index.html` + atualizar docs. | Feature Developer |
| Secrets Firebase ausentes no build de produção deixam app somente offline | Medium | Medium | Documentar secrets obrigatórios e falhar Action caso estejam vazios. | Security Auditor |
| Cache antigo bloqueia assets novos após deploy | Low | Medium | Implementar `skipWaiting` + instruções de limpeza; versionar `CACHE_VERSION`. | Performance Optimizer |

### Dependencies
- **Internal:** Aprovação de mudanças em `src/main.js`, `public/service-worker.js`, `README.md`, `tests/e2e` e criação de `.github/workflows/deploy.yml`.
- **External:** Projeto Firebase ativo; permissão para habilitar GitHub Pages e Actions no repositório.
- **Technical:** Node 18+ disponível no runner, acesso a `actions/checkout`, `actions/setup-node`, `actions/deploy-pages`, e capacidade de definir `BASE_URL`.

### Assumptions
- O site será servido em `https://<user>.github.io/<repo>/`; se migrar para domínio customizado, atualizar `BASE_URL=/`.
- Chaves Firebase (client-side) podem ser expostas no bundle; caso contrário será necessário backend (fora do escopo deste plano).

## Resource Estimation

### Time Allocation
| Phase | Estimated Effort | Calendar Time | Team Size |
| --- | --- | --- | --- |
| Phase 1 - Discovery | 1 pessoa-dia | 1 dia útil | 1 dev |
| Phase 2 - Implementation | 2 pessoa-dias | 2-3 dias corridos | 2 devs (frontend + devops) |
| Phase 3 - Validation | 1 pessoa-dia | 1 dia útil | 1 QA/Test Writer |
| **Total** | **4 pessoa-dias** | **~1 semana** | **-** |

### Required Skills
- Vite + PWA + roteamento SPA vanilla JS.
- GitHub Actions/Pages e manipulação de variáveis de ambiente.
- Firebase client-side (Firestore) e implicações de segurança.
- Escrita de testes Playwright e debugging de base path.
- Gap atual: inexistência de util de base path → criar em Phase 2.

### Resource Availability
- **Available:** Pedro (maintainer) 0,5 dia/dia; AI agent pair; Devops Specialist alocado 1 dia.
- **Blocked:** Dependemos do owner para fornecer chaves Firebase/testar no projeto real.
- **Escalation:** Abrir issue para Pedro caso GitHub Pages/Actions estejam desabilitados.

## Working Phases
### Phase 1 — Discovery & Alignment
**Steps**
1. Capturar erros exatos do deploy atual (404 em `/service-worker.js`, falha ao recarregar `/projetos`). Owner: Bug Fixer.
2. Mapear arquivos que assumem base fixa (`src/main.js`, `router.js`, `public/service-worker.js`, `README.md`). Owner: Architect Specialist.
3. Levantar requisitos de secrets/variáveis `VITE_FIREBASE_*` e confirmar se podem ser expostas. Owner: Security Auditor.
4. Registrar decisões pendentes (domínio customizado, frequência de deploy). Owner: Documentation Writer.

**Commit Checkpoint**
- Após concluir a fase, criar commit `chore(plan): complete phase 1 discovery`.

#### Phase 1 Findings — 2025-12-02 (AI Agent)
- ✅ **Erros reproduzidos:** build executado com `BASE_URL=/demandas/` (`npm run build`) mostra que `navigator.serviceWorker.register('/service-worker.js')` continua usando caminho absoluto para a raiz do domínio. Em um Project Page do GitHub isso resulta em `https://<user>.github.io/service-worker.js` (404), porque o arquivo real fica em `/<repo>/service-worker.js`. Também confirmamos que não existe `404.html` em `dist/`, logo um refresh direto em `/demandas/projetos` devolve 404 do GitHub Pages.
- ✅ **Mapeamento de arquivos sensíveis ao base path:** `src/main.js` registra o SW com caminho fixo; `src/router.js` tenta heurísticas locais e ainda referencia `/demandas-pro/`; `public/service-worker.js` só detecta o repo `demandas-pro` e monta `STATIC_ASSETS` com caminhos absolutos; `index.html` e `public/manifest.json` usam ícones/links iniciados com `/`; `README.md` descreve deploy manual, mas não cobre fallback de rotas nem a Action oficial; `vite.config.js` depende de `process.env.BASE_URL` mas não fornece util compartilhado para o runtime.
- ✅ **Secrets e variáveis:** o app depende de `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID` e `VITE_FIREBASE_APP_ID` (checados em `src/config/firebase.js` e `src/utils/firebase-check-env.js`). Todas são chaves públicas do SDK Web, portanto podem ser expostas no bundle, mas precisamos fornecê-las via GitHub Actions (`env:`) para que o build publicado autentique no Firebase.
- ✅ **Decisões capturadas:** manteremos `BASE_URL=/demandas/` até que o maintainer declare um domínio customizado; quando houver domínio próprio será necessário redefinir `base: '/'` e atualizar docs. A frequência de deploy será “toda vez que `main` recebe commits”, através de uma Action `deploy.yml` usando `actions/deploy-pages`. Secrets do Firebase ficarão em `Settings > Secrets and variables > Actions` com prefixo `VITE_FIREBASE_*`. Falta apenas confirmar com o maintainer se há planos para domínio customizado no Q1/2026.

### Phase 2 — Implementation & Iteration
**Steps**
1. Criar `src/utils/base-path.js` exportando funções para derivar `BASE_URL` (import.meta/env e window). Owner: Feature Developer.
2. Refatorar `registerServiceWorker` para `new URL('service-worker.js', import.meta.env.BASE_URL)` e garantir fallback em subpastas. Owner: Frontend Specialist.
3. Atualizar `public/service-worker.js` para basear `BASE_PATH` em `self.registration.scope` e incluir assets relativos. Owner: Devops Specialist.
4. Gerar `public/404.html` que redireciona `window.location` para `index.html`. Owner: Documentation Writer.
5. Criar `.github/workflows/deploy.yml` (checkout, setup-node@v4, `npm ci`, `BASE_URL=/<repo>/ npm run build`, `actions/upload-pages-artifact`, `actions/deploy-pages`). Owner: Devops Specialist.
6. Alimentar secrets Firebase via `env` e validar fallback quando ausentes. Owner: Security Auditor.
7. Atualizar `README.md`, `.context/docs/development-workflow.md` e `.context/docs/tooling.md` com novos passos e troubleshooting. Owner: Documentation Writer.
8. Atualizar Playwright com teste de refresh em rota profunda + checagem de registro do SW. Owner: Test Writer.

**Commit Checkpoint**
- Criar commit `chore(plan): complete phase 2 implementation` com código/workflow/docs.

#### Phase 2 Findings — 2025-12-02 (AI Agent)
- ✅ **Util + router**: `src/utils/base-path.js` consolida leitura/escrita do `BASE_URL`, expõe `buildAssetPath/stripBasePath/rememberBasePath/consumePendingRoute` e o `router` passou a depender desses helpers (menos heurísticas com `/demandas-pro/`). O util também alimenta `src/main.js` para restaurar rotas salvas pelo fallback.
- ✅ **Service Worker & SW registration**: `src/main.js` agora registra o SW usando `buildAssetPath('service-worker.js')`, respeitando `BASE_URL` e expondo diagnósticos (`window.__SW_STATUS__`). `public/service-worker.js` calcula o escopo via `self.registration.scope`, limita interceptações ao `BASE_PATH`, usa `withBase()` para cache/fallback e incrementa `CACHE_VERSION` para bustar caches antigos.
- ✅ **Fallback 404**: `public/404.html` guarda a rota original em `sessionStorage`, lê o base path do storage persistido e redireciona antes do boot. `main.js` consome esse valor para restaurar a URL, mantendo refreshs em rotas profundas.
- ✅ **Workflow**: `.github/workflows/deploy.yml` automatiza build (`BASE_URL=/${{ github.event.repository.name }}/`), injeta secrets `VITE_FIREBASE_*` e usa `actions/deploy-pages`. README/documentação descrevem o processo e os secrets mínimos.
- ✅ **Docs atualizadas**: README, `.context/docs/project-overview.md`, `architecture.md`, `development-workflow.md`, `tooling.md`, `testing-strategy.md`, `security.md` e `data-flow.md` refletem o novo fluxo de deploy, PWA e base path.
- ✅ **Tests**: `tests/e2e/navigation.spec.js` ganhou cenários para refresh em `/projetos` e validação do SW com `window.__ENABLE_SW_IN_DEV__`. O doc de testing explica como habilitar o SW nos testes.

### Phase 3 — Validation & Handoff
**Steps**
1. Executar `BASE_URL=./ npm run build && npm run test:e2e` e repetir com `BASE_URL=/demandas/`. Owner: Test Writer.
2. Rodar workflow GitHub Actions em branch feature e confirmar publicação automática. Owner: Devops Specialist.
3. Validar manualmente a página hospedada (console limpo, SW ativo, offline indicator funcionando). Owner: Frontend Specialist.
4. Registrar evidências (links, logs, capturas) na seção abaixo e comunicar stakeholders. Owner: Documentation Writer.

**Commit Checkpoint**
- Criar commit `chore(plan): complete phase 3 validation` e abrir PR finalizando o plano.

## Rollback Plan
Document how to revert changes if issues arise during or after implementation.

### Rollback Triggers
- Deploy gera tela branca/404 para todos os usuários.
- Service worker impede carregamento de assets críticos.
- Firebase começa a rejeitar requisições devido a configuração incorreta.
- GitHub Actions impede merges (workflow falha continuamente).

### Rollback Procedures
#### Phase 1 Rollback
- Action: Descartar branch de discovery/doc updates e retornar ao template original.
- Data Impact: Nenhum (somente documentação).
- Estimated Time: < 1 hora.

#### Phase 2 Rollback
- Action: Reverter commits das alterações em SW/router/workflow e reinstalar versão anterior em `gh-pages`.
- Data Impact: Usuários voltam à versão prévia; sem perda de dados Firebase.
- Estimated Time: 2-4 horas (inclui novo deploy).

#### Phase 3 Rollback
- Action: Reverter publicação via histórico de GitHub Pages e limpar service workers (`clients.claim` + instrução aos usuários).
- Data Impact: Necessita orientar usuários a limpar cache para receber SW antigo.
- Estimated Time: 1-2 horas.

### Post-Rollback Actions
1. Document reason for rollback in incident report
2. Notify stakeholders of rollback and impact
3. Schedule post-mortem to analyze failure
4. Update plan with lessons learned before retry

<!-- agent-readonly:guidance -->
## Agent Playbook Checklist
1. Pick the agent that matches your task.
2. Enrich the template with project-specific context or links.
3. Share the final prompt with your AI assistant.
4. Capture learnings in the relevant documentation file so future runs improve.

## Evidence & Follow-up
- Artifacts: link da Action `deploy.yml`, URL pública do GitHub Pages, screenshot do console com SW registrado, log dos testes Playwright.
- Follow-up: monitorar dois deploys consecutivos; abrir issue se surgir plano para domínio customizado/Cloudflare.

<!-- agent-update:end -->
