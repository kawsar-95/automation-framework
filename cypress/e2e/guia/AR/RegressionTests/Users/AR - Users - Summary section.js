import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARSelectModal from "../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal"
import ARUserAddEditPage from "../../../../../../helpers/AR/pageObjects/User/ARUserAddEditPage"
import LEDashboardPage from "../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage"
import LEProfilePage from "../../../../../../helpers/LE/pageObjects/User/LEProfilePage"
import { departments } from "../../../../../../helpers/TestData/Department/departments"
import { detailsSectionFields, userDetails } from "../../../../../../helpers/TestData/users/UserDetails"
import { users } from "../../../../../../helpers/TestData/users/users"
import defaultTestData from '../../../../../fixtures/defaultTestData.json'

describe('C1994 AUT-546, AR - Users - Summary section', () => {
    before(() => {
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
    })

    beforeEach(() => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getUsersReport()
    })

    after('Delete User', () => {
        cy.apiLoginWithSession(`${userDetails.username}${userDetails.appendText}`, userDetails.validPassword)
        cy.get(LEDashboardPage.getNavProfile()).click()  
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
        cy.url().then((currentURL) => {
            userDetails.userID = currentURL.slice(-36)
        })

        cy.deleteUser(userDetails.userID)
    })

    it('Edit User', () => {
        ARDashboardPage.AddFilter('Username', 'Equals', userDetails.username)
        cy.get(ARDashboardPage.getTableCellName(4)).contains(userDetails.username).click()

        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Edit User')).click()
        cy.get(ARDashboardPage.getPageHeaderTitle()).should('contain', 'Edit User')
        cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')

        // 23. Verify that placeholder image displays for users without an uploaded image
        cy.get(ARUserAddEditPage.getDefaultAvatar()).should('be.visible')

        // Verify that each User Summary field contains the appropriate icon
        ARUserAddEditPage.verifySummaryFieldIcon()

        // 3. Verify that the Username field contains the user's username
        cy.get(ARUserAddEditPage.getSummaryUsername()).should('contain', userDetails.username)

        // 7. Verify that the Curricula Enrollments field value is Zero if the user has no current or past curricula
        cy.get(ARUserAddEditPage.getSummaryCurriculaCount()).should('contain', 0)

        // 10. Verify that Number of Competencies field displays ZERO if  user has no assigned Competencies
        cy.get(ARUserAddEditPage.getSummaryCompetenciesCount()).should('contain', 0)

        // 11. User's department should be displayed
        cy.get(ARUserAddEditPage.getSummaryDepartment()).should('contain', departments.dept_top_name)

        // 15. Verify that Enrollments in Progress field displays ZERO if user has no enrollments in progress
        cy.get(ARUserAddEditPage.getSummaryEnrollmentsInProgressCount()).should('contain', 0)

        // 18. Verify that Enrollments Completed field displays ZERO if user has no enrollments completed
        cy.get(ARUserAddEditPage.getSummaryEnrollmentsCompletedCount()).should('contain', 0)
        
        // 19. Verify that Email Address field displays the user's Email Address
        cy.get(ARUserAddEditPage.getSummaryEmailAddress()).should('contain', defaultTestData.USER_LEARNER_EMAIL)

        // updated username, department and Email
        cy.get(ARUserAddEditPage.getEmailAddressTxtF()).clear().type(userDetails.emailAddressEdited)
        cy.get(ARUserAddEditPage.getUsernameTxtF()).type(userDetails.appendText)
        cy.get(ARUserAddEditPage.getDepartmentBtn()).click()
        ARSelectModal.SearchAndSelectFunction([departments.Dept_B_name])

        // select an image from url, paste the url on the field and save
        cy.get(ARUserAddEditPage.getAvatarRadioBtn()).contains('Url').click()
        cy.get(ARUserAddEditPage.getUrlTxtF()).type(detailsSectionFields.avatarUrl)

        //Save user
        ARUserAddEditPage.WaitForElementStateToChange(ARUserAddEditPage.getSaveBtn())
        cy.get(ARUserAddEditPage.getSaveBtn()).click()
        cy.get(ARUserAddEditPage.getToastSuccessMsg()).should('contain', 'User has been updated successfully.')
        cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')
    })

    it('Edit User persist updated value', () => {
        ARDashboardPage.AddFilter('Username', 'Equals', `${userDetails.username}${userDetails.appendText}`)
        cy.get(ARDashboardPage.getTableCellName(4)).contains(`${userDetails.username}${userDetails.appendText}`).click()

        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Edit User')).click()
        cy.get(ARDashboardPage.getPageHeaderTitle()).should('contain', 'Edit User')
        cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')

        // 22. Avatar image should be displayed
        cy.get(ARUserAddEditPage.getAvatarImageContainer()).should('be.visible')

        // 4. Username field should display updated username
        cy.get(ARUserAddEditPage.getSummaryUsername()).should('contain', `${userDetails.username}${userDetails.appendText}`)

        // 7. Verify that the Curricula Enrollments field value is Zero if the user has no current or past curricula
        cy.get(ARUserAddEditPage.getSummaryCurriculaCount()).should('contain', 0)

        // 10. Verify that Number of Competencies field displays ZERO if  user has no assigned Competencies
        cy.get(ARUserAddEditPage.getSummaryCompetenciesCount()).should('contain', 0)

        // 12. Updated department should be displayed
        cy.get(ARUserAddEditPage.getSummaryDepartment()).should('contain', departments.Dept_B_name)

        // 15. Verify that Enrollments in Progress field displays ZERO if user has no enrollments in progress
        cy.get(ARUserAddEditPage.getSummaryEnrollmentsInProgressCount()).should('contain', 0)

        // 18. Verify that Enrollments Completed field displays ZERO if user has no enrollments completed
        cy.get(ARUserAddEditPage.getSummaryEnrollmentsCompletedCount()).should('contain', 0)
        
        // 20. Email Address field should be updated
        cy.get(ARUserAddEditPage.getSummaryEmailAddress()).should('contain', userDetails.emailAddressEdited)
    })
})