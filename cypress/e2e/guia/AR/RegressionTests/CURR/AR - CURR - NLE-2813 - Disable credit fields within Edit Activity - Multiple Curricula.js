import ARCoursesPage from "../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage"
import ARCURRAddEditPage from "../../../../../../helpers/AR/pageObjects/Courses/CURR/ARCURRAddEditPage"
import ARAddMoreCourseSettingsModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module"
import ARCourseSettingsCompletionModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCompletion.module"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import AREditActivityPage from "../../../../../../helpers/AR/pageObjects/Enrollment/AREditActivityPage"
import ARSelectModal from "../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal"
import ARCurriculaActivityReportPage from "../../../../../../helpers/AR/pageObjects/Reports/ARCurriculaActivityReportPage"
import AREnrollUsersPage from "../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage"
import { commonDetails, credit } from "../../../../../../helpers/TestData/Courses/commonDetails"
import { courses } from "../../../../../../helpers/TestData/Courses/courses"
import { currDetails } from "../../../../../../helpers/TestData/Courses/curr"
import { miscData } from "../../../../../../helpers/TestData/Misc/misc"
import { users } from "../../../../../../helpers/TestData/users/users"

describe("C2082 - NLE-2813 - Disable credit fields within Edit Activity - Multiple Curricula", () => {

    before("Create a Curriculam course with credit options and add users for enrollment",  () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        // Go to the Course Page
        ARDashboardPage.getCoursesReport()

        // Create a test Curriculum 
        cy.createCourse('Curriculum', currDetails.courseName)        
        ARSelectModal.SearchAndSelectFunction([courses.oc_filter_01_name])
        ARSelectModal.getLShortWait()

        // Enable Credit Widget in the Curriculum
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Completion')).click()
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Completion')).click()

        // Add General credit option
        cy.get(ARCourseSettingsCompletionModule.getAddCreditBtn()).click()
        // Select the Credit dropdown box to be able to type in the box
        cy.get(ARCourseSettingsCompletionModule.getCreditTypeDDown()).click()
        // Type the credit type in the box and select the matching credit type in the list
        cy.get(ARCourseSettingsCompletionModule.getAllCreditTypeSelections()).get(ARCourseSettingsCompletionModule.getAllCreditTypeOptions()).contains('General').click()
        cy.get(ARCURRAddEditPage.getElementByAriaLabelAttribute(ARCourseSettingsCompletionModule.getCreditAmountTxt())).type(credit.credit1)
        ARDashboardPage.getShortWait()

        // Add another credit option
        cy.get(ARCourseSettingsCompletionModule.getAddCreditBtn()).click()       
        //Select the Credit dropdown box to be able to type in the box
        cy.get(ARCourseSettingsCompletionModule.getCreditTypeDDown()).eq(1).click()
        // Type the credit type in the box and select the matching credit type in the list
        cy.get(ARCourseSettingsCompletionModule.getAllCreditTypeSelections()).eq(1).contains(miscData.guia_credit_1_name).click()
        cy.get(ARCURRAddEditPage.getElementByAriaLabelAttribute(ARCourseSettingsCompletionModule.getCreditAmountTxt())).eq(1).type(credit.credit1)
        ARDashboardPage.getShortWait()
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36)
        })
        // Eroll users
        AREnrollUsersPage.getEnrollUserByCourseAndUsername([currDetails.courseName], [users.learner01.learner_01_username, users.learner02.learner_02_username])
        ARDashboardPage.getShortWait()
    })

    beforeEach(() => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
    })

    after('Delete the Curriculam course as part of clean-up', () => {
        cy.deleteCourse(commonDetails.courseID, 'curricula')
    })

    it('Verify that on the Course Activity page Credit field should be disabled', () => {
        ARDashboardPage.getCurriculaActivityReport()
        // Filter and select already created course
        ARCurriculaActivityReportPage.ChooseAddFilter(currDetails.courseName)
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getA5TableCellRecordByColumn(1)).eq(0).click()
        ARDashboardPage.getShortWait()
        cy.get(ARDashboardPage.getA5TableCellRecordByColumn(1)).eq(1).click()
        ARDashboardPage.getShortWait()
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Edit Multiple')).click()
        ARDashboardPage.getMediumWait()
        cy.get(AREditActivityPage.getElementByAriaLabelAttribute('Credits')).should('have.attr', 'readonly', 'readonly')
    })

    it("Verify that an admin is unable to Save the learner's course enrollment changes", () => {
        const score = 20
        ARDashboardPage.getCurriculaActivityReport()
        // Filter and select already created course
        ARCurriculaActivityReportPage.ChooseAddFilter(currDetails.courseName)
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getA5TableCellRecordByColumn(1)).eq(0).click()
        cy.get(ARDashboardPage.getA5TableCellRecordByColumn(1)).eq(1).click()
        ARDashboardPage.getShortWait()
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Edit Multiple')).click()
        ARDashboardPage.getMediumWait()
        cy.get(AREditActivityPage.getScoreEnrollmentTxtF()).type(score)
        cy.get(AREditActivityPage.getSaveBtn()).click()
        ARDashboardPage.getMediumWait()

        // Again try to edit multiple to see previous values didn't get saved indicating Admin is unable to do so
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Edit Multiple')).click()
        ARDashboardPage.getMediumWait()
        cy.get(AREditActivityPage.getScoreEnrollmentTxtF()).should('not.contain.text', score)
    })

    it('Verify Admin is able to edit General credits for alll learners', () => {
        // Go to the Course Page
        ARDashboardPage.getCoursesReport()
        ARDashboardPage.AddFilter('Name', 'Contains', currDetails.courseName)
        ARDashboardPage.getShortWait()
        cy.get(ARDashboardPage.getA5TableCellRecordByColumn(1)).first().click()
        cy.wrap(ARCoursesPage.WaitForElementStateToChange(ARCoursesPage.getAddEditMenuActionsByName('Edit'), 1000))
        cy.get(ARCoursesPage.getAddEditMenuActionsByName('Edit')).click()
        ARDashboardPage.getShortWait()
        
        //Delete a Credit
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Completion')).click().click()
        cy.get(ARCourseSettingsCompletionModule.getCreditContainerLabel()).contains(miscData.guia_credit_1_name).parents(ARCourseSettingsCompletionModule.getCreditContainer())
            .within(() => {
                cy.get(ARCourseSettingsCompletionModule.getDeleteCreditBtn()).click()
            })
        ARDashboardPage.getShortWait()
        cy.publishCourseAndReturnId()
    })

    it('Verify Admin is able to persist changes', () => {
        ARDashboardPage.getCurriculaActivityReport()
        // Filter and select already created course
        ARCurriculaActivityReportPage.ChooseAddFilter(currDetails.courseName)
        ARCurriculaActivityReportPage.getMediumWait()
        cy.get(ARCurriculaActivityReportPage.getA5TableCellRecordByColumn(1)).eq(0).click()
        ARCurriculaActivityReportPage.getShortWait()
        cy.get(ARCurriculaActivityReportPage.getA5TableCellRecordByColumn(1)).eq(1).click()
        ARCurriculaActivityReportPage.getShortWait()
        cy.get(ARCurriculaActivityReportPage.getAddEditMenuActionsByName('Edit Multiple')).click()
        ARCurriculaActivityReportPage.getMediumWait()
        // Assert tht admin can edit credit values for all learners
        cy.get(ARCurriculaActivityReportPage.getElementByAriaLabelAttribute("Credits")).should('not.have.attr', 'readonly', 'readonly')
    })
})