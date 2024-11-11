import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../helpers/TestData/users/users'
import { courses } from '../../../../../../helpers/TestData/Courses/courses'
import ARSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import ARCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import ARILCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage'
import ARUnsavedChangesModal from '../../../../../../helpers/AR/pageObjects/Modals/ARUnsavedChangesModal'
import ARPublishModal from '../../../../../../helpers/AR/pageObjects/Modals/ARPublishModal'
import { cbDetails } from '../../../../../../helpers/TestData/Courses/cb'

describe('C962 AUT-164, AR - CB - A Course Bundle Makes use of the Draft State (cloned)', function(){
    beforeEach(() => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getCoursesReport()
    })

    after(function() {        
        cy.deleteCourse(commonDetails.courseID, 'course-bundles')
    })

    it('Cancel Course Bundle creation', () => {
        // Don't make any edits and Click 'Cancel'
        cy.get(ARCoursesPage.getCoursesActionsButtonsByLabel('Add Course Bundle')).should('have.text', 'Add Course Bundle').should('have.attr', 'aria-disabled', 'false').click()
        cy.get(arDashboardPage.getPageHeaderTitle(), { timeout: 15000 }).should('be.visible').and('contain', 'Add Course Bundle')
        cy.get(arDashboardPage.getCancelBtn()).should('be.visible').click()
        // Course Bundle creation is canceled
        cy.get(arDashboardPage.getPageHeaderTitle(), { timeout: 15000 }).should('be.visible').and('contain', 'Courses')
        cy.get(arDashboardPage.getWaitSpinner()).should('not.exist')

        // Make edits and Click Cancel
        cy.get(ARCoursesPage.getCoursesActionsButtonsByLabel('Add Course Bundle')).should('have.text', 'Add Course Bundle').should('have.attr', 'aria-disabled', 'false').click()
        cy.get(arDashboardPage.getPageHeaderTitle(), { timeout: 15000 }).should('be.visible').and('contain', 'Add Course Bundle')
        cy.get(arDashboardPage.getWaitSpinner()).should('not.exist')
        arDashboardPage.generalToggleSwitch('true',ARILCAddEditPage.getGeneralStatusToggleContainerName())
        cy.get(arDashboardPage.getCancelBtn()).should('be.visible').click()
        // The Unsaved Changes modal pops up
        cy.get(ARUnsavedChangesModal.getPromptHeader()).should('have.text', 'Unsaved Changes')
        // When Cancel is clicked, the modal closes and user is returned to the Edit Course Bundle page
        cy.get(ARUnsavedChangesModal.getCancelBtn()).click()
        cy.get(arDashboardPage.getPageHeaderTitle(), { timeout: 15000 }).should('be.visible').and('contain', 'Add Course Bundle')

        // When OK is clicked, the user is redirected to the Courses report page
        cy.get(arDashboardPage.getCancelBtn()).should('be.visible').click()
        // The Unsaved Changes modal pops up
        cy.get(ARUnsavedChangesModal.getPromptHeader()).should('have.text', 'Unsaved Changes')
        cy.get(ARUnsavedChangesModal.getOKBtn()).click()
        cy.get(ARUnsavedChangesModal.getOKBtn()).should('not.exist')
        // Course Bundle creation is canceled
        cy.get(arDashboardPage.getPageHeaderTitle(), { timeout: 15000 }).should('be.visible').and('contain', 'Courses')
    })

    it('Create Course Bundle', () => {
        cy.createCourse('Course Bundle')

        ARSelectModal.SearchAndSelectFunction([courses.oc_filter_01_name])
        
        cy.wrap(ARPublishModal.WaitForElementStateToChange(ARPublishModal.getPublishBtn(), 700))
        cy.get(arDashboardPage.getPublishBtn()).click()
        // The Publish modal displays
        cy.get(ARUnsavedChangesModal.getPromptHeader()).should('have.text', 'Publish')
        // When Cancel is clicked, the modal closes and the user is returned to the Edit Course Bundle page
        cy.get(ARPublishModal.getCancelBtn()).click()
        cy.get(arDashboardPage.getPageHeaderTitle(), { timeout: 15000 }).should('be.visible').and('contain', 'Add Course Bundle')


        cy.wrap(ARPublishModal.WaitForElementStateToChange(ARPublishModal.getPublishBtn(), 700))
        cy.get(arDashboardPage.getPublishBtn()).click()
        // The Publish modal displays
        cy.get(ARUnsavedChangesModal.getPromptHeader()).should('have.text', 'Publish')

        // When Save is clicked, the Course Bundle is saved and it appears in the Courses report page
        cy.get(ARPublishModal.getContinueBtn(), { timeout: 30000 }).should('have.attr', 'aria-disabled', 'false').click()
        cy.get(arDashboardPage.getToastSuccessMsg(), {timeout: 15000}).should('contain', 'Course successfully published')
        cy.get(arDashboardPage.getPageHeaderTitle(), { timeout: 15000 }).should('be.visible').and('contain', 'Courses')
        cy.get(arDashboardPage.getWaitSpinner()).should('not.exist')
        arDashboardPage.getMediumWait()

        cy.wrap(arDashboardPage.AddFilter('Name', 'Contains', cbDetails.courseName))
        cy.get(arDashboardPage.getTableCellName(2), { timeout: 50000 }).should('be.visible').and('contain',cbDetails.courseName)
    })

    it('Edit an existing Course Bundle and Cancel Changes', () => {
        cy.wrap(arDashboardPage.AddFilter('Name', 'Contains', cbDetails.courseName))
        cy.get(arDashboardPage.getTableCellName(2), { timeout: 50000 }).should('be.visible').and('contain', cbDetails.courseName)
        cy.get(arDashboardPage.getTableCellName(2)).contains(cbDetails.courseName).click()
        cy.wrap(arDashboardPage.WaitForElementStateToChange(arDashboardPage.getAddEditMenuActionsByName('Edit'), 1000))
        cy.get(arDashboardPage.getAddEditMenuActionsByName('Edit')).click()
        cy.get(arDashboardPage.getPageHeaderTitle(), { timeout: 15000 }).should('be.visible').and('contain', 'Edit Course Bundle')
        cy.get(arDashboardPage.getCancelBtn()).should('be.visible').click()
        // Course Bundle update is canceled
        cy.get(arDashboardPage.getPageHeaderTitle(), { timeout: 15000 }).should('be.visible').and('contain', 'Courses')
        cy.get(arDashboardPage.getWaitSpinner()).should('not.exist')
        
        
        cy.wrap(arDashboardPage.WaitForElementStateToChange(arDashboardPage.getAddEditMenuActionsByName('Edit'), 1000))
        cy.get(arDashboardPage.getAddEditMenuActionsByName('Edit')).click()
        cy.get(arDashboardPage.getPageHeaderTitle(), { timeout: 15000 }).should('be.visible').and('contain', 'Edit Course Bundle')
        cy.get(arDashboardPage.getWaitSpinner()).should('not.exist')
        // Make any edits and Click 'Cancel'
        cy.get(arDashboardPage.getDescriptionTxtF()).type(commonDetails.appendText)
        cy.get(arDashboardPage.getCancelBtn()).should('be.visible').click()
        // The Unsaved Changes modal pops up
        cy.get(ARUnsavedChangesModal.getPromptHeader()).should('have.text', 'Unsaved Changes')
        // When Cancel is clicked, the modal closes and user is returned to the Edit Course Bundle page
        cy.get(ARUnsavedChangesModal.getCancelBtn()).click()
        cy.get(arDashboardPage.getPageHeaderTitle(), { timeout: 15000 }).should('be.visible').and('contain', 'Edit Course Bundle')

        // When OK is clicked, the user is redirected to the Courses report page
        cy.get(arDashboardPage.getCancelBtn()).should('be.visible').click()
        // The Unsaved Changes modal pops up
        cy.get(ARUnsavedChangesModal.getPromptHeader()).should('have.text', 'Unsaved Changes')
        cy.get(ARUnsavedChangesModal.getOKBtn()).click()
        cy.get(ARUnsavedChangesModal.getOKBtn()).should('not.exist')
        // Course Bundle update is canceled
        cy.get(arDashboardPage.getPageHeaderTitle(), { timeout: 15000 }).should('be.visible').and('contain', 'Courses')
    })

    it('Edit an existing Course Bundle and Save Changes', () => {
        cy.editCourse(cbDetails.courseName)
        cy.get(arDashboardPage.getDescriptionTxtF()).type(commonDetails.appendText)

        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36)
        })
    })

    it('Verify Changes Persist', () => {
        cy.editCourse(cbDetails.courseName)
        cy.get(arDashboardPage.getDescriptionTxtF()).should('contain', `${commonDetails.appendText}`)
    })
})
