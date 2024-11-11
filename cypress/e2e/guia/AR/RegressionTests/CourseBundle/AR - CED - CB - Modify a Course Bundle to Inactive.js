import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import arCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import ARCourseSettingsEnrollmentRulesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
import arCBAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/CB/ARCBAddEditPage'
import arSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import ARDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import { cbDetails } from '../../../../../../helpers/TestData/Courses/cb'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { courses } from '../../../../../../helpers/TestData/Courses/courses'
import { users } from '../../../../../../helpers/TestData/users/users'
import ARCBAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/CB/ARCBAddEditPage'
import ARUserAddEditPage from '../../../../../../helpers/AR/pageObjects/User/ARUserAddEditPage'

describe('AR - CED - CB - Modify a Course Bundle to Inactive - 4957', function(){

    beforeEach(() => {
        // Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getCoursesReport()
    })

    after(function() {
        // Delete Course
        cy.deleteCourse(commonDetails.courseID, 'course-bundles')
    })

    it('Create Course Bundle, set Active and Publish', () => {
        cy.createCourse('Course Bundle')

        // Add course to course bundle
        arSelectModal.SearchAndSelectFunction([courses.oc_filter_01_name])
        cy.get(arDashboardPage.getWaitSpinner() , {timeout:15000}).should('not.exist')

        // Add course for deletion later
        cy.get(arCBAddEditPage.getElementByDataNameAttribute(arCBAddEditPage.getAddCoursesBtn())).click()
        arSelectModal.SearchAndSelectFunction([courses.oc_filter_03_name])
        cy.get(arDashboardPage.getWaitSpinner() , {timeout:15000}).should('not.exist')

        // Set enrollment rule - Allow self enrollment for all learners
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')

        // Publish the course
        cy.publishCourse(false)
    })

    it('Verify Course Persisted, delete and add course, set to Inactive, and Publish', () => {
        // filter for and edit course
        cy.editCourse(cbDetails.courseName)
        cy.url().should('contain', 'edit').then((currentURL) => {
            commonDetails.courseID = currentURL.slice(-36); //Store courseID
        })

        // Verify course is active by default and set to inactive
        ARUserAddEditPage.generalToggleSwitch('false',ARUserAddEditPage.getIsActiveToggleContainer())

        // Update the course name in the title field
        cy.get(arCBAddEditPage.getGeneralTitleTxtF).should('contain.text', cbDetails.courseName)

        // Verify description and language and edit fields
        cy.get(ARCBAddEditPage.getDescriptionTxtF()).type(commonDetails.appendText)
        cy.get(arCBAddEditPage.getGeneralLanguageDDown()).should('contain.text', cbDetails.language)

        // Delete course
        cy.get(arCBAddEditPage.getCourseName()).contains(courses.oc_filter_03_name).should('exist')
        cy.get(arCBAddEditPage.getCourseName()).contains(courses.oc_filter_03_name).parent().parent()
            .within(() => { 
                cy.get(arCBAddEditPage.getCourseTrashBtn()).click()
            })
        cy.get(arCBAddEditPage.getElementByDataNameAttribute(ARDeleteModal.getDeleteBtn())).click()
        cy.get(arDashboardPage.getWaitSpinner() , {timeout:15000}).should('not.exist')

        // Added course but do not go through with the completion (Cancel at the end)
        cy.get(arCBAddEditPage.getElementByDataNameAttribute(arCBAddEditPage.getAddCoursesBtn())).click()
        arSelectModal.SearchAndSelectFunction([courses.oc_filter_02_name])
        
        // Added course
        cy.get(arCBAddEditPage.getElementByDataNameAttribute(arCBAddEditPage.getAddCoursesBtn())).click()
        arSelectModal.SearchAndSelectFunction([courses.oc_filter_02_name])

        // Verify enrollment rule and edit enrollment rule
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        

        // Publish the course
        cy.publishCourse(false)
    })

    it('Verify Course Edits Persisted', () => {
        // filter for and edit course
        cy.editCourse(cbDetails.courseName)

        // Verify description edit
        cy.get(ARCBAddEditPage.getDescriptionTxtF()).should('contain.text',  commonDetails.appendText)

        // Verify added courses
        cy.get(arCBAddEditPage.getCourseName()).contains(courses.oc_filter_01_name).should('exist')
        cy.get(arCBAddEditPage.getCourseName()).contains(courses.oc_filter_02_name).should('exist')
        cy.get(arCBAddEditPage.getCourseName()).contains(courses.oc_filter_03_name).should('not.exist')

        // Verify is Inactive
        ARUserAddEditPage.generalToggleSwitch('false',ARUserAddEditPage.getIsActiveToggleContainer())

        // Verify enrollment rule
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        
    })
})