
/**
 *  This is a temporary A5 page created to complete a test workflow.
 *  This file will be deleted as soon as the corresponding AR page is created.
 */

import arBasePage from "../../ARBasePage";

export default new class AR5EnrollmentHistoryPage extends arBasePage {
    
    // Inherits elements from ARBasePage

    selectHistoryBackBtn(){
        return '[class*="has-icon btn cancel"]'
    }

    getHistoryHeaderTxt(){
        return '#content > div.header > div'
    }

    getGridTable(){
        return 'table>tbody > tr >td:nth-child(3)'
    }

    getEditActivityBtn(){
        return 'Edit Activity'
    }
    
    deleteHistoricEnrollment(){
        cy.get('[href="/Admin/Enrollments/DeleteHistoricEnrollments"]').within(() =>{
            cy.contains('Delete').click()
        })
        
        cy.contains('OK').click()
    }
}