# 🚀 AWS EC2 Deployment Checklist - Option B

## ✅ Pre-Deployment Checklist

### **On Your Local Machine:**
- [ ] Built backend Docker image: `docker build -t himanshu0518/backend:latest .`
- [ ] Built frontend Docker image: `docker build -t himanshu0518/frontend:latest .`
- [ ] Pushed to Docker Hub: `docker push himanshu0518/backend:latest`
- [ ] Pushed to Docker Hub: `docker push himanshu0518/frontend:latest`
- [ ] GitHub Actions workflow created at `.github/workflows/deploy.yml`

---

## 🖥️ AWS EC2 Setup Checklist

### **EC2 Instance:**
- [ ] Launched Ubuntu 22.04 LTS instance
- [ ] Instance type: t2.medium or t3.medium
- [ ] Security Group allows ports: 22 (SSH), 80 (HTTP), 8000 (Backend)
- [ ] Downloaded SSH key (.pem file)
- [ ] Noted EC2 Public IP: `___________________`

### **Connect to EC2:**
```bash
ssh -i eshop-key.pem ubuntu@YOUR_EC2_IP
```

### **Install Docker:**
```bash
# Run these commands on EC2:
sudo apt update && sudo apt upgrade -y
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker ubuntu
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
exit  # Reconnect after this
```

- [ ] Docker installed and verified: `docker --version`
- [ ] Docker Compose installed: `docker-compose --version`

---

## 📁 Project Setup on EC2

### **Create Files:**
```bash
mkdir ~/eshop
cd ~/eshop
```

### **docker-compose.yml:**
- [ ] Created `docker-compose.yml` with correct configuration
- [ ] Updated image names to match your Docker Hub

### **.env File:**
- [ ] Created `.env` file
- [ ] Set `EC2_PUBLIC_IP` to your actual EC2 IP
- [ ] All environment variables filled correctly:
  - [ ] DATABASE_URL
  - [ ] JWT_SECRET
  - [ ] CLOUDINARY credentials
  - [ ] GEMINI_API_KEY
  - [ ] RAZORPAY credentials

---

## 🚀 Deployment Steps

### **First-Time Deployment:**
```bash
cd ~/eshop
docker-compose pull
docker-compose up -d
```

- [ ] Backend container running: `docker-compose ps`
- [ ] Frontend container running: `docker-compose ps`
- [ ] No errors in logs: `docker-compose logs -f`

### **Test Application:**
- [ ] Frontend accessible: `http://YOUR_EC2_IP`
- [ ] Backend API responding: `http://YOUR_EC2_IP:8000`
- [ ] Can browse products
- [ ] Can login/signup
- [ ] API calls working (check browser console)

---

## 🔄 GitHub Actions CI/CD Setup

### **GitHub Secrets (Required):**

Go to: `GitHub Repo → Settings → Secrets and variables → Actions`

Add these secrets:

| Secret Name | Value | Status |
|-------------|-------|--------|
| `EC2_HOST` | Your EC2 public IP | [ ] |
| `EC2_USERNAME` | `ubuntu` | [ ] |
| `EC2_SSH_KEY` | Content of .pem file | [ ] |
| `DOCKER_USERNAME` | `himanshu0518` | [ ] |
| `DOCKER_PASSWORD` | Docker Hub token | [ ] |

### **Workflow File:**
- [ ] `.github/workflows/deploy.yml` exists in your repo
- [ ] File committed and pushed to main branch

---

## 🧪 Test CI/CD Pipeline

### **Trigger Deployment:**
```bash
# Make a small change
echo "# Test deployment" >> README.md
git add .
git commit -m "test: trigger CI/CD"
git push origin main
```

### **Monitor Deployment:**
- [ ] Go to GitHub → Actions tab
- [ ] Workflow "Deploy to AWS EC2" started
- [ ] Build step completed
- [ ] Deploy step completed
- [ ] No errors in workflow logs

### **Verify on EC2:**
```bash
ssh -i eshop-key.pem ubuntu@YOUR_EC2_IP
cd ~/eshop
docker-compose ps  # Check if containers restarted
docker-compose logs -f  # Check logs
```

- [ ] Containers restarted successfully
- [ ] Application still working after deployment

---

## 🎯 Post-Deployment Tasks

### **Domain Setup (Optional):**
If you have a domain:
1. [ ] Point domain to EC2 IP in DNS settings
2. [ ] Update `CLIENT_URL` in .env
3. [ ] Restart containers: `docker-compose restart`

### **SSL Certificate (Optional but Recommended):**
```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com
```

### **Monitoring:**
- [ ] Set up CloudWatch for EC2 monitoring
- [ ] Enable auto-restart: `docker-compose` already has `restart: always`
- [ ] Create EC2 snapshot for backup

---

