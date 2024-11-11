import arAddMoreCourseSettingsModule from '../../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import arCourseSettingsCourseAdministratorsModule from '../../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCourseAdministrators.module'
import arCoursesPage from '../../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import arDashboardPage from '../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arOCAddEditPage from '../../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage'
import arSelectModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import { users } from '../../../../../../../helpers/TestData/users/users'
import { arrayOfCourses, commonDetails } from '../../../../../../../helpers/TestData/Courses/commonDetails'
import departments from '../../../../../../fixtures/departments.json'



describe('AR - Regress - RP - Course Visibility', function () {

    after(function () {
        cy.deleteCourse(commonDetails.courseID);
    })

    it('DEP Admin cannot see courses created outside of its department scope', () => {
        cy.apiLoginWithSession(users.depAdminDEPTB.admin_dep_username, users.depAdminDEPTB.admin_dep_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        arCoursesPage.getMediumWait()
        cy.wrap(arCoursesPage.AddFilter('Name', 'Contains', `RP`))
        arCoursesPage.getMediumWait()
        arrayOfCourses.deptBCourses.forEach((deps) => {
            cy.get(arCoursesPage.getTableCellName()).contains(deps).should(`be.visible`)
        })
        cy.get(arCoursesPage.getRemoveFilterBtn()).click()
        arrayOfCourses.deptCCourses.forEach((deps) => {
        cy.wrap(arCoursesPage.AddFilter('Name', 'Starts With', `${deps}`))
        cy.get(arCoursesPage.getNoResultMsg()).should('have.text', "No results found.")
        })
    })

    it('Use DEP Admin within DEPTC to create an online course', () => {
        cy.apiLoginWithSession(users.depAdminDEPTC.admin_dep_username, users.depAdminDEPTC.admin_dep_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        arDashboardPage.getMediumWait()
        cy.createCourse('Online Course', commonDetails.rpDeptCCourseName)
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Course Administrators')).click().wait(1000)
        cy.get(arCourseSettingsCourseAdministratorsModule.getCourseVisibilityRadioBtn()).contains('Department').click()
        cy.get(arCourseSettingsCourseAdministratorsModule.getDepartmentVisibilityAddRuleBtn()).click()
        cy.get(arCourseSettingsCourseAdministratorsModule.getVisibilityRuleSelectDepartmentBtn()).eq(1).click()
        arOCAddEditPage.getMediumWait()
        arSelectModal.SearchAndSelectFunction([departments.DEPTC_NAME])
        arOCAddEditPage.getMediumWait()
        // Add Additional Admin Editor
        cy.get(arCourseSettingsCourseAdministratorsModule.getAdditionalAdminEditorsDDown()).click()
        cy.get(arCourseSettingsCourseAdministratorsModule.getAdditionalAdminEditorsSearchTxtF())
            .type(users.depAdminDEPTC.admin_dep_fname + ' ' + users.depAdminDEPTC.admin_dep_lname)
        arCoursesPage.getShortWait()
        cy.get(arCourseSettingsCourseAdministratorsModule.getAdditionalAdminEditorsOpt()).contains(users.depAdminDEPTC.admin_dep_fname + ' ' + users.depAdminDEPTC.admin_dep_lname).click()
        cy.wrap(arOCAddEditPage.WaitForElementStateToChange(arOCAddEditPage.getPublishBtn(), 1000))
        arOCAddEditPage.getMediumWait()
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
            arOCAddEditPage.getMediumWait()
        })
    })

    it('Sign in with DEPTB Admin and verify course created by DEPTC Admin is not visible', () => {
        cy.apiLoginWithSession(users.depAdminDEPTB.admin_dep_username, users.depAdminDEPTB.admin_dep_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        arDashboardPage.getMediumWait()
        cy.wrap(arCoursesPage.AddFilter('Name', 'Contains', `RP`))
        arCoursesPage.getMediumWait()
        arrayOfCourses.deptBCourses.forEach((deps) => {
            cy.get(arCoursesPage.getTableCellName()).contains(deps).should(`be.visible`)
        })
        cy.wrap(arCoursesPage.UpdateFilter('RP', null, null, commonDetails.rpDeptCCourseName))
        arCoursesPage.getMediumWait()
        cy.get(arCoursesPage.getNoResultMsg()).should('have.text', "No results found.")
    })

    it('Sign in with DEPTC Admin and edit a course created by DEPTC Admin', () => {
        cy.apiLoginWithSession(users.depAdminDEPTC.admin_dep_username, users.depAdminDEPTC.admin_dep_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        arDashboardPage.getMediumWait()
        cy.editCourse(commonDetails.rpDeptCCourseName)
        arCoursesPage.getMediumWait()
        cy.get(arOCAddEditPage.getGeneralTitleTxtF()).clear()
        cy.get(arOCAddEditPage.getGeneralTitleTxtF())
            .invoke('val', commonDetails.rpDeptCCourseName + commonDetails.appendText.slice(0,-1)).type(commonDetails.appendText.slice(-1))
        arOCAddEditPage.getMediumWait()
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
            arOCAddEditPage.getMediumWait()
        })
            
    })

    it('Sign in with DEPTB Admin and verify the edited course by DEPTC Admin is not visible', () => {
        cy.apiLoginWithSession(users.depAdminDEPTB.admin_dep_username, users.depAdminDEPTB.admin_dep_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        arDashboardPage.getMediumWait()
        cy.wrap(arCoursesPage.AddFilter('Name', 'Contains', `RP`))
        arCoursesPage.getMediumWait()
        arrayOfCourses.deptBCourses.forEach((deps) => {
            cy.get(arCoursesPage.getTableCellName()).contains(deps).should(`be.visible`)
        })
        cy.wrap(arCoursesPage.UpdateFilter('RP', null, null, `${commonDetails.rpDeptCCourseName} ${commonDetails.appendText}`))
        arCoursesPage.getMediumWait()
        cy.get(arCoursesPage.getNoResultMsg()).should('have.text', "No results found.")
    })

    it('Sign in with admin with multiple departments not within the same department tree without error', () => {
        cy.apiLoginWithSession(users.depAdminDEPTD.admin_dep_username, users.depAdminDEPTD.admin_dep_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        arDashboardPage.getMediumWait()
        cy.wrap(arCoursesPage.AddFilter('Name', 'Contains', `RP`))
        arCoursesPage.getMediumWait()
        arrayOfCourses.deptBCourses.forEach((deps) => {
            cy.get(arCoursesPage.getTableCellName()).contains(deps).should(`be.visible`)
        })

        arrayOfCourses.deptCCourses.forEach((deps) => {
            cy.get(arCoursesPage.getTableCellName()).contains(deps).should(`be.visible`)
        })
        cy.get(arCoursesPage.getRemoveFilterBtn()).click()
        arrayOfCourses.deptDCourses.forEach((deps) => {
            cy.wrap(arCoursesPage.AddFilter('Name', 'Starts With', `${deps}`))
            arCoursesPage.getMediumWait()
            cy.get(arCoursesPage.getNoResultMsg()).should('have.text', "No results found.")
        })
       
    })
})
