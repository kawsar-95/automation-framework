import departments from '../../../../../../fixtures/departments.json'
import arAddMoreCourseSettingsModule from '../../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import arCourseSettingsCourseAdministratorsModule from '../../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCourseAdministrators.module'
import arCoursesPage from '../../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import arDashboardPage from '../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arOCAddEditPage from '../../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage'
import arSelectModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import { users } from '../../../../../../../helpers/TestData/users/users'
import { userDetails } from '../../../../../../../helpers/TestData/users/UserDetails'
import { arrayOfCourses } from '../../../../../../../helpers/TestData/Courses/commonDetails'


describe('AR - Regress - RP - Course Visibility - SysAdmin', function () {
  
    it('SysAdmin can see courses created outside of its department scope', () => {
        cy.loginAdmin(users.sysAdminLogInOut.admin_sys_loginout_username, users.sysAdminLogInOut.admin_sys_loginout_password)
        //cy.get(arDashboardPage.getSysAdminDashboardPageTitle()).should('have.text', arDashboardPage.getSysAdminDashboardPageTitleTxt())
        cy.get(arDashboardPage.getCurrentUserLabel()).contains(`${users.sysAdminLogInOut.admin_sys_loginout_fname} ${users.sysAdminLogInOut.admin_sys_loginout_lname}`)
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        
        cy.wrap(arCoursesPage.AddFilter('Name', 'Contains', `RP`))
        arCoursesPage.getShortWait()
        arrayOfCourses.deptBCourses.forEach((deps) => {
            cy.get(arCoursesPage.getTableCellName()).contains(deps).should(`be.visible`)
        })
        cy.get(arCoursesPage.getFilterCloseBtn()).click()
        cy.wrap(arCoursesPage.AddFilter('Name', 'Contains', `DEPC`)).wait('@getCourses')
        arrayOfCourses.deptCCourses.forEach((deps) => {
        cy.get(arCoursesPage.getNoResultMsg()).should('have.text', "No results found.")
        })
    })

    it('SysAdmin cannot create a course outside its assigned department', () => {
        cy.loginAdmin(users.sysAdminLogInOut.admin_sys_loginout_username, users.sysAdminLogInOut.admin_sys_loginout_password)
        //cy.get(arDashboardPage.getSysAdminDashboardPageTitle()).should('have.text', arDashboardPage.getSysAdminDashboardPageTitleTxt())
        cy.get(arDashboardPage.getCurrentUserLabel()).contains(`${users.sysAdminLogInOut.admin_sys_loginout_fname} ${users.sysAdminLogInOut.admin_sys_loginout_lname}`)
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        
        cy.get(arCoursesPage.getCoursesActionsButtonsByLabel('Add Online Course')).should('have.text', "Add Online Course").click()
        cy.get(arOCAddEditPage.getGeneralStatusToggleContainer() + arOCAddEditPage.getToggleDisabled()).click()
        cy.get(arOCAddEditPage.getGeneralTitleTxtF()).clear().type(userDetails.rpDeptCAdminUserName)
        cy.get(AROCAddEditPage.getDescriptionTxtF()).type(`This is OC automation test`)
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Course Administrators')).click()
        arAddMoreCourseSettingsModule.getVShortWait()
        cy.get(arCourseSettingsCourseAdministratorsModule.getCourseVisibilityRadioBtn()).contains('Department').click()
        cy.get(arCourseSettingsCourseAdministratorsModule.getDepartmentVisibilityAddRuleBtn()).click()
        cy.get(arCourseSettingsCourseAdministratorsModule.getVisibilityRuleSelectDepartmentBtn()).click()
        cy.get(arSelectModal.getSelectOpt()).should('not.have.text', departments.DEPTC_NAME)
    })
})
