import dayjs from "dayjs";
import users from '../../../../../../fixtures/users.json'
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
import ARCourseSettingsEnrollmentRulesModule from '../../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
import ARCourseSettingsAvailabilityModule from '../../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsAvailability.module'
import arAddMoreCourseSettingsModule from '../../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import arCoursesPage from '../../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import AROCAddEditPage from '../../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage'
import arPublishModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARPublishModal'
import arDashboardPage from '../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'

let timestamp = LEDashboardPage.getTimeStamp()
let timestamp2 = String(dayjs(timestamp).add(1, 'day')) //Original Expiration Date
let timestamp3 = String(dayjs(timestamp).add(4, 'day')) //Expiration Date after 3 Day Extension
let timestamp4 = String(dayjs(timestamp).add(7, 'day')) //Expiration Date after 3 Day Extension x2
let username = "GUIA-ECOMM-USER- " + timestamp
const CED_OC_NAME = 'GUIA - CED - OC - ' + timestamp;
let userID, courseID;
let extensionDays = ['2', '3', '5'];
let extensionPrices = ['20', '30', '40'];

describe('LE - E-Comm - Purchase - OC Course Extension', function(){
    before(function() {
        //Create a new user
        cy.createUser(void 0, username, ["Learner"], void 0)
        //Create a course
        cy.apiLoginWithSession(users.sysAdmin.ADMIN_SYS_01_USERNAME, users.sysAdmin.ADMIN_SYS_01_PASSWORD, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        
        cy.createCourse('Online Course', CED_OC_NAME)
        //Set All Learner Enrollment Rule
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        AROCAddEditPage.getShortWait()
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')
        //Enable E-Commerce and add price and extensions
        cy.get(AROCAddEditPage.getElementByDataNameAttribute(ARCourseSettingsEnrollmentRulesModule.getEnableEcommToggleContainer()) + ' ' + AROCAddEditPage.getToggleEnabled()).click()
        AROCAddEditPage.getShortWait()
        cy.get(ARCourseSettingsEnrollmentRulesModule.getDefaultPriceTxtF()).clear().type('0')
        for (let i = 0; i < extensionDays.length; i++) {
            cy.get(ARCourseSettingsEnrollmentRulesModule.getAddExtensionBtn()).click()
            cy.get(arCoursesPage.getElementByDataNameAttributeAndIndex(ARCourseSettingsEnrollmentRulesModule.getExtensionGroup(), i) + ' ' +
                ARCourseSettingsEnrollmentRulesModule.getExtensionDaysTxtF()).type(extensionDays[i])
            cy.get(arCoursesPage.getElementByDataNameAttributeAndIndex(ARCourseSettingsEnrollmentRulesModule.getExtensionGroup(), i) + ' ' +
                ARCourseSettingsEnrollmentRulesModule.getExtensionPriceTxtF()).type(extensionPrices[i])
        }
        //Add Expiration Date for Next Day
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Availability')).click()
        AROCAddEditPage.getShortWait()
        cy.get(ARCourseSettingsAvailabilityModule.getExpirationRadioBtn()).contains(/^Date$/).click().click()
        cy.get(ARCourseSettingsAvailabilityModule.getDateExpiresDatePickerBtn()).click()
        ARCourseSettingsAvailabilityModule.getCalenderSelectSingleDay(parseInt(timestamp.slice(8, 10))+1)
        cy.get(ARCourseSettingsAvailabilityModule.getDateExpiresTimePickerBtn()).click()
        ARCourseSettingsAvailabilityModule.SelectTime('12', '00', 'PM')
        arCoursesPage.getVShortWait()
        //Publish OC
        cy.publishCourseAndReturnId().then((id) => {
            courseID = id.request.url.slice(-36)
        })
    })
    
    beforeEach(() => {
        //Login and navigate to catalog before each test
        cy.apiLoginWithSession(username, DefaultTestData.USER_PASSWORD) 
    })

    after(function() {
        //Cleanup - delete learner and course
        cy.deleteCourse(courseID);
        cy.get(LEDashboardPage.getNavProfile()).click()  
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
        cy.url().then((currentURL) => {
            cy.deleteUser(currentURL.slice(-36));
        })
    })

    it('Purchase Course and Verify Expiration Banner', () => { 
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('Catalog')
        LEFilterMenu.SearchForCourseByName(CED_OC_NAME)
        LEDashboardPage.getMediumWait()
        LEDashboardPage.getCourseCardBtnThenClick(CED_OC_NAME)
        LEDashboardPage.getMediumWait()
        //Go to cart and checkout
        cy.get(LEDashboardPage.getNavShoppingCart()).click()
        cy.get(LEShoppingMenu.getViewShoppingCart()).click()
        cy.get(LEShoppingPage.getCheckoutBtn()).should('be.visible').click()
        cy.get(LEAccountPage.getCheckoutBtn()).click()
        cy.get(LEAccountPage.getProceedToCheckoutBtn()).click()
        //Need long wait here as this is always slow to load
        LEDashboardPage.getLongWait()

        //Go to Course and Verify Expiration Banner Date
        cy.get(LEInvoicePage.getViewCourseBtn()).click()
        LECoursesPage.getVerifyExpirationDate(timestamp2)
    })

    it('Verify Extension Can be Selected and Purchased', () => { 
        //Go to Course
        LEDashboardPage.getTileByNameThenClick('My Courses')
        LEDashboardPage.getLShortWait()
        LEDashboardPage.getCourseCardBtnThenClick(CED_OC_NAME)
        LEDashboardPage.getShortWait()
        
        //Verify Dropdown Days and Prices
        for (let i = 0; i < extensionDays.length; i++) {
            cy.get(LECoursesPage.getExtensionDDown()).select(`Extend by ${extensionDays[i]} days`)
            cy.get(LECoursesPage.getAddExtensionToCartBtn()).should('contain', extensionPrices[i])
        }
        
        //Verify Extension can be added to cart (3 Day)
        cy.get(LECoursesPage.getExtensionDDown()).select(`Extend by ${extensionDays[1]} days`)
        cy.get(LECoursesPage.getAddExtensionToCartBtn()).click()
        LEDashboardPage.getLShortWait()

        //Verify Only 1 Extension can be added to cart (DDown should be disabled)
        cy.get(LECoursesPage.getExtensionDDown()).should('have.attr', 'disabled')
        cy.get(LECoursesPage.getAddExtensionToCartBtn()).should('contain', 'Added to Cart').click()

        //Verify Extension can be purchased with CCard
        cy.get(LEShoppingPage.getCheckoutBtn()).should('be.visible').click()
        cy.get(LEAccountPage.getCheckoutBtn()).click()
        cy.get(LEAccountPage.getProceedToCheckoutBtn()).click()
        //Select payment option of CCard and proceed
        LEPaymentPage.getPaymentOptionByNameThenClick('Credit Card')
        cy.get(LEPaymentPage.getProceedToCheckoutBtn()).click()
        // CI test agents run from the USA so if needed, select Canada
        LEPaymentPage.getSelectCanadaAndPCIfInOtherCountry();
        cy.get(LEPaymentPage.getPostalCodeTxtF()).should('have.value', DefaultTestData.USER_LEARNER_POSTALCODE)
        cy.get(LEPaymentPage.getProvinceDDown()).should('have.value', DefaultTestData.USER_LEARNER_CITY + ', ' + DefaultTestData.USER_LEARNER_PROVINCE_CODE)
        //Fill out credit card info and submit order
        LEPaymentPage.getCCardInfo(DefaultTestData.CREDIT_CARD_NUMBER, '01', '2040', '111')
        cy.get(LEPaymentPage.getSubmitOrderBtn()).click()

        //Verify Extension has been applied to course
        cy.get(LEInvoicePage.getViewCourseBtn()).click()
        LECoursesPage.getVerifyExpirationDate(timestamp3)
    })

    it('Verify Same Extension Can be Purchased Multiple Times', () => { 
        //Go to Course
        LEDashboardPage.getTileByNameThenClick('My Courses')
        LEDashboardPage.getLShortWait()
        LEDashboardPage.getCourseCardBtnThenClick(CED_OC_NAME)
        LEDashboardPage.getShortWait()

        //Verify Same extension can be purchased - Add to cart
        cy.get(LECoursesPage.getExtensionDDown()).select(`Extend by ${extensionDays[1]} days`)
        cy.get(LECoursesPage.getAddExtensionToCartBtn()).click()
        LEDashboardPage.getLShortWait()
        cy.get(LECoursesPage.getAddExtensionToCartBtn()).should('contain', 'Added to Cart').click()
        //Purchase same Extension
        cy.get(LEShoppingPage.getCheckoutBtn()).should('be.visible').click()
        cy.get(LEAccountPage.getCheckoutBtn()).click()
        cy.get(LEAccountPage.getProceedToCheckoutBtn()).click()
        //Select payment option of CCard and proceed
        LEPaymentPage.getPaymentOptionByNameThenClick('Credit Card')
        cy.get(LEPaymentPage.getProceedToCheckoutBtn()).click()
        // CI test agents run from the USA so if needed, select Canada
        LEPaymentPage.getSelectCanadaAndPCIfInOtherCountry();
        cy.get(LEPaymentPage.getPostalCodeTxtF()).should('have.value', DefaultTestData.USER_LEARNER_POSTALCODE)
        cy.get(LEPaymentPage.getProvinceDDown()).should('have.value', DefaultTestData.USER_LEARNER_CITY + ', ' + DefaultTestData.USER_LEARNER_PROVINCE_CODE)
        //Fill out credit card info and submit order
        LEPaymentPage.getCCardInfo(DefaultTestData.CREDIT_CARD_NUMBER, '01', '2040', '111')
        cy.get(LEPaymentPage.getSubmitOrderBtn()).click()

        //Verify extension is cumulative 
        cy.get(LEInvoicePage.getViewCourseBtn()).click()
        LECoursesPage.getVerifyExpirationDate(timestamp4)
    })
})