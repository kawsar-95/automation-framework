import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import ARILCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage'
import { ilcDetails, sessions } from '../../../../../../helpers/TestData/Courses/ilc'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../helpers/TestData/users/users'
import AREditActivityPage from '../../../../../../helpers/AR/pageObjects/Enrollment/AREditActivityPage'
import { reports } from '../../../../../../helpers/TestData/Reports/reports'
import { userDetails } from '../../../../../../helpers/TestData/users/UserDetails'
import arEnrollUsersPage from '../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage'
import arManageCategoriesPage from '../../../../../../helpers/AR/pageObjects/Category/ARManageCategoryPage'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import ARCourseSettingsEnrollmentRulesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
import defaultTestData from '../../../../../fixtures/defaultTestData.json'
import arCourseEvaluationReportPage from '../../../../../../helpers/AR/pageObjects/Reports/ARCourseEvaluationReportPage'
import { departments } from '../../../../../../helpers/TestData/Department/departments'
import arLearnerCompetenciesReportPage from '../../../../../../helpers/AR/pageObjects/Reports/ARLearnerCompetenciesReportPage'
import arAssessmentsReportPage from '../../../../../../helpers/AR/pageObjects/Reports/ARAssessmentsReportPage'
import arILCActivityReportPage from '../../../../../../helpers/AR/pageObjects/Reports/ARILCActivityReportPage'
import arUserPage from '../../../../../../helpers/AR/pageObjects/User/ARUserPage'
import arDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'



