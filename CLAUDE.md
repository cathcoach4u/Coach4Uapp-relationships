# Your Relationship Coach — Claude Code Guide

> Design system version: **v2.2**
> Shared design system: https://github.com/cathcoach4u/coach4u-shared

## Stylesheet

Local stylesheet: `css/style.css` (v2.2). Edit it directly for style changes. Do NOT add Google Fonts or inline `<style>` blocks to any page.

## Brand Colours (v2.2)

| Variable | Value | Usage |
|---|---|---|
| `--primary` | `#003366` | Navy — header bg, headings |
| `--accent` | `#0D9488` | Teal — buttons, links, card borders |
| `--bg` | `#ffffff` | White page background |
| `--text` | `#333333` | Body text |
| `--text-muted` | `#888888` | Secondary text |
| Font | Aptos system stack | No Google Fonts |

## Supabase Project

| | |
|---|---|
| URL | `https://eekefsuaefgpqmjdyniy.supabase.co` |
| Anon Key | `sb_publishable_pcXHwQVMpvEojb4K3afEMw_RMvgZM-Y` |

Import always **unversioned**, always inline:
```js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
```

## Critical Rules

**Supabase init — always inline in `<script type="module">`.** Never import from an external config file.

**Reset password redirect.** Use `window.location.href` (not `window.location.origin`).

**Membership gating.** Every page except `login.html`, `forgot-password.html`, `reset-password.html`, and `inactive.html` must verify `users.membership_status = 'active'`. Redirect to `inactive.html` if not active, `login.html` if no session.

**Flash prevention.** Protected pages use opacity pattern in `<head>`:
```html
<style>body { opacity: 0; transition: opacity 0.2s ease; }</style>
```
Reveal after auth passes: `document.body.style.opacity = '1';`

## Auth Flow

- Login: `login.html` — email + password
- Forgot password → `forgot-password.html`
- Reset password → `reset-password.html`
- Inactive membership → `inactive.html`
- Post-login redirect → `portal.html` (dashboard)

## Login Page Standard (Gold Standard v2.2)

All auth pages use `<body class="login-page">` with `css/style.css`. No inline `<style>`, no Google Fonts.

Required `<head>` structure:
```html
<link rel="manifest" href="manifest.json">
<meta name="theme-color" content="#003366">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Your Relationship Coach">
<link rel="apple-touch-icon" href="assets/coach4u-icon.jpeg">
<link rel="stylesheet" href="css/style.css">
```

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

**Your Relationship Coach** is a membership-gated client resource library for relationship coaching and counselling. After signing in, clients with `membership_status = 'active'` land on `portal.html` and can navigate into 6 relationship coaching modules plus Downloads.

### Pages

| Page | Auth required | Purpose |
|------|--------------|----------|
| `login.html` | No | Email + password login |
| `forgot-password.html` | No | Send password reset email |
| `reset-password.html` | No | Update password via reset token |
| `inactive.html` | No | Shown when membership is inactive |
| `portal.html` | Yes | Dashboard — 7 module cards |
| `downloads.html` | Yes | Printable PDFs and worksheets |
| `understanding.html` | Yes | Understanding Your Relationship resources |
| `communication.html` | Yes | Communication and Connection resources |
| `daily-practice.html` | Yes | Daily Practice resources |
| `healing.html` | Yes | Healing and Trust resources |
| `transitions.html` | Yes | Navigating Transitions resources |
| `specialised.html` | Yes | Specialised Support resources |
| `resources/relationships/*.html` | Yes | Individual resource/worksheet pages |

### Auth Guard Template

For module pages at root level:

```html
<style>body { opacity: 0; transition: opacity 0.2s ease; }</style>
<script type="module">
  import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
  const SUPABASE_URL      = 'https://eekefsuaefgpqmjdyniy.supabase.co';
  const SUPABASE_ANON_KEY = 'sb_publishable_pcXHwQVMpvEojb4K3afEMw_RMvgZM-Y';
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (!user || userError) {
    window.location.href = 'login.html';
  } else {
    const { data: profile } = await supabase
      .from('users')
      .select('membership_status')
      .eq('id', user.id)
      .single();
    if (!profile || profile.membership_status !== 'active') {
      window.location.href = 'inactive.html';
    } else {
      document.body.style.opacity = '1';
      document.getElementById('signOutBtn').addEventListener('click', async () => {
        await supabase.auth.signOut();
        window.location.href = 'login.html';
      });
    }
  }
</script>
```

For pages in `resources/relationships/` use `'../../login.html'` and `'../../inactive.html'`.

### Resource Pages in `resources/relationships/`

| File | Module |
|------|--------|
| `adhd-and-your-relationship.html` | Specialised Support |
| `communication-and-imago-dialogue.html` | Communication and Connection |
| `couples-counselling-goals-and-outcomes.html` | Understanding |
| `daily-connection-rituals.html` | Daily Practice |
| `from-unconscious-to-conscious-love.html` | Understanding |
| `growing-together-weekly-check-in.html` | Daily Practice |
| `issue-clarifier.html` | Communication and Connection |
| `love-languages.html` | Communication and Connection |
| `navigating-separation-with-care.html` | Navigating Transitions |
| `pursuer-avoider-dynamics.html` | Communication and Connection |
| `rebuilding-trust.html` | Healing and Trust |
| `safety-check-dialogue.html` | Healing and Trust |
| `the-4-relationship-killers.html` | Communication and Connection |
| `understanding-your-connection-pulse.html` | Understanding |
| `weekly-connection-check-in.html` | Daily Practice |
| `your-relationship-journey.html` | Understanding |
| `your-relationship-reflection.html` | Understanding |
| `your-relationship-toolkit.html` | Understanding |
| `your-strengths-as-a-couple.html` | Communication and Connection |

### Branding

- **Entity:** Coach4U — Owner: Cath Baker
- **Contact:** cath@coach4u.com.au | 0402 313 337 | www.coach4u.com.au
- **Type:** Coaching and counselling practice (NOT psychology)
- **Tone:** Australian English, warm, professional, strengths-based, no exclamation marks, no em dashes

### Key Terminology

- **"The 4 Relationship Killers"** — Coach4U's label for criticism, defensiveness, contempt, and stonewalling. Always use this in client-facing materials.
- **"The Five Love Languages"** — Dr Gary Chapman's framework (1992).

### Footer (exact text)

```
Strengths-Based Coaching and Counselling
www.coach4u.com.au
cath@coach4u.com.au
0402 313 337
```
