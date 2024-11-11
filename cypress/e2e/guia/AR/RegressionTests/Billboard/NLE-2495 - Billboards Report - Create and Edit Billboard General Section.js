import ARBillboardsAddEditPage from "../../../../../../helpers/AR/pageObjects/Billboards/ARBillboardsAddEditPage"
import ARBillboardsPage from "../../../../../../helpers/AR/pageObjects/Billboards/ARBillboardsPage"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import { billboardsDetails } from "../../../../../../helpers/TestData/Billboard/billboardsDetails"
import { miscData } from "../../../../../../helpers/TestData/Misc/misc"
import { users } from "../../../../../../helpers/TestData/users/users"


describe('AUT-548 - C1996 - Billboards Report - Create and Edit Billboard General Section', () => {

    after('Delete Billboard', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getBillboardsReport()
        ARBillboardsPage.deleteBillboards([billboardsDetails.billboardName])
    })

    beforeEach('Login as a System Admin and navigate to Billboard report page', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getBillboardsReport()
    })

    it('Verify General Section during creation of Billboard', () => {
        ARBillboardsAddEditPage.addSampleBillboard(billboardsDetails.billboardName, miscData.switching_to_absorb_img_url, false)
        // Save the billboard
        cy.get(ARBillboardsAddEditPage.getSaveBtn(), {timeout: 7500}).should('not.have.attr','aria-disabled')
        cy.get(ARBillboardsAddEditPage.getSectionHeader()).contains('General')
        cy.get(ARBillboardsAddEditPage.getSaveBtn()).click()
        cy.get(ARBillboardsAddEditPage.getToastSuccessMsg()).should('be.visible').and('contain','Billboard has been created.')
        cy.get(ARBillboardsAddEditPage.getPageHeaderTitle()).should('have.text', 'Billboards')
        cy.get(ARBillboardsPage.getGridFilterResultLoader(), {timeout: 3000}).should('not.exist')
    })

    it('Verify General Section by editing the new Billboard', () => {
        ARBillboardsPage.AddFilter('Title', 'Equals', billboardsDetails.billboardName)
        cy.get(ARBillboardsPage.getGridFilterResultLoader(), {timeout: 3000}).should('not.exist')
        cy.get(ARBillboardsPage.getGridTable()).eq(0).click()
        cy.get(ARBillboardsPage.getAddEditMenuActionsByName('Edit Billboard')).click()
        cy.get(ARBillboardsAddEditPage.getPageHeaderTitle(), {timeout: 3000}).contains('Edit Billboard')
        
        // Assert that the value entered in Genearion section during creation persisted
        cy.get(ARBillboardsAddEditPage.getGeneralTitleTxtF(), {timeout: 3000}).invoke('val').then(billboardName => {
            expect(billboardName).eq(billboardsDetails.billboardName)
        })

        // We have entered an URL for the Billboard image, File chooser button should not exist
        cy.get(ARBillboardsAddEditPage.getChooseFileBtn(), {timeout: 7500}).should('not.exist')
        cy.get(ARBillboardsAddEditPage.getBillboardImageTxtF()).invoke('val').then(imageUrl => {
            expect(imageUrl).eq(miscData.switching_to_absorb_img_url)
        })

    })
})