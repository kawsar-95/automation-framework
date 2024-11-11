
import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import { users } from '../../../../../../helpers/TestData/users/users'
import arDashboardAccountMenu from '../../../../../../helpers/AR/pageObjects/Menu/ARDashboardAccount.menu'
import ARDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import { ocDetails} from '../../../../../../helpers/TestData/Courses/oc'
import AROCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage'
import ARSelectLearningObjectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectLearningObjectModal'
import ARAddObjectLessonModal from '../../../../../../helpers/AR/pageObjects/Modals/ARAddObjectLessonModal'
import { lessonAssessment } from '../../../../../../helpers/TestData/Courses/oc'
import { userDetails } from '../../../../../../helpers/TestData/users/UserDetails'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import arEnrollUsersPage from '../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage'
import LESideMenu from '../../../../../../helpers/LE/pageObjects/Menu/LESideMenu'
import LEProfilePage from '../../../../../../helpers/LE/pageObjects/User/LEProfilePage'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import arQuestionBanksAddEditPage from '../../../../../../helpers/AR/pageObjects/QuestionBanks/ARQuestionBanksAddEditPage'
import AREditClientUserPage from "../../../../../../helpers/AR/pageObjects/PortalSettings/AREditClientUserPage"
import ARAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import ARCourseSettingsEnrollmentRulesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
import ARCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import LECoursesPage from '../../../../../../helpers/LE/pageObjects/Courses/LECoursesPage'
import LECourseLessonPlayerPage from '../../../../../../helpers/LE/pageObjects/Courses/LECourseLessonPlayerPage'
import LECourseDetailsOCModule from '../../../../../../helpers/LE/pageObjects/Courses/LECourseDetailsOCModule'
import ARAddVideoLessonModal from '../../../../../../helpers/AR/pageObjects/Modals/ARAddVideoLessonModal'
import {  lessonVideo } from '../../../../../../helpers/TestData/Courses/oc'
import { resourcePaths, videos} from '../../../../../../helpers/TestData/resources/resources'


