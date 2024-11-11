import arBasePage from "../../../ARBasePage"

export default new class AROCEditActivityPage extends arBasePage {

    //----- Credits Section -----//

    getCreditTypesContainer() {
        return '[class*="edit-online-course-enrollment-activity-module__credit_types"]'
    }

    getCreditContainer() {
        return '[class*="edit-online-course-enrollment-activity-module__credit_type_control"]'
    }

    getCreditTxtF() {
        return '[class*="number-input-module__input"]'
    }


}