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
import ARDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'

describe('AR - Enrollments - Locked Department - EnrollAnyone Single Dept Admin', function() {

    after(function() {
        //Delete Course
        for (let i = 0; i < commonDetails.courseIDs.length; i++) {
            cy.deleteCourse(commonDetails.courseIDs[i])
        }
        commonDetails.courseIDs = []; //reset for next test
    })

    it(`EnrollAnyone Single Dept Admin Creates Course With Self-Enrollment Rules`, () => {
        cy.apiLoginWithSession(users.depAdminDEPTE.admin_dep_username, users.depAdminDEPTE.admin_dep_password, '/admin')
        arDashboardPage.getCoursesReport()
        
        cy.createCourse('Online Course')

        //Set locked dept and self enrollment rules
        cy.get(arAddMoreCourseSettingsModule.getEnrollmentRulesBtn()).click()
        arCoursesPage.getShortWait()
        cy.get(arCourseSettingsEnrollmentRulesModule.getSelectLockedDeptBtn()).click()
        ARSelectModal.SearchAndSelectFunction([departments.Dept_E_name])

        //Verify specific self enrollment rule does not autofill the locked dept and a department can be selected
        arCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('Specific')
        arCourseSettingsEnrollmentRulesModule.getShortWait()
        cy.get(arCourseSettingsEnrollmentRulesModule.getNotificationBanner()).should('contain', `Rules are restricted by the Locked Department.`)
        
        
        cy.get(arCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentForm()).within(() => {
            cy.get(arCourseSettingsEnrollmentRulesModule.getAddRuleBtn()).click()
            arCourseSettingsEnrollmentRulesModule.getShortWait()
            cy.get(arCourseSettingsEnrollmentRulesModule.getRuleSelectionTypeDDown()).first().click()
            arCourseSettingsEnrollmentRulesModule.getShortWait()
            cy.get(arCourseSettingsEnrollmentRulesModule.getDepartmentTypeSearchtxt()).type('Department')
            cy.get(arCourseSettingsEnrollmentRulesModule.getSelectionTypeOpt()).contains('Department').click()
            cy.get(arCourseSettingsEnrollmentRulesModule.getDepartmentDDownF()).should('have.value', `.../${departments.Dept_E_name}`)
        })

        //Open Course Administrators settings
        cy.get(arAddMoreCourseSettingsModule.getCourseAdminBtn()).click()
        

        //Verify course visibilty settings are disabled due to locked dept
        cy.get(ARCourseSettingsCourseAdministrators.getDisabledCourseVisibilityAllAdminRadioBtn()).should('have.attr', 'aria-disabled', 'true')


        //Verify Department Visibility Rule is auto filled
        cy.get(ARCourseSettingsCourseAdministrators.getDepartmentDDownF()).should('have.value', `.../${departments.Dept_E_name}`)
       
        //Publish course
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36));
        })
        cy.get(ARDashboardPage.getToastSuccessMsg()).should('be.visible')
    })

    it(`Verify Learners in Appropriate Departments Can/Cannot Access Locked Dept Course`, () => {
        let usernames = [users.learner02DeptE.learner02DeptE_username, users.learner01DeptB.learner01DeptB_username];

        for (let i = 0; i < usernames.length; i++) {
            cy.apiLoginWithSession(usernames[i], users.learner01DeptC.learner01DeptC_password)
            LEDashboardPage.getTileByNameThenClick('Catalog')
            LEFilterMenu.SearchForCourseByName(ocDetails.courseName)
   
            switch (usernames[i]) {
                case users.learner01DeptB.learner01DeptB_username:
                    LECatalogPage.getSearchCourseNotFoundMsg()
                    break;
                case users.learner02DeptE.learner02DeptE_username:
                    cy.get(LECatalogPage.getCatalogContainer()).should('have.length', 1)
                    LECatalogPage.getCourseCardBtnThenClick(ocDetails.courseName)
                    arCoursesPage.getMediumWait()
                    break;
            }
        }
    })

    it(`EnrollAnyone Single Dept Admin Creates Course With Automatic-Enrollment Rules`, () => {
        cy.apiLoginWithSession(users.depAdminDEPTE.admin_dep_username, users.depAdminDEPTE.admin_dep_password, '/admin')
        ARDashboardPage.getCoursesReport()
        
        cy.createCourse('Online Course', ocDetails.courseName2)

        //Set locked dept and self enrollment rules
       cy.get(arAddMoreCourseSettingsModule.getEnrollmentRulesBtn()).click()
        arCoursesPage.getShortWait()
        cy.get(arCourseSettingsEnrollmentRulesModule.getSelectLockedDeptBtn()).click()
        ARSelectModal.SearchAndSelectFunction([departments.Dept_E_name])

        //Verify automatic enrollment rule does not autofill the locked dept and a department can be selected
        //arCourseSettingsEnrollmentRulesModule.getEnableAutomaticEnrollmentRadioBtn('Specific') //original code leaving commented for reference
        cy.get(arCourseSettingsEnrollmentRulesModule.getAutoEnrollmentRadioBtn()).eq(1).click({force: true})
        cy.get(arCourseSettingsEnrollmentRulesModule.getNotificationBanner()).should('contain', `Rules are restricted by the Locked Department.`)
        cy.get(arCourseSettingsEnrollmentRulesModule.getEnableAutomaticEnrollmentForm()).within(() => {
            cy.get(arCourseSettingsEnrollmentRulesModule.getAddRuleBtn()).click()
            arCourseSettingsEnrollmentRulesModule.getShortWait()
           cy.get(arCourseSettingsEnrollmentRulesModule.getRuleSelectionTypeDDown()).first().click()
            cy.get(arCourseSettingsEnrollmentRulesModule.getSelectionTypeSearchTxt()).first().type('Department')
            cy.get(arCourseSettingsEnrollmentRulesModule.getSelectionTypeOpt()).contains('Department').click()
            cy.get(arCourseSettingsEnrollmentRulesModule.getDepartmentDDownF()).should('have.value', `.../${departments.Dept_E_name}`)
        })

        //Open Course Administrators settings
        cy.get(arAddMoreCourseSettingsModule.getCourseAdminBtn()).click()
        arCoursesPage.getShortWait()
        
        //Verify course visibilty settings are disabled due to locked dept
        cy.get(ARCourseSettingsCourseAdministrators.getDisabledCourseVisibilityAllAdminRadioBtn()).should('have.attr', 'aria-disabled', 'true')

        //Verify Department Visibility Rule is auto filled
       cy.get(ARCourseSettingsCourseAdministrators.getDepartmentDDownF()).should('have.value', `.../${departments.Dept_E_name}`)
       
        //Publish course
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36));
        })
        arCoursesPage.getHFJobWait() //Wait for course enrollment rule job to complete
    })

    it(`Verify Learner in Appropriate Department was Correctly Auto-Enrolled into Locked Dept Course`, () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getCoursesReport()
        
        cy.wrap(arCoursesPage.AddFilter('Name', 'Contains', ocDetails.courseName2))
        arCoursesPage.getMediumWait()
        cy.get(arCoursesPage.getTableCellName(2)).contains(ocDetails.courseName2).click()
        cy.wrap(arCoursesPage.WaitForElementStateToChange(arCoursesPage.getAddEditMenuActionsByName('Course Enrollments'), 1000))
        cy.get(arCoursesPage.getAddEditMenuActionsByName('Course Enrollments')).click()
        cy.intercept('/api/rest/v2/admin/reports/course-enrollments/operations').as('getCourseEnrollments').wait('@getCourseEnrollments')
        arCoursesPage.getShortWait()
        //Verify learner in Dept B was correctly auto-enrolled
        cy.get(arCoursesPage.getTableCellRecord()).contains(users.learner02DeptE.learner02DeptE_username).parent().within(() => {
            cy.get('td').eq(5).should('have.text', '100')
            cy.get('td').eq(6).should('have.text', 'Complete')
            cy.get('td').eq(7).should('have.text', 'Yes')
        })
    })
})

