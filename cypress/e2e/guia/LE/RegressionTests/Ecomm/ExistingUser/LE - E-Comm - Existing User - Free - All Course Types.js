import courses from '../../../../../../fixtures/courses.json'
import DefaultTestData from '../../../../../../fixtures/defaultTestData.json'
import LEProfilePage from '../../../../../../../helpers/LE/pageObjects/User/LEProfilePage'
import LEDashboardPage from '../../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LECoursesPage from '../../../../../../../helpers/LE/pageObjects/Courses/LECoursesPage'
import LEShoppingMenu from '../../../../../../../helpers/LE/pageObjects/Menu/LEShoppingMenu'
import LEShoppingPage from '../../../../../../../helpers/LE/pageObjects/ECommerce/LEShoppingPage'
import LEAccountPage from '../../../../../../../helpers/LE/pageObjects/ECommerce/LEAccountPage'
import LEInvoicePage from '../../../../../../../helpers/LE/pageObjects/ECommerce/LEInvoicePage'
import LESideMenu from '../../../../../../../helpers/LE/pageObjects/Menu/LESideMenu'
import LEFilterMenu from '../../../../../../../helpers/LE/pageObjects/Menu/LEFilterMenu'
import LESelectILCSession from '../../../../../../../helpers/LE/pageObjects/Modals/LESelectILCSession.modal'

let timestamp = LEDashboardPage.getTimeStamp()
let username = "GUIA-ECOMM-USER-FREE" + timestamp
let userID;

describe('LE - E-Comm - Existing User - Free - All Course Types', function(){

    before(function() {
        //Create a new user
        cy.createUser(void 0, username, ["Learner"], void 0)
    })

    after(function() {
        //Cleanup - Get userID, logout, and delete them
        cy.get(LEDashboardPage.getNavProfile()).click()  
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
        cy.url().then((currentURL) => {
            userID = currentURL.slice(48);
            cy.logoutLearner();
            cy.deleteUser(userID);
        })
    })

    beforeEach(() => {
        //Login and navigate to catalog before each test
        cy.learnerLoginThruDashboardPage(username, DefaultTestData.USER_PASSWORD) 
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('Catalog')
    })

    it('Search for & add ILC course to cart', () => { 
        LEFilterMenu.SearchForCourseByName(courses.ILC_ECOMM_FREE_COURSE_01_NAME)
        LEDashboardPage.getMediumWait()
        LEDashboardPage.getCourseCardBtnThenClick(courses.ILC_ECOMM_FREE_COURSE_01_NAME)
        LESelectILCSession.getAddToCartBtn()
        cy.get(LESelectILCSession.getModalCloseBtn()).click()
        LEDashboardPage.getMediumWait()
    })

    it('Search for & add OC course to cart', () => {    
        LEFilterMenu.SearchForCourseByName(courses.OC_ECOMM_FREE_COURSE_01_NAME)
        LEDashboardPage.getMediumWait()
        LEDashboardPage.getCourseCardBtnThenClick(courses.OC_ECOMM_FREE_COURSE_01_NAME)
        LEDashboardPage.getMediumWait()
    })

    it('Search for & add CB course to cart', () => {   
        LEFilterMenu.SearchForCourseByName(courses.CB_ECOMM_FREE_COURSE_01_NAME)
        LEDashboardPage.getMediumWait()
        LEDashboardPage.getCourseCardBtnThenClick(courses.CB_ECOMM_FREE_COURSE_01_NAME)
        LEDashboardPage.getMediumWait()
    })

    it('Search for & add Curr course to cart', () => {   
        LEFilterMenu.SearchForCourseByName(courses.CURR_ECOMM_FREE_COURSE_01_NAME)
        LEDashboardPage.getMediumWait()
        LEDashboardPage.getCourseCardBtnThenClick(courses.CURR_ECOMM_FREE_COURSE_01_NAME)
        LEDashboardPage.getMediumWait()
    })

    it('Go to cart, verify total price & checkout', () => { 
        cy.get(LEDashboardPage.getNavShoppingCart()).click()
        cy.get(LEShoppingMenu.getViewShoppingCart()).click()
        cy.get(LEShoppingPage.getTotalPrice()).should('contain.text', '0.00')
        cy.get(LEShoppingPage.getCheckoutBtn()).should('be.visible').click()

        //Account info - verify price and proceed to checkout
        cy.get(LEAccountPage.getTotalPrice()).should('contain', '0.00')
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
        //Need long wait here as this is always slow to load
        LEDashboardPage.getLongWait()

        //Verify completed order
        cy.get(LEInvoicePage.getOrderCompletedHeader()).should('contain', 'Order Completed!')
        cy.get(LEInvoicePage.getTotalPrice()).should('contain', '0.00')
    })

    it('Verify newly purchased OC course can be started', () => { 
        LEFilterMenu.SearchForCourseByName(courses.OC_ECOMM_FREE_COURSE_01_NAME)
        LEDashboardPage.getMediumWait()
        LEDashboardPage.getCourseCardBtnThenClick(courses.OC_ECOMM_FREE_COURSE_01_NAME)
        cy.get(LECoursesPage.getCourseILCTitle()).should('contain', courses.OC_ECOMM_FREE_COURSE_01_NAME)
    })
})