# Firebase - Quick Start Guide

> **Status:** ✅ Configurado e Pronto  
> **Data:** Novembro 2025

## ✅ Checklist de Configuração

- [x] Firebase SDK instalado (`npm install firebase`)
- [x] Projeto Firebase criado no Console
- [x] Firestore Database configurado
- [x] Variáveis de ambiente no `.env.local`
- [x] Regras de segurança do Firestore configuradas

## 🚀 Como Verificar se Está Funcionando

### 1. Console do Navegador

Abra o console do navegador (F12) e verifique:

```
✅ Firebase inicializado com sucesso
✅ Firebase Service disponível
✅ Store inicializado (modo Firebase + local)
✅ Notificações de sincronização ativadas
```

Se você ver esses logs, tudo está funcionando!

### 2. Diagnóstico Automático

O sistema executa diagnóstico automático em desenvolvimento. Após 2 segundos de carregar a página, você verá no console:

```
🔥 Diagnóstico Firebase
1. Verificando configuração...
   ✅ Firebase configurado
2. Testando conexão com Firestore...
   ✅ Conexão com Firestore OK
3. Status de sincronização...
   🌐 Status: Online
   ✅ Operações pendentes: 0
...
```

### 3. Teste Manual

Execute no console do navegador:

```javascript
// Verificar status do Firebase
import { checkFirebaseStatus } from './src/utils/firebase-diagnostics.js';
const status = await checkFirebaseStatus();
console.log(status);

// Ou executar diagnóstico completo
import { diagnoseFirebase } from './src/utils/firebase-diagnostics.js';
await diagnoseFirebase();
```

## 📱 Como Funciona

### Modo Online
- ✅ Dados sincronizam automaticamente com Firestore
- ✅ Mudanças aparecem em tempo real em outros dispositivos
- ✅ Toast mostra notificação quando sincronização completa

### Modo Offline
- ✅ Dados são salvos localmente (IndexedDB)
- ✅ Operações ficam em fila
- ✅ Sincronização automática quando conexão restaurar
- ✅ Toast notifica quando sincronizar

### Primeira Sincronização
- Sistema carrega dados do Firestore se disponível
- Se não houver dados no Firestore, usa dados locais
- Próximas mudanças sincronizam automaticamente

## 🔍 Verificar no Firebase Console

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Selecione seu projeto
3. Vá em **Firestore Database**
4. Verifique a estrutura:

```
users/
  └── default/
      ├── tarefas/
      ├── tarefasRotina/
      ├── historico/
      ├── categorias/
      └── ...
```

## 🐛 Troubleshooting

### Firebase não inicializa

**Sintomas:** Log mostra "⚠️ Firebase não configurado"

**Soluções:**
- Verifique se `.env.local` existe na raiz do projeto
- Verifique se todas as variáveis `VITE_FIREBASE_*` estão preenchidas
- Reinicie o servidor de desenvolvimento (`npm run dev`)

### Erro de conexão

**Sintomas:** "❌ Erro ao conectar com Firestore"

**Soluções:**
- Verifique as credenciais no `.env.local`
- Verifique as regras de segurança do Firestore
- Verifique conexão com internet
- Verifique se o Firestore está habilitado no projeto

### Dados não sincronizam

**Sintomas:** Mudanças locais não aparecem no Firestore

**Soluções:**
- Verifique se está online
- Verifique console para erros
- Verifique fila de sincronização: `firebaseSync.getPendingCount()`
- Tente forçar sincronização: `firebaseSync.sync()`

### Notificações não aparecem

**Sintomas:** Toast não mostra mensagens de sincronização

**Soluções:**
- Verifique se `firebaseSyncNotifications.start()` foi chamado
- Verifique console para erros
- Verifique se componente Toast está funcionando

## 📊 Monitoramento

### Ver Status no Console

```javascript
// Status do Firebase
firebaseService.isAvailable() // true/false

// Status de sincronização
firebaseSync.getOnlineStatus() // true/false
firebaseSync.hasPendingOperations() // true/false
firebaseSync.getPendingCount() // número
```

### Ver Fila de Sincronização

```javascript
// No console do navegador
import { firebaseCache } from './src/services/firebase-cache.js';
const queue = await firebaseCache.get('firebase-sync-queue');
console.log('Fila:', queue);
```

## 🎯 Próximos Passos

1. ✅ Testar criação de tarefa
2. ✅ Testar em outro dispositivo/navegador
3. ✅ Testar modo offline
4. ✅ Verificar sincronização automática

## 📚 Recursos

- [Guia de Configuração](./firebase-setup.md)
- [Arquitetura](./firebase-architecture.md)
- [Estratégia de Migração](./firebase-migration-strategy.md)
- [Questões e Decisões](./firebase-questions.md)

---

**Status:** ✅ Pronto para uso!  
Sistema funcionando com sincronização Firebase ativa.
