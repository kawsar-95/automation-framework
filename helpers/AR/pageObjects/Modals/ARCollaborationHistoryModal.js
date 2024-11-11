export default new class ARCollaborationHistoryModal {

    getHistoryContainer() {
        return '[class*="expandable-text-module__container"]'
    }

    getUserAssign() {
        return "UserCollaborationAssignment"
    }

    getGroupAssign() {
        return "GroupCollaborationAssignment"
    }

    getDepartmentAssign() {
        return "DepartmentCollaborationAssignment"
    }

    getCloseBtn() {
        return '[data-name="content"] [class*="icon icon-no"]'
    }

}