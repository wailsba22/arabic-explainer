# 🚀 Deployment Instructions

## Option 1: Deploy to Vercel (Recommended - FREE & Easy)

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/wailsba22/arabic-explainer.git
git push -u origin main
```

### Step 2: Get Hugging Face API Key (FREE!)
1. Go to [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
2. Click "New token" → Create a "Read" token
3. Copy the token (starts with `hf_...`)

### Step 3: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up" with GitHub
3. Click "New Project"
4. Import your `arabic-explainer` repository
5. **Before deploying**, add Environment Variable:
   - Key: `HF_API_KEY`
   - Value: Your Hugging Face token (from Step 2)
6. Click "Deploy"

### Step 4: Done! 🎉
Your site will be live at: `https://arabic-explainer-[your-id].vercel.app`

**The AI API will work perfectly** - no CORS errors!

---

## Option 2: GitHub Pages + Netlify Functions

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git push origin main
```

### Step 2: Enable GitHub Pages
1. Go to repository Settings
2. Pages → Source: `main` branch
3. Save

### Step 3: For AI Features
Deploy the `/api` folder to Netlify:
1. Go to [netlify.com](https://netlify.com)
2. Drag the `/api` folder
3. Update `API_URL` in `script.js` to your Netlify URL

---

## Option 3: Local Testing

### Start Local Server
```bash
python -m http.server 8000
```

Then open: `http://localhost:8000`

**Note:** AI features need serverless deployment to work (Vercel/Netlify)

---

## Environment Variables (Optional)

If you want to use your own Hugging Face API key:

1. Go to [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
2. Create a new token
3. In Vercel:
   - Settings → Environment Variables
   - Add: `HF_API_KEY` = your token

---

## 🎯 Quick Deploy (Easiest!)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/wailsba22/arabic-explainer)

Just click the button above when your code is on GitHub!

---

## Features After Deployment

✅ **AI-Powered Explanations** in Arabic
✅ **No CORS Errors** - serverless backend handles it
✅ **100% Free** - Vercel free tier is generous
✅ **Fast & Reliable** - Vercel edge network
✅ **Auto HTTPS** - Secure by default
✅ **Custom Domain** - Can add your own domain later

---

## Troubleshooting

**Q: AI not working after deployment?**
A: Check Vercel logs - might need to wait for models to load (first request is slow)

**Q: Want to use local AI?**
A: Just use GitHub Pages without serverless - the smart local analyzer will work!

**Q: Need help?**
A: Check Vercel docs or create an issue on GitHub
