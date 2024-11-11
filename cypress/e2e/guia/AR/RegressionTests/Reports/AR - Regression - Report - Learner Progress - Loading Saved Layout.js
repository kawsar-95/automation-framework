import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import { miscData } from "../../../../../../helpers/TestData/Misc/misc"
import { users } from "../../../../../../helpers/TestData/users/users"
function loadSavedLayout(column1 = 'Last Name', column2 = 'First Name', nColumn = 9) {
    //Create/Load a Saved Layout
    cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Report Layouts')).click()
    cy.get(ARDashboardPage.getElementByDataNameAttribute('create-full')).click()
    cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Nickname')).type(miscData.layout_name_1)
    cy.get(ARDashboardPage.getModalSaveBtn()).should('have.attr', 'aria-disabled', 'false').click()
    ARDashboardPage.getMediumWait()
    cy.get(ARDashboardPage.getElementByTitleAttribute('Display Columns')).click({ force: true })
    cy.get(ARDashboardPage.getDisplayColumnsList()).within(() => {
        cy.get(ARDashboardPage.getARLeftMenuByLabel('label')).contains(column1).click()
        cy.get(ARDashboardPage.getARLeftMenuByLabel('label')).contains(column1).click()
        cy.get(ARDashboardPage.getARLeftMenuByLabel('label')).contains(column2).click()
        cy.get(ARDashboardPage.getARLeftMenuByLabel('label')).contains(column2).click()
    })
    cy.get(ARDashboardPage.getElementByTitleAttribute('Display Columns')).click({ force: true })
    ARDashboardPage.getMediumWait()
    //Save layout
    cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Selected Report Layout')).click()
    ARDashboardPage.getMediumWait()
    cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Save Layout')).click()

    //Deselect layout
    cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Selected Report Layout')).click()
    ARDashboardPage.getLongWait()
    cy.get(ARDashboardPage.getElementByDataNameAttribute('report-saved-layouts')).within(() => {
        cy.get(ARDashboardPage.getARLeftMenuByLabel('span')).contains(miscData.layout_name_1)
            .click({ force: true })
    })
    //Verify default columns appears
    cy.get(ARDashboardPage.getTableHeader()).eq(1).should('contain', column1)
    cy.get(ARDashboardPage.getTableHeader()).eq(2).should('contain', column2)
    //Select the modified layout
    cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Report Layouts')).click()
    ARDashboardPage.getLongWait()
    cy.get(ARDashboardPage.getElementByDataNameAttribute('report-saved-layouts')).within(() => {
        cy.get(ARDashboardPage.getARLeftMenuByLabel('span')).contains(miscData.layout_name_1)
            .click({ force: true })
    })
    //Verify modified columns appears
    cy.get(ARDashboardPage.getTableHeader()).eq(nColumn - 1).should('contain', column1)
    cy.get(ARDashboardPage.getTableHeader()).eq(nColumn).should('contain', column2)

    //Delete created layout
    cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Selected Report Layout')).click()
    ARDashboardPage.getMediumWait()
    cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Delete Layout')).click()
}
describe('C6529 - Verify that Learner Progress Report Columns are loading successfully on saved layout without needing to refresh', () => {
    beforeEach(() => {
        cy.apiLoginWithSession(
            users.sysAdmin.admin_sys_01_username,
            users.sysAdmin.admin_sys_01_password,
            '/admin'
        )
    })
    it('Saved Layout -  Learner Progress', () => {
        ARDashboardPage.getMediumWait()
        //Go to Reports > Learner Progress from the LHS menu.
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute("Reports")).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName("Learner Progress"))
        ARDashboardPage.getLongWait()
        loadSavedLayout()
    })
    it('Saved Layout -  Courses', () => {
        ARDashboardPage.getMediumWait()
        //Go to Reports > Learner Progress from the LHS menu.
        //Navigate to Course
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute("Courses")).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName("Courses"))
        cy.intercept("/api/rest/v2/admin/reports/courses/operations")
            .as("getCourses")
            .wait("@getCourses");
        ARDashboardPage.getLongWait()
        loadSavedLayout('Name', 'Category', 3)
    })
    it('Saved Layout -  Learner Activity', () => {
        ARDashboardPage.getMediumWait()
        //Go to Reports > Learner Progress from the LHS menu.
        //Navigate to Course
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute("Reports")).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName("Learner Activity"))

        ARDashboardPage.getLongWait()
        loadSavedLayout('Last Name', 'First Name', 7)
    })

})