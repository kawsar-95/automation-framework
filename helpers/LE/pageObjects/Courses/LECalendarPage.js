import leBasePage from '../../LEBasePage'

export default new class LECalendarPage extends leBasePage {


    getCalendarPageTitle() {
        return `[class*="banner-title-module__title"]`;
    }

    getViewBtn() {
        return `[class*="icon-view-calendar"]`;
    }

    getCalendarMonthYearBtn() {
        return `[class*="event-calendar-module__month__"]`;
    }

    getCalendarPrevMonthBtn() {
        return `[class*="event-calendar__month_previous_container"]`;
    }

    getCalendarNextMonthBtn() {
        return `[class*="event-calendar__month_next_container"]`;
    }

    getCalendarDayofMonth() {
        return `[class*="event-calendar__date_today"]`;
    }

    //Use to check if course is available within the visible calendar month by name
    getCourseNameInCalendarMonth() {
        return `[class*="courses__panels_container"]`;
    }

    //----- For the Course List under the Calendar -----//

    getCourseContainer() {
        return '[class*="panel-module__panel"]'
    }

    getCourseName() {
        return '[class*="panel-module__name"]'
    }

    getSessionLocation() {
        return '[class*="session-schedule__location_text"]'
    }

    getSessionUrl() {
        return '[class*="session-schedule__location_url"]'
    }

}