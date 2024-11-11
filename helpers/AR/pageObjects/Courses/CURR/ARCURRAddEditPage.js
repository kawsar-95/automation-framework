import arBasePage from "../../../ARBasePage";
import ARDashboardPage from "../../Dashboard/ARDashboardPage"
import ARCourseSettingsAvailabilityModule from "../modules/ARCourseSettingsAvailability.module";

export default new class ARCURRAddEditPage extends arBasePage {

  getGeneralStatusToggleContainer() {
    return "#courseStatus ";
  }

  getCurrCourseGeneralHeader() {
    return this.getElementByDataNameAttribute("edit-curriculum-general-section")
  }
  // Use this text as value for aria-label attribute to get this element
  getGeneralTitleTxtF() {
    return "Name";
  }

  getGroupTitleTxtF() {
    return "Group Name";
  }

  getGeneralLanguageClearBtn() {
    return '[data-name="languageCode"] [class*="_clear"]'
  }

  getEnrollmentExpandCollapseIcon() {
    return '[data-name*="enrollment"] [class*="icon-caret-up"]'
  }
  getRequiredInRedColor() {
    return this.getElementByDataNameAttribute("name") + ' ' + this.getElementByDataNameAttribute("required");
  }
  getHeaderFromCurr() {
    return this.getElementByDataNameAttribute("header")
  }
  getGeneralLabels() {
    return this.getElementByAriaLabelAttribute("General")
  }
  getCurrSubHeaders() {
    return this.getElementByPartialDataNameAttribute("edit-curriculum") + ' ' + this.getElementByDataNameAttribute("header")
  }
  getRequiredInRedColorForGroupName() {
    return this.getElementByDataNameAttribute("chapters") + ' ' + this.getElementByDataNameAttribute("required");
  }
  getPaceProgressToggleDescription() {
    return this.getElementByDataNameAttribute("paceProgress")
  }

  getGeneralTagsDDown() {
    return '[data-name="courseTagIds"] [class*="select-module__placeholder"]';
  }

  getAddCoursesBtn() {
    return `[data-name="add_courses"]`;
  }

  getAddGroupBtn() {
    return '[data-name="add-curriculum-group"]';
  }

  getGroupList() {
    return this.getElementByDataNameAttribute("curriculum-groups-list")
  }

  getGroupContainer() {
    return `[data-name="curriculum-group"]`

  }

  getGroupTitle() {
    return `[data-name="curriculum-group"] [class*="_header"] [data-name="name"]`
  }

  getGroupGripBtnByName(name) {
    cy.get(this.getGroupTitle()).contains(name).parents(this.getGroupContainer()).within(() => {
      cy.get(this.getGripBtn())
    })
  }

  getShowTermsAndConditionsToggleContainer() {
    return '[data-name="isDisplayedToLearner"] ';
  }

  getTermsAndConditionsDescriptionTxtF() {
    return 'div[aria-label="Terms & Conditions"] > p';
  }

  getGroupNoCourseDescription() {
    return this.getElementByDataNameAttribute("no-courses")
  }
  getGroupsRadioButtonsLabels() {
    return '[data-name="completionType"]'
  }


  getPaceProgressToggleContainer() {
    return "paceProgress" //data-name
  }

  getGroupCollapseExpandBtn(groupIndex = 1) {
    return `[class*="drag-item-module__drag_item"]:nth-of-type(${groupIndex}) [class*="expandable-list-item-collapse-button-module__visibility"]`;
  }

  getGroupDeleteBtn(groupIndex = 1) {
    return `[class*="_header_dllxz_1 _expanded_dllxz_23"]:nth-of-type(${groupIndex}) [aria-label="Delete"]`;
  }

  getGroupRadioBtn(groupIndex = 1) {
    return `[class*="drag-item-module__drag_item"]:nth-of-type(${groupIndex}) [data-name="radio-button"]`;
  }

  getRequiredCourseCountTxtF(txtFIndex = 1) {
    return `[class*="drag-item-module__drag_item"]:nth-of-type(${txtFIndex}) [aria-label="Required Course Count"]`;
  }

  getGroupNameTxtF() {
    return this.getElementByAriaLabelAttribute("Group Name")
  }

  getGroupCourseNameLbl(courseIndex = 1) {
    return `div:nth-of-type(${courseIndex}) > [class*="curriculum-group-module__drag_item_container"] > div[role="listitem"] > div[role="group"] > [class*="curriculum-group-course-module__name"]`;
  }

  getCourseContainer() {
    return '[class*="_drag_item_1b8sn"]'
  }

  getCourseName() {
    return `[data-name="courses"] [data-name="name"]`
  }

  getCourseDeleteBtn() {
    return this.getTrashBtn()
  }

  // Added for the TC# C7320
  getCourseElementByAriaLabelAttribute() {
    return '[aria-label="Courses"]'
  }

  getCourseMenuItemOptionByName() {
    cy.get(ARDashboardPage.getMenuItem()).contains("Courses").click();
  }

  getCompetenciesMenuItemOptionByName() {
    cy.get(ARDashboardPage.getMenuItem()).contains("Competencies").click();
  }

  getA5AddEditMenuActionsByNameCompetencyThenClick() {
    this.getShortWait()
    cy.get('#sidebar-content [href]').filter(`:contains("Competency")`).click({ force: true });
  }

  getPageTitle() {
    return 'h1[data-name="title"]'
  }

  getAddCurriculumCoursesActionsButtonsByLabel() {
    return 'button[title="Add Curriculum"]';
  }

  getTagsInputField() {
    return '[data-name="field"]'
  }

  getTagsInputTypeField() {
    return '[name="courseTagIds"]'
  }

  getTagsUlList() {
    return '[role="listbox"]'
  }

  getCourseSettingsByAvailabilityNameBtn() {
    return `[class="_button_container_8vfwm_1"] > button[title="Availability"]`
  }

  getAvailabilityFieldName() {
    return '[class*="_label_"] [data-name="label"]'
  }

  getAllowCourseContentDownload() {
    return '[data-name="description"]'
  }

  getPrerequisitebtn() {
    return 'button[data-name="add-prerequisite"]'
  }

  getPrerequisiteContainer() {
    return '[class*="_prerequisite_container_"]'
  }

  getPrerequisiteName() {
    return '[data-name="name"]'
  }

  getPrerequisiteNameField() {
    return '[class*="_text_input_"]'
  }

  getPrerequisiteRequirementType() {
    return '[data-name="prerequisiteType"]'
  }

  getCompleteCoursebtn() {
    return '[data-name="radio-button-Courses"]'
  }

  getValidCertificatebtn() {
    return '[data-name="radio-button-Certificates"]'
  }

  getCompetenciesbtn() {
    return '[data-name="radio-button-Competencies"]'
  }

  getCoursesTxt() {
    return '[data-name="courseIds"]'
  }

  getCompletionType() {
    return '[data-name="completionType"]'
  }

  getMustCompletebtn() {
    return '[data-name="radio-button-MustCompleteAll"]'
  }

  getRequiredToCompletebtn() {
    return '[data-name="radio-button-RequiredToComplete"]'
  }

  getRadiobtn() {
    return '[data-name="radio-button"]'
  }

  getRequiredCourseCountTxtFields() {
    return '[data-name="requiredCompletionNumber"]'
  }

  getEequiredCourseCountContainer() {
    return '[data-name="requiredCourseCount"]'
  }

  getRequiredCourseCountInput() {
    return '[aria-label="Required Course Count"]'
  }

  getAddCompetenciesbtn() {
    return '[data-name="add-competency-object"]'
  }

  getCompetencyTitle() {
    return '[data-name="dialog-title"]'
  }

  getCancelBtnFooter() {
    return '[class*="_modal_footer"] [data-name="cancel"]'
  }

  getCompetencyName() {
    return '[class*="_competencies_title_"]'
  }

  getCompetencyInput() {
    return 'input[type="search"]'
  }

  getCompetencySelectList() {
    return '[data-name="hierarchy-tree-item"]'
  }

  getFooterChoosebtn() {
    return '[class*="_modal_footer"] [data-name="submit"]'
  }

  getCompetencyLable() {
    return '[class*="_competency_label_"]'
  }

  getRemoveCompetencyBtn() {
    return 'button[aria-label="Remove Competency"]'
  }

  getPrerequisiteRemovebtn() {
    return '[data-name="delete-prerequisite"]'
  }

  getAllowCourseContentToggle() {
    return super.getElementByDataNameAttribute(ARCourseSettingsAvailabilityModule.getAllowContentDownloadToggleContainer()) + ' ' + this.getToggleDisabled()
  }

  getGeneralTitleInput() {
    return super.getElementByAriaLabelAttribute(this.getGeneralTitleTxtF())
  }

  // Added for the TC# C7319
  getAddCurriculumGroupBtn() {
    return '[data-name="add-curriculum-group"]'
  }

  getDeleteGroupCourse() {
    cy.get('[data-name="curriculum-group"]').first().within(() => {
      cy.get('[data-name="remove"]').first().click()
    })
  }

  getRemoveGroupCourse() {
    cy.get(`[role=dialog]`).find(`[data-name="confirm"]`).click()
  }

  getDotSymbol() {
    return '_dot_8vfwm_28'
  }

  getRedErrorIcon() {
    return '_error_8vfwm_48'
  }

  getGroupDeleteBtnUsingWithin() {
    return `button[aria-label="Delete"]`
  }

  deleteGroupByName(name) {
    cy.get(this.getGroupTitle()).contains(name).parent().within(() => {
      cy.get('[data-name="remove"]').click()
    })
  }

  getGeneralSectionTitle() {
    return '[data-name="edit-curriculum-general-section"] [data-name="header"]'
  }

  getGeneralTitle() {
    return '[data-name="edit-curriculum-general-section"] [class*="_label_"]'
  }

  getGeneralNameTxtF() {
    return 'input[aria-label="Name"]'
  }

  getGeneralAllFields() {
    cy.get('[aria-label="General"]').children().should(($child) => {
      expect($child).to.contain('Status')
      expect($child).to.contain('Name (Required)')
      expect($child).to.contain('Description')
      expect($child).to.contain('Language')
      expect($child).to.contain('Tags')
      expect($child).to.contain('Automatic Tagging')
    })
  }

  getCourseSection() {
    return '[data-name="edit-curriculum-courses-section"] [data-name="header"]'
  }

  getAddCourseBtn() {
    return '[data-name="edit-curriculum-courses-section"] [data-name="add-courses"]'
  }
  getShowTermsAndConditionsMessage() {
    return `[data-name="course-terms-and-conditions"] [data-name="description"]`
  }

  getRadioBtnDataNameField() {
    return `[data-name="radio-button"]`
  }

  getErrorAsDataNameField() {
    return `[data-name="error"]`
  }

  // Added for the TC# C2044
  getCURREditActionBtn() {
    return 'div[class="_child_w33d3_9"] > button'
  }

  getMinimumcreditsBtn() {
    return '[data-name="radio-button-credits"]'
  }

  getRequiredCreditCountContainer() {
    return '[data-name="requiredCreditCount"]'
  }

  getRequiredCreditCountF() {
    return '[name="requiredCreditCount"]'
  }
}

