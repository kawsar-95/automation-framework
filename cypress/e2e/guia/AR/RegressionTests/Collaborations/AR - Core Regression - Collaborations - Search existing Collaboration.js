import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARCollaborationAddEditPage from '../../../../../../helpers/AR/pageObjects/Collaborations/ARCollaborationAddEditPage'
import { collaborationDetails, collaborationNames } from '../../../../../../helpers/TestData/Collaborations/collaborationDetails'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../helpers/TestData/users/users'
import ARGridFilter from '../../../../../../helpers/AR/pageObjects/ARGridFilter'

describe('C7401 - AR - Collaborations - Search existing Collaboration', function(){
    
    before('Login as and Admin and click on Engage from the left panel', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getMediumWait()
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Engage'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Collaborations'))
        cy.intercept('/api/rest/v2/admin/reports/collaborations/operations').as('getCollaborations').wait('@getCollaborations')
    })
    
    it('Check the result after applying the filter', () => {
        //Click on Add filter on collaboration page
        ARCollaborationAddEditPage.getShortWait()
        // Filter name criteria, finally remove the filter
        cy.wrap(ARCollaborationAddEditPage.AddFilter('Name', 'Contains', collaborationNames.A_COLLABORATION_NAME))
        ARCollaborationAddEditPage.getLShortWait()
        cy.get(ARCollaborationAddEditPage.getGridTable()).its('length').should('be.gt', 0)
        ARGridFilter.removeFilterByIndex(0)
        ARGridFilter.getLShortWait()

        // Filter by description, finally remove the filter
        cy.wrap(ARCollaborationAddEditPage.AddFilter('Description', 'Contains', collaborationDetails.A_COLLABORATION_DESCRIPTION))
        ARCollaborationAddEditPage.getMediumWait()
        cy.get(ARCollaborationAddEditPage.getGridTable()).its('length').should('be.gt', 0)
        ARGridFilter.removeFilterByIndex(0)
        ARGridFilter.getLShortWait()

        // Filter by Date Added
        // cy.wrap(ARCollaborationAddEditPage.AddFilterColb('Date Added', 'Before', commonDetails.timestamp.slice(0,10)))
        cy.wrap(ARCollaborationAddEditPage.AddRadioFilter('Date Added', 'Before', commonDetails.timestamp.slice(0, 10))) 
        ARCollaborationAddEditPage.getMediumWait()
        cy.get(ARCollaborationAddEditPage.getGridTable()).its('length').should('be.gt', 0)
        // Asserting should be able to filtered the results according to selected criteria.
        cy.get(ARCollaborationAddEditPage.getGridTable()).its('length').should('be.gt', 0)  
    })
})