# 🧪 Teste do Modo Pro - Salvamento de Estado

## 📝 **Como Funciona:**

O app **SEMPRE** salva o estado atual quando você fecha. 

Se você:
- Fecha com Modo Pro **ATIVO** → Abre com Modo Pro **ATIVO** ✅
- Fecha com Modo Pro **INATIVO** → Abre com Modo Pro **INATIVO** ✅

---

## 🔬 **Teste Passo a Passo:**

### **Teste 1: Modo Pro ATIVO**

```bash
# 1. Abrir app
npm start

# 2. Pressionar F12 (abrir DevTools)

# 3. Ativar Modo Pro (clicar no botão roxo)
# Você deve ver no Console:
# 💾 Modo Pro alterado e salvo: true
# 💾 Estado salvo automaticamente: { proMode: true, ... }

# 4. Fechar o app (Cmd+Q)
# Você deve ver no TERMINAL:
# 💾 Config salva sincronamente: { proMode: true }

# 5. Abrir novamente
npm start

# 6. Pressionar F12 novamente

# 7. Ver no Console:
# 📥 Carregando Modo Pro: { configProMode: true, ... }
# 📥 Modo Pro definido como: true
# 🎨 updateProModeUI chamada, isProMode: true

# ✅ Modo Pro deve estar ATIVO
```

---

### **Teste 2: Modo Pro INATIVO**

```bash
# 1. Com o app aberto e Modo Pro ATIVO

# 2. Clicar no botão para DESATIVAR Modo Pro
# Você deve ver no Console:
# 💾 Modo Pro alterado e salvo: false

# 3. Fechar o app
# Você deve ver no TERMINAL:
# 💾 Config salva sincronamente: { proMode: false }

# 4. Abrir novamente
npm start

# 5. Ver no Console (F12):
# 📥 Carregando Modo Pro: { configProMode: false, ... }
# 📥 Modo Pro definido como: false
# 🎨 updateProModeUI chamada, isProMode: false

# ✅ Modo Pro deve estar INATIVO
```

---

## 🐛 **Se não estiver funcionando:**

### **Verificar no DevTools (F12):**

1. **Ao ativar Modo Pro:**
   - Deve aparecer: `💾 Modo Pro alterado e salvo: true`
   
2. **Ao desativar Modo Pro:**
   - Deve aparecer: `💾 Modo Pro alterado e salvo: false`

3. **Ao fechar o app (no terminal):**
   - Deve aparecer: `💾 Config salva sincronamente: { proMode: [true ou false] }`

4. **Ao abrir o app (no console do DevTools):**
   - Deve aparecer: `📥 Modo Pro definido como: [true ou false]`

---

## 🔍 **Onde Está Salvo:**

O Modo Pro é salvo em:
```
~/Library/Application Support/jira-monitor/config.json
```

Você pode ver o conteúdo com:
```bash
cat ~/Library/Application\ Support/jira-monitor/config.json | grep proMode
```

---

## ✅ **Status Esperado:**

| Ação | Resultado |
|------|-----------|
| Ativar Modo Pro + Fechar | Abre com Modo Pro ATIVO |
| Desativar Modo Pro + Fechar | Abre com Modo Pro INATIVO |
| Alternar 10x + Fechar | Abre no último estado |

---

**IMPORTANTE:** O app salva o estado **ATUAL** ao fechar, não uma preferência fixa.

