import { ocDetails } from '../../../../../../helpers/TestData/Courses/oc'
import { users } from '../../../../../../helpers/TestData/users/users'
import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arOCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage'
import ARSelectLearningObjectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectLearningObjectModal'
import ARAddVideoLessonModal from '../../../../../../helpers/AR/pageObjects/Modals/ARAddVideoLessonModal'
import ARUploadFileModal from '../../../../../../helpers/AR/pageObjects/Modals/ARUploadFileModal'
import {  lessonVideo } from '../../../../../../helpers/TestData/Courses/oc'
import { commonDetails,credit } from '../../../../../../helpers/TestData/Courses/commonDetails'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import ARCourseSettingsEnrollmentRulesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
import arCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import ARUserAddEditPage from '../../../../../../helpers/AR/pageObjects/User/ARUserAddEditPage'
import {userDetails}  from '../../../../../../helpers/TestData/users/UserDetails'
import arSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import { departments } from '../../../../../../helpers/TestData/Department/departments'
import arManageCategoriesPage from '../../../../../../helpers/AR/pageObjects/Category/ARManageCategoryPage'
import AREditActivityPage from '../../../../../../helpers/AR/pageObjects/Enrollment/AREditActivityPage'
import arEnrollmentHistoryPage from '../../../../../../helpers/AR/pageObjects/Enrollment/A5EnrollmentHistoryPage'
import { sessions } from '../../../../../../helpers/TestData/Courses/ilc'
import arUserReEnrollModal from '../../../../../../helpers/AR/pageObjects/Modals/ARUserReEnrollModal'
import arEnrollUsersPage from '../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage'
import ARUserTranscriptPage from '../../../../../../helpers/AR/pageObjects/User/ARUserTranscriptPage'
import arComposeMessage from '../../../../../../helpers/AR/pageObjects/Departments/ARComposeMessage'
import { departmentDetails } from '../../../../../../helpers/TestData/Department/departmentDetails'
import arUserPage from '../../../../../../helpers/AR/pageObjects/User/ARUserPage'
import ARSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import arDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import defaultTestData from '../../../../../fixtures/defaultTestData.json'
import ARDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'


