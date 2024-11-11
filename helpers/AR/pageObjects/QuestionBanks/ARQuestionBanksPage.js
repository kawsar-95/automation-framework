import arBasePage from "../../ARBasePage";

export default new class ARQuestionBanksPage extends arBasePage {

    // Elements are inherited from ARBasePage
    getExpandQuestionsDropdown() {
        return '[aria-label*="Expand Questions"]'
    }
}