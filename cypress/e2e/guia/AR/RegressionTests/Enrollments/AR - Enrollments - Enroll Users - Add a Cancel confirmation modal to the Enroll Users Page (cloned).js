import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import { users } from '../../../../../../helpers/TestData/users/users'
import ARCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import ARILCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage'
import ARDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import AREnrollUsersPage from '../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage'
import ARUnsavedChangesModal from '../../../../../../helpers/AR/pageObjects/Modals/ARUnsavedChangesModal'
import { courses } from '../../../../../../helpers/TestData/Courses/courses'

describe('C1007 AUT-305, AR - Enrollments - Enroll Users - Add a Cancel confirmation modal to the Enroll Users Page (cloned)', function(){
    beforeEach(() => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
    })

    it('Navigate Enroll Users page from Courses report Page', () => {
        arDashboardPage.getCoursesReport()

        arDashboardPage.AddFilter('Name','Equals',courses.oc_filter_01_name)
        cy.get(ARCoursesPage.getWaitSpinner(), {timeout: 5000}).should('not.exist')
        cy.get(ARCoursesPage.getTableCellName(2), { timeout: 50000 }).should('be.visible').and('contain', courses.oc_filter_01_name)
        cy.get(ARCoursesPage.getTableCellName(2)).contains(courses.oc_filter_01_name).click()
        cy.wrap(ARCoursesPage.WaitForElementStateToChange(ARCoursesPage.getAddEditMenuActionsByName('Enroll User'), 1000))
        cy.get(ARCoursesPage.getAddEditMenuActionsByName('Enroll User')).click()

        // Verify Enroll Users Page
        cy.get(AREnrollUsersPage.getEnrollUsersPageTitle(),{timeout:15000}).should('be.visible').and('have.text', 'Enroll Users')

        // Verify course is pre-selected
        cy.get(AREnrollUsersPage.getCourseNameModule()).should('have.text', courses.oc_filter_01_name)

        // enroll one learner
        cy.get(AREnrollUsersPage.getEnrollUsersDDown(),{timeout:15000}).click()
        
        cy.get(AREnrollUsersPage.getEnrollUsersSearchTxtF(),{timeout:15000}).type(users.learner01.learner_01_username)
        
        AREnrollUsersPage.getEnrollUsersOpt(users.learner01.learner_01_username)
        cy.get(AREnrollUsersPage.getWaitSpinner(), {timeout:15000}).should('not.exist')

        // Click on  Cancel Button
        cy.get(AREnrollUsersPage.getCancelBtn()).click()

        // Verify open the Unsaved Changes modal
        cy.get(ARUnsavedChangesModal.getPromptHeader()).should('be.visible').and('have.text', 'Unsaved Changes')

        // Verify Warning Message
        cy.get(ARUnsavedChangesModal.getPromptContent()).find('span').should('have.text', ARUnsavedChangesModal.getUnsavedChangesMsg())

        // clicking [Cancel] button from Modal
        cy.get(ARUnsavedChangesModal.getPromptFooter()).find(ARILCAddEditPage.getCancelBtn()).click()
        cy.get(AREnrollUsersPage.getWaitSpinner(), {timeout:15000}).should('not.exist')

        // Verify Enroll Users Page
        cy.get(AREnrollUsersPage.getEnrollUsersPageTitle(),{timeout:15000}).should('be.visible').and('have.text', 'Enroll Users')

        // Click on  Cancel Button
        cy.get(AREnrollUsersPage.getCancelBtn()).click()

        // Click on  OK Button
        cy.get(ARDeleteModal.getARDeleteBtn()).should('be.visible').click()
        cy.get(ARDeleteModal.getARDeleteBtn()).should('not.exist')
        cy.get(AREnrollUsersPage.getWaitSpinner(), {timeout:15000}).should('not.exist')

        // Verify Admin should be send back to the Courses report page
        cy.get(arDashboardPage.getPageHeaderTitle(), { timeout: 15000 }).should('be.visible').and('contain', 'Courses')
    })

    it('Navigate Enroll Users page from Users report Page', () => {
        arDashboardPage.getUsersReport()

        arDashboardPage.AddFilter('Username','Contains',users.learner02.learner_02_username)
        cy.get(ARCoursesPage.getWaitSpinner(), {timeout: 5000}).should('not.exist')
        cy.get(ARCoursesPage.getTableCellName(4), { timeout: 50000 }).should('be.visible').and('contain', users.learner02.learner_02_username)
        cy.get(ARCoursesPage.getTableCellName(4)).contains(users.learner02.learner_02_username).click()
        cy.wrap(ARCoursesPage.WaitForElementStateToChange(ARCoursesPage.getAddEditMenuActionsByName('Enroll User'), 1000))
        cy.get(ARCoursesPage.getAddEditMenuActionsByName('Enroll User')).click()

        // Verify Enroll Users Page
        cy.get(AREnrollUsersPage.getEnrollUsersPageTitle(),{timeout:15000}).should('be.visible').and('have.text', 'Enroll Users')

        // Verify user is pre-selected
        cy.get(AREnrollUsersPage.getEnrollUsersDDown() + ' ' + AREnrollUsersPage.getLabel()).should('contain', users.learner02.learner_02_fname + ' ' + users.learner02.learner_02_lname)
        
        //add course
        cy.get(arDashboardPage.getElementByDataNameAttribute(AREnrollUsersPage.getEnrollUsersAddCourseBtn())).click()
        //Searching the course 
        AREnrollUsersPage.SearchAndSelectFunction([courses.oc_filter_01_name])
        cy.get(AREnrollUsersPage.getCourseNameModule()).should('have.text', courses.oc_filter_01_name)
        
        // Click on  Cancel Button
        cy.get(AREnrollUsersPage.getCancelBtn()).click()

        // Verify open the Unsaved Changes modal
        cy.get(ARUnsavedChangesModal.getPromptHeader()).should('be.visible').and('have.text', 'Unsaved Changes')

        // Verify Warning Message
        cy.get(ARUnsavedChangesModal.getPromptContent()).find('span').should('have.text', ARUnsavedChangesModal.getUnsavedChangesMsg())

        // clicking [Cancel] button from Modal
        cy.get(ARUnsavedChangesModal.getPromptFooter()).find(ARILCAddEditPage.getCancelBtn()).click()
        cy.get(AREnrollUsersPage.getWaitSpinner(), {timeout:15000}).should('not.exist')

        // Verify Enroll Users Page
        cy.get(AREnrollUsersPage.getEnrollUsersPageTitle(),{timeout:15000}).should('be.visible').and('have.text', 'Enroll Users')

        // Click on  Cancel Button
        cy.get(AREnrollUsersPage.getCancelBtn()).click()

        // Click on  OK Button
        cy.get(ARDeleteModal.getARDeleteBtn()).should('be.visible').click()
        cy.get(ARDeleteModal.getARDeleteBtn()).should('not.exist')
        cy.get(AREnrollUsersPage.getWaitSpinner(), {timeout:15000}).should('not.exist')

        // Verify Admin should be send back to the Courses report page
        cy.get(arDashboardPage.getPageHeaderTitle(), { timeout: 15000 }).should('be.visible').and('contain', 'Users')
    })
})
