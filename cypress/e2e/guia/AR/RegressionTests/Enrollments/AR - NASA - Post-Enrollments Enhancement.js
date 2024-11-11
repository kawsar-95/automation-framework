import { users } from '../../../../../../helpers/TestData/users/users'
import {userDetails}  from '../../../../../../helpers/TestData/users/UserDetails'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { lessonAssessment, ocDetails } from '../../../../../../helpers/TestData/Courses/oc'
import ARCourseSettingsEnrollmentRulesModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module"
import AREnrollUsersPage from "../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage"
import ARCourseSettingsCompletionModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCompletion.module'
import AROCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import ARDashboardAccountMenu from '../../../../../../helpers/AR/pageObjects/Menu/ARDashboardAccount.menu'
import AREditClientUserPage from '../../../../../../helpers/AR/pageObjects/PortalSettings/AREditClientUserPage'
import ARSelectLearningObjectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectLearningObjectModal'
import ARAddObjectLessonModal from '../../../../../../helpers/AR/pageObjects/Modals/ARAddObjectLessonModal'
import ARQuestionBanksAddEditPage from '../../../../../../helpers/AR/pageObjects/QuestionBanks/ARQuestionBanksAddEditPage'
import LEProfilePage from '../../../../../../helpers/LE/pageObjects/User/LEProfilePage'
import ARAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import LESideMenu from '../../../../../../helpers/LE/pageObjects/Menu/LESideMenu'
import LEFilterMenu from '../../../../../../helpers/LE/pageObjects/Menu/LEFilterMenu'
import LEResourcesPage from '../../../../../../helpers/LE/pageObjects/Resources/LEResourcesPage'
import ARDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'


describe('AUT-688 NASA-6778 Create Online Course with Learning Object Assesement ', function () {

    let userID;
    

    before(function () {
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0);
        //Signin with system admin
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(ARDashboardPage.getCurrentUserLabel()).should('contain.text',"GUI_Auto Sys_Admin_01")
        cy.get(ARDashboardPage.getElementByDataNameAttribute(ARDashboardPage.getHelpAndSupportBtn())).should('be.visible')
        //Select Account Menu 
        cy.get(ARDashboardPage.getElementByDataNameAttribute(ARDashboardPage.getAccountBtn())).click()
        //Select Portal Setting option from account menu
        cy.get(ARDashboardAccountMenu.getPortalSettingsBtn()).should('exist').click()
        //Validate userGuid from URL
        cy.url().then((currentUrl) => { userID = currentUrl.slice(-36) 
           
        })
        //Validate portal setting page header
        cy.get(ARDashboardPage.getAccountHeaderLabel()).should('have.text','Edit Client')
        cy.get(ARDashboardPage.getUsersTab()).click()
        AREditClientUserPage.getTurnOnNextgenToggle()
        //Select save button within Portal settings 
        cy.get(AREditClientUserPage.getSaveBtn()).click()
        cy.get(ARDashboardPage.getCurrentUserLabel()).should('contain.text',"GUI_Auto Sys_Admin_01")
      });
    
    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Courses'))
        
    })

    it('Create 2 Online Courses with Learning Assesement with Questionnire', () =>{
        //for (let i = 0; i < 2 ; i++){
            cy.createCourse('Online Course', ocDetails.courseName)
             // Select Allow Self Enrollment Alll learner Radio Button
            // Set enrollment rule - Allow self enrollment for all learners
            cy.get(ARCourseSettingsEnrollmentRulesModule.getRadioBtnContainer()).contains('All Learners').click()
            //Add Video File Object Lesson Desktop Iframe
            cy.get(AROCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
            //Add learning object Assessment        
            ARSelectLearningObjectModal.getObjectTypeByName('Assessment')
            cy.get(ARSelectLearningObjectModal.getNextBtn()).click()
            ARDashboardPage.getMediumWait()
            ARAddObjectLessonModal.getTxtFByName('Assessment Name', lessonAssessment.ocAssessmentName)
            //Add Assesment Weight
            cy.get(ARAddObjectLessonModal.getAddassessmentweight()).clear().type(10)
            //Add Grade to Pass
            cy.get(ARAddObjectLessonModal.getAddGradetoPass()).clear().type(100)
            //Expand options dropdown under Assessment  
            cy.get(ARAddObjectLessonModal.getAddexpandoptions()).click()
            cy.get(ARAddObjectLessonModal.getInputallowfailures()).eq(0).click({force: true})        
            //Add Question for assessment
            cy.get(ARAddObjectLessonModal.getExpandQuestionsbutton()).click()
            cy.get(ARAddObjectLessonModal.getManageQuestions()).click()
    
            cy.get(ARQuestionBanksAddEditPage.getUseQuestionBankButton()).click()
            ARDashboardPage.getShortWait()
            cy.get(ARQuestionBanksAddEditPage.getSelectQuestionBankDropdown()).click()
            ARDashboardPage.getShortWait()
            cy.get(ARQuestionBanksAddEditPage.getEnterQuestionBankName()).type("GUIA - CED - QBank")
            ARDashboardPage.getMediumWait()
            cy.get(ARQuestionBanksAddEditPage.getSelectQuestionBank()).click()
            ARDashboardPage.getShortWait()  
    
             cy.get(ARAddObjectLessonModal.getQuestionSavebutton()).contains("Save").click({ multiple: true })
            ARDashboardPage.getShortWait()
            cy.get(ARAddObjectLessonModal.getandClickApplybutton()).eq(1).click({ force: true })        
            ARDashboardPage.getShortWait()
            cy.get(ARAddObjectLessonModal.getandClickApplybutton()).eq(0).click({ force: true })        
            ARDashboardPage.getShortWait()
           //Publish OC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })

        cy.get(ARDashboardPage.getToastSuccessMsg(), {timeout: 10000}).should('contain', 'Course successfully published')
        ARDashboardPage.getMediumWait()

   
  
    })
})

