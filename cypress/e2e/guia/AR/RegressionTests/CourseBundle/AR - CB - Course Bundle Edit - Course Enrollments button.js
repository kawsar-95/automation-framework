import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import ARSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import { cbDetails } from '../../../../../../helpers/TestData/Courses/cb'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { courses } from '../../../../../../helpers/TestData/Courses/courses'
import { users } from '../../../../../../helpers/TestData/users/users'
import ARDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import ARILCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage'
import ARUnsavedChangesModal from '../../../../../../helpers/AR/pageObjects/Modals/ARUnsavedChangesModal'
import ARCourseEnrollmentReportPage from '../../../../../../helpers/AR/pageObjects/Reports/ARCourseEnrollmentReportPage'

describe('C2042 AUT-582, AR - CB - Course Bundle Edit - Course Enrollments button', function(){
    before(function() {
        //Sign into admin side as sys admin, create a course
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getCoursesReport()
        
        cy.createCourse('Course Bundle')
        //Add course to course bundle
        ARSelectModal.SearchAndSelectFunction([courses.oc_filter_01_name]) 

        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36));
        })
    })

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getCoursesReport()
    })

    after('Delete This Courses Bundle', () => {
        for (let i = 0; i < commonDetails.courseIDs.length; i++) {
            cy.deleteCourse(commonDetails.courseIDs[i], 'course-bundles')
        }
    })

    it('Course Enrollments From Course Bundles Edit Page', () => {
        cy.editCourse(cbDetails.courseName)
       
        // Verify that [Course Enrollments] button has been added to CB edit page
        cy.get(arCoursesPage.getCoursesActionsButtonsByLabel('Course Enrollments')).should('be.visible')

        // Verify that the added button is the last button
        cy.get(ARILCAddEditPage.getILCEditActionBtn()).eq(-1).should('have.attr', 'title', 'Course Enrollments')

        // clicking [Course Enrollments] button
        cy.get(ARILCAddEditPage.getILCEditActionBtn() + arCoursesPage.getCoursesActionsButtonsByLabel('Course Enrollments')).click()

        cy.get(ARUnsavedChangesModal.getPromptHeader()).should('have.text', 'Unsaved Changes')
        cy.get(ARDeleteModal.getARDeleteBtn(), {timeout:10000}).should('be.visible').click()
        cy.get(ARDeleteModal.getARDeleteBtn(), {timeout:10000}).should('not.exist')

        // Verify Adminredirected to the course enrollment report
        cy.get(arCoursesPage.getPageHeaderTitle(), { timeout: 10000 }).should('be.visible').and('contain', 'Course Enrollments')
        cy.get(arCoursesPage.getWaitSpinner()).should('not.exist')

        // Verify Page is filtered based on previously selected course
        ARCourseEnrollmentReportPage.verifyFilteredPropertyAndValue('Course', cbDetails.courseName)
    })
})