## 🔒 Security Hardening (Recommended)

### **Update Security Group:**
- [ ] Change SSH to only allow your IP
- [ ] Consider using AWS Session Manager instead of SSH

### **Environment Variables:**
- [ ] All secrets in .env (not hardcoded)
- [ ] .env file permissions: `chmod 600 .env`
- [ ] Change JWT_SECRET to a strong random string
- [ ] Use production Razorpay keys (not test keys)

### **Database:**
- [ ] Database has strong password
- [ ] Database only allows connections from EC2 IP
- [ ] Regular database backups enabled

---

## 📊 Cost Management

### **Monthly Costs (Estimate):**
- EC2 t2.medium: ~$30-40/month
- Data transfer: ~$5-10/month
- **Total: ~$35-50/month**

### **Free Tier (First 12 months):**
- t2.micro is free (but too small for Docker)
- Consider using t2.micro for testing, t2.medium for production

### **Cost Optimization:**
- [ ] Stop EC2 when not needed (for demo/testing)
- [ ] Use Reserved Instances (if running 24/7)
- [ ] Enable auto-shutdown for non-prod environments

---

## 🐛 Common Issues & Solutions

### **Issue: Containers not starting**
```bash
docker-compose logs backend
docker-compose logs frontend
# Check for errors
```

### **Issue: Can't connect to frontend**
```bash
# Check if nginx is running
docker-compose exec frontend nginx -t

# Restart frontend
docker-compose restart frontend
```

### **Issue: Backend API errors**
```bash
# Check environment variables
docker-compose exec backend env

# Restart backend
docker-compose restart backend
```

### **Issue: GitHub Actions failing**
- Check if all secrets are set correctly
- Verify SSH key is complete (including header/footer)
- Check EC2 security group allows SSH from GitHub IPs

---

## 🎓 Quick Commands Reference

### **On EC2:**
```bash
# View running containers
docker-compose ps

# View logs
docker-compose logs -f

# Restart services
docker-compose restart

# Stop services
docker-compose down

# Start services
docker-compose up -d

# Update to latest images
docker-compose pull
docker-compose up -d

# Clean up unused resources
docker system prune -af
```

### **On Local Machine:**
```bash
# Build images
cd server && docker build -t himanshu0518/backend:latest .
cd client && docker build -t himanshu0518/frontend:latest .

# Push to Docker Hub
docker push himanshu0518/backend:latest
docker push himanshu0518/frontend:latest

# Deploy (push to GitHub)
git add .
git commit -m "deploy: update application"
git push origin main
```

---

## ✅ Final Verification

### **Application Health:**
- [ ] Frontend loads: `http://YOUR_EC2_IP`
- [ ] Products display correctly
- [ ] Can create account
- [ ] Can login
- [ ] Can add items to cart
- [ ] Can view favorites
- [ ] Search works
- [ ] All images load

### **CI/CD Health:**
- [ ] GitHub Actions workflow passes
- [ ] Auto-deployment works on git push
- [ ] Containers restart automatically
- [ ] No downtime during deployment

---

## 📝 Important Notes

### **EC2 Public IP Changes:**
- ⚠️ If you stop/start EC2, the public IP changes!
- Solution: Use **Elastic IP** (costs $0 if attached to running instance)
- Or: Use a domain name with Route 53

### **Keeping EC2 Running:**
- Your app only works when EC2 is running
- Stopping EC2 = App goes offline
- Start EC2 before demos/presentations

### **For College Project Demo:**
1. Keep EC2 running during evaluation period
2. Share the public IP or domain with evaluators
3. Have backup plan: Record video demo
4. Monitor during demo day

---

## 🎉 Success Criteria

Your deployment is successful when:
- ✅ Application accessible via EC2 public IP
- ✅ All features working correctly
- ✅ GitHub Actions deploys automatically
- ✅ Containers restart on failure
- ✅ Logs show no critical errors

---

## 📞 Need Help?

### **AWS Support:**
- AWS Documentation: https://docs.aws.amazon.com
- AWS Free Tier: https://aws.amazon.com/free

### **Docker Support:**
- Docker Docs: https://docs.docker.com
- Docker Compose: https://docs.docker.com/compose

### **GitHub Actions:**
- Actions Docs: https://docs.github.com/actions

---

**Deployment Date:** _________________  
**EC2 IP Address:** _________________  
**Domain (if any):** _________________  
**Status:** ⬜ In Progress  ⬜ Completed  ⬜ Testing  ⬜ Production

---

## 🎓 What You Learned

By completing this deployment, you've learned:
- ✅ AWS EC2 instance management
- ✅ Docker containerization
- ✅ Docker Compose orchestration
- ✅ CI/CD with GitHub Actions
- ✅ Linux server administration
- ✅ Production deployment practices



---

