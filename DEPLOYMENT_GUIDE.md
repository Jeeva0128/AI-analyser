# Resumate AI - Docker & VPS Deployment Guide

## 📋 Prerequisites

1. **GitHub Account** - Push code to GitHub
2. **VPS** - DigitalOcean, Linode, AWS EC2, or similar
3. **Domain** - Your Namecheap domain
4. **Docker** - Installed on VPS
5. **SSL Certificate** - Let's Encrypt (free)

---

## 🚀 Step-by-Step Deployment

### **1. Push to GitHub**

```powershell
cd "c:\Users\jeeva\OneDrive\Documents\AI reusme analyser"

# Initialize git if not already done
git init
git add .
git commit -m "Initial commit: Resumate AI"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/resumate-ai.git
git push -u origin main
```

---

### **2. Set Up VPS (Ubuntu 20.04 or 22.04)**

**SSH into your VPS:**
```bash
ssh root@YOUR_VPS_IP
```

**Install Docker & Docker Compose:**
```bash
# Update system
apt update && apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
curl -L https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Verify installations
docker --version
docker-compose --version
```

---

### **3. Clone Repository on VPS**

```bash
cd /home/ubuntu
git clone https://github.com/YOUR_USERNAME/resumate-ai.git
cd resumate-ai
```

---

### **4. Set Up SSL Certificate (Let's Encrypt)**

```bash
# Install Certbot
apt install certbot python3-certbot-nginx -y

# Generate certificate (replace with your domain)
certbot certonly --standalone \
  -d yourdomain.com \
  -d www.yourdomain.com

# Copy certificates to project directory
mkdir -p ssl
cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem ssl/cert.pem
cp /etc/letsencrypt/live/yourdomain.com/privkey.pem ssl/key.pem
chmod 644 ssl/cert.pem ssl/key.pem
```

---

### **5. Configure Environment Variables**

Create `.env` file in project root:

```bash
cat > .env << EOF
GEMINI_API_KEY=your_gemini_api_key_here
NODE_ENV=production
VITE_API_URL=https://yourdomain.com/api
EOF
```

**Create `.env` for backend too:**

```bash
cat > backend/.env << EOF
GEMINI_API_KEY=your_gemini_api_key_here
NODE_ENV=production
PORT=5000
EOF
```

---

### **6. Configure Namecheap Domain DNS**

1. Log in to Namecheap
2. Go to **Domain List** → **Manage**
3. Go to **Advanced DNS** tab
4. Add/Update DNS Records:

```
Type: A Record
Name: @
Value: YOUR_VPS_IP
TTL: 30 minutes

Type: A Record
Name: www
Value: YOUR_VPS_IP
TTL: 30 minutes
```

**Wait 5-10 minutes for DNS to propagate**

---

### **7. Update Nginx Configuration**

Edit `nginx.conf` and replace certificate paths if needed:

```nginx
ssl_certificate /etc/nginx/ssl/cert.pem;
ssl_certificate_key /etc/nginx/ssl/key.pem;
```

---

### **8. Build and Start Containers**

```bash
cd /home/ubuntu/resumate-ai

# Build images
docker-compose build

# Start services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

---

### **9. Set Up Auto-Renewal for SSL**

```bash
# Create renewal script
cat > /usr/local/bin/renew-cert.sh << 'EOF'
#!/bin/bash
certbot renew --quiet
cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem /home/ubuntu/resumate-ai/ssl/cert.pem
cp /etc/letsencrypt/live/yourdomain.com/privkey.pem /home/ubuntu/resumate-ai/ssl/key.pem
docker-compose -f /home/ubuntu/resumate-ai/docker-compose.yml restart nginx
EOF

chmod +x /usr/local/bin/renew-cert.sh

# Add to crontab (renew every month)
crontab -e
# Add this line:
# 0 0 1 * * /usr/local/bin/renew-cert.sh
```

---

### **10. Set Up CI/CD with GitHub Actions**

1. Go to GitHub repo → **Settings** → **Secrets and variables** → **Actions**
2. Add these secrets:
   - `VPS_HOST` = Your VPS IP
   - `VPS_USER` = ubuntu (or your SSH user)
   - `VPS_DEPLOY_KEY` = Your private SSH key contents
   - `GEMINI_API_KEY` = Your API key

**Generate SSH key (on VPS):**
```bash
ssh-keygen -t ed25519 -f ~/.ssh/deploy_key -N ""
cat ~/.ssh/deploy_key.pub >> ~/.ssh/authorized_keys
cat ~/.ssh/deploy_key  # Copy this to GitHub secret
```

---

## 📊 Monitoring & Maintenance

**Check container status:**
```bash
docker-compose ps
docker-compose logs -f backend
docker-compose logs -f frontend
```

**Restart services:**
```bash
docker-compose restart
```

**Deploy updates:**
```bash
cd /home/ubuntu/resumate-ai
git pull origin main
docker-compose up -d --build
```

**View disk usage:**
```bash
docker system df
docker system prune  # Clean up unused images/containers
```

---

## 🔒 Security Checklist

- ✅ SSL/TLS enabled
- ✅ Environment variables in `.env` (not in code)
- ✅ SSH key-based auth for VPS
- ✅ Firewall rules configured
- ✅ Regular backups of uploads folder

**Enable firewall:**
```bash
ufw enable
ufw allow 22/tcp   # SSH
ufw allow 80/tcp   # HTTP
ufw allow 443/tcp  # HTTPS
ufw status
```

---

## 🆘 Troubleshooting

**Port already in use:**
```bash
sudo lsof -i :3000
sudo kill -9 PID
```

**Container won't start:**
```bash
docker-compose logs backend
docker-compose logs frontend
```

**SSL certificate issues:**
```bash
certbot certificates
certbot renew --dry-run
```

**Clear everything and restart:**
```bash
docker-compose down -v
docker system prune -a
docker-compose up -d --build
```

---

## 📈 Next Steps

1. ✅ Push to GitHub
2. ✅ Set up VPS with Docker
3. ✅ Configure DNS on Namecheap
4. ✅ Deploy with docker-compose
5. ✅ Set up GitHub Actions for auto-deploy
6. ✅ Monitor and maintain

Your app is now production-ready! 🎉

