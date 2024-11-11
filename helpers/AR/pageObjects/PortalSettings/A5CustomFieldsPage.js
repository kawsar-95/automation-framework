import { commonDetails } from "../../../TestData/Courses/commonDetails";
import ARBasePage from "../../ARBasePage";



let dropdownResultId = "" ;

export default new class CustomFieldPage extends ARBasePage {

    getAddFieldBtn() {
        return `a[class*="btn full-width"]`
    }

    getCustomFieldContainer() {
        return `li[class="list-group grey"]`
    }

    getCustomFieldMainDiv() {
        return `div[class*="list-group-main"]`
    }

    getMainDivDropDown() {
        return `div[class="shorter katana-dropdown"]`
    }

    getSaveBtn() {
        return cy.get(`a[data-menu="Sidebar"]`).contains('Save')
    }

    getRemoveFilterBtnContainer() { 
        return `div[class*="list-group-top no-edit"]`
    }

    getRemoveFilterBtn() {
        return `a[class*="btn border has-icon-only delete"]`
    }

    getSearchResultsContainer() {
        return ` div[class="select2-result-label"]`
    }

    //ul[class="select2-results"][role="listbox"]

    getSelectOption(name) {
        cy.get(this.getSearchResultsContainer() ,{timeout:15000}).contains(name).invoke('attr','id').then((id)=>{
            dropdownResultId = id.toString();
            cy.get(this.getSelectedID() , {timeout: 15000}).click()
        })
    }

    getSelectedID() {
        return `#${dropdownResultId}`
    }


}

export const customField = {
    "customFieldName": "CustomFiled "+commonDetails.timestamp,
}