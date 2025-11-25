# Estrutura de Dados - Módulo de Estudos v2.0

## Schema LocalStorage

### Key: `estudos_dados_v1`

```json
{
  "areas": [
    {
      "id": "string (uuid)",
      "nome": "string",
      "descricao": "string (opcional)",
      "cor": "string (hex color)",
      "icone": "string (emoji, opcional)",
      "criadoEm": "string (ISO date)",
      "status": "ativo | arquivado"
    }
  ],
  "topicos": [
    {
      "id": "string (uuid)",
      "areaId": "string (uuid da área)",
      "titulo": "string",
      "descricao": "string (opcional)",
      "status": "Não iniciado | Estudando | Concluído | Precisa revisão",
      "prioridade": "Alta | Média | Baixa",
      "agendamento": {
        "data": "string (YYYY-MM-DD, opcional)",
        "horario": "string (HH:mm, opcional)"
      },
      "projetoVinculado": "string (id projeto, opcional)",
      "criadoEm": "string (ISO date)",
      "concluidoEm": "string (ISO date, null se não concluído)",
      "proximaRevisao": "string (ISO date, calculado automaticamente)",
      "tags": ["array de strings"],
      "ordem": "number (para ordenação manual)"
    }
  ],
  "sessoes": [
    {
      "id": "string (uuid)",
      "topicoId": "string (uuid do tópico)",
      "data": "string (ISO datetime)",
      "duracao": "number (segundos)",
      "notas": "string (markdown básico)",
      "tipoSessao": "estudo | revisão",
      "concluiu": "boolean"
    }
  ],
  "configuracoes": {
    "revisaoEspacada": {
      "ativo": true,
      "intervalos": [7, 15, 30] // dias após conclusão
    },
    "notificacoes": true,
    "viewPadrao": "lista | calendario | kanban"
  }
}
```

## Exemplos de Dados

### Exemplo 1: Área de JavaScript

```json
{
  "id": "area-001",
  "nome": "JavaScript",
  "descricao": "Fundamentos e conceitos avançados de JavaScript",
  "cor": "#f0db4f",
  "icone": "💛",
  "criadoEm": "2025-11-07T10:00:00Z",
  "status": "ativo"
}
```

### Exemplo 2: Tópico de Promises

```json
{
  "id": "topico-001",
  "areaId": "area-001",
  "titulo": "Promises e Async/Await",
  "descricao": "Como trabalhar com código assíncrono em JavaScript",
  "status": "Estudando",
  "prioridade": "Alta",
  "agendamento": {
    "data": "2025-11-08",
    "horario": "14:00"
  },
  "projetoVinculado": null,
  "criadoEm": "2025-11-07T10:30:00Z",
  "concluidoEm": null,
  "proximaRevisao": null,
  "tags": ["javascript", "async", "promises"],
  "ordem": 0
}
```

### Exemplo 3: Sessão de Estudo

```json
{
  "id": "sessao-001",
  "topicoId": "topico-001",
  "data": "2025-11-07T14:30:00Z",
  "duracao": 3600,
  "notas": "# Sessão 1\n\n- Aprendi sobre `.then()` e `.catch()`\n- Entendi o conceito de Promise chains\n- **Importante:** async/await é syntactic sugar para Promises",
  "tipoSessao": "estudo",
  "concluiu": true
}
```

## Migrações e Versionamento

- **v1**: Schema inicial
- Key do localStorage: `estudos_dados_v1`
- Migração automática: não necessária (módulo novo)

## Integração com Módulos Existentes

### Vinculação com Projetos
- Campo `projetoVinculado` no tópico pode referenciar `id` de tarefa do módulo de Projetos
- Permite ver quais estudos estão relacionados a projetos específicos

### Notificações Pushcut
- Usar mesma infraestrutura de notificações já existente
- Notificar quando `proximaRevisao` for <= data atual

## Cálculo de Revisão Espaçada

Algoritmo simples baseado em intervalos fixos:

```javascript
function calcularProximaRevisao(dataConlusao, tentativaRevisao = 0) {
  const intervalos = [7, 15, 30]; // dias
  const dias = intervalos[Math.min(tentativaRevisao, intervalos.length - 1)];
  const proxima = new Date(dataConlusao);
  proxima.setDate(proxima.getDate() + dias);
  return proxima.toISOString();
}
```

**Lógica:**
1. Quando tópico é marcado como "Concluído", `proximaRevisao` = data atual + 7 dias
2. Quando revisão é concluída, `proximaRevisao` = data atual + 15 dias
3. Segunda revisão concluída, `proximaRevisao` = data atual + 30 dias
4. Terceira revisão e subsequentes = sempre + 30 dias

## Métricas e Estatísticas

Cálculos derivados dos dados:

```javascript
// Progresso por área (%)
function calcularProgressoArea(areaId) {
  const topicos = getTopicosPorArea(areaId);
  const concluidos = topicos.filter(t => t.status === 'Concluído').length;
  return (concluidos / topicos.length) * 100;
}

// Total de horas estudadas
function calcularHorasEstudo(periodo = 'mes') {
  const sessoes = getSessoesPorPeriodo(periodo);
  const totalSegundos = sessoes.reduce((acc, s) => acc + s.duracao, 0);
  return totalSegundos / 3600;
}

// Streak de dias estudados
function calcularStreak() {
  const sessoes = ordenarSessoesPorData();
  let streak = 0;
  let dataAtual = new Date();
  // lógica de streak...
  return streak;
}
```

## Views e Filtros

### View Lista
- Filtros: Status, Prioridade, Área, Tags
- Ordenação: Prioridade, Data criação, Data revisão, Alfabética

### View Calendário
- Tópicos agendados por data
- Revisões pendentes destacadas

### View Kanban
- Colunas: Não iniciado | Estudando | Concluído | Precisa revisão
- Drag and drop para mudar status

## Performance

- **Limite recomendado**: 1000 tópicos, 5000 sessões
- **Lazy loading**: Carregar apenas últimos 90 dias de sessões por padrão
- **Paginação**: Listas com >50 itens devem ter paginação
- **Índices**: Criar maps de areaId → topicos para lookup O(1)
