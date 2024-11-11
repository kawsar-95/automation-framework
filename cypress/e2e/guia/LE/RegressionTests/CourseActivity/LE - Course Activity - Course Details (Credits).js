import LEProfilePage from '../../../../../../helpers/LE/pageObjects/User/LEProfilePage'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LEFilterMenu from '../../../../../../helpers/LE/pageObjects/Menu/LEFilterMenu'
import LESideMenu from '../../../../../../helpers/LE/pageObjects/Menu/LESideMenu'
import LECourseDetailsModal from '../../../../../../helpers/LE/pageObjects/Modals/LECourseDetails.modal'
import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arOCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage'
import ARAddObjectLessonModal from '../../../../../../helpers/AR/pageObjects/Modals/ARAddObjectLessonModal'
import ARSelectLearningObjectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectLearningObjectModal'
import ARSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import ARCourseSettingsEnrollmentRulesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
import ARCourseSettingsCompletionModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCompletion.module'
import ARCourseSettingsAvailabilityModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsAvailability.module'
import { userDetails } from '../../../../../../helpers/TestData/users/UserDetails'
import { users } from '../../../../../../helpers/TestData/users/users'
import { ocDetails, lessonObjects } from '../../../../../../helpers/TestData/Courses/oc'
import { currDetails } from '../../../../../../helpers/TestData/Courses/curr'
import { commonDetails, credit } from '../../../../../../helpers/TestData/Courses/commonDetails'
import LEManageTemplateCoursesPage from '../../../../../../helpers/LE/pageObjects/Template/LEManageTemplateCoursesPage'

let courseTypes = ['online-courses', 'curricula']

describe('LE - Course Activity - Course Details (Credits) - Admin Side', function(){

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getCoursesReport()
    })

    it('Admin - Create New OC Course and Add Credits', () => { 
        cy.createCourse('Online Course',ocDetails.courseName)

        //Add learning object
        cy.get(arOCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
        ARSelectLearningObjectModal.getObjectTypeByName('Object')
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()
        ARAddObjectLessonModal.getAddBasicObjectLesson(lessonObjects.objectName, 'Url')
        LEDashboardPage.getShortWait()
        
        //Set enrollment rules 
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        LEDashboardPage.getVShortWait() //Wait for buttons to become enabled
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')

        //Set completion settings
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Completion')).click()
        LEDashboardPage.getShortWait()
        cy.get(ARCourseSettingsCompletionModule.getAddCreditBtn()).click()
        cy.get(ARCourseSettingsCompletionModule.getCreditTypeDDown()).click()
        cy.get(ARCourseSettingsCompletionModule.getAllCreditTypeOptions()).contains('General').click()
        cy.get(arOCAddEditPage.getElementByAriaLabelAttribute(ARCourseSettingsCompletionModule.getVariableCreditAmountTxt())).clear().type(credit.credit1)

        //Publish course
        LEDashboardPage.getShortWait()
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36))
        })
    })

    it('Admin - Create New Curriculum Course and Enable Terms & Conditions', () => { 
        cy.createCourse('Curriculum')
        cy.get(ARSelectModal.getCancelBtn()).click()

        //Set availability rules
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Availability')).click()
        LEDashboardPage.getVShortWait()
        cy.get(ARCourseSettingsAvailabilityModule.getAddPrerequisiteBtn()).click()
        cy.get(ARCourseSettingsAvailabilityModule.getPrerequisiteCourseDDown()).click()
        LEDashboardPage.getVShortWait()
        cy.get(ARCourseSettingsAvailabilityModule.getPrerequisiteCourseSearchTxtF()).type(ocDetails.courseName)
        ARCourseSettingsAvailabilityModule.getPrerequisiteCourseOpt(ocDetails.courseName)

        //Set enrollment rules
        LEDashboardPage.getShortWait() 
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        LEDashboardPage.getVShortWait()
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')

        //Set completion settings
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Completion')).click()
        LEDashboardPage.getShortWait()
        cy.get(ARCourseSettingsCompletionModule.getAddCreditBtn()).click()
        cy.get(ARCourseSettingsCompletionModule.getCreditTypeDDown()).click()
        cy.get(ARCourseSettingsCompletionModule.getAllCreditTypeOptions()).contains('General').click()
        //Verify credit value field only accepts numbers (value resets to 0 after letters have been entered)
        cy.get(LEDashboardPage.getElementByAriaLabelAttribute(ARCourseSettingsCompletionModule.getCreditAmountTxt())).type('abc').blur()
        cy.get(LEDashboardPage.getElementByAriaLabelAttribute(ARCourseSettingsCompletionModule.getCreditAmountTxt())).should('have.value', '0')
        LEDashboardPage.getVShortWait()
        //Verify error message is displayed if credit value field is left blank
        cy.get(LEDashboardPage.getElementByAriaLabelAttribute(ARCourseSettingsCompletionModule.getCreditAmountTxt())).clear()
        LEDashboardPage.getVShortWait()
        cy.get(ARCourseSettingsCompletionModule.getCreditAmountErrorMsg()).should('contain', 'Field is required.')
        cy.get(arOCAddEditPage.getElementByAriaLabelAttribute(ARCourseSettingsCompletionModule.getVariableCreditAmountTxt())).type(credit.credit2)

        //Publish course
        LEDashboardPage.getShortWait()
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36))
        })
    })
})

describe('LE - Course Activity - Course Details (Credits)', function(){

    before(function() {
        //Create a new user
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password)
        LEManageTemplateCoursesPage.turnOnOffEnablePreEnrollmentToggleBtn('true')
    })

    beforeEach(() => {
        //Sign in, navigate to catalog
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        LEDashboardPage.getTileByNameThenClick('Catalog')
    })

    after(function() {
        //Delete all courses
        for (let i = commonDetails.courseIDs.length-1; i > 0; i--) {
            cy.deleteCourse(commonDetails.courseIDs[i], courseTypes[i])
        }
        //Cleanup - Delete courses and user
        cy.get(LEDashboardPage.getNavProfile()).click()  
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
        cy.url().then((currentURL) => {
            cy.deleteUser(currentURL.slice(-36));
        })
    })

    it('Search for OC Course and Verify Available Credits', () => { 
        LEFilterMenu.SearchForCourseByName(ocDetails.courseName)
        LEDashboardPage.getVLongWait()
        cy.get(LEDashboardPage.getCourseCardName()).contains(ocDetails.courseName).click()
        cy.get(LECourseDetailsModal.getCourseCredits()).should('contain', credit.credit1)
    })

    it('Search for Curriculum Course and Verify Available Credits', () => { 
        LEFilterMenu.SearchForCourseByName(currDetails.courseName)
        LEDashboardPage.getVLongWait()
        cy.get(LEDashboardPage.getCourseCardName()).contains(currDetails.courseName).click()
        cy.get(LECourseDetailsModal.getCourseCredits()).should('contain', credit.credit2)
    })

    it('Enroll in the OC Course (Curriculum Prerequisite) and Verify Available Credits', () => { 
        LEFilterMenu.getSearchAndEnrollInCourseByName(ocDetails.courseName)
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('My Courses')
        LEDashboardPage.getSpecificCourseCardBtnThenClick(ocDetails.courseName)
        cy.get(LECourseDetailsModal.getCourseCredits()).should('contain', credit.credit1)
    })
})