import ARAddMoreCourseSettingsModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module"
import ARCourseSettingsCompletionModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCompletion.module"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import { commonDetails } from "../../../../../../helpers/TestData/Courses/commonDetails"
import { ilcDetails } from "../../../../../../helpers/TestData/Courses/ilc"
import { miscData } from "../../../../../../helpers/TestData/Misc/misc"
import { users } from "../../../../../../helpers/TestData/users/users"

describe('C934 - Variable Credits Custom Field Rule Definition', () => {
    beforeEach(() => {
        cy.apiLoginWithSession(
            users.sysAdmin.admin_sys_01_username,
            users.sysAdmin.admin_sys_01_password,
            "/admin"
        )
    })
    after(() => {
        //Delete Course
        cy.deleteCourse(commonDetails.courseID, 'instructor-led-courses-new')
    })
    it('Rule Definition', () => {
        ARDashboardPage.getMediumWait()
        // Navigate to Courses
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Courses'))
        

        cy.createCourse('Instructor Led')

        //Open Completion Section
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Completion')).click()
        ARDashboardPage.getShortWait()

        cy.get(ARCourseSettingsCompletionModule.getAddCreditBtn()).should('exist').click()
        // Add/edit rules
        cy.get(ARCourseSettingsCompletionModule.getCreditTypeDDown()).click()
        ARDashboardPage.getShortWait()
        cy.get(ARCourseSettingsCompletionModule.getAllCreditTypeSelections()).get(ARCourseSettingsCompletionModule.getAllCreditTypeOptions()).contains(miscData.guia_credit_1_name).click()
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Amount Awarded')).clear().type('12')
        cy.get(ARCourseSettingsCompletionModule.getAddVariableCreditRuleBtn()).click()
        cy.get(ARCourseSettingsCompletionModule.getVariableCreditFieldDDown()).eq(0).click()
        cy.get(ARCourseSettingsCompletionModule.getVariableCreditFieldOpt()).contains('GUIA Text Custom Field').click()
        cy.get(ARCourseSettingsCompletionModule.getVariableCreditTxtF()).type(commonDetails.variableCreditRuleName)
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARCourseSettingsCompletionModule.getVariableCreditAmountTxt())).clear().type('8')
        // Combine different rule types
        cy.get(ARDashboardPage.getElementByDataNameAttribute('add')).contains('Refine Rule').click()
        cy.get(ARDashboardPage.getElementByDataNameAttribute('availability-rule-item')).eq(1).within(() => {
            cy.get(ARDashboardPage.getDDownField()).eq(0).click()
            cy.get(ARCourseSettingsCompletionModule.getVariableCreditFieldOpt()).contains('GUIA Number Custom Field').click()
            cy.get(ARDashboardPage.getNumF()).type('5')
        })
        // Select maximum/minimum
        cy.get(ARDashboardPage.getElementByDataNameAttribute('label')).contains('Minimum').click()
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
        ARDashboardPage.getLongWait()
    })
    it('Edit Course and remove rules', () => {
        ARDashboardPage.getMediumWait()
        // Navigate to Courses
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Courses'))
        

        cy.editCourse(ilcDetails.courseName)
        //Open Completion Section
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Completion')).click()
        ARDashboardPage.getShortWait()

        cy.get(ARDashboardPage.getElementByDataNameAttribute('course-multi-credits')).within(() => {
            cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Expand')).click()
        })
        // Remove Rules
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Rule 1 of 1')).within(() => {
            cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Delete')).eq(0).click()
            cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Delete')).eq(0).click()
        })
        // Remove added Credit
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Credit 1 of 1')).within(() => {
            cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Delete')).eq(0).click()
        })
        // Publish course
        cy.publishCourse()
        ARDashboardPage.getLongWait()
    })

})