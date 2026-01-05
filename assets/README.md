# 🎨 Ícones do Jira Monitor

Este diretório contém os ícones do aplicativo Jira Monitor.

## 📁 Arquivos

- `icon.svg` - Ícone vetorial original (editável)
- `icon.png` - Ícone principal (512x512px)
- `icon.icns` - Ícone para macOS
- `generate-icons.sh` - Script para gerar todos os formatos

## 🎨 Design do Ícone

O ícone representa:
- 📋 **Ticket card** - Documento/ticket do Jira
- 🔔 **Sino de notificação** - Alertas em tempo real
- 📊 **Dashboard** - Estatísticas e monitoramento

Cores:
- Gradiente roxo/azul (#667eea → #764ba2)
- Acento rosa/vermelho (#f093fb → #f5576c)

## 🛠️ Como Gerar os Ícones

### Método 1: Usando o Script (Recomendado)

```bash
# 1. Instalar librsvg (se ainda não tiver)
brew install librsvg

# 2. Tornar o script executável
chmod +x assets/generate-icons.sh

# 3. Executar o script
./assets/generate-icons.sh
```

### Método 2: Conversão Online

Se não quiser instalar nada, use ferramentas online:

1. **SVG → PNG:**
   - Abra https://svgtopng.com/
   - Upload `icon.svg`
   - Baixe como `icon.png` (512x512px)

2. **PNG → ICNS:**
   - Abra https://cloudconvert.com/png-to-icns
   - Upload `icon.png`
   - Baixe como `icon.icns`

### Método 3: Usando macOS Preview

1. Abra `icon.svg` no Preview
2. File → Export → PNG (512x512px)
3. Para .icns, use o script ou ferramenta online

## 🚀 Após Gerar os Ícones

```bash
# 1. Verificar se os arquivos foram criados
ls -lh assets/icon.*

# 2. Rebuild do app
npm run package

# 3. O novo ícone aparecerá no build
```

## 🎨 Personalização

Para customizar o ícone:

1. Edite `icon.svg` no seu editor favorito:
   - Figma (import SVG)
   - Adobe Illustrator
   - Inkscape (grátis)
   - Ou qualquer editor de texto

2. Regere os ícones com o script

3. Rebuild do app

## 📐 Especificações Técnicas

### PNG
- Tamanho: 512x512px ou 1024x1024px
- Formato: PNG com transparência
- Resolução: 72 DPI

### ICNS (macOS)
- Tamanhos inclusos: 16, 32, 64, 128, 256, 512, 1024px
- Retina: @2x para cada tamanho
- Gerado com `iconutil`

## 🔧 Troubleshooting

### "rsvg-convert not found"
```bash
brew install librsvg
```

### "iconutil: command not found"
O `iconutil` é nativo do macOS. Se estiver no Linux/Windows, use:
```bash
# Linux
sudo apt-get install icnsutils

# Windows (use WSL ou ferramenta online)
```

### Ícone não aparece após build
1. Limpe o cache do Electron Builder:
```bash
rm -rf dist/
npm run package
```

2. Limpe o cache do macOS:
```bash
# Força o macOS a recarregar o ícone
touch "dist/Jira Monitor.app"
killall Finder
```

## 🎯 Resultado Final

Após o build, o ícone aparecerá:
- ✅ Na barra de aplicativos do macOS
- ✅ No Dock quando o app estiver aberto
- ✅ No Finder
- ✅ No menu Applications
- ✅ Em notificações desktop

