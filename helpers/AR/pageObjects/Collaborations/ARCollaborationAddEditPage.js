import { collaborationDetails } from "../../../TestData/Collaborations/collaborationDetails";
import arBasePage from "../../ARBasePage";
import ARDashboardPage from "../Dashboard/ARDashboardPage";
import ARUploadFileModal from "../Modals/ARUploadFileModal";

export default new class ARCollaborationAddEditPage extends arBasePage {

    getPageHeader() {
        return '[data-name="title"][class*="_title_owqws_1"]'
    }

    getCollaborationResourceSection() {
        return '[data-name="collaboration-resources-section"]'
    }

    getCollabPageHeader() {
        return 'h1[class*="banner-title-module__title"]'
    }

    getCollaborationPageTitleTxt() {
        return 'h1[id="edit-collaboration-title"]'
    }

    getSectionHeader() {
        return "header";
    }

    getViewHistoryBtn() {
        return '[data-name="view_history"] [class*="icon icon-history"]'
    }

    getStatusToggleContainer() {
        return this.getElementByDataNameAttribute("isActive")
    }

    getCollaborationStatusToggleChckbx() {
        cy.get('div[data-name="toggle"]').click()
    }

    //----- For Collaboration Details -----//

    getNameTxtF() {
        return 'input[aria-label="Name"]'
    }

    getDescriptionTxtF() {
        return 'div[aria-label="Description"]'
    }

    getCollaborationTagChooser() {
        cy.get('div[data-name="collaborationTagIds"]').within(() => {
            cy.get('div[data-name="selection"]').click()
            cy.get('div[data-name="options"]').find('li').first().click()
        })
        cy.get('div[data-name="collaborationTagIds"]').find('div[data-name="selection"]').click()
        ARDashboardPage.getShortWait()
    }

    getCollaborationCourseChooser() {
        cy.get('div[data-name="collaborationCourseIds"]').within(() => {
            cy.get('div[data-name="field"]').click()
            cy.get('div[data-name="options"]').find('li').first().click()

        })
        cy.get('div[data-name="collaborationCourseIds"]').find('div[data-name="field"]').click()
        ARDashboardPage.getShortWait()
    }

    getCollaborationAssignmentUserChooser() {
        cy.get('div[data-name="userIds"]').within(() => {
            cy.get('div[data-name="field"]').click()
            cy.get('div[data-name="options"]').find('li').first().click()
        })
        cy.get('div[data-name="userIds"]').find('div[data-name="field"]').click()
        ARDashboardPage.getShortWait()
    }

    getCollaborationAssignmentGroupChooser() {
        cy.get('div[data-name="groupIds"]').within(() => {
            cy.get('div[data-name="selection"]').click()
            cy.get('div[data-name="options"]').find('li').first().click()

        })
        cy.get('div[data-name="groupIds"]').find('div[data-name="selection"]').click()
        ARDashboardPage.getShortWait()

    }

    getCollaborationAddResource() {

        cy.get(this.getAddResourcesBtn()).click()
        ARDashboardPage.getShortWait()
        cy.get('div[data-name="collaboration-resources-section"]').within(() => {
            cy.get('input[aria-label="Name"]').type(collaborationDetails.resourceOne[0])
            cy.get('div[aria-label="Description"]').type(collaborationDetails.resourceOne[1])
            cy.get('button[data-name="select"]').click()
            ARDashboardPage.getShortWait()

        })

        //Pick a media
        cy.get(ARUploadFileModal.getMediaGridView()).eq(0).click()
        cy.get(ARUploadFileModal.getApplyBtn()).click()
        ARDashboardPage.getMediumWait()

    }

    getCollaborationCancelBtn() {

        cy.get('div[id="edit-collaboration-context-menu"]').within(() => {
            cy.get('button[data-name="cancel"]').click()
        })
    }

    getCollaborationSaveBtn() {

        cy.get('div[id="edit-collaboration-context-menu"]').within(() => {
            cy.get('button[data-name="submit"]').click()
        })
    }

    getCollaborationUnsaveFooter() {
        return 'div[data-name="prompt-footer"]'
    }

    getCollaborationUnsaveCancelBtn() {
        return 'button[data-name="cancel"]'
    }

    getCollaborationUnsaveOKBtn() {
        return 'button[data-name="confirm"]'
    }



    getFormLabel() {
        return '[data-name="label"]'
    }

    getCoursesDDown() {
        return '[data-name="collaborationCourseIds"] [data-name="field"]'
    }

    getCoursesSearchTxtF() {
        return 'input[name="collaborationCourseIds"]'
    }

    getCoursesOpt(courseName) {
        cy.get('[class*="_select_option_ledtw_1"]').contains(courseName).click({ force: true })
    }

    getSelectedCourse() {
        return '[data-name="collaborationCourseIds"] [data-name="selection"] [data-name="label"]'
    }

    getSelectionCourse(number) {
        return `[data-name="collaborationCourseIds"]  [class*="_value_"]:nth-child(${number})`
    }

    getClearBtn() {
        return '[class*="icon icon-x"]'
    }

    getGroupsOpt(groupName) {
        cy.get('[class*="select-option-module__label"]').contains(groupName).click()
    }

    getSelectedGroup() {
        return '[data-name="groupIds"] [class*="select-option-value-module__select_value"]'
    }

    getClearBtn() {
        return '[class*="icon icon-x"]'
    }

    getAddDepartmentsBtn() {
        return '[data-name="select-departments"] [class*="icon icon-plus"]'
    }

    getDepartmentsContainer() {
        return '[class*="department-selection-list-module"]'
    }

    getDepartmentRuleContainer() {
        return '[class*="department-selection-list-item-module__list_item"]'
    }

    getDepartmentRuleLabel() {
        return '[class*="department-selection-list-item-module__name"]'
    }

    getDepartmentRuleDDown() {
        return '[class*="select-field-module__selection"]'
    }

    getDepartmentOpt(option) {
        cy.get('[class*="select-option-module__label"]').contains(option).click()
    }

    getDeleteDepartmentRuleBtn() {
        return '[class*="icon icon-trash"]'
    }


    //----- Assignments Section -----//

    getUsersDDown() {
        return '[data-name="userIds"] [data-name="selection"]'
    }

    getUsersSearchTxtF() {
        return '[data-name="userIds"] [class*="select-module__input"]'
    }

    getUsersOpt(learnerName) {
        return ('[class*="user-select-option-module__user"]').contains(learnerName)
        //cy.get('[class*="user-select-option-module__user"]').contains(learnerName).click()
    }

    getUsersOpt() {
        return ('[class*="user-select-option-module__user"]')
        //cy.get('[class*="user-select-option-module__user"]').contains(learnerName).click()
    }

    getSelectedUser() {
        return '[data-name="userIds"] [class*="select-option-value-module__select_value"]'
    }

    getGroupsDDown() {
        return '[data-name="groupIds"] [class*="select-field-module__selection"]'
    }

    getGroupsSearchTxtF() {
        return '[data-name="groupIds"] [class*="select-module__input"]'
    }



    //----- Resources Section -----//

    //Get the aria-label of the resource you want to target, then use .within(()=>{}) and get each selector in there
    getResourceByIndex(resource, totalResources) {
        return `Resource ${resource} of ${totalResources}`
    }

    getCollaborationResource() {
        return '[data-name="collaboration-resources"]'
    }
   
    getAddResourcesBtn() {
        return 'button[data-name="add-resource"]'
    }

    getEditResourceBtn() {
        return `[class*="icon icon-pencil"]`
    }

    getCollapseBtn() {
        return `[class*="icon icon-checkmark"]`
    }

    getDeleteResourceBtn() {
        return `[class*="icon icon-trash"]`
    }

    getResourceContainer() {
        return `[data-name="name"]`
    }

    getExpandedResourceContainer() {
        return `[class*="_expandable_list_item_"]`
    }

    getResourceNameTxtF() {
        return `[data-name="name"] input[name="name"]`
    }

    getResourceNameErrorMsg() {
        return `[data-name="name"] [data-name="error"]`
    }

    getResourceDescriptionTxtF() {
        return `[data-name="description"] [aria-label="Description"]`
    }

    getResourceDescriptionErrorMsg() {
        return `[data-name="description"] [data-name="error"]`
    }

    getAttachmentRadioBtn() {
        return `[data-name="source-select"][class*="_source_select_wktw9_1"]`
    }

    getChooseFileBtn() {
        return `[data-name="file"] [class*="icon icon-folder-small"]`
    }

    getFileInputF() {
        return `[data-name="file"] input[name="file"]`
    }

    getUrlTxtF() {
        return `[data-name="url"] input[name="url"]`
    }

    getDeleteResourceBtnByNameThenClick(name) {
        cy.get(this.getResourceContainer()).contains(name).parent().within(() => {
            cy.get(this.getDeleteResourceBtn()).click()
        })
    }

    /**
     * Added for the TC# C7401
     * This is similar to ARBase (super) AddFilter. The only differience is, instead of a checkbox, it selects a radio button
     * @param {string} propertyName Name of hte property in filter's property drop-down. For example 'Name'
     * @param {string} operator Name of the the filter. For example, 'Contains', 'Equals', etc.)
     * @param {any} value Value to be filtered
     */
    AddRadioFilter(propertyName, operator, value) {
        cy.get(this.getAddFilterBtn()).click();
        cy.get(this.getPropertyName() + this.getDDownField()).first().click()
        cy.get(this.getPropertyNameDDownSearchTxtF()).type(propertyName)
        cy.get(this.getDateAddedPropertyDDownOpt()).contains(new RegExp("^" + propertyName + "$", "g")).click();
        cy.get(this.getOperator() + this.getDDownField()).last().click()
        cy.get(this.getOperatorSearchTxtF()).type(operator);
        cy.get(this.getOperatorDDownOpt()).contains(operator).click()
        if (propertyName.includes("Date Added")) {
            cy.get(this.getElementByAriaLabelAttribute(this.getDateF()) + " " + this.getFilterDatePickerBtn()).click()
            this.getSelectDate(value)
        } else {
            cy.get(this.getElementByAriaLabelAttribute(this.getValueTxt())).type(value)
        }
        cy.get(this.getSubmitAddFilterBtn()).click();
        cy.get(this.getWaitSpinner(), { timeout: 20000 }).should("not.exist")
    }


    // Also a overrided function from the base class
    getDateAddedPropertyDDownOpt() {
        return 'li > [class="_select_option_ledtw_1 _selected_ledtw_67"]';
    }

    getViewAllRelatedCollaborationsBtn() {
        return '[class*="course-related-collaborations-open-menu"]'
    }

    getCollaborationFlyover() {
        return '[class*="flyover-module__menu_container___vFOZC"]'
    }

    getViewCollabrationBtn() {
        return '[class="overflow-menu-button-module__menu_button___fZ1Mx"]';
    }

    getCollaborationPosts() {
        return '[class*="collaboration-activity-card-module__container___qOhJA focus-indicator course"]'
    }

    getCourseOptionsDDown() {
        return `[data-name="collaborationCourseIds"] [data-name="options"]`
    }
}
