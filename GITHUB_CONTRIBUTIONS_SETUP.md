# GitHub Contributions Setup

This guide explains how to enable real GitHub contribution data for the contributions chart on your site.

## Overview

The GitHub contributions chart displays your GitHub activity for the last year. By default, it shows demo data. To display real data from your GitHub profile, you need to set up a GitHub Personal Access Token (PAT).

## Quick Setup

### 1. Create a GitHub Personal Access Token

1. Go to [GitHub Settings → Tokens](https://github.com/settings/tokens)
2. Click **"Generate new token (classic)"**
3. Give it a descriptive name: `lucas-cv contribution chart`
4. Set expiration: Choose your preference (recommend 90 days or 1 year)
5. Select **minimal scopes** - only need:
   - ✅ `read:user` (Read user profile data)
   - Or just `public_repo` if you prefer even more limited access
6. Click **"Generate token"**
7. **Copy the token immediately** (you won't see it again!)

### 2. Add Token to Environment Variables

#### For Local Development:

1. Create a `.env.local` file in the root directory:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` and add your token:
   ```bash
   GITHUB_TOKEN=ghp_your_actual_token_here
   ```

3. Restart your dev server:
   ```bash
   npm run dev
   ```

#### For Vercel Deployment:

1. Go to your [Vercel Project Settings](https://vercel.com/dashboard)
2. Navigate to **Settings → Environment Variables**
3. Add a new variable:
   - **Name:** `GITHUB_TOKEN`
   - **Value:** Your GitHub token
   - **Environment:** All (Production, Preview, Development)
4. Click **Save**
5. **Redeploy** your site for changes to take effect

## How It Works

### Architecture

```
Browser → /api/github-contributions → GitHub GraphQL API
         ↓ (if token missing or error)
         ↓
      Mock Data Fallback
```

1. **Component** (`components/GitHubContributions.tsx`):
   - Fetches data from the API route
   - Falls back to mock data if API fails
   - Displays "(demo data)" indicator when using mock data

2. **API Route** (`app/api/github-contributions/route.ts`):
   - Securely stores your GitHub token (not exposed to client)
   - Fetches real contribution data via GitHub's GraphQL API
   - Returns transformed data with contribution levels (0-4)
   - Gracefully handles errors and missing tokens

3. **Data Transformation**:
   - Level 0: 0 contributions (lightest)
   - Level 1: 1-2 contributions
   - Level 2: 3-5 contributions
   - Level 3: 6-9 contributions
   - Level 4: 10+ contributions (darkest)

### Security

- Token is stored in environment variables (never committed to git)
- Token is only used server-side in the API route
- Client-side code never sees the token
- `.env.local` is in `.gitignore`
- Edge runtime for fast global response

## Troubleshooting

### Chart shows "(demo data)" indicator

**Cause:** GitHub token is not configured or API request failed

**Solution:**
1. Check if `GITHUB_TOKEN` is set in `.env.local` (local) or Vercel env vars (production)
2. Verify token is valid: [Check your tokens](https://github.com/settings/tokens)
3. Check browser console for error messages
4. Verify token has correct permissions (`read:user` or `public_repo`)

### Token expired

**Solution:**
1. Generate a new token (follow setup steps above)
2. Update `.env.local` and/or Vercel environment variables
3. Restart dev server or redeploy on Vercel

### API rate limit exceeded

**Cause:** GitHub API has rate limits (5,000 requests/hour with auth)

**Solution:**
- The chart only fetches once per page load
- Consider caching the response (future enhancement)
- Rate limits reset every hour

## Testing

### Local Testing

```bash
# Check if token is working
curl http://localhost:3000/api/github-contributions?username=lucasdickey
```

### Verify Real Data

Look for the absence of "(demo data)" text next to "GitHub Contributions" header.

## Customization

### Change Username

In `app/page.tsx`, update the username prop:

```tsx
<GitHubContributions username="your-github-username" />
```

### Adjust Contribution Levels

Edit `app/api/github-contributions/route.ts` to change the thresholds:

```typescript
if (count === 0) level = 0;
else if (count < 3) level = 1;  // Adjust these numbers
else if (count < 6) level = 2;
else if (count < 10) level = 3;
else level = 4;
```

### Change Colors

Edit `components/GitHubContributions.tsx` in the `getLevelColor` function:

```typescript
const colors = {
  0: '#e8e8d8',  // No contributions
  1: '#d4b896',  // Low
  2: '#b89968',  // Medium
  3: '#8b6f47',  // High
  4: '#5d4a2f',  // Very high
};
```

## Support

For issues or questions:
- Check the [GitHub API documentation](https://docs.github.com/en/graphql)
- Review Vercel deployment logs
- Open an issue in the repository
