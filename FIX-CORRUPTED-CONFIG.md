# 🔧 Correção: Erro "is not valid JSON"

## 🚨 Problema

Se você está vendo este erro ao iniciar o Jira Monitor:

```
SyntaxError: Unexpected token ", "b@@@V@"... is not valid JSON
at JSON.parse (<anonymous>)
at Conf._deserialize
```

Significa que o arquivo de configuração do Electron está corrompido.

## ✅ Solução Rápida (Recomendada)

Execute o script de correção automática:

```bash
cd ~/dev/nu/jira-monitor
./fix-corrupted-config.sh
```

Depois, inicie o app normalmente:

```bash
npm start
```

## 🛠️ Solução Manual

Se o script acima não funcionar, faça manualmente:

### Passo 1: Localize o arquivo corrompido

```bash
cd ~/Library/Application\ Support/jira-monitor
```

### Passo 2: Faça backup (opcional)

```bash
cp config.json config.json.backup
```

### Passo 3: Remova o arquivo corrompido

```bash
rm config.json
```

### Passo 4: Reinicie o app

```bash
cd ~/dev/nu/jira-monitor
npm start
```

O app criará um novo arquivo de configuração limpo automaticamente.

## 📝 Notas

- **Suas configurações serão perdidas**: Você precisará reconfigurá-las (email, API token, etc.)
- **Backup do projeto**: O arquivo `config.json` na pasta do projeto **não será afetado** - esse é apenas o arquivo de configuração do Electron no diretório do usuário
- **Prevenção**: A partir da versão mais recente, o app detecta automaticamente arquivos corrompidos e os limpa

## 🆘 Ainda com problemas?

Se o erro persistir:

1. Verifique se tem permissões para escrever em `~/Library/Application Support/jira-monitor`
2. Tente reinstalar o app:
   ```bash
   cd ~/dev/nu
   rm -rf jira-monitor
   curl -fsSL https://raw.githubusercontent.com/gabinubank/jira-monitor/main/install-auto.sh | bash
   ```
3. Entre em contato com o time de suporte

## 🔍 Por que isso acontece?

- Interrupção abrupta do app durante gravação
- Problemas de permissão de arquivo
- Falha no disco/sistema de arquivos
- Versão antiga do Electron sem tratamento de erro
