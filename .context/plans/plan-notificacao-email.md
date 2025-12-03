---
id: plan-notificacao-email
status: active
ai_update_goal: "Implementar sistema de notificações por email para lembretes de tarefas agendadas"
required_inputs:
  - "Requisitos do usuário: modo single-user, backend Node.js, SendGrid, notificações 5 minutos antes"
  - "Arquitetura atual: frontend Vanilla JS + Firebase Firestore (offline-first)"
  - "Estrutura de tarefas: tarefas e tarefasRotina com campo 'time'"
success_criteria:
  - "Backend Node.js rodando com scheduler que verifica tarefas a cada minuto"
  - "Emails enviados via SendGrid 5 minutos antes do horário da tarefa"
  - "UI de configurações onde usuário pode cadastrar email e gerenciar notificações por tarefa"
  - "Sistema de preferências permite ativar/desativar notificações individualmente"
related_agents:
  - "backend-specialist"
  - "frontend-specialist"
  - "devops-specialist"
---

<!-- agent-update:start:plan-notificacao-email -->
# Plano: Sistema de Notificações por Email

> Implementar um sistema completo de notificações por email que envie lembretes automáticos 5 minutos antes do horário agendado de cada tarefa. O sistema permitirá que o usuário configure seu email e gerencie preferências de notificação por tarefa individualmente.

## Task Snapshot
- **Primary goal:** Criar sistema de notificações por email com backend Node.js e interface de configuração no frontend
- **Success signal:** 
  - Usuário recebe emails 5 minutos antes das tarefas agendadas
  - UI de configurações permite gerenciar email e preferências por tarefa
  - Sistema respeita preferências ativadas/desativadas individualmente
  - Aplicação mantém funcionamento offline-first existente
- **Key references:**
  - [Documentation Index](../docs/README.md)
  - [Agent Handbook](../agents/README.md)
  - [Plans Index](./README.md)

## Agent Lineup
| Agent | Role in this plan | Playbook | First responsibility focus |
| --- | --- | --- | --- |
| Backend Specialist | Desenvolver servidor Node.js com scheduler e integração SendGrid/Firebase | [Backend Specialist](../agents/backend-specialist.md) | Criar Express server com cron job que verifica tarefas a cada minuto |
| Frontend Specialist | Implementar UI de configurações com gerenciamento de email e preferências | [Frontend Specialist](../agents/frontend-specialist.md) | Criar view /settings com formulário de email e toggles por tarefa |
| Devops Specialist | Realizar deploy do backend no Render.com e configurar variáveis de ambiente | [Devops Specialist](../agents/devops-specialist.md) | Setup Render.com com Firebase Service Account e SendGrid API keys |

## Documentation Touchpoints
| Guide | File | Task Marker | Primary Inputs |
| --- | --- | --- | --- |
| Project Overview | [project-overview.md](../docs/project-overview.md) | agent-update:project-overview | Arquitetura atual (Vanilla JS + Firebase), novo backend Node.js |
| Architecture Notes | [architecture.md](../docs/architecture.md) | agent-update:architecture-notes | Backend standalone, Firebase Firestore, SendGrid integration |
| Development Workflow | [development-workflow.md](../docs/development-workflow.md) | agent-update:development-workflow | Processo de deploy backend separado do frontend |
| Testing Strategy | [testing-strategy.md](../docs/testing-strategy.md) | agent-update:testing-strategy | Testes E2E de envio de emails, edge cases de timezone |
| Glossary & Domain Concepts | [glossary.md](../docs/glossary.md) | agent-update:glossary | Conceitos: notification window, task reminder, notification settings |
| Data Flow & Integrations | [data-flow.md](../docs/data-flow.md) | agent-update:data-flow | Fluxo: Scheduler → Firestore → SendGrid → Email |
| Security & Compliance Notes | [security.md](../docs/security.md) | agent-update:security | Firebase Admin credentials, SendGrid API keys, email privacy |
| Tooling & Productivity Guide | [tooling.md](../docs/tooling.md) | agent-update:tooling | Render.com deployment, SendGrid dashboard, Firebase console |

## Risk Assessment

