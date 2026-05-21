# Changelog - PUC 10-Touch

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
