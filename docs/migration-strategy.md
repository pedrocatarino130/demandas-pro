# Estratégia de Migração Incremental

Este documento detalha a estratégia para migrar o design system cyberpunk do protótipo React para a implementação vanilla JS de forma incremental e segura.

## Princípios da Migração

1. **Migração Incremental**: Um componente por vez, permitindo rollback fácil
2. **Feature Parity**: Manter 100% da funcionalidade existente
3. **Testes Contínuos**: Testar cada componente após migração
4. **Commits Granulares**: Um commit por componente migrado
5. **Documentação**: Documentar mudanças e decisões

## Ordem de Migração

### Fase 1: Fundação CSS (Prioridade: ALTA)

**Objetivo:** Criar base sólida de estilos antes de migrar componentes.

1. ✅ **Design Tokens** (`src/styles/variables.css`)
   - Status: ✅ Completo
   - Todas as variáveis CSS extraídas do protótipo

2. **Animações** (`src/styles/animations.css`) - NOVO
   - Criar arquivo com todas as animações
   - Keyframes: fade-in, slide-in, zoom-in, spin, pulse-glow
   - Classes utilitárias para animações

3. **Glassmorphism** (`src/styles/glassmorphism.css`) - NOVO
   - Utilitários para efeitos de glassmorphism
   - Backdrop blur utilities
   - Border effects

4. **Utilitários** (`src/styles/utilities.css`) - NOVO
   - Classes utilitárias para gradientes
   - Grid pattern utilities
   - Glow effects

**Rollback:** Reverter commits individuais se necessário.

### Fase 2: Componentes Base (Prioridade: ALTA)

**Objetivo:** Migrar componentes que são base para outros.

#### 2.1 NeonButton
- **Complexidade:** Baixa
- **Dependências:** Nenhuma
- **Impacto:** Médio (usado em vários lugares)
- **Tempo Estimado:** 2-3 horas

**Passos:**
1. Atualizar estilos CSS em `src/styles/components.css`
2. Adicionar animação de border
3. Adicionar transform scale no active
4. Testar todas as variantes (primary, secondary, danger)
5. Verificar uso em TaskEditModal e outros lugares

**Rollback:** Reverter commit específico

#### 2.2 NeonCheckbox
- **Complexidade:** Média
- **Dependências:** Nenhuma
- **Impacto:** Alto (usado em TaskCard)
- **Tempo Estimado:** 3-4 horas

**Passos:**
1. Criar novo componente `src/components/NeonCheckbox.js`
2. Implementar animações conforme protótipo
3. Substituir uso de iOS checkbox em TaskCard
4. Testar acessibilidade (keyboard, screen readers)
5. Verificar performance das animações

**Rollback:** Manter iOS checkbox como fallback temporário

### Fase 3: Componentes de Layout (Prioridade: ALTA)

#### 3.1 Sidebar
- **Complexidade:** Média
- **Dependências:** Nenhuma
- **Impacto:** Alto (visível em todas as páginas)
- **Tempo Estimado:** 4-5 horas

**Passos:**
1. Atualizar estrutura HTML em `src/components/Sidebar.js`
2. Adicionar logo com gradiente e ícone SVG
3. Adicionar footer (Settings/LogOut)
4. Aplicar glassmorphism e bordas
5. Adicionar animações de hover
6. Testar responsividade mobile
7. Verificar navegação e active states

**Rollback:** Reverter para versão anterior

#### 3.2 ComplexSearch
- **Complexidade:** Alta (animações complexas)
- **Dependências:** Nenhuma
- **Impacto:** Médio (usado no header)
- **Tempo Estimado:** 3-4 horas

**Passos:**
1. Verificar se animações estão funcionando
2. Ajustar timing e easing
3. Testar cross-browser (Chrome, Firefox, Safari, Edge)
4. Verificar performance (usar `will-change` se necessário)
5. Adicionar fallbacks para browsers antigos

**Rollback:** Reverter para versão anterior

### Fase 4: Componentes de Conteúdo (Prioridade: MÉDIA)

#### 4.1 TaskCard
- **Complexidade:** Alta
- **Dependências:** NeonCheckbox (já migrado)
- **Impacto:** Alto (usado em todas as views)
- **Tempo Estimado:** 6-8 horas

**Passos:**
1. Redesenhar estrutura HTML (adicionar top graphic area)
2. Mover priority badge para topo direito
3. Adicionar animações de hover nos tags
4. Mover botões edit/delete para aparecer apenas no hover
5. Atualizar cores e glassmorphism
6. Manter funcionalidade de swipe gestures
7. Testar em diferentes estados (done, overdue, current)
8. Verificar performance com muitos cards

**Rollback:** Reverter para versão anterior

#### 4.2 Modal (TaskEditModal)
- **Complexidade:** Média
- **Dependências:** NeonButton (já migrado)
- **Impacto:** Médio (usado para editar tarefas)
- **Tempo Estimado:** 4-5 horas

**Passos:**
1. Adicionar spinning border effect
2. Adicionar backdrop blur
3. Adicionar glow effects nos inputs
4. Atualizar cores e espaçamento
5. Manter funcionalidade existente
6. Testar acessibilidade (focus trap, ESC key)
7. Verificar performance da animação

**Rollback:** Reverter para versão anterior

