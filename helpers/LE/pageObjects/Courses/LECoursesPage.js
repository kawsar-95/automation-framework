import LEBasePage from '../../LEBasePage'
import dayjs from 'dayjs'

export default new class LECoursesPage extends LEBasePage {

    getCoursesContainer() {
        return '[class*="courses__cards_container"]> [class*="courses-module__card"]'
    }

    getCoursesPageTitle() {
        return `[class*="banner-title-module__title"]`;
    }

    getCourseTitle() {
        return `[class="course-details-module__heading___zShcE"]`;
    }

    getCourseILCTitle(){
        return '[class="course-detail-header-module__name___MIyc2 course-detail-header__name"]'
    }

    getCourseCloseBtn(){
        return `[class*="icon-button-module__btn___BQtJy course-player-modal-close-button"]`
    }

    //----- For Course Expiration and Due Banner Section -----//

    getExpirationBanner() {
        return '[class*="course-expiry-date-module__section_right"]'
    }

    getDueBanner() {
        return '[class*="course-due-date-module__section_right"]'
    }

    getVerifyExpirationDate(date) {
        cy.get(this.getExpirationBanner()).should('contain', dayjs(date).format('dddd')).and('contain', dayjs(date).format('MMMM'))
            .and('contain', dayjs(date).format('D')).and('contain', dayjs(date).format('YYYY'))
    }

    getVerifyDueDate(date) {
        cy.get(this.getDueBanner()).should('contain', dayjs(date).format('dddd')).and('contain', dayjs(date).format('MMMM'))
            .and('contain', dayjs(date).format('D')).and('contain', dayjs(date).format('YYYY'))
    }

    getSingleExtensionOpt() {
        return '[class*="course-extension-module__single_option"]'
    }

    getExtensionDDown() {
        return '[name="extension_id"]'
    }

    getAddExtensionToCartBtn() {
        return '[class*="course-extension-module__button"] [class*="action-button-module__title"]'
    }

    getDiscoveryCourseNameHeader(){
        return `[class*="course-discovery-banner-module__title"]`
    }



    //Course Header buttons

    getEnrollBtn() {
        return `[class*="action-button-module__title"]`
    }

    getModalEnrollBtn() {
        return `[class*="modal__modal_container_top"] [class*="action-button-module__title"]`
    }

    getShareCourseBtn() {
        return `[class*="icon icon-share"]`
    }

    getPinCourseBtn() {
        return `[class*="icon icon-pin"]`
    }

    getTermsAndConditionsBanner() {
        return `[class*="course-requires-terms-and-conditions-module"]`;
    }

    getTermsAndConditionsContinueBtn() {
        return `[class*="course-requires-terms-and-conditions-module__continue_button"]`;
    }

    getCoursesPageTabBtnByName(name) {
        cy.get(`[class*="tab-list-module__tab"]`).contains(name).click()
    }

    getCourseCommentTxtF() {
        return '[name="commentText"]';
    }

    getCourseCommentPostBtn() {
        return `[class*="btn post-comment-module__post_button"]`;
    }

    //Opens the popup to switch the view between detailed & calendar
    getChooseViewBtn() {
        return `[class*="icon icon-view-detailed"]`;
    }

    //Displayed by default in catalog - click this first to view other display options
    getCardViewBtn() {
        return '[class*="icon icon-view-cards"]'
    }

    getListViewBtn() {
        return '[class*="icon icon-view-list"]'
    }

    getViewOptionBtn() {
        return `[class*="view-options-module__btn"]`
    }

    //Only available once the getChooseViewBtn or getCardViewBtn has been clicked
    getCalendarViewBtn() {
        return `[class*="view-options__option_calendar"]`;
    }

    //Only available once the getChooseViewBtn or getCardViewBtn has been clicked
    getDetailViewBtn() {
        return `[class*="view-options__option_detailed"]`;
    }

    //----- Elements available in the calendar view -----//

    getCalendarViewFwdBtn() {
        return `[class*="icon-arrow-right-thin"]`;
    }

    getViewNextSessionBtnThenClick() {
        cy.get(`[class*="event-calendar__no_event_message"]`).parent().within(() => {
            cy.get(`[class*="btn button-module__btn"]`).click()
        })
    }

    getNoSessionsTxt() {
        return `[class*="event-calendar__no_event_message"]`;
    }

    //----- For General Side Menu Items -----//

    getEvaluateCourseBtn() {
        return 'div[class*="course-evaluation-launcher-module__evaluation_button"] > button'
    }

    //----- For Credits Section in the Side Menu -----//

    getTotalCredits() {
        return '[class*="course-credits__credits"]'
    }

    getMultiCreditsTable() {
        return '[class*="course-credits-module__multi_credits"]'
    }

    getMultiCreditAmount() {
        return '[class*="course-credits-module__credit_amount"]'
    }

    getMultiCreditType() {
        return '[class*="course-credits-module__credit_type"]'
    }


    //----- For Collaborations Section in the Side Menu (Modal + Page) -----//

    getCollaborationContainer() {
        return '[class*="course-collaboration-activity-module__container"]'
    }

    getNoActivityTitle() {
        return '[class*="no-activity-single-collaboration-module__title"]'
    }

    getAllPostsContainer() {
        return '[class*="course-collaboration-activity-module__activities"]'
    }

    getCollaborationPostContainer() {
        return '[class*="collaboration-activity-summary-module__post"]'
    }

    getPostSummary() {
        return '[class*="collaboration-activity-summary-module__post_title"]'
    }

    getPostAuthorName() {
        return '[class*="collaboration-activity-summary-module__name"]'
    }

    getPostCollaborationName() {
        return '[class*="collaboration-activity-summary-module__collaboration_name"]'
    }

    getCollaborationLink() {
        return '[class*="course-collaboration-activity-module__link"]'
    }

    getCreatePostBtn() {
        return '[class*="no-activity-single-collaboration-module__create_post_btn"]'
    }

    getViewAllCollaborationsBtn() {
        return '[class*="view-related-collaborations-module__view_all_link_arrow"]'
    }

    //----- For Certificate Section in the Side Menu -----//

    getCertificateIcon() {
        return '[class*="certificate-module__icon"]'
    }

    getCertificateTitle() {
        return '[class*="certificate-module__title"]'
    }


    //----- For Comments Section -----//

    getCommentContainer() {
        return '[class*="comment-module__container"]'
    }

    //Checks all comments in the course page - use to verify if certain text does or does not exist
    getCommentTxt() {
        return `[class*="comment-module__comment"]`
    }

    //Pass the name of learner to verify their comment content
    getCourseCommentContentByLearnerName(name, comment) {
        cy.get(this.getCommentContainer()).contains(name).parents(this.getCommentContainer()).within(() => {
            cy.get(getCommentTxt()).should('contain', comment)
        })
    }
    getAndClickStartBtn() {
        cy.get('[class*=action-button-module__title___Vtjlw]').contains('Start').click();
    }
    getToggleModule(){
        return 'div[class*="toggle-module__toggle"]'
    }
    getToggleSwitchBtn(){
        return 'label[class*="toggle-module__switch"]'
    }
    getToggleSwitchLable() {
        return '[class*="tile-container-module__label___"]'
    }
    getToggleSwitchBtnBySibling() {
        return `input[type="checkbox"]`
    }
    getCourseProgressPercentage(){
        return `[data-name="percentage"]`
    }
    /**
     * @param {String} name Name is the name Written in the Button of a course 
     * this method is created for a button which should not exist 
     */
    getCourseCardBtnAssertion(name = "Enroll"){
        cy.get('[class*=action-button-module__title___Vtjlw]').contains(name).should('not.exist')
    }

    // Added for TC# C6340
    getCourseTitleInBanner() {
        return '[class="course-detail-header-module__name___MIyc2 course-detail-header__name"]'
    }

    // Added for TC# C942
    getRatingContainer() {
        return 'div[class*="rating-module__rating_select"]'
    }

    getRateStartContainer() {
        return 'div[role="listitem"]'
    }

    getModalCloseBtn() {
        return '[class*="icon icon-x-thin"]'
    }

     
    getActionBtn(){
        return '[class*="action-button-module__title___"]'
    }

     
    getCourseUploadStatus(){
        return '[class*="course-upload__status"]'
    }

     
    getCourseUploadSize(){
        return '[class*="course-upload__file_size"]'
    }

     
    getCourseUploadDate(){
        return '[class*="course-upload__upload_date"]'
    }

     
    getCourseUploadTitle(){
        return 'a[class*="course-upload-module__title_link"]'
    }

    getCourseTitleWhenNextGenDisabled() {
        return '[class*="course-detail-header-module__name___"]'
    }
}