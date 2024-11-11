import arBasePage from "../../ARBasePage";

export default new class AREditActivityPage extends arBasePage {

     // Inherits elements from ARBasePage
    
    getEditILCSessionEnrollmentDDown() {
       return `[data-name="instructor-led-course-sessions"] [data-name="session-name"]`
    }
    
    getMarkEnrollmentAsRadioBtn(enrollmentStatus) {
        cy.wrap(this.getMediumWait())
        cy.get('[class*="_radio_button_6rnpz_1"]').find('span').each(($e1) => {
            const label = $e1.text()
            if(label === enrollmentStatus){
                cy.wrap($e1).click();
            }
        })
    }
    getMarkEnrollmentAs2RadioBtn(enrollmentStatus) {
        cy.wrap(this.getMediumWait())
        cy.get('[role="dialog"] [data-name="radio-button"]').find('span').each(($e1) => {
            const label = $e1.text()
            if(label === enrollmentStatus){
                cy.wrap($e1).click();
            }
        })
    }
    getScoreEnrollmentTxtF(){
        return '[name="score"]'
    }
    getCreditEnrollmentTxtF(){
        return '[data-name="multiple-credits"]  [class*="_input_19krc_4"]'
    }
    getExpiryDatePickerBtnThenClick() {
        cy.get('[data-name="edit-online-course-enrollment-activity"] [data-name="dateExpires"]').within(() => {
            cy.get('[class*="icon icon-calendar"]').click()
        })
    }
    getExpirytDateTimeBtn() {
        return '[data-name="dateExpires"] [class*="icon icon-clock"]'
    }
    getDueDatePickerBtnThenClick() {
        cy.get('[data-name="dateDue"]').within(() => {
            cy.get('[class*="icon icon-calendar"]').click()
        })
    }
    getDuetDateTimeBtn() {
        return '[data-name="dateDue"] [class*="icon icon-clock"]'
    }
    getEnrollmentLessonActivityDeatils(){
        return '[data-name*="lesson-enrollment-activity"] [data-name="lesson-name"]'
    }
    getEnrollmentLessonEditActivityDeatils(){
        cy.get('[data-name*="lesson-enrollment-activity"]').within(() => {
            cy.get('[class*="icon icon-pencil"]').click()
        })
    }
    getLessonActivitySaveBtn(){
        return '[role="dialog"] [data-name="save"]'
    }

    // Added for the JIRA# AUT-578, TC# C2038
    getRadioBtn() {
        return '[name="radio-group-1"]'
    }

}