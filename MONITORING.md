# Monitoring & Alerts Setup

Guide for setting up monitoring, logging, and alerting for the control-desk-web service on GCP App Engine.

## Table of Contents
- [Logging](#logging)
- [Monitoring](#monitoring)
- [Alerting](#alerting)
- [Performance Monitoring](#performance-monitoring)
- [Cost Monitoring](#cost-monitoring)
- [Uptime Checks](#uptime-checks)

---

## Logging

### Cloud Logging

All App Engine logs are automatically sent to Cloud Logging.

#### View Logs via Console
1. Go to: https://console.cloud.google.com/logs
2. Select resource: App Engine Application → control-desk-web
3. Adjust time range and severity

#### View Logs via CLI

```bash
# Real-time logs
gcloud app logs tail -s control-desk-web

# Last 100 entries
gcloud app logs read -s control-desk-web --limit=100

# Filter by severity
gcloud app logs read -s control-desk-web --level=ERROR

# Filter by timestamp
gcloud app logs read -s control-desk-web \
  --format="table(timestamp,severity,message)" \
  --filter="timestamp>=2026-02-17T00:00:00"

# Search for specific text
gcloud app logs read -s control-desk-web \
  --filter="textPayload:error OR textPayload:fail"
```

#### Useful Log Queries

**Find errors in last hour:**
```
resource.type="gae_app"
resource.labels.module_id="control-desk-web"
severity="ERROR"
timestamp>="2026-02-17T10:00:00Z"
```

**Find slow requests (>1s):**
```
resource.type="gae_app"
resource.labels.module_id="control-desk-web"
httpRequest.latency > "1s"
```

**Find 5xx errors:**
```
resource.type="gae_app"
resource.labels.module_id="control-desk-web"
httpRequest.status >= 500
```

### Log Exports

Export logs to BigQuery for analysis:

```bash
# Create BigQuery dataset
bq mk --dataset PROJECT_ID:app_logs

# Create log sink
gcloud logging sinks create app-logs-export \
  bigquery.googleapis.com/projects/PROJECT_ID/datasets/app_logs \
  --log-filter='resource.type="gae_app" AND resource.labels.module_id="control-desk-web"'
```

---

## Monitoring

### Cloud Monitoring Dashboard

#### Create Custom Dashboard

1. Go to: https://console.cloud.google.com/monitoring
2. Click "Dashboards" → "Create Dashboard"
3. Add charts for key metrics

#### Key Metrics to Monitor

**Request Rate:**
```
Resource: App Engine Application
Metric: appengine.googleapis.com/http/server/response_count
Filter: service_name = control-desk-web
```

**Response Latency:**
```
Metric: appengine.googleapis.com/http/server/response_latencies
Percentile: 50th, 95th, 99th
```

**Error Rate:**
```
Metric: appengine.googleapis.com/http/server/response_count
Filter: response_code >= 500
```

**Instance Count:**
```
Metric: appengine.googleapis.com/system/instance_count
```

**Memory Usage:**
```
Metric: appengine.googleapis.com/system/memory/usage
```

**CPU Utilization:**
```
Metric: appengine.googleapis.com/system/cpu/usage
```

### Create Dashboard via CLI

```bash
# Create monitoring workspace (if not exists)
gcloud monitoring dashboards create --config-from-file=dashboard.json
```

**dashboard.json:**
```json
{
  "displayName": "Control Desk Web - Monitoring",
  "mosaicLayout": {
    "columns": 12,
    "tiles": [
      {
        "width": 6,
        "height": 4,
        "widget": {
          "title": "Request Rate",
          "xyChart": {
            "dataSets": [{
              "timeSeriesQuery": {
                "timeSeriesFilter": {
                  "filter": "resource.type=\"gae_app\" resource.label.module_id=\"control-desk-web\" metric.type=\"appengine.googleapis.com/http/server/response_count\""
                }
              }
            }]
          }
        }
      }
    ]
  }
}
```

---

## Alerting

### Set Up Alerts

#### 1. High Error Rate Alert

```bash
gcloud alpha monitoring policies create \
  --notification-channels=CHANNEL_ID \
  --display-name="High Error Rate - Control Desk Web" \
  --condition-display-name="Error rate > 5%" \
  --condition-threshold-value=0.05 \
  --condition-threshold-duration=300s \
  --condition-expression='
    resource.type = "gae_app"
    AND resource.label.module_id = "control-desk-web"
    AND metric.type = "appengine.googleapis.com/http/server/response_count"
    AND metric.label.response_code >= 500
  '
```

#### 2. High Latency Alert

Create via Console:
1. Go to: https://console.cloud.google.com/monitoring/alerting
2. Click "Create Policy"
3. Add condition:
   - Resource: App Engine Application
   - Metric: Response Latency (95th percentile)
   - Threshold: > 1000ms
   - Duration: 5 minutes
4. Add notification channel
5. Save

#### 3. Instance Count Alert

Alert when instances exceed expected range:

```yaml
# Alert if instance count > 8
Resource: App Engine Application
Metric: appengine.googleapis.com/system/instance_count
Condition: > 8
Duration: 5 minutes
```

#### 4. Memory Usage Alert

```yaml
# Alert if memory usage > 80%
Resource: App Engine Application
Metric: appengine.googleapis.com/system/memory/usage
Condition: > 0.8
Duration: 5 minutes
```

### Notification Channels

#### Set Up Email Notifications

```bash
gcloud alpha monitoring channels create \
  --display-name="DevOps Team Email" \
  --type=email \
  --channel-labels=email_address=devops@example.com
```

#### Set Up Slack Notifications

1. Create Slack webhook: https://api.slack.com/messaging/webhooks
2. Create notification channel:

```bash
gcloud alpha monitoring channels create \
  --display-name="Slack DevOps Channel" \
  --type=slack \
  --channel-labels=url=SLACK_WEBHOOK_URL
```

#### List Notification Channels

```bash
gcloud alpha monitoring channels list
```

---

## Performance Monitoring

### Enable Cloud Trace

Automatically enabled for App Engine. View traces:

1. Go to: https://console.cloud.google.com/traces
2. Select service: control-desk-web
3. Analyze slow requests

#### View Traces via CLI

```bash
# List recent traces
gcloud trace traces list --limit=10

# View specific trace
gcloud trace traces describe TRACE_ID
```

### Cloud Profiler

Enable profiling for detailed performance analysis:

```bash
# Install profiler (add to package.json)
npm install @google-cloud/profiler --save

# Add to server.js (at the top)
require('@google-cloud/profiler').start({
  serviceContext: {
    service: 'control-desk-web',
    version: process.env.GAE_VERSION
  }
});
```

View profiles: https://console.cloud.google.com/profiler

### Error Reporting

Automatically enabled. View errors:

1. Go to: https://console.cloud.google.com/errors
2. Filter by service: control-desk-web
3. View error details and stack traces

---

## Cost Monitoring

### Set Up Budget Alerts

#### Create Budget

```bash
# Via Console (recommended):
# 1. Go to: https://console.cloud.google.com/billing/budgets
# 2. Click "Create Budget"
# 3. Set budget amount
# 4. Configure alerts at 50%, 90%, 100%
```

#### Budget Alert Thresholds

Recommended thresholds:
- 50% - Warning (monitor)
- 75% - Alert (investigate)
- 90% - Critical (take action)
- 100% - Emergency (immediate action)

### Monitor Costs

#### Daily Cost Check

```bash
# View billing reports
gcloud billing accounts list

# Export billing data to BigQuery for analysis
gcloud billing accounts link PROJECT_ID \
  --billing-account=BILLING_ACCOUNT_ID
```

#### Cost Optimization

Monitor these metrics:
- Instance hours
- Outgoing bandwidth
- Cloud Build minutes
- Storage usage

### Cost Queries

**Get App Engine costs:**
1. Go to: https://console.cloud.google.com/billing/reports
2. Filter by: Service = App Engine
3. Group by: SKU
4. Time range: Last 30 days

---

## Uptime Checks

### Create Uptime Check

```bash
# Via Console:
# 1. Go to: https://console.cloud.google.com/monitoring/uptime
# 2. Click "Create Uptime Check"
# 3. Configure:
#    - Title: Control Desk Web - Health Check
#    - Protocol: HTTPS
#    - Resource: URL
#    - Hostname: your-app.appspot.com
#    - Path: /health
#    - Check frequency: 1 minute
# 4. Create alert policy
```

### Uptime Check via API

```bash
gcloud alpha monitoring uptime create \
  --display-name="Control Desk Web Health Check" \
  --protocol=HTTPS \
  --resource-type=URL \
  --hostname=YOUR_APP.appspot.com \
  --path=/health \
  --check-interval=60s \
  --timeout=10s
```

### Configure Alert for Uptime Check

Alert when health check fails for 2 consecutive checks:

```yaml
Condition: Uptime Check failed
Duration: 2 checks
Notification: Immediate
```

---

## Monitoring Checklist

### Initial Setup
- [ ] Cloud Logging enabled (automatic)
- [ ] Monitoring dashboard created
- [ ] Error rate alert configured
- [ ] High latency alert configured
- [ ] Budget alerts set up
- [ ] Notification channels configured
- [ ] Uptime checks created

### Daily Monitoring
- [ ] Check error rate
- [ ] Review response times
- [ ] Check instance count
- [ ] Review costs

### Weekly Monitoring
- [ ] Review error trends
- [ ] Analyze slow requests
- [ ] Check storage usage
- [ ] Review budget vs actual
- [ ] Delete old logs (if needed)

### Monthly Monitoring
- [ ] Review all metrics
- [ ] Optimize scaling settings
- [ ] Clean up old versions
- [ ] Review and adjust budgets
- [ ] Update alert thresholds

---

## Useful Monitoring Queries

### Find Failed Health Checks
```
resource.type="gae_app"
resource.labels.module_id="control-desk-web"
httpRequest.requestUrl=~"/health"
httpRequest.status >= 400
```

### Find Large Responses
```
resource.type="gae_app"
resource.labels.module_id="control-desk-web"
httpRequest.responseSize > 1000000
```

### Find Repeated Errors
```
resource.type="gae_app"
resource.labels.module_id="control-desk-web"
severity="ERROR"
| count by textPayload
```

---

## Advanced Monitoring

### Log-based Metrics

Create custom metrics from logs:

```bash
gcloud logging metrics create error_count \
  --description="Count of errors" \
  --log-filter='resource.type="gae_app" AND severity="ERROR"'
```

### Custom Metrics in Code

Add custom metrics to your application:

```javascript
// server.js
const monitoring = require('@google-cloud/monitoring');
const client = new monitoring.MetricServiceClient();

async function recordMetric(value) {
  const projectId = process.env.GOOGLE_CLOUD_PROJECT;
  const dataPoint = {
    interval: {
      endTime: {
        seconds: Date.now() / 1000,
      },
    },
    value: {
      doubleValue: value,
    },
  };
  
  const timeSeriesData = {
    metric: {
      type: 'custom.googleapis.com/my_metric',
    },
    resource: {
      type: 'gae_app',
      labels: {
        module_id: 'control-desk-web',
      },
    },
    points: [dataPoint],
  };
  
  await client.createTimeSeries({
    name: client.projectPath(projectId),
    timeSeries: [timeSeriesData],
  });
}
```

---

## Emergency Response

### High Error Rate
1. Check logs: `gcloud app logs tail -s control-desk-web --level=ERROR`
2. Identify pattern
3. Rollback if needed: `./rollback.sh`

### High Latency
1. Check traces for slow requests
2. Review recent changes
3. Increase instance class or count

### Out of Memory
1. Check memory usage metrics
2. Increase instance class in app.yaml
3. Redeploy

### Cost Spike
1. Check instance count
2. Review traffic patterns
3. Adjust scaling settings
4. Check for DDoS or abuse

---

## Resources

- **Cloud Console**: https://console.cloud.google.com
- **Monitoring**: https://console.cloud.google.com/monitoring
- **Logging**: https://console.cloud.google.com/logs
- **Error Reporting**: https://console.cloud.google.com/errors
- **Trace**: https://console.cloud.google.com/traces
- **Billing**: https://console.cloud.google.com/billing

---

**Last Updated**: February 17, 2026
**Maintain**: Review and update alert thresholds quarterly
