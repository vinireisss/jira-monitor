# 📦 Instalação do Jira Monitor

## 🎉 Instaladores Disponíveis

Na pasta `dist/` você encontrará os seguintes instaladores:

### 🍎 Para macOS

| Arquivo | Arquitetura | Tamanho | Recomendado |
|---------|-------------|---------|-------------|
| **Jira Monitor-1.4.0.dmg** | Intel (x64) | 88 MB | ✅ Mac Intel |
| **Jira Monitor-1.4.0-mac.zip** | Intel (x64) | 85 MB | 🔄 Alternativa Intel |
| **Jira Monitor-1.4.0-arm64-mac.zip** | Apple Silicon (M1/M2/M3) | 81 MB | ✅ Mac Apple Silicon |

---

## 📋 Como Instalar

### Opção 1: DMG (Instalador Gráfico) - **Recomendado para Intel**

1. **Abra** o arquivo `Jira Monitor-1.4.0.dmg`
2. **Arraste** o ícone do **Jira Monitor** para a pasta **Applications**
3. **Pronto!** Abra o app em `Applications > Jira Monitor`

### Opção 2: ZIP (Manual) - **Recomendado para Apple Silicon**

1. **Descompacte** o arquivo ZIP apropriado:
   - Intel: `Jira Monitor-1.4.0-mac.zip`
   - Apple Silicon: `Jira Monitor-1.4.0-arm64-mac.zip`
   
2. **Arraste** o arquivo `Jira Monitor.app` para `/Applications`

3. **Primeira execução**: Se aparecer o aviso de segurança:
   - Vá em **System Settings** > **Privacy & Security**
   - Clique em **Open Anyway** ao lado do aviso do Jira Monitor
   - Ou execute no terminal:
     ```bash
     xattr -cr "/Applications/Jira Monitor.app"
     ```

4. **Pronto!** Abra o app em `Applications > Jira Monitor`

---

## 🔧 Configuração Inicial

Na primeira execução, o app solicitará:

1. **URL do Jira** (ex: `https://nubank.atlassian.net`)
2. **Email** (seu email do Jira)
3. **API Token** (crie em: [Atlassian API Tokens](https://id.atlassian.com/manage-profile/security/api-tokens))

---

## ✨ Recursos

- ✅ Monitoramento de tickets em tempo real
- ✅ Notificações de novos tickets e comentários
- ✅ Modo Pro com estatísticas avançadas
- ✅ Suporte a múltiplos usuários
- ✅ Edição de campos (Status, Prioridade, Assignee, etc.)
- ✅ Preview de tickets com comentários
- ✅ Anexos e imagens
- ✅ Mentions (@usuário)
- ✅ Início automático com o sistema

---

## 🚨 Troubleshooting

### "App não pode ser aberto porque é de desenvolvedor não identificado"

Execute no terminal:
```bash
xattr -cr "/Applications/Jira Monitor.app"
```

### "Permissão negada ao abrir"

Execute no terminal:
```bash
chmod +x "/Applications/Jira Monitor.app/Contents/MacOS/Jira Monitor"
```

### Configuração não salva

Verifique se a pasta de configuração existe:
```bash
ls ~/Library/Application\ Support/jira-monitor/
```

---

## 📁 Localização dos Dados

- **Configuração**: `~/Library/Application Support/jira-monitor/config.json`
- **Posição da janela**: Salva automaticamente no mesmo arquivo
- **Logs**: Disponíveis no console do app (Cmd+Option+I)

---

## 🔄 Atualizações

Para atualizar:
1. Feche o Jira Monitor
2. Delete o app antigo em `/Applications`
3. Instale a nova versão seguindo os passos acima

---

## 📧 Suporte

Para problemas ou sugestões, consulte:
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- [README.md](README.md)
- [CHANGELOG.md](CHANGELOG.md)

---

**Versão**: 1.4.0  
**Última atualização**: Dezembro 2025

