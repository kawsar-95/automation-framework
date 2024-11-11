


export default new class ARFileManagerReplaceModal {

    getUsagesSection () {
        return `[data-name="file-usages"]`
    }

    getNumberByDataName () {
        return `[data-name="number"]`
    }

    getNameByDataName () { 
        return `[data-name="name"]`
    }

    getUsageTypeByDataName () { 
        return `[data-name="usage-type"]`
    }

    getSelectedFileWrapper() {
        return `[class*="_selected_file_wrapper_"]`
    }

    getReplaceFileBtn() {
        return `[data-name="replace-file-button"]`
    }

    getCancelReplaceFileBtn() {
        return `[data-name="cancel-replace-file-button"]`
    }

    getDeleteFileBtn() {
        return `[aria-label="Remove"]`
     }

}