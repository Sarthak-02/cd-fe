# GitHub Actions Secrets Setup

To enable CI/CD deployment via GitHub Actions, you need to set up the following secrets in your GitHub repository:

## Required Secrets

Navigate to: **Settings → Secrets and variables → Actions → New repository secret**

### 1. GCP_PROJECT_ID
Your Google Cloud Platform project ID.

```
Example: my-project-12345
```

**How to find it:**
```bash
gcloud projects list
```

### 2. GCP_SA_KEY
Service account JSON key with App Engine deployment permissions.

**How to create it:**

1. Create a service account:
```bash
gcloud iam service-accounts create github-actions-deployer \
    --display-name="GitHub Actions Deployer"
```

2. Grant necessary roles:
```bash
# Get your project ID
PROJECT_ID=$(gcloud config get-value project)

# Grant App Engine Admin role
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:github-actions-deployer@${PROJECT_ID}.iam.gserviceaccount.com" \
    --role="roles/appengine.appAdmin"

# Grant Service Account User role
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:github-actions-deployer@${PROJECT_ID}.iam.gserviceaccount.com" \
    --role="roles/iam.serviceAccountUser"

# Grant Storage Admin role (for Cloud Build)
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:github-actions-deployer@${PROJECT_ID}.iam.gserviceaccount.com" \
    --role="roles/storage.admin"

# Grant Cloud Build Editor role
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:github-actions-deployer@${PROJECT_ID}.iam.gserviceaccount.com" \
    --role="roles/cloudbuild.builds.editor"
```

3. Create and download the key:
```bash
gcloud iam service-accounts keys create ~/github-actions-key.json \
    --iam-account=github-actions-deployer@${PROJECT_ID}.iam.gserviceaccount.com
```

4. Copy the contents of `~/github-actions-key.json` and paste it as the value for `GCP_SA_KEY` secret.

**Important:** Delete the key file after uploading to GitHub:
```bash
rm ~/github-actions-key.json
```

## Optional Secrets

### VITE_GOOGLE_MAPS_API_KEY
If your application uses Google Maps, add this secret with your API key.

### VITE_API_BASE_URL
Production API base URL. If not set, the application will use the default configured in the code.

## Verifying Setup

After adding secrets, you can verify the deployment by:

1. Push code to the `main` or `production` branch
2. Go to **Actions** tab in your GitHub repository
3. Watch the deployment workflow run
4. Check the deployment summary for the service URL

## Triggering Manual Deployment

You can manually trigger a deployment without pushing code:

1. Go to **Actions** tab
2. Select "Deploy to GCP App Engine" workflow
3. Click "Run workflow"
4. Select the branch to deploy
5. Click "Run workflow"

## Security Best Practices

1. **Never commit the service account key** to version control
2. **Use separate service accounts** for different environments (dev, staging, prod)
3. **Regularly rotate service account keys**
4. **Use least-privilege principle** - only grant required roles
5. **Monitor service account usage** in Cloud Console

## Troubleshooting

### Error: "Permission denied"
- Verify the service account has all required roles
- Check if App Engine API is enabled:
  ```bash
  gcloud services enable appengine.googleapis.com
  ```

### Error: "Invalid credentials"
- Verify the GCP_SA_KEY secret contains valid JSON
- Ensure there are no extra spaces or newlines
- Try regenerating the service account key

### Error: "Project not found"
- Verify GCP_PROJECT_ID matches your actual project ID
- Check if you have access to the project

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Google Cloud Auth Action](https://github.com/google-github-actions/auth)
- [IAM Roles for App Engine](https://cloud.google.com/appengine/docs/standard/python3/roles)
