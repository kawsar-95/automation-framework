import LEProfilePage from '../../../../../../helpers/LE/pageObjects/User/LEProfilePage'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LESocialProfilePage from '../../../../../../helpers/LE/pageObjects/User/LESocialProfilePage'
import ARDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import { userDetails } from '../../../../../../helpers/TestData/users/UserDetails'
import { users } from '../../../../../../helpers/TestData/users/users'
import ARUserAddEditPage from '../../../../../../helpers/AR/pageObjects/User/ARUserAddEditPage'

describe('C1814 AUT-436, LE - Social Profile - Provide a message to a learner when a profile cannot be accessed', function(){
    it('Create Inactive Learner', function() {
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        cy.get(LEDashboardPage.getNavProfile()).click()  
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
        cy.url().then((currentURL) => {
            userDetails.userID = currentURL.slice(-36)
        })

        // set Learner inactive
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getUsersReport()
        ARUserAddEditPage.getEditUserByUsername(userDetails.username)
        cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')

        // Verify that the header for the Active/Inactive toggle button is 'Is Active'
        cy.get(ARUserAddEditPage.getIsActiveToggleLabel()).should('contain', 'Is Active')

        // set Toggle inactive
        ARUserAddEditPage.generalToggleSwitch('false', ARUserAddEditPage.getIsActiveToggleContainer())

        // Save user
        ARUserAddEditPage.WaitForElementStateToChange(ARUserAddEditPage.getSaveBtn())
        cy.get(ARUserAddEditPage.getSaveBtn()).click()
        cy.get(ARUserAddEditPage.getToastSuccessMsg()).should('contain', 'Is Active saved.')
    })

    it("A learner tries to view the social profile of an INACTIVE learner", () => {
        cy.apiLoginWithSession(users.learner02.learner_02_username, users.learner02.learner_02_password, `/#/social-profile/${userDetails.userID}`)
        cy.get(LEDashboardPage.getLEEllipsesLoader(), {timeout: 15000}).should('not.exist')

        // Error message displayed should be as specified
        cy.get(LESocialProfilePage.getNotFoundModuleHeader()).should('be.visible').and('have.text', 'Learner Not Found')
        cy.get(LESocialProfilePage.getNotFoundModuleDescription()).should('be.visible').and('have.text', LESocialProfilePage.getNotFoundModuleDescriptionMsg())
        // Verify that a link is provided to the learner to return back to dashboard
        cy.get(LESocialProfilePage.getNotFoundModuleLink()).should('be.visible').and('have.text', 'Return To My Dashboard')
        // Verify that the error message contains an icon
        cy.get(LESocialProfilePage.getNotFoundModuleIcon()).should('be.visible')
    })

    it('Delete Learner', function() {
        cy.deleteUser(userDetails.userID)
    })

    it("A learner tries to view the social profile of an Deleted learner", () => {
        cy.apiLoginWithSession(users.learner01.learner_01_username, users.learner01.learner_01_password, `/#/social-profile/${userDetails.userID}`)
        cy.get(LEDashboardPage.getLEEllipsesLoader(), {timeout: 15000}).should('not.exist')

        // Error message displayed should be as specified
        cy.get(LESocialProfilePage.getNotFoundModuleHeader()).should('be.visible').and('have.text', 'Learner Not Found')
        cy.get(LESocialProfilePage.getNotFoundModuleDescription()).should('be.visible').and('have.text', LESocialProfilePage.getNotFoundModuleDescriptionMsg())
        // Verify that a link is provided to the learner to return back to dashboard
        cy.get(LESocialProfilePage.getNotFoundModuleLink()).should('be.visible').and('have.text', 'Return To My Dashboard')
        // Verify that the error message contains an icon
        cy.get(LESocialProfilePage.getNotFoundModuleIcon()).should('be.visible')
    })

    it("A learner tries to view the social profile of a NON existing learner", () => {
        // Typing profile URL manually, I get it from online generator
        cy.apiLoginWithSession(users.learner01.learner_01_username, users.learner01.learner_01_password, `/#/social-profile/28fe723e-4cc9-4120-a065-98c669ac7266`)
        cy.get(LEDashboardPage.getLEEllipsesLoader(), {timeout: 15000}).should('not.exist')

        // Error message displayed should be as specified
        cy.get(LESocialProfilePage.getNotFoundModuleHeader()).should('be.visible').and('have.text', 'Learner Not Found')
        cy.get(LESocialProfilePage.getNotFoundModuleDescription()).should('be.visible').and('have.text', LESocialProfilePage.getNotFoundModuleDescriptionMsg())
        // Verify that a link is provided to the learner to return back to dashboard
        cy.get(LESocialProfilePage.getNotFoundModuleLink()).should('be.visible').and('have.text', 'Return To My Dashboard')
        // Verify that the error message contains an icon
        cy.get(LESocialProfilePage.getNotFoundModuleIcon()).should('be.visible')
    })

})
