# UpCircle — Deployment Guide
## Get your app live in ~20 minutes (no coding required)

---

## STEP 1 — Set up Supabase (your database & auth)

1. Go to **https://supabase.com** → click "Start your project" → sign up free
2. Click **"New project"**
   - Name: `upcircle`
   - Database password: choose a strong password (save it!)
   - Region: pick closest to your users (e.g. US East)
3. Wait ~2 minutes for project to launch
4. Go to **SQL Editor** (left sidebar, looks like `< >`)
5. Click **"New query"**
6. Open the file `supabase-schema.sql` from this folder → copy ALL the text → paste into the editor
7. Click **"Run"** — you should see "Success" messages
8. Go to **Settings → API** (left sidebar)
9. Copy these two values (you'll need them next):
   - **Project URL** (looks like `https://abcdefgh.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

---

## STEP 2 — Configure your app

1. In the `upcircle` folder, find the file `.env.local.example`
2. Make a copy of it and name the copy `.env.local`
3. Open `.env.local` and fill in:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...your_key_here...
   NEXT_PUBLIC_SITE_URL=https://your-app-name.vercel.app
   ```
   (For SITE_URL, use localhost:3000 for now — update after deploying to Vercel)

---

## STEP 3 — Test locally (optional but recommended)

If you have Node.js installed:
```bash
cd upcircle
npm install
npm run dev
```
Open **http://localhost:3000** — your app should work!

---

## STEP 4 — Deploy to Vercel (free hosting)

1. Go to **https://github.com** → create a free account if needed
2. Create a **new repository** called `upcircle` (set to Private)
3. Upload all files from the `upcircle` folder to that repository
   - Click "uploading an existing file" on GitHub
   - Drag the entire folder contents in
4. Go to **https://vercel.com** → sign up with your GitHub account
5. Click **"Add New Project"** → select your `upcircle` repository → click **Import**
6. Under **"Environment Variables"**, add these 3 variables:
   - `NEXT_PUBLIC_SUPABASE_URL` → your Supabase URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` → your Supabase anon key  
   - `NEXT_PUBLIC_SITE_URL` → your Vercel URL (e.g. `https://upcircle.vercel.app`)
7. Click **Deploy** — takes ~2 minutes
8. Your app is live! 🎉

---

## STEP 5 — Update Supabase auth settings

1. Go back to Supabase → **Authentication → URL Configuration**
2. Set **Site URL** to your Vercel URL (e.g. `https://upcircle.vercel.app`)
3. Under **Redirect URLs**, add: `https://upcircle.vercel.app/**`
4. Click Save

---

## What's working right now

✅ User sign up with email & password  
✅ Email confirmation flow  
✅ Create savings circles (3-step wizard)  
✅ Invite members via shareable link  
✅ Public invite landing page  
✅ Member dashboard with circle progress  
✅ Payout schedule view  
✅ Admin: record contributions  
✅ Activity feed  
✅ Trust scores  
✅ Mobile-friendly design  
✅ Secure (Row Level Security enabled)  

## Coming next (not yet built)

⬜ Real payment processing (Stripe/ACH)  
⬜ Automated email reminders  
⬜ Identity verification (Persona)  
⬜ Credit bureau reporting  
⬜ Push notifications  

---

## Need help?

Common issues:
- **"Invalid API key"** → double-check you copied the `anon public` key (not the `service_role` key)
- **White screen after login** → make sure SITE_URL is set correctly in Vercel env vars
- **Can't see member names** → the SQL schema RLS policies handle this; re-run the schema SQL

For questions, email: your-support@email.com
