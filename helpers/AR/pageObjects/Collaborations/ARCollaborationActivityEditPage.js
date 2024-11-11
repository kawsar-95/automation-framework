import arBasePage from "../../ARBasePage";
import ARDashboardPage from "../Dashboard/ARDashboardPage";


export default new class ARCollaborationActivityEditPage extends arBasePage {

    //----- Details Section -----//

    getPostedBy() {
        return 'postedBy'
    }

    getPostedOn() {
        return 'postedOn'
    }

    getPostedIn() {
        return 'postedIn'
    }

    getPostType() {
        return 'postType'
    }

    getPostStatus() {
        return '[data-name="collaboration-activity-status"]'
    }


    //----- Content Section -----//

    getSummaryTxtF() {
        return '[data-name="title"] [class*="_text_input"]'
    }

    getSummaryErrorMsg() {
        return '[data-name="collaboration-activity-content-section"] [data-name="title"] [data-name="error"]'
    }

    getDescriptionTxtF() {
        return '[data-name="description"] [class*="fr-element fr-view"]'
    }

    getDescriptionErrorMsg() {
       return '[data-name="collaboration-activity-content-section"] [data-name="description"] [data-name="error"]';
    }

    getReplyTxtF() {
        return '[data-name="edit-collaboration-activity-content"] [data-name="description"] textarea[aria-label="Reply"]'
    }

    getAttachmentsSectionLabel() {
        return '[class*="collaboration-activity-attachments-module__label"]'
    }

    getAttachmentContainer(index = 1) {
        return `[class*="collaboration-activity-attachments-module__attachment"]:nth-of-type(${index})`
    }

    getAttachmentFilePreview() {
        return `[data-name="edit-collaboration-activity-content"] [aria-label="Preview Image"]`
    }

    getAttachmentFileImage() {
        return `[class*="_image_or_icon_"]`
    }

    getAttachmentDeleteBtn() {
        return '[class*="icon icon-trash"]'
    }

    getDeleteAttachmentByIndex(index = 1) {
        cy.get(this.getAttachmentContainer(index)).within(() => {
            cy.get(this.getAttachmentDeleteBtn()).click()
        })
    }

   getDeleteAttachmentBtn() {
    return `[data-name="edit-collaboration-activity-content"] button[aria-label="Delete"]`
   } 


    //----- Reports Section -----//

    getMarkAllAsReviewedBtnThenClick() {
        cy.get('[data-name="edit-collaboration-activity-flags"] button').contains('Mark All as Reviewed').click()
    }

    getReportTable() {
        return '[data-name="edit-collaboration-activity-flags"] [class*="_table_"]'
    }

    getReportContainer() {
        return '[class*="collaboration-activity-flag-module"]'
    }

    getReportedBy() {
       return '[data-name="flagged-by"][class*="_flagged_by_col_"]'
    }

    getReportedOn() {
        return '[data-name="flagged-on"][class*="_flagged_on_col_"]'
    }

    getStatus() {
        return '[data-name="status"][class*="_status_col_"]'
    }

    getReason() {
        return "reason" //data-name
    }

    //Used to verify a row in the report table (index starts at 1 for top row)
    getVerifyReportContent(index, name, date, status, reason) {
        cy.get(this.getReportTable()).find('tr').eq(index).within(() => {
            cy.get(this.getReportedBy()).should('contain', name)
            this.getShortWait()
            cy.get(this.getReportedOn()).should('contain', date)
            this.getShortWait()
            cy.get(this.getStatus()).should('contain', status)
            cy.get(this.getElementByDataNameAttribute(this.getReason())).should('contain', reason)
        })
    }


    //----- Notes Section -----//

    getNotesTxtF() {
        return 'textarea[aria-label="Add Note"]'
    }

    getNotesErrorMsg() {
        return 'form[data-name="edit-collaboration-activity-notes-content"]  div[data-name="error"]'
    }

    getNoteContainer() {
        return 'div[data-name="collaboration-activity-notes-section"]'
    }

    getNoteContent() {
        return '[class*="collaboration-activity-note-module__content"]'
    }

    getNoteDeleteBtn() {
        return '[class*="icon icon-trash"]'
    }

    getNoteDeleteUndoBtn() {
        return '[class*="icon icon-undo"]'
    }

    getNotePendingDeleteIcon() {
        // return '[class*="collaboration-activity-note-module__pending_delete"]'
        return 'div[data-name="pending-delete"]'
    }

    getDeleteNoteByContentAndUndo(content) {

        cy.get(this.getNoteContainer()).find('div[role="list"]').within(() => {
            cy.get('div[role="listitem"]').each(($listItem, index) => {
                cy.get(this.getNoteDeleteBtn()).click()
                ARDashboardPage.getShortWait()
                cy.get(this.getNotePendingDeleteIcon()).should('exist')
                cy.get(this.getNoteDeleteUndoBtn()).click()
                ARDashboardPage.getShortWait()
                cy.get(this.getNotePendingDeleteIcon()).should('not.exist')
                cy.get('div[class*="content"]').contains(content).should('exist')
            })

        })
    }

    getDeleteNoteByContentAndConfirmDelete(content) {

        cy.get(this.getNoteContainer()).find('div[role="list"]').within(() => {
            cy.get('div[role="listitem"]').each(($listItem, index) => {
                cy.get('div[class*="content"]').contains(content).should('exist')
                cy.get(this.getNoteDeleteBtn()).click()
                ARDashboardPage.getShortWait()
            })

        })
    }

    getDeleteNoteByContentAndConfirmDeleteBtnNotExist(content) {

        cy.get(this.getNoteContainer()).find('div[role="list"]').within(() => {
            cy.get('div[role="listitem"]').each(($listItem, index) => {
                cy.get('div[class*="content"]').contains(content).should('exist')
                cy.get(this.getNoteDeleteBtn()).should('not.exist')
                ARDashboardPage.getShortWait()
            })

        })

    }


    getPastNotesExist(content) {

        cy.get(this.getNoteContainer()).find('div[role="list"]').within(() => {
            cy.get('div[role="listitem"]').each(($listItem, index) => {
                cy.get('div[class*="content"]').contains(content).should('exist')

            })

        })

    }

    getPastNotesDoesNotExist(content) {

        cy.get(this.getNoteContainer()).find('div[role="list"]').within(() => {
            cy.get('div[role="listitem"]').each(($listItem, index) => {
                cy.get('div[class*="content"]').contains(content).should('not.exist')

            })

        })

    }

    getPastNotesOrdersByRecnetToOldest(adminsandnotes) {


        cy.get(this.getNoteContainer()).find('div[role="list"]').within(() => {
            cy.get('div[role="listitem"]').each(($listItem, index) => {
                cy.get('span[class*="author"]').contains(adminsandnotes[index].name).should('exist')
                cy.get('div[class*="content"]').contains(adminsandnotes[index].note).should('exist')

            })

        })
    }

    getRightMenuCancelBtn() {
        cy.get('span[class*="icon icon-no"]').click()
    }


    getAddCollaborationBtn() {
        return 'button[data-name="create-collaboration-context-button"]'
    }

    getEditActivityBtn() {
        return 'button[data-name="edit-collaboration-activity-context-button"]'
    }

    getDeleteEditActivityBtn() {
        return 'button[data-name="delete-collaboration-activity-context-button"]'
    }

    //this filter is added here because it needs little bit different logic 
    AddFilter(propertyName, Operator = null, Value = null) {
        if (Value == null) {
            cy.get(this.getAddFilterBtn()).click();
            cy.get(this.getPropertyName() + this.getDDownField()).eq(0).click();
            cy.get(this.getPropertyNameDDownSearchTxtF()).type(propertyName)
            cy.get(this.getSelectedPropertyNameOpt()).contains(new RegExp("^" + propertyName + "$", "g")).click()
            cy.get(this.getOperator() + this.getDDownField()).eq(1).click();
            cy.get(this.getOperatorDDownOpt()).contains(Operator).click({ force: true });
            cy.get(this.getSubmitAddFilterBtn()).click();
        } else if (Value != null && Operator == null) {
            cy.get(this.getAddFilterBtn()).click();
            cy.get(this.getPropertyName() + this.getDDownField()).click();
            cy.get(this.getPropertyNameDDownSearchTxtF()).type(propertyName)
            cy.get(this.getPropertyNameDDownOpt()).contains(new RegExp("^" + propertyName + "$", "g")).click()
            cy.get(this.getElementByAriaLabelAttribute(this.getValueTxt())).type(Value)
            cy.get(this.getSubmitAddFilterBtn()).click();
            cy.get(this.getWaitSpinner(), { timeout: 20000 }).should('not.exist')
        }
        else {
            cy.get(this.getAddFilterBtn()).click();
            cy.get(this.getPropertyName() + this.getDDownField()).eq(0).click();
            cy.get(this.getPropertyNameDDownSearchTxtF()).type(propertyName)
            cy.get(this.getPropertyNameDDownOpt()).contains(new RegExp("^" + propertyName + "$", "g")).click()
            cy.get(this.getOperator() + this.getDDownField()).eq(1).click();
            cy.get(this.getOperatorSearchTxtF()).type(Operator);
            cy.get(this.getOperatorDDownOpt()).contains(Operator).click();
            if (propertyName.includes('Date')) {
                cy.get(this.getElementByAriaLabelAttribute(this.getDateF()) + ' ' + this.getFilterDatePickerBtn()).click()
                this.getSelectDate(Value)
            } else if(propertyName.includes('Department')){
                cy.get(this.getElementByAriaLabelAttribute(this.getDepartmentF())).click()
                cy.get(this.getSelectDeptToggleBtn()).click()
                cy.get(this.getDeptDDown()).contains(Value).click()
                cy.get(this.getSubmitDeptBtn()).contains('Choose').click()
            }
            else {
                cy.get(this.getElementByAriaLabelAttribute(this.getValueTxt())).type(Value)
            }
            cy.get(this.getSubmitAddFilterBtn()).click();
            cy.get(this.getWaitSpinner(), { timeout: 20000 }).should('not.exist')
        }
    }


}