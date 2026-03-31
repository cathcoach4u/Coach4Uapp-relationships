# Coach4U — Client Resource Portal

A password-protected resource library for Coach4U coaching clients. Clients enter a shared access code and can browse/download resources across four categories: Relationships, Business, Leadership, and Strengths.

## Tech Stack

- **Frontend:** Static HTML, CSS, JavaScript (no build tools)
- **Auth & Storage:** [Supabase](https://supabase.com) (free tier)
- **Hosting:** GitHub Pages, Netlify, or any static host

## Supabase Setup (One-Time)

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up / log in
2. Click **New Project**, give it a name (e.g. "coach4u")
3. Choose a region close to your clients
4. Set a database password and save it somewhere safe
5. Wait for the project to finish setting up

### 2. Get Your API Credentials

1. Go to **Settings → API** in your Supabase dashboard
2. Copy the **Project URL** (looks like `https://abcdefg.supabase.co`)
3. Copy the **anon / public** key
4. Open `js/supabase-config.js` and replace the placeholder values:

```js
const SUPABASE_URL = 'https://your-project-id.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key-here';
```

### 3. Set Up the Access Code

1. In your Supabase dashboard, go to **SQL Editor**
2. Paste and run this SQL:

```sql
-- Create table for the shared access code
CREATE TABLE access_codes (
  id int PRIMARY KEY DEFAULT 1,
  code text NOT NULL,
  CONSTRAINT single_row CHECK (id = 1)
);

-- Set your access code (change 'your-access-code-here' to whatever you want)
INSERT INTO access_codes (code) VALUES ('your-access-code-here');

-- Lock down direct access to the table
ALTER TABLE access_codes ENABLE ROW LEVEL SECURITY;

-- Create the verification function (clients never see the code)
CREATE OR REPLACE FUNCTION verify_access_code(input_code text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (SELECT 1 FROM access_codes WHERE code = input_code);
$$;
```

3. To change the code later, run:

```sql
UPDATE access_codes SET code = 'new-code-here' WHERE id = 1;
```

### 4. Create the Storage Bucket

1. Go to **Storage** in your Supabase dashboard
2. Click **New Bucket**, name it `resources`, and set it to **Private**
3. Inside the bucket, create these folders:
   - `relationships/`
   - `business/`
   - `leadership/`
   - `strengths/`

### 5. Set Storage Permissions

1. Go to **Storage → Policies** for the `resources` bucket
2. Add a policy that allows `SELECT` for the `anon` role (so signed URLs work):
   - Policy name: `Allow signed URL access`
   - Allowed operation: `SELECT`
   - Target roles: `anon`
   - Policy: `true`

## Uploading Documents

1. Go to **Supabase Dashboard → Storage → resources**
2. Navigate to the appropriate folder (e.g. `relationships/`)
3. Click **Upload** and select your files
4. Files appear automatically in the portal — no code changes needed

**Naming tip:** File names are cleaned up for display. `my-great-worksheet.pdf` shows as "My Great Worksheet". Use hyphens or underscores to separate words.

## Deployment (GitHub Pages)

1. Push your code to the `main` branch
2. Go to **GitHub → Settings → Pages**
3. Set Source to **Deploy from a branch**
4. Select the `main` branch and `/ (root)` folder
5. Your site will be live at `https://your-username.github.io/external-Coach4U-resources/`

## Changing the Access Code

Run this in **Supabase Dashboard → SQL Editor**:

```sql
UPDATE access_codes SET code = 'new-code-here' WHERE id = 1;
```

Clients with active sessions will keep access until their session expires (24 hours or when they close the browser tab). New logins will need the new code.

## File Structure

```
index.html              ← Login page
portal.html             ← Resource library (protected)
css/styles.css          ← Design system
js/supabase-config.js   ← Supabase credentials
js/auth.js              ← Access code verification
js/resources.js         ← Document fetching & rendering
assets/coach4u-logo.svg ← Brand logo
```
