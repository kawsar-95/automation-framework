import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import { users } from '../../../../../../helpers/TestData/users/users'
import arDashboardAccountMenu from '../../../../../../helpers/AR/pageObjects/Menu/ARDashboardAccount.menu'
import ARDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import { ocDetails } from '../../../../../../helpers/TestData/Courses/oc'
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
import LECourseLessonPlayerPage from '../../../../../../helpers/LE/pageObjects/Courses/LECourseLessonPlayerPage'
import LECoursesPage from '../../../../../../helpers/LE/pageObjects/Courses/LECoursesPage'
import LECourseDetailsOCModule from '../../../../../../helpers/LE/pageObjects/Courses/LECourseDetailsOCModule'

describe('T98564 - T98565 - T98590 - AUT388 - AUT382 - Create Online Course with Learning Object Assesement with Proctor login enabled ', function () {

    let userID;

     before(function () {
         cy.createUser(void 0, userDetails.username, ["Learner"], void 0);
        //Signin with system admin
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getCurrentUserLabel()).should('contain.text',"GUI_Auto Sys_Admin_01")
        cy.get(arDashboardPage.getElementByDataNameAttribute(arDashboardPage.getHelpAndSupportBtn())).should('be.visible')
        //Select Account Menu 
        cy.get(arDashboardPage.getElementByDataNameAttribute(arDashboardPage.getAccountBtn())).click()
        //Select Portal Setting option from account menu
        cy.get(arDashboardAccountMenu.getPortalSettingsBtn()).should('exist').click()
        //Validate userGuid from URL
        cy.url().then((currentUrl) => { userID = currentUrl.slice(-36) 
            expect(userID).to.eq(`c7a56ad9-3230-4c63-a380-bf3a60813e88`)
        })
        //Validate portal setting page header
        cy.get(arDashboardPage.getAccountHeaderLabel()).should('have.text','Edit Client')
        cy.get(arDashboardPage.getUsersTab()).click()
        AREditClientUserPage.getTurnOnNextgenToggle()
        //Select save button within Portal settings 
        cy.get(AREditClientUserPage.getSaveBtn()).click()
        cy.get(arDashboardPage.getCurrentUserLabel()).should('contain.text',"GUI_Auto Sys_Admin_01")
    });
    
    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Courses'))
        
    })

    it('Create Online Course with Learning Assesement with Questionnire and Proctor login enabled', () =>{ 


        cy.createCourse('Online Course', ocDetails.courseName)
        
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
        arDashboardPage.getShortWait()
        cy.get(ARAddObjectLessonModal.getandClickApplybutton()).eq(0).click({ force: true })        
        arDashboardPage.getShortWait()

        //Publish OC
        cy.publishCourseAndReturnId().then((id) => {
        commonDetails.courseIDs.push(id.request.url.slice(-36))
        })
        cy.get(ARDashboardPage.getToastSuccessMsg(), {timeout: 10000}).should('contain', 'Course successfully published')
        
        //Enroll User
        arEnrollUsersPage.getEnrollUserByCourseAndUsername([ocDetails.courseName], [userDetails.username]) 
                       
    })
})
 describe('LE - Course Player - Assessment Lesson - Learner Side Validation', function(){
    

    after(function() {
       //Signin with system admin
       cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
       cy.get(arDashboardPage.getCurrentUserLabel()).should('contain.text',"GUI_Auto Sys_Admin_01")
       cy.get(arDashboardPage.getElementByDataNameAttribute(arDashboardPage.getHelpAndSupportBtn())).should('be.visible')
       //Select Account Menu 
       cy.get(arDashboardPage.getElementByDataNameAttribute(arDashboardPage.getAccountBtn())).click()
       //Select Portal Setting option from account menu
       cy.get(arDashboardAccountMenu.getPortalSettingsBtn()).should('exist').click()
       //Validate portal setting page header
       cy.get(arDashboardPage.getAccountHeaderLabel()).should('have.text','Edit Client')
       cy.get(arDashboardPage.getUsersTab()).click()
       AREditClientUserPage.getTurnOffNextgenToggle()
       //Select save button within Portal settings 
       cy.get(AREditClientUserPage.getSaveBtn()).click()
       cy.get(arDashboardPage.getCurrentUserLabel()).should('contain.text',"GUI_Auto Sys_Admin_01")
       //Delete the course
       cy.deleteCourse(commonDetails.courseID)
    })

    it('Verify Course Player learner can see Proctor login username and password', () => {
        
        // //Login as a learner 
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        // //Search for OC
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('My Courses')
        cy.get(LEDashboardPage.getLEEllipsesLoader(), {timeout: 15000}).should('not.exist', {timeout: 15000})
        cy.get(LEDashboardPage.getCoursestartbutton()).click({force: true})
        LEDashboardPage.getShortWait()
        cy.get(LECourseLessonPlayerPage.getCollapseDetailsBtn()).click()
        LEDashboardPage.getMediumWait()
        cy.get(LEDashboardPage.getStartquizbutton()).contains("Start Quiz").click({force: true})
        LEDashboardPage.getShortWait()
        //Verify with uncorrect credentials to check error message
        //The proctor login card appears on the screen, learner can navigate away and no warning message appears
        cy.get(LECourseLessonPlayerPage.getEarlyLeavePromptHeader()).should('contain','Proctor Login')
        cy.get(LEDashboardPage.getProctorUsername()).should('be.visible').type("uncorrect")
        cy.get(LEDashboardPage.getProctorPassword()).should('be.visible').type("uncorrect")
        cy.get(LEDashboardPage.getProctorLogingButton()).click()
        LECourseLessonPlayerPage.getVShortWait()
        cy.get(LEDashboardPage.getProctorErrorMsgContainer()).should('be.visible').and('have.text', LEDashboardPage.getProctorErrorMsg())        
        LECourseLessonPlayerPage.getVShortWait()
        cy.get(LECoursesPage.getModalCloseBtn()).click()
        LECourseLessonPlayerPage.getMediumWait()
        cy.get(LECourseLessonPlayerPage.getCourseCardName()).contains(ocDetails.courseName).click()
        cy.get(LECoursesPage.getDiscoveryCourseNameHeader()).should('be.visible').and('contain',ocDetails.courseName)
        LEDashboardPage.getLongWait()
        cy.get(LECourseDetailsOCModule.getStartBtn()).click()
        LEDashboardPage.getLongWait()
        cy.get(LECourseLessonPlayerPage.getCollapseDetailsBtn()).click()
        LEDashboardPage.getShortWait()
        cy.get(LEDashboardPage.getStartquizbutton()).contains("Start Quiz").click({force: true})
        LECourseLessonPlayerPage.getShortWait()
        //The learner attempts to navigate away from the proctor lesson after successfull proctor login
        //Verify the prompt modal message 
        cy.get(LECourseLessonPlayerPage.getEarlyLeavePromptHeader()).should('contain','Proctor Login')
        cy.get(LEDashboardPage.getProctorUsername()).should('be.visible').type(users.sysAdmin.admin_sys_01_username)
        cy.get(LEDashboardPage.getProctorPassword()).should('be.visible').type(users.sysAdmin.admin_sys_01_password)
        cy.get(LEDashboardPage.getProctorLogingButton()).click()
        LECourseLessonPlayerPage.getLongWait()
        cy.get(LECoursesPage.getModalCloseBtn()).click()
        LECourseLessonPlayerPage.getMediumWait()
        cy.get(LECourseLessonPlayerPage.getEarlyLeavePromptHeader()).should('exist').and('contain','Lesson Incomplete')
        cy.get(LECourseLessonPlayerPage.getEalyLeavePromptModalMessage()).eq(0).should('exist').and('contain','Leaving this lesson early will require a proctor to login again.')
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