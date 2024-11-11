import ARAddMoreCourseSettingsModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module"
import ARCourseSettingsEnrollmentRulesModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARDeleteModal from "../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal"
import ARSelectModal from "../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal"
import ARCurriculaActivityReportPage from "../../../../../../helpers/AR/pageObjects/Reports/ARCurriculaActivityReportPage"
import AREnrollUsersPage from "../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage"
import ARUserPage from "../../../../../../helpers/AR/pageObjects/User/ARUserPage"
import { commonDetails } from "../../../../../../helpers/TestData/Courses/commonDetails"
import { courses } from "../../../../../../helpers/TestData/Courses/courses"
import { currDetails } from "../../../../../../helpers/TestData/Courses/curr"
import { userDetails } from "../../../../../../helpers/TestData/users/UserDetails"
import { users } from "../../../../../../helpers/TestData/users/users"
import defaultTestData from '../../../../../fixtures/defaultTestData.json'
import arLoginPage from '../../../../../../helpers/AR/pageObjects/Auth/ARLoginPage'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LEProfilePage from '../../../../../../helpers/LE/pageObjects/User/LEProfilePage'


describe('C7293 - AE - Core Regression - Curricula Activity View Enrollment', () => {

    before('Create user and Curriculam course and enroll user', () => {
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getCoursesReport()
        
        // Create Curriculum course
        cy.createCourse('Curriculum')
       

        ARSelectModal.SearchAndSelectFunction([courses.oc_filter_01_name])
        cy.get(ARDashboardPage.getWaitSpinner(),{timeout:15000}).should('not.exist')
        //Open Enrollment Rules
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        //Select Allow Self Enrollment Alll learner Radio Button
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')        
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36)
        })
        // Enroll User 
        AREnrollUsersPage.getEnrollUserByCourseAndUsername([currDetails.courseName], [userDetails.username])
        cy.logoutAdmin()
        cy.get(arLoginPage.getAbsorbLogo()).should('be.visible')
        
    })

    after('Delete Course and User as part of clean-up', () => {
        cy.deleteCourse(commonDetails.courseID, 'curricula')
        // Delete User
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        //Cleanup - Get userID and delete them
        cy.get(LEDashboardPage.getNavProfile()).click()  
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
        cy.url().then((currentURL) => {
            cy.deleteUser(currentURL.slice(-36));
        })
    })

    it('Verify learner user can be selected after filter a Curriculam Course', () => {
        // Visit to the login page
        cy.visit('/admin/login')
        // Fill out required information to log in
        cy.get(arLoginPage.getUsernameTxtF()).type(users.sysAdmin.admin_sys_01_username)
        cy.get(arLoginPage.getPasswordTxtF()).type(users.sysAdmin.admin_sys_01_password)
        // Click Login button to log the Admin use in
        cy.wrap(arLoginPage.WaitForElementStateToChange(arLoginPage.getLoginBtn()))
        cy.get(arLoginPage.getLoginBtn()).click()
        ARDashboardPage.getVLongWait()

        cy.url().should('include', '/admin/dashboard')

        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel("Reports"))).click()
        ARDashboardPage.getMenuItemOptionByName('Curricula Activity')
        
        // Filter course
        ARCurriculaActivityReportPage.ChooseAddFilter(currDetails.courseName)
        cy.get(ARDashboardPage.getWaitSpinner(),{timeout:15000}).should('not.exist')
        // Filter enrolled user selection
        ARCurriculaActivityReportPage.AddFilter('First Name', 'Contains', defaultTestData.USER_LEARNER_FNAME)
        cy.get(ARDashboardPage.getWaitSpinner(),{timeout:15000}).should('not.exist')
        cy.get(ARCurriculaActivityReportPage.getA5TableCellRecordByColumn(2)).contains(defaultTestData.USER_LEARNER_LNAME).should('be.visible').click()
    })
})