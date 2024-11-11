import users from '../../../../../fixtures/users.json'
import departments from '../../../../../fixtures/departments.json'
import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import AREnrollmentKeyPage from '../../../../../../helpers/AR/pageObjects/Enrollment/AREnrollmentKeyPage'
import AREmailTemplateModal from '../../../../../../helpers/AR/pageObjects/Modals/AREmailTemplateModal'
import ARSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import { generalFields, messagesFields } from '../../../../../../helpers/TestData/Enrollments/enrollmentKeys'

describe('AR - Enrollment Keys - Messages Section', function(){

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Enrollment Keys
        cy.apiLoginWithSession(users.sysAdmin.ADMIN_SYS_01_USERNAME, users.sysAdmin.ADMIN_SYS_01_PASSWORD, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Users'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Enrollment Keys'))
        cy.intercept('/api/rest/v2/admin/reports/enrollment-keys/operations').as('getEKeys').wait('@getEKeys')
    })

    after(function() {
        //Delete enrollment key via API
        AREnrollmentKeyPage.deleteEKeyViaAPI(users.sysAdmin.ADMIN_SYS_01_USERNAME, users.sysAdmin.ADMIN_SYS_01_PASSWORD, generalFields.eKeyId)
    })

    it('Create Enrollment Key and Verify Message Section', () => {
        //Create a new single enrollment key and fill in required general fields
        cy.get(AREnrollmentKeyPage.getActionBtnByTitle('Add Enrollment Key')).should('have.text', "Add Enrollment Key").click()
        arDashboardPage.getLShortWait()
        cy.get(AREnrollmentKeyPage.getNameTxtF()).type(generalFields.singleEKeyName) 
        cy.get(AREnrollmentKeyPage.getSelectDeparmentBtn()).click()
        ARSelectModal.SearchAndSelectFunction([departments.DEPT_TOP_NAME])
        cy.get(AREnrollmentKeyPage.getUsernameRadioBtn()).contains('FirstName.LastName').click()
        cy.get(AREnrollmentKeyPage.getGenerateKeyBtn()).click()
        
        //Verify send new user email checkbox is OFF by default and turn it ON
        cy.get(AREnrollmentKeyPage.getSendEmailChkBoxContainer()).within(() =>{
            cy.get(AREnrollmentKeyPage.getSendEmailChkBoxSelector()).should('have.attr', 'aria-checked', 'false')
        })
        cy.get(AREnrollmentKeyPage.getSendEmailChkBox()).click()

        //Verify use custom template toggle is OFF by default and turn it ON
        cy.get(AREnrollmentKeyPage.getElementByDataNameAttribute(AREnrollmentKeyPage.getCustomTemplateToggleContainer()) + ' ' + AREnrollmentKeyPage.getToggleStatus())
            .should('have.attr', 'aria-checked', 'false')
        cy.get(AREnrollmentKeyPage.getElementByDataNameAttribute(AREnrollmentKeyPage.getCustomTemplateToggleContainer()) + ' ' + AREnrollmentKeyPage.getToggleDisabled()).click()

        //Verify the template can be edited
        cy.get(AREnrollmentKeyPage.getEditTemplateBtn()).click()
        cy.get(AREmailTemplateModal.getSubjectTxtF()).clear().type(messagesFields.subjectText)

        //Verify the Send to Learner toggle is ON by default
        cy.get(AREnrollmentKeyPage.getElementByDataNameAttribute(AREmailTemplateModal.getSendToLearnerToggleContainer()) + ' ' + AREnrollmentKeyPage.getToggleStatus())
            .should('have.attr', 'aria-checked', 'true')

        //Verify the Send to Admin toggle is OFF by default and turn it ON
        cy.get(AREnrollmentKeyPage.getElementByDataNameAttribute(AREmailTemplateModal.getSendToAdministratorsToggleContainer()) + ' ' + AREnrollmentKeyPage.getToggleStatus())
            .should('have.attr', 'aria-checked', 'false')
        cy.get(AREnrollmentKeyPage.getElementByDataNameAttribute(AREmailTemplateModal.getSendToAdministratorsToggleContainer()) + ' ' + AREnrollmentKeyPage.getToggleDisabled()).click()

        //Verify the Send to Supervisor toggle is OFF by default and turn it ON
        cy.get(AREnrollmentKeyPage.getElementByDataNameAttribute(AREmailTemplateModal.getSendToSupervisorToggleContainer()) + ' ' + AREnrollmentKeyPage.getToggleStatus())
            .should('have.attr', 'aria-checked', 'false')
        cy.get(AREnrollmentKeyPage.getElementByDataNameAttribute(AREmailTemplateModal.getSendToSupervisorToggleContainer()) + ' ' + AREnrollmentKeyPage.getToggleDisabled()).click()

        //Save email template changes
        cy.get(AREmailTemplateModal.getSaveBtn()).click()

        //Save enrollment key
        cy.get(AREnrollmentKeyPage.getSaveBtn()).click()
        arDashboardPage.getLShortWait()
    })

    it('Edit Enrollment Key and Verify Message Section Persisted', () => {
        //Filter and Edit EKey
        AREnrollmentKeyPage.AddFilter('Name', 'Contains', generalFields.singleEKeyName)
        arDashboardPage.selectTableCellRecord(generalFields.singleEKeyName, 2)
        cy.wrap(arDashboardPage.WaitForElementStateToChange(arDashboardPage.getAddEditMenuActionsByName('Edit Enrollment Key'), 1000))
        cy.get(arDashboardPage.getAddEditMenuActionsByName('Edit Enrollment Key')).click()
        arDashboardPage.getLShortWait()
        
        //Get enrollment key ID for deletion at end of test
        cy.url().should('contain', 'edit').then((currentURL) => {
            generalFields.eKeyId = currentURL.slice(-36); //Store ID
        })

        //Verify send new user email checkbox is ON
        cy.get(AREnrollmentKeyPage.getSendEmailChkBoxContainer()).within(() =>{
            cy.get(AREnrollmentKeyPage.getSendEmailChkBoxSelector()).should('have.attr', 'aria-checked', 'true')
        })

        //Verify use custom template toggle is ON
        cy.get(AREnrollmentKeyPage.getElementByDataNameAttribute(AREnrollmentKeyPage.getCustomTemplateToggleContainer()) + ' ' + AREnrollmentKeyPage.getToggleStatus())
            .should('have.attr', 'aria-checked', 'true')
        
        //Verify Email template settings persisted
        cy.get(AREnrollmentKeyPage.getEditTemplateBtn()).click()
        cy.get(AREmailTemplateModal.getSubjectTxtF()).should('have.value', messagesFields.subjectText)
        cy.get(AREnrollmentKeyPage.getElementByDataNameAttribute(AREmailTemplateModal.getSendToLearnerToggleContainer()) + ' ' + AREnrollmentKeyPage.getToggleStatus())
            .should('have.attr', 'aria-checked', 'true')
        cy.get(AREnrollmentKeyPage.getElementByDataNameAttribute(AREmailTemplateModal.getSendToAdministratorsToggleContainer()) + ' ' + AREnrollmentKeyPage.getToggleStatus())
            .should('have.attr', 'aria-checked', 'true')
        cy.get(AREnrollmentKeyPage.getElementByDataNameAttribute(AREmailTemplateModal.getSendToSupervisorToggleContainer()) + ' ' + AREnrollmentKeyPage.getToggleStatus())
            .should('have.attr', 'aria-checked', 'true')
    })
})