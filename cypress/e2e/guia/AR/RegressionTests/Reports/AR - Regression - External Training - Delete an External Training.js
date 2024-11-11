import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import { users } from "../../../../../../helpers/TestData/users/users"
import ARExternalTrainingPage from "../../../../../../helpers/AR/pageObjects/Reports/ARExternalTrainingPage"

describe('C7391 - AR - Regression - External Training - Delete an External Training - Cancel', function(){
    
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

    it('Delete External Training popup will open and Cancel', function(){
        // Select first row
        cy.get(ARExternalTrainingPage.getExternalTrainingFirstResultItem()).click()
        ARExternalTrainingPage.getShortWait()
        cy.get(ARExternalTrainingPage.getDeleteButton()).should('exist')
        cy.get(ARExternalTrainingPage.getDeleteButton()).click()
        
        // Should open modal
        cy.get(ARExternalTrainingPage.getConfirmModal()).should('be.visible')
        cy.get(ARExternalTrainingPage.getConfirmModalMessage()).should('contain', 'Are you sure you want to delete this submission?')
        cy.get(ARExternalTrainingPage.getConfirmModal()).find(ARExternalTrainingPage.getConfirmModalBtnLinks()).should('contain', 'Cancel')
        cy.get(ARExternalTrainingPage.getConfirmModal()).find(ARExternalTrainingPage.getConfirmModalBtnLinks()).should('contain', 'OK')
        
        cy.get(ARExternalTrainingPage.getConfirmModalCancelButton()).click()
        //Navigate should be External Training Page
        cy.get(ARExternalTrainingPage.getSectionHeader()).should('contain.text','External Training')
    })

    it('Delete External Training popup will open and Delete', function(){
        // Select first row
        cy.get(ARExternalTrainingPage.getExternalTrainingFirstResultItem()).click()
        ARExternalTrainingPage.getShortWait()
        cy.get(ARExternalTrainingPage.getDeleteButton()).should('exist')
        cy.get(ARExternalTrainingPage.getDeleteButton()).click()
        
        // Should open modal
        cy.get(ARExternalTrainingPage.getConfirmModal()).should('be.visible')
        cy.get(ARExternalTrainingPage.getConfirmModalMessage()).should('contain', 'Are you sure you want to delete this submission?')
        cy.get(ARExternalTrainingPage.getConfirmModal()).find(ARExternalTrainingPage.getConfirmModalBtnLinks()).should('contain', 'Cancel')
        cy.get(ARExternalTrainingPage.getConfirmModal()).find(ARExternalTrainingPage.getConfirmModalBtnLinks()).should('contain', 'OK')

        //cy.get(ARExternalTrainingPage.getConfirmModalOkButton()).click()
        // This will delete External Traning so Commenting for the time being
        // External Training should be deleted successfully.
    })
})

