# GCP App Engine Deployment Guide

This guide explains how to deploy the control-desk-web service to Google Cloud Platform App Engine.

## Prerequisites

1. **Google Cloud SDK**: Install the gcloud CLI
   ```bash
   # macOS
   curl https://sdk.cloud.google.com | bash
   
   # Or download from: https://cloud.google.com/sdk/docs/install
   ```

2. **GCP Project**: Create or select a GCP project
   ```bash
   gcloud projects list
   gcloud config set project YOUR_PROJECT_ID
   ```

3. **Enable Required APIs**:
   ```bash
   gcloud services enable appengine.googleapis.com
   gcloud services enable cloudbuild.googleapis.com
   ```

4. **Initialize App Engine** (first time only):
   ```bash
   gcloud app create --region=us-central
   ```

## Configuration Files

The following files have been created for deployment:

- `app.yaml` - App Engine configuration
- `Dockerfile` - Container configuration (optional, App Engine can use Node.js runtime directly)
- `server.js` - Express server to serve static files
- `.dockerignore` - Files to exclude from Docker build
- `.gcloudignore` - Files to exclude from deployment
- `deploy.sh` - Automated deployment script

## Environment Variables

To configure environment variables for your application:

1. Edit `app.yaml` and add/modify the `env_variables` section:
   ```yaml
   env_variables:
     NODE_ENV: 'production'
     API_BASE_URL: 'https://your-api-url.com'
     # Add other environment variables as needed
   ```

## Deployment Methods

### Method 1: Using the Deployment Script (Recommended)

```bash
# Make the script executable
chmod +x deploy.sh

# Run the deployment
./deploy.sh
```

### Method 2: Manual Deployment

```bash
# 1. Build the application
npm run build

# 2. Deploy to App Engine
gcloud app deploy app.yaml

# 3. View the deployed application
gcloud app browse --service=control-desk-web
```

### Method 3: CI/CD with GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to App Engine

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        
      - name: Setup Cloud SDK
        uses: google-github-actions/setup-gcloud@v1
        with:
          service_account_key: ${{ secrets.GCP_SA_KEY }}
          project_id: ${{ secrets.GCP_PROJECT_ID }}
          
      - name: Deploy to App Engine
        run: gcloud app deploy app.yaml --quiet
```

## Configuration Options

### Scaling Configuration

Edit `app.yaml` to adjust scaling:

```yaml
automatic_scaling:
  min_instances: 1        # Minimum instances (always running)
  max_instances: 10       # Maximum instances
  target_cpu_utilization: 0.65  # Target CPU usage
```

### Instance Class

Available instance classes (in `app.yaml`):
- F1: 256MB, 600MHz (default)
- F2: 512MB, 1.2GHz
- F4: 1GB, 2.4GHz
- F4_1G: 2GB, 2.4GHz

### Custom Domain

To use a custom domain:

```bash
# Add custom domain
gcloud app domain-mappings create 'your-domain.com' --service=control-desk-web

# Follow DNS configuration instructions
gcloud app domain-mappings describe 'your-domain.com'
```

## Useful Commands

```bash
# View application logs
gcloud app logs tail -s control-desk-web

# View deployed services
gcloud app services list

# View deployed versions
gcloud app versions list --service=control-desk-web

# Stop a version (to save costs)
gcloud app versions stop VERSION_ID --service=control-desk-web

# Set traffic split between versions
gcloud app services set-traffic control-desk-web --splits=v1=0.5,v2=0.5

# Open the application in browser
gcloud app browse --service=control-desk-web

# SSH into an instance
gcloud app instances ssh INSTANCE_ID --service=control-desk-web
```

## Monitoring & Debugging

1. **Cloud Console**: Visit the [App Engine Dashboard](https://console.cloud.google.com/appengine)

2. **Logs**: View real-time logs:
   ```bash
   gcloud app logs tail -s control-desk-web
   ```

3. **Error Reporting**: View errors in [Error Reporting](https://console.cloud.google.com/errors)

4. **Performance Monitoring**: Check [Cloud Monitoring](https://console.cloud.google.com/monitoring)

## Cost Optimization

1. **Adjust min_instances**: Set to 0 if you can tolerate cold starts:
   ```yaml
   automatic_scaling:
     min_instances: 0
   ```

2. **Use smaller instance class**: Start with F1 and scale up if needed

3. **Set max_instances**: Prevent runaway costs:
   ```yaml
   automatic_scaling:
     max_instances: 5
   ```

4. **Monitor costs**: Set up [budget alerts](https://console.cloud.google.com/billing/budgets)

## Troubleshooting

### Build Fails
- Check Node.js version compatibility
- Verify all dependencies are in `package.json`
- Run `npm run build` locally to debug

### Deployment Fails
- Check `gcloud` authentication: `gcloud auth list`
- Verify project is set: `gcloud config get-value project`
- Check App Engine is enabled: `gcloud app describe`

### Application Errors
- Check logs: `gcloud app logs tail -s control-desk-web`
- Verify environment variables in `app.yaml`
- Test locally: `npm run build && npm start`

### API Connection Issues
- Update API endpoint in your application code
- Ensure CORS is configured on your API
- Check firewall rules if using internal APIs

## Security Best Practices

1. **Use HTTPS**: Enabled by default with `secure: always` in `app.yaml`
2. **Environment Variables**: Use Secret Manager for sensitive data:
   ```bash
   gcloud secrets create API_KEY --data-file=-
   ```
3. **IAM Roles**: Use least-privilege service accounts
4. **Firewall Rules**: Configure App Engine firewall if needed

## Additional Resources

- [App Engine Documentation](https://cloud.google.com/appengine/docs)
- [Node.js on App Engine](https://cloud.google.com/appengine/docs/standard/nodejs)
- [App Engine Pricing](https://cloud.google.com/appengine/pricing)
- [Best Practices](https://cloud.google.com/appengine/docs/standard/nodejs/building-app/best-practices)
