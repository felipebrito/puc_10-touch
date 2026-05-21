# Changelog - PUC 10-Touch

## [2026-05-21] - Cursor Sticking Fix, Offline Whales Intro & Rays Carousel Alignment

### Fixed
- **Sticking Touch Cursor**: Solved the persistent cursor bug on touch screen totems. Added a global `PointerEvents` listener in `App.jsx` that appends a `.using-touch` class dynamically to `document.documentElement` and `document.body` on the very first touch event, making it sticky to prevent emulated mouse events from showing and leaving the custom circle cursor stuck. Applied `.using-touch, .using-touch * { cursor: none !important; }` in `index.css` to reliably hide the custom SVG and native cursors across the entire application on touch interaction.
- **Whale Introduction Page Navigation Buttons**: Resolved a rendering bug and layout/CSS stylesheet collision on `/species/baleias-intro` where the Home/Back button was pushed to the top of the viewport and touch interactions were blocked. Replaced legacy `.baleias-navigation` layout classes with a full-screen absolute `inset: 0` pointer-events overlay and explicitly assigned `pointerEvents: 'auto'` to both navigation buttons inside their inline style configurations. This perfectly aligns the home/back and next arrow buttons to their custom bottom coordinates (`bottom: 39px` and `bottom: 134px`) and guarantees touch-responsiveness on real totem hardware.
- **Rays Navigation Arrow Vertical Alignment**: Created explicit `arrowLeftStyle` and `arrowRightStyle` objects in `ArraiasPage.jsx` with `top: 'auto'` and `transform: 'none'` to properly position the carousel navigation arrows at absolute pixel locations (`bottom: 134px`), preventing vertical misalignment.
- **Carousel Indicator Dots Sibling CSS Selector Bug**: Fixed a CSS sibling selector bug where `.slide-ray-text ~ .arraias-indicator` would fail because the text slides are nested. Replaced this with a dynamic `.theme-dark` class on the indicator elements in both `ArraiasPage.jsx` and `TubaroesPage.jsx`, allowing indicator dots to elegantly switch contrast colors on dark background slides.

### Added
- **Rays Multi-Slide Carousel**: Converted the static Rays single detail view into a stateful, touch-interactive 3-slide carousel (`ArraiasPage.jsx` and `ArraiasPage.css`) following the exact architectural flow of `TubaroesPage.jsx`.
- **Rays Intro Layout Alignment**: Configured custom `"arraias"` slideOverrides in `designConfig.json` to mirror the precise paddings, font sizes, line heights, and margins of `"tubaroes"`, ensuring absolute pixel symmetry between both elasmobranch pages.
- **Whales Intro Background**: Custom background integration for the Baleias Intro page using native offline assets.
- **Independent Back/Home Button Icon Size Control**: Added `backButtonIconSize` slider control to `DesignEditor.jsx` (under the "Botão Voltar" section) for both species pages and the extinction page. Bound the inline styles for `home-icon-svg` on `ExtincaoPage`, `TubaroesPage`, `TartarugasPage`, `ArraiasPage`, `BaleiasIntroPage`, and `SpeciesDetail` to allow kiosk administrators to edit the blue circle container size and the white icon size completely independently.

## [2026-05-21] - QR Code Optimization

### Improved
- **Extinction QR Code**: Optimized `qrcode.png` on Slide 9, reducing file size from ~219 KB to ~9.6 KB for faster local loading and clean rendering.

## [2026-05-20] - TopBar Navigation & Offline Video Stability

### Added
- **Local & Offline Videos**: Hand-copied high-fidelity background videos `pg03 video 01.mp4` and `pg03 video 02.mp4` to `app/public/assets/videos/` as `pg03_video_01.mp4` and `pg03_video_02.mp4`.
- **Git Asset Tracking**: Modified root `.gitignore` to whitelist `app/public/assets/videos/*.mp4` to prevent Git from ignoring video files.

### Improved
- **TopBar Navigation Shortcut**: Configured `TopBar` across all pages to use `useNavigate` and return to the Home view (`/`) when touched/clicked.
- **TopBar Cursor**: Added CSS rule `cursor: pointer` to the `.top-bar` element.
- **Local Kiosk Compatibility**: Replaced Pexels remote background videos in `BackgroundVideo.jsx` with local asset paths to ensure stability in offline settings.

## [2026-05-03] - Layout Stabilization & Species Expansion

### Fixed
- **Layout Regression**: Restored global `speciesPage` design parameters to the "perfect" state of commit `ebe6b70`, fixing unintended squashing of text and small hero images on Boto and Toninha pages.
- **Asymmetrical Padding**: Re-implemented support for independent `paddingLeft` and `paddingRight` in `SpeciesDetail.jsx` and `TartarugasPage.jsx`. This allows asymmetrical layouts (needed for some background assets) without affecting global symmetry.
- **Design Editor Regression**: Restored individual sliders for Left and Right margins in the Design Editor UI.

### Added
- **Peixe-boi Marinho**: New species page fully integrated with high-fidelity assets (Hero and Footer) and specific design overrides.
- **Granular Species Overrides**: Created individual design override blocks for Boto, Toninha, Baleia Franca, and Peixe-boi in `designConfig.json`.
- **Standardized Reference**: All species pages now use the highly-calibrated **Baleia Jubarte** layout as their initial base configuration, allowing for independent fine-tuning.
- **Tartarugas Slide Overrides**: Implemented slide-level padding and width overrides in `TartarugasPage.jsx` to perfectly align text with the unique background of Slide 4.

### Changed
- **Tartarugas Page**: Finalized with 4 slides, high-res image backgrounds, and smooth Fade-Blur transitions between all slides.
