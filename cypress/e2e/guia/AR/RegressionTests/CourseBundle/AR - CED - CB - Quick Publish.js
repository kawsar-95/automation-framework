import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import arCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import ARCourseSettingsEnrollmentRulesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
import arCBAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/CB/ARCBAddEditPage'
import arSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import { cbDetails } from '../../../../../../helpers/TestData/Courses/cb'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { courses } from '../../../../../../helpers/TestData/Courses/courses'
import { users } from '../../../../../../helpers/TestData/users/users'

describe('AR - CED - CB - Quick Publish', function(){

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getCoursesReport()
       
    })

    after(function() {
        //Delete Course
        cy.deleteCourse(commonDetails.courseID, 'course-bundles')
    })

    it('Verify Course Creation with Quick Publish', () => {
        cy.createCourse('Course Bundle')

        //Add course to course bundle
        arSelectModal.SearchAndSelectFunction([courses.oc_filter_01_name])

        //Set enrollment rule - Allow self enrollment for all learners
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')

        //Quick publish the course
        cy.publishCourse(true)

        //Verify admin remains on course creation page
        cy.url().should('contain', '/admin/courseBundles/add')
    })

    it('Verify Course Persisted and Can be Edited and Quick Published', () => {
        //filter for and edit course
        cy.editCourse(cbDetails.courseName)
        cy.url().should('contain', 'edit').then((currentURL) => {
            commonDetails.courseID = currentURL.slice(-36); //Store courseID
        })

        //Verify description and language and edit fields
        cy.get(arCBAddEditPage.getDescriptionTxtF()).type(commonDetails.appendText)
        cy.get(arCBAddEditPage.getGeneralLanguageDDown()).should('contain.text', cbDetails.language)

        //Verify added course and add second course
        cy.get(arCBAddEditPage.getCourseName()).contains(courses.oc_filter_01_name).should('exist')
        cy.get(arCBAddEditPage.getElementByDataNameAttribute(arCBAddEditPage.getAddCoursesBtn())).click()
        arSelectModal.SearchAndSelectFunction([courses.oc_filter_02_name])

        //Verify enrollment rule and edit enrollment rule
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        
        //ARCourseSettingsEnrollmentRulesModule.getVerifyRadioBtn('All Learners')
        //ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('Off')

        //Quick publish the course
        cy.publishCourse(true)

        //Verify admin remains on course creation page
        cy.url().should('contain', '/admin/courseBundles/edit/')
    })

    it('Verify Course Edits Persisted', () => {
        //filter for and edit course
        cy.editCourse(cbDetails.courseName)

        //Verify description edit
        cy.get(arCBAddEditPage.getDescriptionTxtF()).should('contain.text', commonDetails.appendText)

        //Verify added courses
        cy.get(arCBAddEditPage.getCourseName()).contains(courses.oc_filter_01_name).should('exist')
        cy.get(arCBAddEditPage.getCourseName()).contains(courses.oc_filter_02_name).should('exist')

        //Verify enrollment rule
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        
        //ARCourseSettingsEnrollmentRulesModule.getVerifyRadioBtn('Off')
    })
})