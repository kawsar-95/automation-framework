import arDashboardPage from '../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arOCAddEditPage from '../../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage'
import ARSelectLearningObjectModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARSelectLearningObjectModal'
import ARAddSurveyLessonModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARAddSurveyLessonModal'
import ARDeleteModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import { users } from '../../../../../../../helpers/TestData/users/users'
import { miscData } from '../../../../../../../helpers/TestData/Misc/misc'
import { ocDetails, lessonSurvey } from '../../../../../../../helpers/TestData/Courses/oc'
import { commonDetails } from '../../../../../../../helpers/TestData/Courses/commonDetails'

describe('AR - CED - OC - Lesson - Survey T832329', function(){

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        
    })

    after(function() {
        //Delete course
        cy.deleteCourse(commonDetails.courseID)
    })

    it('Verify Creating a Survey Type Lesson', () => {
        cy.createCourse('Online Course')

        //Verify Survey Lesson Can Be Selected
        cy.get(arOCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
        ARSelectLearningObjectModal.getObjectTypeByName('Survey')
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()
        arOCAddEditPage.getShortWait()

        //Verify Details section
        ARAddSurveyLessonModal.getExpandDetails()
        //Verify name is required
        cy.get(ARAddSurveyLessonModal.getNameTxtF()).clear()
        cy.get(ARAddSurveyLessonModal.getErrorMsg()).should('contain', miscData.field_required_error)
        //Need to use errorTxtF class as the NameTxtF is hidden when an error message is displayed
        cy.get(ARAddSurveyLessonModal.getNameTxtF()).type(lessonSurvey.ocSurveyName) //Add valid name

        //Add description
        cy.get(ARAddSurveyLessonModal.getDescriptionTxtF()).type(lessonSurvey.ocSurveyDescription)

        //Collapse Details
        ARAddSurveyLessonModal.getCollapseDetails()
        
        //Expand Options Section and verify all toggles (except answer based actions and last two) can be turned on
        ARAddSurveyLessonModal.getExpandOptions()
        for (let i = 0; i < lessonSurvey.toggleFuncNames.length-2; i++) {
            if (lessonSurvey.toggleFuncNames[i] != 'getUseAnswerActionsToggleContainer') {
                cy.get(arOCAddEditPage.getElementByDataNameAttribute(ARAddSurveyLessonModal[lessonSurvey.toggleFuncNames[i]]())  + ' ' + arOCAddEditPage.getToggleDisabled()).click()
            }
        }

        //Verify max attempts field does not accept letters or negative values
        cy.get(ARAddSurveyLessonModal.getMaxAttemptsTxtF()).type('a').blur()
        cy.get(ARAddSurveyLessonModal.getMaxAttemptsTxtF()).should('have.value', '')
        cy.get(ARAddSurveyLessonModal.getMaxAttemptsTxtF()).type(-2)
        cy.get(ARAddSurveyLessonModal.getErrorMsg()).should('contain', miscData.negative_chars_error)
        cy.get(ARAddSurveyLessonModal.getMaxAttemptsTxtF()).clear().type(lessonSurvey.maxAttempts)
        cy.get(ARAddSurveyLessonModal.getMaxAttemptsTxtF()).type(lessonSurvey.maxAttempts)

        //Collapse Options
        ARAddSurveyLessonModal.getCollapseOptions()

        

        //Expand Questions section and verify adding a question group
        ARAddSurveyLessonModal.getExpandQuestions()
        ARAddSurveyLessonModal.getShortWait()

        //Expand Messages section and verify introduction and post messages fields
        ARAddSurveyLessonModal.getExpandMessages()
        cy.get(ARAddSurveyLessonModal.getIntroTxtF()).type(lessonSurvey.introMessage)
        cy.get(ARAddSurveyLessonModal.getPostTxtF()).type(lessonSurvey.postMessage)
        

        //Verify default question group name and re-name group
        cy.get(ARAddSurveyLessonModal.getQuestionGroupName()).contains(lessonSurvey.questionGroupNameDefault).parents(ARAddSurveyLessonModal.getQuestionGroupContainer())
            .within(() => {
                //cy.get(ARAddSurveyLessonModal.getQuestionGroupNameTxtF()).clear().type(lessonSurvey.questionGroupNameDefault)

                
                //Manage questions
                cy.get(ARAddSurveyLessonModal.getManageQuestionsBtn()).click()
            })

            

        //Add a question of each type
        for (let i = 0; i < lessonSurvey.questionTypes.length; i++) {
            cy.get(ARAddSurveyLessonModal.getAddQuestionBtn()).click()
            ARAddSurveyLessonModal.getShortWait()
            cy.get(ARAddSurveyLessonModal.getQuestionNameTxtF()).type(`${lessonSurvey.questionTypes[i]} Type Question`)
            cy.get(ARAddSurveyLessonModal.getQuestionTypeDDown()).click()
            cy.get(ARAddSurveyLessonModal.getDDownOpt()).contains(lessonSurvey.questionTypes[i]).click()

            switch (lessonSurvey.questionTypes[i]) {
                case 'Free Form Inquiry':
                    cy.get(ARAddSurveyLessonModal.getElementByAriaLabelAttribute(ARAddSurveyLessonModal.getCharacterLimitTxtF())).type('100')
                    cy.get(ARAddSurveyLessonModal.getAttachmentRadioBtn()).contains('Url').click()
                    cy.get(ARAddSurveyLessonModal.getUrlTxtF()).type(miscData.switching_to_absorb_img_url)
                    break;
                case 'Poll Single Answer': //Add three answers to each poll type
                case 'Poll Multiple Answer':
                    for (let j = 0; j < lessonSurvey.threeQuestionLetters.length; j++) {
                        ARAddSurveyLessonModal.getAddAnswerByLetter(lessonSurvey.threeQuestionLetters[j], lessonSurvey.pollQuestions[j])
                        if (j != lessonSurvey.threeQuestionLetters.length-1) {
                            cy.get(ARAddSurveyLessonModal.getAddAnswerBtn()).click()
                        }
                    }
                    ARAddSurveyLessonModal.getShortWait()
                    break;
            }
            cy.get(ARAddSurveyLessonModal.getQuestionSaveBtn()).click()
            ARAddSurveyLessonModal.getShortWait()
        }
            
        //Save question group
        cy.get(ARAddSurveyLessonModal.getApplyBtn()).click()
        ARAddSurveyLessonModal.getLShortWait()

        //Add a second empty question group and rename it 
        cy.get(ARAddSurveyLessonModal.getAddQuestionGroupBtn()).click()
        ARAddSurveyLessonModal.getVShortWait()
        cy.get(ARAddSurveyLessonModal.getQuestionGroupName()).contains('Question Group 2').parents(ARAddSurveyLessonModal.getQuestionGroupContainer())
            .within(() => {
                //cy.get(ARAddSurveyLessonModal.getQuestionGroupNameTxtF()).clear().type(lessonSurvey.questionGroupNameDefault2)
            })

        //Save the survey lesson
        cy.get(ARAddSurveyLessonModal.getSurveySaveBtn()).click()
        ARAddSurveyLessonModal.getMediumWait()

        //Publish course
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = (id.request.url.slice(-36));
        })
    })

    it('Verify Survey Lesson Persisted, Edit Sections, Verify Max Questions in a Group', () => {
        cy.editCourse(ocDetails.courseName)
        arOCAddEditPage.getMediumWait()

        //Verify survey lesson persisted and edit it
        arOCAddEditPage.getEditBtnByLessonNameThenClick(lessonSurvey.ocSurveyName)

        //Verify Details section persisted and edit fields
        ARAddSurveyLessonModal.getExpandDetails()
        cy.get(ARAddSurveyLessonModal.getNameTxtF()).eq(0).should('have.value', lessonSurvey.ocSurveyName).type(commonDetails.appendText)
        cy.get(ARAddSurveyLessonModal.getDescriptionTxtF()).should('contain.text', lessonSurvey.ocSurveyDescription).type(commonDetails.appendText)
        ARAddSurveyLessonModal.getCollapseDetails()

        //Verify Options section persisted and edit toggles
        ARAddSurveyLessonModal.getExpandOptions()
        cy.get(ARAddSurveyLessonModal.getMaxAttemptsTxtF()).should('have.value', lessonSurvey.maxAttempts)
        for (let i = 0; i < lessonSurvey.toggleFuncNames.length-2; i++) {
            if (lessonSurvey.toggleFuncNames[i] != 'getUseAnswerActionsToggleContainer') {
                cy.get(arOCAddEditPage.getElementByDataNameAttribute(ARAddSurveyLessonModal[lessonSurvey.toggleFuncNames[i]]())  + ' ' + arOCAddEditPage.getToggleStatus())
                    .should('have.attr', 'aria-checked', 'true')
                //Disabled toggles
                cy.get(arOCAddEditPage.getElementByDataNameAttribute(ARAddSurveyLessonModal[lessonSurvey.toggleFuncNames[i]]())  + ' ' + arOCAddEditPage.getToggleEnabled()).click()
            }
        }
        ARAddSurveyLessonModal.getCollapseOptions()

        //Verify Messages section persisted and edit fields
        ARAddSurveyLessonModal.getExpandMessages()
        cy.get(ARAddSurveyLessonModal.getIntroTxtF()).should('contain.text', lessonSurvey.introMessage).type(commonDetails.appendText)
        cy.get(ARAddSurveyLessonModal.getPostTxtF()).should('contain.text', lessonSurvey.postMessage).type(commonDetails.appendText)

        //Verify Questions section persisted and edit question groups and questions
        ARAddSurveyLessonModal.getExpandQuestions()
        ARAddSurveyLessonModal.getShortWait()
        cy.get(ARAddSurveyLessonModal.getQuestionGroupName()).contains(lessonSurvey.questionGroupNameDefault).parents(ARAddSurveyLessonModal.getQuestionGroupContainer())
            .within(() => {
                //cy.get(ARAddSurveyLessonModal.getQuestionGroupNameTxtF()).type(commonDetails.appendText)
                cy.get(ARAddSurveyLessonModal.getManageQuestionsBtn()).click()
            })
        
        for (let i = 0; i < lessonSurvey.questionTypes.length; i++) {
            ARAddSurveyLessonModal.getEditQuestionByName(`${lessonSurvey.questionTypes[i]} Type Question`)
            ARAddSurveyLessonModal.getShortWait()
            cy.get(ARAddSurveyLessonModal.getQuestionNameTxtF()).clear().type(`${lessonSurvey.questionTypes[i]} Type Question ${commonDetails.appendText}`)
            cy.get(ARAddSurveyLessonModal.getQuestionTypeDDown()).should('contain.text', lessonSurvey.questionTypes[i])

            switch (lessonSurvey.questionTypes[i]) {
                case 'Free Form Inquiry':
                    cy.get(ARAddSurveyLessonModal.getElementByAriaLabelAttribute(ARAddSurveyLessonModal.getCharacterLimitTxtF())).should('have.value', '100')
                    cy.get(ARAddSurveyLessonModal.getUrlTxtF()).should('have.value', miscData.switching_to_absorb_img_url)
                    break;
                case 'Poll Single Answer': 
                case 'Poll Multiple Answer':
                    for (let j = 0; j < lessonSurvey.threeQuestionLetters.length; j++) {
                        cy.get(ARAddSurveyLessonModal.getPollAnswerContainer()).should('contain', lessonSurvey.pollQuestions[j])
                        ARAddSurveyLessonModal.getAddAnswerByLetter(lessonSurvey.threeQuestionLetters[j], commonDetails.appendText) //can edit questions with this function as well
                    }
                    ARAddSurveyLessonModal.getShortWait()
                    break;
            }
            cy.get(ARAddSurveyLessonModal.getQuestionSaveBtn()).click()
            ARAddSurveyLessonModal.getShortWait()
        }
        //Save question group
        cy.get(ARAddSurveyLessonModal.getApplyBtn()).click()
        ARAddSurveyLessonModal.getLShortWait()

        //Verify Max 10 answers can be added to a poll type question in second question group
        cy.get(ARAddSurveyLessonModal.getQuestionGroupName()).contains(lessonSurvey.questionGroupNameDefault2).parents(ARAddSurveyLessonModal.getQuestionGroupContainer())
            .within(() => {
                cy.get(ARAddSurveyLessonModal.getManageQuestionsBtn()).click()
            })

        cy.get(ARAddSurveyLessonModal.getAddQuestionBtn()).click()
        ARAddSurveyLessonModal.getShortWait()
        cy.get(ARAddSurveyLessonModal.getQuestionNameTxtF()).type(`${lessonSurvey.questionTypes[1]} Type Question`)
        cy.get(ARAddSurveyLessonModal.getQuestionTypeDDown()).click()
        cy.get(ARAddSurveyLessonModal.getDDownOpt()).contains(lessonSurvey.questionTypes[1]).click()

        for (let j = 0; j < lessonSurvey.tenQuestionLetters.length; j++) {
            ARAddSurveyLessonModal.getAddAnswerByLetter(lessonSurvey.tenQuestionLetters[j], `${lessonSurvey.pollQuestions[0]} - ${j}`)
            if (j != lessonSurvey.tenQuestionLetters.length-1) {
                cy.get(ARAddSurveyLessonModal.getAddAnswerBtn()).click()
            }
        }

        cy.get(ARAddSurveyLessonModal.getAddAnswerBtn()).should('have.attr', 'aria-disabled', 'true') //Verify no more answers can be added
        cy.get(ARAddSurveyLessonModal.getQuestionCancelBtn()).click() //Cancel question creation
        ARAddSurveyLessonModal.getVShortWait()
        //Return to survey lesson
        cy.get(ARAddSurveyLessonModal.getBackBtn()).click()
        ARAddSurveyLessonModal.getLShortWait()

        //Save the survey lesson
        cy.get(ARAddSurveyLessonModal.getSurveySaveBtn()).click()
        ARAddSurveyLessonModal.getMediumWait()

        //Publish course
        cy.publishCourse()
    })

    it('Verify Survey Lesson Edits Persisted, Delete Data', () => {
        cy.editCourse(ocDetails.courseName)
        arOCAddEditPage.getMediumWait()

        //Verify survey lesson persisted and edit it
        arOCAddEditPage.getEditBtnByLessonNameThenClick(lessonSurvey.ocSurveyName + commonDetails.appendText)

        //Verify Details section persisted and delete description
        ARAddSurveyLessonModal.getExpandDetails()
        cy.get(ARAddSurveyLessonModal.getDescriptionTxtF()).should('contain.text', lessonSurvey.ocSurveyDescription + commonDetails.appendText).clear()
        ARAddSurveyLessonModal.getCollapseDetails()

        //Verify Options section persisted
        ARAddSurveyLessonModal.getExpandOptions()
        for (let i = 0; i < lessonSurvey.toggleFuncNames.length-2; i++) {
            if (lessonSurvey.toggleFuncNames[i] != 'getUseAnswerActionsToggleContainer') {
                cy.get(arOCAddEditPage.getElementByDataNameAttribute(ARAddSurveyLessonModal[lessonSurvey.toggleFuncNames[i]]())  + ' ' + arOCAddEditPage.getToggleStatus())
                    .should('have.attr', 'aria-checked', 'false')
            }
        }
        ARAddSurveyLessonModal.getCollapseOptions()

        //Verify Messages section persisted and delete field values
        ARAddSurveyLessonModal.getExpandMessages()
        cy.get(ARAddSurveyLessonModal.getIntroTxtF()).should('contain.text', lessonSurvey.introMessage + commonDetails.appendText).clear()
        cy.get(ARAddSurveyLessonModal.getPostTxtF()).should('contain.text', lessonSurvey.postMessage + commonDetails.appendText).clear()

        //Verify Question section persisted and delete questions and question group
        ARAddSurveyLessonModal.getExpandQuestions()
        ARAddSurveyLessonModal.getShortWait()
        cy.get(ARAddSurveyLessonModal.getQuestionGroupName()).contains(lessonSurvey.questionGroupNameDefault + commonDetails.appendText).parents(ARAddSurveyLessonModal.getQuestionGroupContainer())
            .within(() => {
                cy.get(ARAddSurveyLessonModal.getManageQuestionsBtn()).click()
            })
        
        //Delete Free form question
        ARAddSurveyLessonModal.getDeleteQuestionByName(`${lessonSurvey.questionTypes[0]} Type Question ${commonDetails.appendText}`)
        cy.get(ARAddSurveyLessonModal.getElementByDataNameAttribute(ARDeleteModal.getDeleteBtn())).click()
        ARAddSurveyLessonModal.getShortWait()

        //Edit Single Poll question and delete answer
        ARAddSurveyLessonModal.getEditQuestionByName(`${lessonSurvey.questionTypes[1]} Type Question ${commonDetails.appendText}`)
        ARAddSurveyLessonModal.getShortWait()
        for (let i = lessonSurvey.threeQuestionLetters.length; i > 1; i-- ) {
            ARAddSurveyLessonModal.getDeleteAnswerByLetter(lessonSurvey.threeQuestionLetters[i-1])
        }
        cy.get(ARAddSurveyLessonModal.getQuestionSaveBtn()).click()
        ARAddSurveyLessonModal.getShortWait()
        //Save question group
        cy.get(ARAddSurveyLessonModal.getApplyBtn()).click()
        ARAddSurveyLessonModal.getLShortWait()

        //Delete second question group
        cy.get(ARAddSurveyLessonModal.getQuestionGroupName()).contains(lessonSurvey.questionGroupNameDefault2).parents(ARAddSurveyLessonModal.getQuestionGroupContainer())
            .within(() => {
                cy.get(ARAddSurveyLessonModal.getTrashBtn()).click()
            })
        cy.get(ARAddSurveyLessonModal.getElementByDataNameAttribute(ARDeleteModal.getDeleteBtn())).click()
        ARAddSurveyLessonModal.getShortWait()

        //Save the survey lesson
        cy.get(ARAddSurveyLessonModal.getSurveySaveBtn()).click()
        ARAddSurveyLessonModal.getMediumWait()

        //Publish course
        cy.publishCourse()
    })

    it('Verify Survey Lesson Data Deletes Persisted, Delete Survey Lesson', () => {
        cy.editCourse(ocDetails.courseName)
        arOCAddEditPage.getMediumWait()

        //Verify survey lesson persisted
        arOCAddEditPage.getEditBtnByLessonNameThenClick(lessonSurvey.ocSurveyName + commonDetails.appendText)

        //Verify Details section persisted
        ARAddSurveyLessonModal.getExpandDetails()
        cy.get(ARAddSurveyLessonModal.getDescriptionTxtF()).should('contain.text', '')
        ARAddSurveyLessonModal.getCollapseDetails()

        //Verify Messages section persisted 
        ARAddSurveyLessonModal.getExpandMessages()
        cy.get(ARAddSurveyLessonModal.getIntroTxtF()).should('contain.text', '')
        cy.get(ARAddSurveyLessonModal.getPostTxtF()).should('contain.text', '')

        //Verify Question section persisted
        ARAddSurveyLessonModal.getExpandQuestions()
        ARAddSurveyLessonModal.getShortWait()

        //Verify question and answers delete persisted
        cy.get(ARAddSurveyLessonModal.getQuestionGroupName()).contains(lessonSurvey.questionGroupNameDefault + commonDetails.appendText).parents(ARAddSurveyLessonModal.getQuestionGroupContainer())
            .within(() => {
                cy.get(ARAddSurveyLessonModal.getManageQuestionsBtn()).click()
            })

        //Verify question delete persisted
        cy.get(ARAddSurveyLessonModal.getQuestionName()).contains(`${lessonSurvey.questionTypes[0]} Type Question ${commonDetails.appendText}`)
            .should('not.exist')

        //Verify poll question answers persisted
        ARAddSurveyLessonModal.getEditQuestionByName(`${lessonSurvey.questionTypes[1]} Type Question ${commonDetails.appendText}`)
        ARAddSurveyLessonModal.getShortWait()
        cy.get(ARAddSurveyLessonModal.getPollAnswerLetter()).contains('B').should('not.exist')
        cy.get(ARAddSurveyLessonModal.getQuestionCancelBtn()).click() //Cancel question edit
        ARAddSurveyLessonModal.getVShortWait()
        //Return to survey lesson
        cy.get(ARAddSurveyLessonModal.getBackBtn()).click()
        ARAddSurveyLessonModal.getLShortWait()

        //Verify second question group was deleted
        cy.get(ARAddSurveyLessonModal.getQuestionGroupName()).contains(lessonSurvey.questionGroupNameDefault2).should('not.exist')

        //Return to course from survey lesson
        cy.get(ARAddSurveyLessonModal.getSurveyCancelBtn()).click()
        ARAddSurveyLessonModal.getShortWait()

        //Delete the survey lesson
        arOCAddEditPage.getDeleteBtnByLessonNameThenClick(lessonSurvey.ocSurveyName + commonDetails.appendText)
        cy.get(ARAddSurveyLessonModal.getElementByDataNameAttribute(ARDeleteModal.getDeleteBtn())).click()
        ARAddSurveyLessonModal.getShortWait()

        //Publish course
        cy.publishCourse()
    })

    it('Verify Survey Lesson Delete Persisted', () => {
        cy.editCourse(ocDetails.courseName)
        arOCAddEditPage.getMediumWait()

        //Verify Survey Lesson delete persisted
        cy.get(arOCAddEditPage.getNoLearningObjectMsg()).should('exist')
    })
})