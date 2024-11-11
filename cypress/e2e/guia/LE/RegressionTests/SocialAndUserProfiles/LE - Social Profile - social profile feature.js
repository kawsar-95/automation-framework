import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARDashboardAccountMenu from "../../../../../../helpers/AR/pageObjects/Menu/ARDashboardAccount.menu"
import AREditClientUserPage from "../../../../../../helpers/AR/pageObjects/PortalSettings/AREditClientUserPage"
import ARUserPage from "../../../../../../helpers/AR/pageObjects/User/ARUserPage"
import { users } from "../../../../../../helpers/TestData/users/users"


describe("C1796 - AUT-422 - NLE-1757 - Allow a client to opt in/out of the social profile feature", () => {

    it(`"Learner Social Profile" toggle should only be accessible by System adminsand Blatant Admins.`, () => {
        //Login as an Administrator
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, "/admin")
        //Go to Portal Settings
        ARDashboardPage.getPortalSettingsMenu()
        //Assert the learner social profile toggle 
        cy.get(ARUserPage.getLearnerSocialProfileLable(), { timeout: 300000 }).should('have.text', 'Learner Social Profile')
        //Asserting that the Toggle can be turned off 
        AREditClientUserPage.getTurnOnOffLearnerSocialProfileToggleBtn('false')
        //Asserting that the Toggle can be turned on
        AREditClientUserPage.getTurnOnOffLearnerSocialProfileToggleBtn('true')

        //Asserting the Description message 
        cy.get(ARUserPage.getLearnerSocialProfileLable(), { timeout: 300000 }).parent().parent().within(() => {
            cy.get(AREditClientUserPage.getDescriptionDiv()).should('have.text', AREditClientUserPage.getLearnerSocialProfileDescriptionMessage())
        })


    })
})