import ARDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import { users } from '../../../../../../helpers/TestData/users/users'
import ARUserAddEditPage from '../../../../../../helpers/AR/pageObjects/User/ARUserAddEditPage'
import arSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import { departments } from '../../../../../../helpers/TestData/Department/departments'
import { groupDetails } from '../../../../../../helpers/TestData/users/UserDetails'
import ARDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import ARGroupPage from '../../../../../../helpers/AR/pageObjects/User/ARGroupPage'

describe("C7359 AUT-714, AR - User - Groups - duplicate the group", () => {

  beforeEach(() => {
    cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username,users.sysAdmin.admin_sys_01_password, "/admin")
    ARDashboardPage.getMediumWait()
  })

  after('Delete this user and group',() => {
    cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username,users.sysAdmin.admin_sys_01_password, "/admin")
    ARDashboardPage.getLongWait()
    
    // Delete Group
    cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Users',{timeout:5000}))).click()
    ARDashboardPage.getMenuItemOptionByName('Groups')
    ARDashboardPage.getShortWait()

    cy.wrap(ARGroupPage.AddFilter('Name', 'Contains', groupDetails.groupName))
    ARGroupPage.getMediumWait()
    cy.get(ARGroupPage.getGridTable()).eq(0).click()
    ARGroupPage.getShortWait()
    cy.get(ARGroupPage.getAddEditMenuActionsByName('Delete Group')).click()
    ARGroupPage.getShortWait()    
    cy.get(ARGroupPage.getElementByDataNameAttribute(ARDeleteModal.getDeleteBtn())).click()    
    ARGroupPage.getMediumWait()

    cy.wrap(ARGroupPage.AddFilter('Name', 'Contains', `${groupDetails.groupName} - Copy`))
    ARGroupPage.getMediumWait()
    cy.get(ARGroupPage.getGridTable()).eq(0).click()
    ARGroupPage.getShortWait()
    cy.get(ARGroupPage.getAddEditMenuActionsByName('Delete Group')).click()
    cy.get(ARGroupPage.getElementByDataNameAttribute(ARDeleteModal.getDeleteBtn())).click()
    ARGroupPage.getShortWait()
  })

  it("Create a new Group", () => {
    // Create a Group
    cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Users',{timeout:5000}))).click()
    ARDashboardPage.getMenuItemOptionByName('Groups')
    ARDashboardPage.getMediumWait()

    cy.wrap(ARGroupPage.WaitForElementStateToChange(ARGroupPage.getAddEditMenuActionsByName('Add Group'), 1000))    
    cy.get(ARGroupPage.getAddEditMenuActionsByName('Add Group')).click()
    ARGroupPage.getShortWait()
    cy.get(ARGroupPage.getGroupNameTxtInput()).clear().type(groupDetails.groupName)
    
    // Select Department
    cy.get(ARUserAddEditPage.getDepartmentBtn()).click()
    arSelectModal.SearchAndSelectFunction([departments.dept_top_name])
    ARGroupPage.getMediumWait()
    
    cy.wrap(ARGroupPage.WaitForElementStateToChange(ARGroupPage.getAssignmentRadioBtn(), 5000))
    cy.get(ARGroupPage.getAssignmentRadioBtn()).invoke('show').click({force: true})
    cy.get(ARGroupPage.getAddRuleBtn()).click()
    cy.get(ARGroupPage.getRuleTxtInput()).type('Toronto', {force: true})
    ARGroupPage.getShortWait()

    cy.get(ARUserAddEditPage.getSaveBtn()).click()
    cy.get(ARUserAddEditPage.getToastSuccessMsg()).should('contain', 'Group has been created.')
    ARGroupPage.getShortWait()
    // Create another Group
    cy.get(ARGroupPage.getAddEditMenuActionsByName('Add Group')).click()
    ARGroupPage.getShortWait()
    cy.get(ARGroupPage.getGroupNameTxtInput()).clear().type(groupDetails.groupName2)
    // Select Department
    cy.get(ARUserAddEditPage.getDepartmentBtn()).click()
    arSelectModal.SearchAndSelectFunction([departments.dept_top_name])
    ARGroupPage.getShortWait()    

    cy.wrap(ARGroupPage.WaitForElementStateToChange(ARGroupPage.getAssignmentRadioBtn(), 5000))
    cy.get(ARGroupPage.getAssignmentRadioBtn()).invoke('show').click({force: true})
    cy.get(ARGroupPage.getAddRuleBtn()).click()
    cy.get(ARGroupPage.getRuleTxtInput()).type('Montreal', {force: true})
    ARGroupPage.getShortWait()

    cy.get(ARUserAddEditPage.getSaveBtn()).click()
    cy.get(ARUserAddEditPage.getToastSuccessMsg()).should('contain', 'Group has been created.')
    ARGroupPage.getShortWait()
  })

  it('duplicate the group', () => {
    cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Users',{timeout:5000}))).click()
    ARDashboardPage.getMenuItemOptionByName('Groups')    

    ARGroupPage.AddFilter('Name', 'Contains', groupDetails.groupName)
    ARGroupPage.getMediumWait()

    cy.get(ARDashboardPage.getTableCellName()).contains(groupDetails.groupName).click()
    ARGroupPage.getShortWait()

    // Click on duplicate group button
    cy.get(ARGroupPage.getDuplicateGroupBtn()).click()
    ARGroupPage.getLongWait()

    // Verify Add group page should be display for duplicate
    cy.get(ARDashboardPage.getPageHeaderTitle()).should('have.text', 'Add Group')

    // Verify Name display as original group name with copy
    cy.get(ARGroupPage.getGroupNameTxtInput()).should('have.value', `${groupDetails.groupName} - Copy`)

    // Click on save
    cy.get(ARUserAddEditPage.getSaveBtn()).click()
    cy.get(ARUserAddEditPage.getToastSuccessMsg()).should('contain', 'Group has been created.')
    ARGroupPage.getLongWait()
    
    // Duplicate group should be display on group list page
    cy.get(ARDashboardPage.getTableCellName()).contains(`${groupDetails.groupName} - Copy`).should('exist')
  })
})