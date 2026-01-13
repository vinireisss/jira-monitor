# 🔧 Como Configurar o Campo de Avaliação Manualmente

O sistema está tendo dificuldade para identificar automaticamente qual customfield contém as avaliações dos clientes. 

## 📋 Como Descobrir o Campo Correto

1. **Abra o Jira** no navegador
2. **Abra um ticket resolvido** que você sabe que tem avaliação do cliente (pode ser um dos seus 473 tickets)
3. **Clique nos "..." (3 pontinhos)** no canto superior direito
4. **Selecione "View in JSON"** ou "Exportar" > "JSON"
5. **Procure por campos que tenham valores de 1 a 5**
6. **Anote o nome do campo** (será algo como `customfield_XXXXX`)

## ⚙️ Como Configurar no Sistema

Abra seu arquivo `config.json` e adicione:

```json
{
  ...outras configurações...,
  "evaluatedTicketsSatisfactionField": "customfield_XXXXX"
}
```

Substitua `customfield_XXXXX` pelo campo que você identificou no passo anterior.

## 🔍 Campos Detectados Até Agora

Durante os testes, o sistema encontrou estes campos:

- `customfield_10120`: 8 tickets, todos com valor 5 (parece ser o mais provável)
- `customfield_17487`: 50 tickets, todos com valor 1 (campo genérico)
- `customfield_14628`: 28 tickets, todos com valor 1 (campo genérico)
- `customfield_14626`: 28 tickets, todos com valor 1 (campo genérico)
- `customfield_30195`: 7 tickets, todos com valor 1 (campo genérico)
- `customfield_22569`: 40 tickets, todos com valor 5 (campo genérico)

## 💡 Dica

Se `customfield_10120` for o correto mas só tem valor 5, pode ser que:
- As avaliações de 4⭐, 3⭐, 2⭐, 1⭐ estão em um campo diferente
- Ou estão em tickets MUITO antigos (antes de 2023)
- Ou o Jira mudou o esquema de campos ao longo do tempo

Nesse caso, você pode configurar manualmente e o sistema usará esse campo.
