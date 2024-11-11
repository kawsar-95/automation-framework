import LEBasePage from '../../LEBasePage'

export default new class LESearchResultsPage extends LEBasePage {
    getFirstSearchResult() {
        return '[data-name="row-0"][class^="sortable-table-module__table_row_container"]'
    }
}