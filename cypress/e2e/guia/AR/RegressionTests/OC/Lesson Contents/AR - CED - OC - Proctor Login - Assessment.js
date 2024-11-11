import ARDashboardPage from '../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARQuestionBanksPage from '../../../../../../../helpers/AR/pageObjects/QuestionBanks/ARQuestionBanksPage'
import ARQuestionBanksAddEditPage from '../../../../../../../helpers/AR/pageObjects/QuestionBanks/ARQuestionBanksAddEditPage'
import A5GlobalResourceAddEditPage from '../../../../../../../helpers/AR/pageObjects/GlobalResources/A5GlobalResourceAddEditPage'
import AREnrollUsersPage from '../../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage'
import LEDashboardPage from '../../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LEFilterMenu from '../../../../../../../helpers/LE/pageObjects/Menu/LEFilterMenu'
import LESideMenu from '../../../../../../../helpers/LE/pageObjects/Menu/LESideMenu'
import LEResourcesPage from '../../../../../../../helpers/LE/pageObjects/Resources/LEResourcesPage'
import LEProfilePage from '../../../../../../../helpers/LE/pageObjects/User/LEProfilePage'
import ARAddObjectLessonModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARAddObjectLessonModal'
import ARDeleteModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import ARSelectLearningObjectModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARSelectLearningObjectModal'
import ARUploadInstructionsModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARUploadInstructionsModal'
import AROCAddEditPage from '../../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage'
import ARCourseSettingsEnrollmentRulesModule from '../../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
import { userDetails } from '../../../../../../../helpers/TestData/users/UserDetails'
import { commonDetails } from '../../../../../../../helpers/TestData/Courses/commonDetails'
import { qbDetails } from '../../../../../../../helpers/TestData/QuestionBank/questionBanksDetails'
import { users } from '../../../../../../../helpers/TestData/users/users'
import { lessonAssessment } from '../../../../../../../helpers/TestData/Courses/oc'
import { ocDetails } from '../../../../../../../helpers/TestData/Courses/oc'


