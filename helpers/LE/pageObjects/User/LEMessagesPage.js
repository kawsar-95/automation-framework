import LEBasePage from '../../LEBasePage'

export default new class MessagesPage extends LEBasePage {

    getMessagesPageTitle() {
        return `[class*="banner-title-module__title"]`;
    }

    getConversations(tabIndex=1) {
        return `div:nth-of-type(${tabIndex}) > [class*="my-inbox-module__tab"]`;
    }

    getInboxContainer() {
        return '[class*="my-inbox-module__wrapper"]'
    }

    getConversationContainer() {
        return '[class*="conversation-summary__conversation"]'
    }

    getReadConversationContainer() {
        return '[class*="conversation-summary-module__conversation_read"]'
    }

    getLearnername() {
        return '[class*="conversation-summary__recipient_name"]'
    }

    getMessagePreview() {
        return '[class*="conversation-summary-module__body"]'
    }

    getConversationDate() {
        return '[class*="conversation-summary__date"]'
    }

    getMarkAllReadBtn() {
        return '[class*="my-inbox-module__mark_all_btn"]'
    }

    //Pass the sender's first and last name to open the conversation
    getConversationByLearnerName(fName, lName) {
        cy.get(this.getLearnername()).contains(fName + ' ' + lName).click({force:true})
    }

    getLoadMoreBtn() {
        return '[class*="page-size-button__btn"]'
    }


}