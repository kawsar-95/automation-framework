import arDashboardPage from '../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARCourseSettingsCompletionModule from '../../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCompletion.module'
import arAddMoreCourseSettingsModule from '../../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import ARILCAddEditPage from '../../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage'
import { commonDetails } from '../../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../../helpers/TestData/users/users'
import { ilcDetails, sessions,recurrence } from '../../../../../../../helpers/TestData/Courses/ilc'
import arCoursesPage from '../../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import ARUploadFileModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARUploadFileModal'
import ARCourseSettingsEnrollmentRulesModule from '../../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
import arIlcMarkUserInActivePage from '../../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCMarkUserInActivePage'
import {userDetails}  from '../../../../../../../helpers/TestData/users/UserDetails'
import arDeleteModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import ARSelectModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import arEnrollUsersPage from '../../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage'
import arUserPage from '../../../../../../../helpers/AR/pageObjects/User/ARUserPage'
import arILCSessionReportPage from '../../../../../../../helpers/AR/pageObjects/Reports/ARILCSessionReportPage'
import arUserTranscriptPage from'../../../../../../../helpers/AR/pageObjects/User/ARUserTranscriptPage'
import ARILCMarkUserInActivePage from '../../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCMarkUserInActivePage'
import defaultTestData from '../../../../../../fixtures/defaultTestData.json'



