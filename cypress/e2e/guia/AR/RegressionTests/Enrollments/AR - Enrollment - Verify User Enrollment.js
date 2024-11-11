import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import { users } from '../../../../../../helpers/TestData/users/users'
import arUserEnrollmentPage from '../../../../../../helpers/AR/pageObjects/User/ARUserEnrollmentPage'
import arOCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage'
import ARSelectLearningObjectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectLearningObjectModal'
import ARAddVideoLessonModal from '../../../../../../helpers/AR/pageObjects/Modals/ARAddVideoLessonModal'
import ARUploadFileModal from '../../../../../../helpers/AR/pageObjects/Modals/ARUploadFileModal'
import { lessonVideo } from '../../../../../../helpers/TestData/Courses/oc'
import { commonDetails, credit } from '../../../../../../helpers/TestData/Courses/commonDetails'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import ARCourseSettingsEnrollmentRulesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
import { userDetails } from '../../../../../../helpers/TestData/users/UserDetails'
import { ocDetails } from '../../../../../../helpers/TestData/Courses/oc'
import arEnrollUsersPage from '../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage'
import AREditActivityPage from '../../../../../../helpers/AR/pageObjects/Enrollment/AREditActivityPage'
import arManageCategoriesPage from '../../../../../../helpers/AR/pageObjects/Category/ARManageCategoryPage'
import { sessions } from '../../../../../../helpers/TestData/Courses/ilc'
import arUserReEnrollModal from '../../../../../../helpers/AR/pageObjects/Modals/ARUserReEnrollModal'
import arCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import arUserPage from '../../../../../../helpers/AR/pageObjects/User/ARUserPage'
import arEnrollmentHistoryPage from '../../../../../../helpers/AR/pageObjects/Enrollment/A5EnrollmentHistoryPage'
import ARSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import { courses } from '../../../../../../helpers//TestData//Courses/courses'
import defaultTestData from '../../../../../fixtures/defaultTestData.json'
import arDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import ARFileManagerUploadsModal from '../../../../../../helpers/AR/pageObjects/Modals/ARFileManagerUploadsModal'
import AREnrollUsersPage from '../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage'
import ARUnsavedChangesModal from '../../../../../../helpers/AR/pageObjects/Modals/ARUnsavedChangesModal'
import ARDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'

