import ARDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import { users } from '../../../../../../helpers/TestData/users/users'
import ARCourseSummaryReportPage from '../../../../../../helpers/AR/pageObjects/Reports/ARCourseSummaryReportPage'
import { miscData } from '../../../../../../helpers/TestData/Misc/misc'
import AROCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage'
import ARGlobalResourcePage from '../../../../../../helpers/AR/pageObjects/GlobalResources/ARGlobalResourcePage'
import AREquivalentCoursesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/AREquivalentCourses.module'
import ARCurriculaActivityReportPage from '../../../../../../helpers/AR/pageObjects/Reports/ARCurriculaActivityReportPage'


describe('C1985 AUT-537, AR - Course Summary Report - Tags Filter - Allow for multi selection', () => {
    beforeEach(() => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getCourseSummaryReport()
    })

    it('Tags Filter', () => {
        cy.get(ARDashboardPage.getAddFilterBtn()).click()
        cy.get(ARDashboardPage.getPropertyName() + ARDashboardPage.getDDownField()).eq(0).click()
        cy.get(ARDashboardPage.getPropertyNameDDownSearchTxtF()).type('Tags')
        cy.get(ARDashboardPage.getPropertyNameDDownOpt()).contains('Tags').click()
        cy.get(ARDashboardPage.getOperator() + ARDashboardPage.getDDownField()).eq(1).click()

        // Multiple Tags should be successfully selected
        cy.get(AROCAddEditPage.getGeneralTagsSearchF()).type(miscData.auto_tag3)
        cy.get(ARGlobalResourcePage.getTagsOptions()).contains(miscData.auto_tag3).click()
        cy.get(ARGlobalResourcePage.getTagsOptions()).filter(`:contains(${miscData.auto_tag3})`).should('have.attr', 'aria-selected', 'true')
        cy.get(AROCAddEditPage.getGeneralTagsSearchF()).clear().type(miscData.auto_tag1)
        cy.get(ARGlobalResourcePage.getTagsOptions()).contains(miscData.auto_tag1).click()
        cy.get(ARGlobalResourcePage.getTagsOptions()).filter(`:contains(${miscData.auto_tag1})`).should('have.attr', 'aria-selected', 'true')
        cy.get(AROCAddEditPage.getGeneralTagsSearchF()).clear().type(miscData.auto_tag2)
        cy.get(ARGlobalResourcePage.getTagsOptions()).contains(miscData.auto_tag2).click()
        cy.get(ARGlobalResourcePage.getTagsOptions()).filter(`:contains(${miscData.auto_tag2})`).should('have.attr', 'aria-selected', 'true')
        
        // Verify that each added Tag can be removed by clicking the "X" button
        ARCourseSummaryReportPage.removeSelectedTagByName(miscData.auto_tag1)

        cy.get(ARDashboardPage.getSubmitAddFilterBtn()).click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 20000 }).should('not.exist')
        cy.get(ARDashboardPage.getEditFilterBtn()).should('contain', '2 selected')

        // Verify that admin can add more Tag filters
        cy.get(ARDashboardPage.getAddFilterBtn()).click()
        cy.get(ARDashboardPage.getPropertyName() + ARDashboardPage.getDDownField()).eq(0).click()
        cy.get(ARDashboardPage.getPropertyNameDDownSearchTxtF()).type('Tags')
        cy.get(ARDashboardPage.getPropertyNameDDownOpt()).contains('Tags').click()
        cy.get(ARDashboardPage.getOperator() + ARDashboardPage.getDDownField()).eq(1).click()
        cy.get(AROCAddEditPage.getGeneralTagsSearchF()).clear().type(miscData.auto_tag1)
        cy.get(ARGlobalResourcePage.getTagsOptions()).contains(miscData.auto_tag1).click()
        cy.get(ARGlobalResourcePage.getTagsOptions()).filter(`:contains(${miscData.auto_tag1})`).should('have.attr', 'aria-selected', 'true')
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 20000 }).should('not.exist')
        cy.get(ARDashboardPage.getPropertyName() + ARDashboardPage.getDDownField()).eq(1).click()

        cy.get(ARDashboardPage.getSubmitAddFilterBtn()).click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 20000 }).should('not.exist')

        // Verify that clicking the "X" button removes a filter
        cy.get(AREquivalentCoursesModule.getRemoveFilterEndBtn()).eq(1).click()
        cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')

        cy.get(ARDashboardPage.getRemoveFilterBtn()).click()
        cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')
        cy.get(ARDashboardPage.getRemoveFilterBtn()).should('not.exist')
    })

    it('Tags Filter and Cancels the Filter', () => {
        cy.get(ARDashboardPage.getAddFilterBtn()).click()
        cy.get(ARDashboardPage.getPropertyName() + ARDashboardPage.getDDownField()).eq(0).click()
        cy.get(ARDashboardPage.getPropertyNameDDownSearchTxtF()).type('Tags')
        cy.get(ARDashboardPage.getPropertyNameDDownOpt()).contains('Tags').click()
        cy.get(ARDashboardPage.getOperator() + ARDashboardPage.getDDownField()).eq(1).click()

        // Multiple Tags should be successfully selected
        cy.get(AROCAddEditPage.getGeneralTagsSearchF()).type(miscData.auto_tag3)
        cy.get(ARGlobalResourcePage.getTagsOptions()).contains(miscData.auto_tag3).click()
        cy.get(ARGlobalResourcePage.getTagsOptions()).filter(`:contains(${miscData.auto_tag3})`).should('have.attr', 'aria-selected', 'true')
        cy.get(AROCAddEditPage.getGeneralTagsSearchF()).clear().type(miscData.auto_tag1)
        cy.get(ARGlobalResourcePage.getTagsOptions()).contains(miscData.auto_tag1).click()
        cy.get(ARGlobalResourcePage.getTagsOptions()).filter(`:contains(${miscData.auto_tag1})`).should('have.attr', 'aria-selected', 'true')
        
        // Verify that each added Tag can be removed by clicking the "X" button
        ARCourseSummaryReportPage.removeSelectedTagByName(miscData.auto_tag1)

        cy.get(ARCurriculaActivityReportPage.getFilterContainer()).should('exist')
        cy.get(ARDashboardPage.getSubmitCancelFilterBtn()).click()
        cy.get(ARCurriculaActivityReportPage.getFilterContainer()).should('not.exist')

    })
})