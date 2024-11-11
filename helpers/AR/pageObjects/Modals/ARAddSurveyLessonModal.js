import arBasePage from "../../ARBasePage";

export default new class ARAddSurveyLessonModal extends arBasePage {

    getErrorTxtFClass() {
        return '[data-name="error"]'
    }

    //----- Details Section -----//

    getExpandDetails() {
        cy.get(this.getElementByAriaLabelAttribute("Expand Details") + ' ' + this.getCaretDownBtn()).click()
    }

    getCollapseDetails() {
        cy.get(this.getElementByAriaLabelAttribute("Collapse Details") + ' ' + this.getCaretUpBtn()).click()
    }

    getNameTxtF() {
        return '[data-name="survey-general"] [name="name"]'
    }

    getDescriptionTxtF() {
        return '[data-name="survey-general"] [aria-label="Description"]'
    }

    //----- Options Section -----//

    getExpandOptions() {
        cy.get(this.getElementByAriaLabelAttribute("Expand Options") + ' ' + this.getCaretDownBtn()).click()
    }

    getCollapseOptions() {
        cy.get(this.getElementByAriaLabelAttribute("Collapse Options") + ' ' + this.getCaretUpBtn()).click()
    }

    getAllowMultipleAttemptsToggleContainer() {
        return "allowMultipleAttempts"
    }

    getMaxAttemptsTxtF() {
        return `[name="maximumNumberOfAttempts"]`
        //this.getElementByDataNameAttribute("maximumNumberOfAttempts") + ' ' + this.getNumF()
    }

    getRandomizeQuestionsToggleContainer() {
        return "randomizeQuestionOrder"
    }

    getRandomizeAnswersToggleContainer() {
        return "randomizeAnswerOrder"
    }

    getUseAnswerActionsToggleContainer() {
        return "useAnswerBasedActions"
    }

    getAllowScoredAnswersToggleContainer() {
        return "allowScoredAnswers"
    }

    getSinglePageLayoutToggleContainer() {
        return "singlePageLayout"
    }

    getShowNavigationToggleContainer() {
        return "showNavigation"
    }

    getAllowNavigationToggleContainer() {
        return "allowNavigation"
    }


    //----- Messages Section -----//

    getExpandMessages() {
        cy.get(this.getElementByAriaLabelAttribute("Expand Messages") + ' ' + this.getCaretDownBtn()).click()
    }

    getCollapseMessages() {
        cy.get(this.getElementByAriaLabelAttribute("Collapse Messages") + ' ' + this.getCaretUpBtn()).click()
    }

    getIntroTxtF() {
        return this.getElementByDataNameAttribute("introductionMessage") + ' ' + this.getWSIWYGTxtF()
    }

    getPostTxtF() {
        return this.getElementByDataNameAttribute("completionMessage") + ' ' + this.getWSIWYGTxtF()
    }


    //----- Questions Section -----//

    getExpandQuestions() {
        cy.get(this.getElementByAriaLabelAttribute("Expand Questions") + ' ' + this.getCaretDownBtn()).click()
    }

    getQuestionGroupContainer() {
        return '[data-name="question-group"]'
    }

    getQuestionGroupName() {
        return '[data-name="name"]'
    }

    getQuestionGroupNameTxtF() { //Use inside of a within(() => {}) function after targeting the group
        return this.getTxtF()
    }

    getManageQuestionsBtn() {
        return '._button_4zm37_1._edit_questions_13kyb_13 > ._icon_4zm37_21.icon.icon-pencil'
    }

    getAddQuestionGroupBtn() {
        return '[data-name="add-group"]'
    }

        //--- For Managing Questions Section ---//

        getQuestionsModal() {
            return '[class*="survey-questions-modal-module__survey_questions_modal"]'
        }

        getAddQuestionBtn() {
            return '[data-name*="add-question"]'
        }

        getApplyBtn() {
            return this.getQuestionsModal() + ' ' + this.getSaveDiskBtn()
        }

        getBackBtn() {
            return this.getQuestionsModal() + ' ' + this.getBackIconBtn()
        }

            //--- For Adding/Editing Question Section ---//

            getQuestionModal() {
                return '[class*="survey-question-modal"]'
            }

            getQuestionContainer() {
                return '[class*="survey-questions-modal-module__drag_item_container"]'
            }

            getQuestionName() {
                return '[class*="survey-question-item-module__name"]'
            }

            getEditQuestionByName(name) {
                cy.get(this.getQuestionName()).contains(name).parents(this.getQuestionContainer()).within(() => {
                    cy.get(this.getPencilBtn()).click()
                })
            }

            getDeleteQuestionByName(name) {
                cy.get(this.getQuestionName()).contains(name).parents(this.getQuestionContainer()).within(() => {
                    cy.get(this.getTrashBtn()).click()
                })
            }

            getQuestionNameTxtF() {
                return this.getElementByAriaLabelAttribute("Question")
                //this.getModal() + ' ' + this.getElementByAriaLabelAttribute("Question") + ' ' + this.getTextAreaF()
            }

            getQuestionTypeDDown() {
                return this.getElementByDataNameAttribute("questionType") + ' ' + this.getDDown()
            }

            getRestrictInputDDown() {
                return this.getElementByDataNameAttribute("freeFormInputType") + ' ' + this.getDDown()
            }

            getCharacterLimitTxtF() {
                return "Character Limit" //aria-label
            }

            getAddAnswerBtn() {
                return '[class*="survey-question-modal-module__add_button"]'
            }

            getPollAnswerContainer() {
                return '[class*="survey-question-modal-module__drag_item_container"]'
            }

            getPollAnswerLetter() {
                return '[class*="expandable-list-item-header-module__indicator"]'
            }

            //Pass the letter of the answer container and answer to be typed in
            getAddAnswerByLetter(letter, answer) {
                cy.get(this.getPollAnswerLetter()).contains(letter).parents(this.getPollAnswerContainer()).within(() => {
                    cy.get(this.getTxtF()).type(answer)
                })
            }

            //Pass the letter of the answer container to be deleted
            getDeleteAnswerByLetter(letter) {
                cy.get(this.getPollAnswerLetter()).contains(letter).parents(this.getPollAnswerContainer()).within(() => {
                    cy.get(this.getTrashBtn()).click()
                })
            }

            getAttachmentRadioBtn() {
              return this.getElementByDataNameAttribute("attachment") + ' ' + '[data-name*="radio-button"]'
            }

            getUrlTxtF() {
              return this.getElementByDataNameAttribute("attachment") + ' ' + this.getTxtF()
            }

            getQuestionSaveBtn() {
              return this.getQuestionModal() + ' ' + this.getSaveBtn()
            }
            
            getQuestionCancelBtn() {
                return this.getQuestionModal() + ' ' + this.getCancelIconBtn()
            }

    //---------------------------------------//

    getSurveySaveBtn() {
        return this.getModal() + ' ' + this.getSaveDiskBtn()
    }

    getSurveyCancelBtn() {
        return this.getModal() + ' ' + this.getCancelIconBtn()
    }

}