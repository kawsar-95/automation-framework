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
import ARCouponsAddEditPage, { AddCouponsData, ExtentionsData } from "../../../../../../../helpers/AR/pageObjects/E-commerce/Coupons/ARCouponsAddEditPage";
import departments from '../../../../../../fixtures/departments.json'
import defaultTestData from '../../../../../../fixtures/defaultTestData.json'
import LEInvoicePage from '../../../../../../../helpers/LE/pageObjects/ECommerce/LEInvoicePage'
import LESelectILCSession from '../../../../../../../helpers/LE/pageObjects/Modals/LESelectILCSession.modal'


let timestamp = LEDashboardPage.getTimeStamp()
let username = "GUIA-ECOMM-USER" + timestamp
const COURSE_QUANTITY = 2;
let expiredCoupon = AddCouponsData.EXPRIEDCOUPON+ timestamp
let exceedCoupon = AddCouponsData.EXCEEDCOUPON+ timestamp
let singleUseCoupon = defaultTestData.COUPON_SINGLE_USE

describe('Create prerequest coupons',function(){
    
    it("Create an expired Coupon", () => {

        cy.createCoupon(expiredCoupon,expiredCoupon) 
        //Add 40% Discount
        ARCouponsAddEditPage.getSetDiscountType('Percentage')
        ARCouponsAddEditPage.getAddDiscount('Percentage',40)
        //Set date
        ARCouponsAddEditPage.getSelectFullDate('February 2023',1)
        //Set department
        ARCouponsAddEditPage.getSelectDepartmentByName(departments.DEPTB_NAME)
        //Set Course
        ARCouponsAddEditPage.getCourseByName(courses.OC_ECOMM_01_NAME)
        //Set Extention
        ARCouponsAddEditPage.getExtentionsByName(ExtentionsData['5_DAYS'])
        //Save Coupon
        cy.saveCoupon()

    })
    
    it("Create an exceed Coupon", () => {
        cy.createCoupon(exceedCoupon,exceedCoupon) 
        //Add 40% Discount
        ARCouponsAddEditPage.getSetDiscountType('Percentage')
        ARCouponsAddEditPage.getAddDiscount('Percentage',40)
        //Set date
        ARCouponsAddEditPage.getSelectFullDate('February 2025',1)
        //Set Max Uses as 1
        cy.get(ARCouponsAddEditPage.getMaxUsesField()).click().type(1)
        //Set department
        ARCouponsAddEditPage.getSelectDepartmentByName(departments.DEPTB_NAME)
        //Set Course
        ARCouponsAddEditPage.getCourseByName(courses.OC_ECOMM_01_NAME)
        ARCouponsAddEditPage.getCourseByName(courses.ILC_ECOMM_01_NAME)
        //Set Extention
        ARCouponsAddEditPage.getExtentionsByName(ExtentionsData['5_DAYS'])
        //Save Coupon
        cy.saveCoupon()
    })

    it("Create an single use Coupon", () => {
    cy.createCoupon(singleUseCoupon,singleUseCoupon) 
    //Add 40% Discount
    ARCouponsAddEditPage.getSetDiscountType('Percentage')
    ARCouponsAddEditPage.getAddDiscount('Percentage',40)
    //Set date
    ARCouponsAddEditPage.getSelectFullDate('February 2025',1)
    //Set single use toggle button on
    cy.get(ARCouponsAddEditPage.getSingleUsePerLearnerToggleBtn()).click()
    //Set department
    ARCouponsAddEditPage.getSelectDepartmentByName(departments.DEPTB_NAME)
    //Set Course
    ARCouponsAddEditPage.getCourseByName(courses.OC_ECOMM_01_NAME)
    //Set Extention
    ARCouponsAddEditPage.getExtentionsByName(ExtentionsData['5_DAYS'])
    //Save Coupon
    cy.saveCoupon()
    })
})

