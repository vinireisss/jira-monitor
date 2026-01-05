# 📦 Como Atualizar/Instalar o Jira Monitor

## 🎯 **Para Gerar uma Nova Versão Instalável:**

### 1️⃣ **Atualizar a Versão (Opcional)**

Se você fez mudanças, atualize a versão no `package.json`:

```json
"version": "1.5.0"
```

---

### 2️⃣ **Gerar o Aplicativo**

No terminal, execute:

```bash
cd "/Users/gabriel.silva.digisystem/jira monitor"
npm run build
```

Isso vai:
- ✅ Criar uma versão otimizada do app
- ✅ Empacotar o `.app` instalável
- ✅ Incluir todas as funcionalidades do modo dev
- ✅ Criar versões para Intel (x64) e Apple Silicon (arm64)

**⏱️ Tempo:** ~1-2 minutos

---

### 3️⃣ **Instalar o Aplicativo**

#### **Método 1: Instalação Automática (Recomendado)** 🚀

Execute o script de instalação:

```bash
./install.sh
```

O script vai:
- ✅ Copiar o app para `/Applications/`
- ✅ Remover restrições do macOS
- ✅ Oferecer para abrir automaticamente

#### **Método 2: Instalação Manual**

1. **Copiar para Applications:**
   ```bash
   cp -R "dist/mac-arm64/Jira Monitor.app" /Applications/
   ```

2. **Remover quarentena do macOS:**
   ```bash
   xattr -cr "/Applications/Jira Monitor.app"
   ```

---

### 5️⃣ **Executar o Aplicativo Instalado**

1. **Abra via Finder:**
   - Vá para `/Applications/`
   - Duplo clique em `Jira Monitor.app`

2. **Ou via Terminal:**
   ```bash
   open -a "Jira Monitor"
   ```

3. **Primeira Execução:**
   - Se aparecer "não pode ser aberto porque é de desenvolvedor não identificado"
   - **Solução:** Clique com botão direito → **Abrir** → **Abrir** novamente

---

## 🔄 **Para Atualizar uma Versão Já Instalada:**

### Método 1: Usando o Script (Recomendado)

```bash
# 1. Gerar nova versão
npm run build

# 2. Instalar (vai substituir automaticamente)
./install.sh
```

### Método 2: Manual

```bash
# 1. Fechar app atual (se estiver rodando)
killall "Jira Monitor" 2>/dev/null

# 2. Remover versão antiga
rm -rf /Applications/Jira\ Monitor.app

# 3. Gerar nova versão
npm run build

# 4. Copiar nova versão
cp -R "dist/mac-arm64/Jira Monitor.app" /Applications/

# 5. Remover quarentena
xattr -cr "/Applications/Jira Monitor.app"
```

---

## ⚙️ **Comandos Disponíveis:**

| Comando | Descrição |
|---------|-----------|
| `npm start` | Rodar em modo desenvolvimento |
| `npm run dev` | Rodar em modo desenvolvimento (alias) |
| `npm run build` | Gerar build completo (.app) |
| `./install.sh` | Instalar em /Applications |
| `npm run clean` | Limpar arquivos de build |

---

## 📂 **Estrutura de Arquivos Gerados:**

```
dist/
├── mac-arm64/
│   └── Jira Monitor.app             # App para Apple Silicon (M1/M2/M3)
├── mac-x64/
│   └── Jira Monitor.app             # App para Intel (opcional)
├── Jira Monitor-1.4.0-mac.zip       # ZIP para distribuição
└── builder-effective-config.yaml    # Configuração usada
```

---

## ✅ **Verificar se Funcionou:**

### Modo Dev vs Instalado:

| Funcionalidade | Modo Dev | Instalado |
|----------------|----------|-----------|
| Conectar Jira | ✅ | ✅ |
| Cards em tempo real | ✅ | ✅ |
| Notificações | ✅ | ✅ |
| Atualizar campos | ✅ | ✅ |
| Upload/download anexos | ✅ | ✅ |
| Adicionar comentários | ✅ | ✅ |
| System tray | ✅ | ✅ |

**Todas as funcionalidades devem funcionar igualmente!**

---

## 🐛 **Problemas Comuns:**

### ❌ "Não pode ser aberto - desenvolvedor não verificado"

**Solução:**
```bash
xattr -cr /Applications/Jira\ Monitor.app
```

Depois: Clique direito → Abrir

---

### ❌ Build falha com erro de permissão

**Solução:**
```bash
npm run clean
npm run build:dmg
```

---

### ❌ App instalado não conecta ao Jira

**Solução:** Verificar se as credenciais estão salvas:
```bash
# Modo dev salva em:
~/Library/Application\ Support/jira-monitor/

# App instalado salva em:
~/Library/Application\ Support/Jira\ Monitor/
```

**Reconfigure** as credenciais do Jira após instalar.

---

## 🔐 **Assinatura de Código (Opcional)**

Para distribuir para outros usuários, você pode assinar o app:

### 1. **Configurar certificado Apple Developer:**

```json
"build": {
  "mac": {
    "identity": "Developer ID Application: Seu Nome (XXXXXXXXXX)"
  }
}
```

### 2. **Build assinado:**

```bash
npm run build:dmg
```

---

## 📦 **Versões e Changelog:**

Sempre documente o que mudou:

### `package.json`:
```json
"version": "1.5.0"
```

### `CHANGELOG.md`:
```markdown
## [1.5.0] - 2025-01-23
### Adicionado
- Função X
- Melhoria Y

### Corrigido
- Bug Z
```

---

## 🚀 **Workflow Completo:**

```bash
# 1. Fazer suas alterações no código
# ...

# 2. Testar em modo dev
npm start

# 3. Atualizar versão (opcional)
# Editar package.json: "version": "1.5.0"

# 4. Limpar build anterior
npm run clean

# 5. Gerar novo build
npm run build

# 6. Instalar automaticamente
./install.sh

# 7. Testar app instalado (abre automaticamente pelo script)
```

---

## 📊 **Diferenças Modo Dev vs Produção:**

| Aspecto | Modo Dev | Produção |
|---------|----------|----------|
| **Inicia com** | `npm start` | Duplo clique no app |
| **Requer terminal?** | ✅ Sim | ❌ Não |
| **Console/Debug?** | ✅ Visível | ❌ Oculto (use DevTools) |
| **Atualiza código?** | ✅ Automático | ❌ Precisa rebuild |
| **Performance** | Normal | ⚡ Otimizado |
| **Tamanho** | ~400MB | ~150MB (compactado) |

---

## 🎯 **Recomendação:**

1. **Desenvolvimento:** Use `npm start` (mais rápido para testar)
2. **Uso diário:** Use app instalado (mais profissional)
3. **Distribuição:** Gere `.dmg` assinado

---

## 📞 **Problemas?**

Se algo não funcionar:

1. Limpe tudo:
   ```bash
   npm run clean
   rm -rf node_modules package-lock.json
   npm install
   ```

2. Tente novamente:
   ```bash
   npm run build:dmg
   ```

3. Verifique os logs em:
   ```bash
   tail -f ~/Library/Logs/Jira\ Monitor/main.log
   ```

---

✅ **Pronto! Agora você tem uma versão instalável profissional do Jira Monitor!** 🎉

