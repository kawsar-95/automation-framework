import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arAddEditCategoryPage from '../../../../../../helpers/AR/pageObjects/Category/ARAddEditCategoryPage'
import arCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import arRolesAddEditPage from '../../../../../../helpers/AR/pageObjects/Roles/ARRolesAddEditPage'
import { rolesDetails } from '../../../../../../helpers/TestData/Roles/rolesDetails'
import ARUserAddEditPage from '../../../../../../helpers/AR/pageObjects/User/ARUserAddEditPage'
import arSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import { departments } from '../../../../../../helpers/TestData/Department/departments'
import {userDetails}  from '../../../../../../helpers/TestData/users/UserDetails'
import arDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import arManageCategoriesPage from '../../../../../../helpers/AR/pageObjects/Category/ARManageCategoryPage'
import { users } from '../../../../../../helpers/TestData/users/users'
import arUnsavedChangesModal from '../../../../../../helpers/AR/pageObjects/Modals/ARUnsavedChangesModal'

describe('C7433 - C7434 - AR-Categories-Adding New Category',()=>{
    var i=0;
    beforeEach(()=>{
      cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
      arDashboardPage.getRolesReport()
    })
    after(function()
    {
      //Delete Roles
      cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
      arDashboardPage.getRolesReport()
      arRolesAddEditPage.AddFilter('Name', 'Starts With', `${rolesDetails.roleName}${arRolesAddEditPage.getAppendText()}${arRolesAddEditPage.getCopyText()}`)
      arRolesAddEditPage.getLShortWait()
      cy.get("body").then($body=>{
        if($body.find(arRolesAddEditPage.getNoResultMsg()).length >0){
          cy.log("No record available to Delete")
      }else{
        arManageCategoriesPage.SelectManageCategoryRecord()
        cy.wrap(arDashboardPage.WaitForElementStateToChange(arDashboardPage.getAddEditMenuActionsByName('Delete Role'), 1000))
        cy.get(arCoursesPage.getCoursesActionsButtonsByLabel('Delete Role')).click()
        //Click on delete button on delete role pop up
        cy.get(arRolesAddEditPage.getElementByDataNameAttribute(arDeleteModal.getDeleteBtn())).click()
        cy.get(arRolesAddEditPage.getNoResultMsg()).should('have.text', 'No results found.')
      }
    })
    })
 it("should be able to adding new roles",()=>{

    //Verify navigated window
      cy.get(arCoursesPage.getPageHeaderTitle()).should('have.text', "Roles")
      for(i=0;i<2;i++){
      cy.wrap(arDashboardPage.WaitForElementStateToChange(arDashboardPage.getAddEditMenuActionsByName('Add Role'), 1000))
      cy.get(arCoursesPage.getCoursesActionsButtonsByLabel('Add Role')).click()
      cy.get(arAddEditCategoryPage.getPageHeaderTitle()).should('have.text', "Add Role")
      cy.get(arRolesAddEditPage.getGeneralNameTxtF()).clear().type(rolesDetails.roleName)
      cy.get(arRolesAddEditPage.getGeneralDescriptionTxtF()).clear().type(rolesDetails.roleDescription)
      cy.get(arRolesAddEditPage.getCourseSelectAllCheckBox()).should("have.text","Select All").click({force:true})
      cy.get(arRolesAddEditPage.getCourseDeselectAllCheckBox()).should("have.text","Deselect All").click()
    if(i==0){
        //Cancel Roles
      cy.get(arRolesAddEditPage.getCancelBtn()).click()
      cy.get(arUnsavedChangesModal.getUnsavedChangesTxt()).should('contain',arUnsavedChangesModal.getUnsavedChangesMsg())
      cy.get(arUnsavedChangesModal.getOKBtn()).contains('OK').click()
      cy.get(arCoursesPage.getPageHeaderTitle()).should('have.text', "Roles")
      }else if(i==1){
        // Save Roles
       cy.get(arRolesAddEditPage.getSaveBtn()).contains('Save').click()
       //verify the saved role
       arRolesAddEditPage.AddFilter('Name', 'Starts With', `${rolesDetails.roleName}`)
       arRolesAddEditPage.getLShortWait()
       cy.get(arDashboardPage.getA5TableCellRecordByColumn(2)).contains(`${rolesDetails.roleName}`).should("be.visible")
       
      }
    }
  })
      it("should be allow to update the existing role",()=>{
       cy.viewport(1600,900)
        for(i=0;i<2;i++){
        //Filter the existing role
        arRolesAddEditPage.getLShortWait()
         arRolesAddEditPage.AddFilter('Name', 'Starts With', `${rolesDetails.roleName}`)
         arRolesAddEditPage.getMediumWait()
         cy.get(arDashboardPage.getA5TableCellRecordByColumn(2)).contains(`${rolesDetails.roleName}`).click()
        arDashboardPage.getLShortWait()
        cy.get(arCoursesPage.getCoursesActionsButtonsByLabel('Edit Role')).click()
        cy.get(arRolesAddEditPage.getGeneralNameTxtF()).clear().type(`${rolesDetails.roleName}${arRolesAddEditPage.getAppendText()}`)
        cy.get(arRolesAddEditPage.getGeneralDescriptionTxtF()).clear().type(`${rolesDetails.roleDescription}${arRolesAddEditPage.getAppendText()}`)
        cy.get(arRolesAddEditPage.getCourseSelectAllCheckBox()).should("have.text","Select All").click({force:true})
        cy.get(arRolesAddEditPage.getCourseDeselectAllCheckBox()).should("have.text","Deselect All").click()
        if(i==0){
            //Cancel Roles
        cy.get(arRolesAddEditPage.getCancelBtn()).click()
        cy.get(arUnsavedChangesModal.getUnsavedChangesTxt()).should('contain',arUnsavedChangesModal.getUnsavedChangesMsg())
        cy.get(arUnsavedChangesModal.getOKBtn()).contains('OK').click()
        cy.intercept('/api/rest/v2/admin/reports/roles/operations').as('getRoles').wait('@getRoles');
        cy.get(arCoursesPage.getPageHeaderTitle()).should('have.text', "Roles")
        }else if(i==1){
            // Save Roles
        cy.get(arRolesAddEditPage.getSaveBtn()).contains('Save').click()
        //verify the saved role
        arRolesAddEditPage.AddFilter('Name', 'Starts With', `${rolesDetails.roleName}${arRolesAddEditPage.getAppendText()}`)
        arRolesAddEditPage.getLShortWait()
        cy.get(arDashboardPage.getA5TableCellRecordByColumn(2)).contains(`${rolesDetails.roleName}${arRolesAddEditPage.getAppendText()}`).should("be.visible")
          }
          cy.get(arRolesAddEditPage.getRemoveFilterBtn()).click()
         }
      })
     it("should be able to create duplicate roles by existing role",()=>{

      cy.viewport(1600,900)
        arRolesAddEditPage.AddFilter('Name', 'Starts With', `${rolesDetails.roleName}${arRolesAddEditPage.getAppendText()}`)
        arDashboardPage.getMediumWait()
        cy.get(arDashboardPage.getA5TableCellRecordByColumn(2)).contains(`${rolesDetails.roleName}${arRolesAddEditPage.getAppendText()}`).click()
        cy.wrap(arDashboardPage.WaitForElementStateToChange(arDashboardPage.getAddEditMenuActionsByName('Duplicate Role'), 1000))
        cy.get(arCoursesPage.getCoursesActionsButtonsByLabel('Duplicate Role')).click()
        arCoursesPage.getLShortWait()
        // Save Duplicate Roles
       cy.get(arRolesAddEditPage.getSaveBtn()).contains('Save').click()
       //verify Duplicated Roles
       cy.get(arRolesAddEditPage.getRemoveFilterBtn()).click()
       arRolesAddEditPage.AddFilter('Name', 'Starts With', `${rolesDetails.roleName}${arRolesAddEditPage.getAppendText()}`)
       arRolesAddEditPage.getLShortWait()
       cy.get(arDashboardPage.getA5TableCellRecordByColumn(2)).contains(`${rolesDetails.roleName}${arRolesAddEditPage.getAppendText()}${arRolesAddEditPage.getCopyText()}`)
     })
     it("should be able to adding a user into a role by existing role",()=>{
       cy.viewport(1600,900)
        arRolesAddEditPage.AddFilter('Name', 'Starts With', `${rolesDetails.roleName}${arRolesAddEditPage.getAppendText()}${arRolesAddEditPage.getCopyText()}`)
        arRolesAddEditPage.getMediumWait()
        cy.get(arDashboardPage.getA5TableCellRecordByColumn(2)).contains(`${rolesDetails.roleName}${arRolesAddEditPage.getAppendText()}${arRolesAddEditPage.getCopyText()}`).click()
        cy.wrap(arDashboardPage.WaitForElementStateToChange(arDashboardPage.getAddEditMenuActionsByName('View Users'), 1000))
        cy.get(arCoursesPage.getCoursesActionsButtonsByLabel('View Users')).click()
        cy.get(arCoursesPage.getPageHeaderTitle()).should('have.text', "Users")
        cy.get(arRolesAddEditPage.getRemoveAllBtn()).click()
        cy.wrap(arDashboardPage.WaitForElementStateToChange(arDashboardPage.getAddEditMenuActionsByName('Add User'), 1000))
        cy.get(arCoursesPage.getCoursesActionsButtonsByLabel('Add User')).click().click({force:true})
        //Fill out general section fields
        cy.get(ARUserAddEditPage.getFirstNameTxtF()).type(`${userDetails.firstName}`,{timeout:6000})
        cy.get(ARUserAddEditPage.getLastNameTxtF()).type(userDetails.lastName)
        cy.get(ARUserAddEditPage.getUsernameTxtF()).type(`${userDetails.username}`)
        cy.get(ARUserAddEditPage.getPasswordTxtF()).type(userDetails.validPassword)
        cy.get(ARUserAddEditPage.getConfirmPasswordTxtF()).type(userDetails.validPassword)
        cy.get(ARUserAddEditPage.getDepartmentBtn()).click()
        arSelectModal.SearchAndSelectFunction([departments.dept_top_name])
        //Turn On Admin Toggle btn
        cy.get(ARUserAddEditPage.getElementByDataNameAttribute(ARUserAddEditPage.getAdminToggleContainer()) + ' ' + ARUserAddEditPage.getToggleDisabled()).click()
        //Setup user management and select all admin roles
        cy.get(ARUserAddEditPage.getUserManagementRadioBtn()).contains('All').click()
        cy.get(ARUserAddEditPage.getRolesDDown()).click()
        cy.get(ARUserAddEditPage.getRolesDDownSearchTxtF()).type(`${rolesDetails.roleName}${arRolesAddEditPage.getAppendText()}${arRolesAddEditPage.getCopyText()}`)
        cy.get(ARUserAddEditPage.getRolesDDownOpt()).contains(`${rolesDetails.roleName}${arRolesAddEditPage.getAppendText()}${arRolesAddEditPage.getCopyText()}`).click()
        cy.get(ARUserAddEditPage.getRolesDDown()).click() //close ddown
        //Save user
        ARUserAddEditPage.WaitForElementStateToChange(ARUserAddEditPage.getSaveBtn())
        cy.get(ARUserAddEditPage.getSaveBtn()).click()
        cy.get(ARUserAddEditPage.getToastSuccessMsg()).should('contain', 'User has been created successfully.')
     })
   

})