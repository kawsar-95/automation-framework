import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import arCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import ARCourseSettingsEnrollmentRulesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
import ARILCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage'
import { ilcDetails, sessions } from '../../../../../../helpers/TestData/Courses/ilc'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../helpers/TestData/users/users'

describe('AR - CED - ILC - Quick Publish', function(){

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        
    })

    after(function() {
        //Delete Course
        cy.deleteCourse(commonDetails.courseID, 'instructor-led-courses-new')
    })

    it('Verify Course Creation with Quick Publish', () => {
        cy.createCourse('Instructor Led')

        //Set enrollment rule - Allow self enrollment for all learners
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        arCoursesPage.getShortWait()
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')

        //Quick publish the course
        cy.publishCourse(true)

        //Verify admin remains on course creation page
        cy.url().should('contain', '/admin/instructorLedCourses/add')
    })

    it('Verify Course Persisted and Can be Edited and Quick Published', () => {
        //filter for and edit course
        cy.editCourse(ilcDetails.courseName)
        cy.url().should('contain', 'edit').then((currentURL) => {
            commonDetails.courseID = currentURL.slice(-36); //Store courseID
        })

        //Verify description and language and edit fields
        cy.get(ARILCAddEditPage.getDescriptionTxtF()).should('contain.text', ilcDetails.description).type(commonDetails.appendText)
        cy.get(ARILCAddEditPage.getGeneralLanguageDDown()).should('contain.text', 'English')

        //Verify session
        cy.get(ARILCAddEditPage.getVerifySessionExists()).should('contain', ilcDetails.sessionName)

        //Add a second session
        cy.get(ARILCAddEditPage.getAddSessionBtn()).click()

        cy.get(ARILCAddEditPage.getSessionDetailsTitleTxtF()).should('have.attr', 'aria-invalid', 'false').clear().type(sessions.sessionName_2)
        //Set Session Date 3 days into the future
        ARILCAddEditPage.getStartDatePickerBtnThenClick()
        ARILCAddEditPage.getSelectDate(ARILCAddEditPage.getFutureDate(3))
        cy.get(ARILCAddEditPage.getAddEditSessionSaveBtn()).click()
        ARILCAddEditPage.getLShortWait()

        //Verify enrollment rule and edit enrollment rule
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        arCoursesPage.getShortWait()
        ARCourseSettingsEnrollmentRulesModule.getVerifyRadioBtn('All Learners')
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('Off')
        ARILCAddEditPage.getLShortWait()

        //Quick publish the course
        cy.publishCourse(true)

        //Verify admin remains on course creation page
        cy.url().should('contain', '/admin/instructorLedCourses/edit/')
    })

    it('Verify Course Edits Persisted', () => {
        //filter for and edit course
        cy.editCourse(ilcDetails.courseName)

        //Verify description and language
        cy.get(ARILCAddEditPage.getDescriptionTxtF()).should('contain.text', ilcDetails.description + commonDetails.appendText)

        //Verify added session
        cy.get(ARILCAddEditPage.getVerifySessionExists()).should('contain', sessions.sessionName_2)
        
        //Verify Number of Total/Future/Past Sessions
        ARILCAddEditPage.getSessionCountByTimeLabel('Total', '2')
        ARILCAddEditPage.getSessionCountByTimeLabel('Future', '2')
        
        //Verify enrollment rule
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        arCoursesPage.getShortWait()
        ARCourseSettingsEnrollmentRulesModule.getVerifyRadioBtn('Off')
    })
})