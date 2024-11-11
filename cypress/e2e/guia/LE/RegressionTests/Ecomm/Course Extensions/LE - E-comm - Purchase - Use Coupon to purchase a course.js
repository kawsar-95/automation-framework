import DefaultTestData from '../../../../../../fixtures/defaultTestData.json'
import LEDashboardPage from '../../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LECoursesPage from '../../../../../../../helpers/LE/pageObjects/Courses/LECoursesPage'
import LEAccountPage from '../../../../../../../helpers/LE/pageObjects/ECommerce/LEAccountPage'
import LEInvoicePage from '../../../../../../../helpers/LE/pageObjects/ECommerce/LEInvoicePage'
import LEFilterMenu from '../../../../../../../helpers/LE/pageObjects/Menu/LEFilterMenu'
import ARCourseSettingsEnrollmentRulesModule from '../../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
import ARCourseSettingsAvailabilityModule from '../../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsAvailability.module'
import arAddMoreCourseSettingsModule from '../../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import arCoursesPage from '../../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import AROCAddEditPage from '../../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage'
import arDashboardPage from '../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARDashboardPage from "../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage";
import ARCouponsAddEditPage, { AddCouponsData } from "../../../../../../../helpers/AR/pageObjects/E-commerce/Coupons/ARCouponsAddEditPage";
import ARDepartmentProgressReportPage from "../../../../../../../helpers/AR/pageObjects/Reports/ARDepartmentProgressReportPage";
import ARDeleteModal from "../../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal";
import { users } from "../../../../../../../helpers/TestData/users/users";
import LECatalogPage from "../../../../../../../helpers/LE/pageObjects/Catalog/LECatalogPage";
import { departments } from "../../../../../../../helpers/TestData/Department/departments";
import { userDetails } from '../../../../../../../helpers/TestData/users/UserDetails'
import { ocDetails } from '../../../../../../../helpers/TestData/Courses/oc'

let timestamp = LEDashboardPage.getTimeStamp()
let couponCode = DefaultTestData.COUPON_10_OFF+ timestamp
let username = userDetails.username
const CED_OC_NAME = ocDetails.courseName
const CART_PAGE_URL = 'https://guiaar.qa.myabsorb.com/#/cart'
let courseID;

