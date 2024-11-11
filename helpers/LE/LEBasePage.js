import dayjs from 'dayjs'
import ARDashboardPage from '../AR/pageObjects/Dashboard/ARDashboardPage'
import ARDashboardAccountMenu from '../AR/pageObjects/Menu/ARDashboardAccount.menu'
import AREditClientUserPage from '../AR/pageObjects/PortalSettings/AREditClientUserPage'
import BasePage from '../BasePage'

export default class LEBasePage extends BasePage {

    getLEInnerModal(){
        return `[data-name="inline-modal-container"]`
    }

    getLEInnerModalCloseBtn() {
        return `[data-name="inline-modal-container"] [class="icon icon-x-thin"]`
    }

    getLETableRowCell() {
        return `[data-name="table-row-cell"]`
    }

    getHeaderLogoBtn() {
        return '[class*="header__brand_logo header-module__brand_logo"]'
    }
    getPageHeaderTitle() {
        return '[class*="header-module__title"]'
    }

    //------- Common Elements across LE ------//
    getChkBox() {
        return `[class*="checkbox-module"]`

    }
    //Count highlight for messages, collaborations icons, etc.
    getCountPill() {
        return '[class*="Component-pill"]'
    }
    //General Text Field
    getTxtF() {
        return `[type*="text"]`
    }
    //General Number Text Field
    getNumTxtF() {
        return `[type*="number"]`
    }

    getToggleClickVerifyStatus(toggleModule, value) {
        cy.get(`${toggleModule}`).within(() => {
            cy.get('[class*="toggle__slider"]').click()
            cy.get('[class*="redux-form-toggle__checkbox"]').should('have.value', value)
        })
    }
    //Category selector found within Catalog, My Courses and Resources Pages
    getCategorySelector(categoryTitle) {
        return `[title="${categoryTitle}"]`
    }
    //Banner found within Catalog, My Courses and Resources Pages
    getMyCoursesCatalogResourcesBanner() {
        return `[class*="banner-module__banner"]`
    }



    //------- Wait Spinner and Loader -------//
    //This is the spinning icon which animates in the lower right hand corner of the screen
    getLEWaitSpinner() {
        return `[class*="syncing-dialog__container"]`
    }
    //This is the Loader Icon which appears in the middle of the screen which resembles an animated Ellipses
    getLEEllipsesLoader() {
        //return `[class*="loader-module__loader"] [aria-live="polite"]`
        return `[class*="loader-module__loader"]`
    }

    getButtonLoader() {
        return '[class*="_loader_container"]'
    }

    // The following element uses odd indexes only
    getTxtFErrorMsg(index) {
        return `div:nth-of-type(${index}) > div .redux-form-input-field__errors`
    }

    //------- Common Elements for Pages that Cannot be Found-------//

    getCatalogCourseNotFoundErrorMsg() {
        return cy.get('[class*="catalog-module__error_message_text___"]').should('contain', "We're so sorry! We could not locate this course. If you believe you should have access to this course, please contact your system administrator.")
    }

    get404Page() {
        return cy.get('[class*="not-found-code"]').should('contain', '404')
    }

    getPageNotFoundMsg() {
        return cy.get('[class*="not-found-module__header___"]').should('contain', 'Page Not Found')
    }

    //Verifies no results found message in my courses or catalog
    getSearchCourseNotFoundMsg() {
        cy.get('[class*="no_results_header_text"]').should('contain', "Sorry, we couldn't find any results.")
    }

    getLearnerNotFoundMsg() {
        return cy.get('[class*="not-found-module__header___"]').should('contain', 'Learner Not Found')
    }

    //------- Common Elements for Managing the Template -------//

    //Only availble once a change has been made within the open container
    getContainerSaveBtn() {
        return '[class*="btn form-buttons__save_button"]'
    }

    getSuccessMessage() {
        return '[class*="form-info-panel-module__success_message"]'
    }

    //Upload Image File Common Elements when managing the template
    getUploadFileBtn() {
        return '[class*="redux-form-image-upload__upload_image_overlay_btn"]'
    }

