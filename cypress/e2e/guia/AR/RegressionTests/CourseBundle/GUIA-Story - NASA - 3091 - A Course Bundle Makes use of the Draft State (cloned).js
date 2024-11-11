import ARCoursesPage from "../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage"
import ARCBAddEditPage from "../../../../../../helpers/AR/pageObjects/Courses/CB/ARCBAddEditPage"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARPublishModal from "../../../../../../helpers/AR/pageObjects/Modals/ARPublishModal"
import ARUnsavedChangesModal from "../../../../../../helpers/AR/pageObjects/Modals/ARUnsavedChangesModal"
import { cbDetails } from "../../../../../../helpers/TestData/Courses/cb"
import { commonDetails } from "../../../../../../helpers/TestData/Courses/commonDetails"
import { users } from "../../../../../../helpers/TestData/users/users"


describe('AUT-282 - C850 - GUIA-Story - NASA - 3091 - (FE) A Course Bundle Makes use of the Draft State (cloned)', () => {
    beforeEach('Login as an System Admin', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
    })

    after('Delete the course bundle', () => {
        cy.deleteCourse(commonDetails.courseID, 'course-bundles')
    })

    it('Create a new Course Bundle - Don\'t make any edits - Click Cancel', () => {        
        ARDashboardPage.getCoursesReport()
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Add Course Bundle')).should('have.attr', 'aria-disabled', 'false').click()
        cy.get(ARCBAddEditPage.getCancelBtn()).click()
    })

    it('Create a new Course Bundle - Make edits - Click Cancel', () => {
        ARDashboardPage.getCoursesReport()
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Add Course Bundle')).should('have.attr', 'aria-disabled', 'false').click()
        
        // Make edits
        cy.get(ARCBAddEditPage.getGeneralTitleTxtF()).clear().type(cbDetails.courseName)
        cy.get(ARCBAddEditPage.getCBDescriptionTxtFToolBar()).should('be.visible').and('not.have.attr','aria-disabled')
        cy.get(ARCBAddEditPage.getCBDescriptionTxtFToolBar()).type(cbDetails.description)

        // Cancel the edits, and click Cancel on the popup
        cy.get(ARDashboardPage.getCancelBtn()).click()
        cy.get(ARUnsavedChangesModal.getPromptHeader()).should('have.text', 'Unsaved Changes')
        cy.get(ARUnsavedChangesModal.getPromptFooter()).find(ARCoursesPage.getCancelBtn()).click()
        cy.get(ARCBAddEditPage.getPageHeaderTitle()).contains('Add Course Bundle')

        // Cancel the edits, and click OK on the popup
        cy.get(ARDashboardPage.getCancelBtn()).click()
        cy.get(ARUnsavedChangesModal.getPromptHeader()).should('have.text', 'Unsaved Changes')
        cy.get(ARUnsavedChangesModal.getPromptFooter()).find(ARCBAddEditPage.getConfirmBtn()).click()
        cy.get(ARCBAddEditPage.getPageHeaderTitle(), {timeout: 3000}).contains('Courses')
    })

    it('Create a new Course Bundle - Make edits - Click Save', () => {
        ARDashboardPage.getCoursesReport()
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Add Course Bundle')).should('have.attr', 'aria-disabled', 'false').click()
        
        // Make edits
        cy.get(ARCBAddEditPage.getGeneralTitleTxtF()).clear().type(cbDetails.courseName)
        cy.get(ARCBAddEditPage.getCBDescriptionTxtFToolBar()).should('be.visible').and('not.have.attr','aria-disabled')
        cy.get(ARCBAddEditPage.getCBDescriptionTxtFToolBar()).type(cbDetails.description)

        // Attemp to publishe course
        cy.get(ARCBAddEditPage.getPublishBtn()).click()
        // Cancel publishing
        cy.get(ARPublishModal.getCancelBtn()).click()
        cy.get(ARCBAddEditPage.getPageHeaderTitle()).contains('Add Course Bundle')

        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
        cy.get(ARCBAddEditPage.getPageHeaderTitle(), {timeout: 3000}).contains('Courses')
    })

    it('Edit an existing Course Bundle - Don\'t make any edits - Click Cancel', () => {
        ARDashboardPage.getCoursesReport()
        cy.editCourse(cbDetails.courseName)

        // Cancel the edits, and click OK on the popup
        cy.get(ARDashboardPage.getCancelBtn()).click()
        cy.get(ARUnsavedChangesModal.getPromptHeader()).should('have.text', 'Unsaved Changes')
        cy.get(ARUnsavedChangesModal.getPromptFooter()).find(ARCBAddEditPage.getConfirmBtn()).click()
        cy.get(ARCBAddEditPage.getPageHeaderTitle(), {timeout: 3000}).contains('Courses')
    })

    it('Edit an existing Course Bundle - Make any edits - Click Cancel', () => {
        ARDashboardPage.getCoursesReport()
        cy.editCourse(cbDetails.courseName)
        cy.get(ARCBAddEditPage.getDescriptionTxtF()).type(commonDetails.appendText)

        // Cancel the edits, and click Cancel on the popup to stay in the Edit Course Bundle page
        cy.get(ARDashboardPage.getCancelBtn()).click()
        cy.get(ARUnsavedChangesModal.getPromptHeader()).should('have.text', 'Unsaved Changes')
        cy.get(ARUnsavedChangesModal.getPromptFooter()).find(ARCBAddEditPage.getCancelBtn()).click()
        cy.get(ARCBAddEditPage.getPageHeaderTitle(), {timeout: 3000}).contains('Edit Course Bundle')

        // Cancel the edits, and click OK on the popup to return to the Courses page
        cy.get(ARDashboardPage.getCancelBtn()).click()
        cy.get(ARUnsavedChangesModal.getPromptHeader()).should('have.text', 'Unsaved Changes')
        cy.get(ARUnsavedChangesModal.getPromptFooter()).find(ARCBAddEditPage.getConfirmBtn()).click()
        cy.get(ARCBAddEditPage.getPageHeaderTitle(), {timeout: 3000}).contains('Courses')
    })

    it('Edit an existing Course Bundle - Make edits - Click Save.', () => {
        ARDashboardPage.getCoursesReport()
        cy.editCourse(cbDetails.courseName)
        cy.get(ARCBAddEditPage.getDescriptionTxtF()).type(commonDetails.appendText)

        // Attemp to publishe course
        cy.wrap(ARPublishModal.WaitForElementStateToChange(ARPublishModal.getPublishBtn(), 700))
        cy.get(ARPublishModal.getPublishBtn()).click()
        // Cancel publishing
        cy.get(ARPublishModal.getCancelBtn(), {timeout: 30000}).click()
        cy.get(ARCBAddEditPage.getPageHeaderTitle()).contains('Edit Course Bundle')

        // Finally, publish the course
        cy.publishCourse()
        cy.get(ARCBAddEditPage.getPageHeaderTitle(), {timeout: 3000}).contains('Courses')
    })
})