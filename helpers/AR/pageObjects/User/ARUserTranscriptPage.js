import arBasePage from "../../ARBasePage";

export default new class ARUserTranscriptPage extends arBasePage {

    // For test Setup - Navigates to Page
    getUserTranscriptPage(userID) {
        cy.visit(`/admin/learnerActivity/transcript/${userID}`)
        cy.get(this.getWaitSpinner()).should('not.exist')
        cy.get(this.getPageHeaderTitle(), { timeout: 15000 }).should('be.visible').and('contain', `User Transcript`)
        
    }

    // Use this text as value for data-name attribute to get this element
    getTranscriptPageTitle() {
        return "title"
    }

    //----- Profile Section -----//


    //----- Completions Section -----//

    getCreditsContainer() {
        return '[class*="user-transcript-credits-module__credits"]'
    }

    getCreditItemContainer() {
        return '[data-name="credit-item-btn"]'
    }

    getCreditAmount() {
        return '[class*="_credit_amount"]'
    }

    getCreditTypeName() {
        return '[class*="_credit_type"]'
    }


    //----- Enrollments Section -----//

    getCourseContainer() {
        return '[data-name="user-transcript-course-enrollment"]'
    }

    getCourseNameCol() {
        return '[data-name="course-name"]'
    }

    getStatusCol() {
        return '[class*="user-transcript-course-enrollment-module__status"]'
    }

    getCreditsCol() {
        return "credits"
    }

    getScoreCol() {
        return "score"
    }


    getCertificateWrapper() {
        return 'a[data-name="certificate-link-wrapper"]'
    }

    getCertificateImage() {
        return '[class*="_certificate_image"]'
    }

    getCertificateName() {
        return '[data-name="course-name"]'
    }
    getUserTranscriptDetailseHeader() {
        cy.get('[data-name="user-transcript"] [data-name="header"]').should(($child) => {
            expect($child).to.contain('Profile');
            expect($child).to.contain('Completions');
            expect($child).to.contain('Enrollments');
        })
    }

    // Added for TC# C2076
    getCreditTotalContainer() {
        return '[class*="_credit_amount"]'
    }

    getCreditTypeNameContainer() {
        return '[class*="_credit_type"]'
    }
    getEnrollmentHeader() {
        return 'h2[data-name="header"]:contains(Enrollments)'
    }
    getEnrollmentTable() {
        return 'table[class="_table_xn1tt_1"]'
    }
    getCertificateContainer() {
        return '[class="_certificates_e90l6_1"]'
    }

    // Added for the TC # C2028
    getCourseName() {
        return '[data-name="course-name"]'
    }
    
    getSubmitBtn() {
        return '[data-name="submit"]'
    }

    getCollapseBtn() {
        return '[data-name="collapse-toggle-undefined"]'
    }

    getCollapseIcon() {
        return '[class*="icon-caret-up"]'
    }

    getTitle() {
        return '[data-name="header"]'
    }
    
    getRightMenuContext() {
        cy.get('[class*="_context_menu_"] [class*="_child_"]').children().should(($child) => {
            expect($child).to.contain('Back')
            expect($child).to.contain('Print Transcript')
            expect($child).to.contain('View Competencies')
            expect($child).to.contain('View Certificates')
            expect($child).to.contain('View Credits')
            expect($child).to.contain('View Enrollments')
        })
    }

    getBackBtn() {
        return '[data-name="back"]'
    }

    getCertificateCourse() {
        return '[class*="_certificate_course_"]'
    }

    getEnrollmentBtn() {
        return '[data-name="view-transcript-enrollments-context-button"]'
    }

    getTable() {
        return '[role="row"]'
    }

    getCertificateBtn() {
        return '[data-name="view-transcript-certificates-context-button"]'
    }

    getCertificateTable() {
        return 'tbody > tr > td'
    }

    getContextBtn() {
        return '[class="confirm-modal has-icon btn"]'
    }

    getModal() {
        return '[data-bind="text: ConfirmText"]'
    }

    getRadioBtn() {
        return '[data-name="radio-button"]'
    }

    getScoreInput() {
        return '[aria-label="Score"]'
    }

    getCompletedOnSec() {
        return '[data-name="dateCompleted"] [data-name="label"]'
    }

    getEnrollmentActivity() {
        return '[data-name="edit-instructor-led-course-enrollment-activity"]'
    }

    // Added for the TC# C940
    getRadioBtn() {
        return '[data-name="radio-button"]'
    }

    getCompetencies() {
        return '[data-name="competency-name"]'
    }

    getCourseName() {
        return '[data-name="course-name"]'
    }

    // Added for the TC# C7327
    getUserTranscriptStatus() {
        return '[data-name="status"] [class*="_status_"]'
    }

    getUserTranscriptScore() {
        return '[data-name="score"]'
    }

    getUserTranscriptCredits() {
        return '[data-name="credits"]'
    }

    getUserTranscriptCompletedDate() {
        return '[data-name="date-completed"]'
    }

    assertStatusAndScoreAndCredit({primaryStatus = 'Not Started', primaryScore = '', primaryCrdit = '', secondaryStatus = 'In Progress', secondaryScore = '0', secondaryCredits = '0', absentStatus = 'Absent', absentScore = '0', absentCredits = '0', finaStatus = 'Complete', finalScore = '100', finalCredits = '0', altStatus = null, altScore = null, altCredits = null} = {}) {
        cy.get(this.getUserTranscriptStatus()).invoke('text').then((text) => {
            if(primaryStatus !== null && text === primaryStatus) {
                cy.get(this.getUserTranscriptStatus()).should('contain', primaryStatus)
                cy.get(this.getUserTranscriptScore()).should('contain', primaryScore)
                cy.get(this.getUserTranscriptCredits()).should('contain', primaryCrdit)  
            } else if (secondaryStatus !== null && text == secondaryStatus) {
                cy.get(this.getUserTranscriptStatus()).should('contain', secondaryStatus)
                cy.get(this.getUserTranscriptScore()).should('contain', secondaryScore)
                cy.get(this.getUserTranscriptCredits()).should('contain', secondaryCredits)  
            } else if (absentStatus !== null && text === absentStatus) {
                cy.get(this.getUserTranscriptStatus()).should('contain', absentStatus)
                cy.get(this.getUserTranscriptScore()).should('contain', absentScore)
                cy.get(this.getUserTranscriptCredits()).should('contain', absentCredits)  
            } else if (finaStatus !== null && text === finaStatus) {
                cy.get(this.getUserTranscriptStatus()).should('contain', finaStatus)
                cy.get(this.getUserTranscriptScore()).should('contain', finalScore)
                cy.get(this.getUserTranscriptCredits()).should('contain', finalCredits)  
            } else if (altStatus !== null) {
                cy.get(this.getUserTranscriptStatus()).should('contain', altStatus)
                cy.get(this.getUserTranscriptScore()).should('contain', altScore)
                cy.get(this.getUserTranscriptCredits()).should('contain', altCredits)  
            }
        })
    }

    getUserTranscriptCourseSession() {
        return '[data-name="instructor-led-course-sessions"]'
    }

    getUserTranscriptCreditInput(){
        return '[aria-labelledby="multiple-credits-label"] input[class*="_input"]'
    }

    // Added for the JIRA# AUT-578, TC# C2038
    getUserProfileSec() {
        return '[data-name="Profile"]'
    }

    getUserTransBadge() {
        return '[data-name="badge"]'
    }

    getUserTransCompetency() {
        return '[data-name="competency-name"]'
    }
    
    // Added for the JIRA# AUT-602 / TC# C2086
    getUserTranscriptMenu () {
        return 'button[title="User Transcript"]'
    }

    getUserTranscriptUserProfile () {
        return '[class*="_user_info"]'
    }

    getUserTranscriptTimeMsg () {
        return '[data-name="time-format-message"]'
    }
    
    getTranscriptTimeDisplayMessage(timeZone) {
        return `Times Displayed in ${timeZone}`
    }

    // Added for the JIRA# AUT-571, TC# C2029
    getUserTransCertificate() {
        return '[class*="_certificate_course_"]'
    }

    getBreadCrumOrderItem() {
        return `[aria-label="Breadcrumb"] [data-name="item"]`
    }
    
    getDefaultAvatar() {
        return '[data-name="default-avatar"]'
    }

    getUserFields() {
        return '[data-name="user-fields"]'
    }

    getAvatarImageContainer () {
        return '[class*="_avatar_image"][class*="_image_container"]'
    }

    getSummaryFieldIcon() {
        return  this.getUserFields() + ' [class*="_field_icon"]'
    }

    verifySummaryFieldIcon() {
        cy.get(this.getSummaryFieldIcon()).should('have.class', 'icon-pencil-rename')
        cy.get(this.getSummaryFieldIcon()).should('have.class', 'icon-at-symbol')
        cy.get(this.getSummaryFieldIcon()).should('have.class', 'icon-flowchart')
        cy.get(this.getSummaryFieldIcon()).should('have.class', 'icon-grad-hat')
        cy.get(this.getSummaryFieldIcon()).should('have.class', 'icon-clock-simple')
        cy.get(this.getSummaryFieldIcon()).should('have.class', 'icon-stopwatch')
    }

    getSummaryUsername () {
        return this.getUserFields() + ' [data-name="username"]'
    }

    getSummaryEmailAddress () {
        return this.getUserFields() + ' [data-name="email"]'
    }

    getSummaryDepartment () {
        return this.getUserFields() + ' [data-name="department"]'
    }

    getLastLoggedIn () {
        return this.getUserFields() + ' [data-name="login"]'
    }
}

// Added for the JIRA# AUT-602 / TC# C2086
export const TranscriptTimeZones = {
    "Alaska": "(UTC-09:00) Alaska"
}