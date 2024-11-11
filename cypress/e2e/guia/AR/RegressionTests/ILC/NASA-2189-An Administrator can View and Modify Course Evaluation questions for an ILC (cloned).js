import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARCourseSettingsAttributesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsAttributes.module'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import ARILCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../helpers/TestData/users/users'
import { ilcDetails } from '../../../../../../helpers/TestData/Courses/ilc'
import AREnrollUsersPage from '../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage'
import { userDetails } from '../../../../../../helpers/TestData/users/UserDetails'
import AREditDefaultEvaluationPage, {defaultEvaluationQuestion} from '../../../../../../helpers/AR/pageObjects/PortalSettings/AREditDefaultEvaluationPage'
import AREditClientUserPage from '../../../../../../helpers/AR/pageObjects/PortalSettings/AREditClientUserPage'


describe('AUT-151 - C948 - GUIA-Plan - NASA - 2189 - An Administrator can View and Modify Course Evaluation questions for an ILC (cloned)', () => {

    before('Create a test Learners and an ILC course for the test', () => {
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0) //Create a Learner
    })    

    it('Can add a default question in the Portal Settings', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getPortalSettingsMenu()
        cy.get(AREditDefaultEvaluationPage.getDefaultEvaluationTab(), {timeout: 7500}).click()
        cy.get(AREditDefaultEvaluationPage.getAddEvaluationQuestionBtn()).click()
        cy.get(AREditDefaultEvaluationPage.getEditableQuestionContainer()).within(() => {
            cy.get(AREditDefaultEvaluationPage.getQuestionTextInput()).clear().type(defaultEvaluationQuestion.DEFAULT_QUESTION_1)
            // Add the question
            cy.get(AREditDefaultEvaluationPage.getAddUpdteQuestionCheckmark()).click()
        })
        cy.get(AREditClientUserPage.getSaveBtn()).click()
        cy.get(AREditClientUserPage.getA5PageHeaderTitle(), {timeout: 75000}).contains('Clients')
    })

    it('Add an ILC course with newly added default evaluation question', () => {
        ARILCAddEditPage.addILCCourseWithDefaultEvaluationQuestions(ilcDetails.courseName)
    })

    it('Verify that the newly added default question is reflected in the learner side', () => {
        AREditDefaultEvaluationPage.verifyDefaultEvaluationQuestion(ilcDetails.courseName, defaultEvaluationQuestion.DEFAULT_QUESTION_1)
    })

    it('Can edit a default question in the Portal Settings', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getPortalSettingsMenu()
        cy.get(AREditDefaultEvaluationPage.getDefaultEvaluationTab(), {timeout: 7500}).click()
        cy.get(AREditDefaultEvaluationPage.getDefaultEvaluationQuestionText()).contains(defaultEvaluationQuestion.DEFAULT_QUESTION_1).closest(AREditDefaultEvaluationPage.getDefaultEvaluationQuestionContainer()).within(() => {
            cy.get(AREditDefaultEvaluationPage.getEditQuestionBtn()).click()
        })
        cy.get(AREditDefaultEvaluationPage.getEditableQuestionContainer()).within(() => {
            cy.get(AREditDefaultEvaluationPage.getQuestionTextInput()).clear().type(defaultEvaluationQuestion.DEFAULT_QUESTION_MODIFIED_1)
            // Add the question
            cy.get(AREditDefaultEvaluationPage.getAddUpdteQuestionCheckmark()).click()
        })
        cy.get(AREditClientUserPage.getSaveBtn()).click()
        cy.get(AREditClientUserPage.getA5PageHeaderTitle(), {timeout: 75000}).contains('Clients')
    })

    it('Add an ILC course with the modified default evaluation question', () => {
        ARILCAddEditPage.addILCCourseWithDefaultEvaluationQuestions(ilcDetails.courseName2)
    })

    it('Verify that the modified default question is reflected in the learner side', () => {
        AREditDefaultEvaluationPage.verifyDefaultEvaluationQuestion(ilcDetails.courseName2, defaultEvaluationQuestion.DEFAULT_QUESTION_MODIFIED_1)
    })

    it('Can delete a default question in the Portal Settings', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getPortalSettingsMenu()
        cy.get(AREditDefaultEvaluationPage.getDefaultEvaluationTab(), {timeout: 7500}).click()
        cy.get(AREditDefaultEvaluationPage.getDefaultEvaluationQuestionText()).contains(defaultEvaluationQuestion.DEFAULT_QUESTION_1).closest(AREditDefaultEvaluationPage.getDefaultEvaluationQuestionContainer()).within(() => {
            cy.get(AREditDefaultEvaluationPage.getEditQuestionBtn()).click()
        })
        cy.get(AREditDefaultEvaluationPage.getEditableQuestionContainer()).within(() => {
            // Delete the question
            cy.get(AREditDefaultEvaluationPage.getDeleteQuestionBtn()).click()
        })
        cy.get(AREditClientUserPage.getSaveBtn()).click()
        cy.get(AREditClientUserPage.getA5PageHeaderTitle(), {timeout: 75000}).contains('Clients')
    })

    it('Add an ILC course with the deleted default evaluation question', () => {
        ARILCAddEditPage.addILCCourseWithDefaultEvaluationQuestions(ilcDetails.courseName3)
    })

    it('Verify that the deleted default question is not present in the learner side', () => {
        AREditDefaultEvaluationPage.verifyDefaultEvaluationQuestion(ilcDetails.courseName3, defaultEvaluationQuestion.DEFAULT_QUESTION_MODIFIED_1, false)
    })

    
})

