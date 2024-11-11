import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARCouponsAddEditPage from "../../../../../../helpers/AR/pageObjects/E-commerce/Coupons/ARCouponsAddEditPage"
import ARDeleteModal from "../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal"
import ARDepartmentProgressReportPage from "../../../../../../helpers/AR/pageObjects/Reports/ARDepartmentProgressReportPage"
import ARTemplatesReportPage from "../../../../../../helpers/AR/pageObjects/Reports/ARTemplatesReportPage"
import ARTemplatesPage from "../../../../../../helpers/AR/pageObjects/Templates/ARTemplatesPage"
import LEDashboardPage from "../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage"
import LEManageTemplatePrivateDashboardPage from "../../../../../../helpers/LE/pageObjects/Template/LEManageTemplatePrivateDashboardPage"
import LEManageTemplateTiles from "../../../../../../helpers/LE/pageObjects/Template/LEManageTemplateTiles"
import { collaborationDetails } from "../../../../../../helpers/TestData/Collaborations/collaborationDetails"
import { departments } from "../../../../../../helpers/TestData/Department/departments"
import { users } from "../../../../../../helpers/TestData/users/users"


describe("C6361 - AR - Regress - Setup - Templates ", () => {
    beforeEach(() => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        //Navigate to Templates
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Setup'))).click()
        ARTemplatesReportPage.getTemplatesPage()
        cy.get(ARDashboardPage.getA5PageHeaderTitle()).should('have.text', 'Templates')
        ARDashboardPage.getMediumWait()
    })

    it('Add a Template', () => {
        //delete existing dept
        ARTemplatesReportPage.deleteExistingTemplate(departments.Dept_E_name)
        cy.get(ARDeleteModal.getA5OKBtn()).click()
        //Navigating to Add template Page
        cy.get(ARCouponsAddEditPage.getSideBarContent()).within(function () {
            cy.get(ARTemplatesReportPage.getAddtemplateButton()).click()
        })
        ARDashboardPage.getShortWait()
        
        //cy.get(ARTemplatesReportPage.getSectionHeader()).should('have.text','Add Template')
        ARTemplatesReportPage.SearchAndSelectFunction([departments.Dept_E_name])
        ARDashboardPage.getShortWait()
        cy.get(ARTemplatesReportPage.getWarningBanner()).should('not.be.false')
        //Click on Add Template
        cy.get(ARTemplatesPage.getTemplateAddbutton()).click({force:true})
        ARDashboardPage.getMediumWait()
        //Click on Content
        LEManageTemplatePrivateDashboardPage.getManageTemplatePrivateDashContainerByNameThenClick('Content')
        LEDashboardPage.getShortWait()
        cy.get(LEManageTemplatePrivateDashboardPage.getInheritSettingsModule()).within(function () {
            cy.get(LEManageTemplatePrivateDashboardPage.getToggleBtnToInheritSettingsOfParent()).click({ force: true })
        })

        //Need to find initial number of containers so we know which one to target when adding the tile
        cy.get(LEManageTemplateTiles.getContentModule()).find(LEManageTemplateTiles.getContainer()).its('length').then(($length) => {
            //Add new container
            LEManageTemplateTiles.getAddNewContainer($length + 1, 'Tile', collaborationDetails.containerName)
            //Add collaboration activity tile
            LEManageTemplateTiles.getAddNewTile(collaborationDetails.containerName, 'Collaborations Activity')
        })

        //Save changes
        cy.get(LEManageTemplateTiles.getContainerSaveBtn()).click()
        LEDashboardPage.getLShortWait()

        cy.get(LEManageTemplatePrivateDashboardPage.getReturnToAdminTemplateBtn()).click()
        LEDashboardPage.getMediumWait()

        ARTemplatesReportPage.A5AddFilter('Department', 'Is Only', departments.Dept_E_name)

    })
    it("Edit template ", () => {
        //Filtering the Dept 
        ARTemplatesReportPage.A5AddFilter('Department', 'Is Only', departments.Dept_E_name)
        LEDashboardPage.getLShortWait()
        //Clicking on the filtered out department
        cy.get(ARDepartmentProgressReportPage.getA5TableCellRecordByColumn(2 + parseInt([0]))).contains(departments.Dept_E_name).click()
        LEDashboardPage.getLShortWait()
        //Clicking on Edit Action Menu button
        cy.get(ARCouponsAddEditPage.getSideBarContent()).within(function () {
            LEDashboardPage.getMediumWait()
            cy.get(ARTemplatesReportPage.getTemplateEditbutton()).click()
        })
        ARDashboardPage.getMediumWait()

        //Click on Content
        LEManageTemplatePrivateDashboardPage.getManageTemplatePrivateDashContainerByNameThenClick('Content')
        LEDashboardPage.getShortWait()

        //Need to find initial number of containers so we know which one to target when adding the tile
        cy.get(LEManageTemplateTiles.getContentModule()).find(LEManageTemplateTiles.getContainer()).its('length').then(($length) => {
            //Add new container
            LEManageTemplateTiles.getAddNewContainer($length + 1, 'Tile', collaborationDetails.containerName)
            //Add collaboration activity tile
            LEManageTemplateTiles.getAddNewTile(collaborationDetails.containerName, 'Collaborations Activity')
        })

        //Save changes
        cy.get(LEManageTemplateTiles.getContainerSaveBtn()).click()
        LEDashboardPage.getLShortWait()
        //Return back to Admin Template report page 
        cy.get(LEManageTemplatePrivateDashboardPage.getReturnToAdminTemplateBtn()).click()
        LEDashboardPage.getMediumWait()
        //Clear All Filters 
        cy.get(ARTemplatesReportPage.getCLearAllFiltersButton()).click()
        ARDashboardPage.getShortWait()
        //Filter out the edited course
        ARTemplatesReportPage.A5AddFilter('Department', 'Is Only', departments.Dept_E_name)

    })

    it("Delete template ", () => {
        //Filterting the Dept 
        ARTemplatesReportPage.A5AddFilter('Department', 'Is Only', departments.Dept_E_name)
        LEDashboardPage.getLShortWait()
        //Clicking on the filtered out department
        cy.get(ARDepartmentProgressReportPage.getA5TableCellRecordByColumn(2 + parseInt([0]))).contains(departments.Dept_E_name).click()
        //Clicking on Deselect Button
        cy.get(ARCouponsAddEditPage.getSideBarContent()).within(function () {
            cy.get(ARTemplatesReportPage.getTemplateDeselectButton()).click()
        })
        ARDashboardPage.getShortWait()
        //Asserting deselect Button was clicked 
        cy.get(ARCouponsAddEditPage.getSideBarContent()).within(function () {
            cy.get(ARCouponsAddEditPage.getCouponsActionHeader()).should('have.text', 'Add New')
        })

        //Clear All Filters 
        cy.get(ARTemplatesReportPage.getCLearAllFiltersButton()).click()
        ARDashboardPage.getShortWait()

        //Filterting the Dept 
        ARTemplatesReportPage.A5AddFilter('Department', 'Is Only', departments.Dept_E_name)
        LEDashboardPage.getLShortWait()
        cy.get(ARDepartmentProgressReportPage.getA5TableCellRecordByColumn(2 + parseInt([0]))).contains(departments.Dept_E_name).click()

        //Deleting Template
        cy.get(ARCouponsAddEditPage.getSideBarContent()).within(function () {
            cy.get(ARTemplatesReportPage.getTemplateDeletebutton()).click()
        })
        cy.get(ARDeleteModal.getA5OKBtn()).click()

        //Clear All Filters 
        cy.get(ARTemplatesReportPage.getCLearAllFiltersButton()).click()
        ARDashboardPage.getShortWait()

        //Filterting the Dept 
        ARTemplatesReportPage.A5AddFilter('Department', 'Is Only', departments.Dept_E_name)
        //Asserting Template was deleted
        ARDashboardPage.getShortWait()
        cy.get(ARDashboardPage.getA5NoResultMsg()).should('have.text', "Sorry, no results found.");

    })

})