import { commonDetails } from "../../../TestData/Courses/commonDetails";
import ARBasePage from "../../ARBasePage";
import ARBillboardsAddEditPage from "../Billboards/ARBillboardsAddEditPage";
import { billboardsDetails } from "../../../TestData/Billboard/billboardsDetails";
import ARDashboardPage from "../Dashboard/ARDashboardPage";
import ARUploadFileModal from "./ARUploadFileModal";


export default new class ARFileManagerUploadsModal extends ARBasePage {


    getAddResourceBtn() {
        return `button[data-name="add-resource"]`
    }

    getChooseFileBtn() {
        return `button[data-name="select"]`
    }

    getModalHeader() {
        return `[data-name="dialog-title"]`
    }

    getImagePreviewDiv() {
        return `div[data-name="image-preview"]`
    }

    getPresentationDiv() {
        return `div[role="presentation"]`
    }



    getMediaLibraryCount() {
        return `[data-name="media-library-results-count"]`
    }

    getSortingFilesClick() {
        cy.get(this.getMediaLibraryCount()).parent().within(() => {
            cy.get(this.getSelection()).click()
        })
    }

    getSelection() {
        return `[data-name="selection"]`
    }

    getSelectionLabel() {
        return `span[data-name="label"]`
    }

    getOptionsList() {
        return `[data-name="options"]`
    }

    getListRoleOptions() {
        return `li[role="option"]`
    }

    getRoleOption() {
        return `[role="option"]`
    }

    getSortListItemsAndClickByName(value) {
        cy.get(this.getRoleOption()).eq(value).click()
    }


    getSortingFlyoutMenu() {
        cy.get(`[name="media-library-sort-select"]`).parent().parent().within(() => {
            cy.get(this.getOptionsList()).children().should(($child) => {
                expect($child).to.contain('Alphabetical');
                expect($child).to.contain('Date Added (Newest)');
                expect($child).to.contain('Date Added (Oldest)');
                expect($child).to.contain('Popular');
            })
        })
    }

    getFlyoutMenu() {
        return ` div[id="fallbackFocus"]`
    }

    getSortingOptionSelectClass() {
        return `[class*="_select_option_ledtw"]`
    }

    getSortingOptionsByIndexAndClick(index = 0) {
        cy.get(this.getFlyoutMenu()).within(() => {
            cy.get(this.getOptionsList()).within(() => {
                cy.get(this.getSortingOptionSelectClass()).eq(index).click()
            })
        })

    }

    getMediaLibrarySidebar() {
        return `div [id="media-library-sidebar"]`
    }

    getCoursesBlockFromSidebar() {
        return `div[data-name="Courses"]`
    }

    getTagsBlockFromSidebar() {
        return `div[data-name="Tags"]`
    }

    getFileTypesFromSidebar() {
        return `div[data-name="File Type"]`
    }

    getUploadTypeFromSidebar() {
        return `div[data-name="Upload Type"]`
    }

    getCoursesControlWrapper() {
        return `[data-name="control_wrapper"]`
    }


    getCheckboxGroup() {
        return `[data-name="checkbox-group"]`
    }

    getCourseInputField() {
        return `input[data-name="input"]`
    }

    getCourseResultsField() {
        return 'div[]'
    }


    getMediaLibraryViewBtn() {
        return `button[id="media-library-view-button"]`
    }

    getListViewBtn() {
        return `[data-name="list-view"]`
    }

    getGridViewBtn() {
        return `[data-name="grid-view"]`
    }

    getTableRow() {
        return `tbody > tr[class*="_list_item_"]`
    }

    getDateAddedField() {
        return `td[data-name="list-view-file-date"]`
    }

    getMediaLibraryFilterItems() {
        return `[data-name="media-library-filter-items"]`
    }

    getFilterItem() {
        return `[data-name="filter-item"]`
    }

    getFilterItemDeselectBtn() {
        return `button[data-name="filter-deselect-button"]`
    }

    getMediaLibrarySelectFileCircleBtn() {
        return '[data-name="media-library-item-actions"]'
    }

    getFilterItemFromValue(value = " ") {
        return cy.get(this.getFilterItem()).contains(value)
    }

    getFilterItemDeselectFromValueAndClickAndAsserting(value = " ", fileType = false) {
        this.getFilterItemFromValue(value).parent().within(() => {
            cy.get(this.getFilterItemDeselectBtn()).click();
        })

        cy.get(this.getMediaLibrarySidebar()).within(() => {
            if (fileType) {
                cy.get(this.getFileTypesFromSidebar()).within(() => {
                    cy.get(this.getCoursesControlWrapper()).within(() => {
                        cy.get(this.getCheckBoxClass()).contains(value).find('input').should('have.attr', 'aria-checked', 'false')

                    })
                })

            } else {
                cy.get(this.getUploadType()).within(() => {
                    cy.get(this.getCoursesControlWrapper()).within(() => {
                        cy.get(this.getCheckBoxClass()).contains(value).find('input').should('have.attr', 'aria-checked', 'false')

                    })
                })

            }

        })
    }

    getMaxSelectionLabel() {
        return `[class*="_max_selections_label_"]`;
    }

    getMediaLibraryModal() {
        return `[data-name="content"]`
    }

    getSelectionSpanLable() {
        return `[class*="_label_ledtw_62"]`
    }

    getUploadType() {
        return `[data-name="Upload Type"]`
    }

    getCheckBoxClass() {
        return `[class*="checkbox"]`
    }


    ClickSideBarMenuItemAndAssertingInFilterItems(value = " ", fileTypes = false) {
        cy.get(this.getMediaLibrarySidebar()).within(() => {
            if (fileTypes) {
                cy.get(this.getFileTypesFromSidebar()).within(() => {
                    cy.get(this.getCoursesControlWrapper()).within(() => {

                        cy.get(this.getCheckBoxClass()).contains(value).click()
                        cy.get(this.getCheckBoxClass()).contains(value).find('input').should('have.attr', 'aria-checked', 'true')

                    })
                })
            } else {
                cy.get(this.getUploadType()).within(() => {
                    cy.get(this.getCoursesControlWrapper()).within(() => {

                        cy.get(this.getCheckBoxClass()).contains(value).click()
                        cy.get(this.getCheckBoxClass()).contains(value).find('input').should('have.attr', 'aria-checked', 'true')

                    })
                })
            }
        })

        //Asserting in the filter modal
        cy.get(this.getMediaLibraryFilterItems()).within(() => {
            this.getFilterItemFromValue(value).should('have.text', value)
        })
    }

    FilterByCourseName(courseName = " ") {

        cy.get(this.getCoursesBlockFromSidebar()).within(() => {
            cy.get(this.getSelection()).click()
        })
        //Typing the course 
        cy.get(this.getFlyoutMenu()).within(() => {
            cy.get(this.getCourseInputField()).type(courseName)

            cy.get(this.getOptionsList()).within(() => {
                cy.get(this.getSelectionSpanLable()).contains(courseName).click({ force: true })
                this.getShortWait()
            })

        })

        //Asserting its on the filter options
        cy.get(this.getMediaLibraryFilterItems()).within(() => {
            this.getFilterItemFromValue(courseName).should('have.text', courseName).click({ force: true })
        })

    }

    getDialogues() {
        return `[data-name="dialogs"]`
    }

    getMediaLibraryApplyBtn() {
        return `[data-name="media-library-apply"]`
    }

    getCheckBoxGroupRole() {
        return `[data-name ="checkbox-group-role"]`
    }

    getDialoguesAsRole() {
        return `[role="dialog"]`
    }

    getModalNotification() {
        return `[aria-label="Notification"]`
    }

    getFileNameInput() {
        return `[data-name="newFileName"]`
    }

    getFileInputByArealable() {
        return `[aria-label="File Name"]`
    }

    getInputErrorFiled() {
        return `[data-name="error"]`
    }

    getLableByDataName() {
        return `[data-name="label"]`
    }

    getRenameModalApplyBtn() {
        return `[data-name="rename-file-button"]`
    }

    getRenameModalCancelBtn() {
        return `[data-name="cancel-rename-file-button"]`
    }

    getFileNameInPresentation() {
        return `[id="file-name"]`
    }

    getRenamedFileName() {
        let name = "GUIAFile" + commonDetails.timestamp;
        name = name.replace(/:/g, "-");
        name = name.replace("+", "-");
        return name;

    }

    //=========== Delete File Modal ====================//

    getUsageSection() {
        return `[class*="_usages_"]`
    }

    getSelectedFileLable() {
        return `[class*="_label_"]`
    }

    getSelectedFileInfoSection() {
        return `[class*="_file_info_"]`
    }

    getUsageSectionRole() {
        return `[role="listitem"]`
    }

    getUploadButton() {
        return `[data-name="media-library-file-upload"]`
    }

    getFileDeleteBtn() {
        return `[data-name="delete-file-button"]`
    }

    getUsageType() {
        return `[data-name="usage-type"]`
    }

    getDeleteModalCancelButton() {
        return `[data-name="cancel-delete-file-button"]`
    }

    getFileNameTobeDeleted() {
        return `[class*="_file_name_"]`
    }

    getUploadFileModalSaveBtn() {
        return '[class*="_modal_footer_"] [data-name="submit"]'
    }

    clickingOnFlyoutMenuByIndex(index = 0) {
        cy.get(this.getMediaLibraryModal()).within(() => {
            // hover over the images 
            cy.get(ARUploadFileModal.getMediaLibraryImagePreview()).first().parent().parent().within(() => {
                // asserting preview icon 
                cy.get(ARUploadFileModal.getPreview()).find('span').should('have.class', 'icon icon-eye')
                cy.get(ARUploadFileModal.getOption()).find('span').should('have.class', 'icon icon-ellipsis')
                cy.get(ARUploadFileModal.getOption()).invoke('show')
                ARDashboardPage.getShortWait()
                cy.get(ARUploadFileModal.getMediaLibraryFileMenuBtn()).invoke('show').click({ force: true })
            })
            //Clicking on the Preview button from flyout menu 
            cy.get(ARUploadFileModal.getMediaLibraryFileMenuBtn()).first().click()
            //clicking on the Rename button from flyout menu
            cy.get(this.getFlyoutMenu()).within(() => {
                //Asserting index item in the menu 
                cy.get(ARUploadFileModal.getMenuItem()).eq(index).click({ force: true })
                ARDashboardPage.getShortWait()
            })

        })
    }

    renameAndSelectUploadedFile(fileType,fileName,newName) {
        //Upload a file
        ARBillboardsAddEditPage.getBillBoardImageRadioBtn(fileType)
        cy.get(this.getChooseFileBtn()).click()
        cy.get(ARUploadFileModal.getMediaLibraryUploadBtn()).click()
        cy.get(ARUploadFileModal.getFilePathTxt()).attachFile(billboardsDetails.uploadPath)
        cy.get(ARUploadFileModal.getSaveBtn()).should('have.attr','aria-disabled','false').click()
        cy.get(this.getWaitSpinner(),{timeout:30000}).should('not.exist')
        //Rename the uploaded file
        cy.get(this.getChooseFileBtn()).click()
        cy.get(this.getFilterItemDeselectBtn()).click()
        cy.get(this.getSearchBar()).clear().type(fileName)
        cy.get(ARUploadFileModal.getMediaLibraryImagePreview()).should('be.visible')
        //Clicking on the Preview button from flyout menu 
       
        //Clicking on the Preview button from flyout menu 
        cy.get(this.getMediaLibrarySelectFileCircleBtn()).first().click({force:true})

        this.clickingOnFlyoutMenuByIndex(4)
        
        cy.get(this.getDialoguesAsRole()).last().within(() => {
           //Asserting modal header
           cy.get(this.getModalHeader()).should('have.text', "Rename File")
           //putting correct value 
           //Asserting Apply Button is not greyed out
           cy.get(this.getFileInputByArealable()).clear().type(newName)
           cy.get(this.getRenameModalApplyBtn()).should('have.attr', 'aria-disabled', 'false')
           //Clicking on the Apply button
           cy.get(this.getRenameModalApplyBtn()).click()
           cy.get(this.getWaitSpinner(),{timeout:30000}).should('not.exist')
        })
        //Select the renamed file
        cy.get(ARBillboardsAddEditPage.getFileMngrApplyBtn()).click({ force: true })
        cy.get(ARBillboardsAddEditPage.getBillboardNameTextF()).should('have.attr','value',`${newName}.jpg`)
    }

    //-------------- Search Bar ---------------//

    getSearchBar() {
        return `[data-name="media-library-search-input"]`
    }

    assertInFilteredOutSection(name = " ") {
        //Asserting its on the filter options
        cy.get(this.getMediaLibraryFilterItems()).within(() => {
            this.getFilterItemFromValue(name).should('have.text', name).click({ force: true })
        })
    }

    deselectFilteredOutSectionFromValue(value = "") {
        this.getFilterItemFromValue(value).parent().within(() => {
            cy.get(this.getFilterItemDeselectBtn()).click();
        })
    }

    getTagsDDownSelectOption() {
        return `[class*="_select_option_ledtw_1"]`
    }

    //-------------- Download Modal ---------------//

    getFileNameUsingId() {
        return `[id="file-name"]`
    }

}


export const fileTypes = {
    "image": "Image",
    "video": "Video",
    "pdf": "PDF",
    "word": "Word",
    "excel": "Excel",
    "other": "Other",
    "powerPoint": "PowerPoint"
}

export const uploadTypes = {
    "Billboards": "Billboards",
    "Certificates": "Certificates",
    "Competencies": "Competencies",
    "Department Templates": "Department Templates",
    "Descriptions": "Descriptions",
    "Lessons": "Lessons",
    "News Articles": "News Articles",
    "Posters": "Posters",
    "Question Banks": "Question Banks",
    "Resources": "Resources",
    "Thumbnails": "Thumbnails"
}
