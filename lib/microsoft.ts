/**
 * Microsoft Graph API Integration for SharePoint/OneDrive
 * Handles document storage, versioning, and Office Online editing
 */

export interface SharePointConfig {
  tenantId: string
  clientId: string
  clientSecret: string
  siteId: string // SharePoint site ID for document storage
  driveId: string // Default document library drive ID
}

export interface DocumentMetadata {
  id: string
  name: string
  webUrl: string
  downloadUrl: string
  sharepointId: string
  driveId: string
  lastModifiedBy?: string
  lastModifiedDateTime?: string
  size: number
}

/**
 * Generate Office Online edit URL for SharePoint document
 * @param webUrl - SharePoint document web URL
 * @returns URL to edit document in Office Online
 */
export function getOfficeOnlineEditUrl(webUrl: string): string {
  // Office Online URL format for editing
  const encodedUrl = encodeURIComponent(webUrl)
  return `https://word.office.com/edit?url=${encodedUrl}`
}

/**
 * Generate Office Online view URL (read-only)
 * @param webUrl - SharePoint document web URL
 * @returns URL to view document in Office Online
 */
export function getOfficeOnlineViewUrl(webUrl: string): string {
  const encodedUrl = encodeURIComponent(webUrl)
  return `https://word.office.com/view?url=${encodedUrl}`
}

/**
 * Generate deep link to open in desktop Word
 * @param webUrl - SharePoint document web URL
 * @returns ms-word:// protocol URL
 */
export function getWordDesktopUrl(webUrl: string): string {
  const encodedUrl = encodeURIComponent(webUrl)
  return `ms-word:ofe|u=${encodedUrl}`
}

/**
 * Get Microsoft Graph API access token
 * Uses client credentials flow for server-to-server
 */
export async function getMicrosoftGraphToken(config: SharePointConfig): Promise<string> {
  const tokenEndpoint = `https://login.microsoftonline.com/${config.tenantId}/oauth2/v2.0/token`
  
  const body = new URLSearchParams({
    client_id: config.clientId,
    client_secret: config.clientSecret,
    scope: 'https://graph.microsoft.com/.default',
    grant_type: 'client_credentials',
  })

  const response = await fetch(tokenEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  })

  const data = await response.json()
  return data.access_token
}

/**
 * Upload document to SharePoint
 * @param token - Graph API access token
 * @param config - SharePoint configuration
 * @param file - File to upload
 * @param folderPath - Path within document library (e.g., "/Policies")
 * @returns Document metadata
 */
export async function uploadToSharePoint(
  token: string,
  config: SharePointConfig,
  file: File,
  folderPath: string = '/'
): Promise<DocumentMetadata> {
  const uploadUrl = `https://graph.microsoft.com/v1.0/drives/${config.driveId}/root:${folderPath}/${file.name}:/content`
  
  const response = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': file.type,
    },
    body: file,
  })

  const data = await response.json()
  
  return {
    id: data.id,
    name: data.name,
    webUrl: data.webUrl,
    downloadUrl: data['@microsoft.graph.downloadUrl'],
    sharepointId: data.id,
    driveId: config.driveId,
    lastModifiedBy: data.lastModifiedBy?.user?.displayName,
    lastModifiedDateTime: data.lastModifiedDateTime,
    size: data.size,
  }
}

/**
 * Get document metadata from SharePoint
 */
export async function getDocumentMetadata(
  token: string,
  driveId: string,
  itemId: string
): Promise<DocumentMetadata> {
  const url = `https://graph.microsoft.com/v1.0/drives/${driveId}/items/${itemId}`
  
  const response = await fetch(url, {
    headers: { 'Authorization': `Bearer ${token}` },
  })

  const data = await response.json()
  
  return {
    id: data.id,
    name: data.name,
    webUrl: data.webUrl,
    downloadUrl: data['@microsoft.graph.downloadUrl'],
    sharepointId: data.id,
    driveId,
    lastModifiedBy: data.lastModifiedBy?.user?.displayName,
    lastModifiedDateTime: data.lastModifiedDateTime,
    size: data.size,
  }
}

/**
 * Create document from template
 * @param token - Graph API access token
 * @param config - SharePoint configuration
 * @param templateId - SharePoint ID of template document
 * @param newName - Name for new document
 * @param folderPath - Destination folder
 * @returns New document metadata
 */
export async function createFromTemplate(
  token: string,
  config: SharePointConfig,
  templateId: string,
  newName: string,
  folderPath: string = '/'
): Promise<DocumentMetadata> {
  // First, copy the template
  const copyUrl = `https://graph.microsoft.com/v1.0/drives/${config.driveId}/items/${templateId}/copy`
  
  const response = await fetch(copyUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: newName,
      parentReference: {
        driveId: config.driveId,
        path: `/root:${folderPath}`,
      },
    }),
  })

  // Copy is async, get the monitor URL
  const monitorUrl = response.headers.get('Location')
  
  // Poll for completion (simplified - in production, use webhooks)
  let completed = false
  let attempts = 0
  let documentId = ''

  while (!completed && attempts < 10) {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const statusResponse = await fetch(monitorUrl!, {
      headers: { 'Authorization': `Bearer ${token}` },
    })
    
    const statusData = await statusResponse.json()
    
    if (statusData.status === 'completed') {
      completed = true
      documentId = statusData.resourceId
    }
    
    attempts++
  }

  // Get the new document metadata
  return getDocumentMetadata(token, config.driveId, documentId)
}

/**
 * Get version history for a document
 */
export async function getVersionHistory(
  token: string,
  driveId: string,
  itemId: string
): Promise<any[]> {
  const url = `https://graph.microsoft.com/v1.0/drives/${driveId}/items/${itemId}/versions`
  
  const response = await fetch(url, {
    headers: { 'Authorization': `Bearer ${token}` },
  })

  const data = await response.json()
  return data.value || []
}

/**
 * Enable/disable check-out (document locking)
 */
export async function checkOutDocument(
  token: string,
  driveId: string,
  itemId: string
): Promise<void> {
  const url = `https://graph.microsoft.com/v1.0/drives/${driveId}/items/${itemId}/checkout`
  
  await fetch(url, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
  })
}

export async function checkInDocument(
  token: string,
  driveId: string,
  itemId: string,
  comment: string
): Promise<void> {
  const url = `https://graph.microsoft.com/v1.0/drives/${driveId}/items/${itemId}/checkin`
  
  await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ comment }),
  })
}

/**
 * Helper to get folder path based on document type
 */
export function getDocumentFolderPath(type: string, category?: string): string {
  const basePath = '/ComplianceOS'
  
  switch (type) {
    case 'POLICY':
      return `${basePath}/Policies`
    case 'PROCEDURE':
      return `${basePath}/Procedures`
    case 'WORK_INSTRUCTION':
      return `${basePath}/Work Instructions`
    case 'REGISTER':
      return `${basePath}/Registers`
    default:
      return basePath
  }
}

/**
 * Generate SharePoint permission link
 * @param webUrl - Document web URL
 * @param permission - 'edit' or 'view'
 * @returns Sharing link
 */
export function createSharingLink(webUrl: string, permission: 'edit' | 'view' = 'view'): string {
  // In production, use Graph API to create sharing links
  // For now, return the direct URL
  return webUrl
}

