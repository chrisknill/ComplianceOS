# Employee Dummy Data Summary

## Overview
The database has been seeded with **16 comprehensive employee records** including Chris Knill as CEO for n8n testing. Each employee has been assigned to appropriate groups and departments with realistic organizational hierarchy.

## Employee Structure

### **Executive Level**
- **Chris Knill** (CEO) - `christopher.knill@gmail.com`
  - **Groups**: Management, Directors, Compliance
  - **Department**: Executive
  - **Role**: ADMIN
  - **Phone**: +44 7700 900000
  - **Status**: ACTIVE
  - **Manager**: None (Top Level)

### **Management Level** (All report to Chris Knill)
- **John Smith** (Quality Manager) - `john.smith@complianceos.com`
  - **Groups**: Management, Quality, Compliance
  - **Department**: Quality
  
- **Sarah Jones** (HSE Manager) - `sarah.jones@complianceos.com`
  - **Groups**: Management, HSE, Compliance
  - **Department**: HSE
  
- **Mike Brown** (Operations Manager) - `mike.brown@complianceos.com`
  - **Groups**: Management, Operations
  - **Department**: Operations
  
- **Emma Wilson** (HR Manager) - `emma.wilson@complianceos.com`
  - **Groups**: Management, HR, Admin
  - **Department**: HR
  
- **David Taylor** (Finance Manager) - `david.taylor@complianceos.com`
  - **Groups**: Management, Accounts
  - **Department**: Accounts
  
- **Michael Anderson** (Director of Operations) - `michael.anderson@complianceos.com`
  - **Groups**: Directors, Management, Operations
  - **Department**: Operations

### **Operational Level**

#### **Quality Team** (Reports to John Smith)
- **Lisa Garcia** (Quality Inspector) - `lisa.garcia@complianceos.com`
  - **Groups**: Quality
- **Jennifer Lee** (Quality Analyst) - `jennifer.lee@complianceos.com`
  - **Groups**: Quality
  - **Status**: ON_LEAVE

#### **HSE Team** (Reports to Sarah Jones)
- **James Miller** (HSE Officer) - `james.miller@complianceos.com`
  - **Groups**: HSE

#### **Operations Team** (Reports to Mike Brown)
- **Anna Davis** (Operations Supervisor) - `anna.davis@complianceos.com`
  - **Groups**: Operations

#### **HR Team** (Reports to Emma Wilson)
- **Robert Clark** (HR Coordinator) - `robert.clark@complianceos.com`
  - **Groups**: HR, Admin

#### **Accounts Team** (Reports to David Taylor)
- **Sophie White** (Accounts Assistant) - `sophie.white@complianceos.com`
  - **Groups**: Accounts

#### **IT Team** (Reports to Admin User)
- **Alex Moore** (IT Support Technician) - `alex.moore@complianceos.com`
  - **Groups**: IT

#### **Compliance Team** (Reports to Chris Knill)
- **Jessica Thompson** (Compliance Officer) - `jessica.thompson@complianceos.com`
  - **Groups**: Compliance, Quality

#### **System Administration**
- **Admin User** (System Administrator) - `admin@complianceos.com`
  - **Groups**: Admin, IT
  - **Role**: ADMIN

## Group Distribution

### **Management Group** (7 members)
- Chris Knill, John Smith, Sarah Jones, Mike Brown, Emma Wilson, David Taylor, Michael Anderson

### **Directors Group** (2 members)
- Chris Knill, Michael Anderson

### **Compliance Group** (4 members)
- Chris Knill, John Smith, Sarah Jones, Jessica Thompson

### **Quality Group** (4 members)
- John Smith, Lisa Garcia, Jennifer Lee, Jessica Thompson

### **HSE Group** (2 members)
- Sarah Jones, James Miller

### **Operations Group** (3 members)
- Mike Brown, Anna Davis, Michael Anderson

### **HR Group** (2 members)
- Emma Wilson, Robert Clark

### **Admin Group** (3 members)
- Admin User, Emma Wilson, Robert Clark

### **Accounts Group** (2 members)
- David Taylor, Sophie White

### **IT Group** (2 members)
- Admin User, Alex Moore

## Department Distribution

- **Executive**: 1 (Chris Knill)
- **Quality**: 4 (John Smith, Lisa Garcia, Jennifer Lee, Jessica Thompson)
- **HSE**: 2 (Sarah Jones, James Miller)
- **Operations**: 3 (Mike Brown, Anna Davis, Michael Anderson)
- **HR**: 2 (Emma Wilson, Robert Clark)
- **Accounts**: 2 (David Taylor, Sophie White)
- **IT**: 2 (Admin User, Alex Moore)
- **Compliance**: 1 (Jessica Thompson)

## Testing Features

### **n8n Integration Testing**
- **Chris Knill** (`christopher.knill@gmail.com`) is set up as CEO for testing n8n triggers
- All employees have realistic email addresses for testing email notifications
- Groups are properly configured for Microsoft Graph sync testing

### **Organizational Hierarchy**
- Clear reporting structure with managers and subordinates
- Mixed status (ACTIVE, ON_LEAVE) for testing different scenarios
- Realistic phone numbers and start dates

### **Group Management**
- Employees assigned to multiple relevant groups
- Groups span across departments for cross-functional collaboration
- Ready for Microsoft Graph synchronization testing

## Next Steps

1. **Test Employee Form**: Verify groups are displayed correctly in the employee form
2. **Test Microsoft Graph Sync**: Use Chris Knill's account to test group synchronization
3. **Test n8n Triggers**: Create cases/actions assigned to Chris Knill for email testing
4. **Verify Hierarchy**: Check org chart displays correct reporting relationships

All dummy data is now ready for comprehensive testing of the Microsoft Graph integration and n8n workflows!

