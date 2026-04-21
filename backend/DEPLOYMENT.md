# DEPLOYMENT & PRODUCTION GUIDE

Complete guide to deploy your Rental Services backend to production.

## 📋 Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] MongoDB Atlas cluster created
- [ ] JWT_SECRET changed to secure random string
- [ ] CORS CLIENT_URL updated to production domain
- [ ] NODE_ENV set to production
- [ ] All dependencies installed
- [ ] Code tested locally
- [ ] Error logs reviewed
- [ ] Security headers configured

---

## 🔐 Security Hardening

### 1. Generate Secure JWT Secret

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Output example:
```
a7f8e9c3d2b1a4f6e8d9c2b1a5f7e9d0c3b2a1f8e7d6c5b4a3f2e1d0c9b8a7
```

### 2. Update Production .env

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/rental-services?retryWrites=true&w=majority

# Security
JWT_SECRET=a7f8e9c3d2b1a4f6e8d9c2b1a5f7e9d0c3b2a1f8e7d6c5b4a3f2e1d0c9b8a7
JWT_EXPIRE=7d

# Server
PORT=5000
NODE_ENV=production

# Frontend
CLIENT_URL=https://yourdomain.com

# Optional: SSL/TLS
# USE_HTTPS=true
# CERT_PATH=/path/to/cert.pem
# KEY_PATH=/path/to/key.pem
```

### 3. MongoDB Atlas Security

1. Create dedicated MongoDB user (not root)
2. Set strong password
3. Whitelist only your server IP
4. Enable encryption in transit
5. Use connection string with SSL

### 4. Rate Limiting Configuration

The backend includes built-in rate limiting:
- General: 100 requests/15 min
- Auth: 5 attempts/15 min
- Create: 30/hour

Adjust in `middlewares/rateLimitMiddleware.js` if needed.

---

## 🚀 Deployment Options

### Option 1: Heroku Deployment

#### Prerequisites:
- Heroku account
- Heroku CLI installed

#### Steps:

```bash
# Login to Heroku
heroku login

# Create app
heroku create rental-services-api

# Set environment variables
heroku config:set \
  MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/rental-services \
  JWT_SECRET=your_secure_secret_here \
  NODE_ENV=production \
  CLIENT_URL=https://yourdomain.com

# Deploy
git push heroku main

# Check logs
heroku logs --tail
```

#### Procfile (create in root directory):
```
web: node server.js
```

---

### Option 2: DigitalOcean Deployment

#### Prerequisites:
- DigitalOcean account
- Droplet created (Ubuntu 20.04+)

#### Steps:

```bash
# Connect to droplet
ssh root@YOUR_DROPLET_IP

# Update system
apt update && apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install -y nodejs

# Install Git
apt install -y git

# Clone repository
cd /var/www
git clone https://github.com/yourusername/rental-services.git
cd rental-services/backend

# Install dependencies
npm install --production

# Create .env file
nano .env
# Add your production configuration

# Install PM2 (process manager)
npm install -g pm2

# Start with PM2
pm2 start server.js --name "rental-api"
pm2 startup
pm2 save

# Install Nginx
apt install -y nginx

# Configure Nginx
nano /etc/nginx/sites-available/default
```

#### Nginx Configuration:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### Enable SSL with Let's Encrypt:
```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

### Option 3: AWS EC2 Deployment

#### Prerequisites:
- AWS account
- EC2 instance (t2.micro for starter)
- Security group configured

#### Steps:

```bash
# Connect to instance
ssh -i your-key.pem ec2-user@your-instance-ip

# Update system
sudo yum update -y

# Install Node.js
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Install Git & Clone
sudo yum install -y git
cd /home/ec2-user
git clone https://github.com/yourusername/rental-services.git
cd rental-services/backend

# Setup
npm install --production

# Create .env with production settings
nano .env

# Install & start with PM2
npm install -g pm2
pm2 start server.js --name "rental-api"

# Install Nginx
sudo yum install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

---

### Option 4: Docker Deployment

#### Create Dockerfile:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["node", "server.js"]
```

#### Create docker-compose.yml:

```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "5000:5000"
    environment:
      - MONGODB_URI=mongodb://mongo:27017/rental-services
      - JWT_SECRET=${JWT_SECRET}
      - NODE_ENV=production
      - CLIENT_URL=${CLIENT_URL}
    depends_on:
      - mongo

  mongo:
    image: mongo:5.0
    volumes:
      - mongo_data:/data/db
    environment:
      - MONGO_INITDB_DATABASE=rental-services

volumes:
  mongo_data:
```

#### Build and deploy:

```bash
docker-compose build
docker-compose up -d
```

---

## 📊 Monitoring & Logging

### PM2 Monitoring