### Identified Risks
| Risk | Probability | Impact | Mitigation Strategy | Owner |
| --- | --- | --- | --- | --- |
| Emails enviados para spam | Medium | High | Verificar sender email no SendGrid, seguir SPF/DKIM best practices, testar com Gmail/Outlook | Backend Specialist |
| Backend downtime = notificações perdidas | Medium | Medium | Usar Render.com (reliable), implementar health checks, monitorar logs diariamente | Devops Specialist |
| Timezone confusion (UTC vs local) | Low | High | Armazenar tudo em ISO 8601 UTC, usar date-fns-tz, permitir configuração de fuso horário | Backend Specialist |
| Emails duplicados | Low | Medium | Implementar Set em memória + registros em notificationLogs, limpeza diária | Backend Specialist |
| Custo SendGrid excedido | Low | Low | Free tier: 100 emails/dia suficiente para single-user (~20/dia max) | N/A |

### Dependencies
- **Internal:** 
  - Frontend existente: botão "Configurações" na sidebar (Sidebar.js:152)
  - Router atual: adicionar rota /settings
  - Firebase Firestore: estrutura users/default/tarefas e tarefasRotina
- **External:** 
  - SendGrid API (free tier)
  - Render.com hosting (free tier)
  - Firebase Firestore (já existente)
- **Technical:** 
  - Node.js 18+ no ambiente de produção
  - Firebase Admin SDK credentials
  - SendGrid verified sender email

### Assumptions
- Modo single-user permanece (userId='default')
- Estrutura atual de tarefas não muda (campos: time, titulo, descricao, completed, prioridade)
- Aplicação mantém offline-first capability (backend é adicional, não substitui)
- Usuário tem acesso a email para verificação SendGrid
- Free tiers de SendGrid e Render.com são suficientes

## Resource Estimation

### Time Allocation
| Phase | Estimated Effort | Calendar Time | Team Size |
| --- | --- | --- | --- |
| Phase 1 - Backend Setup | 3 person-days | 3-5 days | 1 (Backend Specialist) |
| Phase 2 - Scheduler Implementation | 3 person-days | 3-5 days | 1 (Backend Specialist) |
| Phase 3 - Frontend Settings UI | 3 person-days | 3-5 days | 1 (Frontend Specialist) |
| Phase 4 - Deployment | 3 person-days | 3-5 days | 1 (Devops Specialist) |
| Phase 5 - E2E Testing | 3 person-days | 3-5 days | 1-2 (All) |
| **Total** | **15 person-days** | **3-4 weeks** | **-** |

### Required Skills
- Backend: Node.js, Express, Cron jobs, Firebase Admin SDK
- Frontend: Vanilla JavaScript, CSS, Firebase Firestore client SDK
- DevOps: Render.com deployment, environment variables management
- Email: SendGrid API, HTML email templates
- Date handling: Timezone manipulation, date-fns library

### Resource Availability
- **Available:** Backend Specialist, Frontend Specialist, Devops Specialist (part-time)
- **Blocked:** Nenhum conflito identificado
- **Escalation:** Projeto owner (pedro) se recursos insuficientes

## Working Phases

### Phase 1 — Backend Setup & Structure
**Responsável:** Backend Specialist

**Steps**
1. Criar estrutura de diretórios `backend/` com src/, config/, services/, templates/
2. Inicializar package.json com dependências: express, firebase-admin, @sendgrid/mail, node-cron, date-fns, dotenv
3. Configurar Firebase Admin SDK em `backend/src/config/firebase-admin.js`
4. Configurar SendGrid client em `backend/src/config/sendgrid.js`
5. Implementar Express server básico com endpoint /health em `backend/src/index.js`
6. Criar template HTML do email em `backend/src/templates/task-reminder.html`

**Deliverables**
- `backend/src/index.js` - Express server rodando na porta 3001
- `backend/src/config/firebase-admin.js` - Conexão Firestore funcionando
- `backend/src/config/sendgrid.js` - SendGrid client configurado
- `backend/src/templates/task-reminder.html` - Template responsivo do email
- `backend/.env.example` - Template de variáveis de ambiente
- GET /health retornando 200 OK

**Validation Checklist**
- [ ] `npm start` inicia servidor sem erros
- [ ] GET /health retorna status 200 com JSON válido
- [ ] Firebase Admin conecta ao Firestore (log de conexão)
- [ ] SendGrid API key validada (teste de conexão)
- [ ] Template HTML renderiza corretamente em browser

