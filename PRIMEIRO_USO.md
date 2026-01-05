# 🎯 Primeiro Uso - Jira Monitor v1.4.0

## ✅ Checklist de Instalação

Siga este guia passo a passo para começar a usar o Jira Monitor:

---

### ☑️ Passo 1: Verificar Pré-requisitos

```bash
# Verificar Node.js (requer v16+)
node --version

# Se não tiver Node.js, instale:
# https://nodejs.org/
```

**✅ Node.js instalado e versão >= 16**

---

### ☑️ Passo 2: Instalar Dependências

```bash
cd "/Users/gabriel.silva.digisystem/jira monitor"
npm install
```

Aguarde a instalação de:
- electron v28.0.0
- electron-store v8.1.0
- node-fetch v2.7.0

**✅ Dependências instaladas (veja node_modules/)**

---

### ☑️ Passo 3: Gerar API Token do Jira

1. Abra: https://id.atlassian.com/manage-profile/security/api-tokens
2. Clique em **"Create API token"**
3. Nome: `Jira Monitor`
4. Clique em **"Create"**
5. Copie o token gerado (você não poderá vê-lo novamente!)

**✅ API Token copiado e guardado em local seguro**

---

### ☑️ Passo 4: Executar a Aplicação

```bash
npm start
```

A aplicação abrirá automaticamente.

**✅ Aplicação aberta com tela de configuração**

---

### ☑️ Passo 5: Configurar

Preencha os campos na tela de configuração:

| Campo | Valor | Exemplo |
|-------|-------|---------|
| **URL do Jira** | URL completa da sua instância | `https://nubank.atlassian.net` |
| **Email** | Seu email de login do Jira | `seu.email@empresa.com` |
| **API Token** | Token gerado no Passo 3 | `ATB...xyz` |
| **ID da Fila** | ID da fila de tickets | `1104` (padrão) |
| **Intervalo** | Frequência de atualização (segundos) | `60` (padrão) |

**Dicas:**
- ✅ Use `https://` na URL (obrigatório)
- ✅ Email deve ser o mesmo usado para login no Jira
- ✅ Cole o API Token completo (não compartilhe!)

Clique em **"Salvar"**

**✅ Configuração salva com sucesso**

---

### ☑️ Passo 6: Verificar Conexão

Após salvar, a aplicação tentará conectar ao Jira:

- ✅ **Sucesso**: Você verá os contadores de tickets atualizados
- ❌ **Erro**: Veja a seção [Troubleshooting](#troubleshooting) abaixo

**✅ Tickets carregados e exibidos corretamente**

---

### ☑️ Passo 7: Explorar Funcionalidades

#### 7.1 Cards de Tickets
- Clique nos cards para abrir no Jira
- Clique no **▼** para expandir e ver lista completa

#### 7.2 Preview de Tickets
- Clique em qualquer ticket para ver detalhes completos
- Adicionar comentários, anexos, editar campos

#### 7.3 Busca Rápida
- Pressione **Cmd+K**
- Digite código do ticket (IT-1234) ou palavras-chave

#### 7.4 Modo Pro (Opcional)
- Abra configurações (**Cmd+,**)
- Marque "⭐ Modo Pro"
- Salve para ver estatísticas avançadas

#### 7.5 Atalhos
- Clique no menu hambúrguer (☰)
- Clique em "Atalhos" para ver todos

**✅ Funcionalidades exploradas e testadas**

---

### ☑️ Passo 8: Ativar Início Automático (Opcional)

Para iniciar automaticamente no login do macOS:

```bash
bash ativar-inicio-automatico.sh
```

Aguarde a mensagem de confirmação.

**✅ Início automático ativado (opcional)**

---

## 🎉 Pronto para Usar!

Seu Jira Monitor está configurado e pronto para uso!

### Próximos Passos Sugeridos:

1. **Explore o Modo Pro**
   - Ative nas configurações
   - Veja estatísticas por projeto
   - Confira o gráfico de tendência

2. **Configure Notificações**
   - macOS: Configurações do Sistema > Notificações > Jira Monitor
   - Ative para receber alertas de novos tickets

3. **Personalize**
   - Ajuste intervalo de atualização
   - Configure alertas de SLA
   - Defina dias para tickets antigos

4. **Use Atalhos**
   - Memorize atalhos principais (Cmd+K, Cmd+P, Cmd+L)
   - Pressione teclas numéricas (1,2,3,4) para cards

5. **Teste Preview de Tickets**
   - Clique em qualquer ticket
   - Adicione um comentário de teste
   - Experimente editar campos

---

## ❓ Troubleshooting

### Erro: "Não foi possível conectar ao Jira"

**Verificações:**

1. **URL correta?**
   ```
   ✅ https://nubank.atlassian.net
   ❌ nubank.atlassian.net (faltou https://)
   ❌ http://nubank.atlassian.net (http não funciona)
   ```

2. **Email correto?**
   - Use o email exato de login do Jira
   - Sem espaços extras

3. **API Token válido?**
   - Cole o token completo
   - Sem espaços extras
   - Se expirou, gere um novo

4. **Teste manual:**
   ```bash
   curl -u "seu.email@empresa.com:SEU_API_TOKEN" \
     https://nubank.atlassian.net/rest/api/3/myself
   ```
   
   Se retornar seus dados, as credenciais estão corretas!

### Erro: "Module not found" ou "ENOENT"

**Solução:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Notificações não aparecem

**Solução:**
```
macOS:
1. Configurações do Sistema
2. Notificações
3. Jira Monitor
4. Ativar "Permitir notificações"
```

### Início automático não funciona

**Solução:**
```bash
# Verificar se está ativo
launchctl list | grep com.nubank.jiramonitor

# Se não aparecer, execute novamente
bash ativar-inicio-automatico.sh

# Verificar logs
tail -f ~/Library/Logs/com.nubank.jiramonitor.log
```

---

## 📚 Documentação Completa

Para mais informações, consulte:

- **README.md** - Documentação completa
- **QUICK_START.md** - Guia rápido
- **COMANDOS.md** - Comandos úteis
- **TROUBLESHOOTING.md** - Soluções detalhadas
- **ESTRUTURA.md** - Arquitetura do projeto

---

## 🆘 Precisa de Ajuda?

Se ainda tiver problemas:

1. Leia o **TROUBLESHOOTING.md**
2. Execute em modo dev para ver erros:
   ```bash
   npm run dev
   ```
3. Verifique os logs do console
4. Reporte o bug com informações detalhadas

---

## ✨ Dicas de Produtividade

### Use Atalhos de Teclado
- **Cmd+K** - Busca rápida (mais rápido que navegar)
- **Cmd+L** - Alternar layout (compacto quando precisar)
- **1,2,3,4** - Acesso direto aos cards

### Modo Barra Horizontal
- Pressione **Cmd+L**
- Ideal para deixar no topo da tela
- Ocupa menos espaço vertical

### Preview de Tickets
- Muito mais rápido que abrir no navegador
- Veja tudo sem sair do app
- Adicione comentários rapidamente

### Modo Pro
- Estatísticas por projeto ajudam a priorizar
- Gráfico de tendência mostra sua carga de trabalho
- Tickets recentes para acesso rápido

---

**🎊 Aproveite o Jira Monitor!**

Desenvolvido com ❤️ para equipes de suporte de alta performance.

---

**Versão:** 1.4.0  
**Data:** Dezembro 2025

