# Configuração do Firebase

> **Status:** Fase 1 - Discovery & Alignment  
> **Data:** Novembro 2025  
> **Owner:** Backend Specialist + Devops Specialist

## Pré-requisitos

1. Conta Google
2. Acesso ao [Firebase Console](https://console.firebase.google.com/)

## Passo 1: Criar Projeto Firebase

1. Acesse o [Firebase Console](https://console.firebase.google.com/)
2. Clique em "Adicionar projeto" (ou "Create a project")
3. Preencha o nome do projeto: `gerenciador-pedro-v3` (ou outro nome)
4. Aceite os termos e clique em "Continuar"
5. Opcionalmente, desabilite Google Analytics (não necessário para MVP)
6. Clique em "Criar projeto"

## Passo 2: Criar Firestore Database

1. No menu lateral, clique em "Firestore Database"
2. Clique em "Criar banco de dados"
3. Escolha o modo de segurança:
   - **Para desenvolvimento:** Escolha "Modo de teste" (permissivo)
   - **Para produção:** Escolha "Modo de produção" e configure regras
4. Selecione a localização do banco (ex: `us-central1` ou `southamerica-east1` para Brasil)
5. Clique em "Habilitar"

## Passo 3: Configurar Regras de Segurança

No Firebase Console, vá em Firestore Database > Regras:

### Para Desenvolvimento (Modo Teste):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.time < timestamp.date(2025, 12, 31);
    }
  }
}
```

⚠️ **ATENÇÃO:** Estas regras são permissivas e expiram em uma data. Use apenas para desenvolvimento!

### Para Produção (MVP Single-User):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Para MVP single-user (default)
    match /users/default/{document=**} {
      allow read, write: if true;
    }
    
    // Bloquear acesso a outros usuários
    match /users/{userId}/{document=**} {
      allow read, write: if false;
    }
    
    // Bloquear acesso a outras coleções
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### Para Produção (Futuro Multi-User):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Passo 4: Obter Credenciais da Aplicação Web

1. No Firebase Console, clique no ícone de engrenagem (⚙️) > "Configurações do projeto"
2. Role até "Seus aplicativos" e clique no ícone `</>` (Web)
3. Preencha o nome do app: `gerenciador-pedro-v3` (ou outro nome)
4. Opcionalmente, configure Firebase Hosting (não necessário agora)
5. Clique em "Registrar app"
6. **Copie as credenciais** (você verá algo como):

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "gerenciador-pedro-v3.firebaseapp.com",
  projectId: "gerenciador-pedro-v3",
  storageBucket: "gerenciador-pedro-v3.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef..."
};
```

## Passo 5: Configurar Variáveis de Ambiente

### Criar arquivo `.env.local`

Na raiz do projeto, crie o arquivo `.env.local` (este arquivo não será commitado no git):

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyC...
VITE_FIREBASE_AUTH_DOMAIN=gerenciador-pedro-v3.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=gerenciador-pedro-v3
VITE_FIREBASE_STORAGE_BUCKET=gerenciador-pedro-v3.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef...

# Base URL para deploy (opcional)
BASE_URL=./
```

**⚠️ IMPORTANTE:** 
- NUNCA commite o arquivo `.env.local` no git
- Use apenas variáveis `VITE_*` para expor ao frontend
- Mantenha as credenciais seguras

### Criar arquivo `.env.example` (para referência)

Crie um arquivo `.env.example` na raiz com valores de exemplo (este arquivo pode ser commitado):

```env
# Firebase Configuration
# Copie este arquivo para .env.local e preencha com suas credenciais do Firebase

VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef...

BASE_URL=./
```

## Passo 6: Adicionar Firebase SDK ao Projeto

Execute no terminal:

```bash
npm install firebase
```

## Passo 7: Configurar Índices do Firestore

No Firebase Console, vá em Firestore Database > Índices e crie os seguintes índices compostos:

### Índice 1: Tarefas por Status e Data
- **Coleção:** `users/default/tarefas`
- **Campos:**
  - `status` (Ascendente)
  - `_lastModified` (Descendente)
- **Tipo:** Composto

### Índice 2: Tarefas Rotina por Categoria
- **Coleção:** `users/default/tarefasRotina`
- **Campos:**
  - `categoria` (Ascendente)
  - `_lastModified` (Descendente)
- **Tipo:** Composto

### Índice 3: Histórico por Data
- **Coleção:** `users/default/historico`
- **Campos:**
  - `dataExecucao` (Descendente)
- **Tipo:** Simples

**Nota:** O Firestore criará automaticamente índices conforme necessário durante o desenvolvimento, mas é bom criar antecipadamente para melhor performance.

## Passo 8: Verificar Configuração

Após configurar tudo, teste a conexão:

1. Inicie o servidor de desenvolvimento: `npm run dev`
2. Abra o console do navegador (F12)
3. Verifique se não há erros de conexão com Firebase
4. Verifique se o cache IndexedDB está funcionando

## Troubleshooting

### Erro: "Firebase: Error (auth/api-key-not-valid)"

**Solução:** Verifique se as variáveis de ambiente estão corretas no `.env.local`

### Erro: "Firestore: Permission denied"

**Solução:** 
- Verifique as regras de segurança do Firestore
- Para desenvolvimento, use regras permissivas temporárias
- Verifique se está acessando a coleção correta (`users/default/...`)

### Erro: "IndexedDB not available"

**Solução:** 
- Verifique se está usando um navegador moderno
- Teste em modo anônimo (sem extensões que bloqueiam IndexedDB)

### Variáveis de ambiente não funcionam

**Solução:**
- Certifique-se de que as variáveis começam com `VITE_`
- Reinicie o servidor de desenvolvimento após criar `.env.local`
- Verifique se o arquivo está na raiz do projeto

## Próximos Passos

Após configurar o Firebase:

1. ✅ Verificar conexão funcionando
2. ⏭️ Implementar `firebase.js` com configuração real
3. ⏭️ Implementar `firebase-service.js` com métodos reais
4. ⏭️ Testar operações básicas de CRUD

## Recursos Adicionais

- [Documentação do Firebase](https://firebase.google.com/docs)
- [Documentação do Firestore](https://firebase.google.com/docs/firestore)
- [Guia de Regras de Segurança](https://firebase.google.com/docs/firestore/security/get-started)
- [Índices do Firestore](https://firebase.google.com/docs/firestore/query-data/indexing)