describe('C903 - AR - CED - OC - Proctor Login - Assessmennt', function () {


    before(() => {
        //Create a new learner
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
    })


    it('Verify Admin Can Create a New Question Bank ', () => {
        // Sign in with System Admin account
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')

        // Click the Courses menu item
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        ARDashboardPage.getMenuItemOptionByName('Question Banks')

        // Create Question 1
        cy.get(ARQuestionBanksPage.getA5PageHeaderTitle()).should('have.text', "Question Banks")
        ARQuestionBanksPage.getA5AddEditMenuActionsByNameThenClick('Question Bank')
        ARQuestionBanksPage.A5WaitForElementStateToChange(ARQuestionBanksAddEditPage.getA5NameTxtF())

        // Verify that the name field cannot be empty
        cy.get(ARQuestionBanksAddEditPage.getA5SaveBtn()).click()
        cy.get(ARQuestionBanksAddEditPage.getA5NameErrorMsg()).should('have.text', qbDetails.nameFieldErrorMsg)

        // Enter a name in the name text field
        cy.get(ARQuestionBanksAddEditPage.getA5NameTxtF()).type(qbDetails.questionBanksName)
        cy.get(ARQuestionBanksAddEditPage.getA5CreateQuestionBtn()).click()
        cy.get(ARQuestionBanksAddEditPage.getA5OptionAnswerBtn()).click()

        // Verify that Question and answer fields cannot be empty
        cy.get(ARQuestionBanksAddEditPage.getA5SaveBtn()).click()
        cy.get(ARQuestionBanksAddEditPage.getA5QuestionOrAnswerErrorMsg(1)).should('have.text', qbDetails.questionFieldErrorMsg)
        cy.get(ARQuestionBanksAddEditPage.getA5QuestionOrAnswerErrorMsg(2)).should('have.text', qbDetails.answerFieldErrorMsg)

        // Enter question and answer
        ARQuestionBanksAddEditPage.getVShortWait()
        cy.get(ARQuestionBanksAddEditPage.getA5EditQuestionBtnByIndex()).click()
        cy.get(ARQuestionBanksAddEditPage.getA5QuestionTxtA()).type(qbDetails.qb_question_1_text)
        cy.get(ARQuestionBanksAddEditPage.getA5OptionAnswerTxtFByIndex(1)).type(qbDetails.qb_q1_answer_1)
        cy.get(ARQuestionBanksAddEditPage.getA5OptionAnswerTxtFByIndex(2)).type(qbDetails.qb_q1_answer_2)

        //Save Question Bank
        cy.get(A5GlobalResourceAddEditPage.getA5SaveBtn()).click()
        ARDashboardPage.getShortWait()
    })

    it('Verify Question Bank Exists', () => {
        // Sign in with System Admin account
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        // Click the Courses menu item
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        ARDashboardPage.getMenuItemOptionByName('Question Banks')

        // Search and Edit Question Bank
        ARQuestionBanksPage.A5AddFilter('Name', 'Starts With', qbDetails.questionBanksName)
        ARQuestionBanksPage.getMediumWait()
        ARQuestionBanksAddEditPage.selectA5TableCellRecord(qbDetails.questionBanksName)
        ARQuestionBanksPage.A5WaitForElementStateToChange(ARQuestionBanksAddEditPage.getA5AddEditMenuActionsByIndex())
        ARDashboardPage.getMediumWait()
        ARQuestionBanksPage.getA5AddEditMenuActionsByNameThenClick('Edit')
        ARQuestionBanksPage.A5WaitForElementStateToChange(ARQuestionBanksAddEditPage.getA5EditQuestionBtnByIndex())

        cy.get(ARQuestionBanksAddEditPage.getA5EditQuestionBtnByIndex()).click()


        //Verify name persisted
        cy.get(A5GlobalResourceAddEditPage.getNameTxtF()).should('have.value', qbDetails.questionBanksName)


    })


    // Create online course with Created questionbank and proctor enable as other
    it('Create Online Course, with other proctor enable', () => {
        // Sign in with System Admin account
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')

        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Courses'))
        

        //create online course with assessment
        cy.createCourse('Online Course')

        // enable exam only assessment
        cy.get(AROCAddEditPage.getSyllabusRadioButtonLabel()).contains('Exams only').click()


        //Enable Proctor in Administrator mode
        cy.get(AROCAddEditPage.getSyllabusProctorToggle() + AROCAddEditPage.getToggleDisabled()).click()
        //click on other
        cy.get(AROCAddEditPage.getProctorRadioButtonLabelByName("Other")).click({ force: true }).should('be.checked')

        //add proctor
        cy.get(AROCAddEditPage.getProctorSelectionDDown()).click({ force: true })
        cy.get(AROCAddEditPage.getProctorEnterEmail()).type(users.sysAdmin.admin_sys_01_username)
        AROCAddEditPage.getLongWait()
        cy.get(AROCAddEditPage.getProctorSelectionDDownOpt()).first().click({ force: true })


        AROCAddEditPage.getShortWait()

        //Add learning object
        cy.get(AROCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
        ARSelectLearningObjectModal.getObjectTypeByName('Assessment')
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()
        ARDashboardPage.getMediumWait()
        ARAddObjectLessonModal.getTxtFByName('Name', lessonAssessment.ocAssessmentName)
        ARDashboardPage.getMediumWait()
        cy.get(ARQuestionBanksAddEditPage.getExpandQuestionsDropdown()).click()
        ARDashboardPage.getShortWait()
        cy.get(ARQuestionBanksAddEditPage.getManageQuestionsButton()).click()
        ARDashboardPage.getShortWait()
        cy.get(ARQuestionBanksAddEditPage.getUseQuestionBankButton()).click()
        ARDashboardPage.getShortWait()
        cy.get(ARQuestionBanksAddEditPage.getSelectQuestionBankDropdown()).click()
        ARDashboardPage.getShortWait()
        cy.get(ARQuestionBanksAddEditPage.getEnterQuestionBankName()).type(qbDetails.questionBanksName)

        ARDashboardPage.getMediumWait()
        cy.get(ARQuestionBanksAddEditPage.getSelectQuestionBank()).first().click()
        ARDashboardPage.getShortWait()
        cy.get(ARQuestionBanksAddEditPage.getSaveButton()).click()
        cy.get(ARQuestionBanksAddEditPage.getApplyButton()).click()
        cy.get(ARUploadInstructionsModal.getApplyBtn()).click()
        ARDashboardPage.getShortWait()

        //Move to Enrollment rules
        AROCAddEditPage.getShortWait()
        ARCourseSettingsEnrollmentRulesModule.clickEnrollMentRuleOption()
        ARCourseSettingsEnrollmentRulesModule.scrollToEnrolmentRule()

        // Check if Subsections of Enrollment rules are displayed         
        ARCourseSettingsEnrollmentRulesModule.verifyAllowSelfEnrollmentOption()

        //check SubOption of 'Allow Self Enrollment'
        ARCourseSettingsEnrollmentRulesModule.verifySelfEnrollment_SpecificOption()
        ARCourseSettingsEnrollmentRulesModule.verifySelfEnrollment_AllLearnersOption()
        ARCourseSettingsEnrollmentRulesModule.verifyAutoEnrollmentOption()
        ARCourseSettingsEnrollmentRulesModule.verifyApprovalOption()

        //Select All Learners in 'Allow Self enrollment'
        ARCourseSettingsEnrollmentRulesModule.clickAllowSelfEnrollmentRadioBtn('All Learners')

        //Publish OC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })

        //Enroll User
        AREnrollUsersPage.getEnrollUserByCourseAndUsername([ocDetails.courseName], [userDetails.username])

    })

    it("Start Learner Experience, Need other Proctor Login", () => {

        // //Login as a learner 
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        // //Search for OC
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('My Courses')
        cy.get(LEDashboardPage.getLEEllipsesLoader(), { timeout: 15000 }).should('not.exist', { timeout: 15000 })
        LEDashboardPage.getMediumWait()
        LEFilterMenu.SearchForCourseByName(ocDetails.courseName)
        LEDashboardPage.getMediumWait()
        cy.get(LEResourcesPage.getCourseCardName()).should('contain', ocDetails.courseName).should('be.visible')
        LEDashboardPage.getMediumWait()

        //Start course
        cy.get(LEDashboardPage.getCoursestartbutton()).click({ force: true })
        cy.wait(2000)

        //Start Assessment Proctor Login Needed
        cy.get(LEDashboardPage.getStartAssessmentButton()).click()
        cy.wait(2000)

        //Enter Proctor Details
        cy.get(LEDashboardPage.getProctorUsername()).type(users.sysAdmin.admin_sys_01_username)
        cy.get(LEDashboardPage.getProctorPassword()).type(users.sysAdmin.admin_sys_01_password)
        cy.get(LEDashboardPage.getProctorLogingButton()).click()
        cy.wait(2000)

        //Asserting proctor login successfull
        cy.get(LEDashboardPage.getProctorLoginSuccessfull()).should("contain", "successful")

        //Launch the assessment after proctor login
        cy.get(LEDashboardPage.getProctorLaunchAssessment()).click()
        LEDashboardPage.getLongWait()


    })

    // Now proctor is an administrator not other proctor but still need proctor login
    it('Edit Course with Administrator Proctor', () => {
        // Sign in with System Admin account
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')

        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Courses'))
        

        //edit online online COurse
        cy.editCourse(ocDetails.courseName)


        //click on Administrator
        cy.get(AROCAddEditPage.getProctorRadioButtonLabelByName("Administrator")).click({ force: true }).should('be.checked')


        //Publish OC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })


    })

    // Now proctor is an administrator but still need proctor login to take assessment
    it("Start Learner Experience, Need Proctor Login", () => {

        // //Login as a learner 
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        // //Search for OC
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('My Courses')
        cy.get(LEDashboardPage.getLEEllipsesLoader(), { timeout: 15000 }).should('not.exist', { timeout: 15000 })
        LEDashboardPage.getMediumWait()
        LEFilterMenu.SearchForCourseByName(ocDetails.courseName)
        LEDashboardPage.getMediumWait()
        cy.get(LEResourcesPage.getCourseCardName()).should('contain', ocDetails.courseName).should('be.visible')
        LEDashboardPage.getMediumWait()

        //Start course
        cy.get(LEDashboardPage.getCoursestartbutton()).click({ force: true })
        cy.wait(2000)
        
        //Start Assessment Proctor Login Needed
        cy.get(LEDashboardPage.getStartAssessmentButton()).click()
        cy.wait(2000)

        //Enter Proctor Details
        cy.get(LEDashboardPage.getProctorUsername()).type(users.sysAdmin.admin_sys_01_username)
        cy.get(LEDashboardPage.getProctorPassword()).type(users.sysAdmin.admin_sys_01_password)
        cy.get(LEDashboardPage.getProctorLogingButton()).click()
        cy.wait(2000)

        //Asserting Proctor Login Successfull
        cy.get(LEDashboardPage.getProctorLoginSuccessfull()).should("contain", "successful")

        //Launch Assessment After Proctor Login
        cy.get(LEDashboardPage.getProctorLaunchAssessment()).click()
        LEDashboardPage.getLongWait()


    })


    // Edit course with no proctor , learner can take assessment without proctor login
    it('Edit Course without Proctor, no proctor login needed during assessment', () => {
        // Sign in with System Admin account
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')

        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Courses'))
        

        //edit online online COurse
        cy.editCourse(ocDetails.courseName)



        // Disable Proctor in Administrator mode
        cy.get(AROCAddEditPage.getSyllabusProctorToggle() + AROCAddEditPage.getToggleEnabled()).click()


        //Publish OC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })


    })

    // No proctor login needed in the assessment login
    it("Start Learner Experience, No Need Proctor Login needed", () => {

        // //Login as a learner 
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        // //Search for OC
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('My Courses')
        cy.get(LEDashboardPage.getLEEllipsesLoader(), { timeout: 15000 }).should('not.exist', { timeout: 15000 })
        LEDashboardPage.getMediumWait()
        LEFilterMenu.SearchForCourseByName(ocDetails.courseName)
        LEDashboardPage.getMediumWait()
        cy.get(LEResourcesPage.getCourseCardName()).should('contain', ocDetails.courseName).should('be.visible')
        LEDashboardPage.getMediumWait()

        //Start Course
        cy.get(LEDashboardPage.getCoursestartbutton()).click({ force: true })
        cy.wait(2000)

        //Start Assessment No Proctor Login Needed
        cy.get(LEDashboardPage.getStartAssessmentButton()).click()
        LEDashboardPage.getLongWait()


    })




    after(() => {
        //Delete course
        cy.deleteCourse(commonDetails.courseID)

        //Get userID and delete them
        cy.get(LEDashboardPage.getNavProfile()).click({ force: true })
        LEDashboardPage.getShortWait()
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
        cy.url().then((currentURL) => {
            cy.deleteUser(currentURL.slice(-36));
        })

        // Sign in with System Admin account
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')

        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        ARDashboardPage.getMenuItemOptionByName('Question Banks')
        cy.intercept('**/GetQuestionBanks').as('getQuestionBanks').wait('@getQuestionBanks');

        // Search and Delete Question Bank
        ARQuestionBanksPage.A5AddFilter('Name', 'Starts With', qbDetails.questionBanksName)
        ARQuestionBanksPage.selectA5TableCellRecord(qbDetails.questionBanksName)
        ARQuestionBanksPage.A5WaitForElementStateToChange(ARQuestionBanksPage.getA5AddEditMenuActionsByIndex(3))
        ARQuestionBanksPage.getA5AddEditMenuActionsByNameThenClick('Delete')
        cy.get(ARDeleteModal.getA5OKBtn()).click().wait('@getQuestionBanks')
        // Verify Question Bank is deleted
        cy.get(ARQuestionBanksPage.getA5NoResultMsg()).should('have.text', "Sorry, no results found.");



    })

})

