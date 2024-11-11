import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import { users } from '../../../../../../helpers/TestData/users/users'
import arDashboardAccountMenu from '../../../../../../helpers/AR/pageObjects/Menu/ARDashboardAccount.menu'
import ARDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import { courseUploadSection, lessonSurvey, lessonTask, ocDetails} from '../../../../../../helpers/TestData/Courses/oc'
import AROCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage'
import ARSelectLearningObjectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectLearningObjectModal'
import ARAddObjectLessonModal from '../../../../../../helpers/AR/pageObjects/Modals/ARAddObjectLessonModal'
import { lessonAssessment } from '../../../../../../helpers/TestData/Courses/oc'
import { userDetails } from '../../../../../../helpers/TestData/users/UserDetails'
import { commonDetails, courseEvalQuestions } from '../../../../../../helpers/TestData/Courses/commonDetails'
import arEnrollUsersPage from '../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage'
import LESideMenu from '../../../../../../helpers/LE/pageObjects/Menu/LESideMenu'
import LEProfilePage from '../../../../../../helpers/LE/pageObjects/User/LEProfilePage'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import arQuestionBanksAddEditPage from '../../../../../../helpers/AR/pageObjects/QuestionBanks/ARQuestionBanksAddEditPage'
import AREditClientUserPage from "../../../../../../helpers/AR/pageObjects/PortalSettings/AREditClientUserPage"
import ARAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import ARCourseSettingsAttributesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsAttributes.module'
import ARCourseSettingsCourseUploadsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCourseUploads.module'
import LECourseDetailsOCModule from '../../../../../../helpers/LE/pageObjects/Courses/LECourseDetailsOCModule'
import LECourseLessonPlayerPage from '../../../../../../helpers/LE/pageObjects/Courses/LECourseLessonPlayerPage'
import ARAddSurveyLessonModal from '../../../../../../helpers/AR/pageObjects/Modals/ARAddSurveyLessonModal'
import ARAddTaskLessonModal from '../../../../../../helpers/AR/pageObjects/Modals/ARAddTaskLessonModal'

