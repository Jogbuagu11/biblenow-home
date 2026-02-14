# BibleNOW Auth (Login Page)

This is the BibleNOW login/signup app (Sign In / Create Account screen). It **must** be deployed at **auth.biblenow.io** so that URL shows the login screen, not the main site.

## What it is

- **Stack:** Vite + React + TypeScript + Supabase + shadcn/ui
- **Routes:** Sign in, Sign up, 2FA prompt/setup, Password reset, Check email, Email confirmed, Auth callback
- **Features:** Email/password, phone OTP, Google/Apple sign-in, HCaptcha, two-factor auth

## Run locally

```bash
cd auth-biblenow
cp .env.example .env   # or copy from main repo env
npm install
npm run dev
```

## Deploy to auth.biblenow.io (fix “home page instead of login”)

auth.biblenow.io must serve **this** app (the login screen). If it currently shows the main biblenow.io home page, the domain is pointing at the wrong project.

### Vercel

1. Create a **new** Vercel project (separate from biblenow.io / studio / home).
2. **Root Directory:** set to `auth-biblenow` (if using this repo) or connect the [auth-biblenow](https://github.com/Jogbuagu11/auth-biblenow) repo.
3. **Build:** `npm run build` — **Output:** `dist`.
4. **Environment variables:** `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (and any others from `.env.example`).
5. **Domain:** add **auth.biblenow.io** to **this** project (not to the main site). Remove auth.biblenow.io from any other project so only this auth app uses it.
6. Deploy. Visiting auth.biblenow.io should show the Sign In / Create Account screen.

### Other hosts

Build with `npm run build`, serve the `dist/` folder as a static SPA, and point auth.biblenow.io at that deployment.

## Integration with main web app

The main web app redirects `/auth` to **https://auth.biblenow.io** (with query string preserved for `redirectTo` etc.).
