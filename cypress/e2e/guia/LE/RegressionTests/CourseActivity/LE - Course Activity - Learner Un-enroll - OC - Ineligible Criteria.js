import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LESideMenu from '../../../../../../helpers/LE/pageObjects/Menu/LESideMenu'
import LEProfilePage from '../../../../../../helpers/LE/pageObjects/User/LEProfilePage'
import LECourseLessonPlayerPage from '../../../../../../helpers/LE/pageObjects/Courses/LECourseLessonPlayerPage'
import LECourseDetailsOCModule from '../../../../../../helpers/LE/pageObjects/Courses/LECourseDetailsOCModule'
import LEFilterMenu from '../../../../../../helpers/LE/pageObjects/Menu/LEFilterMenu'
import LEShoppingPage from '../../../../../../helpers/LE/pageObjects/ECommerce/LEShoppingPage'
import LEInvoicePage from '../../../../../../helpers/LE/pageObjects/ECommerce/LEInvoicePage'
import LEAccountPage from '../../../../../../helpers/LE/pageObjects/ECommerce/LEAccountPage'
import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arEnrollUsersPage from '../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage'
import arUserPage from '../../../../../../helpers/AR/pageObjects/User/ARUserPage'
import arEditActivityPage from '../../../../../../helpers/AR/pageObjects/Enrollment/AREditActivityPage'
import arSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import { userDetails, ecommFields } from '../../../../../../helpers/TestData/users/UserDetails'
import { users } from '../../../../../../helpers/TestData/users/users'
import { courses } from "../../../../../../helpers/TestData/Courses/courses";

describe('LE - Course Activity - Learner Un-enroll - OC - Admin Side', function(){

    before(function () {
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
    })

    beforeEach(function() {        
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getUserEnrollmentsReport()
        cy.wrap(arEnrollUsersPage.EnrollmentPageFilter(userDetails.username))
    })
    it('Admin - Enroll in OC via Admin', () => {
        cy.wrap(arEnrollUsersPage.WaitForElementStateToChange(arEnrollUsersPage.getAddEditMenuActionsByName('Add Enrollment')), 1000)
        cy.get(arEnrollUsersPage.getAddEditMenuActionsByName('Add Enrollment')).should('have.attr','aria-disabled','false').click()
        cy.get(arUserPage.getElementByDataNameAttribute(arEnrollUsersPage.getEnrollUsersAddCourseBtn())).click()
        cy.wrap(arSelectModal.SearchAndSelectFunction([courses.oc_filter_03_name]))
        cy.wrap(arEnrollUsersPage.WaitForElementStateToChange(arEnrollUsersPage.getSaveBtn()), 1000)
        cy.get(arEnrollUsersPage.getSaveBtn()).click()
        cy.get(arDashboardPage.getToastSuccessMsg()).should('be.visible') 
    })

})

describe('LE - Course Activity - Learner Un-enroll - OC - Ineligible Criteria', function () {
    beforeEach(() => {
        //Login and go to the course before each test
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        cy.get(LEDashboardPage.getNavMenu()).click() 
        LESideMenu.getLEMenuItemsByNameThenClick('Catalog')
})
it('Verify a user cannot Unenroll from an OC enrolled by Admin', () => {
    LEFilterMenu.SearchForCourseByName(courses.oc_filter_03_name)
    LEFilterMenu.getMediumWait()
    LEDashboardPage.getCourseCardBtnThenClick(courses.oc_filter_03_name)
    LEFilterMenu.getShortWait()
    cy.get(LECourseLessonPlayerPage.getLEWaitSpinner(), {timeout:10000}).should('not.exist')
    cy.get(LECourseDetailsOCModule.getOverflowMenuBtn()).should('not.exist')
    cy.get(LEDashboardPage.getNavMenu()).click() 
    LESideMenu.getLEMenuItemsByNameThenClick('Catalog')
    LEFilterMenu.SearchForCourseByName(courses.oc_filter_03_name)
    LEFilterMenu.getMediumWait()
    cy.get(LEDashboardPage.getCourseCardName()).should('exist')
})
it('Enroll in an OC from Learner side to be set to Not Completed by Admin', () => {
    LEFilterMenu.SearchForCourseByName(courses.oc_01_learner_unenroll_name)
    LEFilterMenu.getMediumWait()
    LEDashboardPage.getCourseCardBtnThenClick(courses.oc_01_learner_unenroll_name)
    LEFilterMenu.getMediumWait()
    LEDashboardPage.getCourseCardBtnThenClick(courses.oc_01_learner_unenroll_name)
    cy.get(LECourseLessonPlayerPage.getLEWaitSpinner(), {timeout:10000}).should('not.exist')
})
})
describe('LE - Course Activity - Learner Un-enroll - OC Ineligible - Admin Side 2', () => {

    it('Admin - set OC Enrollment to Not Completed', () => { 
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getUserEnrollmentsReport()
        cy.wrap(arEnrollUsersPage.EnrollmentPageFilter(userDetails.username))
        cy.wrap(arEnrollUsersPage.selectTableCellRecord(courses.oc_01_learner_unenroll_name))
        cy.wrap(arEnrollUsersPage.WaitForElementStateToChange(arEnrollUsersPage.getAddEditMenuActionsByName('Edit Enrollment')), 1000)
        cy.get(arEnrollUsersPage.getAddEditMenuActionsByName('Edit Enrollment')).should('have.attr','aria-disabled','false').click()
        cy.wrap(arEditActivityPage.getMarkEnrollmentAsRadioBtn('Not Completed'))
        cy.wrap(arEnrollUsersPage.WaitForElementStateToChange(arEnrollUsersPage.getSaveBtn()), 1000)
        cy.get(arEnrollUsersPage.getSaveBtn()).click()
    })
})

