# Changelog — Coach4U Relationships

All notable changes to this project are recorded here.

---

## [Unreleased]

## [2026-05-06] — Separate module pages

- Replaced Business, Leadership, and Strengths dashboard cards with 6 relationship module cards
- Created individual pages for each module: `understanding.html`, `communication.html`, `daily-practice.html`, `healing.html`, `transitions.html`, `specialised.html`
- Each page shows only its own resources — clean and independently expandable
- Updated `portal.html` dashboard links and module count (7 available · 1 coming soon)
- Updated `CLAUDE.md` and `README.md` to reflect current site structure

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
- Resource pages: 17 relationship resources across six subsections
- Downloads section added to portal
