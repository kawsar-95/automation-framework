import ARAddEditCategoryPage from "../../../../../../helpers/AR/pageObjects/Category/ARAddEditCategoryPage"
import ARCoursesPage from "../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARDeleteModal from "../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal"
import ARUnsavedChangesModal from "../../../../../../helpers/AR/pageObjects/Modals/ARUnsavedChangesModal"
import ARUserUnEnrollModal from "../../../../../../helpers/AR/pageObjects/Modals/ARUserUnEnrollModal"
import ARRolesAddEditPage from "../../../../../../helpers/AR/pageObjects/Roles/ARRolesAddEditPage"
import { rolesDetails } from "../../../../../../helpers/TestData/Roles/rolesDetails"
import { users } from "../../../../../../helpers/TestData/users/users"



describe('C1955 AUT-512 GUIA-Story - NLE-2407 - Roles Report - Add/Edit Role Form - Select All / Deselect All', () => {

    it("create a Custom Roles and press cancel on the modal", () => {
        //Log in as an system admin user
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(ARDashboardPage.getCurrentUserLabel()).should('contain.text', users.sysAdmin.admin_sys_01_full_name)
        //Go to Roles Report
        ARDashboardPage.getRolesReport()
        //Asserting correct Page
        cy.get(ARDashboardPage.getPageHeaderTitle()).should('have.text', 'Roles')
        cy.wrap(ARDashboardPage.WaitForElementStateToChange(ARDashboardPage.getAddEditMenuActionsByName('Add Role'), 1000))
        cy.get(ARCoursesPage.getCoursesActionsButtonsByLabel('Add Role')).click()
        cy.get(ARAddEditCategoryPage.getPageHeaderTitle()).should('have.text', "Add Role")
        cy.get(ARRolesAddEditPage.getGeneralNameTxtF()).clear().type(rolesDetails.roleName)
        cy.get(ARRolesAddEditPage.getGeneralDescriptionTxtF()).clear().type(rolesDetails.roleDescription)
        //Assert that Select All and Deslect All are present 
        cy.get(ARRolesAddEditPage.getCourseSelectAllCheckBox()).should('exist').and('have.text', 'Select All')
        cy.get(ARRolesAddEditPage.getCourseDeselectAllCheckBox()).should('exist').and('have.text', 'Deselect All')
        //Clicking on the 'Select All' button
        cy.get(ARRolesAddEditPage.getCourseSelectAllCheckBox()).click()
        //Asserting that all the checkboxes are selected
        cy.get(ARRolesAddEditPage.getCheckBoxes()).each(() => {

            cy.get(ARRolesAddEditPage.getCheckBoxInput()).should('have.attr', 'aria-checked', 'true')
        })
        //Clicking on DeselectAll button and all checkboxes are deselected
        cy.get(ARRolesAddEditPage.getCourseDeselectAllCheckBox()).click()
        ARDashboardPage.getMediumWait()
        //Asserting that all the checkboxes are deselected
        cy.get(ARRolesAddEditPage.getCheckBoxes()).each(() => {

            cy.get(ARRolesAddEditPage.getCheckBoxInput()).should('have.attr', 'aria-checked', 'false')
        })

        //Clicking on cancel without saving it 
        cy.get(ARUserUnEnrollModal.getCancelBtn()).click()
        //Un Saved Modal Appears 
        cy.get(ARUnsavedChangesModal.getPromptHeader()).should('have.text', 'Unsaved Changes')
        //Asserting that unsaved modal has two buttons
        cy.get(ARUnsavedChangesModal.getOKBtn()).should('have.text', 'OK').and('exist')
        cy.get(ARUnsavedChangesModal.getCancelBtn()).should('have.text', 'Cancel').and('exist')
        // Verify Warning Message
        cy.get(ARUnsavedChangesModal.getPromptContent()).find('span').should('have.text', ARUnsavedChangesModal.getUnsavedChangesMsg())
        //Clicking on the cancel button
        cy.get(ARUnsavedChangesModal.getCancelBtn()).should('have.text', 'Cancel').click()
        //Stays in the same page
        cy.get(ARAddEditCategoryPage.getPageHeaderTitle()).should('have.text', "Add Role")
        //Clicking on cancel without saving it 
        cy.get(ARUserUnEnrollModal.getCancelBtn()).click()
        //Asserting that it moves back to the Roles Page
        cy.get(ARUnsavedChangesModal.getOKBtn()).should('have.text', 'OK').click()
        cy.get(ARUnsavedChangesModal.getWaitSpinner(), { timeout: 1500000 }).should('not.exist')
        cy.get(ARDashboardPage.getPageHeaderTitle()).should('have.text', 'Roles')

    })

    it("create a Custom Roles and press ok on the modal", () => {
        //Log in as an system admin user
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(ARDashboardPage.getCurrentUserLabel()).should('contain.text', users.sysAdmin.admin_sys_01_full_name)
        //Go to Roles Report
        ARDashboardPage.getRolesReport()
        //Asserting correct Page
        cy.get(ARDashboardPage.getPageHeaderTitle()).should('have.text', 'Roles')
        cy.wrap(ARDashboardPage.WaitForElementStateToChange(ARDashboardPage.getAddEditMenuActionsByName('Add Role'), 1000))
        cy.get(ARCoursesPage.getCoursesActionsButtonsByLabel('Add Role')).click()
        cy.get(ARAddEditCategoryPage.getPageHeaderTitle()).should('have.text', "Add Role")
        cy.get(ARRolesAddEditPage.getGeneralNameTxtF()).clear().type(rolesDetails.roleName)
        cy.get(ARRolesAddEditPage.getGeneralDescriptionTxtF()).clear().type(rolesDetails.roleDescription)
        //Clicking on Select All button
        cy.get(ARRolesAddEditPage.getCourseSelectAllCheckBox()).should('have.text', 'Select All').click()

        //Clicking on cancel without saving it 
        cy.get(ARUserUnEnrollModal.getCancelBtn()).click()
        //Un Saved Modal Appears 
        cy.get(ARUnsavedChangesModal.getPromptHeader()).should('have.text', 'Unsaved Changes')
        //Asserting that unsaved modal has two buttons
        cy.get(ARUnsavedChangesModal.getOKBtn()).should('have.text', 'OK').and('exist')
        cy.get(ARUnsavedChangesModal.getCancelBtn()).should('have.text', 'Cancel').and('exist')
        // Verify Warning Message
        cy.get(ARUnsavedChangesModal.getPromptContent()).find('span').should('have.text', ARUnsavedChangesModal.getUnsavedChangesMsg())
        //Clicking on the cancel button
        cy.get(ARUnsavedChangesModal.getCancelBtn()).should('have.text', 'Cancel').click()
        //Stays in the same page
        cy.get(ARAddEditCategoryPage.getPageHeaderTitle()).should('have.text', "Add Role")
        //Now creating the role 
        //Saving the role 
        cy.get(ARRolesAddEditPage.getSaveBtn()).contains('Save').click()
        cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')
        cy.get(ARDashboardPage.getPageHeaderTitle()).should('have.text', 'Roles')

    })


    it(`Editing ${rolesDetails.roleName} and press cancel on the modal`, () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')

        //Go to Roles Report
        ARDashboardPage.getRolesReport()
        //Asserting correct Page
        cy.get(ARDashboardPage.getPageHeaderTitle()).should('have.text', 'Roles')
        cy.wrap(ARDashboardPage.WaitForElementStateToChange(ARDashboardPage.getAddEditMenuActionsByName('Add Role'), 1000))
        //Filtering out Role
        ARCoursesPage.AddFilter('Name', 'Equals', rolesDetails.roleName)
        //clicking the role to select
        cy.get(ARDashboardPage.getTableCellRecord()).contains(rolesDetails.roleName).click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 150000 }).should('not.exist')
        cy.wrap(ARDashboardPage.WaitForElementStateToChange(ARCoursesPage.getCoursesActionsButtonsByLabel('Edit Role')))
        cy.get(ARCoursesPage.getCoursesActionsButtonsByLabel('Edit Role')).click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 150000 }).should('not.exist')
        cy.get(ARAddEditCategoryPage.getPageHeaderTitle()).should('have.text', "Edit Role")
        cy.get(ARRolesAddEditPage.getCourseDeselectAllCheckBox()).click()
        ARRolesAddEditPage.getSelectCheckboxBySectionNameAndIndexNumber('reports', 0, 'All Reports')

        //Clicking on cancel without saving it 
        cy.get(ARUserUnEnrollModal.getCancelBtn()).click()
        //Un Saved Modal Appears 
        cy.get(ARUnsavedChangesModal.getPromptHeader()).should('have.text', 'Unsaved Changes')
        //Asserting that unsaved modal has two buttons
        cy.get(ARUnsavedChangesModal.getOKBtn()).should('have.text', 'OK').and('exist')
        cy.get(ARUnsavedChangesModal.getCancelBtn()).should('have.text', 'Cancel').and('exist')
        // Verify Warning Message
        cy.get(ARUnsavedChangesModal.getPromptContent()).find('span').should('have.text', ARUnsavedChangesModal.getUnsavedChangesMsg())
        //Clicking on the cancel button
        cy.get(ARUnsavedChangesModal.getCancelBtn()).should('have.text', 'Cancel').click()
        //Stays in the same page
        cy.get(ARAddEditCategoryPage.getPageHeaderTitle()).should('have.text', "Edit Role")
        //Clicking on cancel without saving it 
        cy.get(ARUserUnEnrollModal.getCancelBtn()).click()
        //Asserting that it moves back to the Roles Page
        cy.get(ARUnsavedChangesModal.getOKBtn()).should('have.text', 'OK').click()
        cy.get(ARUnsavedChangesModal.getWaitSpinner(), { timeout: 1500000 }).should('not.exist')
        cy.get(ARDashboardPage.getPageHeaderTitle()).should('have.text', 'Roles')
    })

    it(`Editing ${rolesDetails.roleName} and press ok on the modal`, () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')

        //Go to Roles Report
        ARDashboardPage.getRolesReport()
        //Asserting correct Page
        cy.get(ARDashboardPage.getPageHeaderTitle()).should('have.text', 'Roles')
        cy.wrap(ARDashboardPage.WaitForElementStateToChange(ARDashboardPage.getAddEditMenuActionsByName('Add Role'), 1000))
        //Filtering out Role
        ARCoursesPage.AddFilter('Name', 'Equals', rolesDetails.roleName)
        //clicking the role to select
        cy.get(ARDashboardPage.getTableCellRecord()).contains(rolesDetails.roleName).click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 150000 }).should('not.exist')
        cy.wrap(ARDashboardPage.WaitForElementStateToChange(ARCoursesPage.getCoursesActionsButtonsByLabel('Edit Role')))
        cy.get(ARCoursesPage.getCoursesActionsButtonsByLabel('Edit Role')).click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 150000 }).should('not.exist')
        cy.get(ARAddEditCategoryPage.getPageHeaderTitle()).should('have.text', "Edit Role")

        cy.get(ARRolesAddEditPage.getCourseDeselectAllCheckBox()).click()
        ARRolesAddEditPage.getSelectCheckboxBySectionNameAndIndexNumber('reports', 0, 'All Reports')

        //Clicking on cancel without saving it 
        cy.get(ARUserUnEnrollModal.getCancelBtn()).click()
        //Un Saved Modal Appears 
        cy.get(ARUnsavedChangesModal.getPromptHeader()).should('have.text', 'Unsaved Changes')
        //Asserting that unsaved modal has two buttons
        cy.get(ARUnsavedChangesModal.getOKBtn()).should('have.text', 'OK').and('exist')
        cy.get(ARUnsavedChangesModal.getCancelBtn()).should('have.text', 'Cancel').and('exist')
        // Verify Warning Message
        cy.get(ARUnsavedChangesModal.getPromptContent()).find('span').should('have.text', ARUnsavedChangesModal.getUnsavedChangesMsg())
        //Clicking on the cancel button
        cy.get(ARUnsavedChangesModal.getCancelBtn()).should('have.text', 'Cancel').click()
        //Stays in the same page
        cy.get(ARAddEditCategoryPage.getPageHeaderTitle()).should('have.text', "Edit Role")
        //Saving the role 
        cy.get(ARRolesAddEditPage.getSaveBtn()).contains('Save').click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 140000 }).should('not.exist')
        cy.get(ARDashboardPage.getPageHeaderTitle()).should('have.text', 'Roles')
    })




    after(function () {
        //delete the role
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')

        ARDashboardPage.getRolesReport()
        //Verify navigated window
        cy.get(ARCoursesPage.getPageHeaderTitle()).should('have.text', "Roles")
        ARDashboardPage.AddFilter('Name', 'Equals', rolesDetails.roleName)
        cy.get(ARDashboardPage.getTableCellRecord()).contains(rolesDetails.roleName).click()
        cy.wrap(ARDashboardPage.WaitForElementStateToChange(ARCoursesPage.getCoursesActionsButtonsByLabel('Delete Role')))
        cy.get(ARCoursesPage.getCoursesActionsButtonsByLabel('Delete Role')).should('have.attr', 'aria-disabled', 'false').click()

        //Close the delete role pop up
        cy.get(ARRolesAddEditPage.getElementByDataNameAttribute(ARDeleteModal.getDeleteBtn())).click()


    })
})

