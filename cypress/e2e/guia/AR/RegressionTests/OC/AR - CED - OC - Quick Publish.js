import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import AROCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import ARCourseSettingsEnrollmentRulesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
import ARSelectLearningObjectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectLearningObjectModal'
import ARAddObjectLessonModal from '../../../../../../helpers/AR/pageObjects/Modals/ARAddObjectLessonModal'
import { users } from '../../../../../../helpers/TestData/users/users'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { ocDetails, eSignature, lessonObjects } from '../../../../../../helpers/TestData/Courses/oc'

describe('AR - CED - OC - Quick Publish', function(){

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        
    })

    after(function() {
        //Delete Course
        cy.deleteCourse(commonDetails.courseID)
    })

    it('Verify Course Creation with Quick Publish', () => {
        cy.createCourse('Online Course')
        //Set enrollment rule - Allow self enrollment for all learners
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        arCoursesPage.getShortWait()
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')
        //Add object to OC
        cy.get(AROCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
        ARSelectLearningObjectModal.getObjectTypeByName('Object')
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()
        ARAddObjectLessonModal.getAddBasicObjectLesson(lessonObjects.objectName)

        //Quick publish the course
        cy.publishCourse(true)

        //Verify admin remains on course creation page
        cy.url().should('contain', '/admin/onlineCourses/add')
    })

    it('Verify Course Persisted and Can be Edited and Quick Published', () => {
        //filter for and edit course
        cy.editCourse(ocDetails.courseName)
        cy.url().should('contain', 'edit').then((currentURL) => {
            commonDetails.courseID = currentURL.slice(-36); //Store courseID
        })

        //Verify description and language and edit fields
        cy.get(AROCAddEditPage.getDescriptionTxtF()).should('contain.text', ocDetails.description).type(commonDetails.appendText)
        cy.get(AROCAddEditPage.getGeneralLanguageDDown()).should('contain.text', 'English')

        //Verify lesson object and edit lesson object
        cy.get(AROCAddEditPage.getLearningObjectName()).should('contain', lessonObjects.objectName)
        AROCAddEditPage.getEditBtnByLessonNameThenClick(lessonObjects.objectName)
        cy.get(AROCAddEditPage.getElementByAriaLabelAttribute(ARAddObjectLessonModal.getNameTxt())).clear().type(lessonObjects.objectName + commonDetails.appendText)
        cy.get(ARAddObjectLessonModal.getApplyBtn()).click()
        AROCAddEditPage.getLShortWait()

        //Verify enrollment rule and edit enrollment rule
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        arCoursesPage.getShortWait()
        ARCourseSettingsEnrollmentRulesModule.getVerifyRadioBtn('All Learners')
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('Off')

        //Quick publish the course
        cy.publishCourse(true)

        //Verify admin remains on course creation page
        cy.url().should('contain', '/admin/onlineCourses/edit/')
    })

    it('Verify Course Edits Persisted', () => {
        //filter for and edit course
        cy.editCourse(ocDetails.courseName)

        //Verify description and language
        cy.get(AROCAddEditPage.getDescriptionTxtF()).should('contain.text', ocDetails.description + commonDetails.appendText)
        cy.get(AROCAddEditPage.getGeneralLanguageDDown()).should('contain.text', 'English')

        //Verify lesson object
        cy.get(AROCAddEditPage.getLearningObjectName()).should('contain', lessonObjects.objectName + commonDetails.appendText)

        //Verify enrollment rule
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        arCoursesPage.getShortWait()
        ARCourseSettingsEnrollmentRulesModule.getVerifyRadioBtn('Off')
    })
})