#!/bin/bash

# Enhanced deployment script with environment support

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default environment
ENVIRONMENT="production"
CONFIG_FILE="app.yaml"

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --env)
            ENVIRONMENT="$2"
            shift 2
            ;;
        --no-build)
            SKIP_BUILD=true
            shift
            ;;
        --promote)
            PROMOTE=true
            shift
            ;;
        --no-promote)
            NO_PROMOTE=true
            shift
            ;;
        --help)
            echo "Usage: ./deploy-env.sh [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --env <environment>    Deployment environment (dev|staging|production)"
            echo "  --no-build            Skip build step"
            echo "  --promote             Immediately serve traffic to new version"
            echo "  --no-promote          Deploy without serving traffic"
            echo "  --help                Show this help message"
            echo ""
            echo "Examples:"
            echo "  ./deploy-env.sh --env dev"
            echo "  ./deploy-env.sh --env staging --promote"
            echo "  ./deploy-env.sh --env production --no-promote"
            exit 0
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

echo -e "${GREEN}=== GCP App Engine Deployment ===${NC}\n"

# Determine config file based on environment
case $ENVIRONMENT in
    dev|development)
        CONFIG_FILE="app.dev.yaml"
        SERVICE_NAME="control-desk-web-dev"
        ;;
    staging|stage)
        CONFIG_FILE="app.staging.yaml"
        SERVICE_NAME="control-desk-web-staging"
        ;;
    prod|production)
        CONFIG_FILE="app.prod.yaml"
        SERVICE_NAME="control-desk-web"
        ;;
    *)
        echo -e "${RED}Invalid environment: $ENVIRONMENT${NC}"
        echo "Valid environments: dev, staging, production"
        exit 1
        ;;
esac

# Check if config file exists
if [ ! -f "$CONFIG_FILE" ]; then
    echo -e "${RED}Config file not found: $CONFIG_FILE${NC}"
    echo "Falling back to app.yaml"
    CONFIG_FILE="app.yaml"
fi

echo -e "${BLUE}Environment:${NC} $ENVIRONMENT"
echo -e "${BLUE}Config File:${NC} $CONFIG_FILE"
echo -e "${BLUE}Service:${NC} $SERVICE_NAME"
echo ""

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}Error: gcloud CLI is not installed.${NC}"
    echo "Please install it from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Check if project is set
PROJECT_ID=$(gcloud config get-value project 2>/dev/null)
if [ -z "$PROJECT_ID" ]; then
    echo -e "${RED}Error: No GCP project is set.${NC}"
    echo "Run: gcloud config set project YOUR_PROJECT_ID"
    exit 1
fi

echo -e "${YELLOW}Project: $PROJECT_ID${NC}"
echo ""

# Build the application
if [ "$SKIP_BUILD" != true ]; then
    echo -e "${GREEN}Building the application...${NC}"
    npm run build
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}Build failed. Aborting deployment.${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ Build successful${NC}\n"
else
    echo -e "${YELLOW}Skipping build step${NC}\n"
fi

# Prepare deploy command
DEPLOY_CMD="gcloud app deploy $CONFIG_FILE --quiet"

if [ "$NO_PROMOTE" = true ]; then
    DEPLOY_CMD="$DEPLOY_CMD --no-promote"
    echo -e "${YELLOW}Note: New version will NOT receive traffic automatically${NC}"
elif [ "$PROMOTE" = true ]; then
    DEPLOY_CMD="$DEPLOY_CMD --promote"
    echo -e "${YELLOW}Note: New version will receive traffic immediately${NC}"
fi

echo ""

# Confirmation for production
if [ "$ENVIRONMENT" = "production" ] || [ "$ENVIRONMENT" = "prod" ]; then
    echo -e "${RED}⚠️  WARNING: You are deploying to PRODUCTION!${NC}"
    read -p "Are you sure you want to continue? (type 'yes' to confirm): " confirmation
    
    if [ "$confirmation" != "yes" ]; then
        echo -e "${YELLOW}Deployment cancelled.${NC}"
        exit 0
    fi
    echo ""
fi

# Deploy to App Engine
echo -e "${GREEN}Deploying to App Engine...${NC}"
eval $DEPLOY_CMD

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✓ Deployment successful!${NC}\n"
    
    # Get service URL
    echo -e "${BLUE}Service Information:${NC}"
    SERVICE_URL=$(gcloud app browse --service=$SERVICE_NAME --no-launch-browser 2>/dev/null)
    echo -e "${YELLOW}URL:${NC} $SERVICE_URL"
    
    # Show current versions
    echo ""
    echo -e "${BLUE}Current versions:${NC}"
    gcloud app versions list --service=$SERVICE_NAME --format="table(version.id,traffic_split,last_deployed_time.date())"
    
    echo ""
    echo -e "${YELLOW}Next steps:${NC}"
    echo "1. Verify deployment: curl $SERVICE_URL/health"
    echo "2. Check logs: gcloud app logs tail -s $SERVICE_NAME"
    echo "3. Monitor for errors"
    
    if [ "$NO_PROMOTE" = true ]; then
        echo ""
        echo -e "${YELLOW}To route traffic to the new version:${NC}"
        echo "gcloud app services set-traffic $SERVICE_NAME --splits=<VERSION_ID>=1"
    fi
else
    echo ""
    echo -e "${RED}✗ Deployment failed!${NC}"
    exit 1
fi
