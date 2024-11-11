import ARBasePage from "../../ARBasePage";
import ARDashboardPage from "../Dashboard/ARDashboardPage";

export default new class ARTemplatesPage extends ARBasePage {
    getTemplateAddbutton() {
        return `[data-bind*="enable: addButtonEnabled, click: add"]`
    }
}