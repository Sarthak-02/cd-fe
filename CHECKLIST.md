# Pre-Deployment Checklist

Use this checklist before deploying to production.

## ✅ Code Quality

- [ ] All linting errors resolved (`npm run lint`)
- [ ] Application builds successfully (`npm run build`)
- [ ] No console errors or warnings in browser
- [ ] All features tested locally
- [ ] Code reviewed and approved
- [ ] Git changes committed

## ✅ Configuration

- [ ] `.env.production` configured with production values
- [ ] `VITE_API_BASE_URL` points to production API
- [ ] `VITE_GOOGLE_MAPS_API_KEY` is valid for production domain
- [ ] `app.yaml` service name is correct (`control-desk-web`)
- [ ] Instance class and scaling settings are appropriate
- [ ] Environment variables in `app.yaml` are correct

## ✅ GCP Setup

- [ ] Google Cloud SDK installed (`gcloud --version`)
- [ ] Authenticated with GCP (`gcloud auth list`)
- [ ] Project ID is set (`gcloud config get-value project`)
- [ ] App Engine initialized (`gcloud app describe`)
- [ ] Required APIs enabled:
  - [ ] App Engine API
  - [ ] Cloud Build API
- [ ] Billing is enabled on the project
- [ ] IAM permissions are correct

## ✅ Dependencies

- [ ] All dependencies installed (`node_modules` exists)
- [ ] `express` added to dependencies
- [ ] No deprecated packages
- [ ] Package versions are compatible
- [ ] Lock file is up to date

## ✅ Security

- [ ] No sensitive data in code or config files
- [ ] `.env` files not committed to git
- [ ] API keys are valid and secured
- [ ] HTTPS enforced (`secure: always` in `app.yaml`)
- [ ] Service account has minimal required permissions
- [ ] CORS configured properly on backend API

## ✅ Performance

- [ ] Images optimized
- [ ] Bundle size is reasonable
- [ ] Lazy loading implemented where appropriate
- [ ] Cache headers configured
- [ ] Gzip compression enabled (automatic in App Engine)

## ✅ Monitoring

- [ ] Cloud Logging enabled
- [ ] Error reporting configured
- [ ] Budget alerts set up
- [ ] Uptime checks configured (optional)
- [ ] Email alerts configured for critical issues

## ✅ Testing

- [ ] Application tested locally with production build
  ```bash
  npm run build && npm start
  ```
- [ ] All routes accessible
- [ ] API integration working
- [ ] Authentication flow working
- [ ] Forms submitting correctly
- [ ] Maps loading correctly
- [ ] Translations working
- [ ] Mobile responsiveness verified

## ✅ Documentation

- [ ] README.md updated
- [ ] DEPLOYMENT.md reviewed
- [ ] Environment variables documented
- [ ] Deployment process documented
- [ ] Team notified of deployment

## ✅ Backup & Rollback

- [ ] Previous version available for rollback
- [ ] Database backup completed (if applicable)
- [ ] Rollback plan documented
- [ ] Team knows how to rollback if needed

## ✅ Post-Deployment

- [ ] Application deployed successfully
- [ ] Service URL accessible
- [ ] Logs checked for errors
  ```bash
  gcloud app logs tail -s control-desk-web
  ```
- [ ] Health check endpoint responding
  ```bash
  curl https://YOUR_APP_URL/health
  ```
- [ ] Core functionality verified
- [ ] Team notified of successful deployment
- [ ] Deployment documented in change log

## 🚨 Go/No-Go Decision

Before deploying, answer these questions:

1. **Have all critical bugs been fixed?**
   - [ ] Yes / [ ] No

2. **Are all stakeholders aware of this deployment?**
   - [ ] Yes / [ ] No

3. **Is there someone available to monitor the deployment?**
   - [ ] Yes / [ ] No

4. **Has the rollback procedure been tested?**
   - [ ] Yes / [ ] No

5. **Is this a good time to deploy? (Low traffic period)**
   - [ ] Yes / [ ] No

If any answer is "No", consider postponing the deployment.

## 📞 Emergency Contacts

- **DevOps Lead**: [Name] - [Contact]
- **Backend Team**: [Contact]
- **Project Manager**: [Name] - [Contact]
- **GCP Support**: [Support Plan Details]

## 🔗 Important Links

- Cloud Console: https://console.cloud.google.com
- App Engine: https://console.cloud.google.com/appengine
- Logs: https://console.cloud.google.com/logs
- Monitoring: https://console.cloud.google.com/monitoring
- Error Reporting: https://console.cloud.google.com/errors

---

**Date**: _______________
**Deployed By**: _______________
**Version/Commit**: _______________
**Sign Off**: _______________
