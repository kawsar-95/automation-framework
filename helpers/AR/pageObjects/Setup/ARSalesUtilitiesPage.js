import ARBasePage from "../../ARBasePage";

export default new class ARSalesUtilitiesPage extends ARBasePage {
    getCreateFreeTrialBtn() {
        return '[class="has-icon btn edit-content"]'
    }

    getDataFromSourcePortalField(){
        return '[data-bind*="dropdown: { Value: SelectedValue, Options: SourceDemoPortals"]'
    }

    getSourcePortalDropDown(){
        return '[class="select2-result-label"]'
    }

    getTargetDatabaseField(){
        return '[data-bind*="dropdown: { Value: SelectedDatabaseValue, Options: TargetDatabases"]'
    }

    getTargetDatabaseDropDown(){
        return '[class="select2-result-label"]'
    }

    getSelectSourcePrtalByName(name){
        cy.get(this.getDataFromSourcePortalField()).click()
        cy.get(this.getSourcePortalDropDown()).contains(name).click()
    }

    getSelectTargetDatabasebyName(name){
        cy.get(this.getTargetDatabaseField()).click()
        cy.get(this.getTargetDatabaseDropDown()).contains(name).click()
    }

    getCompanyNameField(){
        return '[id="CompanyName"]'
    }

    getLMSNameField(){
        return '[id="LmsName"]'
    }

    getAccountIDField(){
        return '[data-bind*="attr: { name: Name }, value: Value, valueUpdate"]'
    }

    getCalenderButton(){
        return '[data-bind="disable: Disabled()"]'
    }

    getCalendarDay() {
        return "[class='day']"
    }

    getCalenderMonth() {
        return "[class='datepicker-switch']"
    }

    getCalendarNextBtn() {
        return "[class='next']"
    }
    
    getLeadIDField(){
        return '[data-bind*="value: LeadId,"]'
    }

    getSubdomainField(){
        return `[data-bind="valueUpdate: 'afterkeydown', value: Subdomain"]`
    }

    getSubmitBtn(){
        return '[data-menu="Sidebar"]'
    }

    getconfirmationSubmit(){
        return '[class="btn has-icon success"]'
    }

    getPageTitle(){
        return '[class="section-title"]'
    }

    //this method is used to select the day from a datepicker or calendar. You should pass the day in as number.
    //i.e:getSelectDay(17)
    getSelectDay(day) {
        cy.get(this.getCalendarDay()).contains(day).click()
    }

    //this method is used to select a date from a datepicker or calendar. You should pass the date "Month Year" format. 
    //i.e: getSelectDate('April 2027') 
    getSelectDate(date) {
        let storedValue
        cy.get(this.getCalenderMonth()).first().invoke('text').then((text) => {
            storedValue = text
        }).then(() => {
            if (storedValue == date) {
                return
            } else {
                cy.get(this.getCalendarNextBtn()).first().click()
            }
            this.getSelectDate(date)
        })
    }



}

export const portalName = {
    '#Demo kslworld': '#Demo kslworld',
    '7284DEmoClient': '7284DEmoClient',
    'Client_DemoSourcePortal': 'Client_DemoSourcePortal'
}

export const targetDatabaseName = {
    'Main': 'Main',
    'DPTest':'DPTest',
}

export const subdomainName = {

    'subdomainNameDynamic': Math.random().toString(36).substring(2,7)+'.qa',
    'subdomainNameFirst': 'guiafirst.qa',
    'subdomainNameSecond': 'guiasecond.qa',
    'subdomainNameThird': 'guiathird.qa',
    'subdomainNameForth': 'guiaforth.qa',
}

export const accountIdentification = {
    "companyName": "ABSORB-GUIA",
    "lmsName": "GUIA-LMS" + new ARBasePage().getTimeStamp(),
    "LeadIDFirst": "123",
    "LeadIDSecond": "1234",
    "LeadIDThird": "12345",
    "futuredate1": "March 2024",
    "futuredate2": "April 2025",
    "futuredate3": "May 2024",

}