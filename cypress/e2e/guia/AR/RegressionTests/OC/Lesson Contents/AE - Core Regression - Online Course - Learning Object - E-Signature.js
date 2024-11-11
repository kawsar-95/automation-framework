import ARDashboardPage from '../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARSelectLearningObjectModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARSelectLearningObjectModal'
import AROCAddEditPage from '../../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage'
import { commonDetails } from '../../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../../helpers/TestData/users/users'
import { eSignature } from '../../../../../../../helpers/TestData/Courses/oc'
import ARAddESigntureLessonModal, { signatureModalConstants } from '../../../../../../../helpers/AR/pageObjects/Modals/ARAddESigntureLessonModal'
import ARCoursesPage from '../../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import ARAddESignatureLessonModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARAddESigntureLessonModal'
import ARPublishModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARPublishModal'
import AdminNavationModuleModule from '../../../../../../../helpers/AR/modules/AdminNavationModule.module'

describe('C7316 - AUT-687 - AE - Core Regression - Online Course - Learning Object - E-Signature T832330', () => {

    beforeEach('Login as an Admin', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
    })

    after('Delete the new course course', () => {
        cy.deleteCourse(commonDetails.courseID)
    })

    it('Verify Learning Object - E-Signature', () => {
        AdminNavationModuleModule.navigateToCoursesPage()
        
        // Create an online course
        cy.createCourse('Online Course')
        AROCAddEditPage.getShortWait()

        // Assert that the Admin is on Online Course page
        cy.get(AROCAddEditPage.getPageHeaderTitle()).should('have.text', 'Add Online Course')

        // Click on Add learning object button under outline section.
        cy.get(AROCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
        // Assert that the pop-up contains the appropriate title
        cy.get(ARSelectLearningObjectModal.getModalTitle()).should('contain', 'Add Learning Object')
        // Assert that the pop-up modal contains multiple learning objects
        cy.get(ARSelectLearningObjectModal.getObjectRadioBtn()).its('length').should('be.gt', 1)
        // Select E-Signature as object type and click on Next button.
        ARSelectLearningObjectModal.getObjectTypeByName('E-Signature')
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()
        // Assert that the Admin brought to a modal with the appropriate title 
        cy.get(ARSelectLearningObjectModal.getModalTitle()).should('contain', 'Add Electronic Signature Lesson')
        ARDashboardPage.getMediumWait()
        // Enter value in Name (Required) field.
        cy.get(ARAddESigntureLessonModal.getNameTxtF()).clear().type(eSignature.eSignatureName)
        ARCoursesPage.getLShortWait()
        // Assert that there two methods exist and select
        // Select Authenticate method.
        cy.get(ARAddESigntureLessonModal.getMethodRadioBtn2()).contains('Authenticate').click()
        // Assert that it shows the appropriate method description
        cy.get(ARAddESignatureLessonModal.getESignatureMethodDescription()).should('have.text', signatureModalConstants.AUTHENTICATE_METHOD_DESCRIPTION)

        // Select PIN method.
        cy.get(ARAddESigntureLessonModal.getMethodRadioBtn2()).contains('PIN').click()
        // Assert that it shows the appropriate method description
        cy.get(ARAddESignatureLessonModal.getESignatureMethodDescription()).should('have.text', signatureModalConstants.PIN_METHOD_DESCRIPTION)
        cy.get(ARAddESignatureLessonModal.getSaveBtn()).click()
        ARCoursesPage.getLShortWait()

        // Click on Publish button from right panel.
        cy.get(AROCAddEditPage.getPublishBtn()).click()
        // Click on cancel button.
        cy.wrap(ARPublishModal.WaitForElementStateToChange(ARPublishModal.getCancelBtn(), 700))
        cy.get(ARPublishModal.getCancelBtn()).click()
        // Publish Course
        cy.get(AROCAddEditPage.getPublishBtn()).click()
        cy.wrap(ARPublishModal.WaitForElementStateToChange(ARPublishModal.getContinueBtn(), 700))
        // Assert title, and buttons within the Publish button
        cy.get(ARPublishModal.getModalTitle()).contains('Publish')
        cy.get(ARPublishModal.getContinueBtn()).should('exist').and('be.visible')
        cy.get(ARPublishModal.getCancelBtn()).should('exist').and('be.visible')
        // Click on continue button.
        cy.get(ARPublishModal.getContinueBtn()).click()
        // Publish on confirmation pop-up.
        cy.get(ARDashboardPage.getToastSuccessMsg(), { timeout: 10000 }).should('contain', 'Course successfully published')
        ARCoursesPage.getLShortWait()
    })
})
