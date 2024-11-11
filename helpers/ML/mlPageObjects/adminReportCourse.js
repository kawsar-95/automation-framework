
export default new class adminReportCourse {

    reportCourseTableContainer() {
        return `[class*="grid"]`;
    }

    toggleAutomaticTagging() {
        return `[data-name="allowAutoTagging"]`;
    }

    courseEnableActive() {
        return `[data-name="disable-label"]`;
    }

    catalogVisibilityThumbnailPreview() {
        return '[class*="_image_preview"]';
    }
    
    btnChooseFile() {
        return `[data-name="select"][class*="_choose"]`;
    }

    btnApply() {
        return `[data-name="save"]`;
    }

    btnUnenrollOK() {
        return `[data-name="confirm"]`;
    }

}