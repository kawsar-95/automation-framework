import LECoursesPage from "../../../../../../helpers/LE/pageObjects/Courses/LECoursesPage"
import LEDashboardPage from "../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage"
import LEFilterMenu from "../../../../../../helpers/LE/pageObjects/Menu/LEFilterMenu"
import LESideMenu from "../../../../../../helpers/LE/pageObjects/Menu/LESideMenu"
import LEManageTemplateCoursesPage from "../../../../../../helpers/LE/pageObjects/Template/LEManageTemplateCoursesPage"
import LEManageTemplateMenu from "../../../../../../helpers/LE/pageObjects/Template/LEManageTemplateMenu"
import LEProfilePage from "../../../../../../helpers/LE/pageObjects/User/LEProfilePage"
import { courses } from "../../../../../../helpers/TestData/Courses/courses"
import { userDetails } from "../../../../../../helpers/TestData/users/UserDetails"
import { users } from "../../../../../../helpers/TestData/users/users"




describe("C6356 - LE - Regression - Manage Template - Courses - Catalog Configuration", () => {


    before("prequisite", () => {
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
    })



    it('Toggle Hide Categories & Enrolled Coureses ON', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, "#/login")
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('Manage Template')
        LEManageTemplateMenu.getManageTemplateMenuItemsByName('Courses').should('be.visible').click()
        cy.url().should('include', '/#/learner-mgmt/courses')
        LEManageTemplateCoursesPage.getManageTemplateCoursesContainerByNameThenClick('Catalog')
        LEManageTemplateCoursesPage.getToggleClickVerifyStatus(LEManageTemplateCoursesPage.getHideCategoriesToggleModule(), 'true')
        LEManageTemplateCoursesPage.getToggleClickVerifyStatus(LEManageTemplateCoursesPage.getHideEnrolledCoursesToggleModule(), 'true')
        cy.get(LEManageTemplateCoursesPage.getCatalogDefaultViewModule()).parent().within(() => {
            cy.get(LECoursesPage.getCardViewBtn()).should('have.class', 'icon-view-cards')
        })
        cy.get(LEManageTemplateCoursesPage.getContainerSaveBtn()).click()
        cy.get(LEManageTemplateCoursesPage.getSuccessMessage()).should('have.text', 'Changes Saved.')

    })

    it('Verify Categories & Enrolled Courses are Hidden from the Catalog', () => {
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)

        cy.get(LEDashboardPage.getNavMenu()).click();
        LESideMenu.getLEMenuItemsByNameThenClick("Catalog");
        cy.get(LEDashboardPage.getCategorySelector(courses.category_01_name)).should('not.exist')
        cy.get(LEDashboardPage.getElementByAriaLabelAttribute("Choose View")).find('span').should('have.class', 'icon-view-cards')
        cy.get(LEFilterMenu.getShowCategoriesTxt()).should('not.exist')
        cy.get(LEDashboardPage.getNavMenu()).click();
        LESideMenu.getLEMenuItemsByNameThenClick("Catalog");
        LECoursesPage.getCourseCardBtnAssertion("Resume")
    })

    it('Toggle Hide Categories & Enrolled Courses OFF', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, "#/login")
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('Manage Template')
        LEManageTemplateMenu.getManageTemplateMenuItemsByName('Courses').should('be.visible').click()
        cy.url().should('include', '/#/learner-mgmt/courses')
        LEManageTemplateCoursesPage.getManageTemplateCoursesContainerByNameThenClick('Catalog')
        LEManageTemplateCoursesPage.getToggleClickVerifyStatus(LEManageTemplateCoursesPage.getHideCategoriesToggleModule(), 'false')
        LEManageTemplateCoursesPage.getToggleClickVerifyStatus(LEManageTemplateCoursesPage.getHideEnrolledCoursesToggleModule(), 'false')
        cy.get(LEManageTemplateCoursesPage.getContainerSaveBtn()).click()
        cy.get(LEManageTemplateCoursesPage.getSuccessMessage()).should('have.text', 'Changes Saved.')
    })

    it('Verify Categories & Enrolled Courses are Restored the Catalog', () => {
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        cy.get(LEDashboardPage.getNavMenu()).click();
        LESideMenu.getLEMenuItemsByNameThenClick("Catalog");
        cy.get(LEFilterMenu.getShowCategoriesTxt()).should('exist')
        cy.get(LEDashboardPage.getLEWaitSpinner(), { timeout: 10000 }).should('not.exist')
        LECoursesPage.getCourseCardBtnAssertion("Resume")

    })

    after("clean up", function () {

        //Cleanup - delete learner
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        cy.get(LEDashboardPage.getNavProfile()).click()
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
        cy.url().then((currentURL) => {
            cy.deleteUser(currentURL.slice(-36));
        })
       
    })

})