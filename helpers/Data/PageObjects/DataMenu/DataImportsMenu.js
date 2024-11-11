import DataBasePage from "../../DataBasePage";

export default new class DataImportsMenu extends DataBasePage {

    getImportSideBar() {
        return `[class*="actionSidebar"] > a`
    }

    getImportsRightSideMenuThenClick(name) {
        this.getShortWait()
        cy.get(this.getImportSideBar()).should('be.visible')
        cy.get(this.getImportSideBar()).contains(name).click()
    }

    getImportIntegrationModal() {
        return `[class*="modal-title"]`
    }

    getUploadField() {
        return `[name="Upload"]`
    }

    getSubmitBtn() {
        return `[type="submit"]`
    }

    getModuleTypeModalNextBtn() {
        return `[id="btnNext"]`
    }

    getModuleTypeModalAddBtn() {
        return `[id="AddButton"]`
    }

    getImportReportFilters(text) {
        return `[data-title="${text}"] [class*="btn btn-default filter"]`
    }

    getSelectOperatorValue() {
        return `[id="ValueOperator"]`
    }

    getFilterTextF() {
        return `[id="FilterValue"]`
    }

    getFilterSearchField() {
        return `[class*="select2-search__field"]`
    }
 
    getDeleteBtn() {
        return `[class="btn btn-primary confirmLink"]`
    }

    getFilterTextF2()
 {
    return `[class*="select2 select2-container"]`
 }
    getFilterAddBtn() {
        return `[class*="btn btn-primary"]`
    }

    getImportFilterResults() {
        return `td[class =""]`
    }

}

