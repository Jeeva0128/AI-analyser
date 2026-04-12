# 🚀 PRODUCTION DEPLOYMENT: Azure + NGINX + Custom Domain

This guide walks you through deploying your resume analyzer to **enterprise-grade infrastructure** on Microsoft Azure with NGINX, SSL/HTTPS, and a custom domain.

---

## 📋 Architecture Overview

```
User → Vercel (Frontend)
         ↓
      HTTPS (SSL/TLS)
         ↓
    [Your Domain] → Azure VM
         ↓
      NGINX (Reverse Proxy, HTTP→HTTPS redirect)
         ↓
      Node.js App (Backend API)
         ↓
      Gemini API (Google)
```

### Why This Architecture?
- **Vercel Frontend:** Cost-effective, auto-scaling CDN, free tier available
- **Azure VM Backend:** Full control, custom domain, professional SSL
- **NGINX:** High-performance reverse proxy, automatic HTTP→HTTPS redirect
- **Let's Encrypt:** Free, automated SSL certificates
- **Namecheap Domain:** Cheap, reliable domain registrar

---

## 💰 Cost Breakdown

| Service | Cost | Notes |
|---------|------|-------|
| **Azure VM (B1s)** | ~$15-20/month | Cheapest, handles 10K+ requests/month |
| **Azure VM (B2s)** | ~$40-50/month | For higher traffic |
| **Static IP** | $2-3/month | Required for DNS A record |
| **Vercel Frontend** | FREE | Generously free tier |
| **Let's Encrypt SSL** | FREE | Automatic renewal |
| **Namecheap Domain** | $0.98-10/year | Cheap domain registration |
| **Gemini API** | FREE | 1,500 req/day free |
| **TOTAL MONTHLY** | **~$20-25** | Production-grade hosting! |

---

## 📝 Prerequisites

### Before You Start
- [ ] Git installed and configured
- [ ] Valid Namecheap account
- [ ] Valid Azure account (free trial gives $200 credit)
- [ ] SSH client (Windows: use PowerShell or PuTTY)
- [ ] Code up-to-date and tested locally
- [ ] Gemini API key ready

### Software You'll Need
- NGINX (runs on Azure VM)
- Node.js (already on VM with our setup)
- Certbot (for SSL certificates)
- UFW (firewall)

---

## 🎯 6-Step Deployment Plan

1. **Setup Azure VM** (10 min)
2. **Configure Firewall & SSH** (5 min)
3. **Deploy Backend to VM** (10 min)
4. **Setup NGINX Reverse Proxy** (10 min)
5. **Install SSL Certificate** (5 min)
6. **Configure Domain DNS** (5 min)

**Total Time:** ~45 minutes for production deployment!

---

## Step 1️⃣: Create Azure VM

### 1.1 Create Resource Group

