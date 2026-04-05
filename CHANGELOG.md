# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

## [1.0.0] - 2026-04-05

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
