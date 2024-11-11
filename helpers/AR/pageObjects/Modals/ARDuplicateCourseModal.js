import arBasePage from "../../ARBasePage"

export default new class ARDuplicateCourseModal extends arBasePage{

    getModalTitle() {
        return '[data-name="dialog-title"]'
    }

    getOKBtn() {
        return '[data-name="generic-prompt"] [data-name="confirm"]'
    }

    getDuplicatedPromptContent() {
        return '[data-name="prompt-content"]'
    }

    getCourseDuplicationInProgressModal() {
        return `[aria-describedby="course-duplication-in-progress-message"]`
    }

}