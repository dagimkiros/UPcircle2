# GitHub Secrets Setup

You need to add these secrets to GitHub before the CI/CD pipeline works.

## How to add secrets
Go to: https://github.com/dagimkiros/UPcircle2/settings/secrets/actions
Click "New repository secret" for each one below.

---

## Required Secrets

### Supabase (already have these)
| Secret Name | Where to find it |
|-------------|-----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API → anon public key |
| `NEXT_PUBLIC_SITE_URL` | https://upcircle2.vercel.app |

### Vercel (for auto-deploy)
| Secret Name | Where to find it |
|-------------|-----------------|
| `VERCEL_TOKEN` | vercel.com → Settings → Tokens → Create Token |
| `VERCEL_ORG_ID` | vercel.com → Settings → General → Team ID |
| `VERCEL_PROJECT_ID` | vercel.com → Your Project → Settings → General → Project ID |

---

## How to get Vercel secrets

1. Go to https://vercel.com/account/tokens
2. Click "Create" → name it "GitHub Actions" → copy the token
3. Add as VERCEL_TOKEN

4. Go to https://vercel.com/dagimkiros/upcircle2/settings
5. Copy "Project ID" → add as VERCEL_PROJECT_ID

6. Go to https://vercel.com/dagimkiros/settings
7. Copy "Team ID" → add as VERCEL_ORG_ID

---

## Pipeline Flow

Every push to main:
1. ✅ Lint & Build check
2. ✅ Selenium tests (35 tests against live site)
3. ✅ Security scan (npm audit + secret detection)
4. 🚀 Deploy to Vercel (only if ALL above pass)

If any step fails → deployment is BLOCKED automatically.
