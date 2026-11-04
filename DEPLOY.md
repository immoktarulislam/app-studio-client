# Deploying the StudioSpace client to Vercel

Standard Next.js deployment — Vercel auto-detects the framework, so no
`vercel.json` is needed.

## Order matters

1. **Deploy the server first** (`app-studio-server/DEPLOY.md`) → note its URL
2. Set this project's environment variables (below)
3. `vercel --prod` → note this project's URL
4. Put this project's URL into the **server's** `CLIENT_URL` and redeploy the server
5. Add this project's URL to Google Cloud Console origins

## 1. Environment variables

Dashboard path: **Project → Settings → Environment Variables**

| Name | Value | Required |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `https://<server-url>/api` | ✅ |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | `865764286269-j6rlgljipni9grne32ep4eenktvelbju.apps.googleusercontent.com` | optional |
| `NEXT_PUBLIC_IMGBB_API_KEY` | your imgbb key (image uploads in Add/Edit Studio) | optional |

> `NEXT_PUBLIC_*` values are inlined at **build** time, so they must exist before
> `vercel --prod` runs. Any change to them requires a redeploy.
> `.env.local` is git-ignored and never uploaded — the dashboard is the source
> of truth on Vercel.

## 2. Link and deploy

```powershell
cd D:\assign08\app-studio-client
vercel            # accept defaults; pick a project name, e.g. studio-space-client
vercel --prod
```

## 3. Verify

Open the live URL and check:

- Home page shows **6 featured studios** pulled from the API (not a spinner or an error toast)
- `Log in` with `sarah@studiospace.io` / `Demo1234` succeeds and the navbar shows **Sarah Chen**
- `/my-bookings` and `/my-listings` load
- Theme toggle switches to dark and survives a reload

## 4. Google sign-in

Google blocks origins it does not recognise, so add the live URL in
**Google Cloud Console → APIs & Services → Credentials → your OAuth client ID →
Authorized JavaScript origins**:

```
https://<client-url>
http://localhost:3000
```

Propagation takes a few minutes. Until then the login page shows a fallback
Google button whose toast explains exactly what is missing.

## Troubleshooting

| Symptom | Cause / fix |
|---|---|
| "Could not reach the StudioSpace server…" toast | `NEXT_PUBLIC_API_URL` missing/incorrect, or the server is not deployed |
| CORS error in console | Server's `CLIENT_URL` does not match this URL → fix it and redeploy the **server** |
| Login page shows the Google fallback button | Origin not yet added/propagated in Google Cloud Console |
| Google button works locally, fails live | You added `localhost` but not the live origin (or vice versa) |

## After going live

Update the **Live URL** and test credentials section in `README.md` with the
real deployment URL.
