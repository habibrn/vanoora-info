# vanoora-info

Static informational site for vanoora.com, plus one serverless function (`api/send-demo.js`) that sends the "Request a demo" form through your existing Namecheap Private Email mailbox via SMTP.

## Deploy

Import this repo into Vercel with framework preset **Other**. No build step for the site itself; Vercel auto-detects and deploys `api/send-demo.js` as a serverless function.

## Required environment variables (Vercel → Settings → Environment Variables)

| Variable | Value |
|---|---|
| `SMTP_HOST` | `mail.privateemail.com` |
| `SMTP_PORT` | `465` |
| `SMTP_USER` | your full Namecheap Private Email mailbox address, e.g. `hello@vanoora.com` |
| `SMTP_PASS` | that mailbox's password |
| `DEMO_TO` *(optional)* | where demo requests should land; defaults to `SMTP_USER` if unset |

Set these for the Production (and Preview, if you want it to work on preview deploys too) environment, then redeploy.
