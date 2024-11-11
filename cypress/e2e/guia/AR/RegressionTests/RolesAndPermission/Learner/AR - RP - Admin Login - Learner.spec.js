import users from '../../../../../../fixtures/users.json'
import arLoginPage from '../../../../../../../helpers/AR/pageObjects/Auth/ARLoginPage'


describe('AR - Regress - RP - Course Visibility', function () {

    it('Learner should be prevented from logging into Admin LMS', () => {
        cy.visit("/admin")
        cy.get(arLoginPage.getUsernameTxtF()).type(users.learner01.LEARNER_01_USERNAME)
        cy.get(arLoginPage.getPasswordTxtF()).type(users.learner01.LEARNER_01_PASSWORD)
        cy.wrap(arLoginPage.WaitForElementStateToChange(arLoginPage.getLoginBtn()))
        cy.get(arLoginPage.getLoginBtn()).click()
        cy.get(arLoginPage.getLoginErrorMsg()).should('have.text', arLoginPage.getLoginErrorTxt())

    })

    it('An Inactive account should be prevented from logging into Admin LMS', () => {
        cy.visit("/admin")
        cy.get(arLoginPage.getUsernameTxtF()).type('GUIAuto Learner DEPTB - 03')
        cy.get(arLoginPage.getPasswordTxtF()).type('testing1')
        cy.wrap(arLoginPage.WaitForElementStateToChange(arLoginPage.getLoginBtn()))
        cy.get(arLoginPage.getLoginBtn()).click()
        cy.get(arLoginPage.getLoginErrorMsg()).should('have.text', arLoginPage.getLoginErrorTxt())  
    })
})
