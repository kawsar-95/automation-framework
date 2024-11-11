import AROCAddEditPage from "../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARAddTaskLessonModal from "../../../../../../helpers/AR/pageObjects/Modals/ARAddTaskLessonModal"
import ARSelectLearningObjectModal from "../../../../../../helpers/AR/pageObjects/Modals/ARSelectLearningObjectModal"
import { users } from "../../../../../../helpers/TestData/users/users"



describe("C915 - AR - Regression - Task Modal Field Name Change - Grade to Pass ", () => {

    it(" 'Task is Scored' Lable appears in the Modal ", () => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        //Selecting Courses from left menu
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Courses'))
        
        //Creating an online course 
        cy.createCourse('Online Course')
        //Verify Task Lesson Can Be Selected
        cy.get(AROCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
        //Selecting Task Object type
        ARSelectLearningObjectModal.getObjectTypeByName('Task')
        //Clicking on next button
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()
        //Turn on Task is Scored, add Pass Grade & Weight
        cy.get(ARAddTaskLessonModal.getTaskIsScoredToggle()).click()
        //Grade To Pass Assertion
        cy.get(AROCAddEditPage.getElementByDataNameAttribute(ARAddTaskLessonModal.getGradeToPassTxtForDataName())).within(() => {
            cy.get(AROCAddEditPage.getElementByDataNameAttribute(ARAddTaskLessonModal.getLableText())).should('have.text', ARAddTaskLessonModal.getGradeToPassTxt())
        })
        //Grade To Pass
        cy.get(AROCAddEditPage.getElementByAriaLabelAttribute(ARAddTaskLessonModal.getGradeToPassTxt())).clear().type('50')
        //Weight Assertion
        cy.get(AROCAddEditPage.getElementByDataNameAttribute(ARAddTaskLessonModal.getWeightTxtForDataName())).within(() => {
            cy.get(AROCAddEditPage.getElementByDataNameAttribute(ARAddTaskLessonModal.getLableText())).should('have.text', ARAddTaskLessonModal.getWeightTxt())
        })
        //Typing Weight
        cy.get(AROCAddEditPage.getElementByAriaLabelAttribute(ARAddTaskLessonModal.getWeightTxt())).clear().type('12')

    })
})