describe('AR - Reports - Add Session - Create Course and Filter the data on ILC Activity Report', function(){

    var i=0;
    let SearchData = [`${sessions.sessionName_1}`,`${defaultTestData.USER_LEARNER_LNAME}`,`${defaultTestData.USER_LEARNER_FNAME}`,`${userDetails.username}`,`${departments.dept_top_name}`,`${reports.course_Status}`]; //test specific array
    let SearchDetails = [`Session Name`, `Last Name`,`First Name`,`Username`,`Department`,`Status`];

    before(function() {
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
    })

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
    })
    after(function() {
        //Delete Course
        cy.deleteCourse(commonDetails.courseID, 'instructor-led-courses-new')

        //Delete user
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getMediumWait()
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
    it('Create ILC Course ,Add session & Publish Course ', () => {

        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))

        cy.createCourse('Instructor Led', ilcDetails.courseName, false)

        //Open Enrollment Rules
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        ARILCAddEditPage.getShortWait()

        //Select Allow Self Enrollment Specific Radio Button
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')
        //Add Session
        cy.get(ARILCAddEditPage.getAddSessionBtn()).click({timeout:5000})
        //Set Valid Title
        cy.get(ARILCAddEditPage.getSessionDetailsTitleTxtF()).should('have.attr', 'aria-invalid', 'false').clear().type(sessions.sessionName_1)
        ARILCAddEditPage.getFutureDate(2)

        //Expand Self Enrollment and Add Self Enrollment Rule
        cy.get(arCoursesPage.getElementByAriaLabelAttribute(ARILCAddEditPage.getExpandEnrollmentRulesBtn())).click()
        cy.get(ARILCAddEditPage.getAllowSelfEnrollmentRadioBtn()).contains('All Learners').click()

        //Save ILC Session
        cy.get(ARILCAddEditPage.getAddEditSessionSaveBtn()).click()
        ARILCAddEditPage.getLShortWait()

        //Publish Course
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = (id.request.url.slice(-36));
        })
    })
    it('should enroll a learner to an ILC Course', function() {

        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))

        //Enroll Leaner in already created course
        arEnrollUsersPage.getEnrollUserByCourseAndUsername([ilcDetails.courseName], [userDetails.username],sessions.sessionName_1)

        //Select Course Enrollment Button
        cy.get(arCoursesPage.getAddEditMenuActionsByName('Course Enrollments')).should('have.attr', 'aria-disabled', 'false').click()
        //Validate Course Enrollment page header
        cy.get(arCoursesPage.getPageHeaderTitle()).should('have.text', "Course Enrollments")
        //Filter user name data and select check box 
        arCoursesPage.AddFilter(`Username`,`Equals`,userDetails.username)
        arManageCategoriesPage.SelectManageCategoryRecord()
        //Select Edit Enrollment Button 
        cy.wrap(arCoursesPage.WaitForElementStateToChange(arCoursesPage.getAddEditMenuActionsByName('Edit Enrollment'), 1000))
        cy.get(arCoursesPage.getAddEditMenuActionsByName('Edit Enrollment')).click()
        arCoursesPage.getShortWait()
        //Select Comleted radio button
        cy.wrap(AREditActivityPage.getMarkEnrollmentAsRadioBtn('Completed'))
        //Enter score in score section
        cy.get(AREditActivityPage.getScoreEnrollmentTxtF()).type(reports.score)
        //Save Enrollment
        cy.wrap(AREditActivityPage.WaitForElementStateToChange(AREditActivityPage.getSaveBtn()), 1000)
        cy.get(AREditActivityPage.getSaveBtn()).click()
        AREditActivityPage.getLongWait()


       })
       it("Filter the saved course data in ILC Activity Report ",()=>{
        //Select ILC Activity report from Reports
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Reports'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('ILC Activity'))
        //Filter already created course and select from drop down
        arCourseEvaluationReportPage.MandatoryReportFilter(ilcDetails.courseName)

        for(i=0;i< SearchDetails.length;i++){
            if(i< SearchDetails.length-5){
            //Filter and validate Session data   
            arILCActivityReportPage.AddFilter(SearchDetails[i], 'Contains',SearchData[i])
            cy.get(arILCActivityReportPage.getA5TableCellRecordByColumn(2+parseInt([i]))).contains(SearchData[i]).should('be.visible')
            cy.get(arILCActivityReportPage.getElementByTitleAttribute(arILCActivityReportPage.getRemoveBtn())).should('be.visible').click()
            }else if(i< SearchDetails.length-2){
            //Filter the data for Last name,First name,User name 
            arILCActivityReportPage.AddFilter(SearchDetails[i], 'Equals',SearchData[i])
            cy.get(arILCActivityReportPage.getA5TableCellRecordByColumn(3+parseInt([i]))).should('contain',SearchData[i])
            cy.get(arILCActivityReportPage.getElementByTitleAttribute(arILCActivityReportPage.getRemoveBtn())).should('be.visible').click()
            }else if(i==SearchDetails.length-2){
            //Filter and validate data for department
            arILCActivityReportPage.AddFilter(SearchDetails[i], 'Is Only',SearchData[i])
            cy.get(arILCActivityReportPage.getA5TableCellRecordByColumn(3+parseInt([i]))).should('contain',SearchData[i])
            cy.get(arILCActivityReportPage.getElementByTitleAttribute(arILCActivityReportPage.getRemoveBtn())).should('be.visible').click()
            }else if(i==SearchDetails.length-1){
            //Filter and validate data for status
            cy.wait(2000)
            arILCActivityReportPage.AddFilter(SearchDetails[i], 'Date Completed',null)
            cy.get(arILCActivityReportPage.getA5TableCellRecordByColumn(3+parseInt([i]))).should('contain',SearchData[i])
            cy.get(arILCActivityReportPage.getElementByTitleAttribute(arILCActivityReportPage.getRemoveBtn())).should('be.visible').click()
            }
          }
          arILCActivityReportPage.AddFilter(SearchDetails[0], 'Contains',SearchData[0])
          arILCActivityReportPage.getShortWait()
          cy.get(arILCActivityReportPage.getA5TableCellRecordByColumn(2+parseInt([0]))).contains(SearchData[0]).click()
          //Validate Action Btn level
          arILCActivityReportPage.getRightActionMenuLabel()
        
        })
    })