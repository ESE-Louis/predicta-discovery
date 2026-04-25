# Predicta — Deployment Guide
## AI Revenue Discovery · predicta.au

---

## What You're Deploying

A Next.js web app with:
- **Self-serve discovery tool** (12 adaptive questions powered by Claude AI)
- **3 server-side API routes** (question generation, results generation, email delivery)
- **Real email delivery** via Resend (with BCC to Louis on every completion)
- **Hosted on Vercel** (free tier is sufficient to start)

---

## What You Need First (15 minutes setup)

### 1. Anthropic API Key
- Go to: https://console.anthropic.com/settings/keys
- Click "Create Key"
- Copy it somewhere safe — you only see it once

### 2. Resend Account + API Key
- Go to: https://resend.com and create a free account
- Free tier: 3,000 emails/month (plenty to start)
- Go to API Keys → Create API Key → copy it
- **Important:** Go to Domains → Add Domain → add `predicta.au`
- Follow the DNS verification steps (add 2-3 DNS records to your domain registrar)
- This takes 10-30 minutes to verify

### 3. GitHub Account
- Go to: https://github.com and create a free account if you don't have one
- This is how you get the code onto Vercel

### 4. Vercel Account
- Go to: https://vercel.com and sign up (free)
- Connect it to your GitHub account

---

## Step-by-Step Deployment

### Step 1 — Get the code onto GitHub

Have your developer do this, or follow these steps yourself:

```bash
# 1. Install Node.js if you don't have it
# Download from: https://nodejs.org (choose LTS version)

# 2. Open Terminal (Mac) or Command Prompt (Windows)

# 3. Navigate to the predicta folder
cd path/to/predicta

# 4. Install dependencies
npm install

# 5. Test it runs locally first
cp .env.example .env.local
# Edit .env.local and add your real API keys

npm run dev
# Open http://localhost:3000 — you should see the app
```

Once it works locally:

```bash
# 6. Push to GitHub
git init
git add .
git commit -m "Initial Predicta deployment"

# Create a new repo on github.com first, then:
git remote add origin https://github.com/YOUR_USERNAME/predicta.git
git push -u origin main
```

### Step 2 — Deploy to Vercel

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select your `predicta` repo
4. Click **Deploy** — Vercel auto-detects Next.js

### Step 3 — Add Environment Variables in Vercel

This is the critical step. Your API keys must live in Vercel, not in the code.

1. In Vercel, go to your project → **Settings** → **Environment Variables**
2. Add each of these:

| Variable | Value |
|----------|-------|
| `ANTHROPIC_API_KEY` | Your Anthropic key |
| `RESEND_API_KEY` | Your Resend key |
| `RESEND_FROM_EMAIL` | `hello@predicta.au` |
| `RESEND_FROM_NAME` | `Louis Nonis` |
| `LEAD_BCC_EMAIL` | `louis@predicta.au` (your email — you get a copy of every report) |
| `NEXT_PUBLIC_SITE_URL` | `https://predicta.au` |

3. Click **Save** then **Redeploy**

### Step 4 — Connect Your Domain

1. In Vercel → Settings → Domains
2. Add `predicta.au` (or `discover.predicta.au` if you want it on a subdomain)
3. Vercel gives you DNS records to add at your domain registrar
4. Once DNS propagates (usually 10-60 minutes), your app is live

---

## How It Works in Production

```
User visits predicta.au
       ↓
Completes 12 questions
(each dynamic question calls /api/generate-question → Anthropic API)
       ↓
Enters name + email
       ↓
/api/generate-results → Anthropic API → personalised opportunity map
       ↓
User sees results
       ↓
Clicks "Send Report" → /api/send-email → Resend API
       ↓
User receives HTML email
Louis receives BCC copy (every completion = a lead record)
```

---

## Lead Capture

Every time someone completes the tool and clicks "Send Report":
- They receive a beautifully formatted HTML email with their opportunity map
- **You receive a BCC copy** — this is your lead record
- The email contains their name, company, and the results Claude generated for them

For a more sophisticated lead database later, you can add a simple Google Sheet integration or Airtable webhook — but the BCC approach works fine to start.

---

## Costs

| Service | Cost |
|---------|------|
| Vercel (hosting) | Free (Hobby plan) |
| Resend (email) | Free up to 3,000 emails/month |
| Anthropic API | ~$0.015 per completion (12 questions + results) |

At 100 completions/month: approximately $1.50 in API costs.
At 1,000 completions/month: approximately $15 in API costs.

---

## Testing Before Going Live

```bash
# Run locally with your real .env.local keys
npm run dev

# Test the full flow:
# 1. Complete all 12 questions
# 2. Enter your own name + email on the capture screen
# 3. Check you receive the results email
# 4. Check you also receive the BCC copy
```

---

## File Structure Reference

```
predicta/
├── app/
│   ├── api/
│   │   ├── generate-question/route.js   ← Dynamic question generation
│   │   ├── generate-results/route.js    ← Final opportunity map
│   │   └── send-email/route.js          ← Email delivery via Resend
│   ├── globals.css
│   ├── layout.js
│   └── page.js
├── components/
│   └── Discovery.jsx                    ← The full app UI
├── .env.example                         ← Template (never commit .env.local)
├── .gitignore
├── next.config.js
└── package.json
```

---

## Need Help?

If anything gets stuck, the most common issues are:

1. **Resend domain not verified** — emails won't send until predicta.au is verified in Resend
2. **Missing environment variable** — double check all 6 variables are in Vercel
3. **DNS not propagated** — wait 30-60 minutes after adding DNS records

For technical help: share this guide and the codebase with any developer — everything is self-contained and well-commented.

---

*Built by Claude · Predicta.au · Building Predictable Revenue*
