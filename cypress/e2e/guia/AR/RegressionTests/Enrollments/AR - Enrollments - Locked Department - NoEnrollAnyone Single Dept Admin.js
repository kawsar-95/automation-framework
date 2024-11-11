import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import arCourseSettingsEnrollmentRulesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
import ARCourseSettingsCatalogVisibilityModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCatalogVisibility.module'
import ARCourseSettingsCourseAdministrators from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCourseAdministrators.module'
import ARSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LEFilterMenu from '../../../../../../helpers/LE/pageObjects/Menu/LEFilterMenu'
import LECatalogPage from '../../../../../../helpers/LE/pageObjects/Catalog/LECatalogPage'
import { users } from '../../../../../../helpers/TestData/users/users'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { ocDetails } from '../../../../../../helpers/TestData/Courses/oc'
import { departments } from  '../../../../../../helpers/TestData/Department/departments'
import AROCAddEdit from '../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage'

/**
 * Testrail URL:
 * https://absorblms.testrail.io//index.php?/tests/view/432982
 * Original NASA story: https://absorblms.atlassian.net/browse/NASA-7487
 * Automation Subtask: https://absorblms.atlassian.net/browse/NASA-7521
 */

describe('AR - Enrollments - Locked Department - NoEnrollAnyone Single Dept Admin - 432982', function() {

    after(function() {
        //Delete Course
        for (let i = 0; i < commonDetails.courseIDs.length; i++) {
            cy.deleteCourse(commonDetails.courseIDs[i])
        }
    })

    it(`NoEnrollAnyone Single Dept Admin Creates Course With Self-Enrollment Rules`, () => {
        cy.apiLoginWithSession(users.depAdminDEPTB.admin_dep_username, users.depAdminDEPTB.admin_dep_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        arDashboardPage.getMenuItemOptionByName('Courses')
        
        cy.createCourse('Online Course')

         //Set locked dept and self enrollment rules
         cy.get(arAddMoreCourseSettingsModule.getEnrollmentRulesBtn()).click()
         arCoursesPage.getShortWait()
         cy.get(arCourseSettingsEnrollmentRulesModule.getSelectLockedDeptBtn()).click()
         ARSelectModal.SearchAndSelectFunction([departments.Dept_B_name])

        //Check Lock dept is empty in the beginning
        cy.get(arCourseSettingsEnrollmentRulesModule.getLockDepartmentErrorNotification()).should('contain', `Field is required.`)
        //When a locked department is selected, course availability and administrator visibility are restricted to that department only
        cy.get(arCourseSettingsEnrollmentRulesModule.getLockDepartmentNotificationBanner()).should('have.text', `When a locked department is selected, course availability and administrator visibility are restricted to that department only`)

        //Check Publish buttons are disabled
        cy.get(AROCAddEdit.getDisabledPublishBtn()).should('have.attr', 'aria-disabled', 'true')
        cy.get(AROCAddEdit.getDisableQuickPublishBtn()).should('have.attr', 'aria-disabled', 'true')

        //Set locked dept and self enrollment rules
        cy.get(arAddMoreCourseSettingsModule.getEnrollmentRulesBtn()).click()
        arCoursesPage.getShortWait()
        cy.get(arCourseSettingsEnrollmentRulesModule.getSelectLockedDeptBtn()).click()
        ARSelectModal.SearchAndSelectFunction([departments.Dept_B_name])

        //Verify 'All Learners' self enrollment option is disabled
        cy.get(arCourseSettingsEnrollmentRulesModule.getAllowAllSelfEnrollmentDisabledRadioBtn()).eq(0).should('have.attr', 'aria-disabled', 'true')

        //Verify specific self enrollment rule autofills the locked dept.
        arCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('Specific')
       
       
        cy.get(arCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentForm()).within(() => {
            cy.get(arCourseSettingsEnrollmentRulesModule.getNotificationBanner()).should('contain', `Rules are restricted by the Locked Department.`)
            cy.get(arCourseSettingsEnrollmentRulesModule.getAddRuleBtn()).click()
            arCourseSettingsEnrollmentRulesModule.getShortWait()
            cy.get(arCourseSettingsEnrollmentRulesModule.getDepartmentDDownF()).should('have.value', `.../${departments.Dept_B_name}`)
        })

        //Open Course Administrators settings
       cy.get(arAddMoreCourseSettingsModule.getCourseAdminBtn()).click()
        arCoursesPage.getShortWait()
        
                
        //Verify course visibilty settings are disabled due to locked dept
        cy.get(ARCourseSettingsCourseAdministrators.getDisabledCourseVisibilityAllAdminRadioBtn()).should('have.attr', 'aria-disabled', 'true')

    
        //Publish course
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36));
        })

        arCoursesPage.getHFJobWait() //Wait for course enrollment rule job to complete
    })

    it(`Verify Learners in Appropriate Departments Can/Cannot Access Locked Dept Course`, () => {
        let usernames = [users.learner01DeptC.learner01DeptC_username, users.learner01DeptB.learner01DeptB_username];

        for (let i = 0; i < usernames.length; i++) {
            cy.apiLoginWithSession(usernames[i], users.learner01DeptC.learner01DeptC_password)
            LEDashboardPage.getTileByNameThenClick('Catalog')
            LEFilterMenu.SearchForCourseByName(ocDetails.courseName)
            LEDashboardPage.getMediumWait()
            switch (usernames[i]) {
                case users.learner01DeptC.learner01DeptC_username:
                    LECatalogPage.getSearchCourseNotFoundMsg()
                    break;
                case users.learner01DeptB.learner01DeptB_username:
                    cy.get(LECatalogPage.getCatalogContainer()).should('have.length', 1)
                    arCoursesPage.getMediumWait()
                    LECatalogPage.getCourseCardBtnThenClick(ocDetails.courseName)
                    arCoursesPage.getMediumWait()
                    break;
            }
        }
    })

    it(`NoEnrollAnyone Single Dept Admin Creates Course With Automatic-Enrollment Rules`, () => {
        cy.apiLoginWithSession(users.depAdminDEPTB.admin_dep_username, users.depAdminDEPTB.admin_dep_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        arDashboardPage.getMenuItemOptionByName('Courses')
        
        cy.createCourse('Online Course', ocDetails.courseName2)

         //Set locked dept and self enrollment rules
         cy.get(arAddMoreCourseSettingsModule.getEnrollmentRulesBtn()).click()
         arCoursesPage.getShortWait()
         cy.get(arCourseSettingsEnrollmentRulesModule.getSelectLockedDeptBtn()).click()
         ARSelectModal.SearchAndSelectFunction([departments.Dept_B_name])

          //Check Lock dept is empty in the beginning
        cy.get(arCourseSettingsEnrollmentRulesModule.getLockDepartmentErrorNotification()).should('contain', `Field is required.`)
        //When a locked department is selected, course availability and administrator visibility are restricted to that department only
        cy.get(arCourseSettingsEnrollmentRulesModule.getLockDepartmentNotificationBanner()).should('have.text', `When a locked department is selected, course availability and administrator visibility are restricted to that department only`)

        //Check Publish buttons are disabled
        cy.get(AROCAddEdit.getDisabledPublishBtn()).should('have.attr', 'aria-disabled', 'true')
        cy.get(AROCAddEdit.getDisableQuickPublishBtn()).should('have.attr', 'aria-disabled', 'true')

        //Set locked dept and automatic enrollment rules
        cy.get(arAddMoreCourseSettingsModule.getEnrollmentRulesBtn()).click()
        arCoursesPage.getShortWait()
        cy.get(arCourseSettingsEnrollmentRulesModule.getSelectLockedDeptBtn()).click()
        ARSelectModal.SearchAndSelectFunction([departments.Dept_B_name])
        arCoursesPage.getMediumWait()

        //Verify 'All Learners' automatic enrollment option is disabled
        cy.get(arCourseSettingsEnrollmentRulesModule.getEnableAutomaticEnrollmentForm()).within(() => {
            cy.get(arCourseSettingsEnrollmentRulesModule.getEnrollmentRadioBtnLable()).contains('All Learners')
                .parent().children().should('have.attr', 'aria-disabled', 'true')
        })

        //Verify automatic enrollment rule autofills the locked dept.
        arCourseSettingsEnrollmentRulesModule.getEnableAutomaticEnrollmentRadioBtn('Specific') //leaving original code incase it is needed
       
        
        cy.get(arCourseSettingsEnrollmentRulesModule.getEnableAutomaticEnrollmentForm()).within(() => {
            cy.get(arCourseSettingsEnrollmentRulesModule.getNotificationBanner()).should('contain', `Rules are restricted by the Locked Department.`)
            cy.get(arCourseSettingsEnrollmentRulesModule.getAddRuleBtn()).click()
            arCourseSettingsEnrollmentRulesModule.getShortWait()
            cy.get(arCourseSettingsEnrollmentRulesModule.getDepartmentDDownF()).should('have.value', `.../${departments.Dept_B_name}`)
        })

         //Open Course Administrators settings
        cy.get(arAddMoreCourseSettingsModule.getCourseAdminBtn()).click()
        arCoursesPage.getShortWait()
        
         //Verify course visibilty settings are disabled due to locked dept
         cy.get(ARCourseSettingsCourseAdministrators.getDisabledCourseVisibilityAllAdminRadioBtn()).should('have.attr', 'aria-disabled', 'true')
   
        //Publish course
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36));
        })

        arCoursesPage.getHFJobWait() //Wait for course enrollment rule job to complete
    })

    it(`Verify Learner in Appropriate Department was Correctly Auto-Enrolled into Locked Dept Course`, () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        arDashboardPage.getMenuItemOptionByName('Courses')
        
        cy.wrap(arCoursesPage.AddFilter('Name', 'Contains', ocDetails.courseName2))
        arCoursesPage.getLongWait()
        cy.get(arCoursesPage.getTableCellName(2)).contains(ocDetails.courseName2).click()
        cy.wrap(arCoursesPage.WaitForElementStateToChange(arCoursesPage.getAddEditMenuActionsByName('Course Enrollments'), 1000))
        cy.get(arCoursesPage.getAddEditMenuActionsByName('Course Enrollments')).click()
        cy.intercept('/api/rest/v2/admin/reports/course-enrollments/operations').as('getCourseEnrollments').wait('@getCourseEnrollments')
        arCoursesPage.getLongWait()
        //Verify learner in Dept B was correctly auto-enrolled
        cy.get(arCoursesPage.getTableCellRecord()).contains(users.learner01DeptB.learner01DeptB_username).parent().within(() => {
            cy.get('td').eq(5).should('have.text', '100')
            cy.get('td').eq(6).should('have.text', 'Complete')
            cy.get('td').eq(7).should('have.text', 'Yes')
        })
    })
})