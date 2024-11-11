import leBasePage from '../../LEBasePage'

export default new class LEConversationsModal extends leBasePage {

    getModalHeader() {
        return '[class*="conversation-module__header"]';
    }

    getModalErrorBanner() {
        return '[class*="conversation__error_message_text"]';
    }
    
    getMessageTxtF(){
        return '[class*="conversation-footer-module__message_input___"]';
    }

    getMessageSendBtn() {
        return '[class*="send_message_btn"]';
    }

    getErrorMsg() {
        return '[class*="conversation-footer__too_many_characters"]';
    }

    getMessageList() {
        return '[class*="conversation-messages-module__message_list"]';
    }

    getMessageContainer() {
        return '[class*="conversation-message-module__container"]';
    }

    getMessageAvatar() {
        return '[class*="conversation-message-module__avatar"]';
    }

    getMessageAuthor() {
        return '[class*="conversation-message-module__name"]';
    }

    getMessageDate() {
        return '[class*="conversation-message-module__sent"]';
    }

    getMessageContent() {
        return '[class*="conversation-message-module__message"]';
    }

    getModalCloseBtn() {
        return '[class*="conversation-footer__close_btn"]';
    }

    //Pass a message that should be in the conversation modal to verify it exists
    getVerifyMessageExists(msg) {
        cy.get('[class*="conversation-messages-module__message_list"]').within(() => {
            cy.get('[class*="conversation-messages-module__message_item"]').should('contain', msg)
        })
    }

    //Send a message via API - pass the sender's username & password, and the recipient's userID
    sendMessageViaAPI(username, password, message, recipientID) {
        cy.apiAuth(username, password).then((response) => {
            const token = response.body.token
            cy.request({
                method: "POST",
                url: `/api/rest/v2/messages`,
                headers: {
                    Authorization: `Bearer ${token}`,
                    "X-Absorb-API-Key": Cypress.env('api_Key'),
                },
                body: {
                    message: message,
                    recipientId: recipientID,
                },
            }).then((response) => {
                expect(response.status).to.eql(201);
            })
        })
    }

}