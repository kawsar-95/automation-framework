///<reference types="cypress" />

import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage";
import ARAssessmentsReportPage from "../../../../../../helpers/AR/pageObjects/Reports/ARAssessmentsReportPage";
import { users } from "../../../../../../helpers/TestData/users/users";
/**
 * Testrail URL:
 * https://absorblms.testrail.io/index.php?/cases/view/6387
 */
describe("Assessment Report - C6387", () => {
  beforeEach(() => {
    //Sign into admin side as sys admin, navigate to Courses
    cy.apiLoginWithSession(
      users.sysAdmin.admin_sys_01_username,
      users.sysAdmin.admin_sys_01_password,
      "/admin"
    );
  });
  it("Assessment Report", () => {
    const assessmentName = 'GUIA-CED-OC-2022-11-05T02:13:40+06:00 _Assessment_';
    cy.get(ARDashboardPage.getElementByAriaLabelAttribute("Reports")).click();
    cy.wrap(ARDashboardPage.getMenuItemOptionByName("Assessments"));
    cy.intercept("/Admin/Assessments/GetAssessments")
      .as("getAssessments")
      .wait("@getAssessments");
    ARAssessmentsReportPage.A5AddFilter(
      "Course Name",
      "Starts With",
      assessmentName
    );
    ARAssessmentsReportPage.getShortWait();
    // cy.get(ARAssessmentsReportPage.getA5TableCellRecordByColumn(2)).click();
    cy.get(ARAssessmentsReportPage.getA5TableCellRecord()).contains(assessmentName).click();

    // cy.get(ARAssessmentsReportPage.getElementByTitleAttribute("Summary Report"))
    ARAssessmentsReportPage.getA5AddEditMenuActionsByNameThenClick(
      "Summary Report"
    );
    ARAssessmentsReportPage.getMediumWait();
    cy.get(ARAssessmentsReportPage.getA5PageHeaderTitle()).should('contain', 'Questions Report')
    ///Check the column A for the question where A option is correct
    cy.get(ARAssessmentsReportPage.getA5TableCellRecordByColumn(5)).should(
      "contain",
      "A"
    );
    cy.get(ARAssessmentsReportPage.getA5TableCellRecordByColumn(5)).then(
      (answers) => {
        cy.log(answers.text());
        if (answers.text().includes(',')) {
          const ans = answers.text().split(",");
          expect(ans[1]).to.equal("B");
          const nCorrectAnswers = ans.length;
          cy.get(ARAssessmentsReportPage.getA5TableCellRecordByColumn(3)).then((attemptsDom) => {
            const attempts = parseInt(attemptsDom.text())
            cy.log('Attempts: ' + attempts)
            cy.get(ARAssessmentsReportPage.getA5TableCellRecordByColumn(4)).then(correctDom => {
              const correctPercent = parseInt(correctDom.text())
              cy.get(ARAssessmentsReportPage.getA5TableCellRecordByColumn(6)).should('contain', `${attempts * correctPercent / 100}`)
              cy.get(ARAssessmentsReportPage.getA5TableCellRecordByColumn(8)).should('contain', `${attempts * correctPercent / 100}`)
            })
          })
        }
      }
    );


    ARAssessmentsReportPage.getShortWait();
    // ARAssessmentsReportPage.getA5AddEditMenuActionsByNameThenClick(
    //   "Back to Assessments"
    // )
    ARAssessmentsReportPage.getShortWait();
  });
});