describe('AR - OC - Create Course ,enroll learner & publish course and verify course enrollment', function(){
    before(function() {
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
        cy.createUser(void 0, userDetails.username2, ["Learner"], void 0)
        cy.createUser(void 0, userDetails.username3, ["Learner"], void 0)
    })
     var i=0;
     let userNames = [`${userDetails.username}`, `${userDetails.username2}`,`${userDetails.username3}`];

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
    })
    after(function() {
        //Delete Course
        cy.deleteCourse(commonDetails.courseID)
       // Delete user
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Users'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Users'))
        cy.intercept('**/users/operations').as('getUser').wait('@getUser');
        for(i=0;i<userNames.length;i++){
        cy.wrap(arUserPage.AddFilter('Username', 'Equals', userNames[i]))
        cy.wrap(arUserPage.selectTableCellRecord(userNames[i]))
        cy.wrap(arUserPage.WaitForElementStateToChange(arUserPage.getAddEditMenuActionsByName('Delete'), 1000))
        cy.get(arUserPage.getAddEditMenuActionsByName('Delete')).click()
        cy.wrap(arUserPage.WaitForElementStateToChange(arDashboardPage.getElementByDataNameAttribute(arDeleteModal.getDeleteBtn()), 1000))
        cy.get(arDashboardPage.getElementByDataNameAttribute(arDeleteModal.getDeleteBtn())).click().wait('@getUser')
        cy.get(arUserPage.getNoResultMsg()).contains('No results found.').should('exist')
        }
    })

    it('Cretae Online course & Publish OC Course and enroll learner in this course', () => {

        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        

        cy.createCourse('Online Course')
        
        //Verify Video Lesson Can Be Selected
        cy.get(arOCAddEditPage.getAddLearningObjectBtn()).click()
        ARSelectLearningObjectModal.getObjectTypeByName('Video')
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()
        //Add Valid Name to Video Lesson
        cy.get(arOCAddEditPage.getElementByAriaLabelAttribute(ARAddVideoLessonModal.getNameTxt())).type(lessonVideo.ocVideoName)

        //Add Valid Width and Height to Video Lesson
        cy.get(ARAddVideoLessonModal.getWidthTxtF()).type('640')
        cy.get(ARAddVideoLessonModal.getHeightTxtF()).type('480')

         //Add a Video Label
         cy.get(ARAddVideoLessonModal.getVideoSourceLabelTxtF()).type(lessonVideo.videoLabel)

         //Add a Video Via File Upload
         cy.get(ARAddVideoLessonModal.getVideoSourceChooseFileBtn()).click()
        ARDashboardPage.getShortWait()
         cy.get(ARUploadFileModal.getMediaLibraryUploadBtn()).click()
         cy.get(ARUploadFileModal.getFilePathTxt()).attachFile(commonDetails.videoPath + lessonVideo.videoName)
         cy.get(ARUploadFileModal.getChooseFileBtn()).click
         ARUploadFileModal.getShortWait()
         cy.get(ARUploadFileModal.getSaveBtn()).click()
         ARUploadFileModal.getVLongWait()
 
         //Save the Video Lesson
         cy.get(ARAddVideoLessonModal.getApplyBtn()).should('be.visible').click().click({force:true})
         ARUploadFileModal.getLShortWait()

         //Open Enrollment Rules
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        //Select 'All Learners' For Self Enrollment Rule
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')


        //Publish Course
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = (id.request.url.slice(-36));
        })
        for(i=0;i<userNames.length-1;i++){
        arEnrollUsersPage.getEnrollUserByCourseAndUsername([ocDetails.courseName], [userNames[i]])
        ARDashboardPage.getMediumWait()
        cy.get(arCoursesPage.getElementByAriaLabelAttribute(arCoursesPage.getRemoveBtn())).click()
        }
    })
    
    it("Verify above created Course Enrollemnt",()=>{

        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        

        //Filter and select above enroll learner above course
        arOCAddEditPage.AddFilter('Name', 'Starts With', ocDetails.courseName)
        arDashboardPage.getMediumWait()
        cy.get(arCoursesPage.getTableCellName(2)).contains(ocDetails.courseName).click()
        //Select course enrollment button 
        cy.wrap(arCoursesPage.WaitForElementStateToChange(arCoursesPage.getAddEditMenuActionsByName('Course Enrollments'), 1000))
        cy.get(arCoursesPage.getAddEditMenuActionsByName('Course Enrollments')).click()
        cy.intercept('/api/rest/v2/admin/reports/course-enrollments/operations').as('getCoursesEnrollment').wait('@getCoursesEnrollment')
        //Verify course enrollment page header
        cy.get(arCoursesPage.getPageHeaderTitle()).should('have.text', "Course Enrollments")
        //Filter and select User
        arCoursesPage.AddFilter('Username', 'Starts With', userNames[0])
        cy.get(arCoursesPage.getTableCellName(4)).contains(userNames[0]).click()
        //Select edit enrollment button 
        cy.wrap(arCoursesPage.WaitForElementStateToChange(arCoursesPage.getAddEditMenuActionsByName('Edit Enrollment'), 1000))
        cy.get(arCoursesPage.getAddEditMenuActionsByName('Edit Enrollment')).click()
        cy.intercept('/api/rest/v2/admin/reports/online-course-activities/operations').as('getEditEnrollment').wait('@getEditEnrollment')
        //Select not completed radio button
        cy.wrap(AREditActivityPage.getMarkEnrollmentAsRadioBtn('Not Completed'))
        //Entered score and credit value in text box 
        cy.get(AREditActivityPage.getScoreEnrollmentTxtF()).clear().type(commonDetails.course_Score)
        cy.get(AREditActivityPage.getCreditEnrollmentTxtF()).clear().type(credit.credit2)
        //Select Expiry and due date 
        AREditActivityPage.getExpiryDatePickerBtnThenClick()
        AREditActivityPage.getSelectDate(sessions.date1)
        cy.get(AREditActivityPage.getExpirytDateTimeBtn()).click()
        AREditActivityPage.SelectTime('11', '00', 'AM')
        AREditActivityPage.getDueDatePickerBtnThenClick()
        AREditActivityPage.getSelectDate(sessions.date1)
        cy.get(AREditActivityPage.getDuetDateTimeBtn()).click()
        AREditActivityPage.SelectTime('01', '00', 'PM')
        //Validate course type is video 
        cy.get(AREditActivityPage.getEnrollmentLessonActivityDeatils()).should('contain','Video')
        AREditActivityPage.getEnrollmentLessonEditActivityDeatils()
        cy.wrap(AREditActivityPage.getMarkEnrollmentAs2RadioBtn('Completed'))
        cy.get(AREditActivityPage.getLessonActivitySaveBtn()).click()
        //Saved edit enrollment details 
        cy.wrap(AREditActivityPage.WaitForElementStateToChange(AREditActivityPage.getSaveBtn()), 1000)
        cy.get(AREditActivityPage.getSaveBtn()).click()
        
        //Select Re-enrollment button 
        cy.wrap(arEnrollUsersPage.WaitForElementStateToChange(arEnrollUsersPage.getAddEditMenuActionsByName('Re-enroll User')), 1000)
        cy.get(arEnrollUsersPage.getAddEditMenuActionsByName('Re-enroll User')).click()

        cy.wrap(arUserReEnrollModal.WaitForElementStateToChange(arUserReEnrollModal.getElementByDataNameAttribute(arUserReEnrollModal.getOKBtn()), 2000))
        cy.get(arDashboardPage.getElementByDataNameAttribute(arUserReEnrollModal.getOKBtn()),{timeout:4000}).click()
        cy.get(arEnrollUsersPage.getTableCellRecord()).should('contain',userDetails.lastName ).and('contain','0').and('contain', 'Not Started')
        //Select Un-enroll user button
        cy.get(arEnrollUsersPage.getAddEditMenuActionsByName('Un-enroll User')).click()
        cy.wrap(arUserReEnrollModal.WaitForElementStateToChange(arUserReEnrollModal.getElementByDataNameAttribute(arUserReEnrollModal.getOKBtn()), 2000))
        cy.get(arDashboardPage.getElementByDataNameAttribute(arUserReEnrollModal.getOKBtn())).click()
        //Select remove button
        cy.get(arEnrollUsersPage.getElementByAriaLabelAttribute(arEnrollUsersPage.getRemoveBtn())).click()

        //Filter and select another enroll learner for other scnerios 
        cy.wrap(arUserPage.AddFilter('Username', 'Equals', userNames[1])) 
        cy.wrap(arUserPage.selectTableCellRecord(userNames[1]))
        
        //Select Edit user button for update learner details 
        cy.wrap(arCoursesPage.WaitForElementStateToChange(arCoursesPage.getAddEditMenuActionsByName('Edit User'), 1000))
        cy.get(arCoursesPage.getAddEditMenuActionsByName('Edit User')).click()
        cy.get(arCoursesPage.getPageHeaderTitle()).should('have.text', "Edit User")
        cy.intercept('/api/rest/v2/admin/reports/users/operations').as('getUsers').wait('@getUsers')

         //Verify general section fields persisted and edit them
        cy.get(ARUserAddEditPage.getFirstNameTxtF()).should('have.value', defaultTestData.USER_LEARNER_FNAME).type(userDetails.appendText)
        cy.get(ARUserAddEditPage.getMiddleNameTxtF()).type(userDetails.middleName)
        cy.get(ARUserAddEditPage.getLastNameTxtF()).should('have.value', defaultTestData.USER_LEARNER_LNAME).type(userDetails.appendText)
         //Save user
        ARUserAddEditPage.WaitForElementStateToChange(ARUserAddEditPage.getSaveBtn())
        cy.get(ARUserAddEditPage.getSaveBtn()).click()
        cy.get(ARUserAddEditPage.getToastSuccessMsg()).should('contain', 'User has been updated successfully.')
        cy.wait('@getCoursesEnrollment')

        //Select User Transcript button 
        cy.wrap(arCoursesPage.WaitForElementStateToChange(arCoursesPage.getAddEditMenuActionsByName('User Transcript'), 1000))
        cy.get(arCoursesPage.getAddEditMenuActionsByName('User Transcript')).click()
        //Verify User transcript header
        cy.get(arCoursesPage.getPageHeaderTitle()).should('have.text', "User Transcript")
        //Verify user transcript action button levels 
        ARUserTranscriptPage.getUserTranscriptDetailseHeader()
        cy.get(ARUserTranscriptPage.getCourseNameCol()).should('contain',ocDetails.courseName)
        //Select back button and come back to course enrollment page 
        //ARUserTranscriptPage.selectActionBtnByLevel("Back")
        cy.get('[data-name="back"]').click()
        cy.wait('@getCoursesEnrollment')
        //Verify and save message 
        for(i=0;i<2;i++)
        {
        cy.wrap(arCoursesPage.WaitForElementStateToChange(arCoursesPage.getAddEditMenuActionsByName('Message User'), 1000))
        cy.get(arCoursesPage.getAddEditMenuActionsByName('Message User')).click()
        cy.get(arCoursesPage.getPageHeaderTitle()).should('have.text', "Compose Message")
        if(i==0){
        
        cy.get(arComposeMessage.getSubjectTxtF()).click().type(departmentDetails.messageSubject)
        cy.get(arComposeMessage.getElementByDataNameAttribute(arComposeMessage.getSendBtn())).should('have.attr', 'aria-disabled', 'true')
        cy.get(arComposeMessage.getElementByAriaLabelAttribute(arComposeMessage.getTextArea())).type(departmentDetails.messageBody)
        arComposeMessage.getShortWait()
        cy.get(arComposeMessage.getElementByDataNameAttribute(arComposeMessage.getSendBtn())).click().wait('@getCoursesEnrollment')
        }else if(i==1){
        cy.get(arComposeMessage.getComposeSentToRadioBtn()).contains('Send to departments').click()
        cy.get(arComposeMessage.getElementByDataNameAttribute(arComposeMessage.getAddDepartmentBtn())).click()
        arSelectModal.SearchAndSelectFunction([departments.dept_top_name])
        cy.get(arComposeMessage.getSubjectTxtF()).click().type(departmentDetails.messageSubject)
        cy.get(arComposeMessage.getElementByDataNameAttribute(arComposeMessage.getSendBtn())).should('have.attr', 'aria-disabled', 'true')
        cy.get(arComposeMessage.getElementByAriaLabelAttribute(arComposeMessage.getTextArea())).type(departmentDetails.messageBody)
        arComposeMessage.getShortWait()
        cy.get(arComposeMessage.getElementByDataNameAttribute(arComposeMessage.getSendBtn())).click()
        }
     }
     ARDashboardPage.getMediumWait()
     //Select remove button
     cy.get(arCoursesPage.getElementByAriaLabelAttribute(arCoursesPage.getRemoveBtn())).click()
     arCoursesPage.AddFilter('Username', 'Starts With', userNames[1])
     ARDashboardPage.getMediumWait()
     cy.get(arCoursesPage.getTableCellName(4)).contains(userNames[1]).click()

     //Select view enrollments button 
     cy.wrap(arCoursesPage.WaitForElementStateToChange(arCoursesPage.getAddEditMenuActionsByName('View Enrollments'), 1000))
     cy.get(arCoursesPage.getAddEditMenuActionsByName('View Enrollments')).click()
     cy.intercept('/**/reports/user-enrollments/operations').as('getUserEnrollments').wait('@getUserEnrollments')
     //Validate user enrollment page header
     cy.get(arCoursesPage.getPageHeaderTitle()).should('have.text', "User Enrollments")
     //Validate course in table 
     cy.get(arUserPage.getGridTable()).should('contain', ocDetails.courseName)
     
     //Select View historic button
     cy.wrap(arCoursesPage.WaitForElementStateToChange(arCoursesPage.getAddEditMenuActionsByName('View Historic'), 1000))
     cy.get(arCoursesPage.getAddEditMenuActionsByName('View Historic')).click()
     cy.intercept('/Admin/OnlineCourseActivity/HistoryDefaultGridActionsMenu').as('getViewHistory').wait('@getViewHistory')
     cy.get(arEnrollmentHistoryPage.getHistoryHeaderTxt()).should('have.text', "Enrollment History")
     cy.get(arEnrollmentHistoryPage.selectHistoryBackBtn()).click().wait('@getUserEnrollments')
     
     cy.get(arUserPage.getTableCellName(2)).contains(ocDetails.courseName).click()
     
     cy.get(arUserPage.getDeselectBtn()).click()
     arManageCategoriesPage.SelectManageCategoryRecordWithOutClick()
     //Select Add enrollment button for enroll more than one learner in one course
     cy.wrap(arEnrollUsersPage.WaitForElementStateToChange(arEnrollUsersPage.getAddEditMenuActionsByName('Add Enrollment')), 1000)
     cy.get(arEnrollUsersPage.getAddEditMenuActionsByName('Add Enrollment')).click()
    ARDashboardPage.getMediumWait()
     cy.get(arEnrollUsersPage.getEnrollUserUpDownIcon()).click()
     cy.get(arEnrollUsersPage.getEnrollUsersSearchTxtF()).type(userNames[2])
     arEnrollUsersPage.getEnrollUsersOpt(userNames[2])
     cy.wrap(arEnrollUsersPage.WaitForElementStateToChange(arEnrollUsersPage.getSaveBtn()), 1000)

     cy.get(arUserPage.getElementByDataNameAttribute(arEnrollUsersPage.getEnrollUsersAddCourseBtn())).click()
     ARSelectModal.SearchAndSelectFunction([ocDetails.courseName])
     cy.get(arEnrollUsersPage.getSaveBtn()).click()
     cy.intercept('/**/reports/user-enrollments/operations').as('getUserEnrollments').wait('@getUserEnrollments')
    })
})