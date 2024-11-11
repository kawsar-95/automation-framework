import LEBasePage from '../../LEBasePage'
import LEDashboardPage from '../Dashboard/LEDashboardPage'
import LESideMenu from '../Menu/LESideMenu'
import LEManageTemplateMenu from './LEManageTemplateMenu'

export default new class LEManageTemplateSettingsPage extends LEBasePage {
    
    getManageTemplateSettingsContainerByNameThenClick(name) {
        return cy.get('[class*="general-settings-module__wrapper"] div').contains(name).click()
    }

    //Logo
    getUploadHeaderLogoImageModuleLabel() {
        //Pass in instructions for Image upload in italic
       return `[class*="instructions-text__wrapper"]`
    }

    getUploadHeaderLogoImageContainer() {
       return `[class*="header-settings-module__inner_wrapper"]`
    }

    getOverrideLogoURLToggle(value) {
        cy.get('[class*="redux-form-toggle-module__toggle"]').within(() => {
            cy.get('[class*="toggle__slider"]').click()
            cy.get('[class*="redux-form-toggle__checkbox"]').should('have.value', value)
        })
    }

    getHeadShortcutIcon(){
        return `link[rel="shortcut icon"]`
    }
    
    getHeadAppleTouchIcon(){
        return `link[rel="apple-touch-icon"]`
    }

    //Private/Public Menu

    getMenuItemDropDByIndex(containerIndex, dropdownIndex) {
        return `[class*="menu-item-module__container"]:nth-child(${containerIndex}) [class*="menu-item-module__editcontainer"] > div:nth-child(${dropdownIndex}) [class*="menu-item-module__dropdown"] [name="dropdown"]`
    } 

    getMenuEditBtnByIndex(index) {
        return `.drag-and-drop__wrapper > div:nth-of-type(${index}) button[title='Edit'] > .icon.icon-pencil`
    }

    getMenuItemDeleteBtnByIndex(index) {
        return `div:nth-of-type(${index})  button[title='Delete']`
    }

    getAddMenuBtn() {
        return `[class*="btn menu-list-module__add_menu_item_btn"]`
    }


    getRequirePin() {
        return "requirePinCreation" //name attr
    }

    getRequirePinToggle() {
        return '[class*="redux-form-toggle-module__slider"]'
    }

    getShowInactiveCoursesBtn(){
        return '[class*="profile-settings__inactive-courses"]';
    }
    getContentModuleBtn() {
        return `[class*="expandable-content-module__toggle_btn"] > div`
    }

    getContentMenuItemByName(name) {
        cy.get(this.getContentModuleBtn()).contains(name).parent().click()
    }
    
    getAddMenuItemBtn() {
        return `[class*="btn menu-list-module__add_menu_item_btn"]`
    }

    getContainerByIndex(index) {
        return `[class*="expandable-content-module__containe"]:nth-of-type(${index})`
    }

    getPrivateMenuItems() {
        return `[class*="menu-item-module__content"]`
    }

    getMenuItemDDownBtn() {
        return `[name="dropdown"]`
    }

    getMenuItemDDownOptions() {
        return `[name="dropdown"] > option`
    }

    getSelectMenuItemByName(name) {
    cy.get(this.getMenuItemDDownBtn()).select(name)
    }

    getEditPrivateMenuItemBtn() {
        return `[class*="icon-button-module__btn___BQtJy menu-item-module__edit"]`
    }

        getEditTileTemplateDDownBtn() {
        return `[name="templateId"]`
    }

    getSelectTemplateByName(name) {
        cy.get(this.getEditTileTemplateDDownBtn()).select(name)
        this.getShortWait()
    }

    getEditTemplateTitleTextF() {
        return `[name="name"]`
    }

    getEditPrivateMenuItemContainer() {
        return `[class*="modal-module__modal_inner_container"]`
    }

    getWelcomeTileSavebutton() {
        return '[type="submit"]'
    }

    getDeleteBtn() {
        return `button[title='Delete']`
    }

    getAddPrivateMenuItem(name) {
        cy.get(this.getContainerByIndex(3)).within(()=>{
        cy.get(this.getAddMenuItemBtn()).click()           
        cy.get(this.getPrivateMenuItems()).last().within(()=>{
            this.getSelectMenuItemByName('External Training')
        })
        this.getVShortWait()
        cy.get(this.getEditPrivateMenuItemBtn()).last().click()
        this.getVShortWait()
        this.getSelectTemplateByName(name)
        cy.get(this.getEditTemplateTitleTextF()).type(name)
        cy.get(this.getEditPrivateMenuItemContainer()).within(()=>{
            this.getShortWait()
            cy.get(this.getWelcomeTileSavebutton()).eq(0).click()
        })
        this.getShortWait()
        cy.get(this.getWelcomeTileSavebutton()).eq(0).click()
        this.getShortWait() 
        })
    }

    getCourseSettingsSection() {
        return 'div[data-name="expandable-content-toggle-button"] > div[class*="expandable-content-module__toggle_title"]'
    }

    getShowingInactiveCoursesInTranscriptToggle() {
        return 'input[name="showInactiveCourses"]'
    }

    getEnableShowInactiveCoursesInTranscriptToggleContainer() {
        return 'div[class="profile-settings__inactive-courses"] div[class="redux-form-toggle-module__toggle___kcbdB"]'
    }

    getToggleBtnSlider() {
        return '[class*="redux-form-toggle-module__slider"]'
    }

    getTurnOnOffEnableShowingInactiveCoursesInTranscript(value){
        cy.get(this.getShowingInactiveCoursesInTranscriptToggle()).invoke('attr','value').then((status) =>{
            if(status === value){
                cy.get(this.getShowingInactiveCoursesInTranscriptToggle()).should('have.attr', 'value', value)
            }
            else{
                cy.get(this.getEnableShowInactiveCoursesInTranscriptToggleContainer()).within(()=>{
                    cy.get(this.getToggleBtnSlider()).click()
                }) 
                cy.get(this.getShowingInactiveCoursesInTranscriptToggle()).should('have.attr', 'value', value)
                cy.get(this.getSubmitBtn()).click({force: true})
            }
        })
    }

    turnOnOffEnableShowingInactiveCoursesInTranscriptBtn(status) {
        cy.get(LEDashboardPage.getNavMenu()).should('be.visible')
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('Manage Template')
        LEManageTemplateMenu.getManageTemplateMenuItemsByName('Settings').should('be.visible').click()
        cy.get(this.getCourseSettingsSection()).contains('Profile').click()
        this.getTurnOnOffEnableShowingInactiveCoursesInTranscript(status)
    }

}