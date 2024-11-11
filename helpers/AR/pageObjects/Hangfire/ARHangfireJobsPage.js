import arBasePage from "../../ARBasePage";

export default new class ARHangfireJobsPage extends arBasePage {

    goToSucceededJobsQAMain() {
        cy.visit('https://qa.myabsorb.com/hangfire-MyAbsorbQA-Main-GUIA_CYPRESS/jobs/succeeded')
    }

    goToSucceededJobsQASecondary() {
        cy.visit('https://qa2.myabsorb.com/hangfire-MyAbsorbQA-Secondary-GUIA_CYPRESS/jobs/succeeded')
    }

    //----- For Jobs Table  -----//

    getJobName() {
        return '[class*="job-method"]'
    }


    //----- For Viewing Individual Job -----//
    
    getParameterString() {
        return '[data-original-title="parameters"] [class*="string"]'
    }






}