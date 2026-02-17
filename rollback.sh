#!/bin/bash

# Emergency Rollback Script for GCP App Engine
# This script helps quickly rollback to a previous version

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${RED}=== EMERGENCY ROLLBACK SCRIPT ===${NC}\n"

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}Error: gcloud CLI is not installed.${NC}"
    exit 1
fi

# Get project ID
PROJECT_ID=$(gcloud config get-value project 2>/dev/null)
if [ -z "$PROJECT_ID" ]; then
    echo -e "${RED}Error: No GCP project is set.${NC}"
    exit 1
fi

echo -e "${YELLOW}Project: $PROJECT_ID${NC}"
echo -e "${YELLOW}Service: control-desk-web${NC}\n"

# List current versions
echo -e "${BLUE}Current versions:${NC}"
gcloud app versions list --service=control-desk-web --format="table(version.id,traffic_split,last_deployed_time.date())"

echo ""

# Get current serving version
CURRENT_VERSION=$(gcloud app versions list --service=control-desk-web --filter="traffic_split>0" --format="value(version.id)" 2>/dev/null | head -n 1)

if [ -z "$CURRENT_VERSION" ]; then
    echo -e "${RED}Error: Could not determine current version.${NC}"
    exit 1
fi

echo -e "${YELLOW}Current version serving traffic: ${CURRENT_VERSION}${NC}\n"

# Get list of all versions
VERSIONS=($(gcloud app versions list --service=control-desk-web --format="value(version.id)" 2>/dev/null))

if [ ${#VERSIONS[@]} -lt 2 ]; then
    echo -e "${RED}Error: No previous versions available for rollback.${NC}"
    exit 1
fi

# Find previous version (most recent that's not current)
PREVIOUS_VERSION=""
for version in "${VERSIONS[@]}"; do
    if [ "$version" != "$CURRENT_VERSION" ]; then
        PREVIOUS_VERSION="$version"
        break
    fi
done

if [ -z "$PREVIOUS_VERSION" ]; then
    echo -e "${RED}Error: Could not find a previous version.${NC}"
    exit 1
fi

echo -e "${GREEN}Previous version found: ${PREVIOUS_VERSION}${NC}\n"

# Confirmation
echo -e "${YELLOW}This will rollback from version ${CURRENT_VERSION} to ${PREVIOUS_VERSION}${NC}"
echo -e "${RED}This action will affect production traffic immediately!${NC}\n"

read -p "Are you sure you want to continue? (type 'yes' to confirm): " confirmation

if [ "$confirmation" != "yes" ]; then
    echo -e "${YELLOW}Rollback cancelled.${NC}"
    exit 0
fi

echo ""
echo -e "${BLUE}Rolling back...${NC}"

# Perform rollback
if gcloud app services set-traffic control-desk-web --splits="${PREVIOUS_VERSION}=1" --quiet; then
    echo ""
    echo -e "${GREEN}✓ Rollback successful!${NC}"
    echo -e "${GREEN}Traffic is now directed to version: ${PREVIOUS_VERSION}${NC}\n"
    
    # Show current status
    echo -e "${BLUE}Current traffic allocation:${NC}"
    gcloud app versions list --service=control-desk-web --format="table(version.id,traffic_split)"
    
    echo ""
    echo -e "${YELLOW}Next steps:${NC}"
    echo "1. Verify the application is working correctly"
    echo "2. Check logs: gcloud app logs tail -s control-desk-web"
    echo "3. Monitor for errors"
    echo "4. Investigate what went wrong with version ${CURRENT_VERSION}"
    echo ""
    echo -e "${YELLOW}To delete the problematic version later:${NC}"
    echo "gcloud app versions delete ${CURRENT_VERSION} --service=control-desk-web"
else
    echo ""
    echo -e "${RED}✗ Rollback failed!${NC}"
    echo "Please check the error message above and try manual rollback:"
    echo "gcloud app services set-traffic control-desk-web --splits=${PREVIOUS_VERSION}=1"
    exit 1
fi