describe('AR - ILC- Create Courses with sessions and Mark Addendance Completion date', function(){
     
     var i=0;
     let userNames = [`${userDetails.username}`, `${userDetails.username2}`, `${userDetails.username3}`]; //test specific array
     let sessionNames = [`${sessions.pastsessionName}`, `${sessions.futuresessionName}`, `${sessions.recurringsessionName}`]; //test specific array

     
     before(function() {
      cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
      cy.createUser(void 0, userDetails.username2, ["Learner"], void 0)
      cy.createUser(void 0, userDetails.username3, ["Learner"], void 0)
     })

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


      it("Create ILC course with past future sessions and add certificate & publish course ",()=>{
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        

        cy.createCourse('Instructor Led', ilcDetails.courseName, false)
        
        //Verify no total/past/future sessions exist
        cy.get(ARILCAddEditPage.getNoSessionsAddedTxt()).should('contain', 'No sessions have been added.')

        //Add Session
        cy.get(ARILCAddEditPage.getAddSessionBtn()).click()
        //Set Valid Title
        cy.get(ARILCAddEditPage.getSessionDetailsTitleTxtF()).should('have.attr', 'aria-invalid', 'false').clear({force:true}).type(sessions.pastsessionName)

        //Verify That the Session End Time Cannot Be Before the Start Time
        ARILCAddEditPage.getStartDatePickerBtnThenClick()
        ARILCAddEditPage.getSelectDate(sessions.date2)
        ARILCAddEditPage.getEndDatePickerBtnThenClick()
        ARILCAddEditPage.getSelectDate(sessions.date2)
        
        //Set Valid End Time
        cy.get(ARILCAddEditPage.getEndDateTimeBtn()).click()
        ARILCAddEditPage.SelectTime('01', '00', 'PM')
        cy.get(ARILCAddEditPage.getStartDateTimeBtn()).click()
        ARILCAddEditPage.SelectTime('11', '00', 'AM')
        cy.get(ARILCAddEditPage.getStartDateTimeBtn()).click()
        cy.get(ARILCAddEditPage.getDateTimeLabel()).contains('Class End Date and Time').click() //hide timepicker

        //Set Timezone
        cy.get(ARILCAddEditPage.getSessionDetailsTimeZoneDDown()).click()
        cy.get(ARILCAddEditPage.getSessionDetailsTimeZoneTxtF()).type('(UTC-06:00) Central America')
        cy.get(ARILCAddEditPage.getSessionDetailsTimeZoneDDownOpt()).contains('(UTC-06:00) Central America').click()

        //Expand Self Enrollment and Add Self Enrollment Rule
        cy.get(arCoursesPage.getElementByAriaLabelAttribute(ARILCAddEditPage.getExpandEnrollmentRulesBtn())).click()
        cy.get(ARILCAddEditPage.getAllowSelfEnrollmentRadioBtn()).contains('All Learners').click()

        //Save ILC Session
        cy.get(ARILCAddEditPage.getAddEditSessionSaveBtn()).click({force:true})
        ARILCAddEditPage.getLShortWait()

//...........................Future Session Creation...............................................// 
        //Add Session
        cy.get(ARILCAddEditPage.getAddSessionBtn()).click()
        //Set Valid Title
        cy.get(ARILCAddEditPage.getSessionDetailsTitleTxtF()).should('have.attr', 'aria-invalid', 'false').clear()
        ARILCAddEditPage.getShortWait()
        cy.get(ARILCAddEditPage.getSessionDetailsTitleTxtF()).should('have.attr', 'aria-invalid', 'false').clear().type(sessions.futuresessionName)
        
        //Verify That the Session End Time Cannot Be Before the Start Time
        ARILCAddEditPage.getStartDatePickerBtnThenClick()
        ARILCAddEditPage.getSelectDate(sessions.date1)
        ARILCAddEditPage.getEndDatePickerBtnThenClick()
        ARILCAddEditPage.getSelectDate(sessions.date1)
  
        //Set Valid End Time
        cy.get(ARILCAddEditPage.getEndDateTimeBtn()).click()
        ARILCAddEditPage.SelectTime('01', '00', 'PM')
        cy.get(ARILCAddEditPage.getStartDateTimeBtn()).click()
        ARILCAddEditPage.SelectTime('11', '00', 'AM')
        cy.get(ARILCAddEditPage.getStartDateTimeBtn()).click()
        cy.get(ARILCAddEditPage.getDateTimeLabel()).contains('Class End Date and Time').click() //hide timepicker
        
        //Set Timezone
        cy.get(ARILCAddEditPage.getSessionDetailsTimeZoneDDown()).click()
        cy.get(ARILCAddEditPage.getSessionDetailsTimeZoneTxtF()).type('(UTC-06:00) Central America')
        cy.get(ARILCAddEditPage.getSessionDetailsTimeZoneDDownOpt()).contains('(UTC-06:00) Central America').click()
        
        //Expand Self Enrollment and Add Self Enrollment Rule
        cy.get(arCoursesPage.getElementByAriaLabelAttribute(ARILCAddEditPage.getExpandEnrollmentRulesBtn())).click()
        cy.get(ARILCAddEditPage.getAllowSelfEnrollmentRadioBtn()).contains('All Learners').click()
        
        //Save ILC Session
        cy.get(ARILCAddEditPage.getAddEditSessionSaveBtn()).click({force:true})
        ARILCAddEditPage.getLShortWait()

//................Create 2 Recurring Session...........................................//

        //Add Session
        cy.get(ARILCAddEditPage.getAddSessionBtn()).click()
        //Set Valid Title
        cy.get(ARILCAddEditPage.getSessionDetailsTitleTxtF()).should('have.attr', 'aria-invalid', 'false').clear()
        cy.get(ARILCAddEditPage.getSessionDetailsTitleTxtF()).should('have.attr', 'aria-invalid', 'false').clear().type(sessions.recurringsessionName)
        
        //Verify That the Session End Time Cannot Be Before the Start Time
        ARILCAddEditPage.getStartDatePickerBtnThenClick()
        ARILCAddEditPage.getSelectDate(sessions.date1)
        ARILCAddEditPage.getEndDatePickerBtnThenClick()
        ARILCAddEditPage.getSelectDate(sessions.date1)
  
        //Set Valid End Time
        cy.get(ARILCAddEditPage.getEndDateTimeBtn()).click()
        ARILCAddEditPage.SelectTime('01', '00', 'PM')
        cy.get(ARILCAddEditPage.getStartDateTimeBtn()).click()
        ARILCAddEditPage.SelectTime('11', '00', 'AM')
        cy.get(ARILCAddEditPage.getStartDateTimeBtn()).click()
        cy.get(ARILCAddEditPage.getDateTimeLabel()).contains('Class End Date and Time').click() //hide timepicker
        
        //Set Timezone
        cy.get(ARILCAddEditPage.getSessionDetailsTimeZoneDDown()).click()
        cy.get(ARILCAddEditPage.getSessionDetailsTimeZoneTxtF()).type('(UTC-06:00) Central America')
        cy.get(ARILCAddEditPage.getSessionDetailsTimeZoneDDownOpt()).contains('(UTC-06:00) Central America').click()

        //Set Recurring Classes
        cy.get(ARILCAddEditPage.getSessionDetailsReccuringClassesDDown()).click()
        cy.get(ARILCAddEditPage.getSessionDetailsReccuringClassesDDownOpt()).contains('day(s)').click()
        cy.get(ARILCAddEditPage.getElementByAriaLabelAttribute(ARILCAddEditPage.getSessionDetailsReccuringClassesRepeatTxt())).clear().type('2')

        //Expand Self Enrollment and Add Self Enrollment Rule
        cy.get(arCoursesPage.getElementByAriaLabelAttribute(ARILCAddEditPage.getExpandEnrollmentRulesBtn())).click()
        cy.get(ARILCAddEditPage.getAllowSelfEnrollmentRadioBtn()).contains('All Learners').click()
        
        //Save ILC Session
        cy.get(ARILCAddEditPage.getAddEditSessionSaveBtn()).click({force:true})
        ARILCAddEditPage.getLShortWait()
//.....................Add certification with the help of Completion...................//

        //Open Completion Section
         cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Completion')).click()
         ARILCAddEditPage.getMediumWait() //Wait for toggles to become enabled

         //Toggle Certificate to ON
         cy.get(ARILCAddEditPage.getElementByDataNameAttribute(ARCourseSettingsCompletionModule.getCertificateToggleContainer()) + ' ' + ARILCAddEditPage.getToggleDisabled()).click()
 
         //Select a Certificate File
         cy.get(ARCourseSettingsCompletionModule.getCertificateChooseFileBtn()).click()
         cy.get(ARUploadFileModal.getFilePathTxt()).attachFile(commonDetails.filePath + commonDetails.mooseFileName)
         cy.get(ARUploadFileModal.getChooseFileBtn()).click
         ARUploadFileModal.getVShortWait()
         cy.get(ARUploadFileModal.getSaveBtn()).click()
         ARUploadFileModal.getLShortWait()
        
         //Open Enrollment Rules
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        ARILCAddEditPage.getShortWait()

        //Select Allow Self Enrollment Specific Radio Button
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')

        //Publish Course
        cy.publishCourseAndReturnId().then((id) => {
        commonDetails.courseID = id.request.url.slice(-36);
         })
        })
       it('Create Learner,Enroll learner in above course and mark attendance completion courses', () => {

        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Users'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Users'))
        cy.intercept('/api/rest/v2/admin/reports/users/operations').as('getUsers').wait('@getUsers')
        
       for(i=0;i<userNames.length;i++)
        {
        //Enroll  learner in above course 
        cy.wrap(arUserPage.AddFilter('Username', 'Equals', userNames[i])) 
        cy.wrap(arUserPage.selectTableCellRecord(userNames[i]))
        cy.wrap(arEnrollUsersPage.WaitForElementStateToChange(arEnrollUsersPage.getAddEditMenuActionsByName('Enroll User'), 1000))
        cy.get(arEnrollUsersPage.getAddEditMenuActionsByName('Enroll User')).click({force:true})
        cy.intercept('/api/rest/v2/admin/reports/users').as('getUser').wait('@getUser')
        cy.get(arUserPage.getElementByDataNameAttribute(arEnrollUsersPage.getEnrollUsersAddCourseBtn())).click()
        //Search and select course 
        ARSelectModal.SearchAndSelectFunction([ilcDetails.courseName])
        //Select session from drop down
        arIlcMarkUserInActivePage.getSelectILCSessionWithinCourse(ilcDetails.courseName,sessionNames[i])
        cy.wrap(arEnrollUsersPage.WaitForElementStateToChange(arEnrollUsersPage.getSaveBtn()), 1000)
        cy.get(arEnrollUsersPage.getSaveBtn()).click()
        arEnrollUsersPage.getMediumWait()
        cy.get(arEnrollUsersPage.getElementByAriaLabelAttribute(arEnrollUsersPage.getRemoveBtn())).click()
        }
         
        //complition of the courses  
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Reports'))).click()
        arDashboardPage.getMenuItemOptionByName('Sessions')
        cy.intercept('/Admin/InstructorLedCourseSessions/DefaultGridActionsMenu').as('getILCSession').wait('@getILCSession')
        for(i=0;i< sessionNames.length;i++)
        {    
        //Filter Session One And Mark Att with complete session
        arILCSessionReportPage.A5AddFilter('Session', 'Starts With',sessionNames[i] )
        arILCSessionReportPage.selectA5TableCellRecord(sessionNames[i])
        //Select Mark Attendance Button for Course Completion 
        arILCSessionReportPage.getA5AddEditMenuActionsByNameThenClick('Mark Attendance')
        arILCSessionReportPage.getLShortWait()
        //Validate learner first name availability 
        cy.get(arILCSessionReportPage.getGridTable()).contains(defaultTestData.USER_LEARNER_FNAME).should("be.visible")
        arILCSessionReportPage.getShortWait()
        //Mark Course session completion by selecting check box 
        cy.get(arIlcMarkUserInActivePage.getCheckBoxForLearner()).click()
        if(i==2){
            cy.get(arIlcMarkUserInActivePage.getCheckBoxForRLearner()).click()
        }
        cy.get(arILCSessionReportPage.getA5SaveBtn()).click()
        cy.intercept('/Admin/InstructorLedCourseSessions/DefaultGridActionsMenu').as('getILCSession').wait('@getILCSession')
        cy.get(arILCSessionReportPage.getElementByTitleAttribute(arILCSessionReportPage.getRemoveBtn())).should('be.visible').click()
        }
        
        //Validate Certificate and check enrollment and completion date
        cy.get(arIlcMarkUserInActivePage.getUserLeftMenuOption()).click()
        cy.get(arIlcMarkUserInActivePage.getUserSubMenuLevel()).click()
        cy.wait('@getUsers')
        arUserPage.getVLongWait()
        for(i=0;i<userNames.length;i++){
        //Validate course completion and Enrollment date 
        cy.wrap(arUserPage.AddFilter('Username', 'Contains', userNames[i]))
        cy.get(arUserPage.getTableCellName(4)).contains(userNames[i]).click()
        //Select User Transcript Button 
        cy.wrap(arUserPage.WaitForElementStateToChange(arUserPage.getAddEditMenuActionsByName('User Transcript'), 1000))
        cy.get(arUserPage.getAddEditMenuActionsByName('User Transcript')).click({force:true})
        cy.intercept('/api/rest/v2/admin/reports/credit-types/operations').as('getUserTranscript').wait('@getUserTranscript')
        //Validate user Taranscript Page header
        cy.get(arUserTranscriptPage.getElementByDataNameAttribute(arUserTranscriptPage.getTranscriptPageTitle())).should('have.text','User Transcript')
        //Validate Certificate Image availability
        cy.get(arUserTranscriptPage.getCertificateImage()).should('exist')
        //Validate course name against certificate 
        cy.get(arUserTranscriptPage.getCertificateName()).should('contain',ilcDetails.courseName)
        ARILCMarkUserInActivePage.getEnrollAndCompletionDate()
        //Select back button 
        cy.get(arUserTranscriptPage.getBackIconBtn()).click()
        cy.get(arUserPage.getElementByAriaLabelAttribute(arUserPage.getRemoveBtn())).click()
        }
       })
    })
  
