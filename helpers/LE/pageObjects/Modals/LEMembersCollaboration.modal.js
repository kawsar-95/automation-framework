import leBasePage from '../../LEBasePage'

export default new class LEMembersCollaborationModal extends leBasePage {

    getMemberSearch() {
        return "learner-search-box";
    }
    
    getMembersTable() {
        return '[class*="sortable-table__table"]'
    }

    getMemberContainer() {
        return '[class*="table-row-module__table_row___"]'
    }

    getMemberName() {
        return '[class*="social-profile-link-module__link"]'
    }

    getMemberAvatar() {
        return '[class*="collaboration-members-modal-module__avatar"]'
    }

    getViewProfileBtn() {
        return '[class*="profile-link-module__link_text___"]'
    }

    getLoadMoreBtn() {
        return '[class*="inline-modal-container-module__container"] [class*="page-size-button__btn"]'
    }

    getModalCloseBtn() {
        return '[class*="icon icon-x-thin"]'
    }

}