<!-- 5940d1a4-1986-4aac-af75-0666591655ed f6d4e9ec-6adc-4187-923b-a2354f6c4753 -->
# Remover Todos os Backgrounds Brancos do Site

## Problema Identificado

Há múltiplos lugares no código usando fallbacks brancos (`#fff`, `#ffffff`, `white`) que fazem elementos aparecerem brancos mesmo no tema escuro:

1. **CSS**: Fallbacks em `var(--surface, #fff)` e `var(--color-surface, #ffffff)`
2. **JavaScript**: Estilos inline hardcoded com `background: white` em modais

## Solução Completa

Remover todos os fallbacks brancos e estilos inline, garantindo que tudo use apenas as variáveis CSS do tema escuro.

## Arquivos a Modificar

### CSS Files

1. `src/styles/estudos.css` - 11 ocorrências de `var(--surface, #fff)`
2. `src/styles/components.css` - 1 ocorrência de `var(--color-surface, #ffffff)`
3. `src/components/ios-cards.js` - 1 ocorrência de `var(--surface, white)`

### JavaScript Files (estilos inline)

4. `src/views/EstudosView.js` - Modal "Novo Tópico" com `background: white` inline
5. `src/views/Rotina.js` - Modal com `background: white` inline

## Estratégia

- Remover todos os fallbacks brancos dos CSS, deixando apenas `var(--surface)` ou `var(--color-surface)`
- Criar classes CSS para os modais que estão usando estilos inline
- Refatorar JavaScript para usar classes CSS ao invés de estilos inline
- Garantir que todos os elementos usem as variáveis do tema escuro

### To-dos

- [ ] Remover background e backdrop-filter do overlay do ConfirmModal em components.css
- [ ] Remover background do overlay do NotasModal em estudos.css
- [ ] Remover background e backdrop-filter do overlay do EstudoModal em estudos.css
- [ ] Remover background e backdrop-filter do overlay do TaskEditModal em projetos.css
- [ ] Remover fallbacks #fff de todos os var(--surface, #fff) em estudos.css
- [ ] Remover fallback #ffffff de var(--color-surface, #ffffff) em components.css
- [ ] Remover fallback white de var(--surface, white) em ios-cards.js
- [ ] Criar classes CSS e refatorar modal em EstudosView.js para remover background: white inline
- [ ] Criar classes CSS e refatorar modal em Rotina.js para remover background: white inline