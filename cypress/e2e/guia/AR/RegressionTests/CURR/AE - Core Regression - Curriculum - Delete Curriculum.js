
import ARAddMoreCourseSettingsModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module"
import ARCourseSettingsEnrollmentRulesModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARDeleteModal from "../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal"
import ARSelectModal from "../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal"
import ARCurriculaActivityReportPage from "../../../../../../helpers/AR/pageObjects/Reports/ARCurriculaActivityReportPage"
import { commonDetails } from "../../../../../../helpers/TestData/Courses/commonDetails"
import { courses } from "../../../../../../helpers/TestData/Courses/courses"
import { currDetails } from "../../../../../../helpers/TestData/Courses/curr"
import { users } from "../../../../../../helpers/TestData/users/users"

describe('C7322 - AUT-699 - AE - Core Regression - Curriculum - Delete Curriculum', () => {

    before('Create a Curriculam course for the test ', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getCoursesReport()

        // Create Curriculum course
        cy.createCourse('Curriculum')
       
        ARSelectModal.SearchAndSelectFunction([courses.oc_filter_01_name])
        cy.get(ARDashboardPage.getWaitSpinner(),{timeout:15000}).should('not.exist')
        // Open Enrollment Rules
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        // Select Allow Self Enrollment Alll learner Radio Button
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')
        // Publish Course
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36)
        })
    })

    it('Course delete from course report', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getCoursesReport()

        // Filter course
        cy.get(ARDashboardPage.getWaitSpinner(),{timeout:15000}).should('not.exist')
        ARDashboardPage.AddFilter('Name', 'Contains', currDetails.courseName)
        cy.get(ARDashboardPage.getWaitSpinner(),{timeout:15000}).should('not.exist')

        // Assert difference in the right context menu before and after selectign an item
        // Assert that before selection of an item 'Deselect' button doesn't exist
        cy.get(ARCurriculaActivityReportPage.getDeselectBtn()).should('not.exist')

        // Select filtered course
        cy.get(ARDashboardPage.getTableCellRecord()).contains(currDetails.courseName).click()
        cy.wrap(ARDashboardPage.WaitForElementStateToChange(ARCurriculaActivityReportPage.getDeselectBtn()))

        // Assert that after selection of an item 'Deselect' button exists
        cy.get(ARCurriculaActivityReportPage.getDeselectBtn()).should('exist')

        // Right menu delete btn
        cy.get(ARCurriculaActivityReportPage.getDeleteCourseBtn()).click()
        // Assert that the Modal popup contains the appropriate title
        cy.get(ARDeleteModal.getModalHeader()).should('contain', "Delete Course")
        // Assert that the Modal popup contains the appropriate message content
        cy.get(ARDeleteModal.getModalContent()).should('contain', ARDeleteModal.getDeleteMsg(currDetails.courseName))
        
        // Modal cancel button
        cy.get(ARDeleteModal.getCanncelDeleteBtn()).contains('Cancel').click()
        // Course reports header title
        cy.get(ARCurriculaActivityReportPage.getPageHeaderTitle() , {timeout:15000}).should('contain', 'Courses')
        // Right menu delete btn
        cy.get(ARCurriculaActivityReportPage.getDeleteCourseBtn()).click()
        // Modal popup should ok btn click
        cy.get(ARDeleteModal.getARDeleteBtn()).contains('Delete').click()
        // Course deleted and No results found text show
        cy.get(ARCurriculaActivityReportPage.getNoResultMsg()).contains('No results found.').should('exist')
    })
})