import arBasePage from "../../ARBasePage";

export default new class A5LeaderboardsAddEditPage extends arBasePage {

    getAvailabilityTabBtn() {
        return `[data-tab-menu="Availability"]`;
    }

    //----- Only Available from the Availability Tab -----//

    //Adds a rule - pass the type, filter option, txt field input rule number (ex. 1 for top rule, 2 for second rule, etc)
    getAddRule(type, filter, input, num = 1) {
        cy.get('[class*="btn full-width"]').eq(1).within(() => {
            cy.get('[class*="icon-plus"]').click()
        })
        cy.get(`div:nth-of-type(${num + 1}) > [class*="fields-wrapper"]`).within(() => {
            cy.get(`[class*="property-select-dropdown"]`).select(type)
            cy.get(`[data-bind="options: Operators, value: Operator, optionsText: 'Text', optionsValue: 'Value', event: { change: SelectionChanged }"]`).select(filter)
            cy.get(`[class*="value-select"]`).type(input)
        })
    }

    //Removes rules from the list by index. Removes 1st rule (div=2) by default
    getRemoveRuleByIndexBtn(tabIndex = 2) {
        return `.rules > div:nth-of-type(${tabIndex}) .border.btn.delete.has-icon-only`
    }

    getStartDate() {
        return '[class="katana-datepicker"][id="StartDate"]'
    }
    getEndDate() {
        return '[class="katana-datepicker"][id="EndDate"]'
    }

    getDatePickerDays() {
        return '[class="datepicker-days"]'
    }

    getActionMenuItems(){
        return `a[data-menu="Sidebar"]`
    }

    getSelectActionMenuItems(name){
        cy.get(this.getActionMenuItems()).contains(name).click()
    }

    getNameTxtF() {
        return '[name="Name"]'
    }

    getDescriptionTxtF(){
        return '[name="redactor-editor-0"]'
    }

    getA5EditPageHeadertitle(){
        return '[id="edit-content"] [class="section-title"]'
    }
}

export const leaderboardsDetails = {
    "GUIA-Leaderboard": "GUIA - LE - Test Leaderboard",
    "leaderboardPoints": "20",
    "leaderboardPoints2": "30"
}