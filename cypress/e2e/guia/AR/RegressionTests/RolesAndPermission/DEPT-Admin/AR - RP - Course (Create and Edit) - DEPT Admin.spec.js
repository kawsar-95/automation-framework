import departments from '../../../../../../fixtures/departments.json'
import arAddMoreCourseSettingsModule from '../../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import arCourseSettingsCourseAdministratorsModule from '../../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCourseAdministrators.module'
import arCoursesPage from '../../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import arDashboardPage from '../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arOCAddEditPage from '../../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage'
import arSelectModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import { users } from '../../../../../../../helpers/TestData/users/users'
import { commonDetails } from '../../../../../../../helpers/TestData/Courses/commonDetails'
import ARCourseSettingsCourseAdministratorsModule from '../../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCourseAdministrators.module'


describe('AR - Regress - RP - Course (Create and Edit) - DEPT Admin', function () {

    after(function() {
        commonDetails.courseIDs.forEach((id) => {
            cy.deleteCourse(id)
        })
    })

    it('An Is Only admin can create a new course without error', () => {
        cy.apiLoginWithSession(users.depAdminDEPTC.admin_dep_username, users.depAdminDEPTC.admin_dep_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        
        cy.createCourse('Online Course', commonDetails.rpDeptCCourseName)

        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Course Administrators')).click().wait(1000)
        cy.get(arCourseSettingsCourseAdministratorsModule.getCourseVisibilityRadioBtn()).contains('Department').click()
        cy.get(arCourseSettingsCourseAdministratorsModule.getDepartmentVisibilityAddRuleBtn()).click()
        cy.get(arCourseSettingsCourseAdministratorsModule.getVisibilityRuleSelectDepartmentBtn()).eq(1).click()
        arSelectModal.SearchAndSelectFunction([departments.DEPTC_NAME])
        // Add Additional Admin Editor
        cy.get(ARCourseSettingsCourseAdministratorsModule.getAdditionalAdminEditorsDDown()).click()
        cy.get(ARCourseSettingsCourseAdministratorsModule.getAdditionalAdminEditorsSearchTxtF())
            .type(users.depAdminDEPTC.admin_dep_fname + ' ' + users.depAdminDEPTC.admin_dep_lname)
        arCoursesPage.getShortWait()
        cy.get(ARCourseSettingsCourseAdministratorsModule.getAdditionalAdminEditorsOpt()).click()
       
        cy.wrap(arOCAddEditPage.WaitForElementStateToChange(arOCAddEditPage.getPublishBtn(), 1000))
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36));
        })
    })

    it('An Is Only admin can edit a course without error', () => {
        cy.apiLoginWithSession(users.depAdminDEPTC.admin_dep_username, users.depAdminDEPTC.admin_dep_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        
        cy.editCourse(commonDetails.rpDeptCCourseName)
        arCoursesPage.getMediumWait()
        cy.get(arOCAddEditPage.getGeneralTitleTxtF()).clear()
        cy.get(arOCAddEditPage.getGeneralTitleTxtF())
            .invoke('val', commonDetails.rpDeptCCourseName + commonDetails.appendText.slice(0,-1)).type(commonDetails.appendText.slice(-1))
        cy.publishCourse()
    })

    it('An Include Subdep admin can create a new course without error', () => {
        cy.apiLoginWithSession(users.depAdminSUBDEP.admin_dep_username, users.depAdminSUBDEP.admin_dep_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        
        cy.createCourse('Online Course', commonDetails.rpSubDeptDCourseName)

        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Course Administrators')).click().wait(1000)
        cy.get(arCourseSettingsCourseAdministratorsModule.getCourseVisibilityRadioBtn()).contains('Department').click()
        cy.get(arCourseSettingsCourseAdministratorsModule.getDepartmentVisibilityAddRuleBtn()).click()
        cy.get(arCourseSettingsCourseAdministratorsModule.getVisibilityRuleSelectDepartmentBtn()).eq(1).click()
        arSelectModal.SearchAndSelectFunction([departments.SUB_DEPT_B_NAME])
        // Add Additional Admin Editor
        cy.get(ARCourseSettingsCourseAdministratorsModule.getAdditionalAdminEditorsDDown()).click()
        cy.get(ARCourseSettingsCourseAdministratorsModule.getAdditionalAdminEditorsSearchTxtF())
            .type(users.depAdminSUBDEP.admin_dep_fname + ' ' + users.depAdminSUBDEP.admin_dep_lname)
        arCoursesPage.getShortWait()
        cy.get(ARCourseSettingsCourseAdministratorsModule.getAdditionalAdminEditorsOpt()).eq(0).click()
        
        cy.wrap(arOCAddEditPage.WaitForElementStateToChange(arOCAddEditPage.getPublishBtn(), 1000))
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36));
        })
    })

    it('An Include Subdep admin can edit a course without error', () => {
        cy.apiLoginWithSession(users.depAdminSUBDEP.admin_dep_username, users.depAdminSUBDEP.admin_dep_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        
        cy.editCourse(commonDetails.rpSubDeptDCourseName)
        arCoursesPage.getLongWait()
        cy.get(arOCAddEditPage.getGeneralTitleTxtF()).clear()
        cy.get(arOCAddEditPage.getGeneralTitleTxtF())
            .invoke('val', commonDetails.rpSubDeptDCourseName + commonDetails.appendText.slice(0,-1)).type(commonDetails.appendText.slice(-1))
        cy.publishCourse()
    })
})
