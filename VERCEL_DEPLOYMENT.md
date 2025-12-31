# Vercel Deployment Guide

## Current Status

- ✅ Vercel CLI installed (v50.1.3)
- ✅ Logged in as: atlas00000
- ✅ Project may already be linked (`.vercel` directory exists)

## Deployment Options

### Option 1: Git-Based Deployment (Recommended)

Vercel automatically deploys from your GitHub repository when you push to the main branch.

**Setup via Dashboard:**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" → "Project"
3. Import your GitHub repository: `Atlas00000/corpoview_client`
4. Configure:
   - Framework Preset: Next.js
   - Root Directory: `./` (default)
   - Build Command: `pnpm build` (or `npm run build`)
   - Output Directory: `.next`
5. Add Environment Variables (see below)
6. Click "Deploy"

**Benefits:**
- ✅ Automatic deployments on every push
- ✅ Preview deployments for pull requests
- ✅ No CLI needed after initial setup
- ✅ Easy rollback and deployment history

### Option 2: Vercel CLI Deployment

**Link project (if not already linked):**
```bash
cd client
vercel link
```

**Deploy to production:**
```bash
vercel --prod
```

**Benefits:**
- ✅ Deploy directly from CLI
- ✅ No need to push to Git first
- ✅ Good for testing deployments

## Environment Variables

Set these in Vercel Dashboard → Project → Settings → Environment Variables:

```
NEXT_PUBLIC_API_URL=https://your-railway-server.railway.app
```

Or via CLI:
```bash
vercel env add NEXT_PUBLIC_API_URL production
```

## Configuration Files

- `next.config.js` - Already configured for Vercel (standalone output)
- `.vercelignore` - Files to exclude from deployment
- `.vercel/` - Vercel project configuration (auto-generated)

## Deployment Commands

```bash
# Link to existing Vercel project
vercel link

# Deploy to preview
vercel

# Deploy to production
vercel --prod

# List deployments
vercel ls

# View deployment logs
vercel logs [deployment-url]
```

## Troubleshooting

### Project Already Linked
If `.vercel/project.json` exists, the project is already linked. You can:
- Deploy directly: `vercel --prod`
- Check status: `vercel ls`
- Unlink if needed: `vercel unlink`

### Git Integration
For automatic Git deployments:
1. Connect repository in Vercel Dashboard
2. Vercel will auto-deploy on every push to main branch
3. Preview deployments for other branches/PRs

