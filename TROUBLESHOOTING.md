# 🔧 Troubleshooting - Jira Monitor

## Problemas Comuns e Soluções

### ❌ Erro: "Não foi possível conectar ao Jira"

**Possíveis causas:**
1. URL do Jira incorreta
2. Email incorreto
3. API Token inválido ou expirado
4. Sem conexão com a internet
5. Firewall bloqueando conexão

**Soluções:**
```bash
# 1. Verificar URL (deve incluir https://)
✅ Correto: https://nubank.atlassian.net
❌ Errado: nubank.atlassian.net
❌ Errado: http://nubank.atlassian.net

# 2. Verificar email (deve ser o email de login do Jira)
✅ Correto: seu.email@empresa.com

# 3. Gerar novo API Token
- Acesse: https://id.atlassian.com/manage-profile/security/api-tokens
- Revogue o token antigo
- Crie um novo token
- Atualize na configuração

# 4. Testar conexão
curl -u "seu.email@empresa.com:SEU_API_TOKEN" \
  https://nubank.atlassian.net/rest/api/3/myself
```

---

### ❌ Erro: "Unauthorized (401)"

**Causa:** Credenciais inválidas

**Solução:**
1. Abra as configurações (Cmd+,)
2. Verifique email e API token
3. Gere um novo API token se necessário
4. Salve e tente novamente

---

### ❌ Erro: "Forbidden (403)"

**Causa:** Sem permissão para acessar os tickets

**Solução:**
1. Verifique se você tem acesso aos tickets no Jira
2. Verifique se a fila (queueId) está correta
3. Contate o administrador do Jira para verificar permissões

---

### ❌ Notificações não aparecem

**Possíveis causas:**
1. Notificações bloqueadas pelo sistema
2. Opção desativada nas configurações
3. Aplicação minimizada na bandeja

**Soluções:**
```
# macOS
1. Configurações do Sistema
2. Notificações
3. Jira Monitor
4. Ativar notificações

# Verificar configurações da aplicação
1. Cmd+, para abrir configurações
2. Verificar "Tocar som nas notificações"
```

---

### ❌ Sons não tocam (macOS)

**Possíveis causas:**
1. Arquivos de som não encontrados
2. Permissões de áudio
3. Volume do sistema mudo

**Soluções:**
```bash
# Testar sons manualmente
afplay /System/Library/Sounds/Glass.aiff
afplay /System/Library/Sounds/Basso.aiff
afplay /System/Library/Sounds/Ping.aiff

# Se não funcionar, verificar se os arquivos existem
ls -la /System/Library/Sounds/

# Verificar volume do sistema
```

---

### ❌ Início automático não funciona (macOS)

**Possíveis causas:**
1. Script não executado corretamente
2. Caminho incorreto no .plist
3. Launch Agent não carregado

**Soluções:**
```bash
# 1. Executar script novamente
bash ativar-inicio-automatico.sh

# 2. Verificar se o Launch Agent está carregado
launchctl list | grep com.nubank.jiramonitor

# 3. Verificar logs
tail -f ~/Library/Logs/com.nubank.jiramonitor.log
tail -f ~/Library/Logs/com.nubank.jiramonitor.error.log

# 4. Recarregar manualmente
launchctl unload ~/Library/LaunchAgents/com.nubank.jiramonitor.plist
launchctl load ~/Library/LaunchAgents/com.nubank.jiramonitor.plist

# 5. Verificar caminho do Node.js
which node
# Se diferente de /usr/local/bin/node, edite o .plist

# 6. Verificar permissões
chmod +x ativar-inicio-automatico.sh
chmod +x desativar-inicio-automatico.sh
```

---

### ❌ Aplicação não abre ou fecha imediatamente

**Possíveis causas:**
1. Dependências não instaladas
2. Versão incompatível do Node.js
3. Erro no código

**Soluções:**
```bash
# 1. Reinstalar dependências
rm -rf node_modules package-lock.json
npm install

# 2. Verificar versão do Node.js (requer v16+)
node --version

# 3. Executar em modo dev para ver erros
npm run dev

# 4. Ver logs (se usando Launch Agent)
tail -f ~/Library/Logs/com.nubank.jiramonitor.error.log
```

---

### ❌ Busca rápida não funciona (Cmd+K)

**Possíveis causas:**
1. Nenhum ticket carregado ainda
2. Busca vazia
3. Conflito de atalho

**Soluções:**
1. Aguarde a primeira atualização de dados
2. Digite algo no campo de busca
3. Verifique se outro aplicativo não está usando Cmd+K

---

### ❌ Preview de ticket não carrega

**Possíveis causas:**
1. Ticket não existe
2. Sem permissão para ver o ticket
3. Erro na API do Jira

**Soluções:**
1. Verifique se o ticket existe no Jira
2. Tente abrir o ticket diretamente no Jira
3. Recarregue a aplicação (Cmd+R)

---

### ❌ Não consigo adicionar comentário

**Possíveis causas:**
1. Campo vazio
2. Sem permissão para comentar
3. Ticket fechado/resolvido

**Soluções:**
1. Digite algo no campo de comentário
2. Verifique permissões no Jira
3. Verifique se o ticket aceita comentários

