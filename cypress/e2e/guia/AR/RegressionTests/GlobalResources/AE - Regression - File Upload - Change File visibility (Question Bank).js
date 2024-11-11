import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arQuestionBanksPage from '../../../../../../helpers/AR/pageObjects/QuestionBanks/ARQuestionBanksPage'
import arQuestionBanksAddEditPage from '../../../../../../helpers/AR/pageObjects/QuestionBanks/ARQuestionBanksAddEditPage'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { qbDetails } from '../../../../../../helpers/TestData/QuestionBank/questionBanksDetails'
import { users } from '../../../../../../helpers/TestData/users/users'
import A5GlobalResourceAddEditPage from '../../../../../../helpers/AR/pageObjects/GlobalResources/A5GlobalResourceAddEditPage'
import { resourcePaths, images } from '../../../../../../helpers/TestData/resources/resources'
import ARUploadFileModal from '../../../../../../helpers/AR/pageObjects/Modals/ARUploadFileModal'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import ARSelectLearningObjectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectLearningObjectModal'
import { ocDetails } from '../../../../../../helpers/TestData/Courses/oc'
import arOCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage'
import arCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import LEFilterMenu from '../../../../../../helpers/LE/pageObjects/Menu/LEFilterMenu'
import LEResourcesPage from '../../../../../../helpers/LE/pageObjects/Resources/LEResourcesPage'
import ARCourseSettingsEnrollmentRulesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
import AREnrollUsersPage from '../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage'
import { userDetails } from '../../../../../../helpers/TestData/users/UserDetails'
import ARDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import ARAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'