1. Go to [Azure Portal](https://portal.azure.com)
2. Click **Resource Groups** → **Create**
3. Enter:
   - **Resource Group Name:** `resume-analyzer-rg`
   - **Region:** `East US` (or closest to your users)
4. Click **Review + Create** → **Create**

### 1.2 Create Virtual Machine

1. Click **Create a resource** → Search **Virtual Machine**
2. Click **Create**

3. **Fill Basic Tab:**
   - **VM Name:** `resume-analyzer-backend`
   - **Region:** Same as resource group
   - **Image:** `Ubuntu 22.04 LTS` (recommended)
   - **Size:** `B1s` (cheapest, sufficient for your use case)
   - **Username:** `azureuser`
   - **Key Pair Name:** `resume-analyzer-key`

4. **Download SSH Key**
   - Azure will prompt to generate/download key pair
   - Save `resume-analyzer-key.pem` somewhere safe
   - ⚠️ **Never share this file!**

5. **Networking Tab:**
   - Create new Virtual Network: `resume-analyzer-vnet`
   - Subnet: `default`
   - Public IP: Create new (we'll use this for DNS)
   - NIC Network Security Group: Create new
   
6. Click **Create**
   - Wait 5-10 minutes for VM to deploy

### 1.3 Get Your VM's Public IP

1. Once created, go to **Virtual Machines**
2. Click your VM name `resume-analyzer-backend`
3. Copy the **Public IP address** (e.g., `40.123.456.789`)
4. Save this! You'll need it soon.

---

## Step 2️⃣: Configure Firewall & SSH Access

### 2.1 Open Firewall Ports

In Azure Portal, go to your VM → **Networking** → **Add inbound rule:**

| Port | Protocol | Source | Action | Name |
|------|----------|--------|--------|------|
| 22 | TCP | Your IP* | Allow | SSH Access |
| 80 | TCP | Any | Allow | HTTP |
| 443 | TCP | Any | Allow | HTTPS |
| 5000 | TCP | Any | Deny | Block direct backend (use NGINX) |

*For SSH: Find your public IP at whatismyipaddress.com and use that instead of "Any"

### 2.2 Connect via SSH

**Windows PowerShell:**
```powershell
# Navigate to folder with resume-analyzer-key.pem
cd C:\path\to\keys\

# Fix permissions (required on Windows)
icacls "resume-analyzer-key.pem" /inheritance:r /grant:r "$($env:USERNAME):(F)"

# Connect to VM
ssh -i "resume-analyzer-key.pem" azureuser@YOUR_PUBLIC_IP

# Example:
# ssh -i "resume-analyzer-key.pem" azureuser@40.123.456.789
```

**macOS/Linux:**
```bash
chmod 600 ~/path/to/resume-analyzer-key.pem
ssh -i ~/path/to/resume-analyzer-key.pem azureuser@YOUR_PUBLIC_IP
```

If successful, you'll see: `azureuser@resume-analyzer-backend:~$`

---

## Step 3️⃣: Deploy Backend to Azure VM

### 3.1 Update Backend Configuration

Your backend needs to know it's in production. Update `backend/.env`:

```env
NODE_ENV=production
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
FRONTEND_URL=https://your-domain.com
```

Also update CORS in `backend/server.js`:

```javascript
const allowedOrigins = [
  'http://localhost:5173',    // Local dev
  'http://localhost:5174',    // Local dev
  'https://your-domain.com',  // Your custom domain
  'https://www.your-domain.com',
  'https://your-app.vercel.app' // Keep Vercel for now
].filter(Boolean);
```

### 3.2 Deploy Code to VM

While SSH'd into the VM:

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 (process manager - keeps backend running)
sudo npm install -g pm2

# Clone your repository
git clone https://github.com/YOUR_USERNAME/ai-resume-analyzer.git
cd ai-resume-analyzer

# Install backend dependencies
cd backend
npm install

# Start with PM2 (auto-restart on failure)
pm2 start server.js --name "resume-api" --env production
pm2 startup
pm2 save

# Verify running
pm2 status
```

**Verify Backend Running:**
```bash
curl http://localhost:5000/api/health
# Should see: {"status":"Backend is running 🚀", ...}
```

---

## Step 4️⃣: Setup NGINX Reverse Proxy

### 4.1 Install NGINX

```bash
sudo apt install -y nginx

# Start NGINX
sudo systemctl start nginx
sudo systemctl enable nginx

# Verify
sudo systemctl status nginx
```

### 4.2 Configure NGINX

Create NGINX config:

```bash
sudo nano /etc/nginx/sites-available/resume-analyzer
```

Paste this config:

```nginx
# Redirect HTTP → HTTPS
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    return 301 https://$server_name$request_uri;
}

# HTTPS server
server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    # SSL certificates (we'll add these in Step 5)
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # Strong SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Gzip compression (faster)
    gzip on;
    gzip_types text/plain application/json application/javascript;
    gzip_min_length 1000;

    # API proxy
    location /api {
        # Forward to backend
        proxy_pass http://localhost:5000;
        
        # Preserve headers
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeouts (important for uploads)
        proxy_connect_timeout 60s;
        proxy_send_timeout 300s;
        proxy_read_timeout 300s;
        
        # Buffer sizes for uploads
        client_max_body_size 10M;
        proxy_buffering off;
    }

    # Health check
    location /health {
        access_log off;
        proxy_pass http://localhost:5000;
    }

    # Default (should redirect to Vercel frontend)
    location / {
        return 301 https://your-app.vercel.app;
    }
}
```

Then:

```bash
# Enable config
sudo ln -s /etc/nginx/sites-available/resume-analyzer /etc/nginx/sites-enabled/

