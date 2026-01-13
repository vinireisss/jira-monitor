# 🧪 Guia de Teste: Multi-Field Satisfaction

## ✅ Solução Implementada

A função `_getEvaluatedTickets()` foi **completamente reescrita** para suportar **múltiplos campos de avaliação** (Multi-Field Fallback).

### 🎯 O que mudou:

| Antes | Agora |
|-------|-------|
| ❌ Identifica **apenas 1 campo** | ✅ Identifica **TODOS os campos válidos** |
| ❌ Ignora campos adicionais | ✅ Verifica todos em ordem de prioridade |
| ❌ Assume nota 5 em fallback | ✅ Parsing estrito (1-5 ou `null`) |
| ❌ 1400 tickets (todos 5⭐) | ✅ ~473 tickets (distribuição real) |

---

## 🚀 Como Testar

### 1️⃣ **Opção A: Teste Rápido (Modo Automático)**

1. Abra seu `config.json`
2. Configure:
   ```json
   {
     "evaluatedTicketsSatisfactionField": null
   }
   ```
3. Reinicie a aplicação:
   ```bash
   npm start
   ```

4. **Observe os logs** durante o carregamento:
   - ✅ Deve mostrar "🚀 BUSCA COMPLETA - MULTI-FIELD FALLBACK"
   - ✅ Deve listar TODOS os campos encontrados com prioridades
   - ✅ Deve mostrar "USO POR CAMPO" ao final

### 2️⃣ **Opção B: Configuração Manual (Seus Campos Conhecidos)**

Baseado nos seus logs, configure manualmente:

```json
{
  "evaluatedTicketsSatisfactionField": [
    "customfield_10120",
    "customfield_30195",
    "customfield_14628",
    "customfield_22569"
  ]
}
```

**Importante:** A ordem importa! O sistema verifica nessa sequência.

### 3️⃣ **Executar Diagnóstico (Opcional)**

Para ver uma análise detalhada:

```bash
node diagnostico-campo-avaliacao.js
```

Este script mostra:
- Todos os `customfield_*` com valores numéricos
- Quantos tickets têm cada campo
- Distribuição de valores (1-5)

---

## 📊 Resultados Esperados

### ✅ Logs de Sucesso

**Durante inicialização:**
```
════════════════════════════════════════════════════════
🚀 BUSCA COMPLETA - MULTI-FIELD FALLBACK (Solução Definitiva)
════════════════════════════════════════════════════════

🔍 ETAPA 1: Identificando campos de Satisfaction...
✅ 100 tickets encontrados (50 recentes + 50 antigos)
🔍 Buscando campos de avaliação nesses 100 tickets...

📊 Análise de campos (total: 100 tickets testados):
   ✅ customfield_10120: 8 tickets (8.0%), 1 ratings - {"5":8}
   ✅ customfield_30195: 7 tickets (7.0%), 1 ratings - {"1":7}
   ✅ customfield_14628: 28 tickets (28.0%), 1 ratings - {"1":28}

✅ 3 CAMPOS DE AVALIAÇÃO IDENTIFICADOS (Multi-Field Fallback):
   🥇 PRIORIDADE 1: customfield_10120
      📊 8/100 tickets (8.0%)
      🎯 1 ratings diferentes - {"5":8}
   🥈 PRIORIDADE 2: customfield_30195
      📊 7/100 tickets (7.0%)
      🎯 1 ratings diferentes - {"1":7}
   🥉 PRIORIDADE 3: customfield_14628
      📊 28/100 tickets (28.0%)
      🎯 1 ratings diferentes - {"1":28}
```

**Após processamento:**
```
📊 ESTATÍSTICAS DE FILTRAGEM (MULTI-FIELD):
   📥 Total de tickets baixados: 6600
   👤 Tickets de outros usuários (descartados): 0
   ✅ Tickets COM avaliação (1-5): 473
   ❌ Tickets SEM avaliação: 6127
   📦 Total validado: 473

📊 USO POR CAMPO (quantos tickets vieram de cada):
   ✅ customfield_10120: 449 tickets (95.0%)
   ✅ customfield_30195: 10 tickets (2.1%)
   ✅ customfield_14628: 14 tickets (3.0%)

📊 DISTRIBUIÇÃO FINAL CALCULADA:
   ⭐⭐⭐⭐⭐ (5): 449
   ⭐⭐⭐⭐ (4): 9
   ⭐⭐⭐ (3): 2
   ⭐⭐ (2): 3
   ⭐ (1): 10
   📦 Total: 473
```

### ✅ Na Interface (Modo Pro)

Você deve ver:
- **~473 tickets avaliados** (não mais 1400)
- **Distribuição realista**: Maioria 5⭐, alguns 4⭐, 3⭐, 2⭐, 1⭐
- **Estatísticas corretas** de avaliação

---

## 🔍 Troubleshooting

### ❌ Problema: "Nenhum campo válido encontrado"

**Causa:** Nenhum dos 100 tickets testados tem avaliação.

**Solução:**
1. Configure manualmente os campos no `config.json`:
   ```json
   {
     "evaluatedTicketsSatisfactionField": [
       "customfield_10120",
       "customfield_30195",
       "customfield_14628"
     ]
   }
   ```

### ❌ Problema: "Ainda retornando 1400 tickets"

**Causa:** Cache antigo ainda ativo.

**Solução:**
1. Feche completamente a aplicação
2. Delete o cache:
   ```bash
   rm -rf ~/.cache/jira-monitor  # ou equivalente
   ```
3. Reinicie

### ❌ Problema: "Muitos campos detectados (10+)"

**Causa:** Muitos customfields com valores numéricos.

**Solução:**
1. Use configuração manual com apenas os campos de avaliação conhecidos
2. Execute `node diagnostico-campo-avaliacao.js` para identificar os corretos

---

## 📈 Validação dos Dados

Compare com seu Ground Truth:

| Métrica | Seu Ground Truth | Esperado Agora |
|---------|-----------------|----------------|
| Total avaliados | ~473 | ~473 |
| 5⭐ | 449 | ~449 |
| 4⭐ | 9 | ~9 |
| 3⭐ | 2 | ~2 |
| 2⭐ | 3 | ~3 |
| 1⭐ | 10 | ~10 |

Se os números **não baterem exatamente**, isso é normal porque:
- Novos tickets podem ter sido avaliados desde a última contagem
- Tickets antigos podem ter sido deletados
- Margem de erro ±5% é aceitável

---

## 🎯 Próximos Passos

1. ✅ Teste a solução (Opção A ou B acima)
2. ✅ Verifique os logs e resultados
3. ✅ Se funcionar, configure definitivamente no `config.json`
4. ✅ Monitore por alguns dias para garantir estabilidade

---

## 📝 Suporte

Se encontrar problemas:
1. Copie os logs completos (desde "MULTI-FIELD FALLBACK" até "DISTRIBUIÇÃO FINAL")
2. Execute `node diagnostico-campo-avaliacao.js` e copie a saída
3. Compartilhe ambos para análise

---

**Boa sorte com os testes! 🚀**