describe('C5167 - AR - File Upload - Change File visibility (Question Bank)', function () {

    beforeEach(function () {
        // Sign in with System Admin account
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        
    })

    before(()=>{
         //Create a new learner
         cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
    })


    it('Verify Admin Can Create a New Question Bank and Change File Visibility', () => {
        // Click the Courses menu item
        arDashboardPage.getQuestionBankReport()
        // Create Question 1
        cy.get(arQuestionBanksPage.getA5PageHeaderTitle()).should('have.text', "Question Banks")
        arQuestionBanksPage.getA5AddEditMenuActionsByNameThenClick('Question Bank')
        arQuestionBanksPage.A5WaitForElementStateToChange(arQuestionBanksAddEditPage.getA5NameTxtF())

        // Verify that the name field cannot be empty
        cy.get(arQuestionBanksAddEditPage.getA5SaveBtn()).click()
        cy.get(arQuestionBanksAddEditPage.getA5NameErrorMsg()).should('have.text', qbDetails.nameFieldErrorMsg)

        // Enter a name in the name text field
        cy.get(arQuestionBanksAddEditPage.getA5NameTxtF()).type(qbDetails.questionBanksName)
        cy.get(arQuestionBanksAddEditPage.getA5CreateQuestionBtn()).click()
        cy.get(arQuestionBanksAddEditPage.getA5OptionAnswerBtn()).click()

        // Verify that Question and answer fields cannot be empty
        cy.get(arQuestionBanksAddEditPage.getA5SaveBtn()).click()
        cy.get(arQuestionBanksAddEditPage.getA5QuestionOrAnswerErrorMsg(1)).should('have.text', qbDetails.questionFieldErrorMsg)
        cy.get(arQuestionBanksAddEditPage.getA5QuestionOrAnswerErrorMsg(2)).should('have.text', qbDetails.answerFieldErrorMsg)

        // Enter question and answer
        
        cy.get(arQuestionBanksAddEditPage.getA5EditQuestionBtnByIndex()).should('be.visible')
        cy.get(arQuestionBanksAddEditPage.getA5EditQuestionBtnByIndex()).click()
        cy.get(arQuestionBanksAddEditPage.getA5QuestionTxtA()).type(qbDetails.qb_question_1_text)
        cy.get(arQuestionBanksAddEditPage.getA5OptionAnswerTxtFByIndex(1)).type(qbDetails.qb_q1_answer_1)
        cy.get(arQuestionBanksAddEditPage.getA5OptionAnswerTxtFByIndex(2)).type(qbDetails.qb_q1_answer_2)

        //Open Upload File Pop up
        cy.get(A5GlobalResourceAddEditPage.getChooseFileBtn()).click()
        // Check if Upload File pop up is opened
        A5GlobalResourceAddEditPage.getUploadFilePopUpWindow()
        cy.get(ARUploadFileModal.getA5ChooseFileBtn()).click({ force: true })
        cy.get(ARUploadFileModal.getFilePathTxt()).attachFile(resourcePaths.resource_image_folder + images.moose_filename)
        //Check If Private radio button is selected
        A5GlobalResourceAddEditPage.getAvailabilityPrivateRadoioBtnSelected()
        //Change Visibiliy to Public
        A5GlobalResourceAddEditPage.getAvailabilityPublicBtn()
        cy.get(ARUploadFileModal.getA5SaveBtn()).click()

        //Save Question Bank
        cy.get(A5GlobalResourceAddEditPage.getA5SaveBtn()).should('be.visible')
        cy.get(A5GlobalResourceAddEditPage.getA5SaveBtn()).click()
        cy.get(arQuestionBanksPage.getA5PageHeaderTitle()).should('have.text', "Question Banks")
    })


    it('Verify Admin can edit Question Bank and Change File Visibility', () => {
        // Click the Courses menu item
        arDashboardPage.getQuestionBankReport()
        // Search and Edit Question Bank
        arQuestionBanksPage.A5AddFilter('Name', 'Starts With', qbDetails.questionBanksName)
        cy.get(arQuestionBanksPage.getA5WaitSpinner()).should('not.exist')
        arQuestionBanksAddEditPage.selectA5TableCellRecord(qbDetails.questionBanksName)
        arQuestionBanksPage.A5WaitForElementStateToChange(arQuestionBanksAddEditPage.getA5AddEditMenuActionsByIndex())
        arQuestionBanksPage.getA5AddEditMenuActionsByNameThenClick('Edit')
        arQuestionBanksPage.A5WaitForElementStateToChange(arQuestionBanksAddEditPage.getA5EditQuestionBtnByIndex())

        cy.get(arQuestionBanksAddEditPage.getA5EditQuestionBtnByIndex()).click()

        //Verify name persisted
        cy.get(arQuestionBanksAddEditPage.getA5NameTxtF()).should('have.value', qbDetails.questionBanksName)

        //Verify file upload persisted
        cy.get(A5GlobalResourceAddEditPage.getPlaceHolderTextF()).invoke('val').then((val) => {
            expect(val).to.contain(images.moose_filename.slice(0, -4))
        })
        //Open Uploaded File Pop up
        cy.get(A5GlobalResourceAddEditPage.getChooseFileBtn()).click()
        // Check if Upload File pop up is opened
        A5GlobalResourceAddEditPage.getUploadFilePopUpWindow()
        cy.get(ARUploadFileModal.getA5ChooseFileBtn()).click({ force: true })
        cy.get(ARUploadFileModal.getFilePathTxt()).attachFile(resourcePaths.resource_image_folder + images.moose_filename)
        //Verify file upload persisted in Upload File pop up
        cy.get(A5GlobalResourceAddEditPage.getPlaceHolderTextF()).invoke('val').then((val) => {
            expect(val).to.contain(images.moose_filename.slice(0, -4))
        })
        //Verify if Previously selected Permission level Persist
        A5GlobalResourceAddEditPage.getAvailabilityPublicBtn()
        A5GlobalResourceAddEditPage.getAvailabilityPublicRadoioBtnSelected()
        cy.get(A5GlobalResourceAddEditPage.getFileUpdateInformationText()).should('exist')

        //Update File

        cy.get(ARUploadFileModal.getA5ChooseFileBtn()).click({ force: true })
        cy.get(ARUploadFileModal.getFilePathTxt()).attachFile(resourcePaths.resource_image_folder + images.happy_qas_filename)

        //Change Visibiliy to Private
        A5GlobalResourceAddEditPage.getAvailabilityPrivateBtn()

        //Change Visibiliy to Public
        A5GlobalResourceAddEditPage.getAvailabilityPublicBtn()
        cy.get(ARUploadFileModal.getA5SaveBtn()).click()
        cy.get(A5GlobalResourceAddEditPage.getA5SaveBtn()).should('be.visible')

        //Save Question Bank
        cy.get(A5GlobalResourceAddEditPage.getA5SaveBtn()).click()
        cy.get(arQuestionBanksPage.getA5PageHeaderTitle()).should('have.text', "Question Banks")
    })

    // Add Created Question Bank in Online Course
    it('Add Created Question Bank in Online Course', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getCoursesReport()
        cy.createCourse('Online Course')

        //Enable terms & conditions and add message
        cy.get(arOCAddEditPage.getSyllabusShowTermsAndConditionToggle() + arOCAddEditPage.getToggleDisabled()).click()
        cy.get(arCoursesPage.getTermsAndConditionsTxtF()).type(commonDetails.termsAndConditions)

        //Add learning object
        cy.get(arOCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
        ARSelectLearningObjectModal.addSimpleAssesment()
        
        //Move to Enrollment rules
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()

        //Select All Learners in 'Allow Self enrollment'
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')

        //Publish OC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })

        AREnrollUsersPage.getEnrollUserByCourseAndUsername([ocDetails.courseName], [userDetails.username])
    })

    it('Verify User can see Created Data at Learner Side', () => {
        // Login LE
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        LEDashboardPage.getTileByNameThenClick('My Courses')
        LEFilterMenu.SearchForCourseByName(ocDetails.courseName)
        cy.get(LEResourcesPage.getCourseCardName()).should('contain', ocDetails.courseName).should('be.visible')
    })

    after( ()=>{        
        //Delete course
        cy.deleteCourse(commonDetails.courseID)

        // Delete User
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.deleteUsers([userDetails.username])
        ARDashboardPage.getQuestionBankReport()

        // Search and Delete Question Bank
        arQuestionBanksPage.A5AddFilter('Name', 'Starts With', qbDetails.questionBanksName)
        cy.get(arQuestionBanksPage.getA5WaitSpinner()).should('not.exist')
        arQuestionBanksPage.selectA5TableCellRecord(qbDetails.questionBanksName)
        arQuestionBanksPage.A5WaitForElementStateToChange(arQuestionBanksPage.getA5AddEditMenuActionsByIndex(3))
        arQuestionBanksPage.getA5AddEditMenuActionsByNameThenClick('Delete')
        cy.get(ARDeleteModal.getA5OKBtn()).click()
        // Verify Question Bank is deleted
        cy.get(arQuestionBanksPage.getA5NoResultMsg()).should('have.text', "Sorry, no results found.");
    })

})