**Commit Checkpoint**
```bash
git add backend/
git commit -m "feat(backend): setup Express server with Firebase and SendGrid"
```

---

### Phase 2 — Notification Scheduler Implementation
**Responsável:** Backend Specialist

**Steps**
1. Implementar `notification-scheduler.js` com node-cron executando a cada minuto
2. Criar lógica de janela de 5 minutos usando date-fns (addMinutes, isWithinInterval)
3. Query Firestore para buscar tarefas nas coleções `tarefas` e `tarefasRotina` com `completed=false`
4. Verificar preferências de notificação em `/users/default` documento
5. Implementar prevenção de duplicatas com Set em memória (chave: `${taskId}-${timestamp}`)
6. Criar `email-service.js` para integração SendGrid e envio de emails
7. Registrar envios em `/users/default/notificationLogs/` no Firestore
8. Adicionar error handling e logging detalhado

**Deliverables**
- `backend/src/services/notification-scheduler.js` - Cron job principal
- `backend/src/services/email-service.js` - Lógica de envio de emails
- Logs estruturados (timestamp, taskId, status, email)
- Sistema de prevenção de duplicatas funcionando

**Lógica Chave**
```javascript
// Janela de notificação: 5 minutos antes
const now = new Date();
const windowStart = addMinutes(now, 5);
const windowEnd = addMinutes(now, 6); // janela de 1 minuto

// Query tarefas agendadas
const tasksSnapshot = await db
  .collection('users/default/tarefas')
  .where('completed', '==', false)
  .get();

// Filtrar por janela de tempo e preferências
for (const doc of tasksSnapshot.docs) {
  const task = { id: doc.id, ...doc.data() };
  const taskTime = parseISO(task.time);
  
  if (isWithinInterval(taskTime, { start: windowStart, end: windowEnd })) {
    const userDoc = await db.doc('users/default').get();
    const userData = userDoc.data();
    const settings = userData.notificationSettings?.[task.id];
    
    if (settings?.enabled !== false && userData.email) {
      await sendTaskReminder(userData.email, task);
      await logNotification(task.id, taskTime);
    }
  }
}
```

**Validation Checklist**
- [ ] Cron job executa automaticamente a cada minuto
- [ ] Identifica corretamente tarefas na janela de 5 minutos
- [ ] Respeita preferências do usuário (enabled/disabled)
- [ ] Não envia emails duplicados (mesmo com múltiplas execuções)
- [ ] Registra logs em Firestore collection notificationLogs
- [ ] Handle graceful de erros (SendGrid down, Firestore offline)

**Commit Checkpoint**
```bash
git add backend/src/services/
git commit -m "feat(scheduler): implement notification scheduler with 5-min window"
```

---

### Phase 3 — Frontend Settings UI
**Responsável:** Frontend Specialist

**Steps**
1. Criar `src/views/Settings.js` com view completa de configurações
2. Criar `src/styles/settings.css` com estilos responsivos
3. Adicionar rota `/settings` no `src/router.js`
4. Modificar `src/components/Sidebar.js:152` para navegar para `/settings` ao clicar em "Configurações"
5. Importar `settings.css` no `index.html`
6. Implementar seção "Email para Notificações" com input e validação
7. Implementar seção "Notificações por Tarefa" com lista de tarefas e toggles ON/OFF
8. Implementar seção "Fuso Horário" com select (São Paulo, UTC, etc.)
9. Integrar com Firebase Firestore para salvar/carregar dados do documento `/users/default`
10. Adicionar feedback visual (loading states, success/error messages)

