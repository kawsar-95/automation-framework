import LEDashboardPage from '../../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LEAccountPage from '../../../../../../../helpers/LE/pageObjects/ECommerce/LEAccountPage'
import LEEnrollmentKeyModal from '../../../../../../../helpers/LE/pageObjects/Modals/LEEnrollmentKeyModal'
import defaultTestData from '../../../../../../fixtures/defaultTestData.json'

describe('LE - E-Comm - Signup - EKey Profile Form - Invalid', function(){

    beforeEach(() => {
        //Enter valid EKey before each test
        cy.visit("/#/public-dashboard")
        cy.get(LEDashboardPage.getPublicDashboardSignupBtn()).click()
        cy.get(LEEnrollmentKeyModal.getKeyNameTxtF()).type(defaultTestData.E_KEY_01)
        LEDashboardPage.getVShortWait()
        cy.get(LEEnrollmentKeyModal.getSignupBtn()).click()
    })

    it('Verify error message (empty fields)', () => {   
        //add a single character to each required field to enable the btn then clear the fields
        cy.get(LEAccountPage.getFirstNameTxtF()).type('a').clear()
        cy.get(LEAccountPage.getLastNameTxtF()).type('a').clear()
        cy.get(LEAccountPage.getEmailTxtF()).type('a').clear()
        cy.get(LEAccountPage.getPasswordTxtF()).type('a').clear()
        cy.get(LEAccountPage.getReEnterPasswordTxtF()).type('a').clear()
        cy.get(LEAccountPage.getProceedBtn()).click()  
        //Verify clicking proceed btn does not continue to the next page
        cy.url().should('contain', '#/signup-form')
        //Verify error messages for each field
        LEAccountPage.getVerifyErrorMsgByFieldName('First Name', 'Must contain 1 or more characters')
        LEAccountPage.getVerifyErrorMsgByFieldName('Last Name', 'Must contain 1 or more characters')
        LEAccountPage.getVerifyErrorMsgByFieldName('Email', 'Must contain 1 or more characters')
        LEAccountPage.getVerifyErrorMsgByFieldName('Password', 'Must contain 1 or more characters')
        LEAccountPage.getVerifyErrorMsgByFieldName('Re-enter Password', 'Must contain 1 or more characters')
    }) 

    it('Verify error message (invalid email format - no local part)', () => {   
        cy.get(LEAccountPage.getEmailTxtF()).type('@absorblms.com')
        LEAccountPage.getVerifyErrorMsgByFieldName('Email', 'Email does not meet minimum requirements:')
    }) 

    it('Verify error message (invalid email format - missing @ char)', () => {   
        cy.get(LEAccountPage.getEmailTxtF()).type('qa.guiauto5.absorblms.com')
        LEAccountPage.getVerifyErrorMsgByFieldName('Email', 'Email does not meet minimum requirements:')
    }) 

    it('Verify error message (invalid email format - no domain)', () => {   
        cy.get(LEAccountPage.getEmailTxtF()).type('qa.guiauto5@')
        LEAccountPage.getVerifyErrorMsgByFieldName('Email', 'Email does not meet minimum requirements:')
    }) 

    it('Verify error message (too many chars in first name)', () => {   
        cy.get(LEAccountPage.getFirstNameTxtF()).type(LEDashboardPage.getLongString())
        LEAccountPage.getVerifyErrorMsgByFieldName('First Name', 'Must contain 255 or fewer characters')
    }) 

    it('Verify error message (too many chars in last name)', () => {   
        cy.get(LEAccountPage.getLastNameTxtF()).type(LEDashboardPage.getLongString())
        LEAccountPage.getVerifyErrorMsgByFieldName('Last Name', 'Must contain 255 or fewer characters')
    }) 

    it('Verify error messages (passwords too short)', () => {   
        cy.get(LEAccountPage.getPasswordTxtF()).type('a1234')
        cy.get(LEAccountPage.getReEnterPasswordTxtF()).type('a1234')
        LEAccountPage.getVerifyErrorMsgByFieldName('Password', 'Password must contain at least: 1 letter, 1 number and be at least 8 characters in length')
        LEAccountPage.getVerifyErrorMsgByFieldName('Re-enter Password', 'Re-enter Password does not meet minimum requirements:')
    }) 

    it('Verify error messages (passwords need a number)', () => {   
        cy.get(LEAccountPage.getPasswordTxtF()).type('abcdefgh')
        cy.get(LEAccountPage.getReEnterPasswordTxtF()).type('abcdefgh')
        LEAccountPage.getVerifyErrorMsgByFieldName('Password', 'Password must contain at least: 1 letter, 1 number and be at least 8 characters in length')
        LEAccountPage.getVerifyErrorMsgByFieldName('Re-enter Password', 'Re-enter Password does not meet minimum requirements:')
    }) 

    it('Verify error message (passwords dont match)', () => {   
        cy.get(LEAccountPage.getPasswordTxtF()).type(defaultTestData.USER_PASSWORD)
        cy.get(LEAccountPage.getReEnterPasswordTxtF()).type(defaultTestData.USER_PASSWORD + 'a')
        LEAccountPage.getVerifyErrorMsgByFieldName('Re-enter Password', 'Passwords do not match.')
    }) 
})