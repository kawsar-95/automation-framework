import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARCourseSettingsAttributesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsAttributes.module'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import ARCourseSettingsEnrollmentRulesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
import arCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import AROCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage'
import LEProfilePage from '../../../../../../helpers/LE/pageObjects/User/LEProfilePage'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LEFilterMenu from '../../../../../../helpers/LE/pageObjects/Menu/LEFilterMenu'
import LECoursesPage from '../../../../../../helpers/LE/pageObjects/Courses/LECoursesPage'
import LECourseEvaluationModal from '../../../../../../helpers/LE/pageObjects/Modals/LECourseEvaluation.modal'
import { ocDetails } from '../../../../../../helpers/TestData/Courses/oc'
import { commonDetails, courseEvalQuestions } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../helpers/TestData/users/users'
import { userDetails } from '../../../../../../helpers/TestData/users/UserDetails'

describe('AR - CED - OC - Course Evaluation', function(){

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        
    })

    it('Verify Course Evaluation Toggles, Fields, Questions', () => {
        cy.createCourse('Online Course')

        //Set Enrollment Rule
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        arCoursesPage.getShortWait()
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')

        //Open Attribute Settings
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Attributes')).click()
        AROCAddEditPage.getLShortWait()

        //Verify Course Evaluation can be enabled
        cy.get(AROCAddEditPage.getElementByDataNameAttribute(ARCourseSettingsAttributesModule.getEnableCourseEvalToggleContainer()) + ' ' + AROCAddEditPage.getToggleEnabled()).click()

        //Verify Evaluation Required can be enabled
        cy.get(AROCAddEditPage.getElementByDataNameAttribute(ARCourseSettingsAttributesModule.getEvalRequiredToggleContainer()) + ' ' + AROCAddEditPage.getToggleDisabled()).click()

        //Verify Evaluation can be taken at anytime can be enabled
        cy.get(AROCAddEditPage.getElementByDataNameAttribute(ARCourseSettingsAttributesModule.getEvalAnyTimeToggleContainer()) + ' ' + AROCAddEditPage.getToggleDisabled()).click()

        //Verify default questions are all present and in correct order
        cy.get(ARCourseSettingsAttributesModule.getUseDefaultQuestionsBtn()).click()
        cy.get(ARCourseSettingsAttributesModule.getQuestionName()).each(($span, i) => {
            expect($span.text()).to.equal(courseEvalQuestions.defaultQuestions[i])
        })

        //Verify editing a question
        cy.get(ARCourseSettingsAttributesModule.getQuestionName()).contains(courseEvalQuestions.defaultQuestions[0]).parents(ARCourseSettingsAttributesModule.getQuestionContainer())
            .within(() => {
                cy.get(AROCAddEditPage.getPencilBtn()).click()
                cy.get(ARCourseSettingsAttributesModule.getQuestionTxtF()).clear().type(courseEvalQuestions.newQuestion) //Edit question name
                cy.get(ARCourseSettingsAttributesModule.getQuestionTypeDDown()).click() //Edit question answer type
                cy.get(ARCourseSettingsAttributesModule.getQuestionTypeDDownOpt()).contains('Text').click()
                //Save changes
                cy.get(AROCAddEditPage.getCheckMarkBtn()).click()
            })

        //Verify deleting a question
        ARCourseSettingsAttributesModule.getDeleteQuestionByName(courseEvalQuestions.defaultQuestions[courseEvalQuestions.defaultQuestions.length-1])
        cy.get(ARCourseSettingsAttributesModule.getQuestionName()).contains(courseEvalQuestions.defaultQuestions[courseEvalQuestions.defaultQuestions.length-1])
            .should('not.exist')

        //Verify adding a new question
        cy.get(ARCourseSettingsAttributesModule.getAddEvalQuestionsBtn()).click()
        cy.get(ARCourseSettingsAttributesModule.getQuestionNumber()).its('length').then((length) => {
            cy.get(ARCourseSettingsAttributesModule.getQuestionNumber()).eq(length-1).parents(ARCourseSettingsAttributesModule.getQuestionContainer())
            .within(() => {
                cy.get(ARCourseSettingsAttributesModule.getQuestionTxtF()).type(courseEvalQuestions.newQuestion2)
                cy.get(ARCourseSettingsAttributesModule.getQuestionTypeDDown()).click()
                cy.get(ARCourseSettingsAttributesModule.getQuestionTypeDDownOpt()).contains('Rating').click()
                cy.get(AROCAddEditPage.getCheckMarkBtn()).click()
            })
        })

        //Publish course
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = (id.request.url.slice(-36));
        })
    })

    it('Verify Course Evaluation Persisted, Reset to Default, and Re-Order Questions', () => {
        //Filter for Course & Edit it
        cy.editCourse(ocDetails.courseName)
        AROCAddEditPage.getMediumWait()

        //Open Attribute Settings
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Attributes')).click()
        AROCAddEditPage.getLShortWait()

        //Verify all toggles are still enabled
        cy.get(AROCAddEditPage.getElementByDataNameAttribute(ARCourseSettingsAttributesModule.getEnableCourseEvalToggleContainer()) + ' ' + AROCAddEditPage.getToggleStatus())
            .should('have.attr', 'aria-checked', 'true')
        cy.get(AROCAddEditPage.getElementByDataNameAttribute(ARCourseSettingsAttributesModule.getEvalRequiredToggleContainer()) + ' ' + AROCAddEditPage.getToggleStatus())
            .should('have.attr', 'aria-checked', 'true')
        cy.get(AROCAddEditPage.getElementByDataNameAttribute(ARCourseSettingsAttributesModule.getEvalAnyTimeToggleContainer()) + ' ' + AROCAddEditPage.getToggleStatus())
            .should('have.attr', 'aria-checked', 'true')

        //Verify edited question persisted
        cy.get(ARCourseSettingsAttributesModule.getQuestionName()).contains(courseEvalQuestions.newQuestion).parents(ARCourseSettingsAttributesModule.getQuestionContainer())
            .within(() => {
                cy.get(AROCAddEditPage.getPencilBtn()).click()
                cy.get(ARCourseSettingsAttributesModule.getQuestionTypeDDown()).should('contain', 'Text')
                cy.get(AROCAddEditPage.getCheckMarkBtn()).click() //minimize question
            })

        //Verify deleted question persisted
        cy.get(ARCourseSettingsAttributesModule.getQuestionName()).contains(courseEvalQuestions.defaultQuestions[courseEvalQuestions.defaultQuestions.length-1])
            .should('not.exist')

        //Verify added question persisted
        cy.get(ARCourseSettingsAttributesModule.getQuestionName()).contains(courseEvalQuestions.newQuestion2).parents(ARCourseSettingsAttributesModule.getQuestionContainer())
            .within(() => {
                cy.get(AROCAddEditPage.getPencilBtn()).click()
                cy.get(ARCourseSettingsAttributesModule.getQuestionTypeDDown()).should('contain', 'Rating')
                cy.get(AROCAddEditPage.getCheckMarkBtn()).click()
            })

        //Verify questions can be reset to default
        cy.get(ARCourseSettingsAttributesModule.getUseDefaultQuestionsBtn()).click()
        cy.get(ARCourseSettingsAttributesModule.getQuestionName()).each(($span, i) => {
            expect($span.text()).to.equal(courseEvalQuestions.defaultQuestions[i])
        })

        //Verify questions can be re-ordered - using key commands instead of drag and drop (WCAG)
        cy.get(ARCourseSettingsAttributesModule.getQuestionsContainer()).within(() => {
            //Move first question down one
            cy.get(AROCAddEditPage.getGripBtn()).eq(0).focus().type(' ').type('{downarrow}').type(' ')

            //Move last question up one
            cy.get(AROCAddEditPage.getGripBtn()).its('length').then((length) => {
                cy.get(AROCAddEditPage.getGripBtn()).eq(length-1).focus().type(' ').type('{uparrow}').type(' ')
            })
        })
        
        //Publish course
        cy.publishCourse()
    })

    it('Verify Course Evaluation Reset and Re-Order Persisted', () => {
        //Filter for Course & Edit it
        cy.editCourse(ocDetails.courseName)
        AROCAddEditPage.getMediumWait()

        //Open Attribute Settings
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Attributes')).click()
        AROCAddEditPage.getLShortWait()

        //Verify question re-order persisted - transform original array to compare
        AROCAddEditPage.transformArray(courseEvalQuestions.defaultQuestions, 0, 1)
        AROCAddEditPage.transformArray(courseEvalQuestions.defaultQuestions, courseEvalQuestions.defaultQuestions.length-1, courseEvalQuestions.defaultQuestions.length-2)
        //Verify re-order and that added/edited/delete question changes from previous test persisted
        cy.get(ARCourseSettingsAttributesModule.getQuestionName()).each(($span, i) => {
            expect($span.text()).to.equal(courseEvalQuestions.defaultQuestions[i])
        })
    })
})

