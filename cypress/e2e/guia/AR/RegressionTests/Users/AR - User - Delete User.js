import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage";
import { userDetails } from "../../../../../../helpers/TestData/users/UserDetails";
import { users } from "../../../../../../helpers/TestData/users/users";
import ARUserAddEditPage from '../../../../../../helpers/AR/pageObjects/User/ARUserAddEditPage';
import ARSelectModal from "../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal";
import ARDeleteModal from "../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal";
import ARUserPage from "../../../../../../helpers/AR/pageObjects/User/ARUserPage";
import AREnrollUsersPage from "../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage";
import { departments } from "../../../../../../helpers/TestData/Department/departments";


describe('C6334 Edit User - Delete User', () => {

    before('Add a User and click on the save button', () => {
        //Log in as a system admin
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, "/admin");
        //Redirect to the left panel and click on the Users Icon
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Users')).click()
        //Click on Users button
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Users'))
        ARDashboardPage.getMediumWait()
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
        cy.get(ARUserAddEditPage.getToastSuccessMsg()).should('contain', 'User has been created successfully.')


    })

    beforeEach(() => {
        //Log in as a system admin
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, "/admin");
        //Redirect to the left panel and click on the Users Icon
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Users')).click()
        //Click on Users button
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Users'))

    })


    it('Delete User', () => {

        //Delete user
        cy.intercept('**/users/operations').as('getUser').wait('@getUser');
        cy.wrap(ARUserPage.AddFilter('Username', 'Equals', userDetails.username))
        cy.wrap(ARUserPage.selectTableCellRecord(userDetails.username))
        cy.wrap(ARUserPage.WaitForElementStateToChange(ARUserPage.getAddEditMenuActionsByName('Delete'), AREnrollUsersPage.getShortWait()))
        //Verify that [Duplicate] button has been added to the Edit User page
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Delete')).should('exist')
        ARUserAddEditPage.getRightActionAddUserMenu()
        cy.get(ARUserPage.getAddEditMenuActionsByName('Delete')).click()
        //Verify that clicking [Delete] button will open the Delete user modal
        cy.wrap(ARUserPage.WaitForElementStateToChange(ARDashboardPage.getElementByDataNameAttribute(ARDeleteModal.getDeleteBtn()), AREnrollUsersPage.getLShortWait()))
        //Verify that clicking [Delete] button will open the Delete user modal
        cy.get(ARDashboardPage.getElementByDataNameAttribute(ARDeleteModal.getDeleteBtn())).should('be.visible')
        //Verify that selecting the [Cancel] button user is not deleted and the user  remains in the list of users
        cy.get(ARDashboardPage.getPageHeaderTitle()).should('contain', 'Users')
        cy.get(ARDashboardPage.getElementByDataNameAttribute(ARDeleteModal.getCancelBtn())).click()
        //Verify that selecting the [Delete] button deletes the user from list of users
        cy.get(ARUserPage.getAddEditMenuActionsByName('Delete')).click()
        /* Verify that the modal displays[Delete] and [Cancel] buttons and message
          "Are you sure you want to delete 'xxxx'? , xxxx is name of the user */
        cy.get(ARDeleteModal.getDeletePromptContent()).should('contain', `Are you sure you want to delete '` + userDetails.firstName + ` ` + userDetails.lastName + `'?`)
        cy.get(ARDeleteModal.getElementByDataNameAttribute('confirm')).contains('Delete').should('be.visible')
        cy.get(ARDeleteModal.getElementByDataNameAttribute('cancel')).contains('Cancel').should('be.visible')
        cy.get(ARDashboardPage.getElementByDataNameAttribute(ARDeleteModal.getDeleteBtn())).click().wait('@getUser')
        //Verify that a toast message is displayed when User is successfully deleted
        cy.get(ARUserPage.getNoResultMsg()).contains('No results found.').should('exist')


    })


})