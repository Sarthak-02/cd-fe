# Quick Reference - GCP App Engine Deployment

## Initial Setup (One-time)

```bash
# Install Google Cloud SDK
curl https://sdk.cloud.google.com | bash

# Authenticate
gcloud auth login

# Set project
gcloud config set project YOUR_PROJECT_ID

# Initialize App Engine
gcloud app create --region=us-central

# Enable required APIs
gcloud services enable appengine.googleapis.com
gcloud services enable cloudbuild.googleapis.com
```

## Deployment Commands

```bash
# Verify setup
./verify-deployment.sh

# Deploy to App Engine
./deploy.sh

# Or deploy manually
npm run build
gcloud app deploy app.yaml --quiet
```

## Monitoring & Management

```bash
# View logs (real-time)
gcloud app logs tail -s control-desk-web

# View logs (last 100 lines)
gcloud app logs read -s control-desk-web --limit=100

# Open application
gcloud app browse -s control-desk-web

# List versions
gcloud app versions list --service=control-desk-web

# List services
gcloud app services list

# Describe service
gcloud app services describe control-desk-web
```

## Version Management

```bash
# Deploy without deleting previous version
gcloud app deploy --no-promote

# Traffic splitting (canary deployment)
gcloud app services set-traffic control-desk-web --splits=v1=0.9,v2=0.1

# Delete old version
gcloud app versions delete VERSION_ID --service=control-desk-web

# Stop version (keeps it but stops serving)
gcloud app versions stop VERSION_ID --service=control-desk-web
```

## Debugging

```bash
# Get instance list
gcloud app instances list --service=control-desk-web

# SSH into instance
gcloud app instances ssh INSTANCE_ID --service=control-desk-web

# View application details
gcloud app describe

# Check service account
gcloud iam service-accounts list

# View IAM policy
gcloud projects get-iam-policy PROJECT_ID
```

## Configuration Updates

```bash
# Update environment variables (edit app.yaml first)
gcloud app deploy app.yaml --quiet

# Update scaling settings (edit app.yaml first)
gcloud app deploy app.yaml --quiet

# Update instance class (edit app.yaml first)
gcloud app deploy app.yaml --quiet
```

## Cost Management

```bash
# Stop all traffic (but keep deployed)
gcloud app versions stop VERSION_ID --service=control-desk-web

# Delete service (WARNING: removes entire service)
gcloud app services delete control-desk-web

# View billing
gcloud beta billing accounts list
gcloud beta billing projects describe PROJECT_ID

# Set budget alerts (use Cloud Console)
# https://console.cloud.google.com/billing/budgets
```

## Local Testing

```bash
# Run locally with production build
npm run build
npm start

# Test with Cloud Build locally (requires Docker)
gcloud builds submit --config cloudbuild.yaml
```

## Troubleshooting

```bash
# Check build logs
gcloud app logs read --service=control-desk-web --limit=50

# Validate app.yaml
gcloud app deploy --validate-only

# Check service status
gcloud app services browse control-desk-web --no-launch-browser

# List all projects
gcloud projects list

# Switch project
gcloud config set project ANOTHER_PROJECT_ID

# Check current configuration
gcloud config list

# Clear cache
rm -rf node_modules dist
npm install
npm run build
```

## CI/CD (GitHub Actions)

```bash
# Required secrets in GitHub
GCP_PROJECT_ID=your-project-id
GCP_SA_KEY={"type":"service_account",...}

# Manual deployment trigger
# GitHub → Actions → Deploy to GCP App Engine → Run workflow
```

## Domain & HTTPS

```bash
# Add custom domain
gcloud app domain-mappings create 'your-domain.com' --service=control-desk-web

# View domain mappings
gcloud app domain-mappings list

# View SSL certificate status
gcloud app domain-mappings describe 'your-domain.com'

# Delete domain mapping
gcloud app domain-mappings delete 'your-domain.com'
```

## Performance Monitoring

```bash
# View metrics (use Cloud Console)
# https://console.cloud.google.com/monitoring

# View traces
# https://console.cloud.google.com/traces

# View errors
# https://console.cloud.google.com/errors
```

## Useful Links

- **Cloud Console**: https://console.cloud.google.com
- **App Engine Dashboard**: https://console.cloud.google.com/appengine
- **Logs Explorer**: https://console.cloud.google.com/logs
- **Cloud Monitoring**: https://console.cloud.google.com/monitoring
- **IAM & Admin**: https://console.cloud.google.com/iam-admin
- **Billing**: https://console.cloud.google.com/billing

## Emergency Procedures

### Rollback to Previous Version
```bash
# List versions with traffic allocation
gcloud app versions list --service=control-desk-web

# Route all traffic to previous version
gcloud app services set-traffic control-desk-web --splits=PREVIOUS_VERSION=1
```

### Stop Service Immediately
```bash
# Stop current version
gcloud app versions stop $(gcloud app versions list --service=control-desk-web --format="value(version.id)" --limit=1)
```

### View Recent Errors
```bash
# Last 50 errors
gcloud app logs read --service=control-desk-web --limit=50 --level=error
```

## Best Practices

1. **Always test locally** before deploying
2. **Use version control** - commit before deploying
3. **Monitor costs** - set up budget alerts
4. **Use traffic splitting** for gradual rollouts
5. **Keep old versions** for quick rollback
6. **Check logs** after deployment
7. **Set up alerts** for errors and downtime
8. **Use environment variables** for configuration
9. **Enable security features** (HTTPS, IAM)
10. **Regular backups** of configuration files

## Support

For detailed documentation, see:
- [DEPLOYMENT.md](./DEPLOYMENT.md)
- [GITHUB_SECRETS.md](./GITHUB_SECRETS.md)
- [GCP App Engine Docs](https://cloud.google.com/appengine/docs)
