# 🚀 Configuração GitHub Actions - Notificações Automáticas Pushcut

## ✅ Sistema 100% Automático!

O GitHub Actions vai verificar **a cada 5 minutos** se alguma tarefa precisa de notificação e enviar automaticamente via Pushcut!

---

## 📋 Passo a Passo de Configuração

### **1️⃣ Configurar Secret no GitHub**

1. Acesse seu repositório: https://github.com/pedrocatarino130/demandas-pro
2. Clique em **Settings** (⚙️ Configurações)
3. No menu lateral, clique em **Secrets and variables** → **Actions**
4. Clique em **New repository secret**
5. Configure assim:
   - **Name:** `PUSHCUT_API_KEY`
   - **Secret:** `ljP19czEYJxX28x3rce_LdUZ`
6. Clique em **Add secret**

---

### **2️⃣ Fazer Commit dos Arquivos**

Você precisa fazer commit de 3 arquivos novos:

```bash
git add .
git commit -m "feat: adiciona GitHub Actions para notificações automáticas"
git push origin main
```

**Arquivos que foram criados:**
- `.github/workflows/pushcut-notifications.yml` - Workflow do GitHub Actions
- `.github/scripts/verificar-notificacoes.js` - Script de verificação
- `dados.json` - Arquivo de dados das tarefas

---

### **3️⃣ Sincronizar Tarefas**

**Sempre que criar ou editar uma tarefa:**

1. No site, clique no botão **"🔄 Sync GitHub"** (no topo)
2. Isso vai baixar o arquivo `dados.json` atualizado
3. Substitua o arquivo `dados.json` no repositório
4. Faça commit e push:

```bash
git add dados.json
git commit -m "update: atualiza tarefas"
git push origin main
```

**OU faça direto no GitHub:**
1. Acesse: https://github.com/pedrocatarino130/demandas-pro
2. Clique em `dados.json`
3. Clique no ícone de lápis (✏️ Edit)
4. Cole o conteúdo do arquivo baixado
5. Commit changes

---

### **4️⃣ Verificar se está Funcionando**

1. Acesse: https://github.com/pedrocatarino130/demandas-pro/actions
2. Você verá o workflow **"Pushcut Notificações Automáticas"** rodando
3. Ele roda **automaticamente a cada 5 minutos**!
4. Clique em um workflow para ver os logs

**Para testar manualmente:**
1. Vá em **Actions**
2. Clique em **Pushcut Notificações Automáticas**
3. Clique em **Run workflow**
4. Clique em **Run workflow** (verde)

---

## 🎯 Como Funciona

### **Automático 100%:**

```
1. A cada 5 minutos → GitHub Actions acorda
2. Lê o arquivo dados.json
3. Pega a hora atual (ex: 07:55)
4. Verifica se alguma tarefa tem horário às 08:00
5. Se sim → Envia notificação via Pushcut API
6. Você recebe no iPhone! 📱
```

### **Exemplo:**

- Tarefa: "Tomar café" às **08:00**
- GitHub Actions às **07:55** → 🔔 Envia notificação
- Você recebe: "⏰ Casa - Tomar café 🕐 Horário: 08:00"

---

## 🔧 Resolução de Problemas

### **Notificações não estão chegando?**

1. Verifique se o Secret está configurado corretamente
2. Vá em Actions e veja se há erros nos logs
3. Confirme que o arquivo `dados.json` está atualizado no GitHub
4. Verifique se criou a notificação "Tarefa" no app Pushcut

### **Como ver os logs?**

1. https://github.com/pedrocatarino130/demandas-pro/actions
2. Clique no workflow mais recente
3. Clique em **enviar-notificacoes**
4. Veja a saída do script

---

## 📱 Lembrete: Configurar Pushcut

1. Baixe **Pushcut** na App Store
2. Crie uma notificação chamada **"Tarefa"** (exatamente assim)
3. Configure como preferir (som, badge, etc.)
4. Pronto!

---

## 🎉 Pronto!

Agora você tem um sistema **100% automático**:

✅ Não precisa deixar navegador aberto  
✅ Não precisa fazer nada manualmente  
✅ Funciona 24h/dia, 7 dias/semana  
✅ Apenas crie tarefas e sincronize quando quiser  

**O GitHub Actions cuida do resto!** 🚀