describe('LE - E-Comm - Existing User - Reference Number and Coupon - Setup', function(){

    before(function() {
        //Create a new user
        cy.createUser(void 0, username, ["Learner"], void 0)
    })

    it('Setup - Search for & add OC course to cart', () => {  
        //Login before
        cy.apiLoginWithSession(username, DefaultTestData.USER_PASSWORD) 
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('Catalog') 
        LEFilterMenu.SearchForCourseByName(courses.ILC_ECOMM_01_NAME)
        LEDashboardPage.getMediumWait()
        LEDashboardPage.getCourseCardBtnThenClick(courses.ILC_ECOMM_01_NAME)
        LEDashboardPage.getMediumWait()
        cy.get(LESelectILCSession.getILCCourseModal()).within(()=>{
            cy.get(LESelectILCSession.getAddILCCartBtn()).click()
        })
    })

    it('Use the only limit of exceed coupon and make it depleted', () => {
        cy.apiLoginWithSession(username, DefaultTestData.USER_PASSWORD) 
        cy.get(LEDashboardPage.getNavShoppingCart()).click()
        cy.get(LEShoppingMenu.getViewShoppingCart()).click() 
        cy.get(LEShoppingPage.getCouponCode()).type(exceedCoupon)
        cy.get(LEShoppingPage.getApplyCouponCode()).click()
        LEDashboardPage.getShortWait()
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
        LEDashboardPage.getShortWait()
        LEPaymentPage.getCCardInfo(DefaultTestData.CREDIT_CARD_NUMBER, '01', '2040', '111')
        cy.get(LEPaymentPage.getSubmitOrderBtn()).click()

        //Verify completed order
        cy.get(LEInvoicePage.getOrderCompletedHeader()).should('contain', 'Order Completed!')
        cy.get(LEInvoicePage.getTotalPrice()).should('contain', '60.00')
        //Button will only be visible if the user has been successfully logged in & transaction is approved
        cy.get(LEInvoicePage.getViewCourseBtn()).should('be.visible')
    })

    it('Setup - Search for & add OC course to cart', () => {  
        //Login before
        cy.apiLoginWithSession(username, DefaultTestData.USER_PASSWORD) 
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('Catalog') 
        LEFilterMenu.SearchForCourseByName(courses.OC_ECOMM_01_NAME)
        LEDashboardPage.getMediumWait()
        LEDashboardPage.getCourseCardBtnThenClick(courses.OC_ECOMM_01_NAME)
        LEDashboardPage.getMediumWait()
    })
})

