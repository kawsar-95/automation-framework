import arBasePage from "../../ARBasePage";
import ARDashboardPage from "../Dashboard/ARDashboardPage";

export default new class ARDashboardAccountMenu extends arBasePage {
    
    getChangePasswordBtn() {
        return '[title="Change Password"]';
    }

    getUserSettingsBtn() {
        return '[title="User Settings"]';
    }

    getPortalSettingsBtn() {
        return '[title="Portal Settings"]';
    }

    getBlatantAccountMenu(){
        return '[class*="btn success large has-icon"]'
    }

 /*   getLearnerExperienceBtn() {
        return '[href="/"]';
    }


    getReviewerExperienceBtn() {
        return '[href="/reviewer"]';
    }*/

    // Use this text as value for data-name attribute to get this element
    getTimezoneContainer() {
        return "admin-time-zone";
    }

    getTimezoneDDown() {
        return '[data-name="admin-time-zone"] [data-name="field"]';
    }

    getTimezoneDDownOpt() {
        return 'li:nth-of-type(1) > [class*="select-option-module__select_option"] > [class*="select-option-module__label"]';
    }


    getLearnerOrReviewerExperienceBtnByName(name) {
        cy.get('[class*="_button_link"]').contains(`${name}`).click(); 
    }



    getLogoutBtn() {
        return "logout";
    }

    getA5AccountSettingsBtn() {
        return "a#account-menu-button > .icon.icon-person-round"
    }

    getA5LogOffBtn(){
        return `[class="icon icon-off"]`
    }

    getA5LearnerExperienceBtn() {
        return ".content.scrollable-content > a:nth-of-type(4)"
    }

    getA5MessageCountIcon() {
        return `[class="count"]`
    }

    // Added for the TC# C7608
    getDiffarentCustomSection() {
        return '[data-bind="foreach: CustomFieldDefinitions"]'
    }

    getCustomListGroup(){
        return '[class="list-group-main"]'
        
    }

    getCustomListGroupGrey(){
        return '[class*="list-group"]'
        
    }

    getCustomFirstInputField(){
        return 'input[data-bind="value:Name"]'
    }

    getCustomFirstDropdownField(){
        return `[data-bind="dropdown: { Value: Type, Disabled: Id() != null, AllowNull:false, Options: [{Id: AbsorbLMS.Absorb.Models.FieldDefinitionTypes.Text, Name: 'Text'}, {Id: AbsorbLMS.Absorb.Models.FieldDefinitionTypes.Boolean, Name: 'TrueFalse'}, {Id: AbsorbLMS.Absorb.Models.FieldDefinitionTypes.Integer, Name: 'Number'}, {Id: AbsorbLMS.Absorb.Models.FieldDefinitionTypes.Decimal, Name: 'Decimal'}, {Id: AbsorbLMS.Absorb.Models.FieldDefinitionTypes.Date, Name: 'Date'}, {Id: AbsorbLMS.Absorb.Models.FieldDefinitionTypes.DateTime, Name: 'DateAndTime'}], CssClass: 'short'}"]`
    }

    getCustomFirstOptionalField(){
        return `[data-bind="dropdown: { Value:Behavior, AllowNull:false, Options: $parent.FieldBehaviors, CssClass:'short'}"]`
    }
    
    getCustomCheckedBtn(){
        return '[data-bind="term: UncheckedText"]'
    }

    getCustomAddlistBtn(){
        return '[data-bind="click:  $parent.AddList.bind($parent,$data)"]'
    }

    getCustomTopParRemoveBtn(){
        return 'li[class="list-group grey"]'
    }

    getCustomChieldRemoveBtn(){
        return 'div[class="list-group-top no-edit"]'
    }

    getCustomRemoveBtn(){
        return 'a[title="Remove Field"]'
    }
    
    getCustomFieldListItem(){
        return '[placeholder="List Item"]'
    }

    getCustomColumnHeader(){
        return 'th[role="columnheader"]'
    }

    getCustomReportLeftListLebel(){
        return '[data-name="label"]'
    }

    getCustomReportParentHeader(){
        return '[data-name="report-header-tools"]'
    }

    getLeftContantMenuLA(){
        return 'Learner Activity'
    }

    getCustomReportDataName(){
        return 'client-default-layout'
    }
    getCustomReportMenu(){
        return 'Reports'
    }    

    goToLearnerExperience() {
        cy.get(this.getElementByDataNameAttribute(ARDashboardPage.getAccountBtn()), {timeout: 30000}).click({ force: true })
        this.getLearnerOrReviewerExperienceBtnByName('Learner Experience')        
    }

    // Added for the JIRA# AUT-602 / TC# C2086
    getLanguageBar () {
        return '[data-name="admin-language"] [data-name="field"]'
    }

    getLanguageOpt () {
        return 'li [class*="_label_"]'
    }

    getTimeSelected (timeZone) {
        return `[title="${timeZone}"]`
    }
}