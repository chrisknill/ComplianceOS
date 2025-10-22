import { Client } from '@microsoft/microsoft-graph-client'
import { AuthenticationProvider } from '@microsoft/microsoft-graph-client'

// Microsoft Graph API integration for Outlook sync
export class MicrosoftGraphService {
  private client: Client
  private accessToken: string

  constructor(accessToken: string) {
    this.accessToken = accessToken
    this.client = Client.initWithMiddleware({
      authProvider: {
        getAccessToken: async () => this.accessToken
      }
    })
  }

  // Get all distribution groups from Outlook
  async getDistributionGroups(): Promise<any[]> {
    try {
      const groups = await this.client.api('/groups').get()
      return groups.value || []
    } catch (error) {
      console.error('Error fetching distribution groups:', error)
      return []
    }
  }

  // Get all security groups from Azure AD
  async getSecurityGroups(): Promise<any[]> {
    try {
      const groups = await this.client.api('/groups').filter("securityEnabled eq true").get()
      return groups.value || []
    } catch (error) {
      console.error('Error fetching security groups:', error)
      return []
    }
  }

  // Get all users from Azure AD
  async getUsers(): Promise<any[]> {
    try {
      const users = await this.client.api('/users').get()
      return users.value || []
    } catch (error) {
      console.error('Error fetching users:', error)
      return []
    }
  }

  // Create a new distribution group
  async createDistributionGroup(groupData: {
    displayName: string
    description: string
    mailNickname: string
    mailEnabled: boolean
    securityEnabled: boolean
  }): Promise<any> {
    try {
      const group = await this.client.api('/groups').post(groupData)
      return group
    } catch (error) {
      console.error('Error creating distribution group:', error)
      throw error
    }
  }

  // Add member to group
  async addMemberToGroup(groupId: string, userId: string): Promise<void> {
    try {
      await this.client.api(`/groups/${groupId}/members/$ref`).post({
        '@odata.id': `https://graph.microsoft.com/v1.0/users/${userId}`
      })
    } catch (error) {
      console.error('Error adding member to group:', error)
      throw error
    }
  }

  // Remove member from group
  async removeMemberFromGroup(groupId: string, userId: string): Promise<void> {
    try {
      await this.client.api(`/groups/${groupId}/members/${userId}/$ref`).delete()
    } catch (error) {
      console.error('Error removing member from group:', error)
      throw error
    }
  }

  // Get group members
  async getGroupMembers(groupId: string): Promise<any[]> {
    try {
      const members = await this.client.api(`/groups/${groupId}/members`).get()
      return members.value || []
    } catch (error) {
      console.error('Error fetching group members:', error)
      return []
    }
  }

  // Update group
  async updateGroup(groupId: string, updateData: any): Promise<any> {
    try {
      const group = await this.client.api(`/groups/${groupId}`).patch(updateData)
      return group
    } catch (error) {
      console.error('Error updating group:', error)
      throw error
    }
  }

  // Delete group
  async deleteGroup(groupId: string): Promise<void> {
    try {
      await this.client.api(`/groups/${groupId}`).delete()
    } catch (error) {
      console.error('Error deleting group:', error)
      throw error
    }
  }

  // Sync employee groups with Outlook
  async syncEmployeeGroups(employeeId: string, groups: string[]): Promise<void> {
    try {
      // Get employee's current groups
      const currentGroups = await this.getEmployeeGroups(employeeId)
      
      // Find groups to add and remove
      const groupsToAdd = groups.filter(g => !currentGroups.includes(g))
      const groupsToRemove = currentGroups.filter(g => !groups.includes(g))

      // Add to new groups
      for (const groupName of groupsToAdd) {
        const group = await this.findGroupByName(groupName)
        if (group) {
          await this.addMemberToGroup(group.id, employeeId)
        }
      }

      // Remove from old groups
      for (const groupName of groupsToRemove) {
        const group = await this.findGroupByName(groupName)
        if (group) {
          await this.removeMemberFromGroup(group.id, employeeId)
        }
      }
    } catch (error) {
      console.error('Error syncing employee groups:', error)
      throw error
    }
  }

  // Helper method to find group by name
  private async findGroupByName(groupName: string): Promise<any> {
    try {
      const groups = await this.getDistributionGroups()
      return groups.find(g => g.displayName === groupName)
    } catch (error) {
      console.error('Error finding group by name:', error)
      return null
    }
  }

