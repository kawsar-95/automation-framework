import arCoursesPage from '../../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import ARILCAddEditPage from '../../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage'
import { ilcDetails, sessions,recurrence } from '../../../../../../../helpers/TestData/Courses/ilc'
import { commonDetails } from '../../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../../helpers/TestData/users/users'
import arDashboardPage from '../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARUserAddEditPage from '../../../../../../../helpers/AR/pageObjects/User/ARUserAddEditPage'
import arSelectModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import {userDetails}  from '../../../../../../../helpers/TestData/users/UserDetails'
import { departments } from '../../../../../../../helpers/TestData/Department/departments'
import arIlcMarkUserInActivePage from '../../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCMarkUserInActivePage'
import arAddMoreCourseSettingsModule from '../../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import ARCourseSettingsEnrollmentRulesModule from '../../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
import arUserPage from '../../../../../../../helpers/AR/pageObjects/User/ARUserPage'
import arDeleteModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import arEnrollUsersPage from '../../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage'
import ARSelectModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import arILCSessionReportPage from '../../../../../../../helpers/AR/pageObjects/Reports/ARILCSessionReportPage'


describe('AR -Create ILC Course,Add Session and Mark Attendance Inactive User ', function(){
    var i=0;
     let userNames = [`${userDetails.username}`, `${userDetails.username2}`]; //test specific array
     let firstNames = [`${userDetails.firstName}`, `${userDetails.firstName2}`]; //test specific array
    
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
        arUserPage.getLongWait()
        cy.wrap(arUserPage.AddFilter('Username', 'Equals', userNames[1]))
        cy.wrap(arUserPage.selectTableCellRecord(userNames[1]))
        cy.wrap(arUserPage.WaitForElementStateToChange(arUserPage.getAddEditMenuActionsByName('Delete'), arEnrollUsersPage.getShortWait()))
        cy.get(arUserPage.getAddEditMenuActionsByName('Delete')).click()
        cy.wrap(arUserPage.WaitForElementStateToChange(arDashboardPage.getElementByDataNameAttribute(arDeleteModal.getDeleteBtn()), arEnrollUsersPage.getLShortWait()))
        cy.get(arDashboardPage.getElementByDataNameAttribute(arDeleteModal.getDeleteBtn())).click().wait('@getUser')
        cy.get(arUserPage.getNoResultMsg()).contains('No results found.').should('exist')
      })

      it("Create ILC Course with session & publish course ",()=>{
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        

        cy.createCourse('Instructor Led')
        
        //Open Enrollment Rules
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        ARILCAddEditPage.getShortWait()

        //Select Allow Self Enrollment All Learners Radio Button
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')

        //Publish Course
        cy.publishCourseAndReturnId().then((id) => {
        commonDetails.courseID = id.request.url.slice(-36);
        })
      })
    
        it('Verify an Admin can Create a Learner Type Users, enroll learner and validate inactive enroll learner', () => {

          cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Users'))).click()
          cy.wrap(arDashboardPage.getMenuItemOptionByName('Users'))
          cy.intercept('/api/rest/v2/admin/reports/users/operations').as('getUsers').wait('@getUsers')
            //Add new user
          for(i=0;i< userNames.length;i++)
          {
          cy.wrap(ARUserAddEditPage.WaitForElementStateToChange(ARUserAddEditPage.getAddEditMenuActionsByName('Add User'), 1000))
          cy.get(ARUserAddEditPage.getAddEditMenuActionsByName('Add User')).click()
          cy.intercept('/api/rest/v2/admin/reports/users').as('getUser').wait('@getUser')
            //Fill out general section fields
          cy.get(ARUserAddEditPage.getFirstNameTxtF()).type(firstNames[i])
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
           //Enroll User 
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
         cy.wrap(arUserPage.AddFilter('Username', 'Equals', userNames[0])) 
         cy.wrap(arUserPage.selectTableCellRecord(userNames[0]))
         cy.wrap(arEnrollUsersPage.WaitForElementStateToChange(arEnrollUsersPage.getAddEditMenuActionsByName('Edit User'), 1000))
         cy.get(arEnrollUsersPage.getAddEditMenuActionsByName('Edit User')).click({force:true})
         cy.intercept('/api/rest/v2/admin/reports/users').as('getUser').wait('@getUser')
          //validate learner status 
         cy.get(ARUserAddEditPage.getElementByDataNameAttribute(ARUserAddEditPage.getIsActiveToggleContainer()) + ' ' + ARUserAddEditPage.getToggleStatus())
          .should('have.attr', 'aria-checked', 'true')
         //Inactive alredy created learner 
         arIlcMarkUserInActivePage.getInActiveUser()
          //Save user
         ARUserAddEditPage.WaitForElementStateToChange(ARUserAddEditPage.getSaveBtn())
         cy.get(ARUserAddEditPage.getSaveBtn()).click()
         cy.get(ARUserAddEditPage.getToastSuccessMsg()).should('contain', 'Is Active saved.')
         //Select session from reports 
         cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Reports'))).click()
         arDashboardPage.getMenuItemOptionByName('Sessions')
         cy.intercept('/Admin/InstructorLedCourseSessions/DefaultGridActionsMenu').as('getILCSession').wait('@getILCSession')

          //Verify ILC Session Window 
         cy.get(arILCSessionReportPage.getA5PageHeaderTitle()).should('have.text', "ILC Sessions")
         //Filter course name
          arILCSessionReportPage.A5AddFilter('Course', 'Starts With',ilcDetails.courseName )
          arILCSessionReportPage.selectA5TableCellRecord(ilcDetails.courseName)
          //Select mark attendance button for learner validation
          arILCSessionReportPage.getLShortWait()
          arILCSessionReportPage.getA5AddEditMenuActionsByNameThenClick('Mark Attendance')
          //validate mark attendance page header
          cy.get(arIlcMarkUserInActivePage.getMarkAttendanceHeader()).should('have.text','Mark Attendance')
          arILCSessionReportPage.getShortWait()
          //Validate learner in table 
          cy.get(arILCSessionReportPage.getGridTable()).contains(firstNames[1]).should("be.visible")
      })
   })  
  
