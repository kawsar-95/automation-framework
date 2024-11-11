import arBasePage from "../../ARBasePage";

export default new class ARGeneratedReportsPage extends arBasePage {

  getGeneratedReportsDownloadReportBtn() {
    return 'a[class*="generated-reports-report-module"]';
  }

  getGeneratedReportsDeleteGenReportBtn() {
    return 'button[title*="Delete Generated Report"]';
  }

  getAndClickCreateNewExportButton(n = 0) {
    return cy.get('div[class*="margin-top-20"]').eq(n).click()
  }

  getSideBarDeselectBtn() {
    return '[class*="grid-deselect"]';
  }
};