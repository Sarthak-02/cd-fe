# Troubleshooting Guide

Common issues and their solutions when deploying to GCP App Engine.

## Table of Contents
- [Setup Issues](#setup-issues)
- [Build Issues](#build-issues)
- [Deployment Issues](#deployment-issues)
- [Runtime Issues](#runtime-issues)
- [Performance Issues](#performance-issues)
- [Configuration Issues](#configuration-issues)

---

## Setup Issues

### ❌ "gcloud: command not found"

**Problem**: Google Cloud SDK is not installed.

**Solution**:
```bash
# macOS/Linux
curl https://sdk.cloud.google.com | bash
exec -l $SHELL

# Or download from:
# https://cloud.google.com/sdk/docs/install
```

### ❌ "No project is set"

**Problem**: GCP project not configured.

**Solution**:
```bash
# List available projects
gcloud projects list

# Set project
gcloud config set project YOUR_PROJECT_ID

# Verify
gcloud config get-value project
```

### ❌ "App Engine is not initialized"

**Problem**: App Engine not created in project.

**Solution**:
```bash
# Initialize App Engine
gcloud app create --region=us-central

# List available regions
gcloud app regions list
```

### ❌ "API not enabled"

**Problem**: Required APIs are not enabled.

**Solution**:
```bash
# Enable App Engine API
gcloud services enable appengine.googleapis.com

# Enable Cloud Build API
gcloud services enable cloudbuild.googleapis.com

# Verify
gcloud services list --enabled
```

---

## Build Issues

### ❌ "npm: command not found"

**Problem**: Node.js/npm is not installed.

**Solution**:
```bash
# macOS with Homebrew
brew install node

# Or download from https://nodejs.org

# Verify
node --version
npm --version
```

### ❌ Build fails with "Cannot find module"

**Problem**: Dependencies not installed.

**Solution**:
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Or use cache
npm ci
```

### ❌ "Out of memory" during build

**Problem**: Build process consuming too much memory.

**Solution**:
```bash
# Increase Node.js memory
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build

# Or add to package.json
"build": "NODE_OPTIONS='--max-old-space-size=4096' vite build"
```

### ❌ Vite build fails

**Problem**: Vite configuration or dependency issues.

**Solution**:
```bash
# Clear Vite cache
rm -rf node_modules/.vite
npm run build

# Check for conflicting dependencies
npm ls

# Update dependencies
npm update
```

---

## Deployment Issues

### ❌ "Permission denied"

**Problem**: Insufficient permissions.

**Solution**:
```bash
# Check current account
gcloud auth list

# Re-authenticate
gcloud auth login

# Check IAM permissions
gcloud projects get-iam-policy YOUR_PROJECT_ID

# Required roles:
# - App Engine Admin
# - Service Account User
# - Storage Admin
# - Cloud Build Editor
```

### ❌ "Service already exists"

**Problem**: Service name conflict.

**Solution**:
- If updating: This is normal, ignore warning
- If creating new: Change service name in `app.yaml`

```yaml
service: control-desk-web-v2  # Use different name
```

### ❌ "Deployment quota exceeded"

**Problem**: Too many deployments in short time.

**Solution**:
```bash
# Wait 10-15 minutes
# Or delete unused versions
gcloud app versions list --service=control-desk-web
gcloud app versions delete OLD_VERSION --service=control-desk-web
```

### ❌ "Build failed" during deployment

**Problem**: Cloud Build failure.

**Solution**:
```bash
# Check build logs
gcloud app logs read --service=default --limit=100

# Test build locally
npm run build

# Check cloudbuild.yaml syntax
cat cloudbuild.yaml

# Try deploying with verbose output
gcloud app deploy --verbosity=debug
```

### ❌ "App Engine could not find your app.yaml"

**Problem**: Wrong directory or missing file.

**Solution**:
```bash
# Check current directory
pwd

# List files
ls -la

# Should see app.yaml
# If not, cd to correct directory
cd /path/to/control-desk-web

# Then deploy
gcloud app deploy
```

---

## Runtime Issues

### ❌ "502 Bad Gateway" or "503 Service Unavailable"

**Problem**: Application not starting or crashing.

**Solution**:
```bash
# Check logs immediately
gcloud app logs tail -s control-desk-web

# Common causes:
# 1. Port issue (must use PORT environment variable)
# 2. Missing dependencies
# 3. Build artifacts not present

# Verify server.js uses PORT correctly:
# const PORT = process.env.PORT || 8080;

# Check if dist folder exists in deployment
gcloud app instances describe INSTANCE_ID --service=control-desk-web
```

### ❌ "Cannot GET /" or blank page

**Problem**: Static files not being served correctly.

**Solution**:
```bash
# Verify dist folder exists locally
ls -la dist/

# Should contain index.html and assets
# If missing:
npm run build

# Check server.js path
# Should serve from 'dist' folder

# Verify routes in server.js
# app.use(express.static(path.join(__dirname, 'dist')));
```

### ❌ API calls failing (CORS errors)

**Problem**: Backend API not configured for CORS.

**Solution**:
1. Configure CORS on backend API
2. Allow your App Engine domain
3. Include credentials if needed

```javascript
// Backend (Express example)
app.use(cors({
  origin: 'https://YOUR_APP_ENGINE_URL.com',
  credentials: true
}));
```

### ❌ "Failed to fetch" errors

**Problem**: API endpoint incorrect or unreachable.

**Solution**:
```bash
# Check environment variable in app.yaml
cat app.yaml | grep VITE_API_BASE_URL

# Update if needed
env_variables:
  VITE_API_BASE_URL: 'https://your-actual-api.com/api'

# Redeploy
gcloud app deploy
```

### ❌ Google Maps not loading

**Problem**: API key missing or restricted.

**Solution**:
1. Verify API key in environment variables
2. Check API key restrictions in Google Cloud Console
3. Ensure Maps JavaScript API is enabled
4. Add App Engine domain to allowed referrers

```bash
# Check current env vars
gcloud app describe --service=control-desk-web

# Update app.yaml
env_variables:
  VITE_GOOGLE_MAPS_API_KEY: 'your_key'
```

---

## Performance Issues

### ❌ Slow response times

**Problem**: Instance warming up or under-provisioned.

**Solution**:
```yaml
# In app.yaml, increase min_instances
automatic_scaling:
  min_instances: 2  # Keep warm instances

# Or use larger instance class
instance_class: F2
```

### ❌ High latency during cold starts

**Problem**: No warm instances available.

**Solution**:
```yaml
# Set minimum instances to avoid cold starts
automatic_scaling:
  min_instances: 1
  
# Adjust pending latency
  min_pending_latency: 30ms
  max_pending_latency: 100ms
```

### ❌ "Exceeded memory limit"

**Problem**: Application using too much memory.

**Solution**:
```yaml
# Use larger instance class
instance_class: F2  # 512MB instead of F1's 256MB
# Or F4: 1GB
```

---

## Configuration Issues

### ❌ Environment variables not working

**Problem**: Variables not being passed correctly.

**Solution**:
```yaml
# In app.yaml
env_variables:
  NODE_ENV: 'production'
  VITE_API_BASE_URL: 'https://api.example.com'

# Important: Vite variables must start with VITE_
# They're embedded at BUILD time, not runtime
```

### ❌ Changes not reflected after deployment

**Problem**: Cached version being served.

**Solution**:
```bash
# Clear browser cache
# Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)

# Or verify correct version is deployed
gcloud app versions list --service=control-desk-web

# Check if traffic is going to new version
gcloud app services describe control-desk-web
```

### ❌ "Cannot find module 'express'"

**Problem**: Express not in production dependencies.

**Solution**:
```bash
# Verify package.json
cat package.json | grep express

# Should be in dependencies, NOT devDependencies
# If missing:
npm install express --save

# Redeploy
gcloud app deploy
```

---

## Diagnostic Commands

### Check Deployment Status
```bash
# Service status
gcloud app services list

# Version status
gcloud app versions list --service=control-desk-web

# Instance status
gcloud app instances list --service=control-desk-web

# Current traffic allocation
gcloud app services describe control-desk-web
```

### View Logs
```bash
# Real-time logs
gcloud app logs tail -s control-desk-web

# Last 100 lines
gcloud app logs read -s control-desk-web --limit=100

# Errors only
gcloud app logs read -s control-desk-web --level=error --limit=50

# Specific time range
gcloud app logs read -s control-desk-web \
  --limit=100 \
  --format="table(timestamp,message)" \
  --filter="timestamp>=2026-02-17T10:00:00"
```

### Health Checks
```bash
# Get service URL
SERVICE_URL=$(gcloud app browse -s control-desk-web --no-launch-browser)

# Test health endpoint
curl $SERVICE_URL/health

# Test main page
curl -I $SERVICE_URL
```

### Debug Build Locally
```bash
# Clean build
rm -rf dist node_modules
npm install
npm run build

# Verify build output
ls -la dist/

# Test locally
npm start

# Visit http://localhost:8080
```

---

## Emergency Procedures

### Immediate Rollback
```bash
./rollback.sh

# Or manually:
gcloud app services set-traffic control-desk-web \
  --splits=PREVIOUS_VERSION=1
```

### Stop All Traffic
```bash
# Stop current version
CURRENT_VERSION=$(gcloud app versions list \
  --service=control-desk-web \
  --filter="traffic_split>0" \
  --format="value(version.id)")

gcloud app versions stop $CURRENT_VERSION --service=control-desk-web
```

### View Recent Errors
```bash
# Last 50 errors
gcloud app logs read \
  --service=control-desk-web \
  --level=error \
  --limit=50 \
  --format="table(timestamp,message)"
```

---

## Getting Help

### Check Status Pages
- GCP Status: https://status.cloud.google.com
- App Engine Status: https://status.cloud.google.com/products/appengine

### Documentation
- App Engine Docs: https://cloud.google.com/appengine/docs
- Troubleshooting Guide: https://cloud.google.com/appengine/docs/standard/nodejs/troubleshooting

### Support
```bash
# Open support case (requires support plan)
gcloud support cases create \
  --title="Deployment issue" \
  --description="..." \
  --severity="S1"
```

### Community
- Stack Overflow: https://stackoverflow.com/questions/tagged/google-app-engine
- Google Cloud Community: https://www.googlecloudcommunity.com

---

## Preventive Measures

### Before Deployment
1. ✅ Run `./verify-deployment.sh`
2. ✅ Test locally: `npm run build && npm start`
3. ✅ Check `CHECKLIST.md`
4. ✅ Review recent changes
5. ✅ Ensure tests pass
6. ✅ Deploy to staging first

### After Deployment
1. ✅ Monitor logs for 5-10 minutes
2. ✅ Test critical functionality
3. ✅ Check error rate in Cloud Console
4. ✅ Verify health endpoint
5. ✅ Keep previous version for quick rollback

### Regular Maintenance
1. 🔄 Delete old versions monthly
2. 🔄 Review and optimize scaling settings
3. 🔄 Update dependencies
4. 🔄 Monitor costs and set alerts
5. 🔄 Review logs for patterns

---

**Last Updated**: February 17, 2026
**For additional help**: Refer to DEPLOYMENT.md or QUICKREF.md
