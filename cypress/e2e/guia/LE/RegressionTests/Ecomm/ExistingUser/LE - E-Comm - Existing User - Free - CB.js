import courses from '../../../../../../fixtures/courses.json'
import DefaultTestData from '../../../../../../fixtures/defaultTestData.json'
import LEProfilePage from '../../../../../../../helpers/LE/pageObjects/User/LEProfilePage'
import LEDashboardPage from '../../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LEShoppingMenu from '../../../../../../../helpers/LE/pageObjects/Menu/LEShoppingMenu'
import LEShoppingPage from '../../../../../../../helpers/LE/pageObjects/ECommerce/LEShoppingPage'
import LEAccountPage from '../../../../../../../helpers/LE/pageObjects/ECommerce/LEAccountPage'
import LEInvoicePage from '../../../../../../../helpers/LE/pageObjects/ECommerce/LEInvoicePage'
import LESideMenu from '../../../../../../../helpers/LE/pageObjects/Menu/LESideMenu'
import LEFilterMenu from '../../../../../../../helpers/LE/pageObjects/Menu/LEFilterMenu'
import { users } from "../../../../../../../helpers/TestData/users/users"
import { cbDetails } from '../../../../../../../helpers/TestData/Courses/cb'
import ARSelectModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import arAddMoreCourseSettingsModule from '../../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import ARCourseSettingsEnrollmentRulesModule from '../../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
import ARCURRAddEditPage from '../../../../../../../helpers/AR/pageObjects/Courses/CURR/ARCURRAddEditPage'
import arCBAddEditPage from '../../../../../../../helpers/AR/pageObjects/Courses/CB/ARCBAddEditPage'
import ARCourseSettingsCatalogVisibilityModule from '../../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCatalogVisibility.module'
import arDashboardPage from "../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import { commonDetails } from "../../../../../../../helpers/TestData/Courses/commonDetails"

let timestamp = LEDashboardPage.getTimeStamp()
let username = "GUIA-ECOMM-USER-FREE" + timestamp

describe('LE - E-Comm - Existing User - Free - CB', function(){

    before(function() {
        //Create a new user
        cy.createUser(void 0, username, ["Learner"], void 0)
    })

    after(function() {
        //Cleanup - Get userID, logout, and delete them
        cy.get(LEDashboardPage.getNavProfile()).click()  
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
        cy.url().then((currentURL) => {
            cy.deleteUser(currentURL.slice(-36));
        })
        //Delete Courses
        for (let i = 0; i < commonDetails.courseIDs.length; i++) {
            cy.deleteCourse(commonDetails.courseIDs[i], 'course-bundles')
        }
    })

    it('Create a free course bundle and assigned some courses', () => { 
        cy.apiLoginWithSession(
            users.sysAdmin.admin_sys_01_username,
            users.sysAdmin.admin_sys_01_password,
            "/admin"
        )
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        
        cy.createCourse('Course Bundle')
        //Add course to course bundle
        ARSelectModal.SearchAndSelectFunction([courses.CB_ECOMM_FREE_01_OC_CHILD_01, courses.CB_ECOMM_FREE_01_ILC_CHILD_02])
        ARSelectModal.getLShortWait()
        //Set enrollment rule - Allow self enrollment for all learners
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        LEDashboardPage.getShortWait()
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')
        //Enable E-Commerce
        cy.get(ARCURRAddEditPage.getElementByDataNameAttribute(ARCourseSettingsEnrollmentRulesModule.getEnableEcommToggleContainer()) + ' ' + ARCURRAddEditPage.getToggleEnabled()).click()
        ARCURRAddEditPage.getVShortWait()
        //Catalog visibility - turn on toggle
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Catalog Visibility')).click()
        arCBAddEditPage.getLShortWait()
        cy.get(arCBAddEditPage.getElementByDataNameAttribute(ARCourseSettingsCatalogVisibilityModule.getFeaturedCourseToggleContainer()) + ' ' + arCBAddEditPage.getToggleDisabled()).click()
         //Publish Curriculum
         cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
    })

    it('Search for & add free CB course to cart', () => {
        //Login & navigate to catalog before each test
        cy.apiLoginWithSession(username, DefaultTestData.USER_PASSWORD) 
        cy.get(LEDashboardPage.getNavMenu()).click()  
        LESideMenu.getLEMenuItemsByNameThenClick('Catalog') 
        LEFilterMenu.SearchForCourseByName(cbDetails.courseName)
        LEDashboardPage.getMediumWait()
        LEDashboardPage.getCourseCardBtnThenClick(cbDetails.courseName)
        LEDashboardPage.getMediumWait()
    })

    it('Go to cart, verify total price & checkout', () => {
        //Login & navigate to catalog before each test
        cy.apiLoginWithSession(username, DefaultTestData.USER_PASSWORD) 
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('Catalog') 
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

    it('Verify newly purchased CB course can be started', () => {
        //Login & navigate to catalog before each test
        cy.apiLoginWithSession(username, DefaultTestData.USER_PASSWORD) 
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('My Courses') 
        LEFilterMenu.SearchForCourseByName(courses.CB_ECOMM_FREE_COURSE_01_NAME)
        LEDashboardPage.getMediumWait()
        cy.get(LEDashboardPage.getCourseCardName()).should('contain', courses.CB_ECOMM_FREE_01_OC_CHILD_01)
        cy.get(LEDashboardPage.getCourseCardName()).should('contain', courses.CB_ECOMM_FREE_01_ILC_CHILD_02)
    })
})