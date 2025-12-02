```markdown
<!-- agent-update:start:security -->
# Security & Compliance Notes

## Authentication & Data Access
- A aplicação é single-user e client-side; não há autenticação própria. Quando as credenciais Firebase (`VITE_FIREBASE_*`) são fornecidas, o acesso ao Firestore depende das regras configuradas no projeto Firebase do maintainer.
- O Service Worker opera apenas dentro do `BASE_URL` detectado e não intercepta requests externos. Toda troca de dados ocorre diretamente entre o navegador e o Firebase (quando habilitado).

## Secrets & Environment
- **Locais**: `.env.local` (gitignored) deve conter as chaves `VITE_FIREBASE_*`. Nunca faça commit desse arquivo.
- **CI/CD**: `.github/workflows/deploy.yml` lê os mesmos nomes de secret (ex.: `VITE_FIREBASE_API_KEY`). Configure-os em *Settings  Secrets and variables  Actions*. O workflow falhará caso algum valor esteja ausente.
- As chaves Firebase são públicas por natureza (SDK web), mas centralizá-las em Secrets evita vazamento acidental no histórico ou em logs locais.

## PWA & Browser Security
- O Service Worker é registrado apenas em ambientes não-dev, a menos que `window.__ENABLE_SW_IN_DEV__` seja definido (usado nos testes). Isso evita cache inesperado durante o desenvolvimento.
- `public/404.html` persiste a rota em `sessionStorage` para restaurar o path após o redirect do GitHub Pages. Nenhum dado sensível é gravado; apenas caminhos (ex.: `/demandas/projetos`).
- IndexedDB (`firebase-cache.js`) guarda o estado da aplicação para uso offline. Não há criptografia; assuma que a máquina do usuário é confiável.

## Compliance / Operational Notes
- Não há requisitos de GDPR/HIPAA específicos, mas evite inserir dados pessoais reais durante o desenvolvimento.
- Rodar `npm audit` periodicamente é recomendado (não automatizado ainda). Atualize dependências de Vite/Firebase quando o audit sinalizar CVEs relevantes.
- Registre incidentes relacionados a deploy/PWA no README ou em issues para manter histórico de falhas.
<!-- agent-update:end -->
```