describe('C7521 AUT-792, Create Online Course with Learning Object Assesement with Max attempts and Enroll the learner ', function () {
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
        cy.url().then((currentUrl) => { 
            let userID = currentUrl.slice(-36) 
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

    after(() => {
        // Delete learner
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
         cy.get(LEDashboardPage.getNavProfile()).click({force: true})  
         LEDashboardPage.getMediumWait()
         cy.get(LEProfilePage.getViewSocialProfileBtn()).click({force: true})
         cy.url().then((currentURL) => {
             cy.deleteUser(currentURL.slice(-36));
         })

         //Signin with system admin
         cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
         arDashboardPage.getMediumWait()
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

        // Delete Created Course
        cy.deleteCourse(commonDetails.courseID)
    })

    it('Create Online Course with a few lessons, Course Upload and required Course Evaluation', () =>{ 
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Courses'))
        

        cy.createCourse('Online Course', ocDetails.courseName)

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
        cy.get(ARAddObjectLessonModal.getAddGradetoPass()).clear().type(100)
        
        //Expand options dropdown under Assessment  
        cy.get(ARAddObjectLessonModal.getAddexpandoptions()).click()
        
        //Enable Max attempts and set to 3  
        cy.get(ARAddObjectLessonModal.getEnablemaxattempts()).click({force: true})
        cy.get(ARAddObjectLessonModal.getInputmaxattempts()).clear().type(3)
        
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

        //Verify Task Lesson Can Be Selected
        cy.get(AROCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
        ARSelectLearningObjectModal.getObjectTypeByName('Task')
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()

        //Add Valid Value to Name Field
        cy.get(AROCAddEditPage.getElementByAriaLabelAttribute(ARAddTaskLessonModal.getNameTxt())).clear().type(lessonTask.ocTaskName)

        //Verify Description Field Accepts HTML Tags
        cy.get(ARAddTaskLessonModal.getDescriptionTxtF()).type(commonDetails.textWithHtmlTag)

        //Turn on Task is Scored, add Pass Grade & Weight
        cy.get(ARAddTaskLessonModal.getTaskIsScoredToggle()).click()
        cy.get(AROCAddEditPage.getElementByAriaLabelAttribute(ARAddTaskLessonModal.getGradeToPassTxt())).clear().type('50')
        cy.get(AROCAddEditPage.getElementByAriaLabelAttribute(ARAddTaskLessonModal.getWeightTxt())).clear().type('12')

        //Save Task
        cy.get(ARAddTaskLessonModal.getSaveBtn()).click()
        arDashboardPage.getMediumWait()

        //Verify Survey Lesson Can Be Selected
        cy.get(AROCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
        ARSelectLearningObjectModal.getObjectTypeByName('Survey')
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()
        AROCAddEditPage.getShortWait()

        //Verify Details section
        ARAddSurveyLessonModal.getExpandDetails()
        cy.get(ARAddSurveyLessonModal.getNameTxtF()).type(lessonSurvey.ocSurveyName) //Add valid name

        //Add description
        cy.get(ARAddSurveyLessonModal.getDescriptionTxtF()).type(lessonSurvey.ocSurveyDescription)

        //Collapse Details
        ARAddSurveyLessonModal.getCollapseDetails()

        //Expand Questions section and verify adding a question group
        ARAddSurveyLessonModal.getExpandQuestions()
        ARAddSurveyLessonModal.getShortWait()

        //Verify default question group name and re-name group
        cy.get(ARAddSurveyLessonModal.getQuestionGroupName()).contains(lessonSurvey.questionGroupNameDefault).parents(ARAddSurveyLessonModal.getQuestionGroupContainer())
            .within(() => {
                cy.get(ARAddSurveyLessonModal.getQuestionGroupNameTxtF()).clear().type(lessonSurvey.questionGroupName)
            })

        //Add a second empty question group and rename it 
        cy.get(ARAddSurveyLessonModal.getAddQuestionGroupBtn()).click()
        ARAddSurveyLessonModal.getMediumWait()
        cy.get(ARAddSurveyLessonModal.getQuestionGroupName()).contains('Question Group 2').parents(ARAddSurveyLessonModal.getQuestionGroupContainer())
            .within(() => {
                cy.get(ARAddSurveyLessonModal.getQuestionGroupNameTxtF()).clear().type(lessonSurvey.questionGroupName2)
            })

        //Save the survey lesson
        cy.get(ARAddTaskLessonModal.getSaveBtn()).click()
        ARAddSurveyLessonModal.getMediumWait()

        // Open Course Uploads
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBannerBtn('Course Uploads')).click()
        arDashboardPage.getShortWait()

        // Verify An Admin can add a Course Upload
        cy.get(ARCourseSettingsCourseUploadsModule.getAddCourseUploadDefinition()).click();

        // Verify An Admin can add Upload Instructions
        cy.get(ARCourseSettingsCourseUploadsModule.getEditUploadInstructions()).click()
        arDashboardPage.getShortWait()

        cy.get(ARCourseSettingsCourseUploadsModule.getUploadInstructions()).type(courseUploadSection.uploadInstructions)
        arDashboardPage.getVShortWait() //wait for Apply button to be enabled
        cy.get(ARAddObjectLessonModal.getandClickApplybutton()).click()
        arDashboardPage.getShortWait()

        // Open Attribute Settings
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Attributes')).click()
        arDashboardPage.getShortWait()
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Attributes')).click()

        // Enable Course Evaluation
        cy.get(ARCourseSettingsAttributesModule.getEnableCourseEvaluationToggle()).click()
        arDashboardPage.getShortWait()

        // enable Evaluation Required
        cy.get(ARCourseSettingsAttributesModule.getEnableEvaluationRequiredToggle()).click()

        // Verify Evaluation can be taken at anytime can be enabled
        cy.get(ARCourseSettingsAttributesModule.getEvaluationCanbeTakenatAnyTimeToggle()).click()
  
        // Verify default questions are all present and in correct order  2
        cy.get(ARCourseSettingsAttributesModule.getUseDefaultQuestionsBtn()).click()
        cy.get(ARCourseSettingsAttributesModule.getQuestionName()).each(($span, i) => {
            expect($span.text()).to.equal(courseEvalQuestions.defaultQuestions[i])
        })

          
        // Verify questions can be re-ordered - using key commands instead of drag and drop (WCAG)
        cy.get(ARCourseSettingsAttributesModule.getQuestionsContainer()).within(() => {
            //Move first question down one
            cy.get(AROCAddEditPage.getGripBtn()).eq(0).focus().type(' ').type('{downarrow}').type(' ')
            // Move last question up one
            cy.get(AROCAddEditPage.getGripBtn()).its('length').then((length) => {
                cy.get(AROCAddEditPage.getGripBtn()).eq(length - 1).focus().type(' ').type('{uparrow}').type(' ')
            })
        })

        //Publish OC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
        cy.get(ARDashboardPage.getToastSuccessMsg(), {timeout: 10000}).should('contain', 'Course successfully published')

        // Enroll User
        arEnrollUsersPage.getEnrollUserByCourseAndUsername([ocDetails.courseName], [userDetails.username]) 
    })

    it('Log in as the learner and launch this course', () =>{
        cy.viewport(1600, 900)
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
        
        //Combined view displays the sidebar and details pane 
        LECourseDetailsOCModule.getMediumWait()
        cy.get(LECourseLessonPlayerPage.getChooseViewBtn(), {timeout: 15000}).should('exist')
        LECourseLessonPlayerPage.getSelectViewMenuItemsByName('Combined')
        LECourseLessonPlayerPage.getVShortWait()
        cy.get(LECourseLessonPlayerPage.getViewCombinedBtn()).should('exist')
        cy.get(LECourseLessonPlayerPage.getSidebarMenuContainer()).should('exist')
        cy.get(LECourseLessonPlayerPage.getDetailsPanelContainer()).should('exist')

        LECourseLessonPlayerPage.getTabMenuItemsByName('Lesson Details')
        cy.get(LECourseLessonPlayerPage.getDetailsPanelContainer()).should('exist')
        cy.get(LECourseLessonPlayerPage.getChooseViewBtn()).should('exist')
        LECourseLessonPlayerPage.getVShortWait()

        cy.get(LECourseLessonPlayerPage.getCoursePlayerDetailsToggleBtn()).click()

        // Click on a lesson that is not the active lesson
        cy.get(LECourseLessonPlayerPage.getLessonSidebarLessonTitle()).eq(1).click()
        LECourseLessonPlayerPage.getVShortWait()

        // Verify active lesson styling when selected
        cy.get(LECourseLessonPlayerPage.getLessonSidebarLessonTitle()).eq(1)
            .should('have.attr', 'class').and('contain', 'selected')
        cy.get(LECourseLessonPlayerPage.getCourseLessonDetailsLessonTitle()).eq(1)
            .should('have.attr', 'class').and('contain', 'active_lesson')

        
        // scrolling down to the bottom, Verify Uploads/Evaluations should be
        cy.get(LECourseLessonPlayerPage.getDetailsPanelContainer()).find(LECourseLessonPlayerPage.getCourseTasks()).scrollIntoView().should('exist')
        LECourseLessonPlayerPage.verifyUploadsAndEvaluationsInBottom()

        // click on the Course Upload
        cy.get(LECourseLessonPlayerPage.getSidebarMenuContainer()).find(LECourseLessonPlayerPage.getCourseTasks()).scrollIntoView().should('exist')
        cy.get(LECourseLessonPlayerPage.getCoursePlayerTaskItemBtn()).contains('Course Upload 1').click({force:true})
        LECourseLessonPlayerPage.getMediumWait()

        // Verify active lesson styling when selected
        cy.get(LECourseLessonPlayerPage.getCoursePlayerTaskItemBtn()).contains('Course Upload 1')
            .should('have.attr', 'class').and('contain', 'selected')
       cy.get(LECourseLessonPlayerPage.getCourseTasksTitle()).contains('Course Upload 1')
            .should('have.attr', 'class').and('contain', 'active_item')

        // Click on the Course Evaluations
        cy.get(LECourseLessonPlayerPage.getCoursePlayerTaskItemBtn()).contains('Course Evaluation').click()
        LECourseLessonPlayerPage.getVShortWait()

        // Confirm Leave
        cy.get(LECourseLessonPlayerPage.confirmPopup()).click()
        LECourseLessonPlayerPage.getMediumWait()

        // Verify active lesson styling when selected
        cy.get(LECourseLessonPlayerPage.getCoursePlayerTaskItemBtn()).contains('Course Evaluation')
            .should('have.attr', 'class').and('contain', 'selected')
        cy.get(LECourseLessonPlayerPage.getCourseTasksTitle()).contains('Course Evaluation')
            .should('have.attr', 'class').and('contain', 'active_item')
        
        // Click on the first lesson
        cy.get(LECourseLessonPlayerPage.getLessonSidebarLessonTitle()).eq(0).click()
        LECourseLessonPlayerPage.getVShortWait()

        // Confirm Leave
        cy.get(LECourseLessonPlayerPage.confirmPopup()).click()
        LECourseLessonPlayerPage.getMediumWait()

        // Verify active lesson styling when selected
        cy.get(LECourseLessonPlayerPage.getLessonSidebarLessonTitle()).eq(0)
            .should('have.attr', 'class').and('contain', 'selected')
        cy.get(LECourseLessonPlayerPage.getCourseLessonDetailsLessonTitle()).eq(0)
            .should('have.attr', 'class').and('contain', 'active_lesson')

        // Click course player close button
        cy.get(LECourseLessonPlayerPage.getCloseBtn()).click()
        LECourseLessonPlayerPage.getMediumWait()
    })
})