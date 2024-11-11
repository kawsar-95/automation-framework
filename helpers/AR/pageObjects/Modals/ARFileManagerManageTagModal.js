import ARDashboardPage from "../Dashboard/ARDashboardPage";
import ARFileManagerUploadsModal from "./ARFileManagerUploadsModal";

export default new class ARFileManagerManageTagModal {

    getApplyBtn() {
        return `[data-name="submit-tag-button"]`
    }

    getCancelBtn() {
        return `[data-name="cancel-tag-button"]`
    }

    getTagsSection() {
        return `[data-name="tags"]`
    }

    getSelectionSection() {
        return `[data-name="selection"]`
    }

    getControlWrapper() {
        return `[data-name="control_wrapper"]`
    }

    getTagsFiled() {
        return `[data-name="field"]`
    }

    getTagsInputFiled() {
        //return `input [name="tags"] `
        return `._search_7teu8_76 > ._input_7teu8_86`
    }

    getSelectedClassName() {
        return `_selected_ledtw_67`
    }

    FilterByTagName(tagName = " ") {

        //Typing the tag 
        cy.get(ARFileManagerUploadsModal.getFlyoutMenu()).within(() => {
            cy.get(this.getTagsInputFiled()).type(tagName)
            ARDashboardPage.getShortWait()
            cy.get(ARFileManagerUploadsModal.getOptionsList()).within(() => {
                cy.get(ARFileManagerUploadsModal.getSelectionSpanLable()).contains(tagName).click({ force: true })
                ARDashboardPage.getShortWait()
            })
        })

        //Asserting its on the filter options
        // cy.get(this.getMediaLibraryFilterItems()).within(() => {
        //     this.getFilterItemFromValue(courseName).should('have.text', courseName).click({ force: true })
        // })

    }

    TypingInTagInputFieldToCreate(tagName = "") {
        cy.get(ARFileManagerUploadsModal.getFlyoutMenu()).within(() => {
            cy.get(this.getTagsInputFiled()).type(tagName)
            ARDashboardPage.getShortWait()
            cy.get(this.getTagFooterContent()).within(() => {
                cy.get(this.getCreateTagBtnInFooter()).click()
            })

        })

        
    }

    //This method works in the Manage Tags 
    AssertingFilteredOutTagSelectedInDropDown(tagName = " ") {
        //Clicking on the Tags Lable 
        cy.get(ARFileManagerUploadsModal.getDialogues()).within(() => {
            cy.get(ARFileManagerUploadsModal.getDialoguesAsRole()).last().within(() => {
                //Asserting modal header
                cy.get(ARFileManagerUploadsModal.getModalHeader()).click()
                ARDashboardPage.getShortWait()
                //Clicking on Tags lable 
                cy.get(this.getControlWrapper()).within(() => {
                    cy.get(this.getTagsFiled()).click()
                })
            })
        })
        //Asserting that filtered out tag name is selected in the dropdown
        cy.get(ARFileManagerUploadsModal.getFlyoutMenu()).within(() => {
            cy.get(this.getTagsInputFiled()).type(tagName)
            ARDashboardPage.getShortWait()
            cy.get(ARFileManagerUploadsModal.getOptionsList()).within(() => {
                cy.get(ARFileManagerUploadsModal.getSelectionSpanLable()).contains(tagName).parent().should('have.class', this.getSelectedClassName())
                ARDashboardPage.getShortWait()
            })
        })
    }

    AssertingTagChicletIsPresent(tagName = "") {

        //Clicking on the Tags Lable 
        cy.get(ARFileManagerUploadsModal.getDialogues()).within(() => {
            cy.get(ARFileManagerUploadsModal.getDialoguesAsRole()).last().within(() => {
                //Asserting modal header
                cy.get(ARFileManagerUploadsModal.getModalHeader()).click()
                ARDashboardPage.getShortWait()
                //Clicking on Tags lable 
                cy.get(this.getControlWrapper()).within(() => {
                    cy.get(this.getSelectionSection()).within(() => {
                        this.getTagItemFromValue(tagName).should('have.text', tagName).click({ force: true })

                    })
                })
            })
        })

    }

    ClickingOnChicletDeselectTagBtn(tagName = " ") {
        cy.get(ARFileManagerUploadsModal.getDialogues()).within(() => {
            cy.get(ARFileManagerUploadsModal.getDialoguesAsRole()).last().within(() => {
                //Asserting modal header
                cy.get(ARFileManagerUploadsModal.getModalHeader()).click()
                ARDashboardPage.getShortWait()
                //Clicking on Tags lable 
                cy.get(this.getControlWrapper()).within(() => {
                    cy.get(this.getSelectionSection()).within(() => {
                        this.getTagItemFromValue(tagName).parent().within(() => {
                            cy.get(this.getDeselectButton()).click()
                        })

                    })
                })
            })
        })

    }

    getDeselectButton() {
        return `[data-name="deselect"]`
    }

    clickinOnTheTagsField() {

        cy.get(ARFileManagerUploadsModal.getDialogues()).within(() => {
            cy.get(ARFileManagerUploadsModal.getDialoguesAsRole()).last().within(() => {
                //Asserting modal header
                cy.get(ARFileManagerUploadsModal.getModalHeader()).should('have.text', "Manage Tags")
                //Clicking on tags field 
                cy.get(this.getControlWrapper()).within(() => {
                    cy.get(this.getTagsFiled()).contains('Choose').click({ force: true })
                })

            })

        })
    }


    getTagItemFromValue(value = " ") {
        return cy.get(this.getFilterItem()).contains(value)
    }

    getFilterItem() {
        return `[data-name="label"]`
    }

    getTagFooterContent() {
        return `[data-name="auto-tag-footer"]`
    }

    getCreateTagBtnInFooter() {
        return `[data-name="create-tag"]`
    }

    getCreateTagMessage() {
        return `Tag has been created.`
    }

    getTagDeleteBtnInReportPage() {
        return `[data-name="delete-tag-single-context-button"]`
    }

    getDeleteTagModalInReportPage() {
        return `[data-name="delete-tag-prompt"]`
    }

    getDeleteBtn() {
        return `[data-name="confirm"]`
    }

    


}

