# Deploying Tetris to Vercel with Custom Domain

## Prerequisites

- Backend deployed on Render (get your URL)
- Custom domain (e.g., `tetris.yourdomain.com`)
- Vercel account

## Step 1: Update vercel.json

Before deploying, update `vercel.json` line 5:

```json
"destination": "https://your-actual-backend.onrender.com/:path*"
```

Replace `your-backend.onrender.com` with your actual Render URL.

## Step 2: Deploy to Vercel

### Option A: Using Vercel CLI (Recommended)

```bash
cd frontend
npm install -g vercel
vercel login
vercel
```

When prompted:
- Set up and deploy? **Y**
- Which scope? (select your account)
- Link to existing project? **N**
- Project name? **tetris** (or your choice)
- Which directory is your code? **.**
- Override settings? **N**

### Option B: Using Vercel Dashboard

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import `Tetris-App-Testing` repository
3. Configure:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

## Step 3: Set Environment Variables

In Vercel dashboard (Settings → Environment Variables):

Add:
- **Name**: `VITE_WS_URL`
- **Value**: `wss://your-backend.onrender.com`
- **Environment**: Production, Preview, Development (all selected)

## Step 4: Add Custom Domain

1. Go to your Vercel project
2. Click **Settings** → **Domains**
3. Click **Add Domain**
4. Enter your domain (e.g., `tetris.yourdomain.com`)
5. Follow DNS configuration instructions:

### DNS Configuration

Add these records to your domain DNS:

**For subdomain (tetris.yourdomain.com):**
```
Type: CNAME
Name: tetris
Value: cname.vercel-dns.com
```

**For root domain (yourdomain.com):**
```
Type: A
Name: @
Value: 76.76.21.21
```

6. Wait for DNS propagation (5 minutes to 48 hours, usually ~10 minutes)

## Step 5: Enable HTTPS

Vercel automatically provisions SSL certificates. Once DNS propagates:
- Your site will be accessible at `https://tetris.yourdomain.com`
- HTTP automatically redirects to HTTPS

## Step 6: Test WebSocket Connection

1. Visit your custom domain
2. Open browser console (F12)
3. Click "Start Game"
4. Check for "Connected to server" message
5. Verify game is playable

## Architecture

```
User Browser
    ↓
https://tetris.yourdomain.com (Vercel - Frontend)
    ↓
wss://your-backend.onrender.com (Render - WebSocket)
```

## Troubleshooting

### WebSocket Connection Failed

**Issue**: "Disconnected - Reconnecting..."

**Solution**:
1. Check `VITE_WS_URL` environment variable is set correctly
2. Ensure it uses `wss://` (not `ws://`)
3. Verify Render backend is running
4. Check browser console for specific errors

### Custom Domain Not Working

**Issue**: Domain shows "404: NOT_FOUND"

**Solution**:
1. Verify DNS records are correct
2. Wait for DNS propagation
3. Check domain ownership is verified in Vercel
4. Use `dig` or `nslookup` to check DNS:
   ```bash
   nslookup tetris.yourdomain.com
   ```

### Build Failed

**Issue**: Vercel build fails

**Solution**:
1. Check build logs in Vercel dashboard
2. Verify `package.json` has correct scripts
3. Ensure all dependencies are listed in `package.json`
4. Redeploy from Vercel dashboard

## Optional: Configure Render Backend URL

To avoid hardcoding the backend URL in `vercel.json`, you can:

1. Remove the API proxy from `vercel.json` (lines 3-6)
2. Use only the `VITE_WS_URL` environment variable
3. The frontend will connect directly to Render

This is simpler but means all requests go directly to Render (no proxy).

## Production Checklist

- [ ] Backend deployed on Render and accessible
- [ ] Frontend deployed on Vercel
- [ ] Environment variable `VITE_WS_URL` set correctly
- [ ] Custom domain DNS configured
- [ ] HTTPS certificate active
- [ ] WebSocket connection working
- [ ] Game fully functional

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check Render application logs
3. Check browser console for errors
4. Verify environment variables are set correctly
