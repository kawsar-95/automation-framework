import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import { users } from '../../../../../../helpers/TestData/users/users'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import arCourseSummaryReportPage from '../../../../../../helpers/AR/pageObjects/Reports/ARCourseSummaryReportPage'

const defaultLayoutItemsInOrder = ['Course','Category', 'Enrolled', 'Not Started', 'In Progress', 'Completed', 'Total Time Spent', 'Average Time Spent']
const defaultActionMenuItemsInOrder = ['Enroll User','Edit Course','View Activity Report','Learner Progress', 'Department Progress', 'Deselect']

describe('GUIA-Auto-AE Regression || Reports || Course Summary - C5144', function(){

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.viewport(1600,1000)
    })
   
    it('The user wants to visit Course Summary report page and see default layout in order', () => {
        //navigate to Reprots then Certificate page
        LEDashboardPage.getShortWait()
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Reports'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Course Summary'))
        //Verify default layout order
        for(let i = 0; i < defaultLayoutItemsInOrder.length; i++){
            arCourseSummaryReportPage.getVerifyLayoutMenuItemByNameAndIndex(i,defaultLayoutItemsInOrder[i])
        }
    })

    it('The user wants to visit Course Summary report page and see Course Summary action menu items in order', () => {
        //navigate to Reprots then Certificate page
        LEDashboardPage.getShortWait()
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Reports'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Course Summary'))
        //Verify default action menu items in order
        cy.get(arDashboardPage.getGridTable()).eq(0).click()
        LEDashboardPage.getShortWait()
        for(let i = 0; i < defaultActionMenuItemsInOrder.length; i++){
            arCourseSummaryReportPage.getActionMenuItemsInOrder(i,defaultActionMenuItemsInOrder[i])
        }
   })
})