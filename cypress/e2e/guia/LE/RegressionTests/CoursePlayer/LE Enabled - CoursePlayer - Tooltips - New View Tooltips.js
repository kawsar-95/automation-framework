import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import { users } from '../../../../../../helpers/TestData/users/users'
import LECourseLessonPlayerPage from '../../../../../../helpers/LE/pageObjects/Courses/LECourseLessonPlayerPage'
import ARDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import { ocDetails} from '../../../../../../helpers/TestData/Courses/oc'
import AROCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage'
import ARSelectLearningObjectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectLearningObjectModal'
import LECourseDetailsOCModule from '../../../../../../helpers/LE/pageObjects/Courses/LECourseDetailsOCModule'
import { resourcePaths, images, videos} from '../../../../../../helpers/TestData/resources/resources'
import { userDetails } from '../../../../../../helpers/TestData/users/UserDetails'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import arEnrollUsersPage from '../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import ARCourseSettingsEnrollmentRulesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import {  lessonVideo } from '../../../../../../helpers/TestData/Courses/oc'
import AREditClientUserPage from "../../../../../../helpers/AR/pageObjects/PortalSettings/AREditClientUserPage"
import { lessonAssessment } from '../../../../../../helpers/TestData/Courses/oc'
import ARAddVideoLessonModal from '../../../../../../helpers/AR/pageObjects/Modals/ARAddVideoLessonModal'
import LESideMenu from '../../../../../../helpers/LE/pageObjects/Menu/LESideMenu'
import ARDashboardAccountMenu from '../../../../../../helpers/AR/pageObjects/Menu/ARDashboardAccount.menu'
import arQuestionBanksAddEditPage from '../../../../../../helpers/AR/pageObjects/QuestionBanks/ARQuestionBanksAddEditPage'
import LEProfilePage from '../../../../../../helpers/LE/pageObjects/User/LEProfilePage'
import ARAddObjectLessonModal from '../../../../../../helpers/AR/pageObjects/Modals/ARAddObjectLessonModal'
import LECoursesPage from '../../../../../../helpers/LE/pageObjects/Courses/LECoursesPage'

