import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARCurriculaActivityReportPage from "../../../../../../helpers/AR/pageObjects/Reports/ARCurriculaActivityReportPage"
import { courses } from "../../../../../../helpers/TestData/Courses/courses"
import { users } from "../../../../../../helpers/TestData/users/users"

describe('AUT - 674 | C7291 - User Transcript', () => {
    beforeEach(() => {
        // Enter the username & password then click on Login button
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
    })
    it('Curricula Activity - User Transcript', () => {
        ARDashboardPage.getMediumWait()
        // Click on reports
        cy.get(ARDashboardPage.getMenu('Reports')).click()
        // Click on curricula activity
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Curricula Activity'))
        ARDashboardPage.getMediumWait()
        // select any curricula and click on apply filter button
        ARCurriculaActivityReportPage.ChooseAddFilter(courses.curr_02_admin_approval_name)
        ARDashboardPage.getMediumWait()
        // Select any user
        cy.get(ARDashboardPage.getGridTable()).eq(0).click()
        // Click on  user transcript button
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('User Transcript')).click()
        ARDashboardPage.getLongWait()
        // Click on back button
        cy.get(ARDashboardPage.getBackBtn()).click()

    })
})