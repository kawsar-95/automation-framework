import dayjs from "dayjs"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARUserTranscriptPage from "../../../../../../helpers/AR/pageObjects/User/ARUserTranscriptPage"
import LEDashboardPage from "../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage"
import LEProfilePage from "../../../../../../helpers/LE/pageObjects/User/LEProfilePage"
import { departments } from "../../../../../../helpers/TestData/Department/departments"
import { userDetails } from "../../../../../../helpers/TestData/users/UserDetails"
import { users } from "../../../../../../helpers/TestData/users/users"
import defaultTestData from '../../../../../fixtures/defaultTestData.json'

describe("C993 AUT-295, AR - User - User Transcript Report - User Info Section (cloned)", () => {
    before(() => {
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
    })

    beforeEach(() => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getUsersReport()
    })

    after(() => {
        cy.deleteUser(userDetails.userID)
    })

    it('Go to User Transcript Report and Verify User Info Section', () => {
        ARDashboardPage.AddFilter('Username', 'Equals', userDetails.username)
        cy.get(ARDashboardPage.getTableCellName(4)).contains(userDetails.username).click()

        cy.get(ARDashboardPage.getAddEditMenuActionsByName('User Transcript')).click()
        cy.get(ARDashboardPage.getPageHeaderTitle()).should('contain', 'User Transcript')
        cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')

        // Header should have the User's full name
        cy.get(ARUserTranscriptPage.getBreadCrumOrderItem()).should('contain', `${defaultTestData.USER_LEARNER_FNAME} ${defaultTestData.USER_LEARNER_LNAME}`)

        // Body should show the User's Avatar
        cy.get(ARUserTranscriptPage.getDefaultAvatar()).should('be.visible')

        // verify Summary Field icon
        ARUserTranscriptPage.verifySummaryFieldIcon()

        // Body should have the Username field 
        cy.get(ARUserTranscriptPage.getSummaryUsername()).should('contain', userDetails.username)

        // Body should have the Department field 
        cy.get(ARUserTranscriptPage.getSummaryDepartment()).should('contain', departments.dept_top_name)

        // Body should have the Email Address field 
        cy.get(ARUserTranscriptPage.getSummaryEmailAddress()).should('contain', defaultTestData.USER_LEARNER_EMAIL)

        // Body should have the Last Logged In field
        cy.get(ARUserTranscriptPage.getLastLoggedIn()).should('contain', 'Never')

        // Click on the Back button on the right side panel
        cy.get(ARUserTranscriptPage.getBackBtn()).click()

        // verify Admin should be send back to the Users page
        cy.get(ARDashboardPage.getPageHeaderTitle()).should('be.visible').and('contain', 'Users')
    })

    it('Login with New User', () => {
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        cy.get(LEDashboardPage.getNavProfile()).click()  
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
        cy.url().then((currentURL) => {
            userDetails.userID = currentURL.slice(-36)
        })
    })

    it('Go to User Transcript Report and Verify User Info Section', () => {
        ARDashboardPage.AddFilter('Username', 'Equals', userDetails.username)
        cy.get(ARDashboardPage.getTableCellName(4)).contains(userDetails.username).click()

        cy.get(ARDashboardPage.getAddEditMenuActionsByName('User Transcript')).click()
        cy.get(ARDashboardPage.getPageHeaderTitle()).should('contain', 'User Transcript')
        cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')

        // Header should have the User's full name
        cy.get(ARUserTranscriptPage.getBreadCrumOrderItem()).should('contain', `${defaultTestData.USER_LEARNER_FNAME} ${defaultTestData.USER_LEARNER_LNAME}`)

        // Body should show the User's Avatar
        cy.get(ARUserTranscriptPage.getDefaultAvatar()).should('be.visible')

        // verify Summary Field icon
        ARUserTranscriptPage.verifySummaryFieldIcon()

        // Body should have the Username field 
        cy.get(ARUserTranscriptPage.getSummaryUsername()).should('contain', userDetails.username)

        // Body should have the Department field 
        cy.get(ARUserTranscriptPage.getSummaryDepartment()).should('contain', departments.dept_top_name)

        // Body should have the Email Address field 
        cy.get(ARUserTranscriptPage.getSummaryEmailAddress()).should('contain', defaultTestData.USER_LEARNER_EMAIL)

        // Body should have the Last Logged In field
        cy.get(ARUserTranscriptPage.getLastLoggedIn()).invoke('text').then(($text) => {
            expect(dayjs($text).isValid()).to.be.true
        })

        // Click on the Back button on the right side panel
        cy.get(ARUserTranscriptPage.getBackBtn()).click()

        // verify Admin should be send back to the Users page
        cy.get(ARDashboardPage.getPageHeaderTitle()).should('be.visible').and('contain', 'Users')
    })
})