```bash
# View logs
pm2 logs rental-api

# Monitor in real-time
pm2 monit

# View details
pm2 describe rental-api
```

### Application Logging

Add this to `server.js`:

```javascript
import fs from 'fs';

// Create log directory
if (!fs.existsSync('logs')) {
  fs.mkdirSync('logs');
}

// Log all requests
app.use((req, res, next) => {
  const log = `${new Date().toISOString()} - ${req.method} ${req.path}\n`;
  fs.appendFileSync('logs/requests.log', log);
  next();
});

// Log errors
process.on('unhandledRejection', (err) => {
  fs.appendFileSync('logs/errors.log', err.stack + '\n');
});
```

---

## 🔄 CI/CD Pipeline (GitHub Actions)

#### Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2

      - name: Install dependencies
        run: |
          cd backend
          npm install

      - name: Run tests (if available)
        run: |
          cd backend
          npm test

      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /var/www/rental-services/backend
            git pull origin main
            npm install --production
            pm2 restart rental-api
```

---

## 📈 Performance Optimization

### 1. Database Indexing (Already configured)

Models have indexes on frequently queried fields:
- Rental: `category`, `location`, `owner`
- Booking: `user`, `rental`, `status`

### 2. Response Caching

```javascript
import redis from 'redis';

const redisClient = redis.createClient({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
});

// Cache rentals
app.get('/api/rentals', async (req, res) => {
  const cacheKey = `rentals:${JSON.stringify(req.query)}`;
  
  const cached = await redisClient.get(cacheKey);
  if (cached) return res.json(JSON.parse(cached));
  
  // Fetch and cache
  const data = await getRentals(req.query);
  await redisClient.setex(cacheKey, 3600, JSON.stringify(data));
  
  res.json(data);
});
```

### 3. Connection Pooling

MongoDB connection pooling is already configured in `config/database.js`.

### 4. Image Optimization

Use external CDN for images:
```env
CDN_URL=https://cdn.yourdomain.com
```

---

## 🔍 Health Check Endpoint

Already implemented at:
```
GET /api/health
```

Monitor with:
```bash
curl http://your-domain.com/api/health
```

---

## 📞 Backup Strategy

### Daily Database Backup

```bash
# Backup MongoDB
mongodump --uri="mongodb+srv://user:pass@cluster.mongodb.net/rental-services" \
  --out=/backups/$(date +%Y%m%d)

# Cloud backup (AWS S3)
aws s3 cp /backups/ s3://your-bucket/backups/ --recursive
```

### Automated Backup Script

```bash
#!/bin/bash
# backup.sh

BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)

mongodump --uri="$MONGODB_URI" --out="$BACKUP_DIR/backup_$DATE"

# Upload to S3
aws s3 cp "$BACKUP_DIR/backup_$DATE" \
  "s3://your-bucket/backups/" --recursive

# Keep only last 30 days
find $BACKUP_DIR -mtime +30 -exec rm -rf {} \;
```

Add to crontab:
```bash
crontab -e
# Add: 0 2 * * * /path/to/backup.sh (Daily at 2 AM)
```

---

## 🚨 Troubleshooting Deployment

### Issue: Connection Timeout

```bash
# Check MongoDB URI
echo $MONGODB_URI

# Test connection
mongo "$MONGODB_URI"
```

### Issue: CORS Errors in Production

Update `.env`:
```env
CLIENT_URL=https://yourdomain.com
```

### Issue: Out of Memory

Increase Node.js heap:
```bash
node --max-old-space-size=2048 server.js
```

### Issue: Port Already in Use

```bash
# Find process using port 5000
lsof -i :5000

# Kill process
kill -9 <PID>
```

---

## 📊 Production Metrics

Monitor these metrics:
- API response time (target: <200ms)
- Error rate (target: <0.1%)
- Database query time (target: <50ms)
- Uptime (target: >99.9%)

---

## 🔄 Rollback Plan

If deployment fails:

```bash
# With PM2
pm2 restart rental-api

# With Git
git revert <commit>
git push origin main

# Restart application
pm2 restart rental-api
```

---

## ✅ Post-Deployment Verification

```bash
# Health check
curl https://api.yourdomain.com/api/health

# Test authentication
curl -X POST https://api.yourdomain.com/api/auth/login \
  -d '{"email":"test@example.com","password":"test"}' \
  -H "Content-Type: application/json"

# Test rentals endpoint
curl https://api.yourdomain.com/api/rentals

# Check response times
curl -w "%{time_total}\n" https://api.yourdomain.com/api/rentals
```

---

## 📞 Support & Help

For deployment issues:
1. Check `/logs` directory
2. Review PM2 logs: `pm2 logs`
3. Check MongoDB connection
4. Verify environment variables
5. Review error responses

---

**Congratulations! Your backend is production-ready! 🎉**
