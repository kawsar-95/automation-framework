import LEBasePage from '../../LEBasePage'
import LEExternalTrainingModal from '../Modals/LEExternalTraining.modal'
import LESideMenu from '../Menu/LESideMenu'

export default new class LEDashboardPage extends LEBasePage {
    
    getPageTitle() {
        return '[class*="banner-title-module__title"]'
    }

    getPublicDashboardLoginBtn() {
        //return '[class*="header-module__login_container"]'
        //return '[class*="btn header-module__login_form_btn___1AYYg header__login_link_public button-module__btn___1lXcC"]'
         return '[class*="header__login_link_public"]'
    }

    //New elements for Next Gen LE - Feature Flag must be turned on
    getWelcomeTile() {
        return `[class*="welcome-dashboard-tile-module__tile"]`
        
    }

    getWelcomeTileTitle() {
        return `[class*="welcome-dashboard-tile-term-module__banner"]`
    }

    getProctorUsername(){
        return '[name="username"]'
    }

    getProctorPassword(){
        return '[name="password"]'
    }

    getProctorLogingButton(){
        return '[type="submit"]'
    }

    getProctorLoginSuccessfull(){
        return '.proctor-start-assessment-module__wrapper___lIjux > :nth-child(1)'
    }

    getProctorLaunchAssessment(){
        return '.proctor-start-assessment-module__wrapper___lIjux > .btn'
    }

    getProctorErrorMsgContainer(){
        return `[class*="form-info-panel-module__error_message_"]`
    }

    getProctorErrorMsg(){
        return `The username or password provided is incorrect or this user is not authorized to access this. Please try again.`
    }

    getWelcomeTileForegroundImage() {
        return `[class*="welcome-dashboard-tile-foreground-image"]`
    }

    getWelcomeTileBackgroundImage() {
        return `[class*="welcome-dashboard-tile-background-image"]`
    }

    getPublicDashboardSignupBtn() {
        cy.get('[class*="header-module__login_container"]').click()
        return '[class*="login-form__signup_btn"]'
    }
    
    getDashboardPageTitle() {
        return '[class*="sanitized_html sanitized-html-module"] > h1'
    }
    
    getGeneralDashboardTile(){
        return 'h2[title]'
    }

    getTitleforMycouses() {
        return '[title="My Courses"]'
    }

    getNavSearch() {
       return '[title="Search"]';
    }

    getSearchTxtField(){
        return '[role="none"] [placeholder="Search"]'
    }

    getNavSearchTxtF() { //use cy.get(LEDashboardPage.getNavSearchTxtF()).eq(0).type('search query').type('{enter}') to search
        return '[class*="search-header__search_input_container"]'
    }

    getSearchResultItemName() {
        return '[class*="search-result-list-items-module__search_link"]'
    }
    
    getNavMessages() {
        return '[title="Messages"]';
    }

    getNavNewMessagesIcon() {
        return '[class*="header-module__new_message_icon"]';
    }

    getNavMessagesCount() {
        return 'span[aria-hidden="true"]'      //'[class*="header-module__total_count"]';
    }

    getNextgenCourseModal(){
        return '[class*="inline-modal-container-module"]'
    }

    //Only exists if user has item in shopping cart
    getNavShoppingCart() {
        return `[class*="header-module__shopping_cart_btn"]`;
    }   
    
    getNavProfile() {
        return '[data-name="profile-link"]';
     }
    
    getNavMenu() {
        return '[title="Menu"]';
     }
     
     getUsernameTxtF() {
        return `[name="username"]`
    }

    getPasswordTxtF() {
        return `[name="password"]`;
    }

    getLoginBtn() {
        return `[data-name="login-button"][type="submit"]`;
    }

    getForgotPasswordLink() {
        return `[class*="login-form-module__forgot_password_link"]`
    }

    getHamLoginBtn() {
        return `[class*="navigation-menu-module__login_link"]`;
    }

    getMenuItems() {
        return `[class*="navigation-menu-module__navigation_menu"]`;
    }

    getMenuIcon(index) {
        return `li:nth-of-type(${index}) > [class*="navigation-menu-module__link"]`        
    }

    getAddedDashboardMenuIcon(){
        return `[class="navigation-menu-module__link_icon___dSrQC navigation-menu__link_icon"]`
    }
    //To verifiy menu icon pass the menu and icon name as an argument.
    //To verify if icon not exist pass a notExist as an argument. 
    getVerifyHamburgerMenuItemsIcon(menu,icon,notExist){
        if(notExist !== undefined){
            cy.get(this.getAddedDashboardMenuIcon()).find('img').should('not.exist')
        }
        else{
            cy.get(this.getAddedDashboardMenuIcon()).find('img').should('have.attr', 'src').should('include', `${icon}`)
        }
    }

    getLoginForm() {
        return `[class*="login-menu-module__login_form"]`;
    }   

    getLoginErrorMsg() {
        return "You have entered an invalid username and/or password. Please try again.";
    }   

    getUserPassErrorMsg() {
        return "Must contain 1 or more characters";
    }   

    getPublicDashboardBackground() {
        return `[class*="public-dashboard-module__dashboard"]`
    }

    getPrivateDashboardBackground() {
        return `[class*="private-dashboard-module__dashboard"]`
    }

    getCourseCarousel() {
        return '[class*="carousel__carousel"]'
    }

    getRibbonCardsByLabelName(name) {
        cy.get('[class*="carousel__carousel"]').contains(name).parent().parent().within(() => {
            cy.get('[class*="card-module__card"]').should('be.visible')
        })
    }

    //Pass the Ribbon label and card course name to open specific course card
    getRibbonCardByCourseNameThenClick(LabelName, CardName) {
        cy.get('[class*="carousel__carousel"]').contains(LabelName).parent().parent().within(() => {
            cy.get('[class*="card__name"]').contains(CardName).click()
        })
    }

    //Pass the Ribbon label and card course name
    verifyRibbonCardByCourseName(LabelName, courseName) {
        cy.get('[class*="carousel__carousel"]').contains(LabelName).parent().parent().within(() => {
            cy.get('[class*="card__name"]').contains(courseName).should('exist')
        })
    }

    getRibbonLabelByName(name) {
        return cy.get('[class*="card-carousel-module__title___"]').contains(name)
    }

    getRibbonLableUsingAreaLableByName(name){
        return cy.get(this.getElementByAriaLabelAttribute("View "+name))
    }

    getTile() {
        return '[class*="dashboard-tile-wrapper-module__tile"]'
    }

    getTileName() {
        return '[class*="dashboard-tile-title-module__title"]'
    }

    getLargeTileCourseTitle() {
        return `[class="course-details-extra-large-module__name___Dejsj"]`
    }

    getWhatsNextSmallTile() {
        return `[class*="dashboard-tile-wrapper__clickable tile__whatsNext"]`
    }

    getResumeTileName(){
        return `[class*="resume-dashboard-tile-module__resume_text___"]`
    }

    getSmallTileName() {
        return '[class*="dashboard-tile-title-module__title_small"]'
    }

    getResumeTile(){
        return `[class*="resume-dashboard-tile-module__inner_container"]`
    }

    getContainerByIndex(index) {
        return `div:nth-of-type(${index}) > div[class*="dashboard-container-module__section"]`
    } 

    getTileIcon() {
        return '[class*="dashboard-tile-icon"]'
    }

    getResumeTileIcon(){
        return `[class="radial-progress-bar-module__fill___lGPzu"]`
    }

    getTileDescriptionTxt() {
        return '[class*="dashboard-tile-description-module__description"]'
    }

    getTileByNameThenClick(name) {
        cy.get(this.getTileName()).contains(name).should('be.visible')
        cy.get(this.getTileName()).contains(name).click()
    }

    getTileByTitleAndTileIndex(title, index) {
        return `div:nth-of-type(${index}) > h2[title="${title}"]`
    }

    getVerifyIndexOfTile(tileName,index){
       cy.get(this.getGeneralDashboardTile()).eq(index).should('contain',tileName)
    }

    getResumeTileProgressBarIcon(){
        return `[class*="custom_icon radial-progress-bar-with-image-module"]`
    }

    //Used to find the selector in the tile with the href value and target attribute by name
    getExternalLinkTileByName(name) {
        return cy.get('[class*="dashboard-tile-module__link___"]').contains(name).parent()
    }

    //Used to find the selector in the tile with the href value and target attribute by name & index
    //Use if multiple tiles have same name
    getExternalLinkTileByLabelAndIndex(name, tabIndex) {
        return cy.get(`div:nth-of-type(${tabIndex}) > [class*="dashboard-tile-module__link___"]`).contains(name).parent()
    }
    getReEnrollBtn(){
        return '[aria-label*="Re-enroll"]'
    }
     
    getCoursestartbutton() {
        return '[class*="action-button-module__title"]'
    }
    getStartquizbutton(){
        return '[class*="button-module__btn"]'
       
    }

    getStartAssessmentButton(){
        return 'button[class*="action-button-module__btn"]'
    }

    getCompletedcoursebutton(){
        return   '[class*="course-discovery-start-button-module__btn"]'
        //return '[aria-label="Completed courseplayertestcompleted"]'
    }

    getTeststart(){
        return '[aria-label="Start proctorautomationtest"]'
    }
    getSecondstart(){
        //return '[class*="course-discovery-start-button-module__btn___2_cSH"]'
        return '[class*="course-discovery-start-button-module__btn"]'
    }

    getCourseattemptslabel(){
        return '[class*="labelled-data-module__text_center"]'
    }
    
    getBestscorelabel(){
        return '[class*="labelled-data-module__text_center"]'
    }

    getcourseplayerstatus(){
        return '[class*="course-player-progress-bar-module__progress_"]'
    }

    getStartQuizbutton(){
        //return '[class*="button-module__btn___1lXcC"]'
        return '[class="btn button-module__btn___svB4M"]'
    }

    getAssessmentStart(){
        return '[class*="action-button-module__title"]'
    }

    getQUIZiFrame(){
        //return '[class*="iframe-lesson-module__iframe___vGRYm iframe-lesson-player__iframe"]'
        return '[class*="iframe-lesson-player__iframe"]'
    }
    
    getSelectansweroption(){
        return '[class="options"]'
        //return '[aria-label="answer"]'
    }

    getTypeAnswerInput(){
        return 'textarea[class="question-input"]'
    }

    getSubmitAnswer(){
        return '[class*="assessment-btn"]'
    }

    getContinuebutton(){
        return '[class*="assessment-btn"]'
        //return '[class*="icon-arrow-forward"]'
    }
    
    getEsignaturePasswordTxtF() {
        return '[name="secret"]'
    }

    getCoursecompletionlabel(){
        return '[class="course-player-card-module__header___"]'
    }
     
    getcompletiontablelabel(){
        return '[class="full-height"]'
    }

    getcoursecompletioncardlabel(){
        return '[class*="course-player-card-module__header"]'
    }
    
    getOnLoginCourseBtns() {
        return `[class*="on-login-course-module__buttons___qwlJi on-login-course__buttons"]`;
    }
    getLogOffBtn () {
        return '.header-module__login_container___oYXfu > .btn' ;
    }

    getCatalogLoaderModule() {
        return 'div[class*="syncing-dialog-module__loader_container"]'
    }

    // Added on December 07, 2022
    getExternalTrainingHeader() {
        return '[class*="external-training-submission-module__header"]'
    }

    getBottomNote() {
         return '[class*="external-training-submission-module__note_"]'
    }

    getDateField() {
        return '[class*="redux-form-date-picker-module__field"]'
    }

    getSelectDate(dateindex) {
        return cy.get('[class="rdtDays"]').eq(dateindex).find('tbody > tr').eq(3).find('td').eq(3).click({force: true})
    }

    getNameErrorMsg() {
        return '[class*="redux-form-input-field-module__error_message"]'
    }

    getDateErrorMsg() {
        return '[class*="redux-form-date-picker-module"]'
    }

    getExternalTrainingModal() {
        return 'div[class*="modal-module__modal_inner_container"]'
    }

    apiLoginWithSessionWithoutLEAssertion(username, password, url = '/'){
        cy.session(`apiLoginWithSession${username}`, () => {
            cy.apiAuth(username, password, 'Browser').then((response) => {
                const token = response.body.token
                cy.setCookie('jwtToken', token)
            });
        });
        cy.visit(url)
        if (url === '/') {
            //cy.get(LEDashboardPage.getNavMenu(), {timeout: 60000}).should('be.visible')
        }
        cy.visit(url)
        if (url === '/admin') {
        arDashboardPage.getDismissAbsorbWalkmeBanner()
        cy.get(ARDashboardPage.getWaitSpinner()).should('exist')
        cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')
        }
        cy.visit(url)
        if (url === `/${url}`) {
    
        }
    }

    getTileNameResume() {
        return '[class*="resume-dashboard-tile-module__resume_text"]'
    }
    getCourseTitleBtn() {
        return 'button[class*="card-module__name___"]'
    }

    getPrivateDashboardContainerName() {
        return `h1[class*='dashboard-container-module__name___']`
    }

    getPrivateDashboardContainerHeaderByName(name = "") {
      return  cy.get(this.getPrivateDashboardContainerName()).contains(name)
    }

    // Added for the TC# T98581
    getOutcomesTitle(){
        return '[class*="course-outcomes-module__outcomes_title"]'
    }

    getOutcomesSec(){
        return '[class*="course-outcomes-module__outcomes_container"]'
    }

    getOutcomesBlock(){
        return '[class*="outcome-module__outcome_container"] [class*="outcome-info-module__outcome_title"]'
    }

    getOutcomesCreditLeaderBrd(){
        return '[class*="outcome-info-module__outcome_title___"]'
    }
    
    getCertificateDwnloadIcon(){
        return '[class*="icon-download-thin"]'
    }

    getOutcomesImg(){
        return '[class*="outcome-image-module__icon_container"] [class*="outcome-image-module__complete"]'
    }

    getSuccessIcon(){
        return '[class*="icon-checkmark-rounded"]'
    }

    getChevronIcon(){
        return '[class*="icon icon-arrow-down-thin outcome-module__flyout_chevron_icon"]'
    }

    getTagSec(){
        return '[class*="course-tags-module__tags_container"]'
    }

    getCollapseIcon(){
        return 'button[class*="collapse-course-player-details-button-module__collapse_btn"]'
    }

    getCompetencyHoverSec(){
        return '[class*="competency-flyover-module__button_container"]'
    }

    getRedirectModelOptionbtn(){
        return 'button[type="button"]'
    }

    getCatalogTitle(){
        return '[class*="banner-title-module__title"]'
    }

    getCourseDetailsBtn(){
        return '[data-name="toggle-course-player-details-button"]'
    }

    getOutcomeComp(){
        return '[class*="outcome-module__outcome_container"]'
    }

    getCompetencyFlyoverDetailsMenu(){
        return '[class*="competency-flyover-module__detail_menu_container"]'
    }

    getCoursePlayerCourseTitle() {
        return 'h1[class*="course-player-title-bar-module__course_title___"]'
    }
    
    // Added for the TC# C6336
    getCoursePlayerCompletedPercent(){
        return '[data-name="percentage"]'
    }

    getCoursePlayerCompletedCourseNum(){
        return '[data-name="sub-title"]'
    }

    getCrossBtn(){
        return '[class="icon icon-x-thin"]'
    }

    // Added for the TC# C6843
    getCoursePlayerCourse(){
        return '[class*="course-list-module__course_name"]'
    }

    getCoursePlayerActionBtn(){
        return '[data-name="course-discovery-start-button"]'
    }

    getLeaderboardPoint(){
        return '[class*="outcome-info-module__outcome_title"]'
    }

    getCourseEnrollBtn(course){
        return `[aria-label="Enroll ${course}"]`
    }

    getRightIcon(){
        return '[data-name="visibility-toggle"]'
    }

    getAddCurrGrp(){
        return '[data-name="add-curriculum-group"]'
    }

    getAddCourse(){
        return '[data-name="add_courses"]'
    }

    getFilteredCrossBtn(){
        return '[data-name="end-icon"]'
    }

    getPaceProgressBtn(){
        return '[data-name="edit-curriculum-pace-progress"] [data-name="toggle"]'
    }

    getPaceProgressInput(){
        return '[aria-label="Pace Progress"]'
    }

    getBillboardTile() {
        return '[class*="billboard_dashboard_tile__track"]'
    }

    verifyBillboardVisibilityByName(name, visibility=true) {
        visibility ?
            cy.get(this.getBillboardTile()).find(`[aria-label="${name}"]`).should('exist')
        :
            cy.get(this.getBillboardTile()).find(`[aria-label="${name}"]`).should('not.exist')
    }
    getTilesContainerByName(name) {
       return cy.get(`[data-name="tiles"]`).contains(name).should('exist')
    }

    getResumeTileCourseName() {
        return `[class*="resume-dashboard-tile-module__course_name___"]`
    }
    getResumeTileText() {
        return `[class*="resume-dashboard-tile-module__resume_text___"]`;
    }
    getResumeTitleHeaderContainer() {
        return '[class*="dashboard-tile-wrapper-module__tile_wrapper___"]';
    }

    addExternalTraining(tileName, externalTrainingName, coursesArray = []) {
        this.getTileByNameThenClick(tileName)
        cy.get(LEExternalTrainingModal.getCourseNameTextF(), {timeout: 3000}).type(externalTrainingName)
        cy.get(LEExternalTrainingModal.getCompletionDateTextF()).first().click()
        cy.get(LEExternalTrainingModal.getCalenderTodayDay(), {timeout: 3000}).first().click()
        cy.get(LEExternalTrainingModal.getSubmitBtn()).click()
        coursesArray.push(externalTrainingName)
    }

    verifyPageNameAndTitle(pageName, title) {
        cy.get(this.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick(pageName)
        this.getShortWait()
        cy.get(this.getLEEllipsesLoader()).should('not.exist')
        cy.title().should('include', title)
    }
}

export const privateDashboardContainerName = {
    "private_dashboard_small_tile" : "PRIVATE DASHBOARD SMALL TILE",
    "private_dashboard_medium_tile" : "PRIVATE DASHBOARD MEDIUM TILE",
    "private_dashboard_large_tile" : "PRIVATE DASHBOARD LARGE TILE",
    "private_dashboard_extra_large_tile" : "PRIVATE DASHBOARD EXTRA LARGE TILE", 
}