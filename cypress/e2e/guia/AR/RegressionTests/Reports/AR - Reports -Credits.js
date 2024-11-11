/// <reference types="cypress" />
import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import { users } from '../../../../../../helpers/TestData/users/users'
import { userDetails } from '../../../../../../helpers/TestData/users/UserDetails'
import arEnrollUsersPage from '../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage'
import { arrayOfCourses } from '../../../../../../helpers/TestData/Courses/commonDetails'
import arCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import arManageCategoriesPage from '../../../../../../helpers/AR/pageObjects/Category/ARManageCategoryPage'
import AREditActivityPage from '../../../../../../helpers/AR/pageObjects/Enrollment/AREditActivityPage'
import { credit} from '../../../../../../helpers/TestData/Courses/commonDetails'
import defaultTestData from '../../../../../fixtures/defaultTestData.json'
import { departments } from '../../../../../../helpers/TestData/Department/departments'
import arCreditsReportPage from '../../../../../../helpers/AR/pageObjects/Reports/ARCreditsReportPage'
import arUserPage from '../../../../../../helpers/AR/pageObjects/User/ARUserPage'
import arDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import arCourseActivityReportPage from '../../../../../../helpers/AR/pageObjects/Reports/ARCourseActivityReportPage'


 describe('AR - Reports -Create Online Course ,Enroll Learner and Fillter the data in Credit Report', function () {
    var i=0;
    let SearchData = [`${arrayOfCourses.fiveElementsArray[0]}`,`${defaultTestData.USER_LEARNER_LNAME}`, `${defaultTestData.USER_LEARNER_FNAME}`,`${departments.dept_top_name}`,`${credit.credit2}`]; //test specific array
    let SearchDetails = [`Course Name`,`Last Name`, `First Name`,`Department`,`Credits`,`Active Enrollment`];
    

    before(function() {
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
    })

    beforeEach(function() {        
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getMediumWait()
    })
    after(function() {
        //Delete user
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.wait(2000)
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Users'))).click()
        cy.wait(5000)
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Users'))
        cy.intercept('**/users/operations').as('getUser').wait('@getUser');
        cy.wrap(arUserPage.AddFilter('Username', 'Equals', userDetails.username))
        arCreditsReportPage.getMediumWait()
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
        //Enroll learner in already created code 
        arEnrollUsersPage.getEnrollUserByCourseAndUsername([arrayOfCourses.fiveElementsArray[0]], [userDetails.username])
        //Select Course Enrollment Button
        cy.wrap(arCoursesPage.WaitForElementStateToChange(arCoursesPage.getAddEditMenuActionsByName('Course Enrollments'), 1000))
        cy.get(arCoursesPage.getAddEditMenuActionsByName('Course Enrollments')).click()
        //Validate Course Enrollments page header
        cy.get(arCoursesPage.getPageHeaderTitle()).should('have.text', "Course Enrollments")
        arCoursesPage.getMediumWait()
        //Filter user name and select this filteruser
        arCoursesPage.AddFilter(`Username`,`Equals`,userDetails.username)
        arManageCategoriesPage.getMediumWait()
        arManageCategoriesPage.SelectManageCategoryRecord()
        //Select Edit enrollment Button
        cy.wrap(arCoursesPage.WaitForElementStateToChange(arCoursesPage.getAddEditMenuActionsByName('Edit Enrollment'), 1000))
        cy.get(arCoursesPage.getAddEditMenuActionsByName('Edit Enrollment')).click()
        //Enter credit data in credit section
        cy.get(AREditActivityPage.getCreditEnrollmentTxtF()).type(credit.credit2)
        //Save details
        cy.wrap(AREditActivityPage.WaitForElementStateToChange(AREditActivityPage.getSaveBtn()), 1000)
        cy.get(AREditActivityPage.getSaveBtn()).click()
    })
    it("Filter the saved course credit data in Credit Report ",()=>{

        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Reports'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Credits'))
        arCreditsReportPage.getMediumWait()
        for(i=0;i< SearchDetails.length;i++)
        {
         if(i< SearchDetails.length-3){
             //Filter and validate course name ,last name and first name 
            arCreditsReportPage.AddFilter(SearchDetails[i], 'Contains',SearchData[i])
            arCreditsReportPage.getMediumWait()
            cy.get(arCreditsReportPage.getA5TableCellRecordByColumn(2+parseInt([i]))).contains(SearchData[i]).should('be.visible')
            cy.get(arCreditsReportPage.getElementByAriaLabelAttribute(arCreditsReportPage.getRemoveBtn())).should('be.visible').click()
         }else if(i==SearchDetails.length-3){
             //Filter and validate department data 
             arCreditsReportPage.AddFilter(SearchDetails[i], 'Is Only',SearchData[i] )
             arCreditsReportPage.getMediumWait()
            cy.get(arCreditsReportPage.getA5TableCellRecordByColumn(2+parseInt([i]))).contains(SearchData[i]).should('be.visible')
            cy.get(arCreditsReportPage.getElementByAriaLabelAttribute(arCreditsReportPage.getRemoveBtn())).should('be.visible').click()
         }else if(i==SearchDetails.length-2){
             //Filter and validate credit and active enrollment data 
           arCreditsReportPage.AddFilter(SearchDetails[i], 'Equals',SearchData[i] )
           arCreditsReportPage.getMediumWait()
           cy.get(arCreditsReportPage.getA5TableCellRecordByColumn(2+parseInt([i]))).contains(SearchData[i]).should('be.visible')
           cy.get(arCreditsReportPage.getA5TableCellRecordByColumn(2+parseInt([i]))).contains(SearchData[i]).click()
         }
        }
        //Select deselect check box 
       cy.get(arCreditsReportPage.getDeselectBtn()).click()
    })
})