# 📢 Notificações de Menções

## 🎯 **O Que é:**

Quando alguém menciona você em um comentário de ticket do Jira (usando @seunome), você receberá:

1. ✅ **Notificação no sino** (badge roxo no app)
2. ✅ **Notificação desktop** do sistema operacional
3. ✅ **Som de alerta** (opcional)

---

## 🔔 **Como Funciona:**

### **1. Detecção Automática:**
O app verifica tickets atualizados nos **últimos 3 dias** em busca de menções.

### **2. Identificação:**
- Busca por `@seu.email@empresa.com` nos comentários
- Detecta menções no formato Jira (ADF - Atlassian Document Format)

### **3. Notificação:**
Quando encontrar uma nova menção:
- 📢 Adiciona notificação no **sino** (canto superior direito)
- 🔔 Mostra **notificação desktop** (se habilitada)
- 🔊 Toca **som** (se habilitado)

---

## ⚙️ **Configuração:**

### **Ativar/Desativar:**

1. Abra o app
2. Clique no ícone **⚙️ Configurações**
3. Role até **"Notificações Desktop"**
4. Marque ou desmarque:
   ```
   ☑️ 📢 Quando você for mencionado
   ```

### **Frequência de Verificação:**

As menções são verificadas:
- **Automaticamente** a cada X segundos (configurável em "Intervalo de Atualização")
- **Manualmente** ao clicar no botão "🔄 Refresh"

---

## 📊 **Tipos de Notificação:**

| Tipo | Ícone | Cor | O Que Significa |
|------|-------|-----|-----------------|
| **Menção** | 📢 | Roxo | Alguém mencionou você |
| Novo Ticket | 🎫 | Azul | Ticket atribuído a você |
| Mudança Status | 🔄 | Verde | Status alterado |
| Reatribuído | 👤 | Laranja | Ticket reatribuído |

---

## 🎨 **Visual no Sino:**

```
🔔 (3)  ← Badge com número de notificações
└─ Clique para ver lista:
   
   ┌──────────────────────────────────┐
   │ 📢 Você foi mencionado           │
   │ ITOPS-12345                      │
   │ João Silva mencionou você...     │
   │ há 5 minutos                     │
   └──────────────────────────────────┘
```

---

## 🔔 **Notificação Desktop:**

```
┌────────────────────────────────────┐
│  Jira Monitor                      │
│                                    │
│  📢 Você foi mencionado - ITOPS-123│
│  João Silva: Problema no servidor  │
└────────────────────────────────────┘
```

**Clique na notificação** para abrir o ticket diretamente!

---

## 💡 **Dicas:**

### **1. Verificar Permissões:**
Se não receber notificações desktop:
- macOS: `Preferências do Sistema` → `Notificações` → `Jira Monitor` → **Ativar**

### **2. Personalizar Sons:**
```
⚙️ Configurações → 🔊 Sons de Notificação
```

### **3. Ver Todas as Notificações:**
- Clique no **sino** (🔔) no canto superior direito
- Veja o histórico completo

### **4. Limpar Notificações:**
- Clique no **X** em cada notificação
- Ou clique em **"Limpar Tudo"**

---

## 🧪 **Testar:**

### **Como Testar Menções:**

1. **Peça para alguém mencionar você** em um comentário do Jira:
   ```
   @seu.nome Preciso da sua ajuda aqui!
   ```

2. **Aguarde alguns segundos** (ou clique em Refresh)

3. **Veja a notificação** aparecer:
   - Badge no sino: 🔔 (1)
   - Notificação desktop
   - Som (se habilitado)

---

## 🐛 **Troubleshooting:**

### **Problema: Não recebo notificações de menções**

✅ **Verifique:**
1. Notificações desktop estão **habilitadas**:
   - ⚙️ Configurações → ☑️ Notificações Desktop

2. Tipo de notificação de menção está **ativo**:
   - ⚙️ Configurações → ☑️ 📢 Quando você for mencionado

3. Permissões do sistema estão **OK**:
   - macOS: Preferências → Notificações → Jira Monitor

4. O app está **conectado ao Jira**:
   - Indicador verde no topo

### **Problema: Muitas notificações**

✅ **Desative tipos específicos:**
```
⚙️ Configurações → Desmarque:
☐ 🎫 Novos tickets
☐ 🔄 Mudanças de status
☑️ 📢 Quando você for mencionado  ← Manter apenas este
```

---

## 📈 **Performance:**

| Aspecto | Valor |
|---------|-------|
| **Busca** | Últimos 3 dias |
| **Frequência** | A cada 60s (padrão) |
| **Impacto** | Mínimo (~1-2s) |
| **Tickets verificados** | Max 100 por busca |

---

## 🔐 **Privacidade:**

- ✅ Menções são verificadas **diretamente do Jira**
- ✅ Nenhum dado é enviado para servidores externos
- ✅ Notificações são processadas **localmente**
- ✅ Histórico fica apenas no **seu computador**

---

## 🎯 **Exemplo Real:**

```
1. João Silva adiciona comentário:
   "Hey @maria.santos, pode revisar o PR?"

2. App verifica menções (próxima atualização)

3. Detecta menção a maria.santos@empresa.com

4. Cria notificação:
   📢 Você foi mencionado - PROJ-123
   João Silva: Hey @maria.santos, pode revisar o PR?

5. Maria clica na notificação

6. Ticket abre no preview

7. Maria responde no comentário
```

---

## ✅ **Recurso Implementado!**

**Todos os arquivos modificados:**
- ✅ `jira-service.js` - Busca menções no Jira
- ✅ `main.js` - Handler IPC para menções
- ✅ `renderer.js` - Lógica de notificações
- ✅ `index.html` - Opção de configuração
- ✅ `styles.css` - Estilo roxo para badge

**Pronto para usar!** 🎉