// Labels/Message on various inputs
export const CurrPageLableMessages = {
  "offlineDownloadDescription": "Allows users to download and complete this course while offline.",
  "accessDateLabel": "Access Date",
  "expirationLabel": "Expiration",
  "dueDateLabel": "Due Date",
  "requiredNameLabel": "Name (Required)",
  "prerequisiteTestTypeLable": "Prerequisite Test",
  "requirementTypeLabel": "Requirement Type",
  "completeCoursesLabel": "Complete Courses",
  "validCertificatesLabel": "Valid Certificates",
  "competenciesLabel": "Competencies",
  "competenciesLabel": "Competencies",
  "requiredCoursesLabel": "Courses (Required)",
  "completionTypeLabel": "Completion Type",
  "mustCompleteAllLabel": "Must complete all",
  "required2completeLabel": "Required to complete",
  "requiredCourseCountLabel": "Required Course Count (Required)",
  "selectCompetenciesLabel": "Select Competencies",
  "nameRequired": "Name (Required)",
  "noDepartmentDescription": "Administrators who manage this department can edit this course if they have course visibility. If no department is selected, this applies to all Administrators.",
  "departmentChooseDescription": "These administrators can edit this course if they have course visibility.",
  "tagToggleDescription":"Turning this option 'on' will make course recommendations available that match the following tags for this course.",
  'tagToggleForFeaturedCourseMessage':`Turning this option 'on' will make this course available within the featured area on the dashboard.`,
  "mandatoryCourseToggleDescription":"Turning this option 'on' will prioritize the course within the learner's my courses view.",
  "contentDownloadToggleDescription":"Allows users to download and complete this course while offline.",
  "enableEcommerceToggleMessage":"Turning this option 'on' will make this course available for purchase through the shopping cart.",
  "coursesAvailableForRating":"Turning this option 'on' will make this course available for rating.",
  "paceProgressToggleDescription":"Forces completion of each group before starting the next one",
  "allOtherUser":"This course will be visible to all other administrator users",
  "allowCommentsToggleDescription":"Enable learner feedback for the entire course."


}

