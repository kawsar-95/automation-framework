import LEBasePage from '../../LEBasePage'
import LESideMenu from '../Menu/LESideMenu'
import LEDashboardPage from '../Dashboard/LEDashboardPage'
import LECoursesPage from '../Courses/LECoursesPage'
import LEManageTemplateMenu from './LEManageTemplateMenu'

export default new class LEManageTemplateCoursesPage extends LEBasePage {

    getManageTemplateCoursesContainerByNameThenClick(name) {
        return cy.get('[class*="courses-settings-module__wrapper"] div').contains(name).click({force:true})
    }
    //Catalog Section
    getHideCategoriesToggleModule() {
        return `[class="redux-form-toggle-module__toggle___kcbdB catalog-settings__hide_categories_toggle"]`
    }

    getHideEnrolledCoursesToggleModule() {
        return `[class="redux-form-toggle-module__toggle___kcbdB catalog-settings__hide_enrolled_courses_toggle"]`
    }

    getExpandRefineSearchByDefaultToggleModule() {
        return `[class="redux-form-toggle-module__toggle___kcbdB my-courses-and-catalog-settings__expand_filter_panel_toggle"]`
    }

    getEnablePreEnrollmentToggleModule(){
        return`[class="redux-form-toggle-module__toggle___kcbdB course-details-settings__layout_enabled_toggle"]`
    }

    getEnablePreEnrollmentToggleBtn(){
        return `[name="layoutEnabled"]`
    }

    getAlwaysHideCategoriesToggleBtn(){
        return `[name="hideCategories"]`
    }

    getAlwaysHideEnrolledCoursesToggleBtn(){
        return `[name="hideEnrolledCourses"]`
    }

    getExpandRefineSearchByDefaultToggleBtn(){
        return `[name="expandFilterPanel"]`
    }

    getToggleBtnSlider(){
        return `[class*="redux-form-toggle-module__slider"]`
    }

    //Course Details Section
    getBannerImageUploadModuleLabel() {
        return `[class*="course-details-settings-module__label"]`
    }

    getBannerImageUploadContainer() {
        return `[class*="course-details-settings-module__section"]`
    }

     // To ILC Location URL unchecked
     getIlcLocationUrlCheckbox(){
        return '[name="showIlcLocationUrl"]'
     }

     getIlcLocationUrlLabel(){
        return 'label[class*="course-details-settings__show_ilc_location_url_checkbox"]'
     }

     getCheckUncheckedIlcLocationUrl(value){
        this.getShortWait()
        cy.get(this.getIlcLocationUrlCheckbox()).invoke('attr','value').then((status) =>{
            if(status === value){
                cy.get(this.getIlcLocationUrlCheckbox()).should('have.attr', 'value', value)
            }
            else{
                cy.get(this.getIlcLocationUrlLabel()).click()
                this.getShortWait()
                cy.get(this.getIlcLocationUrlCheckbox()).should('have.attr', 'value', value)
                cy.get(this.getContainerSaveBtn()).click()
                cy.get(this.getSuccessMessage()).should('have.text', 'Changes Saved.')
                this.getShortWait()
            }
        })
    }

    getEnablePreEnrollment() {
        return '[name="layoutEnabled"]'
    }

    getEnableDisablePreEnrollment(value){
        cy.wait(2000)
        cy.get(this.getEnablePreEnrollment()).invoke('attr','value').then((status) =>{
            if(status === value){
                cy.get(this.getEnablePreEnrollment()).should('have.attr', 'value', value)
            }
            else{
                cy.get(this.getEnablePreEnrollment()).siblings('div').click()
                cy.wait(1000)
                cy.get(this.getEnablePreEnrollment()).should('have.attr', 'value', value)
                cy.get(this.getContainerSaveBtn()).click()
                cy.get(this.getSuccessMessage()).should('have.text', 'Changes Saved.')
                this.getShortWait()
            }
        })
    }

    //My Courses & Catalog Section
    getExpandRefineSearchToggleModule() {
        return `[class*="expand_filter_panel_toggle"]`
    }

    getCoursesAndCatalogBannerImageUploadModuleLabel() {
        return `[class*="my-courses-and-catalog-settings-module__label"]`
    }

    getCoursesAndCatalogBannerImageUploadContainer() {
        return `[class*="my-courses-and-catalog-settings-module__section"]`
    }
    getCatalogDefaultViewModule() {
        return `[class*="default_view_radio_buttons"]`
        //[class*="catalog-settings__default_view_radio_buttons"]
    }

    getSettingsSortModule() {
        return `[class*="-settings__sort_options"]`
        //-settings__sort_options
    }

    getLayoutBtn(){
        return '[class*="redux-form-toggle-module__slider"]';
    }

    getViewSidebarButtn(){
        return `[class*="icon icon-layout-sidebar"]`
    }

    getDefaultViewBtn(name){
        cy.get('[class*="redux-form-radio-module__option___fUA_a"]').contains(name).click();
    }

    getCourseDetailsSaveButtn(){
        return 'button[type="submit"]'
    }

    getManageTemplateSuccessMessage(){
        return '[data-name="form-info-panel"]'
    }
    // To turn on the toggle button pass argument as 'true', to turn of the toggle btn pass the argument as 'false'
    getTurnOnOffAlwaysHideCategoriesToggleBtn(value){
        this.getShortWait()
        cy.get(this.getAlwaysHideCategoriesToggleBtn()).invoke('attr','value').then((status) =>{
            if(status === value){
                cy.get(this.getAlwaysHideCategoriesToggleBtn()).should('have.attr', 'value', value)
            }
            else{
                cy.get(this.getHideCategoriesToggleModule()).within(()=>{
                    cy.get(this.getToggleBtnSlider()).click()
                }) 
                this.getVShortWait()
                cy.get(this.getAlwaysHideCategoriesToggleBtn()).should('have.attr', 'value', value)
            }
        })
    }

    // To turn on the toggle button pass argument as 'true', to turn of the toggle btn pass the argument as 'false'
    getTurnOnOffAlwaysHideEnrolledCoursesToggleBtn(value){
        this.getShortWait()
        cy.get(this.getAlwaysHideEnrolledCoursesToggleBtn()).invoke('attr','value').then((status) =>{
            if(status === value){
                cy.get(this.getAlwaysHideEnrolledCoursesToggleBtn()).should('have.attr', 'value', value)
            }
            else{
                cy.get(this.getHideEnrolledCoursesToggleModule()).within(()=>{
                    cy.get(this.getToggleBtnSlider()).click()
                })
                this.getVShortWait()
                cy.get(this.getAlwaysHideEnrolledCoursesToggleBtn()).should('have.attr', 'value', value)
            }
        })
    }

    // To turn on the toggle button pass argument as 'true', to turn of the toggle btn pass the argument as 'false'
    getTurnOnOffExpandRefineSearchByDefaultToggleBtn(value){
        this.getShortWait()
        cy.get(this.getExpandRefineSearchByDefaultToggleBtn()).invoke('attr','value').then((status) =>{
            if(status === value){
                cy.get(this.getExpandRefineSearchByDefaultToggleBtn()).should('have.attr', 'value', value)
            }
            else{
                cy.get(this.getExpandRefineSearchByDefaultToggleModule()).within(()=>{
                    cy.get(this.getToggleBtnSlider()).click()
                })
                this.getVShortWait()
                cy.get(this.getExpandRefineSearchByDefaultToggleBtn()).should('have.attr', 'value', value)
            }
        })
    }

    //this method first checks the changes, if there is some changes it saves.
    getCatalogCheckSave(){
        cy.get(this.getContainerSaveBtn()).then(($btn) => {
            if ($btn.attr('disabled')){
                cy.get(this.getContainerSaveBtn()).should('have.attr','disabled')
                this.getShortWait()
            }
            else{
                cy.get(this.getContainerSaveBtn()).click()
                cy.get(this.getSuccessMessage()).should('have.text', 'Changes Saved.')
                this.getShortWait()
            }
        })

    }

    // To turn on the toggle button pass argument as 'true', to turn of the toggle btn pass the argument as 'false'
    getTurnOnOffEnablePreEnrollmentToggleBtn(value){
        this.getShortWait()
        cy.get(this.getEnablePreEnrollmentToggleBtn()).invoke('attr','value').then((status) =>{
            if(status === value){
                cy.get(this.getEnablePreEnrollmentToggleBtn()).should('have.attr', 'value', value)
            }
            else{
                cy.get(this.getEnablePreEnrollmentToggleModule()).within(()=>{
                    cy.get(this.getToggleBtnSlider()).click()
                }) 
                this.getVShortWait()
                cy.get(this.getEnablePreEnrollmentToggleBtn()).should('have.attr', 'value', value)
                cy.get(this.getCourseDetailsSaveButtn()).click()
                cy.get(this.getManageTemplateSuccessMessage()).should('be.visible').and('contain','Changes Saved.')
            }
        })
    }
    
    //Pass the status as 'true' or 'false'.
    turnOnOffEnablePreEnrollmentToggleBtn(status) {
        cy.get(LEDashboardPage.getNavMenu()).should('be.visible')
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('Manage Template')
        LEManageTemplateMenu.getManageTemplateMenuItemsByName('Courses').should('be.visible').click()
        this.getManageTemplateCoursesContainerByNameThenClick('Course Details')
        this.getTurnOnOffEnablePreEnrollmentToggleBtn(status)
    }

}