// AR - CED - OC - Availability Section.js
import { users } from '../../../../../../helpers/TestData/users/users'
import { userDetails } from '../../../../../../helpers/TestData/users/UserDetails'
import DefaultTestData from '../../../../../fixtures/defaultTestData.json'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { ocDetails, eSignature, availabilitySection } from '../../../../../../helpers/TestData/Courses/oc'
import LEProfilePage from '../../../../../../helpers/LE/pageObjects/User/LEProfilePage'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LECoursesPage from '../../../../../../helpers/LE/pageObjects/Courses/LECoursesPage'
import LECourseDetailsOCModule from '../../../../../../helpers/LE/pageObjects/Courses/LECourseDetailsOCModule'
import ARCourseSettingsAvailabilityModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsAvailability.module'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import ARCourseSettingsEnrollmentRulesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
import ARAddESignatureLessonModal from '../../../../../../helpers/AR/pageObjects/Modals/ARAddESigntureLessonModal'
import ARSelectLearningObjectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectLearningObjectModal'
import arCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import AROCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage'
import arEnrollUsersPage from '../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage'
import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'


describe('LE - Course Activity - Course Availability - Expiration', function(){

    before(function () {
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0);
        //Signin with system admin and turn off next gen toggle
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        LEDashboardPage.turnOffNextgenToggle()
    });

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getCoursesReport()
    })

    it('Add New OC with Expiration Time From Enrollment Option and Publish OC', () => {
        cy.createCourse('Online Course', ocDetails.courseName)
        //Add E-Signature Object
        cy.get(AROCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
        ARSelectLearningObjectModal.getObjectTypeByName('E-Signature')
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()
        cy.get(ARAddESignatureLessonModal.getNameTxtF()).clear().type(eSignature.eSignatureName)
        cy.get(ARAddESignatureLessonModal.getSaveBtn()).click()
        arCoursesPage.getLShortWait()

        //Open Availability Section
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Availability')).click()
        AROCAddEditPage.getShortWait()

        //Select Expiration 'Time from enrollment' Option
        cy.get(ARCourseSettingsAvailabilityModule.getExpirationRadioBtn()).contains('Time from enrollment').click().click()
        //Set Expiration to 2 days
        cy.get(ARCourseSettingsAvailabilityModule.getExpireInDaysTxtF()).type('2')

        //Open Enrollment Rules
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        AROCAddEditPage.getShortWait()

        //Select Allow Self Enrollment Specific Radio Button
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')

        //Publish OC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36))
        })
    })

    it('Add new OC with Expiration Date Option and Publish OC', () => {
        cy.createCourse('Online Course', ocDetails.courseName2)
        //Add E-Signature Object
        cy.get(AROCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
        ARSelectLearningObjectModal.getObjectTypeByName('E-Signature')
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()
        cy.get(ARAddESignatureLessonModal.getNameTxtF()).clear().type(eSignature.eSignatureName)
        cy.get(ARAddESignatureLessonModal.getSaveBtn()).click()
        arCoursesPage.getLShortWait()

        //Open Availability Section
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Availability')).click()
        AROCAddEditPage.getShortWait()

        //Select Expiration 'Date' Option
        cy.get(ARCourseSettingsAvailabilityModule.getExpirationRadioBtn()).contains('Date').click().click()
        //Select a Date and Time
        cy.get(ARCourseSettingsAvailabilityModule.getDateExpiresDatePickerBtn()).click()
        ARCourseSettingsAvailabilityModule.getSelectDate(availabilitySection.Date)
        cy.get(ARCourseSettingsAvailabilityModule.getDateExpiresTimePickerBtn()).click()
        ARCourseSettingsAvailabilityModule.SelectTime('12', '00', 'PM')
        
        //Open Enrollment Rules
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        AROCAddEditPage.getShortWait()

        //Select Allow Self Enrollment Specific Radio Button
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')

        //Publish OC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36))
        })

        //Enroll User
        arEnrollUsersPage.getEnrollUserByCourseAndUsername([ocDetails.courseName, ocDetails.courseName2], [userDetails.username])
    })
        
})

describe('LE - Course Activity - Course Availability - Expiration Date', function(){
    
    beforeEach(() => {
        //Login and navigate to course before each test
        cy.apiLoginWithSession(userDetails.username, DefaultTestData.USER_PASSWORD)
        LEDashboardPage.getTileByNameThenClick('My Courses')
        cy.get(LEDashboardPage.getLEEllipsesLoader(), {timeout: 15000}).should('not.exist')
    })

    after(function() {
        //Cleanup - delete learner and course
        for (let i = 0; i < commonDetails.courseIDs.length; i++) {
            cy.deleteCourse(commonDetails.courseIDs[i]);  
        }
        cy.get(LEDashboardPage.getNavProfile()).click()  
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
        cy.url().then((currentURL) => {
            userDetails.userID = currentURL.slice(-36);
            cy.deleteUser(userDetails.userID);
        })
    })

    it('Verify for Time From Enrollment Expiry Option, banner appears for 2 day course Expiry and Lesson Content can be started', () => { 
        cy.get(LEDashboardPage.getCourseCardName()).contains(ocDetails.courseName).click()
       
        //Verify Expiration Banner
        LECoursesPage.getVerifyExpirationDate(availabilitySection.Date)
        //Verify Lesson Content Can be started
        cy.get(LECourseDetailsOCModule.getLessonName()).contains(eSignature.eSignatureName).parents(LECourseDetailsOCModule.getLessonHeader()).within(() => {
            cy.get(LECourseDetailsOCModule.getLessonBtn()).should('exist')
        })
    })
    it('Verify for Date Expiry Option, banner appears for 2 day course Expiry and Lesson Content can be started', () => { 
        cy.get(LEDashboardPage.getCourseCardName()).contains(ocDetails.courseName2).click()
       
        //Verify Expiration Banner
        LECoursesPage.getVerifyExpirationDate(availabilitySection.Date)
        //Verify Lesson Content Can be started
        cy.get(LECourseDetailsOCModule.getLessonName()).contains(eSignature.eSignatureName).parents(LECourseDetailsOCModule.getLessonHeader()).within(() => {
            cy.get(LECourseDetailsOCModule.getLessonBtn()).should('exist')
        })
    })
})