# 📋 Guia de Comandos do Jira Monitor

## 🎯 **Comandos Principais:**

### 🚀 **Para Rodar (Modo Dev):**
```bash
npm start
```
- Abre o app no modo desenvolvimento
- Console visível para debug
- Requer terminal aberto
- ✅ **Use para testar alterações no código**

---

### 📦 **Para Gerar Versão Instalável:**
```bash
npm run build
```
- Compila o aplicativo otimizado
- Gera o arquivo `.app` em `dist/mac-arm64/`
- Leva ~1-2 minutos
- ✅ **Use quando terminar de fazer mudanças**

---

### 💾 **Para Instalar em /Applications:**
```bash
./install.sh
```
- Copia o `.app` para `/Applications/`
- Remove restrições do macOS
- Pergunta se quer abrir
- ✅ **Use após rodar `npm run build`**

---

## ⚡ **Atalho Completo (Recomendado):**

### **Para Atualizar Tudo de Uma Vez:**
```bash
npm run build && ./install.sh
```

Isso vai:
1. ✅ Compilar nova versão
2. ✅ Instalar em /Applications
3. ✅ Remover quarentena do macOS
4. ✅ Oferecer para abrir

**⏱️ Tempo total: ~1-2 minutos**

---

## 🧹 **Comandos Auxiliares:**

### **Limpar Arquivos de Build:**
```bash
npm run clean
```
Use antes de gerar uma nova versão limpa.

### **Reinstalar Dependências:**
```bash
npm run install:fresh
```
Use se algo estiver quebrado (remove tudo e reinstala).

---

## 📊 **Workflow Completo:**

### **1️⃣ Fazendo Alterações no Código:**

```bash
# Editar arquivos...
# main.js, renderer.js, index.html, etc.

# Testar as mudanças
npm start

# (Pressione Ctrl+C para fechar)

# Testar novamente até ficar perfeito
npm start
```

---

### **2️⃣ Atualizando a Versão Instalada:**

```bash
# Gerar + Instalar de uma vez
npm run build && ./install.sh

# OU fazer separado:
npm run build    # Compilar
./install.sh     # Instalar
```

---

### **3️⃣ Começar do Zero (Se algo der errado):**

```bash
# Limpar tudo
npm run clean
npm run install:fresh

# Compilar novamente
npm run build

# Instalar
./install.sh
```

---

## ❌ **Comandos que NÃO existem mais:**

| ❌ Comando Antigo | ✅ Use Este |
|-------------------|-------------|
| `npm run package` | `npm run build` |
| `npm run build:dmg` | `npm run build` |

---

## 🔄 **Comparação:**

| Situação | Comando |
|----------|---------|
| **Testar código** | `npm start` |
| **Gerar versão instalável** | `npm run build` |
| **Instalar/Atualizar** | `./install.sh` |
| **Fazer tudo de uma vez** | `npm run build && ./install.sh` |
| **Limpar antes de compilar** | `npm run clean && npm run build` |

---

## 💡 **Dicas:**

### **Modo Dev vs Instalado:**

| Quando Usar | Modo Dev (`npm start`) | App Instalado (`./install.sh`) |
|-------------|------------------------|--------------------------------|
| **Testando código** | ✅ Melhor | ❌ Não |
| **Uso diário** | ❌ Inconveniente | ✅ Melhor |
| **Debug** | ✅ Console visível | ❌ Precisa DevTools |
| **Performance** | ✅ Normal | ✅ Otimizado |

---

### **Quando Compilar Nova Versão:**

✅ **Compile quando:**
- Fez mudanças no código
- Mudou ícone ou assets
- Quer usar sem terminal
- Vai distribuir para outros

❌ **Não precisa compilar se:**
- Só está testando
- Mudou algo e quer ver rapidamente
- Está debugando um erro

---

## 🎯 **Exemplos Práticos:**

### **Cenário 1: Mudei o Ícone**
```bash
# Substituir o arquivo assets/icon.png
npm run build && ./install.sh
```

### **Cenário 2: Alterei Código JavaScript**
```bash
# 1. Testar primeiro
npm start

# 2. Se funcionou, compilar e instalar
npm run build && ./install.sh
```

### **Cenário 3: App Instalado com Bug**
```bash
# 1. Fechar app
killall "Jira Monitor"

# 2. Testar em modo dev para ver o erro
npm start

# 3. Corrigir o código
# ...

# 4. Testar novamente
npm start

# 5. Quando funcionar, atualizar instalado
npm run build && ./install.sh
```

### **Cenário 4: Tudo Quebrou, Começar do Zero**
```bash
npm run clean
npm run install:fresh
npm run build
./install.sh
```

---

## 🚦 **Checklist de Atualização:**

- [ ] 1. Fazer alterações no código
- [ ] 2. Testar com `npm start`
- [ ] 3. Fechar o teste (Ctrl+C)
- [ ] 4. Compilar com `npm run build`
- [ ] 5. Instalar com `./install.sh`
- [ ] 6. Testar app instalado
- [ ] 7. ✅ Pronto!

---

## 📞 **Resumo Ultra-Rápido:**

```bash
# Para TESTAR:
npm start

# Para ATUALIZAR a versão instalada:
npm run build && ./install.sh
```

**É só isso! 🎉**

---

## ⚠️ **Importante:**

- ✅ **`npm run build`** → Compila o app
- ✅ **`./install.sh`** → Instala em /Applications
- ✅ **`npm start`** → Roda em modo dev
- ❌ **`npm run package`** → ~~Não existe mais~~

---

**Sempre que quiser atualizar sua versão instalada, use:**

```bash
npm run build && ./install.sh
```

✨ **Simples assim!** ✨
