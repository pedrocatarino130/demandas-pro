```markdown
<!-- agent-update:start:architecture-notes -->
# Architecture Notes

Gerenciador Pedro é uma SPA estática empacotada com Vite e hospedada em GitHub Pages. Todo o processamento acontece no navegador; não há backend dedicado. Como o domínio público vive em um subdiretório (`https://<user>.github.io/demandas/`), o `BASE_URL` passou a ser um contrato central, encapsulado em `src/utils/base-path.js` e persistido em storage para que `public/404.html` consiga redirecionar rotas profundas antes da inicialização.

## System Architecture Overview
1. **Boot (`index.html`)**  injeta todas as folhas de estilo de `src/styles/` e carrega `src/main.js`.
2. **Base path util (`src/utils/base-path.js`)**  calcula/persiste o `BASE_URL`, monta URLs de assets (`buildAssetPath`), normaliza paths para o router (`stripBasePath`), gera caminhos completos para `history.pushState` (`buildHistoryPath`) e restaura rotas guardadas pelo fallback 404 (`consumePendingRoute`).
3. **Router (`src/router.js`)**  usa o util para remover/adicionar o prefixo correto e faz lazy-load das views (`src/views/*.js`). As views principais agora incluem `Home`, `Projetos`, `Rotina`, `Estudos` (Kanban/Timer) e `Criacao` (Kanban/Templates).
4. **Service Worker (`public/service-worker.js`)**  deriva `BASE_PATH` a partir de `self.registration.scope`, intercepta apenas requests dentro desse escopo, monta `STATIC_ASSETS` com `withBase()` e oferece fallback offline para `index.html`. O registro ocorre apenas fora de dev, salvo quando `window.__ENABLE_SW_IN_DEV__` é definido (Playwright força isso).
5. **Persistência e sync**  `store.js` mantém estado; `firebase-cache.js` usa IndexedDB; `firebase-service.js`/`firebase-sync.js` só ativam Firestore quando todas as `VITE_FIREBASE_*` existem. Ausência de secrets degrada para modo offline sem quebrar a UI.
6. **Deploy**  `.github/workflows/deploy.yml` roda `npm ci`, builda com `BASE_URL=/demandas/` (ou nome dinâmico do repo), configura Pages e publica via `actions/deploy-pages`. O workflow injeta todas as `VITE_FIREBASE_*` a partir dos Secrets do repositório.
7. **Fallback 404**  `public/404.html` grava a rota original em `sessionStorage` (`GERENCIADOR_PEDRO_PENDING_ROUTE`), tenta descobrir o base path via storage e redireciona para o `index.html`. Durante o boot, `consumePendingRoute()` restaura a URL com `history.replaceState`.

```mermaid
graph TD
    A[index.html] --> B[src/main.js]
    B --> C[rememberBasePath()]
    C --> D[local/session storage]
    B --> E[Router + BasePath util]
    E --> F[Views/Componentes]
    F --> G[Store.js]
    G --> H[IndexedDB]
    G --> I[Firebase opcional]
    B --> J[registerServiceWorker]
    J --> K[public/service-worker.js]
```

## External Service Dependencies
- **GitHub Pages**  requer `public/404.html` e publicação via `actions/deploy-pages`.
- **Firebase Firestore (opcional)**  habilitado apenas quando todas as `VITE_FIREBASE_*` estão definidas. As chaves são públicas por natureza (SDK web), mas ficam em GitHub Secrets para não poluir o repo.
- **Browser APIs**  History API, Storage, IndexedDB, Service Workers e Background Sync compõem toda a infraestrutura.

## Key Decisions & Trade-offs
- **BASE_URL único**  evita strings hard-coded (antigo `/demandas-pro/`) e mantém router/SW/manifest em sincronia. Exige que qualquer novo módulo que gere URLs dependa do util.
- **Offline-first**  garante uso sem rede, mas obriga versionamento criterioso do cache (`CACHE_VERSION`) e comunicação sobre `skipWaiting`.
- **Testes forçando SW**  Playwright roda `npm run dev`; para validar SW, as specs definem `window.__ENABLE_SW_IN_DEV__`. É preciso limpar registros ao final para não interferir em outros navegadores.
- **Secrets públicos porém centralizados**  as chaves Firebase são expostas no bundle, mas só existem durante o build graças aos Secrets, evitando vazamento no Git.

## Risks & Constraints
- **BASE_URL incorreto**  builds sem `BASE_URL=/<repo>/` quebram SW, manifest e refresh de rotas. O workflow já aplica automaticamente, mas execuções manuais precisam seguir o mesmo padrão.
- **Cache antigo**  usuários só recebem mudanças após nova ativação do SW. Incrementar `CACHE_VERSION` e orientar o uso de `registration.update()` é obrigatório.
- **Ícones ausentes**  `manifest.json` referencia `icon-192.png`/`icon-512.png`, ainda não gerados. Enquanto isso, navegadores registram 404 (seguido como follow-up em issue #XX ou tarefa pendente).
- **Diretórios históricos**  `sprint2/` e `sprint3/` permanecem por referência, mas não entram no bundle atual. Novas features devem viver em `src/` + `tests/`.

<!-- agent-readonly:guidance -->
## AI Update Checklist
1. Review ADRs, design docs, or major PRs for architectural changes.
2. Verify that each documented decision still holds; mark superseded choices clearly.
3. Capture upstream/downstream impacts (APIs, events, data flows).
4. Update Risks & Constraints with active incident learnings or TODO debt.
5. Link any new diagrams or dashboards referenced in recent work.

<!-- agent-readonly:sources -->
## Acceptable Sources
- ADR folders, `/docs/architecture` notes, or RFC threads.
- Dependency visualisations from build tooling or scripts.
- Issue tracker discussions vetted by maintainers.

## Related Resources
- [Project Overview](./project-overview.md)
- Update [agents/README.md](../agents/README.md) when architecture changes.

<!-- agent-update:end -->
```
