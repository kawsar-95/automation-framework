import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arReportsPage from '../../../../../../helpers/AR/pageObjects/ARReportsPage'
import arDepartmentsAddEditPage from '../../../../../../helpers/AR/pageObjects/Departments/ARDepartmentsAddEditPage'
import arSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import LESideMenu from '../../../../../../helpers/LE/pageObjects/Menu/LESideMenu'
import LEManageTemplatePrivateDashboardPage from '../../../../../../helpers/LE/pageObjects/Template/LEManageTemplatePrivateDashboardPage'
import LEManageTemplateTiles from '../../../../../../helpers/LE/pageObjects/Template/LEManageTemplateTiles'
import LEEditTileModal from '../../../../../../helpers/LE/pageObjects/Modals/LEEditTile.modal'
import { dashboardDetails } from '../../../../../../helpers/TestData/Dashboard/dashboardDetails'
import { departmentDetails } from '../../../../../../helpers/TestData/Department/departmentDetails'
import { miscData } from '../../../../../../helpers/TestData/Misc/misc'
import { users } from '../../../../../../helpers/TestData/users/users'

describe('LE - Welcome Tile Create Unique dashboard for child department', function () {
    
    beforeEach(() => {
        // Sign in with System Admin account
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
    })

    it('Create an Child Department from Top Level Dept', () => {
       // Click the Courses menu item
        arDashboardPage.getDepartmentsReport()
        cy.get(arReportsPage.getAddEditMenuActionsByName('Add Department')).should('have.attr','aria-disabled','false').click()

        //Verify that name field cannot be empty
        cy.get(arDepartmentsAddEditPage.getNameTxtF(arDepartmentsAddEditPage.getNameSectionDataName())).type(' ').clear()
        cy.get(arDepartmentsAddEditPage.getTxtFErrorMsgBySectionDataName(arDepartmentsAddEditPage.getNameSectionDataName())).should('have.text', miscData.emptyTextFieldErrorMsg)

        // Enter valid name for the Department name field
        cy.get(arDepartmentsAddEditPage.getNameTxtF(arDepartmentsAddEditPage.getNameSectionDataName())).type(departmentDetails.departmentName)

        // Verify that Department textfield cannot be empty
        cy.get(arDepartmentsAddEditPage.getSelectDepartmentBtn()).click()
        cy.get(arSelectModal.getChooseBtn()).click()
        cy.get(arDepartmentsAddEditPage.getTxtFErrorMsgBySectionDataName(arDepartmentsAddEditPage.getParentIDSectionDataName())).should('have.text', miscData.emptyTextFieldErrorMsg)

        // Select a department
        cy.get(arDepartmentsAddEditPage.getSelectDepartmentBtn()).click()
        cy.get(arSelectModal.getSearchTxtF()).clear().type(departmentDetails.parentDepartment);
        arSelectModal.SelectFunction(departmentDetails.parentDepartment)

        cy.get(arDepartmentsAddEditPage.getExternalIDTxtF()).type(departmentDetails.externalID)
        arDepartmentsAddEditPage.generalToggleSwitch('true',arDepartmentsAddEditPage.getDepartmentContactDetailsContainer())
        cy.get(arDepartmentsAddEditPage.getCompanyNameTxtF()).type(departmentDetails.companyName)
        cy.get(arDepartmentsAddEditPage.getEmailAddressTxtF()).type(departmentDetails.emailAddress)
        cy.get(arDepartmentsAddEditPage.getPhoneNumberTxtF()).type(departmentDetails.phoneNo)

        // Save Department
        arDepartmentsAddEditPage.getShortWait()
        cy.get(arDepartmentsAddEditPage.getSaveBtn()).click()
        cy.intercept('**/api/rest/v2/admin/reports/departments/operations').as('getCreateDepartment').wait('@getCreateDepartment')
    })

    it('Create Unique dashboard for child department ', () => {
        // Click the Courses menu item
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Setup'))).click()
        cy.get(arDashboardPage.getTemplatesOption()).contains(/^Templates$/).click() 
        cy.get(arDashboardPage.getaddnewTemplate()).contains('Template').click()
        cy.get(arDashboardPage.getSearchdeptfortemplate()).contains("None").click({force: true})
        cy.get(arDashboardPage.getSearchinputfordept()).type(departmentDetails.departmentName)
        cy.get(arDashboardPage.getaddtemplatedeptoptions()).contains(departmentDetails.departmentName).click()
        cy.wait(4000)
        cy.get(arDashboardPage.gettemplateAddbutton()).contains("Add").click({force: true})
        LEManageTemplatePrivateDashboardPage.getManageTemplatePrivateDashContainerByNameThenClick('Content')
        cy.get(arDashboardPage.getinheritsettingcheckbox()).click()

        cy.wait(4000) 
    })    

    it('Delete Child Department which created earlier', () => {
        // Click the Courses menu item
        arDashboardPage.getDepartmentsReport()
        arDepartmentsAddEditPage.AddFilter('Name', 'Starts With', departmentDetails.departmentName)
        arDepartmentsAddEditPage.selectTableCellRecord(departmentDetails.departmentName)
        arDepartmentsAddEditPage.WaitForElementStateToChange(arDepartmentsAddEditPage.getAddEditMenuActionsByName('Delete Department'))
        cy.get(arDepartmentsAddEditPage.getAddEditMenuActionsByName('Delete Department')).click()
        arDepartmentsAddEditPage.getLShortWait()
        arDepartmentsAddEditPage.getConfirmModalBtnByText('Delete')
        cy.get(arDepartmentsAddEditPage.getNoResultMsg()).should('have.text', 'No results found.')        
    })
})