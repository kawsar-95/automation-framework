import arBasePage from "../../ARBasePage";

export default new class ARAssignCompetenciesPage extends arBasePage {

    getAddCompetenciesBtn() {
        return "div#Competencies  .btn.full-width";
    }

    getUsersDDown() {
        return "#UserIds input[type=text]";
    }

    getUsersDDownOpt(optName) {
        return cy.get('#select2-drop').contains(optName).click();
    }
    getSearchCompetencies(){
        return '[class="katana-search"] [placeholder]'
        //return '.katana-search [placeholder]'

    }
    getCompetenciesDDownOpt(optName){
        cy.get('li > span:nth-child(3)').contains(optName).first().click();
    }
    getCompetenciesChoseBtn(){
        return '[class="modal"] [class*="btn has-icon"]'
        //return '.modal .*"btn has-icon"'
    }
    getChooseCompetencyCancelBtn(){
        return '[class="modal"] [class*="btn cancel has-icon"]'
        //return '.modal .*"btn has-icon"'
    }
    getAddUserTextF(){
        return '[id*="s2id_autogen4"]'
    }
   
}
