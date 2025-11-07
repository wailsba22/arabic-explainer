# 🔧 Troubleshooting Guide

## AI Models Not Working? Here's How to Fix:

### **Option 1: Google Gemini (Recommended - Best for Arabic!)**

1. **Get FREE Gemini API Key:**
   - Go to: https://aistudio.google.com/app/apikey
   - Click "Create API Key"
   - Click "Create API key in new project"
   - Copy the key (starts with `AIza...`)

2. **Add to Vercel:**
   - Go to: https://vercel.com/wailsba22/arabic-explainer/settings/environment-variables
   - Click **Add New**
   - **Name**: `GEMINI_API_KEY`
   - **Value**: Paste your Gemini key
   - Click **Save**

3. **Redeploy:**
   - Go to **Deployments** tab
   - Click **⋯** (three dots) on latest deployment
   - Click **Redeploy**

### **Option 2: Hugging Face (Fallback)**

1. **Get FREE API Key:**
   - Go to: https://huggingface.co/settings/tokens
   - Click "New token"
   - Name: `vercel-arabic-explainer`
   - Type: **Read** (not Write)
   - Click "Generate"
   - Copy the token (starts with `hf_...`)

2. **Add to Vercel:**
   - Go to: https://vercel.com/wailsba22/arabic-explainer
   - Click **Settings** tab
   - Click **Environment Variables** (left sidebar)
   - Click **Add New**
   - **Name**: `HF_API_KEY`
   - **Value**: Paste your Hugging Face token
   - Click **Save**

3. **Redeploy:**
   - Go to **Deployments** tab
   - Click **⋯** (three dots) on latest deployment
   - Click **Redeploy**
   - Wait 1-2 minutes

### **Step 2: Check Logs**

After redeployment, test your site and check logs:

1. Go to: https://vercel.com/wailsba22/arabic-explainer
2. Click **Deployments** → Latest deployment
3. Click **Functions** tab
4. Look for `/api/explain` function
5. Check the logs for:
   - ✅ `Success with mistralai/Mixtral-8x7B-Instruct-v0.1` ← AI is working!
   - ⚠️ `HF_API_KEY not found` ← Need to add the key
   - ⚠️ `All AI models failed` ← Models might be loading (try again in 1 min)

### **What Happens Without API Key:**

Don't worry! The site still works:
- ✅ **Smart Local Analyzer** kicks in automatically
- ✅ Analyzes code patterns, functions, variables
- ✅ Provides detailed Arabic explanations
- ⚠️ Just not as "intelligent" as real AI models

### **Expected Behavior:**

**With API Key (Best):**
```
User pastes code → Click Explain → Calls Vercel API → 
Hugging Face AI → Returns detailed AI explanation in Arabic ✨
```

**Without API Key (Good):**
```
User pastes code → Click Explain → Calls Vercel API → 
No key found → Frontend smart analyzer → 
Returns pattern-based explanation in Arabic ✅
```

### **Testing:**

1. Paste this Python code:
```python
def hello():
    print("مرحبا")
hello()
```

2. Click "Explain"

3. Check browser console (F12):
   - Look for: `✅ AI explanation received from mistralai/Mixtral...`
   - Or: `⚠️ API returned fallback flag, using local analysis...`

### **Common Issues:**

**Issue: "AI models busy"**
- **Cause:** Hugging Face models loading (first request is slow)
- **Fix:** Wait 30 seconds and try again

**Issue: Console shows "HF_API_KEY not found"**
- **Cause:** Environment variable not set
- **Fix:** Follow Step 1 above

**Issue: Always using local analysis**
- **Check:** Vercel logs to see if API key is present
- **Fix:** Make sure you redeployed after adding the key

---

## 🎯 Quick Fix Checklist:

- [ ] Created Hugging Face account
- [ ] Generated API token (Read access)
- [ ] Added `HF_API_KEY` to Vercel Environment Variables
- [ ] Redeployed the site
- [ ] Waited 2 minutes for deployment
- [ ] Tested with sample code
- [ ] Checked browser console (F12) for logs

---

**Still not working?** Check Vercel function logs - they'll tell you exactly what's happening!