**UI Structure**
```
┌─────────────────────────────────────────────┐
│ ⚙️ Configurações                              │
├─────────────────────────────────────────────┤
│ 📧 Email para Notificações                   │
│ ┌─────────────────────┐                     │
│ │ seu@email.com       │ [Salvar]            │
│ └─────────────────────┘                     │
├─────────────────────────────────────────────┤
│ 🌍 Fuso Horário                              │
│ [America/Sao_Paulo ▼]                       │
├─────────────────────────────────────────────┤
│ 🔔 Notificações por Tarefa                   │
│ ┌───────────────────────────────────────┐   │
│ │ Reunião com cliente                   │   │
│ │ 📅 02/12/2025 14:00    [●───] ON      │   │
│ ├───────────────────────────────────────┤   │
│ │ Estudar React                         │   │
│ │ 📅 02/12/2025 16:00    [───○] OFF     │   │
│ └───────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

**Deliverables**
- `src/views/Settings.js` - View completa com todas as seções
- `src/styles/settings.css` - Estilos responsivos (mobile/desktop)
- `src/router.js` - Nova rota `/settings` registrada
- `src/components/Sidebar.js` - Navegação para Settings implementada
- `index.html` - Import do CSS de settings

**Firebase Integration**
```javascript
// Salvar email
await firebaseService.updateDocument('users', 'default', {
  email: 'user@example.com'
});

// Toggle notificação
await firebaseService.updateDocument('users', 'default', {
  [`notificationSettings.${taskId}`]: {
    enabled: true,
    lastModified: new Date().toISOString()
  }
});

// Salvar timezone
await firebaseService.updateDocument('users', 'default', {
  timezone: 'America/Sao_Paulo'
});
```

**Validation Checklist**
- [ ] Navegação de Sidebar para /settings funciona corretamente
- [ ] Email é salvo no Firestore ao clicar em "Salvar"
- [ ] Validação de email impede formatos inválidos
- [ ] Lista mostra apenas tarefas com horário agendado (time !== undefined)
- [ ] Toggles atualizam preferências em Firestore em tempo real
- [ ] UI é responsiva em mobile (320px+) e desktop
- [ ] Loading states aparecem durante operações assíncronas
- [ ] Mensagens de sucesso/erro são exibidas apropriadamente

**Commit Checkpoint**
```bash
git add src/views/Settings.js src/styles/settings.css src/router.js src/components/Sidebar.js index.html
git commit -m "feat(frontend): add settings view with email and notification preferences"
```

---

### Phase 4 — Deployment & Configuration
**Responsável:** Devops Specialist

**Steps**

**4.1 SendGrid Setup**
1. Criar conta SendGrid (free tier - 100 emails/dia)
2. Realizar Single Sender Verification para email remetente
3. Criar API Key com permissão "Mail Send"
4. Testar envio de email via SendGrid dashboard
5. Documentar processo de verificação de sender

**4.2 Firebase Service Account**
1. Acessar Firebase Console → Project Settings → Service Accounts
2. Gerar nova Private Key (baixar JSON)
3. Converter JSON para string única (remover newlines)
4. Documentar processo para regeneração futura

**4.3 Render.com Deployment**
1. Criar conta no Render.com
2. Conectar repositório GitHub ao Render
3. Criar novo Web Service apontando para diretório `backend/`
4. Configurar build command: `npm install`
5. Configurar start command: `npm start`
6. Configurar environment variables:
   - `PORT=3001`
   - `FIREBASE_SERVICE_ACCOUNT_JSON=<json-credentials>`
   - `FIREBASE_DATABASE_URL=https://organizacao-pedro.firebaseio.com`
   - `SENDGRID_API_KEY=SG.xxxxx`
   - `SENDGRID_FROM_EMAIL=notifications@yourdomain.com`
   - `TZ=America/Sao_Paulo`
7. Realizar deploy inicial
8. Configurar auto-deploy em pushes para branch main

**4.4 Health Monitoring**
1. Configurar Render health check endpoint (/health)
2. Testar acesso público ao endpoint
3. Verificar logs de inicialização do servidor
4. Verificar logs do cron job (deve executar a cada minuto)

**Deliverables**
- Backend rodando em Render.com com URL pública
- SendGrid verificado e enviando emails
- Firebase Admin conectado ao Firestore de produção
- Environment variables documentadas em `.env.example`
- Documentação de deployment em `backend/README.md`

**Validation Checklist**
- [ ] Backend deployed e acessível via URL pública
- [ ] GET /health retorna 200 OK
- [ ] Logs mostram cron job executando a cada minuto
- [ ] SendGrid envia emails de teste com sucesso
- [ ] Firebase Admin conecta ao Firestore sem erros
- [ ] Timezone configurado corretamente (America/Sao_Paulo)
- [ ] Auto-deploy funciona ao push para main

**Commit Checkpoint**
```bash
git add backend/.env.example backend/README.md
git commit -m "docs(deployment): add deployment guide and env template"
```

