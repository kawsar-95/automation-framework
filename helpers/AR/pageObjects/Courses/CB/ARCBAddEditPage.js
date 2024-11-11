import arBasePage from "../../../ARBasePage"
import ARDashboardPage from "../../Dashboard/ARDashboardPage"

export default new class ARCBAddEditPage extends arBasePage {

    getGeneralStatusToggleContainer() {
        return `[data-name="course-status"]`
    }

    getAutomaticTaggingToggle() {
        return this.getElementByDataNameAttribute("allowAutoTagging")
    }
    getShowTermAndConditionToggle() {
        return this.getElementByDataNameAttribute("isDisplayedToLearner")
    }
    getMobileDeviceAlertToggle() {
        return this.getElementByDataNameAttribute("mobileDeviceAlert")
    }
    getProctorToggle() {
        return this.getElementByDataNameAttribute("edit-online-course-proctor")
    }
    getChapterName() {
        return this.getElementByDataNameAttribute("chapters")
    }
    getCreditToggle() {
        return this.getElementByDataNameAttribute("course-multi-credits")
    }
    getLeaderboardPointToggleTxt() {
        return this.getElementByDataNameAttribute("leaderboardPoints")
    }
    getCreditToggleText() {
        return this.getElementByDataNameAttribute("no-credits")
    }
    getAllowFailureText() {
        return this.getElementByDataNameAttribute("allowFailure")
    }
    getPostEnrollmentToggle() {
        return this.getElementByDataNameAttribute("post-enrollments")
    }
    getPostEnrollmentToggleText() {
        return this.getElementByDataNameAttribute("no-post-enrollments")
    }
    getAllowFailureToggleText() {
        return '[data-name="description"]'
    }
    getLeaderboardPointsToggleText() {
        return '[data-name="description"]'
    }
    getCompetenciesToggleText() {
        return this.getElementByDataNameAttribute("course-competencies")
    }
    getCompetenciesToggledescriiption() {
        return this.getElementByDataNameAttribute("no-course-competencies")
    }
    getEnableECommerceToggle() {
        return this.getElementByDataNameAttribute("enableEcommerce")
    }

    getGeneralTitleTxtF() {
        return 'input[aria-label="Title"]'
    }

    getEnableECommerceToggle() {
        return this.getElementByDataNameAttribute("chapters")
    }

    getCouseGeneralHeader() {
        return this.getElementByDataNameAttribute("edit-online-course-general-section")
    }
    getCouseSyllabusHeader() {
        return this.getElementByDataNameAttribute("edit-online-course-syllabus-section")
    }

    getGeneralLanguageDDown() {
        //return '[class*="select-module__select--JYWj7 select-module__below--S8q0T select-module__focused--BgkKx select-module__expanded--nyv4a select_focused"]'
        return '[data-name="languageCode"] [data-name="control_wrapper"]'

    }

    getGeneralLanguageDDownOpt() {
        return '[class*="_select_option_"]'
    }

    getGeneralTagsDDown() {
        return '[data-name="courseTagIds"] [class*="select-module__placeholder"]'
    }

    // Use this text as value for data-name attribute to get this element
    getAddCoursesBtn() {
        return 'add-courses'
    }

    getCourseTrashBtn() {
        return 'button[title="Delete Course"]'
    }

    getCourseName() {
        return '[data-name="edit-course-bundle-course"] [data-name="name"]'
    }

    getCatalogVisibilityVerification() {
        return "[data-name*='visibility-section'] [data-name='header']"
    }

    getSelectCourseModalCancelBtn() {
        return '[data-name*="dialog-0"] [class*="button-module__button--Gh4nT button-module__cancel--fHNOu"]'
    }
    getLanguageOptionItems() {
        return 'ul[aria-label="Language"]'
    }
    getCourseHierarchySelectModal() {
        return '[data-name="course-hierarchy-select-modal"]'
    }

    // Added for the TC# C7332
    getCertificatedIDs() {
        return '[data-name="certificateCourseIds"]'
    }

    getCertificatedIDsInput() {
        return 'input[name="certificateCourseIds"]'
    }

    getCertificatedIDField() {
        return '[data-name="field"]'
    }

    getCertificateIdDDownItem() {
        return '[data-name="options"] ul li'
    }

    getEnabledPublishedBtn() {
        return 'button[data-name="submit"][aria-disabled="false"]'
    }

    getDeletePreRequisitesBtn() {
        return '[aria-label="Delete Prerequisite"]'
    }

     // Added for the TC# C7333
     getCourseElementByAriaLabelAttribute() {
        return '[aria-label="Courses"]'
    }

    getCourseMenuItemOptionByName() {
        cy.get('[aria-labelledby="main-menu-options-title"]').contains('Courses').click();
    }

    getRightActionMenuCoursePage() {
        cy.get('[class*="_context_menu_"] [class*="_child_"]').children().should(($child) => {
            expect($child).to.contain('Add Online Course')
            expect($child).to.contain('Import Course')
            expect($child).to.contain('Add Instructor Led')
            expect($child).to.contain('Add Course Bundle')
            expect($child).to.contain('Add Curriculum')
            expect($child).to.contain('Add New Category')
            expect($child).to.contain('Manage Categories')
        })
    }

    getAddCourseBundleMenuActionsByName() {
        return 'button[title="Add Course Bundle"]'
    }

    getPageTitle() {
        return 'h1[data-name="title"]'
    }

    getGeneralSectionTitle() {
        return '[data-name="edit-course-bundle-general-section"] [data-name="header"]'
    }

    getGeneralStatusDes() {
        return '[data-name="description"]'
    }

    getGeneralTitle() {
        return '[data-name="edit-course-bundle-general-section"] [class*="_label_"]'
    }

    getGeneralAllFields() {
        cy.get('[aria-label="General"]').children().should(($child) => {
            expect($child).to.contain('Status')
            expect($child).to.contain('Title (Required)')
            expect($child).to.contain('Description')
            expect($child).to.contain('Language')
            expect($child).to.contain('Tags')
            expect($child).to.contain('Automatic Tagging')
        })
    }

    getCourseSection() {
        return '[data-name="edit-course-bundle-courses-section"] [data-name="header"]'
    }

    getNoCourseDes() {
        return '[data-name="edit-course-bundle-course"] [data-name="no-courses"]'
    }

    getAddCourseBtn() {
        return '[data-name="add-courses"]'
    }

    getAddCourseIcon() {
        return '[data-name="add-courses"] > span'
    }

    getCourseSettingsEnrollmentBtn() {
        return `[class="_button_container_8vfwm_1"] > button[title="Enrollment Rules"]`
    }

    getEnrollmentRules() {
        return '[data-name="edit-course-bundle-enrollment-rules-section"] [class*="_header_"]'
    }

    getEnrollmentRulesCollapseIcon() {
        return '[data-name="edit-course-bundle-enrollment-rules-section"] [class*="_header_"] > button > span'
    }

    getAllowSelfEnrollmentTitle() {
        return '[id="selfEnrollmentAvailability"] [class*="_label_"]'
    }

    getAllowSelfEnrollmentBtn() {
        return '[id="selfEnrollmentAvailability"] [data-name="radio-button"]'
    }

    getAllowSelfEnrollmentDes() {
        return '[id="selfEnrollmentAvailability"] [data-name="description"]'
    }

    getAutomaticEnrollmentTitle() {
        return '[id="automaticEnrollmentAvailability"] [class*="_label_"]'
    }

    getAutomaticEnrollmentBtn() {
        return '[id="automaticEnrollmentAvailability"] [data-name="radio-button"]'
    }
    getAutomaticEnrollmentDes() {
        return '[id="automaticEnrollmentAvailability"] [data-name="description"]'
    }

    getCourseSettingsAvailabilityBtn() {
        return `[class="_button_container_8vfwm_1"] > button[title="Availability"]`
    }

    getAccessDateTypeTitle() {
        return '[data-name="accessDateType"] [class*="_label_"]'
    }

    getAccessDateTypeBtn() {
        return '[data-name="accessDateType"] [data-name="radio-button"]'
    }

    getExpiryTypeTitle() {
        return '[data-name="expiryType"] [class*="_label_"]'
    }

    getExpiryTypeBtn() {
        return '[data-name="expiryType"] [data-name="radio-button"]'
    }

    getPrerequisite() {
        return '[data-name="course-prerequisite"]'
    }

    getPrerequisiteTitle() {
        return '[class*="_label_"]'
    }

    getPrerequisiteCmt() {
        return '[data-name="no-prerequisites"]'
    }

    getAddPrerequisiteBtn() {
        return '[data-name="add-prerequisite"]'
    }

    getCourseSettingsByCatalogVisibilityBtn() {
        return `[class="_button_container_8vfwm_1"] > button[title="Catalog Visibility"]`
    }

    getCourseVisibility() {
        return '[data-name="course-visibility"]'
    }

    getCategoryTitle() {
        return '[data-name="categoryId"] [data-name="label"]'
    }

    getChooseCategoryBtn() {
        return '[data-name="categoryId"] [data-name="select"]'
    }

    getCategoryThumbnailTitle() {
        return '[aria-label="Thumbnail"] [class*="_label_"]'
    }

    getCategoryThumbnail() {
        return '[aria-label="Thumbnail"] [class*="_image_buttons_"]'
    }

    getCategoryBtn() {
        return '[data-name="radio-button"]'
    }

    getFileRadioBtn() {
        return '[data-name="radio-button-File"]'
    }

    getCategoryChooseFileBtn() {
        return '[data-name="thumbnailImage"] [data-name="select"]'
    }

    getPostersLabel() {
        return '[data-name="posters"] [class*="_label_"]'
    }

    getPostersCmmt() {
        return '[data-name="posters"] [data-name="no-poster"]'
    }

    getAddPosterBtn() {
        return '[data-name="posters"] [data-name="add-poster"]'
    }

    getAddPosterBtnIcon() {
        return '[data-name="posters"] [data-name="add-poster"] [class*="icon-plus"]'
    }

    getFeaturedCourseLabel() {
        return '[data-name="isFeatured"] [data-name="label"]'
    }

    getFeaturedCourseDes() {
        return '[data-name="isFeatured"] [data-name="description"]'
    }

    getFeaturedCourseBtn() {
        return '[data-name="isFeatured"] [aria-label="Featured Course"]'
    }

    getRecommendedCourseLabel() {
        return '[data-name="course-recommendation-tags"] [data-name="label"]'
    }

    getRecommendedCourseDes() {
        return '[data-name="course-recommendation-tags"] [data-name="description"]'
    }

    getRecommendedCourseBtn() {
        return '[data-name="course-recommendation-tags"] [aria-label="Enable Recommended Courses"]'
    }

    getCourseSettingsByCourseAdministratorsBtn() {
        return `[class="_button_container_8vfwm_1"] > button[title="Course Administrators"]`
    }

    getCourseAdministration() {
        return '[data-name="edit-course-bundle-course-administration-section"]'
    }

    getCourseAdministrationTitle() {
        return '[class*="_header_"]'
    }

    getCourseAdministrationCollapse() {
        return '[class*="_header_"] [class*="icon-caret-up"]'
    }

    getCourseVisibilityLabel() {
        return '[data-name="course-administration-settings"] [data-name="adminVisibilityType"] [data-name="label"]'
    }

    getCourseAdministrationVisibilityDes() {
        return '[data-name="course-administration-settings"] [data-name="adminVisibilityType"] [data-name="description"]'
    }

    getCourseAdministrationVisibilityRadio() {
        return '[data-name="course-administration-settings"] [data-name="adminVisibilityType"] [data-name="radio-button"]'
    }

    getCourseAdministrationVisibilityAllAdminRadioBtn() {
        return '[data-name="course-administration-settings"] [data-name="adminVisibilityType"] [data-name="radio-button-AllAdmins"]'
    }

    getPrimaryDepartmentEditorLabel() {
        return '[data-name="course-administration-settings"] [data-name="department-select"] [data-name="label"]'
    }

    getSelectDepartment() {
        return '[data-name="course-administration-settings"] [data-name="department-select"] [data-name="select"]'
    }

    getSelectDepartmentDes() {
        return '[data-name="course-administration-settings"] [class*="_description_"]'
    }

    getAdditionalAdminEditorsLabel() {
        return '[data-name="course-administration-settings"] [data-name="editorIds"] [data-name="label"]'
    }

    getAdditionalAdminEditorsDes() {
        return '[data-name="course-administration-settings"] [data-name="editorIds"] [data-name="description"]'
    }

    getAdditionalAdminEditorsField() {
        return '[data-name="course-administration-settings"] [data-name="editorIds"] [data-name="field"]'
    }

    getCourseSettingsByMessagesBtn() {
        return '[class="_button_container_8vfwm_1"] > button[title="Messages"]'
    }

    getMessage() {
        return '[data-name="edit-course-bundle-messages-section"]'
    }

    getMessageLabel() {
        return '[class*="_header_"]'
    }

    getMessagetrashIcon() {
        return '[class*="_header_"] [class*="icon-trash"]'
    }

    getMessageCollapseIcon() {
        return '[class*="_header_"] [class*="icon-caret-up"]'
    }

    getSendEmailNotificationBtn() {
        return '[aria-label="Send email notification"]'
    }

    getSendEmailNotificationCheckBox() {
        return '[name="enabled"]'
    }

    getUseCustomTemplateLabel() {
        return '[data-name="isCustom"] [data-name="label"]'
    }

    getUseCustomTemplateDes() {
        return '[data-name="isCustom"] [data-name="description"]'
    }

    getUseCustomTemplateBtn() {
        return '[data-name="isCustom"] [aria-label="Use Custom Template"]'
    }

    getCourseSettingsByAttributesBtn() {
        return `[class="_button_container_8vfwm_1"] > button[title="Attributes"]`
    }

    getAttributes() {
        return '[data-name="edit-course-bundle-attributes-section"]'
    }

    getAttributesLabel() {
        return '[class*="_header_"]'
    }

    getAttributesTrash() {
        return '[class*="_header_"] [class*="icon-trash"]'
    }

    getAttributesCollapse() {
        return '[class*="_header_"] [class*="icon-caret-up"]'
    }

    getAudienceLabel() {
        return '[data-name="edit-course-metrics"] [data-name="audience"]'
    }

    getAudienceInput() {
        return '[data-name="edit-course-metrics"] [data-name="audience"] [aria-label="Audience"]'
    }

    getGoalsLabel() {
        return '[data-name="edit-course-metrics"] [data-name="goals"]'
    }

    getGoalsInput() {
        return '[data-name="edit-course-metrics"] [data-name="goals"] [aria-label="Goals"]'
    }

    getExternalIDLabel() {
        return '[data-name="edit-course-metrics"] [data-name="externalId"]'
    }

    getExternalIDInput() {
        return '[data-name="edit-course-metrics"] [data-name="externalId"] [aria-label="External ID"]'
    }

    getVendorLabel() {
        return '[data-name="edit-course-metrics"] [data-name="vendor"]'
    }

    getVendorInput() {
        return '[data-name="edit-course-metrics"] [data-name="vendor"] [aria-label="Vendor"]'
    }

    getCourseSettingsByMoreBtn() {
        return `[class="_button_container_8vfwm_1"] > button[title="More"]`
    }

    getMoreSection() {
        return '[data-name="edit-course-bundle-more-section"]'
    }

    getMoreTitle() {
        return '[class*="_header_"]'
    }

    getMoreTrash() {
        return '[class*="_header_"] [class*="icon-trash"]'
    }

    getMoreCollapse() {
        return '[class*="_header_"] [class*="icon-caret-up"]'
    }

    getCourseNoteLabel() {
        return '[data-name="course-notes"]'
    }

    getCourseNotesTextBox() {
        return '[data-name="course-notes"] [aria-label="Notes"]'
    }

    getRightMenuBtn() {
        cy.get('[class*="_context_menu_"] [class*="_child_"]').children().should(($child) => {
            expect($child).to.contain('Publish')
            expect($child).to.contain('Cancel')
            expect($child).to.contain('Quick Publish')
            expect($child).to.contain('View History')
        })
    }

    getViewHistoryBtn() {
        return '[data-name="view_history"]'
    }

    getHistoryTitle() {
        return 'h1[data-name="dialog-title"]'
    }

    getCloseModal() {
        return '[data-name="close"]'
    }

    getCancelBtn() {
        return '[data-name="cancel"]'
    }

    getModalOkButton() {
        return '[data-name="confirm"]'
    }

    getCourseSettingsEnrollmentBtn() {
        return `[class="_button_container_8vfwm_1"] > button[title="Enrollment Rules"]`
    }

    getAllowSelfEnrollmentRadioBtnClick() {
        cy.get('[aria-label="Allow Self Enrollment"] > [data-name="radio-button"]').contains("All Learners").click()
    }

    SearchForCourse(name) {
        cy.get('[title="Show filters"]').click()
        cy.get('[placeholder="Search Course Name"]').type(name)
        ARDashboardPage.getShortWait()
        cy.get('[class*="icon-arrow-right-go"]').click()
        ARDashboardPage.getMediumWait()
        cy.get('[class*="card-module__name"]').should('contain', name)
    }

    getRadioChecked() {
        return 'aria-checked'
    }

    getInactiveCourseNotification() {
        return '[aria-label="Courses"] [aria-label="Notification"]'
    }

    getDeleteCourseBtn() {
        return '[title="Delete Course"]'
    }

    removeCourseByName(name) {
        cy.get(this.getCourseName()).contains(name).parent().parent().within(()=> {
            cy.get(this.getDeleteCourseBtn()).click()
        })
        cy.get(this.getModalOkButton()).should('be.visible').click()
        cy.get(this.getModalOkButton()).should('not.exist')
    }
}

