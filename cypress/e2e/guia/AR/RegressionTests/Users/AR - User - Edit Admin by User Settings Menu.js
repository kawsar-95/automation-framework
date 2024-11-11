import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arDashboardAccountMenu from '../../../../../../helpers/AR/pageObjects/Menu/arDashboardAccount.menu'
import ARUserAddEditPage from '../../../../../../helpers/AR/pageObjects/User/ARUserAddEditPage';
import { users } from '../../../../../../helpers/TestData/users/users'
import {userDetails}  from '../../../../../../helpers/TestData/users/UserDetails'
import arSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import { departments } from '../../../../../../helpers/TestData/Department/departments'
import ARDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage';
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage';
import LEProfilePage from '../../../../../../helpers/LE/pageObjects/User/LEProfilePage';

describe('Portal Setting- User Settings ', function () {

    before(function () {
      cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
      cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
      cy.url().should('include','myabsorb')
      //Add the role to new user
      cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Users',{timeout:5000}))).click()
      arDashboardPage.getMenuItemOptionByName('Users')
      ARUserAddEditPage.getShortWait()
      ARUserAddEditPage.getEditUserByUsername(userDetails.username)
      ARUserAddEditPage.getMediumWait()
      //Give the user admin permission
      ARUserAddEditPage.getSelectAccountToggleBtnByName('Admin')
      ARUserAddEditPage.getShortWait()
      ARUserAddEditPage.getAddRoleByName('Admin')
      ARUserAddEditPage.getShortWait()
      ARUserAddEditPage.WaitForElementStateToChange(ARUserAddEditPage.getSaveBtn())
      ARUserAddEditPage.getShortWait()
      cy.get(ARUserAddEditPage.getSaveBtn()).click()
      ARUserAddEditPage.getMediumWait()
    })
  
    it('Enter the first name ,Last name, User name, Department (Required field) and click on save button ', () =>{ 

      //Signin with system admin
      cy.apiLoginWithSession(userDetails.username, userDetails.validPassword, '/admin')
      cy.get(arDashboardPage.getCurrentUserLabel()).should('contain.text',"GUIA-CED User")
      cy.get(arDashboardPage.getElementByDataNameAttribute(arDashboardPage.getHelpAndSupportBtn())).should('be.visible')
      //Select Account Menu 
      cy.get(arDashboardPage.getElementByDataNameAttribute(arDashboardPage.getAccountBtn())).click()
      //Select Portal Setting option from account menu
      cy.get(arDashboardAccountMenu.getUserSettingsBtn()).should('exist').click()
      //Enter the first name ,Last name, User name, Department (Required field) and click on save button
      ARDashboardPage.getMediumWait()
      /*Verify:
      1-Enroll user,                                6-Reset Password,
      2-Assign competencies,                        7-Merge User,
      3-Message User,                               8-Duplicate,
      4-user transcript,                            9-Delete
      5-View history,
      is displayed*/
      ARUserAddEditPage.getRightActionMenuLabel()
      //Edit the admin
      cy.get(ARUserAddEditPage.getFirstNameTxtF()).clear().type(userDetails.firstName2)
      cy.get(ARUserAddEditPage.getLastNameTxtF()).clear().type(userDetails.lastName2)
      cy.get(ARUserAddEditPage.getUsernameTxtF()).clear().type(userDetails.username2)
      cy.get(ARUserAddEditPage.getDepartmentBtn()).click()
      arSelectModal.SearchAndSelectFunction([departments.Dept_B_name])
      ARDashboardPage.getMediumWait()
      cy.get(ARUserAddEditPage.getSaveBtn()).click()
      ARDashboardPage.getMediumWait()
    })

    it('delete user', () => {
      //Cleanup - Get userID, logout, and delete them
      cy.apiLoginWithSession(userDetails.username, userDetails.validPassword, '/#/public-dashboard')
      LEDashboardPage.getShortWait()
      cy.get(LEDashboardPage.getNavProfile()).click()  
      cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
      cy.url().then((currentURL) => {
        cy.deleteUser(currentURL.slice(-36));
      })
    })
})


    


