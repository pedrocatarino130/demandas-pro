<!-- agent-update:start:data-flow -->
# Data Flow & Integrations

## High-level Flow
1. Usuário acessa `index.html` (ou `public/404.html`, em caso de rota profunda). O fallback salva a rota pedida em `sessionStorage` e redireciona para a raiz (`BASE_URL`).
2. `src/main.js` chama `rememberBasePath()`/`consumePendingRoute()`, registra o Service Worker (quando não está em dev) e inicializa o router.
3. As views interagem com `store.js`, que escreve em IndexedDB (`firebase-cache.js`) imediatamente.
4. Se as variáveis `VITE_FIREBASE_*` existem, `firebase-service.js` conecta ao Firestore e `firebase-sync.js` processa a fila offline/online.
5. O Service Worker (`public/service-worker.js`) intercepta apenas requests dentro de `BASE_PATH`, responde com `cache-first` para assets estáticos e `network-first` para HTML/API. Em fallback offline, retorna `index.html` do cache.

## Internal Movement
- **Entrada de dados**: componentes/inputs nas views (`src/views/*.js`) disparam ações no `store`.
- **Persistência local**: `firebase-cache.js` utiliza IndexedDB; todas as listas/screens leem primeiro do cache.
- **Sincronização**: `firebase-sync.js` agrega operações quando offline e reenvia via `firebase-service.js` assim que o browser volta ao estado online. Caso Firestore não esteja configurado, os módulos exibem warnings e permanecem offline.
- **Roteamento**: `src/router.js` usa `stripBasePath()` para normalizar URLs e garantir que `history.pushState` mantenha o prefixo adequado.
- **Service Worker**: `public/service-worker.js` usa `withBase()` para montar caminhos (`/demandas/index.html`, etc.) e só manipula requests originados dentro do mesmo `BASE_PATH`.

## External Integrations
- **Firebase Firestore (opcional)**
  - Configuração via `VITE_FIREBASE_*` tanto localmente quanto nos GitHub Secrets.
  - Fluxo: `store.js` → `firebase-service.js` (CRUD) → Firestore. Falhas ou falta de configuração devolvem o app ao modo offline.
  - Segurança/escopo definidos nas regras do projeto Firebase do maintainer.
- **GitHub Pages**
  - Hosting estático. Precisa de `public/404.html` para refresh nas rotas e `BASE_URL` ajustado para o nome do repo.
  - Deploy automatizado por `.github/workflows/deploy.yml`.

## Observability & Failure Modes
- **Logs no console** indicam status do Firebase (`✅`, `⚠️`) e registro do SW.
- **Playwright** gera relatórios HTML (ver pasta `playwright-report/` quando executado com `--reporter=html`).
- **Falhas comuns**:
  - *SW 404*: ocorre se o build for feito sem `BASE_URL=/<repo>/`. Solução: rebuildar com a variável correta.
  - *Refresh em rota profunda mostra 404 do GitHub*: verifique se `public/404.html` foi publicado; o workflow se encarrega disso automaticamente.
  - *Firebase inativo*: mensagens `⚠️ Firebase não configurado` aparecem no console. Certifique-se de que `.env.local` existe e que os Secrets estão configurados para o deploy.
<!-- agent-update:end -->
