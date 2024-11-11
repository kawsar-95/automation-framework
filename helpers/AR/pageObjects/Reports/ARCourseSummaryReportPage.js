import arBasePage from "../../ARBasePage";


export default new class ARCourseSummaryReportPage extends arBasePage {
    getRightActionMenuLabel(){
        cy.get(this.getRightActionMenuContainer()).children().should(($child)=>{
            expect($child).to.contain('Enroll User');
            expect($child).to.contain('Edit Course');
            expect($child).to.contain('View Activity Report');
            expect($child).to.contain('Learner Progress');
            expect($child).to.contain('Department Progress');
            expect($child).to.contain('Deselect')
        })
    }
    getLayoutMenuItems(){
        return '[class*="_grid_column_esh3t_1"]'
    }
      
    //this method verify layout items' name and index at the same time
    getVerifyLayoutMenuItemByNameAndIndex(index,name){
        cy.get(this.getLayoutMenuItems()).eq(index).should('contain',name)
    }
        
    getRightActionMenuContainer(){
        return '[class*="_context_menu_w33d3_1"]'
    }

    //this method verify action menu items' name and index at the same time
    getActionMenuItemsInOrder(index,name){
        cy.get(this.getRightActionMenuContainer()).children(index).should(($child) =>{
            expect($child).to.contain(name);
        })
    }
    getRightActionMenuBtn(){
        return '[class*="_child_"] > button'
    }

    removeSelectedTagByName(name) {
        cy.get(this.getOperator()).eq(1).contains(name).parent().within(() => {
            cy.get(this.getXBtn()).click()
        })
        cy.get(this.getWaitSpinner()).should('not.exist')
    }
}   