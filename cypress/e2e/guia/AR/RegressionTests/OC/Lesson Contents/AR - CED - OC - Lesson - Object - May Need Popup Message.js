// AR - CED - OC - Lesson - Object - Create Course.js
import arOCAddEditPage from '../../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage'
import arDashboardPage from '../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARAddObjectLessonModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARAddObjectLessonModal'
import ARSelectLearningObjectModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARSelectLearningObjectModal'
import users from '../../../../../../fixtures/users.json'

describe('C899, AR - CED - OC - Lesson - Object - Create Course', function(){

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.ADMIN_SYS_01_USERNAME, users.sysAdmin.ADMIN_SYS_01_PASSWORD, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        
    })

    it('Create OC Course, Verify "May Need Popup" message appears when source is set to Url and Mobile launches in a new tab', () => {
        cy.createCourse('Online Course')

        //Verify Object Lesson Can Be Selected
        cy.get(arOCAddEditPage.getAddLearningObjectBtn()).click()
        ARSelectLearningObjectModal.getObjectTypeByName('Object')
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()
        arOCAddEditPage.getVShortWait()

        // Verify the error message does not appear by default
        cy.get(ARAddObjectLessonModal.getYouMayNeedPopupWarningMsg()).should('not.exist')

        //Set Source to URL
        cy.get(ARAddObjectLessonModal.getSourceRadioBtn()).contains('Url').click()

        // Set Mobile to "Launch in a new tab"
        cy.get(ARAddObjectLessonModal.getDesktopRadioBtn()).contains('Launch in a popup').click()

        // Verify the error message appears
        cy.get(ARAddObjectLessonModal.getYouMayNeedPopupWarningMsg()).should('contain', 'You may need to use a popup for some websites to display properly.')
    })

    it('Create OC Course, Verify "May Need Popup" message appears when source is set to Url and Desktop launches in a popup', () => {
        cy.createCourse('Online Course')

        //Verify Object Lesson Can Be Selected
        cy.get(arOCAddEditPage.getAddLearningObjectBtn()).click()
        ARSelectLearningObjectModal.getObjectTypeByName('Object')
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()
        arOCAddEditPage.getVShortWait()

        // Verify the error message does not appear by default
        cy.get(ARAddObjectLessonModal.getYouMayNeedPopupWarningMsg()).should('not.exist')

        // Set Source to URL
        cy.get(ARAddObjectLessonModal.getSourceRadioBtn()).contains('Url').click()

        // Set Desktop to "Launch in a popup"
        cy.get(ARAddObjectLessonModal.getDesktopRadioBtn()).contains('Launch in a popup').click()

        // Verify the error message appears
        cy.get(ARAddObjectLessonModal.getYouMayNeedPopupWarningMsg()).should('contain', 'You may need to use a popup for some websites to display properly.')
    })

    it('Create OC Course, Verify "May Need Popup" message appears when source is set to Url and not when set to File', () => {
        cy.createCourse('Online Course')

        //Verify Object Lesson Can Be Selected
        cy.get(arOCAddEditPage.getAddLearningObjectBtn()).click()
        ARSelectLearningObjectModal.getObjectTypeByName('Object')
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()
        arOCAddEditPage.getVShortWait()

        // Verify the error message does not appear by default
        cy.get(ARAddObjectLessonModal.getYouMayNeedPopupWarningMsg()).should('not.exist')

        // Set Source to URL
        cy.get(ARAddObjectLessonModal.getSourceRadioBtn()).contains('Url').click()

        // Verify the error message appears
        cy.get(ARAddObjectLessonModal.getYouMayNeedPopupWarningMsg()).should('contain', 'You may need to use a popup for some websites to display properly.')

        // Set Source to File
        cy.get(ARAddObjectLessonModal.getSourceRadioBtn()).contains('File').click()

        // Verify the error message does not appear
        cy.get(ARAddObjectLessonModal.getYouMayNeedPopupWarningMsg()).should('not.exist')
    })
})