describe('LE - E-Comm - Existing User - Reference Number and Coupon', function(){

    beforeEach(() => {
        //Login before each test and go to cart
        cy.apiLoginWithSession(username, DefaultTestData.USER_PASSWORD) 
        cy.get(LEDashboardPage.getNavShoppingCart()).click()
        cy.get(LEShoppingMenu.getViewShoppingCart()).click()
    })

    after(function() {
        //Cleanup - Get userID, logout, and delete them
        cy.get(LEDashboardPage.getNavProfile()).click()  
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
        cy.url().then((currentURL) => {
            cy.deleteUser(currentURL.slice(-36));
        })
    })

    it('Verify error when using expired coupon', () => { 
        cy.get(LEShoppingPage.getCouponCode()).type(expiredCoupon)
        cy.get(LEShoppingPage.getApplyCouponCode()).click()
        LEShoppingPage.getCouponErrorMsg('Coupon has Expired.')
    })

    it('Verify error when using depleted coupon', () => {
        cy.get(LEShoppingPage.getCouponCode()).type(exceedCoupon)
        cy.get(LEShoppingPage.getApplyCouponCode()).click()
        LEShoppingPage.getCouponErrorMsg("Coupon's maximum use has exceeded.")
    })

    it('Verify error when using single use per learner coupon on multi-seat purchase', () => { 
        cy.get(LEShoppingPage.getCourseQuantity()).clear().type(COURSE_QUANTITY)
        cy.get(LEShoppingPage.getQuantityUpdateBtn()).click()
        LEDashboardPage.getShortWait() //Allow for quantity to update
        cy.get(LEShoppingPage.getCouponCode()).type(DefaultTestData.COUPON_SINGLE_USE)
        cy.get(LEShoppingPage.getApplyCouponCode()).click()
        LEShoppingPage.getCouponErrorMsg("This coupon cannot be applied to multi-seat purchases.")
        //Reset quantity to 1
        cy.get(LEShoppingPage.getCourseQuantity()).clear().type('1')
        cy.get(LEShoppingPage.getQuantityUpdateBtn()).click()
        LEDashboardPage.getShortWait() //Allow for quantity to update
    })

    it('Verify you cannot proceed with blank Wire Transfer Reference #', () => { 
        cy.get(LEShoppingPage.getCheckoutBtn()).click()
        cy.get(LEAccountPage.getCheckoutBtn()).click()
        cy.get(LEAccountPage.getProceedToCheckoutBtn()).click()
        LEPaymentPage.getPaymentOptionByNameThenClick('Wire Transfer')
        cy.get(LEPaymentPage.getProceedToCheckoutBtn()).click()
        LEDashboardPage.getMediumWait() //allow for form to load with blank ref field

        //Verify proceed button is disabled if no reference number is entered
        cy.get(LEPaymentPage.getPOrderProceedToCheckoutBtn()).should('be.disabled')
    })

    it('Verify Wire Transfer Reference Number field can accept very long characters (>255 characters)', () => { 
        cy.get(LEShoppingPage.getCheckoutBtn()).click()
        cy.get(LEAccountPage.getCheckoutBtn()).click()
        cy.get(LEAccountPage.getProceedToCheckoutBtn()).click()
        LEPaymentPage.getPaymentOptionByNameThenClick('Wire Transfer')
        cy.get(LEPaymentPage.getProceedToCheckoutBtn()).click()

        //Fill out long wire transfer reference number and proceed
        cy.get(LEPaymentPage.getReferenceNumberTxtF()).type(LEPaymentPage.getLongString())
        cy.get(LEPaymentPage.getPOrderProceedToCheckoutBtn()).should('not.be.disabled').click()
    })

    it('Verify you cannot proceed with blank Cheque Reference #', () => { 
        cy.get(LEShoppingPage.getCheckoutBtn()).click()
        cy.get(LEAccountPage.getCheckoutBtn()).click()
        cy.get(LEAccountPage.getProceedToCheckoutBtn()).click()
        LEPaymentPage.getPaymentOptionByNameThenClick('Cheque')
        cy.get(LEPaymentPage.getProceedToCheckoutBtn()).click()
        LEDashboardPage.getMediumWait() //allow for form to load with blank ref field

        //Verify proceed button is disabled if no reference number is entered
        cy.get(LEPaymentPage.getPOrderProceedToCheckoutBtn()).should('be.disabled')
    })

    it('Verify Cheque Reference Number field can accept very long characters (>255 characters)', () => { 
        cy.get(LEShoppingPage.getCheckoutBtn()).click()
        cy.get(LEAccountPage.getCheckoutBtn()).click()
        cy.get(LEAccountPage.getProceedToCheckoutBtn()).click()
        LEPaymentPage.getPaymentOptionByNameThenClick('Cheque')
        cy.get(LEPaymentPage.getProceedToCheckoutBtn()).click()

        //Fill out long cheque reference number and proceed
        cy.get(LEPaymentPage.getReferenceNumberTxtF()).type(LEPaymentPage.getLongString())
        cy.get(LEPaymentPage.getPOrderProceedToCheckoutBtn()).should('not.be.disabled').click()
    })

    it('Verify you cannot proceed with blank Purchase Order Reference #', () => { 
        cy.get(LEShoppingPage.getCheckoutBtn()).click()
        cy.get(LEAccountPage.getCheckoutBtn()).click()
        cy.get(LEAccountPage.getProceedToCheckoutBtn()).click()
        LEPaymentPage.getPaymentOptionByNameThenClick('Purchase Order')
        cy.get(LEPaymentPage.getProceedToCheckoutBtn()).click()
        LEDashboardPage.getMediumWait() //allow for form to load with blank ref field

        //Verify proceed button is disabled if no reference number is entered
        cy.get(LEPaymentPage.getPOrderProceedToCheckoutBtn()).should('be.disabled')
    })

    it('Verify purchase order Reference Number field can accept very long characters (>255 characters)', () => { 
        cy.get(LEShoppingPage.getCheckoutBtn()).click()
        cy.get(LEAccountPage.getCheckoutBtn()).click()
        cy.get(LEAccountPage.getProceedToCheckoutBtn()).click()
        LEPaymentPage.getPaymentOptionByNameThenClick('Purchase Order')
        cy.get(LEPaymentPage.getProceedToCheckoutBtn()).click()

        //Fill out long purchase order reference number and proceed
        cy.get(LEPaymentPage.getReferenceNumberTxtF()).type(LEPaymentPage.getLongString())
        cy.get(LEPaymentPage.getPOrderProceedToCheckoutBtn()).should('not.be.disabled').click()
    })
})

describe('Delete created coupon',function(){
    
    it("Delete created coupon", () => {
    cy.deleteCoupon(expiredCoupon)
    cy.deleteCoupon(exceedCoupon)
    cy.deleteCoupon(singleUseCoupon)
    })
})