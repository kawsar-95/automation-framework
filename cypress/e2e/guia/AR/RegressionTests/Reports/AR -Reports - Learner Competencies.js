import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arCompetencyPage from '../../../../../../helpers/AR/pageObjects/Competency/ARCompetencyPage'
import arCompetencyAddEditPage from '../../../../../../helpers/AR/pageObjects/Competency/ARCompetencyAddEditPage'
import { competencyDetails } from '../../../../../../helpers/TestData/Competency/competencyDetails'
import { users } from '../../../../../../helpers/TestData/users/users'
import arAssignCompetencyPage from '../../../../../../helpers/AR/pageObjects/Competency/ARAssignCompetencyPage'
import { departments } from '../../../../../../helpers/TestData/Department/departments'
import arLearnerCompetenciesReportPage from '../../../../../../helpers/AR/pageObjects/Reports/ARLearnerCompetenciesReportPage'
import arManageCategoriesPage from '../../../../../../helpers/AR/pageObjects/Category/ARManageCategoryPage'
import arUnsavedChangesModal from '../../../../../../helpers/AR/pageObjects/Modals/ARUnsavedChangesModal'
import arDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import ARLearnerProgressReportPage from '../../../../../../helpers/AR/pageObjects/Reports/ARLearnerProgressReportPage'


