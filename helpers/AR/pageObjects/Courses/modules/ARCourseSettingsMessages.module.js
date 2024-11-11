import ARBasePage from "../../../ARBasePage";

export default new class ARCourseSettingsMessagesModule extends ARBasePage {
   
    getSendEmailNotificationToggleContainer() {
        return "allowNotifications";
    }

    getEmailNotificationsChkBox() {
        return '[data-name="course-notification"] [class*="_title"]' 
    }

    //Pass the checkbox label and expected state to verify (true/false)
    getChkBoxStateByLabel(label, state) {
        cy.get('[data-name="course-notification"]').contains(label).parents('[class*="_send_notification"]').within(() => {
            cy.get('[class*="_input_container"]').children().should('have.attr', 'aria-checked', state)
        })
    }

    getEmailDescriptionBanner() {
        return '[data-name="course-notification"] [class*="_description"]'
    }
    verifyEmailEnrollmentDescriptionBanner(){
        cy.get('[aria-label="Send enrollment email"]').parent().find('[data-name="description"]').should('contain',"Custom 'enrollment' email will be sent.")
    }
    verifyEmailCompletionDescriptionBanner(){
        cy.get('[aria-label="Send completion email"]').parent().find('[data-name="description"]').should('contain',"Custom 'completion' email will be sent.")
    }

    //Pass the email type label to click the toggle button
    getCustomTemplateToggleThenClick(label, num = 0) {
        cy.get('[data-name="course-notification"]').contains(label).parents('[data-name="course-notification"]').within(() => {
            cy.get('[class*="_toggle_button"]').eq(num).click()
        })
    }

    //Pass the email type label to click the edit template button (only available if the use custom template toggle is ON)
    getEditTemplateThenClick(label) {
        cy.get('[data-name="course-notification"]').contains(label).parents('[data-name="course-notification"]').within(() => {
            cy.get('[class*="icon icon-pencil"]').click()
        })
    }


    //----- Session Reminder Section Fields -----//

    getYearsTxtF() {
        return '[name="frequency-years"]' 
    }

    getMonthsTxtF() {
        return '[name="frequency-months"]' 
    }

    getDaysTxtF() {
        return '[name="frequency-days"]' 
    }

    getHoursTxtF() {
        return '[name="frequency-hours"]' 
    }

    //Pass lowercase field name
    getErrorMsgByFieldName(name) {
        return `[data-name="frequency-${name}"] [class*="_error"]` 
    }

    getMaxRemindersTxtF() {
        return '[name="maxReminderCount"]'
    }

    getMaxRemindersErrorMsg() {
        return `[data-name="maxReminderCount"] [class*="_error"]` 
    }

    getErrorMsg () {
        return `[class*="_error"]`
    }
    
}