describe('AR - Enrollments - Locked Department - EnrollAnyone Single Dept Admin - All Learners', function() {

    after(function() {
        //Delete Course
        for (let i = 0; i < commonDetails.courseIDs.length; i++) {
            cy.deleteCourse(commonDetails.courseIDs[i])
        }
    })

    it(`EnrollAnyone Single Dept Admin Creates Course With Self-Enrollment = All Learners`, () => {
        cy.apiLoginWithSession(users.depAdminDEPTE.admin_dep_username, users.depAdminDEPTE.admin_dep_password, '/admin')
        ARDashboardPage.getCoursesReport()
        
        cy.createCourse('Online Course')

        //Set locked dept and self enrollment rules
        cy.get(arAddMoreCourseSettingsModule.getEnrollmentRulesBtn()).click()
        arCoursesPage.getShortWait()
        cy.get(arCourseSettingsEnrollmentRulesModule.getSelectLockedDeptBtn()).click()
        ARSelectModal.SearchAndSelectFunction([departments.Dept_E_name])

        //Verify specific self enrollment rule can be set to All Learners
        arCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')
        cy.get(arCourseSettingsEnrollmentRulesModule.getAllEnrollmentRadioBtn()).eq(0).click({force: true})

        //Publish course
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36));
        })
        arCoursesPage.getHFJobWait() //Wait for course enrollment rule job to complete
    })

    it(`Verify Learner Outside of Locked Dept can Access Locked Dept Course With Self-Enrollment = All Learners`, () => {
        cy.apiLoginWithSession(users.learner01DeptB.learner01DeptB_username, users.learner01DeptB.learner01DeptB_password)
        LEDashboardPage.getTileByNameThenClick('Catalog')
        LEFilterMenu.SearchForCourseByName(ocDetails.courseName)
        LEDashboardPage.getMediumWait() //original wait time
        cy.get(LECatalogPage.getCatalogContainer()).should('have.length', 1)
        LECatalogPage.getCourseCardBtnThenClick(ocDetails.courseName)
        arCoursesPage.getMediumWait()
    })

    it(`EnrollAnyone Single Dept Admin Creates Course With Automatic-Enrollment = All Learners`, () => {
        cy.apiLoginWithSession(users.depAdminDEPTE.admin_dep_username, users.depAdminDEPTE.admin_dep_password, '/admin')
        ARDashboardPage.getCoursesReport()
        
        cy.createCourse('Online Course', ocDetails.courseName2)

        //Set locked dept and self enrollment rules
        cy.get(arAddMoreCourseSettingsModule.getEnrollmentRulesBtn()).click()
        arCoursesPage.getShortWait()
        cy.get(arCourseSettingsEnrollmentRulesModule.getSelectLockedDeptBtn()).click()
        ARSelectModal.SearchAndSelectFunction([departments.Dept_E_name])

        //Verify automatic enrollment rule can be set to All Learners
       // arCourseSettingsEnrollmentRulesModule.getEnableAutomaticEnrollmentRadioBtn('All Learners') //original code leaving commented for reference
        cy.get(arCourseSettingsEnrollmentRulesModule.getAutoAllUserEnrollmentRadioBtn()).eq(1).click({force: true})
        cy.get(arCourseSettingsEnrollmentRulesModule.getEnrollmentDescription()).should('contain', 'This course will automatically enroll all learners.')

        //We wont publish this course as we do not wajnt to enroll all learners in the portal.
    })
})