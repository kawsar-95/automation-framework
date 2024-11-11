import ARBasePage from "../../ARBasePage";

export default new class ARAddEditTranslationPage extends ARBasePage {
    getLanguageDDown() {
        return 'div[class*="select2-container"][id*="s2id_autogen3"] span[id*="select2-chosen"][class*="select2-chosen"]'
    }
    getLanguageTextF() {
        return '[id*="s2id_autogen4_search"][class*="select2-input select2-focused"]'
    }
    getLanguageDDownListItem() {
        return 'ul[class*="select2-results"] > li[class*="select2-results"]'
    }
}