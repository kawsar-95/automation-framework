import ARBasePage from "../../../ARBasePage";

export default new class ARCourseSettingsCatalogVisibilityModule extends ARBasePage {
   
    getCatalogVisibiltySectionErrorMsg() {
        return '[data-name="edit-online-course-catalog-visibility-section"] [class*="_errors"]'
    }
    
    //----- For Category Section -----//

    getCatagoryPickerF() {
        return '[data-name="categoryId"] [class*="_text"]'
    }
    
    getChooseCategoryBtn() {
        return '[data-name="categoryId"] [class*="icon-folder-small"]'
    }
    
    getChooseCategoryBtnTxt() {
        return '[data-name="categoryId"] [class*="_content"]'
    }
    
    getClearCatagoryBtn() {
        return '[data-name="categoryId"] [class*="icon icon-x"]'
    }

    getSouceRadioBtn(){
        return `[data-name="file"] [class="_label_6rnpz_32"]`
    }
    

    //----- For Thumbnail Section -----//

    getSelectFileBtnOption() {
       return '[data-name="radio-button"] [data-name="radio-button-File"]'
     }

     getChooseFileBtn(){
        return '[data-name="control_wrapper"] [aria-label="File"]'
    }

    getThumbnailRadioBtn() {
        return ' [aria-label="Thumbnail"] [class="_label_6rnpz_32"]'
        //return this.getElementByDataNameAttribute("thumbnailImage") + ' ' + '[class*="radio-button-module__label"]'
    }

    getThumbnailDeleteBtn() {
        return `[aria-label="Thumbnail"] [data-name="delete"]`
    }

    getThumbnailPlaceholderIcon() {
        return '[aria-label="Thumbnail"] [data-name="placeholder_icon"]'
    }

    getThumbnailUrlTxtF() {
        return '[name="thumbnailImage"]'
    }

    getUrlTypeinput() {
        //return '[aria-label="url"]'
        return '[aria-labelledby="radio-button-18_label"]'
    }
    

    getChooseThumbnailBtn() {
        return this.getElementByDataNameAttribute("thumbnailImage") + ' ' + this.getFolderBtn()
    }

    getThumbnailPreview() {
        return '[class*="_image_preview"]'
    }

    getThumbnailFileByName(name) {
        return `${name}`
    }

    getThumbnailSize() {
        return '[class*="_image_preview"] [class*="_label"]'
    }

    getThumbnailImageContainer(){
        return `[data-name="thumbnailImage"]`
    }


    //----- For Poster Section -----//

    getNoPostersDescription() {
        cy.get('[data-name="no-poster"]').should('contain', 'There are no poster images for this course.')
    }

    getAddPosterBtn() {
        return '[data-name="add-poster"] [class*="icon icon-plus"]'
    }

    getAddImageBtn() {
       return '[data-name="radio-group"] [data-name="radio-button"]'
    }


    getAddUrlBtn() {
        return '[data-name="radio-button"]'
    }
    
    getAddPosterBtnContainer() {
        return '[data-name="add-poster"]'
    }

    getPosterGroup() {
        return "posters"
    }

    //Use getElementByDataNameAttributeAndIndex(getPosterGroup(), index) function along with the following poster group functions
    getPosterChooseFileBtn() {
        return `[class*="icon-folder-small"]`
    }

    getPosterRadioBtn() {
        return '[data-name="radio-button"]'
    }

    getPosterFilePathTxtF() {
        return `[class*="_text_input"]`
    }

    getPosterUrlErrorMsg() {
        return `[class*="_error"]`
    }

    getPosterFileByName(name) {
        return `${name}`
    }

    getPostUrlExists(){
        return '[aria-label="Url"]'
    }

    getPosterPreview() {
        return '[class*="_image_preview"]'
    }

    getPosterDeleteBtn() {
        return `[data-name="posters"] [data-name="delete"]`
    }

    //Pass the filename of the poster you want to delete 
    getPosterDeleteBtnThenClick(name) {
        cy.get(this.getElementByDataNameAttribute("posters")).within(() => {
            cy.get(this.getElementByAriaLabelAttribute(name)).parent().within(() => {
                cy.get('[class*="icon icon-trash"]').click({force:true})
            })
        })
    }

    //useful for deleting multiple posters (first poster index = 2)
    getPosterDeleteBtnByIndexThenClick(index=2) {
        cy.get('[data-name="posters"] [class*="_image_container"]').eq(index-2).within(() => {
            cy.get('[class*="icon icon-trash"]').click({ force: true })
          })
    }
    

    //----- For Catalog Visibility Toggles Section -----//

    getMandatoryCourseToggleContainer() {
        return "isMandatory";
    }

    getFeaturedCourseToggleContainer() {
        return "isFeatured";
    }

    getFeaturedCourseSortOrderTxtF() {
        return `[name="featuredSortOrder"]`
    }

    getFeaturedCourseSortOrderErrorMsg() {
        return `[data-name="featuredSortOrder"] [data-name="error"]`
    }

    getEnableForMobileAppToggleContainer() {
        return "isCourseEnabledForMobileApp";
    }

    getRecommendedCoursesToggleContainer() {
        return "enableRecommendedCourses";
    }

    getRecommendationTagsDDown() {
        return '[data-name="course-recommendation-tags"] [data-name="selection"]'
    }

    getRecommendationTagsSearchTxt() {
        return '[name=tagIds]'
    }

    getRecommendationTagOpt(opt) {
        cy.get('[data-name="options"] [role="option"]').contains(opt, {timeout: 3000}).click({force: true})
    }

    getRecommendationTagClearBtn() {
        return '[data-name="tagIds"] [class*="_deselect_all_btn"]'
    }

 //   getThumbnailUrlFilePAthTxtF(){
  //      return `[data-name="control_wrapper"] [aria-label="Url"]`;
 //   }
    //----- For Course Administrators Section -----//

    getCourseVisibilityRadioBtn() {
        return this.getElementByDataNameAttribute("adminVisibilityType") + ' ' + '[class*="radio-button-module__label"]'
    }

    getDepartmentDDown() {
        return this.getElementByDataNameAttribute("predicates") + ' '+ '[class*="department-select-module__input"]'
    }

    getUploadFileBtn() {
        return '[title="Upload File"]'
    }
}