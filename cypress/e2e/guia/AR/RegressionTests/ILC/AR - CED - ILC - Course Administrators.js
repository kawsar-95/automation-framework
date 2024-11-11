/* AR - CED - ILC - Course Administrators.js */
import departments from '../../../../../fixtures/departments.json'
import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARCourseSettingsCourseAdministratorsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCourseAdministrators.module'
import arSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import ARILCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage'
import { ilcDetails } from '../../../../../../helpers/TestData/Courses/ilc'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../helpers/TestData/users/users'


describe('AR - Regress - CED - ILC - Course Administrators - Create Course', function(){
    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        
    })

    after(function() {
        cy.deleteCourse(commonDetails.courseID, 'instructor-led-courses-new')
    })

    it('Verify Course Administrators Section Fields, Publish ILC Course', () => {
        cy.createCourse('Instructor Led')

        //Open Course Administrators Section
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Course Administrators')).click()
        ARILCAddEditPage.getShortWait()

        //Select Department Course Visibilty Radio Button
        cy.get(ARCourseSettingsCourseAdministratorsModule.getCourseVisibilityRadioBtn()).contains('Department').click().click()

        //Add Visibility Rule
        cy.get(ARCourseSettingsCourseAdministratorsModule.getDepartmentVisibilityAddRuleBtn()).click()

        //Select a Department For Department Visibility
        cy.get(ARCourseSettingsCourseAdministratorsModule.getVisibilityRuleSelectDepartmentBtn()).click()
        arSelectModal.SelectFunction(departments.DEPT_TOP_NAME)

        //Select a Department for Primary Department Editor
        cy.get(ARCourseSettingsCourseAdministratorsModule.getSelectPrimaryDepartmentEditorBtn()).click()
        arSelectModal.SearchAndSelectFunction([departments.SUB_DEPT_B_NAME])

        //Add Additional Admin Editor
        cy.get(ARCourseSettingsCourseAdministratorsModule.getAdditionalAdminEditorsDDown()).click()
        cy.get(ARCourseSettingsCourseAdministratorsModule.getAdditionalAdminEditorsSearchTxtF())
            .type(users.sysAdmin.admin_sys_01_fname + ' ' + users.sysAdmin.admin_sys_01_lname)
        cy.get(ARCourseSettingsCourseAdministratorsModule.getAdditionalAdminEditorsOpt())
            .contains(users.sysAdmin.admin_sys_01_fname + ' ' + users.sysAdmin.admin_sys_01_lname).click()

        //Publish ILC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
    })

    it('Edit ILC Course & Verify Course Administrator Section Fields Have Been Persisted, Select New Departments', () => {
        cy.editCourse(ilcDetails.courseName)
        ARILCAddEditPage.getMediumWait()

        //Open Course Administrators Section
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Course Administrators')).click()
        ARILCAddEditPage.getShortWait()

        //Assert that the Department For Department Visibility Persisted
        cy.get(ARCourseSettingsCourseAdministratorsModule.getVisibilityRuleDepartmentTxtF()).should('have.value', departments.DEPT_TOP_NAME)

        //Assert that the Department for Primary Department Editor Persisted
        cy.get(ARCourseSettingsCourseAdministratorsModule.getPrimaryDepartmentEditor()).should('have.value', '.../' + departments.SUB_DEPT_B_NAME)

        //Assert that the Additional Admin Editor Persisted
        cy.get(ARCourseSettingsCourseAdministratorsModule.getAdditionalAdminEditorsDDown())
            .should('contain.text', users.sysAdmin.admin_sys_01_fname + ' ' + users.sysAdmin.admin_sys_01_lname)

        //Select a New Department For Department Visibility
        cy.get(ARCourseSettingsCourseAdministratorsModule.getVisibilityRuleSelectDepartmentBtn()).click()
        arSelectModal.SearchAndSelectFunction([departments.SUB_DEPT_A_SUB_DEPT_NAME])

        //Select a New Department For Primary Department Editor
        cy.get(ARCourseSettingsCourseAdministratorsModule.getSelectPrimaryDepartmentEditorBtn()).click()
        arSelectModal.SearchAndSelectFunction([departments.SUB_DEPT_A_NAME])

        //Modify the Primary Deparment Editor to Include All Sub-Departments
        cy.get(ARCourseSettingsCourseAdministratorsModule.getPrimaryDepartmentEditorChildrenDDown()).click()
        cy.get(ARCourseSettingsCourseAdministratorsModule.getPrimaryDepartmentEditorChildrenDDownOpt()).contains('Include All Sub-Departments').click()

        //Add a Second Additional Admin Editor
        cy.get(ARCourseSettingsCourseAdministratorsModule.getAdditionalAdminEditorsDDown()).click()
        cy.get(ARCourseSettingsCourseAdministratorsModule.getAdditionalAdminEditorsSearchTxtF())
            .type(users.sysAdminLogInOut.admin_sys_loginout_fname + ' ' + users.sysAdminLogInOut.admin_sys_loginout_lname)
        cy.get(ARCourseSettingsCourseAdministratorsModule.getAdditionalAdminEditorsOpt())
            .contains(users.sysAdminLogInOut.admin_sys_loginout_fname + ' ' + users.sysAdminLogInOut.admin_sys_loginout_lname).click()

        //Publish ILC
        cy.publishCourse()
    })

    it('Edit ILC Course & Verify New Course Administrator Section Fields Have Been Persisted, Delete Visibility Rule', () => {
        cy.editCourse(ilcDetails.courseName)
        ARILCAddEditPage.getMediumWait()

        //Open Course Administrators Section
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Course Administrators')).click()
        ARILCAddEditPage.getShortWait()

        //Assert that the Department For Department Visibility Persisted
        cy.get(ARCourseSettingsCourseAdministratorsModule.getVisibilityRuleDepartmentTxtF()).should('have.value', '.../' + departments.SUB_DEPT_A_SUB_DEPT_NAME)

        //Assert that the Department for Primary Department Editor Persisted
        cy.get(ARCourseSettingsCourseAdministratorsModule.getPrimaryDepartmentEditor()).should('have.value', '.../' + departments.SUB_DEPT_A_NAME)
        
        //Assert that the Department for Primary Department Editor Children Persisted
        cy.get(ARCourseSettingsCourseAdministratorsModule.getPrimaryDepartmentEditorChildren()).should('have.value', 'Include All Sub-Departments')

        //Assert that the Additional Admin Editor Persisted
        cy.get(ARCourseSettingsCourseAdministratorsModule.getAdditionalAdminEditorsDDown())
            .should('contain.text', users.sysAdmin.admin_sys_01_fname + ' ' + users.sysAdmin.admin_sys_01_lname)
                .and('contain.text', users.sysAdminLogInOut.admin_sys_loginout_fname + ' ' + users.sysAdminLogInOut.admin_sys_loginout_lname)

        //Delete Department Visibility Rule
        ARCourseSettingsCourseAdministratorsModule.getDeleteVisibilityRuleByDepartmentName('.../' + departments.SUB_DEPT_A_SUB_DEPT_NAME)

        //Select All Admins For Course Visibility
        cy.get(ARCourseSettingsCourseAdministratorsModule.getCourseVisibilityRadioBtn()).contains('All Admins').click().click()

        //Publish ILC
        cy.publishCourse()
    })

    it('Edit ILC Course & Verify Deletion of Visibility Rule Persisted', () => {
        cy.editCourse(ilcDetails.courseName)
        ARILCAddEditPage.getMediumWait()

        //Open Course Administrators Section
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Course Administrators')).click()
        ARILCAddEditPage.getShortWait()

        //Switch Course Visibilty to Department and Assert that the Rule was Deleted
        cy.get(ARCourseSettingsCourseAdministratorsModule.getCourseVisibilityRadioBtn()).contains('Department').click().click()
        cy.get(ARCourseSettingsCourseAdministratorsModule.getVisibilityRuleDepartmentTxtF()).should('not.exist')
    })
})