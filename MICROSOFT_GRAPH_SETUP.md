# Microsoft Graph Integration Setup Guide

This guide will help you set up two-way synchronization between ComplianceOS and Microsoft Outlook/Azure AD for employee groups and resources.

## Prerequisites

- Microsoft 365/Azure AD tenant
- Admin access to Azure AD
- ComplianceOS application deployed

## Step 1: Register Application in Azure AD

1. **Go to Azure Portal**
   - Navigate to [Azure Portal](https://portal.azure.com)
   - Go to "Azure Active Directory" → "App registrations"
   - Click "New registration"

2. **Configure Application**
   - **Name**: `ComplianceOS Integration`
   - **Supported account types**: `Accounts in this organizational directory only`
   - **Redirect URI**: `https://your-domain.com/api/microsoft-graph/auth/callback`
   - Click "Register"

3. **Note Application Details**
   - **Application (client) ID**: Copy this value
   - **Directory (tenant) ID**: Copy this value

## Step 2: Configure API Permissions

1. **Add Permissions**
   - Go to "API permissions" in your app registration
   - Click "Add a permission"
   - Select "Microsoft Graph"
   - Choose "Application permissions" (not Delegated)
   - Add the following permissions:
     - `Group.ReadWrite.All`
     - `User.ReadWrite.All`
     - `Directory.ReadWrite.All`

2. **Grant Admin Consent**
   - Click "Grant admin consent for [Your Organization]"
   - Confirm the permissions

## Step 3: Create Client Secret

1. **Generate Secret**
   - Go to "Certificates & secrets"
   - Click "New client secret"
   - Add description: `ComplianceOS Integration Secret`
   - Choose expiration (recommend 24 months)
   - Click "Add"

2. **Copy Secret Value**
   - **Important**: Copy the secret value immediately (you won't see it again)
   - Store it securely

## Step 4: Configure Environment Variables

Add these environment variables to your `.env.local` file:

```env
# Microsoft Graph Configuration
MICROSOFT_CLIENT_ID=your-application-client-id
MICROSOFT_CLIENT_SECRET=your-client-secret-value
MICROSOFT_TENANT_ID=your-tenant-id
MICROSOFT_REDIRECT_URI=https://your-domain.com/api/microsoft-graph/auth/callback
MICROSOFT_GRAPH_ACCESS_TOKEN=your-access-token

# Webhook Configuration
MICROSOFT_WEBHOOK_SECRET=your-webhook-secret
```

## Step 5: Get Access Token

1. **Use Microsoft Graph Explorer**
   - Go to [Graph Explorer](https://developer.microsoft.com/en-us/graph/graph-explorer)
   - Sign in with your admin account
   - Select permissions: `Group.ReadWrite.All`, `User.ReadWrite.All`
   - Click "Generate Token"
   - Copy the access token

2. **Or Use PowerShell**
   ```powershell
   # Install Microsoft Graph PowerShell module
   Install-Module Microsoft.Graph -Scope CurrentUser

   # Connect to Microsoft Graph
   Connect-MgGraph -Scopes "Group.ReadWrite.All", "User.ReadWrite.All"

   # Get access token
   $token = (Get-MgContext).AccessToken
   Write-Host $token
   ```

## Step 6: Set Up Webhook Subscriptions

1. **Create Webhook Subscription**
   ```bash
   curl -X POST "https://graph.microsoft.com/v1.0/subscriptions" \
   -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
   -H "Content-Type: application/json" \
   -d '{
     "changeType": "created,updated,deleted",
     "notificationUrl": "https://your-domain.com/api/microsoft-graph/webhook",
     "resource": "/groups",
     "expirationDateTime": "2024-12-31T23:59:59.999Z",
     "clientState": "ComplianceOS-Groups"
   }'
   ```

2. **Create User Webhook Subscription**
   ```bash
   curl -X POST "https://graph.microsoft.com/v1.0/subscriptions" \
   -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
   -H "Content-Type: application/json" \
   -d '{
     "changeType": "created,updated,deleted",
     "notificationUrl": "https://your-domain.com/api/microsoft-graph/webhook",
     "resource": "/users",
     "expirationDateTime": "2024-12-31T23:59:59.999Z",
     "clientState": "ComplianceOS-Users"
   }'
   ```

## Step 7: Database Migration

Run the database migration to add the new fields:

```bash
npx prisma db push
```

## Step 8: Test Integration

1. **Test Group Sync**
   - Go to ComplianceOS → Employees
   - Edit an employee
   - Add them to groups (Management, HSE, Quality, etc.)
   - Save the employee
   - Check Outlook to verify groups are updated

2. **Test Reverse Sync**
   - Add/remove employee from groups in Outlook
   - Check ComplianceOS to verify changes are reflected

## Default Groups

The system comes with these default groups:

- **Management**: Senior management team
- **Admin**: Administrative staff
- **Directors**: Board of directors
- **Accounts**: Finance and accounting team
- **HSE**: Health, Safety and Environment team
- **Quality**: Quality management team
- **Compliance**: Compliance and regulatory team
- **Operations**: Operations and production team
- **HR**: Human resources team
- **IT**: Information technology team

## Troubleshooting

### Common Issues

1. **"Insufficient privileges" error**
   - Ensure admin consent is granted for all permissions
   - Check that the application has the correct permissions

2. **Webhook not receiving notifications**
   - Verify the webhook URL is accessible from Microsoft's servers
   - Check that the webhook endpoint is properly configured
   - Ensure the subscription is active and not expired

3. **Token expired**
   - Access tokens expire after 1 hour
   - Implement token refresh logic
   - Consider using application permissions instead of delegated permissions

### Logs

Check the application logs for detailed error messages:

```bash
# View logs
tail -f logs/application.log

# Check Microsoft Graph API calls
grep "Microsoft Graph" logs/application.log
```

## Security Considerations

1. **Store secrets securely**
   - Use environment variables
   - Never commit secrets to version control
   - Rotate secrets regularly

2. **Limit permissions**
   - Only request necessary permissions
   - Use application permissions when possible
   - Regularly review and audit permissions

3. **Monitor access**
   - Enable Azure AD audit logs
   - Monitor API usage
   - Set up alerts for unusual activity

## Support

For issues with Microsoft Graph integration:

1. Check the [Microsoft Graph documentation](https://docs.microsoft.com/en-us/graph/)
2. Review the [Graph Explorer](https://developer.microsoft.com/en-us/graph/graph-explorer) for API testing
3. Contact Microsoft support for Azure AD issues
4. Check ComplianceOS logs for application-specific errors

## Next Steps

Once the integration is working:

1. **Customize Groups**: Add your organization-specific groups
2. **Set Up Automation**: Configure automatic group assignments based on department/role
3. **Monitor Sync**: Set up monitoring and alerts for sync failures
4. **Train Users**: Educate users on the new group management features

