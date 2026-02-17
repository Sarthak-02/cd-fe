# Dispatch Routes Setup Guide

## Overview

This guide explains how to deploy the control-desk-web service with dispatch routes so it's accessible at:
```
https://www.vidyaarohan.in/control-desk-web/
```

## Files Modified

### 1. dispatch.yaml (NEW)
Routes incoming requests to different services based on URL patterns.

```yaml
dispatch:
  - url: "*/control-desk-web/*"
    service: control-desk-web
  - url: "*/control-desk-web"
    service: control-desk-web
```

### 2. vite.config.js (UPDATED)
Added base path for production builds:
```javascript
base: process.env.NODE_ENV === 'production' ? '/control-desk-web/' : '/'
```

### 3. server.js (UPDATED)
Updated Express server to serve the app at `/control-desk-web/` base path.

### 4. src/main.jsx (UPDATED)
Added basename to BrowserRouter:
```javascript
<BrowserRouter basename="/control-desk-web">
```

## Deployment Steps

### Step 1: Deploy the Service First

Deploy your control-desk-web service:

```bash
# Build with the new base path
npm run build

# Deploy the service
gcloud app deploy app.yaml
```

### Step 2: Deploy the Dispatch Configuration

Deploy the dispatch.yaml to route traffic:

```bash
gcloud app deploy dispatch.yaml
```

**Important**: The dispatch.yaml must be deployed separately and AFTER the service is deployed.

### Step 3: Set Up Custom Domain (if not already done)

If you haven't mapped your custom domain yet:

```bash
# Map custom domain
gcloud app domain-mappings create 'vidyaarohan.in' --certificate-management=AUTOMATIC

# Add www subdomain
gcloud app domain-mappings create 'www.vidyaarohan.in' --certificate-management=AUTOMATIC
```

### Step 4: Update DNS Records

Add the following DNS records in your domain registrar:

```
Type: A
Name: @ (or vidyaarohan.in)
Value: [IP addresses provided by GCP]

Type: AAAA (IPv6)
Name: @ (or vidyaarohan.in)
Value: [IPv6 addresses provided by GCP]

Type: CNAME
Name: www
Value: ghs.googlehosted.com
```

To get the required DNS records:
```bash
gcloud app domain-mappings describe 'vidyaarohan.in'
```

## Testing

### Test Locally First

```bash
# Build with production settings
NODE_ENV=production npm run build

# Test the server
npm start

# Visit http://localhost:8080/control-desk-web/
```

### After Deployment

Test all these URLs:

1. **Service URL**: 
   ```
   https://control-desk-web-dot-YOUR_PROJECT.appspot.com/control-desk-web/
   ```

2. **Custom Domain** (after dispatch):
   ```
   https://www.vidyaarohan.in/control-desk-web/
   ```

3. **Health Check**:
   ```bash
   curl https://www.vidyaarohan.in/control-desk-web/health
   ```

## Complete Deployment Script

Create a new script `deploy-with-dispatch.sh`:

```bash
#!/bin/bash

echo "🚀 Deploying control-desk-web with dispatch routes..."

# Step 1: Build
echo "📦 Building application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

# Step 2: Deploy service
echo "🚀 Deploying service..."
gcloud app deploy app.yaml --quiet

if [ $? -ne 0 ]; then
    echo "❌ Service deployment failed"
    exit 1
fi

# Step 3: Deploy dispatch
echo "🔀 Deploying dispatch routes..."
gcloud app deploy dispatch.yaml --quiet

if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    echo "🌐 Service: https://www.vidyaarohan.in/control-desk-web/"
else
    echo "❌ Dispatch deployment failed"
    exit 1
fi
```

Make it executable:
```bash
chmod +x deploy-with-dispatch.sh
```

## Dispatch Rules Explanation

```yaml
dispatch:
  # Matches: vidyaarohan.in/control-desk-web/anything
  - url: "*/control-desk-web/*"
    service: control-desk-web
  
  # Matches: vidyaarohan.in/control-desk-web (exact)
  - url: "*/control-desk-web"
    service: control-desk-web
```

