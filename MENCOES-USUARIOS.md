# 💬 Menções de Usuários em Comentários

## 📋 Visão Geral

A funcionalidade de menções permite que você mencione outros usuários ao adicionar comentários nos tickets do Jira diretamente pelo preview do Jira Monitor.

## ✨ Funcionalidades

### 🔍 Busca Inteligente
- Digite `@` no campo de comentário para ativar o dropdown de menções
- Comece a digitar o nome ou email do usuário
- A busca é feita em tempo real conforme você digita
- Mostra até 8 resultados mais relevantes

### 🎯 Seleção de Usuário
- **Mouse**: Clique no usuário desejado
- **Teclado**: 
  - `↑` / `↓` - Navegar entre os usuários
  - `Enter` ou `Tab` - Selecionar usuário destacado
  - `Esc` - Fechar o dropdown

### 👤 Informações Exibidas
Cada sugestão mostra:
- Avatar com inicial do nome
- Nome completo do usuário
- Email corporativo

### 🎨 Visual
- Dropdown estilizado com gradiente roxo
- Item selecionado destacado
- Animação suave ao abrir/fechar
- Scrollbar customizada

## 🚀 Como Usar

1. **Abra um ticket** no preview (clique em qualquer ticket)
2. **Role até a seção de comentários** no final do preview
3. **Digite `@`** no campo de comentário
4. **Digite parte do nome** do usuário que deseja mencionar
5. **Selecione o usuário** usando mouse ou teclado
6. **Continue escrevendo** seu comentário
7. **Clique em "💬 Enviar Comentário"**

## 📝 Exemplo

```
Olá @João Silva, você pode verificar esse problema?

O erro está relacionado ao @Maria Santos mencionou ontem.
```

## 🔧 Detalhes Técnicos

### Busca de Usuários
- Busca usuários assignáveis do projeto do ticket
- Cache local para melhor performance
- Filtro por nome e email (case-insensitive)
- Debounce de 200ms para otimizar requisições

### Integração com Jira
- Usa a API do Jira para buscar usuários: `get-assignable-users`
- Envia menções no formato ADF (Atlassian Document Format)
- Suporta comentários públicos e internos

### Navegação por Teclado
- `ArrowDown`: Próximo usuário
- `ArrowUp`: Usuário anterior
- `Enter` ou `Tab`: Confirmar seleção
- `Escape`: Cancelar

## 🎨 Estilos

O dropdown possui:
- Fundo branco/escuro (adapta ao tema)
- Borda roxa (#667eea)
- Sombra suave
- Animação de slide up
- Hover e seleção destacados
- Avatar com gradiente
- Scrollbar customizada

## 🔒 Segurança

- Escape de HTML para prevenir XSS
- Validação de accountId do Jira
- Sanitização de entrada do usuário

## 📱 Responsividade

- Dropdown se ajusta ao tamanho do textarea
- Máximo de 280px de altura
- Scroll automático para item selecionado
- Funciona em diferentes tamanhos de janela

## 🐛 Troubleshooting

### Dropdown não aparece
- Verifique se digitou `@` no campo de comentário
- Certifique-se de que há usuários no projeto
- Verifique a conexão com o Jira

### Usuário não encontrado
- Digite pelo menos 1 caractere após o `@`
- Verifique se o usuário tem permissão no projeto
- Tente buscar por email em vez de nome

### Menção não funciona
- Certifique-se de selecionar o usuário do dropdown
- Não edite manualmente o `@nome` após selecionar
- Verifique se o comentário foi enviado com sucesso

## 🎯 Próximas Melhorias

- [ ] Suporte a múltiplas menções no mesmo comentário
- [ ] Preview de menções antes de enviar
- [ ] Histórico de usuários mencionados recentemente
- [ ] Atalho rápido para mencionar usuários frequentes
- [ ] Notificação visual quando alguém te menciona

## 📚 Referências

- [Jira API - User Search](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-user-search/)
- [Atlassian Document Format (ADF)](https://developer.atlassian.com/cloud/jira/platform/apis/document/structure/)
- [Jira Mentions](https://support.atlassian.com/jira-cloud-administration/docs/mention-people-in-jira/)

---

**Versão**: 1.7.0  
**Data**: Janeiro 2026  
**Autores**: Gabriel Silva (@GABS SILVA) & Yanka Dantas (@ya) - Jira Monitor Team