describe('AR - CED - OC - Course Evaluation - Learner Side', function(){

    before(function() {
        //Create a new user
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
    })

    beforeEach(() => {
        //Sign in, navigate to catalog
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        LEDashboardPage.getTileByNameThenClick('Catalog')
    })

    after(function() {
        //Delete course
        cy.deleteCourse(commonDetails.courseID)
        //Cleanup - Delete user
        cy.get(LEDashboardPage.getNavProfile()).click()  
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
        cy.url().then((currentURL) => {
            cy.deleteUser(currentURL.slice(-36));
        })
    })

    it('Verify Learner can Complete Course Evaluation', () => {
        //Enroll in course
        LEFilterMenu.getSearchAndEnrollInCourseByName(ocDetails.courseName)
        LEDashboardPage.getCourseCardBtnThenClick(ocDetails.courseName)
        LEDashboardPage.getMediumWait()

        //Start course evaluation
        cy.get(LECoursesPage.getEvaluateCourseBtn()).click()
        LECoursesPage.getShortWait()

        //Verify questions are in the correct order and that they can be answered
        cy.get(LECourseEvaluationModal.getQuestionName()).each(($span, i) => {
            //Verify order
            expect($span.text()).to.equal(courseEvalQuestions.defaultQuestions[i])

            cy.get(LECourseEvaluationModal.getQuestionName()).eq(i).invoke('attr', 'class').then((type) => {
                //Answer questions
                if (type.includes('rating_question')) {
                    LECourseEvaluationModal.getRateQuestionByName(courseEvalQuestions.defaultQuestions[i], 5)
                } else if (type.includes('text_question')) {
                    LECourseEvaluationModal.getAnswerQuestionByName(courseEvalQuestions.defaultQuestions[i], courseEvalQuestions.questionAnswer)
                }
            })
        })

        //Submit evaluation
        cy.get(LECourseEvaluationModal.getSubmitBtn()).click()
        LECourseEvaluationModal.getFeedbackMsg() //Verify closing message
        
        //Close modal
        cy.get(LECourseEvaluationModal.getCloseBtn()).click()
    })
})