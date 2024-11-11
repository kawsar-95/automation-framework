import LEBasePage from '../../LEBasePage'

export default new class LECourseLessonPlayerPage extends LEBasePage {
    //-------Selectors for NextGenLearnerExperience - includes anything to be replaced permanently when FF is permanently ON-------//

    getLessonPlayerHorizontalTabBtn() {
        return `[class*="horizontal-tab-module__tab"]`
    }

    //Course Details
    getCourseDetailsCourseName() {
        return `[class*="course-details-module__heading"]`
    }

    getCourseDetailsCourseDescription() {
        return `[class*="course-details-module__description"]`
    }

    //Lesson Details
    getLessonDetailsLessonName() {
        return `[class*="lesson-details-module__heading"]`
    }

    getLessonDetailsChapterName() {
        return `[class*="lesson-details-module__sub_heading"]`
    }

    getLessonDetailsLessonDescription() {
        return `[class*="lesson-details-module__description"]`
    }

    getCoursePlayerContent() {
        return `[class*="course-player-body-content-module__content"]`
    }

    getCourseEstimatedTimeContainer() {
        return `[class*="course-details-module__course_attribute___"]`
    }


    //Lesson Content
    getCoursePlayerDownloadLink() {
        return `[class*="download-lesson__download_link"]`
    }

    getCoursePlayerPoster() {
        return `[class*="vjs-poster"]`
    }

    //Sidebar
    getSidebarHeader() {
        return `[class*="sidebar-section-module__header_button"]`
    }

    getLessonByStatus(lessonName, status) {
        return cy.get('li').contains(`${lessonName}`).find(`[title="${status}"]`)

    }

    getStartLessonByName(lessonName) {
        cy.get(`li`).contains(`${lessonName}`).click()
    }
    getLessonSidebarChapterTitle() {
        return `[class*="course-player-chapter-module__title"]`
    }

    getLessonSidebarLessonTitle() {
        return `[class*="course-player-lesson-item-module__name"]`
    }


    //-------Main Selectors------//

    getIframeSelector() {
        return `[class*="iframe-lesson-module__iframe"]`
    }

    getCloseBtn() {
        //return `button[class*="icon-button-module__btn"]`
        // return `[class*="icon icon-x-thin lesson-player-module__close_btn___1SlvO lesson-player__close_btn"]`
        //return `[class*="course-player-modal-close-button-module__close_btn"]`
        //return 'div.icon-x-thin.icon'
        return '[class*="icon icon-x-thin"]'
    }

    getCoursePlayerContinueBtn() {
        return `tr td:nth-child(1)`
    }

    getModalCloseBtn() {
        return '[class="icon-button-module__btn___BQtJy course-discovery-banner-module__close_btn___yrPSb"]'
    }

    getSessionCancelBtn() {
        return '[type="button"]'
    }

    getCancelButton() {
        return `[class*="button-module__cancel"]`
    }

    getCoursePlayerCardModuleDescription() {
        return `[class*="course-player-lesson-card-module__description"]`
    }

    getCoursePlayerCardModuleData() {
        return `[class*="labelled-data-module__data"]`
    }

    getCoursePlayerModuleIcon() {
        return `[class*="course-player-card-module__icon"]`
    }

    getCoursePlayerStatusModule() {
        return `[class*="course-player-card-status-module"]`
    }

    getCoursePlayerStartQuizModuleDescription() {
        return `[class*="course-player-start-quiz-module__description"]`
    }

    getCoursePlayerPromptModuleHeaderCompleteIcon() {
        return `[class*="icon icon-check-mark course-player-card-module"]`
    }

    getCoursePlayerProgressBar() {
        return `[class*="course-player-progress-bar-module__progress_bar_header"]`
    }

    getCoursePlayerCardModuleMessage() {
        return `[class*="course-player-card-module__content"]>span`
    }

    getEarlyLeavePromptHeader() {
        return `[class*="course-player-card-module__header"]`
    }

    getEalyLeavePromptModalMessage() {
        return `[class="course-player-prompt-module__message___mRuEO"]`
    }

    confirmPopup() {
        return '[class*="btn course-player-prompt-module__confirm_btn"]'
    }


    getLessonTitle() {
        return `[class*="lesson-player-module__top_bar_title"]`;
    }

    getNextActivityBtn() {
        //return '[class*="action-button-module__container___2O6X7 next-activity-module__next_activity_btn___3kVUi"]'
        //return '[class*="next-item-button-module__btn"]'
        return '[class="action-button-module__title___Vtjlw"]'
    }

    getActivityCompleteTxt() {
        return '[class*="next-activity__title"]'
    }

    getCloseActivityBtn() {
        return '[aria-label="Close Activity"] [class*="action-button-module__title"]'
    }

    getCourseDetailsModalContainer() {
        return `[class*="course-player-body-module__container"]`
    }

    getChooseViewBtn() {
        return `[class*="icon-button-module__btn___BQtJy view"]`
    }

    getChooseViewMenuItems() {
        return `button[role="menuitem"] [data-name="start-button-icon"]`
    }

    getSelectViewMenuItemsByName(name) {
        cy.get(this.getChooseViewBtn()).click()
        this.getShortWait()
        cy.get(this.getChooseViewMenuItems()).parent().contains(name).click()
    }

    getViewCombinedBtn() {
        return `[class="icon icon-layout-full"]`
    }

    getViewSidebarBtn() {
        return `[class="icon icon-layout-sidebar"]`
    }

    getViewDetailsBtn() {
        return `[class="icon icon-layout-details"]`
    }

    getViewCompactBtn() {
        return `[class="icon icon-layout-minimal"]`
    }

    getExpandCourseDetailsBtn() {
        return `[class*="icon-button-module__btn___BQtJy toggle"]`
    }

    getExpandCourseDetailsUpBtn() {
        return `[class="icon icon-chevron-double-up"]`
    }

    getExpandCourseDetailsDownBtn() {
        return `[class="icon icon-chevron-double-down"]`
    }

    getCollapseDetailsBtn() {
        return `button[class*="collapse-course-player-details"]`
    }

    getTabMenuItems() {
        return `[class*="horizontal-tab-module"] [aria-hidden="true"]`
    }

    getTabMenuItemsByName(name) {
        cy.get(this.getTabMenuItems()).contains(name).parent().click()
    }

    getSidebarMenuContainer() {
        return `[class*="course-player-sidebar-module"]`
    }

    getDetailsPanelContainer() {
        return `[class*="course-player-details-panel-module__tab_content"]`
    }

    getLessonContentContainer() {
        return '[class*="course-discovery-lessons-tab-module"]';
    }
    getCoursePlayerOneDayAssessmentLokedMessage() {

        return `You must wait until`
    }

    //----- Selectors for Task Type Lessons -----//

    getTaskTitle() {
        return `[class*="task-lesson-player__title"]`;
    }

    getTaskDescription() {
        return `[class*="task-lesson-player__description"]`;
    }

    getSendInstructionsBtn() {
        return `[class*="task-lesson-player-module__send_notification"]`;
    }

    getNotificationMsg() {
        return `[class*="task-lesson-player-module__notification_sent"]`;
    }

    //----- Selectors for Video/Object Video Type Lessons -----//

    getVideoPlayBtn() {
        return `[class="vjs-big-play-button"]`
    }

    getVideoLoadingSpinner() {
        return `[class*="vjs-loading-spinner"]`
    }

    getVideoProgressBar() {
        return `[class*="vjs-progress-control vjs-control"]`
    }

    getVideoSubtitlesBtn() {
        return `[class*="vjs-subs-caps-button vjs-menu-button vjs-menu-button-popup vjs-button"]`
    }

    getVideoSubtitlesMenu() {
        return `[class*="vjs-menu-item"][role="menuitemradio"]`
    }

    getPlaybackSpeedBtn() {
        return `[class="vjs-playback-rate vjs-menu-button vjs-menu-button-popup vjs-button"]`
    }

    getCoursePlayerWarningBanner() {
        return `[class*="course-player-warning-banner-module__warning_banner"]`
    }

    getWarningBannerDissmissBtn() {
        return `[class*="course-player-warning-banner-module__warning_button"]`
    }


    //----- Selectors for Assessment Type Lessons -----//

    getSubmitResponseBtn() {
        return `[data-bind*="term: Terms.AssessmentSubmitResponse"]`
    }
    getContinueBtn() {
        return `[data-bind*="text: CurrentMessage().ActionText"]`
    }
    getQuestionContainer() {
        return `[class="question"]`
    }
    getPassLessonCompletionContainer() {
        return '[class*="assessment-message post pass"]'
    }
    getAnswerContainer() {
        return '[name="optionsGroup"]'
    }


    //----- Selectors for Survey Type Lessons -----//

    getSurveyTxtF() {
        return `[class*="question-input"]`
    }


    //----- Selectors for E-Signature Lessons -----//

    getAgreementTxt() {
        return '[class*="electronic-signature-lesson-player-module__agreement"]'
    }

    getUserNameTxtF() {
        return '[name="username"]'
    }

    getPasswordTxtF() {
        return '[name="secret"]'
    }

    getSubmitBtn() {
        return '[class*="electronic-signature-lesson-player-module__button"]'
    }

    //----- Selectors for SCORM Type Lessons -----//

    getSCORMiFrame() {
        return `[class*="iframe scorm-lesson-player__iframe_lesson"]`
    }
    getTrueRadioBtn() {
        return `[aria-label='True'] .slideobject-maskable svg > [data-accepts='events']:nth-child(1) > [data-accepts='events']:nth-child(4)`
    }
    getSCORMContinueBtn() {
        return `[aria-label='Continue'] .slideobject-maskable svg > [data-accepts='events']:nth-child(1) > [data-accepts='events']:nth-child(1)`
    }

    getContinueBtn() {
        return `.assessment-btn.has-icon > span:nth-of-type(3)`
    }

    getNEXTbtnSCORMTinCan() {
        return `button:nth-of-type(2) > span`
    }
    //----- Selectors for TIN CAN and AICC Type Lessons -----//
    getTinCanAICCiFrame() {
        return `[class*="iframe-lesson-player__iframe"]`
    }

    getNEXTbtnAICC() {
        return '[class*="view-content"]'
    }




    //----- Selectors for IFrame -----//
    //These are general button function for buttons within the third party courses we are using
    getIframeSCORMBtnandClick(text) {
        cy.iframe(this.getSCORMiFrame(), { timeout: 15000 }).should('be.visible').find('.btn.cs-button.inflexible.slide-control-button-submit.slide-lockable > .text').contains(`${text}`).click()
    }
    getIframeTinCanAICCBtnandClick(text) {
        cy.iframe(this.getTinCanAICCiFrame(), { timeout: 15000 }).should('be.visible').find('.btn.cs-button.inflexible.slide-control-button-submit.slide-lockable > .text').contains(`${text}`).click()
    }


    getIframeLessonPlayerElement(selector) {
        cy.get(this.getIframeSelector()).then($iframe => {

            const iframe = $iframe.contents();
            const myInput = iframe.find(`${selector}`);
            cy.wrap(myInput).should('be.visible')
        });

    }

    getIframeLessonPlayerTxtFElementandTypeText(selector, text) {
        cy.get(this.getIframeSelector()).then($iframe => {
            const iframe = $iframe.contents();
            const myInput = iframe.find('[class*="question-input-wrapper"]')
            cy.get(myInput).within(() => {
                cy.get(`${selector}`).type(`${text}`)
            })

        });

    }

    getIframeLessonPlayerElementandClick(container, selector) {
        cy.get(this.getIframeSelector()).then($iframe => {
            const iframe = $iframe.contents();
            const myInput = iframe.find(`${container}`)
            cy.get(myInput).within(() => {
                cy.get(`${selector}`).click({ force: true })
            })
        });

    }

    getIframeAnswer() {
        cy.frameLoaded(this.getIframeSelector())
        cy.iframe().find(this.getAnswerContainer()).eq(0).click({ force: true })
    }
    getIframeType(text) {
        cy.frameLoaded(this.getIframeSelector())
        cy.iframe().find('[class*="question-input-wrapper"]').type(`${text}`)
    }

    getCourseTitle() {
        // return '[class^="course-player-title-bar-module"]'
        return '[class*="course-player-title-bar-module__course_title___vHApe"]'
    }

    getUpArrowBtn() {
        return 'div.icon-chevron-double-up.icon'
    }

    getOverviewTabBtn() {
        return 'button.horizontal-tab-module__tab___r7w7o.horizontal-tab-module__tab_active___Vh8_P'
    }

    getTabBtn() {
        return 'button.horizontal-tab-module__tab___r7w7o'
    }

    getPreviousBtn() {
        return 'button.icon-button-module__btn___BQtJy.previous-item-button-module__btn___aO1Mv'
    }

    getNextBtn() {
        return 'button.icon-button-module__btn___BQtJy.next-item-button-module__btn___bYrfp'
    }

    getCourseTasks() {
        return '[title="Course Tasks"]'
    }

    getCourseTasksTitle() {
        return '[class*="course-task-item-module__item_title"]'
    }

    getCoursePlayerTaskItemBtn() {
        return '[class*="course-player-task-item-module__name"]'
    }

    getCourseLessonDetailsLessonTitle() {
        return '[class*="course-lesson-details-module__lesson_title"]'
    }

    getCoursePlayerDetailsToggleBtn() {
        return 'button[class*="toggle-course-player-details-button-module__toggle_btn"]'
    }

    verifyUploadsAndEvaluationsInBottom() {
        cy.get(this.getCourseTasksTitle).contains('Course Upload 1').should('exist')
        cy.get(this.getCourseTasksTitle).contains('Course Upload 1').siblings('span').should('have.class', 'icon-upload')
        cy.get(this.getCourseTasksTitle).contains('Course Evaluation').should('exist')
        cy.get(this.getCourseTasksTitle).contains('Course Evaluation').siblings('span').should('have.class', 'icon-speech-bubble-one-star')
    }

    getProctorCodeTextF() {
        return `input[name="code"]`
    }

    getProctorErrorMessage() {
        return `[data-name="form-info-panel"] [class*="form-info-panel-module__error_message"]`
    }

    getProctorLoginBtn() {
        return `[type="submit"]`
    }

    getProctorLaunchAssessmentBtn() {
        return `[class*="btn proctor-start-assessment-module__launch_btn"]`
    }

    getUpArrowIconClass() {
        return `icon-chevron-double-up`;
    }

    getDownArrowIconClass() {
        return "icon-chevron-double-down"
    }

    // Added for the TC# T98581
    getCoursePlayerCard(){
        return '[class*="course-player-card-module__content"]'
    }

    // Added for the TC# C98583
    getDetailsContainer() {
        return '[class*="detail-container-module__container"]'
    }

    getRecommendationContainer() {
        return '[class*="course-recommendations-module__recommendations_container"]'
    }

    getCoursePlayerHeader() {
        return '[class*="course-detail-header-module__container"]'
    }

    getRatingContainer() {
        return '[class*="course-detail-header-module__rating"]'
    }

    getRecommendedCourseContainer() {
        return '[class*="course-recommended-course-module__recommended_course_container"]'
    }

    getViewCatalogBtn() {
        return 'a[class*="link-button-module__link"]'
    }

    getSendNotificationBtn() {
        return '[class*="_send_notification"]'
    }

    getViewBtn() {
        return '[class*="_view_button"]'
    }

    getCoursePlayerCloseBtn() {
        return '[data-name="course-player-close-button"]'
    }
}