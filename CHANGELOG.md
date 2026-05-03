# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

## [1.1.0] - 2026-05-03

### Adicionado
- **Módulo Perigo de Extinção**: Finalização de todos os 9 slides com conteúdo de alta fidelidade.
- **Hierarquia de 3 Níveis**: Implementada lógica para Título, Subtítulo (Lead) e Corpo de Texto, com renderização condicional para o Slide 4 (Ameaças).
- **Fade-Blur em Backgrounds**: Adicionada transição suave de 0.8s para vídeos e imagens de fundo via `AnimatePresence`.
- **Ativos Padronizados**: Pasta `assets/images/extincao/` criada com nomenclatura limpa para todos os novos slides.
- **QR Code Real**: Integração do QR Code final no Slide 9 com controle de proporção (sem achatamento).

### Melhorado
- **Reatividade do Editor**: Substituído o fallback `||` por `??` (nullish coalescing) em todos os estilos dinâmicos. Isso permite que valores como `0` em margens ou largura sejam respeitados pelo sistema sem resetar para o padrão.
- **Estabilidade do Carrossel**: Simplificação da lógica de transição. Removida a manipulação direta de `translateX` durante o arraste em favor de uma navegação baseada puramente em índice, eliminando o erro de "slides perdidos".
- **Visual UX**: 
  - Centralização dos indicadores de página (bullets).
  - Mudança da cor base de crossfade para `#0f2634` (azul escuro) para transições mais premium.
  - Reordenamento de elementos no Slide 4: Título -> Linha -> Subtítulo (Lead).

### Corrigido
- **Bugs de CSS**: Resolvido problema de valores `undefinedpx` que invalidavam os estilos dinâmicos no DOM.
- **Mapeamento de Peso (Weight)**: Corrigido o vínculo dos sliders de peso de fonte para Títulos e Subtítulos.

---


### Adicionado
- **Estrutura Base**: Inicialização do projeto com React + Vite.
- **Design System**: Implementação de tokens de design baseados no `design_guidelines.md`.
- **WYSIWYG Editor**: Criado `DesignEditor.jsx` para calibração visual em tempo real.
- **Grid 3x3**: Menu com 9 itens (espécies marinhas) com animações de entrada (blur/stagger).
- **Overrides Individuais**: Capacidade de ajustar a posição e estilo de cada label de card separadamente.
- **Atalhos de Teclado**: Seleção de cards via teclas `1-9` no modo editor.
- **Modo Guia**: Overlay de referência visual para comparação com o design do Canva.
- **Assets Reais**: Integração de `cabeçalho.png` e `rodapé.png`.
- **Persistência**: Salvamento automático das configurações no `localStorage`.

### Corrigido
- Ajuste de proporções para 1080x1920.
- Correção do grid de 12 para 9 itens.
- Alinhamento de títulos e subtítulos conforme guia visual.
- Problemas de overflow nos labels dos cards usando posicionamento absoluto.

---
*Documentado por Antigravity AI.*