describe('AR - Enrollment - Create Course ,enroll learner and verify user enrollment', () => {

    before(function () {
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
    })
    after(function () {
        //Delete Course
        cy.deleteCourse(commonDetails.courseID)
        //Delete user
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getUsersReport()
        arUserPage.deleteUser('Username',userDetails.username)
    })
    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
    })
    it('Create course & Publish OC Course and enroll learner in this course', () => {

        arDashboardPage.getCoursesReport()
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
        cy.get(ARFileManagerUploadsModal.getUploadButton()).click()
        cy.get(ARUploadFileModal.getFilePathTxt()).attachFile(commonDetails.videoPath + lessonVideo.videoName)
        cy.get(ARUploadFileModal.getChooseFileBtn()).click
        ARUploadFileModal.getShortWait()
        cy.get(ARUploadFileModal.getSaveBtn()).click()
        ARUploadFileModal.getMediumWait()

        //Save the Video Lesson
        cy.get(ARAddVideoLessonModal.getApplyBtn()).should('be.visible').click().click({ force: true })
        ARUploadFileModal.getLShortWait()

        //Open Enrollment Rules
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        //Select self enrollment For All Learners Rule
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')


        //Publish Course
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = (id.request.url.slice(-36));
        })
        //Enroll User
        arEnrollUsersPage.getEnrollUserByCourseAndUsername([ocDetails.courseName], [userDetails.username])
    })

    it("Verify the user enrollment in above created course", () => {
        arDashboardPage.getUserEnrollmentsReport()
        //Filter and select user from drop down
        arUserEnrollmentPage.ChooseUserAddFilter(userDetails.username)
        //Filter and select above course
        arUserEnrollmentPage.AddFilter('Name', 'Starts With', ocDetails.courseName)
        arManageCategoriesPage.SelectManageCategoryRecord()

        //Select Edit enrollment button 
        cy.wrap(arUserEnrollmentPage.WaitForElementStateToChange(arUserEnrollmentPage.getAddEditMenuActionsByName('Edit Enrollment'), 1000))
        cy.get(arEnrollUsersPage.getAddEditMenuActionsByName('Edit Enrollment')).click()
        cy.wrap(AREditActivityPage.getMarkEnrollmentAsRadioBtn('Not Completed'))
        //enter course score and credit in text box 
        cy.get(AREditActivityPage.getScoreEnrollmentTxtF()).type(commonDetails.course_Score)
        cy.get(AREditActivityPage.getCreditEnrollmentTxtF()).type(credit.credit2)
        //Select expiry date and due date 
        AREditActivityPage.getExpiryDatePickerBtnThenClick()
        AREditActivityPage.getSelectDate(sessions.date1)
        cy.get(AREditActivityPage.getExpirytDateTimeBtn()).click()
        AREditActivityPage.SelectTime('11', '00', 'AM')
        AREditActivityPage.getDueDatePickerBtnThenClick()
        AREditActivityPage.getSelectDate(sessions.date1)
        cy.get(AREditActivityPage.getDuetDateTimeBtn()).click()
        AREditActivityPage.SelectTime('01', '00', 'PM')

        cy.get(AREditActivityPage.getEnrollmentLessonActivityDeatils()).should('contain', 'Video')
        AREditActivityPage.getEnrollmentLessonEditActivityDeatils()
        cy.wrap(AREditActivityPage.getMarkEnrollmentAs2RadioBtn('Completed'))
        cy.get(AREditActivityPage.getLessonActivitySaveBtn()).click()
        cy.wrap(AREditActivityPage.WaitForElementStateToChange(AREditActivityPage.getSaveBtn()), 1000)
        cy.get(AREditActivityPage.getSaveBtn()).should('be.visible').click()
        //Select deselect button 
        // cy.get(arUserEnrollmentPage.getDeselectBtn()).last().click()
        // cy.get(ARUnsavedChangesModal.getOKBtn()).click()
        // arDashboardPage.getShortWait()

        //Select remove button
        //cy.get(arUserEnrollmentPage.getElementByAriaLabelAttribute(arUserEnrollmentPage.getRemoveBtn())).click()
        //Filter and select above course
        //arUserEnrollmentPage.AddFilter('Name', 'Starts With', ocDetails.courseName)
        //arManageCategoriesPage.SelectManageCategoryRecord()

        //Select Re-enroll user button

        cy.wrap(arEnrollUsersPage.WaitForElementStateToChange(arEnrollUsersPage.getAddEditMenuActionsByName('Re-enroll User')), 1000)
        cy.get(arEnrollUsersPage.getAddEditMenuActionsByName('Re-enroll User')).click()

        cy.wrap(arUserReEnrollModal.WaitForElementStateToChange(arUserReEnrollModal.getElementByDataNameAttribute(arUserReEnrollModal.getOKBtn()), 2000))
        cy.get(arDashboardPage.getElementByDataNameAttribute(arUserReEnrollModal.getOKBtn())).click()
        cy.get(arEnrollUsersPage.getTableCellRecord()).should('contain', '0').and('contain', 'Not Started')
        
        arManageCategoriesPage.SelectManageCategoryRecord()
        //Select Un-enroll user button
        cy.wrap(arEnrollUsersPage.WaitForElementStateToChange(arEnrollUsersPage.getAddEditMenuActionsByName('Un-enroll User')), 1000)
        cy.get(arEnrollUsersPage.getAddEditMenuActionsByName('Un-enroll User')).should('have.attr','aria-disabled','false').click()
        cy.wrap(arUserReEnrollModal.WaitForElementStateToChange(arUserReEnrollModal.getElementByDataNameAttribute(arUserReEnrollModal.getOKBtn()), 2000))
        cy.get(arDashboardPage.getElementByDataNameAttribute(arUserReEnrollModal.getOKBtn())).click()
        //Select back button
        cy.get(arCoursesPage.getBackIconBtn()).click()

        //Select user enrollment option from users 
        ARDashboardPage.getUserEnrollmentsReport()
        
        //Filter and select user from drop down
        arUserEnrollmentPage.ChooseUserAddFilter(userDetails.username)
        //Select View Historic button 
        cy.wrap(arUserEnrollmentPage.WaitForElementStateToChange(arUserEnrollmentPage.getAddEditMenuActionsByName('View Historic'), 1000))
        cy.get(arUserEnrollmentPage.getAddEditMenuActionsByName('View Historic')).click()
        //Validate view historic page header
        cy.get(arEnrollmentHistoryPage.getHistoryHeaderTxt()).should('have.text', "Enrollment History")
        arEnrollmentHistoryPage.getMediumWait()
        //Validate first name in table 
        cy.get(arEnrollmentHistoryPage.getGridTable()).contains(defaultTestData.USER_LEARNER_FNAME)
        cy.get(arEnrollmentHistoryPage.selectHistoryBackBtn()).click()
        //Select add enrollment button for more course enrollment
        cy.wrap(arUserEnrollmentPage.WaitForElementStateToChange(arUserEnrollmentPage.getAddEditMenuActionsByName('Add Enrollment')), 1000)
        cy.get(arUserEnrollmentPage.getAddEditMenuActionsByName('Add Enrollment')).click()
        //Click on enroll user drop down
        cy.get(arEnrollUsersPage.getEnrollUsersDDown()).click()
        cy.get(arEnrollUsersPage.getEnrollUsersSearchTxtF()).type(userDetails.username)
        arEnrollUsersPage.getEnrollUsersOpt(userDetails.username)
        cy.wrap(arEnrollUsersPage.WaitForElementStateToChange(arEnrollUsersPage.getSaveBtn()), 1000)
        //Enroll learner in more than one course 
        cy.get(arUserPage.getElementByDataNameAttribute(arEnrollUsersPage.getEnrollUsersAddCourseBtn())).click()
        ARSelectModal.SearchAndSelectFunction([ocDetails.courseName])
        cy.get(arUserPage.getElementByDataNameAttribute(arEnrollUsersPage.getEnrollUsersAddCourseBtn())).click()
        ARSelectModal.SearchAndSelectFunction([courses.oc_filter_01_name])
        cy.get(arEnrollUsersPage.getSaveBtn()).click()

    })
})
