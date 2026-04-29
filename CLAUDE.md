# Coach4U Relationships — Claude Code Guide

> Template: https://github.com/cathcoach4u/coach4u-shared/blob/main/templates/CLAUDE.md
> Shared design system: https://github.com/cathcoach4u/coach4u-shared
> Full setup guide: https://github.com/cathcoach4u/coach4u-shared/blob/main/SETUP.md

## Shared Stylesheet

Add to every HTML page `<head>`:

```html
<link rel="stylesheet" href="https://cathcoach4u.github.io/coach4u-shared/css/style.css">
```

## Supabase Project

| | |
|---|---|
| URL | `https://eekefsuaefgpqmjdyniy.supabase.co` |
| Anon Key | `sb_publishable_pcXHwQVMpvEojb4K3afEMw_RMvgZM-Y` |

## Critical Rules

**Supabase init — always inline.** GitHub Pages does not reliably load external `.js` modules. Always initialise Supabase inline in a `<script type="module">` block. Never import from an external config file.

**Reset password redirect.** Use `window.location.href` (not `window.location.origin`) when building the `redirectTo` URL. Using `origin` drops the path and breaks Supabase's redirect matching.

**Membership gating.** Every page except login/forgot/reset must verify `users.membership_status = 'active'` after confirming a session. Redirect to `inactive.html` if not.

## Auth Flow

- Login: email + password only (no magic link)
- Forgot password → `forgot-password.html`
- Reset password → `reset-password.html`

## Add a New Member (SQL)

```sql
INSERT INTO users (id, email, membership_status)
SELECT id, email, 'active'
FROM auth.users
WHERE LOWER(email) = LOWER('email@here.com');
```

---

## App-Specific Notes

### App Overview

**Coach4U Relationships** is a password-protected client resource portal. Clients enter a **shared access code** (not individual email/password) to browse and download resources across four categories: Relationships, Business, Leadership, and Strengths.

### Auth Model — Differs from Standard Template

This app does **not** use Supabase individual email/password auth. Instead:

- A single shared access code is verified via a Supabase RPC: `verify_access_code(input_code)`
- On success, a 24-hour session is stored in `sessionStorage` under the key `coach4u_access`
- There is **no** per-user `membership_status` check, no `users` table requirement, and no forgot/reset password flow
- Standard template auth patterns (login form, forgot-password.html, reset-password.html, membership gating) do **not** apply here

### Access Code SQL Setup

```sql
CREATE TABLE access_codes (
  id int PRIMARY KEY DEFAULT 1,
  code text NOT NULL,
  CONSTRAINT single_row CHECK (id = 1)
);

INSERT INTO access_codes (code) VALUES ('your-access-code-here');

ALTER TABLE access_codes ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION verify_access_code(input_code text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (SELECT 1 FROM access_codes WHERE code = input_code);
$$;
```

To change the code: `UPDATE access_codes SET code = 'new-code' WHERE id = 1;`

### Resource Storage

- Supabase Storage bucket: `resources` (private)
- Folders: `relationships/`, `business/`, `leadership/`, `strengths/`
- Files appear automatically in the portal after upload — no code changes needed
- File names are cleaned for display: `my-great-worksheet.pdf` → "My Great Worksheet"

### Pages

| Page | Purpose |
|------|---------|
| `index.html` | Access code login |
| `portal.html` | Resource library (protected) |

### Local Stylesheet

This app currently uses a **local** `css/styles.css` rather than the shared stylesheet. When updating styles, edit `css/styles.css` directly or migrate to the shared stylesheet link above.

### Branding

- **Entity:** Coach4U — Owner: Cath Baker
- **Contact:** cath@coach4u.com.au | 0402 313 337 | www.coach4u.com.au
- **Type:** Coaching and counselling practice (NOT psychology)
- **Colour palette:** Dark Blue `#003366` (headings), Black `#000000` (body), Grey `#646464` (footer), White `#FFFFFF` (background)
- **Font:** Aptos, sans-serif
- **Logo:** `assets/coach4u-logo.png` — top left, aspect-locked
- **Tone:** Australian English, warm, professional, strengths-based, no exclamation marks, no em dashes

### Key Terminology

- **"The 4 Relationship Killers"** is Coach4U's label for criticism, defensiveness, contempt, and stonewalling. Gottman's "Four Horsemen" is a reference only. Always use "The 4 Relationship Killers" in client-facing materials.

### Footer (exact text)

```
Strengths-Based Coaching and Counselling
www.coach4u.com.au
cath@coach4u.com.au
0402 313 337
```

### WordPress HTML Rules

- Custom HTML blocks only
- All styles inline (no CSS classes, no style blocks)
- Aptos font with sans-serif fallback
