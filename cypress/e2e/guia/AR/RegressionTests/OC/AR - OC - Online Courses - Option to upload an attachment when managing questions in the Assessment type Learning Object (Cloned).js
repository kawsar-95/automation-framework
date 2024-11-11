
import ARCoursesPage from "../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage"
import AROCAddEditPage, { errorMessage } from "../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage"
import ARAddMoreCourseSettingsModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module"
import ARCourseSettingsAvailabilityModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsAvailability.module"
import ARCourseSettingsEnrollmentRulesModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARAddObjectLessonModal from "../../../../../../helpers/AR/pageObjects/Modals/ARAddObjectLessonModal"
import ARFileManagerUploadsModal from "../../../../../../helpers/AR/pageObjects/Modals/ARFileManagerUploadsModal"
import ARSelectLearningObjectModal from "../../../../../../helpers/AR/pageObjects/Modals/ARSelectLearningObjectModal"
import ARUploadFileModal from "../../../../../../helpers/AR/pageObjects/Modals/ARUploadFileModal"
import ARQuestionBanksAddEditPage from "../../../../../../helpers/AR/pageObjects/QuestionBanks/ARQuestionBanksAddEditPage"
import AREnrollUsersPage from "../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage"
import ARUserTranscriptPage from "../../../../../../helpers/AR/pageObjects/User/ARUserTranscriptPage"
import LECourseDetailsOCModule from "../../../../../../helpers/LE/pageObjects/Courses/LECourseDetailsOCModule"
import LECourseLessonPlayerPage from "../../../../../../helpers/LE/pageObjects/Courses/LECourseLessonPlayerPage"
import LEDashboardPage from "../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage"
import LESideMenu from "../../../../../../helpers/LE/pageObjects/Menu/LESideMenu"
import LEProfilePage from "../../../../../../helpers/LE/pageObjects/User/LEProfilePage"
import { commonDetails } from "../../../../../../helpers/TestData/Courses/commonDetails"
import { lessonAssessment, ocDetails } from "../../../../../../helpers/TestData/Courses/oc"
import { miscData } from "../../../../../../helpers/TestData/Misc/misc"
import { helperTextMessages } from "../../../../../../helpers/TestData/NewsArticle/NewsArticleDetails"
import { questionDetails } from "../../../../../../helpers/TestData/QuestionBank/questionBanksDetails"
import { images, resourcePaths } from "../../../../../../helpers/TestData/resources/resources"
import { userDetails } from "../../../../../../helpers/TestData/users/UserDetails"
import { users } from "../../../../../../helpers/TestData/users/users"


