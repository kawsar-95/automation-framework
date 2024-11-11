import ARBasePage from "../../../ARBasePage";

export default new class ARCouponsAddEditPage extends ARBasePage {
    getCouponsActionHeader() {
        return '[class*="sidebar-title"]';
    }

    getSideBarContent() {
        return '[class*="sidebar-content"]';
    }

    getGenerateBtn() {
        return '[class*="btn has-icon generate-key"]';
    }

    getNameTxf() {
        return 'input[name="Name"]'
    }

    getDescriptionTxtF() {
        return 'textarea[name="Description"]';
    }

    getDiscountTypeByIndex(index = 1) {
        return `div#DiscountType.katana-radio-group > a:nth-of-type(${index})`;
    }
    
    getDiscountTypeChecbox() {
        return 'a[class*="radio-option"] [class="title"]'
    }

    getDiscountShowForm() {
        return '[class="input-group-addon"]';
    }


    getDepartmentField() {
        return "[data-bind='click: ToggleOpen, css: { open: Opened }']"
    }

    getDepartmentItem() {
        return "[data-bind*='text: Name']"
    }

    getCouponSaveBtn() {
        return "[class='has-icon btn submit-edit-content success large']"
    }

    getCouponGenerateBtn() {
        return "[class='btn has-icon generate-key']"
    }

    getCouponType() {
        return "[data-bind='text: Label.termify()']"
    }

    getDiscountContainer() {
        return "[data-bind='visible:IsCurrencyDiscount()']"
    }

    getDiscountPercentageContainer(){
        return "[data-bind='visible:IsPercentageDiscount()']"
    }

    getDiscountTxtF(){
        return '[data-bind*="attr: { name: Name }, value: Value"]'
    }

    getCoursesContainer() {
        return "[class='katana-multiselect ']"
    }

    getDiscountSymbol() {
        return "[class='input-group-addon']"
    }

    getVerifyDropDownField() {
        return "[class='select2-search-choice']"
    }

    getCourseDropDown() {
        return '[id="CourseIds"] input[id*="s2id_autogen"]'
    }

    getExtentionsDropDown() {
        return '[id="CourseExtensionIds"] input[id*="s2id_autogen"]'
    }

    getDropDownLabel() {
        return "[class='select2-result-label']"
    }

    getCalenderMonth() {
        return "[class='datepicker-switch']"
    }

    getCalendarBtn() {
        return "[class='btn has-icon-only'][type='button']"
    }

    getClendarContainer() {
        return "[class*='datepicker datepicker-dropdown']"
    }

    getCalendarNextBtn() {
        return "[class='next']"
    }

    getCalendarPrevBtn() {
        return "[class='prev']"
    }

    getCalendarDay() {
        return "[class='day']"
    }

    getMaxUsesField(){
        return "[name='MaxUses']"
    }

    getSingleUsePerLearnerToggleBtn(){
        return '[id="IsSingleUsePerLearner"]'
    }

    getConfirmModalBtn() {
        return `[id="confirm-modal-content"] [class*='btn']`
    }

    getModalSaveBtn() {
        return `[id="confirm-modal-content"] [class*='btn has-icon success']`
    }

    getPageHeadertitleName(){
        return '[id="edit-content"] [class="section-title"]'
    }

    getVerifyDropDownDepartment() {
        return '[data-bind="text: SelectedText() || NullText"]'
    }

    getGeneralTabMenu() {
        return '[data-tab-menu="General"]'
    }

    getRemoveAllFilterBtn() {
        return '[title="Remove All"]'
    }
    
    // this method is used to select discount type, pass the type as an argument
    getSetDiscountType(type){
        cy.get(this.getDiscountTypeChecbox()).should('contain', 'Currency')
        cy.get(this.getDiscountTypeChecbox()).should('contain', 'Percentage')
        //Click on Curreny Type
        cy.get(this.getDiscountTypeChecbox()).contains(type).click()
        if(type == 'Currency'){
            cy.get(this.getDiscountShowForm()).should('contain', 'CAD')
        }
        else{
            cy.get(this.getDiscountShowForm()).should('contain', '%')
        }
    }

    //this method is used to add a discount 

    getAddDiscount(type,amount){
        if(type == 'Percentage'){
            cy.get(this.getDiscountPercentageContainer()).within(()=>{
                cy.get(this.getDiscountTxtF()).clear().type(amount)
                cy.get(this.getDiscountShowForm()).should('contain', '%')
            })
            }
            else{
            //If type currency Type
            cy.get(this.getDiscountContainer()).within(()=>{
                cy.get(this.getDiscountTxtF()).clear().type(amount)
                cy.get(this.getDiscountShowForm()).should('contain', 'CAD')
            })
            this.getShortWait()
        }
    }
    // this method is used to select department by name 
    getSelectDepartmentByName(name){
        cy.get(this.getDepartmentField()).click()
        cy.get(this.getElementByPlaceholderAttribute('Search')).click().type(name)
        cy.get(this.getDepartmentItem()).should('contain' , name)
        cy.get(this.getDepartmentItem()).contains(name).click({ force: true })
        cy.get(this.getVerifyDropDownDepartment(), {timeout:10000}).should('contain', name)
    }

    //this method is used to give a name to a coupon and verify the name.
    getCourseByName(name) {
        cy.get(this.getCourseDropDown()).click().type(name)
        cy.get(this.getDropDownLabel(), {timeout:10000}).should('contain' , name)
        cy.get(this.getDropDownLabel()).contains(name).click()
        cy.get(this.getVerifyDropDownField(), {timeout:10000}).should('contain', name)
    }

    //this method is used to give a extention name to a coupon and verify the name.
    getExtentionsByName(name) {
        cy.get(this.getExtentionsDropDown()).click().type(name)
        cy.get(this.getDropDownLabel(), {timeout:10000}).should('contain' , name)
        cy.get(this.getDropDownLabel()).contains(name).first().click()
        cy.get(this.getVerifyDropDownField(), {timeout:10000}).should('contain', name)
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
    //this method is used to select a date from a datepicker or calendar. You should pass the date "Month Year" format. 
    //this method is used to select the day from a datepicker or calendar. You should pass the day in as number.
    //i.e: getSelectFullDate('March 2023', 21)

    getSelectFullDate(YearMonth,day){
        cy.get(this.getCalendarBtn()).click()
        this.getMediumWait()
        this.getSelectDate(YearMonth)
        this.getShortWait()
        this.getSelectDay(day)
    }
}

export const ExtentionsData = {
    "10_DAYS": "- 10 Days",
    "2_DAYS": "- 2 Days",
    "3_DAYS": "- 3 Days",
    "5_DAYS": "- 5 Days",
}

export const AddCouponsData = {
    "NAME": "GUIA-COUPON-"+ new ARBasePage().getTimeStamp(),
    "NAME2": "GUIA-COUPON-2-"+ new ARBasePage().getTimeStamp(),
    "CODE": "GUIA-CODE-"+ new ARBasePage().getTimeStamp(),
    "EXPRIEDCOUPON":"GUIA - EXPIRED - COUPON",
    "EXCEEDCOUPON":"GUIA - EXCEED - COUPON",
    "DESCRIPTION": 'ADD - COUPONS - Description'
}