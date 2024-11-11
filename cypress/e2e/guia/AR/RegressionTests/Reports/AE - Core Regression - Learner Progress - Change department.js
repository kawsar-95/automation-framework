import { users } from '../../../../../../helpers/TestData/users/users'
import ARDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import {userDetails}  from '../../../../../../helpers/TestData/users/UserDetails'
import { departments } from '../../../../../../helpers/TestData/Department/departments'
import ARUserPage from '../../../../../../helpers/AR/pageObjects/User/ARUserPage'
import ARUserAddEditPage from '../../../../../../helpers/AR/pageObjects/User/ARUserAddEditPage'
import arSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import ARDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import arLearnerProgressReportPage from '../../../../../../helpers/AR/pageObjects/Reports/ARLearnerProgressReportPage'
import arCBAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/CB/ARCBAddEditPage'

describe('C7278 - AE Regression - Learner Progress - Change department', function () {
    before('Create a Learner user for the test', () => {
        // Login as an Admin and navigate to the Dashboard page
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getUsersReport()
        // Create a new user
        cy.wrap(ARUserAddEditPage.WaitForElementStateToChange(ARUserAddEditPage.getAddEditMenuActionsByName('Add User'), 1000))
        cy.get(ARUserAddEditPage.getAddEditMenuActionsByName('Add User')).click()
        // Input general fields
        cy.get(ARUserAddEditPage.getFirstNameTxtF()).type(userDetails.firstName)
        cy.get(ARUserAddEditPage.getLastNameTxtF()).type(userDetails.lastName)
        cy.get(ARUserAddEditPage.getUsernameTxtF()).type(userDetails.username)
        cy.get(ARUserAddEditPage.getPasswordTxtF()).type(userDetails.validPassword)
        cy.get(ARUserAddEditPage.getConfirmPasswordTxtF()).type(userDetails.validPassword)
        cy.get(ARUserAddEditPage.getDepartmentBtn()).click()
        arSelectModal.SearchAndSelectFunction([departments.dept_top_name])
        arLearnerProgressReportPage.getShortWait()
        cy.get(ARUserAddEditPage.getSaveBtn()).click()
        cy.get(ARUserAddEditPage.getToastSuccessMsg()).should('contain', 'User has been created successfully.')
        arLearnerProgressReportPage.getMediumWait()
    })

    after('Delete the new user as part of clean up',() => {
        // Login as an Admin and navigate to the Dashboard page
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getLongWait()

        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Users'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Users'))
        ARDashboardPage.getShortWait()
        cy.wrap(ARUserPage.AddFilter('Username', 'Contains', userDetails.username))
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getGridTable()).eq(0).click()
        ARDashboardPage.getShortWait()
        cy.wrap(ARUserPage.WaitForElementStateToChange(ARUserPage.getAddEditMenuActionsByName('Delete'), 5000))
        cy.get(ARUserPage.getAddEditMenuActionsByName('Delete')).click()
        cy.get(ARDashboardPage.getElementByDataNameAttribute(ARDeleteModal.getDeleteBtn())).click() 
    })

    it("Edit a Learner from the existing Learner Progress report to change Department and finally save", () => {
        // Login as an Admin and navigate to the Dashboard page
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getMediumWait()

        // Click on reports from left hand panel 
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Reports'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Learner Progress'))
        arLearnerProgressReportPage.getLongWait()
        
        // Assert that the Learner Progress page should be opened.
        cy.get(arLearnerProgressReportPage.getPageHeaderTitle()).should('have.text', "Learner Progress")
        arLearnerProgressReportPage.getShortWait()
        
        // Select any existing learner from learner progress list
        cy.wrap(arLearnerProgressReportPage.AddFilter('Username', 'Contains', userDetails.username))
        arLearnerProgressReportPage.getLongWait()
        cy.get(ARDashboardPage.getGridTable()).eq(0).click()
        
        // Assert that the Action items should be displayed
        cy.get(arLearnerProgressReportPage.getActionContextMenu()).should('exist').and('be.visible')

        // Click on edit user      
        arLearnerProgressReportPage.getShortWait()
        cy.get(arLearnerProgressReportPage.getAddEditMenuActionsByName('Edit User')).click()
        arLearnerProgressReportPage.getLongWait()
        
        // Assert that the Edit user page should be displayed
        cy.get(arLearnerProgressReportPage.getPageHeaderTitle()).should('have.text', "Edit User")

        // Department should be selected successfully.
        cy.get(ARUserAddEditPage.getDepartmentBtn()).click()
        arSelectModal.SearchAndSelectFunction([departments.sub_dept_A_name])
        arLearnerProgressReportPage.getShortWait()
        // Assert that the Toggle should be active.
        cy.get(arLearnerProgressReportPage.getGeneralStatusToggleLprogress() + arCBAddEditPage.getToggleEnabled()).should('have.text', "Active")
        cy.get(arLearnerProgressReportPage.getGeneralStatusToggleLprogress() + arCBAddEditPage.getToggleEnabled()).click()
        arLearnerProgressReportPage.getShortWait()
        cy.get(arLearnerProgressReportPage.getGeneralStatusToggleLprogress() + arCBAddEditPage.getToggleEnabled()).click()
        arLearnerProgressReportPage.getShortWait()
        // Asser that the after Togging, the user is Active
        cy.get(arLearnerProgressReportPage.getGeneralStatusToggleLprogress() + arCBAddEditPage.getToggleEnabled()).should('have.text', "Active")

        // Click on the Save button
        cy.get(ARDashboardPage.getSaveBtn()).click()
        arLearnerProgressReportPage.getLongWait()
        // Assert that the changes have been saved successfully
        cy.get(ARUserAddEditPage.getToastSuccessMsg()).should('contain', 'User has been updated successfully.')
    })
})