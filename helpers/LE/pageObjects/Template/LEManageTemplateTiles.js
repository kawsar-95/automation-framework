import LEBasePage from '../../LEBasePage'

export default new class LEManageTemplateTiles extends LEBasePage {

    getContentModule() {
        return '[class*="dashboard-list-module__wrapper"]'
    }

    getContainer() {
        return `[class*="dashboard-container-module__container"]`
    }

    getContainerHeader() {
        return `[class*="dashboard-container-module__header"]`
    }

    getContainerByIndex(div) {
        return `[class*="dashboard-container-module__container"]:nth-of-type(${div})`
    }

    getAddNewContainerBtn() {
        return '[class*="dashboard-list__add_btn"]'
    }

    getContainerTypeDDown() {
        return '[class*="dashboard-container-module__options"]'
    }

    getContainerLabelTxtF() {
        return '[class*="tile-container-module__input_label"]'
    }

    getRibbonContainerLabelTxtF() {
        return '[class*="ribbon-container-module__input"]'
    }

    getContainerLabel() {
        return '[class*="dashboard-container__label"]'
    }

    getContainerDeleteBtn() {
        return '[class*="icon icon-trashcan"]'
    }

    getContainerSaveBtn() {
        return '[class*="btn form-buttons__save_button button-module__btn___svB4M"]'
    }

    getChangesSavedBanner() {
        return `[data-name="form-info-panel"]`
    }

    getTileLabel() {
        return '[class*="tile-container-module__inner_tile"]'
    }

    getTileEditBtn() {
        return '[class*="icon icon-pencil"]'
    }

    getTileGrip() {
        return '[class*="icon icon-grip"]'
    }

    getWelcomeTileHeightSlider() {
        return '[class*="slider-module__handle"]'
    }

    getWelcomeTileHeightInput() {
        return '[name="tileHeightPercentage"]'
    }
    getWelcomeTileURLInput() {
        return '[name="url"]'
    }
    getWelcomeTileDdown() {
        return '[name="target"][aria-label="Page Opens"]'
    }

    getWelcomeTileMobileViewIcon() {
        return '[class="icon icon-mobile-phone"]'
    }
    getWelcomeTileTabletViewIcon() {
        return '[class="icon icon-tablet"]'
    }
    getWelcomeTileDesktopViewIcon() {
        return '[class="icon icon-desktop"]'
    }

    getWelcomeTileSavebutton() {
        return '[type="submit"]'
    }

    getWelcomeTileSavemessage() {
        return '[class*="new-dashboard-welcome-tile-modal-module__successful"]'
    }
    getWelcomeTilesidemenu() {
        return '[class*="new-dashboard-welcome-tile-sidebar-module__icon_container"]'
    }
    getWelcomeTileShowImage() {
        return '[aria-label="Show Image"]'
    }
    getWelcomeTileWelcomeMessageInput() {
        return '[class*="fr-element fr-view"]'
    }
    getWelcomeTileWelcomeMessageoptions() {
        return '[class*="rich-text-editor-snippets-module__expand_collapse"]'
    }
    getWelcomeTiletextlanguagedownbutton() {
        return '[class*="icon-button-module__btn___BQtJy rich-text-editor-snippets-module__collapse_button"]'
    }
    getWelcomeTileFirstnameoption() {
        return '[data-value="{{FirstName}}"]'
    }
    getWelcomeTileLastnameoption() {
        return '[data-value="{{LastName}}"]'
    }
    getWelcomeTileMiddlenameoption() {
        return '[data-value="{{MiddleName}}"]'
    }
    getWelcomeTileEmailoption() {
        return '[data-value="{{EmailAddress}}"]'
    }
    getWelcomeTilePhoneoption() {
        return '[data-value="{{Phone}}"]'
    }
    getWelcomeTileusernameoption() {
        return '[data-value="{{Username}}"]'
    }
    getWelcomeTiledepartmentoption() {
        return '[data-value="{{Department}}"]'
    }
    getWelcomeTilelmsnameoption() {
        return '[data-value="{{LMSName}}"]'
    }
    getWelcomeTilecompanynameoption() {
        return '[data-value="{{CompanyName}}"]'
    }
    getWelcomeTilecompanyphoneoption() {
        return '[data-value="{{CompanyPhone}}"]'
    }
    getWelcomeTilecompanyemailoption() {
        return '[data-value="{{CompanyEmail}}"]'
    }
    getWelcomeTilejobTitleoption() {
        return '[data-value="{{JobTitle}}"]'
    }
    getWelcomeTileWelcomepane() {
        return '[class*="new-dashboard-welcome-tile-preview-module__pane_container"]'
    }
    getWelcomeTileLanguageddown() {
        return '[class*="select-language-overflow-menu-button-module"]'
    }
    getWelcomeTileLangselectlang() {
        return '[id="flyoverMenu"]'
    }
    getWelcomeTileClosebutton() {
        return '[title="Close Edit Welcome Tile"]'
    }
    getWelcomeTileShowImageCheckbox() {
        return '[aria-label="Show Image"]'
    }
    getFileInput() {
        return 'input[type="file"]';
    }
    getWelcomeTileImgUploadverifiedstatus() {
        return '[class*="image-upload-module__scanning_container"]'
    }
    getWelcomeTileDeleteImage() {
        return '[class*="image-upload-module__delete_image_button"]'
    }

    getBillboardEditBtn() {
        return '[class="billboard-tile-container-module__overlay_text___O8Mha"]'
    }

    getBillboardTagsBtn() {
        return '[class="select-module__field___gCrbN select__field"]'
    }

    getBillboardTagsDDown() {
        return '[class="select-option-module__label___oe6uY"]'
    }

    getBillboardEditSaveBtn() {
        return '[class="btn dashboard-billboard-tile-module__save_btn___aeCqA submit__btn button-module__btn___svB4M"]'
    }

    getTileLabelAfterSave() {
        return '[class*="dropdown-module__field___ouLZ6 dashboard-container-module__options___gbZMw"]'
    }

    getEditTileTileField() {
        return '[name="titleTerm"]'
    }

    getEditTileDescriptionField() {
        return '[name="nameTerm"]'
    }

    getEditTileCategoryDDown() {
        return '[id="reduxFormSelectField34"]'
    }

    getEditTileTemplateDDownBtn() {
        return `[name="templateId"]`
    }

    getEditTileTemplateDDownList() {
        return `[name="templateId"] > option`
    }

    getSelectTemplateByName(name) {
        cy.get(this.getEditTileTemplateDDownBtn()).select(name)
        this.getShortWait()
    }

    getAddTileBtn() {
        return '[class*="btn tile-container-module__add_tile___z5YS5 button-module__btn___svB4M"]'
    }

    getAddTileModalMenu() {
        return '[class="radio-module__label___nd5nZ tile-selector-module__radio_wrapper___catYj radio__label"]'
    }

    getAddTileModalSaveBtn() {
        return '[class="btn tile-selector-module__save_btn___JtP61 submit__btn button-module__btn___svB4M"]'
    }

    getAddInnerTile() {
        return '[class="tile-container-module__inner_tile___E8WIw"]'
    }

    getAddTileCategoryDDown() {
        return '[name="categoryId"]'
    }

    getAddTileInnerMenu() {
        return '[class="tile-selector-module__form_top___TJBYj"]'
    }

    getAddTileCategorySaveBtn() {
        return '[class="btn dashboard-category-tile-module__save_btn___iop1c submit__btn button-module__btn___svB4M"]'

    }

    getSuccessSaveMessage(){
        return '[class="form-info-panel-module__success_message___IxHTV form__success_message"]'
    }

    getEditInnerTileForSmoke() {

        cy.get(this.getEditTileTileField()).type('My Course')
        cy.get(this.getEditTileDescriptionField()).type('My Course')
        cy.get(this.getAddTileCategoryDDown()).select('Category - Course - 01')
        cy.get(this.getAddTileCategorySaveBtn()).click()

    }

    getEditInnerTileResources() {

        cy.get(this.getEditTileTileField()).type('My Course')
        cy.get(this.getEditTileDescriptionField()).type('My Course')
        cy.get(this.getAddTileCategorySaveBtn()).click()

    }

    getEditInnerTile() {

        cy.get(this.getEditTileTileField()).type('My Course')
        cy.get(this.getEditTileDescriptionField()).type('My Course')
        cy.get(this.getAddTileCategoryDDown()).select('GUIA - Global Category')
        cy.get(this.getAddTileCategorySaveBtn()).click()

    }

    getAddNewTileModal(label, div) {
        cy.get(this.getAddTileInnerMenu()).within(() => {
            cy.get(this.getAddTileModalMenu()).contains(label).click()
        })
        cy.get(this.getAddTileModalSaveBtn()).click()
        cy.get(this.getContainerByIndex(div)).within(() => {
            cy.get(this.getAddInnerTile()).should('contain', label)
        })
    }

    getTileDragAndDrop(Tile1Index, Tile2Index) {
        cy.get(this.getTileGrip()).eq(`${Tile1Index}`).trigger('mousedown', { force: true });
        cy.get(this.getTileGrip()).eq(`${Tile2Index}`,{timeout: 30000}).click({force: true });
    }

    //Function adds a new container, selects the type, and enters the label (pass div value of new container)
    //See 'LE - Collaborations - Dashboard Tile' Before function for example on how to get this value.
    getAddNewContainer(div, type, label) {
        cy.get(this.getAddNewContainerBtn()).click()
        cy.get(this.getContainerByIndex(div)).within(() => {
            cy.get(this.getContainerTypeDDown()).find('select').select(type)
            cy.get(this.getContainerLabelTxtF()).type(label)
        })
    }

    getAddNewContainerByType(div, type) {
        cy.get(this.getAddNewContainerBtn()).click()
        cy.get(this.getContainerByIndex(div)).within(() => {
            cy.get(this.getContainerTypeDDown()).find('select').select(type)
        })
    }

    getDeleteContainerByLabel(label) {
        cy.get(this.getContainerLabel()).contains(label).parents(this.getContainerHeader()).within(() => {
            cy.get(this.getContainerDeleteBtn()).click()
        })
    }

    //This function will delete the tile when you pass the container label name, and tile name
    getTileDeleteBtnByLabelandTileName(labelName, tileName) {
        cy.get(this.getContainerLabel()).contains(labelName).parents('[class*="dashboard-list__item"]').within(() => {
            cy.get(this.getTileLabel()).contains(tileName).parent().within(() => {
                cy.get('[class*="tile-container__delete"]').click({ force: true })
            })
        })
    }

    //This function adds a new tile to your container when you pass the container label name and tile type name
    getAddNewTile(labelName, tileType) {
        cy.get(this.getContainerLabel()).contains(labelName).parents('[class*="dashboard-list__item"]').within(() => {
            cy.get('[class*="btn tile-container-module__add_tile"]').click()
        })
        cy.get('[class*="tile-selector-module__tile_wrapper___"]').contains(tileType).click()
        cy.get('[class*="btn tile-selector-module__save_btn"]').click()
    }

    //This function will open the edit tile modal when you have already targeted the container the tile is in, and pass the tile name
    //useful for when the container does not have a label (ex. default Tile or Ribbon containers)
    getTileEditBtnByTileName(tileName) {
        cy.get(this.getTileLabel()).contains(tileName).parent().within(() => {
            cy.get(this.getTileEditBtn()).click({ force: true })
        })
    }

    //This function will open the edit tile modal when you pass the container label name, and tile name
    getTileEditBtnByLabelandTileName(labelName, tileName) {
        cy.get(this.getContainerLabel()).contains(labelName).parents('[class*="dashboard-list__item"]').within(() => {
            cy.get(this.getTileLabel()).contains(tileName).parent().within(() => {
                cy.get(this.getTileEditBtn()).click({ force: true })
            })
        })
    }

    //This function will open the edit tile modal when you pass the container label name, and tile index number
    //Use this if you have multiple tiles with the same name
    getTileEditBtnByLabelNameAndIndex(labelName, tabIndex) {
        cy.get(this.getContainerLabel()).contains(labelName).parents('[class*="dashboard-list__item"]').within(() => {
            cy.get(`div:nth-of-type(${tabIndex}) > [class*="tile-container-module__inner_tile"]`).parent().within(() => {
                cy.get(this.getTileEditBtn()).click({ force: true })
            })
        })
    }

    getTileEditBtnByLabelNameTileNameAndIndex(labelName, tileName, tabIndex) {
        cy.get(this.getContainerLabel()).contains(labelName).parents('[class*="dashboard-list__item"]').within(() => {
            cy.get(this.getTileLabel()).contains(tileName).eq(tabIndex).parent().within(() => {
                cy.get(this.getTileEditBtn()).click({ force: true })
            })
        })
    }

    getCancelBtn() {
        return 'button.btn.new-dashboard-welcome-tile-modal-module__button___VN73G.button-module__btn___svB4M.button-module__cancel___fHNOu.btn__cancel'
    }

    getUnsavedChangedModal() {
        return 'div.confirmation-modal-module__modal_container___owqWJ'
    }

    getUnsavedChangeModalLeaveBtn() {
        return 'button.btn.confirmation-modal-module__confirm_btn___sTw1M.button-module__btn___svB4M.button-module__warning___BPdmy.btn__warning'
    }

    getUnsavedChangeModalCancelBtn() {
        return 'button.btn.button-module__btn___svB4M.button-module__cancel___fHNOu.btn__cancel'
    }

    getTextTabBtn() {
        return 'button.icon-button-module__btn___BQtJy.new-dashboard-welcome-tile-sidebar-module__active_tab_button___Z0mIg'
    }

    getAddTranslationBtn(){
        return `[class*="add-custom-translations-menu-open-button"]`
    }
    
    getSelectTranslationLanguageItem(){
        return `[class*="overflow-menu-button-module__menu_button"]`
    }

    getContentArrowBtn() {
        return `[class*="icon-button-module__btn___BQtJy dashboard-container-module__toggle"]`
    }

    getEditTileModal() {
        return `[class*="modal-module__modal___"]`
    }

    getContentListItem() {
        return `[class*="dashboard-list__item"]`
    }

    getDeleteTileBtn() {
        return `[class*="tile-container__delete"]`
    }

    getAddAndEditTileByLabelName(name,labelName,tileType) {    
        this.getAddNewTile(labelName, tileType)
        this.getMediumWait()
        cy.get(this.getContainerLabel()).contains(labelName).parents(this.getContentListItem()).within(()=>{
            cy.get(this.getTileLabel()).last().parent().within(() => {
               cy.get(this.getTileEditBtn()).click({ force: true })
               this.getShortWait()
            })   
            cy.get(this.getEditTileTileField()).type(name)
        }) 
        this.getSelectTemplateByName(name)
        cy.get(this.getEditTileModal()).within(()=>{
            this.getSelectTemplateByName(name)
            cy.get(this.getWelcomeTileSavebutton()).eq(0).click()
        })
    }

    getDeleteLastTileByLabelName(labelName) {
        cy.get(this.getContainerLabel()).contains(labelName).parents(this.getContentListItem()).click()
        cy.get(this.getContainerLabel()).contains(labelName).parents(this.getContentListItem()).within(()=>{
            cy.get(this.getTileLabel()).last().parent().within(() => {
                cy.get(this.getDeleteTileBtn()).click({ force: true })
            })
        }) 
    }

    getHorizontalMenuItems() {
        return `[class*="horizontal-tab-list-module__tab_btn"] [aria-hidden="true"]`
    }

    getSelectHorizontalMenuItemsByName(name) {
        cy.get(this.getHorizontalMenuItems()).contains(name).click()
    }

    getRibbonLabelDDown() {
        return `[name="ribbon-dropdown"]`
    }

    getSelectRibbonLabelByName(name) {
        cy.get(this.getRibbonLabelDDown()).select(name)
    }

    getAddTileButton(){
        return '[class*="btn tile-container-module__add_tile___"]'
    }

    getAddTileName(){
        return '[class*="tile-selector-module__label"]'
    }

    getSaveBtn(){
        return '[class*="btn tile-selector-module__save_btn"]'
    }

    getTileDeleteBtnByTileNam(tileName) {
        cy.get(this.getTileLabel()).contains(tileName).parent().within(() => {
            cy.get('[class*="tile-container__delete"]').eq(0).click({ force: true })
        })
    }
}
