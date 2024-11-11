import createBasePage from "../../CreateBasePage";

export default new (class CreateDashboardPage extends createBasePage {
    getTrialTitle() {
        //return "Start your 21-Days Free Trial"
        return `[class="css-1ke5k6s"]`;
    }

    getTrialtxt() {
        //return "Start your 21-Days Free Trial"
        return "Start your 21-Days Free Trial";
    }

    getFirstName() {
        return `[name="firstName"]`;
    }

    getLastName() {
        return `[name="lastName"]`;
    }

    getEmail() {
        return `[name="email"]`;
    }

    getPassword() {
        return `[name="password"]`;
    }

    getCompany() {
        return `[name="company"]`;
    }

    getUserBtn() {
        return `[data-name="account-menu"]`;
    }

    getCountryBtn() {
        return `[class=" css-m4jvqa-indicatorContainer"]`;
    }

    getCountry() {
        return `[class*="css-13ds2yr-option"]`;
    }

    getPricayPolicy() {
        return '[id="agreed"]';
    }

    getErrorMessage() {
        return `[data-name="message-text"]`;
    }

    getGenralErrorMessagetxt() {
        return "All fields are mandatory";
    }

    getEmailErrorMessagetxt() {
        return "You entered an invalid email address";
    }

    getRandomNmber() {
        return Math.floor(3000 + Math.random() * 200);
    }

    getDate = () => {
        return new Date().toISOString().replace(/[:\.\-TZ]/g, "");
    };

    getStartTrialBtn() {
        return `[data-name="start-trial-button"]`;
    }

    getLogoutBtn() {
        return `[data-name="sign-out-button"]`;
    }

    getCreateBtn() {
        return `[data-name="create-button"]`;
    }

    getCreateBtnValue() {
        return "Create";
    }

    getReviewTab() {
        return `[data-name="reviews-nav"]`;
    }

    getReviewBtnValue() {
        return "Reviews";
    }
    getUser() {
        return '[data-name="profile-full-name"]';
    }
})();
