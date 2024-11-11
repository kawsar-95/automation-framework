import arBasePage from "../../../ARBasePage"

export default new class ARCURREditActivityPage extends arBasePage {

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


}