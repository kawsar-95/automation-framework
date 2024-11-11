import LEBasePage from '../../LEBasePage'

export default new class LECourseDetailsILCModule extends LEBasePage {

    getWaitListBanner() {
        return '[class*="course-on-waiting-list__message"]'
    }

    getWaitListMsg() {
        return "You are currently on the wait list for this class. You will be notified via email when you have been allocated a seat in the specified class. If you wish to switch your enrollment in this course, please find this course in the Add Course or Curricula section and choose another session."
    }

    getSessionContainer() {
        return '[class*="session-module__session_wrapper"]'
    }

    getSessionName() {
        return '[class*="session-module__session_name"]'
    }

    getSessionVenue() {
        return '[class*="session__venue session__header_row_value"]'
    }

    getSessionUrl() {
        return '[class*="session-module__location_wrapper"] > a'
    }

    getEnrolledSessionHeader() {
        return '[class*="session_details__title"]'
    }

    getEnrolledSessionNameTxt() {
        return `[class*="session_details__name"]`;
    }

    getUpcomingSessionsHeader() {
        return `[class*="instructor-led-course-sessions-module__session_header"]`
    }

    getEnrollInSessionByName(name) {
        cy.get(`[class*="session__name"]`).contains(name).parents(this.getSessionContainer()).within(() => {
            cy.get(this.getEnrollBtn()).click()
        })
    }

    getEnrollBtn() {
        return `[class*="action-button-module__title"]`;
    }

    getMoreBtn() {
        return this.getDownArrowIcon()
    }

    getAddToCalendarBtn() {
        return '[class*="session__add_to_calendar_button"]'
    }

    getAddToCalendarBtnDisabled() {
        return '[class*="href-button-module__disabled"]'
    }

    getChangeSessionBtn() {
        return "Change Session";
    }

    getCancelSessionBtn() {
        return "Cancel Session";
    }

    getSessionReccurenceRow() {
        return '[class*="session__recurrence_row"]'
    }

    getViewRecurrencesBtnThenClick() {
        cy.get(this.getSessionReccurenceRow()).within(() => {
            cy.get('[class*="expandable-link__expand_link_title"]').click()
        })
    }

    getWaitListTxt() {
        return '[data-name="waitlist-label"]'
    }

    getWaitListTxtMsg() {
        return "You are on the waitlist for 1 session. You will be notified when you have been allocated a seat."
    }

    getLocationUrl() {
        return '[class*="session__venue"] a'
    }

    getLocationVenue() {
        return '[class*="session__venue"]'
    }

    getSessionHeader() {
        return '[class*="session-module__session_header"]'
    }

    getTabBtn() {
        return '[class*="horizontal-tab-list-module__tab_btn"] > span'
    }

    getSessionMeetingDescriptionTxt() {
        return '[class*="session__meetingDescription"]'
    }

    getChooseViewBtn() {
        return '[title="Choose View"]'
    }

    getCalendarViewBtn() {
        return '[title="Calendar View"]'
    }

    getShoppingCartActionButton() {
        return '[class*="course-detail-header__container"] [class*="action-button-module__btn"]'
    }

    getWarningMessage() {
        return '[class*="instructor-led-course__warning_message"'
    }

    getNoSessionEnrolledYetTitle() {
        return `[class*="no-session-enrolled-module__title"]`
    }
}
