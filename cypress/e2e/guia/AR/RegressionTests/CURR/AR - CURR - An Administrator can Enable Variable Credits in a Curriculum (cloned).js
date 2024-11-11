import ARCURRAddEditPage from "../../../../../../helpers/AR/pageObjects/Courses/CURR/ARCURRAddEditPage"
import ARCourseSettingsCompletionModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCompletion.module'
import ARAddMoreCourseSettingsModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARSelectModal from "../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal"
import { commonDetails } from "../../../../../../helpers/TestData/Courses/commonDetails"
import { courses } from "../../../../../../helpers/TestData/Courses/courses"
import { currDetails } from "../../../../../../helpers/TestData/Courses/curr"
import { miscData } from "../../../../../../helpers/TestData/Misc/misc"
import { users } from "../../../../../../helpers/TestData/users/users"

describe('C979 - AR - CURR - An Administrator can Enable Variable Credits in a Curriculum (cloned)', () => {
    beforeEach(() => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, "/admin")
        ARDashboardPage.getMediumWait()
        // Navigate to Courses
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Courses'))
        
    })

    after(() => {
        cy.deleteCourse(commonDetails.courseID, 'curricula')
    })

    it('Rule Definition', () => {
        // Create curriculum
        cy.createCourse('Curriculum')

        // Add courses to curriculum - verify multiple courses are added in the order they are selected
        ARSelectModal.SearchAndSelectFunction([courses.oc_filter_01_name, courses.oc_filter_02_name])
        ARSelectModal.getLShortWait()

        // Open Completion Section
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBannerBtn('Completion')).click()
        ARDashboardPage.getMediumWait()

        cy.get(ARCourseSettingsCompletionModule.getAddCreditButton()).should('exist').click()
        
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
            cy.get(ARCourseSettingsCompletionModule.getNumInputF()).type('5')
        })

        // Select maximum/minimum
        cy.get(ARDashboardPage.getElementByDataNameAttribute('label')).contains('Minimum').click()

        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
    })

    it('Edit Course and remove rules', () => {
        // Edit curriculum
        cy.editCourse(currDetails.courseName)
        ARCURRAddEditPage.getMediumWait()

        //Open Completion Section
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBannerBtn('Completion')).click()
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