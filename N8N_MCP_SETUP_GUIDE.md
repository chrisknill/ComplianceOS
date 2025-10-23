# n8n MCP Setup Guide for Cursor

## ✅ Current Status
- ✅ n8n-mcp package is installed and working (v2.20.8)
- ✅ MCP configuration file created at `.cursor/mcp.json`
- ✅ 541 n8n nodes loaded in database
- ✅ 23 MCP tools available

## 🔧 Steps to Enable MCP Tools in Cursor

### 1. Enable MCP Server in Cursor
1. **Open Cursor Settings**:
   - Press `Cmd+,` (macOS) or `Ctrl+,` (Windows/Linux)
   - Or go to `Cursor > Preferences` (macOS) or `File > Preferences` (Windows/Linux)

2. **Search for MCP**:
   - In the settings search bar, type "mcp"
   - Look for "MCP Servers" or "Model Context Protocol"

3. **Enable MCP**:
   - Toggle "Enable MCP Servers" to ON
   - Or click "Enable MCP Server" button if available

### 2. Restart Cursor
- Close Cursor completely
- Reopen Cursor
- Open your ComplianceOS project

### 3. Verify MCP Connection
- In the chat, you should now see n8n MCP tools available
- Try asking: "List available n8n nodes" or "Create a workflow"

### 4. Alternative: Manual MCP Configuration
If the above doesn't work, try this manual approach:

1. **Open Cursor Settings**
2. **Go to Extensions** or **Features**
3. **Look for "MCP" or "Model Context Protocol"**
4. **Add Server Configuration**:
   ```json
   {
     "mcpServers": {
       "n8n-mcp": {
         "command": "npx",
         "args": ["n8n-mcp"],
         "env": {
           "MCP_MODE": "stdio",
           "LOG_LEVEL": "error",
           "DISABLE_CONSOLE_OUTPUT": "true",
           "N8N_API_URL": "https://chrisknill.app.n8n.cloud",
           "N8N_API_KEY": "your-api-key-here"
         }
       }
     }
   }
   ```

### 5. Test MCP Tools
Once enabled, you should be able to use commands like:
- "Create an n8n workflow for email automation"
- "List all Slack nodes in n8n"
- "Find templates for webhook processing"
- "Validate this workflow configuration"

## 🚨 Troubleshooting

### If MCP Tools Still Not Available:

1. **Check Cursor Version**:
   - Ensure you're using a recent version of Cursor
   - MCP support was added in recent updates

2. **Check Project Configuration**:
   - Ensure `.cursor/mcp.json` exists in your project root
   - Verify the JSON syntax is correct

3. **Manual Server Start**:
   ```bash
   # Test MCP server manually
   npx n8n-mcp
   ```

4. **Check Cursor Logs**:
   - Look for MCP-related errors in Cursor's developer console
   - Press `Cmd+Shift+I` (macOS) or `Ctrl+Shift+I` (Windows/Linux)

### Alternative: Use n8n MCP Directly
If Cursor MCP integration doesn't work, you can still use the n8n MCP tools directly:

```bash
# Install globally
npm install -g n8n-mcp

# Run MCP server
npx n8n-mcp

# Or use the local installation
cd /Users/chrisknill/Documents/n8n-mcp
npm start
```

## 📋 Available MCP Tools (23 total)

### Core Tools:
- `tools_documentation` - Get documentation for any MCP tool
- `list_nodes` - List all n8n nodes with filtering
- `get_node_info` - Get comprehensive node information
- `get_node_essentials` - Get essential properties (10-20 instead of 200+)
- `search_nodes` - Full-text search across node documentation
- `search_node_properties` - Find specific properties within nodes
- `list_ai_tools` - List all AI-capable nodes
- `get_node_as_tool_info` - Get guidance on using any node as AI tool

### Template Tools:
- `list_templates` - Browse 2,500+ templates
- `search_templates` - Text search across templates
- `search_templates_by_metadata` - Advanced filtering
- `get_template` - Get complete workflow JSON
- `get_templates_for_task` - Curated templates for tasks

### Validation Tools:
- `validate_workflow` - Complete workflow validation
- `validate_workflow_connections` - Structure validation
- `validate_workflow_expressions` - Expression validation
- `validate_node_operation` - Node configuration validation
- `validate_node_minimal` - Quick required fields check

### Advanced Tools:
- `get_property_dependencies` - Analyze property visibility conditions
- `get_node_documentation` - Get parsed documentation from n8n-docs
- `get_database_statistics` - View database metrics and coverage

## 🎯 Next Steps
Once MCP tools are enabled, you can:
1. Create n8n workflows directly in chat
2. Validate workflow configurations
3. Search for templates and examples
4. Get detailed node documentation
5. Build complex automation workflows

The MCP server is ready and waiting - we just need Cursor to connect to it!

