# Stripe verification return URL (web redirect)

Stripe Identity does not allow custom-scheme deep links as the return URL. Use this web page instead:

- **URL:** `https://<your-vercel-domain>/verification/complete`
- **Example:** `https://biblenow.io/verification/complete` or `https://your-app.vercel.app/verification/complete`

This page redirects the user to the app via `biblenow://verification/complete` (with optional `?session_id=...`).

## Backend configuration

Set the Supabase Edge Function secret so the session creation uses this web URL:

- **Name:** `STRIPE_VERIFICATION_RETURN_URL`
- **Value:** `https://<your-vercel-domain>/verification/complete`

The app can still pass `return_url` when calling `create-stripe-verification-session`; the backend uses `STRIPE_VERIFICATION_RETURN_URL` when no URL is provided.
