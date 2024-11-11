import LEBasePage from '../../LEBasePage'

export default new class LEMessagesMenu extends LEBasePage {

    getConversationsExpandedSection() {
        return '[class*="messages-menu__panel_content"]'
    }

    getMessageContainer() {
        return '[class*="messages-menu__conversation_item"]'
    }
   
    getViewAllMessagesBtn() {
        return '[class*="link-button-module__link"]'
    }

    getConversationContainer() {
        return '[class*="messages-menu__message_item messages-menu__conversation_item"]'
    }

    getConversationMessagesContainer() {
        return `[class*="conversation-summary-module__conversation__"]`
    }

    getConversationLearnerName() {
        return '[class*="messages-menu__conversation_recipient"]'
    }

    getDismissMessageBtn() {
        return '[class*="messages-menu__dismiss_btn"]'
    }

    getNoConversations(){
        return '[class*="messages-menu__no_messages"]'
    }

    // Added for TC# C1079
    getMessageMenuBtn() {
        return 'button[title="Messages"]'
    }

    getAllMessagesContainer() {
        return 'div[class*="menu-module__menu__"]'
    }

    getPriorityMessagesLinkBtn() {
        return 'button[class*="messages-menu__panel_priority"]'
    }

    getMessagesMenuMessageItem(){
        return `[class*="messages-menu__message_item"]`
    }

    getMessageSubjectByTitle($title) {
        return `p[title="${$title}"]`
    }
}