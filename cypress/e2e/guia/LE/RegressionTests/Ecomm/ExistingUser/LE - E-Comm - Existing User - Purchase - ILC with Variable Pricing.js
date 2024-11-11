import users from '../../../../../../fixtures/users.json'
import courses from '../../../../../../fixtures/courses.json'
import departments from '../../../../../../fixtures/departments.json'
import DefaultTestData from '../../../../../../fixtures/defaultTestData.json'
import LEDashboardPage from '../../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LEFilterMenu from '../../../../../../../helpers/LE/pageObjects/Menu/LEFilterMenu'
import LEProfilePage from '../../../../../../../helpers/LE/pageObjects/User/LEProfilePage'
import LEShoppingMenu from '../../../../../../../helpers/LE/pageObjects/Menu/LEShoppingMenu'
import LEShoppingPage from '../../../../../../../helpers/LE/pageObjects/ECommerce/LEShoppingPage'
import LESelectILCSession from '../../../../../../../helpers/LE/pageObjects/Modals/LESelectILCSession.modal'
import arDashboardPage from '../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arAddMoreCourseSettingsModule from '../../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import ARCourseSettingsEnrollmentRulesModule from '../../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
import arCoursesPage from '../../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import ARILCAddEditPage from '../../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage'
import ARSelectModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import { sessions } from '../../../../../../../helpers/TestData/Courses/ilc'

let timestamp = arDashboardPage.getTimeStamp()
const CED_ILC_NAME = 'GUIA - VARIABLE - ILC - ' + timestamp;
const username1 = 'TOP-DEPT-USER-' + timestamp;
const username2 = 'SUB-DEPT-USER-' + timestamp;
let prices = [courses.COURSE_PRICE_20, courses.COURSE_PRICE_20, courses.COURSE_PRICE_25]
let departmentNames = ['Public', departments.DEPT_TOP_NAME, departments.SUB_DEPT_A_NAME]
let userNames = ['public', username1, username2];
let userIds = [];
let courseID;

describe('LE - E-Comm - Existing User - Purchase - ILC with Variable Pricing - Create Course', function(){

    it('Create ILC Course with Variable Price Rules & Publish', () => {
        cy.loginAdmin(users.sysAdmin.ADMIN_SYS_01_USERNAME, users.sysAdmin.ADMIN_SYS_01_PASSWORD)
        arCoursesPage.getAddInstructorLed()
        cy.get(ARILCAddEditPage.getGeneralTitleTxtF()).clear().type(CED_ILC_NAME)
        cy.get(ARILCAddEditPage.getGeneralStatusToggleContainer() + ARILCAddEditPage.getToggleDisabled()).click()
        cy.get(ARILCAddEditPage.getAddSessionBtn()).click()

        //Set Valid Title
        cy.get(ARILCAddEditPage.getSessionDetailsTitleTxtF()).should('have.attr', 'aria-invalid', 'false').clear().type(sessions.sessionName_1)
        //Set Valid Description
        cy.get(ARILCAddEditPage.getSessionDetailsDescriptionTxtF()).clear()
        cy.get(ARILCAddEditPage.getSessionDetailsDescriptionTxtF()).type('GUIA Session Description')

        //Verify Class Start/End Date and Time Cannot be Empty
        ARILCAddEditPage.getStartDatePickerBtnThenClick()
        ARILCAddEditPage.getSelectDate(sessions.date1) //Need to select a date before the clear btn will work
        ARILCAddEditPage.getEndDatePickerBtnThenClick()
        ARILCAddEditPage.getSelectDate(sessions.date1)
        
        
        //Expand Self Enrollment and Add Self Enrollment Rule
        cy.get(arCoursesPage.getElementByAriaLabelAttribute(ARILCAddEditPage.getExpandEnrollmentRulesBtn())).click()
        cy.get(ARILCAddEditPage.getAllowSelfEnrollmentRadioBtn()).contains('All Learners').click()
        
        //Save ILC Session
        cy.get(ARILCAddEditPage.getAddEditSessionSaveBtn()).click()
        ARILCAddEditPage.getMediumWait()


        //Set All Learner Enrollment Rule
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        ARILCAddEditPage.getShortWait()
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')

        //Enable E-Commerce
        cy.get(ARILCAddEditPage.getElementByDataNameAttribute(ARCourseSettingsEnrollmentRulesModule.getEnableEcommToggleContainer()) + ' '
             + ARILCAddEditPage.getToggleEnabled()).click()
             ARILCAddEditPage.getVShortWait()
        //Allow Public Purchase
        cy.get(ARILCAddEditPage.getElementByDataNameAttribute(ARCourseSettingsEnrollmentRulesModule.getEnablePublicPurchaseContainer()) + ' '
             + ARILCAddEditPage.getToggleEnabled()).click()

        //Set Default Price
        cy.get(ARCourseSettingsEnrollmentRulesModule.getDefaultPriceTxtF()).clear().type(prices[0])

        //Add Variable Price Groups
        for (let i = 1; i < prices.length; i++) {
            cy.get(ARCourseSettingsEnrollmentRulesModule.getAddVariablePriceBtn()).click()
            cy.get(arCoursesPage.getElementByDataNameAttributeAndIndex(ARCourseSettingsEnrollmentRulesModule.getVariablePriceGroup(), i-1) + ' ' +
                 ARCourseSettingsEnrollmentRulesModule.getVariablePriceDeptBtn()).click()
            ARSelectModal.SearchAndSelectFunction([departmentNames[i]])
            cy.get(arCoursesPage.getElementByDataNameAttributeAndIndex(ARCourseSettingsEnrollmentRulesModule.getVariablePriceGroup(), i-1) + ' ' +
                 ARCourseSettingsEnrollmentRulesModule.getVariablePriceTxtF()).type(prices[i])
        }

        //Publish course
        cy.publishCourseAndReturnId().then((id) => {
            courseID = id.request.url.slice(-36)
        })
    })
})

