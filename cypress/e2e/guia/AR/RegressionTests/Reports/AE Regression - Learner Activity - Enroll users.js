import ARCollaborationAddEditPage from "../../../../../../helpers/AR/pageObjects/Collaborations/ARCollaborationAddEditPage"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARDeleteModal from "../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal"
import ARSelectModal from "../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal"
import { userDetails } from "../../../../../../helpers/TestData/users/UserDetails"
import { users } from "../../../../../../helpers/TestData/users/users"
import AREnrollUsersPage from '../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage'
import { ocDetails } from "../../../../../../helpers/TestData/Courses/oc"
import { commonDetails } from "../../../../../../helpers/TestData/Courses/commonDetails"
import ARLearnerActivityReportPage from "../../../../../../helpers/AR/pageObjects/Reports/ARLearnerActivityReportPage"

describe('C7275 - AUT-662 - AE - Core Regression - Learner Activity - Enroll users', () => {
    before('Create a test User and an online course for the test', () => {
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
         // Sign into admin side as sys admin, navigate to Courses
         cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
         ARDashboardPage.getCoursesReport()
         // Create Online Course
         cy.createCourse("Online Course");
         // Publish Online Course
         cy.publishCourseAndReturnId().then((id) => {
             commonDetails.courseID = id.request.url.slice(-36);
         })
    })

    beforeEach(() => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
    })

    after('Delete the test course and user', () => {
        // Delete the online course
        cy.deleteCourse(commonDetails.courseID);
        // Delete the test user
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Users'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Users'))
        cy.wrap(ARDashboardPage.AddFilter('Username', 'Equals', userDetails.username))
        cy.wrap(ARDashboardPage.selectTableCellRecord(userDetails.username))
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Delete'), {timeout: 3000}).should('have.attr', 'aria-disabled', 'false').click()
        cy.get(ARDashboardPage.getElementByDataNameAttribute(ARDeleteModal.getDeleteBtn()), {timeout: 3000}).should('be.visible').click()
        cy.get(ARDashboardPage.getNoResultMsg()).contains('No results found.').should('exist')
    })

    it('Verify Learner Activity including Enrollment', () => {
        // Navigate to Learner Activity
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Reports')).click()
        // Click on learner Activity
        ARDashboardPage.getMenuItemOptionByName('Learner Activity')
        // Select any existing learner activity
        cy.wrap(ARLearnerActivityReportPage.AddFilter('Username', 'Contains', userDetails.username))
        cy.get(ARDashboardPage.getGridTable()).eq(0).click()        
         // Action items Should be displayed
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Edit User')).should('exist')
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Message User')).should('exist')
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('User Transcript')).should('exist')
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('View Enrollments')).should('exist')
        cy.get(ARDashboardPage.getDeselectBtn()).should('exist')
        // Click on Edit user
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Edit User')).should('have.attr', 'aria-disabled', 'false').click({force: true})
        cy.get(ARCollaborationAddEditPage.getPageHeader(), {timeout: 5000}).should('contain', 'Edit User')
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Enroll User')).should('exist')
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Assign Competencies')).should('exist')
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Message User')).should('exist')
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('User Transcript')).should('exist')
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('View History')).should('exist')
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Reset Password')).should('exist')
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Merge User')).should('exist')
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Duplicate')).should('exist')
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Delete')).should('exist')

        // Click on enroll users
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Enroll User')).should('exist').click()

        // Add Course
        cy.get(ARDashboardPage.getElementByDataNameAttribute(AREnrollUsersPage.getEnrollUsersAddCourseBtn())).click()
        // Search and select course 
        cy.get(ARSelectModal.getSearchTxtF()).clear().type(ocDetails.courseName);
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ocDetails.courseName)).should('have.attr', 'aria-selected', 'false').click()

        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ocDetails.courseName)).should('have.attr', 'aria-selected', 'true')
        cy.get(ARSelectModal.getChooseBtn()).contains('Choose').click();

        // Verify course is selected
        cy.get(AREnrollUsersPage.getCourseNameModule()).should('have.text', ocDetails.courseName)

        // Vrify Enrollment should be saved successfully
        cy.get(AREnrollUsersPage.getSaveBtn()).click()

        // Verify that a toast message is displayed when user is successfully enrolled
        cy.get(ARDashboardPage.getToastNotificationMsg()).should('contain', 'User has been enrolled.')
    })
})