<!-- agent-update:start:development-workflow -->
# Development Workflow

## Branching & Releases
- Trabalhamos diretamente em `main`. Cada PR precisa passar por revisão humana (ou do próprio maintainer) e, após merge, o workflow `Deploy to GitHub Pages` publica automaticamente o build em `https://<user>.github.io/<repo>/`.
- O workflow usa `BASE_URL=/${{ github.event.repository.name }}/` e `actions/deploy-pages`. Não há branch `gh-pages`; a Action gera o artefato no momento do deploy.
- Releases formais não usam tags/versionamento automático. Atualize o `README.md` e os docs relevantes sempre que o comportamento de deploy mudar.

## Local Development Loop
1. Instale dependências: `npm install` (Node 18+).
2. Rode `npm run dev` para iniciar o Vite em `http://localhost:3000`.
3. Configure um arquivo `.env.local` quando precisar de Firebase (todas as `VITE_FIREBASE_*`). Sem o arquivo, o app funciona apenas offline.
4. Para reproduzir o cenário de GitHub Pages localmente, gere o build com base customizada: `BASE_URL=/demandas/ npm run build && npx serve dist`.
5. Ao preparar um PR, execute:
   - `npm run build` (sem ou com `BASE_URL` dependendo do teste) para garantir que `dist/` compila.
   - `npm run test:e2e` (Playwright)  use `BASE_URL` padrão (`http://localhost:3000`). O SW é desabilitado em dev; use `page.addInitScript(() => window.__ENABLE_SW_IN_DEV__ = true)` se precisar testar registro.

## Code Review Expectations
- Commits devem seguir Conventional Commits (`chore(plan): ...`, `feat(routes): ...`).
- Certifique-se de que novos recursos atualizam `README.md` e os docs em `.context/docs/`.
- Antes do merge: `npm run build` + `npm run test:e2e`. Se alterar deploy/infra, anexe prints da Action ou logs relevantes.
- Nunca faça commit de secrets. Use `.env.local` localmente e GitHub Secrets (`VITE_FIREBASE_*`) para o workflow.

## Onboarding Checklist
1. Leia `README.md` (seção Deploy no GitHub Pages) e `.context/docs/tooling.md` para comandos rápidos.
2. Configure `.env.local` com os placeholders de Firebase (ou use o modo offline por padrão).
3. Execute `npm run dev` e navegue por `/projetos`, `/estudos` e `/rotina` para validar o ambiente.
4. Rode `npm run test:e2e -- --project=chromium` para garantir que Playwright consegue levantar o dev server local.
5. Antes de tocar em deploy, revise `.github/workflows/deploy.yml` e confirme que os secrets existem em Settings  Secrets  Actions.
<!-- agent-update:end -->
