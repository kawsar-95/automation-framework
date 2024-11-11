import { ocDetails } from "../../../../TestData/Courses/oc";
import ARBasePage from "../../../ARBasePage";
import ARDashboardPage from "../../Dashboard/ARDashboardPage";
import ARAddObjectLessonModal from "../../Modals/ARAddObjectLessonModal";


export default new class AREquivalentCoursesModule extends ARBasePage {

/*
** This method/function is used to get any of the equivalent course function by name within Courses.
*/

//Add & edit course equivalent button and description text at the top of the Add/Edit Course page

getEquivalentCourseName(){
    return '[id="equivalent-course-label"]'
}

getEquivalentCourseDesc(){
    return '[data-name="no-equivalent-courses"]'
}

getEquivalentCourseBtn(){
    return '[data-name="select-courses"]'
}

getEquivalentCourseCount(){
    return '[data-name="course-equivalent-count"]'
}

getEquivalentItem(){
    return '[data-name="items-selected"]'
}

getEqLoadMoreBtn(){
    return '[data-name="load-more"]'
}

getEqNumberTxt(){
    return '[data-name="number-of-equivalencies"]'
}

getEqCourseStatus(){
   return 'div[data-name="course-status"]'
}

getEqSearch(){
    return 'input[aria-label="Search"]'
}

getEqSelectOpt(){
    return 'div[data-name="selectBoxArea"]'
}

getEqOkBtn(){
    return 'button[data-name="submit"]'
}

scrollToEquivalentCourse() {
    cy.contains('Equivalent Courses').scrollIntoView()
}

getEqListNumber(){
return '[data-name="number"]'
}

getEqCourseTitle(){
    return '[data-name="course"]'
}

getEqCourseLang(){
    return '[data-name="course-language"]'
}

getEqEditBtn(){
    return '[data-name="button-options"]'
}

getEqExpToggle(){
    return 'button[aria-label="Expand Course Details"]'
}

getEqDeleteBtn(){
    return 'button[aria-label="Delete Equivalent Course"]'
}

getEqRemoveModalTitle(){
    return 'div [data-name="dialog-title"]'
}

getEqRemovalModal(){
    return '[data-name="remove-equivalent-course-modal"]'
}

getEqRemoveBtn(){
    return '[data-name="remove-equivalent-course-button"]'
}

getEqHistoryDetails(){
    return '[class*="_row_tc"]'
}
getAdminUsername(){
    return '[data-name="edited-by-label"]'
}

getHistoryModalViewBtn(){
    return 'button[title="View More"]'
}

getEqCourseDesc(){
    return '[data-name="equivalent-course-description-container"] [class*="_label_s"]'
}

getEqCourseCompt(){
    return '[data-name="equivalent-course-competencies-container"] [class*="_label_s"]'
}

getEqCourseTag(){
    return '[data-name="equivalent-course-tags-container"] [class*="_label_s"]'
}

getEqNoDescText(){
    return '[class="sanitized_html"]'
}

getEqNoComptText(){
    return '[data-name="no-competencies"]'
}

getEqNoTagText(){
    return '[data-name="no-tags"]'
}

getEqDescReadBtn(){
    return '[title="Read More"]'
}

getEqComptDetails(){
    return '[data-name="competency-details"]'
}

getEqComptLevel(){
    return '[data-name="competency-level"]'
}


getEqComptBadge(){
    return '[data-name="competency-badge"]'
}

getEqTagDetails(){
    return '[data-name="tags"]'
}

getEqEditLink(){
    return '[aria-label="Edit"] [class*="_edit_link_"]'
}

getAREditOcMenuActionsByNameThenClick(name) {
    this.getMediumWait()
    cy.get(this.getAREditOcMenuActionsBtn()).filter(`:contains(${name})`).click({ force: true });
}

getAREditOcMenuActionsBtn(){
    return '[data-name="edit-course-context-button"]'
}

getCourseFilterSearchTxt(){
    return '[class*="_list_"] [class*="_search_"]'
}

getCourseFilterDDownOpt(){
    return ' [aria-label="Course"] div[class*="_select_inner_ledtw_"]'
}

getCourseLangFilterDDownOpt(){
    return ' [aria-label="Language"] div[class*="_select_inner_ledtw_"]'
}

AddCourseFilterCourseReport(propertyName) {
        cy.get(this.getAddFilterBtn()).click();
        cy.get(this.getPropertyName() + this.getDDownField()).eq(0).click();
        cy.get(this.getPropertyNameDDownSearchTxtF()).type(propertyName)
        cy.get(this.getPropertyNameDDownOpt()).contains(new RegExp("^" + propertyName + "$", "g")).click()
        cy.get(this.getOperator() + this.getDDownField()).eq(1).click();
        cy.get(this.getCourseFilterSearchTxt()).type('Admin');
        cy.get(ARDashboardPage.getWaitSpinner()).wait(3000)
        cy.get(this.getCourseFilterDDownOpt()).eq(0).click({force:true})
        cy.get(this.getSubmitAddFilterBtn()).should('be.visible',{timeout:5000}).click()
     }

getCourseRefinementFilter(){
   return '[data-name="add-refinement-filter"]'
}

getRefineFilterDDownopt(){
    return '[data-name="selection"] [class*="_select_value_"]'
}

getIncludeEqOpt(){
    return '[aria-label="Property"] [class*="_label_ledtw"]'
}

getIncludeEqYes(){
    return '[data-name="label"][title="Yes"]'
}

AddIncludeEqCourseFilter(){
    cy.get(this.getCourseRefinementFilter()).click();
    cy.get(this.getRefineFilterDDownopt()).click()
    cy.get(this.getCourseFilterSearchTxt()).type('Include')
    cy.get(this.getIncludeEqOpt()).should('have.text','Include Equivalent Courses').click()
    cy.get(this.getIncludeEqYes()).contains('Yes').should('be.visible')
    cy.get(this.getSubmitAddFilterBtn()).contains('Add Filter',{timeout:1000}).click()
    cy.get(ARDashboardPage.getWaitSpinner()).wait(3000)

}

getEqEditRefinementFilter(){
    return '[data-name="filter-edit"]'
}

UpdateIncludeEqCourseFilter(){
    cy.get(this.getEqEditRefinementFilter()).eq(3).click()
    cy.get(this.getIncludeEqYes()).click({force:true})
    cy.get(this.getIncludeEqNo()).contains('No').should('be.visible').click()
    cy.get(this.getSubmitAddFilterBtn()).contains('Update Filter', {timeout:2000}).click()

}

getEqIdTxt(){
    return '[data-name="title"]'
}

getIncludeEqNo(){
    return '[id*="-options-false"]'
}

getEqIdFilter(){
    return '[title="Equivalency ID Filter"] [class*=" icon icon-filter"]'
}

getEqIdFilterErrorTxt(){
    return '[data-name="error"]'
}

getEqIdTextF() {
    return `[class="_text_input_1c8rc_1"]`
}

getEqIdTextErrF(){
    return '[class*=" _error_1c8rc_18"]'
}

EquivalentIDFilter(){
    cy.get(this.getEqIdFilter()).click({force:true})
    cy.get(this.getEqIdTextF()).should('be.visible').type('test')
    cy.get(this.getEqIdFilterErrorTxt()).contains('Value is not a valid ID and will match no items.').should('be.visible')
    cy.get(this.getEqIdTextErrF()).clear()
    cy.get(this.getEqIdTextErrF()).should('be.visible').type('bc71691f-9e03-409a-9579-eefc0abb078f',{timeout:2000})
    cy.get(this.getEqIdFilterErrorTxt()).should('not.be.visible')
    cy.get(this.getSubmitAddFilterBtn()).should('be.enabled').click()
}

getRemoveFilterEndBtn(){
    return 'button[data-name="filter-end"]'
}

getCourseChooseDDownBtn(){
    return '[data-name="select-field"]'
}

getCourseActivityCourseFilterOpt(){
    return '[data-name="select-option"]'
}

getCourseEnrollmentDDownBtn(){
    return '[data-name="selection"]'
}

getUserEnrollmentDDownOpt(){
    return '[class*="_select_option_"] '
}

getAECourseLanguageFilterBtn(){
    return '[aria-label="Course Language Filter"]'
}

RemoveAllCourseEqFilters(){
    cy.get(this.getRemoveFilterEndBtn()).eq(0).click()
    cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist').wait(3000)
    cy.get(this.getRemoveFilterEndBtn()).eq(1).click()
    cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')
    cy.get(this.getRemoveFilterEndBtn()).eq(0).click()
    cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist').wait(3000)
    cy.get(this.getRemoveFilterEndBtn()).eq(0).click()

}

CourseActivityCourseFilter(){
    cy.get(this.getCourseChooseDDownBtn()).click()
    cy.get(this.getCourseActivityCourseFilterOpt()).eq(0).click({force:true})
    cy.get(this.getCourseChooseDDownBtn()).click()
    cy.get(this.getSubmitAddFilterBtn()).should('be.enabled',{timeout:5000}).click()

}

AddCourseActivityIncludeEqCourseFilter(){
    cy.get(this.getCourseRefinementFilter()).click();
    cy.get(this.getIncludeEqYes()).contains('Yes').should('be.visible')
    cy.get(this.getSubmitAddFilterBtn()).contains('Add Filter',{timeout:1000}).click()
}

CourseEnrollmentCourseFilter(){
    cy.get(this.getCourseEnrollmentDDownBtn()).click()
    cy.get(this.getCourseFilterDDownOpt()).eq(0).click({force:true})
    cy.get(this.getSubmitAddFilterBtn()).should('be.enabled',{timeout:5000}).click()
}

UserEnrollmentCourseFilter(){
    cy.get(this.getCourseEnrollmentDDownBtn()).click()
    cy.get(this.getCourseFilterSearchTxt()).type('GUI_Auto')
    cy.get(this.getUserEnrollmentDDownOpt()).eq(0).click({force:true})
    cy.get(this.getSubmitAddFilterBtn()).should('be.enabled',{timeout:5000}).click()
}

UpdateCourseActivityLanguageFilter(){
    cy.get(this.getEqEditRefinementFilter()).eq(1).click()
    cy.get(this.getCourseEnrollmentDDownBtn()).eq(1).click({force:true})
    cy.get(this.getCourseLangFilterDDownOpt()).eq(0).click({force: true})
    cy.get(this.getSubmitAddFilterBtn()).contains('Update Filter', {timeout:2000}).click()
}
AEAddCourseLangFilter(){
    cy.get(this.getAECourseLanguageFilterBtn()).click({force:true})
    cy.get(this.getCourseEnrollmentDDownBtn()).eq(0).contains('Course Language').should('be.visible')
    cy.get(this.getCourseEnrollmentDDownBtn()).eq(1).click({force:true})
    cy.get(this.getCourseLangFilterDDownOpt()).eq(1).click({force: true})
    cy.get(this.getSubmitAddFilterBtn()).should('be.enabled',{timeout:5000}).click()
}

UpdateCourseLanguageFilter(){
    cy.get(this.getEqEditRefinementFilter()).eq(0).click()
    cy.get(this.getCourseEnrollmentDDownBtn()).eq(1).click({force:true})
    cy.get(this.getCourseLangFilterDDownOpt()).eq(0).click({force: true})
    cy.get(this.getSubmitAddFilterBtn()).contains('Update Filter', {timeout:2000}).click()
}


}



