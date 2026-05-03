# PUC 10-Touch: Extinção nos Oceanos

Aplicação interativa para totem vertical (1080x1920) desenvolvida para a PUC-PR, focada na conscientização sobre espécies marinhas em extinção.

## 🚀 Tecnologias

- **React 19**
- **Vite 7**
- **Framer Motion 12** (Animações suaves e stagger effects)
- **Local Storage Persistence** (Configurações de design salvas no navegador)

## ✨ Funcionalidades Principais

- **Menu Grid 3x3**: Interface otimizada com 9 espécies marinhas.
- **Sistema WYSIWYG (Design Editor)**: Painel de controle em tempo real (tecla ⚙️) para ajuste de:
  - Espaçamentos (TopBar, Title, Grid, BottomBar).
  - Tipografia (Tamanhos, letter-spacing, line-height).
  - Posicionamento individual de labels por card (Overrides).
- **Modo Guia**: Overlay semi-transparente (tecla 👁️) do design original para alinhamento pixel-perfect.
- **Navegação por Teclado (Editor)**: Teclas `1-9` para selecionar cards individuais e realizar ajustes finos.
- **Módulo Perigo de Extinção**: Carrossel interativo com 9 slides integrando vídeo, fotos de alta fidelidade e sistema de QR Code.
- **Transições Premium**: Efeitos de Fade-Blur sincronizados entre conteúdo e fundo.
- **Performance**: Vídeo de fundo em loop e carregamento otimizado de assets.

## 🛠️ Configuração de Desenvolvimento

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

## 📐 Especificações Técnicas

- **Resolução Alvo**: 1080px x 1920px (9:16).
- **Idioma**: Português (PT-BR).
- **Fontes**: Blender Pro, Canva Sans.

---
Desenvolvido por Antigravity (Google DeepMind) em parceria com a equipe PUC.
