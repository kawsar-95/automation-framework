import BasePage from "./../../../BasePage";

export default new class ReviewerBottomToolbar extends BasePage {
    

    // This can be used for (NextStep), (NextSection) or (Return to Review) buttons
    getNextBtn() {
        return '[data-name="next-step"] [class*="nav_button_text"]';
    }


    getPreviousStepBtn() {
        return '[data-name="prev-step"] [class*="nav_button_text"]';
    }




}