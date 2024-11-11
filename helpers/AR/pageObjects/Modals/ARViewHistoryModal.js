import ARBasePage from "../../ARBasePage"

export default new class ARUserViewHistoryModal extends ARBasePage{

    getViewHistoryModalTitle() {
        return `h1[data-name="dialog-title"]`;
    }
    
    getTimeZone() {
        return `div[class^="dialog-module__header"] > ol li[class^="breadcrumb-module__item"]`;
    }

    //needs to be filtered when getting the result
    getViewHistoryDate() {
        return `[class*="_date"]`
    }

    getViewHistoryTime() {
        return '[class*="_time"]'
    }

    //needs to be filtered when getting the result
    getViewHistoryEditedBy() {
        return `[class*="_edited_by"]`
    }

    //needs to be filtered when getting the result
    getViewHistoryCreatedBy() {
        return `[class*="_created_details"]`
    }

    //needs to be filtered when getting the result
    getViewHistoryChange() {
        return `[class*="_field"]`
    }

    getViewHistoryCloseBtn() {
        return `button[data-name="close"`;
    }
   
    getViewHistoryModalSubTitle() {
        return `[class*="_dialog"] [data-name="item"]`;
    }
}