describe('GUIA-Plan - NASA - 2189 - An Administrator can View and Modify Course Evaluation questions for an ILC (cloned) - In Course', () => {

    after('Delete the test ILC courses', () => {   
        let i = 0     
        for (; i < commonDetails.courseIDs.length; i++) {
            cy.deleteCourse(commonDetails.courseIDs[i], 'instructor-led-courses-new')
        }
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.deleteUsers([userDetails.username])
    })

    it('Add an ILC course with the custom default evaluation question in the course', () => {
        AREditDefaultEvaluationPage.prepareILCCourseWithDefaultEvaluationQuestionsInCourse(ilcDetails.courseName4, defaultEvaluationQuestion.DEFAULT_QUESTION_1)
    })

    it('Verify that the added custom default question is present in the learner side', () => {
        AREditDefaultEvaluationPage.verifyDefaultEvaluationQuestion(ilcDetails.courseName4, defaultEvaluationQuestion.DEFAULT_QUESTION_1)
    })

    it('Modify an ILC course to update custom default evaluation question in the course', () => {
        AREditDefaultEvaluationPage.prepareILCCourseWithDefaultEvaluationQuestionsInCourse(ilcDetails.courseName4, defaultEvaluationQuestion.DEFAULT_QUESTION_MODIFIED_1, 'modify', defaultEvaluationQuestion.DEFAULT_QUESTION_1)
    })

    it('Verify that the modified custom default question is reflected in the learner side', () => {
        AREditDefaultEvaluationPage.verifyDefaultEvaluationQuestion(ilcDetails.courseName4, defaultEvaluationQuestion.DEFAULT_QUESTION_MODIFIED_1)
    })

    it('Modify an ILC course to delete custom default evaluation question in the course', () => {
        AREditDefaultEvaluationPage.prepareILCCourseWithDefaultEvaluationQuestionsInCourse(ilcDetails.courseName4, defaultEvaluationQuestion.DEFAULT_QUESTION_MODIFIED_1, 'delete')
    })

    it('Verify that the deleted custom default question is NOT present in the learner side', () => {
        AREditDefaultEvaluationPage.verifyDefaultEvaluationQuestion(ilcDetails.courseName4, defaultEvaluationQuestion.DEFAULT_QUESTION_MODIFIED_1, false)
    })
})
