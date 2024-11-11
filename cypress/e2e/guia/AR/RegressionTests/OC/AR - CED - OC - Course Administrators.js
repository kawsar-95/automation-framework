import departments from '../../../../../fixtures/departments.json'
import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARCourseSettingsCourseAdministratorsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCourseAdministrators.module'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import arCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import AROCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage'
import arSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import { ocDetails } from '../../../../../../helpers/TestData/Courses/oc'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../helpers/TestData/users/users'


describe('AR - Regress - CED - OC - Course Administrators - Create Course', function(){

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        
    })

    it('Create OC Course, Verify Course Administrators Section Fields, & Publish Course', () => {
        cy.createCourse('Online Course')

        //Open Course Administrators Section
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Course Administrators')).click()
        AROCAddEditPage.getShortWait()

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

        //Publish Course
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
    })
})

describe('AR - Regress - CED - OC - Course Administrators', function(){

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        
        //Filter for Course & Edit it
        cy.editCourse(ocDetails.courseName)
        AROCAddEditPage.getMediumWait()
        //Open Course Administrators Section
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Course Administrators')).click()
        AROCAddEditPage.getShortWait()
    })

    after(function() {
        //Delete Course
        AROCAddEditPage.getShortWait()
        cy.deleteCourse(commonDetails.courseID)
    })

    it('Edit OC Course, Verify Course Administrator Section Fields Have Been Persisted, Select New Departments', () => {
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
        cy.get(ARCourseSettingsCourseAdministratorsModule.getPrimaryDepartmentEditorDDown()).click()
        cy.get(ARCourseSettingsCourseAdministratorsModule.getPrimaryDepartmentEditorOpt()).contains('Include All Sub-Departments').click()

        //Add a Second Additional Admin Editor
        cy.get(ARCourseSettingsCourseAdministratorsModule.getAdditionalAdminEditorsDDown()).click()
        cy.get(ARCourseSettingsCourseAdministratorsModule.getAdditionalAdminEditorsSearchTxtF())
            .type(users.sysAdminLogInOut.admin_sys_loginout_fname + ' ' + users.sysAdminLogInOut.admin_sys_loginout_lname)
        cy.get(ARCourseSettingsCourseAdministratorsModule.getAdditionalAdminEditorsOpt())
            .contains(users.sysAdminLogInOut.admin_sys_loginout_fname + ' ' + users.sysAdminLogInOut.admin_sys_loginout_lname).click()

        //Publish Course
        cy.publishCourse()
    })

    it('Edit OC Course & Verify New Course Administrator Section Fields Have Been Persisted, Delete Visibility Rule', () => {
        //Assert that the Department For Department Visibility Persisted
        cy.get(ARCourseSettingsCourseAdministratorsModule.getVisibilityRuleDepartmentTxtF()).should('have.value', '.../' + departments.SUB_DEPT_A_SUB_DEPT_NAME)

        //Assert that the Department for Primary Department Editor Persisted
        cy.get(ARCourseSettingsCourseAdministratorsModule.getPrimaryDepartmentEditor()).should('have.value', '.../' + departments.SUB_DEPT_A_NAME)

        //Assert that the Additional Admin Editor Persisted
        cy.get(ARCourseSettingsCourseAdministratorsModule.getAdditionalAdminEditorsDDown())
            .should('contain.text', users.sysAdmin.admin_sys_01_fname + ' ' + users.sysAdmin.admin_sys_01_lname)
                .and('contain.text', users.sysAdminLogInOut.admin_sys_loginout_fname + ' ' + users.sysAdminLogInOut.admin_sys_loginout_lname)

        //Delete Department Visibility Rule
        ARCourseSettingsCourseAdministratorsModule.getDeleteVisibilityRuleByDepartmentName('.../' + departments.SUB_DEPT_A_SUB_DEPT_NAME)

        //Select All Admins For Course Visibility
        cy.get(ARCourseSettingsCourseAdministratorsModule.getCourseVisibilityRadioBtn()).contains('All Admins').click().click()

        //Publish Course
        cy.publishCourse()
    })

    it('Edit OC Course & Verify Deletion of Visibility Rule Persisted', () => {
        //Switch Course Visibilty to Department and Assert that the Rule was Deleted
        cy.get(ARCourseSettingsCourseAdministratorsModule.getCourseVisibilityRadioBtn()).contains('Department').dblclick()
        cy.get(ARCourseSettingsCourseAdministratorsModule.getVisibilityRuleDepartmentTxtF()).should('not.exist')
    })
})