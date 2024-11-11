import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import { users } from '../../../../../../helpers/TestData/users/users'
import LECourseLessonPlayerPage from '../../../../../../helpers/LE/pageObjects/Courses/LECourseLessonPlayerPage'
import ARDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import { ocDetails} from '../../../../../../helpers/TestData/Courses/oc'
import AROCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage'
import ARSelectLearningObjectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectLearningObjectModal'
import LECourseDetailsOCModule from '../../../../../../helpers/LE/pageObjects/Courses/LECourseDetailsOCModule'
import { userDetails } from '../../../../../../helpers/TestData/users/UserDetails'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import arEnrollUsersPage from '../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import AREditClientUserPage from "../../../../../../helpers/AR/pageObjects/PortalSettings/AREditClientUserPage"
import { lessonAssessment } from '../../../../../../helpers/TestData/Courses/oc'
import LESideMenu from '../../../../../../helpers/LE/pageObjects/Menu/LESideMenu'
import ARDashboardAccountMenu from '../../../../../../helpers/AR/pageObjects/Menu/ARDashboardAccount.menu'
import LEProfilePage from '../../../../../../helpers/LE/pageObjects/User/LEProfilePage'
import ARAddObjectLessonModal from '../../../../../../helpers/AR/pageObjects/Modals/ARAddObjectLessonModal'
import LECoursesPage from '../../../../../../helpers/LE/pageObjects/Courses/LECoursesPage'
import { courses } from '../../../../../../helpers/TestData/Courses/courses'
import arQuestionBanksAddEditPage from '../../../../../../helpers/AR/pageObjects/QuestionBanks/ARQuestionBanksAddEditPage'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import arCourseSettingsEnrollmentRulesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
import ARAddVideoLessonModal from '../../../../../../helpers/AR/pageObjects/Modals/ARAddVideoLessonModal'
import { lessonVideo } from '../../../../../../helpers/TestData/Courses/oc'
import { resourcePaths } from '../../../../../../helpers/TestData/resources/resources'
import { videos } from '../../../../../../helpers/TestData/resources/resources'

