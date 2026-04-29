# Coach4U Relationships — Claude Code Guide

> Template: https://github.com/cathcoach4u/coach4u-shared/blob/main/templates/CLAUDE.md
> Shared design system: https://github.com/cathcoach4u/coach4u-shared
> Full setup guide: https://github.com/cathcoach4u/coach4u-shared/blob/main/SETUP.md

## Stylesheet

This app uses a **local** stylesheet: `css/styles.css`. Edit it directly for style changes.

The shared CDN stylesheet (`https://cathcoach4u.github.io/coach4u-shared/css/style.css`) is **not** used here.

## Supabase Project

| | |
|---|---|
| URL | `https://eekefsuaefgpqmjdyniy.supabase.co` |
| Anon Key | `sb_publishable_pcXHwQVMpvEojb4K3afEMw_RMvgZM-Y` |

## Critical Rules

**Supabase init — use the CDN global, not a module import.** This app loads Supabase via `<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2">` and accesses it as `supabase.createClient(...)` in a plain `<script>` block. Do not switch to `<script type="module">` or an external config file without testing on GitHub Pages first.

**Portal guard uses `sessionStorage`.** `portal.html` checks `sessionStorage` for the key `coach4u_access` with a 24-hour expiry. Any page added to the portal must include the same guard at the top of its script block, redirecting to `index.html` if access is not granted.

**Never expose the access code in client-side code.** Access code verification happens server-side via the Supabase RPC `verify_access_code`. The code itself is never returned to the browser.

## Auth Flow

This app uses a **shared access code**, not individual email/password accounts.

1. Client visits `index.html` and enters the shared access code
2. Code is verified via Supabase RPC: `verify_access_code(input_code)` → returns `boolean`
3. On success, `sessionStorage` is set with `{ granted: true, timestamp: Date.now() }` under key `coach4u_access`
4. Session lasts 24 hours or until the tab is closed
5. `portal.html` checks for a valid session on load; redirects to `index.html` if missing or expired

There is no individual user login, no forgot-password flow, and no reset-password flow.

## Access Code SQL Setup

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

To change the code later:

```sql
UPDATE access_codes SET code = 'new-code' WHERE id = 1;
```

---

## App-Specific Notes

### App Overview

**Coach4U Relationships** is a password-protected client resource library. Clients enter a shared access code to browse and view resources across four categories: Relationships, Business, Leadership, and Strengths. Resources are static HTML pages and downloadable PDFs stored in the `resources/` directory.

### Pages

| Page | Purpose |
|------|---------|
| `index.html` | Access code login |
| `portal.html` | Resource library (protected) |
| `resources/relationships/*.html` | Individual relationship resource pages |
| `resources/downloads/*.pdf` | Downloadable PDF versions |

### Resource Structure

Resources are hardcoded in `portal.html` as static links — they are not fetched dynamically from Supabase Storage. To add a new resource, add the file to `resources/` and add a new `<article class="card document-card">` entry in `portal.html`.

### Branding

- **Entity:** Coach4U — Owner: Cath Baker
- **Contact:** cath@coach4u.com.au | 0402 313 337 | www.coach4u.com.au
- **Type:** Coaching and counselling practice (NOT psychology)
- **Colour palette:** Dark Blue `#003366` (headings), Black `#000000` (body), Grey `#646464` (footer), White `#FFFFFF` (background)
- **Font:** Aptos, sans-serif
- **Logo:** `assets/coach4u-logo.jpg` — top left
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
