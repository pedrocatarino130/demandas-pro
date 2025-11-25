# Testes E2E - Gerenciador Pedro v3.0

## TASK-024: Suite de Testes E2E

Testes end-to-end usando Playwright para garantir que as funcionalidades principais funcionam corretamente.

## Instalação

```bash
# Instalar dependências (incluindo Playwright)
npm install

# Instalar browsers do Playwright
npx playwright install
```

## Executar Testes

```bash
# Executar todos os testes
npm run test:e2e

# Executar com interface UI (recomendado para desenvolvimento)
npm run test:e2e:ui

# Executar em modo headed (ver o navegador)
npm run test:e2e:headed

# Executar apenas um arquivo de teste
npx playwright test tests/e2e/quick-add.spec.js

# Executar em um browser específico
npx playwright test --project=chromium
```

## Estrutura de Testes

- `quick-add.spec.js` - Testes de criação de tarefas via Quick Add
- `dashboard.spec.js` - Testes de conclusão de tarefas no dashboard
- `navigation.spec.js` - Testes de navegação entre módulos
- `persistence.spec.js` - Testes de persistência após reload

## Configuração

O arquivo `playwright.config.js` na raiz do projeto configura:
- Browsers: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari
- Timeout: 30s por teste
- Base URL: `http://localhost:3000` (pode ser alterado via `BASE_URL`)
- Servidor dev: Inicia automaticamente `npm run dev` antes dos testes

## Variáveis de Ambiente

- `BASE_URL` - URL base da aplicação (padrão: `http://localhost:3000`)
- `CI` - Define comportamento em CI (retries, workers, etc)

## Notas

Os testes atuais são placeholders que podem precisar ser ajustados conforme a implementação real da UI:
- Alguns testes usam `test.skip()` se elementos não forem encontrados
- Os testes verificam funcionalidades que devem estar implementadas no Sprint 1 e 2
- Atualize os seletores conforme a estrutura HTML real da aplicação


