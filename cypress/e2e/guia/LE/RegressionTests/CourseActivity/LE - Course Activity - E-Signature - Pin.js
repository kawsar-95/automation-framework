import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LECourseDetailsOCModule from '../../../../../../helpers/LE/pageObjects/Courses/LECourseDetailsOCModule'
import LECourseLessonPlayerPage from '../../../../../../helpers/LE/pageObjects/Courses/LECourseLessonPlayerPage'
import LEFilterMenu from '../../../../../../helpers/LE/pageObjects/Menu/LEFilterMenu'
import arCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import arOCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import ARCourseSettingsEnrollmentRulesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
import ARSelectLearningObjectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectLearningObjectModal'
import ARAddESignatureLessonModal from '../../../../../../helpers/AR/pageObjects/Modals/ARAddESigntureLessonModal'
import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import { users } from '../../../../../../helpers/TestData/users/users'
import { ocDetails, eSignature } from '../../../../../../helpers/TestData/Courses/oc'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'

describe('LE - Course Activity - E-Signature - Pin - Admin', function(){

    beforeEach(() => {
        //Sign into admin side as sys admin
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getCoursesReport() 
    })

    it('Admin - Create New OC Course and Verify E-Signature Lesson Object', () => { 
        cy.createCourse('Online Course')
        
        //Add E-Signature Object
        cy.get(arOCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
        ARSelectLearningObjectModal.getObjectTypeByName('E-Signature')
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()

        //Enter Name
        cy.get(ARAddESignatureLessonModal.getNameTxtF()).clear().type(eSignature.eSignatureName)

        //Enter Description
        cy.get(ARAddESignatureLessonModal.getDescriptionTxtF()).type(eSignature.eSignatureDescription)

        //Enter Agreement
        cy.get(ARAddESignatureLessonModal.getAgreementTxtF()).type(eSignature.eSignatureAgreement)

        //Select Pin Method and Verify Description Message
        cy.get(ARAddESignatureLessonModal.getMethodRadioBtn()).contains('PIN').click()
        ARAddESignatureLessonModal.getVerifyMethodDescription('PIN')

        //Save E-Signature Object
        cy.get(ARAddESignatureLessonModal.getSaveBtn()).click()
        arCoursesPage.getLShortWait()

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

describe('LE - Course Activity - E-Signature - Pin', function(){

    beforeEach(() => {
        //Sign in and go to catalog
        cy.apiLoginWithSession(users.learner03.learner_03_username, users.learner03.learner_03_password)
        LEDashboardPage.getTileByNameThenClick('Catalog')
    })

    after(function() {
        //Delete course
        cy.deleteCourse(commonDetails.courseID)
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

        //Verify Agreement, Enter username & PIN, Complete Signature
        cy.get(LECourseLessonPlayerPage.getAgreementTxt()).should('contain', eSignature.eSignatureAgreement)
        cy.get(LECourseLessonPlayerPage.getUserNameTxtF()).type(users.learner03.learner_03_username)
        cy.get(LECourseLessonPlayerPage.getPasswordTxtF()).type(users.learner03.learner_03_pin)
        cy.get(LECourseLessonPlayerPage.getSubmitBtn()).click()
        LEDashboardPage.getShortWait()
        cy.get(LECourseLessonPlayerPage.getActivityCompleteTxt()).should('contain', 'Activity Complete')
        cy.get(LECourseLessonPlayerPage.getCloseActivityBtn()).click()
        LEDashboardPage.getLShortWait() //There is a 2s pause when closing a lesson

        //Verify Course is Now Completed
        cy.get(LECourseDetailsOCModule.getCourseProgressPercentText()).should('contain', '100%')
    })
})
