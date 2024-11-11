import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../helpers/TestData/users/users'
import ARCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import ARILCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage'
import ARDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import AREnrollUsersPage from '../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage'
import ARUnsavedChangesModal from '../../../../../../helpers/AR/pageObjects/Modals/ARUnsavedChangesModal'
import ARSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import { courses } from '../../../../../../helpers/TestData/Courses/courses'
import { cbDetails } from '../../../../../../helpers/TestData/Courses/cb'

describe('C6836 AUT-768, AR - CB - Course Bundle Edit - Enroll User button', function(){
    before('Create CB, Publish Course', () => {
        // Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getCoursesReport()
        cy.createCourse('Course Bundle')
        // Add course to course bundle
        ARSelectModal.SearchAndSelectFunction([courses.oc_filter_01_name])

        // Publish Online Course
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
        cy.get(AREnrollUsersPage.getWaitSpinner(), {timeout:15000}).should('not.exist')
    })

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getCoursesReport()
    })

    after('Delete Created Course', function() {
        cy.deleteCourse(commonDetails.courseID, 'course-bundles');
    })

    it('No changes And Click on Cancel Button on Enroll User Page', () => {
        cy.editCourse(cbDetails.courseName)
        cy.get(AREnrollUsersPage.getWaitSpinner(), {timeout:15000}).should('not.exist')

        // Verify that [Enroll User] button has been added to Online Course edit page
        cy.get(ARCoursesPage.getCoursesActionsButtonsByLabel('Enroll User') , {timeout:15000}).should('be.visible')

        // Verify that Button should be placed below View History and above Duplicate
        cy.get(ARILCAddEditPage.getILCEditActionBtn(),{timeout:15000}).eq(0).should('have.attr', 'title', 'Enroll User')

        // clicking [Enroll User] button
        cy.get(ARILCAddEditPage.getILCEditActionBtn() + ARCoursesPage.getCoursesActionsButtonsByLabel('Enroll User')).click()
       

        cy.get(ARDeleteModal.getARDeleteBtn()).click()
        cy.get(AREnrollUsersPage.getEnrollUsersPageTitle(),{timeout:15000}).should('be.visible').and('contain' , 'Enroll Users')
        // Verify Enroll Users Page
        cy.get(AREnrollUsersPage.getEnrollUsersPageTitle()).should('have.text', 'Enroll Users')

        // Verify course is pre-selected
        cy.get(AREnrollUsersPage.getCourseNameModule()).should('have.text', cbDetails.courseName)

        // No changes Click on  Cancel Button
        cy.get(AREnrollUsersPage.getCancelBtn()).click()
      
        cy.get(ARILCAddEditPage.getPageHeaderTitle(),{timeout:15000}).should('exist')
        // Admin will be returned to the  Edit Online Course page
        cy.get(ARILCAddEditPage.getPageHeaderTitle()).should('have.text', 'Edit Course Bundle')
    })

    it('Make changes And Click on Cancel Button on Enroll User Page', () => {
        cy.editCourse(cbDetails.courseName)
        cy.get(AREnrollUsersPage.getWaitSpinner(), {timeout:15000}).should('not.exist')

        // Verify that [Enroll User] button has been added to ILC edit page
        cy.get(ARCoursesPage.getCoursesActionsButtonsByLabel('Enroll User') , {timeout:15000}).should('be.visible')

        // Verify that Button should be placed below View History and above Duplicate
        cy.get(ARILCAddEditPage.getILCEditActionBtn()).eq(0).should('have.attr', 'title', 'Enroll User')

        // clicking [Enroll User] button
        cy.get(ARILCAddEditPage.getILCEditActionBtn() + ARCoursesPage.getCoursesActionsButtonsByLabel('Enroll User')).click()
       

        cy.get(ARDeleteModal.getARDeleteBtn()).click()
       
        cy.get(AREnrollUsersPage.getEnrollUsersPageTitle(),{timeout:15000}).should('be.visible')
        // Verify Enroll Users Page
        cy.get(AREnrollUsersPage.getEnrollUsersPageTitle()).should('have.text', 'Enroll Users')

        // Verify course is pre-selected
        cy.get(AREnrollUsersPage.getCourseNameModule()).should('have.text', cbDetails.courseName)

        // enroll one learner
        cy.get(AREnrollUsersPage.getEnrollUsersDDown(),{timeout:15000}).click()
     
        cy.get(AREnrollUsersPage.getEnrollUsersSearchTxtF(),{timeout:15000}).type('GUIAutoL01')
      
        AREnrollUsersPage.getEnrollUsersOpt('GUIAutoL01')
        cy.get(AREnrollUsersPage.getWaitSpinner(), {timeout:15000}).should('not.exist')

        // Click on  Cancel Button
        cy.get(AREnrollUsersPage.getCancelBtn()).click()
        cy.get(ARUnsavedChangesModal.getPromptHeader()).should('exist').and('be.visible')

        // Verify open the Unsaved Changes modal
        cy.get(ARUnsavedChangesModal.getPromptHeader()).should('have.text', 'Unsaved Changes')

        // Verify Warning Message
        cy.get(ARUnsavedChangesModal.getPromptContent()).find('span').should('have.text', ARUnsavedChangesModal.getUnsavedChangesMsg())

        // clicking [Cancel] button from Modal
        cy.get(ARUnsavedChangesModal.getPromptFooter()).find(ARILCAddEditPage.getCancelBtn()).click()
        cy.get(AREnrollUsersPage.getWaitSpinner(), {timeout:15000}).should('not.exist')
        // Verify Enroll Users Page
        cy.get(AREnrollUsersPage.getEnrollUsersPageTitle(),{timeout:15000}).should('be.visible')
        cy.get(AREnrollUsersPage.getEnrollUsersPageTitle()).should('have.text', 'Enroll Users')

        // Click on  Cancel Button
        cy.get(AREnrollUsersPage.getCancelBtn()).click()
       
        // Click on  OK Button
        cy.get(ARDeleteModal.getARDeleteBtn()).click()
        cy.get(AREnrollUsersPage.getWaitSpinner(), {timeout:15000}).should('not.exist')

        // Admin will be returned to the  Edit Online Course page
        cy.get(ARILCAddEditPage.getPageHeaderTitle(),{timeout:15000}).should('exist').and('be.visible')
        cy.get(ARILCAddEditPage.getPageHeaderTitle()).should('have.text', 'Edit Course Bundle')
    })

    it('Enroll one learner and click on Save Button', () => {
        cy.editCourse(cbDetails.courseName)
        cy.get(AREnrollUsersPage.getWaitSpinner(), {timeout:15000}).should('not.exist')
       
        // Verify that [Enroll User] button has been added to ILC edit page
        cy.get(ARCoursesPage.getCoursesActionsButtonsByLabel('Enroll User'),{timeout:15000}).should('be.visible')

        // Verify that Button should be placed below View History and above Duplicate
        cy.get(ARILCAddEditPage.getILCEditActionBtn()).eq(0).should('have.attr', 'title', 'Enroll User')

        // clicking [Enroll User] button
        cy.get(ARILCAddEditPage.getILCEditActionBtn() + ARCoursesPage.getCoursesActionsButtonsByLabel('Enroll User')).click()
       

        cy.get(ARDeleteModal.getARDeleteBtn()).click()
        cy.get(AREnrollUsersPage.getWaitSpinner(), {timeout:15000}).should('not.exist')

        // Verify Enroll Users Page
        cy.get(AREnrollUsersPage.getEnrollUsersPageTitle()).should('have.text', 'Enroll Users')

        // Verify course is pre-selected
        cy.get(AREnrollUsersPage.getCourseNameModule()).should('have.text', cbDetails.courseName)

        // enroll one learner
        cy.get(AREnrollUsersPage.getEnrollUsersDDown()).click()
        cy.get(AREnrollUsersPage.getWaitSpinner(), {timeout:15000}).should('not.exist')
        cy.get(AREnrollUsersPage.getEnrollUsersSearchTxtF()).type('GUIAutoL01')
       
        AREnrollUsersPage.getEnrollUsersOpt('GUIAutoL01')
        cy.get(AREnrollUsersPage.getWaitSpinner(), {timeout:15000}).should('not.exist')

        // Click on  Save Button
        cy.get(AREnrollUsersPage.getSaveBtn(), {timeout:15000}).click()
        cy.get(AREnrollUsersPage.getWaitSpinner(), {timeout:15000}).should('not.exist')
        // Verify that a toast message is displayed when user is successfully enrolled
        cy.get(arDashboardPage.getToastNotificationMsg()).should('contain', 'User has been enrolled.')
        cy.get(ARILCAddEditPage.getPageHeaderTitle(),{timeout:15000}).should('exist').and('be.visible')
        // Admin will be returned to the  Edit Online Course page
        cy.get(ARILCAddEditPage.getPageHeaderTitle()).should('have.text', 'Edit Course Bundle')
    })

    it('Enroll more than one learner and click on Save Button', () => {
        cy.editCourse(cbDetails.courseName)
        cy.get(AREnrollUsersPage.getWaitSpinner(), {timeout:15000}).should('not.exist')

        // Verify that [Enroll User] button has been added to ILC edit page
        cy.get(ARCoursesPage.getCoursesActionsButtonsByLabel('Enroll User')).should('be.visible')

        // Verify that Button should be placed below View History and above Duplicate
        cy.get(ARILCAddEditPage.getILCEditActionBtn()).eq(0).should('have.attr', 'title', 'Enroll User')

        // clicking [Enroll User] button
        cy.get(ARILCAddEditPage.getILCEditActionBtn() + ARCoursesPage.getCoursesActionsButtonsByLabel('Enroll User')).click()
       

        cy.get(ARDeleteModal.getARDeleteBtn()).click()
       

        // Verify Enroll Users Page
        cy.get(AREnrollUsersPage.getEnrollUsersPageTitle()).should('have.text', 'Enroll Users')

        // Verify course is pre-selected
        cy.get(AREnrollUsersPage.getCourseNameModule()).should('have.text', cbDetails.courseName)

        // enroll Two learner
        cy.get(AREnrollUsersPage.getEnrollUsersDDown()).click()
      
        cy.get(AREnrollUsersPage.getEnrollUsersSearchTxtF()).type('GUIAutoL01')
     
        AREnrollUsersPage.getEnrollUsersOpt('GUIAutoL01')
      
        cy.get(AREnrollUsersPage.getWaitSpinner(), {timeout:15000}).should('not.exist')
        cy.get(AREnrollUsersPage.getEnrollUsersSearchTxtF()).clear().type('GUIAutoL02')
     
        AREnrollUsersPage.getEnrollUsersOpt('GUIAutoL02')
      
        // Click on  Save Button
        cy.get(AREnrollUsersPage.getSaveBtn()).click()
        cy.get(AREnrollUsersPage.getWaitSpinner(), {timeout:15000}).should('not.exist')
        // Verify that a toast message is displayed when user is successfully enrolled
        cy.get(arDashboardPage.getToastNotificationMsg()).should('contain', 'Enrollment Requested')
        arDashboardPage.getShortWait()
        cy.get(arDashboardPage.getToastNotificationMsg(),{timeout:40000}).should('contain', 'Enrollment Successful')
        cy.get(ARILCAddEditPage.getPageHeaderTitle()).should('exist').and('be.visible')
        // Admin will be returned to the  Edit Online Course page
        cy.get(ARILCAddEditPage.getPageHeaderTitle()).should('have.text', 'Edit Course Bundle')
    })
})