---

### Phase 5 — End-to-End Testing & Validation
**Responsáveis:** Todos os especialistas

**Test Scenarios**

**5.1 Cadastro de Email**
- [ ] Navegar para /settings a partir da sidebar
- [ ] Inserir email válido (ex: test@example.com)
- [ ] Clicar em "Salvar" e verificar mensagem de sucesso
- [ ] Verificar que email foi salvo no Firestore (`users/default` documento)
- [ ] Tentar salvar email inválido (ex: "invalid") e verificar validação
- [ ] Verificar que campo mantém valor após reload da página

**5.2 Configuração de Notificações por Tarefa**
- [ ] Criar tarefa nova com horário para daqui a 6 minutos
- [ ] Navegar para /settings
- [ ] Verificar que tarefa aparece na lista "Notificações por Tarefa"
- [ ] Verificar que toggle está ON por padrão (notificações ativas)
- [ ] Desativar toggle (OFF)
- [ ] Verificar que preferência foi salva em Firestore (`notificationSettings[taskId].enabled=false`)
- [ ] Reativar toggle (ON) e verificar atualização no Firestore

**5.3 Envio de Email - Happy Path**
- [ ] Cadastrar email válido em /settings
- [ ] Criar tarefa com horário para exatamente daqui a 6 minutos
- [ ] Deixar notificação ativa (toggle ON)
- [ ] Aguardar 1 minuto (email deve ser enviado aos 5 min antes)
- [ ] Verificar recebimento do email na caixa de entrada
- [ ] Validar conteúdo do email:
  - [ ] Título da tarefa está presente
  - [ ] Horário formatado corretamente
  - [ ] Descrição da tarefa incluída
  - [ ] Prioridade visível (cor ou badge)
  - [ ] Template HTML renderiza bem em desktop/mobile

**5.4 Prevenção de Duplicatas**
- [ ] Criar tarefa para daqui a 6 minutos
- [ ] Verificar logs do backend durante janela de notificação
- [ ] Confirmar que apenas 1 email foi enviado
- [ ] Checar que log de notificação foi criado em `notificationLogs` collection
- [ ] Verificar que execuções subsequentes do cron não reenviam

**5.5 Tarefas Concluídas**
- [ ] Criar tarefa com horário futuro
- [ ] Marcar tarefa como concluída (`completed: true`)
- [ ] Aguardar janela de notificação
- [ ] Verificar que NÃO recebeu email
- [ ] Checar logs do backend (tarefa foi filtrada corretamente)

**5.6 Notificação Desativada**
- [ ] Criar tarefa para daqui a 6 minutos
- [ ] Desativar notificação em /settings (toggle OFF)
- [ ] Aguardar janela de notificação
- [ ] Verificar que NÃO recebeu email
- [ ] Checar logs do backend (preferência respeitada)

**5.7 Edge Cases**

**Usuário sem email**
- [ ] Não cadastrar email em /settings
- [ ] Criar tarefa com horário futuro
- [ ] Verificar logs do backend: deve logar warning "User has no email configured"
- [ ] Sistema não deve crashar

**Tarefa sem horário**
- [ ] Criar tarefa sem campo `time` (undefined)
- [ ] Navegar para /settings
- [ ] Verificar que tarefa NÃO aparece na lista de notificações
- [ ] Sistema não deve crashar

**Mudança de horário**
- [ ] Criar tarefa para daqui a 10 minutos
- [ ] Editar tarefa para daqui a 6 minutos
- [ ] Verificar que email é enviado no novo horário

**Backend offline**
- [ ] Parar servidor backend (Render.com)
- [ ] Verificar que frontend continua funcionando normalmente
- [ ] CRUD de tarefas funciona (offline-first mantido)
- [ ] Reiniciar backend
- [ ] Verificar que notificações voltam a funcionar

**SendGrid falha**
- [ ] Simular falha de SendGrid (API key inválida temporariamente)
- [ ] Verificar logs do backend: deve logar erro mas não crashar
- [ ] Scheduler continua executando
- [ ] Restaurar API key válida
- [ ] Verificar que notificações voltam a funcionar

