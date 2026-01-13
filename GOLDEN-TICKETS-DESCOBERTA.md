# 🏆 Golden Tickets - Descoberta do Campo de Avaliação

## 📅 Data da Descoberta
**9 de janeiro de 2026 às 14:02 (BRT)**

---

## 🎯 Objetivo
Identificar o campo customizado correto do Jira que armazena as avaliações de satisfação dos tickets (1-5 estrelas).

---

## 📊 Metodologia: Engenharia Reversa com Golden Samples

### Golden Samples Utilizados
Tickets com avaliações conhecidas e confirmadas:

| Ticket      | Avaliação | Status |
|-------------|-----------|--------|
| IT-1082203  | 5 ⭐⭐⭐⭐⭐ | ✅ Confirmado |
| IT-1019791  | 4 ⭐⭐⭐⭐   | ✅ Confirmado |
| IT-867469   | 3 ⭐⭐⭐     | ✅ Confirmado |
| IT-1029002  | 2 ⭐⭐       | ✅ Confirmado |
| IT-1004910  | 1 ⭐         | ✅ Confirmado |

### Processo de Descoberta
1. ✅ Busca individual de cada ticket via API Jira (`/rest/api/3/issue/{key}`)
2. ✅ Extração de TODOS os campos `customfield_XXXXX` (2.431 campos encontrados!)
3. ✅ Comparação de valores em cada campo entre os 5 tickets
4. ✅ Identificação de campos com valores numéricos 1-5
5. ✅ Cálculo de acurácia e cobertura para cada candidato

---

## 🏆 RESULTADO: Campo Vencedor Identificado

### ✨ `customfield_10120` ✨

**Métricas Perfeitas:**
- ✅ **Acurácia: 100%** (5/5 tickets corretos)
- ✅ **Cobertura: 100%** (presente em todos os tickets)
- ✅ **Correspondência Exata:**
  - IT-1082203: **5** ✓
  - IT-1019791: **4** ✓
  - IT-867469: **3** ✓
  - IT-1029002: **2** ✓
  - IT-1004910: **1** ✓

---

## 📋 Candidatos Alternativos (para referência)

### 2º Lugar: `customfield_45654`
- Acurácia: 100% (mas apenas 1 ticket encontrado)
- Cobertura: 20% (presente em apenas IT-1004910)
- **Conclusão:** Campo esporádico, não confiável

### 3º Lugar: `customfield_10019`
- Acurácia: 60% (3 corretos, 2 errados)
- Cobertura: 100%
- **Conclusão:** Outro tipo de avaliação/ranking

### 4º e 5º Lugares: `customfield_14628` e `customfield_14626`
- Acurácia: ~33%
- **Conclusão:** Não relacionados a avaliação de satisfação

---

## 🔧 Configuração Aplicada

### Arquivo Atualizado
```
~/Library/Application Support/jira-monitor/config.json
```

### Propriedade Adicionada
```json
"evaluatedTicketsSatisfactionField": "customfield_10120"
```

---

## 📝 Script Utilizado

O script `inspect-golden-tickets.js` foi criado para automatizar a descoberta:

**Funcionalidades:**
- ✅ Leitura automática de credenciais do macOS Application Support
- ✅ Busca de tickets via API Jira
- ✅ Extração e normalização de todos os customfields
- ✅ Algoritmo de comparação com cálculo de acurácia e cobertura
- ✅ Exportação de resultados em JSON
- ✅ Relatório visual detalhado no console

**Execução:**
```bash
node inspect-golden-tickets.js
```

---

## ✅ Próximos Passos

1. ✅ **Campo identificado:** `customfield_10120`
2. ✅ **Configuração atualizada** no macOS Application Support
3. 🔄 **Reiniciar o Jira Monitor** para aplicar a mudança
4. 🧪 **Testar** a visualização de tickets avaliados

---

## 📈 Estatísticas da Descoberta

- **Total de campos analisados:** 2.431 customfields
- **Candidatos encontrados:** 5 campos com valores numéricos
- **Tempo de execução:** ~3 segundos
- **Requisições à API:** 5 tickets (1 por Golden Sample)
- **Taxa de sucesso:** 100% (5/5 tickets buscados com sucesso)

---

## 🎉 Conclusão

Através da metodologia de **Golden Samples** e **engenharia reversa sistemática**, identificamos com **100% de certeza** que o campo `customfield_10120` é o campo correto de avaliação de satisfação do Jira na Nubank.

**Fim da busca! 🎯**

---

## 📚 Documentos Relacionados

- `inspect-golden-tickets.js` - Script de descoberta
- `golden-tickets-result.json` - Resultado detalhado em JSON
- `COMO-CONFIGURAR-CAMPO-AVALIACAO.md` - Guia de configuração manual

---

**Autor:** Script automatizado + Engenharia reversa  
**Data:** 09/01/2026  
**Versão:** 1.0 - Descoberta Definitiva
