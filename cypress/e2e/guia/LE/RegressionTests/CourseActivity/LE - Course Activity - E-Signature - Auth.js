import LEProfilePage from '../../../../../../helpers/LE/pageObjects/User/LEProfilePage'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LECourseDetailsOCModule from '../../../../../../helpers/LE/pageObjects/Courses/LECourseDetailsOCModule'
import LECourseLessonPlayerPage from '../../../../../../helpers/LE/pageObjects/Courses/LECourseLessonPlayerPage'
import LEFilterMenu from '../../../../../../helpers/LE/pageObjects/Menu/LEFilterMenu'
import arCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import arOCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage'
import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import ARCourseSettingsEnrollmentRulesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
import ARSelectLearningObjectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectLearningObjectModal'
import ARAddESignatureLessonModal from '../../../../../../helpers/AR/pageObjects/Modals/ARAddESigntureLessonModal'
import { userDetails } from '../../../../../../helpers/TestData/users/UserDetails'
import { users } from '../../../../../../helpers/TestData/users/users'
import { ocDetails, eSignature } from '../../../../../../helpers/TestData/Courses/oc'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { miscData } from '../../../../../../helpers/TestData/Misc/misc'

describe('LE - Course Activity - E-Signature - Auth - Admin', function(){

    beforeEach(() => {
        //Sign into admin side as sys admin
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getCoursesReport()
    })

    it('Admin - Create New OC Course and Verify E-Signature Lesson Object', () => { 
        cy.createCourse('Online Course',ocDetails.courseName)
        
        //Add E-Signature Object
        cy.get(arOCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
        ARSelectLearningObjectModal.getObjectTypeByName('E-Signature')
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()

        //Verify Name Field is Required
        cy.get(ARAddESignatureLessonModal.getNameTxtF()).clear()
        cy.get(arCoursesPage.getErrorMsg()).should('contain', miscData.field_required_error)
        //Enter Valid Name
        cy.get(ARAddESignatureLessonModal.getNameTxtF()).type(eSignature.eSignatureName)

        //Verify Description Field Does Not Allow >4000 Chars
        cy.get(ARAddESignatureLessonModal.getDescriptionTxtF()).invoke('text', arCoursesPage.getLongString(4000)).type('a', {force:true})
        cy.get(arCoursesPage.getErrorMsg()).should('contain', miscData.char_4000_error)
        //Enter Valid Description
        cy.get(ARAddESignatureLessonModal.getDescriptionTxtF()).clear()
        cy.get(ARAddESignatureLessonModal.getDescriptionTxtF()).type(eSignature.eSignatureDescription)

        //Verify Agreement Field Does Not Allow >4000 Chars
        cy.get(ARAddESignatureLessonModal.getAgreementTxtF()).invoke('text', arCoursesPage.getLongString(4000)).type('a', {force:true})
        cy.get(arCoursesPage.getErrorMsg()).should('contain', miscData.char_4000_error)
        //Enter Valid Agreement
        cy.get(ARAddESignatureLessonModal.getAgreementTxtF()).clear()
        cy.get(ARAddESignatureLessonModal.getAgreementTxtF()).type(eSignature.eSignatureAgreement)

        //Select Authenticate Method and Verify Description Message
        cy.get(ARAddESignatureLessonModal.getMethodRadioBtn()).contains('Authenticate').click()
        ARAddESignatureLessonModal.getVerifyMethodDescription('Authenticate')

        //Save E-Signature Object
        cy.get(ARAddESignatureLessonModal.getSaveBtn()).click().should('not.exist')
        arCoursesPage.getMediumWait()

        //Verify Second E-Signature Object Cannot be Added
        cy.get(arOCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
        cy.get(ARSelectLearningObjectModal.getObjectRadioBtn()).contains('E-Signature').should('not.exist')
        //Close Modal
        cy.get(ARSelectLearningObjectModal.getCancelBtn()).click()

        //Set Enrollment Rule
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        arCoursesPage.getShortWait()
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')
        
        //Publish course
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36)
        })
    })
})

describe('LE - Course Activity - E-Signature - Auth', function(){

    before(function() {
        //Create a new user
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
    })

    beforeEach(() => {
        //Sign in and go to catalog
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        LEDashboardPage.getTileByNameThenClick('Catalog')
    })

    after(function() {
        //Delete course
        cy.deleteCourse(commonDetails.courseID)
        //Cleanup - Get userID and delete them
        cy.get(LEDashboardPage.getNavProfile()).click()  
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
        cy.url().then((currentURL) => {
            cy.deleteUser(currentURL.slice(-36));
        })
    })

    it('Enroll in Course, Verify E-Signature Lesson Object', () => { 
        //Enroll in Course
        LEFilterMenu.getSearchAndEnrollInCourseByName(ocDetails.courseName)

        //Open Course
        LEDashboardPage.getCourseCardBtnThenClick(ocDetails.courseName)

        //Verify the E-Signature Lesson Object
        LEDashboardPage.getLShortWait() //sometimes takes a moment to load the lessons
        //Verify the Description
        cy.get(LECourseDetailsOCModule.getLessonName()).contains(eSignature.eSignatureName).parents(LECourseDetailsOCModule.getLessonContainer())
            .within(() => {
                cy.get(LECourseDetailsOCModule.getLessonDescription()).should('contain', eSignature.eSignatureDescription)
            })
        //Start the E-Signature Lesson Object
        LECourseDetailsOCModule.getCourseLessonActionBtn(eSignature.eSignatureName, 'Start', true)

        //Verify Agreement, Enter username & password, Complete Signature
        cy.get(LECourseLessonPlayerPage.getAgreementTxt()).should('contain', eSignature.eSignatureAgreement)
        cy.get(LECourseLessonPlayerPage.getUserNameTxtF()).type(userDetails.username)
        cy.get(LECourseLessonPlayerPage.getPasswordTxtF()).type(userDetails.validPassword)
        cy.get(LECourseLessonPlayerPage.getSubmitBtn()).click()
        LEDashboardPage.getShortWait()
        cy.get(LECourseLessonPlayerPage.getActivityCompleteTxt()).should('contain', 'Activity Complete')
        cy.get(LECourseLessonPlayerPage.getCloseActivityBtn()).click()
        LEDashboardPage.getLShortWait() //There is a 2s pause when closing a lesson

        //Verify Course is Now Completed
        cy.get(LECourseDetailsOCModule.getCourseProgressPercentText()).should('contain', '100%')
    })
})
