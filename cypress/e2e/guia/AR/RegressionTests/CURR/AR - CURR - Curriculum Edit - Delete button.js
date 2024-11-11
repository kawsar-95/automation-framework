import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import ARSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { courses } from '../../../../../../helpers/TestData/Courses/courses'
import { users } from '../../../../../../helpers/TestData/users/users'
import ARDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import ARILCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage'
import ARCURRAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/CURR/ARCURRAddEditPage'
import { currDetails } from '../../../../../../helpers/TestData/Courses/curr'
import ARDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'

describe('C6839 AUT-771, AR - CURR - Curriculum Edit - Delete button', function(){
    before(function() {
        // Sign into admin side as sys admin, create a course
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getCoursesReport()
         
       // Create Curriculum Course
       cy.createCourse('Curriculum')

       // Add courses to curriculum - verify multiple courses are added in the order they are selected
       ARSelectModal.SearchAndSelectFunction([courses.oc_filter_01_name, courses.oc_filter_02_name])
       ARSelectModal.getLShortWait()

       // Verify courses were added in correct order
       cy.get(ARCURRAddEditPage.getElementByAriaLabelAttribute('Course 1 of 2')).should('contain', courses.oc_filter_01_name)
       cy.get(ARCURRAddEditPage.getElementByAriaLabelAttribute('Course 2 of 2')).should('contain', courses.oc_filter_02_name)

        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36));
        })
    })

    beforeEach(() => {
        // Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getCoursesReport()
    })

    it('Delete Course From Curriculum Edit Page', () => {
        cy.editCourse(currDetails.courseName)
        arDashboardPage.getMediumWait()

        // Verify that [Delete] button has been added to Curr edit page
        cy.get(arCoursesPage.getCoursesActionsButtonsByLabel('Delete')).should('be.visible')

        // Verify that the added button is the third to the last button and above [View Activity Report] button
        cy.get(ARILCAddEditPage.getILCEditActionBtn()).eq(-3).should('have.attr', 'title', 'Delete')

        // clicking [Delete] button
        cy.get(ARILCAddEditPage.getILCEditActionBtn() + arCoursesPage.getCoursesActionsButtonsByLabel('Delete')).click()
        arDashboardPage.getShortWait()

        // Verify open the Delete Course modal
        cy.get(arCoursesPage.getElementByDataNameAttribute('prompt-header')).should('have.text', 'Delete Course')

        // Verify Warning Message
        cy.get(arCoursesPage.getElementByDataNameAttribute('prompt-content')).find('span').should('have.text', ARILCAddEditPage.getCourseDeleteWarningMsg(currDetails.courseName))
        
        // clicking [Cancel] button from Modal
        cy.get(arCoursesPage.getElementByDataNameAttribute('prompt-footer')).find(arCoursesPage.getCancelBtn()).click()
        arDashboardPage.getShortWait()

        // Verify Course not deleted
        cy.get(arCoursesPage.getPageHeaderTitle()).should('have.text', 'Edit Curriculum')

        // clicking [Delete] button from Modal
        cy.get(ARILCAddEditPage.getILCEditActionBtn() + arCoursesPage.getCoursesActionsButtonsByLabel('Delete')).click()
        arDashboardPage.getShortWait()
        cy.get(ARDeleteModal.getARDeleteBtn()).click()

        // Verify that a toast message is displayed when course is successfully deleted
        cy.get(arDashboardPage.getToastNotificationMsg()).should('contain', 'Course has been deleted successfully.')
    })
})