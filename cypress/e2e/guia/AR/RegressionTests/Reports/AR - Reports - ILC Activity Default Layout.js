import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import { users } from '../../../../../../helpers/TestData/users/users'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import arILCActivityReportPage from "../../../../../../helpers/AR/pageObjects/Reports/ARILCActivityReportPage"

const defaultLayoutItemsInOrder = ['Session','Session Start Date','Last Name','First Name','Username', 'Department', 'Status', 'Score (%)']

describe('GUIA-Auto-AE Regression || Reports || ILC Activity - C5149', function(){

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
    })
   
    it('The user wants to visit ILC Activity report page and see default layout in order', () => {
        //navigate to Reprots then Certificate page
        LEDashboardPage.getShortWait()
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Reports'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('ILC Activity'))
        LEDashboardPage.getShortWait()
        cy.get(arILCActivityReportPage.getFilterCancelBtn()).click()
        //Verify default layout order
        arDashboardPage.getMediumWait()
        for(let i = 0; i < defaultLayoutItemsInOrder.length-1; i++){
            arILCActivityReportPage.getVerifyLayoutMenuItemByNameAndIndex(i,defaultLayoutItemsInOrder[i])
        }
    })
})