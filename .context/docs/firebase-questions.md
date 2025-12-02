# Questões a Esclarecer - Implementação Firebase

> **Status:** Fase 1 - Discovery & Alignment  
> **Data:** Novembro 2025  
> **Owner:** Architect Specialist + Product Owner

## Questões Críticas

### 1. Autenticação e Multi-Usuário

**Pergunta:** O sistema deve suportar múltiplos usuários desde o início ou começar como single-user?

**Opções:**
- **A)** Single-user (userId = 'default') no MVP, adicionar autenticação depois
- **B)** Multi-usuário desde o início com autenticação Firebase Auth

**Recomendação:** Opção A - MVP mais rápido, autenticação pode ser adicionada depois

**Decisão:** ✅ **[A]** Single-user (userId = 'default') - Decidido

---

### 2. Estrutura de Particionamento de Dados

**Pergunta:** Como estruturar as coleções no Firestore?

**Opções:**
- **A)** Coleções separadas por módulo: `tarefas`, `tarefasRotina`, `historico`, etc.
- **B)** Estrutura hierárquica: `users/{userId}/tarefas/{tarefaId}`
- **C)** Coleção única `data` com documentos agrupados por tipo

**Recomendação:** Opção B - Melhor para segurança e escalabilidade futura

**Decisão:** ✅ **[B]** Estrutura hierárquica `/users/{userId}/...` - Decidido

**Estrutura Proposta:**
```
/users/{userId}/
  ├── tarefas/{tarefaId}
  ├── tarefasRotina/{tarefaId}
  ├── historico/{entryId}
  ├── categorias/{categoriaId}
  └── ...
```

---

### 3. Limites e Escalabilidade

**Pergunta:** Quantas tarefas/projetos/dados por usuário esperamos?

**Considerações:**
- Limite prático do Firestore (milhões de documentos por coleção)
- Performance de queries com muitos dados
- Necessidade de paginação

**Estimativa Atual:**
- Tarefas: ~100-500 por usuário
- Tarefas Rotina: ~20-50
- Histórico: Crescente (pode precisar de limpeza periódica)
- Estudos: ~50-200 itens

**Decisão:** ✅ Estimativas confirmadas - ~100-500 tarefas, ~20-50 rotina, ~50-200 estudos

---

### 4. Frequência de Sincronização

**Pergunta:** Sincronização real-time ou batch periódico?

**Opções:**
- **A)** Real-time com listeners do Firestore (mudanças instantâneas)
- **B)** Batch periódico (ex: a cada 30 segundos)
- **C)** Híbrido: Real-time quando possível, batch quando offline

**Recomendação:** Opção C - Melhor experiência do usuário

**Decisão:** ✅ **[C]** Híbrido (real-time quando possível, batch quando offline) - Decidido

---

### 5. Estratégia de Resolução de Conflitos

**Pergunta:** Last-write-wins é suficiente ou precisamos de algo mais sofisticado?

**Situação Atual:**
- Implementação proposta: Last-write-wins baseado em `_lastModified` (serverTimestamp)

**Considerações:**
- Perda de dados se dois dispositivos editam simultaneamente
- Complexidade de merge manual vs. sobrescrita automática

**Decisão:** ✅ **Last-write-wins aceitável para MVP** - Implementar conforme arquitetura - Decidido

---

### 6. Indicador Visual de Sincronização

**Pergunta:** Onde e como exibir status de sincronização?

**Opções:**
- **A)** Badge no header mostrando status (online/offline) e contador de pendências
- **B)** Toast/notificação quando sincronização completa
- **C)** Ambos (A + B)

**Recomendação:** Opção C - Melhor feedback para o usuário

**Decisão:** ✅ **[B]** Toast/notificação quando sincronização completa - Decidido

**Localização Proposta:** Header/Sidebar, próximo ao logo ou menu

---

### 7. Migração de Dados

**Pergunta:** Migração automática na primeira execução ou manual?

**Opções:**
- **A)** Automática: Migrar silenciosamente na primeira execução
- **B)** Manual: Solicitar confirmação do usuário
- **C)** Híbrida: Migrar automaticamente, mas mostrar progresso e permitir cancelar

**Recomendação:** Opção C - Melhor controle e transparência

**Decisão:** ✅ **[C]** Híbrida (automática com progresso) - Decidido

---

### 8. Backup e Rollback

**Pergunta:** Como lidar com falhas na migração?

**Estratégia Proposta:**
1. Criar backup completo do IndexedDB antes de migrar
2. Migrar incrementalmente (módulo por módulo)
3. Validar cada módulo após migração
4. Permitir rollback se migração falhar

**Decisão:** ✅ **Começar do zero** - Não há dados existentes para migrar, sistema iniciará diretamente com Firebase - Decidido

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

**Decisão:** [ ] Validar se free tier é suficiente para MVP

---

### 10. Variáveis de Ambiente

**Pergunta:** Como gerenciar credenciais do Firebase em diferentes ambientes?

**Estratégia Proposta:**
- Usar variáveis de ambiente Vite (VITE_*)
- Arquivo `.env.example` como template
- Não commitar `.env.local` no git
- Instruções claras no README

**Decisão:** [ ] Implementado - ver `.env.example`

---

## Decisões Pendentes

- [ ] Confirmar estratégia de autenticação (single-user vs multi-user)
- [ ] Validar estrutura de coleções no Firestore
- [ ] Confirmar limites esperados de dados por usuário
- [ ] Decidir frequência de sincronização (real-time vs batch)
- [ ] Validar estratégia de resolução de conflitos
- [ ] Definir localização do indicador de sincronização
- [ ] Confirmar estratégia de migração (automática vs manual)
- [ ] Validar estratégia de backup e rollback
- [ ] Confirmar que free tier do Firebase é suficiente

---

## Próximos Passos

1. Revisar questões com stakeholders
2. Documentar decisões tomadas
3. Atualizar arquitetura conforme decisões
4. Prosseguir com implementação

