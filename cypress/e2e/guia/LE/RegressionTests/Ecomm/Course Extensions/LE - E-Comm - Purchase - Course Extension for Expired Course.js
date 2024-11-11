import dayjs from "dayjs";
import users from '../../../../../../fixtures/users.json'
import courses from '../../../../../../fixtures/courses.json'
import DefaultTestData from '../../../../../../fixtures/defaultTestData.json'
import LEProfilePage from '../../../../../../../helpers/LE/pageObjects/User/LEProfilePage'
import LEDashboardPage from '../../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LECoursesPage from '../../../../../../../helpers/LE/pageObjects/Courses/LECoursesPage'
import LEShoppingMenu from '../../../../../../../helpers/LE/pageObjects/Menu/LEShoppingMenu'
import LEShoppingPage from '../../../../../../../helpers/LE/pageObjects/ECommerce/LEShoppingPage'
import LEAccountPage from '../../../../../../../helpers/LE/pageObjects/ECommerce/LEAccountPage'
import LEPaymentPage from '../../../../../../../helpers/LE/pageObjects/ECommerce/LEPaymentPage'
import LECourseDetailsOCModule from '../../../../../../../helpers/LE/pageObjects/Courses/LECourseDetailsOCModule'
import ARSelectLearningObjectModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARSelectLearningObjectModal'
import ARAddESignatureLessonModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARAddESigntureLessonModal'
import ARCourseSettingsEnrollmentRulesModule from '../../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
import ARCourseSettingsAvailabilityModule from '../../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsAvailability.module'
import arAddMoreCourseSettingsModule from '../../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import arDashboardPage from '../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arCoursesPage from '../../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import AROCAddEditPage from '../../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage'
import arEnrollUsersPage from '../../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage'

let timestamp = LEDashboardPage.getTimeStamp()
let timestamp2 = dayjs(timestamp).subtract(1, 'day') //Original Expiration Date
let timestamp3 = String(dayjs(timestamp).add(3, 'day')) //Expiration Date after 3 Day Extension
let username = "GUIA-ECOMM-USER- " + timestamp
const CED_OC_NAME = 'GUIA - CED - OC - ' + timestamp;
const CED_OC_ESIG_NAME = 'GUIA OC E-Signature';
let userID, courseID;

describe('LE - E-Comm - Purchase - Course Extension for Expired Course - Create Course', function(){

    before(function() {
        //Create a new user
        cy.createUser(void 0, username, ["Learner"], void 0)
    })

    beforeEach(() => {
        cy.apiLoginWithSession(users.sysAdmin.ADMIN_SYS_01_USERNAME, users.sysAdmin.ADMIN_SYS_01_PASSWORD, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        
    })

    it('Create OC with Course Extension', () => { 
        cy.createCourse('Online Course', CED_OC_NAME)

        //Add E-Signature Object
        cy.get(AROCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
        ARSelectLearningObjectModal.getObjectTypeByName('E-Signature')
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()
        cy.get(ARAddESignatureLessonModal.getNameTxtF()).clear().type(CED_OC_ESIG_NAME)
        cy.get(ARAddESignatureLessonModal.getSaveBtn()).click()
        arCoursesPage.getLShortWait()

        //Open Enrollment Rules
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        AROCAddEditPage.getShortWait()
        //Enable E-Commerce and add price and extension
        cy.get(AROCAddEditPage.getElementByDataNameAttribute(ARCourseSettingsEnrollmentRulesModule.getEnableEcommToggleContainer()) + ' ' + AROCAddEditPage.getToggleEnabled()).click()
        AROCAddEditPage.getShortWait()
        cy.get(ARCourseSettingsEnrollmentRulesModule.getDefaultPriceTxtF()).clear().type('0')
        cy.get(ARCourseSettingsEnrollmentRulesModule.getAddExtensionBtn()).click()
        cy.get(arCoursesPage.getElementByDataNameAttributeAndIndex(ARCourseSettingsEnrollmentRulesModule.getExtensionGroup(), 0) + ' ' +
             ARCourseSettingsEnrollmentRulesModule.getExtensionDaysTxtF()).type('3')
        cy.get(arCoursesPage.getElementByDataNameAttributeAndIndex(ARCourseSettingsEnrollmentRulesModule.getExtensionGroup(), 0) + ' ' +
             ARCourseSettingsEnrollmentRulesModule.getExtensionPriceTxtF()).type(courses.COURSE_PRICE_15)
        arCoursesPage.getVShortWait()

        //Publish OC
        cy.publishCourseAndReturnId().then((id) => {
            courseID = id.request.url.slice(-36)
        })
    })

    it('Enroll Learner in Course', () => { 
        arEnrollUsersPage.getEnrollUserByCourseAndUsername([CED_OC_NAME], [username])
    })

    it('Edit Course and Set Expiration 1 Day in the Past', () => {
        cy.editCourse(CED_OC_NAME)
        AROCAddEditPage.getMediumWait()
        //Add Expiration Date for Previous Day
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Availability')).click()
        AROCAddEditPage.getShortWait()
        cy.get(ARCourseSettingsAvailabilityModule.getExpirationRadioBtn()).contains('Date').click().click()
        cy.get(ARCourseSettingsAvailabilityModule.getDateExpiresDatePickerBtn()).click()
        ARCourseSettingsAvailabilityModule.getSelectDate(timestamp2.format().slice(0,10))
        cy.get(ARCourseSettingsAvailabilityModule.getDateExpiresTimePickerBtn()).click()
        ARCourseSettingsAvailabilityModule.SelectTime('12', '00', 'PM')
        arCoursesPage.getVShortWait()
        //Publish OC
        cy.publishCourse()
    })
})

describe('LE - E-Comm - Purchase - Course Extension for Expired Course', function(){
    
    beforeEach(() => {
        //Login and navigate to course before each test
        cy.apiLoginWithSession(username, DefaultTestData.USER_PASSWORD)
        LEDashboardPage.getTileByNameThenClick('My Courses') 
        cy.get(LEDashboardPage.getCourseCardName()).contains(CED_OC_NAME).click()
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

    it('Verify Expired Course Content is Unavailable and Purchase Course Extension', () => { 
        //Verify Expiration Banner
        LECoursesPage.getVerifyExpirationDate(timestamp2)

        //Verify Lesson Content Cannot be Started
        cy.get(LECourseDetailsOCModule.getLessonName()).contains(CED_OC_ESIG_NAME).parents(LECourseDetailsOCModule.getLessonHeader()).within(() => {
            cy.get(LECourseDetailsOCModule.getLessonBtn()).should('not.exist')
        })

        //Purchase Extension
        cy.get(LECoursesPage.getAddExtensionToCartBtn()).should('contain', courses.COURSE_PRICE_15).click()
        LEDashboardPage.getLShortWait()
        //Go to Cart and Checkout
        cy.get(LEDashboardPage.getNavShoppingCart()).click()
        cy.get(LEShoppingMenu.getViewShoppingCart()).click()
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
        LEDashboardPage.getShortWait()
    })

    it('Verify Course Content is Available After Extension Was Purchased', () => { 
        
        //Verify Expiration Banner
        LECoursesPage.getVerifyExpirationDate(timestamp3)
         
        //Verify Lesson Content Can now be Started
        LECourseDetailsOCModule.getCourseLessonActionBtn(CED_OC_ESIG_NAME, 'Start')


    })
})

    




