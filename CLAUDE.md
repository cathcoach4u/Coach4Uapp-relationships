# Coach4U Relationships — Claude Code Guide

> Design system version: **v1.3**
> Template: https://github.com/cathcoach4u/coach4u-shared/blob/main/templates/CLAUDE.md
> Shared design system: https://github.com/cathcoach4u/coach4u-shared
> Full setup guide: https://github.com/cathcoach4u/coach4u-shared/blob/main/SETUP.md

## Stylesheet

This app uses a **local** stylesheet: `css/style.css`. Edit it directly for style changes.

The shared CDN stylesheet (`https://cathcoach4u.github.io/coach4u-shared/css/style.css`) is **not** currently used here.

## Supabase Project

| | |
|---|---|
| URL | `https://eekefsuaefgpqmjdyniy.supabase.co` |
| Anon Key | `sb_publishable_pcXHwQVMpvEojb4K3afEMw_RMvgZM-Y` |

## Critical Rules

**Supabase init — always inline in `<script type="module">`.** GitHub Pages does not reliably load external `.js` modules. Always initialise Supabase inline in a `<script type="module">` block using the ESM CDN import. Never import from an external config file.

**Reset password redirect.** Use `window.location.href` (not `window.location.origin`) when building the `redirectTo` URL. Using `origin` drops the path and breaks Supabase's redirect matching.

**Membership gating.** Every page except `index.html`, `forgot-password.html`, `reset-password.html`, and `inactive.html` must verify `users.membership_status = 'active'` after confirming a session. Redirect to `inactive.html` if not active, `index.html` if no session.

**Hide body until auth check completes.** Protected pages include `<style>body{visibility:hidden}</style>` in `<head>` and set `document.body.style.visibility = 'visible'` only after auth passes, to prevent content flash.

## Auth Flow

- Login: email + password only (`index.html`)
- Forgot password → `forgot-password.html`
- Reset password → `reset-password.html`
- Inactive membership → `inactive.html`

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

**Coach4U Relationships** is a membership-gated client resource library for relationship coaching and counselling. After signing in with email and password, clients with `membership_status = 'active'` land on the dashboard (`portal.html`) and can navigate into 6 relationship coaching modules plus Downloads and Account.

The 6 modules map directly to the section headings that existed in the original `relationships.html` — each is now its own standalone page.

### Dashboard Module Cards (portal.html)

| Card | Links to | Status |
|------|----------|--------|
| Understanding Your Relationship | `understanding.html` | Active |
| Communication and Connection | `communication.html` | Active |
| Daily Practice | `daily-practice.html` | Active |
| Healing and Trust | `healing.html` | Active |
| Navigating Transitions | `transitions.html` | Active |
| Specialised Support | `specialised.html` | Active |
| Downloads | `downloads.html` | Active |
| Account | — | Coming Soon |

### Pages

| Page | Auth required | Purpose |
|------|--------------|----------|
| `index.html` | No | Email + password login |
| `forgot-password.html` | No | Send password reset email |
| `reset-password.html` | No | Update password via reset token |
| `inactive.html` | No | Shown when membership is inactive |
| `portal.html` | Yes | Dashboard — 8 module cards |
| `downloads.html` | Yes | Printable PDFs and worksheets |
| `understanding.html` | Yes | Understanding Your Relationship resources |
| `communication.html` | Yes | Communication and Connection resources |
| `daily-practice.html` | Yes | Daily Practice resources |
| `healing.html` | Yes | Healing and Trust resources |
| `transitions.html` | Yes | Navigating Transitions resources |
| `specialised.html` | Yes | Specialised Support resources |
| `relationships.html` | Yes | Full overview of all sections (legacy — kept as reference) |
| `resources/relationships/*.html` | Yes | Individual resource/worksheet pages |

### Resource Structure

Each module page (`understanding.html`, `communication.html`, etc.) contains a `resources-grid` with `resource-item` entries linking to individual resource pages in `resources/relationships/`.

To add a resource to a module:
1. Create the resource page in `resources/relationships/your-resource.html` (include auth guard — see template below)
2. Add a `resource-item` entry to the relevant module page

```html
<div class="resource-item">
  <strong style="color:var(--primary);font-size:14px;line-height:1.4;">Resource Title</strong>
  <a href="resources/relationships/your-resource.html" target="_blank" class="btn btn-primary">View</a>
</div>
```

To add a new module to the dashboard, create a new HTML page and add an `app-card` entry to `portal.html`.

### Auth Guard Template

For module pages at root level:

```html
<style>body{visibility:hidden}</style>
<script type="module">
  import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
  const SUPABASE_URL      = 'https://eekefsuaefgpqmjdyniy.supabase.co';
  const SUPABASE_ANON_KEY = 'sb_publishable_pcXHwQVMpvEojb4K3afEMw_RMvgZM-Y';
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (!user || userError) {
    window.location.href = 'index.html';
  } else {
    const { data: profile } = await supabase
      .from('users')
      .select('membership_status')
      .eq('id', user.id)
      .single();
    if (!profile || profile.membership_status !== 'active') {
      window.location.href = 'inactive.html';
    } else {
      document.body.style.visibility = 'visible';
      document.getElementById('signOutBtn').addEventListener('click', async () => {
        await supabase.auth.signOut();
        window.location.href = 'index.html';
      });
    }
  }
</script>
```

For pages in `resources/relationships/` use `'../../index.html'` and `'../../inactive.html'`.

### Branding

- **Entity:** Coach4U — Owner: Cath Baker
- **Contact:** cath@coach4u.com.au | 0402 313 337 | www.coach4u.com.au
- **Type:** Coaching and counselling practice (NOT psychology)
- **Colour palette:** Dark Blue `#1B3664` (headings/primary), Mid Blue `#5684C4` (secondary/accent), Dark Grey `#2D2D2D` (body text), Light Grey `#DDDDDD` (borders/neutral), White `#FFFFFF` (background)
- **Font:** Inter Bold (headings) + Montserrat Regular (body) via Google Fonts; Aptos/Calibri as fallback
- **Logo:** `assets/coach4u-icon.jpeg` — top left
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
- Inter Bold for headings, Montserrat Regular for body, with Aptos/sans-serif fallback
