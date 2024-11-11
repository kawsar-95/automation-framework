import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LESideMenu from '../../../../../../helpers/LE/pageObjects/Menu/LESideMenu'
import LEProfilePage from '../../../../../../helpers/LE/pageObjects/User/LEProfilePage'
import LECourseLessonPlayerPage from '../../../../../../helpers/LE/pageObjects/Courses/LECourseLessonPlayerPage'
import LECourseDetailsILCModule from '../../../../../../helpers/LE/pageObjects/Courses/LECourseDetailsILCModule'
import LESelectILCSession from '../../../../../../helpers/LE/pageObjects/Modals/LESelectILCSession.modal'
import LEFilterMenu from '../../../../../../helpers/LE/pageObjects/Menu/LEFilterMenu'
import LEShoppingMenu from '../../../../../../helpers/LE/pageObjects/Menu/LEShoppingMenu'
import LEShoppingPage from '../../../../../../helpers/LE/pageObjects/ECommerce/LEShoppingPage'
import LEAccountPage from '../../../../../../helpers/LE/pageObjects/ECommerce/LEAccountPage'
import LEPaymentPage from '../../../../../../helpers/LE/pageObjects/ECommerce/LEPaymentPage'
import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arEnrollUsersPage from '../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage'
import arUserPage from '../../../../../../helpers/AR/pageObjects/User/ARUserPage'
import arEditActivityPage from '../../../../../../helpers/AR/pageObjects/Enrollment/AREditActivityPage'
import arSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import { userDetails, ecommFields } from '../../../../../../helpers/TestData/users/UserDetails'
import { users } from '../../../../../../helpers/TestData/users/users'
import { courses } from "../../../../../../helpers/TestData/Courses/courses"
import LECourseDetailsModal from '../../../../../../helpers/LE/pageObjects/Modals/LECourseDetails.modal'

describe('LE - Course Activity - Learner Un-enroll - ILC - Admin Side', function(){

    before(function () {
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
    })

    beforeEach(function() {        
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getUserEnrollmentsReport()
        cy.wrap(arEnrollUsersPage.EnrollmentPageFilter(userDetails.username))
        
    })

    it('Admin - Enroll in ILC via Admin', () => {
        cy.wrap(arEnrollUsersPage.WaitForElementStateToChange(arEnrollUsersPage.getAddEditMenuActionsByName('Add Enrollment')), 1000)
        cy.get(arEnrollUsersPage.getAddEditMenuActionsByName('Add Enrollment')).should('have.attr','aria-disabled','false').click()
        cy.get(arUserPage.getElementByDataNameAttribute(arEnrollUsersPage.getEnrollUsersAddCourseBtn())).click()
        cy.wrap(arSelectModal.SearchAndSelectFunction([courses.ilc_filter_01_name]))
        cy.wrap(arEnrollUsersPage.getSelectILCSessionWithinCourse(courses.ilc_filter_01_name, courses.ilc_session_01_name))
        cy.wrap(arEnrollUsersPage.WaitForElementStateToChange(arEnrollUsersPage.getSaveBtn()), 1000)
        cy.get(arEnrollUsersPage.getSaveBtn()).click()
        cy.get(arDashboardPage.getToastSuccessMsg()).should('be.visible') 
    })

})

describe('LE - Course Activity - Learner Un-enroll - ILC - Ineligible Criteria', function () {
    
    beforeEach(() => {
        //Login and go to the course before each test
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        cy.get(LEDashboardPage.getNavMenu()).click() 
        LESideMenu.getLEMenuItemsByNameThenClick('Catalog')
    })

    it('Verify a user cannot Unenroll from an ILC enrolled by Admin', () => {
        LEFilterMenu.SearchForCourseByName(courses.ilc_filter_01_name)
        LEFilterMenu.getMediumWait()
        LEDashboardPage.getCourseCardBtnThenClick(courses.ilc_filter_01_name)
        LEFilterMenu.getShortWait()
        cy.get(LECourseLessonPlayerPage.getLEWaitSpinner(), {timeout:10000}).should('not.exist')
        cy.get(LECourseDetailsILCModule.getOverflowMenuBtn()).should('not.exist')
        cy.get(LEDashboardPage.getNavMenu()).click() 
        LESideMenu.getLEMenuItemsByNameThenClick('Catalog')
        LEFilterMenu.SearchForCourseByName(courses.ilc_filter_01_name)
        LEFilterMenu.getMediumWait()
        cy.get(LEDashboardPage.getCourseCardName()).should('exist')
    })

    it('Enroll in an ILC from Learner side to be set to Not Completed by Admin', () => {
        LEFilterMenu.SearchForCourseByName(courses.ilc_03_learner_unenroll_name)
        LEFilterMenu.getMediumWait()
        LEDashboardPage.getCourseCardBtnThenClick(courses.ilc_03_learner_unenroll_name)
        LEFilterMenu.getMediumWait()
        cy.get(LECourseDetailsILCModule.getSessionContainer()).within(()=>{
            cy.get(LECourseDetailsILCModule.getEnrollBtn()).click()
            cy.get(LECourseLessonPlayerPage.getLEWaitSpinner(), {timeout:10000}).should('not.exist')
        })  
    })
})