describe('AUT-688 C7304 NASA-6778 Post-Enrollments Enhancement (cloned)', () => {

    before('Create a user and course for enrollment', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getMediumWait()

        // Create a course to enroll in
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Courses'))
        

       
    })

    after(function() {
        //Delete all courses
        for (let i = 0; i < commonDetails.courseIDs.length; i++) {
            cy.deleteCourse(commonDetails.courseIDs[i], 'online-courses')
        }
        //Cleanup - delete learner
         //Login as a learner 
         cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
         LEDashboardPage.getLongWait()
        cy.get(LEDashboardPage.getNavProfile()).click({force: true})  
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click({force: true})
        cy.url().then((currentURL) => {
            cy.deleteUser(currentURL.slice(-36));

        //Signin with system admin
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(ARDashboardPage.getCurrentUserLabel()).should('contain.text',"GUI_Auto Sys_Admin_01")
        cy.get(ARDashboardPage.getElementByDataNameAttribute(ARDashboardPage.getHelpAndSupportBtn())).should('be.visible')
        //Select Account Menu 
        cy.get(ARDashboardPage.getElementByDataNameAttribute(ARDashboardPage.getAccountBtn())).click()
        //Select Portal Setting option from account menu
        cy.get(ARDashboardAccountMenu.getPortalSettingsBtn()).should('exist').click()
        //Validate portal setting page header
        cy.get(ARDashboardPage.getAccountHeaderLabel()).should('have.text','Edit Client')
        cy.get(ARDashboardPage.getUsersTab()).click()
        AREditClientUserPage.getTurnOffNextgenToggle()
        //Select save button within Portal settings 
        cy.get(AREditClientUserPage.getSaveBtn()).click()
        cy.get(ARDashboardPage.getCurrentUserLabel()).should('contain.text',"GUI_Auto Sys_Admin_01")

        })
    })


    it('Enroll a user in the selected course and save', () => {
     
         // Create a course for all learners
         cy.createCourse('Online Course', ocDetails.courseName2)
         // Set enrollment rule - Allow self enrollment for all learners
         cy.get(ARCourseSettingsEnrollmentRulesModule.getRadioBtnContainer()).contains('All Learners').click()
         //Open Completion Section
         cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Completion')).click()
          //validate Add post Enrollment Btn Txt and click
          cy.get(ARCourseSettingsCompletionModule.getAddPostEnrollmentButton()).should("have.text","Add Post Enrollment").click()
          //Select the dropdown box for When the post enrollment will occur
          cy.get(ARCourseSettingsCompletionModule.getPostEnrollmntWhenDDown()).eq(1).click()
         
          //Select the post enrollment occurance
          ARCourseSettingsCompletionModule.getPostEnrollmentWhenDDownByOpt('Completed')
         
          //Selecting the course competion dropdown box
          ARCourseSettingsCompletionModule.getSelectPostEnrollmentCourseByName('Post Enrollment Course')
          ARCourseSettingsCompletionModule.getToggleByNameAndVerify('Allow Consecutive Enrollments')
          ARCourseSettingsCompletionModule.getverifyHelperTxt("Turning this option 'on' will create a new enrollment record for learners if they have already completed the selected courses.")
          ARCourseSettingsCompletionModule.getMediumWait()
          ARCourseSettingsCompletionModule.getToggleByNameThenClick('Allow Consecutive Enrollments')
         
          AROCAddEditPage.getMediumWait()
         
        // Publish and Course saved sucessfully.
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36))
        }) 
         //Enroll User
        AREnrollUsersPage.getEnrollUserByCourseAndUsername([ocDetails.courseName2], [userDetails.username])
 

    })



    it('Start the course', () => {
        //Login as a learner 
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        LEDashboardPage.getLongWait()

        //Search for OC
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('My Courses')
        cy.get(LEDashboardPage.getLEEllipsesLoader(), { timeout: 15000 }).should('not.exist', { timeout: 15000 })
        LEDashboardPage.getMediumWait()
        LEFilterMenu.SearchForCourseByName(ocDetails.courseName2)
        LEDashboardPage.getMediumWait()
        cy.get(LEResourcesPage.getCourseCardName()).should('contain', ocDetails.courseName2).should('be.visible')
        LEDashboardPage.getMediumWait()
        //Start course
        cy.get(LEDashboardPage.getCoursestartbutton()).click({ force: true })
        LEDashboardPage.getMediumWait()


    })
   
})



 