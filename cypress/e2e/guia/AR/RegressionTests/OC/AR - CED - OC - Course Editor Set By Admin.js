import ARDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARCourseSettingsCourseAdministratorsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCourseAdministrators.module'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import AROCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage'
import ARCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import { ocDetails } from '../../../../../../helpers/TestData/Courses/oc'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../helpers/TestData/users/users'


describe('C781 AR - CED - OC - Course Editor Set By Admin', function () {


    it('Create OC Course, Add Multiple Additional Admin Course Editor', () => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Courses'))
        
        ARDashboardPage.getMediumWait()

        cy.createCourse('Online Course')

        //Open Course Administrators Section
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Course Administrators')).click()
        AROCAddEditPage.getShortWait()

        //Select Department Course Visibilty Radio Button
        cy.get(ARCourseSettingsCourseAdministratorsModule.getCourseVisibilityRadioBtn()).contains('All Admins').click()

        //Add Additional Admin Editor
        cy.get(ARCourseSettingsCourseAdministratorsModule.getAdditionalAdminEditorsDDown()).click()
        cy.get(ARCourseSettingsCourseAdministratorsModule.getAdditionalAdminEditorsSearchTxtF())
            .type(users.sysAdmin.admin_sys_01_fname + ' ' + users.sysAdmin.admin_sys_01_lname)
        cy.get(ARCourseSettingsCourseAdministratorsModule.getAdditionalAdminEditorsOpt())
            .contains(users.sysAdmin.admin_sys_01_fname + ' ' + users.sysAdmin.admin_sys_01_lname).click()

        ARDashboardPage.getShortWait()

        //Add Another Additional Admin Editor
        //Close dropdown
        cy.get(ARCourseSettingsCourseAdministratorsModule.getAdditionalAdminEditorsDDown()).click()

        //Open dropdown again
        cy.get(ARCourseSettingsCourseAdministratorsModule.getAdditionalAdminEditorsDDown()).click()


        cy.get(ARCourseSettingsCourseAdministratorsModule.getAdditionalAdminEditorsSearchTxtF())
            .type(users.sysAdminLogInOut.admin_sys_loginout_fname + ' ' + users.sysAdminLogInOut.admin_sys_loginout_lname)
        cy.get(ARCourseSettingsCourseAdministratorsModule.getAdditionalAdminEditorsOpt())
            .contains(users.sysAdminLogInOut.admin_sys_loginout_fname + ' ' + users.sysAdminLogInOut.admin_sys_loginout_lname).click({ force:true})

        //Publish Course
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
    })


    it('Edit OC Course, Authorized Admin Can Edit The Course', () => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdminLogInOut.admin_sys_loginout_username, users.sysAdminLogInOut.admin_sys_loginout_password, '/admin')
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Courses'))
        
        ARDashboardPage.getMediumWait()

        //Authorize admin can edit the course
        cy.wrap(ARCoursesPage.AddFilter('Name', 'Contains', ocDetails.courseName))
        ARCoursesPage.getShortWait()
        cy.get(ARCoursesPage.getTableCellName(2)).contains(ocDetails.courseName).click()
        cy.wrap(ARCoursesPage.WaitForElementStateToChange(ARCoursesPage.getAddEditMenuActionsByName('Edit'), 1000))
        
        //Asserting Auuthorized admin can edit the course, edit button is enabled
        cy.get(ARCoursesPage.getAddEditMenuActionsByName('Edit')).should('have.attr', 'aria-disabled', 'false')
    })

    it('Edit OC Course, Unauthorized Admin Can not Edit The Course', () => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.depAdminLogInOut.admin_dep_loginout_username, users.depAdminLogInOut.admin_dep_loginout_password, '/admin')
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Courses'))
        
        ARDashboardPage.getMediumWait()

        //Unauthorized admin can not edit the course
        cy.wrap(ARCoursesPage.AddFilter('Name', 'Contains', ocDetails.courseName))
        ARCoursesPage.getShortWait()
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
