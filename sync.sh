#!/bin/bash
# ComplianceOS Excel to Markdown Sync Script
# Run this script whenever you update the Excel file

echo "🔄 ComplianceOS Excel to Markdown Sync"
echo "======================================"
echo ""

# Check if Excel file exists
if [ ! -f "COMPLIANCEOS_SPECIFICATION.xlsx" ]; then
    echo "❌ Excel file not found: COMPLIANCEOS_SPECIFICATION.xlsx"
    echo "Please make sure the Excel file is in the current directory."
    exit 1
fi

# Check if Excel file is open
if lsof "COMPLIANCEOS_SPECIFICATION.xlsx" >/dev/null 2>&1; then
    echo "⚠️  Excel file is currently open."
    echo "Please close Excel before running the sync script."
    exit 1
fi

# Run the Python sync script
echo "🔄 Syncing Excel to Markdown..."
python3 sync_excel_to_markdown.py

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Sync completed successfully!"
    echo "📄 Markdown file updated: COMPLIANCEOS_COMPLETE_SPECIFICATION.md"
    echo "🕒 Timestamp added to show last update time"
    echo ""
    echo "💡 Next steps:"
    echo "   1. Review the updated markdown file"
    echo "   2. Commit changes to git if needed"
    echo "   3. Share with your team"
else
    echo "❌ Sync failed. Please check the error messages above."
    exit 1
fi
