# 🔔 Sistema de Notificações de SLA

## 📋 Resumo
Sistema inteligente de notificações que alerta sobre mudanças no status de SLA dos tickets IT.

## 🎯 Funcionalidades

### 1. **Cores Visuais nos Cards**
- 🟢 **Verde (Safe)**: > 3 horas até o SLA expirar
- 🟡 **Amarelo (Warning)**: 1-3 horas até o SLA expirar  
- 🔴 **Vermelho (Critical)**: < 1 hora até o SLA expirar
- 🔴 **Vermelho Escuro (Overdue)**: SLA já expirou (com animação pulsante)

### 2. **Notificações Automáticas**

O sistema notifica automaticamente quando um ticket muda de status:

#### 🔔 Gatilhos de Notificação

| De → Para | Título | Descrição |
|-----------|--------|-----------|
| Safe → Warning | 🟡 SLA em Atenção | Menos de 3 horas restantes |
| Safe/Warning → Critical | 🔴 SLA Crítico! | Menos de 1 hora restante |
| Qualquer → Overdue | 🔴 SLA Estourado! | O SLA expirou |

#### 📱 Tipos de Notificação

1. **Notificação Desktop** (Sistema Operacional)
   - Aparece como popup nativo
   - Não desaparece automaticamente (`requireInteraction: true`)
   - Clicável para abrir o ticket

2. **Notificação Interna** (Sino do App)
   - Aparece no ícone de sino do app
   - Fica registrada no histórico
   - Pode ser acessada a qualquer momento

### 3. **Sistema de Cache**

- 💾 Armazena o último status conhecido de cada ticket
- ⚡ Compara status atual vs anterior
- 🔕 **Não notifica** se o status não mudou (evita spam)
- 🔄 Atualiza automaticamente a cada refresh

## 🛠️ Implementação Técnica

### Arquivos Modificados

#### `renderer.js`
- Adicionado `slaStatusCache` (Map) para cachear status
- Função `checkSlaStatusChange()` para detectar mudanças
- Logs de debug removidos para código mais limpo
- Integração com sistema de notificações existente

#### `jira-service.js`
- Mantida função `_getSlaDueDate()` para buscar SLA
- Mantida função `_getSlaStatus()` para calcular status
- Logs de debug removidos

#### `styles.css`
- Estilos visuais já implementados anteriormente
- Bordas coloridas + gradientes de fundo
- Animação de pulse para tickets overdue

## 🎨 Exemplo de Uso

```javascript
// Ticket IT-1079021 muda de "safe" (4h restantes) para "warning" (2h restantes)
// 📲 NOTIFICAÇÃO GERADA:
{
  icon: '🟡',
  title: '🟡 SLA em Atenção',
  message: 'IT-1079021: Problema com equipamento\nMenos de 3 horas para o SLA expirar (2h 15min)',
  ticketKey: 'IT-1079021'
}
```

## 📊 Fluxo de Status

```
🟢 Safe (> 3h)
    ↓ [Notifica quando passa para Warning]
🟡 Warning (1-3h)
    ↓ [Notifica quando passa para Critical]
🔴 Critical (< 1h)
    ↓ [Notifica quando passa para Overdue]
🔴 Overdue (Estourado)
```

## ✅ Vantagens

1. **Sem Spam**: Só notifica mudanças reais de status
2. **Proativo**: Avisa antes do SLA estourar
3. **Duplo Canal**: Desktop + App interno
4. **Visual Claro**: Cores intuitivas nos cards
5. **Performance**: Cache em memória, rápido e eficiente

## 🔧 Configuração

Não requer configuração adicional. O sistema:
- ✅ Funciona automaticamente para todos os tickets IT
- ✅ Respeita permissões de notificação do SO
- ✅ Integra-se com sistema de notificações existente
- ✅ Persiste cache durante toda a sessão do app

## 📝 Notas

- As notificações só aparecem para tickets do projeto **IT**
- O cache é resetado ao reiniciar o app
- Requer `customfield_10123` (Time to resolution) ou `duedate` no Jira
- Compatível com Jira Service Management (JSM)

---

**Versão**: 1.0  
**Data**: 02/01/2026  
**Autores**: Gabriel Silva (@GABS SILVA) & Yanka Dantas (@ya)

