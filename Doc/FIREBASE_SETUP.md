# Configuração do Firebase

Este documento descreve como configurar o Firebase para o projeto.

## Pré-requisitos

1. Conta no Google (para acessar o Firebase Console)
2. Node.js instalado

## Passo a Passo

### 1. Criar Projeto no Firebase Console

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em "Adicionar projeto" ou "Create a project"
3. Preencha o nome do projeto (ex: `gerenciador-pedro`)
4. Configure o Google Analytics (opcional)
5. Clique em "Criar projeto"

### 2. Configurar Firestore Database

1. No menu lateral, clique em "Firestore Database"
2. Clique em "Criar banco de dados"
3. Selecione modo de produção (recomendado) ou modo de teste
4. Escolha a localização do servidor (ex: `southamerica-east1` para Brasil)
5. Clique em "Habilitar"

### 3. Configurar Regras de Segurança

1. Na aba "Regras" do Firestore, configure as regras básicas:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir leitura/escrita para todos (modo de teste)
    // IMPORTANTE: Em produção, configure autenticação apropriada
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

**⚠️ ATENÇÃO:** As regras acima permitem acesso completo. Para produção, configure autenticação adequada.

### 4. Obter Credenciais da Aplicação Web

1. No menu lateral, clique no ícone de configuração (⚙️) > "Configurações do projeto"
2. Role até "Seus aplicativos"
3. Clique no ícone `</>` (Web)
4. Registre um apelido para o app (ex: `gerenciador-pedro-web`)
5. Marque a opção "Também configure o Firebase Hosting" (opcional)
6. Clique em "Registrar app"
7. Copie as credenciais exibidas

### 5. Configurar Variáveis de Ambiente

1. Crie um arquivo `.env.local` na raiz do projeto:

```bash
VITE_FIREBASE_API_KEY=sua_api_key_aqui
VITE_FIREBASE_AUTH_DOMAIN=seu_projeto_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu_projeto_id
VITE_FIREBASE_STORAGE_BUCKET=seu_projeto_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_messaging_sender_id
VITE_FIREBASE_APP_ID=seu_app_id
```

2. Substitua os valores pelas credenciais obtidas no passo anterior

**⚠️ IMPORTANTE:**
- O arquivo `.env.local` está no `.gitignore` e não será commitado
- Não compartilhe essas credenciais publicamente
- Para produção, use variáveis de ambiente seguras no seu provedor de hospedagem

## Estrutura de Dados no Firestore

O projeto organiza os dados nas seguintes coleções:

### Coleções

1. **`tarefas`** - Tarefas de projetos e home
   - Documentos: `{tarefaId}`
   - Campos: `tipo`, `titulo`, `descricao`, `status`, etc.

2. **`rotina`** - Tarefas de rotina e histórico
   - Documento: `{userId}` (atualmente `"default"`)
   - Campos: `tarefasRotina`, `historico`, `contadorRotina`

3. **`categorias`** - Categorias da rotina
   - Documentos: `{categoriaId}`
   - Campos: `nome`, `cor`, `icone`, etc.

4. **`estudos`** - Áreas, tópicos e sessões de estudo
   - Documento: `{userId}` (atualmente `"default"`)
   - Campos: `areasEstudo`, `topicosEstudo`, `sessoesEstudo`, etc.

5. **`notas`** - Notas rápidas dos estudos
   - Documentos: `notas_{topicoId}` ou `notas_global`
   - Campos: `topicoId`, `content`, `timestamp`

6. **`config`** - Configurações globais
   - Documento: `{userId}` (atualmente `"default"`)
   - Campos: `streak`, `conquistas`, `avaliacoesDiarias`, `darkMode`, etc.

## Migração de Dados

A migração do localStorage para o Firestore é executada automaticamente na primeira inicialização. Os dados antigos são preservados no localStorage como backup.

Para executar a migração manualmente:

```javascript
import { migrateLocalStorageToFirebase } from './src/utils/migrate-localStorage-to-firebase.js';

migrateLocalStorageToFirebase().then(result => {
    console.log('Migração concluída:', result);
});
```

## Suporte Offline

O projeto utiliza:

- **IndexedDB** para cache local (via biblioteca `idb`)
- **Persistência offline do Firestore** para sincronização automática
- **Fila de sincronização** para operações offline

Quando o app estiver offline:
1. As operações são salvas no cache local
2. Uma fila de sincronização é mantida
3. Ao voltar online, os dados são sincronizados automaticamente

## Monitoramento e Logs

No Firebase Console, você pode monitorar:
- Uso do Firestore (leitura/escrita)
- Regras de segurança que estão sendo aplicadas
- Índices necessários (se houver queries complexas)

## Troubleshooting

### Erro: "Firebase não está disponível"

- Verifique se as variáveis de ambiente estão configuradas corretamente
- Verifique se o arquivo `.env.local` existe e está na raiz do projeto
- Reinicie o servidor de desenvolvimento após criar/editar `.env.local`

### Erro: "Permission denied"

- Verifique as regras de segurança do Firestore
- Verifique se o modo de segurança está configurado corretamente

### Dados não sincronizam

- Verifique a conexão com a internet
- Verifique o console do navegador para erros
- Verifique se a persistência offline está habilitada no Firestore

## Próximos Passos

Para produção, considere:
1. Implementar autenticação de usuários (Firebase Auth)
2. Configurar regras de segurança apropriadas
3. Configurar índices para queries complexas
4. Monitorar uso e custos do Firebase
5. Configurar backup automático

## Recursos Adicionais

- [Documentação do Firestore](https://firebase.google.com/docs/firestore)
- [Regras de Segurança](https://firebase.google.com/docs/firestore/security/get-started)
- [Persistência Offline](https://firebase.google.com/docs/firestore/manage-data/enable-offline)

