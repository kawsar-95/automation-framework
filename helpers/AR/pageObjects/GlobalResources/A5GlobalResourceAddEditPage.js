import arBasePage from "../../ARBasePage";

export default new class A5GlobalResourceAddEditPage extends arBasePage {

    getGlobalResourceErrorMsg() {
        return '[class*="validation-summary-errors"]'
    }

    getGlobalCategoryErrorMsg(){
        return '[class*="field-validation-error"]'
    }

    getGlobalCategoryUnsavedChangeAddDeleteBtn(){
        return '[class*="footer"] [href]'
    }
    getGlobalCategoryUnsavedChangesSelectBtn(name){
        cy.get(this.getGlobalCategoryUnsavedChangeAddDeleteBtn()).filter(`:contains(${name})`,{timeout:7000}).click()
    }

    //----- For General Tab -----//

    getCategoryF() {
       // return '[id="CategoryId"]'
       return `div[data-name="categoryId"]`
    }

    getGCategoryF() {
        return '[id="ParentId"]'
    }

    getCategoryDDown() {
        return '[id="CategoryId"] [class*="icon icon-arrows-up-down"]'
    }

    getGCategoryDDown() {
        return '[id="ParentId"] [class*="icon icon-arrows-up-down"]'
    }

    getCategoryDDownOpt() {
        return '[class*="drop-down"]'
    }

    getNameTxtF() {
        return '[placeholder="Name"]'
    }

    getFileF() {
        return '#File > .input-group > input'
    }

    getFileTxtF() {
        return this.getElementByNameAttribute("file")
    }

    getPlaceHolderTextF() {
        return this.getElementByPlaceholderAttribute("Enter URL or Choose File")
    }

    getChooseFileBtn() {
        return '[data-bind="text: absorb.data.terms.ChooseFile"]'
    }

    getDescriptionTxtF() {
        return this.getElementByAriaLabelAttribute("Description")
    }

    getTagsTxtF() {
        return '[data-name="tags"] [data-name="selection"]'
    }

    getTagsOpt() {
        return '[class="_label_ledtw_62"]'
    }

    getRemoveTagByName(name) {
        cy.get('[class*="select2-search-choice"]').contains(name).parents('[class*="select2-search-choice"]').within(() => {
            cy.get('[class*="select2-search-choice-close"]').click()
        })
    }

    getUniqueResourceName()
    {
        const dateNow = new date().toLocaleDateString()
        return dateNow
    }


    getCancelBtn() {
        return `[class*='has-icon btn cancel']`
    }


    getUnsavedChangesTxt() {
        return '[class*="modal-content vertical-align"]'
      }

    //Upload File Pop up Window

    getAvailabilityPrivateBtn()
    {
        
       cy.get('[data-bind*="Level.Private "]').invoke('attr', 'class', 'radio-option selected')
    
    }

    getAvailabilityPublicBtn()
    {
        cy.get('[data-bind*="Level.Public "]').invoke('attr', 'class', 'radio-option selected')
    }

    getClickAvailabilityPublicBtn()
    {
        cy.get('[data-bind*="click: access"]').eq(0).click({force:true})
    }

    getUploadedFileTxt()
    {
        
        return 'input[name="File"]'
      
    }

    getAvailabilityPublicRadoioBtnSelected()
    {
        cy.get('[class="radio-option selected"] [data-bind="text: absorb.data.terms.Public"]').should('exist')
    }

    getAvailabilityPrivateRadoioBtnSelected()
    {
        cy.get('[class="radio-option selected"] [data-bind="text: absorb.data.terms.Private"]').should('exist')
    }

    getUploadFilePopUpWindow()
    {
        cy.contains('Upload File').should('be.visible')
    }

    getAddResourcePage()
    {
        cy.contains('Add Resource').should('be.visible')
    }

    getPublicRadioBtnHelperText()
    {
       return "div[data-bind*='PublicAccessControlLevelDescription']"
    }
    
    getPrivateRadioBtnHelperText()
    {
       return "div[data-bind*='PrivateAccessControlLevelDescription']"
    }

    getFileUpdateInformationText()
    {
       return  "div[data-bind*='text: editedByMessage()']"
    }



    //----- For Availability Tab -----//

    getAvailabilityTab() {
        return '[data-tab-menu="Availability"]'
    }

    getNoRulesBanner() {
        return '[class*="highlight no-items margin-bottom"]'
    }

    getNoRulesTxt() {
        return "There are no rule filters set - file visible to all users."
    }

    //Adds a rule - pass the type, filter option, txt field input rule number (ex. 1 for top rule, 2 for second rule, etc)
    getAddRule(type, filter, input, num = 1) {
        cy.get('[class*="btn full-width"]').within(() => {
            cy.get('[class*="icon-plus"]').click()
        })
        cy.get(`div:nth-of-type(${num+1}) > [class*="fields-wrapper"]`).within(() => {
            cy.get(`[class*="property-select-dropdown"]`).select(type)
            cy.get(`[data-bind="options: Operators, value: Operator, optionsText: 'Text', optionsValue: 'Value', event: { change: SelectionChanged }"]`).select(filter)
            cy.get(`[class*="value-select"]`).type(input)
        })
    }

    getDeleteRuleByIndex(num) {
        cy.get(`div:nth-of-type(${num+1}) > [class*="fields-wrapper"]`).within(() => {
            cy.get(this.getTrashBtn()).click()
        })
    }

    //sidebar menu item
    getSidebarMenuActionsByNameThenClick(name) {
        this.getShortWait()
        cy.get('[class*=button-module__content]').filter(`:contains(${name})`).click({ force: true });
    }

    /**
     * Added for the TC# C7367
     * @param {string} btnText 'Public' / 'Private' Availability
     */
    getAvailabilityBtn(btnText)
    {
        return `span[data-bind='text: absorb.data.terms.${btnText}']`
    }

}
//These files can only be accessed by authenticated LMS users and enrolled learners.
export const helperTextMessages = {
    "publicMessage":'These files are accessible and visible for non-LMS users through the Public Dashboard and Course Catalog.',
    "privateMessage":'These files can only be accessed by authenticated LMS users and enrolled learners.'
}