describe('T151419 - T151421 - AUT376 -  GUIA-Story NLE-4042 Course Player - New view tooltips ', function () {
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
    
    it('Create Online Course with Video Lesson and Assesment', () =>{ 
       //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Courses'))
        
        cy.createCourse('Online Course', ocDetails.courseName)
        //Set enrollment rule - Allow self enrollment for all learners
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        LEDashboardPage.getShortWait()
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')
        //Add Assessment lesson object to the course 
        cy.get(AROCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
        ARSelectLearningObjectModal.getObjectTypeByName('Assessment')
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()
        arDashboardPage.getMediumWait()
        ARAddObjectLessonModal.getTxtFByName('Assessment Name', lessonAssessment.ocAssessmentName)
        //Add Assesment Weight
        cy.get(ARAddObjectLessonModal.getAddassessmentweight()).clear().type(10)
        //Add Grade to Pass
        cy.get(ARAddObjectLessonModal.getAddGradetoPass()).clear().type(100)
        //Expand options dropdown under Assessment  
        cy.get(ARAddObjectLessonModal.getAddexpandoptions()).click()
        //Enable Max attempts and set to 3  
        cy.get(ARAddObjectLessonModal.getEnablemaxattempts()).click({force: true})
        cy.get(ARAddObjectLessonModal.getInputmaxattempts()).clear().type(1)
        //Enable Max failures button
        cy.get(ARAddObjectLessonModal.getInputallowfailures()).eq(0).click({force: true})        
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
        arEnrollUsersPage.getEnrollUserByCourseAndUsername([ocDetails.courseName], [userDetails.username])        
    })

    it('Verfiy that the new course player tooltips is available',()=>{
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('My Courses')
        cy.get(LEDashboardPage.getLEEllipsesLoader(), {timeout: 15000}).should('not.exist', {timeout: 15000})
        cy.get(LEDashboardPage.getCourseCardName()).contains(ocDetails.courseName).click()
        //Start 1st Video Lesson
        cy.get(LECourseLessonPlayerPage.getLEWaitSpinner(), {timeout: 10000}).should('not.exist', {timeout: 10000})
        LECourseDetailsOCModule.getMediumWait()
        cy.get(LECourseDetailsOCModule.getStartBtn()).click()
        cy.get(LEDashboardPage.getLEEllipsesLoader(), {timeout: 15000}).should('not.exist')
        //Verify that new tooltips are available 
        cy.get(LECourseLessonPlayerPage.getChooseViewBtn()).should('exist')
        LECourseLessonPlayerPage.getSelectViewMenuItemsByName('Combined')
        LECourseLessonPlayerPage.getVShortWait()
        cy.get(LECourseLessonPlayerPage.getViewCombinedBtn()).should('exist')
        LECourseLessonPlayerPage.getSelectViewMenuItemsByName('Sidebar')
        LECourseLessonPlayerPage.getVShortWait()
        cy.get(LECourseLessonPlayerPage.getViewSidebarBtn()).should('exist')
        LECourseLessonPlayerPage.getSelectViewMenuItemsByName('Details')
        LECourseLessonPlayerPage.getVShortWait()
        cy.get(LECourseLessonPlayerPage.getViewDetailsBtn()).should('exist')
        LECourseLessonPlayerPage.getSelectViewMenuItemsByName('Compact')
        LECourseLessonPlayerPage.getVShortWait()
        cy.get(LECourseLessonPlayerPage.getViewCompactBtn()).should('exist')
        LECourseLessonPlayerPage.getVShortWait()
        cy.get(LECourseLessonPlayerPage.getExpandCourseDetailsBtn()).should('exist').click()
        cy.get(LECourseLessonPlayerPage.getExpandCourseDetailsDownBtn()).should('exist')
        cy.get(LECourseLessonPlayerPage.getExpandCourseDetailsBtn()).should('exist').click()
        cy.get(LECourseLessonPlayerPage.getExpandCourseDetailsUpBtn()).should('exist')
        //Vefiy that New tooltips are available by using keyboard buttons
        LECourseLessonPlayerPage.getVShortWait()
        cy.get(LECourseLessonPlayerPage.getChooseViewBtn()).should('exist').click()
        LECourseLessonPlayerPage.getVShortWait()
        cy.get(LECourseLessonPlayerPage.getChooseViewMenuItems()).parent().contains('Combined').type('{enter}')
        cy.get(LECourseLessonPlayerPage.getViewCombinedBtn()).should('exist')
        LECourseLessonPlayerPage.getVShortWait()
        cy.get(LECourseLessonPlayerPage.getChooseViewBtn()).should('exist').click()
        LECourseLessonPlayerPage.getVShortWait()
        cy.get(LECourseLessonPlayerPage.getChooseViewMenuItems()).parent().contains('Sidebar').type('{downArrow}{enter}')
        cy.get(LECourseLessonPlayerPage.getViewSidebarBtn()).should('exist')
        LECourseLessonPlayerPage.getVShortWait()
        cy.get(LECourseLessonPlayerPage.getChooseViewBtn()).should('exist').click()
        LECourseLessonPlayerPage.getVShortWait()
        cy.get(LECourseLessonPlayerPage.getChooseViewMenuItems()).parent().contains('Details').type('{downArrow}{downArrow}{enter}')
        cy.get(LECourseLessonPlayerPage.getViewDetailsBtn()).should('exist')
        LECourseLessonPlayerPage.getVShortWait()
        cy.get(LECourseLessonPlayerPage.getChooseViewBtn()).should('exist').click()
        LECourseLessonPlayerPage.getVShortWait()
        cy.get(LECourseLessonPlayerPage.getChooseViewMenuItems()).parent().contains('Compact').type('{downArrow}{downArrow}{downArrow}{enter}')
        cy.get(LECourseLessonPlayerPage.getViewCompactBtn()).should('exist')
        LECourseLessonPlayerPage.getVShortWait()
        cy.get(LECourseLessonPlayerPage.getExpandCourseDetailsBtn()).should('exist').click()
        LECourseLessonPlayerPage.getVShortWait()
        cy.get(LECourseLessonPlayerPage.getExpandCourseDetailsDownBtn()).should('exist').type('{enter}')
        LECourseLessonPlayerPage.getVShortWait()
        cy.get(LECourseLessonPlayerPage.getExpandCourseDetailsUpBtn()).should('exist').type('{enter}')
        LECourseLessonPlayerPage.getVShortWait()
        cy.get(LECourseLessonPlayerPage.getExpandCourseDetailsDownBtn()).should('exist')
        LECourseLessonPlayerPage.getVShortWait()
        cy.get(LECoursesPage.getModalCloseBtn()).click()
        LECourseLessonPlayerPage.getMediumWait()
        cy.get(LECourseLessonPlayerPage.getModalCloseBtn()).click()
        LECourseLessonPlayerPage.getVShortWait()
        //Detele the user
        cy.get(LEDashboardPage.getNavProfile()).click()
        LEDashboardPage.getVShortWait()  
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
        cy.url().then((currentURL) => {
            cy.deleteUser(currentURL.slice(-36));
        })
    })

})    