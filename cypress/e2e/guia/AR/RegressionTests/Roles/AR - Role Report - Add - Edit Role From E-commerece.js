import ARAddEditCategoryPage from "../../../../../../helpers/AR/pageObjects/Category/ARAddEditCategoryPage"
import ARCoursesPage from "../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARDeleteModal from "../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal"
import ARUnsavedChangesModal from "../../../../../../helpers/AR/pageObjects/Modals/ARUnsavedChangesModal"
import ARUserUnEnrollModal from "../../../../../../helpers/AR/pageObjects/Modals/ARUserUnEnrollModal"
import ARRolesAddEditPage from "../../../../../../helpers/AR/pageObjects/Roles/ARRolesAddEditPage"
import { rolesDetails } from "../../../../../../helpers/TestData/Roles/rolesDetails"
import { users } from "../../../../../../helpers/TestData/users/users"
import menuitems from "../../../../../fixtures/menuItems.json"



describe('C1950 AUT-507GUIA-Story - NLE-2397 - Roles Report - Add/Edit Role Form - E-Commerce Section', () => {
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
       //Adding E Commerce Transaction  Report Permissions
		ARRolesAddEditPage.getSelectCheckboxBySectionNameAndIndexNumber('ecommerce', 0, 'Transactions')
        //Initially its expanded
        ARRolesAddEditPage.getSectionExpandibleBtn('E-Commerce').should('have.attr', 'aria-expanded', 'true')
        //Clicking on the E-Commerce expanded button to make it collapse 
        ARRolesAddEditPage.getSectionExpandibleBtn('E-Commerce').click()
        //Asserting the it has collapsed
        ARRolesAddEditPage.getSectionExpandibleBtn('E-Commerce').should('have.attr', 'aria-expanded', 'false')
        //Clicking it again to make it expand
        ARRolesAddEditPage.getSectionExpandibleBtn('E-Commerce').click()
        //Asserting the it has expanded
        ARRolesAddEditPage.getSectionExpandibleBtn('E-Commerce').should('have.attr', 'aria-expanded', 'true')
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
        //Adding Course Activity Report Permissions
        ARRolesAddEditPage.getSelectCheckboxBySectionNameAndIndexNumber('ecommerce', 0, 'Transactions')
        //Initially its expanded
        ARRolesAddEditPage.getSectionExpandibleBtn('E-Commerce').should('have.attr', 'aria-expanded', 'true')
        //Clicking on the E-Commerce expanded button to make it collapse 
        ARRolesAddEditPage.getSectionExpandibleBtn('E-Commerce').click()
        //Asserting the it has collapsed
        ARRolesAddEditPage.getSectionExpandibleBtn('E-Commerce').should('have.attr', 'aria-expanded', 'false')
        //Clicking it again to make it expand
        ARRolesAddEditPage.getSectionExpandibleBtn('E-Commerce').click()
        //Asserting the it has expanded
        ARRolesAddEditPage.getSectionExpandibleBtn('E-Commerce').should('have.attr', 'aria-expanded', 'true')
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
        ARRolesAddEditPage.getSelectCheckboxBySectionNameAndIndexNumber('ecommerce', 1, menuitems.COUPONS)
        //Initially its expanded
        ARRolesAddEditPage.getSectionExpandibleBtn('E-Commerce').should('have.attr', 'aria-expanded', 'true')
        //Clicking on the E-Commerce expanded button to make it collapse 
        ARRolesAddEditPage.getSectionExpandibleBtn('E-Commerce').click()
        //Asserting the it has collapsed
        ARRolesAddEditPage.getSectionExpandibleBtn('E-Commerce').should('have.attr', 'aria-expanded', 'false')
        //Clicking it again to make it expand
        ARRolesAddEditPage.getSectionExpandibleBtn('E-Commerce').click()
        //Asserting the it has expanded
        ARRolesAddEditPage.getSectionExpandibleBtn('E-Commerce').should('have.attr', 'aria-expanded', 'true')
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
        ARRolesAddEditPage.getSelectCheckboxBySectionNameAndIndexNumber('ecommerce', 1, menuitems.COUPONS)
        //Initially its expanded
        ARRolesAddEditPage.getSectionExpandibleBtn('E-Commerce').should('have.attr', 'aria-expanded', 'true')
        //Clicking on the E-Commerce expanded button to make it collapse 
        ARRolesAddEditPage.getSectionExpandibleBtn('E-Commerce').click()
        //Asserting the it has collapsed
        ARRolesAddEditPage.getSectionExpandibleBtn('E-Commerce').should('have.attr', 'aria-expanded', 'false')
        //Clicking it again to make it expand
        ARRolesAddEditPage.getSectionExpandibleBtn('E-Commerce').click()
        //Asserting the it has expanded
        ARRolesAddEditPage.getSectionExpandibleBtn('E-Commerce').should('have.attr', 'aria-expanded', 'true')
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

