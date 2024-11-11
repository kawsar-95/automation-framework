import arBasePage from "../../ARBasePage"

export default new class ARMessagesPage extends arBasePage {
    getTitle() {
        return  this.getElementByDataNameAttribute('title');
    }

    getComposeMessageButton() {
        return this.getElementByDataNameAttribute('compose-message-context-button');
    }
}