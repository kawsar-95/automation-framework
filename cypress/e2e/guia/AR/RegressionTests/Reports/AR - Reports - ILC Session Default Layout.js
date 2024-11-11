import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import { users } from '../../../../../../helpers/TestData/users/users'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import arCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import ARILCSessionReportPage from '../../../../../../helpers/AR/pageObjects/Reports/ARILCSessionReportPage'

const defaultLayoutItemsInOrder = ['Course','Session', 'Instructor', 'Venue', 'Start Date', 'End Date', 'Time Zone Name', '# of Users Enrolled', '# of Users Absent', '# of Users Completed']
const defaultActionMenuItemsInOrder = ['Mark Attendance','Manage Grades & Attendance','View Waitlist','Enroll Users', 'Message Instructor']

describe('GUIA-Auto-AE Regression || Reports || ILC Session - C5148', function(){

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
    })
   
    it('The user wants to visit ILC Session report page and see default layout in order', () => {
        //navigate to Reprots then Certificate page
        LEDashboardPage.getShortWait()
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Reports'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('ILC Session'))
        //Verify default layout order
        arCoursesPage.getHFJobWait()
        for(let i = 0; i < defaultLayoutItemsInOrder.length; i++){
            ARILCSessionReportPage.getVerifyLayoutMenuItemByNameAndIndex(i ,defaultLayoutItemsInOrder[i])
        }
    })

    it('The user wants to visit ILC Session report page and see ILC Session action menu items in order', () => {
        //navigate to Reprots then Certificate page
        LEDashboardPage.getShortWait()
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Reports'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('ILC Session'))
        //Verify default action menu items in order
        arCoursesPage.getHFJobWait()
        cy.get(arDashboardPage.getGridTable()).eq(0).click()
        LEDashboardPage.getShortWait()
        for(let i = 0; i < defaultActionMenuItemsInOrder.length; i++){
            ARILCSessionReportPage.getActionMenuItemsInOrder(i,defaultActionMenuItemsInOrder[i])
        }
        cy.get(ARILCSessionReportPage.getRightActionMenuContainer()).contains('Deselect').click()
   })
})