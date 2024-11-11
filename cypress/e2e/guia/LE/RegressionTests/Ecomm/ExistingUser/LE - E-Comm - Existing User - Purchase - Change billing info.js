import courses from '../../../../../../fixtures/courses.json'
import DefaultTestData from '../../../../../../fixtures/defaultTestData.json'
import LEProfilePage from '../../../../../../../helpers/LE/pageObjects/User/LEProfilePage'
import LEDashboardPage from '../../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LEShoppingMenu from '../../../../../../../helpers/LE/pageObjects/Menu/LEShoppingMenu'
import LEShoppingPage from '../../../../../../../helpers/LE/pageObjects/ECommerce/LEShoppingPage'
import LEAccountPage from '../../../../../../../helpers/LE/pageObjects/ECommerce/LEAccountPage'
import LEPaymentPage from '../../../../../../../helpers/LE/pageObjects/ECommerce/LEPaymentPage'
import LEInvoicePage from '../../../../../../../helpers/LE/pageObjects/ECommerce/LEInvoicePage'
import LESideMenu from '../../../../../../../helpers/LE/pageObjects/Menu/LESideMenu'
import LEFilterMenu from '../../../../../../../helpers/LE/pageObjects/Menu/LEFilterMenu'

let timestamp = LEDashboardPage.getTimeStamp()
let username = "GUIA-ECOMM-USER" + timestamp;
let userID;

//New billing info values
const BILLING_EMAIL_ADDRESS = 'test@test.com';
const BILLING_FIRST_NAME = 'James';
const BILLING_LAST_NAME = 'Jones';
const BILLING_ADDRESS = '123 Main Street';
const BILLING_POSTAL_CODE = 'M4C 1V3';
const BILLING_CITY = 'Toronto';
const BILLING_PROVINCE = 'ON';

describe('LE - E-Comm - Existing User - Purchase - Change billing info', function(){

    before(function() {
        //Create a new user
        cy.createUser(void 0, username, ["Learner"], void 0)
    })

    beforeEach(() => {
        //Login before each test
        cy.learnerLoginThruDashboardPage(username, DefaultTestData.USER_PASSWORD) 
    })

    after(function() {
        //Cleanup - Get userID, logout, and delete them
        cy.get(LEDashboardPage.getNavProfile()).click()  
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
        cy.url().then((currentURL) => {
            userID = currentURL.slice(-36);
            cy.deleteUser(userID);
        })
    })

    it('Add CB to Cart, Go to cart, proceed to checkout, change billing information on CC page', () => { 
        //Filter for and add CB to Cart
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('Catalog') 
        LEFilterMenu.SearchForCourseByName(courses.CB_ECOMM_01_NAME)
        LEDashboardPage.getMediumWait()
        LEDashboardPage.getCourseCardBtnThenClick(courses.CB_ECOMM_01_NAME)
        LEDashboardPage.getMediumWait()

        //Go to Cart
        cy.get(LEDashboardPage.getNavShoppingCart()).click()
        cy.get(LEShoppingMenu.getViewShoppingCart()).click()
        cy.get(LEShoppingPage.getCheckoutBtn()).should('be.visible').click()

        //Account info - proceed to checkout
        cy.get(LEAccountPage.getCheckoutBtn()).click()

        //Account info - personal & address info - proceed to checkout
        cy.window().scrollTo('bottom')
        cy.get(LEAccountPage.getProceedToCheckoutBtn()).click()

        //Select payment option of Credit Card and proceed
        LEPaymentPage.getPaymentOptionByNameThenClick('Credit Card')
        cy.get(LEPaymentPage.getProceedToCheckoutBtn()).click()
        LEDashboardPage.getMediumWait()

        //Enter new valid information in billing fields (email, names, address).
        //Need to clear then wait the email field separate from the type event or else test will fail in firefox.
        cy.get(LEPaymentPage.getEmailTxtF()).clear()
        LEDashboardPage.getVShortWait()
        cy.get(LEPaymentPage.getEmailTxtF()).type(BILLING_EMAIL_ADDRESS)
        cy.get(LEPaymentPage.getFirstNameTxtF()).clear().type(BILLING_FIRST_NAME)
        cy.get(LEPaymentPage.getLastNameTxtF()).clear().type(BILLING_LAST_NAME)
        cy.get(LEPaymentPage.getAddressTxtF()).clear().type(BILLING_ADDRESS)
        // CI test agents run from the USA so if needed, select Canada
        LEPaymentPage.getSelectCanadaAndPCIfInOtherCountry();
        LEDashboardPage.getShortWait()
        cy.get(LEPaymentPage.getPostalCodeTxtF()).clear().type(BILLING_POSTAL_CODE)
        LEDashboardPage.getShortWait() //Wait for province dropdown to load

        //Fill out credit card info and submit order
        LEPaymentPage.getCCardInfo(DefaultTestData.CREDIT_CARD_NUMBER, '01', '2040', '111')
        cy.get(LEPaymentPage.getSubmitOrderBtn()).click()

        //Verify completed order invoice with updated billing information
        cy.get(LEInvoicePage.getOrderCompletedHeader()).should('contain', 'Order Completed!')
        cy.get(LEInvoicePage.getBillingFullNameTxt()).should('contain.text', BILLING_FIRST_NAME + ' ' + BILLING_LAST_NAME)
        cy.get(LEInvoicePage.getBillingAddressStreetTxt()).should('contain.text', BILLING_ADDRESS)
        cy.get(LEInvoicePage.getBillingAddressRegionTxt()).should('contain.text', BILLING_CITY + ', ' + BILLING_PROVINCE + ' ' + BILLING_POSTAL_CODE)
        cy.get(LEInvoicePage.getBillingEmailTxt()).should('contain.text', BILLING_EMAIL_ADDRESS)
    })
})
