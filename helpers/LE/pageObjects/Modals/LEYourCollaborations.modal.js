import leBasePage from '../../LEBasePage'

export default new class LEYourCollaborationModal extends leBasePage {

    getModal() {
        return '[class*="inline-modal-container-module__container"]'
    }
    
    getCollaborationTable() {
        return '[class*="sortable-table__table"]'
    }

    getCollaborationContainer() {
        return '[class*="table-row-module__table_row___"]'
    }

    getCollaborationName() {
        return '[class*="sortable-table__table_row_item"]'
    }

    getLoadMoreBtn() {
        return '[class*="inline-modal-module__content"] [class*="page-size-button__btn"]'
    }

    getModalCloseBtn() {
        return '[class*="icon icon-x-thin"]'
    }




}