import leBasePage from '../../LEBasePage'

export default new class LECreateCollaborationPostModal extends leBasePage {

    getModalTitle() {
        return '[class*="collaboration-post-modal-module__header"]'
    }
    
    getPostTypeLabel() {
        return '[class*="post-type-tab-module__type_label"]'
    }
    
    getSummaryTxtF() {
        return '[data-name="title"] input[name="title"]'
    }
    
    getEditPostSummaryTxtF() {
        return '[data-name="title"] [name="title"]'
    }

    getSummaryErrorMsg() {
        return '[data-name="title"] [class*="field-error-module__field_error"]'
    }

    getDescriptionTxtF() {
        return '[data-name="description"] div[class*="fr-element fr-view"]'
    }

    getDescriptionErrorMsg() {
        return '[data-name="description"] [class*="field-error-module__field_error"]'
    }

    getBrowseBtn() {
        return '[class*="drop-zone-module__drop_zone"]'
    }

    getAttachmentName() {
        return '[class*="file-chip-module__name"]'
    }

    getAttachmentContainer() {
        return '[class*="file-chip-module__file_chip"]'
    }

    getDeleteAttachmentByName(name) {
        cy.get(this.getAttachmentName()).contains(name).parents(this.getAttachmentContainer()).within(() => {
            cy.get('[class*="icon icon-trashcan"]').click()
        })
    }

    getPostInDDown() {
        return 'idOfCollaborationToPostIn'; //'name' attr
    }

    getCreatePostBtn() {
        return '[type="submit"]'
    }

    getCancelBtn() {
        return '[class*="button-module__cancel"]'
    }

    getModalCloseBtn() {
        return '[class*="icon icon-x-thin"]'
    }

    getInnerModal(){
        return '[class*="inline-modal-container-module__modal_container"]'
    }

    getCreatePostModalSpinner() {
        return `[class*="button-module__loader__"]`
    }
}