describe('T98593 - AUT383 -  GUIA-Story NLE-3704 : Course Player - prompt learner for trying to leave lesson before completing it (third party and proctored) ', function () {
    before(function () {
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0);
        //Signin as blat admin and navigate to feature flags
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getShortWait()
        cy.get(arDashboardPage.getCurrentUserLabel()).should('contain',"GUI_Auto Sys_Admin_01")
        cy.get(arDashboardPage.getElementByDataNameAttribute(arDashboardPage.getHelpAndSupportBtn())).should('be.visible')
        //Select Account Menu 
        cy.get(arDashboardPage.getElementByDataNameAttribute(arDashboardPage.getAccountBtn())).click()
        //Select Portal Setting option from account menu
        cy.get(ARDashboardAccountMenu.getPortalSettingsBtn()).should('exist').click()
        //Validate portal setting page header
        cy.get(arDashboardPage.getAccountHeaderLabel()).should('have.text','Edit Client')
        cy.get(arDashboardPage.getUsersTab()).click()
        // //Turn on next gen toggle button
        AREditClientUserPage.getTurnOnNextgenToggle() 
        cy.get(AREditClientUserPage.getSaveBtn()).click()
        //Navigate to dashboard page
        arDashboardPage.getShortWait()
        cy.get(arDashboardPage.getCurrentUserLabel()).should('contain',"GUI_Auto Sys_Admin_01")
    })
    
    after(function () {
        //Signin as blat admin and navigate to feature flags
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getShortWait()
        cy.get(arDashboardPage.getCurrentUserLabel()).should('contain',"GUI_Auto Sys_Admin_01")
        cy.get(arDashboardPage.getElementByDataNameAttribute(arDashboardPage.getHelpAndSupportBtn())).should('be.visible')
        //Select Account Menu 
        cy.get(arDashboardPage.getElementByDataNameAttribute(arDashboardPage.getAccountBtn())).click()
        //Select Portal Setting option from account menu
        cy.get(ARDashboardAccountMenu.getPortalSettingsBtn()).should('exist').click()
        //Validate portal setting page header
        cy.get(arDashboardPage.getAccountHeaderLabel()).should('have.text','Edit Client')
        cy.get(arDashboardPage.getUsersTab()).click()
        // //Turn on next gen toggle button
        AREditClientUserPage.getTurnOffNextgenToggle() 
        cy.get(AREditClientUserPage.getSaveBtn()).click()
        //Navigate to dashboard page
        arDashboardPage.getShortWait()
        cy.get(arDashboardPage.getCurrentUserLabel()).should('contain',"GUI_Auto Sys_Admin_01")
        //Delete the course 
        cy.deleteCourse(commonDetails.courseID)
    })
    
    it('Create Online Courses with Learning Assesement with Questionnire and Video Lesson with Proctor login enabled', () =>{
       //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Courses'))
        
        cy.createCourse('Online Course', ocDetails.courseName)
        //Set enrollment rule - Allow self enrollment for all learners
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        LEDashboardPage.getShortWait()
        arCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')
        //Enable Proctor in Administrator mode
        cy.get(AROCAddEditPage.getSyllabusProctorToggle()).click()
        //Add Video File Object Lesson Desktop Iframe
        cy.get(AROCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
        //Add learning object Assessment        
        ARSelectLearningObjectModal.getObjectTypeByName('Assessment')
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()
        arDashboardPage.getMediumWait()
        ARAddObjectLessonModal.getTxtFByName('Assessment Name', lessonAssessment.ocAssessmentName)
        //Add Assesment Weight
        cy.get(ARAddObjectLessonModal.getAddassessmentweight()).clear().type(10)
        //Add Grade to Pass
        cy.get(ARAddObjectLessonModal.getAddGradetoPass()).clear().type(75)
        //Expand options dropdown under Assessment  
        cy.get(ARAddObjectLessonModal.getAddexpandoptions()).click()
        //Enable Max attempts and set to 3  
        cy.get(ARAddObjectLessonModal.getEnablemaxattempts()).click({force: true})
        cy.get(ARAddObjectLessonModal.getInputmaxattempts()).clear().type(3)
        //Add Question for assessment
        cy.get(ARAddObjectLessonModal.getExpandQuestionsbutton()).click()
        cy.get(ARAddObjectLessonModal.getManageQuestions()).click()
        cy.get(arQuestionBanksAddEditPage.getUseQuestionBankButton()).click()
        arDashboardPage.getShortWait()
        cy.get(arQuestionBanksAddEditPage.getSelectQuestionBankDropdown()).click()
        arDashboardPage.getShortWait()
        cy.get(arQuestionBanksAddEditPage.getEnterQuestionBankName()).type("GUIA - CED - QBank")
        arDashboardPage.getMediumWait()
        cy.get(arQuestionBanksAddEditPage.getSelectQuestionBank()).click()
        arDashboardPage.getShortWait()  
        cy.get(ARAddObjectLessonModal.getQuestionSavebutton()).contains("Save").click({ multiple: true })
        arDashboardPage.getShortWait()
        cy.get(ARAddObjectLessonModal.getandClickApplybutton()).eq(1).click({ force: true })        
        arDashboardPage.getShortWait()   
        cy.get(ARAddObjectLessonModal.getandClickApplybutton()).eq(0).click({ force: true })        
        arDashboardPage.getMediumWait()
        //Add Video Lesson Object to the course
        cy.get(AROCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
        ARSelectLearningObjectModal.getObjectTypeByName('Video')
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()
        //Add Valid Name to Video Lesson
        ARAddVideoLessonModal.getAddCustomVideoLesson(lessonVideo.ocVideoName + '2', 'true', '640', '480', 'URL', null, null, 'File', resourcePaths.resource_video_folder_selectFile, videos.subtitles_video_mp4, 'false', 'true')
        //Add learning object Assessment  
        LEDashboardPage.getShortWait()      
        //Publish OC
        cy.publishCourseAndReturnId().then((id) => {
        commonDetails.courseIDs.push(id.request.url.slice(-36))
        })
        cy.get(ARDashboardPage.getToastSuccessMsg(), {timeout: 10000}).should('contain', 'Course successfully published')
        //Enroll User
        arEnrollUsersPage.getEnrollUserByCourseAndUsername([ocDetails.courseName,courses.oc_lesson_act_ssta_name], [userDetails.username])  
    })

    it('Verfiy that the user get prompt warning modal for a early leaving or switching between lessons in a third party and online course',()=>{
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('My Courses')
        cy.get(LEDashboardPage.getLEEllipsesLoader(), {timeout: 15000}).should('not.exist', {timeout: 15000})
        cy.get(LEDashboardPage.getCourseCardName()).contains(ocDetails.courseName).click()
        //Start the oc
        cy.get(LECourseLessonPlayerPage.getLEWaitSpinner(), {timeout: 10000}).should('not.exist', {timeout: 10000})
        LECourseDetailsOCModule.getMediumWait()
        cy.get(LECourseDetailsOCModule.getStartBtn()).click()
        cy.get(LEDashboardPage.getLEEllipsesLoader(), {timeout: 15000}).should('not.exist')
        LEDashboardPage.getShortWait()
        cy.get(LECourseLessonPlayerPage.getCollapseDetailsBtn()).click()
        LEDashboardPage.getVShortWait()
        cy.get(LEDashboardPage.getStartquizbutton()).contains("Start Quiz").click({force: true})
        LEDashboardPage.getShortWait()
        cy.get(LEDashboardPage.getProctorUsername()).type(users.sysAdmin.admin_sys_01_username)
        cy.get(LEDashboardPage.getProctorPassword()).type(users.sysAdmin.admin_sys_01_password)
        cy.get(LEDashboardPage.getProctorLogingButton()).click()
        //  Switch between different lessons and early leave the course to check promt message
        //  Verify the functionality of 'Leave Lesson' and 'Cancel' buttons 
        LECourseLessonPlayerPage.getLongWait()
        LECourseLessonPlayerPage.getStartLessonByName(lessonVideo.ocVideoName)
        cy.get(LECourseLessonPlayerPage.getEarlyLeavePromptHeader()).should('exist').and('contain','Lesson Incomplete')
        cy.get(LECourseLessonPlayerPage.getEalyLeavePromptModalMessage()).eq(0).should('exist').and('contain','Leaving this lesson early will require a proctor to login again.')
        cy.get(LECourseLessonPlayerPage.getEalyLeavePromptModalMessage()).eq(1).should('exist').and('contain','Are you sure you want to leave?')
        cy.get(LECourseLessonPlayerPage.getCancelButton()).click()
        cy.get(LECoursesPage.getModalCloseBtn()).click()
        cy.get(LECourseLessonPlayerPage.getEarlyLeavePromptHeader()).should('exist').and('contain','Lesson Incomplete')
        cy.get(LECourseLessonPlayerPage.getEalyLeavePromptModalMessage()).eq(0).should('exist').and('contain','Leaving this lesson early will require a proctor to login again.')
        cy.get(LECourseLessonPlayerPage.getEalyLeavePromptModalMessage()).eq(1).should('exist').and('contain','Are you sure you want to leave?')
        cy.get(LECourseLessonPlayerPage.confirmPopup()).click()
        LECourseLessonPlayerPage.getMediumWait()
        //Start to third party course
        cy.get(LECoursesPage.getDiscoveryCourseNameHeader()).should('contain',ocDetails.courseName)
        cy.get(LECourseLessonPlayerPage.getModalCloseBtn()).click()
        LECourseLessonPlayerPage.getVShortWait()
        cy.get(LEDashboardPage.getCourseCardName()).contains(courses.oc_lesson_act_ssta_name).click()
        //  Switch between different lessons and early leave the course to check promt message
        //  Verify the functionality of 'Leave Lesson' and 'Cancel' buttons         cy.get(LECourseLessonPlayerPage.getLEWaitSpinner(), {timeout: 10000}).should('not.exist', {timeout: 10000})
        LECourseDetailsOCModule.getMediumWait()
        cy.get(LECourseDetailsOCModule.getStartBtn()).click()
        cy.get(LEDashboardPage.getLEEllipsesLoader(), {timeout: 15000}).should('not.exist')
        LECourseLessonPlayerPage.getLongWait()
        LECourseLessonPlayerPage.getStartLessonByName(courses.oc_lesson_act_ssta_tin_can_name)
        cy.get(LECourseLessonPlayerPage.getEarlyLeavePromptHeader()).should('exist').and('contain','Lesson Incomplete')
        cy.get(LECourseLessonPlayerPage.getEalyLeavePromptModalMessage()).eq(0).should('exist').and('contain','You will lose your current lesson progress by leaving this lesson.')
        cy.get(LECourseLessonPlayerPage.getEalyLeavePromptModalMessage()).eq(1).should('exist').and('contain','Are you sure you want to leave?')
        cy.get(LECourseLessonPlayerPage.getCancelButton()).click()
        LECourseLessonPlayerPage.getVShortWait()
        cy.get(LECoursesPage.getModalCloseBtn()).click()
        cy.get(LECourseLessonPlayerPage.getEarlyLeavePromptHeader()).should('exist').and('contain','Lesson Incomplete')
        cy.get(LECourseLessonPlayerPage.getEalyLeavePromptModalMessage()).eq(0).should('exist').and('contain','You will lose your current lesson progress by leaving this lesson.')
        cy.get(LECourseLessonPlayerPage.getEalyLeavePromptModalMessage()).eq(1).should('exist').and('contain','Are you sure you want to leave?')
        cy.get(LECourseLessonPlayerPage.confirmPopup()).click()
        LECourseLessonPlayerPage.getMediumWait()
        //Detele the user
        cy.get(LECourseLessonPlayerPage.getModalCloseBtn()).click()
        LECourseLessonPlayerPage.getVShortWait()
        cy.get(LEDashboardPage.getNavProfile()).click()
        LEDashboardPage.getVShortWait()  
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
        cy.url().then((currentURL) => {
            cy.deleteUser(currentURL.slice(-36));
        })
    })
})    