describe('C6340 - Regression - Use Coupon to Purchase a Course', function(){
    before(function() {
        //Create a new user
        cy.createUser(void 0, username, ["Learner"], void 0)

        // Create a course
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, "/admin");
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        
        cy.createCourse('Online Course', CED_OC_NAME)
        //Set All Learner Enrollment Rule
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        AROCAddEditPage.getShortWait()
        ARCourseSettingsEnrollmentRulesModule.getSelectSelfEnrollmentRadioBtnbyName('All Learners')
        //Enable E-Commerce and add price and extension
        cy.get(AROCAddEditPage.getElementByDataNameAttribute(ARCourseSettingsEnrollmentRulesModule.getEnableEcommToggleContainer()) + ' ' + AROCAddEditPage.getToggleEnabled()).click()
        AROCAddEditPage.getShortWait()
        cy.get(ARCourseSettingsEnrollmentRulesModule.getDefaultPriceTxtF()).clear().type('0')
        cy.get(ARCourseSettingsEnrollmentRulesModule.getAddExtensionBtn()).click()
        cy.get(arCoursesPage.getElementByDataNameAttributeAndIndex(ARCourseSettingsEnrollmentRulesModule.getExtensionGroup(), 0) + ' ' +
             ARCourseSettingsEnrollmentRulesModule.getExtensionDaysTxtF()).type('3')
        cy.get(arCoursesPage.getElementByDataNameAttributeAndIndex(ARCourseSettingsEnrollmentRulesModule.getExtensionGroup(), 0) + ' ' +
             ARCourseSettingsEnrollmentRulesModule.getExtensionPriceTxtF()).type('30')
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
        LEDashboardPage.getMediumWait()

        // Add Coupon
        cy.createCoupon(couponCode,couponCode) 
        //Add 40% Discount
        ARCouponsAddEditPage.getSetDiscountType('Currency')
        ARCouponsAddEditPage.getAddDiscount('Currency', 10)
        //Set date
        ARCouponsAddEditPage.getSelectFullDate('February 2025',1)
        ARCouponsAddEditPage.getCourseByName(CED_OC_NAME)
        //Save Coupon
        cy.saveCoupon()
    })

    after(function() {
        // Cleanup - delete learner and course
        cy.deleteCourse(courseID);

        cy.get(ARDashboardPage.getWaitSpinner(), {timeout: 15000}).should('not.exist')
        //Delete created user
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, "/admin")
        ARDashboardPage.getLongWait()
        //Click on users
        cy.get(ARDashboardPage.getElementByTitleAttribute('Users')).click()
        ARDashboardPage.getMediumWait()
        //Click on users
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Users'))
        cy.intercept('/api/rest/v2/admin/reports/users/operations').as('getUsers').wait('@getUsers')
        ARDashboardPage.getMediumWait()
        ARDashboardPage.AddFilter('Username', 'Contains', username)
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getGridTable()).eq(0).click()
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Delete')).click()
        ARDashboardPage.getShortWait()
        cy.get(ARDashboardPage.getElementByDataNameAttribute(ARDeleteModal.getDeleteBtn())).click()
        ARDashboardPage.getMediumWait()

        // Delete Coupon
        // Click on e-commerce from left panel
        cy.deleteCoupon(couponCode)
    })
    
    beforeEach(() => {
        //Login and navigate to catalog before each test
        cy.apiLoginWithSession(username, DefaultTestData.USER_PASSWORD, "/#/public-dashboard")
        LECatalogPage.getVLongWait()
    })
    
    it('Use Coupon to Purchase a Course', () => { 
        //Login and navigate to catalog before each test
        LEDashboardPage.getTileByNameThenClick('Catalog')
        cy.get(LEDashboardPage.getLEEllipsesLoader(), {timeout: 15000}).should('not.exist')
        LEFilterMenu.SearchForCourseByName(CED_OC_NAME)
        LEDashboardPage.getMediumWait()
        cy.get(LEDashboardPage.getElementByTitleAttribute(CED_OC_NAME), {timeout:100000}).should('contain', CED_OC_NAME, {timeout:100000}).eq(2).click()
        LEDashboardPage.getMediumWait()

        // Click on 'Add to cart' option
        cy.get(LECatalogPage.getCourseModal()).within(()=>{
            cy.get(LECatalogPage.getCourseDetailHeader()).click()
            LECatalogPage.getMediumWait()
        })
        
        // Click on 'View cart' option
        cy.get(LECatalogPage.getCourseModal()).within(()=>{
            cy.get(LECatalogPage.getCourseDetailHeader()).click()
            LECatalogPage.getMediumWait()
        })

        // Enter Coupon code
        cy.get(LECatalogPage.getElementByNameAttribute('code')).click().type(couponCode)
        LECatalogPage.getMediumWait()

        // Click on the 'Apply' button
        cy.get(LECatalogPage.getElementByTitleAttribute('Apply discount')).click()

        // Click on the 'Proceed to Checkout' button 1st
        cy.get(LECatalogPage.getProceedToCheckoutBtn()).click()
        LECatalogPage.getShortWait()

        // Click on Edit button
        cy.get(LEAccountPage.getElementByAriaLabelAttribute('Edit Shopping Cart')).click()
        LECatalogPage.getShortWait()    

        // Verify redirected to the Cart page
        cy.url().should('eq', CART_PAGE_URL)

        // Click on the 'Proceed to Checkout' button 1st
        cy.get(LECatalogPage.getProceedToCheckoutBtn()).click()
        LECatalogPage.getShortWait()    

        // Click on the 'Proceed to Checkout' button 2nd
        cy.get(LEAccountPage.getProceedToCheckoutBtnSecond()).click()
        LECatalogPage.getShortWait()    

        //Add additional shipping information and proceed
        cy.get(LEAccountPage.getPhoneTxtF()).type(DefaultTestData.USER_LEARNER_PHONE)
        cy.get(LEAccountPage.getAddressTxtF()).type(DefaultTestData.USER_LEARNER_ADDRESS)
        cy.get(LEAccountPage.getCountryDDown()).select(DefaultTestData.USER_LEARNER_COUNTRY_CODE)
        cy.get(LEAccountPage.getProvinceDDown()).select(DefaultTestData.USER_LEARNER_PROVINCE)
        cy.get(LEAccountPage.getCityTxtF()).type(DefaultTestData.USER_LEARNER_CITY)
        cy.get(LEAccountPage.getPostalCodeTxtF()).type(DefaultTestData.USER_LEARNER_POSTALCODE)

        // Click on the 'Proceed to Checkout' button
        cy.get(LEAccountPage.getProceedToCheckoutBtn()).click({force: true})
        cy.intercept('**/shipping-information').as('postShippingInformation').wait('@postShippingInformation');
        
        // Click on View Course button
        cy.get(LEInvoicePage.getViewCourseBtn()).click()
        LECatalogPage.getMediumWait() 
        // Verify Course Title
        cy.get(LECoursesPage.getCourseTitleInBanner()).should('contain', CED_OC_NAME)
        LECatalogPage.getMediumWait()
    })
})