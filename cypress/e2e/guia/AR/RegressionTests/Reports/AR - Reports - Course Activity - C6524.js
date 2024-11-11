import ARCoursesPage from "../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage"
import ARAddMoreCourseSettingsModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module"
import ARCourseSettingsCompletionModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCompletion.module"
import ARCourseSettingsEnrollmentRulesModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module"
import AROCAddEditPage from "../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import AREditActivityPage from "../../../../../../helpers/AR/pageObjects/Enrollment/AREditActivityPage"
import ARUploadFileModal from "../../../../../../helpers/AR/pageObjects/Modals/ARUploadFileModal"
import ARCourseActivityReportPage from "../../../../../../helpers/AR/pageObjects/Reports/ARCourseActivityReportPage"
import AREnrollUsersPage from "../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage"
import { commonDetails, credit } from "../../../../../../helpers/TestData/Courses/commonDetails"
import { ocDetails } from "../../../../../../helpers/TestData/Courses/oc"
import { userDetails } from "../../../../../../helpers/TestData/users/UserDetails"
import { users } from "../../../../../../helpers/TestData/users/users"
import ARManageCategoriesPage from '../../../../../../helpers/AR/pageObjects/Category/ARManageCategoryPage'

describe('C6524 - Reports - Course Activity', () => {
    beforeEach(() => {
        cy.apiLoginWithSession(
            users.sysAdmin.admin_sys_01_username,
            users.sysAdmin.admin_sys_01_password,
            '/admin'
        )
    })
    after(() => {
        cy.deleteCourse(commonDetails.courseID)
    })
    it('Create OC Course, Upload Certificate, & Publish Course', () => {
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Courses'))
        

        cy.createCourse('Online Course')

        //Open Enrollment Rules
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        AROCAddEditPage.getShortWait()

        //Select Allow Enrollment All learner Radio Button
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')


        //Publish OC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
        ARDashboardPage.getLongWait()

    })
    it('Course Activity', () => {
        //Navigate to course activity
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Reports'))).click()
        ARDashboardPage.getMenuItemOptionByName('Course Activity')
        ARDashboardPage.getMediumWait()

        //Select any course from drop down and click on add filter
        ARCourseActivityReportPage.ChooseAddFilter(ocDetails.courseName)
        ARDashboardPage.getMediumWait()
        //Click on Display column
        cy.get(ARDashboardPage.getElementByTitleAttribute('Display Columns')).click()
        ARDashboardPage.getShortWait()
        //Column should be displayed 
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Display Columns')).should('exist')
        //Select "is overdue" option
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Display Columns')).find('span').contains('Is Overdue').click()
        cy.get(ARDashboardPage.getElementByTitleAttribute('Display Columns')).click({ force: true })
        // Is Overdue Option should be added in column header.
        cy.get(ARDashboardPage.getTableHeader()).eq(9).should('contain', 'Is Overdue')
        // Click on generate file and select from drop down (excel/csv) and click on generate
        cy.get(ARDashboardPage.getElementByTitleAttribute('Generate Report File')).click()
        cy.get(ARCourseActivityReportPage.getGenerateReportFileFormatDDown()).click()
        //Select Excel
        cy.get(ARCourseActivityReportPage.getGenerateReportFileFormatOption()).eq(0).click({ force: true })
        cy.get(ARDashboardPage.getElementByDataNameAttribute('generate-report-button')).click()

        ARDashboardPage.getHFJobWait()
        cy.get(ARCourseActivityReportPage.getDownloadReportBtn()).click()


    })

})