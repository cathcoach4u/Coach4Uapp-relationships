# Coach4U Relationships — Client Resource Portal

A membership-gated resource library for Coach4U relationship coaching and counselling clients. Clients sign in with their email and password and access coaching resources organised into six modules.

## Tech Stack

- **Frontend:** Static HTML + CSS (no build tools)
- **Auth & Data:** [Supabase](https://supabase.com) — email/password auth, membership status check
- **Hosting:** GitHub Pages

## How It Works

1. Client visits the site and logs in at `index.html` with their email and password
2. Supabase confirms the session and checks `users.membership_status = 'active'`
3. Active members land on `portal.html` — the dashboard with 8 module cards
4. Each module card opens a dedicated page with resources for that topic
5. Inactive or unknown members are redirected to `inactive.html`

## Site Structure

```
index.html                    ← Login
forgot-password.html          ← Password reset request
reset-password.html           ← Password reset (via email link)
inactive.html                 ← Shown for inactive memberships
portal.html                   ← Dashboard (8 module cards)
downloads.html                ← Printable PDFs and worksheets
understanding.html            ← Module: Understanding Your Relationship
communication.html            ← Module: Communication and Connection
daily-practice.html           ← Module: Daily Practice
healing.html                  ← Module: Healing and Trust
transitions.html              ← Module: Navigating Transitions
specialised.html              ← Module: Specialised Support
relationships.html            ← Full section overview (reference)
resources/relationships/      ← Individual resource/worksheet pages
css/style.css                 ← Stylesheet
assets/                       ← Images and icons
```

## Dashboard Modules

| Module | Page | Status |
|--------|------|--------|
| Understanding Your Relationship | `understanding.html` | Live |
| Communication and Connection | `communication.html` | Live |
| Daily Practice | `daily-practice.html` | Live |
| Healing and Trust | `healing.html` | Live |
| Navigating Transitions | `transitions.html` | Live |
| Specialised Support | `specialised.html` | Live |
| Downloads | `downloads.html` | Live |
| Account | — | Coming Soon |

## Adding a New Resource

1. Create the resource page in `resources/relationships/your-resource.html` (copy auth guard from an existing resource page)
2. Add a `resource-item` entry to the relevant module page (`understanding.html`, `communication.html`, etc.)

## Adding a New Member

Run in **Supabase Dashboard → SQL Editor**:

```sql
INSERT INTO users (id, email, membership_status)
SELECT id, email, 'active'
FROM auth.users
WHERE LOWER(email) = LOWER('email@here.com');
```

The client must first sign up via `index.html` before running this.

## Supabase Credentials

| | |
|---|---|
| Project URL | `https://eekefsuaefgpqmjdyniy.supabase.co` |
| Anon Key | `sb_publishable_pcXHwQVMpvEojb4K3afEMw_RMvgZM-Y` |

## Deployment

Push to `main` — GitHub Pages deploys automatically from the root.

## Branding

- **Owner:** Cath Baker — Coach4U
- **Contact:** cath@coach4u.com.au | 0402 313 337 | www.coach4u.com.au
- **Tone:** Australian English, warm, professional, strengths-based
