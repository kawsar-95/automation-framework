import WYSIWYGEditorModule from "../../../../../../helpers/AR/modules/WYSIWYGEditor.module"
import AROCAddEditPage from "../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARAddObjectLessonModal from "../../../../../../helpers/AR/pageObjects/Modals/ARAddObjectLessonModal"
import ARSelectLearningObjectModal from "../../../../../../helpers/AR/pageObjects/Modals/ARSelectLearningObjectModal"
import { lessonAssessment, lessonSurvey, ocDetails } from "../../../../../../helpers/TestData/Courses/oc"
import { file } from "../../../../../../helpers/TestData/GlobalResources/globalResources"
import { users } from "../../../../../../helpers/TestData/users/users"

describe('AUT-99 - C883 - GUIA-Story - NASA-T564 - NASA-3059 - An Absorb Assessment Displays Messages to a User in Rich Text (cloned)', () => {

    beforeEach('Login as a System Admnin and navigate to the Courses Report Page', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getCoursesReport()
    })

    it('Create an Online course, add assessment, allow failure, turn on randomize question and answer and save', () => {
        // Create an active Online course
        cy.createCourse('Online Course', ocDetails.courseName)
        // Add Assessment lesson object to the course 
        cy.get(AROCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
        ARSelectLearningObjectModal.getObjectTypeByName('Assessment')
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()
        ARAddObjectLessonModal.getTxtFByName('Assessment Name', lessonAssessment.ocAssessmentName)

        // Expand options dropdown under Assessment  
        cy.get(ARAddObjectLessonModal.getExpandMessageToggleBtn()).click()
        // Verify that the Intro message can be formatted and a link can be added and a link can be inserted
        cy.get(WYSIWYGEditorModule.getRichTextBody(ARAddObjectLessonModal.getIntroMessageContainer())).type(lessonAssessment.introMessage)
        cy.get(WYSIWYGEditorModule.getRichTextBody(ARAddObjectLessonModal.getIntroMessageContainer())).type('{selectAll}')
        cy.get(WYSIWYGEditorModule.getOrderedListBtn(ARAddObjectLessonModal.getIntroMessageContainer())).click()

        // Verify clicking insert hyper link for the intro message
        cy.get(WYSIWYGEditorModule.getRichTextBody(ARAddObjectLessonModal.getIntroMessageContainer())).clear().type('body')
        cy.get(WYSIWYGEditorModule.getRichTextBody(ARAddObjectLessonModal.getIntroMessageContainer())).type('{selectall}')  
        cy.get(WYSIWYGEditorModule.getInsertHyperLinkToolBtn(ARAddObjectLessonModal.getIntroMessageContainer())).click()    
        ARAddObjectLessonModal.getMediumWait()  
        cy.get(WYSIWYGEditorModule.getHyperLinkInput()).clear().type(file.fileName2)        
        cy.get(WYSIWYGEditorModule.getInsertHyperLinkBtn(ARAddObjectLessonModal.getIntroMessageContainer())).click()

        // Verify that the Post message can be formatted and a link can be added and a link can be inserted
        cy.get(WYSIWYGEditorModule.getRichTextBody(ARAddObjectLessonModal.getPostMessageContainer())).type(lessonAssessment.postMessage)
        cy.get(WYSIWYGEditorModule.getRichTextBody(ARAddObjectLessonModal.  getPostMessageContainer())).type('{selectAll}')
        cy.get(WYSIWYGEditorModule.getOrderedListBtn(ARAddObjectLessonModal.getPostMessageContainer())).click()

        // Verify clicking insert hyper link for the post message
        cy.get(WYSIWYGEditorModule.getRichTextBody(ARAddObjectLessonModal.getPostMessageContainer())).clear().type('body')
        cy.get(WYSIWYGEditorModule.getRichTextBody(ARAddObjectLessonModal.getPostMessageContainer())).type('{selectall}')  
        cy.get(WYSIWYGEditorModule.getInsertHyperLinkToolBtn(ARAddObjectLessonModal.getPostMessageContainer())).click({force: true})      
        cy.get(WYSIWYGEditorModule.getHyperLinkInput()).clear().type(file.fileName2)        
        cy.get(WYSIWYGEditorModule.getInsertHyperLinkBtn(ARAddObjectLessonModal.getPostMessageContainer())).click()

        // Verify that the Fail message can be formatted and a link can be added and a link can be inserted
        cy.get(WYSIWYGEditorModule.getRichTextBody(ARAddObjectLessonModal.getFailMessgeContainer())).type(lessonAssessment.failMessage)
        cy.get(WYSIWYGEditorModule.getRichTextBody(ARAddObjectLessonModal. getFailMessgeContainer())).type('{selectAll}')
        cy.get(WYSIWYGEditorModule.getOrderedListBtn(ARAddObjectLessonModal.getFailMessgeContainer())).click()

    })
})