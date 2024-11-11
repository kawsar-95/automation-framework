import ARBasePage from "../../ARBasePage";
import ARCollaborationAddEditPage from "../Collaborations/ARCollaborationAddEditPage";
import AREquivalentCoursesModule from "../Courses/modules/AREquivalentCourses.module";
import ARDashboardPage from "../Dashboard/ARDashboardPage";
import ARGlobalResourcePage from "../GlobalResources/ARGlobalResourcePage";






export default new class ARAbsorbContentReportPage extends ARBasePage {

/*
** This method/function is used to get any of the Absorb content report page function by name.
*/

getAbsorbContentPageTitle(){
    return'[data-name="title"]'
}

getAbsorbContentBreadCrumb(){
    return '[aria-label="Breadcrumb"]'
}

getAbsorbContentSelectCoursesBtn(){
    return '[title="Select Courses"]'
}

getAbsorbContentCourseCard(){
    return '[data-name="report-card-item"]'
}

getAbsrobContentGridFooter(){
    return '[class*="_grid_footer_"]'
}

getAbsorbContentContractPicker(){
    return '[class*="_option_"] [class*="_select_option_ledtw_"]'
}

getAbsorbContentItemsPPSelector(){
    return '[title="Items Per Page"]'
}

getAbsorbContentLastPage(){
    return '[data-name="last"]'
}

getAbsorbContentFirstPage(){
    return '[data-name="first"]'
}

getAbsorbContentPageNum(){
    return '[data-name="page-number"]'
}

AddAbsorbContentFilterContentType(propertyName) {
    cy.get(this.getAddFilterResourcesBtn()).click();
    cy.get(ARGlobalResourcePage.getRuleDropDownBtn()).eq(0).click({timeout:2000});
    cy.get(this.getAbsorbContentSearchTxtF()).type(propertyName)
    cy.get(this.getPropertyNameDDownOpt()).contains(new RegExp( propertyName)).click()
    cy.get(this.getSubmitAddFilterBtn()).should('be.visible',{timeout:5000}).click()
 }

 getAbsorbContentSearchTxtF(){
    return '[class="_search_7teu8_76"] [aria-label="Property"]'
 }

UpdateAbsorbContentFilter(){
    cy.get(AREquivalentCoursesModule.getEqEditRefinementFilter()).eq(1).click();
    cy.get(ARGlobalResourcePage.getRuleDropDownBtn()).eq(1).click();
    cy.get(this.getAbsorbContentFilterPropertyCourse()).click()
    cy.get(this.getSubmitAddFilterBtn()).contains('Update Filter', {timeout:2000}).click()
}

getAbsorbContentFilterPropertyCourse(){
    return '[data-name="options"] li[id*="-options-Course"]'
}

AddAbsorbContentFilterTags(propertyName) {
    cy.get(this.getAddFilterBtn()).click();
    cy.get(ARGlobalResourcePage.getRuleDropDownBtn()).eq(0).click({timeout:2000});
    cy.get(this.getAbsorbContentSearchTxtF()).type(propertyName)
    cy.get(this.getPropertyNameDDownOpt()).contains(new RegExp( propertyName)).click()
    cy.get(this.getAbsorbContentFltOperator()).click();
    cy.get(this.getAbsorbContentDDTags()).eq(0).click();
    cy.get(this.getAbsorbContentDDTags()).eq(1).click();
    cy.get(this.getAbsorbContentFltOperator()).click();
    cy.get(this.getSubmitAddFilterBtn()).should('be.visible',{timeout:5000}).click()
 }

 getAbsorbContentFltOperator(){
    return '[data-name="select-field"]'
 }

 getAbsorbContentDDTags(){
    return '[data-name="select-option"]'
 }

 UpdateAbsorbContentFilterCC(){
    cy.get(AREquivalentCoursesModule.getEqEditRefinementFilter()).eq(2).click();
    cy.get(ARGlobalResourcePage.getRuleDropDownBtn()).eq(1).click();
    cy.get(this.getAbsorbContentFilterCCFalse()).click()
    cy.get(this.getSubmitAddFilterBtn()).contains('Update Filter', {timeout:2000}).click()
}

getAbsorbContentFilterCCFalse(){
    return'[data-name="options"] li[id*="-options-false"]'
}

getAbsorbContentCardImg(){
    return '[data-name="card"] [class="ac_card__body"]'
}

getAbsorbContentCardTitle(){
    return '[class*="ac_card__title _title_"]'
}

getAbsorbContentCardConType(){
return '[data-name="course-content-type"]'
}

getAbsorbContentCardSubTxt(){
return '[class*="ac_card__subtext _sub_text_"]'
}

getAbsorbContentCardConvertBtn(){
    return 'button[title="Convert"][data-name="button"]'
}

getAbsorbContentCardPreviewBtn(){
    return 'button[title="Preview"][data-name="button"]'
}

getAbsorbContentDiscModal(){
    return '[data-name="course-discovery-banner"]'
}

getAbsorbContentDiscThumbnail(){
    return 'div[data-name="absorb-content-course-thumbnail"]'
}

getAbsorbContentDiscDetails(){
    return '[data-name="course-details"]'
}

getAbsorbContentDiscConvertBtn(){
    return 'button[type="button"][class*=" _success_"]'
}

getAbsorbContentDiscPreviewBtn(){
    return 'button[type="button"][class*="_button_"]'
}

getAbsorbContentDiscDesc(){
    return '[data-name="course-description"]'
}

getAbsorbContentDiscTags(){
    return '[data-name="course-tags"]'
}

getAbsorbContentPreviewPopUp(){
return '[data-name="popups-notice"]'
}

getAbsorbContentPreiewMsg(){
    return 'div[class*="_message_bbc"]'
}

getAbsorbContentPreviewTxt(){
    return 'div[class*="_label_foqbx_"]'
}

getAbsorbContentPreviewClsBtn(){
    return 'button [class*="icon icon-x _close_btn_"]'
}

getAbsorbContentNumbOfItems(){
    return '[class*="_items_selected_label_"]'
}

getAbsorbContentConvertBtn(){
    return '[class*="_select_actions_"] button[data-name="save"]'
}

getAbsorbContentConvertModal(){
    return '[data-name="absorb-content-course-convert-form"]'
}

getAbsorbContentConvertModalTitle(){
    return '[data-name="dialog-title"]'
}

getAbsorbContentCourseList(){
    return '[data-name*="list-item-"]'
}

getAbsorbContentModalMsgNotF(){
return '[class*="_notification_bbc"]'
}

getAbsorbContentConvSlfEnrl(){
    return '[data-name="selfEnrollmentType"]'
}

getAbsorbContentConvAutoEnrl(){
    return '[data-name="automaticEnrollmentType"]'
}

getAllowConvSelfEnrollmentRadioBtn(titleText) {
    cy.get('[aria-label="Allow Self Enrollment"] > [data-name="radio-button"]').contains(titleText).click()
}

getAbsorbContentConvAutoEnrl(titleText){
    cy.get('[aria-label="Enable Automatic Enrollment"] > [data-name="radio-button"]').contains(titleText).click()
}

getAbsorbContentSelfEnrlAll(){
    return '[data-name="radio-button-All"]'
}

getAbsorbContentDept(){
    return '[data-name="select-departments"]'
}

getAbsorbContentDeptSelectBox(){
    return '[data-name="select-box"]'
}

getAbsorbContentAddRuleBtn(){
    return '[data-name="add-rule"]'
}

getAbsorbContentDeleteBtn(){
    return '[data-name="remove"]'
}

getAbsorbContentCertTogl(){
    return '[data-name="toggle-button"]'
}

getAbsorbContentConvCategory(){
    return '[data-name="control_wrapper"] [class*="_category_picker_"]'
}

getAbsorbContentConvEditorSelector(){
    return '[data-name="editorIds"] [data-name="selection"]'
}

getAbsorbContentModalConvertBtn(){
    return '[class*="_modal_footer_"] button[data-name="save"]'
}

getAbsorbContentConvEditorListPicker(){
    return '[class*=" _multi_select_"]'
}

AddDateFilterCourseReport(propertyName) {
    cy.get(ARGlobalResourcePage.getAddFilterBtn()).click();
    cy.get(ARGlobalResourcePage.getPropertyName() + this.getDDownField()).eq(0).click();
    cy.get(ARGlobalResourcePage.getPropertyNameDDownSearchTxtF()).type(propertyName)
    cy.get(ARGlobalResourcePage.getPropertyNameDDownOpt()).contains(new RegExp("^" + propertyName + "$", "g")).click()
    cy.get(ARGlobalResourcePage.getSubmitAddFilterBtn()).should('be.visible',{timeout:5000}).click()
}

getAbsorbContentSelectCoursesCancelBtn(){
    return '[data-name="cancel-selection-button"]'
}

getAbsorbContentSelectAllBtn(){
    return '[title="Select All"]'
}

getAbsorbContentModalMoreCoursesTxt(){
    return '[class="_more_courses_16nfs_44"]'
}

getAbsorbContentFieldSelector(){
    return '[data-name="availability-rule-item"] [data-name="selection"]'
}

getPropertyTxtFInput(){
    return 'input[aria-label="Value"]'
}

scrollToMoreCourses() {
    cy.contains('and 30 more courses').scrollIntoView()
}

getAbsorbContentPropertyNameDDownSearchTxtF(){
    return '[data-name="list-content"] input[aria-label="Property"]'
}

getAbsorbContentPropertyNameDDownOpt(){
    return '[data-name="options"] li[id*="-options-Contains"]'
}

AddAbsorbContentEnrollmentRule(propertyName) {
    cy.get(this.getAbsorbContentFieldSelector()).eq(0).click();
    cy.get(this.getAbsorbContentPropertyNameDDownSearchTxtF()).eq(0).type(propertyName)
    cy.get(ARGlobalResourcePage.getPropertyNameDDownOpt()).contains(new RegExp(propertyName)).click()
    cy.get(this.getAbsorbContentFieldSelector()).eq(1).click();
    cy.get(this.getAbsorbContentPropertyNameDDownOpt()).eq(0).click()
    cy.get(this.getPropertyTxtFInput()).type('learner')

}

getAbsorbContentCategoryTitle(){
    return '[class*="_category_title_"]'
}

getAbsorbContentCategoryTile(){
    return '[data-name="categories"] [class*="_category_"]'
}

getAbsorbContentRemoveAllFiltersBtn(){
    return '[data-name="remove-all-filters"]'
}

getAbsorbContentNavToParentCategoryBtn(){
    return 'button[aria-label="Navigate to Parent Category"]'
}

AddAbsorbContentFilterCategories(propertyName) {
    cy.get(this.getAddFilterBtn()).click();
    cy.get(ARGlobalResourcePage.getRuleDropDownBtn()).eq(0).click({timeout:2000});
    cy.get(this.getAbsorbContentSearchTxtF()).type(propertyName)
    cy.get(this.getPropertyNameDDownOpt()).contains(new RegExp( propertyName)).click()
    cy.get(ARDashboardPage.getChooseFileBtn()).click()
    this.getAbsorbContentSubCategoryToggle()
    cy.get(this.getAbsorbContentDeptSelectBox()).first().click()
    cy.get(AREquivalentCoursesModule.getEqOkBtn()).click({timeout:2000})
    cy.get(ARGlobalResourcePage.getSubmitAddFilterBtn()).should('be.visible',{timeout:5000}).click()
}

getAbsorbContentSubCategoryToggle() {
    cy.get('div[data-name="toggle"]').first().click({timeout:3000})
}











}