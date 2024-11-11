import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import { users } from "../../../../../../helpers/TestData/users/users"
import ARExternalTrainingPage from "../../../../../../helpers/AR/pageObjects/Reports/ARExternalTrainingPage"

describe('C7393 - AR - Regression - External Training - Approve an External Training (cloned)', function(){
    
    beforeEach('Login as an Admin go to External Training', function(){
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, "/admin")
        ARDashboardPage.getShortWait()
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Reports'))).click()
        ARDashboardPage.getShortWait()
        cy.get(ARDashboardPage.getElementByDataName('title')).should('contain.text','Reports')
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('External Training'))
        ARDashboardPage.getMediumWait()
    })

    it('External training page should be displayed', function(){
        cy.get(ARExternalTrainingPage.getSectionHeader()).should('exist')
        cy.get(ARExternalTrainingPage.getSectionHeader()).should('contain.text','External Training')
    })

    it('External Training from the list of External Training Activity', function(){
        cy.get(ARExternalTrainingPage.getSidebarTitles()).should('not.exist')
        // Select first row
        cy.get(ARExternalTrainingPage.getExternalTrainingFirstResultItem()).click()
        ARExternalTrainingPage.getShortWait()
        // Action items should exist
        cy.get(ARExternalTrainingPage.getSidebarTitles()).should('exist')
    })

    it('Status should be displayed Approved', function(){
        // Select first row
        cy.get(ARExternalTrainingPage.getExternalTrainingFirstResultItem()).click()
        ARExternalTrainingPage.getShortWait()
        cy.get(ARExternalTrainingPage.getApproveButton()).should('exist')
        cy.get(ARExternalTrainingPage.getApproveButton()).click()
        ARExternalTrainingPage.getShortWait()
        cy.get(ARExternalTrainingPage.getExternalTrainingFirstResultItemStatus()).should('contain.text','Approved')
    })
})