**Timezone**
- [ ] Criar tarefa usando timezone local (America/Sao_Paulo)
- [ ] Verificar que horário no email está correto
- [ ] Testar com diferentes timezones no select de configurações

**Deliverables**
- Checklist completo de testes com resultados
- Screenshots de emails recebidos
- Logs do backend durante testes
- Lista de bugs encontrados e corrigidos
- Documentação de casos de uso em `backend/TESTING.md`

**Commit Checkpoint**
```bash
git add backend/TESTING.md
git commit -m "test: complete E2E testing and document test scenarios"
```

<!-- agent-update:end -->

## Rollback Plan

### Rollback Triggers
Iniciar rollback quando:
- Emails não estão sendo enviados após 24h de deployment
- Mais de 5 duplicatas detectadas em produção
- Backend crashando repetidamente (> 3 restarts/hora)
- Usuário reporta perda de dados em configurações
- Custo SendGrid excedendo free tier
- Frontend apresentando erros críticos (não carrega /settings)

### Rollback Procedures

#### Phase 1-2 Rollback (Backend apenas)
- **Action:** Remover deployment do Render.com, descartar commits do backend
- **Data Impact:** Nenhum (Firestore intocado, frontend funcionando)
- **Estimated Time:** < 30 minutos
- **Steps:**
  1. Pausar serviço no Render.com
  2. `git revert` commits do backend
  3. Remover environment variables do Render
  4. Notificar usuário que notificações estão temporariamente indisponíveis

#### Phase 3 Rollback (Frontend)
- **Action:** Revert commits do frontend, remover rota /settings
- **Data Impact:** Documento `/users/default` pode ter campos email e notificationSettings (safe to leave)
- **Estimated Time:** < 1 hora
- **Steps:**
  1. `git revert` commits de Settings.js e router
  2. Deploy frontend atualizado
  3. Validar que Sidebar não aponta mais para /settings
  4. Dados em Firestore não precisam ser limpos (não causam problemas)

#### Phase 4 Rollback (Deployment completo)
- **Action:** Rollback completo de backend e frontend
- **Data Impact:** Preferências de notificação perdidas (usuário precisará reconfigurar se/quando sistema retornar)
- **Estimated Time:** 2-3 horas
- **Steps:**
  1. Pausar/deletar Web Service no Render.com
  2. `git revert` todos os commits relacionados a notificações
  3. Deploy frontend sem /settings
  4. Limpar dados em Firestore (opcional):
     ```javascript
     db.doc('users/default').update({
       email: FieldValue.delete(),
       notificationSettings: FieldValue.delete(),
       timezone: FieldValue.delete()
     });
     ```
  5. Deletar collection `notificationLogs` (opcional)

### Post-Rollback Actions
1. Documentar razão do rollback em `.context/plans/plan-notificacao-email-postmortem.md`
2. Notificar usuário via issue/comentário sobre rollback e próximos passos
3. Agendar post-mortem meeting para analisar falha
4. Revisar plano com lições aprendidas antes de retry
5. Considerar proof-of-concept menor se rollback foi por problemas arquiteturais

---

## Arquivos Críticos

### Backend (Novos)
```
backend/
├── src/
│   ├── index.js                         # Express server + scheduler init
│   ├── config/
│   │   ├── firebase-admin.js           # Firebase Admin SDK setup
│   │   └── sendgrid.js                 # SendGrid client config
│   ├── services/
│   │   ├── notification-scheduler.js   # Cron job + notification logic
│   │   └── email-service.js            # Email sending via SendGrid
│   └── templates/
│       └── task-reminder.html          # HTML email template
├── package.json                         # Dependencies
├── .env.example                         # Environment variables template
└── README.md                            # Deployment documentation
```

### Frontend (Novos)
```
src/
├── views/
│   └── Settings.js                     # Settings view completa
└── styles/
    └── settings.css                     # Settings styles
```

### Frontend (Modificar)
```
src/
├── components/
│   └── Sidebar.js:152                  # Add router.navigate('/settings')
├── router.js                           # Add route '/settings'
└── index.html                          # Import settings.css
```

