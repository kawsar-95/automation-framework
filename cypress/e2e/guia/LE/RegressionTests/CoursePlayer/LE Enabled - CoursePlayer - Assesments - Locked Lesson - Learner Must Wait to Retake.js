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

describe('T98566 - AUT-385 - GUIA-Auto - NLE-3730 - Course Player - Locked Lessons - learner must wait to retake', function () {

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

    it('Create Online Course with Learning Assesement with Questionnire and set up allow failure 1 day', () =>{
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
        cy.get(ARAddObjectLessonModal.getInputmaxattempts()).clear().type(3)
        //Toggle on allow Failure button and select Allow Retake After: radio btn 
        cy.get(ARAddObjectLessonModal.getAddassessmentModal()).within(()=>{
            cy.get(ARAddObjectLessonModal.getElementByDataNameAttribute(ARCoursesPage.getAllowFailureToggleBtn()) + ' ' + ARAddObjectLessonModal.getToggleDisabled()).click()
        })
        ARAddObjectLessonModal.getSelectFailureTypeRadioButtonsByName ('Allow Retake After:')
        cy.get(ARAddObjectLessonModal.getAllowRetakeAfterTextF()).type(1)
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
        //Publish OC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36))
        })
        cy.get(ARDashboardPage.getToastSuccessMsg(), {timeout: 10000}).should('contain', 'Course successfully published')
        //Enroll User
        arEnrollUsersPage.getEnrollUserByCourseAndUsername([ocDetails.courseName], [userDetails.username])
    })

    it('Verfiy that after failing, the lesson will be locked and takes a day to retake',()=>{
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
        //Validate Course Player Labels   
        cy.get(LEDashboardPage.getCourseattemptslabel()).contains("Remaining Attempts").should('have.text',"Remaining Attempts")
        cy.get(LEDashboardPage.getBestscorelabel()).contains("Best Score").should('have.text',"Best Score")      
        cy.get(LEDashboardPage.getStartQuizbutton()).click()
        LEDashboardPage.getShortWait() 
        cy.frameLoaded(LEDashboardPage.getQUIZiFrame())
        cy.iframe(LEDashboardPage.getQUIZiFrame()).should('be.visible').find(LEDashboardPage.getTypeAnswerInput()).type("not an answer")
        cy.iframe(LEDashboardPage.getQUIZiFrame()).should('be.visible').find(LEDashboardPage.getSubmitAnswer()).contains("Submit Response").click()  
        LEDashboardPage.getMediumWait()
        cy.get(LECoursesPage.getModalCloseBtn()).click()
        LEDashboardPage.getLongWait()
        cy.get(LECourseDetailsOCModule.getStartBtn()).click()
        LEDashboardPage.getLongWait()
        cy.get(LECourseLessonPlayerPage.getEarlyLeavePromptHeader()).should('contain','Assessment Locked')
        cy.get(LECourseLessonPlayerPage.getCoursePlayerCardModuleDescription()).should('include.text','You must wait until')
        cy.get(LEDashboardPage.getCourseattemptslabel()).contains("Remaining Attempts").should('have.text',"Remaining Attempts")
        cy.get(LECourseLessonPlayerPage.getCoursePlayerCardModuleData()).eq(0).should('have.text',"2")
        cy.get(LEDashboardPage.getBestscorelabel()).contains("Best Score").should('have.text',"Best Score")
        cy.get(LECourseLessonPlayerPage.getCoursePlayerCardModuleData()).eq(1).should('have.text',"0%")
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