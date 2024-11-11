import arBasePage from "../../../../helpers/AR/ARBasePage";
import arSelectModal from '../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import { departments } from '../../../../helpers/TestData/Department/departments'

export default new class ARCourseActivityReportPage extends arBasePage {

    getChooseDDownSearchTxtF() {
        return 'input[aria-label="Course"]'
    }
    getChooseSearchTxtF() {
        return '[data-name="select-field"]'
    }
    
    ChooseAddFilter(propertyName) {
        cy.get(this.getChooseSearchTxtF()).contains('Choose').click()
        cy.get(this.getChooseDDownSearchTxtF()).type(propertyName)
        cy.get(this.getDashboardDDownOpt()).contains(propertyName).click()
        cy.get(this.getSubmitAddFilterBtn()).click()
        cy.get(this.getWaitSpinner() , {timeout:15000}).should("not.exist")
    }
    DeptAndCertificateAddFilter(propertyName, Operator = null, Value = null) {
        cy.get(this.getAddFilterBtn()).click();
        cy.get(this.getPropertyName() + this.getDDownField()).click();
        cy.get(this.getPropertyNameDDownSearchTxtF()).type(propertyName)
        cy.get(this.getPropertyNameDDownOpt()).contains(new RegExp("^" + propertyName + "$", "g")).click()
        cy.get(this.getOperator() + this.getDDownField()).click();
        cy.get(this.getOperatorDDownOpt()).contains(Operator).click();
        cy.get(this.getSubmitAddFilterBtn()).click();
        if (propertyName.includes('Department')) {
            cy.get(this.getElementByAriaLabelAttribute(this.getDepartmentTxt())).click()
            arSelectModal.SearchAndSelectFunction([departments.dept_top_name])
        }
        else {
            cy.get(this.getCertificateDateTxt()).click()
            cy.get(this.getElementByAriaLabelAttribute(this.getValueTxt())).type(Value)
            cy.get(this.getPropertyNameDDownOpt()).contains(Value).click()
        }
        cy.get(this.getSubmitAddFilterBtn()).click();
        cy.get(this.getWaitSpinner(), { timeout: 20000 }).should('not.exist')
    }

    getTableColumnAndScrollIntoView() {
        cy.get('tr >th:nth-child(9)').scrollIntoView()
    }
    getPageHeaderTitle() {
        return 'div[class*="report-header-module__title"]'
    }
    getGenerateReportFileFormatDDown() {
        return '[class*="_select_field_4ffxm_1"]'
    }
    getGenerateReportFileFormatExcelOption() {
        return 'li[id*="select-47-options-Excel"]'
    }
    getGenerateReportFileFormatCSVOption() {
        return 'li[id*="select-47-options-CSV"]'
    }
    getGenerateReportFileFormatOption() {
        return 'li[class*="_option_1mq8e_10"]'
    }
    getDownloadReportBtn() {
        return '[class*="_button_4zm37_1 _success_"]'
    }

    getDepartmentTxt() {
        return 'Department'
    }

    getLayoutMenuItems() {
        return '[class*= "_grid_column_"]'
    }

    //this method verify layout items' name and index at the same time
    getVerifyLayoutMenuItemByNameAndIndex(index, name) {
        cy.get(this.getLayoutMenuItems()).eq(index).should('contain', name)
    }
}
