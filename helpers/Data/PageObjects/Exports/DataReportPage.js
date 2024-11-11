import DataBasePage from "../../DataBasePage"

export default new class DataReportPage extends DataBasePage {

    getReportAddPageNavTab() {
        return `[class="nav nav-tabs"] > li > a`
    }

    getReportAddPageNavTabThenClick(name) {
        cy.get(this.getReportAddPageNavTab()).contains(name).click()
    }

    getFileFormatFileNameField() {
        return `[id=FileName]`
    }

    getInitialTableSearchField() {
        return `[aria-labelledby="select2-Selection-container"]`
    }

    getInitialTableTextF() {
        return `[class*="select2-search__field"]`
    }

    getInitialTableListItems() {
        return `[class*="select2-results__option select2-results__option--highlighted"]`
    }

    getSelectTableByFieldName(text) {
        this.getShortWait()
        cy.get(this.getInitialTableSearchField()).click()
        this.getShortWait()
        cy.get(this.getInitialTableTextF()).type(text)
        this.getShortWait()
        cy.get(this.getInitialTableListItems()).click()
    }

    getColumnsButton() {
         return `[class="pull-left btn btn-default"]`
    }

    getColumnsButtonAndClick(name) {
        cy.get(this.getColumnsButton()).contains(name).click()
    }

    getSelectColumnsModal() {
        return `[id="myModalLabel"]`
    }

    getColumnsCheckBox() {
        return `[data-bind="text: Name"]`
    }

    getColumnsCheckBoxAndClick(name,index) {
        this.getShortWait()
        cy.get('[class="modal-content"]').eq(index).within(()=>{
            cy.get(`[data-bind="text: Name"]`).contains(name).click()
        }) 
    }

    getSelectColumnsModalSaveBtn() {
        return `[class="modal-footer"] [class="btn btn-default"]`
    }

    getReportJoinCardBox() {
        return `[class="card report-card pull-left margin-right-20"]`
    }

    getJoinTitleBox() {
        return `[class="card-title"]`
    }

    getAliasTextField() {
        return `[data-bind="visible: IsSelected()"] > [id="Alias"]`
    }

    getAliasTextFieldAndClick(index,index2,input) {
        this.getShortWait()
        cy.get('[class="modal-content"]').eq(index).within(()=>{
            cy.get(`[id="Alias"]`).eq(index2).clear().type(input)
        }) 
    }

    getAddJoinBtn() {
        return `[class="pull-left btn btn-default margin-left-5"]`
    }

    getOuterJoinBox() {
        return `[id="IsOuterJoin"]`
    }

    getAddRuleBtn() {
        return `[class="btn full-width btn-primary btn-branded"]`
    }

    getRefineRuleBtn() {
        return `[class="btn btn-primary btn-branded width-150 refine"]`
    }

    getReportConfigureSaveBtn() {
        return `[class="btn btn-success btn-xl"]`
    }

    getReportDataColumnTitle() {
        return `[class="column-title"]`
    }

}
