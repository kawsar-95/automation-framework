import arBasePage from "../../../ARBasePage"
import { ilcDetails, sessions } from "../../../../TestData/Courses/ilc"
import { venueTypes, venues } from "../../../../TestData/Venue/venueDetails"
import { users } from "../../../../TestData/users/users"
import ARCoursesPage from "../ARCoursesPage"
import ARDashboardPage from "../../Dashboard/ARDashboardPage"
import ARAddMoreCourseSettingsModule from "../modules/ARAddMoreCourseSettings.module"
import ARCourseSettingsAttributesModule from "../modules/ARCourseSettingsAttributes.module"
import { commonDetails } from "../../../../TestData/Courses/commonDetails"
import AREnrollUsersPage from "../../User/AREnrollUsersPage"
import { userDetails } from "../../../../TestData/users/UserDetails"

export default new class ARILCAddEditPage extends arBasePage {

    getGeneralSectionErrorMsg() {
        return '[data-name="edit-instructor-led-course-general-section"] [class*="_errors"]'
    }

    // Courses Page Title
    getGeneralStatusToggleContainer() {
        return '#courseStatus '
    }

    getGeneralStatusToggleContainerName() {
        return "course-status";
    }

    getGeneralTitleTxtF() {
        return 'input[aria-label="Title"]'
    }

    getGeneralTitleErrorMsg() {
        return '[data-name="name"] [class*="_error"]'
    }

    getDescriptionErrorMsg() {
        return '[data-name="description"] [class*="_error"]'
    }

    getGeneralLanguageClearBtn() {
        return '[data-name="languageCode"] [class*="_deselect_all_btn"]'
    }

    getSyllabusShowTermsAndConditionToggle() {
        return '[data-name="isDisplayedToLearner"] [class*="_label"]'
    }

    getNoSessionsAddedTxt() {
        return '[data-name="no-sessions"]'
    }

    getUpcomingSessionContainer() {
        return '[class*="_session_item"]'
    }

    getUpcomingSessionName() {
        return '[data-name="name"]'
    }

    getAddSessionModalContainer() {
        return '[class="dialog-module__content--uMFLQ"]'
    }

    getAddSessionModalSubTitle() {
        return '[data-name="label"]'
    }

    getAddSessionModalDropDowns() {
        return '[class="select-option-value-module__label--Hjfin"]'
    }

    getAddSessionModalDropDownItems() {
        return '[class="select-item-module__option--WdWnx"]'
    }

    getAddSessionRepeatEveryFieldErorrMessage() {
        return '[class="error-module__error--IGkTo _error--R4lEF"]'
    }

    getAddSessionModalRadioBtns() {
        return '[class="radio-button-module__label--MXLHW"]'
    }

    getAddSessionNoSessionMessage() {
        return '[data-name="no-sessions"]'
    }

    getAddSessionModalSaveBtn() {
        return 'button[data-name="save"]'
    }
    getAddSessionModalCancelBtn() {
        return 'button[data-name="cancel"]'
    }

    getAddSessionModalSessionDetailsSection() {
        return '[class="edit-instructor-led-course-sessions-module__label--lt63j"]'
    }

    getILCSessionDetailsBtns() {
        return '[class="summary-button-module__title--UrbQf"]'
    }

    getILCSessionOnDayGraphicalSelector() {
        return '[class*="day-of-month-select-module__month"]'
    }

    getILCSessionOnDayDropDown() {
        return '[data-name="dayOfMonth"] [class*="select-field-module__selection"]';
    }

    getILCSessionOnMonthDropDown() {
        return '[data-name="monthOfYear"] [class*="select-field-module__selection"]';
    }

    getILCSessionCalenderItemSelected() {
        return '[class*="calendar-item-module__selected"]'
    }

    getDateInputField() {
        return 'input[aria-label="Date"]'
    }

    //Use this to verify the number of Total/Future/Past sessions displayed. Pass the label and expected # of sessions
    getSessionCountByTimeLabel(label, num) {
        cy.get('[class*="_summary_button"]').contains(label).parent().within(() => {
            cy.get('[class*="_count"]').should('contain', num)
        })
    }

    //Use this to verify the number of occurences in a session - pass the session name and expected # of occurences
    //Pass click = true if you want to click on the recurrence
    getSessionOccurancesByName(name, num, click = false) {
        cy.get(this.getUpcomingSessionName()).contains(name).parent().within(() => {
            cy.get('[data-name*="show-ocurrences"]').should('contain.text', num + ' Occurrences')
            if (click === true) {
                cy.get('[class*="icon icon-caret-down"]').click()
            }
        })
    }

    getSessionOccurenceList() {
        return '[class*="session-occurrence-list-module__occurrences_list"]'
    }

    //Can be used to check if a session exists in the upcoming sessions preview
    getVerifySessionExists() {
        return '[class*="_sessions"] [data-name="name"]'
    }

    getViewAllSessionsBtn() {
        return '[data-name="view-all-sessions"] [class*="icon icon-eye"]'
    }

    //----- For the Add/Edit Session modal -----//

    getAddSessionBtn() {
        return '[data-name="add-session"] [class*="icon icon-plus"]'
    }

    getSessionDetailsTitleTxtF() {
        return '[data-name="session-general"] [data-name="name"] [class*="_text_input"]'
    }

    getSessionDetailsTitleErrorMsg() {
        return '[data-name="name"] [class*="_error"]'
    }

    getSessionDetailsDescriptionTxtF() {
        return '[data-name="session-general"] [aria-label="Description"]'
    }

    getSessionDetailsDescriptionErrorMsg() {
        return '[data-name="description"] [class*="_error"]'
    }

    getSessionDetailsInstructorsDDown() {
        return '[data-name="instructorIds"] [class*="icon icon-arrows-up-down"]'
    }

    getSessionDetailsInstructorsTxt() {
        return "Instructors";
    }

    getSessionDetailsInstructorsTxtF() {
        return '[name="instructorIds"]'
    }
    
    getSessionDetailsInstructorsDDownOpt() {
        return '[class*="_full_name"]';
    }

    getSessionDetailsInstructorsClearBtn() {
        return '[data-name="instructorIds"] [class*="deselect-all-button-module__clear"]'
    }

    getSessionInstructorWarningBanner() {
        return '[class*="notification-banner-module__warning"]'
    }

    getInstructorTimeConflictWarningMsg() {
        return "An instructor scheduled to teach this course has a conflict with this particular date and time."
    }

    getInstructorNoEmailErrorMsg() {
        return "Unable to create a virtual meeting: instructor must have an email address to add as a host to the virtual meeting"
    }

    getInstructorHostErrorMsg() {
        return "Host is not a valid virtual meeting host to create meetings."
    }

    getSessionDetailsVenuesDDown() {
        return '[data-name="venueId"] [class*="icon icon-arrows-up-down"]';
    }

    getSessionDetailsVenuesTxtF() {
        return '[name="venueId"]';
    }

    getSessionDetailsVenuesTxt() {
        return "Venue";
    }

    getSessionDetailsVenuesDDownOpt() {
        return '[aria-label="Venue"] [class*="_label"]';
    }

    getAddVenueBtn() {
        return '[title="Add Venue"]'
    }

    //----- For the Add Venue Form -----//

    getAddVenueNameTxtF() {
        return '[data-name="venue"] [data-name="name"] [class*="text-input-module__text_input"]'
    }

    //need to use cy.get(this.getAddVenueDescription()).eq(1) as the add session modal contains data-name="details" as well.
    getAddVenueDescription() {
        return this.getElementByDataNameAttribute("details") + ' ' + '[class*="fr-element fr-view"]'
    }

    getMaxClassTxtF() {
        return '[data-name="maxClassSize"] [class*="number-input-module__input"]'
    }

    getVenueTypeDDown() {
        return '[data-name="venueType"] [class*="icon icon-arrows-up-down"]';
    }

    getVenueTypeDDownOpt() {
        return '[class*="_select_option_ledtw"]';
    }

    getAddressTxtF() {
        return this.getElementByDataNameAttribute("address") + ' ' + this.getTxtF()
    }

    getCountryDDown() {
        return this.getElementByDataNameAttribute("countryCode") + ' ' + '[class*="select-field-module__select_field"]'
    }

    getCountryDDownTxtF() {
        return this.getElementByDataNameAttribute("countryCode") + ' ' + '[class*="select-module__input"]'
    }

    getCountryDDownOpt() {
        return this.getElementByDataNameAttribute("countryCode") + ' ' + '[class*="select-option-module__select_option"]'
    }

    getProvinceDDown() {
        return this.getElementByDataNameAttribute("provinceCode") + ' ' + '[class*="select-field-module__select_field"]'
    }

    getProvinceDDownTxtF() {
        return this.getElementByDataNameAttribute("provinceCode") + ' ' + '[class*="select-module__input"]'
    }

    getProvinceDDownOpt() {
        return this.getElementByDataNameAttribute("provinceCode") + ' ' + '[class*="select-option-module__select_option"]'
    }

    getCityTxtF() {
        return this.getElementByDataNameAttribute("city") + ' ' + this.getTxtF()
    }

    getPostalCodeTxtF() {
        return this.getElementByDataNameAttribute("postalCode") + ' ' + this.getTxtF()
    }

    getPhoneNumberTxtF() {
        return this.getElementByDataNameAttribute("phoneNumber") + ' ' + this.getTxtF()
    }

    getUrlTxtF() {
        return this.getElementByDataNameAttribute("url") + ' ' + this.getTxtF()
    }

    getUsernameTxtF() {
        return this.getElementByDataNameAttribute("username") + ' ' + this.getTxtF()
    }

    getPasswordTxtF() {
        return this.getElementByDataNameAttribute("password") + ' ' + this.getTxtF()
    }

    getOKBtn() {
        return '[class*="modal-footer-module__child"] [data-name="submit"]'
    }

    getAddNewVenue(name, venueType, classSize = 1) {
        cy.get(this.getAddVenueBtn()).click()
        this.getShortWait()
        cy.get(this.getAddVenueNameTxtF()).type(name)
        cy.get(this.getMaxClassTxtF()).clear().type(classSize)
        cy.get(this.getVenueTypeDDown()).click()
        cy.get(this.getVenueTypeDDownOpt()).contains(venueType).click()
        cy.get(this.getOKBtn()).click()
        this.getLShortWait()
    }

    //----------------------------------//

    getInvitationUrlNotice() {
        return '[class*="notification-banner-module__notification"]'
    }

    getInvitationUrlPrePublishTxt() {
        return "Your unique meeting URL will be displayed here after clicking 'Publish'."
    }

    getInvitationUrl() {
        return '[data-name="zoom-url-notification"] > a';
    }

    getDateTimeLabel() {
        return this.getElementByDataNameAttribute("label")
    }

    getStartDatePickerBtnThenClick() {
        cy.get('[data-name="classStartTime"]').within(() => {
            cy.get('[class*="_calendar_button"]').click()
        })
    }

    getStartDatePickerClearBtn() {
        return '[data-name="classStartTime"] [class*="SingleDatePickerInput_clearDate_svg"]'
    }

    getStartDatePickerErrorMsg() {
        return '[data-name="classStartTime"] [data-name="error"]'
    }

    getStartDateTimeBtn() {
        return '[data-name="classStartTime"] [class*="icon icon-clock"]'
    }

    getEndDatePickerBtnThenClick() {
        cy.get('[data-name="classEndTime"]').within(() => {
            cy.get('[class="_calendar_button_1rexn_5 icon icon-calendar"]').click()
        })
    }

    getEndDatePickerClearBtn() {
        return '[data-name="classEndTime"] [class*="SingleDatePickerInput_clearDate_svg"]'
    }

    getEndDatePickerErrorMsg() {
        return '[data-name="classEndTime"] [data-name="error"]'
    }

    getEndDateTimeBtn() {
        return '[data-name="classEndTime"] [class*="icon icon-clock"]'
    }

    getSessionDetailsTimeZoneDDown() {
        return '[data-name="timeZone"] [class*="icon icon-arrows-up-down"]';
    }

    getSessionDetailsTimeZoneTxt() {
        return "Time Zone";
    }

    getSessionDetailsTimeZoneTxtF() {
        return `[name=timeZone]`
    }

    getSessionDetailsTimeZoneDDownOpt() {
        return '[class*="_option_1mq8e_10"][role="option"]';
    }

    getSessionDetailsReccuringClassesDDown() {
        return '[data-name="sessionRecurrenceFrequency"] [data-name="selection"]';
    }

    getSessionDetailsReccuringClassesDDownOpt() {
        return 'ul[aria-label="Add Recurring Classes"]';
    }

    getSessionDetailsReccuringClassesRepeatTxt() {
        return "Repeat Every";
    }

    getSessionDetailsRepeatEveryTxtF() {
        return '[aria-label="Repeat Every"]'
    }

    getOnDayDDown() {
        return this.getElementByDataNameAttribute("daysOfWeek") + ' ' + '[class*="select-field-module__selection"]'
    }

    getOnDayDDownTxtF() {
        return this.getElementByDataNameAttribute("daysOfWeek") + ' ' + '[class*="select-module__input"]'
    }

    getOnDayDDownOpt() {
        return '[class*="select-option-module__label"]'
    }

    getOnDayDDownClearBtnThenClick() {
        return this.getElementByDataNameAttribute("daysOfWeek") + ' ' + this.getXBtn()
    }

    getSessionDetailsRecurUntilOpt() {
        return '[aria-label="Recur Until"]'
    }

    getSessionDetailsNumOfOccurrences() {
        return '[aria-label="Number of Occurrences"]'
    }

    getSessionDetailsRecurrenceEndDateTxtF() {
        return '[aria-label="Recurrence End Date"] [class*="DateInput_input_1"]'
    }

    getSessionDetailsRepeatOnDayOfWeekBtn() {
        return '[class*="calendar-week-module__day"]'
    }

    getSessionDetailsRepeatOnDayOfMonthBtn() {
        return '[class*="calendar-month-module__day"]'
    }

    getSessionDetailsRepeatOnMonthBtn() {
        return '[class*="calendar-year-module__month"]'
    }

    getExpandEnrollmentRulesBtn() {
        return "Expand Enrollment";
    }

    getAllowSelfEnrollmentRadioBtn() {
        return this.getElementByDataNameAttribute("session-self-enrollment") + ' ' + '[class="_label_6rnpz_32"]';
    }

    getApprovalTypeRadioBtn() {
        return this.getElementByDataNameAttribute("approvalType") + ' ' + '[class*="_radio_group_"]'
    }

    getApprovalTypeDescriptionTxt() {
        return this.getElementByDataNameAttribute("session-approval-settings") + ' ' + '[class*="description-module__description"]'
    }

    getOtherApprovalDDown() {
        return this.getElementByDataNameAttribute("approvalUserIds") + ' ' + '[class*="select-field-module__selection"]'
    }

    getOtherApprovalDDownTxtF() {
        return this.getElementByDataNameAttribute("approvalUserIds") + ' ' + '[class*="select-module__search"]'
    }

    getOtherApprovalDDownOpt() {
        return '[class*="user-select-option-module__user"]'
    }

    getSessionEnrollmentStartDatePickerBtn() {
        return this.getElementByDataNameAttribute("selfEnrollmentAccessStartDateTime") + ' ' + '[class*="icon icon-calendar"]'
    }

    getSessionDetailsEnrollmentStartDateTxtF() {
        return this.getModal() + ' ' + '[data-name="selfEnrollmentAccessStartDateTime"] [class*="DateInput_input"]'
    }

    getSessionEnrollmentStartTimePickerBtn() {
        return this.getElementByDataNameAttribute("selfEnrollmentAccessStartDateTime") + ' ' + '[class*="icon icon-clock"]'
    }

    getSessionDetailsEnrollmentStartTimeTxtF() {
        return this.getModal() + ' ' + '[data-name="selfEnrollmentAccessStartDateTime"] [class*="text-input-module__text_input"]'
    }

    getSessionEnrollmentEndDatePickerBtn() {
        return this.getElementByDataNameAttribute("selfEnrollmentAccessEndDateTime") + ' ' + '[class*="icon icon-calendar"]'
    }

    getSessionDetailsEnrollmentEndDateTxtF() {
        return this.getModal() + ' ' + '[data-name="selfEnrollmentAccessEndDateTime"] [class*="DateInput_input"]'
    }

    getSessionEnrollmentEndTimePickerBtn() {
        return this.getElementByDataNameAttribute("selfEnrollmentAccessEndDateTime") + ' ' + '[class*="icon icon-clock"]'
    }

    getSessionDetailsEnrollmentEndTimeTxtF() {
        return this.getModal() + ' ' + '[data-name="selfEnrollmentAccessEndDateTime"] [class*="text-input-module__text_input"]'
    }

    getMinimumClassSizeTxt() {
        return "Min Class Size";
    }

    getMinimumClassSizeErrorMsg() {
        return '[data-name="minimumClassSize"] [class*="_error"]'
    }

    getMaximumClassSizeTxtF() {
        return this.getElementByDataNameAttribute("maximumClassSize") + ' ' + this.getNumF()
    }

    getEnableWaitlistToggle() {
        return '[data-name="isWaitlistEnabled"] [class*="_toggle_button"]'
    }

    getAttributesBtn() {
        return this.getModal() + ' ' + this.getElementByAriaLabelAttribute("Expand Attributes");
    }

    getExternalIDTxt() {
        return this.getModal() + ' ' + this.getElementByNameAttribute("externalId");
    }

    getExternalIDErrorMsg() {
        return '[data-name="externalId"] [class*="_error"]'
    }

    getAddEditSessionSaveBtn() {
        return '[data-name="content"] [class*="_success"]'
    }

    getAddEditSessionCancelBtn() {
        return '[class*="_focus_area"] [class*="_cancel"] div';
    }

    getSessionModalErrorMsg() {
        return "error";
    }

    /**
     * Function to add a new ILC Session
     * @param {String} sessionName - Name of session. Defaults to "GUIA Session"
     * @param {Date} startDate - Start date of the session. Format YYYY-MM-DD. If no date is supplied, date equals the date1 constant in sessions in ilc.js
     * @param {Date} endDate - End date of the session. Format YYYY-MM-DD. Defaults to null. Will update automatically to match the start date if left null.
     * @param {String} startTime - Start time of the session. Format "HH MM AMPM" delineated by space. Defaults to null.
     * @param {String} endTime - End time of the session. Format "HH MM AMPM" delineated by space. Defaults to null.
     * @param {String} type - Add a session type (ex. 'Teams' or 'Zoom') if you want to add a virtual venue + instructor. Defaults to null.
     */
    getAddSession(sessionName = ilcDetails.sessionName, startDate = sessions.date1, endDate = null, startTime = null, endTime = null, type = null) {
        cy.get(this.getAddSessionBtn()).click()
        cy.get(this.getSessionDetailsTitleTxtF()).should('have.attr', 'aria-invalid', 'false').clear().type(sessionName)
        this.getStartDatePickerBtnThenClick()
        this.getSelectDate(startDate)

        if (endDate != null) {
            this.getEndDatePickerBtnThenClick()
            this.getSelectDate(endDate)
        }
        if (startTime != null) {
            const arrStartTime = startTime.split(" ")
            this.SelectTime(arrStartTime[0], arrStartTime[1], arrStartTime[2])
        }
        if (startTime != null) {
            const arrEndTime = endTime.split(" ")
            this.SelectTime(arrEndTime[0], arrEndTime[1], arrEndTime[2])
        }

        if (type != null) {
            cy.get(this.getSessionDetailsVenuesDDown()).click()
            switch (type) {
                case 'Teams':
                    cy.get(this.getElementByAriaLabelAttribute(this.getSessionDetailsVenuesTxt())).type(venues.teamsVenue01Name)
                    cy.get(this.getSessionDetailsVenuesDDownOpt()).contains(venues.teamsVenue01Name).click()
                    break;
                case 'Zoom':
                    cy.get(this.getElementByAriaLabelAttribute(this.getSessionDetailsVenuesTxt())).type(venues.zoomVenue01Name)
                    cy.get(this.getSessionDetailsVenuesDDownOpt()).contains(venues.zoomVenue01Name).click()
                    break;
                default:
                    console.log(`Sorry, ${type} type does not exist.`);
            }
            cy.get(this.getSessionDetailsInstructorsDDown()).click()
            cy.get(this.getElementByAriaLabelAttribute(this.getSessionDetailsInstructorsTxt())).type(users.instructorZoom.instructor_zoom_username)
            cy.get(this.getSessionDetailsInstructorsDDownOpt()).contains(users.instructorZoom.instructor_zoom_lname).click()
            cy.get(this.getSessionDetailsDescriptionTxtF()).click()
        }
    }

    /**
     * Function to select time zone in an ILC Session
     * @param {String} strTimeZone 
     */
    getSelectSessionTimeZone(strTimeZone) {
        cy.get(this.getSessionDetailsTimeZoneDDown()).click()
        cy.get(this.getSessionDetailsTimeZoneTxt()).type(strTimeZone)
        cy.get(this.getSessionDetailsTimeZoneDDownOpt).contains(strTimeZone).click()
    }

    /**
     * Function to add a daily recurring session
     * @param {int} intRepeatEvery 
     * @param {String} strRecurUntil Either "Number of Occurrences" or "Date"
     * @param {*} recurrences If strRecurUntil = "Number of Occurrences", this parameter should be a number.
     *                        If strRecurUntil = "Date", this parameter should be a date with format YYYY-MM-DD
     */
    getAddDailyRecurringSession(intRepeatEvery, strRecurUntil, recurrences) {
        cy.get(this.getSessionDetailsReccuringClassesDDown()).click()
        cy.get(this.getSessionDetailsReccuringClassesDDownOpt()).contains('day(s)').click()
        cy.get(this.getSessionDetailsRepeatEveryTxtF()).clear().type(intRepeatEvery)
        if (strRecurUntil == 'Number of Occurrences') {
            cy.get(this.getSessionDetailsRecurUntilOpt()).contains('Number of Occurrences').click()
            cy.get(this.getSessionDetailsNumOfOccurrences()).clear().type(recurrences)
        } else {
            cy.get(this.getSessionDetailsRecurUntilOpt()).contains('Date').click()
            cy.get(this.getSessionDetailsRecurrenceEndDateTxtF()).click()
            this.getSelectDate(recurrences)
        }
    }

    /**
     * Function to add a weekly recurring session
     * @param {int} intRepeatEvery 
     * @param {String} arrRepeatOnDay An array that contains Days of the Week "Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday"
     * @param {*} strRecurUntil Either "Number of Occurrences" or "Date"
     * @param {*} recurrences If strRecurUntil = "Number of Occurrences", this parameter should be a number.
     *                        If strRecurUntil = "Date", this parameter should be a date with format YYYY-MM-DD
     */
    getAddWeeklyRecurringSession(intRepeatEvery, arrRepeatOnDay, strRecurUntil, recurrences) {
        cy.get(this.getSessionDetailsReccuringClassesDDown()).click()
        cy.get(this.getSessionDetailsReccuringClassesDDownOpt()).contains('week(s)').click()
        cy.get(this.getSessionDetailsRepeatEveryTxtF()).clear().type(intRepeatEvery)
        cy.get(this.getOnDayDDownClearBtnThenClick()).eq(0).click() //clear existing day

        //Select day(s)
        for (let i = 0; i < arrRepeatOnDay.length; i++) {
            cy.get(this.getOnDayDDown()).click()
            cy.get(this.getOnDayDDownTxtF()).type(arrRepeatOnDay[i])
            cy.get(this.getOnDayDDownOpt()).contains(arrRepeatOnDay[i]).click({ force: true })
            cy.get(this.getSessionDetailsRepeatEveryTxtF()).click() //close onDayDDown
        }

        if (strRecurUntil == 'Number of Occurrences') {
            cy.get(this.getSessionDetailsRecurUntilOpt()).contains('Number of Occurrences')
            cy.get(this.getSessionDetailsNumOfOccurrences()).clear().type(recurrences)
        } else {
            cy.get(this.getSessionDetailsRecurUntilOpt()).contains('Date').click()
            cy.get(this.getSessionDetailsRecurrenceEndDateTxtF()).click()
            this.getSelectDate(recurrences)
        }
    }

    /**
     * Function to add a weekly Weekday recurring session
     * @param {int} intRepeatEvery 
     * @param {*} strRecurUntil Either "Number of Occurrences" or "Date"
     * @param {*} recurrences If strRecurUntil = "Number of Occurrences", this parameter should be a number.
     *                        If strRecurUntil = "Date", this parameter should be a date with format YYYY-MM-DD
     * @param {String} arrRepeatOnDay An array that contains Days of the Week "Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday"
     */
    getAddWeekdayRecurringSession(intRepeatEvery, strRecurUntil, recurrences, arrRepeatOnDay) {
        cy.get(this.getSessionDetailsReccuringClassesDDown()).click()
        cy.get(this.getSessionDetailsReccuringClassesDDownOpt()).contains('week(s) on weekdays').click()
        cy.get(this.getSessionDetailsRepeatEveryTxtF()).clear().type(intRepeatEvery)

        //Clear default days and Select day(s) if they are passed
        if (arrRepeatOnDay != undefined) {
            cy.get(this.getOnDayDDownClearBtnThenClick()).click({ multiple: true }) //clear all existing days
            for (let i = 0; i < arrRepeatOnDay.length; i++) {
                cy.get(this.getOnDayDDown()).click()
                cy.get(this.getOnDayDDownTxtF()).type(arrRepeatOnDay[i])
                cy.get(this.getOnDayDDownOpt()).contains(arrRepeatOnDay[i]).click({ force: true })
                cy.get(this.getSessionDetailsRepeatEveryTxtF()).click() //close onDayDDown
            }
        }

        if (strRecurUntil == 'Number of Occurrences') {
            cy.get(this.getSessionDetailsRecurUntilOpt()).contains('Number of Occurrences')
            cy.get(this.getSessionDetailsNumOfOccurrences()).clear().type(recurrences)
        } else {
            cy.get(this.getSessionDetailsRecurUntilOpt()).contains('Date').click()
            cy.get(this.getSessionDetailsRecurrenceEndDateTxtF()).click()
            this.getSelectDate(recurrences)
        }
    }

    /**
     * Function to add a monthly recurring session
     * @param {int} intRepeatEvery 
     * @param {String} strRepeatOnDayOfMonth Numbers 1-31. If the month of the start date only has 28, 29, or 30 days, this can't be greater than those numbers.
     * @param {String} strRecurUntil Either "Number of Occurrences" or "Date"
     * @param {*} recurrences If strRecurUntil = "Number of Occurrences", this parameter should be a number.
     *                        If strRecurUntil = "Date", this parameter should be a date with format YYYY-MM-DD
     */
    getAddMonthlyRecurringSession(intRepeatEvery, strRepeatOnDayOfMonth, strRecurUntil, recurrences) {
        cy.get(this.getSessionDetailsReccuringClassesDDown()).click()
        cy.get(this.getSessionDetailsReccuringClassesDDownOpt()).contains('month(s)').click()
        cy.get(this.getSessionDetailsRepeatEveryTxtF()).clear().type(intRepeatEvery)
        cy.get(this.getSessionDetailsRepeatOnDayOfMonthBtn()).contains(strRepeatOnDayOfMonth).click()

        if (strRecurUntil == 'Number of Occurrences') {
            cy.get(this.getSessionDetailsRecurUntilOpt()).contains('Number of Occurrences')
            cy.get(this.getSessionDetailsNumOfOccurrences()).clear().type(recurrences)
        } else {
            cy.get(this.getSessionDetailsRecurUntilOpt()).contains('Date').click()
            cy.get(this.getSessionDetailsRecurrenceEndDateTxtF()).click()
            this.getSelectDate(recurrences)
        }
    }

    /**
     * Function to add a yearly recurring session
     * @param {int} intRepeatEvery 
     * @param {String} strRepeatOnMonth Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec
     * @param {String} strRepeatOnDayOfMonth Numbers 1-31. If the month of the start date only has 28, 29, or 30 days, this can't be greater than those numbers.
     * @param {String} strRecurUntil Either "Number of Occurrences" or "Date"
     * @param {*} recurrences If strRecurUntil = "Number of Occurrences", this parameter should be a number.
     *                        If strRecurUntil = "Date", this parameter should be a date with format YYYY-MM-DD
     */
    getAddYearlyRecurringSession(intRepeatEvery, strRepeatOnMonth, strRepeatOnDayOfMonth, strRecurUntil, recurrences) {
        cy.get(this.getSessionDetailsReccuringClassesDDown()).click()
        cy.get(this.getSessionDetailsReccuringClassesDDownOpt()).contains('year(s)').click()
        cy.get(this.getSessionDetailsRepeatEveryTxtF()).clear().type(intRepeatEvery)
        cy.get(this.getSessionDetailsRepeatOnMonthBtn()).contains(strRepeatOnMonth).click()
        cy.get(this.getSessionDetailsRepeatOnDayOfMonthBtn()).contains(strRepeatOnDayOfMonth).click()

        if (strRecurUntil == 'Number of Occurrences') {
            cy.get(this.getSessionDetailsRecurUntilOpt()).contains('Number of Occurrences')
            cy.get(this.getSessionDetailsNumOfOccurrences()).clear().type(recurrences)
        } else {
            cy.get(this.getSessionDetailsRecurUntilOpt()).contains('Date').click()
            cy.get(this.getSessionDetailsRecurrenceEndDateTxtF()).click()
            this.getSelectDate(recurrences)
        }
    }

    /**
     * Function to add a session enrollment start date/time and end date/time
     * @param {*} startDate Format YYYY-MM-DD
     * @param {*} startTime Format "HH MM AMPM" delineated by space
     * @param {*} endDate Format YYYY-MM-DD
     * @param {*} endTime Format "HH MM AMPM" delineated by space
     */
    getAddEnrollmentStartEndDate(startDate = null, startTime = null, endDate = null, endTime = null) {
        if (startDate != null) {
            cy.get(this.getSessionDetailsEnrollmentStartDateTxtF()).click()
            this.getSelectDate(startDate)

            if (startTime != null) {
                const arrStartTime = startTime.split(" ")
                cy.get(this.getSessionDetailsEnrollmentStartTimeTxtF()).click()
                this.SelectTime(arrStartTime[0], arrStartTime[1], arrStartTime[2])
            }
        }

        if (endDate != null) {
            cy.get(this.getSessionDetailsEnrollmentStartDateTxtF()).click()
            this.getSelectDate(endDate)

            if (endTime != null) {
                const arrEndTime = endTime.split(" ")
                cy.get(this.getSessionDetailsEnrollmentEndTimeTxtF()).click()
                this.SelectTime(arrEndTime[0], arrEndTime[1], arrEndTime[2])
            }
        }
    }

    //----- For the View All Sessions modal -----//

    getDeleteSessionByName(name) {
        cy.get(this.getUpcomingSessionName()).contains(name).parents(this.getUpcomingSessionContainer()).within(() => {
            cy.get('[class*="icon icon-trash"]').click()
        })
    }

    getEditSessionByName(name) {
            this.getShortWait()
        cy.get(this.getUpcomingSessionName()).contains(name).parents(this.getUpcomingSessionContainer()).within(() => {
            cy.get('[class*="icon icon-pencil"]').click()
            this.getLShortWait()
        })
    }

    getCloseBtn() {
        return '[data-name="content"] [class*="icon icon-no"]'
    }

    getSessionDetailsEditBtn() {
        return '[class*="_session_count"]'
    }

    addSessionForTheFuture() {
        /** Add session for future */
        cy.get(this.getAddSessionBtn()).click()

        //Set future title
        cy.get(this.getSessionDetailsTitleTxtF()).should('have.attr', 'aria-invalid', 'false').clear().type(sessions.futuresessionName)
        this.getStartDatePickerBtnThenClick()
        this.getSelectDate(sessions.date1)
        this.getEndDatePickerBtnThenClick()
        this.getSelectDate(sessions.date1)
        cy.get(this.getEndDateTimeBtn()).click()
        this.SelectTime("03", "00", "PM")
        cy.get(this.getDateTimeLabel()).contains("Class End Date and Time").click() //hide timepicker

        //Set Timezone
        cy.get(this.getSessionDetailsTimeZoneDDown()).click()
        cy.get(ARCoursesPage.getElementByAriaLabelAttribute(this.getSessionDetailsTimeZoneTxt()))
            .first()
            .type("(UTC+06:00) Dhaka")
        cy.get(this.getSessionDetailsTimeZoneDDownOpt()).contains("(UTC+06:00) Dhaka").click()
        //Save ILC Session
        cy.get(this.getAddEditSessionSaveBtn()).click({ force: true })
        this.getMediumWait()
    }

    addSessionForThePast() {
        //Set session for the past
        cy.get(this.getAddSessionBtn()).click()
        //Set Valid Title
        cy.get(this.getSessionDetailsTitleTxtF()).should('have.attr', 'aria-invalid', 'false')
            .clear()
            .type(sessions.pastsessionName)

        this.getStartDatePickerBtnThenClick()
        this.getSelectDate(sessions.date2)
        this.getEndDatePickerBtnThenClick()
        this.getSelectDate(sessions.date2)
        cy.get(this.getEndDateTimeBtn()).click()
        this.SelectTime("01", "00", "PM")
        cy.get(this.getDateTimeLabel())
            .contains("Class End Date and Time")
            .click()  //hide timepicker

        //Set Timezone
        cy.get(this.getSessionDetailsTimeZoneDDown()).click()
        cy.get(
            ARCoursesPage.getElementByAriaLabelAttribute(
                this.getSessionDetailsTimeZoneTxt()
            )
        )
            .first()
            .type("(UTC+06:00) Dhaka")
        cy.get(this.getSessionDetailsTimeZoneDDownOpt())
            .contains("(UTC+06:00) Dhaka")
            .click()

        //Save ILC Session
        cy.get(this.getAddEditSessionSaveBtn()).click({ force: true })
        this.getLShortWait()
    }

    getILCEditActionBtn(){
        return '[class*="_context_button"]'
    }

    getCourseDeleteWarningMsg(courseName) {
        return `Are you sure you want to delete '${courseName}'?`
    }

    getVenueFormSection(){
        return '[data-name="venue-form-section"]'
    }
    getNameTextF(){
        return `${this.getTxtF()}[aria-label="Name"]`
    }
    getUrlTextF(){
        return `${this.getTxtF()}[aria-label="Url"]`
    }
    getVenueTypeDropDown(){
        return `[data-name="selection"][class="_selection_4ffxm_8"]`
    }
    getEnrollmentExpandBtn(){
        return 'button[aria-label="Expand Enrollment"]'
    }
    getDeleteSessionBtn(){
        return '[aria-label="Delete Session"]'
    }

    addSessionWithVenueType(venueType="Classroom") {
        /** Add session for future */
        cy.get(this.getAddSessionBtn()).click()

        //Set future title
        cy.get(this.getSessionDetailsTitleTxtF()).should('have.attr', 'aria-invalid', 'false').clear().type(sessions.futuresessionName+"_"+venueType)
        this.getStartDatePickerBtnThenClick()
        this.getSelectDate(sessions.date1)
        this.getEndDatePickerBtnThenClick()
        this.getSelectDate(sessions.date1)
        cy.get(this.getEndDateTimeBtn()).click()
        this.SelectTime("03", "00", "PM")
        cy.get(this.getDateTimeLabel()).contains("Class End Date and Time").click() //hide timepicker

        //Set Timezone
        cy.get(this.getSessionDetailsTimeZoneDDown()).click()
        cy.get(ARCoursesPage.getElementByAriaLabelAttribute(this.getSessionDetailsTimeZoneTxt()))
            .first()
            .type("(UTC+06:00) Dhaka")
        cy.get(this.getSessionDetailsTimeZoneDDownOpt()).contains("(UTC+06:00) Dhaka").click()

        cy.get(this.getAddVenueBtn()).click()
        cy.get(this.getVenueFormSection()).within(()=>{
            cy.get(this.getNameTextF()).type(ilcDetails.courseName+"_"+venueType)
            cy.get(this.getVenueTypeDDown()).click()
            cy.get(this.getVenueTypeDDownOpt()).contains(venueType).click()
            if(venueType === venueTypes.connectPro || venueType === venueTypes.goToMeeting || venueType === venueTypes.url || venueType === venueTypes.webEx){
                cy.get(this.getUrlTextF()).type('https://test-meeting-url.com')
            }
            
        })


        cy.get('[class="_modal_footer_1o8lk_1"]').within(()=>{
            cy.get(this.getSaveBtn()).click()
        })
        cy.get(this.getEnrollmentExpandBtn()).click()
        cy.get(this.getElementByDataNameAttribute("enrollment")).within(()=>{
            cy.get(this.getRadioBtn()).contains('All Learners').click()
        })


        // Save ILC Session
        cy.get(this.getAddEditSessionSaveBtn()).click({ force: true })
        this.getLShortWait()
    }
    
    getMeetingDescriptionTxtF() {
        return '[aria-label="Meeting Description"]'
    }

    getEnableECommerceChecbox() {
        return '[aria-label="Enable E-Commerce"'
    }

    getrequireSessionSelection() {
        return '[data-name="requireSessionSelection"]'
    }

    geRequireLearnerChooseSessionCheckbox() {
        return '[aria-label="Require Learner to Choose Session Upon Purchase"]'
    }

    setEnableECommerceToggle(value){
        cy.wait(2000)
        cy.get(this.getEnableECommerceChecbox()).invoke('attr','aria-checked').then((status) =>{
            if(status === value){
                cy.get(this.getEnableECommerceChecbox()).should('have.attr', 'aria-checked', value)
            }
            else{
                cy.get(this.getEnableECommerceChecbox()).siblings('div').click()
                cy.wait(1000)
                cy.get(this.getEnableECommerceChecbox()).should('have.attr', 'aria-checked', value)
            }
        })
    }

    setRequireLearnerChooseSessionUponPurchaseToggle(value){
        cy.wait(2000)
        cy.get(this.geRequireLearnerChooseSessionCheckbox()).invoke('attr','aria-checked').then((status) =>{
            if(status === value){
                cy.get(this.geRequireLearnerChooseSessionCheckbox()).should('have.attr', 'aria-checked', value)
            }
            else{
                cy.get(this.geRequireLearnerChooseSessionCheckbox()).siblings('div').click()
                cy.wait(1000)
                cy.get(this.geRequireLearnerChooseSessionCheckbox()).should('have.attr', 'aria-checked', value)
            }
        })
    }

    // Added for TC# C940
    getCompetenciesSec(){
        return '[data-name="course-competencies"]'
    }

    getCompetencyBtn(){
        return '[data-name="add-course-competency"]'
    }

    getCompetencySecField(){
        return '[aria-label="Competencies"]'
    }

    getCompetencySecDiv(){
        return '[data-name="course-competencies"] div'
    }

    getCompetencyLevelSec(){
        return '[data-name="level"]'
    }

    getCompetencyReqTitle(){
        return '[data-name="required"]'
    }

    getCompetencyChoose(){
        return '[data-name="field"]'
    }

    getCompetencyChooseTypeField(){
        return 'input[aria-label="Competency"]'
    }

    getCompetencyChooseList(){
        return '[class*="select_option"]'
    }

    getCompetencyDefaultList(){
        return 'ul[aria-label="Competency"]'
    }
    
    getCompetencyLevelSecTitle(){
        return '[data-name="level"] [data-name="label"]'
    }

    getCompetencyLevelChoose(){
        return '[data-name="level"] [data-name="field"]'
    }

    getCompetencyLevelList(){
        return '[aria-label="Level"] [role="option"]'
    }

    getCompetencyDDown() {
        return 'ul[aria-label="Competency"]'
    }

    getCompetencyOptionItems() {
        return 'span[class*="_label_"]'
    }

    getCompetencyForm() {
        return '[class*="form_control"]'    
    }

    // Added for the TC# C7327
    getAllowFailureToggle() {
        return '[data-name="course-failure-settings"] [data-name="toggle"] [role="presentation"]'
    }

    getRecurringClasses() {
        return '[data-name="selection"] [data-name="label"]'
    }
    
    // Added for the TC# T98581
    getCompetencyInputChooseBox(){
        return '[data-name="course-competencies-content"]'
    }

    getCompetencyInput(){
        return '[data-name="field"]'
    }

    getDeleteCompetencyBtn() {
        return 'button[data-name="delete"]'
    }

    addILCCourseWithDefaultEvaluationQuestions(ilcCourseName, usersToEnroll = [userDetails.username]) {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getCoursesReport()
        cy.createCourse('Instructor Led', ilcCourseName)
        // Open Attribute Settings
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Attributes')).click()
        // Click once again to bring the course attribute settings in the view
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Attributes'), {timeout: 3000}).click()
        // Enable course evaluation
        this.generalToggleSwitch('true', 'enableEvaluation')
        // Enable learner can evaluate the course any time
        this.generalToggleSwitch('true', 'allowEvaluationAnyTime')
        // Add default evaluation questions
        cy.get(ARCourseSettingsAttributesModule.getUseDefaultQuestionsBtn()).click()
        // publish the course
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36))
        })
        AREnrollUsersPage.getEnrollUserByCourseAndUsername([ilcCourseName], usersToEnroll)
    }

    verifySessionOrder(sessions) {
        for (let i = 0; i < sessions.length; i++) {
            cy.get(this.getUpcomingSessionContainer() + ' ' + this.getUpcomingSessionName()).eq(i).should('contain', sessions[i])
        }        
    }
}