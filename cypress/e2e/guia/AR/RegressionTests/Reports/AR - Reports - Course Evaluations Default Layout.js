import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import { users } from '../../../../../../helpers/TestData/users/users'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import arCourseEvaluationReportPage from '../../../../../../helpers/AR/pageObjects/Reports/ARCourseEvaluationReportPage'

const defaultLayoutItemsInOrder = ['Question Order', 'Question', 'Average Rating', 'Total Response']

describe('GUIA-Auto-AE Regression || Reports || Course Evaluation - C5151', function(){

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
    })
   
    it('The user wants to visit Course Evaluation report page and see default layout in order', () => {
        //navigate to Reprots then Certificate page
        LEDashboardPage.getShortWait()
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Reports'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Course Evaluations'))
        //Verify default layout order
        arDashboardPage.getMediumWait()
        for(let i = 0; i < defaultLayoutItemsInOrder.length; i++){
            arCourseEvaluationReportPage.getVerifyLayoutMenuItemByNameAndIndex(i+1,defaultLayoutItemsInOrder[i])
        }
    })
})