import courses from '../../../../../../fixtures/courses.json'
import DefaultTestData from '../../../../../../fixtures/defaultTestData.json'
import LEDashboardPage from '../../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LEProfilePage from '../../../../../../../helpers/LE/pageObjects/User/LEProfilePage'
import LECoursesPage from '../../../../../../../helpers/LE/pageObjects/Courses/LECoursesPage'
import LESideMenu from '../../../../../../../helpers/LE/pageObjects/Menu/LESideMenu'
import LEFilterMenu from '../../../../../../../helpers/LE/pageObjects/Menu/LEFilterMenu'
import LESelectILCSession from '../../../../../../../helpers/LE/pageObjects/Modals/LESelectILCSession.modal'
import LEShoppingMenu from '../../../../../../../helpers/LE/pageObjects/Menu/LEShoppingMenu'
import LEShoppingPage from '../../../../../../../helpers/LE/pageObjects/ECommerce/LEShoppingPage'
import LEAccountPage from '../../../../../../../helpers/LE/pageObjects/ECommerce/LEAccountPage'
import LEPaymentPage from '../../../../../../../helpers/LE/pageObjects/ECommerce/LEPaymentPage'
import LEInvoicePage from '../../../../../../../helpers/LE/pageObjects/ECommerce/LEInvoicePage'

let timestamp = LEDashboardPage.getTimeStamp()
let username = DefaultTestData.USER_LEARNER_UNAME_PRE + timestamp
let courseNames = ['ILC_ECOMM_01_NAME', 'OC_ECOMM_01_NAME', 'CB_ECOMM_01_NAME', 'CURR_ECOMM_01_NAME'];

describe('LE - E-Comm - Signup - Purchase - All Course Types with CCard (w Coupon)', function(){

    after(function() {
        //Cleanup - Get userID, logout, and delete them
        cy.get(LEDashboardPage.getNavProfile()).click()  
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
        cy.url().then((currentURL) => {
            cy.deleteUser(currentURL.slice(-36));
        })
    })

    it('Add Courses to Cart, apply coupon, verify total price, signup & checkout ', () => {
        cy.visit("/#/public-dashboard")
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('Catalog')
        LEDashboardPage.getLongWait()
        for (let i = 0; i < courseNames.length; i++) {
            LEFilterMenu.SearchForCourseByName(courses[`${courseNames[i]}`])
            cy.get(LEDashboardPage.getCourseCardLoaderBtn(), {timeout: 15000}).should('not.exist')
            LEDashboardPage.getLShortWait()
            LEDashboardPage.getCourseCardBtnThenClick(courses[`${courseNames[i]}`])
            if (i === 0) {
                LESelectILCSession.getAddToCartBtn()
                cy.get(LESelectILCSession.getModalCloseBtn()).click()
            }
            cy.get(LEDashboardPage.getCourseCardLoaderBtn(), {timeout: 15000}).should('not.exist')
            LEFilterMenu.getSearchClearBtnThenClick()
        }

        //Go to Cart
        cy.get(LEDashboardPage.getNavShoppingCart()).click()
        cy.get(LEShoppingMenu.getViewShoppingCart()).click()
        cy.get(LEShoppingPage.getCouponCode()).type('GUIA40')
        cy.get(LEShoppingPage.getApplyCouponCode()).click()
        cy.get(LEShoppingPage.getTotalPrice()).should('contain.text', '240.00')
        cy.get(LEShoppingPage.getCheckoutBtn()).should('be.visible').click()
        cy.window().scrollTo('bottom')
        cy.get(LEAccountPage.getSignupBtn()).click()

        //Signup new user and proceed
        cy.get(LEAccountPage.getFirstNameTxtF()).type(DefaultTestData.USER_LEARNER_FNAME)
        cy.get(LEAccountPage.getLastNameTxtF()).type(DefaultTestData.USER_LEARNER_LNAME)
        cy.get(LEAccountPage.getUsernameTxtF()).type(username)
        cy.get(LEAccountPage.getEmailTxtF()).type(DefaultTestData.USER_LEARNER_EMAIL)
        cy.get(LEAccountPage.getPasswordTxtF()).type(DefaultTestData.USER_PASSWORD)
        cy.get(LEAccountPage.getReEnterPasswordTxtF()).type(DefaultTestData.USER_PASSWORD)
        cy.get(LEAccountPage.getPhoneTxtF()).type(DefaultTestData.USER_LEARNER_PHONE)

        //Add additional shipping information and proceed
        cy.get(LEAccountPage.getProceedToCheckoutSingUpBtn()).click()
        cy.get(LEAccountPage.getAddressTxtF()).type(DefaultTestData.USER_LEARNER_ADDRESS)
        cy.get(LEAccountPage.getCountryDDown()).select(DefaultTestData.USER_LEARNER_COUNTRY_CODE)
        cy.get(LEAccountPage.getProvinceDDown()).select(DefaultTestData.USER_LEARNER_PROVINCE)
        cy.get(LEAccountPage.getCityTxtF()).type(DefaultTestData.USER_LEARNER_CITY)
        cy.get(LEAccountPage.getPostalCodeTxtF()).type(DefaultTestData.USER_LEARNER_POSTALCODE)
        cy.get(LEAccountPage.getProceedToCheckoutPaymentBtn()).click()


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

        //Verify invoice
        cy.get(LEInvoicePage.getOrderCompletedHeader()).should('contain', 'Order Completed!')
        cy.get(LEInvoicePage.getTotalPrice()).should('contain', '240.00')
        //Button will only be visible if the user has been successfully logged in
        cy.get(LEInvoicePage.getViewCourseBtn()).should('be.visible')
    })

    it('Login & verify OC course can be started', () => {
        cy.apiLoginWithSession(username, DefaultTestData.USER_PASSWORD) 
        LEDashboardPage.getTileByNameThenClick('My Courses')
        LEDashboardPage.getLShortWait()
        cy.get(LEDashboardPage.getCourseCardName()).contains(courses.OC_ECOMM_01_NAME).click()
        cy.get(LECoursesPage.getCourseILCTitle()).should('contain', courses.OC_ECOMM_01_NAME)
    })
})