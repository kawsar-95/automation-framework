import leBasePage from '../../LEBasePage'
import LEBottomToolBar from '/helpers/LE/pageObjects/Nav/LEBottomToolBar'
import LEDashboardPage from '/helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LEDashboardAccountMenu from '/helpers/LE/pageObjects/Menu/LEDashboardAccount.menu'

const intTotalLanguages = 35;

export default new class LELanguageModal extends leBasePage {

    getAllLanguageBtns() {
        return '[class*="languages-module__language_btn___"]';
    }

    getTotalLanguages(){
        return intTotalLanguages;
    }

    getLanguagesModalHeader(){
        return '[class*="languages-module__header___"]'
    }

    getAllLanguagesBtn(){
        return `[class*="languages-module__languages"]  > button`
    }

    getXCloseBtn(){
        return '.icon-x-thin'
    }

    selectLanguage(language){
        cy
            .get(LEBottomToolBar.getLanguageBtn()).click()
            .get(this.getAllLanguagesBtn()).contains(language).click().wait(2000)          
    }

    verifyLanguageTranslations(language, term1, term2) {

        cy
            .get(LEBottomToolBar.getLanguageBtn()).click()
            .get(this.getAllLanguagesBtn()).contains(language).click()
            .get(LEDashboardPage.getNavMenu()).click()
            .get(LEDashboardAccountMenu.catalogMenuItemBtn).should('contain.text', term1)
            .get(LEDashboardPage.getNavMenu()).click()
            .get(LEBottomToolBar.getLanguageBtn()).click()
            .get(this.getLanguagesModalHeader()).should('contain.text', term2)
    }
}