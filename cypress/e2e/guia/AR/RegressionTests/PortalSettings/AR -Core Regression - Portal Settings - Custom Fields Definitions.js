import ARDashboardAccountMenu from '../../../../../../helpers/AR/pageObjects/Menu/ARDashboardAccount.menu'
import { users } from '../../../../../../helpers/TestData/users/users'
import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import AREditClientInfoPage from '../../../../../../helpers/AR/pageObjects/PortalSettings/AREditClientInfoPage'

const fieldName = 'Test Column Name'
const listItemName = 'Test List Item'

describe('C7608 - AUT-757 - AR - Core Regression - Portal Settings - Custom Fields Definitions',  () => {
 
  beforeEach('Login with system admin', () => {
    cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
    arDashboardPage.getShortWait()
    cy.get(arDashboardPage.getElementByDataNameAttribute(arDashboardPage.getAccountBtn())).click()
    cy.get(ARDashboardAccountMenu.getPortalSettingsBtn()).should("exist").click()
    arDashboardPage.getShortWait()
  })

  after('Delete custom fields', () => {
    cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
    arDashboardPage.getShortWait()
    cy.get(arDashboardPage.getElementByDataNameAttribute(arDashboardPage.getAccountBtn())).click()
    cy.get(ARDashboardAccountMenu.getPortalSettingsBtn()).should('exist').click()
    arDashboardPage.getShortWait()
    cy.get(AREditClientInfoPage.getTabsMenu()).contains('Custom Fields').click()
    arDashboardPage.getShortWait()
    cy.get(ARDashboardAccountMenu.getDiffarentCustomSection()).within(() => {
      cy.get(ARDashboardAccountMenu.getCustomTopParRemoveBtn()).last().within(() =>{
        cy.get(ARDashboardAccountMenu.getCustomChieldRemoveBtn()).within(() => {
          cy.get(ARDashboardAccountMenu.getCustomRemoveBtn()).click({force:true})
        })
      })
    })
    arDashboardPage.getLongWait()
    cy.get(AREditClientInfoPage.getSaveBtn()).contains('Save').click()
    arDashboardPage.getShortWait()
  })

  it('Verify the the custom fields should be visible in the Fields list after saving', () => {
    cy.get(AREditClientInfoPage.getTabsMenu()).contains('Custom Fields').click()
    AREditClientInfoPage.getShortWait()
    
    // Asserting Text field
    cy.get('a').contains('Add Field').click()
    cy.get(ARDashboardAccountMenu.getDiffarentCustomSection()).within(() => {
      cy.get(ARDashboardAccountMenu.getCustomListGroup()).last().within(() => {
        cy.get(ARDashboardAccountMenu.getCustomFirstInputField()).should('exist')
        cy.get(ARDashboardAccountMenu.getCustomFirstInputField()).clear().type(fieldName)
      })
    })

    // Asserting True/False, Number, Decimal, Date, Date & Time
    cy.get(ARDashboardAccountMenu.getDiffarentCustomSection()).within(() => {
      cy.get(ARDashboardAccountMenu.getCustomListGroup()).last().within(() => {
        cy.get(ARDashboardAccountMenu.getCustomFirstDropdownField()).should('exist')
      })
    })
    
    // Asserting hidden, optional, required, Read Only
    cy.get(ARDashboardAccountMenu.getDiffarentCustomSection()).within(() => {
      cy.get(ARDashboardAccountMenu.getCustomListGroup()).last().within(() => {
          cy.get(ARDashboardAccountMenu.getCustomFirstOptionalField()).should('exist')
      })
    })
    
    // Add some list items
    cy.get(ARDashboardAccountMenu.getDiffarentCustomSection()).within(() => {
      cy.get(ARDashboardAccountMenu.getCustomListGroup()).last().within(() => {
        cy.get(ARDashboardAccountMenu.getCustomAddlistBtn()).should('exist').click()
        cy.get(ARDashboardAccountMenu.getCustomFieldListItem()).clear().type(listItemName)
      })
    })    
    ARDashboardAccountMenu.getShortWait()

    // Private Field toggle (On, Off) 
    cy.get(ARDashboardAccountMenu.getDiffarentCustomSection()).within(() => {
      cy.get(ARDashboardAccountMenu.getCustomListGroup()).last().within(() => {
        cy.get(ARDashboardAccountMenu.getCustomCheckedBtn()).should('exist').click()
      })
    })
    // Save the custom fields
    ARDashboardAccountMenu.getShortWait()

    cy.get(AREditClientInfoPage.getSaveBtn()).contains('Save').click()
    ARDashboardAccountMenu.getMediumWait()
    
    // Navigate to custom reports page.
    cy.get(arDashboardPage.getElementByAriaLabelAttribute(ARDashboardAccountMenu.getCustomReportMenu())).click()
    cy.wrap(arDashboardPage.getMenuItemOptionByName(ARDashboardAccountMenu.getLeftContantMenuLA()))
    // Asserting Custom fields should be visible in Fields List
    cy.get(arDashboardPage.getDisplayColumns()).click({force:true})
    cy.get(arDashboardPage.getChkBoxLabel()).contains(fieldName).click()
    ARDashboardAccountMenu.getLongWait()
  })

  it('Verify tht the custom field should not be visible in Fields list after deletion', () => {
    cy.get(AREditClientInfoPage.getTabsMenu()).contains('Custom Fields').click()
    ARDashboardAccountMenu.getShortWait()
    cy.get(ARDashboardAccountMenu.getDiffarentCustomSection()).within(() => {
      cy.get(ARDashboardAccountMenu.getCustomTopParRemoveBtn()).last().within(() =>{
        cy.get(ARDashboardAccountMenu.getCustomChieldRemoveBtn()).within(() => {
          cy.get(ARDashboardAccountMenu.getCustomRemoveBtn()).click({force:true})
        })
      })
    })
    ARDashboardAccountMenu.getLongWait()
    cy.get(AREditClientInfoPage.getSaveBtn()).contains('Save').click()
    ARDashboardAccountMenu.getShortWait()
    // Navigate to custom reports page.
    cy.get(arDashboardPage.getElementByAriaLabelAttribute(ARDashboardAccountMenu.getCustomReportMenu())).click()
    cy.wrap(arDashboardPage.getMenuItemOptionByName(ARDashboardAccountMenu.getLeftContantMenuLA()))
    // Asserting Custom fields should not be visible in Fields List
    cy.get(arDashboardPage.getDisplayColumns()).click({force:true})
    cy.get(arDashboardPage.getChkBoxLabel()).contains(fieldName).should('not.exist')
    ARDashboardAccountMenu.getLongWait()
  })

  it('Verify that from the Custom Reports page added the custom fields are displayed in order they were added', () => {
    cy.get(AREditClientInfoPage.getTabsMenu()).contains('Custom Fields').click()
    ARDashboardAccountMenu.getShortWait()
    cy.get('a').contains('Add Field').click()
    cy.get(ARDashboardAccountMenu.getDiffarentCustomSection()).within(() => {
      cy.get(ARDashboardAccountMenu.getCustomListGroup()).last().within(() => {
        cy.get(ARDashboardAccountMenu.getCustomFirstInputField()).should('exist')
        cy.get(ARDashboardAccountMenu.getCustomFirstInputField()).clear().type(fieldName)
      })
    })
    
    // Asserting True/False, Number, Decimal, Date, Date & Time
    cy.get(ARDashboardAccountMenu.getDiffarentCustomSection()).within(() => {
      cy.get(ARDashboardAccountMenu.getCustomListGroup()).last().within(() => {
        cy.get(ARDashboardAccountMenu.getCustomFirstDropdownField()).should('exist')
      })
    })
    
    // Asserting hidden, optional, required, Read Only
    cy.get(ARDashboardAccountMenu.getDiffarentCustomSection()).within(() => {
      cy.get(ARDashboardAccountMenu.getCustomListGroup()).last().within(() => {
          cy.get(ARDashboardAccountMenu.getCustomFirstOptionalField()).should('exist')
      })
    })
    
    // Add some list items
    cy.get(ARDashboardAccountMenu.getDiffarentCustomSection()).within(() => {
      cy.get(ARDashboardAccountMenu.getCustomListGroup()).last().within(() => {
        cy.get(ARDashboardAccountMenu.getCustomAddlistBtn()).should('exist').click()
        cy.get(ARDashboardAccountMenu.getCustomFieldListItem()).clear().type(listItemName)
      })
    })
    ARDashboardAccountMenu.getShortWait()
    
    // Private Field toggle (On, Off) 
    cy.get(ARDashboardAccountMenu.getDiffarentCustomSection()).within(() => {
      cy.get(ARDashboardAccountMenu.getCustomListGroup()).last().within(() => {
        cy.get(ARDashboardAccountMenu.getCustomCheckedBtn()).should('exist').click()
      })
    })
    ARDashboardAccountMenu.getShortWait()
    // Save the custom fields
    cy.get(AREditClientInfoPage.getSaveBtn()).contains('Save').click()
    ARDashboardAccountMenu.getShortWait()
    // Navigate to custom reports page.
    ARDashboardAccountMenu.getShortWait()
    cy.get(arDashboardPage.getElementByAriaLabelAttribute(ARDashboardAccountMenu.getCustomReportMenu())).click()
    cy.wrap(arDashboardPage.getMenuItemOptionByName(ARDashboardAccountMenu.getLeftContantMenuLA()))
    // Asserting Custom fields should be visible in Fields List
    cy.get(arDashboardPage.getDisplayColumns()).click({force:true})
    cy.get(arDashboardPage.getChkBoxLabel()).contains(fieldName).click()
    ARDashboardAccountMenu.getLongWait()
    // Save this custom fields in the custom report
    cy.get(ARDashboardAccountMenu.getCustomReportParentHeader()).within(() => {
      cy.get(arDashboardPage.getElementByDataNameAttribute(ARDashboardAccountMenu.getCustomReportDataName())).should('exist')
      ARDashboardAccountMenu.getShortWait()
      cy.get(arDashboardPage.getElementByDataNameAttribute(ARDashboardAccountMenu.getCustomReportDataName())).click({force: true})
    })
    ARDashboardAccountMenu.getLongWait()
    cy.get(ARDashboardAccountMenu.getCustomColumnHeader()).within(() => {
      cy.get(ARDashboardAccountMenu.getCustomReportLeftListLebel()).contains(fieldName).should('exist')
    })
  })

  it('Under Portal Settings create two identical same name, data type etc. Save the custom fields', () => {
    cy.get(AREditClientInfoPage.getTabsMenu()).contains('Custom Fields').click()
    ARDashboardAccountMenu.getShortWait()
    cy.get('a').contains('Add Field').click()
    cy.get(ARDashboardAccountMenu.getDiffarentCustomSection()).within(() => {
      cy.get(ARDashboardAccountMenu.getCustomListGroup()).last().within(() => {
        cy.get(ARDashboardAccountMenu.getCustomFirstInputField()).should('exist')
        cy.get(ARDashboardAccountMenu.getCustomFirstInputField()).clear().type(fieldName)
      })
    })
    
    // Asserting True/False, Number, Decimal, Date, Date & Time
    cy.get(ARDashboardAccountMenu.getDiffarentCustomSection()).within(() => {
      cy.get(ARDashboardAccountMenu.getCustomListGroup()).last().within(() => {
        cy.get(ARDashboardAccountMenu.getCustomFirstDropdownField()).should('exist')
      })
    })
    
    // Asserting hidden, optional, required, Read Only
    cy.get(ARDashboardAccountMenu.getDiffarentCustomSection()).within(() => {
      cy.get(ARDashboardAccountMenu.getCustomListGroup()).last().within(() => {
          cy.get(ARDashboardAccountMenu.getCustomFirstOptionalField()).should('exist')
      })
    })
    
    // Add a list items
    cy.get(ARDashboardAccountMenu.getDiffarentCustomSection()).within(() => {
      cy.get(ARDashboardAccountMenu.getCustomListGroup()).last().within(() => {
        cy.get(ARDashboardAccountMenu.getCustomAddlistBtn()).should('exist').click()
        cy.get(ARDashboardAccountMenu.getCustomFieldListItem()).clear().type(listItemName)
      })
    })
    ARDashboardAccountMenu.getShortWait()
    
    // Private Field toggle (On, Off) 
    cy.get(ARDashboardAccountMenu.getDiffarentCustomSection()).within(() => {
      cy.get(ARDashboardAccountMenu.getCustomListGroup()).last().within(() => {
        cy.get(ARDashboardAccountMenu.getCustomCheckedBtn()).should('exist').click()
      })
    })    
    ARDashboardAccountMenu.getShortWait()

    // Save the custom fields
    cy.get(AREditClientInfoPage.getSaveBtn()).contains('Save').click()
    ARDashboardAccountMenu.getShortWait()
    
    // Navigate to custom reports page.
    cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
    ARDashboardAccountMenu.getShortWait()
    cy.get(arDashboardPage.getElementByAriaLabelAttribute(ARDashboardAccountMenu.getCustomReportMenu())).click()
    cy.wrap(arDashboardPage.getMenuItemOptionByName(ARDashboardAccountMenu.getLeftContantMenuLA()))
    // Asserting Custom fields should be visible in Fields List
    cy.get(arDashboardPage.getDisplayColumns()).click({force:true})
    cy.get(arDashboardPage.getChkBoxLabel()).contains(fieldName).click()
    ARDashboardAccountMenu.getLongWait()
    // Save this custom fields in the custom report
    cy.get(ARDashboardAccountMenu.getCustomReportParentHeader()).within(() => {
      cy.get(arDashboardPage.getElementByDataNameAttribute(ARDashboardAccountMenu.getCustomReportDataName())).should('exist')
      ARDashboardAccountMenu.getShortWait()
      cy.get(arDashboardPage.getElementByDataNameAttribute(ARDashboardAccountMenu.getCustomReportDataName())).click({force: true})
    })
    ARDashboardAccountMenu.getLongWait()
    cy.get(ARDashboardAccountMenu.getCustomColumnHeader()).within(() => {
      cy.get(ARDashboardAccountMenu.getCustomReportLeftListLebel()).contains(fieldName).should('exist')
    })
  })

  it('Under Portal settings delete some fields that were previously part of a saved report definition', () => {
    cy.get(AREditClientInfoPage.getTabsMenu()).contains('Custom Fields').click()
    ARDashboardAccountMenu.getShortWait()
    cy.get(ARDashboardAccountMenu.getDiffarentCustomSection()).within(() => {
      cy.get(ARDashboardAccountMenu.getCustomTopParRemoveBtn()).last().within(() =>{
        cy.get(ARDashboardAccountMenu.getCustomChieldRemoveBtn()).within(() => {
          cy.get(ARDashboardAccountMenu.getCustomRemoveBtn()).click({force:true})
        })
      })
    })
    ARDashboardAccountMenu.getLongWait()
    cy.get(AREditClientInfoPage.getSaveBtn()).contains('Save').click()
    ARDashboardAccountMenu.getShortWait()
  })
})