    getUploadMsg() {
        return '[class*="redux-form-file-upload-module__scanning_container"]'
    }

    getDeleteImageBtn() {
        return '[class*="redux-form-image-upload__delete_image_overlay_btn"]'
    }

    getUploadImagePreview() {
        return `[class*="redux-form-image-upload__background_image_wrapper"]`
    }

    getcoursenavigatecompletion() {
        return '[aria-label="Completed courseplayertestcompleted"]'
    }

    //Pass image path to change the image based on container elements and module - Can be used throughout the template and maybe elsewhere
    getUploadAnImage(moduleLabelElement, moduleLabelTxt, fileUploadContainerElement, filePath, uploadMsg1, uploadMsg2) {
        cy.get(`${moduleLabelElement}`).contains(moduleLabelTxt).parents(`${fileUploadContainerElement}`).within(() => {
            cy.get(this.getUploadFileBtn()).click()
            cy.get(this.getFileInput()).attachFile(filePath)
            cy.get(this.getUploadMsg()).should('contain', uploadMsg1)
            this.getLShortWait()
            cy.get(this.getUploadMsg()).should('contain', uploadMsg2)
        })
    }

    getUploadWrongImage(moduleLabelElement, moduleLabelTxt, fileUploadContainerElement, filePath, uploadMsg1) {
        cy.get(`${moduleLabelElement}`).contains(moduleLabelTxt).parents(`${fileUploadContainerElement}`).within(() => {
            cy.get(this.getUploadFileBtn()).click()
            cy.get(this.getFileInput()).attachFile(filePath)
            cy.get(this.getBannerImageUploadErrorMessageModule()).should('contain', uploadMsg1)

        })
    }

    getBannerImageUploadErrorMessageModule() {
        return `[class*="redux-form-file-upload-module__error_message___QWeyO form-field__error_message"]`

    }

    //Background Display - Pass text 'Full Screen' or 'Repeat'

    getBackgroundDisplayRadioBtnAndClick(containerElement, text) {
        cy.get(`${containerElement}`).contains(text).click()

    }

    //Background Image Alignment

    //Pass either 'Top Left', 'Top Center', 'Top Right', 'Center Left', 'Center Center', Center Right', 'Bottom Left', 'Bottom Center', or 'Bottom Right'
    getBackgroundAlignmentBtn(align) {
        return `[title="Align: ${align}"]`
    }

    //BackGround Image Opacity - used throughout the template
    getBackgroundOpacityBar() {
        return '[class*="DefaultProgressBar_progressBar"]'
    }

    getSetBackgroundOpacity(opacity) {
        cy.get(this.getBackgroundOpacityBar()).invoke('attr', 'style', `left: 0px; width: ${opacity * 2}%;`)
        cy.get(this.getBackgroundOpacityBar()).click({ force: true })
    }

    //------- Common Elements for Course Details Module/Modal -------//

    getCourseDetailsBanner() {
        return `[class*="course-detail-header-module__container"]`
    }

    //------- Common Elements for Course Cards -------//

    //Use when expecting only a single course to appear in the search
    getCourseCardBtnThenClick(name) {
        cy.get(`[class*="card__name"]:contains("${name}")`, { timeout: 100000 }).parent().within(() => {
            cy.get('[class*="action-button-module__title"]', { timeout: 100000 }).eq(0).click({ force: true })
        })
    }
    getCourseCrdName() {
        return '[class*="card__name"]';
    }
    getCourseCloseBtn() {
        return '[class*="icon icon-x-thin lesson-player-module"]';
    }

    

    //Use when there is more than 1 course card displayed
    getSpecificCourseCardBtnThenClick(name) {
        cy.get('[class*="card__name"]', { timeout: 100000 }).should('be.visible').and('contain',`${name}`)
        cy.get(`[class*="card__name"]`).contains(new RegExp("^" + name + "$", "g")).parent().within(() => {
            cy.get('[data-name="action-button"] [class*="action-button-module__title"]', { timeout: 100000 }).click()
        })
    }

