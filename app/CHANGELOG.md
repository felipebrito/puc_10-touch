# Changelog - PUC 10-Touch

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
