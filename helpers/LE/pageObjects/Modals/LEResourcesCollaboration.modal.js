import leBasePage from '../../LEBasePage'

export default new class LEResourcesCollaborationModal extends leBasePage {
    
    getResourceTable() {
        return '[class*="sortable-table__table"]'
    }

    getResourceContainer() {
        return '[class*="table-row-module__table_row___"]'
    }

    getResourceName() {
        return '[class*="table-row-cell-module__table_row_item___og0s8 collaboration-resources-modal-module__column___"]'
    }

    getOpenBtn() {
        return '[class*="collaboration-resources-modal-module__link"]'
    }

    getLoadMoreBtn() {
        return '[class*="inline-modal-container-module__container"] [class*="page-size-button__btn"]'
    }

    getModalCloseBtn() {
        return '[class*="icon icon-x-thin"]'
    }

}