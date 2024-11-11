import AROCAddEditPage from "../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARAddObjectLessonModal from "../../../../../../helpers/AR/pageObjects/Modals/ARAddObjectLessonModal"
import ARSelectLearningObjectModal from "../../../../../../helpers/AR/pageObjects/Modals/ARSelectLearningObjectModal"
import { users } from "../../../../../../helpers/TestData/users/users"

describe('C7302 - AUT-683 - Learning Object - Observation Checklist', () => {
    beforeEach(() => {
        cy.apiLoginWithSession(
            users.sysAdmin.admin_sys_01_username,
            users.sysAdmin.admin_sys_01_password,
            "/admin"
        )
    })
    it('Observation Checklist', () => {
        ARDashboardPage.getMediumWait()
        //Click on Courses
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        // Click on Courses
        ARDashboardPage.getMenuItemOptionByName('Courses')
        ARDashboardPage.getMediumWait()

        // Click on Add Online Course & Move the toggle button of status to Active &Enter Course Name in the title field
        cy.createCourse('Online Course')

        // Enter Chapter name in chapter name field
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Chapter 1 of 1')).within(() => {
            cy.get(ARDashboardPage.getTxtF()).clear().type('Chapter One')
        })
        // Click on Add learning object tab
        cy.get(AROCAddEditPage.getAddLearningObjectBtn()).click()
        ARSelectLearningObjectModal.getObjectTypeByName('Observation Checklist')
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()
        ARDashboardPage.getMediumWait()

        // Enter name in name  field under details
        ARAddObjectLessonModal.getTxtFByName('Name', 'Observation Lesson Object')
        cy.get(ARDashboardPage.getElementByDataNameAttribute('reviewerIds')).within(() => {
            // Select reviewer from dropdown list in Reviewer(s) field
            cy.get(ARDashboardPage.getElementByDataNameAttribute('selection')).click()
            cy.get(ARDashboardPage.getListItem()).eq(0).click({ force: true })
        })
        // In checklist,Click on Add section button and enter section name in name field
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Expand Checklist')).click()
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Section 1 of 1')).within(() => {
            cy.get(ARDashboardPage.getTxtF()).clear().type('Section One')
            // Click on Manage Steps button under section
            cy.get(ARAddObjectLessonModal.getManageStepsBtn()).click()
        })
        cy.get(ARDashboardPage.getElementByDataNameAttribute('add-step')).contains('Add Step').click()
        cy.get(ARDashboardPage.getTxtF() + ARDashboardPage.getElementByNameAttribute('title')).clear().type('Step 2')
        ARDashboardPage.getShortWait()
        // Click on save button
        cy.get(ARAddObjectLessonModal.getAddStepSaveBtn()).click({force: true})
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getElementByDataNameAttribute('submit')).contains('Apply').click()
        cy.get(ARAddObjectLessonModal.getApplyBtn()).click()
    })
})