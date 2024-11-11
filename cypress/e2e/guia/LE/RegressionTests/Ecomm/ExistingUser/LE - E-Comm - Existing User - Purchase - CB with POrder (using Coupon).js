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
import ARCouponsAddEditPage, { AddCouponsData, ExtentionsData } from "../../../../../../../helpers/AR/pageObjects/E-commerce/Coupons/ARCouponsAddEditPage";
import departments from '../../../../../../fixtures/departments.json'
import defaultTestData from '../../../../../../fixtures/defaultTestData.json'


let timestamp = LEDashboardPage.getTimeStamp()
let username = "GUIA-ECOMM-USER-FREE" + timestamp
let refNumber = 'A123456' + timestamp
let couponName = AddCouponsData.NAME + timestamp
let couponCode = defaultTestData.COUPON_10_OFF+ timestamp

describe('Create a coupon as a prerequest',function(){
   
    it("Create an expired Coupon", () => {

        cy.createCoupon(couponName,couponCode) 
        //Add 40% Discount
        ARCouponsAddEditPage.getSetDiscountType('Percentage')
        ARCouponsAddEditPage.getAddDiscount('Percentage',40)
        //Set date
        ARCouponsAddEditPage.getSelectFullDate('February 2025',1)
        //Set department
        ARCouponsAddEditPage.getSelectDepartmentByName(departments.DEPT_TOP_NAME)
        //Set Course
        ARCouponsAddEditPage.getCourseByName(courses.CB_ECOMM_01_NAME)
        //Set Extention
        ARCouponsAddEditPage.getExtentionsByName(ExtentionsData['5_DAYS'])
        //Save Coupon
        cy.saveCoupon()

    })
})

describe('LE - E-Comm - Existing User - Purchase - CB with POrder (using Coupon)', function(){

    before(function() {
        //Create a new user
        cy.createUser(void 0, username, ["Learner"], void 0)
    })

    beforeEach(() => {
        //Login before each test
        cy.apiLoginWithSession(username, DefaultTestData.USER_PASSWORD) 
    })

    it('Search for & add CB to cart', () => {
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('Catalog') 
        LEFilterMenu.SearchForCourseByName(courses.CB_ECOMM_01_NAME)
        LEDashboardPage.getMediumWait()
        LEDashboardPage.getCourseCardBtnThenClick(courses.CB_ECOMM_01_NAME)
        LEDashboardPage.getMediumWait()
    })

    it('Go to cart, add coupon, verify total price & checkout', () => { 
        cy.get(LEDashboardPage.getNavShoppingCart()).click()
        cy.get(LEShoppingMenu.getViewShoppingCart()).click()
        cy.get(LEShoppingPage.getCouponCode()).type(couponCode)
        cy.get(LEShoppingPage.getApplyCouponCode()).click()
        cy.get(LEShoppingPage.getTotalPrice()).should('contain.text', '60.00')
        cy.get(LEShoppingPage.getCheckoutBtn()).should('be.visible').click()

        //Account info - verify price and proceed to checkout
        cy.get(LEAccountPage.getTotalPrice()).should('contain', '60.00')
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

        //Select payment option of Purchase Order and proceed
        LEPaymentPage.getPaymentOptionByNameThenClick('Purchase Order')
        cy.get(LEPaymentPage.getProceedToCheckoutBtn()).click()

        //Fill out purchase order reference number and proceed
        cy.get(LEPaymentPage.getReferenceNumberTxtF()).type(refNumber)
        //VShort wait is required here as bot protection will detect submissions <900ms
        LEDashboardPage.getVShortWait()
        cy.get(LEPaymentPage.getPOrderProceedToCheckoutBtn()).click()

        //Verify completed order (includes 10% tax for Purchase Order)
        cy.get(LEInvoicePage.getOrderCompletedHeader()).should('contain', 'Order Completed!')
        cy.get(LEInvoicePage.getTotalPrice()).should('contain', '66.00')
    })
})

describe('LE - E-Comm - Existing User - Purchase - CB with POrder (using Coupon) - Approve Purchase', function(){

    before(function() {
        //Sign into admin side as sys admin
        cy.apiLoginWithSession(users.sysAdmin.ADMIN_SYS_01_USERNAME, users.sysAdmin.ADMIN_SYS_01_PASSWORD, '/admin')
    })

    after(function(){
        cy.deleteCoupon(couponCode)
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

describe('LE - E-Comm - Existing User - Purchase - CB with POrder (using Coupon) - Verify Purchase', function(){

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
        cy.url().then((currentURL) => {;
            cy.deleteUser(currentURL.slice(-36));
        })
    })

    it('Verify newly purchased course within the CB can be started', () => { 
        LEFilterMenu.SearchForCourseByName(courses.ILC_ECOMM_CHILD_01_NAME)
        LEDashboardPage.getShortWait()
        LEDashboardPage.getCourseCardBtnThenClick(courses.ILC_ECOMM_CHILD_01_NAME)
        cy.get(LECoursesPage.getCourseILCTitle()).should('contain', courses.ILC_ECOMM_CHILD_01_NAME)
    })
})