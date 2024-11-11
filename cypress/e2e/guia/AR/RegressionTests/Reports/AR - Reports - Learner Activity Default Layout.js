import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import { users } from '../../../../../../helpers/TestData/users/users'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import arCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import ARLearnerActivityReportPage from '../../../../../../helpers/AR/pageObjects/Reports/ARLearnerActivityReportPage'

const defaultLayoutItemsInOrder = ['First Name',  'Department', 'Status']
const defaultActionMenuItemsInOrder = ['Edit User', 'Message User', 'User Transcript', 'View Enrollments', 'Deselect']

describe('GUIA-Auto-AE Regression || Reports || Learner Activity - C5139', function(){

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
    })
   
    it('The user wants to visit Learner Activity  report page and see default layout in order', () => {
        //navigate to Reprots then Certificate page
        LEDashboardPage.getShortWait()
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Reports'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Learner Activity'))
        //Verify default layout order
        LEDashboardPage.getShortWait()
        cy.get(arDashboardPage.getGridTable()).eq(0).click()
        for(let i = 0; i < defaultLayoutItemsInOrder.length; i++){
            ARLearnerActivityReportPage.getVerifyLayoutMenuItemByNameAndIndex(i ,defaultLayoutItemsInOrder[i])
        }
    })

    it('The user wants to visit Learner Activity  report page and see Learner Activity action menu items in order', () => {
        //navigate to Reprots then Certificate page
        LEDashboardPage.getShortWait()
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Reports'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Learner Activity'))
        //Verify default action menu items in order
        LEDashboardPage.getShortWait()
        cy.get(arDashboardPage.getGridTable()).eq(0).click()
        LEDashboardPage.getShortWait()
        for(let i = 0; i < defaultActionMenuItemsInOrder.length; i++){
            ARLearnerActivityReportPage.getActionMenuItemsInOrder(i,defaultActionMenuItemsInOrder[i])
        }
        cy.get(ARLearnerActivityReportPage.getRightActionMenuContainer()).contains('Deselect').click()
   })
})