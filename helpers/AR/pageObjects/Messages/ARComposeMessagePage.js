import arBasePage from "../../ARBasePage"

export default new class ARComposeMessagePage extends arBasePage {
    getTitle() {        
        return this.getElementByDataNameAttribute('title');
    }

    getSubmitButton() {
        return this.getElementByDataNameAttribute('submit');
    }

    getSubjectLabel() {
        return this.getElementByDataNameAttribute('subject');
    }

    getSubjectEditBox() {
        return this.getElementByNameAttribute('subject');
    }

    getBodyLabel() {
        return this.getElementByDataNameAttribute('body');
    }

    getErrorMessage() {
        return this.getElementByDataNameAttribute('error');
    }

    getUsersSelector() {
        return this.getElementByDataNameAttribute('selection');
    }

    getUserDeselector() {
        return this.getElementByDataNameAttribute('deselect');
    }

    getUserDropdownOptions() {
        return this.getElementByDataNameAttribute('options');
    }
}