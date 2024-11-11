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

describe('Create Online Course with Learning Object Assesement with Max attempts and Enroll the learner ', function () {

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
      })
    
    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Courses'))
        
    })

    it('Create Online Course with Learning Assesement with Questionnire', () =>{ 
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
})
 describe('LE - Course Player - Assessment Lesson - Learner Side Validation', function(){
    
    after(function() {
        //Delete all courses
        for (let i = 0; i < commonDetails.courseIDs.length; i++) {
            cy.deleteCourse(commonDetails.courseIDs[i], 'online-courses')
        }
        //Cleanup - delete learner
        
        cy.get(LEDashboardPage.getNavProfile()).click({force: true})  
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click({force: true})
        cy.url().then((currentURL) => {
            cy.deleteUser(currentURL.slice(-36));

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

        })
    })

    
    it('Verify Course Player learner can display course failure', () => {
        
         //Login as a learner 
         cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
         //Search for OC
         cy.get(LEDashboardPage.getNavMenu()).click()
         LESideMenu.getLEMenuItemsByNameThenClick('My Courses')
         cy.get(LEDashboardPage.getLEEllipsesLoader(), {timeout: 15000}).should('not.exist', {timeout: 15000})
         cy.get(LEDashboardPage.getCoursestartbutton()).click({force: true})
         //Validate Course Player Labels   
         cy.get(LEDashboardPage.getCourseattemptslabel()).contains("Remaining Attempts").should('have.text',"Remaining Attempts")
         cy.get(LEDashboardPage.getBestscorelabel()).contains("Best Score").should('have.text',"Best Score")
         //cy.get(LEDashboardPage.getcourseplayerstatus()).contains("0").should('have.text',"0%")        
         cy.get(LEDashboardPage.getStartQuizbutton()).click()
         LEDashboardPage.getShortWait()
         
         cy.frameLoaded(LEDashboardPage.getQUIZiFrame())
 
        cy.iframe(LEDashboardPage.getQUIZiFrame()).should('be.visible').find(LEDashboardPage.getTypeAnswerInput()).type("not an answer")
        cy.iframe(LEDashboardPage.getQUIZiFrame()).should('be.visible').find(LEDashboardPage.getSubmitAnswer()).contains("Submit Response").click()
        cy.iframe(LEDashboardPage.getQUIZiFrame()).should('be.visible').find("tr td:nth-child(1)").contains("Continue").click()  
        
        
    })
    it('Verify Course Player learner can complete his assessment', () => {
        
        //Login as a learner 
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        //Search for OC
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('My Courses')
        cy.get(LEDashboardPage.getLEEllipsesLoader(), {timeout: 15000}).should('not.exist', {timeout: 15000})
        cy.get(LEDashboardPage.getCoursestartbutton()).click({force: true})
        //Validate Course Player Labels   
        cy.get(LEDashboardPage.getCourseattemptslabel()).contains("Remaining Attempts").should('have.text',"Remaining Attempts")
        cy.get(LEDashboardPage.getBestscorelabel()).contains("Best Score").should('have.text',"Best Score")
        //cy.get(LEDashboardPage.getcourseplayerstatus()).contains("0").should('have.text',"0%")        
        cy.get(LEDashboardPage.getStartQuizbutton()).click()
        LEDashboardPage.getShortWait()
        
        cy.frameLoaded(LEDashboardPage.getQUIZiFrame())


        cy.iframe(LEDashboardPage.getQUIZiFrame()).should('be.visible').find(LEDashboardPage.getTypeAnswerInput()).type("answer")
        cy.iframe(LEDashboardPage.getQUIZiFrame()).should('be.visible').find(LEDashboardPage.getSubmitAnswer()).contains("Submit Response").click()
        cy.iframe(LEDashboardPage.getQUIZiFrame()).should('be.visible').find("tr td:nth-child(1)").contains("Continue").click()  
        
        
    })    
   
})