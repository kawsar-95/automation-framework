import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import { miscData } from "../../../../../../helpers/TestData/Misc/misc"
import { users } from "../../../../../../helpers/TestData/users/users"

describe('C736 - Schedule Report', () => {
    beforeEach(() => {
        cy.apiLoginWithSession(
            users.sysAdmin.admin_sys_01_username,
            users.sysAdmin.admin_sys_01_password,
            "/admin"
        )
    })
    it('Schedule Report', () => {
        ARDashboardPage.getMediumWait()
        //Go to Reports > Learner Progress from the LHS menu.
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute("Reports")).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName("Learner Progress"))
        ARDashboardPage.getLongWait()
        // As an Admin select or create a saved layout
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Report Layouts')).click()
        cy.get(ARDashboardPage.getElementByDataNameAttribute('create-full')).click()
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Nickname')).type(miscData.layout_name_1)
        cy.get(ARDashboardPage.getElementByDataNameAttribute('save')).click()
        ARDashboardPage.getMediumWait()

        //As an Admin select the Schedule report email
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Schedule Report')).click()
        // As an Admin toggle the Schedule report email on
        cy.get(ARDashboardPage.getElementByDataNameAttribute('toggle-button')).click()
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Email Report')).within(() => {
        })
        cy.get(ARDashboardPage.getElementByDataNameAttribute('selection')).contains('Select Frequency...').should('exist')
        cy.get(ARDashboardPage.getElementByNameAttribute('recipientEmailAddresses')).should('exist')
        cy.get(ARDashboardPage.getElementByDataNameAttribute('selection')).contains('Choose').should('exist')

        // As an Admin I select the Daily option for the frequency
        cy.get(ARDashboardPage.getElementByDataNameAttribute('selection')).contains('Select Frequency...').click()
        cy.get(ARDashboardPage.getListItem()).contains('Daily').click()
        // As an Admin I select the Weekly option for the frequency
        cy.get(ARDashboardPage.getElementByDataNameAttribute('selection')).contains('Daily').click()
        cy.get(ARDashboardPage.getListItem()).contains('Weekly').click()
        // As an Admin I select the Semi-Monthly option for the frequency
        cy.get(ARDashboardPage.getElementByDataNameAttribute('selection')).contains('Weekly').click()
        cy.get(ARDashboardPage.getListItem()).contains('Semi-Monthly').click()
        // As an Admin I select the Monthly option for the frequency
        cy.get(ARDashboardPage.getElementByDataNameAttribute('selection')).contains('Semi-Monthly').click()
        cy.get(ARDashboardPage.getListItem()).contains('Monthly').click()
        // As an Admin I select the Quarterly option for the frequency
        cy.get(ARDashboardPage.getElementByDataNameAttribute('selection')).contains('Monthly').click()
        cy.get(ARDashboardPage.getListItem()).contains('Quarterly').click()
        // As an Admin I select the Semi-Annually option for the frequency
        cy.get(ARDashboardPage.getElementByDataNameAttribute('selection')).contains('Quarterly').click()
        cy.get(ARDashboardPage.getListItem()).contains('Semi-Annually').click()
        // As an Admin I select the Annually option for the frequency
        cy.get(ARDashboardPage.getElementByDataNameAttribute('selection')).contains('Semi-Annually').click()
        cy.get(ARDashboardPage.getListItem()).contains('Annually').click()

        // As an Admin I do not want to save changes made in the Schedule report email
        // When clicking outside of the pop-over window, the window closes and all changes are reverted
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Schedule Report')).click({ force: true })
        cy.get(ARDashboardPage.getElementByDataNameAttribute('title')).contains('Learner Progress').click({ force: true })
        cy.get(ARDashboardPage.getElementByDataNameAttribute('title')).contains('Learner Progress').click({ force: true })


        //Delete created layout
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Selected Report Layout')).click()
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Delete Layout')).click()

    })
})