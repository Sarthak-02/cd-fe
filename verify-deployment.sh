#!/bin/bash

# Pre-deployment verification script

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== GCP App Engine Deployment Verification ===${NC}\n"

ERRORS=0
WARNINGS=0

# Check Node.js
echo -n "Checking Node.js... "
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓${NC} Found $NODE_VERSION"
    
    # Extract major version
    MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
    if [ "$MAJOR_VERSION" -lt 18 ]; then
        echo -e "${YELLOW}  Warning: Node.js 18+ recommended (you have $NODE_VERSION)${NC}"
        ((WARNINGS++))
    fi
else
    echo -e "${RED}✗${NC} Not found"
    ((ERRORS++))
fi

# Check npm
echo -n "Checking npm... "
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✓${NC} Found v$NPM_VERSION"
else
    echo -e "${RED}✗${NC} Not found"
    ((ERRORS++))
fi

# Check gcloud CLI
echo -n "Checking gcloud CLI... "
if command -v gcloud &> /dev/null; then
    GCLOUD_VERSION=$(gcloud --version | head -n 1)
    echo -e "${GREEN}✓${NC} $GCLOUD_VERSION"
else
    echo -e "${RED}✗${NC} Not installed"
    echo -e "  Install from: ${BLUE}https://cloud.google.com/sdk/docs/install${NC}"
    ((ERRORS++))
fi

# Check GCP authentication
if command -v gcloud &> /dev/null; then
    echo -n "Checking GCP authentication... "
    ACCOUNT=$(gcloud config get-value account 2>/dev/null)
    if [ -n "$ACCOUNT" ]; then
        echo -e "${GREEN}✓${NC} Logged in as $ACCOUNT"
    else
        echo -e "${RED}✗${NC} Not authenticated"
        echo -e "  Run: ${BLUE}gcloud auth login${NC}"
        ((ERRORS++))
    fi
    
    # Check project configuration
    echo -n "Checking GCP project... "
    PROJECT_ID=$(gcloud config get-value project 2>/dev/null)
    if [ -n "$PROJECT_ID" ]; then
        echo -e "${GREEN}✓${NC} Project: $PROJECT_ID"
    else
        echo -e "${RED}✗${NC} No project set"
        echo -e "  Run: ${BLUE}gcloud config set project YOUR_PROJECT_ID${NC}"
        ((ERRORS++))
    fi
fi

# Check required files
echo -e "\nChecking deployment files..."

FILES=("package.json" "app.yaml" "server.js" "vite.config.js")
for file in "${FILES[@]}"; do
    echo -n "  $file... "
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC}"
    else
        echo -e "${RED}✗${NC}"
        ((ERRORS++))
    fi
done

# Check if dependencies are installed
echo -n "Checking node_modules... "
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC} Dependencies installed"
else
    echo -e "${YELLOW}!${NC} Dependencies not installed"
    echo -e "  Run: ${BLUE}npm install${NC}"
    ((WARNINGS++))
fi

# Test build
echo -e "\nTesting build process..."
echo -n "  Running npm run build... "
if npm run build > /tmp/build_output.log 2>&1; then
    echo -e "${GREEN}✓${NC} Build successful"
    
    # Check if dist folder exists
    if [ -d "dist" ]; then
        echo -n "  Checking dist folder... "
        FILE_COUNT=$(find dist -type f | wc -l)
        echo -e "${GREEN}✓${NC} $FILE_COUNT files generated"
        
        # Check if index.html exists
        if [ -f "dist/index.html" ]; then
            echo -e "  ${GREEN}✓${NC} index.html found"
        else
            echo -e "  ${RED}✗${NC} index.html not found in dist"
            ((ERRORS++))
        fi
    else
        echo -e "${RED}✗${NC} dist folder not created"
        ((ERRORS++))
    fi
else
    echo -e "${RED}✗${NC} Build failed"
    echo -e "${YELLOW}Build output:${NC}"
    cat /tmp/build_output.log
    ((ERRORS++))
fi

# Check App Engine configuration
if command -v gcloud &> /dev/null && [ -n "$PROJECT_ID" ]; then
    echo -e "\nChecking App Engine setup..."
    echo -n "  Checking if App Engine is initialized... "
    
    if gcloud app describe --project="$PROJECT_ID" &> /dev/null; then
        echo -e "${GREEN}✓${NC} App Engine is initialized"
        
        # Get region
        REGION=$(gcloud app describe --project="$PROJECT_ID" --format="value(locationId)" 2>/dev/null)
        echo -e "  Region: ${BLUE}$REGION${NC}"
    else
        echo -e "${YELLOW}!${NC} App Engine not initialized"
        echo -e "  Run: ${BLUE}gcloud app create --region=us-central${NC}"
        echo -e "  Available regions: us-central, us-east1, europe-west, asia-northeast1, etc."
        ((WARNINGS++))
    fi
    
    # Check if App Engine API is enabled
    echo -n "  Checking App Engine API... "
    if gcloud services list --enabled --filter="name:appengine.googleapis.com" --format="value(name)" 2>/dev/null | grep -q "appengine"; then
        echo -e "${GREEN}✓${NC} Enabled"
    else
        echo -e "${YELLOW}!${NC} Not enabled"
        echo -e "  Run: ${BLUE}gcloud services enable appengine.googleapis.com${NC}"
        ((WARNINGS++))
    fi
fi

# Summary
echo -e "\n${BLUE}=== Summary ===${NC}"
if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed!${NC}"
    echo -e "\nYou're ready to deploy. Run: ${BLUE}./deploy.sh${NC}"
    exit 0
else
    if [ $ERRORS -gt 0 ]; then
        echo -e "${RED}✗ Found $ERRORS error(s)${NC}"
    fi
    if [ $WARNINGS -gt 0 ]; then
        echo -e "${YELLOW}! Found $WARNINGS warning(s)${NC}"
    fi
    
    if [ $ERRORS -gt 0 ]; then
        echo -e "\nPlease fix the errors before deploying."
        exit 1
    else
        echo -e "\nYou can proceed with deployment, but it's recommended to address the warnings."
        exit 0
    fi
fi