describe('LE - Course Activity - Learner Un-enroll - ILC Ineligible - Admin Side 2', () => {


    it('Admin - set ILC Enrollment to Not Completed', () => { 
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getUserEnrollmentsReport()
        cy.wrap(arEnrollUsersPage.EnrollmentPageFilter(userDetails.username))
        cy.wrap(arEnrollUsersPage.selectTableCellRecordByIndexAndName(courses.ilc_03_learner_unenroll_name, 2))
        cy.wrap(arEnrollUsersPage.WaitForElementStateToChange(arEnrollUsersPage.getAddEditMenuActionsByName('Edit Enrollment')), 1000)
        cy.get(arEnrollUsersPage.getAddEditMenuActionsByName('Edit Enrollment')).should('have.attr','aria-disabled','false').click()
        cy.wrap(arEditActivityPage.getMarkEnrollmentAsRadioBtn('Not Completed'))
        cy.wrap(arEnrollUsersPage.WaitForElementStateToChange(arEnrollUsersPage.getSaveBtn()), 1000)
        cy.get(arEnrollUsersPage.getSaveBtn()).click() 
    })
})

describe('LE - Course Activity - Learner Un-enroll - ILC - Ineligible Criteria', function () {


    after(function() {
        //Cleanup - Get userID, logout, and delete them
        cy.get(LEDashboardPage.getNavProfile()).click()  
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
        cy.url().then((currentURL) => {
            cy.deleteUser(currentURL.slice(-36));
    })
})
    beforeEach(() => {
        //Login and go to the course before each test
        cy.learnerLoginThruDashboardPage(userDetails.username, userDetails.validPassword)
        cy.get(LEDashboardPage.getNavMenu()).click() 
        LESideMenu.getLEMenuItemsByNameThenClick('Catalog')
    })

    it('Verify a user cannot Unenroll from an ILC in the Not Completed status', () => {
        LEFilterMenu.SearchForCourseByName(courses.ilc_03_learner_unenroll_name)
        LEFilterMenu.getMediumWait()
        LEDashboardPage.getCourseCardBtnThenClick(courses.ilc_03_learner_unenroll_name)
        LEFilterMenu.getShortWait()
        cy.get(LECourseLessonPlayerPage.getLEWaitSpinner(), {timeout:10000}).should('not.exist')
        cy.get(LECourseDetailsILCModule.getOverflowMenuBtn()).should('not.exist')
        cy.get(LEDashboardPage.getNavMenu()).click() 
        LESideMenu.getLEMenuItemsByNameThenClick('Catalog')
        LEFilterMenu.SearchForCourseByName(courses.ilc_03_learner_unenroll_name)
        LEFilterMenu.getMediumWait()
        cy.get(LEDashboardPage.getCourseCardName()).should('exist')
    })
    it('Enroll in an ILC which has Ecomm enabled', () => {
        LEFilterMenu.SearchForCourseByName(courses.ilc_ecomm_01_name)
        LEFilterMenu.getMediumWait()
        LEDashboardPage.getSpecificCourseCardBtnThenClick(courses.ilc_ecomm_01_name)
        // LEFilterMenu.getShortWait()
        // cy.get(LECourseDetailsModal.getTabByName('Sessions')).click()
        // LEFilterMenu.getShortWait()
        LESelectILCSession.getSessionByNameAndAddToCart(courses.ilc_ecomm_01_session_name)
        LEDashboardPage.getShortWait()
        // cy.get(LESelectILCSession.getModalCloseBtn()).click()
        // cy.get(LEDashboardPage.getNavShoppingCart()).click()
        // cy.get(LEShoppingMenu.getViewShoppingCart()).click()
        cy.get(LEShoppingPage.getCheckoutBtn()).should('be.visible').click()
        LEAccountPage.getShortWait()
        cy.get(LEAccountPage.getCheckoutBtn()).should('be.visible').click()
        cy.get(LEAccountPage.getProceedToCheckoutBtn()).click()

        //Select payment option of CCard and proceed
        LEPaymentPage.getPaymentOptionByNameThenClick('Credit Card')
        cy.get(LEPaymentPage.getProceedToCheckoutBtn()).should('have.attr','role').click()

        // CI test agents run from the USA so if needed, select Canada
        LEPaymentPage.getSelectCanadaAndPCIfInOtherCountry();

        //Fill out credit card info and submit order
        LEPaymentPage.getCCardInfo(ecommFields.creditCardNum, '01', '2040', '111')
        LEPaymentPage.getClickSubmitOrderBtn() 
    })
    
    it('Verify a user cannot Unenroll from an ILC which has Ecomm enabled', () => {
        LEFilterMenu.SearchForCourseByName(courses.ilc_ecomm_01_name)
        LEFilterMenu.getMediumWait()
        LEDashboardPage.getCourseCardBtnThenClick(courses.ilc_ecomm_01_name)
        LEFilterMenu.getShortWait()
        cy.get(LECourseLessonPlayerPage.getLEWaitSpinner(), {timeout:10000}).should('not.exist')
        cy.get(LECourseDetailsILCModule.getOverflowMenuBtn()).should('not.exist')
        cy.get(LEDashboardPage.getNavMenu()).click() 
        LESideMenu.getLEMenuItemsByNameThenClick('Catalog')
        LEFilterMenu.SearchForCourseByName(courses.ilc_ecomm_01_name)
        LEFilterMenu.getMediumWait()
        cy.get(LEDashboardPage.getCourseCardName()).should('exist')
    })
})
