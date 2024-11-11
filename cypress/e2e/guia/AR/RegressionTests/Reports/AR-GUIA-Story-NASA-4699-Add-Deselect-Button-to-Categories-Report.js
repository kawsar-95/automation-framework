import ARCoursesPage from "../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import { users } from "../../../../../../helpers/TestData/users/users"

describe('C1057 - AR-GUIA-Story-NASA-4699 - Add Deselect Button to Categories Report', function(){
    beforeEach(() => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
    })

    it('Checks "Deselect" button is added when report category line item is selected', () => {
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Courses'))
                
        // Select a line item from the courses list    
        cy.get(ARDashboardPage.getGridTable()).eq(0).click()
        ARDashboardPage.getVShortWait()
        // Assert that the 'Deselect' button is added in the context menu list and it's visivible
        ARCoursesPage.getContextMenuByName('Deselect').should('exist').and('be.visible')
        // Assert that clicking on 'Deselect' button deselects the selected line item
        ARCoursesPage.getContextMenuByName('Deselect').click()
        cy.get(ARDashboardPage.getGridTable()).within(() => {
            cy.get(ARCoursesPage.getCheckedInput()).should('have.length', 0)
        })
    })
})