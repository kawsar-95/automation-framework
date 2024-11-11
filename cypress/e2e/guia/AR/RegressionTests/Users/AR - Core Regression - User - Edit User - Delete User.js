import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARDeleteModal from "../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal"
import { userDetails } from "../../../../../../helpers/TestData/users/UserDetails"
import { users } from "../../../../../../helpers/TestData/users/users"
const username = 'GUIA-CED-User2023-04-03T12:24:09+06:00'
describe('AUT-766 - C6851 - Edit User - Delete User', () => {
    before(() => {
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
    })
    beforeEach(() => {
        // Log in as a blatant admin, system admin, admin, dept admin or group admin
        cy.apiLoginWithSession(
            users.blatAdmin.admin_blat_01_username,
            users.blatAdmin.admin_blat_01_password,
            "/admin"
        )

    })

    it('Edit User', () => {
        ARDashboardPage.getMediumWait()
        // Redirect to the left panel and click on the Users Icon
        cy.get(ARDashboardPage.getMenu('Users')).click()
        // Click on Users button
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Users'))

        ARDashboardPage.getMediumWait()
        // Select any existing User and click on it
        ARDashboardPage.AddFilter('Username', 'Equals', userDetails.username)
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getGridTable()).eq(0).click()
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Edit User')).click()

        cy.get(ARDashboardPage.getPageHeaderTitle()).should('contain', 'Edit User')
        // Verify that [Delete] button has been added to Edit User page
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Delete')).should('exist').click()
        // Verify that clicking [Delete] button will open the Delete user modal
        cy.get(ARDeleteModal.getDeleteUserModal()).should('exist')
        // Verify that the modal displays[Delete] and [Cancel] buttons and message "Are you sure you want to delete 'xxxx'? , xxxx is name of the user
        cy.get(ARDeleteModal.getModalContent()).should('contain', ARDeleteModal.getDeleteMsg('GUIA-CED User'))
        // Verify that selecting the [Cancel] button user is not deleted and the user  remains in the list of users
        // cy.get(ARDeleteModal.getPromptFooter()).within(() => {
        //     cy.get(ARDeleteModal.getARCancelBtn()).click()
        // })
        // Verify that selecting the [Delete] button deletes the user from list of users
        cy.get(ARDeleteModal.getPromptFooter()).within(() => {
            cy.get(ARDeleteModal.getARDeleteBtn()).click()
        })
        ARDashboardPage.getShortWait()
        cy.get(ARDashboardPage.getToastSuccessMsg()).should('exist')





    })

})