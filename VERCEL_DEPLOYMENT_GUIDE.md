# 🚀 Vercel Deployment Guide for TaskFlow

## 📋 **Prerequisites**

Before deploying to Vercel, ensure you have:

1. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
2. **MongoDB Atlas Account** - For production database
3. **Git Repository** - Your code should be in a Git repository
4. **Vercel CLI** - Install with `npm i -g vercel`

---

## 🗄️ **Step 1: Set Up MongoDB Atlas**

### **1.1 Create MongoDB Atlas Cluster**
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a new cluster (free tier works for testing)
3. Set up database access with username/password
4. Set up network access (allow all IPs: `0.0.0.0/0`)

### **1.2 Get Connection String**
Your connection string will look like:
```
mongodb+srv://username:password@cluster.mongodb.net/taskflow
```

---

## 🔧 **Step 2: Prepare Your Application**

### **2.1 Build Your Application**
```bash
# Install dependencies
npm install

# Build frontend
npm run build

# Test the build
npm run preview
```

### **2.2 Verify Build Output**
Ensure the `dist/` folder contains your built application.

---

## 🚀 **Step 3: Deploy to Vercel**

### **3.1 Using Vercel CLI (Recommended)**

```bash
# Login to Vercel
vercel login

# Deploy from your project directory
vercel

# Follow the prompts:
# - Set up and deploy? → Yes
# - Which scope? → Select your account
# - Link to existing project? → No
# - What's your project name? → taskflow-app
# - In which directory is your code located? → ./
# - Want to override the settings? → No
```

### **3.2 Using Vercel Dashboard**

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your Git repository
4. Configure build settings:
   - **Framework Preset**: Other
   - **Build Command**: `npm run vercel-build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

---

## ⚙️ **Step 4: Configure Environment Variables**

### **4.1 In Vercel Dashboard**

1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add the following variables:

```bash
# Required Variables
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taskflow
JWT_SECRET=your-super-secure-production-jwt-secret-key
NODE_ENV=production

# Optional Variables
CORS_ORIGIN=https://your-app-name.vercel.app
BCRYPT_SALT_ROUNDS=12
JWT_EXPIRES_IN=24h
LOG_LEVEL=info
```

### **4.2 Environment Variable Details**

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `MONGODB_URI` | MongoDB connection string | ✅ | `mongodb+srv://...` |
| `JWT_SECRET` | Secret key for JWT tokens | ✅ | `your-secret-key` |
| `NODE_ENV` | Environment mode | ✅ | `production` |
| `CORS_ORIGIN` | Allowed origin for CORS | ❌ | `https://app.vercel.app` |
| `BCRYPT_SALT_ROUNDS` | Password hashing rounds | ❌ | `12` |
| `JWT_EXPIRES_IN` | JWT token expiration | ❌ | `24h` |

---

## 🔄 **Step 5: Deploy and Test**

### **5.1 Deploy**
```bash
# Deploy to production
vercel --prod
```

### **5.2 Test Your Deployment**
1. **Frontend**: Visit your Vercel URL
2. **Backend API**: Test `/api/health` endpoint
3. **Authentication**: Test login/register functionality
4. **Database**: Verify data persistence

---

## 🐛 **Step 6: Troubleshooting**

### **6.1 Common Issues**

#### **Build Failures**
```bash
# Check build logs
vercel logs

# Test build locally
npm run vercel-build
```

#### **Database Connection Issues**
- Verify MongoDB Atlas network access
- Check connection string format
- Ensure database user has correct permissions

#### **API Endpoints Not Working**
- Check Vercel function logs
- Verify environment variables
- Test API routes locally

### **6.2 Debug Commands**
```bash
# View deployment logs
vercel logs

# Check function logs
vercel logs --function=server/src/index.js

# Redeploy with debug info
vercel --debug
```

---

## 📊 **Step 7: Monitor and Optimize**

### **7.1 Vercel Analytics**
- Monitor function execution times
- Check error rates
- Analyze performance metrics

### **7.2 Database Monitoring**
- Monitor MongoDB Atlas metrics
- Check connection pool usage
- Optimize queries if needed

---

## 🔒 **Step 8: Security Considerations**

### **8.1 Environment Variables**
- Never commit secrets to Git
- Use Vercel's encrypted environment variables
- Rotate JWT secrets regularly

### **8.2 CORS Configuration**
- Restrict CORS origins in production
- Use HTTPS for all communications
- Implement rate limiting if needed

---

## 🚀 **Step 9: Production Checklist**

### **9.1 Pre-Deployment**
- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database connection tested
- [ ] Build process verified

### **9.2 Post-Deployment**
- [ ] Frontend loads correctly
- [ ] API endpoints responding
- [ ] Authentication working
- [ ] Database operations successful
- [ ] Error handling working
- [ ] Logging functional

---

## 📱 **Step 10: Custom Domain (Optional)**

### **10.1 Add Custom Domain**
1. Go to project settings in Vercel
2. Navigate to "Domains"
3. Add your custom domain
4. Configure DNS records as instructed

### **10.2 Update Environment Variables**
```bash
CORS_ORIGIN=https://yourdomain.com
```

---

## 🎯 **Quick Deploy Commands**

```bash
# Full deployment process
npm install
npm run build
vercel --prod

# Update environment variables
vercel env add MONGODB_URI
vercel env add JWT_SECRET

# Redeploy after changes
vercel --prod
```

---

## 📞 **Support Resources**

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **MongoDB Atlas**: [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)
- **Vercel Community**: [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)

---

## 🎉 **Congratulations!**

Your TaskFlow application is now deployed to Vercel with:
- ✅ **Frontend**: React app served from CDN
- ✅ **Backend**: Serverless Node.js functions
- ✅ **Database**: MongoDB Atlas cloud database
- ✅ **Security**: Environment variable protection
- ✅ **Performance**: Global CDN distribution

**Your MERN stack application is now live and production-ready! 🚀**
