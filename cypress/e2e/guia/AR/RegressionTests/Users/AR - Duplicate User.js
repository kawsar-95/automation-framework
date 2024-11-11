import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage";
import { userDetails } from "../../../../../../helpers/TestData/users/UserDetails";
import { users } from "../../../../../../helpers/TestData/users/users";
import ARUserAddEditPage from '../../../../../../helpers/AR/pageObjects/User/ARUserAddEditPage';
import ARSelectModal from "../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal";
import ARDeleteModal from "../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal";
import ARUserPage from "../../../../../../helpers/AR/pageObjects/User/ARUserPage";
import AREnrollUsersPage from "../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage";
import { departments } from "../../../../../../helpers/TestData/Department/departments";


describe('C6331 Edit User - Duplicate User', () => {

  beforeEach(() => {
    //Log in as a system admin
    cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, "/admin");
    //Redirect to the left panel and click on the Users Icon
    cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Users')).click()
    //Click on Users button
    cy.wrap(ARDashboardPage.getMenuItemOptionByName('Users'))
    ARDashboardPage.getMediumWait()

  })

  after(function () {
    //Delete user
    cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
    cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Users'))).click()
    cy.wrap(ARDashboardPage.getMenuItemOptionByName('Users'))
    cy.intercept('**/users/operations').as('getUser').wait('@getUser');
    cy.wrap(ARUserPage.AddFilter('Username', 'Equals', userDetails.username))
    cy.wrap(ARUserPage.selectTableCellRecord(userDetails.username))
    cy.wrap(ARUserPage.WaitForElementStateToChange(ARUserPage.getAddEditMenuActionsByName('Delete'), AREnrollUsersPage.getShortWait()))
    cy.get(ARUserPage.getAddEditMenuActionsByName('Delete')).click()
    cy.wrap(ARUserPage.WaitForElementStateToChange(ARDashboardPage.getElementByDataNameAttribute(ARDeleteModal.getDeleteBtn()), AREnrollUsersPage.getLShortWait()))
    cy.get(ARDashboardPage.getElementByDataNameAttribute(ARDeleteModal.getDeleteBtn())).click().wait('@getUser')
    cy.get(ARUserPage.getNoResultMsg()).contains('No results found.').should('exist')

  })


  it('Add a User and click on the save button', () => {

    cy.get(ARUserAddEditPage.getAddEditMenuActionsByName('Add User')).click()
    //Fill out general section fields
    cy.get(ARUserAddEditPage.getFirstNameTxtF()).type(userDetails.firstName)
    cy.get(ARUserAddEditPage.getLastNameTxtF()).type(userDetails.lastName)
    cy.get(ARUserAddEditPage.getUsernameTxtF()).type(userDetails.username)
    cy.get(ARUserAddEditPage.getPasswordTxtF()).type(userDetails.validPassword)
    cy.get(ARUserAddEditPage.getConfirmPasswordTxtF()).type(userDetails.validPassword)
    cy.get(ARUserAddEditPage.getDepartmentBtn()).click()
    ARSelectModal.SearchAndSelectFunction([departments.dept_top_name])
    ARUserAddEditPage.getLongWait()
    //Save user
    cy.get(ARUserAddEditPage.getSaveBtn()).click()
    ARUserAddEditPage.getLongWait()
    //Toast Notifications will display "Is Active saved" and "User has been created"
    cy.get(ARUserAddEditPage.getToastSuccessMsg()).should('contain', 'User has been created successfully.', 'Is Active saved')

  })
  it('Click on Cancel button then OK button', () => {

    cy.wrap(ARUserPage.AddFilter('Username', 'Equals', userDetails.username))
    cy.wrap(ARUserPage.selectTableCellRecord(userDetails.username))
    //Verify that [Duplicate] button has been added to the Edit User page
    cy.get(ARDashboardPage.getAddEditMenuActionsByName('Duplicate')).should('exist')
    ARUserAddEditPage.getRightActionAddUserMenu()
    ARDashboardPage.getVShortWait()
    cy.get(ARUserAddEditPage.getAddEditMenuActionsByName('Duplicate')).click()
    ARDashboardPage.getMediumWait()
    cy.get(ARDashboardPage.getPageHeaderTitle()).should('contain', 'Add User')
    //Fill out general section fields
    cy.get(ARUserAddEditPage.getFirstNameTxtF()).type(userDetails.firstName)
    cy.get(ARUserAddEditPage.getLastNameTxtF()).type(userDetails.lastName)
    cy.get(ARUserAddEditPage.getUsernameTxtF()).type(userDetails.username)
    cy.get(ARUserAddEditPage.getPasswordTxtF()).type(userDetails.validPassword)
    cy.get(ARUserAddEditPage.getConfirmPasswordTxtF()).type(userDetails.validPassword)
    cy.get(ARUserAddEditPage.getDepartmentBtn()).click()
    ARSelectModal.SearchAndSelectFunction([departments.Dept_B_name])
    ARUserAddEditPage.getLongWait()
    ARUserAddEditPage.WaitForElementStateToChange(ARUserAddEditPage.getCancelBtn())
    //Click on Cancel Button
    cy.get(ARUserAddEditPage.getCancelBtn()).click()
    // Unsaved Changes Modal(You haven't saved your changes. Are you sure you want to leave this page?
    cy.get(ARUserAddEditPage.getElementByDataNameAttribute('discard-changes-prompt')).should('contain', "You haven't saved your changes. Are you sure you want to leave this page?")
    // OK button
    cy.get(ARUserAddEditPage.getElementByDataNameAttribute('confirm')).click({ force: true })
    ARUserAddEditPage.getLongWait()
    cy.get(ARUserAddEditPage.getPageHeaderTitle()).should('contain', 'User')


  })

  it('Click on Cancel button then Cancel button', () => {

    cy.wrap(ARUserPage.AddFilter('Username', 'Equals', userDetails.username))
    cy.wrap(ARUserPage.selectTableCellRecord(userDetails.username))
    //Verify that [Duplicate] button has been added to the Edit User page
    cy.get(ARDashboardPage.getAddEditMenuActionsByName('Duplicate')).should('exist')
    ARUserAddEditPage.getRightActionAddUserMenu()
    ARDashboardPage.getVShortWait()
    cy.get(ARUserAddEditPage.getAddEditMenuActionsByName('Duplicate')).click()
    ARDashboardPage.getMediumWait()
    cy.get(ARDashboardPage.getPageHeaderTitle()).should('contain', 'Add User')
    //Fill out general section fields
    cy.get(ARUserAddEditPage.getFirstNameTxtF()).type(userDetails.firstName)
    cy.get(ARUserAddEditPage.getLastNameTxtF()).type(userDetails.lastName)
    cy.get(ARUserAddEditPage.getUsernameTxtF()).type(userDetails.username)
    cy.get(ARUserAddEditPage.getPasswordTxtF()).type(userDetails.validPassword)
    cy.get(ARUserAddEditPage.getConfirmPasswordTxtF()).type(userDetails.validPassword)
    cy.get(ARUserAddEditPage.getDepartmentBtn()).click()
    ARSelectModal.SearchAndSelectFunction([departments.Dept_B_name])
    ARUserAddEditPage.getLongWait()
    ARUserAddEditPage.WaitForElementStateToChange(ARUserAddEditPage.getCancelBtn())
    //Click on Cancel Button
    cy.get(ARUserAddEditPage.getCancelBtn()).click()
    // Unsaved Changes Modal(You haven't saved your changes. Are you sure you want to leave this page?
    cy.get(ARUserAddEditPage.getElementByDataNameAttribute('discard-changes-prompt')).should('contain', "You haven't saved your changes. Are you sure you want to leave this page?")
    //Click on Cancel Button
    cy.get(ARUserAddEditPage.getElementByDataNameAttribute('cancel')).eq(0).click({ force: true })
    ARUserAddEditPage.getLongWait()
    cy.get(ARDashboardPage.getPageHeaderTitle()).should('contain', 'Add User')


  })

})