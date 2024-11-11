import leBasePage from '../../LEBasePage'

export default new class LEEditTileModal extends leBasePage {


    //----- For Customizing Tile Theme -----//

    getCustomizeTileToggle() {
        return '[class*="dashboard-custom-tile-theme-module__toggle_wrapper"] [class*="toggle__slider"]'
    }

    getCustomizeTileThemeToggleModule(){
        return `[class="redux-form-toggle-module__toggle___kcbdB"]`
    }

    getCustomizeTileThemeToggleBtn(){
        return `[name="isThemeCustomized"]`
    }

    getToggleBtnSlider(){
        return `[class*="redux-form-toggle-module__slider"]`
    }

    getTileTextColorTxtF() {
        return '[name="customTextColor"]'
    }

    getTileThemeColorContainer() {
        return '[class*="dashboard-custom-tile-theme-module__input_wrapper"]'
    }

    getTileIconContainer() {
        return '[class*="dashboard-custom-tile-theme-module__tile_icon_wrapper"]'
    }

    getTileBackgroundContainer() {
        return '[class*="dashboard-custom-tile-theme-module__tile_background_wrapper"]'
    }

    getTileBackgroundDisplayRadioBtn() {
        return '[class*="dashboard-custom-tile-theme__background_image_display_radio_buttons"]'
    }

    //Pass either 'Top Left', 'Top Center', 'Top Right', 'Center Left', 'Center Center', Center Right', 'Bottom Left', 'Bottom Center', or 'Bottom Right'
    getTileBackgroundAlignmentBtn(align) {
        return `[title="Align: ${align}"]`
    }

    getTileBackgroundOpacity() {
        return '[class*="DefaultProgressBar_progressBar"]'
    }

    /**
     * Sets the opacity with the slider. When using click() on the slider element, the click event will always be in the middle
     * so, we can set the width of the slider manually to get the desired opacity selection
    */
    getSetTileBackgroundOpacity(opacity) {
        cy.get(this.getTileBackgroundOpacity()).invoke('attr', 'style', `left: 0px; width: ${Math.round(opacity * 2)}%;`)
        cy.get(this.getTileBackgroundOpacity()).click({force:true})
    }

    getUploadFileBtn() {
        return '[class*="redux-form-image-upload__upload_image_overlay_btn"]'
    }

    getUploadMsg() {
        return '[class*="redux-form-file-upload-module__scanning_container"]'
    }

    getDeleteImageBtn() {
        return '[class*="redux-form-image-upload__delete_image_overlay_btn"]'
    }

    getTileThemeModuleLabel() {
        return '[class*="dashboard-custom-tile-theme-module__label"]'
    }

    getTileThemeColorPicker() {
        return '[class*="redux-form-color-picker__eyedropper"]'
    }

    getColorPickerTxtF() {
        return '[id*="rc-editable-input"]'
    }

    //pass 'Icon', 'Text', or 'Background' and desired color in hex format (ex. #355a75) to change the element's color via color picker
    getPickTileElementColorByName(element, color) {
        cy.get(this.getTileThemeModuleLabel()).contains(`Tile ${element} Color`).parents(this.getTileThemeColorContainer()).within(() => {
            cy.get(this.getTileThemeColorPicker()).click({force:true})
        })
        cy.get(this.getColorPickerTxtF()).clear().type(color)
        cy.get(this.getTileThemeModuleLabel()).contains(`Tile ${element} Color`).parents(this.getTileThemeColorContainer()).within(() => {
            cy.get(this.getTileThemeColorPicker()).click({force:true}) //close color picker
        })
    }

    //Pass image path to change the tile icon image
    getCustomizeTileIcon(imagePath) {
        cy.get(this.getTileThemeModuleLabel()).contains(`Customize Tile Icon`).parents(this.getTileIconContainer()).within(() => {
            cy.get(this.getUploadFileBtn()).click()
            cy.get(this.getFileInput()).attachFile(imagePath)
            cy.get(this.getUploadMsg()).should('contain', 'Upload processing')
            this.getLShortWait()
            cy.get(this.getUploadMsg()).should('contain', 'Upload verified')
        })
    }

    //Pass image path to change the tile background image
    getCustomizeTileBackground(imagePath) {
        cy.get(this.getTileThemeModuleLabel()).contains(`Customize Tile Background`).parents(this.getTileBackgroundContainer()).within(() => {
            cy.get(this.getUploadFileBtn()).click()
            cy.get(this.getFileInput()).attachFile(imagePath)
            cy.get(this.getUploadMsg()).should('contain', 'Upload processing')
            this.getLShortWait()
            cy.get(this.getUploadMsg()).should('contain', 'Upload verified')
        })
    }

    //-- For Tile Preview --//

    getTileTextPreview() {
        return '[class*="dashboard-custom-tile-theme-module__tile_background_title"]'
    }

    getTileIconPreview() {
        return '[class*="dashboard-custom-tile-theme-module__icon_large"]'
    }

    getTileBackgroundPreview() {
        return '[class*="dashboard-custom-tile-theme-module__sample"]'
    }

    getColorPickerBox(){
        return `[class*="redux-form-color-picker-module__color_box"]`
    }

    getBackgroundImageAlignmentSquare(){
        return `[class*="alignment-module__button___"]`
    }

    getBackgroundImageOpacitySlider(){
        return `[class="handleContainer handleContainer_1"] > button`
    }

    getTileBackgroundUploadAFileContainer(){
        return`[class*="redux-form-image-upload__placeholder"]`
    }

    getCustomizeTileIconUploadAFileField(){
        return `[class*="redux-form-image-upload__background_image_wrapper"]`
    }

    getBackgroundImagePercentage(){
        return `[class="slider-module__slider_label___oMZdu slider__slider_label"]`
    }

    //----- For Hyperlink Tile -----//

    getTitleTxtField(){
        return '[name="titleTerm"]';
    }

    getDescriptionTxtField(){
        return '[name="nameTerm"]';
    }

    getLinkTxtField(){
        return '[name="href"]';
    }
    
    getTargetDDown(){
        return '[name="target"]';
    }

    getSaveBtn() {
        return '[class*="tile-module__save_btn"]'
    }

    //-----                   ------//

    getModalCloseBtn() {
        return '[class*="icon icon-x-thin"]'
    }

    // To turn on the toggle button pass argument as 'true', to turn of the toggle btn pass the argument as 'false'
    getTurnOnOffCustomizeTileThemeToggleBtn(value){
        cy.wait(2000)
        cy.get(this.getCustomizeTileThemeToggleBtn()).invoke('attr','value').then((status) =>{
            if(status === value){
                cy.get(this.getCustomizeTileThemeToggleBtn()).should('have.attr', 'value', value)
            }
            else{
                cy.get(this.getCustomizeTileThemeToggleModule()).within(()=>{
                    cy.get(this.getToggleBtnSlider()).click()
                })
                cy.wait(1000)
                cy.get(this.getCustomizeTileThemeToggleBtn()).should('have.attr', 'value', value)
            }
        })
    }    

}