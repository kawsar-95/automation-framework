import arBasePage from "../../ARBasePage";

export default new (class ARReviewerChecklistPage extends arBasePage {

    // Reviewer Login Page Elements

    getReviewerPageTitle() {
        return "header-title";
    }


    getReviewerCourseLabel() {
        return '[data-name="learner-review-enrollment"] [class*="_course_label"]';
    }


    getLearnerNameLabel() {
        return '[class*="learner-review-enrollments-module__name"]';
    }


    getLoginBtn() {
        return '[class*="login-form-module__login_button"]';
    }

});