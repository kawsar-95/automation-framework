import leBasePage from '../../LEBasePage'

export default new class LECoursesCollaborationModal extends leBasePage {
    
    getCoursesTable() {
        return '[class*="sortable-table__table"]'
    }

    getCourseContainer() {
        return '[class*="table-row-cell-module__table_row_item___og0s8 "]'
    }

    getCourseName() {
        return '[class*="sortable-table__table_row_item collaboration-courses-modal-module__column"]'
    }

    getViewBtn() {
        return '[class*="collaboration-courses-modal-module__view"]'
    }

    getLoadMoreBtn() {
        return '[class*="inline-modal-container-module__container"] [class*="page-size-button__btn"]'
    }

    getModalCloseBtn() {
        return '[class*="icon icon-x-thin"]'
    }

}