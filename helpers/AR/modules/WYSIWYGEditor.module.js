import ARBasePage from "../ARBasePage";

export default new class WYSIWYGEditor extends ARBasePage {

    getOrderedListTooleBtn() {
        return 'div[data-name="body"] button[title="Ordered List"][data-cmd="formatOL"]'
    }
    
    getEditorToolbar() {
        return 'div[data-name="body"] [class*="fr-toolbar"]'
    }

    getOrderedList() {
        return 'div[data-name="body"] ol'
    }

    getInsertHyperLinkToolBtn(container = null) {
        if (container != null) {
            return `${container} button[data-cmd="insertLink"]`
        }
        return 'button[data-cmd="insertLink"]'
    }

    getInsertHyperLinkInput() {
        return 'input[id="fr-link-insert-layer-url-1"]'
    }

    getInsertHyperLinkBtn() {
        return 'button[data-cmd="linkInsert"]'
    }

    getMoreMiscToolBtn() {
        return 'button[data-cmd="moreMisc"]'
    }

    getInsertImageLinkToolBtn() {
        return 'button[id*="insertImage-"]'
    }

    getHyperTextLink() {
        return 'div[data-name="body"] a'
    }

    getInsertImageLinkInput() {
        return '[id*="fr-image-by-url-layer-text-"]'
    }

    getInsertImageLinkBtn() {
        return 'button[data-cmd="imageInsertByURL"]'
    }

    getImageLink() {
        return 'div[data-name="body"] img'
    }

    getHtmlCodeViewToolBtn() {
        return 'button[data-cmd="html"]'
    }

    getHtmlCodeEditor() {
        return 'textarea[class="fr-code"]'
    }

    getHeader1Text() {
        return 'div[data-name="body"] h1'
    }

    // General
    getRichTextBody(container) {
        return `${container} ${this.getWSIWYGTxtF()}`
    }

    getOrderedListBtn(container) {
        return `${container} button[title="Ordered List"][data-cmd="formatOL"]`
    }

    getHyperLinkInput() {
        return 'input[class="fr-link-attr"][tabindex="1"]'
    }
}