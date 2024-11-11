import arDashboardPage from '../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARCourseSettingsCompletionModule from '../../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCompletion.module'
import arAddMoreCourseSettingsModule from '../../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import ARILCAddEditPage from '../../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage'
import { commonDetails, credit, completion } from '../../../../../../../helpers/TestData/Courses/commonDetails'
import { miscData } from '../../../../../../../helpers/TestData/Misc/misc'
import ARCourseSettingsEnrollmentRulesModule from '../../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
import arCoursesPage from '../../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import { ilcDetails, sessions,recurrence } from '../../../../../../../helpers/TestData/Courses/ilc'
import { users } from '../../../../../../../helpers/TestData/users/users'
import ARUserAddEditPage from '../../../../../../../helpers/AR/pageObjects/User/ARUserAddEditPage'
import arSelectModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import {userDetails}  from '../../../../../../../helpers/TestData/users/UserDetails'
import { departments } from '../../../../../../../helpers/TestData/Department/departments'
import arIlcMarkUserInActivePage from '../../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCMarkUserInActivePage'
import ARSelectModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import arUserPage from '../../../../../../../helpers/AR/pageObjects/User/ARUserPage'
import arDeleteModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import arEnrollUsersPage from '../../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage'
import arCourseEvaluationReportPage from '../../../../../../../helpers/AR/pageObjects/Reports/ARCourseEvaluationReportPage'
import arILCActivityReportPage from '../../../../../../../helpers/AR/pageObjects/Reports/ARILCActivityReportPage'
import arILCSessionReportPage from '../../../../../../../helpers/AR/pageObjects/Reports/ARILCSessionReportPage'


