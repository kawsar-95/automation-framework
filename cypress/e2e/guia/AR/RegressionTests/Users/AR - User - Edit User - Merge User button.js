import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import A5LeaderboardsAddEditPage from "../../../../../../helpers/AR/pageObjects/Leaderboards/A5LeaderboardsAddEditPage"
import ARDeleteModal from "../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal"
import ARUnsavedChangesModal from "../../../../../../helpers/AR/pageObjects/Modals/ARUnsavedChangesModal"
import ARUserPage from "../../../../../../helpers/AR/pageObjects/User/ARUserPage"
import { userDetails } from "../../../../../../helpers/TestData/users/UserDetails"
import { users } from "../../../../../../helpers/TestData/users/users"

describe('C6847 AUT-763, AR - User - Edit User - Merge User button', () => {
    before(() => {
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
        cy.createUser(void 0, userDetails.username2, ["Learner"], void 0)
        cy.createUser(void 0, userDetails.username3, ["Learner"], void 0)
    })

    beforeEach(() => {
        // Login as admin
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getShortWait()

        // Click on users
        cy.get(ARDashboardPage.getUserMenu()).click()
        // Click on users
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Users'))
        cy.intercept('/api/rest/v2/admin/reports/users/operations').as('getUsers').wait('@getUsers')
        // Verify that Users page is open 
        cy.get(ARDashboardPage.getPageHeaderTitle()).should('contain', 'Users')

        // Select any user
        ARDashboardPage.AddFilter('Username', 'Contains', userDetails.username)
        ARDashboardPage.getShortWait()

        cy.get(ARDashboardPage.getGridTable()).eq(0).click()
        ARDashboardPage.getMediumWait()
        // Click on edit
        cy.get(ARUserPage.getEditUserBtn()).click()
        ARDashboardPage.getMediumWait()
    })

    after('Delete Active and Inactive User', () => {
        //Login as admin
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getShortWait()

        //Click on users
        cy.get(ARDashboardPage.getUserMenu()).click()
        //Click on users
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Users'))
        cy.intercept('/api/rest/v2/admin/reports/users/operations').as('getUsers').wait('@getUsers')
        ARDashboardPage.getMediumWait()

        ARDashboardPage.AddFilter('Username', 'Contains', userDetails.username)
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getGridTable()).eq(0).click()
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Delete')).click()
        ARDashboardPage.getShortWait()
        cy.get(ARDashboardPage.getElementByDataNameAttribute(ARDeleteModal.getDeleteBtn())).click()
        ARDashboardPage.getMediumWait()

        // Search the Learner by Inactive status to make sure result contains at least one records
        ARUserPage.AddStatusRadioFilter('Status', false)
        ARUserPage.getMediumWait()

        ARDashboardPage.AddFilter('Username', 'Contains', userDetails.username2)
        ARDashboardPage.getMediumWait()
        ARDashboardPage.AddFilter('Username', 'Contains', userDetails.username3)
        ARDashboardPage.getMediumWait()

        cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Row Select Options')).click({ force: true })
        cy.get(ARDashboardPage.getElementByDataNameAttribute('select-page')).click()
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Delete Users')).click()
        cy.get(ARDashboardPage.getElementByDataNameAttribute('confirm')).click()
    })

    it("Edit User, Merge User and Cancel", () => {
        // Clicking Merge User button 
        cy.get(ARUserPage.getMergeUserBtn()).click()
        ARDashboardPage.getMediumWait()

        cy.get(A5LeaderboardsAddEditPage.getA5EditPageHeadertitle()).should('contain', 'Merge Users')

        cy.get(ARUserPage.getA5CancelBtn()).click()
        ARDashboardPage.getMediumWait()

        cy.get(ARDashboardPage.getPageHeaderTitle(), {timeout: 5000}).should('have.text', 'Users')
    })

    it("Edit User, Merge User and Don't Save", () => {
        // Clicking Merge User button 
        cy.get(ARUserPage.getMergeUserBtn()).click()
        ARDashboardPage.getMediumWait()

        cy.get(A5LeaderboardsAddEditPage.getA5EditPageHeadertitle()).should('contain', 'Merge Users')

        cy.get(ARUserPage.getDuplicateUserAccountDDown()).click()
        ARDashboardPage.getShortWait()

        cy.get(ARUserPage.getDuplicateUserAccountTextF()).type(userDetails.username2)
        ARDashboardPage.getShortWait()

        cy.get(ARUserPage.getDuplicateUserAccountDDownOpt()).contains(userDetails.username2).click();     
        ARDashboardPage.getShortWait()

        cy.get(ARUserPage.getA5CancelBtn()).click()
        ARDashboardPage.getMediumWait()

        cy.get(ARUnsavedChangesModal.getUnsavedModalMsg()).should('have.text', ARUnsavedChangesModal.getUnsavedChangesMsg())

        // Click Cancel form Confirm Modal
        ARUnsavedChangesModal.getClickUnsavedActionBtnByName('Cancel')
        ARDashboardPage.getShortWait()

        cy.get(A5LeaderboardsAddEditPage.getA5EditPageHeadertitle()).should('have.text', 'Merge Users')

        // Click Cancel
        cy.get(ARDashboardPage.getA5CancelBtn()).click()
        ARDashboardPage.getShortWait()

        // Verify Warning Message
        cy.get(ARUnsavedChangesModal.getUnsavedModalMsg()).should('have.text', ARUnsavedChangesModal.getUnsavedChangesMsg())

        // Click don't Save
        ARUnsavedChangesModal.getClickUnsavedActionBtnByName("Don't Save")
        ARDashboardPage.getMediumWait()

        cy.get(ARDashboardPage.getPageHeaderTitle(), {timeout: 5000}).should('have.text', 'Users')
    })

    it('Edit User, Merge User and Merge', () => {
        // Clicking Merge User button 
        cy.get(ARUserPage.getMergeUserBtn()).click()
        ARDashboardPage.getMediumWait()

        cy.get(A5LeaderboardsAddEditPage.getA5EditPageHeadertitle()).should('contain', 'Merge Users')

        cy.get(ARUserPage.getDuplicateUserAccountDDown()).click()
        ARDashboardPage.getShortWait()

        cy.get(ARUserPage.getDuplicateUserAccountTextF()).type(userDetails.username3)
        ARDashboardPage.getShortWait()

        cy.get(ARUserPage.getDuplicateUserAccountDDownOpt()).contains(userDetails.username3).click();     
        ARDashboardPage.getShortWait()

        cy.get(ARUserPage.getA5SaveBtn()).click()
        ARDashboardPage.getMediumWait()

        cy.get(ARDashboardPage.getPageHeaderTitle(), {timeout: 5000}).should('have.text', 'Users')

    })

    it("Edit User, Merge User and Save from Confirm Modal", () => {
        // Clicking Merge User button 
        cy.get(ARUserPage.getMergeUserBtn()).click()
        ARDashboardPage.getMediumWait()

        cy.get(A5LeaderboardsAddEditPage.getA5EditPageHeadertitle()).should('contain', 'Merge Users')

        cy.get(ARUserPage.getDuplicateUserAccountDDown()).click()
        ARDashboardPage.getShortWait()

        cy.get(ARUserPage.getDuplicateUserAccountTextF()).type(userDetails.username2)
        ARDashboardPage.getShortWait()

        cy.get(ARUserPage.getDuplicateUserAccountDDownOpt()).contains(userDetails.username2).click();     
        ARDashboardPage.getShortWait()

        cy.get(ARUserPage.getA5CancelBtn()).click()
        ARDashboardPage.getMediumWait()

        cy.get(ARUnsavedChangesModal.getUnsavedModalMsg()).should('have.text', ARUnsavedChangesModal.getUnsavedChangesMsg())

        // Click Save from Modal
        cy.get(ARUnsavedChangesModal.getSaveBtn()).click()
        ARDashboardPage.getMediumWait()
    })
})