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
import arDashboardPage from '../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arPublishModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARPublishModal'
import ARCouponsAddEditPage, { AddCouponsData, ExtentionsData } from "../../../../../../../helpers/AR/pageObjects/E-commerce/Coupons/ARCouponsAddEditPage";
import defaultTestData from '../../../../../../fixtures/defaultTestData.json'
import departments from '../../../../../../fixtures/departments.json'
import ARDashboardPage from "../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage";


let timestamp = LEDashboardPage.getTimeStamp()
let timestamp2 = String(dayjs(timestamp).add(1, 'day')) //Original Expiration Date
let timestamp3 = String(dayjs(timestamp).add(4, 'day')) //Expiration Date after 3 Day Extension
let timestamp4 = String(dayjs(timestamp).add(7, 'day')) //Expiration Date after 3 Day Extension x2
let username = "GUIA-ECOMM-USER- " + timestamp
const CED_OC_NAME = 'GUIA - CED - OC - ' + timestamp;
let userID, courseID;
let extensionDay = '3';
let extensionPrice = '30';
let couponName = AddCouponsData.NAME + timestamp
let couponCode = defaultTestData.COUPON_10_OFF+ timestamp
let couponName2 = AddCouponsData.NAME + timestamp
let couponCode2 = defaultTestData.COUPON_40_OFF+ timestamp

describe('LE - E-Comm - Purchase - Course Extension with Coupon', function(){
    before(()=> {
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
        ARCourseSettingsEnrollmentRulesModule.clickAllowSelfEnrollmentRadioBtn('All Learners')
        //Enable E-Commerce and add price and extension
        cy.get(AROCAddEditPage.getElementByDataNameAttribute(ARCourseSettingsEnrollmentRulesModule.getEnableEcommToggleContainer()) + ' ' + AROCAddEditPage.getToggleEnabled()).click()
        AROCAddEditPage.getShortWait()
        cy.get(ARCourseSettingsEnrollmentRulesModule.getDefaultPriceTxtF()).clear().type('0')
        cy.get(ARCourseSettingsEnrollmentRulesModule.getAddExtensionBtn()).click()
        cy.get(arCoursesPage.getElementByDataNameAttributeAndIndex(ARCourseSettingsEnrollmentRulesModule.getExtensionGroup(), 0) + ' ' +
             ARCourseSettingsEnrollmentRulesModule.getExtensionDaysTxtF()).type(extensionDay)
        cy.get(arCoursesPage.getElementByDataNameAttributeAndIndex(ARCourseSettingsEnrollmentRulesModule.getExtensionGroup(), 0) + ' ' +
             ARCourseSettingsEnrollmentRulesModule.getExtensionPriceTxtF()).type(extensionPrice)
    
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
        //create coupon
        cy.createCoupon(couponName,couponCode) 
        //Add 40% Discount
        ARCouponsAddEditPage.getSetDiscountType('Currency')
        ARCouponsAddEditPage.getAddDiscount('Currency', 10)
        //Set date
        ARCouponsAddEditPage.getSelectFullDate('February 2025',1)
        //Save Coupon
        cy.saveCoupon()
        ARDashboardPage.getShortWait()
         //Add 40% Discount
        cy.createCoupon(couponName2,couponCode2) 
        ARCouponsAddEditPage.getSetDiscountType('Percentage')
        ARCouponsAddEditPage.getAddDiscount('Percentage', 40)
        //Set date
        ARCouponsAddEditPage.getSelectFullDate('February 2025',1)
        //Save Coupon
        cy.saveCoupon()    
    })
    
    beforeEach(() => {
        //Login and navigate to catalog before each test
        cy.apiLoginWithSession(username, DefaultTestData.USER_PASSWORD) 
    })

    after(()=> {
        //Cleanup - delete learner and course
        cy.deleteCourse(courseID);
        cy.get(LEDashboardPage.getNavProfile()).click()  
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
        cy.url().then((currentURL) => {
            userID = currentURL.slice(48);
            cy.deleteUser(userID);
        })
        cy.logoutLearner()
        cy.apiLoginWithSession(users.sysAdmin.ADMIN_SYS_01_USERNAME, users.sysAdmin.ADMIN_SYS_01_PASSWORD, '/admin')
        cy.deleteCoupon(couponCode)
        cy.deleteCoupon(couponCode2)
    })
    
    it('Purchase Course, Verify Expiration Banner, and Add Extension to Cart', () => { 
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

        //Verify Correct Extension Option is Displayed and Can be Added to Cart
        cy.get(LECoursesPage.getSingleExtensionOpt()).should('contain', extensionDay)
        cy.get(LECoursesPage.getAddExtensionToCartBtn()).should('contain', extensionPrice).click()
        LEDashboardPage.getLShortWait()
    })

    it('Verify Dollar Coupon Can Be Applied to Course Extension', () => { 
        //Go to Cart
        cy.get(LEDashboardPage.getNavShoppingCart()).click()
        cy.get(LEShoppingMenu.getViewShoppingCart()).click()

        //Add $10 Off Coupon
        cy.get(LEShoppingPage.getCouponCode()).type(couponCode)
        cy.get(LEShoppingPage.getApplyCouponCode()).click()
        cy.get(LEShoppingPage.getTotalPrice()).should('contain.text', String(parseInt(extensionPrice-10)))
        
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

        //Verify Multiseat Extension has been applied to course
        cy.get(LEInvoicePage.getViewCourseBtn()).click()
        LECoursesPage.getVerifyExpirationDate(timestamp3)
    })

    it('Verify Percentage Coupon Can Be Applied to Course Extension', () => { 
        //Go to Course and Add Extension to Cart Again
        LEDashboardPage.getTileByNameThenClick('My Courses')
        LEDashboardPage.getLShortWait()
        LEDashboardPage.getCourseCardBtnThenClick(CED_OC_NAME)
        cy.get(LECoursesPage.getSingleExtensionOpt()).should('contain', extensionDay)
        cy.get(LECoursesPage.getAddExtensionToCartBtn()).should('contain', extensionPrice).click()
        LEDashboardPage.getLShortWait()

        //Go to Cart
        cy.get(LEDashboardPage.getNavShoppingCart()).click()
        cy.get(LEShoppingMenu.getViewShoppingCart()).click()

        //Add 40% Off Coupon
        cy.get(LEShoppingPage.getCouponCode()).type(couponCode2)
        cy.get(LEShoppingPage.getApplyCouponCode()).click()
        cy.get(LEShoppingPage.getTotalPrice()).should('contain.text', String(parseInt(extensionPrice*0.6)))
        
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

        //Verify Multiseat Extension has been applied to course
        cy.get(LEInvoicePage.getViewCourseBtn()).click()
        LECoursesPage.getVerifyExpirationDate(timestamp4)
    })
})
