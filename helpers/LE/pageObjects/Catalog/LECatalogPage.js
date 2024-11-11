import { commonDetails } from '../../../TestData/Courses/commonDetails';
import LEBasePage from '../../LEBasePage'

export default new class LECatalogPage extends LEBasePage {

    // Used to determine the number of courses returned
    getCatalogContainer() {
        return '[class*="catalog-module__cards_container"]>[class*="catalog-module__card"]'
    }

    getCatalogPageTitle() {
        return `[class*="banner-title-module__title"]`;
    }

    getSortDDown() {
        return `[class*="catalog__sort_dropdown"]`;
    }

    getILCCardChooseSessionBtn(ilc) {
        cy.get(`button[title="${ilc}"]`).parent().find('[class*="action-button-module__title"]').contains('Choose Session').click()
    }

    getLEMenuItems() {
        return `[class*="navigation-menu-module__navigation_menu"] li`
    }

    getSearchByNameTxtF() {
        return '[class*="text-filter-module__input___F2HCw"]'
    }

    getEnrollBtn() {
        return '[class*="action-button-module__title"]'
    }

    getCoursePalyerDetails() {
        return '[class*="course-player-module__details"]'
    }

    getCourseDetailExpandUpArrow() {
        return 'div[class*="icon-chevron-double-up"]'
    }

    getCourseDetailsTabConainer() {
        return 'div[class*="horizontal-tab-list-module__tab_container"]'
    }

    getResourcesAttachments() {
        return '[class*="attachment-module__name"]'
    }

    getResourceDescrptionArrow() {
        return '[class*="course-resourse-module__description_button___s4Z4H"]'
    }

    getResourceDescriptionContent() {
        return '[class*="sanitized_html sanitized-html-module__sanitized_container"]'
    }

    getLessonDetailsTabAndClick() {
        cy.get('[class*="horizontal-tab-module__tab"]').eq(1).click()
    }

    getCourseDetailsContent() {
        return '[class*="course-player-details-panel-module__tab_content"]'
    }

    getCourseChapters() {
        return 'div[class*="course-player-chapter-details-module"]'
    }
    getCourseNameLabel(name) {
        return `[class*="card-module__name"][title="${name}"]`
    }
    getPinIconFromMenu() {
        return '[class*="icon icon-pin"]'
    }
    getFlyOverMenuContainer() {
        return '[class="course-detail-header-module__container___EhtLT course-detail-header__container"]'
    }
    getCourseDiscoveryStartBtn() {
        return '[class="action-button-module__title___Vtjlw"]'
    }
    getShareIconFromMenu() {
        return 'span[class*="icon-share"]'
    }
    getCourseDetailsTabItem() {
        return 'div[class*="horizontal-tab-list-module"]'
    }
    getOpenMenuButtonOptions() {
        return `[class="overflow-menu-button-module__icon_and_title___WfWoQ"]`
    }

    getCoursesModal() {
        return `[class*="online-course-module__container"]`
    }

    // Added for TC # C6321
    getCourseType(type) {
        return `input[value="${type}"]`
    }

    getShowCategoriesToggle() {
        return `[class*="toggle-module__slider"]`;
    }

    getSearchVendorField() {
        return `input[placeholder="Search Vendor"]`

    }

    getSearchFilterBtn() {
        return `[class*="icon-arrow-right-go"]`;
    }

    getPageSizeModuleLoader() {
        return `[class*="page-size-button-module__loader"]`
    }

    // Added for TC # CC6323
    getCardCourse() {
        return `[class*="catalog-module__card_"]`;
    }

    getCategoryListItem() {
        return '[class*="category-list__category"]';
    }

    getDetailCourse() {
        return `[class*="panel-module__panel___ufPav panel__panel"]`;
    }

    getListCourse() {
        return `[class*="table-row-module__table_row___"]`;
    }

    getLoadMoreBtn() {
        return `[class*="page-size-button-module__btn__"]`;
    }

    // Added for TC # C6320
    getMenuItem() {
        return `[role="menuitem"]`
    }

    getCopyLinkBtn() {
        return `[class*="share-module__content"]`;
    }

    getShareModalCloseBtn() {
        return 'div[class="icon icon-x-thin"]'
    }

    getPinBtnActive() {
        return 'button[class*="course-options-module__option_active"]'
    }

    getShareCopiedMsg() {
        return 'div[class*="share-module__copy_msg"]'
    }

    getCalendarSelectedDateContainer() {
        return 'div[class*="event-calendar__date_today"]'
    }

    // Added for the TC # C6340
    getCourseDetailHeader() {
        return '[class="action-button-module__title___Vtjlw"]'
    }

    getProceedToCheckoutBtn() {
        return `[class="btn cart-review-module__submit_btn___ns_ve cart-review_submit_btn button-module__btn___svB4M"]`
    }

    getCourseModal() {
        return '[class="course-detail-header-module__container___EhtLT course-detail-header__container"]'
    }

    getCourseMenuBtn() {
        return `[class*="course-discovery-hollow-button"]`
    }

    scrollToCourseLangFilter() {
        cy.contains('Course Language').scrollIntoView()
    }

    getCourseLangFilterBtn() {
        return '[class="select-module__field___gCrbN select__field"]'
    }

    getLECourseLangFilterDDown() {
        return '[class="select-list-module__item___HDFYK"]'
    }

    getCourseLangFilterSearchFieldTxt() {
        return '[class="select-module__search___NGbxe"]'
    }

    getRemoveCourseLangFilterBtn() {
        // return '[class="icon icon-box-x-disabled"]'
        return '[class*="Component-off_screen_text-"]'
    }

    getRemoveAllCourseLangFilterBtn() {
        return '[class="icon icon-x-circle"]'
    }

    getCourselangList() {
        return '[class="select-list-module__select_list___UYA0S"]'
    }

    getCourseLoader() {
        return '[class*="loader__loader"]'
    }

    // Added for the TC# C7529
    getCourseDiscoveryModalBannerTitle() {
        return  '[class*="course-discovery-banner-module__title"]'
    }

    getCourseDiscoveryModalPrerequisiteContainer() {
        return '[class*="course-discovery-prerequisites-module__container"]'
    }

    getCourseDiscoveryModalBannerContent() {
        return '[class*="course-discovery-banner-module__content"]'
    }

    getDiscoveryImageModal() {
        return '[class*="course-discovery-posters-module__images_overlay"]'
    }

    getCourseDiscoveryCloseBtn() {
        return '[data-name="close-button"]'
    }

    getCart() {
        return '[data-name="course-discovery-start-button"]'
    }

    getDiscoveryEnrollBtn() {
        return '[title="Enroll"]'
    }

    getMenu() {
        return '[title="Open Menu"]'
    }

    getFlyOverMenu() {
        return '[class*="flyover-module__menu_container"]'
    }

    getDiscoveryReEnrollTitleBtn() {
        return '[title="Re-enroll"]'
    }

    getOpenImage() {
        return '[title="Open Image"]'
    }
    
    getTagList() {
        return '[class*="tag-list__tag_link"]'
    }

    getPosterImage() {
        return '[class*="_poster_image"]'
    }

    // Added for the TC# C7529
    getAbsorbLogoSmallBG() {
        return 'background-image: url("https://d2h5lhh71o84xd.cloudfront.net/c7a56ad9-3230-4c63-a380-bf3a60813e88/Public/Courses/b6c6904c-771f-43af-8149-592f10711ccf/Absorb%20logo%20small.png");'
    }

    getCoursePosterAt(index = 0) {
        return this.getElementByNameAttribute(`posters-${index}`)
    }

    getImagePreview() {
        return this.getElementByDataNameAttribute('image-preview')
    }

    getApplyMediaLibrary() {
        return this.getElementByDataNameAttribute('media-library-apply')
    }

    getSortByOptionsDDown() {
        return 'select[name="CatalogSortDropDown"]'
    }

    getSortByOptionItem(optionName) {
        return `select[name="CatalogSortDropDown"] > option[value="${optionName}"]`
    }
}

// Added for the TC# C7529
export const TestCourseNames = {
    "CourseWithNoPosters": 'Course with no poster' + ' ' + commonDetails.timestamp,
    "CourseWithPosters": 'Course with 5 posters' + ' ' + commonDetails.timestamp,
    "CourseWithLongName": `Course with long name${'a'.repeat(360)}..... ${commonDetails.timestamp}`,
    "CourseWithPreRequisites": 'Course with prerequisites' + ' ' + commonDetails.timestamp,
    "CourseWithPrice": 'Course with price' + ' ' + commonDetails.timestamp,
    "CourseWithReEnrollment": 'Course with re-enrollment' +' ' + commonDetails.timestamp
}