### Database Schema (Novo)
```
Firestore:
/users/default
{
  email: "user@example.com",
  notificationSettings: {
    "task-id-1": { enabled: true, lastModified: "2025-12-02T10:00:00Z" },
    "task-id-2": { enabled: false, lastModified: "2025-12-02T11:00:00Z" }
  },
  timezone: "America/Sao_Paulo"
}

/users/default/notificationLogs/{logId}
{
  taskId: "task-123",
  taskTime: "2025-12-02T14:00:00Z",
  sentAt: "2025-12-02T13:55:00Z",
  status: "sent" | "failed",
  error: "optional error message"
}
```

---

## Environment Variables

### Backend (.env)
```bash
PORT=3001
FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account","project_id":"..."}
FIREBASE_DATABASE_URL=https://organizacao-pedro.firebaseio.com
SENDGRID_API_KEY=SG.xxxxx
SENDGRID_FROM_EMAIL=notifications@yourdomain.com
TZ=America/Sao_Paulo
NODE_ENV=production
```

### Frontend
Sem mudanças - configuração existente em `public/firebase-config.json` permanece.

---

## Success Metrics

### Functional Metrics
- [ ] 100% das tarefas agendadas geram notificações quando ativas
- [ ] 0 emails duplicados enviados
- [ ] Tempo de envio: exatamente 5 minutos antes (±30 segundos)
- [ ] UI de configurações responsiva em todos os breakpoints
- [ ] Preferências salvam/carregam corretamente em 100% dos casos

### Performance Metrics
- [ ] Scheduler executa em < 5 segundos por iteração
- [ ] Query Firestore retorna em < 2 segundos
- [ ] Email enviado em < 3 segundos via SendGrid
- [ ] UI /settings carrega em < 1 segundo
- [ ] Backend uptime > 99% (monitorado via Render.com)

### User Experience Metrics
- [ ] 0 crashes reportados relacionados a notificações
- [ ] Feedback positivo do usuário sobre feature
- [ ] Documentação clara permite replicar setup facilmente
- [ ] Offline-first capability mantida (frontend funciona sem backend)

---

## Follow-up & Future Enhancements

### Immediate Follow-ups (pós-deployment)
- [ ] Monitorar logs do Render.com por 1 semana
- [ ] Validar consumo de SendGrid (deve estar < 50 emails/dia)
- [ ] Coletar feedback do usuário sobre formato do email
- [ ] Documentar troubleshooting comum em README

### Future Enhancements (v2.0)
- [ ] Multi-user support (permitir múltiplos usuários)
- [ ] Notificações via SMS (Twilio integration)
- [ ] Customizar intervalo de lembrete (5/10/15/30 minutos)
- [ ] Snooze de notificações
- [ ] Estatísticas de notificações enviadas (dashboard)
- [ ] Notificações push (Web Push API)
- [ ] Integração com calendários (Google Calendar, Outlook)
- [ ] Retry queue para falhas de envio
- [ ] A/B testing de templates de email
- [ ] Notificações recorrentes para tarefas repetitivas

---

## Apêndice: Exemplo de Email Template

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lembrete de Tarefa</title>
</head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0;">⏰ Lembrete de Tarefa</h1>
  </div>
  
  <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
      <h2 style="margin-top: 0; color: #333;">{{taskTitle}}</h2>
      <p style="color: #666; font-size: 14px; margin: 10px 0;">
        <strong>📅 Horário:</strong> {{taskTime}}<br>
        <strong>⚡ Prioridade:</strong> <span style="background: {{priorityColor}}; color: white; padding: 4px 12px; border-radius: 4px;">{{taskPriority}}</span>
      </p>
    </div>
    
    <div style="margin-bottom: 20px;">
      <h3 style="color: #333; font-size: 16px;">Descrição:</h3>
      <p style="color: #666; line-height: 1.6;">{{taskDescription}}</p>
    </div>
    
    <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; border-radius: 4px;">
      <p style="margin: 0; color: #856404;">
        <strong>⏱️ Esta tarefa começará em 5 minutos!</strong>
      </p>
    </div>
  </div>
  
  <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
    <p>Sistema de Gestão de Tarefas | Pedro's App</p>
    <p>Para gerenciar suas notificações, acesse <a href="{{appUrl}}" style="color: #667eea;">Configurações</a></p>
  </div>
</body>
</html>
```

---

**Status:** Plano aprovado e pronto para execução  
**Última atualização:** 02/12/2025  
**Próximo passo:** Iniciar Phase 1 (Backend Setup)




