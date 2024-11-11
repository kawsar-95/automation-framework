import courses from '../../../../../../fixtures/courses.json'
import DefaultTestData from '../../../../../../fixtures/defaultTestData.json'
import LEProfilePage from '../../../../../../../helpers/LE/pageObjects/User/LEProfilePage'
import LEDashboardPage from '../../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LECoursesPage from '../../../../../../../helpers/LE/pageObjects/Courses/LECoursesPage'
import LEShoppingMenu from '../../../../../../../helpers/LE/pageObjects/Menu/LEShoppingMenu'
import LEShoppingPage from '../../../../../../../helpers/LE/pageObjects/ECommerce/LEShoppingPage'
import LEAccountPage from '../../../../../../../helpers/LE/pageObjects/ECommerce/LEAccountPage'
import LEPaymentPage from '../../../../../../../helpers/LE/pageObjects/ECommerce/LEPaymentPage'
import LEInvoicePage from '../../../../../../../helpers/LE/pageObjects/ECommerce/LEInvoicePage'
import LESideMenu from '../../../../../../../helpers/LE/pageObjects/Menu/LESideMenu'
import LEFilterMenu from '../../../../../../../helpers/LE/pageObjects/Menu/LEFilterMenu'
import LEEnrollmentKeyModal from '../../../../../../../helpers/LE/pageObjects/Modals/LEEnrollmentKeyModal'

let timestamp = LEDashboardPage.getTimeStamp()
let username = "GUIA-ECOMM-USER" + timestamp
const COURSE_QUANTITY = 2;
let userID;
let eKey;

describe('LE - E-Comm - Existing User - Purchase - MultiSeat Curriculum with CCard', function(){

    before(function() {
        //Create a new user
        cy.createUser(void 0, username, ["Learner"], void 0)
    })

    beforeEach(() => {
        //Login before each test
        cy.apiLoginWithSession(username, DefaultTestData.USER_PASSWORD) 
    })

    after(function() {
        //Cleanup - Get userID, logout, and delete them
        cy.get(LEDashboardPage.getNavProfile()).click()  
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
        cy.url().then((currentURL) => {
            cy.deleteUser(currentURL.slice(-36));
        })
    })

    it('Add CURR to Cart, Go to cart, update course quantity, verify total price, checkout', () => { 
        //Search for and add CURR to cart 
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('Catalog') 
        LEFilterMenu.SearchForCourseByName(courses.CURR_ECOMM_01_NAME)
        LEDashboardPage.getMediumWait()
        LEDashboardPage.getCourseCardBtnThenClick(courses.CURR_ECOMM_01_NAME)
        LEDashboardPage.getMediumWait()

        //Go to cart
        cy.get(LEDashboardPage.getNavShoppingCart()).click()
        cy.get(LEShoppingMenu.getViewShoppingCart()).click()
        cy.get(LEShoppingPage.getCourseQuantity()).clear().type(COURSE_QUANTITY)
        cy.get(LEShoppingPage.getQuantityUpdateBtn()).click()
        LEDashboardPage.getShortWait()
        cy.get(LEShoppingPage.getTotalPrice()).should('contain.text', '200.00')
        cy.get(LEShoppingPage.getCheckoutBtn()).should('be.visible').click()

        //Account info - verify price and proceed to checkout
        cy.get(LEAccountPage.getTotalPrice()).should('contain', '200.00')
        cy.get(LEAccountPage.getCheckoutBtn()).click()

        //Account info - verify personal & address info and proceed to checkout
        cy.get(LEAccountPage.getFirstNameTxtF()).should('have.value', DefaultTestData.USER_LEARNER_FNAME)
        cy.get(LEAccountPage.getLastNameTxtF()).should('have.value', DefaultTestData.USER_LEARNER_LNAME)
        cy.get(LEAccountPage.getEmailTxtF()).should('have.value', DefaultTestData.USER_LEARNER_EMAIL)
        cy.get(LEAccountPage.getPhoneTxtF()).should('have.value', DefaultTestData.USER_LEARNER_PHONE)
        cy.get(LEAccountPage.getAddressTxtF()).should('have.value', DefaultTestData.USER_LEARNER_ADDRESS)
        cy.get(LEAccountPage.getCountryDDown()).should('have.value', DefaultTestData.USER_LEARNER_COUNTRY_CODE)
        cy.get(LEAccountPage.getProvinceDDown()).should('have.value', DefaultTestData.USER_LEARNER_PROVINCE)
        cy.get(LEAccountPage.getCityTxtF()).should('have.value', DefaultTestData.USER_LEARNER_CITY)
        cy.get(LEAccountPage.getPostalCodeTxtF()).should('have.value', DefaultTestData.USER_LEARNER_POSTALCODE)
        cy.window().scrollTo('bottom')
        cy.get(LEAccountPage.getProceedToCheckoutBtn()).click()

        //Select payment option of CCard and proceed
        LEPaymentPage.getPaymentOptionByNameThenClick('Credit Card')
        cy.get(LEPaymentPage.getProceedToCheckoutBtn()).click()

        //Verify billing fields
        cy.get(LEPaymentPage.getEmailTxtF()).should('have.value', DefaultTestData.USER_LEARNER_EMAIL)
        cy.get(LEPaymentPage.getFirstNameTxtF()).should('have.value', DefaultTestData.USER_LEARNER_FNAME)
        cy.get(LEPaymentPage.getLastNameTxtF()).should('have.value', DefaultTestData.USER_LEARNER_LNAME)
        cy.get(LEPaymentPage.getPhoneTxtF()).should('have.value', DefaultTestData.USER_LEARNER_PHONE)
        cy.get(LEPaymentPage.getAddressTxtF()).should('have.value', DefaultTestData.USER_LEARNER_ADDRESS)
        // CI test agents run from the USA so if needed, select Canada
        LEPaymentPage.getSelectCanadaAndPCIfInOtherCountry();
        cy.get(LEPaymentPage.getPostalCodeTxtF()).should('have.value', DefaultTestData.USER_LEARNER_POSTALCODE)
        cy.get(LEPaymentPage.getProvinceDDown()).should('have.value', DefaultTestData.USER_LEARNER_CITY + ', ' + DefaultTestData.USER_LEARNER_PROVINCE_CODE)

        //Fill out credit card info and submit order
        LEPaymentPage.getCCardInfo(DefaultTestData.CREDIT_CARD_NUMBER, '01', '2040', '111')
        cy.get(LEPaymentPage.getSubmitOrderBtn()).click()

        //Verify invoice and number of enrollment keys
        cy.get(LEInvoicePage.getOrderCompletedHeader()).should('contain', 'Order Completed!')
        cy.get(LEInvoicePage.getTotalPrice()).should('contain', '200.00')
        LEInvoicePage.getNumberOfEKeys(COURSE_QUANTITY)
        
        //Save eKey value of last key
        cy.get(LEInvoicePage.getEKeyByIndex(COURSE_QUANTITY)).then(($key) => {
            eKey = $key.text()
        })
    })

    it('Verify E-Key is valid and course can be started', () => {
        //Visit enrollment URL with new eKey while logged in
        cy.visit("/?keyname="+ eKey)
        cy.get(LEEnrollmentKeyModal.getEnrollBtn()).click()
        //Navigate to my courses from the enrollment modal
        cy.get(LEEnrollmentKeyModal.getMyCoursesBtn()).click()
        LEDashboardPage.getCourseCardBtnThenClick(courses.CURR_ECOMM_01_NAME)
        cy.get(LECoursesPage.getCourseILCTitle()).should('contain', courses.CURR_ECOMM_01_NAME)
    })
})

