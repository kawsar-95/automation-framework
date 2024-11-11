import departments from '../../../../../fixtures/departments.json'
import ARDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARCourseSettingsCourseAdministratorsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCourseAdministrators.module'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import ARCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import AROCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage'
import ARSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import { ocDetails } from '../../../../../../helpers/TestData/Courses/oc'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../helpers/TestData/users/users'


describe('C782 AR - CED - OC - Department Editor Set By Admin', function () {

    it('Create OC Course, Set Deparment Editor Who Can Edit The Course', () => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Courses'))
        
        ARDashboardPage.getMediumWait()

        //Create Online Course
        cy.createCourse('Online Course')

        //Open Course Administrators Section
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Course Administrators')).click()
        AROCAddEditPage.getShortWait()

        //Select Department Course Visibilty Radio Button
        cy.get(ARCourseSettingsCourseAdministratorsModule.getCourseVisibilityRadioBtn()).contains('All Admins').click()

        //Select a Department for Primary Department Editor only DepartmentC Admin is allowed to edit the course
        cy.get(ARCourseSettingsCourseAdministratorsModule.getSelectPrimaryDepartmentEditorBtn()).click()
        ARSelectModal.SearchAndSelectFunction([departments.DEPTC_NAME])
        ARDashboardPage.getShortWait()

        // Add Additional Admin Editor
        cy.get(ARCourseSettingsCourseAdministratorsModule.getAdditionalAdminEditorsDDown()).click()
        cy.get(ARCourseSettingsCourseAdministratorsModule.getAdditionalAdminEditorsSearchTxtF()).type(users.depAdminDEPTC.admin_dep_fname + ' ' + users.depAdminDEPTC.admin_dep_lname)
        ARCoursesPage.getShortWait()

        cy.get(ARCourseSettingsCourseAdministratorsModule.getAdditionalAdminEditorsOpt()).contains(users.depAdminDEPTC.admin_dep_fname + ' ' + users.depAdminDEPTC.admin_dep_lname).click()
        ARCoursesPage.getShortWait()

        //Remove Primary Department Editor
        cy.get(ARCourseSettingsCourseAdministratorsModule.getSelectPrimaryDepartmentEditorBtn()).click()
        ARSelectModal.SearchAndSelectFunction([departments.DEPTC_NAME])
        ARDashboardPage.getShortWait()

        //Now Select Again Primary Department Editor
        cy.get(ARCourseSettingsCourseAdministratorsModule.getSelectPrimaryDepartmentEditorBtn()).click()
        ARSelectModal.SearchAndSelectFunction([departments.DEPTC_NAME])
        ARDashboardPage.getShortWait()

        //Publish Course
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
    })


    it('Edit OC Course, Authorized Primary Department Editor Can Edit The Course', () => {
        //Sign into admin side as department admin, navigate to Courses
        //DepartmentC Admin is Allowed to edit the course
        cy.apiLoginWithSession(users.depAdminDEPTC.admin_dep_username, users.depAdminDEPTC.admin_dep_password, '/admin')
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Courses'))
        
        ARDashboardPage.getMediumWait()

        //Authorize admin can edit the course
        cy.wrap(ARCoursesPage.AddFilter('Name', 'Contains', ocDetails.courseName))
        ARCoursesPage.getMediumWait()
        cy.get(ARCoursesPage.getTableCellName(2)).contains(ocDetails.courseName).click()
        cy.wrap(ARCoursesPage.WaitForElementStateToChange(ARCoursesPage.getAddEditMenuActionsByName('Edit'), 1000))

        //Asserting Auuthorized admin can edit the course, edit button is enabled
        cy.get(ARCoursesPage.getAddEditMenuActionsByName('Edit')).should('have.attr', 'aria-disabled', 'false')
    })

    it('Edit OC Course, Unauthorized Primary Department Editor Can not Edit The Course', () => {
        //Sign into admin side as department admin, navigate to Courses
        //DepartmentE Admin is not allowed to edit the course
        cy.apiLoginWithSession(users.depAdminDEPTE.admin_dep_username, users.depAdminDEPTE.admin_dep_password, '/admin')
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Courses'))
        
        ARDashboardPage.getMediumWait()

        //Unauthorized admin can not edit the course
        cy.wrap(ARCoursesPage.AddFilter('Name', 'Contains', ocDetails.courseName))
        ARCoursesPage.getMediumWait()
        cy.get(ARCoursesPage.getTableCellName(2)).contains(ocDetails.courseName).click()
        cy.wrap(ARCoursesPage.WaitForElementStateToChange(ARCoursesPage.getAddEditMenuActionsByName('Edit'), 1000))

        //Asserting Unauthorized admin can't edit the course, edit button is disabled
        cy.get(ARCoursesPage.getAddEditMenuActionsByName('Edit')).should('have.attr', 'aria-disabled', 'true')
    })

    after(function () {
        //Delete Course
        cy.deleteCourse(commonDetails.courseID)
    })
})

