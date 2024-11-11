import LEBasePage from '../../LEBasePage';
import LECatalogPage from '../Catalog/LECatalogPage';

export default new class LEFilterMenu extends LEBasePage {

    getFilterBtn() {
        return `[class*="filter-toggle-module__filter_toggle_btn"]`;
    }

    getFilterBtnContainer() {
        return `[class*="filter-toggle__filter_toggle "]`;
    }
    
    getHideFilterBtnClassName() {
        return 'filter-toggle__filter_toggle_hidden';
    }

    getHideRefineSearchTxt() {
        return `[class*="filter-toggle-module"]`;
    }

    getShowCategoriesTxt() {
        return '[title="Show Categories"]';
    }

    //Only in Courses filter menu
    getShowCompletedTxt() {
        return '[title="Show Completed"]';
    }

    getOCChkBox() {
        return `[class*="course-type-filter__online_course_checkbox"]`;
    }

    getILCChkBox() {
        return `[class*="course-type-filter__instructor_led_course_checkbox"]`;
    }

    getCURRChkBox() {
        return `[class*="course-type-filter__curriculum_checkbox"]`;
    }

    //Only in Catagories filter menu
    getCBChkBox() {
        return `[class*="course-type-filter__course_bundle_checkbox"]`;
    }

    getSearchFilterTxtF() {
        return `[class*="text-filter__text_input"]`;
    }

    getSearchFilterBtn() {
        return `[class*="icon-arrow-right-go"]`;
    }

    getSearchClearBtnThenClick() {
        cy.get(`[class*="icon-x-thick"]`, {timeout: 15000}).click()
    }

    getSearchCourseTxtF(){
        return `[placeholder="Search Course Name"]`
    }

    getSearchResourceTxtF(){
     return `[placeholder="Search Name"]`       
    }

    getShowFiltersBtn() {
        return '[title="Show filters"]'
    }

    getHideFiltersBtn() {
        return '[title="Hide filters"]'
    }

    getSearchCourseFilterContainer() {
        return `[class*="filter-panel-module__filters_container"]`
    }

    SearchForCourseByName(name) {
        cy.get(this.getFilterBtn()).invoke('attr','title').then((status) => {
           if(status === 'Hide filters'){
              cy.get(this.getShowCategoriesTxt()).should('be.visible')
              cy.get(this.getSearchCourseTxtF()).type(name)
              cy.get(this.getRightArrowIcon()).should('be.visible')
              cy.get(this.getRightArrowIcon()).click()
            }else{
              cy.get(this.getFilterBtn()).should('be.visible').click()
              cy.get(this.getShowCategoriesTxt()).click()
              cy.get(this.getSearchCourseTxtF()).type(name)
              cy.get(this.getRightArrowIcon()).should('be.visible')
              cy.get(this.getRightArrowIcon()).click()
            }    
        })
    }

    SearchForResourceByName(name) {
        cy.get(this.getFilterBtn()).invoke('attr','title').then((status) => {
           if(status === 'Hide filters'){
              cy.get(this.getShowCategoriesTxt()).should('be.visible')
              cy.get(this.getShowCategoriesTxt()).click()
              cy.get(this.getSearchResourceTxtF()).type(name)
              cy.get(this.getRightArrowIcon()).should('be.visible')
              cy.get(this.getRightArrowIcon()).click()
            }
            else{
            cy.get(this.getFilterBtn()).should('be.visible').click()
               cy.get(this.getShowCategoriesTxt()).click()
               cy.get(this.getSearchResourceTxtF()).type(name)
               cy.get(this.getRightArrowIcon()).should('be.visible')
               cy.get(this.getRightArrowIcon()).click()
            }
        })
    }        

    SearchForCourseByNameWithShowCategoriesToggleBtnOff(name) {
        cy.get(this.getFilterBtn()).invoke('attr','title').then((status) => {
           if(status === 'Hide filters'){    
             cy.get(this.getSearchCourseTxtF()).should('be.visible')  
             cy.get(this.getSearchCourseTxtF()).type(name)
             cy.get(this.getRightArrowIcon()).should('be.visible')
             cy.get(this.getRightArrowIcon()).click()
            }
            else{
              cy.get(this.getFilterBtn()).should('be.visible').click()
              cy.get(this.getSearchCourseTxtF()).type(name)
              cy.get(this.getRightArrowIcon()).should('be.visible')
              cy.get(this.getRightArrowIcon()).click()
            }
        })
    }

    getAdvancedFilterDDown() {
        return `[name="filter_picker"]`;
    }

    //Only available if 'Venue Type' has been selected from the advanced filter dropdown
    getVenueTypeChkBox() {
        return '[class*="checkbox-module__label"]'
    }

    //Only available if 'Tags' has been selected from the advanced filter dropdown
    getTagsDDown() {
        return `[class*="select-module__field"]`;
    }

    //Only available once getTagsDDown has been clicked
    getSelectTagFromDDown() {
        return `[class*="select-list-module__item"]`;
    }

    //Waits should be replaced by an intercept in the future when it works for GET requests
    getSearchAndEnrollInCourseByName(name) {
        cy.get(this.getFilterBtn()).click()
        this.SearchForCourseByName(name)
        this.getMediumWait()
        this.getCourseCardBtnThenClick(name)
        this.getMediumWait()
    }

    getSearchAndEnrollInCourseByNameWithShowCategoriesToggleBtnOff(name) {
        cy.get(this.getFilterBtn()).click()
        this.SearchForCourseByNameWithShowCategoriesToggleBtnOff(name)
        this.getMediumWait()
        this.getCourseCardBtnThenClick(name)
        this.getMediumWait()
    }

    
    //For Resources Filter Menu

    getResourceSearchTxtF() {
        return '[class*="text-filter-module__input_container"]'
    }

    getSearchForResourceByName(name) {
        cy.get(this.getResourceSearchTxtF()).type(name)
        cy.get(this.getRightArrowIcon()).click()
        this.getLShortWait()
    }

    showfilters() {
        cy.get(this.getFilterBtn()).invoke('attr','title').then((status) => {
           if(status === 'Hide filters'){    
              cy.get(this.getHideFiltersBtn()).should('be.visible')
            }
            else{
              cy.get(this.getFilterBtn()).should('be.visible').click()
              cy.get(this.getShowFiltersBtn()).should('be.visible')
            }
        })
    }

    getShowCategoriesCheckbox() {
        return '[aria-label="Show Categories"]'
    }
    
    //Pass true or false to toggle on or off the toggle button
    setShowCategories(status) {
        cy.get(this.getShowCategoriesCheckbox()).invoke('val').then((value) => {
            if (value!==status) {
                cy.get(LECatalogPage.getShowCategoriesToggle()).click()
                cy.get(this.getShowCategoriesCheckbox()).should('have.value', status)
            }
            else{
                cy.get(this.getShowCategoriesCheckbox()).should('have.value', status)
            }
        })
    }

    getClickOnFilterBtn() {
          cy.get(this.getFilterBtn()).invoke('attr','title').then((status) => {
            if(status === 'Hide filters'){
            cy.get(this.getFilterBtn()).should('be.visible')
            }else{
            cy.get(this.getFilterBtn()).click()
            cy.get(this.getFilterBtn()).should('be.visible')    
            }})
    }    
}

