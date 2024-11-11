import { users } from '../../../../../../helpers/TestData/users/users'
import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arAddEditCategoryPage from '../../../../../../helpers/AR/pageObjects/Category/ARAddEditCategoryPage'
import arManageCategoriesPage from '../../../../../../helpers/AR/pageObjects/Category/ARManageCategoryPage'
import {userDetails}  from '../../../../../../helpers/TestData/users/UserDetails'
import defaultTestData from '../../../../../fixtures/defaultTestData.json'
import { departments } from '../../../../../../helpers/TestData/Department/departments'
import arLearnerActivityReportPage from '../../../../../../helpers/AR/pageObjects/Reports/ARLearnerActivityReportPage'
import arEnrollUsersPage from '../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage'
import { arrayOfCourses, courseActivity } from '../../../../../../helpers/TestData/Courses/commonDetails'
import arUserPage from '../../../../../../helpers/AR/pageObjects/User/ARUserPage'
import arDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'

describe('AR - Reports - Enroll learner and filter the data in Learner Activity Report', function () {
    var i=0;
    let SearchData = [`${defaultTestData.USER_LEARNER_FNAME}`,`${departments.dept_top_name}`]; //test specific array
    let SearchDetails = [`First Name`,`Department`, `Status`];
    
    before(function() {
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
    })

    beforeEach(function() {        
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
    })
    
    after(function() {
        //Delete user
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Users'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Users'))
        cy.intercept('**/users/operations').as('getUser').wait('@getUser');
        cy.wrap(arUserPage.AddFilter('Username', 'Equals', userDetails.username))
        cy.wrap(arUserPage.selectTableCellRecord(userDetails.username))
        cy.wrap(arUserPage.WaitForElementStateToChange(arUserPage.getAddEditMenuActionsByName('Delete'), arEnrollUsersPage.getShortWait()))
        cy.get(arUserPage.getAddEditMenuActionsByName('Delete')).click()
        cy.wrap(arUserPage.WaitForElementStateToChange(arDashboardPage.getElementByDataNameAttribute(arDeleteModal.getDeleteBtn()), arEnrollUsersPage.getLShortWait()))
        cy.get(arDashboardPage.getElementByDataNameAttribute(arDeleteModal.getDeleteBtn())).click().wait('@getUser')
        cy.get(arUserPage.getNoResultMsg()).contains('No results found.').should('exist')
    })
    it('should enroll a learner to an Online Course', function() {
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        cy.intercept('/**/reports/courses/operations').as('getCourses').wait('@getCourses')
        arEnrollUsersPage.getEnrollUserByCourseAndUsername([arrayOfCourses.fiveElementsArray[0]], [userDetails.username])
    })

    it("Sorting the data by the filteration in Learner Activity Report",()=>{
        //Select learner activity report from right menu
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Reports'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Learner Activity'))
        cy.intercept('/api/rest/v2/admin/reports/learner-activity').as('getLearnerActivity').wait('@getLearnerActivity')
        
        //Verify Learner Activity navigated window
        cy.get(arLearnerActivityReportPage.getPageHeaderTitle()).should('have.text', "Learner Activity")
        for(i=0;i<SearchDetails.length;i++)
        {
        if(i< SearchDetails.length-2)
        {
        arLearnerActivityReportPage.AddFilter(SearchDetails[i], 'Contains',SearchData[i] )
        arLearnerActivityReportPage.getLShortWait()
        cy.wait('@getLearnerActivity')        
        cy.get(arLearnerActivityReportPage.getA5TableCellRecordByColumn(2+parseInt([i]))).contains(SearchData[i]).should('be.visible')
        cy.get(arLearnerActivityReportPage.getRemoveAllBtn()).click()
        }else if(i== SearchDetails.length-2){
        //Filter and validate the data for dept 
        arLearnerActivityReportPage.AddFilter(SearchDetails[i], 'Is Only',SearchData[i] )
        arLearnerActivityReportPage.getLShortWait() 
        cy.wait('@getLearnerActivity')       
        cy.get(arLearnerActivityReportPage.getA5TableCellRecordByColumn(2+parseInt([i]))).contains(SearchData[i]).should('be.visible')
        cy.get(arLearnerActivityReportPage.getRemoveAllBtn()).click()
        }else if(i== SearchDetails.length -1) {
            //Filter and validate the data for dept 
        arLearnerActivityReportPage.AddFilter(SearchDetails[i], 'Active' )
        arLearnerActivityReportPage.getLShortWait() 
        cy.wait('@getLearnerActivity')       
        cy.get(arLearnerActivityReportPage.getRemoveAllBtn()).click()
        }
      }
      arLearnerActivityReportPage.AddFilter(SearchDetails[0], 'Contains',SearchData[0]) 
      arLearnerActivityReportPage.getLShortWait()
       cy.get(arLearnerActivityReportPage.getA5TableCellRecordByColumn(2+parseInt([0]))).contains(SearchData[0]).click()
       //Validate action level btn
       arLearnerActivityReportPage.getRightActionMenuLabel()
       //Select edit user btn
       cy.get(arLearnerActivityReportPage.getActionBtnByTitle('Edit User')).click()
       //Validate edit user window header 
       cy.get(arLearnerActivityReportPage.getPageHeaderTitle()).should('have.text', "Edit User")
       cy.get(arLearnerActivityReportPage.getCancelBtn()).click()
       //Deselect the selected check box
       arAddEditCategoryPage.selectActionBtnByLevel("Deselect")
       arManageCategoriesPage.SelectManageCategoryRecordWithOutClick()
    })

})