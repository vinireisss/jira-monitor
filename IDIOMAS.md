# 🌍 Sistema de Idiomas - Jira Monitor

## Idiomas Suportados

O Jira Monitor agora suporta **3 idiomas**:

- 🇧🇷 **Português (Brasil)** - `pt-BR` (padrão)
- 🇺🇸 **English (United States)** - `en`
- 🇪🇸 **Español** - `es`

## Como Usar

### Trocar o Idioma

1. Clique no botão **⚙️ Configurações** (ou pressione `Cmd+,`)
2. Role até a seção **🌍 Idioma / Language / Idioma**
3. Selecione o idioma desejado no menu dropdown
4. Clique em **Salvar**

A interface será **traduzida instantaneamente** sem necessidade de reiniciar o aplicativo!

### Idioma Padrão

O idioma padrão é **Português (Brasil)**. Na primeira vez que você abrir o aplicativo, ele estará em português.

## O que é Traduzido?

✅ **TODO o aplicativo é traduzido**, incluindo:

- **Header e Menu**: Todos os botões e opções do menu
- **Cards de Estatísticas**: Total de Tickets, Waiting for Support, etc.
- **Modo Pro**: Todas as seções (Atividade de Hoje, Telefonia, Dashboard de Performance, etc.)
- **Modais**: Configurações, Templates, Busca Rápida, Atalhos, etc.
- **Notificações**: Títulos e mensagens
- **Timer/Pomodoro**: Todos os controles e labels
- **Mensagens de Erro**: Todas as mensagens de erro e avisos
- **Botões**: Todos os botões (Salvar, Cancelar, Fechar, etc.)
- **Placeholders**: Campos de busca e input
- **Tooltips**: Dicas ao passar o mouse

## Exemplos de Tradução

### Português (pt-BR)
```
⚙️ Configurações
📊 Total de Tickets - IT
⭐ Modo Pro
🔄 Atualizar
```

### English (en)
```
⚙️ Settings
📊 Total Tickets - IT
⭐ Pro Mode
🔄 Refresh
```

### Español (es)
```
⚙️ Configuración
📊 Total de Tickets - IT
⭐ Modo Pro
🔄 Actualizar
```

## Persistência

A preferência de idioma é **salva automaticamente** e será mantida mesmo após fechar e reabrir o aplicativo.

## Arquitetura Técnica

### Arquivos Envolvidos

1. **`i18n.js`**: Arquivo principal com todas as traduções
   - Contém um objeto com 3 idiomas (pt-BR, en, es)
   - Mais de 150 chaves de tradução por idioma
   - Funções auxiliares para tradução

2. **`index.html`**: Marcação dos elementos
   - Atributos `data-i18n` nos elementos HTML
   - Atributos especiais: `data-i18n-placeholder`, `data-i18n-title`

3. **`renderer.js`**: Lógica de aplicação
   - Função `applyLanguage(lang)`: Aplica traduções
   - Função `addI18nAttributes()`: Adiciona atributos dinamicamente
   - Integração com `loadConfig()` e `saveConfig()`

### Como Funciona

1. **Carregamento Inicial**:
   ```javascript
   // Ao carregar o app
   const savedLanguage = localStorage.getItem('language') || 'pt-BR';
   applyLanguage(savedLanguage);
   ```

2. **Troca de Idioma**:
   ```javascript
   // Quando o usuário seleciona um novo idioma
   document.getElementById('language-select').addEventListener('change', (e) => {
     applyLanguage(e.target.value);
   });
   ```

3. **Tradução de Elementos**:
   ```javascript
   // Para cada elemento com data-i18n
   const key = element.getAttribute('data-i18n');
   const translation = getTranslation(key, lang);
   element.textContent = translation;
   ```

### Adicionar Novas Traduções

Para adicionar uma nova tradução:

1. Abra `i18n.js`
2. Adicione a chave nos 3 idiomas:

```javascript
'pt-BR': {
  'nova.chave': 'Texto em Português'
},
'en': {
  'nova.chave': 'Text in English'
},
'es': {
  'nova.chave': 'Texto en Español'
}
```

3. No HTML, adicione o atributo:

```html
<button data-i18n="nova.chave">Texto em Português</button>
```

## Benefícios

✅ **Acessibilidade Global**: Usuários de diferentes países podem usar o app
✅ **Troca Instantânea**: Sem necessidade de reiniciar
✅ **Persistência**: Preferência salva automaticamente
✅ **Fácil Manutenção**: Todas as traduções em um único arquivo
✅ **Extensível**: Fácil adicionar novos idiomas

## Roadmap Futuro

Possíveis melhorias:

- 🇫🇷 Francês (French)
- 🇩🇪 Alemão (German)
- 🇮🇹 Italiano (Italian)
- 🇯🇵 Japonês (Japanese)
- 🇨🇳 Chinês (Chinese)

## Suporte

Se encontrar algum texto não traduzido ou tradução incorreta, por favor reporte para que possamos corrigir!

**Contato:**
- 💬 **Slack**: @GABS SILVA | @ya (Yanka Dantas)

---

**Versão**: 1.7.0  
**Data**: Janeiro 2026  
**Desenvolvido com ❤️ para a comunidade Nubank**  
**Autores**: Gabriel Silva (@GABS SILVA) & Yanka Dantas (@ya)

