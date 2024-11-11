import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import ARCURRAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/CURR/ARCURRAddEditPage'
import ARSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import ARCourseSettingsEnrollmentRulesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
import { users } from '../../../../../../helpers/TestData/users/users'
import { courses } from '../../../../../../helpers/TestData/Courses/courses'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { currDetails } from '../../../../../../helpers/TestData/Courses/curr'
import ARDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'

describe('AR - CED - CURR - Quick Publish', function(){

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getCoursesReport()
    })

    after(function() {
        //Delete Course
        cy.deleteCourse(commonDetails.courseID, 'curricula')
    })

    it('Verify Course Creation with Quick Publish', () => {
        cy.createCourse('Curriculum')
        //Add course to curriculum
        ARSelectModal.SearchAndSelectFunction([courses.oc_filter_01_name])
        ARSelectModal.getLShortWait()

        //Set enrollment rule - Allow self enrollment for all learners
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        arCoursesPage.getShortWait()
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')

        //Quick publish the course
        cy.publishCourse(true)

        //Verify admin remains on course creation page
        cy.url().should('contain', '/admin/curricula/add')
    })

    it('Verify Course Persisted and Can be Edited and Quick Published', () => {
        //filter for and edit course
        cy.editCourse(currDetails.courseName)
        cy.url().should('contain', 'edit').then((currentURL) => {
            commonDetails.courseID = currentURL.slice(-36); //Store courseID
        })

        //Verify description and language and edit fields
        cy.get(ARCURRAddEditPage.getDescriptionTxtF()).type(commonDetails.appendText)
        cy.get(ARCURRAddEditPage.getGeneralLanguageDDown()).should('contain.text', currDetails.language)

        //Verify added course
        cy.get(ARCURRAddEditPage.getCourseName()).contains(courses.oc_filter_01_name).should('exist')

        //Add a second course
        cy.get(ARCURRAddEditPage.getAddCoursesBtn()).should('have.attr', 'aria-disabled', 'false').click()
        ARSelectModal.SearchAndSelectFunction([courses.oc_filter_02_name])
        ARSelectModal.getLShortWait()

        //Verify enrollment rule and edit enrollment rule
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        arCoursesPage.getShortWait()
        ARCourseSettingsEnrollmentRulesModule.getVerifyRadioBtn('All Learners')
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('Off')
        // commenting out due to QA Main performance issue
        //ARCourseSettingsEnrollmentRulesModule.getEnableAutomaticEnrollmentRadioBtn('All Learners') 

        //Quick publish the course
        cy.publishCourse(true)

        //Verify admin remains on course creation page
        cy.url().should('contain', '/admin/curricula/edit/')
    })

    it('Verify Course Edits Persisted', () => {
        //filter for and edit course
        cy.editCourse(currDetails.courseName)

        //Verify description and language
        cy.get(ARCURRAddEditPage.getDescriptionTxtF()).should('contain.text', commonDetails.appendText)

        //Verify added courses
        cy.get(ARCURRAddEditPage.getCourseName()).contains(courses.oc_filter_01_name).should('exist')
        cy.get(ARCURRAddEditPage.getCourseName()).contains(courses.oc_filter_02_name).should('exist')
        
        //Verify enrollment rule
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        arCoursesPage.getShortWait()
        ARCourseSettingsEnrollmentRulesModule.getVerifyRadioBtn('Off')
        // commenting out due to QA Main performance issue
        //ARCourseSettingsEnrollmentRulesModule.getDefaultEnableAutomaticEnrollmentRadioBtn('All Learners')
    })
})