# Coach4U Relationships — Claude Code Guide

> Template: https://github.com/cathcoach4u/coach4u-shared/blob/main/templates/CLAUDE.md
> Shared design system: https://github.com/cathcoach4u/coach4u-shared
> Full setup guide: https://github.com/cathcoach4u/coach4u-shared/blob/main/SETUP.md

## Stylesheet

This app uses a **local** stylesheet: `css/styles.css`. Edit it directly for style changes.

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

**Coach4U Relationships** is a membership-gated client resource library. After signing in with email and password, clients with `membership_status = 'active'` can browse and view resources across four categories: Relationships, Business, Leadership, and Strengths.

### Pages

| Page | Auth required | Purpose |
|------|--------------|----------|
| `index.html` | No | Email + password login |
| `forgot-password.html` | No | Send password reset email |
| `reset-password.html` | No | Update password via reset token |
| `inactive.html` | No | Shown when membership is inactive |
| `portal.html` | Yes | Resource library |
| `resources/relationships/*.html` | Yes | Individual resource pages |

### Resource Structure

Resources are hardcoded in `portal.html` as static links. To add a new resource, add the file to `resources/` and add a new `<article class="card document-card">` entry in `portal.html`. Every new resource page must include the standard auth guard (see below).

### Auth Guard Template

For pages at root level (`portal.html`):

```html
<style>body{visibility:hidden}</style>
<script type="module">
  import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
  const supabase = createClient(
    'https://eekefsuaefgpqmjdyniy.supabase.co',
    'sb_publishable_pcXHwQVMpvEojb4K3afEMw_RMvgZM-Y'
  );
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    window.location.href = 'index.html';
  } else {
    const { data: profile } = await supabase
      .from('users')
      .select('membership_status')
      .eq('id', session.user.id)
      .single();
    if (profile?.membership_status !== 'active') {
      window.location.href = 'inactive.html';
    } else {
      document.body.style.visibility = 'visible';
    }
  }
</script>
```

For pages in `resources/relationships/` use `'../../index.html'` and `'../../inactive.html'`.

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
