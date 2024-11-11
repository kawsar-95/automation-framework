import { miscData } from "../../../TestData/Misc/misc";
import arBasePage from "../../ARBasePage"
import ARFileManagerUploadsModal from "../Modals/ARFileManagerUploadsModal";
import ARUploadFileModal from "../Modals/ARUploadFileModal";

export default new class ARBillboardsAddEditPage extends arBasePage {

    // Billboard Page Title

    // General Section
    getGeneralPublishedToggleContainer() {
        return "isActive";
    }

    getGeneralPublishedToggleMsg() {
        return "Your billboard will not be visible to your learners if this is set to 'No'"
    }

    getPublishToggleChkbx(){
        cy.get('div[data-name="toggle"]').find('input[data-name="checkbox"]').should('have.attr', 'aria-checked', 'true')
    }

    getFileBrowserModal() {
        return 'form[data-name="file-browser"]'
    }

    getFileBrowserSaveBtn() {
        return 'button[data-name="submit"]'
    }

    getGeneralTitleTxtF() {
        return 'input[aria-label="Title"]'
    }

    getGeneralTitleErrorMsg() {
        return '[data-name="title"] [data-name="error"]'
    }

    getGeneralDescriptionTxtF() {
        return 'div[aria-label="Description"] > p'
    }

    getGeneralDescriptionErrorMsg() {
        return '[data-name="description"] [data-name="error"]'
    }

    getGeneralAuthorDDown() {
        return '[class*="select-field-module__selection"]'
    }

    getGeneralAuthorDDownOpt() {
        return '[class*="select-option-module__label"]'
    }


    // Billboard Section

    getBillboardForm() {
        return '#billboardBillboard'
    }

    getRadioBtn() {
        return "radio-button";
    }

    getTargetURLTxtF() {
        return 'input[name="targetUrl"]'
    }

    getOrderTxtF() {
        return 'input[name="order"]'
    }

    getTagsDDown() {
        return '[class*="select-field-module__selection"]'
    }

    getTagsDDownOpt() {
        return '[data-name="options"]';
    }

    getTagsDDownOptions() {
        return '[class*="select-option-module__label"]'
    }

    getSearchResultMsg() {
        return '[data-name="media-library-results-count"]'
    }

    getChooseFileBtton() {
        return '[class*="file-select-module__choose"]'
    }

    getMediaLibraryContentBtn() {
        return 'div[class*="media-library-grid-view-module__grid"] > div[role="presentation"]'
    }

    getRightActionMenuLabel() {
        cy.get('[class*="flyover-module__container"]').children().should(($child) => {
            expect($child).to.contain('Alphabetical');
            expect($child).to.contain('Date Added (Newest)');
            expect($child).to.contain('Date Added (Oldest)');
            expect($child).to.contain('Popular');
        })
    }

    getFileMngrApplyBtn() {
        return '[data-name="media-library-apply"]'
    }

    getDateAddedBtn() {
        return '[class*="select-field-module__select_field"]';
    }

    getDateAddedOpt() {
        return ' ul[id*="select"]'
    }


    getChooseFileBtn() {
        return 'button[data-name="select"]'
    }

    getWebMChosseBtn() {
        return '[data-name="videoWebm"] [data-name="select"]'
    }
    getMP4ChooseBtn() {
        return '[data-name="videoMp4"] [data-name="select"]'
    }

    getBillboardNameTextF() {
        return '[data-name="billboardImage"] [data-name="text-input"]'
    }

    // Availability Section

    getAvailabilityForm() {
        return "edit-billboard-availability-section";
    }

    getAvailabilityCityTxtF(cityIndex = 1) {
        return `[role="listitem"]:nth-of-type(${cityIndex}) > div:nth-of-type(2) [class*="select-field-module__selection"]`
    }

    getAvailabilityStateTxtF(stateIndex = 1) {
        return `[role="listitem"]:nth-of-type(${stateIndex}) [role] div:nth-of-type(2) [class*="select-field-module__selection"]`
    }

    getBillBoardType() {
        return "[data-name='billboardType']"
    }

    getRadioBtnLabel() {
        return '[class*="_radio_button"]'
    }

    getBillBoardImageRadioBtn(imageRadioBtn) {
        cy.get(this.getBillBoardType()).children().find(this.getRadioBtnLabel()).contains(imageRadioBtn).parent().find('input').should('be.checked')
    }

    getgetBillBoardImageSourceTypeRadioBtn() {
        return '[data-name="billboardImage"] [aria-label="Source Type"] [data-name="label"]'
    }

    getBillboardImageTxtF() {
        return '[name="billboardImage"]'
    }

    getBillBoardVideoRadioBtn(videoRadioBtn) {
        cy.get(this.getBillBoardType()).children().find(this.getRadioBtnLabel()).contains(videoRadioBtn).click()
    }


    getRefineBtn(btnIndex = 1) {
        return `[class] [role="listitem"]:nth-of-type(${btnIndex}) [class*="button-module__content"]`
    }

    getAvailabilityInputTxtF(inputTextIndex = 1) {
        return `[role="listitem"]:nth-of-type(${inputTextIndex}) [type="text"]`
    }

    getAvailabilityAddRuleBtn() {
        return '[data-name="add-rule"]'
    }

    // Edit Action Menu elements

    getSaveBtn() {
        return '[data-name="submit"]'
    }

    getPublishToggleBtn() {
        return '[class*="toggle-module__toggle--qh202"]'
    }

    getSelectedImageName() {
        return super.getElementByDataName('value')
    }

    getItemLastModified() {
        return '[class*="_last_modified_"]'
    }

    getSubmitBtn() {
        return super.getElementByDataNameAttribute("submit")
    }

    getAuthorDDown() {
        return '[data-name="authorId"] [data-name="selection"] [data-name="label"]'
    }

    getAuthorDDownTxtF() {
        return '[name="authorId"]'
    }

    getAuthorDDownOpt() {
        return '[class*="_full_name"]'
    }

    getBillboardTagDDown() {
        return '[data-name="billboardTagIds"] [data-name="selection"]'
    }

    getBillboardTagDDownTxtF() {
        return '[name="billboardTagIds"]'
    }

    getBillboardTagDDownOpt() {
        return '[aria-label="Tags"] [class*="_label"]'
    }
    getPublishedToggleInput() {
        return 'div[data-name="toggle"]>input[data-name="checkbox"][aria-label="Published"]'
    }

    getAuthorList() {
        return 'ul[aria-label="Author"]'
    }

    getFirstRulesContainer() {
        return '[aria-label="Rules"]'
    }

    getRuleDropDownBtn() {
        return '[data-name="selection"]'
    }

    getRuleDropDownOptions() {
        return `[class="_label_11q4a_62"]`
    }

    getRuleTextF() {
        return '[aria-label="Value"]'
    }

    verifyAvailabilityRules() {
        cy.get(this.getRuleDropDownOptions()).should('contain', 'City')
        cy.get(this.getRuleDropDownOptions()).should('contain', 'Competency')
        cy.get(this.getRuleDropDownOptions()).should('contain', 'Competency Level')
        cy.get(this.getRuleDropDownOptions()).should('contain', 'Country')
        cy.get(this.getRuleDropDownOptions()).should('contain', 'Date Created')
        cy.get(this.getRuleDropDownOptions()).should('contain', 'Date Hired')
        cy.get(this.getRuleDropDownOptions()).should('contain', 'Department')
        cy.get(this.getRuleDropDownOptions()).should('contain', 'Email Address')
        cy.get(this.getRuleDropDownOptions()).should('contain', 'Employee Number')
        cy.get(this.getRuleDropDownOptions()).should('contain', 'First Name')
        cy.get(this.getRuleDropDownOptions()).should('contain', 'Full Name')
        cy.get(this.getRuleDropDownOptions()).should('contain', 'Group')
        cy.get(this.getRuleDropDownOptions()).should('contain', 'Job Title')
        cy.get(this.getRuleDropDownOptions()).should('contain', 'Language')
        cy.get(this.getRuleDropDownOptions()).should('contain', 'Last Name')
        cy.get(this.getRuleDropDownOptions()).should('contain', 'Location')
        cy.get(this.getRuleDropDownOptions()).should('contain', 'State/Province')
        cy.get(this.getRuleDropDownOptions()).should('contain', 'Username')
    }

    // Added for the JIRA# AUT-548, TC# C1996
    addSampleBillboard(name, imgUrl = miscData.switching_to_absorb_img_url, save = true) {
        cy.wrap(this.WaitForElementStateToChange(this.getAddEditMenuActionsByName('Add Billboard'), 1000))
        cy.get(this.getAddEditMenuActionsByName('Add Billboard')).click()
        cy.get(this.getPageHeaderTitle(), {timeout: 3000}).should('have.text', 'Add Billboard')
        
        // Activate the Billboard
        this.generalToggleSwitch('true' , this.getGeneralPublishedToggleContainer())

        // Enter valid title
        cy.get(this.getGeneralTitleTxtF()).clear().type(name)

        this.getBillBoardImageRadioBtn('Image')
        cy.get(this.getgetBillBoardImageSourceTypeRadioBtn()).contains('Url').click().click()
        cy.get(this.getBillboardImageTxtF()).type(imgUrl)

        if(save === true) {
            // Save the billboard
            cy.get(this.getSaveBtn(), {timeout: 7500}).should('not.have.attr','aria-disabled')
            cy.get(this.getSaveBtn()).click()
            cy.get(this.getToastSuccessMsg()).should('be.visible').and('contain','Billboard has been created.')
            cy.get(this.getPageHeaderTitle()).should('have.text', 'Billboards')
        }
    }

    getSectionHeader() {
        return '[data-name="header"]'
    }
}