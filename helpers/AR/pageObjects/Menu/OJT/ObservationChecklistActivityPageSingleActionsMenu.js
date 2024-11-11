import arBasePage from "../../../ARBasePage";

export default new class ObservationChecklistActivityPageSingleActionsMenu extends arBasePage {
    

    getChecklistSummaryBtn() {
        return 'button[title="Checklist Summary"]';
    }


    getDeselectBtn() {
        return '[class*="deselect_button"] [class*="button-module__content"]';
    }


}