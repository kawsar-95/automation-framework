import courses from '../../../../../../fixtures/courses.json'
import users from '../../../../../../fixtures/users.json'
import DefaultTestData from '../../../../../../fixtures/defaultTestData.json'
import LEDashboardPage from '../../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import ARDashboardPage from '../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import LEProfilePage from '../../../../../../../helpers/LE/pageObjects/User/LEProfilePage'
import LECoursesPage from '../../../../../../../helpers/LE/pageObjects/Courses/LECoursesPage'
import LESideMenu from '../../../../../../../helpers/LE/pageObjects/Menu/LESideMenu'
import LEFilterMenu from '../../../../../../../helpers/LE/pageObjects/Menu/LEFilterMenu'
import LEShoppingMenu from '../../../../../../../helpers/LE/pageObjects/Menu/LEShoppingMenu'
import LEShoppingPage from '../../../../../../../helpers/LE/pageObjects/ECommerce/LEShoppingPage'
import LEAccountPage from '../../../../../../../helpers/LE/pageObjects/ECommerce/LEAccountPage'
import LEPaymentPage from '../../../../../../../helpers/LE/pageObjects/ECommerce/LEPaymentPage'
import LEInvoicePage from '../../../../../../../helpers/LE/pageObjects/ECommerce/LEInvoicePage'
import defaultTestData from '../../../../../../fixtures/defaultTestData.json'
import ARCouponsAddEditPage, { AddCouponsData, ExtentionsData } from '../../../../../../../helpers/AR/pageObjects/E-commerce/Coupons/ARCouponsAddEditPage'
import { departments } from '../../../../../../../helpers/TestData/Department/departments'

let timestamp = LEDashboardPage.getTimeStamp()
let username = DefaultTestData.USER_LEARNER_UNAME_PRE + timestamp
let refNumber = 'WT1234' + timestamp
let couponName = AddCouponsData.NAME + timestamp
let couponCode = defaultTestData.COUPON_10_OFF+ timestamp

describe('Create a coupon as a prerequest',function(){
   
    it("Create a Coupon", () => {

        cy.createCoupon(couponName,couponCode) 
        //Add 40% Discount
        ARCouponsAddEditPage.getSetDiscountType('Percentage')
        ARCouponsAddEditPage.getAddDiscount('Percentage',40)
        //Set date
        ARCouponsAddEditPage.getSelectFullDate('February 2025',1)
        //Set department
        ARCouponsAddEditPage.getSelectDepartmentByName(departments.dept_top_name)
        //Save Coupon
        cy.saveCoupon()
        LEDashboardPage.getShortWait()

    })
})


describe('LE - E-Comm - Signup - Purchase - Curriculum with WireT (using Coupon)', function(){

    beforeEach(() => {
        cy.visit("/#/public-dashboard")
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('Catalog')
    })

    it('Add Curr to Cart, Go to cart, apply coupon, verify total price, signup & checkout', () => {
        //Search for Curr and Add to Cart 
        LEFilterMenu.SearchForCourseByName(courses.CURR_ECOMM_01_NAME)
        LEDashboardPage.getMediumWait()
        LEDashboardPage.getCourseCardBtnThenClick(courses.CURR_ECOMM_01_NAME)
        LEDashboardPage.getMediumWait()
        //Go to Cart
        cy.get(LEDashboardPage.getNavShoppingCart()).click()
        cy.get(LEShoppingMenu.getViewShoppingCart()).click()
        cy.get(LEShoppingPage.getCouponCode()).type(couponCode)
        cy.get(LEShoppingPage.getApplyCouponCode()).click()
        cy.get(LEShoppingPage.getTotalPrice()).should('contain.text', '60.00')
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
        cy.get(LEAccountPage.getJobTitleTxtF()).type(DefaultTestData.USER_LEARNER_JOB_TITLE)
        cy.get(LEAccountPage.getProceedBtn()).click()

        //Add additional shipping information and proceed
        cy.get(LEAccountPage.getPhoneTxtF()).type(DefaultTestData.USER_LEARNER_PHONE)
        cy.get(LEAccountPage.getAddressTxtF()).type(DefaultTestData.USER_LEARNER_ADDRESS)
        cy.get(LEAccountPage.getCountryDDown()).select(DefaultTestData.USER_LEARNER_COUNTRY_CODE)
        cy.get(LEAccountPage.getProvinceDDown()).select(DefaultTestData.USER_LEARNER_PROVINCE)
        cy.get(LEAccountPage.getCityTxtF()).type(DefaultTestData.USER_LEARNER_CITY)
        cy.get(LEAccountPage.getPostalCodeTxtF()).type(DefaultTestData.USER_LEARNER_POSTALCODE)
        cy.get(LEAccountPage.getProceedToCheckoutBtn()).click()

        //Select payment option of Wire Transfer and proceed
        LEPaymentPage.getPaymentOptionByNameThenClick('Wire Transfer')
        cy.get(LEPaymentPage.getProceedToCheckoutBtn()).click()

        //Fill out Wire Transfer reference number and proceed
        cy.get(LEPaymentPage.getReferenceNumberTxtF()).type(refNumber)
        //VShort wait is required here as bot protection will detect submissions <900ms
        LEDashboardPage.getVShortWait()
        cy.get(LEPaymentPage.getPOrderProceedToCheckoutBtn()).click()

        //Verify completed order (includes 10% tax for Wire Transfer)
        cy.get(LEInvoicePage.getOrderCompletedHeader()).should('contain', 'Order Completed!')
        cy.get(LEInvoicePage.getTotalPrice()).should('contain', '66.00')
    })
})

describe('LE - E-Comm - Signup - Purchase - Curriculum with WireT (using Coupon) - Approve Transaction', function(){

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

describe('LE - E-Comm - Signup - Purchase - Curriculum with WireT (using Coupon) - Verify Purchase', function(){

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
            cy.deleteUser(currentURL.slice(-36));
        })
    })

    it('Verify newly purchased course within the CB can be started', () => { 
        LEFilterMenu.SearchForCourseByName(courses.CURR_ECOMM_01_NAME)
        LEDashboardPage.getLongWait()
        LEDashboardPage.getCourseCardBtnThenClick(courses.CURR_ECOMM_01_NAME)
        cy.get(LECoursesPage.getCourseILCTitle()).should('contain', courses.CURR_ECOMM_01_NAME)
    })
})

describe('Delete created coupon',function(){
    
    it("Delete created coupon", () => {
        cy.deleteCoupon(couponCode)
    })
})