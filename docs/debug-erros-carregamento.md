# Debug - Erros ao Carregar Páginas do Módulo de Criação

## Status: 🔍 Investigando

---

## Logs de Debug Adicionados

Foram adicionados logs detalhados no Router para identificar onde está falhando o carregamento das páginas.

### Como Testar e Coletar Logs

1. **Abra o Console do Navegador**
   - Chrome/Edge: Pressione `F12` ou `Ctrl+Shift+I`
   - Vá na aba "Console"

2. **Limpe o Console**
   - Clique no ícone de "Clear console" (🚫) ou pressione `Ctrl+L`

3. **Teste cada página e anote os erros**

   **Teste 1: Página Home (Tarefas)**
   - Acesse: `http://localhost:4000/criacao`
   - Copie TODOS os logs do console (especialmente os que começam com 🔄, 📦, ❌)
   
   **Teste 2: Página Ideias**
   - Limpe o console
   - Acesse: `http://localhost:4000/criacao/ideias`
   - Copie TODOS os logs do console
   
   **Teste 3: Página Planejamento**
   - Limpe o console
   - Acesse: `http://localhost:4000/criacao/planejamento`
   - Copie TODOS os logs do console

---

## Logs Importantes a Procurar

### 🔄 Logs de Roteamento
```
🔄 Router: Carregando rota: /criacao
```
- Indica que o router identificou a rota

### 📦 Logs de Carregamento de Módulo
```
📦 Router: Carregando módulo para /criacao
✅ Router: Módulo carregado com sucesso para /criacao
```
- Indica se o arquivo JavaScript foi carregado

### 🎯 Logs de Componente
```
🎯 Router: Componente extraído: CriacaoView
```
- Mostra qual classe/componente foi extraído

### ✏️ Logs de Renderização
```
✏️ Router: Chamando render()...
📄 Router: HTML renderizado (primeiros 100 chars): <div class="criacao-view">...
```
- Mostra se o HTML foi gerado

### ⚡ Logs de Montagem
```
⚡ Router: Chamando mount()...
✅ Router: View montada com sucesso
```
- Indica se a view foi montada (event listeners, etc)

### ❌ Erros
```
❌ Erro ao importar módulo da rota /criacao: Error: ...
Stack trace: ...
```
- Mostra erros específicos com stack trace completo

---

## Possíveis Causas

### 1. Erro de Import
**Sintoma**: `❌ Erro ao importar módulo`
```
Failed to fetch dynamically imported module
```

**Causa**: Arquivo não encontrado ou erro de sintaxe no arquivo

**Solução**: Verificar se os arquivos existem:
- `src/views/Criacao.js`
- `src/views/CriacaoIdeias.js`
- `src/views/CriacaoPlanejamento.js`

### 2. Erro de Sintaxe JavaScript
**Sintoma**: `SyntaxError: Unexpected token`

**Causa**: Erro de sintaxe no arquivo da view

**Solução**: Verificar sintaxe JavaScript (vírgulas, chaves, parênteses)

### 3. Erro ao Instanciar Classe
**Sintoma**: `TypeError: component is not a constructor`

**Causa**: Exportação incorreta da classe

**Solução**: Verificar se está exportando corretamente:
```javascript
export default CriacaoView; // ✅ Correto
// vs
export CriacaoView; // ❌ Incorreto (precisa de import { CriacaoView })
```

### 4. Erro no Método render()
**Sintoma**: Erro após `✏️ Router: Chamando render()...`

**Causa**: Erro no template HTML ou referência a variável inexistente

**Solução**: Verificar o método `render()` da view

### 5. Erro no Método mount()
**Sintoma**: `❌ Erro ao montar view`

**Causa**: 
- Tentando acessar elemento DOM que não existe
- Event listener em elemento null
- Erro ao subscrever ao store

**Solução**: Verificar:
```javascript
const container = document.getElementById('...');
if (!container) return; // ✅ Sempre verificar antes de usar
```

### 6. Erro de Dependência
**Sintoma**: `Cannot read property 'X' of undefined`

**Causa**: Importação incorreta de tipos ou componentes

**Solução**: Verificar imports:
```javascript
import { Status, CreationContext, Priority } from '../types.js';
import { store } from '../store.js';
```

---

## Checklist de Verificação Rápida

Antes de coletar os logs, verifique:

- [ ] Os arquivos das views existem:
  ```bash
  dir src\views\Criacao.js
  dir src\views\CriacaoIdeias.js
  dir src\views\CriacaoPlanejamento.js
  ```

- [ ] O arquivo `src/types.js` existe e exporta corretamente:
  ```javascript
  export const Priority = { ... };
  export const Status = { ... };
  export const IdeaStage = { ... };
  // etc
  ```

- [ ] As rotas estão registradas em `src/router.js`:
  ```javascript
  '/criacao': () => import('./views/Criacao.js').then((m) => m.default),
  '/criacao/ideias': () => import('./views/CriacaoIdeias.js').then((m) => m.default),
  '/criacao/planejamento': () => import('./views/CriacaoPlanejamento.js').then((m) => m.default),
  ```

- [ ] O CSS está carregado no `index.html`:
  ```html
  <link rel="stylesheet" href="/src/styles/criacao.css" />
  <link rel="stylesheet" href="/src/styles/criacao-ideias.css" />
  <link rel="stylesheet" href="/src/styles/criacao-planejamento.css" />
  ```

---

## Próximos Passos

1. ✅ Coletar logs do console para cada página
2. ✅ Identificar o erro específico
3. ✅ Aplicar correção apropriada
4. ✅ Re-testar

---

## Como Enviar os Logs

Cole os logs do console em um arquivo de texto ou diretamente no chat, incluindo:

1. **URL acessada**
2. **Todos os logs do console** (especialmente os com emojis 🔄 📦 ❌)
3. **Stack trace completo** se houver erro
4. **Screenshot** da tela (opcional, mas ajuda)

---

**Data**: Dezembro 2024  
**Status**: Aguardando logs do console para diagnóstico preciso




