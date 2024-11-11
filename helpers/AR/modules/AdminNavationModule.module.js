import ARBasePage from "../ARBasePage";
import ARDashboardPage from "../pageObjects/Dashboard/ARDashboardPage";

export default new class AdminNavationModule extends ARBasePage {

    getMainMenuByLabel($label) {
        return `[aria-label="${$label}"]`
    }

    // --------------------- Main menus ---------------
    getCourseMenu() {
        return this.getMainMenuByLabel('Courses')
    }

    getUsersMenu() {
        return this.getMainMenuByLabel('Users')
    }

    getReportsMenu() {
        return this.getMainMenuByLabel('Reports')
    }

    // ----------------- Helpers
    getSubmenuOptions() {
        return 'span[data-name="title"]'
    }

    getCommonRigthActionMenu(name) {
        return `button[title="${name}"]`
    }

    // --------------------- Courses: Sub menus ---------------
    navigateToCoursesPage() {        
        cy.get(this.getCourseMenu()).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Courses'),{timeout:15000})
        cy.get(this.getWaitSpinner(),{timeout:15000}).should('not.exist')
    }

    // --------------------- Users: Sub menus ---------------
    navigateToUsersPage() {
        cy.get(this.getUsersMenu(), {timeout: 15000}).click()
        cy.get('[id="users-report-menu-option"]', {timeout: 3000}).click()
        cy.intercept('/api/rest/v2/admin/reports/users/operations').as('getUsers').wait('@getUsers')
        cy.get(this.getWaitSpinner(),{timeout:15000}).should('not.exist')
    }

    navigateToDepartmentsPage() {  
        cy.get(this.getElementByTitleAttribute('Users')).click()
        ARDashboardPage.getMenuItemOptionByName('Departments')
        cy.get(this.getWaitSpinner(),{timeout:15000}).should('not.exist')
    }

    navigateToUserEnrollmentsPage() {        
        cy.get(this.getUsersMenu()).click()
        cy.get(this.getSubmenuOptions()).contains('User Enrollments').click()
        cy.intercept('**/api/rest/v2/admin/reports/users').as('getUserEnrollments').wait('@getUserEnrollments')
    }

    // --------------------- Users: Right action context menus ---------------
    getDeleteUserButton() {
        return this.getCommonRigthActionMenu('Delete')
    }

    // --------------------- Reports: Sub menus ---------------
    navigateToCourseApprovalPage() {        
        cy.get(this.getReportsMenu()).click()
        cy.get(this.getSubmenuOptions()).contains('Course Approval').click()
    }

    navigateToILCActivityPage() {        
        cy.get(this.getReportsMenu()).click()
        cy.get(this.getSubmenuOptions()).contains('ILC Activity').click()
    }

    navigateToLearnerActivityPage() {        
        cy.get(this.getReportsMenu()).click()
        cy.get(this.getSubmenuOptions()).contains('Learner Activity').click()
    }

    // --------------------- Engage: Sub menus ---------------
    navigateToBillboardsPage() {
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Engage')).click()
        ARDashboardPage.getMediumWait()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Billboards'))
        ARDashboardPage.getMediumWait()
    }

    navigateToNewsArticlesPage() {
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Engage'))).click()
        ARDashboardPage.getMenuItemOptionByName('News Articles')
        ARDashboardPage.getShortWait()
    }
}