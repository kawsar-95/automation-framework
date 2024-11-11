// <reference types="cypress" />
import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import { users } from '../../../../../../helpers/TestData/users/users'
import { userDetails } from '../../../../../../helpers/TestData/users/UserDetails'
import arEnrollUsersPage from '../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage'
import { arrayOfCourses } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { courses } from '../../../../../../helpers/TestData/Courses/courses'
import { courseSummary} from '../../../../../../helpers/TestData/Courses/commonDetails'
import arCourseSummaryReportPage from '../../../../../../helpers/AR/pageObjects/Reports/ARCourseSummaryReportPage'
import arManageCategoriesPage from '../../../../../../helpers/AR/pageObjects/Category/ARManageCategoryPage'
import arUserPage from '../../../../../../helpers/AR/pageObjects/User/ARUserPage'
import arDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import ARCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'

describe('AR - Reports -Create OC Course, Upload Certificate, & Publish Course and filter the data in Course Summary report', function () {
    var i=0;
    
    let SearchData = [`${courses.oc_filter_01_name}`,`${courseSummary.enrolled_Count}`,`${courseSummary.notStarted_Count}`,`${courseSummary.inProgress_Count}`,`${courseSummary.completed_Count}`]; //test specific array
    let SearchDetails = [`Course`,`Enrolled`,`Not Started`,`In Progress`,`Completed`];

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
    it("Filter tha course data in Course summary report",()=>{
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Reports'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Course Summary'))
        arCourseSummaryReportPage.getShortWait()

        for(i=0;i<SearchData.length;i++)
        {
            if(i< SearchData.length-4){
            //Filter and valiate the data for Course
            arCourseSummaryReportPage.AddFilter(SearchDetails[i], 'Contains',SearchData[i] ) 
            arCourseSummaryReportPage.getMediumWait()       
            cy.get(arCourseSummaryReportPage.getA5TableCellRecordByColumn(2+parseInt([i]))).contains(SearchData[i]).should('be.visible')
            cy.get(arCourseSummaryReportPage.getRemoveAllBtn()).click()
            }else if(i<=SearchData.length){
            //Filter and validate the data for Enrolled,Not Started,In Progress,Completed 
            arCourseSummaryReportPage.AddFilter(SearchDetails[i], 'Equals',SearchData[i] ) 
            arCourseSummaryReportPage.getMediumWait()        
            cy.get(arCourseSummaryReportPage.getA5TableCellRecordByColumn(3+parseInt([i]))).contains(SearchData[i]).should('be.visible')
            cy.get(arCourseSummaryReportPage.getRemoveAllBtn()).click()
            }
             
           }  
            arCourseSummaryReportPage.AddFilter(SearchDetails[0], 'Contains',SearchData[0] )    
            arCourseSummaryReportPage.getMediumWait()     
            cy.get(arCourseSummaryReportPage.getA5TableCellRecordByColumn(2)).contains(SearchData[0]).click()
            //Validate Action Menu Btn levels
            arCourseSummaryReportPage.getRightActionMenuLabel() 
            arCourseSummaryReportPage.getMediumWait() 
            ARCoursesPage.getContextMenuByName('Deselect').click()
            cy.get(arDashboardPage.getGridTable()).within(() => {
                cy.get(ARCoursesPage.getCheckedInput()).should('have.length', 0)
            })
         })
   })   