The `*` wildcard matches any domain, so this works for:
- `vidyaarohan.in/control-desk-web/`
- `www.vidyaarohan.in/control-desk-web/`
- `your-project.appspot.com/control-desk-web/`

## Multiple Services Setup

If you have other services (e.g., API, admin panel), your dispatch.yaml might look like:

```yaml
dispatch:
  # API service
  - url: "*/api/*"
    service: api-service
  
  # Admin panel
  - url: "*/admin/*"
    service: admin-service
  
  # Control desk
  - url: "*/control-desk-web/*"
    service: control-desk-web
  
  # Default service (must be last)
  - url: "*/"
    service: default
```

## Troubleshooting

### Issue: 404 Not Found

**Problem**: Accessing `/control-desk-web/` returns 404

**Solutions**:
1. Verify service is deployed:
   ```bash
   gcloud app services list
   ```

2. Verify dispatch rules are deployed:
   ```bash
   gcloud app dispatch-rules describe
   ```

3. Check service directly:
   ```bash
   curl https://control-desk-web-dot-YOUR_PROJECT.appspot.com/control-desk-web/
   ```

### Issue: Static Assets 404

**Problem**: HTML loads but CSS/JS files return 404

**Solutions**:
1. Verify vite.config.js has correct base path
2. Rebuild: `npm run build`
3. Check dist/index.html - asset paths should start with `/control-desk-web/`

### Issue: React Router Routes Don't Work

**Problem**: Direct navigation to routes like `/control-desk-web/school` returns 404

**Solutions**:
1. Verify BrowserRouter basename is set in src/main.jsx
2. Ensure server.js handles all routes under base path
3. Check that the wildcard route in server.js is working

### Issue: Redirect Loop

**Problem**: Browser keeps redirecting

**Solutions**:
1. Check server.js redirect logic
2. Ensure you're not forcing HTTPS redirect if already on HTTPS
3. Review any middleware that might be redirecting

## Verifying Dispatch Rules

```bash
# View current dispatch rules
gcloud app dispatch-rules describe

# List all services
gcloud app services list

# Test with curl
curl -I https://www.vidyaarohan.in/control-desk-web/
```

## Updating Dispatch Rules

To update dispatch rules:

1. Edit `dispatch.yaml`
2. Deploy changes:
   ```bash
   gcloud app deploy dispatch.yaml
   ```

Changes take effect immediately (no service redeployment needed).

## Environment-Specific Dispatch

For different environments, you can create:

- `dispatch.dev.yaml`
- `dispatch.staging.yaml`
- `dispatch.prod.yaml`

Deploy with:
```bash
gcloud app deploy dispatch.prod.yaml
```

## Important Notes

1. **Deploy Order**: Always deploy the service BEFORE deploying dispatch rules
2. **Default Service**: You must have a default service in App Engine
3. **Path Matching**: Dispatch rules use glob-style patterns
4. **SSL/TLS**: Custom domains automatically get SSL certificates
5. **DNS Propagation**: May take 24-48 hours for DNS changes to fully propagate

## Monitoring

After deployment, monitor:

```bash
# View logs
gcloud app logs tail -s control-desk-web

# Check for routing errors
gcloud app logs read --filter="dispatch" --limit=50
```

## Cost Implications

Dispatch rules themselves are free, but consider:
- Each service counts towards your instance quota
- Traffic routing doesn't add latency
- Multiple services can share the same custom domain

## Best Practices

1. **Test locally** with the base path before deploying
2. **Deploy to staging** first with dispatch rules
3. **Keep dispatch.yaml** in version control
4. **Document** all URL patterns for your team
5. **Monitor** 404 errors after deployment

---

**Quick Reference**:
```bash
# Deploy everything
npm run build
gcloud app deploy app.yaml
gcloud app deploy dispatch.yaml

# Test
curl https://www.vidyaarohan.in/control-desk-web/health

# View dispatch rules
gcloud app dispatch-rules describe
```
