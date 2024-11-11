import { pollDetails } from "../../../TestData/poll/pollDetails";
import arBasePage from "../../ARBasePage";
import ARDashboardPage from "../Dashboard/ARDashboardPage";

export default new (class ARPollsAddEditPage extends arBasePage {

  // Polls AddEdit Elements

  getQuestionTxtF() {
    return "input#Question";
  }

  getQuestionErrorMsg() {
    return '[class="validation-summary-errors"]';
  }


  getOptionAnswerTxtF() {
    return '[class*="padding-bottom"] [type]';
  }

  getA5IsPublishedToggleON() {
    return '[id="IsPublished"] [class*="txt-on"]';
  }

  getAddAnswerBtn() {
    return 'div.field.limit-width > a.btn.full-width'
  }

  getRemoveAnswerBtn() {
    return '[class*="padding-bottom"] [class*="input-group-btn"]'
  }
  getAuthorDropDown() {
    return '[id*="UserId"][class*="katana-dropdown"]'
  }
  getAuthorDropDownItem() {
    return 'ul.select2-results>li[class*="select2-results-dept-0 select2-result select2-result-selectable"]'
  }
  getTabItem() {
    return 'ul.katana-tab-menu>li[data-bind]'
  }
  getAddRuleBtn() {
    return 'div.rules > a.btn.full-width'
  }
  getAddRuleTxtF() {
    return 'div.value-select>input[type="text"]'
  }
  createPoll() {
    //Navigate to Polls
    ARDashboardPage.getShortWait()
    cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Engage')).click()
    cy.wrap(ARDashboardPage.getMenuItemOptionByName('Polls'))
    //Verify that Polls page is open 
    cy.get(ARDashboardPage.getA5PageHeaderTitle()).should('contain', 'Polls')
    //add Poll
    ARDashboardPage.getMediumWait()
    cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(1)).click()
    ARDashboardPage.getMediumWait()
    //Verify that Add Poll page is open
    cy.get(ARDashboardPage.getAccountHeaderLabel()).should('contain', 'Add Poll')
    ARDashboardPage.getShortWait()
    //Enter the Question  (Required field)
    cy.get(this.getQuestionTxtF()).clear().type(pollDetails.pollQuestion)
    //Write answer
    cy.get(this.getOptionAnswerTxtF()).type(pollDetails.answer)
    //Verify that admin can add delete answers
    cy.get(this.getAddAnswerBtn()).click()
    cy.get(this.getOptionAnswerTxtF()).eq(1).type(pollDetails.answer + ' - 2')
    cy.get(this.getAddAnswerBtn()).click()
    cy.get(this.getOptionAnswerTxtF()).eq(2).type(pollDetails.answer + ' - 3')
    cy.get(this.getRemoveAnswerBtn()).eq(2).click()
    //Select an Author from the dropdown
    cy.get(this.getAuthorDropDown()).click()
    cy.get(this.getAuthorDropDownItem()).eq(2).click()
    //Set the Publication toggle button as Published
    cy.get(this.getA5IsPublishedToggleON()).click()
    //Click on Availability tab present at the Header
    cy.get(this.getTabItem()).eq(1).click()
    //Click on Add Rule Button and set a Rule as per the requirement
    cy.get(this.getAddRuleBtn()).click()
    cy.get(this.getAddRuleTxtF()).type('John')
  }
  editPoll() {
    //Navigate to Polls
    ARDashboardPage.getShortWait()
    cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Engage')).click()
    cy.wrap(ARDashboardPage.getMenuItemOptionByName('Polls'))
    //Verify that Polls page is open 
    cy.get(ARDashboardPage.getA5PageHeaderTitle()).should('contain', 'Polls')
    // searchPoll(pollDetails.pollQuestion)
    this.searchPoll()
    cy.get(ARDashboardPage.getGridTable()).eq(0).click()
    ARDashboardPage.getMediumWait()
    //Edit Button should be visible
    cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(1)).should('contain', 'Edit Poll')
    // Verify that the added button is the  first button and above [View Votes] button
    cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(2)).should('contain', 'View Votes')
    cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(1)).click({ force: true })
    ARDashboardPage.getMediumWait()
    //Verify that Edit Poll page is open
    cy.get(ARDashboardPage.getAccountHeaderLabel()).should('contain', 'Edit Poll')
    ARDashboardPage.getShortWait()
    //Admin can update the question
    cy.get(this.getQuestionTxtF()).type('{end} --EDITED--')
    ARDashboardPage.getShortWait()
    //Admin can update,Add new Answer, or delete the existing one
    cy.get(this.getOptionAnswerTxtF()).eq(0).type('{end} --EDITED--')
    cy.get(this.getAddAnswerBtn()).click()
    cy.get(this.getOptionAnswerTxtF()).eq(1).clear().type(pollDetails.answer + '--Edited--')
    cy.get(this.getRemoveAnswerBtn()).eq(0).click()
    //Admin can change the Author
    cy.get(this.getAuthorDropDown()).click()
    cy.get(this.getAuthorDropDownItem()).eq(0).click()
  }
  searchPoll(pollQuestion = pollDetails.pollQuestion) {
    ARDashboardPage.getMediumWait()
    ARDashboardPage.A5AddFilter('Question', 'Starts With', pollQuestion)
    ARDashboardPage.getMediumWait()
  }
  
  // Added for the TC# C7413
  getPollsRightActionMenuParent() {
    return '[class="sidebar-content"]'
  }

  getRightActionMenu() {
    cy.get(this.getPollsRightActionMenuParent()).children().should(($child) => {
      expect($child).to.contain('Edit Poll')
      expect($child).to.contain('View Votes')
      expect($child).to.contain('Delete Poll')
      expect($child).to.contain('Deselect')
    })
  }

  getPollsVotesQuestion() {
    return 'h1'
  }

  getBackBtn() {
    return '[data-menu="Sidebar"]'
  }

  header = ['Answers/Options', 'Total Vote Count', 'Votes Last Week', 'Votes Last Month', 'Votes Last Year']
  body = [pollDetails.answer, '0', '0', '0', '0']
  getPollsVotePageData() {
    for (var i = 0; i < this.header.length; i++) {
      cy.get(`.border > thead > tr > :nth-child(${i + 2})`).should('contain', this.header[i])
      cy.get(`.border > tbody > tr > :nth-child(${i + 2})`).should('contain', this.body[i])
    }
  }

  getLeftMenuEngageBtn() {
    return '[aria-label="Engage"]'
  }

  getMenuItemPollsOption() {
    cy.get(this.getMenuItem()).contains("Polls").click();
  }

  getMenuItem() {
    return '[aria-labelledby="main-menu-options-title"]'
  }

})();


export const pollsData = {
  "rulesText": "John"
}