describe('T98567 - AUT-386 - GUIA-Auto - NLE-3927 - Course Player - Lesson Completion Cards - When the assessment is not the last activity to complete', function () {

    before(function () {
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0);
        cy.createUser(void 0, userDetails.username2, ["Learner"], void 0);
        cy.createUser(void 0, userDetails.username3, ["Learner"], void 0);
        //Signin as blat admin and navigate to feature flags
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getShortWait()
        cy.get(arDashboardPage.getCurrentUserLabel()).should('contain',"GUI_Auto Sys_Admin_01")
        cy.get(arDashboardPage.getElementByDataNameAttribute(arDashboardPage.getHelpAndSupportBtn())).should('be.visible')
        //Select Account Menu 
        cy.get(arDashboardPage.getElementByDataNameAttribute(arDashboardPage.getAccountBtn())).click()
        //Select Portal Setting option from account menu
        cy.get(arDashboardAccountMenu.getPortalSettingsBtn()).should('exist').click()
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
        cy.get(arDashboardAccountMenu.getPortalSettingsBtn()).should('exist').click()
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

    it('Create Online Course with Learning Assesement with Questionnire and Video Lesson', () =>{
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Courses'))
         
        cy.createCourse('Online Course', ocDetails.courseName)
        //Set enrollment rule - Allow self enrollment for all learners
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        LEDashboardPage.getShortWait()
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')
        //Add Assessment lesson object to the course 
        cy.get(AROCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
        ARSelectLearningObjectModal.getObjectTypeByName('Assessment')
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()
        arDashboardPage.getLongWait()
        ARAddObjectLessonModal.getTxtFByName('Assessment Name', lessonAssessment.ocAssessmentName)
        //Add Assesment Weight
        cy.get(ARAddObjectLessonModal.getAddassessmentweight()).clear().type(10)
        //Add Grade to Pass
        cy.get(ARAddObjectLessonModal.getAddGradetoPass()).clear().type(100)
        //Expand options dropdown under Assessment  
        cy.get(ARAddObjectLessonModal.getAddexpandoptions()).click()
        //Enable Max attempts and set to 3  
        cy.get(ARAddObjectLessonModal.getEnablemaxattempts()).click({force: true})
        cy.get(ARAddObjectLessonModal.getInputmaxattempts()).clear().type(2)
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
        cy.get(ARAddObjectLessonModal.getQuestionSavebutton()).contains("Save").click()
        arDashboardPage.getShortWait()
        cy.get(ARAddObjectLessonModal.getandClickApplybutton()).eq(1).click()        
        arDashboardPage.getShortWait()
        cy.get(ARAddObjectLessonModal.getandClickApplybutton()).eq(0).click()        
        arDashboardPage.getMediumWait()
        //Add Video File Object Lesson Desktop Iframe
        cy.get(AROCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
        ARSelectLearningObjectModal.getObjectTypeByName('Video')
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()
        //Add Valid Name to Video Lesson
        ARAddVideoLessonModal.getAddCustomVideoLesson(lessonVideo.ocVideoName + '2', 'true', '640', '480', 'URL', null, null, 'File', resourcePaths.resource_video_folder_selectFile, videos.subtitles_video_mp4, 'false', 'true')
        //Publish OC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36))
        })
        cy.get(ARDashboardPage.getToastSuccessMsg(), {timeout: 10000}).should('contain', 'Course successfully published')
        //Enroll User
        arEnrollUsersPage.getEnrollUserByCourseAndUsername([ocDetails.courseName], [userDetails.username, userDetails.username2])
        LEDashboardPage.getShortWait()
    })

    it('Verfiy to course completition cards after failing',()=>{
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('My Courses')
        cy.get(LEDashboardPage.getLEEllipsesLoader(), {timeout: 15000}).should('not.exist', {timeout: 15000})
        cy.get(LEDashboardPage.getCourseCardName()).contains(ocDetails.courseName).click()
        //Start 1st Lesson
        cy.get(LECourseLessonPlayerPage.getLEWaitSpinner(), {timeout: 10000}).should('not.exist', {timeout: 10000})
        LECourseDetailsOCModule.getMediumWait()
        cy.get(LECourseDetailsOCModule.getStartBtn()).click()
        cy.get(LEDashboardPage.getLEEllipsesLoader(), {timeout: 15000}).should('not.exist')
        LEDashboardPage.getShortWait()
        cy.get(LECourseLessonPlayerPage.getCollapseDetailsBtn()).click()
        LEDashboardPage.getVShortWait()
        //The Confirm Quiz Attempt card will be displayed with the checkmark in the primary colour variable, with Remaining Attempts = 1  
        cy.get(LEDashboardPage.getCourseattemptslabel()).contains("Remaining Attempts").should('have.text',"Remaining Attempts")
        cy.get(LEDashboardPage.getBestscorelabel()).contains("Best Score").should('have.text',"Best Score")     
        cy.get(LEDashboardPage.getStartQuizbutton()).click()
        LEDashboardPage.getShortWait() 
        cy.frameLoaded(LEDashboardPage.getQUIZiFrame())
        cy.iframe(LEDashboardPage.getQUIZiFrame()).should('be.visible').find(LEDashboardPage.getTypeAnswerInput()).type("not an answer")
        cy.iframe(LEDashboardPage.getQUIZiFrame()).should('be.visible').find(LEDashboardPage.getSubmitAnswer()).contains("Submit Response").click()  
        LEDashboardPage.getMediumWait()
        cy.get(LECoursesPage.getModalCloseBtn()).click()
        LECourseLessonPlayerPage.getLongWait()
        cy.get(LECourseDetailsOCModule.getStartBtn()).click()
        LEDashboardPage.getMediumWait()
        LECourseLessonPlayerPage.getStartLessonByName(lessonAssessment.ocAssessmentName)
        LEDashboardPage.getShortWait()
        cy.get(LEDashboardPage.getCourseattemptslabel()).contains("Remaining Attempts").should('have.text',"Remaining Attempts")
        cy.get(LECourseLessonPlayerPage.getCoursePlayerCardModuleData()).eq(0).should('have.text',"1")
        cy.get(LEDashboardPage.getBestscorelabel()).contains("Best Score").should('have.text',"Best Score")
        cy.get(LECourseLessonPlayerPage.getCoursePlayerCardModuleData()).eq(1).should('have.text',"0%")
        cy.get(LECoursesPage.getModalCloseBtn()).click()
        LECourseDetailsOCModule.getLongWait()
        cy.get(LECourseDetailsOCModule.getStartBtn()).click()
        LEDashboardPage.getMediumWait()
        LECourseLessonPlayerPage.getStartLessonByName(lessonAssessment.ocAssessmentName)
        LEDashboardPage.getLongWait() 
        LEDashboardPage.getShortWait()
        //The Lesson Complete card will be displayed, with the Status as Failed 
        cy.get(LEDashboardPage.getCourseattemptslabel()).contains("Remaining Attempts").should('have.text',"Remaining Attempts")
        cy.get(LEDashboardPage.getBestscorelabel()).contains("Best Score").should('have.text',"Best Score")     
        cy.get(LEDashboardPage.getStartQuizbutton()).click()
        cy.frameLoaded(LEDashboardPage.getQUIZiFrame())
        cy.iframe(LEDashboardPage.getQUIZiFrame()).should('be.visible').find(LEDashboardPage.getTypeAnswerInput()).type("not an answer")
        cy.iframe(LEDashboardPage.getQUIZiFrame()).should('be.visible').find(LEDashboardPage.getSubmitAnswer()).contains("Submit Response").click()  
        LEDashboardPage.getMediumWait()
        cy.get(LECoursesPage.getModalCloseBtn()).click()
        LECourseDetailsOCModule.getLongWait()
        cy.get(LECourseDetailsOCModule.getStartBtn()).click()
        LEDashboardPage.getMediumWait()
        LECourseLessonPlayerPage.getStartLessonByName(lessonAssessment.ocAssessmentName)
        LEDashboardPage.getLongWait() 
        cy.get(LECourseLessonPlayerPage.getEarlyLeavePromptHeader()).should('be.visible').and('contain','Lesson Complete')
        cy.get(LECourseLessonPlayerPage.getCoursePlayerCardModuleMessage()).eq(1).should('contain',`Looks like you’ve already completed this lesson.`)
        cy.get(LECourseLessonPlayerPage.getCoursePlayerStatusModule()).eq(0).should('be.visible').and('contain','Status')
        cy.get(LECourseLessonPlayerPage.getCoursePlayerStatusModule()).eq(1).should('be.visible').and('contain','Complete')
        //Detele the user
        LECourseLessonPlayerPage.getVShortWait()
        cy.get(LECoursesPage.getModalCloseBtn()).click()
        LECourseLessonPlayerPage.getMediumWait()
        cy.get(LECourseLessonPlayerPage.getModalCloseBtn()).click()
        LECourseLessonPlayerPage.getVShortWait()
        cy.get(LEDashboardPage.getNavProfile()).click()
        LEDashboardPage.getVShortWait()  
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
        cy.url().then((currentURL) => {
            cy.deleteUser(currentURL.slice(-36));
        })
    })
    
        it('Verfiy to course completition cards after successfull completition',()=>{
        cy.apiLoginWithSession(userDetails.username2, userDetails.validPassword)
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('My Courses')
        cy.get(LEDashboardPage.getLEEllipsesLoader(), {timeout: 15000}).should('not.exist', {timeout: 15000})
        cy.get(LEDashboardPage.getCourseCardName()).contains(ocDetails.courseName).click()
        //Start 1st Lesson
        cy.get(LECourseLessonPlayerPage.getLEWaitSpinner(), {timeout: 10000}).should('not.exist', {timeout: 10000})
        LECourseDetailsOCModule.getMediumWait()
        cy.get(LECourseDetailsOCModule.getStartBtn()).click()
        cy.get(LEDashboardPage.getLEEllipsesLoader(), {timeout: 15000}).should('not.exist')
        LEDashboardPage.getShortWait()
        cy.get(LECourseLessonPlayerPage.getCollapseDetailsBtn()).click()
        LEDashboardPage.getVShortWait()
        //The Lesson Complete card will be displayed, with the Status as Complete 
        cy.get(LEDashboardPage.getCourseattemptslabel()).contains("Remaining Attempts").should('have.text',"Remaining Attempts")
        cy.get(LEDashboardPage.getBestscorelabel()).contains("Best Score").should('have.text',"Best Score")     
        cy.get(LEDashboardPage.getStartQuizbutton()).click()
        LEDashboardPage.getShortWait() 
        cy.frameLoaded(LEDashboardPage.getQUIZiFrame())
        cy.iframe(LEDashboardPage.getQUIZiFrame()).should('be.visible').find(LEDashboardPage.getTypeAnswerInput()).type("answer")
        cy.iframe(LEDashboardPage.getQUIZiFrame()).should('be.visible').find(LEDashboardPage.getSubmitAnswer()).contains("Submit Response").click()
        LEDashboardPage.getShortWait()
        cy.get(LECoursesPage.getModalCloseBtn()).click()
        LECourseDetailsOCModule.getLongWait()
        cy.get(LECourseDetailsOCModule.getStartBtn()).click()
        LEDashboardPage.getMediumWait()
        LECourseLessonPlayerPage.getStartLessonByName(lessonAssessment.ocAssessmentName)
        LEDashboardPage.getLongWait() 
        cy.get(LECourseLessonPlayerPage.getEarlyLeavePromptHeader()).should('be.visible').and('contain','Lesson Complete')
        cy.get(LECourseLessonPlayerPage.getCoursePlayerCardModuleMessage()).eq(1).should('contain',`Looks like you’ve already completed this lesson.`)
        cy.get(LECourseLessonPlayerPage.getCoursePlayerStatusModule()).eq(0).should('be.visible').and('contain','Status')
        cy.get(LECourseLessonPlayerPage.getCoursePlayerStatusModule()).eq(1).should('be.visible').and('contain','Complete')
        LECourseLessonPlayerPage.getShortWait()
    })
    
        it('Edit the course and toggle on the Allow Additional Attempts After Pass Toggle Btn', () =>{
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Courses'))
         
        cy.editCourse(ocDetails.courseName)
        AROCAddEditPage.getEditBtnByLessonNameThenClick(lessonAssessment.ocAssessmentName)
        //Expand options dropdown under Assessment  
        cy.get(ARAddObjectLessonModal.getAddexpandoptions()).click()
        cy.get(ARCoursesPage.getAllowAdditionalAttemptsAfterPassToggleBtn()).click()
        ARDashboardPage.getShortWait()
        cy.get(ARAddObjectLessonModal.getandClickApplybutton()).eq(0).click()        
        arDashboardPage.getMediumWait()
        //Publish OC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36))
        })
        cy.get(ARDashboardPage.getToastSuccessMsg(), {timeout: 10000}).should('contain', 'Course successfully published')
    })

        
        it('Verfiy to course completition cards after successfull completition',()=>{
        cy.apiLoginWithSession(userDetails.username2, userDetails.validPassword)
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('My Courses')
        cy.get(LEDashboardPage.getLEEllipsesLoader(), {timeout: 15000}).should('not.exist', {timeout: 15000})
        cy.get(LEDashboardPage.getCourseCardName()).contains(ocDetails.courseName).click()
        //Start 1st Lesson
        cy.get(LECourseLessonPlayerPage.getLEWaitSpinner(), {timeout: 10000}).should('not.exist', {timeout: 10000})
        LECourseDetailsOCModule.getMediumWait()
        cy.get(LECourseDetailsOCModule.getStartBtn()).click()
        cy.get(LEDashboardPage.getLEEllipsesLoader(), {timeout: 15000}).should('not.exist')
        LEDashboardPage.getMediumWait()
        LECourseLessonPlayerPage.getStartLessonByName(lessonAssessment.ocAssessmentName)
        LEDashboardPage.getLongWait() 
        //The Confirm Quiz Attempt card will be displayed with the checkmark in the success colour variable, with Remaining Attempts = 1   
        cy.get(LECourseLessonPlayerPage.getCoursePlayerPromptModuleHeaderCompleteIcon()).should('be.visible')
        cy.get(LEDashboardPage.getCourseattemptslabel()).contains("Remaining Attempts").should('have.text',"Remaining Attempts")
        cy.get(LECourseLessonPlayerPage.getCoursePlayerCardModuleData()).eq(0).should('have.text',"1")
        cy.get(LECourseLessonPlayerPage.getEarlyLeavePromptHeader()).should('be.visible').and('contain','Confirm Quiz Attempt')
        cy.get(LECourseLessonPlayerPage.getCoursePlayerStartQuizModuleDescription()).should('be.visible').and('contain','Completing a new quiz attempt will count towards the total number of attempts remaining.')
        LECourseDetailsOCModule.getMediumWait()
        cy.get(LEDashboardPage.getStartQuizbutton()).click()
        cy.get(LEDashboardPage.getLEEllipsesLoader(), {timeout: 15000}).should('not.exist')
        LEDashboardPage.getShortWait()
        //The Confirm Quiz Attempt card will be displayed with the checkmark in the success colour variable, with Remaining Attempts = Unlimited
        cy.frameLoaded(LEDashboardPage.getQUIZiFrame())
        cy.iframe(LEDashboardPage.getQUIZiFrame()).should('be.visible').find(LEDashboardPage.getTypeAnswerInput()).type("answer")
        cy.iframe(LEDashboardPage.getQUIZiFrame()).should('be.visible').find(LEDashboardPage.getSubmitAnswer()).contains("Submit Response").click()
        LEDashboardPage.getShortWait()
        cy.get(LECoursesPage.getModalCloseBtn()).click()
        LECourseDetailsOCModule.getLongWait()
        cy.get(LECourseDetailsOCModule.getStartBtn()).click()
        LEDashboardPage.getMediumWait()
        LECourseLessonPlayerPage.getStartLessonByName(lessonAssessment.ocAssessmentName)
        LEDashboardPage.getLongWait() 
        cy.get(LECourseLessonPlayerPage.getEarlyLeavePromptHeader()).should('be.visible').and('contain','Lesson Complete')
        cy.get(LECourseLessonPlayerPage.getCoursePlayerCardModuleMessage()).eq(1).should('contain',`Looks like you’ve already completed this lesson.`)
        cy.get(LECourseLessonPlayerPage.getCoursePlayerStatusModule()).eq(0).should('be.visible').and('contain','Status')
        cy.get(LECourseLessonPlayerPage.getCoursePlayerStatusModule()).eq(1).should('be.visible').and('contain','Complete')
        LEDashboardPage.getVShortWait()
        //Detele the user
        LECourseLessonPlayerPage.getVShortWait()
        cy.get(LECoursesPage.getModalCloseBtn()).click()
        LECourseLessonPlayerPage.getMediumWait()
        cy.get(LECourseLessonPlayerPage.getModalCloseBtn()).click()
        LECourseLessonPlayerPage.getVShortWait()
        cy.get(LEDashboardPage.getNavProfile()).click()
        LEDashboardPage.getVShortWait()  
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
        cy.url().then((currentURL) => {
            cy.deleteUser(currentURL.slice(-36));
        })
    })

        it('Edit the course and make the max attempt zero', () =>{
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Courses'))
         
        cy.editCourse(ocDetails.courseName)
        AROCAddEditPage.getEditBtnByLessonNameThenClick(lessonAssessment.ocAssessmentName)
        //Expand options dropdown under Assessment  
        cy.get(ARAddObjectLessonModal.getAddexpandoptions()).click()
        cy.get(ARAddObjectLessonModal.getInputmaxattempts()).clear()
        ARDashboardPage.getShortWait()
        cy.get(ARAddObjectLessonModal.getandClickApplybutton()).eq(0).click()        
        arDashboardPage.getMediumWait()
        //Publish OC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36))
        })
        cy.get(ARDashboardPage.getToastSuccessMsg(), {timeout: 10000}).should('contain', 'Course successfully published')
        arEnrollUsersPage.getEnrollUserByCourseAndUsername([ocDetails.courseName], [userDetails.username3])
        arDashboardPage.getMediumWait()
    })
    
        it('Verfiy to course completition cards after successfull completition',()=>{
        cy.apiLoginWithSession(userDetails.username3, userDetails.validPassword)
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('My Courses')
        cy.get(LEDashboardPage.getLEEllipsesLoader(), {timeout: 15000}).should('not.exist', {timeout: 15000})
        cy.get(LEDashboardPage.getCourseCardName()).contains(ocDetails.courseName).click()
        //Start 1st Lesson
        cy.get(LECourseLessonPlayerPage.getLEWaitSpinner(), {timeout: 10000}).should('not.exist', {timeout: 10000})
        LECourseDetailsOCModule.getMediumWait()
        cy.get(LECourseDetailsOCModule.getStartBtn()).click()
        cy.get(LEDashboardPage.getLEEllipsesLoader(), {timeout: 15000}).should('not.exist')
        LEDashboardPage.getMediumWait()
        cy.get(LECourseLessonPlayerPage.getCollapseDetailsBtn()).click()
        LECourseLessonPlayerPage.getStartLessonByName(lessonAssessment.ocAssessmentName)
        LEDashboardPage.getLongWait() 
        //The Confirm Quiz Attempt card will be displayed with the checkmark in the success colour variable, with Remaining Attempts = 1   
        cy.get(LECourseLessonPlayerPage.getCoursePlayerPromptModuleHeaderCompleteIcon()).should('be.visible')
        cy.get(LEDashboardPage.getCourseattemptslabel()).contains("Remaining Attempts").should('have.text',"Remaining Attempts")
        cy.get(LECourseLessonPlayerPage.getCoursePlayerCardModuleData()).eq(0).should('have.text',"Unlimited")
        cy.get(LECourseLessonPlayerPage.getEarlyLeavePromptHeader()).should('be.visible').and('contain','Confirm Quiz Attempt')
        LEDashboardPage.getVShortWait()
        //Detele the user
        LECourseLessonPlayerPage.getVShortWait()
        cy.get(LECoursesPage.getModalCloseBtn()).click()
        LECourseLessonPlayerPage.getMediumWait()
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
