import arBasePage from "../../../../helpers/AR/ARBasePage";
import ARDashboardPage from "../Dashboard/ARDashboardPage";

export default new class ARCourseActivityReportPage extends arBasePage {

    getChooseDDownSearchTxtF() {
        return 'input[aria-label="Course"]'
    }
    ChooseAddIsEnrolledFilter() {
        cy.get(this.getFilterItem()).contains("Is Enrolled ").click()
        cy.get(this.getSubmitAddFilterBtn()).click()

    }

    getFilterItem() {
        return `[data-name="data-filter-item"]`
    }

    //cy.get('#data-suggested-filter-item-0 > .data-filter-item-module__end_container--S8kzU')

    getPropertyName() {
        return '[class*="data-filter-editor-module__filter_menu"] > div:nth-of-type(2) ';
    }

    getPageHeader() {
        return `[data-name="title"][id="courseEnrollments-report-title"]`
    }

    getProperty() {
        return '[data-name="name"]'
    }

    getValue() {
        return '[data-name="value"]'
    }

    getIsEnrolled() {
        return '[data-name="isEnrolled"]'
    }

    getUsername() {
        return '[data-name="username"]'
    }

    verifyFilteredPropertyAndValue(property, value) {
        cy.get(this.getEditFilterBtn() + " " + this.getProperty(), {timeout:10000}).should('contain', property)
        cy.get(this.getEditFilterBtn() + " " + this.getProperty()).contains(property).parents(this.getEditFilterBtn()).within(() => {
            cy.get(this.getValue()).should('contain', value)
        })
    }

    verifyLearnerIsEnrolledOrNot(username , value) {
        cy.get(this.getUsername(), {timeout:15000}).should('contain', username)
        cy.get(this.getUsername()).contains(username).siblings(this.getIsEnrolled()).should('contain', value)
    }
}