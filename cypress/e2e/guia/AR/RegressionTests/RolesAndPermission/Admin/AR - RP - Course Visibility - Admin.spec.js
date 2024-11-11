import departments from '../../../../../../fixtures/departments.json'
import arAddMoreCourseSettingsModule from '../../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import arCourseSettingsCourseAdministratorsModule from '../../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCourseAdministrators.module'
import arCoursesPage from '../../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import arDashboardPage from '../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arOCAddEditPage from '../../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage'
import arPublishModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARPublishModal'
import arSelectModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import { arrayOfCourses, commonDetails } from '../../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../../helpers/TestData/users/users'


describe('AR - Regress - RP - Course Visibility - Admin', function () {

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses, filter for and edit course
        cy.apiLoginWithSession(users.adminLogInOut.admin_loginout_username, users.adminLogInOut.admin_loginout_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        
    })

    after(function () {
        cy.deleteCourse(commonDetails.courseID);
    })

    it('Admin can see courses created outside of its department scope', () => {
        cy.wrap(arCoursesPage.AddFilter('Name', 'Contains', `GUIA - RP`))
        arrayOfCourses.arrRoleCourses.forEach((deps) => {
            cy.get(arCoursesPage.getTableCellName()).contains(deps).should(`be.visible`)
        })
    })

    it('Admin can create a course outside its assigned department', () => {
        cy.createCourse('Online Course', commonDetails.rpDeptCCourseName)
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Course Administrators')).click().wait(500)
        cy.get(arCourseSettingsCourseAdministratorsModule.getCourseVisibilityRadioBtn()).contains('Department').click()
        cy.get(arCourseSettingsCourseAdministratorsModule.getDepartmentVisibilityAddRuleBtn()).click()
        cy.get(arCourseSettingsCourseAdministratorsModule.getVisibilityRuleSelectDepartmentBtn()).click()
        arSelectModal.SearchAndSelectFunction([departments.DEPTC_NAME])
        cy.wrap(arOCAddEditPage.WaitForElementStateToChange(arOCAddEditPage.getPublishBtn(), 1000))
        arOCAddEditPage.getMediumWait()
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
    })

    it('Admin can edit a course without error', () => {
        cy.editCourse(commonDetails.rpDeptCCourseName)
        arCoursesPage.getMediumWait()
        cy.get(arOCAddEditPage.getGeneralTitleTxtF()).clear()
        cy.get(arOCAddEditPage.getGeneralTitleTxtF())
            .invoke('val', commonDetails.rpDeptCCourseName + commonDetails.appendText.slice(0, -1)).type(commonDetails.appendText.slice(-1))
        cy.publishCourse()
    })
})
