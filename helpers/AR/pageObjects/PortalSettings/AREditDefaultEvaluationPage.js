import LECatalogPage from "../../../LE/pageObjects/Catalog/LECatalogPage";
import LECoursesPage from "../../../LE/pageObjects/Courses/LECoursesPage";
import LEDashboardPage from "../../../LE/pageObjects/Dashboard/LEDashboardPage";
import LEFilterMenu from "../../../LE/pageObjects/Menu/LEFilterMenu";
import { commonDetails } from "../../../TestData/Courses/commonDetails";
import { userDetails } from "../../../TestData/users/UserDetails";
import { users } from "../../../TestData/users/users";
import ARBasePage from "../../ARBasePage";
import ARILCAddEditPage from "../Courses/ILC/ARILCAddEditPage";
import ARAddMoreCourseSettingsModule from "../Courses/modules/ARAddMoreCourseSettings.module";
import ARCourseSettingsAttributesModule from "../Courses/modules/ARCourseSettingsAttributes.module";
import ARDashboardPage from "../Dashboard/ARDashboardPage";
import ARAddObjectLessonModal from "../Modals/ARAddObjectLessonModal";
import AREnrollUsersPage from "../User/AREnrollUsersPage";

export default new (class AREditDefaultEvaluationPage extends ARBasePage {

    getDefaultEvaluationTab() {
        return 'a[data-tab-menu="DefaultEvaluation"]'
    }

    getPlusIconSpan() {
        return 'span[class*="icon-plus"]'
    }

    getDefaultEvaluationContainer() {
        return 'div[data-tab="DefaultEvaluation"]'
    }

    getAddEvaluationQuestionBtn() {
        return `${this.getDefaultEvaluationContainer()} ${this.getPlusIconSpan()}`
    }

    getEditableQuestionContainer() {
        return 'li[class*="list-group-item"][class*="grey"][class*="editing"]'
    }

    getQuestionTextInput() {
        return 'textarea'
    }

    getAddUpdteQuestionCheckmark() {
        return 'span[class*="icon-checkmark"]'
    }

    getQuestionTitle() {
        return '[class*="course-evaluation-module__question_title"]'
    }

    getDefaultEvaluationQuestionContainer() {
        return '[class*="list-group-item-top"]'
    }

    getDefaultEvaluationQuestionText() {
        return `${this.getDefaultEvaluationQuestionContainer()} > div[class="name-wrapper"] > span > span:nth-of-type(2)`
    }

    getEditQuestionBtn() {
        return 'div[class="btn-wrapper"] > a:nth-of-type(2)'
    }

    getDeleteQuestionBtn() {
        return 'div[class="btn-wrapper"] > a:nth-of-type(3)'
    }

    getDefaultEvaluationQuestionContainerInCouse() {
        return '[data-name="course-evaluation-question"] div[class*="_expanded"]'
    }    
    
    // It's within the course
    getDefaultEvaluationQuestionTxt() {
        return `${this.getDefaultEvaluationQuestionContainerInCouse()} textarea`
    }

    getEvaluationQuestionName() {
        return this.getElementByDataName('name')
    }

    getQuestionNameContainer() {
        return 'div[class*="_header_"]'
    }

    getExpandQuestionBtn() {
        return 'button[data-name="visibility-toggle"]'
    }

    getRemoveQuestionBtn() {
        return 'button[data-name="remove"]'
    }

    prepareILCCourseWithDefaultEvaluationQuestionsInCourse(ilcCourseName, questionText, action = 'add', oldQuestinText = null) {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getCoursesReport()
        if (action === 'modify' || action === 'delete') {
            cy.editCourse(ilcCourseName)
        } else if (action === 'add') {
            cy.createCourse('Instructor Led', ilcCourseName)
        }
        // Open Attribute Settings
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Attributes')).click()
        // Click once again to bring the course attribute settings in the view
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Attributes'), {timeout: 3000}).click()
        // Enable course evaluation
        ARILCAddEditPage.generalToggleSwitch('true', 'enableEvaluation')
        // Enable learner can evaluate the course any time
        ARILCAddEditPage.generalToggleSwitch('true', 'allowEvaluationAnyTime')
        
        if (action === 'add') {
            // Add default evaluation questions
            cy.get(ARCourseSettingsAttributesModule.getUseDefaultQuestionsBtn()).click()
            cy.get(ARAddObjectLessonModal.getAddQuestions(), {timeout: 3000}).click()    
            cy.get(this.getDefaultEvaluationQuestionTxt()).clear().type(questionText)
        } else if (action === 'modify') {
            cy.get(this.getEvaluationQuestionName()).contains(oldQuestinText).closest(this.getQuestionNameContainer()).within(() => {
                cy.get(this.getExpandQuestionBtn()).click()
                
            })
            cy.get(this.getDefaultEvaluationQuestionTxt()).clear().type(questionText)
        } else if (action === 'delete') {
            cy.get(this.getEvaluationQuestionName()).contains(questionText).closest(this.getQuestionNameContainer()).within(() => {
                cy.get(this.getRemoveQuestionBtn()).click()
            })
        }
        
        // Publish a course and catpure its id and enroll user only when the action is 'add'
        if (action === 'add') {
            // publish the course
            cy.publishCourseAndReturnId().then((id) => {
                commonDetails.courseIDs.push(id.request.url.slice(-36))
            })
            AREnrollUsersPage.getEnrollUserByCourseAndUsername([ilcCourseName], [userDetails.username])
        } else {
            // Just publish the course
            cy.publishCourse()
        }
    }

    verifyDefaultEvaluationQuestion(ilcCourseName, questionToVerify, exists = true) {
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword) 
        LEDashboardPage.getTileByNameThenClick('My Courses')
        cy.get(LEDashboardPage.getLEEllipsesLoader(), {timeout: 15000}).should('not.exist')
    
        // Open filter panel
        // Seach course name in catalog
        LEFilterMenu.SearchForCourseByName(ilcCourseName)
        LECatalogPage.getCourseCardBtnThenClick(ilcCourseName)
    
        cy.get(LECoursesPage.getEvaluateCourseBtn()).click()
        if (exists === true) {
            // Verify that the default evaluation question is present at the learner side
            cy.get(this.getQuestionTitle()).contains(questionToVerify)
        } else {
            // Verify that the default evaluation question is NOT present at the learner side
            cy.get(this.getQuestionTitle()).should('not.include.text', questionToVerify)
        }
    }
})

export const defaultEvaluationQuestion = {
    "DEFAULT_QUESTION_1": "Custom default question 1",
    "DEFAULT_QUESTION_MODIFIED_1": "Custom default question 1 - modified"
}