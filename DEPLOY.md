# Quick Deployment Guide

## Your Setup

- **Backend**: https://tetris-app-testing.onrender.com
- **Frontend**: Will be deployed to Vercel
- **Custom Domain**: https://play-tetris.com

---

## Step 1: Deploy Frontend to Vercel

### Option A: Using Vercel Dashboard (Easiest)

1. Go to **[vercel.com/new](https://vercel.com/new)**

2. **Import your GitHub repository**: `contactevin2u/Tetris-App-Testing`

3. **Configure project settings**:
   - **Root Directory**: `frontend` ⬅️ IMPORTANT!
   - **Framework Preset**: Vite (auto-detected)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)

4. **Add Environment Variable**:
   - Click "Environment Variables"
   - **Name**: `VITE_WS_URL`
   - **Value**: `wss://tetris-app-testing.onrender.com`
   - Check all environments (Production, Preview, Development)

5. **Click "Deploy"**

6. Wait for deployment to complete (~2 minutes)

### Option B: Using Vercel CLI

```bash
cd frontend
npm install -g vercel
vercel login
vercel --prod
```

When prompted, set environment variable:
```
VITE_WS_URL=wss://tetris-app-testing.onrender.com
```

---

## Step 2: Configure Custom Domain (play-tetris.com)

### A. Add Domain in Vercel

1. Go to your Vercel project dashboard
2. Click **"Settings"** → **"Domains"**
3. Click **"Add"**
4. Enter: `play-tetris.com`
5. Click **"Add"**

### B. Configure DNS Records

Go to your domain registrar (where you bought play-tetris.com) and add these DNS records:

**For Root Domain (play-tetris.com):**

```
Type: A
Name: @ (or leave blank)
Value: 76.76.21.21
TTL: 3600 (or Auto)
```

**ALSO add (for Vercel):**

```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600 (or Auto)
```

### C. Wait for DNS Propagation

- Usually takes **5-30 minutes**
- Can take up to 48 hours
- Check status: [dnschecker.org](https://dnschecker.org)

### D. Verify in Vercel

Once DNS propagates:
- Vercel will automatically provision SSL certificate
- Your site will be live at `https://play-tetris.com`
- Both `play-tetris.com` and `www.play-tetris.com` will work

---

## Step 3: Test Your Deployment

1. **Visit**: https://play-tetris.com

2. **Open browser console** (F12)

3. **Check connection status**:
   - Should show "Connected" (green)
   - Console should show: "Connected to server"

4. **Click "Start Game"** and verify:
   - Pieces fall
   - Controls work (arrow keys)
   - Score updates
   - Game functions properly

---

## Troubleshooting

### ❌ "Disconnected - Reconnecting..."

**Cause**: WebSocket connection failed

**Fix**:
1. Check environment variable `VITE_WS_URL` is set to: `wss://tetris-app-testing.onrender.com`
2. Verify Render backend is running: https://tetris-app-testing.onrender.com/health
3. Redeploy frontend from Vercel dashboard

### ❌ Domain shows "404: NOT_FOUND"

**Cause**: DNS not configured correctly

**Fix**:
1. Verify DNS records match exactly as shown above
2. Wait for DNS propagation (check with `nslookup play-tetris.com`)
3. Remove and re-add domain in Vercel if needed

### ❌ "This site can't be reached"

**Cause**: DNS not propagated yet

**Fix**:
- Wait 15-30 minutes
- Check DNS propagation: https://dnschecker.org
- Verify A record points to `76.76.21.21`

### ❌ Build fails on Vercel

**Cause**: Missing dependencies or wrong directory

**Fix**:
1. Verify **Root Directory** is set to `frontend`
2. Check build logs in Vercel dashboard
3. Ensure `frontend/package.json` exists

---

## Environment Variables

Make sure these are set in Vercel:

| Name | Value | Environment |
|------|-------|-------------|
| `VITE_WS_URL` | `wss://tetris-app-testing.onrender.com` | Production, Preview, Development |

---

## Architecture

```
User Browser
    ↓
https://play-tetris.com (Vercel)
    ↓
React Frontend (Vite)
    ↓
WebSocket Connection
    ↓
wss://tetris-app-testing.onrender.com (Render)
    ↓
Node.js Backend + Game Logic
```

---

## Quick Links

- **Vercel Dashboard**: [vercel.com/dashboard](https://vercel.com/dashboard)
- **Render Dashboard**: https://dashboard.render.com/web/srv-d459i4fdiees7391c3j0
- **Backend Health**: https://tetris-app-testing.onrender.com/health
- **DNS Checker**: https://dnschecker.org
- **Your Game** (after deployment): https://play-tetris.com

---

## Common DNS Registrars Setup

### GoDaddy
1. Go to DNS Management
2. Add A record: `@` → `76.76.21.21`
3. Add CNAME: `www` → `cname.vercel-dns.com`

### Namecheap
1. Advanced DNS
2. Add Record → A Record
3. Host: `@`, Value: `76.76.21.21`
4. Add Record → CNAME
5. Host: `www`, Value: `cname.vercel-dns.com`

### Cloudflare
1. DNS → Records
2. Add record: Type `A`, Name `@`, IPv4: `76.76.21.21`, Proxy status: DNS only
3. Add record: Type `CNAME`, Name `www`, Target: `cname.vercel-dns.com`, Proxy status: DNS only

---

## Support

If you need help:
1. Check Vercel deployment logs
2. Check Render application logs
3. Check browser console (F12)
4. Verify all environment variables are correct
