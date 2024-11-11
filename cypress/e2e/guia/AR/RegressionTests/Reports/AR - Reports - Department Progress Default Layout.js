import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import { users } from '../../../../../../helpers/TestData/users/users'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import arDepartmentProgressReportPage from '../../../../../../helpers/AR/pageObjects/Reports/ARDepartmentProgressReportPage'
import arCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'

const defaultLayoutItemsInOrder = ['Department','Users', 'Users (including Sub-Depts)', 'Progress(%)', 'Progress (of Enrolled)(%)', 'Average Score(%)']
const defaultActionMenuItemsInOrder = ['Edit','Message Department','Message Department and Subs','View Users', 'Deselect']

describe('GUIA-Auto-AE Regression || Reports || Department Progress - C5141', function(){

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
    })
   
    it('The user wants to visit Department Progress report page and see default layout in order', () => {
        //navigate to Reprots then Certificate page
        LEDashboardPage.getShortWait()
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Reports'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Department Progress'))
        //Verify default layout order
        arCoursesPage.getHFJobWait()
        for(let i = 0; i < defaultLayoutItemsInOrder.length; i++){
            arDepartmentProgressReportPage.getVerifyLayoutMenuItemByNameAndIndex(i+1 ,defaultLayoutItemsInOrder[i])
        }
    })

    it('The user wants to visit Department Progress report page and see Department Progress action menu items in order', () => {
        //navigate to Reprots then Certificate page
        LEDashboardPage.getShortWait()
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Reports'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Department Progress'))
        //Verify default action menu items in order
        arCoursesPage.getHFJobWait()
        cy.get(arDashboardPage.getGridTable()).eq(0).click()
        LEDashboardPage.getShortWait()
        for(let i = 0; i < defaultActionMenuItemsInOrder.length; i++){
            arDepartmentProgressReportPage.getActionMenuItemsInOrder(i,defaultActionMenuItemsInOrder[i])
        }
   })
})