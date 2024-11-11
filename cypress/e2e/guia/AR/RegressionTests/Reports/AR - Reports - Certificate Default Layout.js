import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import { users } from '../../../../../../helpers/TestData/users/users'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import ARCertificateReportPage from '../../../../../../helpers/AR/pageObjects/Reports/ARCertificateReportPage'

const defaultLayoutItemsInOrder = ['Course','Last Name', 'First Name', 'Department', 'Certification Date', 'Expiry Date', 'Expires in Days', 'Type']
const defaultActionMenuItemsInOrder = ['Edit','Delete','Download','Deselect']
describe('GUIA-Auto-AE Regression || Reports || Certificate - C5154', function(){

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
    })
   
    it('The user wants to visit     certificate report page and see default layout in order', () => {
        //navigate to Reprots then Certificate page
        LEDashboardPage.getShortWait()
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Reports'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Certificates'))
        //Verify default layout order
        for(let i = 0; i < defaultLayoutItemsInOrder.length; i++){
            ARCertificateReportPage.getVerifyLayoutMenuItemByNameAndIndex(i,defaultLayoutItemsInOrder[i])
        }
    })

    it('The user wants to visit Certificate report page and see certificate action menu items in order', () => {
        //navigate to Reprots then Certificate page
        LEDashboardPage.getShortWait()
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Reports'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Certificates'))
        //Verify default action menu items in order
        cy.get(arDashboardPage.getGridTable()).eq(0).click()
        LEDashboardPage.getShortWait()
        for(let i = 0; i < defaultActionMenuItemsInOrder.length; i++){
            ARCertificateReportPage.getActionMenuItemsInOrder(i,defaultActionMenuItemsInOrder[i])
        }
   })
})