describe('AR - Reports - Add Comepetencies ,assign competency and Filter the data in Learner Competencies Report', function () {
    var i=0;
    let SearchDetails = [`Last Name`, `First Name`,`Department`,`Competency Name`];
    let SearchData = [`${users.adminLogInOut.admin_loginout_lname}`,`${users.adminLogInOut.admin_loginout_fname}`,`${departments.dept_top_name}`,`${competencyDetails.competencyName}`]; //test specific array
    

    beforeEach(function () {
        // Sign in with System Admin account
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        
    })
    after(function () {
      //Verify Deleted Competency
      arLearnerCompetenciesReportPage.A5AddFilter(SearchDetails[3], 'Equals', SearchData[3])
      arLearnerCompetenciesReportPage.getShortWait()
      cy.get("body").then($body=>{
        if($body.find(arLearnerCompetenciesReportPage.getNotResultFoundMsg()).length >0){
          cy.log("No record available to Delete")
       }else {
        arManageCategoriesPage.SelectManageCategoryRecord()
        arLearnerCompetenciesReportPage.getA5AddEditMenuActionsByNameThenClick('Delete Learner Competency')
        cy.get(arDeleteModal.getA5OKBtn()).click()
       }
      })
    })

    it('should allow admin user to create a Competency', () => {
      // Click the Courses menu item
      cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
      arDashboardPage.getMenuItemOptionByName('Competencies')
      cy.intercept('/Admin/Competencies/GetCompetencies').as('getCompetency').wait('@getCompetency');

        // Verify that 
        cy.get(arCompetencyPage.getA5PageHeaderTitle()).should('have.text', "Competencies")
        arCompetencyPage.getA5AddEditMenuActionsByNameThenClick('Competency')
        cy.get(arCompetencyAddEditPage.getA5SaveBtn()).click()
        cy.get(arCompetencyAddEditPage.getNameErrorMsg()).should('have.text', 'Name is required')

        // Create Competency
        cy.get(arCompetencyAddEditPage.getNameTxtF()).type(competencyDetails.competencyName)
        cy.get(arCompetencyAddEditPage.getDescriptionTxtA()).type(competencyDetails.description)
        cy.get(arCompetencyAddEditPage.getLeaderboardTxtF()).type(competencyDetails.competencyLeaderboard)

        // Save Competency
        cy.get(arCompetencyAddEditPage.getA5SaveBtn()).click().wait('@getCompetency')
        
         // Search Competency
        arCompetencyPage.A5AddFilter('Name', 'Starts With', competencyDetails.competencyName)
        arCompetencyPage.getShortWait()
        arCompetencyPage.selectA5TableCellRecord(competencyDetails.competencyName)
        arCompetencyPage.A5WaitForElementStateToChange(arCompetencyPage.getA5AddEditMenuActionsByIndex(2))
 
         // Assign Competency to a User
        arCompetencyPage.getA5AddEditMenuActionsByNameThenClick('Assign to User')
        cy.get(arAssignCompetencyPage.getUsersDDown()).click()
        arAssignCompetencyPage.getUsersDDownOpt(users.adminLogInOut.admin_loginout_fname + ' ' + users.adminLogInOut.admin_loginout_lname)
        arCompetencyPage.getA5AddEditMenuActionsByNameThenClick('Assign')
        cy.wait('@getCompetency');
        arCompetencyPage.getLShortWait()
    })
    it("Filter Compentencies data in Learner Competencies Report ",()=>{

        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Reports'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Learner Competencies'))
        cy.intercept('**/Admin/LearnerCompetencies/GetLearnerCompetencies').as('getLearnerCompetencies').wait('@getLearnerCompetencies');
        
        for(i=0;i<SearchData.length;i++)
        {
        if(i< SearchData.length-2){
          //Filter and validate Last name and first name 
          arLearnerCompetenciesReportPage.A5AddFilter(SearchDetails[i], 'Contains',SearchData[i])
          arLearnerCompetenciesReportPage.getLShortWait()
          cy.get(arLearnerCompetenciesReportPage.getA5TableCellRecordByColumn(2+parseInt([i]))).contains(SearchData[i]).should('be.visible')
          cy.get(arLearnerCompetenciesReportPage.getElementByTitleAttribute(arLearnerCompetenciesReportPage.getRemoveBtn())).click()
        }else if(i==SearchData.length-2){
          //Filter and validate department
          arLearnerCompetenciesReportPage.DeptAddFilter(SearchDetails[i], 'Is Only',SearchData[i])
          arLearnerCompetenciesReportPage.getShortWait()
          cy.get(arLearnerCompetenciesReportPage.getA5TableCellRecordByColumn(2+parseInt([i]))).contains(SearchData[i]).should('be.visible')
          cy.get(arLearnerCompetenciesReportPage.getElementByTitleAttribute(arLearnerCompetenciesReportPage.getRemoveBtn())).click()
        }else if(i== SearchData.length-1){
           //Filter and validate competency name and level data
          arLearnerCompetenciesReportPage.A5AddFilter(SearchDetails[i], 'Equals',SearchData[i])
          arLearnerCompetenciesReportPage.getLShortWait()
          cy.get(arLearnerCompetenciesReportPage.getA5TableCellRecordByColumn(2+parseInt([i]))).contains(SearchData[i]).should('be.visible')
          cy.get(arLearnerCompetenciesReportPage.getElementByTitleAttribute(arLearnerCompetenciesReportPage.getRemoveBtn())).click()
          }
         }
          
          //Select Assign Cometencies Button
          arLearnerCompetenciesReportPage.getA5AddEditMenuActionsByNameThenClick('Assign Competencies')
          //Validate Page header
          cy.get(arAssignCompetencyPage.getA5PageHeaderTitle()).should('have.text', "Learner Competencies")
          //Click on Add Cometencies Button
          cy.get(arAssignCompetencyPage.getAddCompetenciesBtn()).click()
          cy.get(arAssignCompetencyPage.getSearchCompetencies()).type(SearchData[3])
          arAssignCompetencyPage.getCompetenciesDDownOpt(SearchData[3])
          cy.get(arAssignCompetencyPage.getCompetenciesChoseBtn()).should('contain','Continue').click()
          //Select user from the user drop down
          cy.get(arAssignCompetencyPage.getUsersDDown()).click()
          arAssignCompetencyPage.getUsersDDownOpt(users.adminLogInOut.admin_loginout_fname + ' ' + users.adminLogInOut.admin_loginout_lname)
          //Select Assign Button from Right menu
          arCompetencyPage.getA5AddEditMenuActionsByNameThenClick('Assign')

          cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
          cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Reports'))).click()
          cy.wrap(arDashboardPage.getMenuItemOptionByName('Learner Competencies'))   
          cy.wait('@getLearnerCompetencies');
          //Select Assign Competencies Button 
          arLearnerCompetenciesReportPage.getA5AddEditMenuActionsByNameThenClick('Assign Competencies')
          //Validate Page header
          cy.get(arCompetencyPage.getA5PageHeaderTitle()).should('have.text', "Learner Competencies")
          arAssignCompetencyPage.getShortWait()
          //Select cancel Button 
          arAssignCompetencyPage.getA5AddEditMenuActionsByNameThenClick('Cancel')
          cy.wait('@getLearnerCompetencies');

          for(i=0;i<3;i++)
          {
          //Select Assign Competencies Button and Execute Save ,don't save and Cancel Button Steps 
          arLearnerCompetenciesReportPage.getA5AddEditMenuActionsByNameThenClick('Assign Competencies')
          cy.get(arAssignCompetencyPage.getA5PageHeaderTitle()).should('have.text', "Learner Competencies")
          cy.get(arAssignCompetencyPage.getAddCompetenciesBtn()).click()
          cy.get(arAssignCompetencyPage.getSearchCompetencies()).type(SearchData[3])
          arAssignCompetencyPage.getCompetenciesDDownOpt(SearchData[3])
          cy.get(arAssignCompetencyPage.getCompetenciesChoseBtn()).should('contain','Continue').click()
          cy.get(arAssignCompetencyPage.getUsersDDown()).click()
          arAssignCompetencyPage.getUsersDDownOpt(users.adminLogInOut.admin_loginout_fname + ' ' + users.adminLogInOut.admin_loginout_lname)
          arAssignCompetencyPage.getA5AddEditMenuActionsByNameThenClick('Cancel')
          if(i==0)
          {
            //Select save button from Unsaved Pop Up message 
          arUnsavedChangesModal.getClickUnsavedActionBtnByName("Save")
          cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
          cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Reports'))).click()
          cy.wrap(arDashboardPage.getMenuItemOptionByName('Learner Competencies'))   
          cy.wait('@getLearnerCompetencies');
          }else if(i==1)
          {
           //Select Don't Save button from Unsaved Pop Up message 
          arUnsavedChangesModal.getClickUnsavedActionBtnByName("Don't Save")
          cy.wait('@getLearnerCompetencies');
          }else if(i==2)
          {
          arUnsavedChangesModal.getClickUnsavedActionBtnByName("Cancel")
          arCompetencyPage.getA5AddEditMenuActionsByNameThenClick('Cancel')
          arUnsavedChangesModal.getClickUnsavedActionBtnByName("Don't Save")
          cy.wait('@getLearnerCompetencies');
          arUnsavedChangesModal.getMediumWait()
          }
          
        }
        //Filter and select the check box 
        arLearnerCompetenciesReportPage.A5AddFilter(SearchDetails[3], 'Contains',SearchData[3])
        arLearnerCompetenciesReportPage.getLShortWait()
        cy.get(arLearnerCompetenciesReportPage.getA5TableCellRecordByColumn(2+parseInt([3]))).contains(SearchData[3]).click()
        //Validate Right action Button levels
        arLearnerCompetenciesReportPage.getRightActionMenuLabel()
        //Select Edit User Button
        arLearnerCompetenciesReportPage.getA5AddEditMenuActionsByNameThenClick('Edit User')
        cy.intercept('/api/rest/v2/admin/reports/users/operations').as('getEditUser').wait('@getEditUser');
        //Select Cancel Button In edit user page
        cy.get(ARLearnerProgressReportPage.getCancelEditBtn()).click()
        cy.wait('@getLearnerCompetencies');

        arLearnerCompetenciesReportPage.A5AddFilter(SearchDetails[3], 'Contains',SearchData[3])
        arLearnerCompetenciesReportPage.getShortWait()
        cy.get(arLearnerCompetenciesReportPage.getA5TableCellRecordByColumn(2+parseInt([3]))).contains(SearchData[3]).click()
        arLearnerCompetenciesReportPage.getShortWait()
        //Select Deselect Button
        arLearnerCompetenciesReportPage.getA5AddEditMenuActionsByNameThenClick('Deselect')
        arLearnerCompetenciesReportPage.getShortWait()
        //Again select Same check box 
         arManageCategoriesPage.SelectManageCategoryRecord()
        // arLearnerCompetenciesReportPage.getShortWait()
        //Select Delete Learner Competency Button 
        arLearnerCompetenciesReportPage.getA5AddEditMenuActionsByNameThenClick('Delete Learner Competency')
        cy.get(arDeleteModal.getA5OKBtn()).click()
  })
})