export const bundleCourseDefaults = {
    "AddCourseBundle": "Add Course Bundle",
    "General": "General",
    "TitleRequired": "Title (Required)",
    "CourseName": "Course Name",
    "Inactive": "Inactive",
    "Courses": "Courses",
    "NoCourseAdded": "No courses have been added.",
    "AddCourses": "Add Courses",
    "EnrollmentRules": "Enrollment Rules",
    "AllowSelfEnrollment": "Allow Self Enrollment",
    "Specific": "Specific",
    "AllLearners": "All Learners",
    "SelfEnrollmentDes": "Self enrollment for this course is off.",
    "EnableAutomaticEnrollment": "Enable Automatic Enrollment",
    "AutoEnrollmentDes": "Automatic enrollment for this course is off.",
    "AccessDate": "Access Date",
    "NoAccessDate": "No Access Date",
    "Expiration": "Expiration",
    "NoExpiration": "No Expiration",
    "TimeFromEnrollment": "Time from enrollment",
    "Date": "Date",
    "Prerequisites": "Prerequisites",
    "PrerequisitesDes": "This course has no prerequisites.",
    "AddPrerequisite": "Add Prerequisite",
    "CatalogVisibility": "Catalog Visibility",
    "Category": "Category",
    "ChooseCategory": "Choose Category",
    "Thumbnail": "Thumbnail 229 x 173px",
    "File": "File",
    "Url": "Url",
    "ChooseFile": "Choose File",
    "Posters": "Posters",
    "PostersDes": "There are no poster images for this course. (Maximum of 5 images total, 10 MB size limit per image)",
    "AddPoster": "Add Poster",
    "FeaturedCourse": "Featured Course",
    "FeaturedCourseDes": "Turning this option 'on' will make this course available within the featured area on the dashboard.",
    "EnableRecommendedCourses": "Enable Recommended Courses",
    "EnableRecommendedCoursesDes": "Turning this option 'on' will make course recommendations available that match the following tags for this course.",
    "CourseAdministrators": "Course Administrators",
    "CourseVisibility": "Course Visibility",
    "CourseVisibilityDes": "This course will be visible to all other administrator users",
    "AllAdmins": "All Admins",
    "Department": "Department",
    "PrimaryDepartmentEditor": "Primary Department Editor",
    "SelectDepartment": "Select Department",
    "SelectDepartmentDes": "Administrators who manage this department can edit this course if they have course visibility. If no department is selected, this applies to all Administrators.",
    "AdditionalAdminEditors": "Additional Admin Editors",
    "AdditionalAdminEditorsDes": "These administrators can edit this course if they have course visibility.",
    "Messages": "Messages",
    "UseCustomTemplate": "Use Custom Template",
    "UseCustomTemplateDes": "Default enrollment email will be sent to learners.",
    "Attributes": "Attributes",
    "Audience": "Audience",
    "Goals": "Goals",
    "ExternalID": "External ID",
    "Vendor": "Vendor",
    "More": "More",
    "Notes": "Notes",
    "CourseBundleHistory": "Course Bundle History",
}