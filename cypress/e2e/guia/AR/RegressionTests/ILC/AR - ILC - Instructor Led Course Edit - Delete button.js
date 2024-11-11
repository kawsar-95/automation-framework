import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import { ilcDetails } from '../../../../../../helpers/TestData/Courses/ilc'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../helpers/TestData/users/users'
import ARCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import ARILCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage'
import ARDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'

describe('C6837 AR - ILC - Instructor Led Course Edit - Delete button', function(){
    before('Create ILC, Publish Course', () => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        
        arDashboardPage.getMediumWait()

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
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        
    })

    it('Delete Course From ILC Edit Page', () => {
        arDashboardPage.getMediumWait()

        cy.editCourse(ilcDetails.courseName)
        arDashboardPage.getMediumWait()

        // Verify that [Delete] button has been added to ILC edit page
        cy.get(ARCoursesPage.getCoursesActionsButtonsByLabel('Delete')).should('be.visible')

        // Verify that the added button is the third to the last button and above [View Activity Report] button
        cy.get(ARILCAddEditPage.getILCEditActionBtn()).eq(-3).should('have.attr', 'title', 'Delete')

        // clicking [Delete] button
        cy.get(ARILCAddEditPage.getILCEditActionBtn() + ARCoursesPage.getCoursesActionsButtonsByLabel('Delete')).click()
        arDashboardPage.getShortWait()

        // Verify open the Delete Course modal
        cy.get(ARILCAddEditPage.getElementByDataNameAttribute('prompt-header')).should('have.text', 'Delete Course')

        // Verify Warning Message
        cy.get(ARILCAddEditPage.getElementByDataNameAttribute('prompt-content')).find('span').should('have.text', ARILCAddEditPage.getCourseDeleteWarningMsg(ilcDetails.courseName))
        
        // clicking [Cancel] button from Modal
        cy.get(ARILCAddEditPage.getElementByDataNameAttribute('prompt-footer')).find(ARILCAddEditPage.getCancelBtn()).click()
        arDashboardPage.getShortWait()

        // Verify Course not deleted
        cy.get(ARILCAddEditPage.getPageHeaderTitle()).should('have.text', 'Edit Instructor Led Course')

        // clicking [Delete] button from Modal
        cy.get(ARILCAddEditPage.getILCEditActionBtn() + ARCoursesPage.getCoursesActionsButtonsByLabel('Delete')).click()
        arDashboardPage.getShortWait()
        cy.get(ARDeleteModal.getARDeleteBtn()).click()

        // Verify that a toast message is displayed when course is successfully deleted
        cy.get(arDashboardPage.getToastNotificationMsg()).should('contain', 'Course has been deleted successfully.')
    })
})
