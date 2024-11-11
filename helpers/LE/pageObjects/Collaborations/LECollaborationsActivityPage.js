import LEBasePage from '../../LEBasePage'
import LEDeleteModal from '../../../LE/pageObjects/Modals/LEDelete.modal'

export default new class LECollaborationsActivityPage extends LEBasePage {

    getPageTitle() {
        return '[class*="banner-title-module__title"]'
    }

    //----- For Side Menu -----//

    getCollaborationsList() {
        return '[class*="sidebar-link-module__sidebar_link"]'
    }

    getCollaborationCountPill() {
        return this.getElementByPartialAriaLabelAttribute("Your Collaborations") + ' ' + this.getCountPill()
    }

    getViewAllBtn() {
        return "View All Your Collaborations";
    }

    getCollaborationActivityCardModuleName(){
        return `[class*="social-profile-link-module__link___vcyJ5 social-profile-flyover__link collaboration"]`
    }
    //----- For Post Interaction (Can also be used in single collaboration page) -----//

    getPostTitle() {
        return '[class*="collaboration-activity-card-title-module__title"]>a'
    }

    getNonLinkPostTitle() {
        return '[class*="collaboration-activity-card-title-module__title"]'
    }

    getPostAvatarContainer() {
        return '[class*="collaboration-activity-card-module__avatar_container"]'
    }

    getPosterName() {
        return '[class*="collaboration-activity-card-module__name"]'
    }

    getPostCollaborationName() {
        return '[class*="collaboration-activity-card-module__collaboration_name"]'
    }

    getPostDate() {
        return '[class*="collaboration-activity-card-module__date"]'
    }

    getClipboardVerifyMssg(){
        return '[class="Toastify__toast-body"]'
    }

    getVerifyPostDateByTitle(title, date) {
        cy.get(this.getNonLinkPostTitle()).contains(title).parents(this.getPostContainer()).within(() => {
            cy.get(this.getPostDate()).should('contain', date)
        })
    }

    getPostContainer() {
        return '[class*="collaboration-activity-card-module__container"]'
    }

    getPostPill() {
        return '[data-name="chip"]'
    }

    getPostContent() {
        return '[class*="collaboration-activity-card-description-module__description"]'
    }

    //only available on posts with long descriptions
    getViewPostBtn() {
        return '[class*="expandable-text-module__view_link"]'
    }

    getPostOverflowMenuBtn() {
        return '[class*="collaboration-action-bar-overflow-menu"]'
    }

    //Opens the overflow menu in a post to edit, delete, or report it
    getPostOptionsBtnByTitle(title) {
        cy.get(this.getNonLinkPostTitle()).contains(title).parents(this.getPostContainer()).within(() => {
            cy.get(this.getPostOverflowMenuBtn()).click()
        })
    }

    //Used to select either edit, delete, or report once the overflow menu in the post has been opened
    getPostOptionBtn() {
        return '[class*="overflow-menu-button-module__icon_and_title"]'
    }

    getPostLikeBtn() {
        return `:nth-of-type(1) > [class*="collaboration-action-bar-button-module__desktop_text"]`
    }

    getAnswersBtn() {
        return `:nth-of-type(2) > [class*="collaboration-action-bar-button-module__desktop_text"]`
    }

    getPostShareBtn() {
        return ':nth-of-type(3) > [class*="collaboration-action-bar-button-module__desktop_text"]'
    }

    getLikePostByTitle(title) {
        cy.get(this.getNonLinkPostTitle()).contains(title).parents(this.getPostContainer()).within(() => {
            cy.get(this.getPostLikeBtn()).click()
        })
    }

    getSharePostByTitle(title) {
        cy.get(this.getPostTitle()).contains(title).parents(this.getPostContainer()).within(() => {
            cy.get(this.getPostShareBtn()).click()
        })
    }

    //Pass the post title, anticipated number of likes, and color (color should be in RGB format - ex. "rgb(57, 157, 221)")
    getVerifyPostLikesAndBtnColor(title, likes, color) {
        cy.get(this.getNonLinkPostTitle()).contains(title).parents(this.getPostContainer()).within(() => {
            cy.get(this.getPostLikeBtn()).should('contain', `${likes} Likes`)
            cy.get(this.getPostLikeBtn()).parent().should('have.attr', 'style', `color: ${color};`)
        })
    }

    getPostAttachmentContainer() {
        return '[class*="collaboration-activity-card-attachments-module__attachment_wrapper"]'
    }

    getPostAttachmentLabel() {
        return '[class*="attachment-module__name"]'
    }

    getPostAttachmentType() {
        return '[class*="attachment-module__file_type"]'
    }

    getPostImageAttachmentPreview() {
        return '[data-name="attachment"]'
    }
    
    getPostAttachmentSource() {
        return `[class*="attachment-module__image_icon_wrapper___"] > img`
    }


    getPostAttachmentsCollapsed() {
        return '[class*="collaboration-activity-card-attachments-module__collapsed_attachments_link_icon"]'
    }

    getLoadMorePostsBtn() {
        return '[class*="page-size-button__btn"]'
    }

    //pass 'Post' or 'Question' for the post type. Defaults to Post
    getDeletePostByName(postName, postType = 'Post') {
        this.getPostOptionsBtnByTitle(postName)
        cy.get(this.getPostOptionBtn()).contains(`Delete ${postType}`).click()
        cy.get(LEDeleteModal.getDeleteBtn()).click()
        cy.get(this.getToastNotificationCloseBtn(),{timeout:15000}).should('be.visible').click({force:true})
    }
}