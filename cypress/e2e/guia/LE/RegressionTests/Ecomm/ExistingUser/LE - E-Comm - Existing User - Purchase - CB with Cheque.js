import courses from '../../../../../../fixtures/courses.json'
import users from '../../../../../../fixtures/users.json'
import DefaultTestData from '../../../../../../fixtures/defaultTestData.json'
import LEProfilePage from '../../../../../../../helpers/LE/pageObjects/User/LEProfilePage'
import LEDashboardPage from '../../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import ARDashboardPage from '../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import LECoursesPage from '../../../../../../../helpers/LE/pageObjects/Courses/LECoursesPage'
import LEShoppingMenu from '../../../../../../../helpers/LE/pageObjects/Menu/LEShoppingMenu'
import LEShoppingPage from '../../../../../../../helpers/LE/pageObjects/ECommerce/LEShoppingPage'
import LEAccountPage from '../../../../../../../helpers/LE/pageObjects/ECommerce/LEAccountPage'
import LEPaymentPage from '../../../../../../../helpers/LE/pageObjects/ECommerce/LEPaymentPage'
import LEInvoicePage from '../../../../../../../helpers/LE/pageObjects/ECommerce/LEInvoicePage'
import LESideMenu from '../../../../../../../helpers/LE/pageObjects/Menu/LESideMenu'
import LEFilterMenu from '../../../../../../../helpers/LE/pageObjects/Menu/LEFilterMenu'

let timestamp = LEDashboardPage.getTimeStamp()
let username = "GUIA-ECOMM-USER" + timestamp
let refNumber = 'C12345' + timestamp
let userID;

describe('LE - E-Comm - Existing User - Purchase - CB with Cheque', function(){

    before(function() {
        //Create a new user and visit public dashboard
        cy.createUser(void 0, username, ["Learner"], void 0)
        cy.visit("/#/public-dashboard")
    })

    it('Add CB to Cart, Go to cart, verify total price, login & checkout', () => { 
        //Search for and add course to cart
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('Catalog') 
        LEFilterMenu.SearchForCourseByName(courses.CB_ECOMM_01_NAME)
        LEDashboardPage.getMediumWait()
        LEDashboardPage.getCourseCardBtnThenClick(courses.CB_ECOMM_01_NAME)
        LEDashboardPage.getMediumWait()

        //Go to cart
        cy.get(LEDashboardPage.getNavShoppingCart()).click()
        cy.get(LEShoppingMenu.getViewShoppingCart()).click()
        cy.get(LEShoppingPage.getTotalPrice()).should('contain.text', '100.00')
        cy.get(LEShoppingPage.getCheckoutBtn()).should('be.visible').click()

        //Account info - Sign in
        cy.get(LEAccountPage.getLoginUsernameTxtF()).type(username)
        cy.get(LEAccountPage.getLoginPasswordTxtF()).type(DefaultTestData.USER_PASSWORD)
        cy.get(LEAccountPage.getLoginBtn()).click()
        LEDashboardPage.getShortWait()

        //Account info - verify price and proceed to checkout
        cy.get(LEAccountPage.getTotalPrice()).should('contain', '100.00')
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

        //Select payment option of Cheque and proceed
        LEPaymentPage.getPaymentOptionByNameThenClick('Cheque')
        cy.get(LEPaymentPage.getProceedToCheckoutBtn()).click()

        //Fill out Cheque reference number and proceed
        cy.get(LEPaymentPage.getReferenceNumberTxtF()).type(refNumber)
        //VShort wait is required here as bot protection will detect submissions <900ms
        LEDashboardPage.getVShortWait()
        cy.get(LEPaymentPage.getPOrderProceedToCheckoutBtn()).click()

        //Verify completed order (includes 10% tax for Cheque)
        cy.get(LEInvoicePage.getOrderCompletedHeader()).should('contain', 'Order Completed!')
        cy.get(LEInvoicePage.getTotalPrice()).should('contain', '110.00')
    })
})

describe('LE - E-Comm - Existing User - Purchase - CB with Cheque - Approve Purchase', function(){

    before(function() {
        //Sign into admin side as sys admin
        cy.apiLoginWithSession(users.sysAdmin.ADMIN_SYS_01_USERNAME, users.sysAdmin.ADMIN_SYS_01_PASSWORD, '/admin')
    })

    it('Admin - Find purchase order transaction and approve', () => { 
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('E-Commerce'))).click()
        ARDashboardPage.getMenuItemOptionByName('Transactions')
        //Search by reference number
        ARDashboardPage.A5AddFilter('Reference Number', 'Contains', refNumber)
        LEDashboardPage.getVShortWait()
        cy.get(ARDashboardPage.getA5TableCellRecordByColumn(3)).contains(DefaultTestData.USER_LEARNER_FNAME).click()
        LEDashboardPage.getVShortWait()
        //Approve the purchase order transaction - medium wait to ensure approval completes
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(4)).click()
        LEDashboardPage.getMediumWait()
    })
})

describe('LE - E-Comm - Existing User - Purchase - CB with Cheque - Verify Purchase', function(){

    before(function() {
        //Login & navigate to my courses
        cy.apiLoginWithSession(username, DefaultTestData.USER_PASSWORD) 
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('My Courses')
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

    it('Verify newly purchased course within the CB can be started', () => { 
        LEFilterMenu.SearchForCourseByName(courses.ILC_ECOMM_CHILD_01_NAME)
        LEDashboardPage.getLShortWait()
        LEDashboardPage.getCourseCardBtnThenClick(courses.ILC_ECOMM_CHILD_01_NAME)
        cy.get(LECoursesPage.getCourseILCTitle()).should('contain', courses.ILC_ECOMM_CHILD_01_NAME)
    })
})