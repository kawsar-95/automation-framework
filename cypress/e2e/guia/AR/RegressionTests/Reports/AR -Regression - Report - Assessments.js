///<reference types="cypress" />

import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage";
import ARAssessmentsReportPage from "../../../../../../helpers/AR/pageObjects/Reports/ARAssessmentsReportPage";
import { users } from "../../../../../../helpers/TestData/users/users";


describe("C6368 - AR - Regress - Report - Assessments ", function () {

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, "/admin");
    })
    it("Report Assessment", function () {
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute("Reports")).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName("Assessments"))
        cy.intercept("/Admin/Assessments/GetAssessments").as("getAssessments").wait("@getAssessments")
        ARAssessmentsReportPage.getShortWait();
        //Asserting Column Header Names
        ARAssessmentsReportPage.getA5TableColumnLabelAssertion()
        //Clicking a record 
        cy.get(ARAssessmentsReportPage.getA5TableCellRecordByColumn(2)).first().click();
        ARAssessmentsReportPage.getShortWait()
        //Asserting Right Action Menu Lable
        ARAssessmentsReportPage.getRightActionMenuLabel()
        ARAssessmentsReportPage.getMediumWait();
        //Navigate to Summery Page 
        ARAssessmentsReportPage.getA5AddEditMenuActionsByNameThenClick("Summary Report");
        cy.get(ARAssessmentsReportPage.getA5PageHeaderTitle()).should('contain', 'Questions Report')
        //Navigate Back
        ARAssessmentsReportPage.getA5AddEditMenuActionsByNameThenClick("Back to Assessments");
        cy.get(ARAssessmentsReportPage.getA5PageHeaderTitle()).should('contain', 'Assessments')
        //Navigate To Assessment Activity
        ARAssessmentsReportPage.getA5AddEditMenuActionsByNameThenClick("Assessment Activity");
        cy.get(ARAssessmentsReportPage.getA5PageHeaderTitle()).should('contain', 'Assessment Activity')
        //Navigate Back
        ARAssessmentsReportPage.getA5AddEditMenuActionsByNameThenClick("Back to Assessments");
        cy.get(ARAssessmentsReportPage.getA5PageHeaderTitle()).should('contain', 'Assessments')
        //Navigate to Answers Report
        ARAssessmentsReportPage.getA5AddEditMenuActionsByNameThenClick("Answers Report");
        cy.get(ARAssessmentsReportPage.getA5PageHeaderTitle()).should('contain', 'Answers Report')
        //Navigate Back
        ARAssessmentsReportPage.getA5AddEditMenuActionsByNameThenClick("Back");
        cy.get(ARAssessmentsReportPage.getA5PageHeaderTitle()).should('contain', 'Assessments')

    })
})