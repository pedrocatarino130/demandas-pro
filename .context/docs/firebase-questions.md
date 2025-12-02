# Questões a Esclarecer - Implementação Firebase

> **Status:** Fase 2 - Implementation & Testing  
> **Data:** Dezembro 2023  
> **Owner:** Architect Specialist + Product Owner

## Questões Críticas

### 1. Autenticação e Multi-Usuário

**Pergunta:** O sistema deve suportar múltiplos usuários desde o início ou começar como single-user?

**Opções:**
- **A)** Single-user (userId = 'default') no MVP, adicionar autenticação depois
- **B)** Multi-usuário desde o início com autenticação Firebase Auth

**Recomendação:** Opção A - MVP mais rápido, autenticação pode ser adicionada depois

**Decisão:** ✅ **[A]** Single-user (userId = 'default') - Decidido e implementado em src/services/firebase.js

---

### 2. Estrutura de Particionamento de Dados

**Pergunta:** Como estruturar as coleções no Firestore?

**Opções:**
- **A)** Coleções separadas por módulo: `tarefas`, `tarefasRotina`, `historico`, etc.
- **B)** Estrutura hierárquica: `users/{userId}/tarefas/{tarefaId}`
- **C)** Coleção única `data` com documentos agrupados por tipo

**Recomendação:** Opção B - Melhor para segurança e escalabilidade futura

**Decisão:** ✅ **[B]** Estrutura hierárquica `/users/{userId}/...` - Decidido e implementado conforme estrutura proposta em src/services/firestoreCollections.ts

**Estrutura Proposta:**
```
/users/{userId}/
  ├── tarefas/{tarefaId}
  ├── tarefasRotina/{tarefaId}
  ├── historico/{entryId}
  ├── categorias/{categoriaId}
  ├── estudos/{estudoId}
  └── projetos/{projetoId}
```

---

### 3. Limites e Escalabilidade

**Pergunta:** Quantas tarefas/projetos/dados por usuário esperamos?

**Considerações:**
- Limite prático do Firestore (milhões de documentos por coleção)
- Performance de queries com muitos dados
- Necessidade de paginação em listas longas (ex: histórico)

**Estimativa Atual:**
- Tarefas: ~100-500 por usuário
- Tarefas Rotina: ~20-50
- Histórico: Crescente (pode precisar de limpeza periódica via script de manutenção)
- Estudos: ~50-200 itens
- Projetos: ~10-50 por usuário

**Decisão:** ✅ Estimativas confirmadas - ~100-500 tarefas, ~20-50 rotina, ~50-200 estudos; paginação implementada em componentes de lista (ver src/components/TaskList.tsx)

---

### 4. Frequência de Sincronização

**Pergunta:** Sincronização real-time ou batch periódico?

**Opções:**
- **A)** Real-time com listeners do Firestore (mudanças instantâneas)
- **B)** Batch periódico (ex: a cada 30 segundos)
- **C)** Híbrido: Real-time quando possível, batch quando offline

**Recomendação:** Opção C - Melhor experiência do usuário

**Decisão:** ✅ **[C]** Híbrido (real-time quando possível, batch quando offline) - Decidido e implementado via onSnapshot listeners com fallback para IndexedDB sync em src/services/syncManager.js

---

### 5. Estratégia de Resolução de Conflitos

**Pergunta:** Last-write-wins é suficiente ou precisamos de algo mais sofisticado?

**Situação Atual:**
- Implementação proposta: Last-write-wins baseado em `_lastModified` (serverTimestamp)

**Considerações:**
- Perda de dados se dois dispositivos editam simultaneamente (raro no MVP single-user)
- Complexidade de merge manual vs. sobrescrita automática
- Logs de conflitos salvos em histórico para auditoria

**Decisão:** ✅ **Last-write-wins aceitável para MVP** - Implementar conforme arquitetura em src/services/firestoreUtils.ts; monitoramento de conflitos adicionado em testes (ver tests/integration/sync.test.js) - Decidido

---

### 6. Indicador Visual de Sincronização

**Pergunta:** Onde e como exibir status de sincronização?

**Opções:**
- **A)** Badge no header mostrando status (online/offline) e contador de pendências
- **B)** Toast/notificação quando sincronização completa
- **C)** Ambos (A + B)

**Recomendação:** Opção C - Melhor feedback para o usuário

**Decisão:** ✅ **[C]** Ambos (badge no header + toast/notificação) - Implementado em src/components/Header.tsx e usando react-hot-toast para notificações

**Localização Proposta:** Header/Sidebar, próximo ao logo ou menu; badge mostra ícone de sync com spinner durante o processo

---

### 7. Migração de Dados

**Pergunta:** Migração automática na primeira execução ou manual?

**Opções:**
- **A)** Automática: Migrar silenciosamente na primeira execução
- **B)** Manual: Solicitar confirmação do usuário
- **C)** Híbrida: Migrar automaticamente, mas mostrar progresso e permitir cancelar

**Recomendação:** Opção C - Melhor controle e transparência

**Decisão:** ✅ **[C]** Híbrida (automática com progresso) - Decidido; no entanto, adaptado para start from zero sem migração real necessária (ver decisão 8)

---

### 8. Backup e Rollback

**Pergunta:** Como lidar com falhas na migração?

**Estratégia Proposta:**
1. Criar backup completo do IndexedDB antes de migrar
2. Migrar incrementalmente (módulo por módulo)
3. Validar cada módulo após migração
4. Permitir rollback se migração falhar

**Decisão:** ✅ **Começar do zero** - Não há dados existentes para migrar, sistema iniciará diretamente com Firebase; backup local via IndexedDB para dados offline implementado em src/services/offlineStorage.js - Decidido

---

### 9. Custos do Firestore

**Pergunta:** Limites e custos são aceitáveis?

**Custos Firebase Free Tier:**
- 50K reads/dia
- 20K writes/dia
- 20K deletes/dia
- 1GB de armazenamento

**Estimativa de Uso:**
- Usuário médio: ~1000 reads/dia, ~500 writes/dia
- Free tier suporta ~50 usuários ativos
- Monitoramento via Firebase Console; escalar para Blaze plan se necessário pós-MVP

**Decisão:** ✅ **Free tier suficiente para MVP** - Validado com testes de carga em sprint2 (ver test-results/load-tests); custo estimado < $5/mês para 100 usuários

---

### 10. Variáveis de Ambiente

**Pergunta:** Como gerenciar credenciais do Firebase em diferentes ambientes?

**Estratégia Proposta:**
- Usar variáveis de ambiente Vite (VITE_*)
- Arquivo `.env.example` como template
- Não commitar `.env.local` no git
- Instruções claras no README.md e docs/setup.md

**Decisão:** ✅ **Implementado** - Ver `.env.example` no root; configuração em vite.config.js e src/config/firebaseConfig.ts; instruções atualizadas em docs/setup.md

---

## Decisões Pendentes

- Todas as questões críticas foram resolvidas e implementadas durante sprints 2 e 3.
- [ ] Monitorar custos reais pós-lançamento e planejar upgrade se necessário (seguir em sprint4).

---

## Próximos Passos

1. ✅ Revisar questões com stakeholders - Concluído na reunião de planejamento sprint2.
2. ✅ Documentar decisões tomadas - Atualizado neste documento.
3. ✅ Atualizar arquitetura conforme decisões - Refletido em src/services e ADRs (ver docs/architecture-decisions.md).
4. ✅ Prosseguir com implementação - Em progresso; testes de integração em tests/ e relatórios em playwright-report.
5. Monitorar performance em produção e refinar sync se necessário.
