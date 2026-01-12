# 🚀 Explicação: O que o `curl | bash` faz?

## Comando Completo

```bash
curl -fsSL https://raw.githubusercontent.com/gabinubank/jira-monitor/main/install-auto.sh | bash
```

---

## 📊 O que acontece em cada cenário?

### ✅ Cenário 1: Já tem Node.js v20+ (ex: v25 via Homebrew)

**🎉 100% AUTOMÁTICO - NÃO PRECISA FAZER NADA!**

```
🚀 Jira Monitor - Auto Installer

[1/6] ✅ Git instalado
[2/6] ✅ Criado: ~/dev/nu
[3/6] ✅ Repositório clonado
[4/6] ✅ Node.js instalado: v25.1.0
      ✅ Versão do Node compatível (v20+)
      ℹ️  Você tem Node.js v25 (mais recente que v20)
      ℹ️  Isso é compatível e funcionará perfeitamente!
[5/6] ✅ Dependências instaladas

✅ Instalação Concluída com Sucesso!

Deseja iniciar o Jira Monitor agora? [s/N]
```

**O que faz automaticamente:**
- ✅ Detecta Node.js v25
- ✅ Aceita essa versão (antes dava erro!)
- ✅ Clona o repo
- ✅ Instala dependências
- ⚠️ Pergunta SE quer iniciar agora

---

### ⚠️ Cenário 2: NÃO tem Node.js

**🤔 PEDE CONFIRMAÇÃO**

```
🚀 Jira Monitor - Auto Installer

[1/6] ✅ Git instalado
[2/6] ✅ Criado: ~/dev/nu
[3/6] ✅ Repositório clonado
[4/6] ❌ Node.js não encontrado!

      ⚠️  Deseja instalar Node.js via nvm? [s/N]
      
      👉 Se digitar 's':
         - Instala nvm automaticamente
         - Instala Node.js v20
         - Continua instalação
         
      👉 Se digitar 'N':
         - Aborta instalação
```

**O que faz:**
- ❌ Detecta ausência de Node.js
- ⚠️ **PERGUNTA** se pode instalar
- ✅ Se autorizar: instala tudo automaticamente
- ❌ Se negar: aborta

---

### ⚠️ Cenário 3: Tem Node.js ANTIGO (v18 ou inferior)

**🔴 EXIGE ATUALIZAÇÃO**

```
🚀 Jira Monitor - Auto Installer

[1/6] ✅ Git instalado
[2/6] ✅ Criado: ~/dev/nu
[3/6] ✅ Repositório clonado
[4/6] ❌ Node.js instalado: v18.12.0
      ❌ Node.js v20+ é necessário!
      ❌ Versão atual: v18.12.0 (muito antiga)

      ⚠️  Deseja instalar Node.js v20 via nvm? [s/N]
      
      👉 Se digitar 's':
         - Instala nvm (se necessário)
         - Instala Node.js v20
         - Continua instalação
         
      👉 Se digitar 'N':
         - ❌ Aborta (v20+ é obrigatório)
```

**O que faz:**
- ❌ Detecta Node.js antigo
- ⚠️ **FORÇA** upgrade para v20+
- ✅ Se autorizar: instala v20 via nvm
- ❌ Se negar: não continua (é obrigatório)

---

## 🎯 Para o SEU CHEFE especificamente

**✅ Resposta curta: SIM, é automático!**

Porque ele já tem Node.js v25 via Homebrew:

1. ✅ Script detecta v25
2. ✅ Script aceita v25 (agora com o fix!)
3. ✅ Clona o repositório
4. ✅ Instala dependências
5. ✅ Pronto para usar!

**Única interação:** Pergunta se quer iniciar o app imediatamente.

---

## 🔍 Passo a Passo Detalhado

### O que o script `install-auto.sh` faz:

#### **Etapa 1: Verificar Git**
```bash
if ! command -v git &> /dev/null; then
    echo "❌ Git não encontrado!"
    # Pede para instalar
    exit 1
fi
```

#### **Etapa 2: Criar Diretórios**
```bash
mkdir -p ~/dev/nu
```

