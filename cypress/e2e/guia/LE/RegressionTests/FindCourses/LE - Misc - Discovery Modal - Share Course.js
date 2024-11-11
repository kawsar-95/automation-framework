import arDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import LECatalogPage from "../../../../../../helpers/LE/pageObjects/Catalog/LECatalogPage"
import LEDashboardPage from "../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage"
import LEFilterMenu from "../../../../../../helpers/LE/pageObjects/Menu/LEFilterMenu"
import { users } from "../../../../../../helpers/TestData/users/users"
import { courses } from "../../../../../../helpers/TestData/Courses/courses"
import AREditClientUserPage from "../../../../../../helpers/AR/pageObjects/PortalSettings/AREditClientUserPage"
import LEProfilePage from '../../../../../../helpers/LE/pageObjects/User/LEProfilePage'
import ARDashboardAccountMenu from "../../../../../../helpers/AR/pageObjects/Menu/ARDashboardAccount.menu"
import ARCoursesPage from "../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage"
import { userDetails } from '../../../../../../helpers/TestData/users/UserDetails'


describe('C6357 - Online Discovery Modal - Share the course', () => {
    before(function () {
        //Create a new user
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)

        //Signin with system admin
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getShortWait()
        cy.get(arDashboardPage.getCurrentUserLabel()).should('contain',"GUI_Auto Sys_Admin_01")
        cy.get(arDashboardPage.getElementByDataNameAttribute(arDashboardPage.getHelpAndSupportBtn())).should('be.visible')
        
        //Select Account Menu 
        cy.get(arDashboardPage.getElementByDataNameAttribute(arDashboardPage.getAccountBtn())).click()
        
        //Select Portal Setting option from account menu
        cy.get(ARDashboardAccountMenu.getPortalSettingsBtn()).should('exist').click()
        
        //Validate portal setting page header
        cy.get(arDashboardPage.getAccountHeaderLabel()).should('have.text','Edit Client')
        cy.get(arDashboardPage.getUsersTab()).click()

        // //Turn on next gen toggle button
        AREditClientUserPage.getTurnOnNextgenToggle() 
        cy.get(AREditClientUserPage.getSaveBtn()).click()
        arDashboardPage.getShortWait()
        //logout
        cy.logoutAdmin()
        arDashboardPage.getLongWait()
    })

    after(function() {
        
        //Signin with system admin
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getVShortWait()
        
        //Select Account Menu 
        cy.get(arDashboardPage.getElementByDataNameAttribute(arDashboardPage.getAccountBtn())).click()
        arDashboardPage.getVShortWait()

        //Select Portal Setting option from account menu
        cy.get(ARDashboardAccountMenu.getPortalSettingsBtn()).should('exist').click()
        

        //Validate portal setting page header
        cy.get(arDashboardPage.getAccountHeaderLabel()).should('have.text','Edit Client')
        cy.get(arDashboardPage.getUsersTab()).click()
        
        //Turn off Next gen toggle button
        AREditClientUserPage.getTurnOffNextgenToggle() 
        cy.get(AREditClientUserPage.getSaveBtn()).click()
        arDashboardPage.getShortWait()
    })

    it('Share Course', () => {
        //Login as learner
        cy.learnerLoginThruDashboardPage(userDetails.username, userDetails.validPassword)
        LEDashboardPage.getTileByNameThenClick('Catalog')
        LEFilterMenu.SearchForCourseByName(courses.oc_filter_01_name)
        LEDashboardPage.waitForLoader(LEDashboardPage.getCoursesLoader())
        // Open the course discovery modal of an online course.
        cy.get(LECatalogPage.getCourseNameLabel(courses.oc_filter_01_name)).click()
        
        //Click on course menu button
        cy.get(LEDashboardPage.getElementByTitleAttribute('Open Menu')).click()
        LEDashboardPage.getShortWait()
        cy.get(LECatalogPage.getCourseMenuBtn()).click()
        // Click on 'Share' to share the course.
        cy.get(LECatalogPage.getOpenMenuButtonOptions()).eq(1).invoke('show').click({force:true},{timeout : 1000})
        // The following toast messaged appears on the bottom RHS:
        cy.get(LEDashboardPage.getToastNotificationMsg()).should('contain', 'Link copied to clipboard')
        
        // delete user
        cy.get(LEDashboardPage.getNavProfile()).click()  
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
        cy.url().then((currentURL) => {
            cy.deleteUser(currentURL.slice(-36));
        })

    })
})