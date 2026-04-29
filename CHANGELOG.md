# Changelog — Coach4U Relationships

All notable changes to this project are recorded here.

---

## [Unreleased]

## [2026-04-29] — Design system v1.3 audit

- Updated `manifest.json` `theme_color` to `#1B3664` and `background_color` to `#FFFFFF`
- Fixed portal footer to four separate lines matching brand standard
- Updated CSS variables to v1.3 brand colours (`#1B3664`, `#5684C4`, `#2D2D2D`, `#DDDDDD`)
- Added Inter Bold + Montserrat Regular via Google Fonts
- Updated `CLAUDE.md` to record design system version v1.3 and correct colour/font spec
- Standardised error element naming to `#message` and `.form-error`/`.form-error.visible` pattern across all auth pages
- Added `.sign-out-btn` class to logout button in `portal.html`

## [2025] — Initial build

- Membership-gated resource library deployed to GitHub Pages
- Auth flow: login, forgot password, reset password, inactive membership
- Supabase project connected; membership gating via `users.membership_status`
- Resource pages: 17 relationship resources across five subsections
- PDF and PNG downloads section added to portal