    getSpecificCourseCardBtnThenClickOnName(name) {
        cy.get('[class*="card__name"]', { timeout: 100000 }).should('be.visible').and('contain',`${name}`)
        cy.get(`[class*="card__name"]`).contains(new RegExp("^" + name + "$", "g")).parent().within(() => {
            cy.get(' button[class*="card-module__name___"]', { timeout: 100000 }).click({force:true})
        })
    }

    getCourseSessionEnrollBtnThenClick(name) {
        cy.get(`[class*="card__name"]`).contains(new RegExp("^" + name + "$", "g")).parent().within(() => {
            cy.get('[class*="action-button-module__title"]', { timeout: 100000 }).click()
        })
    }

    //Pass the course card name & button state to verify both - can be used on courses & catalog page
    getVerifyCourseCardNameAndBtn(name, BtnLabel) {
        cy.get(`[class*="card__name"]`).contains(new RegExp("^" + name + "$", "g")).parent().within(() => {
            cy.get('[class*="action-button-module__title"]', { timeout: 100000 }).should('contains.text', BtnLabel, { timeout: 100000 })
        })
    }

    getCourseCardLoaderBtn() {
        return '[class*="action-button-module__loader"]'
    }

    //Gets the course name on the course card
    getCourseCardName() {
        return `[class*="card-module__name"]`;
    }

    //Gets the course name on the course card
    getCourseCardForOnlineCourse(courseName) {
        return `[data-name="online-course-card"] button[data-name="course-link"][title="${courseName}"]`;
    }

    getCourseCardType() {
        return `[class*="_type"]`
    }

    getCarouselContainer() {
        return `[class*="card-carousel-module__track_container___"]`
    }

    getRecommendationByLastText() {
        return 'Recommendations Based on Completing'
    }

    getRecommendationByAllText() {
        return 'Recommendations Based on Courses You Completed'
    }

    //Gets the resource name on the resource card 
    getResourceCardName() {
        return `[class*="list-module__resource_name_container"]`
    }

    //Pass the course card name & the function will click on the Pin button associated with the card
    getCourseCardPinBtnThenClick(name) {
        cy.get(`[class*="card__name"]`).contains(new RegExp("^" + name + "$", "g")).parents('[data-name="online-course-card"]').within(() => {
            cy.get('[class*="course-options__option_pin"]', { timeout: 100000 }).invoke('show').click({ force: true })
        })
    }
s
    //Pass the position number the card should be in and it's name to verify - ex. A single pinned course should be position 1 when viewing the catalog
    getVerifyCourseCardPositionAndName(index, name) {
        cy.get('[class*="card-module__card_bottom"]', { timeout: 100000 }).eq(index).within(() => {
            cy.get(this.getCourseCardName(), { timeout: 100000 }).should('contain', name)
        })
    }

    getToastNotificationCloseBtn() {
        return '[class*="icon icon-close"]'
    }

    getToastNotificationMsg() {
        return '[class*="Toastify__toast-body"]'
    }

    //------- Common Elements for OC, ILC and Curr Details Page -------//


    getCourseProgressStatusText() {
        return `[class*="course-progress-module__title"]`
    }

    getCourseProgressPercentText() {
        return `[data-name="percentage"]`;
    }
    getCourseDetailStatus() {
        return '[class*="course-details-module__course_status"]'
    }

    //When a Course is a part of a Curricula and Course is launched from Curricula Details Page

    getBacktoCurrDetailsBtn() {
        return `[class*="course-curricula-status__back_button"]`
    }



    //------- Common Icons for Buttons and Labels -------//

    getOtherIcon() {
        return '[class*="icon-resource-other"]'
    }

    getExcelIcon() {
        return '[class*="icon-resource-excel"]'
    }

    getWordIcon() {
        return '[class*="icon-resource-word"]'
    }

    getPowerPointIcon() {
        return '[class*="icon-resource-powerpoint"]'
    }

    getPDFIcon() {
        return '[class*="icon-resource-pdf"]'
    }

