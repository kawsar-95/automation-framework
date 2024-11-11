import arBasePage from "../../ARBasePage";

export default new (class ARReviewerMenu extends arBasePage {
    getMenuItemsBtn() {
        return '[data-name="list-item"] [type="button"]';
    }

    getCoursesGroupBtn() {
        return '[class*="main-menu-group-module"][title="Courses"]';
    }

    getCoursesReportBtn() {
        return '[id*="course-enrollments-report-menu"][class*="main-menu-option-module__title"]';
    }

    getUsersGroupBtn() {
        return '[class*="main-menu-group-module"][title="Users"]';
    }

    getUsersReportBtn() {
        return '[id*="users-report-menu"][class*="main-menu-option-module__title"]';
    }
})();
