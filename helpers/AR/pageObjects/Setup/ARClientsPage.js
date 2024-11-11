import ARBasePage from "../../ARBasePage";

export default new class ARClientsPage extends ARBasePage {


getClientsFilterBtn(){
    return '[data-bind*="click: ToggleFilterPicker"]'
}

getActionMenuItems(){
    return '[id="sidebar-content"]'
}

getConfirmationBtn(){
    return '[class="btn has-icon warning"]'
}

getClientTableColumns(){
    return '[class="preserve-whitespaces"]'
}

}