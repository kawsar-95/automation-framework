import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import { users } from '../../../../../../helpers/TestData/users/users'
import ARUserAddEditPage from '../../../../../../helpers/AR/pageObjects/User/ARUserAddEditPage'
import arSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import {userDetails}  from '../../../../../../helpers/TestData/users/UserDetails'
import arDepartmentsAddEditPage from '../../../../../../helpers/AR/pageObjects/Departments/ARDepartmentsAddEditPage'
import { departmentDetails } from '../../../../../../helpers/TestData/Department/departmentDetails'
import { arrayOfCourses } from '../../../../../../helpers/TestData/Courses/commonDetails'
import arCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import { credit} from '../../../../../../helpers/TestData/Courses/commonDetails'
import { reports} from '../../../../../../helpers/TestData/Reports/reports'
import AREditActivityPage from '../../../../../../helpers/AR/pageObjects/Enrollment/AREditActivityPage'
import arEnrollUsersPage from '../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage'
import arDepartmentProgressReportPage from '../../../../../../helpers/AR/pageObjects/Reports/ARDepartmentProgressReportPage'
import arUserPage from '../../../../../../helpers/AR/pageObjects/User/ARUserPage'
import arDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'

describe('AR - Create Department,Create User under created department and enroll user under the course and Filter the data in Department Progress Report', () => {
    var i=0;
    let SearchData = [`${departmentDetails.departmentName}`, `${reports.enroll_Users_Count}`,`${reports.score}`]; 
    let SearchDetails = [`Department`, `Users`,`Average Score(%)`];

    beforeEach(() => {
        // Sign in with System Admin account
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getMediumWait()
    })
   
    after(function() {

        //Delete user
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Users'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Users'))
        cy.intercept('**/users/operations').as('getUser').wait('@getUser');
        cy.wrap(arUserPage.AddFilter('Username', 'Equals', userDetails.username))
        arUserPage.getMediumWait()
        cy.wrap(arUserPage.selectTableCellRecord(userDetails.username))
        cy.wrap(arUserPage.WaitForElementStateToChange(arUserPage.getAddEditMenuActionsByName('Delete'), arEnrollUsersPage.getShortWait()))
        cy.get(arUserPage.getAddEditMenuActionsByName('Delete')).click()
        cy.wrap(arUserPage.WaitForElementStateToChange(arDashboardPage.getElementByDataNameAttribute(arDeleteModal.getDeleteBtn()), arEnrollUsersPage.getLShortWait()))
        cy.get(arDashboardPage.getElementByDataNameAttribute(arDeleteModal.getDeleteBtn())).click().wait('@getUser')
        cy.get(arUserPage.getNoResultMsg()).contains('No results found.').should('exist')

       //Delete department
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Users'))).click()
        arDashboardPage.getMenuItemOptionByName('Departments')
        cy.intercept('**/api/rest/v2/admin/reports/departments/operations').as('getDepartments').wait('@getDepartments')
        arDepartmentsAddEditPage.getMediumWait()
        // Search for the edited department.
        arDepartmentsAddEditPage.AddFilter('Name', 'Starts With', departmentDetails.departmentName)
        arDepartmentsAddEditPage.getMediumWait()
        cy.get(arDepartmentsAddEditPage.getGridTable()).click()
        arDepartmentsAddEditPage.WaitForElementStateToChange(arDepartmentsAddEditPage.getAddEditMenuActionsByName('Delete Department'))
        cy.get(arDepartmentsAddEditPage.getAddEditMenuActionsByName('Delete Department')).click()
        arDepartmentsAddEditPage.getLShortWait()
        arDepartmentsAddEditPage.getConfirmModalBtnByText('Delete')
        cy.get(arDepartmentsAddEditPage.getNoResultMsg()).should('have.text', 'No results found.')
    })
    it('should allow admin user to create a department', () => {

        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Users'))).click()
        arDashboardPage.getMenuItemOptionByName('Departments')
        cy.intercept('**/api/rest/v2/admin/reports/departments/operations').as('getDepartments').wait('@getDepartments')

        cy.get(arDepartmentsAddEditPage.getPageHeaderTitle()).should('have.text', "Departments")
        cy.get(arDepartmentsAddEditPage.getAddEditMenuActionsByName('Add Department')).click()

        // Enter valid name for the Department name field
        cy.get(arDepartmentsAddEditPage.getNameTxtF(arDepartmentsAddEditPage.getNameSectionDataName())).type(departmentDetails.departmentName)
         // Select a department
         cy.get(arDepartmentsAddEditPage.getSelectDepartmentBtn()).click()
         arSelectModal.SelectFunction(departmentDetails.parentDepartment)
    
          // Save Department
        arDepartmentsAddEditPage.getShortWait()
        cy.get(arDepartmentsAddEditPage.getSaveBtn()).click()
        cy.intercept('**/api/rest/v2/admin/reports/departments/operations').as('getCreateDepartment').wait('@getCreateDepartment')
    })
    it('Verify an Admin can Create a Learner Type User with above department', () => {

        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Users'))).click()
        arDashboardPage.getMenuItemOptionByName('Users')
        cy.intercept('/api/rest/v2/admin/reports/users/operations').as('getUsers').wait('@getUsers')
        //Add new user
        
        cy.get(ARUserAddEditPage.getAddEditMenuActionsByName('Add User')).click()
        cy.wrap(ARUserAddEditPage.WaitForElementStateToChange(ARUserAddEditPage.getAddEditMenuActionsByName('Add User'), 1000))

        //Fill out general section fields
        cy.get(ARUserAddEditPage.getFirstNameTxtF()).type(userDetails.firstName)
        cy.get(ARUserAddEditPage.getLastNameTxtF()).type(userDetails.lastName)
        cy.get(ARUserAddEditPage.getUsernameTxtF()).type(userDetails.username)
        cy.get(ARUserAddEditPage.getPasswordTxtF()).type(userDetails.validPassword)
        cy.get(ARUserAddEditPage.getConfirmPasswordTxtF()).type(userDetails.validPassword)
        cy.get(ARUserAddEditPage.getDepartmentBtn()).click()
        arSelectModal.SearchAndSelectFunction([departmentDetails.departmentName])
        //Save user
        ARUserAddEditPage.WaitForElementStateToChange(ARUserAddEditPage.getSaveBtn())
        cy.get(ARUserAddEditPage.getSaveBtn()).click()
        cy.get(ARUserAddEditPage.getToastSuccessMsg()).should('contain', 'User has been created successfully.')
        cy.wait('@getUsers')
    })
    it('should enroll a learner to an Online Course', function() {
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        cy.intercept('/**/reports/courses/operations').as('getCourses').wait('@getCourses')

        arEnrollUsersPage.getEnrollUserByCourseAndUsername([arrayOfCourses.fiveElementsArray[0]], [userDetails.username])
        cy.wrap(arCoursesPage.WaitForElementStateToChange(arCoursesPage.getAddEditMenuActionsByName('Course Enrollments'), 1000))
        cy.get(arCoursesPage.getAddEditMenuActionsByName('Course Enrollments')).click()
        cy.intercept('/api/rest/v2/admin/reports/course-enrollments').as('getCourseEnrollment').wait('@getCourseEnrollment')
        cy.get(arCoursesPage.getPageHeaderTitle()).should('have.text', "Course Enrollments")
        cy.wrap(arCoursesPage.AddFilter('Username', 'Equals', userDetails.username))
        
        cy.wrap(arCoursesPage.selectTableCellRecord(userDetails.username))

        cy.wrap(arCoursesPage.WaitForElementStateToChange(arCoursesPage.getAddEditMenuActionsByName('Edit Enrollment'), 1000))
        cy.get(arCoursesPage.getAddEditMenuActionsByName('Edit Enrollment')).click()
        cy.intercept('/api/rest/v2/admin/reports/online-course-activities/operations').as('getEditEnrollment').wait('@getEditEnrollment')
        
        cy.wrap(AREditActivityPage.getMarkEnrollmentAsRadioBtn('Completed'))
        cy.get(AREditActivityPage.getScoreEnrollmentTxtF()).type(reports.score)
        cy.get(AREditActivityPage.getCreditEnrollmentTxtF()).type(credit.credit2)
        cy.wrap(AREditActivityPage.WaitForElementStateToChange(AREditActivityPage.getSaveBtn()), 1000)
        cy.get(AREditActivityPage.getSaveBtn()).click()
        cy.intercept('/**/reports/courses/operations').as('getCourses').wait('@getCourses')
        AREditActivityPage.getLongWait()
    })
    it("Filter the enrolled learner course data in Learner Progress Report ",()=>{

        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Reports'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Department Progress'))
        cy.intercept('Admin/DepartmentProgress/GetDepartmentProgress').as('getDeptProgress').wait('@getDeptProgress')
        for(i=0;i< SearchDetails.length;i++){
        if(i< SearchDetails.length-2){
        //Filter and validate department
        arDepartmentProgressReportPage.A5DeptAddFilter(SearchDetails[i], 'Is Only',SearchData[i])
        arDepartmentProgressReportPage.getMediumWait()
        cy.get(arDepartmentProgressReportPage.getA5TableCellRecordByColumn(2+parseInt([i]))).contains(SearchData[i]).should('be.visible')
        cy.get(arDepartmentProgressReportPage.getElementByTitleAttribute(arDepartmentProgressReportPage.getRemoveBtn())).should('be.visible').click()
        }else if(i== SearchDetails.length-2){
        //Filter and validate User
        arDepartmentProgressReportPage.A5AddFilter(SearchDetails[i], 'Equals',SearchData[i])
        arDepartmentProgressReportPage.getMediumWait()
        cy.get(arDepartmentProgressReportPage.getA5TableCellRecordByColumn(2+parseInt([i]))).contains(SearchData[i]).should('be.visible')
        cy.get(arDepartmentProgressReportPage.getElementByTitleAttribute(arDepartmentProgressReportPage.getRemoveBtn())).scrollIntoView()
        cy.get(arDepartmentProgressReportPage.getElementByTitleAttribute(arDepartmentProgressReportPage.getRemoveBtn())).should('be.visible').click()
        }else if(i<=SearchDetails.length){
        //Filter and validate avg score
        arDepartmentProgressReportPage.A5AddFilter(SearchDetails[i], 'Equals',SearchData[i])
        arDepartmentProgressReportPage.getMediumWait()
        cy.get(arDepartmentProgressReportPage.getA5TableCellRecordByColumn(5+parseInt([i]))).contains(SearchData[i]).should('be.visible')
        cy.get(arDepartmentProgressReportPage.getElementByTitleAttribute(arDepartmentProgressReportPage.getRemoveBtn())).scrollIntoView()
        cy.get(arDepartmentProgressReportPage.getElementByTitleAttribute(arDepartmentProgressReportPage.getRemoveBtn())).should('be.visible').click()
        }
      }
      arDepartmentProgressReportPage.A5DeptAddFilter(SearchDetails[0], 'Is Only',SearchData[0])
      arDepartmentProgressReportPage.getMediumWait()
      cy.get(arDepartmentProgressReportPage.getA5TableCellRecordByColumn(2+parseInt([0]))).contains(SearchData[0]).click()
      //Validate Action button levels 
      arDepartmentProgressReportPage.getRightActionMenuLabel()
      //Select edit button 
      arDepartmentProgressReportPage.getA5AddEditMenuActionsByNameThenClick(`Edit`)
      cy.intercept('**/api/rest/v2/admin/reports/departments').as('getDepartments').wait('@getDepartments')
      //Validate Edit page header 
      cy.get(arDepartmentProgressReportPage.getPageHeaderTitle()).should('have.text', "Edit Department")
      arDepartmentProgressReportPage.getMediumWait()
      //Select the cancel Button
      cy.get(arDepartmentProgressReportPage.getCancelBtn()).click()
      arDepartmentProgressReportPage.getLongWait()
      cy.intercept('/Admin/DepartmentProgress/GetDepartmentProgress').as('getDeptProgress').wait('@getDeptProgress')
      
      arDepartmentProgressReportPage.A5DeptAddFilter(SearchDetails[0], 'Is Only',SearchData[0])
      arDepartmentProgressReportPage.getMediumWait()
      cy.get(arDepartmentProgressReportPage.getA5TableCellRecordByColumn(2+parseInt([0]))).contains(SearchData[0]).click()
      //Select deselect button 
      arDepartmentProgressReportPage.getA5AddEditMenuActionsByNameThenClick("Deselect")
    })
})