describe('AR - ILC -Create Course with session & publish course and Mark addendance allow failure', function(){
       var i=0;
       let userNames = [`${userDetails.username}`, `${userDetails.username2}`]; //test specific array
    
       beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        
       })
       after(function() {
        //Delete Course
        cy.deleteCourse(commonDetails.courseID, 'instructor-led-courses-new');
        //Delete User
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Users'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Users'))
        cy.intercept('**/users/operations').as('getUser').wait('@getUser');
        for(i=0;i<userNames.length;i++){
        arUserPage.getLongWait()
        cy.wrap(arUserPage.AddFilter('Username', 'Equals', userNames[i]))
        cy.wrap(arUserPage.selectTableCellRecord(userNames[i]))
        cy.wrap(arUserPage.WaitForElementStateToChange(arUserPage.getAddEditMenuActionsByName('Delete'), arEnrollUsersPage.getShortWait()))
        cy.get(arUserPage.getAddEditMenuActionsByName('Delete')).click()
        cy.wrap(arUserPage.WaitForElementStateToChange(arDashboardPage.getElementByDataNameAttribute(arDeleteModal.getDeleteBtn()), arEnrollUsersPage.getLShortWait()))
        cy.get(arDashboardPage.getElementByDataNameAttribute(arDeleteModal.getDeleteBtn())).click().wait('@getUser')
        cy.get(arUserPage.getNoResultMsg()).contains('No results found.').should('exist')
        }
      })

      it("Create ILC Course with session & Publish course ",()=>{
        
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        

        cy.createCourse('Instructor Led')
        
       //Open Enrollment Rules
       cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
       ARILCAddEditPage.getShortWait()

       //Select Allow Self Enrollment All Learners Radio Button
       ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')

        //Open Completion Section
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Completion')).click()
        ARILCAddEditPage.getMediumWait() //Wait for toggles to become enabled
       
       //Choose Competency For Completion
        cy.get(ARCourseSettingsCompletionModule.getAddCompetencyBtn()).click()
        ARCourseSettingsCompletionModule.getCompetencyDDownThenClick()
        ARCourseSettingsCompletionModule.getCompetencySearchTxtF(miscData.competency_01)
        ARCourseSettingsCompletionModule.getCompetencyOpt(miscData.competency_01)

       //Select a Competency level
        ARCourseSettingsCompletionModule.getCompetencyLevelDDownThenClick()
        ARCourseSettingsCompletionModule.getCompetencyLevelOpt('1')
      
      //Toggle Allow Failure to ON
        cy.get(ARILCAddEditPage.getElementByDataNameAttribute(ARCourseSettingsCompletionModule.getAllowFailureToggleContainer()) + ' ' + ARILCAddEditPage.getToggleDisabled()).click()

      //Toggle Re-enrollment On Failure to ON
        cy.get(ARILCAddEditPage.getElementByDataNameAttribute(ARCourseSettingsCompletionModule.getAllowReEnrollmentOnFailureToggleContainer()) + ' ' + ARILCAddEditPage.getToggleDisabled()).click()
      
       //Specify Re-enrollment After Failure Time
        cy.get(ARCourseSettingsCompletionModule.getAllowReEnrollmentYearsTxtF()).clear().type(completion.enrollmentYear)
        cy.get(ARCourseSettingsCompletionModule.getAllowReEnrollmentMonthsTxtF()).clear().type(completion.enrollmentMonth)
        cy.get(ARCourseSettingsCompletionModule.getAllowReEnrollmentDaysTxtF()).clear().type(completion.enrollmentDay)
        
        //Publish Course
        cy.publishCourseAndReturnId().then((id) => {
        commonDetails.courseID = id.request.url.slice(-36);
        })
      })

       it('should be able to create learner type users ,enroll and mark allow failure ', () => {
         cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Users'))).click()
         cy.wrap(arDashboardPage.getMenuItemOptionByName('Users'))
         cy.intercept('/api/rest/v2/admin/reports/users/operations').as('getUsers').wait('@getUsers')
         //Add new users
         for(i=0;i< userNames.length;i++)
         {
         cy.wrap(ARUserAddEditPage.WaitForElementStateToChange(ARUserAddEditPage.getAddEditMenuActionsByName('Add User'), 1000))
         cy.get(ARUserAddEditPage.getAddEditMenuActionsByName('Add User')).click()
         cy.intercept('/api/rest/v2/admin/reports/users').as('getUser').wait('@getUser')
    
        //Fill out general section fields
         cy.get(ARUserAddEditPage.getFirstNameTxtF()).type(userDetails.firstName)
         cy.get(ARUserAddEditPage.getLastNameTxtF()).type(userDetails.lastName)
         cy.get(ARUserAddEditPage.getUsernameTxtF()).type(userNames[i])
         cy.get(ARUserAddEditPage.getPasswordTxtF()).type(userDetails.validPassword)
         cy.get(ARUserAddEditPage.getConfirmPasswordTxtF()).type(userDetails.validPassword)
         cy.get(ARUserAddEditPage.getDepartmentBtn()).click()
         arSelectModal.SearchAndSelectFunction([departments.dept_top_name])
    
        //Save user
        ARUserAddEditPage.WaitForElementStateToChange(ARUserAddEditPage.getSaveBtn())
        cy.get(ARUserAddEditPage.getSaveBtn()).click()
        cy.get(ARUserAddEditPage.getToastSuccessMsg()).should('contain', 'User has been created successfully.')
        }
        for(i=0;i<userNames.length;i++)
        {
        //Enroll  Users  
        cy.wrap(arUserPage.AddFilter('Username', 'Equals', userNames[i])) 
        cy.wrap(arUserPage.selectTableCellRecord(userNames[i]))
        cy.wrap(arEnrollUsersPage.WaitForElementStateToChange(arEnrollUsersPage.getAddEditMenuActionsByName('Enroll User'), 1000))
        cy.get(arEnrollUsersPage.getAddEditMenuActionsByName('Enroll User')).click({force:true})
        cy.intercept('/api/rest/v2/admin/reports/users').as('getUser').wait('@getUser')
        cy.get(arUserPage.getElementByDataNameAttribute(arEnrollUsersPage.getEnrollUsersAddCourseBtn())).click()
        //Search and select course 
        ARSelectModal.SearchAndSelectFunction([ilcDetails.courseName])
        //Select session from drop down
        arEnrollUsersPage.getSelectILCSessionWithinCourse(ilcDetails.courseName,ilcDetails.sessionName)
        cy.wrap(arEnrollUsersPage.WaitForElementStateToChange(arEnrollUsersPage.getSaveBtn()), 1000)
        cy.get(arEnrollUsersPage.getSaveBtn()).click()
        arEnrollUsersPage.getMediumWait()
        cy.get(arEnrollUsersPage.getElementByAriaLabelAttribute(arEnrollUsersPage.getRemoveBtn())).click()
        }
        
        //Choose In ILC Activity from reports
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Reports'))).click()
        arDashboardPage.getMenuItemOptionByName('ILC Activity')

        //Choose Course In ILC Activity 
        arCourseEvaluationReportPage.coursePanelAddFilter(ilcDetails.courseName)
        
        //Filter User name 
        arILCActivityReportPage.A5AddFilter('Username', 'Starts With', userNames[0])
        arILCActivityReportPage.selectA5TableCellRecord(userNames[0])
        arILCActivityReportPage.getA5AddEditMenuActionsByNameThenClick('Edit Activity')

        //Failed radio button select
        arILCActivityReportPage.getLongWait()
        cy.get(arIlcMarkUserInActivePage.getMarkAsRadioBtn()).contains('Failed').click()
        arILCActivityReportPage.WaitForElementStateToChange(arILCActivityReportPage.getSaveBtn())
        cy.get(arILCActivityReportPage.getSaveBtn()).click()
        arILCActivityReportPage.getLShortWait()
        
        //Navigate to ILC Session 
        cy.get(arIlcMarkUserInActivePage.getResultManu()).click()
        cy.get(arIlcMarkUserInActivePage.getResultSessionMenu()).click()
        cy.intercept('/Admin/InstructorLedCourseSessions/GetInstructorLedCourseSessions').as('getILCSession').wait('@getILCSession')
        
        //Filter the Course
        arILCSessionReportPage.A5AddFilter('Course', 'Starts With',ilcDetails.courseName )
        arILCSessionReportPage.selectA5TableCellRecord(ilcDetails.courseName)
        
        //Select Mark Attendance Btn
        arILCSessionReportPage.getA5AddEditMenuActionsByNameThenClick('Mark Attendance')
        cy.get(arIlcMarkUserInActivePage.getMarkAttendanceHeader()).should('have.text','Mark Attendance')
    })
})

