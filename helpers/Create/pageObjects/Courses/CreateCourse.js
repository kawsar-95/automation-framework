import createBasePage from "../../CreateBasePage";

export default new (class CreateDashboardPage extends createBasePage {
    //Verify that theme modal appears

    
    //Titles and Names
    getCreateCourseTitle() {
        // return `[class="css-vnimc1"]`
        return `[data-name="title"]`;
    }

    getThemeTitle() {
        return `[data-name="selected-theme-title"]`;
    }

    getCourseTitleTxtF() {
        return `[data-name="course-name-input"]`;
    }

    getCreateThemeList() {
        return `[data-name="theme-templates"]`;
    }
    
    getPageName(){
        return `[data-name="page-name-input"]`;
    }


    //Expected Values
    getCreateCourseTitleValue() {
        return "Create Course";
    }

    getThemeTitleValue() {
        return "Altair";
    }

    getEnterCourseTitleValue() {
        return "Enter your course title";
    }

    getThemeTemplatesValue() {
        return "Theme Templates";
    }

    getPageNameWelcomeValue(){
        return "Welcome Page"
    }

    getPageNameThankYou(){
        return "Thank You"
    }
    getCreateBtnValue() {
        return "Create";
    }


    //Buttons
    getCreatePageBtn() {
        return `[data-name="cards-grid"]`;
    }

    getCreateBtn() {
        return `[data-name="create-button"]`;
    }
    
    getUseThemeBtn() {
        return `[data-name="use-this-theme-button"]`;
    }
    getCreateContinueBtn() {
        return `[data-name="create-course-drawer-continue-button"]`;
    }

    getCreateContinueBtnLegacy() {
        return `[data-name="continue-button"]`;
    }


    getCreatePageContinueBtn() {
        return `[data-name="create-page-continue-button"]`;
    }

    getCreatePageContinueBtnLegacy() {
        return `[data-name="continue-button"]`;
    }


    //For Data Inputs
    getEnterCourseTitle() {
        return `[class="koan-label"]`;
    }
    getPlusBtn(){
        return `[class="fa fa-plus"]`;
    }


    getHomeBtn(){
        return `[class="fa fa-home"]`;
    }

    //Data Arrays
    getThemeTemplates() {
        return `[data-name="section-label"]`;
    }
    getCloseCourseModal() {
        return `[class="fa fa-times"]`;
    }








})();
