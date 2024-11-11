import LECoursesPage from "../../../../../../helpers/LE/pageObjects/Courses/LECoursesPage"
import LEDashboardPage from "../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage"
import LEFilterMenu from "../../../../../../helpers/LE/pageObjects/Menu/LEFilterMenu"
import LESideMenu from "../../../../../../helpers/LE/pageObjects/Menu/LESideMenu"
import LEManageTemplateCoursesPage from "../../../../../../helpers/LE/pageObjects/Template/LEManageTemplateCoursesPage"
import LEManageTemplateMenu from "../../../../../../helpers/LE/pageObjects/Template/LEManageTemplateMenu"
import LEProfilePage from "../../../../../../helpers/LE/pageObjects/User/LEProfilePage"
import { userDetails } from "../../../../../../helpers/TestData/users/UserDetails"
import { users } from "../../../../../../helpers/TestData/users/users"



describe("C6358 - LE - Regress - Manage Template - Courses - My Courses Configuration", () => {
    before("prequisite", () => {
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
    })
    after("clean up", function () {

        //Cleanup - delete learner
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        LEDashboardPage.getMediumWait()
        cy.get(LEDashboardPage.getNavProfile()).click()
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
        cy.url().then((currentURL) => {
            cy.deleteUser(currentURL.slice(-36));
        })
        
    })

    it('Toggle Hide Categories ON And Default Sort Order Date Enrolled', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, "#/login")
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('Manage Template')
        LEManageTemplateMenu.getManageTemplateMenuItemsByName('Courses').should('be.visible').click()
        cy.url().should('include', '/#/learner-mgmt/courses')
        LEManageTemplateCoursesPage.getManageTemplateCoursesContainerByNameThenClick('My Courses')
        cy.get(LEManageTemplateCoursesPage.getCatalogDefaultViewModule()).parent().within(() => {
            cy.get(LECoursesPage.getCardViewBtn()).should('have.class', 'icon-view-cards')
        })
        //Changing Default Sort order 
        cy.get(LEManageTemplateCoursesPage.getElementByNameAttribute("defaultSort")).select("DateEnrolled").invoke('val').should("eq", "DateEnrolled")
        cy.get(LEManageTemplateCoursesPage.getContainerSaveBtn()).click()
        cy.get(LEManageTemplateCoursesPage.getSuccessMessage()).should('have.text', 'Changes Saved.')

    })

    it('Verify Categories Hidden from the My Course', () => {
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        cy.get(LEDashboardPage.getNavMenu()).click();
        LESideMenu.getLEMenuItemsByNameThenClick("My Courses");
        cy.get(LEDashboardPage.getElementByAriaLabelAttribute("Choose View")).find('span').should('have.class', 'icon-view-cards')
        cy.get(LEFilterMenu.getShowCategoriesTxt()).should('not.exist')
        cy.get(LECoursesPage.getElementByNameAttribute("CoursesSortDropDown")).invoke('val').should("eq", 'Date Enrolled')
    })

    it('Toggle Hide Categories OFF And Default Sort Order Alphabetically', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, "#/login")
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('Manage Template')
        LEManageTemplateMenu.getManageTemplateMenuItemsByName('Courses').should('be.visible').click()
        cy.url().should('include', '/#/learner-mgmt/courses')
        LEManageTemplateCoursesPage.getManageTemplateCoursesContainerByNameThenClick('My Courses')
        cy.get(LEManageTemplateCoursesPage.getElementByNameAttribute("defaultSort")).select("Alphabetical").invoke('val').should("eq", "Alphabetical")
        cy.get(LEManageTemplateCoursesPage.getContainerSaveBtn()).click()
        cy.get(LEManageTemplateCoursesPage.getSuccessMessage()).should('have.text', 'Changes Saved.')
    })

    it('Verify Categories & And Default Sort Order ALphabetical in the My Courses', () => {
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        cy.get(LEDashboardPage.getNavMenu()).click();
        LESideMenu.getLEMenuItemsByNameThenClick("My Courses");
        cy.get(LECoursesPage.getElementByNameAttribute("CoursesSortDropDown")).invoke('val').should("eq", 'Alphabetical')

    })

 
})


