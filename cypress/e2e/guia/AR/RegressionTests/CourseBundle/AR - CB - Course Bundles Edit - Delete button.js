import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import ARSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import { cbDetails } from '../../../../../../helpers/TestData/Courses/cb'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { courses } from '../../../../../../helpers/TestData/Courses/courses'
import { users } from '../../../../../../helpers/TestData/users/users'
import ARDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import ARILCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage'

describe('C6838 AUT-771, AR - CB - Course Bundles Edit - Delete button', function(){
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

    it('Delete Course From Course Bundles Edit Page', () => {
        cy.editCourse(cbDetails.courseName)
       

        // Verify that [Delete] button has been added to CB edit page
        cy.get(arCoursesPage.getCoursesActionsButtonsByLabel('Delete')).should('be.visible')

        // Verify that the added button is the third to the last button and above [View Activity Report] button
        cy.get(ARILCAddEditPage.getILCEditActionBtn()).eq(-2).should('have.attr', 'title', 'Delete')

        // clicking [Delete] button
        cy.get(ARILCAddEditPage.getILCEditActionBtn() + arCoursesPage.getCoursesActionsButtonsByLabel('Delete')).click()
       

        // Verify open the Delete Course modal
        cy.get(arCoursesPage.getElementByDataNameAttribute('prompt-header')).should('have.text', 'Delete Course')

        // Verify Warning Message
        cy.get(arCoursesPage.getElementByDataNameAttribute('prompt-content')).find('span').should('have.text', ARILCAddEditPage.getCourseDeleteWarningMsg(cbDetails.courseName))
        
        // clicking [Cancel] button from Modal
        cy.get(arCoursesPage.getElementByDataNameAttribute('prompt-footer')).find(arCoursesPage.getCancelBtn()).click()
       

        // Verify Course not deleted
        cy.get(arCoursesPage.getPageHeaderTitle()).should('have.text', 'Edit Course Bundle')

        // clicking [Delete] button from Modal
        cy.get(ARILCAddEditPage.getILCEditActionBtn() + arCoursesPage.getCoursesActionsButtonsByLabel('Delete')).click()
       
        cy.get(ARDeleteModal.getARDeleteBtn()).click()

        // Verify that a toast message is displayed when course is successfully deleted
        cy.get(arDashboardPage.getToastNotificationMsg()).should('contain', 'Course has been deleted successfully.')
    })
})