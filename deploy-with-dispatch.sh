#!/bin/bash

# Deployment script with dispatch routes

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Deploying control-desk-web with Dispatch Routes ===${NC}\n"

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}Error: gcloud CLI is not installed.${NC}"
    exit 1
fi

# Check if project is set
PROJECT_ID=$(gcloud config get-value project 2>/dev/null)
if [ -z "$PROJECT_ID" ]; then
    echo -e "${RED}Error: No GCP project is set.${NC}"
    exit 1
fi

echo -e "${YELLOW}Project: $PROJECT_ID${NC}"
echo -e "${YELLOW}Service: control-desk-web${NC}"
echo -e "${YELLOW}Base Path: /control-desk-web/${NC}\n"

# Step 1: Build the application
echo -e "${GREEN}Step 1: Building application...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}Build failed. Aborting deployment.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Build successful${NC}\n"

# Step 2: Deploy the service
echo -e "${GREEN}Step 2: Deploying service...${NC}"
gcloud app deploy app.yaml --quiet

if [ $? -ne 0 ]; then
    echo -e "${RED}Service deployment failed. Aborting.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Service deployed${NC}\n"

# Step 3: Deploy dispatch routes
echo -e "${GREEN}Step 3: Deploying dispatch routes...${NC}"
gcloud app deploy dispatch.yaml --quiet

if [ $? -ne 0 ]; then
    echo -e "${RED}Dispatch deployment failed.${NC}"
    echo -e "${YELLOW}Note: Service is deployed but dispatch routes are not active.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Dispatch routes deployed${NC}\n"

# Success
echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✓ Deployment successful!${NC}\n"

# Get URLs
SERVICE_URL="https://control-desk-web-dot-${PROJECT_ID}.appspot.com/control-desk-web/"
CUSTOM_URL="https://www.vidyaarohan.in/control-desk-web/"

echo -e "${BLUE}Service URLs:${NC}"
echo -e "  Direct: ${YELLOW}${SERVICE_URL}${NC}"
echo -e "  Custom Domain: ${YELLOW}${CUSTOM_URL}${NC}"

echo -e "\n${BLUE}Verify Deployment:${NC}"
echo -e "  Health Check: curl ${SERVICE_URL}health"
echo -e "  View Logs: gcloud app logs tail -s control-desk-web"
echo -e "  Dispatch Rules: gcloud app dispatch-rules describe"

echo -e "\n${YELLOW}Next Steps:${NC}"
echo "  1. Test the health endpoint"
echo "  2. Access the application via custom domain"
echo "  3. Monitor logs for any errors"
echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
