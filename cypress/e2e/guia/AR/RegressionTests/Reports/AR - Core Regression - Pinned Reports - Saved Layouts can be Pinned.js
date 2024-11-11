import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import { miscData } from "../../../../../../helpers/TestData/Misc/misc"
import { users } from "../../../../../../helpers/TestData/users/users"

describe('AUT-656 - C7288 - Pinned Reports - Saved Layouts can be Pinned', () => {
    beforeEach(() => {
        cy.apiLoginWithSession(
            users.blatAdmin.admin_blat_01_username,
            users.blatAdmin.admin_blat_01_password,
            "/admin"
        )
    })
    it('Pinned Reports', () => {
        ARDashboardPage.getMediumWait()

        cy.get(ARDashboardPage.getMenu('Reports')).click()

        cy.get(ARDashboardPage.getMenuItem()).should('contain', 'Learner Activity')
        cy.get(ARDashboardPage.getMenuItem()).should('contain', 'Learner Progress')
        cy.get(ARDashboardPage.getMenuItem()).should('contain', 'Department Progress')
        cy.get(ARDashboardPage.getMenuItem()).should('contain', 'Learner Competencies')
        cy.get(ARDashboardPage.getMenuItem()).should('contain', 'Course Activity')
        cy.get(ARDashboardPage.getMenuItem()).should('contain', 'Course Summary')
        cy.get(ARDashboardPage.getMenuItem()).should('contain', 'Course Uploads')
        cy.get(ARDashboardPage.getMenuItem()).should('contain', 'Assessments')
        cy.get(ARDashboardPage.getMenuItem()).should('contain', 'Tasks')
        cy.get(ARDashboardPage.getMenuItem()).should('contain', 'ILC Sessions')
        cy.get(ARDashboardPage.getMenuItem()).should('contain', 'ILC Activity')
        cy.get(ARDashboardPage.getMenuItem()).should('contain', 'Curricula Activity')
        cy.get(ARDashboardPage.getMenuItem()).should('contain', 'Course Evaluations')
        cy.get(ARDashboardPage.getMenuItem()).should('contain', 'Course Approvals')
        cy.get(ARDashboardPage.getMenuItem()).should('contain', 'Session Approvals')
        cy.get(ARDashboardPage.getMenuItem()).should('contain', 'Certificates')
        cy.get(ARDashboardPage.getMenuItem()).should('contain', 'Credits')
        cy.get(ARDashboardPage.getMenuItem()).should('contain', 'External Training')
        // Select any above listed report.
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Learner Activity'))
        // Pin a default layout by clicking on Pin report icon on top of the table.
        cy.get(ARDashboardPage.getPinReportBtn()).invoke('attr', 'title').then((title) => {
            if (title === 'Pin Report') {
                cy.get(ARDashboardPage.getPinReportBtn()).click()
            }

        })
        ARDashboardPage.getShortWait()
        cy.get(ARDashboardPage.getMenu('Pinned Reports')).click()
        cy.get(ARDashboardPage.getMenuItem()).should('contain', 'Learner Activity').eq(0).click()

        // Unpin a default layout by clicking on pinned reports icon at top row of the table.
        cy.get(ARDashboardPage.getPinReportBtn()).invoke('attr', 'title').then((title) => {
            if (title === 'Pinned Report') {
                cy.get(ARDashboardPage.getPinReportBtn()).click()
            }

        })
        // // Click on Report layouts icon beside pin report icon on top of the table.
        // cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Report Layouts')).click()
        //Click on Report layouts icon beside pin report icon on top of the table.
        cy.get(ARDashboardPage.getSavedReportLayout()).click()
        // Click on Create New button.
        cy.get(ARDashboardPage.getElementByDataNameAttribute('create-full')).click()
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Nickname')).type(miscData.layout_name_1)
        cy.get(ARDashboardPage.getCreateLayoutModalSaveBtn()).click({ force: true })
        ARDashboardPage.getShortWait()
        cy.get(ARDashboardPage.getPinReportBtn()).invoke('attr', 'title').then((title) => {
            if (title === 'Pin Report') {
                cy.get(ARDashboardPage.getPinReportBtn()).click()
            }
        })
        ARDashboardPage.getShortWait()
        cy.get(ARDashboardPage.getMenu('Pinned Reports')).click()
        // Click on Pinned report icon of saved layout.
        cy.get(ARDashboardPage.getMenuItemSubtitle()).should('contain', miscData.layout_name_1).eq(0).click()

        // Select any saved layout and click on favorite icon to make it favorite icon.
        cy.get(ARDashboardPage.getSavedReportLayout()).click()
        cy.get(ARDashboardPage.getFavoriteBtn()).click()
        // Pin the default layout and several saved layouts from a report with a favorite saved layout by clicking on pin report icon.
        cy.get(ARDashboardPage.getSavedReportLayout()).click()
        cy.get(ARDashboardPage.getSavedLayoutLabel()).contains(miscData.layout_name_1).click()
        cy.get(ARDashboardPage.getPinReportBtn()).invoke('attr', 'title').then((title) => {
            if (title === 'Pin Report') {
                cy.get(ARDashboardPage.getPinReportBtn()).click()
            }
        })
        // Unpin saved layouts after reordering pinned reports.
        cy.get(ARDashboardPage.getSavedReportLayout()).click()
        cy.get(ARDashboardPage.getSavedLayoutLabel()).contains(miscData.layout_name_1).click()
        cy.get(ARDashboardPage.getPinReportBtn()).invoke('attr', 'title').then((title) => {
            if (title === 'Pinned Report') {
                cy.get(ARDashboardPage.getPinReportBtn()).click()
            }
        })
        // Pin the same report again and verify the report order.
        cy.get(ARDashboardPage.getSavedReportLayout()).click()
        cy.get(ARDashboardPage.getSavedLayoutLabel()).contains(miscData.layout_name_1).click()
        cy.get(ARDashboardPage.getPinReportBtn()).invoke('attr', 'title').then((title) => {
            if (title === 'Pin Report') {
                cy.get(ARDashboardPage.getPinReportBtn()).click()
            }
        })
        // Delete created layout
        cy.get(ARDashboardPage.getSavedReportLayout()).click()
        cy.get(ARDashboardPage.getSavedLayoutLabel()).contains(miscData.layout_name_1).click()
        cy.get(ARDashboardPage.getSavedReportLayout()).click()
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getSavedLayoutDeleteBtn()).click()
        // Unpin report
        cy.get(ARDashboardPage.getPinReportBtn()).invoke('attr', 'title').then((title) => {
            if (title === 'Pinned Report') {
                cy.get(ARDashboardPage.getPinReportBtn()).click()
            }
        })
    })
})