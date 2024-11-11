import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import { users } from '../../../../../../helpers/TestData/users/users'
import ARCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import ARILCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage'
import ARDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import AREnrollUsersPage from '../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage'
import ARUnsavedChangesModal from '../../../../../../helpers/AR/pageObjects/Modals/ARUnsavedChangesModal'
import { ocDetails } from '../../../../../../helpers/TestData/Courses/oc'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import ARCourseEnrollmentReportPage from '../../../../../../helpers/AR/pageObjects/Reports/ARCourseEnrollmentReportPage'
import ARUserEnrollmentPage from '../../../../../../helpers/AR/pageObjects/User/ARUserEnrollmentPage'

describe('C1008 AUT-306, AR - Enrollments - Un-enroll a User (User enrollments report) (cloned)', function(){
    before(()=>{
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getCoursesReport()

        // Create OC course
        cy.createCourse('Online Course')

        // Publish ILC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })

        AREnrollUsersPage.getEnrollUserByCourseAndUsername([ocDetails.courseName], [users.learner01.learner_01_username])
    })

    after(() => {
        cy.deleteCourse(commonDetails.courseID)
    })
    
    beforeEach(() => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
    })

    it('Navigate User Enrollments Page', () => {
        arDashboardPage.getUserEnrollmentsReport()

        //Clicking on User Choose button
        cy.get(ARCourseEnrollmentReportPage.getFilterItem()).click({ force: true })
        //Selecting User in User Choose 
        ARUserEnrollmentPage.ChooseUserAddFilter(users.learner01.learner_01_username)

        arDashboardPage.AddFilter('Name','Contains', ocDetails.courseName)
        cy.get(ARCoursesPage.getTableCellName(2), { timeout: 50000 }).should('be.visible').and('contain', ocDetails.courseName)
        cy.get(ARCoursesPage.getTableCellName(2)).contains(ocDetails.courseName).click()

        // Verify Un-enroll button is available
        cy.wrap(ARCoursesPage.WaitForElementStateToChange(ARCoursesPage.getAddEditMenuActionsByName('Un-enroll User'), 1000))
        cy.get(ARCoursesPage.getAddEditMenuActionsByName('Un-enroll User')).click()

        // Verify open the Unsaved Changes modal
        cy.get(ARUnsavedChangesModal.getPromptHeader()).should('be.visible').and('have.text', 'Un-enroll')

        // Verify Warning Message
        cy.get(ARUnsavedChangesModal.getPromptContent()).find('span').should('have.text', 'Are you sure you want to delete this enrollment?')

        // clicking [Cancel] button from Modal
        cy.get(ARUnsavedChangesModal.getPromptFooter()).find(ARILCAddEditPage.getCancelBtn()).click()
        cy.get(AREnrollUsersPage.getWaitSpinner(), {timeout:15000}).should('not.exist')

        // Verify Admin on User Enrollments
        cy.get(arDashboardPage.getPageHeaderTitle(), { timeout: 15000 }).should('be.visible').and('contain', 'User Enrollments')

        // Verify Un-enroll button is available
        cy.wrap(ARCoursesPage.WaitForElementStateToChange(ARCoursesPage.getAddEditMenuActionsByName('Un-enroll User'), 1000))
        cy.get(ARCoursesPage.getAddEditMenuActionsByName('Un-enroll User')).click()

        // Verify open the Unsaved Changes modal
        cy.get(ARUnsavedChangesModal.getPromptHeader()).should('be.visible').and('have.text', 'Un-enroll')

        // Verify Warning Message
        cy.get(ARUnsavedChangesModal.getPromptContent()).find('span').should('have.text', 'Are you sure you want to delete this enrollment?')

        // Click on  OK Button
        cy.get(ARDeleteModal.getARDeleteBtn()).should('be.visible').click()
        cy.get(ARDeleteModal.getARDeleteBtn()).should('not.exist')
        cy.get(arDashboardPage.getToastSuccessMsg(), {timeout: 15000}).should('contain', 'User has been un-enrolled.')
        cy.get(AREnrollUsersPage.getWaitSpinner(), {timeout:15000}).should('not.exist')

        // User is Un-enrolled from the course
        cy.get(arDashboardPage.getNoResultMsg()).should('have.text', "No results found.")
    })
})
