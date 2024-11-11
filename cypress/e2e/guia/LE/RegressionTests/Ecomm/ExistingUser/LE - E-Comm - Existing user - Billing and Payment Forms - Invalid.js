import courses from '../../../../../../fixtures/courses.json'
import DefaultTestData from '../../../../../../fixtures/defaultTestData.json'
import LEProfilePage from '../../../../../../../helpers/LE/pageObjects/User/LEProfilePage'
import LEDashboardPage from '../../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LEShoppingMenu from '../../../../../../../helpers/LE/pageObjects/Menu/LEShoppingMenu'
import LEShoppingPage from '../../../../../../../helpers/LE/pageObjects/ECommerce/LEShoppingPage'
import LEAccountPage from '../../../../../../../helpers/LE/pageObjects/ECommerce/LEAccountPage'
import LEPaymentPage from '../../../../../../../helpers/LE/pageObjects/ECommerce/LEPaymentPage'
import LESideMenu from '../../../../../../../helpers/LE/pageObjects/Menu/LESideMenu'
import LEFilterMenu from '../../../../../../../helpers/LE/pageObjects/Menu/LEFilterMenu'

let timestamp = LEDashboardPage.getTimeStamp()
let username = "GUIA-ECOMM-USER" + timestamp
let userID;

describe('LE - E-Comm - Existing User - Billing and Payment Forms - Invalid - Setup', function(){
//This block sets up the test - creates a user & adds an OC course to the cart

    before(function() {
        //Create a new user
        cy.createUser(void 0, username, ["Learner"], void 0)
    })

    it('Login, Go to catalog, Search for OC course & Add to cart', () => {
        cy.learnerLoginThruDashboardPage(username, DefaultTestData.USER_PASSWORD) 
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('Catalog')
        LEFilterMenu.SearchForCourseByName(courses.OC_ECOMM_01_NAME)
        LEDashboardPage.getMediumWait()
        LEDashboardPage.getCourseCardBtnThenClick(courses.OC_ECOMM_01_NAME)
        LEDashboardPage.getMediumWait()
    })
})


