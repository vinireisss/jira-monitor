# 🔗 Link para Criar API Token do Jira

## ✅ Implementação Concluída

Foi adicionado um **link clicável** no campo "API Token" das configurações que leva diretamente para a página de criação de tokens do Atlassian Jira.

## 📍 Localização

O link aparece logo abaixo do campo "API Token" na tela de **⚙️ Configurações**.

## 🎨 Visual

```
┌─────────────────────────────────────┐
│ API Token                           │
│ ┌─────────────────────────────────┐ │
│ │ ••••••••••••••••••••            │👁│
│ └─────────────────────────────────┘ │
│ 🔗 Crie seu API token do Jira aqui  │ ← Link clicável
└─────────────────────────────────────┘
```

## 🌍 Suporte Multilíngue

O link está traduzido nos 3 idiomas suportados:

- 🇧🇷 **Português**: "🔗 Crie seu API token do Jira aqui"
- 🇺🇸 **English**: "🔗 Create your Jira API token here"
- 🇪🇸 **Español**: "🔗 Crea tu token de API de Jira aquí"

## 🔗 URL de Destino

Quando clicado, o link abre a página oficial do Atlassian:

**https://id.atlassian.com/manage-profile/security/api-tokens**

Esta é a página oficial onde os usuários podem:
- Criar novos API tokens
- Gerenciar tokens existentes
- Revogar tokens antigos
- Ver quando cada token foi criado e usado pela última vez

## 🛠️ Arquivos Modificados

### 1. `index.html`
Adicionado o link abaixo do campo API Token:

```html
<a href="#" class="api-token-link" id="create-api-token-link" data-i18n="settings.createApiToken">
  🔗 Crie seu API token do Jira aqui
</a>
```

### 2. `styles.css`
Adicionado estilo para o link:

```css
.api-token-link {
  display: inline-block;
  margin-top: 8px;
  font-size: 13px;
  color: #667eea;
  text-decoration: none;
  transition: all 0.2s ease;
  cursor: pointer;
}

.api-token-link:hover {
  color: #5568d3;
  text-decoration: underline;
  transform: translateX(2px);
}
```

### 3. `renderer.js`
Adicionado event listener para abrir o link:

```javascript
document.getElementById('create-api-token-link').addEventListener('click', (e) => {
  e.preventDefault();
  ipcRenderer.invoke('open-url', 'https://id.atlassian.com/manage-profile/security/api-tokens');
});
```

### 4. `i18n.js`
Adicionadas traduções nos 3 idiomas:

```javascript
'pt-BR': {
  'settings.createApiToken': '🔗 Crie seu API token do Jira aqui'
},
'en': {
  'settings.createApiToken': '🔗 Create your Jira API token here'
},
'es': {
  'settings.createApiToken': '🔗 Crea tu token de API de Jira aquí'
}
```

## 🎯 Comportamento

1. **Clique**: Ao clicar no link, abre a página do Atlassian no navegador padrão do sistema
2. **Hover**: Ao passar o mouse, o link muda de cor e é sublinhado
3. **Visual**: Pequena animação de deslize para a direita no hover
4. **Acessibilidade**: Link com cursor pointer e cores de contraste adequadas

## ✨ Benefícios

✅ **Facilita o processo**: Usuário não precisa procurar onde criar o token  
✅ **Reduz erros**: Link oficial garante que o usuário vai ao lugar certo  
✅ **Melhora UX**: Processo de configuração mais fluido  
✅ **Multilíngue**: Funciona em todos os idiomas suportados  
✅ **Integrado**: Usa o sistema de i18n existente  

## 🧪 Como Testar

1. Abra o aplicativo: `npm start`
2. Clique em **⚙️ Configurações** (ou `Cmd+,`)
3. Encontre o campo "API Token"
4. Veja o link "🔗 Crie seu API token do Jira aqui" logo abaixo
5. Clique no link
6. Verifique se abre a página do Atlassian no navegador

### Testar em Outros Idiomas

1. Nas configurações, troque para **English**
2. Veja o link mudar para "🔗 Create your Jira API token here"
3. Troque para **Español**
4. Veja o link mudar para "🔗 Crea tu token de API de Jira aquí"

## 📚 Referência

- **URL Oficial**: https://id.atlassian.com/manage-profile/security/api-tokens
- **Documentação Atlassian**: [API Tokens](https://support.atlassian.com/atlassian-account/docs/manage-api-tokens-for-your-atlassian-account/)

## 🎉 Conclusão

O link para criar API token foi implementado com sucesso e está totalmente integrado ao sistema de idiomas do aplicativo!

---

**Desenvolvido com ❤️ para facilitar a vida dos usuários**  
**Data**: Janeiro 2026

