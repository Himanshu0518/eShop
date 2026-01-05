# 🚀 COMPLETE DEPLOYMENT GUIDE - Both AWS & Render/Vercel

## ✅ **All Fixes Applied**

### **Backend Fixes:**
- ✅ Dynamic cookie settings (HTTP/HTTPS adaptive)
- ✅ CORS updated for both AWS and Vercel
- ✅ Health check endpoint added

### **Frontend Fixes:**
- ✅ API_BASE_URL configuration added
- ✅ All services updated to use dynamic URLs
- ✅ Works with both Nginx proxy (AWS) and direct API (Vercel)

---

# 🎯 **OPTION 1: AWS EC2 Deployment (Docker + Nginx)**

## **Step 1: Rebuild & Push Images**

```bash
cd C:\Users\hs787\Desktop\eShop

# Backend
cd server
docker build -t himanshu0518/eshop_backend:latest .
docker push himanshu0518/eshop_backend:latest

# Frontend
cd ../client
docker build -t himanshu0518/eshop_frontend:latest .
docker push himanshu0518/eshop_frontend:latest
```

## **Step 2: Update EC2**

```bash
ssh -i "my-webserver-key.pem" ubuntu@ec2-13-49-244-25.eu-north-1.compute.amazonaws.com

cd ~/eshop

# Update environment
nano .env
```

Ensure `.env` has:
```env
NODE_ENV=production
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://13.49.244.25
# ... other vars
```

## **Step 3: Deploy**

```bash
docker-compose pull
docker-compose down
docker-compose up -d
docker-compose logs -f
```

## **Step 4: Test**

Open: **http://13.49.244.25**

Try:
1. ✅ Login/Signup
2. ✅ Browse products
3. ✅ Add to cart
4. ✅ Add to favorites

**All should work now!** 🎉

---

# 🌐 **OPTION 2: Render + Vercel Deployment**

## **Backend on Render**

### **Step 1: Push Code to GitHub**

```bash
cd C:\Users\hs787\Desktop\eShop
git add .
git commit -m "feat: add support for Render/Vercel deployment"
git push origin main
```

### **Step 2: Deploy on Render**

1. Go to: https://render.com
2. **New → Web Service**
3. Connect GitHub repo: `eShop`
4. **Settings:**
   - Name: `eshop-backend`
   - Root Directory: `server`
   - Environment: `Docker`
   - Instance: Free or Starter

5. **Environment Variables:**
```
NODE_ENV=production
DATABASE_URL=your_neon_url
PORT=8000
JWT_SECRET=your_secret
CLIENT_URL=https://eshop-frontend.vercel.app
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
GEMINI_API_KEY=...
USD_TO_INR=83
RAZORPAY_KEY_ID=...
RAZORPAY_SECRET_KEY=...
```

6. Click **Create Web Service**

Wait ~5 minutes. Note your URL: `https://eshop-backend.onrender.com`

### **Step 3: Update Backend CORS**

After getting Vercel URL, update backend `src/index.ts`:

Add your Vercel URL to allowed origins:
```typescript
const allowedOrigins = [
  'http://localhost',
  'http://localhost:5173',
  'https://eshop-frontend.vercel.app', // ← Add your actual Vercel URL
  process.env.CLIENT_URL,
].filter(Boolean);
```

Push changes, Render will auto-redeploy.

---

## **Frontend on Vercel**

### **Step 1: Create .env.production**

```bash
cd C:\Users\hs787\Desktop\eShop\client
```

Create `.env.production`:
```env
VITE_API_URL=https://eshop-backend.onrender.com
VITE_RAZORPAY_KEY=rzp_test_RyEWGJphoNloBF
```

### **Step 2: Push to GitHub**

```bash
git add .
git commit -m "feat: add Vercel production config"
git push origin main
```

### **Step 3: Deploy on Vercel**

1. Go to: https://vercel.com
2. **New Project**
3. Import `eShop` repository
4. **Settings:**
   - Framework: Vite
   - Root Directory: `client`
   - Build Command: `npm run build`
   - Output Directory: `dist`

5. **Environment Variables:**
```
VITE_API_URL=https://eshop-backend.onrender.com
VITE_RAZORPAY_KEY=rzp_test_RyEWGJphoNloBF
```

6. Click **Deploy**

Your app will be live at: `https://eshop-frontend.vercel.app`

### **Step 4: Test**

Open your Vercel URL and test all features!

---

## 🐛 **Troubleshooting**

### **AWS - Still Getting Unauthenticated?**

Check browser console:
```
Application → Cookies
```

Should see `accessToken` cookie. If not:
1. Clear cookies
2. Try login again
3. Check backend logs: `docker-compose logs backend`

### **Vercel - CORS Error?**

1. Make sure backend has your Vercel URL in allowed origins
2. Redeploy backend on Render
3. Check Network tab in browser console

### **Vercel - API calls failing?**

Check `.env.production`:
```env
VITE_API_URL=https://eshop-backend.onrender.com
```

**No trailing slash!**

---

## 📊 **Which Deployment to Use?**

| Feature | AWS EC2 | Render + Vercel |
|---------|---------|-----------------|
| **Cost** | ~$40/month | Free tier available |
| **Speed** | Fast (same server) | Slower (cold starts on free) |
| **Scalability** | Manual | Auto-scaling |
| **SSL** | Manual setup | Automatic HTTPS |
| **Complexity** | Medium | Easy |
| **For Demo** | ✅ Great | ✅ Great |
| **For Production** | Good | Better |

**Recommendation for College Project:**
- **Demo/Presentation:** AWS EC2 (reliable, always on)
- **Portfolio/Resume:** Render + Vercel (free, professional URLs)

---

## ✅ **Final Checklist**

### **AWS:**
- [ ] Backend image built and pushed
- [ ] Frontend image built and pushed
- [ ] EC2 docker-compose updated
- [ ] Containers restarted
- [ ] Login works
- [ ] Cart works
- [ ] Favorites work

### **Render + Vercel:**
- [ ] Backend deployed on Render
- [ ] Render URL added to CORS
- [ ] Frontend `.env.production` created
- [ ] Frontend deployed on Vercel
- [ ] All features tested

---

## 🎉 **You're Done!**

Both deployments should work now. Choose one (or use both!) for your college project.

**For questions, check the logs:**
```bash
# AWS
docker-compose logs -f

# Render
Check dashboard logs

# Vercel
Check deployment logs
```

Good luck! 🚀
