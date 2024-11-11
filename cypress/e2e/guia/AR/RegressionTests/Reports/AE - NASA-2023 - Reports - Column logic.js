import ARReportsPage from "../../../../../../helpers/AR/pageObjects/ARReportsPage";
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage";
import { miscData } from "../../../../../../helpers/TestData/Misc/misc";
import { users } from "../../../../../../helpers/TestData/users/users";


describe('AUT - 341  GUIA-Story - NASA-2023 - Reports - Column logic(cloned)', function () {


    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getMediumWait()

    })
    after(function () {
        //Delete Report Layout 
        cy.get(ARReportsPage.getFavoriteReportLayout()).click({ force: true })
        cy.get(ARReportsPage.getReportLayoutMenuDeleteLayoutBtn()).click()

    })


    it('Add/remove columns from Report Layout ', () => {
        // Go to Courses page
        //Click on Courses
        ARDashboardPage.getCoursesReport()
        ARDashboardPage.getMediumWait()
        //Add columns to the report
        cy.get(ARDashboardPage.getDisplayColumns()).click({ force: true })
        cy.get(ARDashboardPage.getCheckboxList()).each(($el) => {
            if (!$el.attr('checked')) {
                cy.wrap($el).click({ force: true })

            }
        })

        cy.get(ARDashboardPage.getDisplayColumns()).click({ force: true }) //Close menu
        // As an Admin create a saved layout
        cy.get(ARReportsPage.getReportGridMenuReportLayoutsBtn()).click()
        cy.get(ARReportsPage.getReportLayoutMenuCreateNewBtn()).click()
        cy.get(ARReportsPage.getReportLayoutNickname()).type(miscData.layout_name_1)
        ARDashboardPage.getShortWait()
        cy.get(ARReportsPage.getReportLayoutSaveBtn()).click()
        cy.get(ARReportsPage.getReportsGridMenuSelectedLayoutName()).click()
        cy.get(ARReportsPage.getSetAsFavoriteBtn()).click()

    })
})