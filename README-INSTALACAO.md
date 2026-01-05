# 📦 Guia Rápido de Instalação

## ⚡ **Instalação Rápida (3 comandos):**

```bash
# 1. Gerar o aplicativo
npm run build

# 2. Instalar
./install.sh

# 3. Pronto! O app abrirá automaticamente ✅
```

---

## 🔄 **Para Atualizar:**

```bash
npm run build && ./install.sh
```

**Isso vai substituir automaticamente a versão antiga!**

---

## 📝 **Guia Detalhado:**

Veja o arquivo `COMO-ATUALIZAR.md` para instruções completas e troubleshooting.

---

## ❓ **Problemas?**

### App não abre (macOS bloqueou):

```bash
xattr -cr "/Applications/Jira Monitor.app"
```

Depois: Clique direito → Abrir

### Refazer instalação limpa:

```bash
npm run clean
npm run build
./install.sh
```

---

## ✅ **Status Atual:**

- ✅ App já foi compilado: `dist/mac-arm64/Jira Monitor.app`
- ⚡ Pronto para instalar: Execute `./install.sh`

---

**Todas as funcionalidades do modo dev estarão disponíveis no app instalado!** 🚀

