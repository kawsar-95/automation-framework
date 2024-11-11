import ARDashboardPage from '../../../AR/pageObjects/Dashboard/ARDashboardPage'
import LEBasePage from '../../LEBasePage'

export default new class French extends LEBasePage {

    
getTableaudebord(){
return'[class*="navigation-menu-module__link"]'
}

getLoginModalTitle(){
    return '[class*="login-form-module__subtitle___"]'
}
getNom(){
  return '[class*="redux-form-input-field-module__label"]'
}

getInscription(){
    return '[class*="link-button-module__link"]'
}

getRester(){
    return '[class*="checkbox-module__label"]'
}

getAvez(){
    return '[class*="login-form-module__forgot_password_link"]'
}

getPollsubtitleinFrench(){
return '[class*="banner-title-module__subtitle___"]'
}

getCatalogueRibbonbyNom(name){
return cy.get('[aria-label="Visionner Catalogue"]').contains(name)
}

getMesCoursbyNom(name){
    return cy.get('[aria-label="Visionner Mes cours"]').contains(name)
}

getSondagesbyNom(name){
    return cy.get('[class*="wrapper__clickable tile__poll"]').contains(name).click()
}

getHideRefineSearchTxtinFrench() {
    return '[class*="filter-toggle-module"]'
}

getShowCategoriesTxtinFrench() {
    return '[title="Afficher les catégories"]'
}

//Only in Courses filter menu
getShowCompletedTxtinFrench() {
    return '[title="Afficher les éléments terminés"]'
}

getOCChkBoxinFrench() {
    return '[class*="course-type-filter__online_course_checkbox"]'
}

getILCChkBoxinFrench() {
    return '[class*="course-type-filter__instructor_led_course_checkbox"]'
}

getCURRChkBoxinFrench() {
    return '[class*="course-type-filter__curriculum_checkbox"]'
}

getSearchFilterTxtFinFrench() {
    //return '[class*="text-filter__text_input"]'
    return '[class*="text-filter-module__title"]'
}

getSearchFilterPlaceholderTxtinFrench(){
//return '[title="Chercher nom de cours"]'
//return'[placeholder="Chercher nom de cours"]'
return '[class*="Component-off_screen_text-"]'
}

getAdvancedFilterDDownTxtinFrench() {
    return '[class*="filter-picker-module__title"]'
}

getTagTextinFrench(){
    return '[class*="select-module__title___"]'
}

getSortColumnTxtinFrench(){
    //return '[class="sortable-table-column-header-module__]'
    return '[class*="sortable-table-module__table_row_header_item"]'
}

getResourceSearchFilterTxtinFrench(){
    return '[class*="filter-toggle-module__filter_toggle_message___"]'
}

getTranscriptUsernameTxtinFrench(){
    return ' [class*=" transcript__profile_field transcript__profile_field_username"]'
}
getTranscriptEmailTxtinFrench(){
    return '[class*=" transcript__profile_field transcript__profile_field_email"]'
}

getTranscriptinFrench(){
    return '[class*="anchor certificates-table__header"]'
}

getTranscriptCourseTitleinFrench(){
    return '[title="Cliquez ici pour trier par Titre du cours Décroissant."]'
}

getTranscriptCertValidFrominFrench(){
    return '[title="Cliquez ici pour trier par Valide à partir de/du Croissant."]'
}

getTranscriptCertExpireinFrench(){
    return '[title="Cliquez ici pour trier par Expire Croissant."]'
}

getTranscriptCertViewinFrench(){
return '[class*="sortable-table-column-header-module__table_row_header_item_text___"]'
}

 getTranscriptHeadersinFrench(){
    return'[class*=" anchor transcript__header"]'
}

getTranscriptComptinFrench(){
    return '[title="Cliquez ici pour trier par Titre de compétence Décroissant."]'
}

getTranscriptComptLevelinFrench(){
    return '[title="Cliquez ici pour trier par Niveau Croissant."]'
}

getTranscriptComptEarnedDateinFrench(){
    return '[title="Cliquez ici pour trier par Date d’obtention Croissant."]'
}

getTranscriptCourseStatusinFrench(){
    return '[title="Cliquez ici pour trier par Statut Croissant."]'
}

getTranscriptScoreinFrench(){
return '[title="Cliquez ici pour trier par Note Croissant."]'
}

getTranscriptEnrollmentDateinFrench(){
return `[class*="item transcript-module__enrollments_enrollement_date_col_"]`
}

getTranscriptCompletionDateinFrench(){
return ` [class*="item transcript-module__enrollments_completion_date_"] `
}

getTranscriptCreditsinFrench(){
return '[title="Cliquez ici pour trier par Crédits Croissant."]'
}

getTranscriptLoadmoreTextinFrench(){
    return '[class*=" page-size-button__btn"]'
}

getTranscriptExtTrainingTxtinFrench(){
    return '[class*="external-training-submissions-table-module__header___"]'
}

getTranscriptTimezoneinFrench(){
    return '[class*="transcript-module__time_zone___"]'
}

getTranscriptCourseNameinFrench(){
    return '[title="Cliquez ici pour trier par Nom du cours Décroissant."]'
}

getARPersinIcon(){
    return '[class*=" icon-person-round"]'
}

getARLanguageDDown(){
  return '[id*="form-control-admin-language"] [data-name="control_wrapper"]'
}

getARAdminLang(){
    return '[aria-labelledby="admin-language-label"]'
}

ARSelectLanguage(language){
    cy.get(this.getARPersinIcon()).click()
    ARDashboardPage.getMediumWait()
    cy.get(this.getARLanguageDDown()).click({force:true})
    ARDashboardPage.getShortWait()
    cy.get(this.getARAdminLang()).contains(language).click({force:true}).wait(2000)
}

getAddCourseButtoninFrench(){
    return '[title="Ajouter un cours en ligne"]'
}

getARCourseMenuinFrench(){
    return '[aria-label="Cours"]'
}

}