import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import { users } from '../../../../../../helpers/TestData/users/users'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import arCourseApprovalReportPage from '../../../../../../helpers/AR/pageObjects/Reports/ARCourseApprovalReportPage'

const defaultLayoutItemsInOrder = ['Last Name', 'First Name', 'Course Title', 'Department']

describe('GUIA-Auto-AE Regression || Reports || Course Approval - C5152', function(){

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
    })
   
    it('The user wants to visit Course Approval report page and see default layout in order', () => {
        //navigate to Reprots then Certificate page
        LEDashboardPage.getShortWait()
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Reports'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Course Approval'))
        //Verify default layout order
        arDashboardPage.getMediumWait()
        for(let i = 0; i < defaultLayoutItemsInOrder.length; i++){
            arCourseApprovalReportPage.getVerifyLayoutMenuItemByNameAndIndex(i,defaultLayoutItemsInOrder[i])
        }
    })
})