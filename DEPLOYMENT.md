# 🚀 Quick Deployment Guide

## Vercel (Recommended)

### 1. Prepare Repository

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Configure project settings:
   - **Framework Preset**: Next.js
   - **Root Directory**: ./
   - **Build Command**: `npm run build`
   - **Output Directory**: Leave empty (auto-detected)

### 3. Environment Variables

Add these in Vercel dashboard → Settings → Environment Variables:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/todo-app
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-production-secret-key
GOOGLE_CLIENT_ID=your-google-client-id.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
NODE_ENV=production
```

### 4. Update Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to APIs & Services → Credentials
3. Edit your OAuth 2.0 Client ID
4. Add authorized redirect URI:
   ```
   https://your-app.vercel.app/api/auth/callback/google
   ```

### 5. Deploy

Click "Deploy" and wait for completion!

---

## Railway

### 1. Install Railway CLI

```bash
npm install -g @railway/cli
```

### 2. Deploy

```bash
railway login
railway init
railway add --database mongodb
railway up
```

### 3. Set Environment Variables

```bash
railway variables set NEXTAUTH_URL=https://your-app.railway.app
railway variables set NEXTAUTH_SECRET=your-secret
railway variables set GOOGLE_CLIENT_ID=your-client-id
railway variables set GOOGLE_CLIENT_SECRET=your-client-secret
```

---

## Netlify

### 1. Build Settings

- **Build Command**: `npm run build`
- **Publish Directory**: `.next`
- **Functions Directory**: `netlify/functions`

### 2. Environment Variables

Add in Netlify dashboard → Site Settings → Environment Variables

### 3. Deploy

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod
```

---

## Docker (Optional)

### 1. Create Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

### 2. Build and Run

```bash
docker build -t todo-app .
docker run -p 3000:3000 --env-file .env.local todo-app
```

---

## Post-Deployment Checklist

- [ ] Test authentication flow
- [ ] Verify database connectivity
- [ ] Test CRUD operations
- [ ] Check responsive design
- [ ] Test drag-and-drop functionality
- [ ] Verify theme switching
- [ ] Test error handling
- [ ] Check performance metrics
- [ ] Set up monitoring (optional)

---

## Troubleshooting

### Common Deployment Issues

**Build Errors**:

```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

**Environment Variable Issues**:

- Ensure all required variables are set
- Check for typos in variable names
- Verify values don't contain extra spaces

**OAuth Redirect Issues**:

- Update Google OAuth authorized redirect URIs
- Ensure NEXTAUTH_URL matches deployment URL
- Check for trailing slashes in URLs

### Performance Optimization

**For Production**:

1. Enable gzip compression
2. Set up CDN for static assets
3. Configure caching headers
4. Monitor Core Web Vitals
5. Set up error tracking (Sentry, LogRocket)

---

**Need Help?** Check the main [DOCUMENTATION.md](./DOCUMENTATION.md) or create an issue!