---

### ❌ Não consigo baixar anexo

**Possíveis causas:**
1. Anexo foi removido
2. Sem permissão para baixar
3. Erro de autenticação

**Soluções:**
1. Verifique se o anexo existe no Jira
2. Tente baixar pelo navegador
3. Regere API token e atualize na configuração

---

### ❌ Modo Pro não aparece

**Possíveis causas:**
1. Opção desativada nas configurações
2. Erro ao carregar dados

**Soluções:**
1. Abra configurações (Cmd+,)
2. Marque "⭐ Modo Pro"
3. Salve e recarregue (Cmd+R)

---

### ❌ Gráfico de tendência mostra dados incorretos

**Possíveis causas:**
1. Dados ainda sendo carregados
2. Cache desatualizado
3. Filtros incorretos

**Soluções:**
```bash
# Limpar histórico de tendência
rm ~/Library/Application\ Support/jira-monitor/trend-history.json

# Reabrir aplicação
npm start
```

---

### ❌ Botões customizáveis não salvam

**Possíveis causas:**
1. Erro ao salvar no electron-store
2. Permissões de arquivo

**Soluções:**
```bash
# Verificar permissões
ls -la ~/Library/Application\ Support/jira-monitor/

# Recriar arquivo de configuração
rm ~/Library/Application\ Support/jira-monitor/config.json
# Reabrir aplicação e configurar novamente
```

---

### ❌ Aplicação está lenta

**Possíveis causas:**
1. Muitos tickets
2. Intervalo de atualização muito curto
3. Conexão lenta

**Soluções:**
1. Aumente o intervalo de atualização (ex: 120 segundos)
2. Desative o Modo Pro temporariamente
3. Verifique a conexão com a internet

---

### ❌ Layout está quebrado

**Possíveis causas:**
1. Cache do navegador
2. Janela muito pequena
3. Erro no CSS

**Soluções:**
1. Redimensione a janela (mínimo 350x500)
2. Alterne o layout (Cmd+L)
3. Recarregue a aplicação (Cmd+R)

---

### ❌ Erro: "ENOENT" ou "Module not found"

**Causa:** Dependências não instaladas corretamente

**Solução:**
```bash
# Limpar e reinstalar
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

---

### ❌ Erro: "Cannot find module 'electron'"

**Causa:** Electron não instalado

**Solução:**
```bash
npm install electron --save-dev
```

---

### ❌ Janela não lembra a posição

**Possíveis causas:**
1. Erro ao salvar configuração
2. Arquivo corrompido

**Soluções:**
```bash
# Verificar arquivo de configuração
cat ~/Library/Application\ Support/jira-monitor/config.json

# Se corrompido, remover e reconfigurar
rm ~/Library/Application\ Support/jira-monitor/config.json
```

---

## 🆘 Problemas Não Resolvidos?

### Debug Avançado

1. **Abrir DevTools** (modo dev):
```bash
npm run dev
```

2. **Ver console do navegador**:
- Console tab para logs JavaScript
- Network tab para requisições HTTP
- Application tab para storage

3. **Verificar logs do sistema** (macOS):
```bash
# Logs gerais do sistema
log show --predicate 'processImagePath contains "Electron"' --last 1h

# Logs do Launch Agent
tail -f ~/Library/Logs/com.nubank.jiramonitor.log
tail -f ~/Library/Logs/com.nubank.jiramonitor.error.log
```

4. **Testar API do Jira manualmente**:
```bash
# Substituir EMAIL e API_TOKEN
curl -u "EMAIL:API_TOKEN" \
  -H "Accept: application/json" \
  "https://nubank.atlassian.net/rest/api/3/search/jql" (POST com body: {"jql": "assignee=currentUser()", "maxResults": 1})
```

---

## 🐛 Reportar Bug

Se nenhuma solução funcionou, reporte o bug com as seguintes informações:

```
1. Versão do Jira Monitor: 1.4.0
2. Sistema Operacional: macOS [versão]
3. Versão do Node.js: [node --version]
4. Versão do Electron: [npm list electron]
5. Descrição do problema:
6. Passos para reproduzir:
7. Mensagem de erro (se houver):
8. Logs relevantes:
9. Screenshots (se aplicável):
```

---

## 📞 Suporte

- **Issues**: Abra uma issue no repositório
- **Email**: gabriel.silva.digisystem@nubank.com.br | yanka.araujo.digisystem@nubank.com.br
- **Slack**: #jira-monitor | @GABS SILVA | @ya (Yanka Dantas)

---

## ✅ Checklist de Verificação

Antes de reportar um problema, verifique:

- [ ] Dependências instaladas (`npm install`)
- [ ] Versão do Node.js >= 16
- [ ] Credenciais corretas (email e API token)
- [ ] Conexão com internet ativa
- [ ] Permissões de notificação ativadas
- [ ] Arquivos de configuração não corrompidos
- [ ] Logs verificados
- [ ] Tentou recarregar a aplicação (Cmd+R)
- [ ] Tentou reiniciar a aplicação
- [ ] Tentou limpar cache e reinstalar

---

**Última atualização**: Dezembro 2025

