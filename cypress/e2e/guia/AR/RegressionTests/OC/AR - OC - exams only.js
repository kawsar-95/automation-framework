import ARCoursesPage from "../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage"
import AROCAddEditPage, { errorMessage } from "../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage"
import ARAddMoreCourseSettingsModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module"
import ARCourseSettingsAvailabilityModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsAvailability.module"
import ARCourseSettingsEnrollmentRulesModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARAddObjectLessonModal from "../../../../../../helpers/AR/pageObjects/Modals/ARAddObjectLessonModal"
import ARSelectLearningObjectModal from "../../../../../../helpers/AR/pageObjects/Modals/ARSelectLearningObjectModal"
import ARQuestionBanksAddEditPage from "../../../../../../helpers/AR/pageObjects/QuestionBanks/ARQuestionBanksAddEditPage"
import AREnrollUsersPage from "../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage"
import ARUserTranscriptPage from "../../../../../../helpers/AR/pageObjects/User/ARUserTranscriptPage"
import LEDashboardPage from "../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage"
import LEProfilePage from "../../../../../../helpers/LE/pageObjects/User/LEProfilePage"
import { commonDetails } from "../../../../../../helpers/TestData/Courses/commonDetails"
import { lessonAssessment, ocDetails } from "../../../../../../helpers/TestData/Courses/oc"
import { userDetails } from "../../../../../../helpers/TestData/users/UserDetails"
import { users } from "../../../../../../helpers/TestData/users/users"



