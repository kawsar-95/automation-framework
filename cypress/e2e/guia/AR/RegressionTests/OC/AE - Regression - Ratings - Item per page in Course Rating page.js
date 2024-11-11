import { users } from '../../../../../../helpers/TestData/users/users'
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARRatingPage from "../../../../../../helpers/AR/pageObjects/Courses/ARRatingPage"

describe('C7419 - AUT 720 - AE - Regression - Ratings - Item per page in Course Rating page', function() {

    it('Course Rating page Item per page count', () => {
        // Sign in with System Admin account
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        // 3. Courses panel should be open
        cy.get(ARDashboardPage.getElementByDataName(ARDashboardPage.getMenuHeaderTitleDataName())).should('contain', 'Courses')
        ARDashboardPage.getMenuItemOptionByName('Ratings')
        ARDashboardPage.getMediumWait()
        // 4. Displays Course Ratings list page
        cy.get(ARRatingPage.getSectionHeader()).should('contain.text', 'Ratings')
        // 5. Default dropdown should contain 20
        // 6. Select 50
        // Dropdown should contain 50
        cy.get(ARRatingPage.getItemsPerPageDDown()).should('have.value', '20').select('50').should('have.value', '50')
    })
})