  // Helper method to get employee's current groups
  private async getEmployeeGroups(employeeId: string): Promise<string[]> {
    try {
      const groups = await this.getDistributionGroups()
      const employeeGroups: string[] = []
      
      for (const group of groups) {
        const members = await this.getGroupMembers(group.id)
        if (members.some(member => member.id === employeeId)) {
          employeeGroups.push(group.displayName)
        }
      }
      
      return employeeGroups
    } catch (error) {
      console.error('Error getting employee groups:', error)
      return []
    }
  }
}

// OAuth2 authentication helper
export class MicrosoftAuthProvider {
  private clientId: string
  private clientSecret: string
  private tenantId: string
  private redirectUri: string

  constructor(config: {
    clientId: string
    clientSecret: string
    tenantId: string
    redirectUri: string
  }) {
    this.clientId = config.clientId
    this.clientSecret = config.clientSecret
    this.tenantId = config.tenantId
    this.redirectUri = config.redirectUri
  }

  // Get authorization URL
  getAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: this.clientId,
      response_type: 'code',
      redirect_uri: this.redirectUri,
      scope: 'https://graph.microsoft.com/Group.ReadWrite.All https://graph.microsoft.com/User.ReadWrite.All',
      response_mode: 'query',
      state: 'outlook-sync'
    })

    return `https://login.microsoftonline.com/${this.tenantId}/oauth2/v2.0/authorize?${params.toString()}`
  }

  // Exchange code for access token
  async getAccessToken(code: string): Promise<string> {
    try {
      const response = await fetch(`https://login.microsoftonline.com/${this.tenantId}/oauth2/v2.0/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: this.clientId,
          client_secret: this.clientSecret,
          code: code,
          redirect_uri: this.redirectUri,
          grant_type: 'authorization_code',
          scope: 'https://graph.microsoft.com/Group.ReadWrite.All https://graph.microsoft.com/User.ReadWrite.All'
        })
      })

      const data = await response.json()
      return data.access_token
    } catch (error) {
      console.error('Error getting access token:', error)
      throw error
    }
  }

  // Refresh access token
  async refreshAccessToken(refreshToken: string): Promise<string> {
    try {
      const response = await fetch(`https://login.microsoftonline.com/${this.tenantId}/oauth2/v2.0/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: this.clientId,
          client_secret: this.clientSecret,
          refresh_token: refreshToken,
          grant_type: 'refresh_token',
          scope: 'https://graph.microsoft.com/Group.ReadWrite.All https://graph.microsoft.com/User.ReadWrite.All'
        })
      })

      const data = await response.json()
      return data.access_token
    } catch (error) {
      console.error('Error refreshing access token:', error)
      throw error
    }
  }
}

// Webhook handler for Outlook changes
export class OutlookWebhookHandler {
  private onGroupChange: (groupId: string, changeType: string) => Promise<void>
  private onUserChange: (userId: string, changeType: string) => Promise<void>

  constructor(
    onGroupChange: (groupId: string, changeType: string) => Promise<void>,
    onUserChange: (userId: string, changeType: string) => Promise<void>
  ) {
    this.onGroupChange = onGroupChange
    this.onUserChange = onUserChange
  }

  // Handle incoming webhook
  async handleWebhook(notification: any): Promise<void> {
    try {
      for (const change of notification.value) {
        if (change.resource.includes('/groups/')) {
          const groupId = change.resource.split('/groups/')[1].split('/')[0]
          await this.onGroupChange(groupId, change.changeType)
        } else if (change.resource.includes('/users/')) {
          const userId = change.resource.split('/users/')[1].split('/')[0]
          await this.onUserChange(userId, change.changeType)
        }
      }
    } catch (error) {
      console.error('Error handling webhook:', error)
      throw error
    }
  }
}

// Default group configurations
export const DEFAULT_GROUPS = [
  'Management',
  'Admin',
  'Directors',
  'Accounts',
  'HSE',
  'Quality',
  'Compliance',
  'Operations',
  'HR',
  'IT'
]

// Group descriptions
export const GROUP_DESCRIPTIONS = {
  'Management': 'Senior management team',
  'Admin': 'Administrative staff',
  'Directors': 'Board of directors',
  'Accounts': 'Finance and accounting team',
  'HSE': 'Health, Safety and Environment team',
  'Quality': 'Quality management team',
  'Compliance': 'Compliance and regulatory team',
  'Operations': 'Operations and production team',
  'HR': 'Human resources team',
  'IT': 'Information technology team'
}