describe('LE - Course Activity - Learner Un-enroll - OC - Ineligible Criteria', function () {

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
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        cy.get(LEDashboardPage.getNavMenu()).click() 
        LESideMenu.getLEMenuItemsByNameThenClick('Catalog')
    })

    it('Verify a user cannot Unenroll from an OC in the Not Completed status', () => {

        LEFilterMenu.SearchForCourseByName(courses.oc_01_learner_unenroll_name)
        LEFilterMenu.getMediumWait()
        LEDashboardPage.getCourseCardBtnThenClick(courses.oc_01_learner_unenroll_name)
        LEFilterMenu.getShortWait()
        cy.get(LECourseLessonPlayerPage.getLEWaitSpinner(), {timeout:10000}).should('not.exist')
        cy.get(LECourseDetailsOCModule.getOverflowMenuBtn()).should('not.exist')
        cy.get(LEDashboardPage.getNavMenu()).click() 
        LESideMenu.getLEMenuItemsByNameThenClick('Catalog')

        LEFilterMenu.SearchForCourseByName(courses.oc_01_learner_unenroll_name)
        LEFilterMenu.getMediumWait()
        cy.get(LEDashboardPage.getCourseCardName()).should('exist')
    })
    it('Enroll in an OC which has Ecomm enabled', () => {

        LEFilterMenu.SearchForCourseByName(courses.oc_ecomm_free_course_01_name)
        LEFilterMenu.getMediumWait()
        LEDashboardPage.getCourseCardBtnThenClick(courses.oc_ecomm_free_course_01_name)
        LEFilterMenu.getShortWait()
        LEDashboardPage.getCourseCardBtnThenClick(courses.oc_ecomm_free_course_01_name)
        cy.get(LEShoppingPage.getCheckoutBtn()).should('be.visible').click()
        LEAccountPage.getShortWait()
        cy.get(LEAccountPage.getCheckoutBtn()).should('be.visible').click()
        cy.get(LEAccountPage.getProceedToCheckoutBtn()).click()
        cy.get(LEInvoicePage.getOrderCompletedHeader()).should('contain', 'Order Completed!')
        
    })
    
    it('Verify a user cannot Unenroll from an OC which has Ecomm enabled', () => {

        LEFilterMenu.SearchForCourseByName(courses.oc_ecomm_free_course_01_name)
        LEFilterMenu.getMediumWait()
        LEDashboardPage.getCourseCardBtnThenClick(courses.oc_ecomm_free_course_01_name)
        LEFilterMenu.getShortWait()
        cy.get(LECourseLessonPlayerPage.getLEWaitSpinner(), {timeout:10000}).should('not.exist')
        cy.get(LECourseDetailsOCModule.getOverflowMenuBtn()).should('not.exist')
        cy.get(LEDashboardPage.getNavMenu()).click() 
        LESideMenu.getLEMenuItemsByNameThenClick('Catalog')

        LEFilterMenu.SearchForCourseByName(courses.oc_ecomm_free_course_01_name)
        LEFilterMenu.getMediumWait()
        cy.get(LEDashboardPage.getCourseCardName()).should('exist')
    })

    it('Verify a user cannot Unenroll from an OC which is set to Mandatory', () => {

        LEFilterMenu.SearchForCourseByName(courses.oc_01_mandatory_name)
        LEFilterMenu.getMediumWait()
        LEDashboardPage.getCourseCardBtnThenClick(courses.oc_01_mandatory_name)
        LEFilterMenu.getShortWait()
        LEDashboardPage.getCourseCardBtnThenClick(courses.oc_01_mandatory_name)
        cy.get(LECourseLessonPlayerPage.getLEWaitSpinner(), {timeout:10000}).should('not.exist')
        cy.get(LECourseDetailsOCModule.getOverflowMenuBtn()).should('not.exist')
        cy.get(LEDashboardPage.getNavMenu()).click() 
        LESideMenu.getLEMenuItemsByNameThenClick('Catalog')

        LEFilterMenu.SearchForCourseByName(courses.oc_01_mandatory_name)
        LEFilterMenu.getMediumWait()
        cy.get(LEDashboardPage.getCourseCardName()).should('exist')
    })
})