### Fase 5: Views (Prioridade: MÉDIA)

#### 5.1 Home View
- **Complexidade:** Alta
- **Dependências:** TaskCard, NeonButton (já migrados)
- **Impacto:** Alto (página principal)
- **Tempo Estimado:** 8-10 horas

**Passos:**
1. Adicionar welcome card no topo
2. Reorganizar dashboard com filtros de abas (urgent, delayed, future, completed)
3. Atualizar métricas section com novo design
4. Manter funcionalidade de timeline, overdue, completed, postponed
5. Adicionar animações de entrada
6. Testar todos os filtros e ordenações
7. Verificar performance com muitas tarefas

**Rollback:** Reverter para versão anterior

#### 5.2 Kanban View (Projects/Studies)
- **Complexidade:** Média
- **Dependências:** TaskCard (já migrado)
- **Impacto:** Médio (nova funcionalidade)
- **Tempo Estimado:** 6-8 horas

**Passos:**
1. Criar nova view Kanban baseada no protótipo
2. Implementar colunas: A Fazer, Fazendo, Adiadas, Feito
3. Adicionar drag & drop se possível (ou manter como está)
4. Aplicar glassmorphism nas colunas
5. Testar responsividade
6. Integrar com rotas existentes

**Rollback:** Manter views antigas se necessário

#### 5.3 Outras Views
- **Complexidade:** Baixa a Média
- **Dependências:** Componentes base (já migrados)
- **Impacto:** Baixo a Médio
- **Tempo Estimado:** 2-4 horas cada

**Views:**
- Estudos
- Projetos
- Rotina
- Terapeutico

**Passos (para cada view):**
1. Aplicar novo design system
2. Atualizar cores e espaçamento
3. Adicionar animações de entrada
4. Testar funcionalidade
5. Verificar responsividade

## Estratégia de Rollback

### Rollback por Componente

Cada componente migrado terá seu próprio commit, permitindo rollback individual:

```bash
# Ver commits de migração
git log --oneline --grep="redesign"

# Reverter componente específico
git revert <commit-hash>
```

### Rollback Completo

Se necessário reverter toda a migração:

```bash
# Criar tag antes da migração
git tag v3.0-pre-redesign

# Reverter para tag
git checkout v3.0-pre-redesign
```

### Rollback Parcial

Manter alguns componentes migrados e reverter outros:

```bash
# Reverter commits específicos
git revert <commit-hash-1> <commit-hash-2>
```

## Testes Durante Migração

### Após Cada Componente

1. **Testes Visuais**
   - Verificar se componente parece com protótipo
   - Testar em diferentes tamanhos de tela
   - Verificar estados (hover, active, disabled)

2. **Testes Funcionais**
   - Verificar se funcionalidade ainda funciona
   - Testar interações (cliques, hovers, etc.)
   - Verificar acessibilidade básica

3. **Testes de Performance**
   - Verificar FPS de animações (target: 60fps)
   - Verificar tempo de renderização
   - Verificar uso de memória

### Após Cada Fase

1. **E2E Tests**
   - Rodar suite completa: `npm run test:e2e`
   - Verificar se todos os testes passam
   - Atualizar testes se necessário

2. **Lighthouse Audit**
   - Performance score (target: >90)
   - Accessibility score (target: >90)
   - Best Practices score (target: >90)

## Checklist de Migração por Componente

Para cada componente migrado, verificar:

- [ ] Código implementado
- [ ] Estilos aplicados
- [ ] Animações funcionando
- [ ] Funcionalidade preservada
- [ ] Testes passando
- [ ] Performance aceitável
- [ ] Responsividade verificada
- [ ] Acessibilidade verificada
- [ ] Cross-browser testado
- [ ] Documentação atualizada
- [ ] Commit criado

## Cronograma Estimado

| Fase | Componentes | Tempo Estimado | Status |
|------|-------------|----------------|--------|
| Fase 1 | CSS Foundation | 4-6 horas | ⏳ Em progresso |
| Fase 2 | NeonButton, NeonCheckbox | 5-7 horas | 📋 Pendente |
| Fase 3 | Sidebar, ComplexSearch | 7-9 horas | 📋 Pendente |
| Fase 4 | TaskCard, Modal | 10-13 horas | 📋 Pendente |
| Fase 5 | Views (Home, Kanban, outras) | 16-22 horas | 📋 Pendente |
| **Total** | | **42-57 horas** | |

**Nota:** Tempos são estimativas e podem variar dependendo de complexidade encontrada.

## Próximos Passos Imediatos

1. ✅ Criar arquivo de animações (`src/styles/animations.css`)
2. ✅ Criar arquivo de glassmorphism (`src/styles/glassmorphism.css`)
3. ✅ Criar arquivo de utilitários (`src/styles/utilities.css`)
4. Começar migração do NeonButton (componente mais simples)
5. Testar NeonButton em diferentes contextos
6. Migrar NeonCheckbox
7. Continuar com Sidebar

## Notas Importantes

- **Não quebrar funcionalidade existente**: Sempre manter compatibilidade
- **Testar incrementalmente**: Não esperar até o final para testar
- **Documentar decisões**: Registrar por que certas escolhas foram feitas
- **Comunicar progresso**: Atualizar migration log regularmente







