import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../helpers/TestData/users/users'
import ARCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import ARILCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage'
import ARDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import AREnrollUsersPage from '../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage'
import ARUnsavedChangesModal from '../../../../../../helpers/AR/pageObjects/Modals/ARUnsavedChangesModal'
import { ocDetails } from '../../../../../../helpers/TestData/Courses/oc'

describe('C6841 AUT-773, AR - OC - Online Course Edit - Enroll User button', function(){
    before('Create OC, Publish Course', () => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        arDashboardPage.getMediumWait()

        // Create Online Course
        cy.createCourse("Online Course");

        // Publish Online Course
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
    })

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        
        arDashboardPage.getMediumWait()
    })

    after('Delete Created Course', function() {
        cy.deleteCourse(commonDetails.courseID);
    })

    it('No changes And Click on Cancel Button on Enroll User Page', () => {
        cy.editCourse(ocDetails.courseName)
        // cy.editCourse('')
        arDashboardPage.getMediumWait()

        // Verify that [Enroll User] button has been added to Online Course edit page
        cy.get(ARCoursesPage.getCoursesActionsButtonsByLabel('Enroll User')).should('be.visible')

        // Verify that Button should be placed below View History and above Duplicate
        cy.get(ARILCAddEditPage.getILCEditActionBtn()).eq(0).should('have.attr', 'title', 'Enroll User')

        // clicking [Enroll User] button
        cy.get(ARILCAddEditPage.getILCEditActionBtn() + ARCoursesPage.getCoursesActionsButtonsByLabel('Enroll User')).click()
        arDashboardPage.getShortWait()

        cy.get(ARDeleteModal.getARDeleteBtn()).click()
        arDashboardPage.getMediumWait()

        // Verify Enroll Users Page
        cy.get(AREnrollUsersPage.getEnrollUsersPageTitle()).should('have.text', 'Enroll Users')

        // Verify course is pre-selected
        cy.get(AREnrollUsersPage.getCourseNameModule()).should('have.text', ocDetails.courseName)

        // No changes Click on  Cancel Button
        cy.get(AREnrollUsersPage.getCancelBtn()).click()
        arDashboardPage.getMediumWait()

        // Admin will be returned to the  Edit Online Course page
        cy.get(ARILCAddEditPage.getPageHeaderTitle()).should('have.text', 'Edit Online Course')
    })

    it('Make changes And Click on Cancel Button on Enroll User Page', () => {
        cy.editCourse(ocDetails.courseName)
        arDashboardPage.getMediumWait()

        // Verify that [Enroll User] button has been added to ILC edit page
        cy.get(ARCoursesPage.getCoursesActionsButtonsByLabel('Enroll User')).should('be.visible')

        // Verify that Button should be placed below View History and above Duplicate
        cy.get(ARILCAddEditPage.getILCEditActionBtn()).eq(0).should('have.attr', 'title', 'Enroll User')

        // clicking [Enroll User] button
        cy.get(ARILCAddEditPage.getILCEditActionBtn() + ARCoursesPage.getCoursesActionsButtonsByLabel('Enroll User')).click()
        arDashboardPage.getShortWait()

        cy.get(ARDeleteModal.getARDeleteBtn()).click()
        arDashboardPage.getMediumWait()

        // Verify Enroll Users Page
        cy.get(AREnrollUsersPage.getEnrollUsersPageTitle()).should('have.text', 'Enroll Users')

        // Verify course is pre-selected
        cy.get(AREnrollUsersPage.getCourseNameModule()).should('have.text', ocDetails.courseName)

        // enroll one learner
        cy.get(AREnrollUsersPage.getEnrollUsersDDown()).click()
        arDashboardPage.getShortWait()
        cy.get(AREnrollUsersPage.getEnrollUsersSearchTxtF()).type('GUIAutoL01')
        arDashboardPage.getShortWait()
        AREnrollUsersPage.getEnrollUsersOpt('GUIAutoL01')
        arDashboardPage.getMediumWait()

        // Click on  Cancel Button
        cy.get(AREnrollUsersPage.getCancelBtn()).click()
        arDashboardPage.getShortWait()

        // Verify open the Unsaved Changes modal
        cy.get(ARUnsavedChangesModal.getPromptHeader()).should('have.text', 'Unsaved Changes')

        // Verify Warning Message
        cy.get(ARUnsavedChangesModal.getPromptContent()).find('span').should('have.text', ARUnsavedChangesModal.getUnsavedChangesMsg())

        // clicking [Cancel] button from Modal
        cy.get(ARUnsavedChangesModal.getPromptFooter()).find(ARILCAddEditPage.getCancelBtn()).click()
        arDashboardPage.getShortWait()

        // Verify Enroll Users Page
        cy.get(AREnrollUsersPage.getEnrollUsersPageTitle()).should('have.text', 'Enroll Users')

        // Click on  Cancel Button
        cy.get(AREnrollUsersPage.getCancelBtn()).click()
        arDashboardPage.getShortWait()

        // Click on  OK Button
        cy.get(ARDeleteModal.getARDeleteBtn()).click()
        arDashboardPage.getMediumWait()

        // Admin will be returned to the  Edit Online Course page
        cy.get(ARILCAddEditPage.getPageHeaderTitle()).should('have.text', 'Edit Online Course')
    })

    it('Enroll one learner and click on Save Button', () => {
        cy.editCourse(ocDetails.courseName)
        arDashboardPage.getMediumWait()

        // Verify that [Enroll User] button has been added to ILC edit page
        cy.get(ARCoursesPage.getCoursesActionsButtonsByLabel('Enroll User')).should('be.visible')

        // Verify that Button should be placed below View History and above Duplicate
        cy.get(ARILCAddEditPage.getILCEditActionBtn()).eq(0).should('have.attr', 'title', 'Enroll User')

        // clicking [Enroll User] button
        cy.get(ARILCAddEditPage.getILCEditActionBtn() + ARCoursesPage.getCoursesActionsButtonsByLabel('Enroll User')).click()
        arDashboardPage.getShortWait()

        cy.get(ARDeleteModal.getARDeleteBtn()).click()
        arDashboardPage.getMediumWait()

        // Verify Enroll Users Page
        cy.get(AREnrollUsersPage.getEnrollUsersPageTitle()).should('have.text', 'Enroll Users')

        // Verify course is pre-selected
        cy.get(AREnrollUsersPage.getCourseNameModule()).should('have.text', ocDetails.courseName)

        // enroll one learner
        cy.get(AREnrollUsersPage.getEnrollUsersDDown()).click()
        arDashboardPage.getShortWait()
        cy.get(AREnrollUsersPage.getEnrollUsersSearchTxtF()).type('GUIAutoL01')
        arDashboardPage.getShortWait()
        AREnrollUsersPage.getEnrollUsersOpt('GUIAutoL01')
        arDashboardPage.getMediumWait()

        // Click on  Save Button
        cy.get(AREnrollUsersPage.getSaveBtn()).click()

        // Verify that a toast message is displayed when user is successfully enrolled
        cy.get(arDashboardPage.getToastNotificationMsg()).should('contain', 'User has been enrolled.')

        // Admin will be returned to the  Edit Online Course page
        cy.get(ARILCAddEditPage.getPageHeaderTitle()).should('have.text', 'Edit Online Course')
    })

    it('Enroll more than one learner and click on Save Button', () => {
        cy.editCourse(ocDetails.courseName)
        arDashboardPage.getMediumWait()

        // Verify that [Enroll User] button has been added to ILC edit page
        cy.get(ARCoursesPage.getCoursesActionsButtonsByLabel('Enroll User')).should('be.visible')

        // Verify that Button should be placed below View History and above Duplicate
        cy.get(ARILCAddEditPage.getILCEditActionBtn()).eq(0).should('have.attr', 'title', 'Enroll User')

        // clicking [Enroll User] button
        cy.get(ARILCAddEditPage.getILCEditActionBtn() + ARCoursesPage.getCoursesActionsButtonsByLabel('Enroll User')).click()
        arDashboardPage.getShortWait()

        cy.get(ARDeleteModal.getARDeleteBtn()).click()
        arDashboardPage.getMediumWait()

        // Verify Enroll Users Page
        cy.get(AREnrollUsersPage.getEnrollUsersPageTitle()).should('have.text', 'Enroll Users')

        // Verify course is pre-selected
        cy.get(AREnrollUsersPage.getCourseNameModule()).should('have.text', ocDetails.courseName)

        // enroll Two learner
        cy.get(AREnrollUsersPage.getEnrollUsersDDown()).click()
        arDashboardPage.getShortWait()
        cy.get(AREnrollUsersPage.getEnrollUsersSearchTxtF()).type('GUIAutoL01')
        arDashboardPage.getShortWait()
        AREnrollUsersPage.getEnrollUsersOpt('GUIAutoL01')
        arDashboardPage.getMediumWait()

        cy.get(AREnrollUsersPage.getEnrollUsersSearchTxtF()).clear().type('GUIAutoL02')
        arDashboardPage.getShortWait()
        AREnrollUsersPage.getEnrollUsersOpt('GUIAutoL02')
        arDashboardPage.getMediumWait()

        // Click on  Save Button
        cy.get(AREnrollUsersPage.getSaveBtn()).click()

        // Verify that a toast message is displayed when user is successfully enrolled
        cy.get(arDashboardPage.getToastNotificationMsg()).should('contain', 'Enrollment Requested')
        arDashboardPage.getShortWait()
        cy.get(arDashboardPage.getToastNotificationMsg()).should('contain', 'Enrollment Successful')

        // Admin will be returned to the  Edit Online Course page
        cy.get(ARILCAddEditPage.getPageHeaderTitle()).should('have.text', 'Edit Online Course')
    })
})