describe('LE - E-Comm - Existing User - Billing and Payment Forms - Invalid', function(){
/* The https://guiaarqa.securecheckout.myabsorb.com/checkout form requires a lot of cy.wait()
   as characters will be entered in the wrong fields if that field's API has not finished loading
   (ex. postal code and city & region) and we start filling out the form
*/
    beforeEach(() => {
        //Navigate to the CC billing page before each test and enter valid payment info
        cy.learnerLoginThruDashboardPage(username, DefaultTestData.USER_PASSWORD) 
        cy.get(LEDashboardPage.getNavShoppingCart()).click()
        cy.get(LEShoppingMenu.getViewShoppingCart()).click()
        cy.get(LEShoppingPage.getCheckoutBtn()).click()
        //Account info - proceed to checkout
        cy.get(LEAccountPage.getCheckoutBtn()).click()
        //Account info - personal & address info - proceed to checkout
        cy.get(LEAccountPage.getProceedToCheckoutBtn()).click()
        //Select payment option of CCard and proceed
        LEPaymentPage.getPaymentOptionByNameThenClick('Credit Card')
        cy.get(LEPaymentPage.getProceedToCheckoutBtn()).click()
        LEDashboardPage.getMediumWait()
        // CI test agents run from the USA so if needed, select Canada
        LEPaymentPage.getSelectCanadaAndPCIfInOtherCountry();
    })

    after(function() {
        //Cleanup - Get userID, logout, and delete them
        cy.visit("/")
        cy.get(LEDashboardPage.getNavProfile()).click()  
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
        cy.url().then((currentURL) => {
            userID = currentURL.slice(48);
            cy.logoutLearner();
            cy.deleteUser(userID);
        })
    })

    it('Payment - Verify email address field is required to proceed to next page & error msg', () => {
        cy.get(LEPaymentPage.getEmailTxtF()).click().clear()
        LEDashboardPage.getLShortWait()
        LEPaymentPage.getCCardInfo(DefaultTestData.CREDIT_CARD_NUMBER, '01', '2040', '111')
        cy.get(LEPaymentPage.getSubmitOrderBtn()).click()
        LEPaymentPage.getVerifyErrorMsgByFieldName('Email', 'Please enter a valid email address.')
    })

    it('Payment - Verify first name field is required to proceed to next page', () => {
        cy.get(LEPaymentPage.getFirstNameTxtF()).click().clear()
        LEDashboardPage.getLShortWait()
        LEPaymentPage.getCCardInfo(DefaultTestData.CREDIT_CARD_NUMBER, '01', '2040', '111')
        cy.get(LEPaymentPage.getSubmitOrderBtn()).click()
        //Verify user remains on the CC billing page
        cy.url().should('contain', '/checkout')
    })

    it('Payment - Verify length of first name field', () => {
        //Wait for postalcode & city, region API to finish loading before typing in another field.
        LEDashboardPage.getLShortWait()
        cy.get(LEPaymentPage.getFirstNameTxtF())
            .click()
            .clear()
            .type(LEPaymentPage.getLongString(70))  //input 70 char string
            .invoke('val')
            .should('have.length', 50) //Verify field input has been truncated to 50 chars
    })

    it('Payment - Verify last name field is required to proceed to next page', () => {
        cy.get(LEPaymentPage.getLastNameTxtF()).click().clear()
        LEDashboardPage.getLShortWait()
        LEPaymentPage.getCCardInfo(DefaultTestData.CREDIT_CARD_NUMBER, '01', '2040', '111')
        cy.get(LEPaymentPage.getSubmitOrderBtn()).click()
        //Verify user remains on the CC billing page
        cy.url().should('contain', '/checkout')
    })

    it('Payment - Verify length of last name field', () => {
        //Wait for postalcode & city, region API to finish loading before typing in another field.
        LEDashboardPage.getLShortWait()
        cy.get(LEPaymentPage.getLastNameTxtF())
            .click()
            .clear()
            .type(LEPaymentPage.getLongString(70))  //input 70 char string
            .invoke('val')
            .should('have.length', 50) //Verify field input has been truncated to 50 chars
    })
    
    it('Payment - Verify address field is required to proceed to next page', () => {
        cy.get(LEPaymentPage.getAddressTxtF()).click().clear()
        LEDashboardPage.getLShortWait()
        LEPaymentPage.getCCardInfo(DefaultTestData.CREDIT_CARD_NUMBER, '01', '2040', '111')
        cy.get(LEPaymentPage.getSubmitOrderBtn()).click()
        //Verify user remains on the CC billing page
        cy.url().should('contain', '/checkout')
    })

    it('Payment - Verify length of address field', () => {
        //Wait for postalcode & city, region API to finish loading before typing in another field.
        LEDashboardPage.getLShortWait()
        cy.get(LEPaymentPage.getAddressTxtF())
            .click()
            .clear()
            .type(LEPaymentPage.getLongString(130))  //input 130 char string
            .invoke('val')
            .should('have.length', 100) //Verify field input has been truncated to 100 chars
    })
    
    it('Payment - Verify postal code field is required to proceed to next page & error msg', () => {
        cy.get(LEPaymentPage.getPostalCodeTxtF()).click().clear()
        LEDashboardPage.getLShortWait()
        LEPaymentPage.getCCardInfo(DefaultTestData.CREDIT_CARD_NUMBER, '01', '2040', '111')
        cy.get(LEPaymentPage.getSubmitOrderBtn()).click()
        LEDashboardPage.getVShortWait() //Wait for error msg to popup
        LEPaymentPage.getVerifyErrorMsgByFieldName('Postcode', 'We could not find that postal code.')
    })

    it('Payment - Verify Payment Method - Incorrect Credit Card Number', () => {
        LEDashboardPage.getLShortWait()
        LEPaymentPage.getCCardInfo(DefaultTestData.CREDIT_CARD_NUMBER + '111', '01', '2040', '111')
        cy.get(LEPaymentPage.getSubmitOrderBtn()).click()
        LEPaymentPage.getVerifyCCardErrorMsg('The number you entered is invalid or not supported by this store.')
    })

    it('Payment - Verify Payment Method - Empty Credit Card Number', () => {
        LEDashboardPage.getLShortWait()
        LEPaymentPage.getCCardInfo(' ', '01', '2040', '111')
        cy.get(LEPaymentPage.getSubmitOrderBtn()).click()
        LEPaymentPage.getVerifyCCardErrorMsg('The number you entered is invalid or not supported by this store.')
    })

    it('Payment - Verify Payment Method - Empty Credit Card Security Number', () => {
        LEDashboardPage.getLShortWait()
        LEPaymentPage.getCCardInfo(DefaultTestData.CREDIT_CARD_NUMBER, '01', '2040', ' ')
        cy.get(LEPaymentPage.getSubmitOrderBtn()).click()
        LEPaymentPage.getVerifyCCardErrorMsg('Please enter your card security code, which is the 3 digit code on the back of your card')
    })

    it('Payment - Verify Payment Method - Incorrect Credit Card Security Number', () => {
        LEDashboardPage.getLShortWait()
        LEPaymentPage.getCCardInfo(DefaultTestData.CREDIT_CARD_NUMBER, '01', '2040', 'A12')
        cy.get(LEPaymentPage.getSubmitOrderBtn()).click()
        LEPaymentPage.getVerifyCCardErrorMsg('Please enter your card security code, which is the 3 digit code on the back of your card')
    })
})

