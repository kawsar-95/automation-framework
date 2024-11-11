import LEBasePage from '../../LEBasePage'
import LEDashboardPage from '../../../LE/pageObjects/Dashboard/LEDashboardPage'

export default new class LECollaborationPage extends LEBasePage {

    getPageTitle() {
        return '[class*="banner-title-module__title"]'
    }

    getCollaborationCounts() {
        return '[class*="collaboration-page-banner-module__counts"]'
    }

    getPageHeader() {
        return '[class*="collaboration-page-header-module__header"]' 
    }

    getCollaborationCounts() {
        return '[class*="collaboration-page-banner-module__counts"]'
    }

    getBackBtn() {
        return '[class*="collaboration-page-header-module__back_arrow"]'
    }

    getCreatePostBtn() {
        return '[class*="create_post_btn"]'
    }

    getCreatePostPanelTxt() {
        return '[class*="collaboration-create-post-module__text"]'
    }

    getCreatePostPanelBtn() {
        return '[class*="collaboration-create-post-module__create_post_icon"]'
    }

    getCreateQuestionPostBtn() {
        return '[class*="collaboration-create-post-module__question_mark_icon"]'
    }

    getCreatePostModalBtn() {
        return '[type="submit"]'
    }

    

    //----- For General Right Pane -----//

    getRightPaneModuleHeader() {
        return '[class*="Component-header"]'
    }

    getSectionContainer() {
        return '[class*="Component-container"]'
    }

    getSectionList() {
        return '[class*="sidebar-link-module__sidebar_link"]'
    }

    //--- For Members Section ---//

    getMemberAvatars() {
        return '[class*="collaboration-members-sidebar-module__list"]'
    }

    getMemberAvatar(tabIndex) {
        return `li:nth-of-type(${tabIndex}) > [class*="collaboration-members-sidebar-module__avatar_container"]`
    }

    getViewAllMembersBtn() {
        return "View All Members";
    }

    getChatOnTeamsBtn() {
        return '[class*="icon icon-microsoft-teams"]'
    }

    //--- For Courses Section ---//

    getCourseListItem() {
        return '[class*="sidebar-link-module__sidebar_link"]'
    }

    getViewAllCoursesBtn() {
        return "View All Related Courses";
    }

    //--- For Resources Section ---//

    getResourceListItemContainer() {
        return '[class*="collaboration-resource-link-module__sidebar_link"]'
    }

    getResourceListItem() {
        return '[class*="collaboration-resource-link-module__name"]'
    }

    getResourceListItemIcon() {
        return '[class*="collaboration-resource-link-module__icon"]'
    }

    getViewAllResourcesBtn() {
        return "View All Resources";
    }

    
    //----- Functions When Viewing a Single Post-----//

    getAboutTxt() {
        return '[class*="collaboration-about-sidebar-module__description"]'
    }

    getViewAboutBtn() {
        return '[class*="collaboration-about-sidebar-module__view_button"]'
    }


        //----- Functions for Posts can be found in LECollaborationsActivityPage -----//

        //----- For Comments and Answers -----//
    
    getCommentTxtF() {
        return 'div[class*="fr-element fr-view"] > p'
    }

    getPostCommentBtn() {
        return '[class*="btn button-module__btn"]'
    }

    getAddComment(comment) {
        cy.get(this.getCommentTxtF()).type(comment)
        cy.get(this.getPostCommentBtn()).contains('Post Comment').should('have.attr', 'aria-disabled', 'false').click()
        cy.get(LEDashboardPage.getLEWaitSpinner()).should('not.exist')
    }

    getAddAnswer(answer) {
        cy.get(this.getCommentTxtF()).type(answer)
        cy.get(this.getPostCommentBtn()).contains('Post Answer').should('have.attr', 'aria-disabled', 'false').click()
        cy.get(LEDashboardPage.getLEWaitSpinner()).should('not.exist')
    }

    getCommentContainer() {
        return '[class*="collaboration-activity-card-module__container"]'
    }

    getAuthorPill() {
        return '[class*="author_chip"]'
    }

    getBestAnswerPill() {
        return '[data-name="chip-text"]'
    }

    getCommenterName() {
        return '[class*="collaboration-activity-card-module__name"]'
    }

    getCommentContent() {
        return '[class*="collaboration-activity-card-description"]'
    }
    
    //Can also be used to click the Mark Best Answer Btn
    getCommentLikeBtn() {
        return `:nth-of-type(1) > [class*="collaboration-action-bar-button-module__desktop_text"]`
    }

    getAnswerUpvoteBtn() {
        return `:nth-of-type(2) > [class*="collaboration-action-bar-button-module__desktop_text"]`
    }

    getCommentContainerFooter() {
        return '[class*="collaboration-activity-card-action-bar-module__container"]'
    }

    getCommentReplyBtn() {
        return '[class*="icon icon-reply"]'
    }

    getLikeCommentByContent(content) {
        cy.get(this.getCommentContent()).contains(content)
            .parents(this.getCommentContainer()).within(() => {
                cy.get(this.getCommentContainerFooter()).within(() => {
                    cy.get(this.getCommentLikeBtn()).click()
                })
            })
    }

    getUpvoteAnswerByContent(content) {
        cy.get(this.getCommentContent()).contains(content)
        .parents(this.getCommentContainer()).within(() => {
            cy.get(this.getCommentContainerFooter()).within(() => {
                cy.get(this.getAnswerUpvoteBtn()).click()
            })
        })
    }

    getCommentOptionsBtnByContent(content) {
        cy.get(this.getCommentContent()).contains(content)
            .parents(this.getCommentContainer()).within(() => {
                cy.get(this.getCommentContainerFooter()).within(() => {
                    cy.get('[class*="collaboration-action-bar-overflow-menu"]').click({force:true})
                })
            })
    }

    //Pass the comment content, anticipated number of likes, and color (color should be in RGB format - ex. "rgb(57, 157, 221)")
    getVerifyCommentLikesAndBtnColor(comment, likes, color) {
        cy.get(this.getCommentContent()).contains(comment)
            .parents(this.getCommentContainer()).within(() => {
                cy.get(this.getCommentContainerFooter()).within(() => {
                    cy.get(this.getCommentLikeBtn()).should('contain', `${likes} Likes`)
                    cy.get(this.getCommentLikeBtn()).parent().should('have.attr', 'style', `color: ${color};`)
                })
            })
    }

    //Pass the answer content, anticipated number of upvotes, and color (color should be in RGB format - ex. "rgb(57, 157, 221)")
    getVerifyAnswerUpvotesAndBtnColor(answer, upvotes, color) {
        cy.get(this.getCommentContent()).contains(answer)
            .parents(this.getCommentContainer()).within(() => {
                cy.get(this.getCommentContainerFooter()).within(() => {
                    cy.get(this.getAnswerUpvoteBtn()).should('contain', `${upvotes} Upvotes`)
                    cy.get(this.getAnswerUpvoteBtn()).parent().should('have.attr', 'style', `color: ${color};`)
                })
            })
    }

    //Pass the comment content and color (color should be in RGB format - ex. "rgb(57, 157, 221)")
    getVerifyBestAnswerBtn(comment, color) {
        cy.get(this.getCommentContent()).contains(comment)
            .parents(this.getCommentContainer()).within(() => {
                cy.get(this.getBestAnswerPill()).should('contain', 'Best Answer')
                cy.get(this.getCommentContainerFooter()).within(() => {
                    cy.get(this.getCommentLikeBtn()).parent().should('have.attr', 'style', `color: ${color};`)
                })
            })
    }


            //----- For Comment Reply -----//
        
    getReplyTxtF() {
        return '[class*="collaboration-reply-input-module__message_input"]'
    }
    
    getReplyTxtF() {
        return '[class*="collaboration-reply-input-module__message_input"]'
    }
    
    //Pass the content of the comment you want to reply to, and your reply
    getAddReplyByCommentContent(content, reply) {
        cy.get(this.getCommentContent()).contains(content)
            .parents(this.getCommentContainer()).within(() => {
                cy.get(this.getCommentReplyBtn()).click()
            })
        cy.get(this.getReplyTxtF()).type(reply)
        cy.get(this.getPostCommentBtn()).contains('Post Reply').should('have.attr', 'aria-disabled', 'false').click()
        cy.get(LEDashboardPage.getLEWaitSpinner()).should('not.exist')
    }

    getReplyContainer() {
        return `[class*="collaboration-nested-reply-module__container"]`
    }

    getReplyerName() {
        return `[class*="collaboration-nested-reply-module__name"]`
    }

    getReplyContent() {
        return `[class*="collaboration-nested-reply-module__content"]`
        //return `div[class^="collaboration-nested-reply-module__content"] div[class*="sanitized_html"]`
    }

    getReplyLikeBtn() {
        return `[class*="collaboration-action-bar-button-module__desktop_text"]`
    }

    getLikeReplyByContent(content) {
        cy.get(this.getReplyContent()).contains(content)
            .parents(this.getReplyContainer()).within(() => {
                cy.get(this.getReplyLikeBtn()).click()
            })
    }

    getVerifyReplyLikesAndBtnColor(reply, likes, color) {
        cy.get(this.getReplyContent()).contains(reply)
            .parents(this.getReplyContainer()).within(() => {
                cy.get(this.getReplyLikeBtn()).should('contain', `${likes} Likes`)
                cy.get(this.getReplyLikeBtn()).parent().should('have.attr', 'style', `color: ${color};`)
            })
    }

    getReplyOptionsBtnByContent(content) {
        cy.get(this.getReplyContent()).contains(content)
            .parents(this.getReplyContainer()).within(() => {
                cy.get('[class*="collaboration-action-bar-overflow-menu"]').click({force:true})
            })
    }

    getLoadMoreRepliesBtn() {
        return '[class*="collaboration-load-more-replies-module__link"]'
    }

}