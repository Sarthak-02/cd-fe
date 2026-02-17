# Dispatch Routes - Quick Summary

## What Was Changed

### ✅ Files Created
1. **dispatch.yaml** - Routes `/control-desk-web/*` to your service
2. **DISPATCH_ROUTES.md** - Complete guide
3. **deploy-with-dispatch.sh** - Automated deployment script

### ✅ Files Modified
1. **vite.config.js** - Added base path: `/control-desk-web/`
2. **server.js** - Updated to serve at base path
3. **src/main.jsx** - Added `basename="/control-desk-web"` to BrowserRouter
4. **app.yaml** - Added BASE_PATH environment variable
5. **app.prod.yaml** - Added BASE_PATH environment variable

## Quick Deployment

### Option 1: Use the Script (Recommended)
```bash
./deploy-with-dispatch.sh
```

### Option 2: Manual Steps
```bash
# 1. Build
npm run build

# 2. Deploy service
gcloud app deploy app.yaml

# 3. Deploy dispatch routes
gcloud app deploy dispatch.yaml
```

## Testing

### Local Testing
```bash
# Build with production settings
NODE_ENV=production npm run build

# Start server
npm start

# Visit
http://localhost:8080/control-desk-web/
```

### After Deployment
```bash
# Health check
curl https://www.vidyaarohan.in/control-desk-web/health

# View dispatch rules
gcloud app dispatch-rules describe

# Monitor logs
gcloud app logs tail -s control-desk-web
```

## URLs

After deployment, your app will be accessible at:

1. **Custom Domain**: 
   ```
   https://www.vidyaarohan.in/control-desk-web/
   ```

2. **Direct Service URL**:
   ```
   https://control-desk-web-dot-YOUR_PROJECT.appspot.com/control-desk-web/
   ```

## Important Notes

1. ⚠️ **Deploy Order**: Always deploy the service BEFORE dispatch.yaml
2. ⚠️ **Rebuild Required**: You must rebuild the app with the new base path
3. ⚠️ **Custom Domain**: Ensure your domain is already mapped to App Engine
4. ⚠️ **DNS**: DNS changes may take time to propagate

## Custom Domain Setup (If Not Done)

```bash
# Map your domain
gcloud app domain-mappings create 'vidyaarohan.in' --certificate-management=AUTOMATIC
gcloud app domain-mappings create 'www.vidyaarohan.in' --certificate-management=AUTOMATIC

# Get DNS records to add
gcloud app domain-mappings describe 'vidyaarohan.in'
```

## Troubleshooting

### 404 Errors
- Verify service is deployed: `gcloud app services list`
- Check dispatch rules: `gcloud app dispatch-rules describe`
- Ensure you rebuilt with new base path

### Static Assets 404
- Check vite.config.js has `base: '/control-desk-web/'`
- Rebuild: `npm run build`
- Verify dist/index.html has correct asset paths

### React Router Issues
- Ensure BrowserRouter has `basename="/control-desk-web"`
- Check server.js handles wildcards correctly

## Verification Checklist

- [ ] Built application with production mode
- [ ] Deployed service successfully
- [ ] Deployed dispatch.yaml
- [ ] Health endpoint responds: `/control-desk-web/health`
- [ ] Custom domain resolves
- [ ] All routes work (login, school, etc.)
- [ ] Static assets load correctly
- [ ] No console errors in browser

## Next Steps

1. Deploy using `./deploy-with-dispatch.sh`
2. Test all URLs
3. Monitor logs for errors
4. Update any hardcoded URLs in your code

---

**For detailed information**, see `DISPATCH_ROUTES.md`
