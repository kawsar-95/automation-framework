import ARBasePage from "../../../ARBasePage";

export default new class ARCourseSettingsSocialModule extends ARBasePage {

    getFormLabel() {
        return '[data-name="courseCollaborations"] [data-name="label"]'
    }
   
    getCollapseSocialBtn(){
        return this.getElementByAriaLabelAttribute("Collapse Social")
    }
    
    getHideSocialBtn(){
        return this.getElementByAriaLabelAttribute("Hide Social")
    }

    //----- Comments Section -----//

    getAllowCommentsToggle() {
        return '[data-name="allowCourseComments"] [class*="_toggle_button"]';
    }

    getAllowCommentsToggleContainer() {
        return "allowCourseComments";
    }

    getAllowCommentsPerSessionToggle() {
        return '[data-name="allowSessionComments"] [class*="_toggle_button"]';
    }

    getAllowCommentsPerSessionToggleContainer() {
        return "allowSessionComments";
    }

    getCommentLeaderBoardPointsTxtF() {
        return '[name="awardPoints"]'
    }


    //----- Collaborations Section -----//

    getCollaborationsDDown() {
        //return '[data-name="courseCollaborations"] [class*="select-module__placeholder"]'
        return '[data-name="courseCollaborations"] [class*="_placeholder_7teu8_20"]'
    }

    getCollaborationsSearchTxtF() {
        //return '[data-name="courseCollaborations"] [class*="select-module__input"]'
        return '[data-name="input"][aria-label="Collaborations"]'
    }

    getCollaborationsOpt(collabName) {
       cy.get('[aria-label="Collaborations"]:nth-child(1)').eq(1).contains(collabName).click()
    }

    getSelectedCollaboration() {
        return '[data-name="courseCollaborations"] [data-name="label"]'
    }

    getClearBtn() {
        return '[class*="icon icon-x"]'
    }

}