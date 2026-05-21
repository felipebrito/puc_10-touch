# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

## [1.3.1] - 2026-05-21

### Corrigido
- **Remoção de Resíduos de Toque & Ocultação Absoluta do Cursor**:
  - Removido completamente o efeito de feedback visual `touch-ripple` (`createRipple` em `App.jsx` e classes CSS em `index.css`), eliminando qualquer possibilidade de círculos de toque ficarem "presos/stickados" na tela do totem kiosk após o toque do usuário.
  - Eliminado por completo o cursor personalizado circular (`* { cursor: url(...) }`) de todo o projeto e forçada a ocultação global absoluta do cursor (`cursor: none !important`) em todas as telas e elementos por padrão. Isso contorna de forma definitiva os simuladores e drivers de toque físico que emulam cliques de mouse no sistema operacional.
  - Criada uma exceção de visibilidade do cursor exclusivamente dentro do painel do calibrador (`.design-editor`), permitindo que desenvolvedores visualizem o cursor padrão do navegador ao ajustar os controles de design.

## [1.3.0] - 2026-05-21

### Adicionado
- **Tela de Transição/Intro das Baleias (`BaleiasIntroPage`)**: Nova tela intermediária vertical (1080x1920) com animações fade-blur de alta fidelidade e design premium para introduzir a história da conservação das baleias-jubarte e baleias-franca-austral antes do acesso às telas de detalhe correspondentes.
- **Configurações Dinâmicas e Customizáveis**: Bloco de design `"baleiasIntroPage"` integrado ao `designConfig.json` que viabiliza o ajuste fino de tamanhos de fonte, cores, line-height, letter-spacing e paddings.
- **Textos Editáveis e Flexíveis**: Estruturação dos textos no `whaleIntroData` dentro de `menuItems.js`, suportando quebras de linha (`\n`) e markdown inline (`**negrito**` e `_itálico_`).

### Melhorado
- **Imagem de Fundo Personalizada**: Atualizada a tela de introdução das baleias para carregar a nova imagem de fundo local `baleia.jpg` (`/assets/images/baleia.jpg`), garantindo um visual premium e sob medida.
- **Arquitetura 100% Offline**: Remoção de referências externas ao Google Fonts do arquivo `index.html`. Toda a tipografia agora é renderizada usando as fontes locais integradas (`Blender Pro` e `Canva Sans`), garantindo estabilidade no totem físico sem internet.
- **Redirecionamento de Rotas**: Atualização da navegação no menu principal (`Home.jsx`) para interceptar cliques nas baleias e guiar o usuário através da nova tela de introdução (`/species/baleias-intro?next={id}`), mantendo a navegação fluida com um botão de prosseguir interativo e pulsante.

## [1.2.3] - 2026-05-21


### Otimizado
- **QR Code do Módulo Extinção**: Substituído o arquivo `qrcode.png` do Slide 9 por uma versão de alta fidelidade e otimizada, reduzindo seu tamanho de ~219 KB para ~9.6 KB, o que otimiza o carregamento offline da aplicação.

## [1.2.2] - 2026-05-20

### Adicionado
- **Vídeos Locais e Offline**: Copiados os vídeos de fundo `pg03 video 01.mp4` e `pg03 video 02.mp4` da pasta de design para `app/public/assets/videos/` (renomeados para `pg03_video_01.mp4` e `pg03_video_02.mp4`).
- **Rastreabilidade de Ativos no Git**: Ajustado o `.gitignore` na raiz do projeto para parar de ignorar arquivos `.mp4` dentro de `app/public/assets/videos/`.

### Melhorado
- **Navegação do Cabeçalho**: O componente `TopBar` (barra do topo presente em todas as telas) agora navega de volta para a Home (`/`) ao ser tocado ou clicado, servindo como atalho de navegação global.
- **Acessibilidade do Topo**: Adicionada a propriedade `cursor: pointer` à barra do topo no CSS global para indicar visualmente que o elemento é interativo.
- **Compatibilidade Offline**: O componente `BackgroundVideo.jsx` agora aponta para os arquivos de vídeo locais em vez de links externos do Pexels, permitindo o funcionamento pleno da aplicação sem conexão de internet.

## [1.2.1] - 2026-05-03

### Corrigido
- **Editor de Design (Sliders)**: Resolvido o "fantasma do slider" onde valores residuais globais impediam a calibração de escala e posição na página de detalhes dos Tubarões.
- **Escala de Selos**: Removido o travamento de largura máxima (`width: 100%`) no CSS dos rodapés (`.footer-image`), liberando o controle total da escala dos selos.
- **Sincronização de Estado**: Refatorada a função de atualização do `DesignEditor` e a lógica de exibição, permitindo edição fluida, instantânea e sem atrasos na UI.
- **Navegação de Slides**: Implementado suporte a parâmetros URL de forma intuitiva (ex: `?slide=3` para a Mangona) para facilitar a calibração direta.

## [1.2.0] - 2026-05-03
### Adicionado
- **Raia Jamanta (Mobula birostris)**: Implementação completa da nova espécie com ativos de alta fidelidade e design premium "estilo Baleia".
- **Design Utils (Modularização)**: Criado `designUtils.js` para isolar a lógica de configuração do `DesignEditor.jsx`, resolvendo conflitos de Fast Refresh do Vite.
- **Hero & Footer Premium**: Integração de imagens gigantes de topo e rodapés institucionais específicos para a Raia Jamanta.

### Melhorado
- **Estabilidade do Editor**: Implementados fallbacks de valor (`?? 0`) em todos os sliders, eliminando avisos de "uncontrolled input" do React.
- **Navegação Simplificada**:
  - Atalho direto: Menu **RAIAS** agora leva diretamente à Raia Jamanta, otimizando o fluxo do usuário.
  - UI Limpa: Remoção do botão de "Voltar para Categoria" nas páginas de detalhes para foco total na Home.
- **SEO & URLs**: Rota de Arraias renomeada oficialmente para `/species/raias`.

### Corrigido
- **Amnésia de Slide**: A função de atualização do Editor agora respeita o índice de slide ativo em tempo real, permitindo calibrações granulares sem travamentos.
- **Sintaxe JSON**: Corrigidos erros de fechamento de chaves no `designConfig.json` que impediam o carregamento de configurações personalizadas.

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
