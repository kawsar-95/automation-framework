import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import { ilcDetails } from '../../../../../../helpers/TestData/Courses/ilc'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../helpers/TestData/users/users'
import ARCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import ARILCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage'
import ARDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import ARUnsavedChangesModal from '../../../../../../helpers/AR/pageObjects/Modals/ARUnsavedChangesModal'
import ARCourseEnrollmentReportPage from '../../../../../../helpers/AR/pageObjects/Reports/ARCourseEnrollmentReportPage'

describe('C2043 AUT-583, AR - ILC - Instructor Led Course Edit - View Activity Report button', function(){
    before('Create ILC, Publish Course', () => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getCoursesReport()

        // Create ILC course
        cy.createCourse('Instructor Led', ilcDetails.courseName, false)

        //Publish ILC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
    })

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getCoursesReport()
    })

    after('Delete Created Course', function() {
        cy.deleteCourse(commonDetails.courseID, 'instructor-led-courses-new')
    })

    it('View Activity Report From Instructor Led Course Edit Page', () => {
        cy.editCourse(ilcDetails.courseName)
       
        // Verify that [View Activity Report] button has been added to ILC edit page
        cy.get(ARCoursesPage.getCoursesActionsButtonsByLabel('View Activity Report')).should('be.visible')

        // Verify that the added button is the 2nd last and above the [View Enrollments] button
        cy.get(ARILCAddEditPage.getILCEditActionBtn()).eq(-2).should('have.attr', 'title', 'View Activity Report')
        cy.get(ARILCAddEditPage.getILCEditActionBtn()).eq(-1).should('have.attr', 'title', 'Course Enrollments')

        // clicking [View Activity Report] button
        cy.get(ARILCAddEditPage.getILCEditActionBtn() + ARCoursesPage.getCoursesActionsButtonsByLabel('View Activity Report')).click()

        cy.get(ARUnsavedChangesModal.getPromptHeader()).should('have.text', 'Unsaved Changes')
        cy.get(ARDeleteModal.getARDeleteBtn(), {timeout:10000}).should('be.visible').click()
        cy.get(ARDeleteModal.getARDeleteBtn(), {timeout:10000}).should('not.exist')

        // Verify Admin redirected to the ILC Activity report
        cy.get(ARCoursesPage.getPageHeaderTitle(), { timeout: 10000 }).should('be.visible').and('contain', 'ILC Activity')
        cy.get(ARCoursesPage.getWaitSpinner()).should('not.exist')

        // Verify Page is filtered based on previously selected course
        ARCourseEnrollmentReportPage.verifyFilteredPropertyAndValue('Course', ilcDetails.courseName)
    })
})