describe('C905 - AUT-117 Online Courses - Option to upload an attachment when managing questions in the Assessment type Learning Object (cloned)', () => {
    it("Adding File type in the Question and save the course", () => {


        //Login as an administrator
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        // Go to Course Report Page 
        ARDashboardPage.getCoursesReport()
        //Create an online course
        cy.createCourse('Online Course', ocDetails.courseName)

        // Set enrollment rule - Allow self enrollment for all learners
        cy.get(ARCourseSettingsEnrollmentRulesModule.getRadioBtnContainer()).contains('All Learners').click()

        // Clicking on the Syllabus Button 
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn("Syllabus")).click()
        //Add Learning Object button
        cy.get(AROCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
        //Add learning object Assessment        
        ARSelectLearningObjectModal.getObjectTypeByName('Assessment')
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()

        ARAddObjectLessonModal.getTxtFByName('Assessment Name', lessonAssessment.ocAssessmentName)
        // turning off assessment weight
        cy.get(ARAddObjectLessonModal.getWeightedToggleBtn()).click()
        //Asserting that its turned off
        cy.get(ARAddObjectLessonModal.getWeightedToggleBtn()).find('input').should('have.attr', 'aria-checked', 'false')

        //Add Question for assessment
        cy.get(ARAddObjectLessonModal.getExpandQuestionsbutton()).click()
        //Click on manage Question
        cy.get(ARAddObjectLessonModal.getManageQuestions()).click()
        //Clicking on Add Question
        cy.get(ARQuestionBanksAddEditPage.getAddQuestionButton()).click()
        cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')

        // Enter Valid Name
        cy.get(ARAddObjectLessonModal.getQuestionNameTextBox()).clear()
        cy.get(ARAddObjectLessonModal.getQuestionNameTextBox()).type(questionDetails.questionName)

        // Ensure ability to add Text type question
        cy.get(ARAddObjectLessonModal.getQuestionTypeDDown()).click()
        cy.get(ARAddObjectLessonModal.getQuestionTypeDDownOpt()).contains('Multiple Choice (Single Answer)').click()
        cy.get(ARAddObjectLessonModal.getQuestionTypeSelectedLabel()).should('contain', 'Multiple Choice (Single Answer)')

        // Enter Valid Option
        cy.get(ARAddObjectLessonModal.getQuestionOptionByIndex()).clear().type(questionDetails.option0)
        //Add Option 
        ARDashboardPage.generalToggleSwitch('true', ARAddObjectLessonModal.getOptionAnswersToggleContainerByIndex("0"))


        //Asserting Input type File
        ARQuestionBanksAddEditPage.getRadioButtonForAttachment("File").parent().parent().find('input').should('have.attr', 'aria-checked', 'true')


        //Clickin on Choose File button
        cy.get(ARDashboardPage.getChooseFileBtn()).contains('Choose File').click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
        //Clicking on the upload button
        cy.get(ARFileManagerUploadsModal.getUploadButton()).click()

        // Change the Visibility to Private from Public.
        cy.get(ARUploadFileModal.getPublicPrivateRadioBtn()).contains('Public').click()

        // Check Helper text when Public radio button is selecetd
        cy.get(ARUploadFileModal.getPublicPrivateHelperText()).should('have.text', helperTextMessages.textWhenPublicSelecetd)

        // Change the Visibility to Private from Public.
        cy.get(ARUploadFileModal.getPublicPrivateRadioBtn()).contains('Private').click()


        // Check Helper text when private radio button is selecetd
        cy.get(ARUploadFileModal.getPublicPrivateHelperText()).should('have.text', helperTextMessages.textWhenPrivateSelecetd)
        //Uploading a file 
        cy.get(ARUploadFileModal.getOcLoFileUploadDiv()).find(ARDashboardPage.getFileInput()).attachFile(resourcePaths.resource_image_folder + images.moose_filename)
        //Clickin on Save button
        cy.get(ARUploadFileModal.getSaveBtn()).click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 150000 }).should('not.exist')

        //Clicking save on the Add Question modal 
        cy.get(ARDashboardPage.getChooseFileBtn()).contains('Choose File').parent().parent().find('input')
            .should('have.attr', 'value', 'moose.jpg')

        //Saving Question    
        cy.get(ARAddObjectLessonModal.getQuestionSavebutton()).filter(':contains("Save")').should('have.attr', 'aria-disabled', 'false').click()
        cy.get(ARAddObjectLessonModal.getQuestionSavebutton()).filter(':contains("Save")').should('not.exist')
        cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')

        cy.get(ARAddObjectLessonModal.getandClickApplybutton()).eq(1).click({ force: true })
        cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')

        cy.get(ARAddObjectLessonModal.getandClickApplybutton()).should('have.attr', 'aria-disabled', 'false').click({ force: true })
        cy.get(ARAddObjectLessonModal.getandClickApplybutton()).should('not.exist')
        cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')

        // Publish OC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
        cy.get(ARDashboardPage.getToastSuccessMsg(), { timeout: 10000 }).should('contain', 'Course successfully published')

    })

    it("Adding Url type in the Question and save the course", () => {
        //Login as an administrator
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        // Go to Course Report Page 
        ARDashboardPage.getCoursesReport()
        //Create an online course
        cy.createCourse('Online Course', ocDetails.courseName2)

        // Set enrollment rule - Allow self enrollment for all learners
        cy.get(ARCourseSettingsEnrollmentRulesModule.getRadioBtnContainer()).contains('All Learners').click()

        // Clicking on the Syllabus Button 
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn("Syllabus")).click()
        //Add Learning Object button
        cy.get(AROCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
        //Add learning object Assessment        
        ARSelectLearningObjectModal.getObjectTypeByName('Assessment')
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()

        ARAddObjectLessonModal.getTxtFByName('Assessment Name', lessonAssessment.ocAssessmentName)
        // turning off assessment weight
        cy.get(ARAddObjectLessonModal.getWeightedToggleBtn()).click()
        //Asserting that its turned off
        cy.get(ARAddObjectLessonModal.getWeightedToggleBtn()).find('input').should('have.attr', 'aria-checked', 'false')

        //Add Question for assessment
        cy.get(ARAddObjectLessonModal.getExpandQuestionsbutton()).click()
        //Click on manage Question
        cy.get(ARAddObjectLessonModal.getManageQuestions()).click()
        //Clicking on Add Question
        cy.get(ARQuestionBanksAddEditPage.getAddQuestionButton()).click()
        cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')

        // Enter Valid Name
        cy.get(ARAddObjectLessonModal.getQuestionNameTextBox()).clear()
        cy.get(ARAddObjectLessonModal.getQuestionNameTextBox()).type(questionDetails.questionName)

        // Ensure ability to add Text type question
        cy.get(ARAddObjectLessonModal.getQuestionTypeDDown()).click()
        cy.get(ARAddObjectLessonModal.getQuestionTypeDDownOpt()).contains('Multiple Choice (Single Answer)').click()
        cy.get(ARAddObjectLessonModal.getQuestionTypeSelectedLabel()).should('contain', 'Multiple Choice (Single Answer)')

        // Enter Valid Option
        cy.get(ARAddObjectLessonModal.getQuestionOptionByIndex()).clear().type(questionDetails.option0)
        //Add Option 
        ARDashboardPage.generalToggleSwitch('true', ARAddObjectLessonModal.getOptionAnswersToggleContainerByIndex("0"))

        ARQuestionBanksAddEditPage.getRadioButtonForAttachment("Url").click()

        //Asserting Input type File
        cy.get(ARQuestionBanksAddEditPage.getURLRadioButton()).should('have.attr', 'aria-checked', 'true')

        cy.get(ARQuestionBanksAddEditPage.getURLTextInput()).type(miscData.switching_to_absorb_img_url)

        //Saving Question    
        cy.get(ARAddObjectLessonModal.getQuestionSavebutton()).filter(':contains("Save")').should('have.attr', 'aria-disabled', 'false').click()
        cy.get(ARAddObjectLessonModal.getQuestionSavebutton()).filter(':contains("Save")').should('not.exist')
        cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')

        cy.get(ARAddObjectLessonModal.getandClickApplybutton()).eq(1).click({ force: true })
        cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')

        cy.get(ARAddObjectLessonModal.getandClickApplybutton()).should('have.attr', 'aria-disabled', 'false').click({ force: true })
        cy.get(ARAddObjectLessonModal.getandClickApplybutton()).should('not.exist')
        cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')

        // Publish OC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36));
        })
        cy.get(ARDashboardPage.getToastSuccessMsg(), { timeout: 10000 }).should('contain', 'Course successfully published')

    })

    it("Adding Url type in the Multiple type Question and save the course", () => {
        //Login as an administrator
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        // Go to Course Report Page 
        ARDashboardPage.getCoursesReport()
        //Create an online course
        cy.createCourse('Online Course', ocDetails.courseName3)

        // Set enrollment rule - Allow self enrollment for all learners
        cy.get(ARCourseSettingsEnrollmentRulesModule.getRadioBtnContainer()).contains('All Learners').click()

        // Clicking on the Syllabus Button 
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn("Syllabus")).click()
        //Add Learning Object button
        cy.get(AROCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
        //Add learning object Assessment        
        ARSelectLearningObjectModal.getObjectTypeByName('Assessment')
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()

        ARAddObjectLessonModal.getTxtFByName('Assessment Name', lessonAssessment.ocAssessmentName)
        // turning off assessment weight
        cy.get(ARAddObjectLessonModal.getWeightedToggleBtn()).click()
        //Asserting that its turned off
        cy.get(ARAddObjectLessonModal.getWeightedToggleBtn()).find('input').should('have.attr', 'aria-checked', 'false')

        //Add Question for assessment
        cy.get(ARAddObjectLessonModal.getExpandQuestionsbutton()).click()
        //Click on manage Question
        cy.get(ARAddObjectLessonModal.getManageQuestions()).click()
        //Clicking on Add Question
        cy.get(ARQuestionBanksAddEditPage.getAddQuestionButton()).click()
        cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')

        // Enter Valid Name
        cy.get(ARAddObjectLessonModal.getQuestionNameTextBox()).clear()
        cy.get(ARAddObjectLessonModal.getQuestionNameTextBox()).type(questionDetails.questionName)

        // Ensure ability to add Text type question
        cy.get(ARAddObjectLessonModal.getQuestionTypeDDown()).click()
        cy.get(ARAddObjectLessonModal.getQuestionTypeDDownOpt()).contains('Multiple Choice (Multiple Answer)').click()
        cy.get(ARAddObjectLessonModal.getQuestionTypeSelectedLabel()).should('contain', 'Multiple Choice (Multiple Answer)')

        // Enter Valid Option
        cy.get(ARAddObjectLessonModal.getQuestionOptionByIndex()).clear().type(questionDetails.option0)
        //Add Option 
        ARDashboardPage.generalToggleSwitch('true', ARAddObjectLessonModal.getOptionAnswersToggleContainerByIndex("0"))

        ARQuestionBanksAddEditPage.getRadioButtonForAttachment("Url").click()

        //Asserting Input type File
        cy.get(ARQuestionBanksAddEditPage.getURLRadioButton()).should('have.attr', 'aria-checked', 'true')

        cy.get(ARQuestionBanksAddEditPage.getURLTextInput()).type(miscData.switching_to_absorb_img_url)

        //Saving Question    
        cy.get(ARAddObjectLessonModal.getQuestionSavebutton()).filter(':contains("Save")').should('have.attr', 'aria-disabled', 'false').click()
        cy.get(ARAddObjectLessonModal.getQuestionSavebutton()).filter(':contains("Save")').should('not.exist')
        cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')

        cy.get(ARAddObjectLessonModal.getandClickApplybutton()).eq(1).click({ force: true })
        cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')

        cy.get(ARAddObjectLessonModal.getandClickApplybutton()).should('have.attr', 'aria-disabled', 'false').click({ force: true })
        cy.get(ARAddObjectLessonModal.getandClickApplybutton()).should('not.exist')
        cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')

        // Publish OC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36));
        })
        cy.get(ARDashboardPage.getToastSuccessMsg(), { timeout: 10000 }).should('contain', 'Course successfully published')

    })

    it("Adding File type in the Question Multiple Choice (Multiple Answer) and save the course", () => {
        //Create a new User 
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
        //Login as an administrator
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        // Go to Course Report Page 
        ARDashboardPage.getCoursesReport()
        //Create an online course
        cy.createCourse('Online Course', ocDetails.courseName4)

        // Set enrollment rule - Allow self enrollment for all learners
        cy.get(ARCourseSettingsEnrollmentRulesModule.getRadioBtnContainer()).contains('All Learners').click()

        // Clicking on the Syllabus Button 
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn("Syllabus")).click()
        //Add Learning Object button
        cy.get(AROCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
        //Add learning object Assessment        
        ARSelectLearningObjectModal.getObjectTypeByName('Assessment')
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()

        ARAddObjectLessonModal.getTxtFByName('Assessment Name', lessonAssessment.ocAssessmentName)
        // turning off assessment weight
        cy.get(ARAddObjectLessonModal.getWeightedToggleBtn()).click()
        //Asserting that its turned off
        cy.get(ARAddObjectLessonModal.getWeightedToggleBtn()).find('input').should('have.attr', 'aria-checked', 'false')

        //Add Question for assessment
        cy.get(ARAddObjectLessonModal.getExpandQuestionsbutton()).click()
        //Click on manage Question
        cy.get(ARAddObjectLessonModal.getManageQuestions()).click()
        //Clicking on Add Question
        cy.get(ARQuestionBanksAddEditPage.getAddQuestionButton()).click()
        cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')

        // Enter Valid Name
        cy.get(ARAddObjectLessonModal.getQuestionNameTextBox()).clear()
        cy.get(ARAddObjectLessonModal.getQuestionNameTextBox()).type(questionDetails.questionName)

        // Ensure ability to add Text type question
        cy.get(ARAddObjectLessonModal.getQuestionTypeDDown()).click()
        cy.get(ARAddObjectLessonModal.getQuestionTypeDDownOpt()).contains('Multiple Choice (Multiple Answer)').click()
        cy.get(ARAddObjectLessonModal.getQuestionTypeSelectedLabel()).should('contain', 'Multiple Choice (Multiple Answer)')

        // Enter Valid Option
        cy.get(ARAddObjectLessonModal.getQuestionOptionByIndex()).clear().type(questionDetails.option0)
        //Add Option 
        ARDashboardPage.generalToggleSwitch('true', ARAddObjectLessonModal.getOptionAnswersToggleContainerByIndex("0"))


        //Asserting Input type File
        ARQuestionBanksAddEditPage.getRadioButtonForAttachment("File").parent().parent().find('input').should('have.attr', 'aria-checked', 'true')


        //Clickin on Choose File button
        cy.get(ARDashboardPage.getChooseFileBtn()).contains('Choose File').click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
        //Clicking on the upload button
        cy.get(ARFileManagerUploadsModal.getUploadButton()).click()

        // Change the Visibility to Private from Public.
        cy.get(ARUploadFileModal.getPublicPrivateRadioBtn()).contains('Public').click()

        // Check Helper text when Public radio button is selecetd
        cy.get(ARUploadFileModal.getPublicPrivateHelperText()).should('have.text', helperTextMessages.textWhenPublicSelecetd)

        // Change the Visibility to Private from Public.
        cy.get(ARUploadFileModal.getPublicPrivateRadioBtn()).contains('Private').click()


        // Check Helper text when private radio button is selecetd
        cy.get(ARUploadFileModal.getPublicPrivateHelperText()).should('have.text', helperTextMessages.textWhenPrivateSelecetd)
        //Uploading a file 
        cy.get(ARUploadFileModal.getOcLoFileUploadDiv()).find(ARDashboardPage.getFileInput()).attachFile(resourcePaths.resource_image_folder + images.moose_filename)
        //Clickin on Save button
        cy.get(ARUploadFileModal.getSaveBtn()).click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 150000 }).should('not.exist')

        //Clicking save on the Add Question modal 
        cy.get(ARDashboardPage.getChooseFileBtn()).contains('Choose File').parent().parent().find('input')
            .should('have.attr', 'value', 'moose.jpg')

        //Saving Question    
        cy.get(ARAddObjectLessonModal.getQuestionSavebutton()).filter(':contains("Save")').should('have.attr', 'aria-disabled', 'false').click()
        cy.get(ARAddObjectLessonModal.getQuestionSavebutton()).filter(':contains("Save")').should('not.exist')
        cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')

        //Adding Single Answer Question

        //Clicking on Add Question
        cy.get(ARQuestionBanksAddEditPage.getAddQuestionButton()).click()
        cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')

        // Enter Valid Name
        cy.get(ARAddObjectLessonModal.getQuestionNameTextBox()).clear()
        cy.get(ARAddObjectLessonModal.getQuestionNameTextBox()).type(questionDetails.questionName2)

        // Ensure ability to add Text type question
        cy.get(ARAddObjectLessonModal.getQuestionTypeDDown()).click()
        cy.get(ARAddObjectLessonModal.getQuestionTypeDDownOpt()).contains('Multiple Choice (Single Answer)').click()
        cy.get(ARAddObjectLessonModal.getQuestionTypeSelectedLabel()).should('contain', 'Multiple Choice (Single Answer)')

        // Enter Valid Option
        cy.get(ARAddObjectLessonModal.getQuestionOptionByIndex()).clear().type(questionDetails.option0)
        //Add Option 
        ARDashboardPage.generalToggleSwitch('true', ARAddObjectLessonModal.getOptionAnswersToggleContainerByIndex("0"))


        //Asserting Input type File
        ARQuestionBanksAddEditPage.getRadioButtonForAttachment("File").parent().parent().find('input').should('have.attr', 'aria-checked', 'true')


        //Clickin on Choose File button
        cy.get(ARDashboardPage.getChooseFileBtn()).contains('Choose File').click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
        //Clicking on the upload button
        cy.get(ARFileManagerUploadsModal.getUploadButton()).click()

        // Change the Visibility to Private from Public.
        cy.get(ARUploadFileModal.getPublicPrivateRadioBtn()).contains('Public').click()

        // Check Helper text when Public radio button is selecetd
        cy.get(ARUploadFileModal.getPublicPrivateHelperText()).should('have.text', helperTextMessages.textWhenPublicSelecetd)

        // Change the Visibility to Private from Public.
        cy.get(ARUploadFileModal.getPublicPrivateRadioBtn()).contains('Private').click()


        // Check Helper text when private radio button is selecetd
        cy.get(ARUploadFileModal.getPublicPrivateHelperText()).should('have.text', helperTextMessages.textWhenPrivateSelecetd)
        //Uploading a file 
        cy.get(ARUploadFileModal.getOcLoFileUploadDiv()).find(ARDashboardPage.getFileInput()).attachFile(resourcePaths.resource_image_folder + images.happy_qas_filename)
        //Clickin on Save button
        cy.get(ARUploadFileModal.getSaveBtn()).click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 150000 }).should('not.exist')

        //Clicking save on the Add Question modal 
        cy.get(ARDashboardPage.getChooseFileBtn()).contains('Choose File').parent().parent().find('input')
            .should('have.attr', 'value', images.happy_qas_filename)

        //Saving Question    
        cy.get(ARAddObjectLessonModal.getQuestionSavebutton()).filter(':contains("Save")').should('have.attr', 'aria-disabled', 'false').click()
        cy.get(ARAddObjectLessonModal.getQuestionSavebutton()).filter(':contains("Save")').should('not.exist')
        cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')

        //Adding Text Question

        //Clicking on Add Question
        cy.get(ARQuestionBanksAddEditPage.getAddQuestionButton()).click()
        cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')

        // Enter Valid Name
        cy.get(ARAddObjectLessonModal.getQuestionNameTextBox()).clear()
        cy.get(ARAddObjectLessonModal.getQuestionNameTextBox()).type(questionDetails.questionName2)

        // Ensure ability to add Text type question
        cy.get(ARAddObjectLessonModal.getQuestionTypeDDown()).click()
        cy.get(ARAddObjectLessonModal.getQuestionTypeDDownOpt()).contains('Text').click()
        cy.get(ARAddObjectLessonModal.getQuestionTypeSelectedLabel()).should('contain', 'Text')

        // Enter Valid Option
        cy.get(ARAddObjectLessonModal.getQuestionOptionByIndex()).clear().type(questionDetails.option0)



        //Asserting Input type File
        ARQuestionBanksAddEditPage.getRadioButtonForAttachment("File").parent().parent().find('input').should('have.attr', 'aria-checked', 'true')


        //Clickin on Choose File button
        cy.get(ARDashboardPage.getChooseFileBtn()).contains('Choose File').click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
        //Clicking on the upload button
        cy.get(ARFileManagerUploadsModal.getUploadButton()).click()

        // Change the Visibility to Private from Public.
        cy.get(ARUploadFileModal.getPublicPrivateRadioBtn()).contains('Public').click()

        // Check Helper text when Public radio button is selecetd
        cy.get(ARUploadFileModal.getPublicPrivateHelperText()).should('have.text', helperTextMessages.textWhenPublicSelecetd)

        // Change the Visibility to Private from Public.
        cy.get(ARUploadFileModal.getPublicPrivateRadioBtn()).contains('Private').click()


        // Check Helper text when private radio button is selecetd
        cy.get(ARUploadFileModal.getPublicPrivateHelperText()).should('have.text', helperTextMessages.textWhenPrivateSelecetd)
        //Uploading a file 
        cy.get(ARUploadFileModal.getOcLoFileUploadDiv()).find(ARDashboardPage.getFileInput()).attachFile(resourcePaths.resource_image_folder + images.happy_qas_filename)
        //Clickin on Save button
        cy.get(ARUploadFileModal.getSaveBtn()).click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 150000 }).should('not.exist')

        //Clicking save on the Add Question modal 
        // cy.get(ARDashboardPage.getChooseFileBtn()).contains('Choose File').parent().parent().find('input')
        //     .should('have.attr', 'value', images.happy_qas_filename)

        //Saving Question    
        cy.get(ARAddObjectLessonModal.getQuestionSavebutton()).filter(':contains("Save")').should('have.attr', 'aria-disabled', 'false').click()
        cy.get(ARAddObjectLessonModal.getQuestionSavebutton()).filter(':contains("Save")').should('not.exist')
        cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')

        cy.get(ARAddObjectLessonModal.getandClickApplybutton()).eq(1).click({ force: true })
        cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')

        cy.get(ARAddObjectLessonModal.getandClickApplybutton()).should('have.attr', 'aria-disabled', 'false').click({ force: true })
        cy.get(ARAddObjectLessonModal.getandClickApplybutton()).should('not.exist')
        cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')




        // Publish OC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36));
        })
        cy.get(ARDashboardPage.getToastSuccessMsg(), { timeout: 10000 }).should('contain', 'Course successfully published')

        //Enroll User
        AREnrollUsersPage.getEnrollUserByCourseAndUsername([ocDetails.courseName4], [userDetails.username])

    })

    it("Enroll User to the courses and launch in the learner side ", () => {
        //Login as a learner
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('My Courses')
        cy.get(LEDashboardPage.getLEEllipsesLoader(), { timeout: 15000 }).should('not.exist', { timeout: 15000 })
        cy.get(LEDashboardPage.getCourseCardName()).contains(ocDetails.courseName4).click()
        //Start 1st Video Lesson
        cy.get(LECourseLessonPlayerPage.getLEWaitSpinner(), { timeout: 10000 }).should('not.exist', { timeout: 10000 })
        
        LECourseDetailsOCModule.getCourseDiscoveryAction(ocDetails.courseName4, 'Start', true)
        cy.get(LEDashboardPage.getLEEllipsesLoader(), { timeout: 15000 }).should('not.exist')


    })



    after('Delete Created Course', function () {
        //Deleting Firsr Course 
        cy.deleteCourse(commonDetails.courseID)
        //Deleting Second Course 
        commonDetails.courseIDs.forEach((val) => {
            ARDashboardPage.getShortWait()
            cy.deleteCourse(val)
        })

        //Cleanup - delete learner
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        cy.get(LEDashboardPage.getNavProfile()).click()
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
        cy.url().then((currentURL) => {
            cy.deleteUser(currentURL.slice(-36));
        })

    })
})