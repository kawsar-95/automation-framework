import leBasePage from '../../LEBasePage'

export default new class LEChatOnTeamsModal extends leBasePage {

    getModalHeader() {
        return '[class*="collaboration-members-chat-on-teams-modal-module__title"]'
    }
    
    getMembersDDown() {
        return '[class*="t-placeholder"]'
    }

    getMembersSearchTxtF() {
        return '[class*="t-input"]'
    }

    getClearBtn() {
        return '[class*="icon icon-x"]'
    }

    getMembersOpt(memberName) {
       cy.get('[class*="collaboration-members-chat-on-teams-select-option-module__label"]').contains(memberName).click({force:true})
    }

    getMembersList() {
        return '[class*="t-select_list"]'
    }

    getMemberContainer() {
        return '[class*="t-option"]'
    }

    getSelectedMembersContainer() {
        return '[class*="collaboration-members-chat-on-teams-modal-module__container"]'
    }

    getSelectedMemberPill() {
        return '[class*="collaboration-members-chat-on-teams-selected-value-module__label"]'
    }

    getPillClearBtn() {
        return '[class*="icon icon-x-thin"]'
    }

    getStartChatBtn() {
        return '[class*="collaboration-members-chat-on-teams-modal-module__start_chat_button"]'
    }

    getCancelBtn() {
        return '[class*="collaboration-members-chat-on-teams-modal-module__cancel_button"]'
    }

}