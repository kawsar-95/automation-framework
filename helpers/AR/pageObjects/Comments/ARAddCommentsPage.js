import arBasePage from "../../ARBasePage";

export default new class ARAddCommentPage extends arBasePage {
    
    getCourseTextBoxSelection(){
        return '#select2-chosen-4'
    }
    getCourseFromDropDown(){
        return 'ul[role="listbox"]>li div'
    }
    getCourseTextF(){
        return '[class*="select2-drop select2-display-none select2-with-searchbox select2-dr"] [class*="select2-search"]'
    }
    getPostCommantsBox(){
        return '.comment-area'
    }
    getCommentSubmitButton(){
        return 'button.upload-btn'
    }
    getCommentColumnData(){
        return 'tbody>tr:nth-child(1)>td:nth-child(3)'
    }
    getCommentReplyColumnData(){
        return 'tbody>tr>td:nth-child(4)'
    }

    getReplyTextBox(){
       return "input[placeholder='Leave a reply']"
    }
    getReplyButton(){
        return "button[class='btn upload-btn has-icon']"
    }
    getSubmitButton(){
        return "button[class='upload-btn has-icon']"
    }
    clickOnReplyButtonAndHandleAlert(){
        this.getShortWait()
        cy.get(this.getReplyButton()).should('contain','Reply').click()
        cy.on('window:alert',(str)=>{
            expect(str).to.equal('Comment cannot be empty')
            cy.log(str)
        })
        cy.get('#confirm-modal-content > div > div.footer > a:nth-child(2)').contains('OK').click()
    }
    getPostCommentTextBox(){
        return "textarea[placeholder='Write a comment']"
    }
    getBackButton(){
        return ".has-icon.btn.cancel[data-menu='Sidebar']"
    }
    clickOnDeleteConfirmation(){
        cy.on('window:confirm',(str)=>{
            expect(str).to.equal('Are you sure you want to delete selected comment?')
        })
        cy.get('#confirm-modal-content>div>div.footer>a.btn.has-icon.error').click()
    }
    getNoResultFoundMessage(){
        return "div#CourseComments>div:nth-of-type(2)>div:nth-of-type(2)"
    }
    getAttachedFileName(){
        return "span[data-bind='text:FileName']"
    }
    
    getVaildateComment(){
        return 'table>tbody>tr'
    }
    getClearButton(){
        return "a[title='Remove All']"
    }
    getDefaultPageSize(){
        return "[class*='item'] [data-bind*='value']"
    }
}