# Test config syntax
sudo nginx -t

# Reload NGINX
sudo systemctl reload nginx
```

---

## Step 5️⃣: Install SSL Certificate (Let's Encrypt)

### 5.1 Install Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 5.2 Get Certificate

```bash
sudo certbot certonly --standalone \
  -d your-domain.com \
  -d www.your-domain.com \
  -m your-email@example.com \
  --agree-tos \
  --non-interactive
```

**Or interactive:**
```bash
sudo certbot certonly --standalone \
  -d your-domain.com \
  -d www.your-domain.com
```

### 5.3 Auto-Renewal

```bash
# Test renewal
sudo certbot renew --dry-run

# Enable auto-renewal
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

### 5.4 Reload NGINX with SSL

```bash
sudo systemctl reload nginx

# Verify HTTPS
curl https://your-domain.com/api/health
```

---

## Step 6️⃣: Configure Domain DNS

### 6.1 Get Your VM's Static IP

**In Azure Portal:**
1. Go to VM → **Networking**
2. Go to **Public IP address**
3. Click the IP resource
4. Go to **Configuration**
5. Change **Assignment** to **Static**
6. Click **Save**
7. Copy the **IP address** (e.g., `40.123.456.789`)

### 6.2 Update Namecheap DNS

1. Go to [Namecheap Dashboard](https://www.namecheap.com/myaccount/login.aspx)
2. Click **Domain List** → Your domain
3. Click **Manage**
4. Go to **DNS** tab

5. Update/Add A Records:

| Type | Host | Value | TTL |
|------|------|-------|-----|
| A | @ | YOUR_VM_IP | 3600 |
| A | www | YOUR_VM_IP | 3600 |
| CNAME | * | your-domain.com | 3600 |

Example:
```
@ (root) → A → 40.123.456.789
www → A → 40.123.456.789
```

### 6.3 Wait for DNS Propagation

DNS changes take 24-48 hours to fully propagate. You can check:

```bash
# Check A record
nslookup your-domain.com

# Check all records
nslookup -type=ANY your-domain.com
```

During propagation, test with your IP directly:

```bash
curl https://40.123.456.789/api/health
```

---

## 🧪 Testing Your Production Deployment

### Test 1: Backend Health
```bash
# After DNS propagates
curl https://your-domain.com/api/health

# Expected:
# {"status":"Backend is running 🚀", ...}
```

### Test 2: Upload Endpoint
```bash
# Create a test request
curl -X POST https://your-domain.com/api/resume/upload \
  -F "resume=@resume.pdf" \
  -H "Authorization: Bearer test"
```

### Test 3: Check HTTPS with Browser
1. Go to `https://your-domain.com/api/health`
2. Check for green lock icon 🔒
3. Click lock → Details → Certificate should show Let's Encrypt

### Test 4: Update Frontend

Update your Vercel frontend env var:

```env
VITE_API_URL=https://your-domain.com/api
```

Redeploy Vercel and test upload!

---

## 🛡️ Security Best Practices Implemented

✅ **HTTPS/TLS** - All traffic encrypted  
✅ **Firewall** - Only ports 22, 80, 443 open  
✅ **SSH Key Auth** - No password logins  
✅ **CORS** - Only specified domains allowed  
✅ **Security Headers** - HSTS, X-Frame-Options, etc  
✅ **Rate Limiting** - In backend middleware  
✅ **Input Validation** - Multer file validation  
✅ **Auto-renewal SSL** - Certbot handles renewal  

---

## 📊 Monitoring & Maintenance

### Check Backend Status
```bash
ssh -i key.pem azureuser@YOUR_IP
pm2 status
pm2 logs
```

### View Real-Time Logs
```bash
pm2 logs resume-api --lines 100 --follow
```

### Restart Backend
```bash
pm2 restart resume-api
pm2 stop resume-api
pm2 start resume-api
```

### Check Disk Space
```bash
df -h
du -sh ~/ai-resume-analyzer
```

### Update Application
```bash
cd ~/ai-resume-analyzer
git pull origin main
cd backend
npm install
pm2 restart resume-api
```

---

## 🚨 Troubleshooting

### NGINX Errors
```bash
# Test syntax
sudo nginx -t

# Check errors
sudo systemctl status nginx
sudo journalctl -u nginx -n 20
```

### SSL Certificate Issues
```bash
# Check certificate expiration
sudo certbot certificates

# Manual renewal
sudo certbot renew --force-renewal

# Check renewal logs
sudo journalctl -u certbot.timer -n 20
```

### Backend Down
```bash
# Check if running
pm2 status

# Restart
pm2 restart resume-api

# Check logs
pm2 logs resume-api
```

### DNS Not Working
```bash
# Flush DNS cache
ipconfig /flushdns  # Windows
sudo dscacheutil -flushcache  # macOS

# Check DNS records
nslookup your-domain.com
dig your-domain.com
```

---

## 📈 Scaling in the Future

### Option 1: Upgrade VM Size
- Current: B1s ($15/mo)
- Need more power? → B2s ($40/mo) or B4ms ($150/mo)

### Option 2: Azure App Service (Optional)
- Managed service (no SSH needed)
- Auto-scaling
- Better for teams

### Option 3: Load Balancing
- Multiple VMs behind load balancer
- For 1M+ requests/month

---

## 💡 Pro Tips

1. **Backup Your SSH Key** - Store in secure password manager
2. **Monitor Azure Costs** - Set billing alerts
3. **Use Azure Monitor** - Track CPU, memory, disk usage
4. **Daily Updates** - `sudo apt update && sudo apt upgrade`
5. **Logs Are Your Friend** - Always check logs when debugging

---

## ✅ Deployment Checklist

- [ ] Azure Resource Group created
- [ ] Ubuntu 22.04 LTS VM created
- [ ] SSH key downloaded and secured
- [ ] Firewall rules configured (22, 80, 443)
- [ ] SSH connection working
- [ ] Node.js installed
- [ ] PM2 installed and configured
- [ ] Backend code cloned and running
- [ ] PM2 auto-startup enabled
- [ ] NGINX installed
- [ ] NGINX config created and validated
- [ ] Let's Encrypt certificate obtained
- [ ] NGINX reloaded with SSL
- [ ] Azure VM Public IP set to Static
- [ ] DNS A records updated (@ and www)
- [ ] DNS propagation verified
- [ ] HTTPS connection works
- [ ] Frontend VITE_API_URL updated
- [ ] End-to-end upload test successful
- [ ] Monitoring/alerts configured (optional)

---

## 🎉 You're Done!

Your resume analyzer is now running on **enterprise-grade infrastructure** with:
- ✅ Professional custom domain (your-domain.com)
- ✅ Enterprise SSL/HTTPS encryption
- ✅ Production-ready NGINX proxy
- ✅ Auto-renewing certificates
- ✅ Strong security headers
- ✅ Scalable architecture
- ✅ ~$20/month cost

This is the same architecture used by millions of companies! 🚀

---

## 📚 Reference Documentation

- [Azure VM Documentation](https://docs.microsoft.com/azure/virtual-machines/)
- [NGINX Documentation](https://nginx.org/en/docs/)
- [Let's Encrypt](https://letsencrypt.org/)
- [Certbot](https://certbot.eff.org/)
- [Namecheap DNS](https://www.namecheap.com/support/knowledgebase/article.aspx/9302/2208/how-do-i-use-basic-dns)