describe('LE - E-Comm - Existing User - Purchase - ILC with Variable Pricing', function(){

    before(function() {
        //Create Learner in Top Dept and Sub Dept A
        cy.createUser(void 0, username1, ["Learner"], void 0)  //Top Dept
        cy.createUser(Cypress.env('subDEPT_A_ID'), username2, ["Learner"], void 0)  //Sub Dept
    })

    after(function() {
        //Cleanup - Delete Course and Users
        cy.deleteCourse(courseID, 'instructor-led-courses-new')
        for (let i = 0; i < userIds.length; i++) {
            cy.deleteUser(userIds[i])
        }
    })

    for (let i = 0; i < userNames.length; i++) {
        it(`Verify Variable Price for Learner in ${departmentNames[i]} Department`, () => {
            if (userNames[i] === 'public') { //Check Course for Public User
                cy.visit("/#/catalog")
            } else {
                cy.learnerLoginThruDashboardPage(userNames[i], DefaultTestData.USER_PASSWORD)
                LEDashboardPage.getTileByNameThenClick('Catalog')
            }
            //Add Course to Cart
            LEFilterMenu.SearchForCourseByName(CED_ILC_NAME)
            LEDashboardPage.getMediumWait()
            LEDashboardPage.getCourseCardBtnThenClick(CED_ILC_NAME)
            LESelectILCSession.getSessionByNameAndAddToCart(sessions.sessionName_1)
            LEDashboardPage.getMediumWait()
            cy.get(LESelectILCSession.getModalCloseBtn()).click()

            //Verify Course Price in Cart
            cy.get(LEDashboardPage.getNavShoppingCart()).click()
            cy.get(LEShoppingMenu.getViewShoppingCart()).click()
            cy.get(LEShoppingPage.getTotalPrice()).should('contain.text', prices[i])

            if (userNames[i] != 'public') { //Get userID for non-public users
                cy.get(LEDashboardPage.getNavProfile()).click()  
                cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
                cy.url().then((currentURL) => {
                    userIds.push(currentURL.slice(48));
                })
            }
        })
    }
})