#### **Etapa 3: Clonar Repositório**
```bash
cd ~/dev/nu
git clone https://github.com/gabinubank/jira-monitor.git
```

#### **Etapa 4: Verificar Node.js** (PARTE CRÍTICA!)

**ANTES (versão antiga - dava erro):**
```bash
# ❌ Exigia EXATAMENTE v20
if [[ ! "$NODE_VERSION" =~ ^v20\. ]]; then
    echo "❌ ERRO: Node.js v20 não está ativo!"
    exit 1
fi
```

**AGORA (versão nova - funciona):**
```bash
# ✅ Aceita v20 ou superior
NODE_MAJOR_VERSION=$(echo "$NODE_VERSION" | cut -d'.' -f1 | sed 's/v//')

if [ "$NODE_MAJOR_VERSION" -ge 20 ]; then
    echo "✅ Versão do Node compatível (v20+)"
    if [ "$NODE_MAJOR_VERSION" -gt 20 ]; then
        echo "ℹ️  Você tem Node.js v$NODE_MAJOR_VERSION (mais recente que v20)"
        echo "ℹ️  Isso é compatível e funcionará perfeitamente!"
    fi
fi
```

#### **Etapa 5: Instalar Dependências**
```bash
npm install
```

#### **Etapa 6: Perguntar se quer iniciar**
```bash
echo "Deseja iniciar o Jira Monitor agora? [s/N]"
read -r response
if [[ "$response" =~ ^([sS][iI][mM]|[sS])$ ]]; then
    npm start
fi
```

---

## ⚡ Instalação Alternativa (Manual)

Se seu chefe preferir fazer manualmente:

```bash
# Passo 1: Criar diretório
mkdir -p ~/dev/nu
cd ~/dev/nu

# Passo 2: Clonar
git clone https://github.com/gabinubank/jira-monitor.git

# Passo 3: Entrar no diretório
cd jira-monitor

# Passo 4: Instalar dependências
npm install

# Passo 5: Iniciar
npm start
```

**Resultado:** Exatamente o mesmo!

---

## 🆘 FAQ

### Q: O curl precisa de sudo?
**A:** ❌ NÃO! Tudo é instalado no `home` do usuário (`~/dev/nu`).

### Q: O script modifica o sistema?
**A:** ⚠️ Apenas se instalar `nvm` (e só se o usuário autorizar). No caso do seu chefe: **NÃO modifica nada**, apenas instala na pasta `~/dev/nu`.

### Q: Precisa ter Git instalado antes?
**A:** ✅ SIM! Mas o script verifica e avisa se não tiver.

### Q: E se já existir a pasta `~/dev/nu/jira-monitor`?
**A:** ⚠️ O script pergunta se quer atualizar (`git pull`) ou pular.

### Q: Funciona no Linux?
**A:** ✅ SIM! Funciona em macOS e Linux.

---

## 🎯 Resumo Executivo

| Situação | O que acontece | Interação |
|----------|---------------|-----------|
| Node.js v25 (seu chefe) | ✅ Detecta, aceita, instala tudo | Só pergunta se quer iniciar |
| Node.js v20-v26 | ✅ Detecta, aceita, instala tudo | Só pergunta se quer iniciar |
| Sem Node.js | ⚠️ Pergunta se pode instalar | Precisa confirmar "s" |
| Node.js < v20 | ❌ Força upgrade para v20+ | Precisa confirmar "s" ou aborta |

---

## 📞 Mensagem Final para o Chefe

```
✅ Sim! O comando curl instala tudo automaticamente.

Como você já tem Node.js v25, o script vai:
1. ✅ Detectar sua versão (antes dava erro, agora funciona!)
2. ✅ Clonar o repositório
3. ✅ Instalar dependências
4. ✅ Perguntar se quer iniciar

Basta rodar:
curl -fsSL https://raw.githubusercontent.com/gabinubank/jira-monitor/main/install-auto.sh | bash

E digitar 's' quando perguntar se quer iniciar. Pronto! 🎉
```

---

**Última atualização:** 8 de Janeiro de 2026  
**Versão:** Pós-fix Node.js v20+ compatibility  
**Autores:** Gabriel Silva (@GABS SILVA) & Yanka Dantas (@ya)