describe('C789 - AUT-221 - GUIA-Story - NASA-4153 - The option for an Online Course to only require Exams for completion (cloned)', () => {

    before(() => {
        //create a user
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
    })
    it("Verifying Select Exam Only completion type Does not save the course", () => {
        //Login as an administrator
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        // Go to Course Report Page 
        ARDashboardPage.getCoursesReport()
        //Create an online course
        cy.createCourse('Online Course', ocDetails.courseName)


        // Set enrollment rule - Allow self enrollment for all learners
        cy.get(ARCourseSettingsEnrollmentRulesModule.getRadioBtnContainer()).contains('All Learners').click()
        //Add Video File Object Lesson Desktop Iframe
        cy.get(AROCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
        //Add learning object Assessment        
        ARSelectLearningObjectModal.getObjectTypeByName('Assessment')
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()

        ARAddObjectLessonModal.getTxtFByName('Assessment Name', lessonAssessment.ocAssessmentName)
        // turning off assessment weight
        cy.get(ARAddObjectLessonModal.getWeightedToggleBtn()).click()
        //Asserting that its turned off
        cy.get(ARAddObjectLessonModal.getWeightedToggleBtn()).find('input').should('have.attr', 'aria-checked', 'false')

        cy.get(ARAddObjectLessonModal.getandClickApplybutton()).click({ force: true })


        // Clicking on the Syllabus Button 
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn("Syllabus")).click()

        // "All lessons, in any order" radio button displaying selected by default
        cy.get(AROCAddEditPage.getSyllabusRadioButtonLabel()).contains('Exams only').parent().find('input').click({ force: true })
        cy.get(AROCAddEditPage.getSyllabusRadioButtonLabel()).contains('Exams only').parent().find('input').should('be.checked')
        //Asserting that publish button is disabled
        cy.get(ARCoursesPage.getPublishBtn()).should('have.attr', 'aria-disabled', 'true')
        //Asserting Error
        cy.get(AROCAddEditPage.getSyllabusRadioButtonLabel()).contains('Exams only').parents(AROCAddEditPage.getCompletionType()).within(() => {
            cy.get(AROCAddEditPage.getErrorMsg()).should('exist')
            cy.get(AROCAddEditPage.getErrorMsg()).should('contain', errorMessage.syllabus_error_msg)
        })

    })

    it("Verifying Select Exam Only completion type and Adding weighted assessment save the course", () => {
        //Login as an administrator
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        // Go to Course Report Page 
        ARDashboardPage.getCoursesReport()
        //Create an online course
        cy.createCourse('Online Course', ocDetails.courseName)

        //creating first assessment anad assert that error exists
        // Set enrollment rule - Allow self enrollment for all learners
        cy.get(ARCourseSettingsEnrollmentRulesModule.getRadioBtnContainer()).contains('All Learners').click()
        //Add Video File Object Lesson Desktop Iframe
        cy.get(AROCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
        //Add learning object Assessment        
        ARSelectLearningObjectModal.getObjectTypeByName('Assessment')
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()

        ARAddObjectLessonModal.getTxtFByName('Assessment Name', lessonAssessment.ocAssessmentName)
        // turning off assessment weight
        cy.get(ARAddObjectLessonModal.getWeightedToggleBtn()).click()
        //Asserting that its turned off
        cy.get(ARAddObjectLessonModal.getWeightedToggleBtn()).find('input').should('have.attr', 'aria-checked', 'false')

        cy.get(ARAddObjectLessonModal.getandClickApplybutton()).click({ force: true })


        // Clicking on the Syllabus Button 
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn("Syllabus")).click()

        // "All lessons, in any order" radio button displaying selected by default
        cy.get(AROCAddEditPage.getSyllabusRadioButtonLabel()).contains('Exams only').parent().find('input').click({ force: true })
        cy.get(AROCAddEditPage.getSyllabusRadioButtonLabel()).contains('Exams only').parent().find('input').should('be.checked')
        //Asserting that publish button is disabled
        cy.get(ARCoursesPage.getPublishBtn()).should('have.attr', 'aria-disabled', 'true')
        //Asserting Error
        cy.get(AROCAddEditPage.getSyllabusRadioButtonLabel()).contains('Exams only').parents(AROCAddEditPage.getCompletionType()).within(() => {
            cy.get(AROCAddEditPage.getErrorMsg()).should('exist')
            cy.get(AROCAddEditPage.getErrorMsg()).should('contain', errorMessage.syllabus_error_msg)
        })


        //Add Video File Object Lesson Desktop Iframe
        cy.get(AROCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
        //Add learning object Assessment        
        ARSelectLearningObjectModal.getObjectTypeByName('Assessment')
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()

        ARAddObjectLessonModal.getTxtFByName('Assessment Name', lessonAssessment.ocAssessmentName2)

        //Add Assesment Weight
        cy.get(ARAddObjectLessonModal.getAddassessmentweight()).clear().type(10)
        //Add Grade to Pass
        cy.get(ARAddObjectLessonModal.getAddGradetoPass()).clear().type(100)
        //Expand options dropdown under Assessment  
        cy.get(ARAddObjectLessonModal.getAddexpandoptions()).click()
        cy.get(ARAddObjectLessonModal.getInputallowfailures()).eq(0).click({ force: true })
        //Add Question for assessment
        cy.get(ARAddObjectLessonModal.getExpandQuestionsbutton()).click()
        cy.get(ARAddObjectLessonModal.getManageQuestions()).click()

        cy.get(ARQuestionBanksAddEditPage.getUseQuestionBankButton()).click()

        cy.get(ARQuestionBanksAddEditPage.getSelectQuestionBankDropdown()).click()

        cy.get(ARQuestionBanksAddEditPage.getEnterQuestionBankName()).type("GUIA - CED - QBank")

        cy.get(ARQuestionBanksAddEditPage.getSelectQuestionBank()).click()

        cy.get(ARSelectLearningObjectModal.getModalTitle()).contains('Add Question Bank').parent().parent().within(() => {
            cy.get(ARAddObjectLessonModal.getQuestionSavebutton()).contains("Save").click()

        })


        cy.get(ARSelectLearningObjectModal.getModalTitle()).contains('Manage Questions').parent().parent().within(() => {
            cy.get(ARAddObjectLessonModal.getandClickApplybutton()).contains("Apply").click()
        })

        cy.get(ARSelectLearningObjectModal.getModalTitle()).contains('Add Assessment').parent().parent().within(() => {
            cy.get(ARAddObjectLessonModal.getandClickApplybutton()).contains("Apply").click()
        })


        // Clicking on the Syllabus Button 
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn("Syllabus")).click()

        // "All lessons, in any order" radio button displaying selected by default
        cy.get(AROCAddEditPage.getSyllabusRadioButtonLabel()).contains('Exams only').parent().find('input').click({ force: true })
        cy.get(AROCAddEditPage.getSyllabusRadioButtonLabel()).contains('Exams only').parent().find('input').should('be.checked')
        //Asserting that publish button is enabled
        cy.get(ARCoursesPage.getPublishBtn()).should('have.attr', 'aria-disabled', 'false')


    })

    it("Create a course and enroll user , complete some lessons then add change coompletion type to Exam only ", () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        // Go to Course Report Page 
        ARDashboardPage.getCoursesReport()
        //Create an online course
        cy.createCourse('Online Course', ocDetails.courseName)
         //Add Video File Object Lesson Desktop Iframe
         cy.get(AROCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
         //Add learning object Assessment        
         ARSelectLearningObjectModal.getObjectTypeByName('Assessment')
         cy.get(ARSelectLearningObjectModal.getNextBtn()).click()
 
         ARAddObjectLessonModal.getTxtFByName('Assessment Name', lessonAssessment.ocAssessmentName)
         // turning off assessment weight
         cy.get(ARAddObjectLessonModal.getWeightedToggleBtn()).click()
         //Asserting that its turned off
         cy.get(ARAddObjectLessonModal.getWeightedToggleBtn()).find('input').should('have.attr', 'aria-checked', 'false')
 
         cy.get(ARAddObjectLessonModal.getandClickApplybutton()).click({ force: true })
        
        cy.get(ARCourseSettingsEnrollmentRulesModule.getRadioBtnContainer()).contains('All Learners').click()
        // Clicking on the Syllabus Button 
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn("Syllabus")).click()
        cy.get(AROCAddEditPage.getSyllabusRadioButtonLabel()).contains('All lessons, in any order').parent().find('input').should('be.checked')
        //Publish course
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36));
        })
        cy.get(ARDashboardPage.getToastSuccessMsg()).should('be.visible')

        AREnrollUsersPage.getEnrollUserByCourseAndUsername([ocDetails.courseName], [userDetails.username])
        //Go to Users Page
        ARDashboardPage.getUsersReport()
        //Filter out the user
        ARDashboardPage.AddFilter('Username', 'Equals', userDetails.username)
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should("not.exist")
        cy.get(ARDashboardPage.getTableCellRecord(), { timeout: 15000 }).contains(userDetails.username).click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should("not.exist")
        cy.wrap(ARDashboardPage.WaitForElementStateToChange(ARDashboardPage.getAddEditMenuActionsByName('User Transcript')))
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('User Transcript')).click({ force: true })
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should("not.exist")
        cy.get(ARDashboardPage.getPageHeaderTitle(), { timeout: 15000 }).should('contain', 'User Transcript')
        //Going to Enrolled courses
        cy.get(ARUserTranscriptPage.getEnrollmentHeader()).should('exist').click()
        cy.get(ARUserTranscriptPage.getEnrollmentTable()).should('exist')
        //Asserting Enrollment and status
        cy.get(ARUserTranscriptPage.getUserTranscriptStatus()).should('contain', 'Complete')
        cy.get(ARUserTranscriptPage.getUserTranscriptScore()).should('contain', '')
        cy.get(ARUserTranscriptPage.getUserTranscriptCredits()).should('contain', '')
        cy.get(ARUserTranscriptPage.getCourseName()).should('contain', ocDetails.courseName)

        //Updating the course by adding new lessons
        // Go to Course Report Page 
        ARDashboardPage.getCoursesReport()
        cy.editCourse(ocDetails.courseName)

        //Add Video File Object Lesson Desktop Iframe
        cy.get(AROCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
        //Add learning object Assessment        
        ARSelectLearningObjectModal.getObjectTypeByName('Assessment')
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()

        ARAddObjectLessonModal.getTxtFByName('Assessment Name', lessonAssessment.ocAssessmentName2)

        //Add Assesment Weight
        cy.get(ARAddObjectLessonModal.getAddassessmentweight()).clear().type(10)
        //Add Grade to Pass
        cy.get(ARAddObjectLessonModal.getAddGradetoPass()).clear().type(100)
        //Expand options dropdown under Assessment  
        cy.get(ARAddObjectLessonModal.getAddexpandoptions()).click()
        cy.get(ARAddObjectLessonModal.getInputallowfailures()).eq(0).click({ force: true })
        //Add Question for assessment
        cy.get(ARAddObjectLessonModal.getExpandQuestionsbutton()).click()
        cy.get(ARAddObjectLessonModal.getManageQuestions()).click()

        cy.get(ARQuestionBanksAddEditPage.getUseQuestionBankButton()).click()

        cy.get(ARQuestionBanksAddEditPage.getSelectQuestionBankDropdown()).click()

        cy.get(ARQuestionBanksAddEditPage.getEnterQuestionBankName()).type("GUIA - CED - QBank")

        cy.get(ARQuestionBanksAddEditPage.getSelectQuestionBank()).click()

        cy.get(ARSelectLearningObjectModal.getModalTitle()).contains('Add Question Bank').parent().parent().within(() => {
            cy.get(ARAddObjectLessonModal.getQuestionSavebutton()).contains("Save").click()

        })


        cy.get(ARSelectLearningObjectModal.getModalTitle()).contains('Manage Questions').parent().parent().within(() => {
            cy.get(ARAddObjectLessonModal.getandClickApplybutton()).contains("Apply").click()
        })

        cy.get(ARSelectLearningObjectModal.getModalTitle()).contains('Add Assessment').parent().parent().within(() => {
            cy.get(ARAddObjectLessonModal.getandClickApplybutton()).contains("Apply").click()
        })

        // Clicking on the Syllabus Button 
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn("Syllabus")).click()

        // "All lessons, in any order" radio button displaying selected by default
        cy.get(AROCAddEditPage.getSyllabusRadioButtonLabel()).contains('Exams only').parent().find('input').click({ force: true })
        cy.get(AROCAddEditPage.getSyllabusRadioButtonLabel()).contains('Exams only').parent().find('input').should('be.checked')
        //Asserting that publish button is enabled
        cy.get(ARCoursesPage.getPublishBtn()).should('have.attr', 'aria-disabled', 'false')


        //Publish course
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36));
        })
        cy.get(ARDashboardPage.getToastSuccessMsg()).should('be.visible')

         //Go to Users Page
         ARDashboardPage.getUsersReport()
         //Filter out the user
         ARDashboardPage.AddFilter('Username', 'Equals', userDetails.username)
         cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should("not.exist")
         cy.get(ARDashboardPage.getTableCellRecord(), { timeout: 15000 }).contains(userDetails.username).click()
         cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should("not.exist")
         cy.wrap(ARDashboardPage.WaitForElementStateToChange(ARDashboardPage.getAddEditMenuActionsByName('User Transcript')))
         cy.get(ARDashboardPage.getAddEditMenuActionsByName('User Transcript')).click({ force: true })
         cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should("not.exist")
         cy.get(ARDashboardPage.getPageHeaderTitle(), { timeout: 15000 }).should('contain', 'User Transcript')
         //Going to Enrolled courses
         cy.get(ARUserTranscriptPage.getEnrollmentHeader()).should('exist').click()
         cy.get(ARUserTranscriptPage.getEnrollmentTable()).should('exist')
         //Asserting Enrollment and status
         cy.get(ARUserTranscriptPage.getUserTranscriptStatus()).should('contain', 'Complete')
         cy.get(ARUserTranscriptPage.getUserTranscriptScore()).should('contain', '')
         cy.get(ARUserTranscriptPage.getUserTranscriptCredits()).should('contain', '')
         cy.get(ARUserTranscriptPage.getCourseName()).should('contain', ocDetails.courseName)


    })



    after(() => {
        cy.deleteCourse(commonDetails.courseID)
        //Delete the created User
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        //Cleanup - Get userID and delete them
        cy.get(LEDashboardPage.getNavProfile()).click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
        cy.url().then((currentURL) => {
            cy.deleteUser(currentURL.slice(-36));
        })
    })
})