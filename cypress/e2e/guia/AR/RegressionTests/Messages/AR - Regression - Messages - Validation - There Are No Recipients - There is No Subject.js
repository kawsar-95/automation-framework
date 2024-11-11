import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import messagesPage from '../../../../../../helpers/AR/pageObjects/Messages/ARMessagesPage';
import composeMessagePage from '../../../../../../helpers/AR/pageObjects/Messages/ARComposeMessagePage';
import { users } from '../../../../../../helpers/TestData/users/users'

//https://absorblms.testrail.io/index.php?/cases/view/737
describe('AR - Regression - NASA-700 - Validation - There Are No Recipients / There is No Subject', function () {
    before(() => {        
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
    })
    
    it('Should show error messages when recipients are cleared or when subject is cleared', () => {
        Step1();
        Step2();
        Step3();
        Step4();
        Step5();
        Step6();
    })

    function Step1() {
        cy.get(arDashboardPage.getElementByDataNameAttribute('button-message')).click();
        cy.get(arDashboardPage.getElementByDataNameAttribute('view-all-messages')).click();
        cy.get(messagesPage.getTitle()).should('have.text', 'Messages');
        cy.get(messagesPage.getComposeMessageButton()).should('be.visible').should('be.enabled');
    }

    function Step2() {
        cy.get(messagesPage.getComposeMessageButton()).click();
        cy.get(composeMessagePage.getTitle()).should('have.text', 'Compose Message');
        cy.get(composeMessagePage.getSubmitButton()).should('be.visible').should('have.attr', 'aria-disabled', 'true');
        cy.get(composeMessagePage.getSubjectLabel()).find('[data-name="required"]').should('be.visible');
        cy.get(composeMessagePage.getBodyLabel()).find('[data-name="required"]').should('be.visible');
        cy.get(composeMessagePage.getErrorMessage()).should('not.be.visible');
    }

    function Step3() {
        cy.get(composeMessagePage.getUsersSelector()).click();
        cy.get(composeMessagePage.getUserDropdownOptions()).first().click();
        cy.get(composeMessagePage.getUsersSelector()).click();
        cy.get(composeMessagePage.getUserDeselector()).click();
        cy.get(composeMessagePage.getErrorMessage()).should('be.visible').should('have.text', 'Unable to send the following message because there are no recipients');
        cy.get(composeMessagePage.getSubmitButton()).should('be.visible').should('have.attr', 'aria-disabled', 'true');
    }

    function Step4() {
        cy.get(composeMessagePage.getUsersSelector()).click();
        cy.get(composeMessagePage.getUserDropdownOptions()).first().click();
        cy.get(composeMessagePage.getUsersSelector()).click();
        cy.get(composeMessagePage.getErrorMessage()).should('not.be.visible');
    }

    function Step5() {
        cy.get(composeMessagePage.getSubjectEditBox()).type('This is the subject');
        cy.get(composeMessagePage.getSubjectEditBox()).clear();
        cy.get(composeMessagePage.getErrorMessage()).should('be.visible').should('have.text', 'Field is required.');
        cy.get(composeMessagePage.getSubmitButton()).should('be.visible').should('have.attr', 'aria-disabled', 'true');
        cy.get(composeMessagePage.getSubjectEditBox()).should('have.css', 'border-color', 'rgb(214, 20, 52)');
    }

    function Step6() {
        cy.get(composeMessagePage.getSubjectEditBox()).type('This is the subject');
        cy.get(composeMessagePage.getErrorMessage()).should('not.be.visible');
    }
})