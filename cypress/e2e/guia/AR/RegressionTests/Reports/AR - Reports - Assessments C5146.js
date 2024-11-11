import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import { users } from "../../../../../../helpers/TestData/users/users"

describe('C5146 - Reports - Assessments', () => {
    beforeEach(() => {
        cy.apiLoginWithSession(
            users.sysAdmin.admin_sys_01_username,
            users.sysAdmin.admin_sys_01_password,
            '/admin'
        )
    })
    it('Assessments', () => {
        //Navigate to Report - Assessments
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Reports'))).click()
        ARDashboardPage.getMenuItemOptionByName('Assessments')
        ARDashboardPage.getMediumWait()
        //Assessments should be displayed as per Sorting Like as
        cy.get(ARDashboardPage.getTableHeader()).eq(1).should('contain', 'Course Name')
        cy.get(ARDashboardPage.getTableHeader()).eq(2).should('contain', 'Assessment Name')
        cy.get(ARDashboardPage.getTableHeader()).eq(3).should('contain', 'Type')
        cy.get(ARDashboardPage.getTableHeader()).eq(4).should('contain', 'Attempts')
        cy.get(ARDashboardPage.getTableHeader()).eq(5).should('contain', 'Passes')
        cy.get(ARDashboardPage.getTableHeader()).eq(6).should('contain', 'Fails')
        cy.get(ARDashboardPage.getTableHeader()).eq(7).should('contain', 'Average Score')
        cy.get(ARDashboardPage.getTableHeader()).eq(8).should('contain', 'Average Time')

        //Select Existing Assessment
        cy.get(ARDashboardPage.getGridTable()).eq(0).click()
        ARDashboardPage.getMediumWait()
        //Action Should be displayed
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(1)).should('contain', 'Summary Report')
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(2)).should('contain', 'Assessment Activity')
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(3)).should('contain', 'Answers Report')

        //Click on Summary Report
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(1)).click()
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getA5PageHeaderTitle()).should('contain', 'Questions Report')
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(1)).click()
        ARDashboardPage.getLongWait()
        //Click on Assessment Activity
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(2)).click()
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getA5PageHeaderTitle()).should('contain', 'Assessment Activity')
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(1)).click()
        ARDashboardPage.getLongWait()
        //Click on Answer Report
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(3)).click()
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getA5PageHeaderTitle()).should('contain', 'Answers Report')
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(1)).click()
        ARDashboardPage.getLongWait()
        //Click on Deselect Button
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(4)).click()

    })
})