    getRightArrowIcon() {
        return '[class*="icon-arrow-right-go"]'
    }

    getDownArrowIcon() {
        return '[class*="icon icon-arrow-down"]'
    }
    getCourseDiscoveryModalContainer() {
        return '[class*="course-discovery-modal"]'
    }
    getCourseDiscoveryCloseBtn() {
        return '[class*="icon icon-x-thin"]'
    }
    getInitialLoader() {
        return '[class*="loader-module__loader"]'
    }
    getCoursesLoader() {
        return '[class*="syncing-dialog-module__syncing_container"]'
    }
    waitForLoader(element, timeout = 5 * 60 * 1000) {
        cy.get(element, { timeout }).should('not.exist')
    }
    getCourseTitleFromCard(courseName) {
        return `button[title="${courseName}"]`
    }
    /**
    * e.g:
    * LEDashboardPage.visitAndSearch('courses','name', 'GUIA')
    * LEDashboardPage.visitAndSearch('courses','courseTypes', 'OnlineCourse')
    * LEDashboardPage.visitAndSearch('resources','name', 'GUIA')
    */
    visitAndSearch(path, key, value) {

        cy.visit(`#/${path}?${key}=${encodeURIComponent(value)}`)
    }

    turnOnNextgenToggle() {
        //Navigate to portal settings menu  
        ARDashboardPage.getPortalSettingsMenu()
        // Turn on next gen toggle button
        AREditClientUserPage.getTurnOnNextgenToggle()
        cy.get(AREditClientUserPage.getSaveBtn()).click()
        //Verify to page url for checking the settings get saved properly or not.
        cy.url().should('include', '/Admin/Clients')
    }

    turnOffNextgenToggle() {
        //Navigate to portal settings menu 
        ARDashboardPage.getPortalSettingsMenu()
        // Turn off next gen toggle button
        AREditClientUserPage.getTurnOffNextgenToggle()
        cy.get(AREditClientUserPage.getSaveBtn()).click()
        //Verify to page url for checking the settings get saved properly or not.
        cy.url().should('include', '/Admin/Clients')
    }

    getThumbnailContainer() {
        return '[class*="thumbnail__container"]'
    }

    verifyThumbnailByCourseName(courseName, thumbnail) {
        cy.get(this.getCourseCrdName()).contains(courseName).parents('[data-name="course-bundle-card"]').within(() => {
            cy.get(this.getThumbnailContainer() + ' ' + 'img').should('have.attr', 'src', thumbnail)
        })
    }

    // Added for the TC# T98581
    getCoursePlayerCard() {
        return '[class*="course-player-card-module__content"]'
    }

    // Common method to get button of type submit
    getSubmitBtn() {
        return 'button[type="submit"]'
    }

    getCardInfo() {
        return '[class*="card__info"]'
    }

    getChooseViewBtn() {
        return '[title="Choose View"]'
    }

    getDetailViewBtn() {
        return '[title="Detail View"]'
    }

    getCardViewBtn() {
        return '[title="Card View"]'
    }

    getCoursePanel() {
        return '[class*="panel-module__panel__"]'
    }
    getCoursePanelName() {
        return '[class*="panel-module__name"]'
    }

    getDateMessage() {
        return '[class*="date-message-module__date"]'
    }

    verifyCourseExpirationDateOnCardView(courseName, date) {
        cy.get(this.getCourseCardName()).contains(courseName).parent().parent().within(() => {
            cy.get(this.getCardInfo()).should('contain', dayjs(date).format('MMMM'))
                .and('contain', dayjs(date).format('D')).and('contain', dayjs(date).format('YYYY'))
        })
    }

    verifyCourseExpirationDateOnDetailView(courseName, date) {
        cy.get(this.getCoursePanelName()).contains(courseName).parents(this.getCoursePanel()).within(() => {
            cy.get(this.getDateMessage()).should('contain', dayjs(date).format('MMMM'))
                .and('contain', dayjs(date).format('D')).and('contain', dayjs(date).format('YYYY'))
        })
    }
}
