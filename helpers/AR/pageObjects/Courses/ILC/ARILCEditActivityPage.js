import arBasePage from "../../../ARBasePage"

export default new class ARILCEditActivityPage extends arBasePage {

    //----- Learner Information Section -----//

    getUsernameF() {
        return "username"
    }
    
    //----- Completion Section -----//

    getMarkAsRadioBtn() {
        return '[data-name="status"] [data-name="label"]';
    }

    getMarkAsCompleteRadioBtn() {
        return '[data-name="status"] [data-name="radio-button-Complete"]';
    }
    

    //----- Credits Section -----//

    getCreditTypesContainer() {
        return '[class*="_credit_types"]'
    }

    getCreditContainer() {
        return '[class*="_credit_type_control"]'
    }

    getCreditTxtF() {
        return 'input[class*="_input"]'
    }


    //----- Session Attendance Section -----//

    getAttendanceToggleContainer() {
        return '[data-name="mark-attendance-toggle"]'
    }

    getSessionSectionContent() {
        return 'div[data-name="session-enrollment-attendances"]'
    }

}