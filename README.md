# vanoora-info

Static informational site for vanoora.com, plus one serverless function (`api/send-demo.js`) that sends the "Request a demo" form via the [Resend](https://resend.com) API.

## Deploy

Import this repo into Vercel with framework preset **Other**. No build step for the site itself; Vercel auto-detects and deploys `api/send-demo.js` as a serverless function.

## Required environment variables (Vercel → Settings → Environment Variables)

| Variable | Value |
|---|---|
| `RESEND_API_KEY` | API key from resend.com (Settings → API Keys) |
| `DEMO_FROM` *(optional)* | sender shown on the email, e.g. `Vanoora website <hello@vanoora.com>`; defaults to that value |
| `DEMO_TO` *(optional)* | where demo requests should land; defaults to `hello@vanoora.com` |

Set these for the Production (and Preview, if you want it to work on preview deploys too) environment, then redeploy.

## Resend setup (one-time)

1. Sign up at [resend.com](https://resend.com) (free tier: 3,000 emails/month).
2. Add and verify the `vanoora.com` domain (Resend gives you a few DNS TXT/CNAME records to add — same idea as the SPF/DKIM records your mailbox already has).
3. Create an API key (Settings → API Keys) and set it as `RESEND_API_KEY` in Vercel.
4. Once the domain shows "Verified" in Resend, `hello@vanoora.com` can be used as the `from`/`to` address.
