# 🔍 BUSCA FORENSE POR NOTAS PERDIDAS

## O Problema

Seu sistema estava retornando resultados inconsistentes:
- ❌ **1000 tickets com nota 1** (falso positivo do `customfield_30195`)
- ❌ **0 tickets com notas 2, 3 e 4** (campos sendo ignorados pela lógica de raridade)
- ⚠️ **1400 tickets com nota 5** (pode ser real ou inflacionado)

## A Solução: Busca Forense

A busca forense **para de tentar ser inteligente** e simplesmente:

1. ✅ Baixa até 3000 tickets resolvidos
2. ✅ Examina **TODOS** os `customfield_XXXXX` de cada ticket
3. ✅ Procura valores **EXATAMENTE** iguais a `2`, `3` ou `4`
4. ✅ Ignora `customfield_30195` (blacklist - é Nível/Prioridade, não avaliação)
5. ✅ Mostra o **Field ID** exato onde cada nota foi encontrada

## Como Executar

### Opção 1: Busca Forense Standalone (Mais Rápido)

Execute apenas a busca forense, sem carregar toda a aplicação:

```bash
cd /Users/yanka.araujo.digisystem/dev/nu/jira-monitor
node test-forensic-search.js
```

**Tempo estimado:** 5-15 minutos (dependendo da quantidade de tickets)

### Opção 2: Dentro da Aplicação Principal

A busca forense agora roda **automaticamente** quando você inicia o app:

```bash
./restart-fresh.sh
```

Depois:
1. Abra o DevTools (View → Toggle Developer Tools)
2. Procure por: `🔍 BUSCA FORENSE: CAÇANDO NOTAS 2, 3 e 4 PERDIDAS`
3. Aguarde os resultados

## O Que Esperar no Log

### Durante a Execução

```
🔍 BUSCA FORENSE: CAÇANDO NOTAS 2, 3 e 4 PERDIDAS
════════════════════════════════════════════════════════

🚫 BLACKLIST (campos ignorados):
   ❌ customfield_30195

📥 Buscando tickets resolvidos para análise forense...
📄 Buscando página 1...
   ✓ 100 tickets recebidos (total: 100)
📄 Buscando página 2...
   ✓ 100 tickets recebidos (total: 200)
...

⏳ Analisados 100/500 tickets...
⏳ Analisados 200/500 tickets...

🎯 ACHEI! Ticket IT-12345 tem nota 3
   📋 Campo: customfield_98765
   📦 Valor: object.value: {"value":"3"}
   📅 Criado: 2024-03-15
   📝 Resumo: Problema resolvido rapidamente...

🎯 ACHEI! Ticket IT-67890 tem nota 4
   📋 Campo: customfield_54321
   📦 Valor: number: 4
   📅 Criado: 2023-11-20
   📝 Resumo: Atendimento excelente...
```

### Relatório Final

```
📊 RELATÓRIO DA BUSCA FORENSE
════════════════════════════════════════════════════════

✅ Tickets analisados: 473

🎯 NOTAS ENCONTRADAS:

⭐ Nota 2: 2 ticket(s) encontrado(s)
   📋 Campos que contêm nota 2:
      ✅ customfield_12345: 2 ticket(s)
         - IT-1001 (2023-05-10): Ticket exemplo...
         - IT-1002 (2023-06-15): Outro ticket...

⭐ Nota 3: 3 ticket(s) encontrado(s)
   📋 Campos que contêm nota 3:
      ✅ customfield_98765: 2 ticket(s)
         - IT-2001 (2023-07-01): Exemplo...
         - IT-2002 (2023-07-15): Exemplo...
      ✅ customfield_11111: 1 ticket(s)
         - IT-2003 (2021-12-01): Ticket antigo...

⭐ Nota 4: 9 ticket(s) encontrado(s)
   📋 Campos que contêm nota 4:
      ✅ customfield_54321: 9 ticket(s)
         - IT-3001 (2024-01-05): Exemplo...
         - IT-3002 (2024-02-10): Exemplo...
         - IT-3003 (2024-03-15): Exemplo...

💡 PRÓXIMOS PASSOS:

✅ Campos de avaliação identificados:
   📌 customfield_12345 (contém notas: 2)
   📌 customfield_98765 (contém notas: 3)
   📌 customfield_11111 (contém notas: 3)
   📌 customfield_54321 (contém notas: 4)
   📌 customfield_10120 (contém notas: 5) ← você já sabia

📝 Adicione estes campos no config.json:
   "evaluatedTicketsSatisfactionField": [
     "customfield_10120",
     "customfield_54321",
     "customfield_98765",
     "customfield_12345",
     "customfield_11111"
   ]
```

## Depois de Identificar os Campos

1. **Copie os IDs** dos campos encontrados
2. **Edite o `config.json`:**

```json
{
  "jiraEmail": "seu-email@exemplo.com",
  "jiraApiToken": "seu-token",
  "evaluatedTicketsSatisfactionField": [
    "customfield_10120",
    "customfield_54321",
    "customfield_98765",
    "customfield_12345",
    "customfield_11111"
  ]
}
```

3. **Reinicie a aplicação:**

```bash
./restart-fresh.sh
```

4. **Verifique os resultados** - agora as notas 2, 3 e 4 devem aparecer!

## Adicionar Mais Campos na Blacklist

Se a busca encontrar outros campos falso-positivos, edite o arquivo:

```javascript
// Em jira-service.js, linha ~1649
const BLACKLIST = [
  'customfield_30195',  // Nível/Prioridade
  'customfield_XXXXX'   // Adicione aqui
];
```

## Troubleshooting

### "Nenhuma nota 2, 3 ou 4 foi encontrada"

**Possíveis causas:**
1. ✅ **Normal:** Você realmente só tem avaliações 1 e 5 nos seus tickets
2. ⚠️ **Período:** As notas estão em tickets mais antigos (> 3000 tickets atrás)
3. ⚠️ **Status:** As notas estão em tickets com status diferente de "Resolved/Cancelado"
4. ⚠️ **Formato:** As notas estão em formato não-numérico (ex: "Satisfeito", "Bom")

**Solução:**
- Aumente o limite de páginas no código (linha ~1674): `const maxPages = 30;` → `const maxPages = 50;`
- Ou mude a JQL (linha ~1664) para incluir mais status: `status IN (Resolved, Cancelado, Closed, Done)`

### "Erro ao buscar IT-12345"

Isso é normal - alguns tickets podem ter permissões restritas. O script continua com os próximos.

### Busca muito lenta

A busca analisa cada ticket individualmente para ver todos os campos. Com 3000 tickets, pode levar 10-20 minutos.

**Para acelerar:**
- Use a Opção 1 (script standalone)
- Reduza o número de páginas: `const maxPages = 30;` → `const maxPages = 10;`

## Próximos Passos

Depois de configurar os campos corretos:
1. As estatísticas vão mostrar a distribuição real
2. O gráfico de barras vai aparecer com todas as notas
3. Os falsos positivos do `customfield_30195` serão eliminados

---

**Versão:** v8.3-forensic-search  
**Data:** Janeiro 2026
