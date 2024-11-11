/// <reference types="cypress" />
import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import { users } from '../../../../../../helpers/TestData/users/users'
import { userDetails } from '../../../../../../helpers/TestData/users/UserDetails'
import arEnrollUsersPage from '../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage'
import { arrayOfCourses } from '../../../../../../helpers/TestData/Courses/commonDetails'
import arCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import arManageCategoriesPage from '../../../../../../helpers/AR/pageObjects/Category/ARManageCategoryPage'
import AREditActivityPage from '../../../../../../helpers/AR/pageObjects/Enrollment/AREditActivityPage'
import { commonDetails,credit } from '../../../../../../helpers/TestData/Courses/commonDetails'
import defaultTestData from '../../../../../fixtures/defaultTestData.json'
import arLearnerProgressReportPage from '../../../../../../helpers/AR/pageObjects/Reports/ARLearnerProgressReportPage'
import { departments } from '../../../../../../helpers/TestData/Department/departments'
import arCourseActivityReportPage from '../../../../../../helpers/AR/pageObjects/Reports/ARCourseActivityReportPage'
import arUserPage from '../../../../../../helpers/AR/pageObjects/User/ARUserPage'
import arDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import { reports } from '../../../../../../helpers/TestData/Reports/reports'


describe('AR- Reports - Create course ,publish and filter the data in Learner Progress Report', function () {
    var i=0;
    let SearchData = [`${defaultTestData.USER_LEARNER_LNAME}`, `${defaultTestData.USER_LEARNER_FNAME}`,`${userDetails.username}`,`${departments.dept_top_name}`,`${reports.progress_Enrollment}`,`${commonDetails.course_Score}`]; 
    let SearchDetails = [`Last Name`, `First Name`,`Username`,`Department`,'Progress of Enrolled','Average Score'];
    

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
    
    it('should enroll a learner to an Already Created Online Course', function() {
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        cy.intercept('/**/reports/courses/operations').as('getCourses').wait('@getCourses')
        //Enroll learner in already created course
        arEnrollUsersPage.getEnrollUserByCourseAndUsername([arrayOfCourses.fiveElementsArray[0]], [userDetails.username])

        cy.wrap(arCoursesPage.WaitForElementStateToChange(arCoursesPage.getAddEditMenuActionsByName('Course Enrollments'), 1000))
        cy.get(arCoursesPage.getAddEditMenuActionsByName('Course Enrollments')).click()
        cy.intercept('/**/reports/course-enrollments/operations').as('getCourseEnrollment').wait('@getCourseEnrollment')
        cy.get(arCoursesPage.getPageHeaderTitle()).should('have.text', "Course Enrollments")

        arCoursesPage.AddFilter('Username','Equals',userDetails.username)
        arCoursesPage.getMediumWait()
        cy.get(arCoursesPage.getTableCellName(4)).contains(userDetails.username).click()
       

        cy.wrap(arCoursesPage.WaitForElementStateToChange(arCoursesPage.getAddEditMenuActionsByName('Edit Enrollment'), 1000))
        cy.get(arCoursesPage.getAddEditMenuActionsByName('Edit Enrollment')).click()

        cy.wrap(AREditActivityPage.getMarkEnrollmentAsRadioBtn('Completed'))
        cy.get(AREditActivityPage.getScoreEnrollmentTxtF()).type(commonDetails.course_Score)
        cy.get(AREditActivityPage.getCreditEnrollmentTxtF()).type(credit.credit2)
        cy.wrap(AREditActivityPage.WaitForElementStateToChange(AREditActivityPage.getSaveBtn()), 1000)
        cy.get(AREditActivityPage.getSaveBtn()).click()
        cy.intercept('/**/reports/courses/operations').as('getCourses').wait('@getCourses')
        AREditActivityPage.getLongWait()
    })
    it("Filter the enrolled learner course data in Learner Progress Report ",()=>{

        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Reports'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Learner Progress'))
        cy.intercept('/api/rest/v2/admin/reports/learner-progress/operations').as('getLearnerProgress').wait('@getLearnerProgress')
        
        for(i=0;i< SearchDetails.length;i++)
        {
        if(i< SearchDetails.length-3){
            //Filter and validate last name,first name and username
           arLearnerProgressReportPage.AddFilter(SearchDetails[i], 'Contains',SearchData[i])
           arLearnerProgressReportPage.getMediumWait()
           cy.get(arLearnerProgressReportPage.getA5TableCellRecordByColumn(2+parseInt([i]))).contains(SearchData[i]).should('be.visible')
           cy.get(arLearnerProgressReportPage.getRemoveAllBtn()).click()
        }else if(i== SearchData.length-3){
          //Filter and validate the data for dept 
           arCourseActivityReportPage.AddFilter(SearchDetails[i], 'Is Only',SearchData[i] ) 
           arCourseActivityReportPage.getMediumWait()
           cy.get(arLearnerProgressReportPage.getA5TableCellRecordByColumn(2+parseInt([i]))).contains(SearchData[i]).should('be.visible')
           cy.get(arLearnerProgressReportPage.getRemoveAllBtn()).click()
         }else if(i<SearchDetails.length){
            arLearnerProgressReportPage.AddFilter(SearchDetails[i], 'Equals',SearchData[i])
            arLearnerProgressReportPage.getMediumWait()
            cy.get(arLearnerProgressReportPage.getA5TableCellRecordByColumn(3+parseInt([i]))).contains(SearchData[i]).should('be.visible')
            cy.get(arLearnerProgressReportPage.getRemoveAllBtn()).click()
         }
        }
        arLearnerProgressReportPage.AddFilter(SearchDetails[2], 'Contains',SearchData[2])
        arLearnerProgressReportPage.getMediumWait()
        cy.get(arLearnerProgressReportPage.getA5TableCellRecordByColumn(2+parseInt([2]))).contains(SearchData[2]).should('be.visible').click()
        arLearnerProgressReportPage.getMediumWait()
        //Validate Action buttons levels 
        arLearnerProgressReportPage.getRightActionMenuLabel()
        //Select Edit User Button
        cy.get(arLearnerProgressReportPage.getActionMenu()).contains('Edit User').click()
        arLearnerProgressReportPage.getShortWait()
        //Validate edit user page header
        cy.get(arLearnerProgressReportPage.getPageHeaderTitle()).should('have.text', "Edit User")
        //Select cancel button
        cy.get(arLearnerProgressReportPage.getCancelEditBtn()).click()
        arLearnerProgressReportPage.getShortWait()
        cy.get(arLearnerProgressReportPage.getActionMenu()).contains('Deselect').click()
        //Validate deselected check box status
        arManageCategoriesPage.SelectManageCategoryRecordWithOutClick()

       })

})