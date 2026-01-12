# 🧪 Como Testar o Menu Bar

## Status Atual

✅ **Menu funcionando** - Aparece ao clicar no ícone  
❌ **Ícone invisível** - Não aparece na Menu Bar  
✅ **Dados chegando** - 5 tickets normais detectados

## 🔧 Solução Aplicada

Criei ícones SVG reais em `assets/tray-icons/`:
- `red.svg` - Círculo vermelho
- `yellow.svg` - Círculo amarelo  
- `green.svg` - Círculo verde
- `gray.svg` - Círculo cinza

## 🧪 Como Testar

### 1. Reiniciar o App
```bash
cd "/Users/gabriel.silva.digisystem/jira monitor"
./node_modules/.bin/electron .
```

### 2. Verificar no Terminal
Procure por:
```
✅ Tray Manager inicializado na Menu Bar
🎨 Ícone criado: green vazio? false
```

### 3. Testar Cores
Clique no ícone (mesmo invisível) → **🧪 Testar Cores**

Teste cada cor:
- 🔴 Vermelho (SLA Estourado)
- 🟡 Amarelo (Próximo de Estourar)
- 🟢 Verde (Tudo OK) ← **Deveria estar assim agora!**
- ⚪ Cinza (Sem Dados)

## 📊 Estado Esperado

Com seus 5 tickets normais, o ícone deveria estar:
- **🟢 VERDE** = Todos os tickets no prazo (SLA OK)

## 🐛 Se Ainda Não Aparecer

O problema pode ser:
1. **macOS Dark Mode** - Ícones claros não aparecem em fundo claro
2. **Tamanho** - Precisa ser exatamente 16x16 ou 22x22
3. **Formato** - macOS prefere Template Images

### Solução Alternativa

Vou criar um ícone com texto que sempre aparece:

```bash
# No terminal do Jira Monitor, procure por:
🎨 Ícone criado: green vazio? false

# Se aparecer "vazio? true", o ícone não foi criado corretamente
```

## 📸 Como Deve Ficar

```
Menu Bar:
[🟢] ← Círculo verde visível
  ↓ (ao clicar)
┌─────────────────────┐
│ 📊 5 ticket(s) no prazo │
├─────────────────────┤
│ 📊 Abrir Jira Monitor│
│ 🔄 Atualizar Agora   │
│ 🧪 Testar Cores ▶    │
│ ⚙️ Configurações     │
│ 🚪 Sair              │
└─────────────────────┘
```

## ⚡ Teste Rápido

Se o ícone não aparecer, tente forçar um update:
1. Clique onde deveria estar o ícone (canto direito da menu bar)
2. Clique em "🧪 Testar Cores" → "🔴 Vermelho"
3. O ícone vermelho deveria aparecer (é mais visível)
4. Depois clique em "♻️ Voltar ao Normal"

---

**Me avise o que aparece no terminal quando iniciar!** 🔍
