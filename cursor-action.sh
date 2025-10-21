#!/bin/bash

# Cursor Action CLI - Quick n8n Integration
# Usage: ./cursor-action.sh nc "Title" "Description" "Priority" "Email" "Name"

API_URL="http://localhost:3000"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

show_help() {
    echo -e "${BLUE}🚀 Cursor Action CLI - n8n Integration Tool${NC}"
    echo ""
    echo "USAGE:"
    echo "  ./cursor-action.sh <command> \"param1\" \"param2\" ..."
    echo ""
    echo "COMMANDS:"
    echo "  nc, nonconformance    Create non-conformance case"
    echo "  risk, coshh, hazard   Create risk assessment"
    echo "  training, course      Create training assignment"
    echo "  review, policy       Create document review"
    echo "  action, task         Create custom action"
    echo ""
    echo "EXAMPLES:"
    echo "  ./cursor-action.sh nc \"Safety Issue\" \"Fix safety guard\" \"High\" \"john@company.com\" \"John Doe\""
    echo "  ./cursor-action.sh risk \"COSHH Assessment\" \"Complete bay 3\" \"High\" \"jane@company.com\" \"Jane Smith\""
    echo "  ./cursor-action.sh training \"Fire Safety\" \"Complete course\" \"Medium\" \"mike@company.com\" \"Mike Johnson\""
    echo "  ./cursor-action.sh review \"Policy Review\" \"Review quality policy\" \"Medium\" \"sarah@company.com\" \"Sarah Wilson\""
    echo "  ./cursor-action.sh action \"Audit Checklist\" \"Complete checklist\" \"High\" \"auditor@company.com\" \"Auditor\" \"HSE/Audit\""
    echo ""
    echo -e "${YELLOW}PRIORITY OPTIONS:${NC} Low, Medium, High, Critical"
    echo -e "${YELLOW}CASE TYPES:${NC} NC, CC, SNC, OFI"
    echo -e "${YELLOW}SEVERITY:${NC} LOW, MEDIUM, HIGH, CRITICAL"
    echo ""
    echo "All actions are automatically sent to your n8n webhook!"
}

execute_command() {
    local command="$*"
    
    echo -e "${BLUE}Executing command:${NC} $command"
    echo ""
    
    response=$(curl -s -X POST "$API_URL/api/cursor-action" \
        -H "Content-Type: application/json" \
        -d "{\"command\": \"$command\"}")
    
    if echo "$response" | grep -q '"success":true'; then
        echo -e "${GREEN}✅ Action created successfully!${NC}"
        
        action_id=$(echo "$response" | grep -o '"actionId":"[^"]*"' | cut -d'"' -f4)
        message=$(echo "$response" | grep -o '"message":"[^"]*"' | cut -d'"' -f4)
        
        echo -e "${GREEN}Action ID:${NC} $action_id"
        echo -e "${GREEN}Message:${NC} $message"
        
        webhook_response=$(echo "$response" | grep -o '"webhookResponse":[^,}]*')
        if [ ! -z "$webhook_response" ]; then
            echo -e "${BLUE}Webhook Response:${NC} $webhook_response"
        fi
    else
        echo -e "${RED}❌ Action creation failed!${NC}"
        
        error=$(echo "$response" | grep -o '"message":"[^"]*"' | cut -d'"' -f4)
        echo -e "${RED}Error:${NC} $error"
        
        if echo "$response" | grep -q '"help"'; then
            echo ""
            echo -e "${YELLOW}Help:${NC}"
            echo "$response" | grep -o '"help":"[^"]*"' | cut -d'"' -f4 | sed 's/\\n/\n/g'
        fi
    fi
}

# Main execution
if [ $# -eq 0 ] || [ "$1" = "help" ] || [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
    show_help
    exit 0
fi

execute_command "$@"
