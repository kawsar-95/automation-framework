import ARCoursesPage from "../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage"
import ARILCAddEditPage from "../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage"
import ARILCMarkUserInActivePage from "../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCMarkUserInActivePage"
import ARAddMoreCourseSettingsModule from "../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module"
import ARCourseSettingsCompletionModule from "../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCompletion.module"
import ARCourseSettingsEnrollmentRulesModule from "../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module"
import ARDashboardPage from "../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARSelectModal from "../../../../../helpers/AR/pageObjects/Modals/ARSelectModal"
import ARILCSessionReportPage from "../../../../../helpers/AR/pageObjects/Reports/ARILCSessionReportPage"
import AREnrollUsersPage from "../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage"
import { commonDetails } from "../../../../../helpers/TestData/Courses/commonDetails"
import { ilcDetails } from "../../../../../helpers/TestData/Courses/ilc"
import { miscData } from "../../../../../helpers/TestData/Misc/misc"
import { users } from "../../../../../helpers/TestData/users/users"

describe("C2081 - NLE-2830 Disable credit fields on Mark Attendance when multi-credits used", () => {
    beforeEach("Login as an Admin and click on the Course menu", () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Courses'))
        
    })

    after('Delete Course as part of clean-up', () => {    
        cy.deleteCourse(commonDetails.courseID, 'instructor-led-courses-new')
    })

    it("When an ILC contains multiple credits, for Mark Attendance teh credit field NOT editable, and an Adnin unable unable save credit values", () => {
        cy.log('Creasting an ILC course')
        //Create Instructor Led Course
        ARCoursesPage.getMediumWait()
        cy.createCourse('Instructor Led', ilcDetails.courseName)

        //Click Enrollment Rules
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        ARCoursesPage.getShortWait()

        // Allow self enrollments All Learners
        cy.get(ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentForm()).within(() => {
            cy.get(ARCourseSettingsEnrollmentRulesModule.getRadioBtnLabel()).contains("All Learners").click();
        })

        // Open Completion Section
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Completion')).click()
        ARILCAddEditPage.getMediumWait() // Wait for toggles to become enabled

        // Add multiple credits
        cy.get(ARCourseSettingsCompletionModule.getAddCreditBtn()).click()
        cy.get(ARCourseSettingsCompletionModule.getCreditTypeDDown()).eq(0).click()
        cy.get(ARCourseSettingsCompletionModule.getAllCreditTypeOptions()).contains(miscData.guia_credit_1_name).click({ force: true })
        cy.get(ARDashboardPage.getElementByDataNameAttribute("visibility-toggle")).click()
        cy.get(ARCourseSettingsCompletionModule.getAddCreditBtn()).click()
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Credit 2 of 2')).within(() => {
            cy.get(ARCourseSettingsCompletionModule.getCreditTypeDDown()).eq(0).click({ force: true })
            cy.get(ARCourseSettingsCompletionModule.getAllCreditTypeOptions()).contains(miscData.guia_credit_2_name).click({ force: true })
            cy.get(ARDashboardPage.getElementByDataNameAttribute("visibility-toggle")).click()
        })

        // Publish the ILC Course and capture the ID
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
        ARDashboardPage.getMediumWait()

        // Course filter 
        ARDashboardPage.AddFilter('Name', 'Contains', ilcDetails.courseName)
        ARDashboardPage.getMediumWait()
        // Select filtered course
        cy.get(ARDashboardPage.getTableCellRecord(ilcDetails.courseName)).click()

        // Click on Enroll User
        cy.wrap(AREnrollUsersPage.WaitForElementStateToChange(AREnrollUsersPage.getAddEditMenuActionsByName('Enroll User'), 1000))
        cy.get(AREnrollUsersPage.getAddEditMenuActionsByName('Enroll User')).click({ force: true })

        // Enroll multi user to the course
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getElementByDataNameAttribute('userIds')).within(() => {
            cy.get(AREnrollUsersPage.getEnrollUsersDDown()).click()
        })
        ARDashboardPage.getMediumWait()        
        cy.get(AREnrollUsersPage.getEnrollUsersSearchTxtF()).clear().type(users.learner01.learner_01_username)
        ARDashboardPage.getShortWait()
        AREnrollUsersPage.getEnrollUsersOpt(users.learner01.learner_01_username)
        ARDashboardPage.getShortWait()
        cy.get(ARDashboardPage.getElementByDataNameAttribute('header')).contains('Enroll Users').click({ force: true })

        cy.get(ARDashboardPage.getElementByDataNameAttribute('userIds')).within(() => {
            cy.get(AREnrollUsersPage.getEnrollUsersDDown()).click()
        })
        cy.get(AREnrollUsersPage.getEnrollUsersSearchTxtF()).clear().type(users.learner02.learner_02_username)
        ARDashboardPage.getMediumWait()
        AREnrollUsersPage.getEnrollUsersOpt(users.learner02.learner_02_username)
        ARDashboardPage.getShortWait()
        cy.get(ARDashboardPage.getElementByDataNameAttribute('header')).contains('Enroll Users').click({ force: true })

        ARDashboardPage.getShortWait()
        cy.get(ARDashboardPage.getElementByDataNameAttribute('add-course')).click()

        // Select Course and select session name
        cy.wrap(ARSelectModal.searchAndSelectSessionName([ilcDetails.courseName]))
        ARILCMarkUserInActivePage.getSelectILCSessionWithinCourse(ilcDetails.courseName, ilcDetails.sessionName)
        AREnrollUsersPage.getMediumWait()

        // Enroll users save btn
        cy.get(AREnrollUsersPage.getSaveBtn()).click()
        ARDashboardPage.getLongWait()

        // Click on leftMenu Reports
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Reports'))).click()
        ARDashboardPage.getMenuItemOptionByName('ILC Sessions')
        cy.get(ARILCSessionReportPage.getSectionHeader()).should('contain', 'ILC Sessions')

        // Add Filter ILC Session
        ARDashboardPage.A5AddFilter('Course', 'Contains', ilcDetails.courseName)
        ARDashboardPage.getMediumWait()

        // Select filtered ILC Session course
        cy.get(ARDashboardPage.getGridTable()).eq(0).click()
        ARDashboardPage.getLongWait()

        // Select the Session A for ILC Course A and click 'Mark Attendance' Button in the Right hand Action Buttons
        ARDashboardPage.getA5AddEditMenuActionsByNameThenClick('Mark Attendance')
        ARDashboardPage.getMediumWait()

        // Check Mark Attendance Page
        cy.get(ARILCMarkUserInActivePage.getMarkAttendanceHeader()).should('have.text', 'Mark Attendance')
        ARDashboardPage.getMediumWait()

        // Mass Actions btn check
        cy.get(ARILCAddEditPage.getMassActionsBtn()).should('exist')

        // Mass Actions btn Click
        cy.get(ARILCAddEditPage.getMassActionsBtn()).click()

        // Mass Actions btn on Check
        cy.get(ARILCAddEditPage.getMassActionsBtnOn()).should('exist')

        // Under Mass Action credit input disabled
        cy.get(ARDashboardPage.getElementByNameAttribute("MassActionCredit")).should('be.disabled')

        // Under Mass Action credit input text field 
        cy.get(ARILCAddEditPage.getMassActionsCreditsField()).eq(2).should("contain", "Disabled due to enrollment(s) having multiple credit types.")
        
        cy.get(ARILCAddEditPage.getLearnersCredits()).within(() => {            
            checkCreditInputValueWithState(2)
        })

        // Save attendence
        cy.get(ARILCAddEditPage.getSaveBtn()).click()
        ARDashboardPage.getMediumWait()

        // Select the Session A for ILC Course A and click 'Mark Attendance' Button in the Right hand Action Buttons
        // cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(1)).click()
        ARDashboardPage.getA5AddEditMenuActionsByNameThenClick('Mark Attendance')
        ARDashboardPage.getMediumWait()

        // Mark Attendance learner credit input field and value
        cy.get(ARILCAddEditPage.getLearnersCredits()).within(() => {
            checkCreditInputValueWithState(2)
        })
    })

    it("Verify that an Admin can edit credit values using mass action for each learner row", () => {
        // Course filter 
        ARDashboardPage.AddFilter('Name', 'Contains', ilcDetails.courseName)
        ARDashboardPage.getMediumWait()

        // Select filtered course
        cy.get(ARDashboardPage.getTableCellRecord(ilcDetails.courseName)).eq(0).click()


        // Click on Enroll User
        cy.wrap(AREnrollUsersPage.WaitForElementStateToChange(AREnrollUsersPage.getAddEditMenuActionsByName('Edit'), 1000))
        cy.get(AREnrollUsersPage.getAddEditMenuActionsByName('Edit')).click({ force: true })

        // Open Completion Section to remove a session
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Completion')).click()
        ARILCAddEditPage.getMediumWait()

        cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Credit 2 of 2')).within(() => {
            cy.get(ARDashboardPage.getElementByDataNameAttribute("remove")).eq(0).click()
        })
        cy.get(ARDashboardPage.getElementByDataNameAttribute("remove")).eq(0).click()

        // Publish modified ILC Course
        cy.publishCourseAndReturnId()

        // Click on leftMenu Reports
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Reports'))).click()
        ARDashboardPage.getMenuItemOptionByName('ILC Sessions')
        cy.get(ARILCSessionReportPage.getSectionHeader()).should('contain', 'ILC Sessions')

        // Add Filter ILC Session
        ARDashboardPage.A5AddFilter('Course', 'Contains', ilcDetails.courseName)
        ARDashboardPage.getMediumWait()

        // Select filtered ILC Session course
        cy.get(ARDashboardPage.getGridTable()).eq(0).click()
        ARDashboardPage.getLongWait()

        // Select the Session A for ILC Course A and click 'Mark Attendance' Button in the Right hand Action Buttons
        ARDashboardPage.getA5AddEditMenuActionsByNameThenClick('Mark Attendance')
        ARDashboardPage.getMediumWait()

        // Mass Actions btn check
        cy.get(ARILCAddEditPage.getMassActionsBtn()).should('exist')

        // Mass Actions btn Click
        cy.get(ARILCAddEditPage.getMassActionsBtn()).click()

        // Mass Actions btn on Check
        cy.get(ARILCAddEditPage.getMassActionsBtnOn()).should('exist')

        // Under Mass Action credit input disabled
        cy.get(ARDashboardPage.getElementByNameAttribute("MassActionCredit")).should('not.be.disabled').type(20)

        // Mark Attendance learner credit input field and value
        cy.get(ARILCAddEditPage.getLearnersCredits()).within(() => {
            // Credit value field is NOT disabled. That is editable
            checkCreditInputValueWithState(2, 'not.')            
        })

        // Attendance List btn click
        cy.get(ARILCAddEditPage.getUpdateAttendanceListBtn()).click()


        // Mark Attendance Save Btn
        cy.get(ARILCAddEditPage.getSaveBtn()).click()
        ARDashboardPage.getLongWait()

        // Select the Session A for ILC Course A and click 'Mark Attendance' Button in the Right hand Action Buttons
        ARDashboardPage.getA5AddEditMenuActionsByNameThenClick('Mark Attendance')
        ARDashboardPage.getMediumWait()

        // Mark Attendance learner credit input field and value
        cy.get(ARILCAddEditPage.getLearnersCredits()).within(() => {
            // Credit value field is NOT disabled. That is editable, and Admin can update values
            checkCreditInputValueWithState(2, 'not.', 20)
        })
    })
})

function checkCreditInputValueWithState(totalEnrolledUsers, enableDisalbeState = '', creditValue = '') {
    let i = 0
    for (i; i < totalEnrolledUsers; i++) {
        cy.get(ARILCAddEditPage.getLeanerInputRow()).eq(i).get('td').last().within(() => {
            cy.get('input').should(`${enableDisalbeState}be.disabled`).and('have.value', `${creditValue}`)                    
        }) 
    }
}