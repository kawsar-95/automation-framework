import ARBasePage from "../../ARBasePage"

export default new (class ARFilesPage extends ARBasePage {
    getFileManagerModal() {
        return 'div[id="file-manager"][class="modal"]'
    }

    getFileBrowserToolBar() {
        return 'div[class="tools"]'
    }

    getFielPreviewIcon() {
        return 'a[class*="preview"]'
    }

    getFielDeleteIcon() {
        return 'a[class*="delete"]'
    }

    getFileDownloadBtn() {
        return 'span[data-bind="text: absorb.data.terms.Download"]'
    }

    getSubFolder(subFolderName) {
        return `td[class*="sub-directory"]:contains(${subFolderName}) > span`
    }

    getFileList() {
        return 'table > tbody > tr > td[class="file-name"]'
    }

    getFileBrowserFooter() {
        return 'div[class="footer"]'
    }

    getSetupOption() {
        return 'li[title="Setup"]'
    }

    getFilesMenuitem() {
        return 'span[class*="icon-folders"]'
    }

    getDownloadBtnContainer() {
        return 'a[class*="success"]'
    }

    // Added for TC # C6318
    getFilFolderSearchContainer() {
        return 'div[class="search-input"]'
    }

    getFolderList() {
        return 'table > tbody > tr > td[class="file-name sub-directory"]'
    }

    getFolderDeleteBtn() {
        return '[class="folder-browser browser"] [class="tools"] [class="btn border has-icon-only delete"]'
    }

    // Added for TC# C6317
    getFileDeleteBtn() {
        return '[class="file-browser browser"] [data-bind*="hidden"] [class="tools"] [class="btn border has-icon-only delete"]'
    }

    getHeaderElement() {
        return '[class="header"]'
    }
})