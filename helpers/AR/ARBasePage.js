import basePage from '../BasePage';

const toggleEnableLableArray = ['On' , 'Active' ]
const toggleDisableLableArray = ['Off' , 'Inactive']
export default class ARBasePage extends basePage {

    getAbsorbWalkMeBannerXBtn() {
        return `[id="d7db1c3d-cf00-a07f-e91b-8fd9f21bb98f"]`
    }

    getDismissAbsorbWalkmeBanner() {
        cy.get('body').then(($body) => {
            if ($body.get().includes(this.getAbsorbWalkMeBannerXBtn())) {
                cy.get(this.getAbsorbWalkMeBannerXBtn()).click({ force: true })
            } else {
                cy.get(this.getWaitSpinner() , {timeout: 150000}).should('not.exist')
                cy.addContext('Absorb WalkMe Banner does not appear')

            }
        })
    }

    //Impersonation Banner
    getImpersonationBannerMessage() {
        return `[class*="_container_qw"]`
    }

    getStopImpersonationBtn() {
        return this.getElementByDataNameAttribute('stop-impersonating')
    }

    getRemoveFilterBtn() {
        return "button[title='Remove All']"
    }

    // Page Header Title
    getPageHeaderTitle() {
        return 'h1[data-name="title"]'
    }

    getAccountHeaderLabel() {
        return '#edit-content-wrapper [class*="section-title"]'
    }

    getClientName() {
        return 'div[data-name="client_name"]';
    }

    getToastMessage() {
        return 'div[class*="toasts-module"]'
    }

    //------------------------------ Modal Specific Elements ------------------------------ //
    //returns modal when you need to define elements within a modal because more than one is returned
    getModal() {
        return '[class*="_dialog_"]'
    }

    getModal2() {
        return '[class*="_dialog_"]:nth-of-type(2)'
    }

    getA5Modal() {
        return '[class="modal"]'
    }

    getModalSaveBtn() {
       return '[data-name="save"]'
    }

    getModalTitle() {
        return `[data-name="dialog-title"]`
    }

    // This method gets and clicks the button inside a confirm modal.
    getConfirmModalBtnByText(btnText) {
        return cy.get(this.getElementByDataName("confirm"), {timeout: 10000}).should('have.text', btnText).click()
    }

    //Loading spinner for file uploads etc.
    getWaitSpinner() {
        return `[data-name="loading-spinner"]`
    }

    getNotificationBanner() {
        //return '[class*="notification-banner-module__notification"]'
        return '[data-name="enrollmentFilter"] > [data-name="control_wrapper"] [aria-label="Notification"]'
    }

    getAutomaticEnrollmentNotificationBanner() {
        //return '[class*="notification-banner-module__notification"]'
        // return '[data-name="enrollmentFilter"] > [data-name="error"]'
        return '[data-name="enrollmentFilter"] > [data-name="control_wrapper"] [aria-label="Notification"]'
    }

    getLockDepartmentNotificationBanner() {
        return '[data-name="locked-department-form"] [aria-label="Notification"]'
    }

    getLockDepartmentErrorNotification() {
        return '[data-name="locked-department-form"] [data-name="error"]'
    }

    //Returns general text field class
    getTxtF() {
        return '[class*="_text_input"]'
    }

    getDescriptionTxtF() {
        return this.getElementByDataNameAttribute("description") + ' ' + this.getWSIWYGTxtF()
    }

    getOCDescriptionTxtFToolBar(){
        return `[data-name="edit-online-course-general"] [class*="fr-toolbar"]`
    }

    getILCDescriptionTxtFToolBar(){
        return `[data-name="edit-instructor-led-course-general"] [class*="fr-toolbar"]`
    }

    getCBDescriptionTxtFToolBar(){
        return `[data-name="edit-course-bundle-general"] [class*="fr-toolbar"]`
    }

    getCURRDescriptionTxtFToolBar(){
        return `[data-name="edit-curriculum-general"] [class*="fr-toolbar"]`
    }

    getGeneralLanguageDDown() {
        return '[data-name="languageCode"] [data-name="field"]'
    }

    getGeneralLanguageDDownOpt() {
        return '[role="option"]';
      }

    //Returns general text area field
    getTextAreaF() {
        return '[class*="_text_area"]'
    }

    //Returns general number field class
    getNumF() {
        return '[class="_input_19krc_4"]'
    }

    //Returns general selector for dropdown field
    getDDown() {
        //return '[class*="select-option-value-module__label"]'
        return '[data-name="field"]'
    }

    // Returns the selector for Drop down search text field
    getDDownSearchTxtF() {
        return '[data-name="list-content"]';
    }

    getDDownOpt() {
       // return '[class="_label_ledtw_62"]'
       return `[class*="_select_option_"]`
    }

    getDDownNoResults() {
        return '[class*="_no_matches_1snj7_9"]'
    }

    getUnsavedChangesHeaderTxt() {
        return "#discard-changes-message"
    }

    // This is used in conjuction with the Toggle container to either returned a disabled toggle or enabled toggle
    getToggleDisabled() {
        return this.getElementByDataNameAttribute("disable-label")
    }
    getCancelDisableBtn(){
        return 'div [class*="_child_fzet5_8"] [data-name="cancel"]'
    }

    getHeaderLabel() {
        return this.getElementByDataNameAttribute("header")
    }
    getStatusFieldText() {
        return '[class*="description"]'
    }

    getToggleEnabled() {
        return this.getElementByDataNameAttribute("enable-label")
    }

    getChapterNameToggleText() {
        return this.getElementByDataNameAttribute("no_lessons")
    }
    getCompetenciesToggleText() {
        return this.getElementByDataNameAttribute("no-course-competencies")
    }

    //Can be used to check the aria-checked attribute to assert if a toggle is ON or OFF
    getToggleStatus() {
        return this.getElementByDataNameAttribute("checkbox")
    }

    // Radio Button Selector
    getRadioBtn() {
        return this.getElementByDataNameAttribute("radio-button")
    }

    // Toggle Button Selector
    getToggleBtn() {
        return this.getElementByDataNameAttribute("toggle")
    }

    getToggleBtnSlider() {
        return this.getElementByDataNameAttribute("toggle-button")
    }

    /*
      - This is general method to toggle on and off with initial check for the AR toggles such as the ones in Add/Edit OC,ILC,CURR or CB pages
      - Pass the container of toggle as element to specify the toggle 
      - To turn on the toggle button pass argument as 'true', to turn of the toggle btn pass the argument as 'false'
    */

    generalToggleSwitch(value, element){
        this.getShortWait()
        cy.get(this.getElementByDataNameAttribute(element) +' '+this.getToggleStatus()).invoke('attr','aria-checked').then((status) =>{
            if(status === value){
                cy.get(this.getElementByDataNameAttribute(element) +' '+this.getToggleStatus()).should('have.attr', 'aria-checked', value)
            }
            else{
                cy.get(this.getElementByDataNameAttribute(element) +' '+this.getToggleStatus()).parent().within(()=>{
                    cy.get(this.getToggleBtnSlider()).click()
                }) 
                this.getVShortWait()
                cy.get(this.getElementByDataNameAttribute(element) +' '+this.getToggleStatus()).should('have.attr', 'aria-checked', value)
            }
        })
    }



    /**
    * This method is used to get actions buttons by title.
    * The method takes a string title exactly the way it is displayed on the front end and returns the selector for the menu option.
    * @param {String} title
    */
    getActionBtnByTitle(title) {
        return `button[title="${title}"]`
    }

    getActionBtnByLevel() {
        return '[class*="_context_menu_"]'
    }

    getDeleteCreditBtn(){
        return '[title= "Delete"]'
    }

    // This method is used to get an element in the DOM with the specified data name attribute.
    getElementByDataName(dataName) {
        return `[data-name="${dataName}"]`
    }


    // Common Selector
    getPickerBtn() {
        return '[data-name*="rule"] [data-name="select"][type="button"]'
    }

    // Common button icons (use with data-name or inside a within() function)

    getSaveDiskBtn() {
        return `[class*="icon icon-disk"]`;
    }

    getBackIconBtn() {
        return `[class*="icon icon-arrow-back"]`;
    }

    getCancelIconBtn() {
        return '[class*="icon icon-no"]'
    }

    getPlusBtn() {
        return '[class*="icon icon-plus"]'
    }

    getRemoveBtn() {
        return 'Remove All'
    }

    getCheckMarkBtn() {
        return '[class*="icon icon-checkmark"]'
    }

    getDblCheckBtn() {
        return '[class*="icon icon-box-check-double"]'
    }

    getGripBtn() {
        return '[class*="icon icon-grip"]'
    }

    getFolderBtn() {
        return '[class*="icon icon-folder"]'
    }

    getCaretUpBtn() {
        return '[class*="icon icon-caret-up"]'
    }

    getCaretDownBtn() {
        return '[class*="icon icon-caret-down"]'
    }

    // Common method to get button of type submit
    getSubmitBtn() {
        return 'button[type="submit"]'
    }

    // Common Add Action Menu elements
    getSaveBtn() {
        return `button[data-name="submit"]`
    }

    // Common Edit Action Menu elements
    getPublishBtn() {
        return `button[data-name="submit"]`
    }

    getCancelBtn() {
        return `button[data-name="cancel"]`
    }

    getQuickPublishBtn() {
        return 'button[data-name="quick-save"]'
    }

    getViewHistoryBtn() {
        return `button[data-name="view_history"]`
    }

    getDeselectBtn() {
        return 'span[class*="icon icon-no"]'
    }

    getIntelligentAssistTxtF() {
        return "[class*=_text_input]";
    }

    getIntelligentAssistBtn() {
        return "[data-name=open-button]";
    }

    getIntelligentAssistRes() {
        return "[class*=_search_suggestion_items]";
    }

    getIntelligentAssistResTitle() {
        return "[class*=_title]";
    }

    getIntelligentAssistResFilter() {
        return "[data-name=search-suggestion-filter]";
    }

    getIntelligentAssistResFilterList() {
        return "[class*=_filters_list]";
    }

    getErrorMsg() {
        return this.getElementByDataNameAttribute("error")
    }

    // Report Grid Elements

    // ----- Filter Elements -----
    getAddFilterBtn() {
        return 'button[aria-label="Add Filter"]:first-child';
    }

    getFilterEndBtn() {
        return "[data-name=filter-end]";
    }

    getFilterCloseBtn(btnIndex = 1) {
        return `div:nth-of-type(${btnIndex}) > ` + `${this.getFilterEndBtn()}` 
    }

    //Filter close button
    getFilterCloseButton() {
        return `[class*="data-filter-item-module__end_icon"]`;
    }

    getEditFilterBtn() {
        return '[title="Edit Filter"]';
    }

    getDataFilterEditorUpdateBtn() {
        return '[class*="_content_4"]';
    }

    getFilterDatePickerBtn() {
        return '[class*="icon icon-calendar"]';
    }

    getRefineBtn() {
        return "Refine";
    }

    // Report Table Header Elements

    getDDownField() {
        return ' [class="_end_7teu8_24"]'
    }
    getDDownFieldII() {
        return '[data-name="select-field"]'
    }

    getRowSelectOptionsBtn() {
        return '[title="Row Select Options"]';
    }

    getRowSelectOption() {
        return  `Row Select Options`;
    }

    getRowSelectOpt() {
        return '[class = "_menu_item_ot59d_16"]'
    }

    getSelectThisPageOption() {
        return "select-page";
    }

    getSelectThisPageOptionBtn() {
        return '[data-name="select-page"]'
    }

    getGenerateReportFileBtn() {
        return 'button[aria-label="Generate Report File"][data-name="generate-report"][title="Generate Report File"]';
    }

    getPrintReportBtn() {
        return;
    }

    getScheduleReportBtn() {
        return 'button[aria-label="Schedule Report"][data-name="schedule-report"][title="Schedule Report"]';
    }

    getShareReportBtn() {
        return 'button[aria-label="Share Report"][data-name="share-report"][title="Share Report"]';
    }

    getSetOrganizationDefaultBtn() {
        return "Set Organization Default";
    }

    getReportsLayoutBtn() {
        return "Report Layouts";
    }

    getDisplayColumns() {
        return '[class*="icon icon-list"]' //use .click({force:true}) when clicking on AR report page
    }

    getChkBoxLabel() {
        // return '[class*="checkbox-module__label"]'
        return '[class*="_checkbox_1yld4_47"]'
    }

    getGridTable() {
        return 'tbody > tr'
    }

    getFooterCount() {
        return '[data-name="grid-result-summary"]'
    }

    getItemsPerPageDDown() {
        return '[class*="_single_select_"]'
    }

    /**
     * Use this selector in addition to the getDDownField selector to select Property Name dropdown.
     * Note: This selector cannot be used on it's own
     */
    getPropertyName() {
        return '[data-name="field"]';
    }

    getPropertyNameDDownOpt() {
        return '[data-name="options"] [role="option"]'
    }

    /**
     * An alternate implementation of getPropertyNameDDownOpt that
     * does not couple to an element's CSS class name.
     */
    getPropertyNameDDownOpt2() {
        return '[data-name="data-filter-menu"] [data-name="options"] li';
    }

       getOperatorNameDDownOpt() {
        return '[aria-label="Operator"] [role="option"]'
    }

    getSelectedPropertyNameOpt() {

         return '[class*="_select_option_ledtw_1 _selected_ledtw"]'
        
     }

    getPropertyNameDDownSearchTxtF() {
        return 'input[aria-label="Property"]';
    }

    getSendBtn() {
        return 'submit'
    }

    /**
     * Use this selector in addition to the getDDownField selector to select Operator dropdown.
     * Note: This selector cannot be used on it's own
     */
    getOperator() {
        return '[data-name="field"]'
    }

    getOperatorWithoutValue() {
        return '[class="_select_7teu8_4 _filter_editor_19v66_32 _below_7teu8_58"] '
    }

    getOperatorSearchTxtF() {
        return 'input[aria-label="Operator"]';
    }

    getOperatorDDownOpt() {
        return '[class="_option_1mq8e_10"]';
    }

    getValueTxt() {
        return "Value";
    }

    getDateF() {
        return "Date";
    }

    getDepartmentF(){
        return 'Department'
    }

    getSelectDeptToggleBtn(){
        return '[class*="_toggle_ghc15_29 icon icon-caret-right"]'
    }

    getDeptDDown(){
        return 'ul[role="tree"] li[data-name="hierarchy-tree-item"]'
    }

    getLabel() {
        return '[data-name="label"]'
    }

    getLoadingSpinner() {
        return '[data-name="loading-spinner"]'
    }

    getDeptGroupDDown(){
        return 'ul[role="group"] li[data-name="hierarchy-tree-item"]'
    }

    verifyDepartmentsAppearAlphabeticalOrder(){
        cy.get(this.getDeptGroupDDown() + " " + this.getLabel()).filter(":lt(10)").then($elements => {
            const strings = [...$elements].map(el => el.innerText.trim().toLowerCase())
            cy.wrap(strings).should('deep.equal', [...strings].sort())
        })
    }

    getIconCaretRight(){
        return '[class*="icon icon-caret-right"]'
    }

    expandDeptByName(deptName) {
        cy.get(this.getDeptDDown()).contains('div', deptName).siblings(this.getIconCaretRight()).click()
        cy.get(this.getLoadingSpinner()).should('not.exist')
    }

    verifyDeptSelectedOrNotByName(deptName, value) {
        cy.get(this.getDeptDDown()).contains('div', deptName).parent().parent().should('have.attr', 'aria-selected', value)
    }

    getSubmitDeptBtn() {
        return '[class*="_child_1o8lk_11"] [class*="_button_4zm37_1"]'
    }

    getSubmitAddFilterBtn() {
        return '[data-name="submit-filter"]';
    }

    getSubmitCancelFilterBtn() {
        return '[data-name="cancel"]';
    }

    getTableCellRecord() {
        return 'tbody tr[role="row"]';
    }

    getNoResultMsg() {
        return 'span[data-name="message"]'
    }

    getNotResultFoundMsg() {
        return '[class="no-results-message"]'
    }

    getTableCellName(columnIndex = 2) {
        return `[class*="_grid_row"] td:nth-of-type(${columnIndex})`
    }

    getEnrollmentPageDDownOpt() {
        return '[role="option"]'
        //'[class*="_option_1mq8e_10"]'
    }

    getEnrollmentPageSearchTxtF() {
        return '[data-name="list-content"] [data-name="input"]'
    }

    getEnrollmentPageSearchTxtFII() {
        return '[data-name="select-root"] [data-name="select-field"]'
    }

    getToastSuccessMsg() {
        return '[class*="Toastify__toast--success"]'
    }

    getToastErrorMsg() {
        return '[class*="Toastify__toast--error"]'
    }

    getToastCloseBtn() {
        return '[class*="_icon_button_1f7i9"]'
    }



    /**
    * This method/function is used to get any of the Add & Edit actions menu items on the right hand side of the User's page.
    * The method/function takes a string label exactly the way it is displayed on the front end and returns the selector for the actions menu option 
    * @param {String} name The desired action menu option.
    * Example: Use getAddEditMenuActionsByName('Add User') to get the selector for the Add User Action menu option
    */
    getAddEditMenuActionsByName(name) {
        return `button[title="${name}"]`
    }

    /**
    *  A5 Common elements (Temporary elements)
    *  These were created to use the pages in A5 that were not yet implemented in AR to complete some test workflows.
    *  These elements will be deleted as soon as the pages where they are used are created in AR 
    */
    getA5PageRoot() {
        return `[id="wrapper"]`
    }

    getA5ChkBoxLabel() {
        return `[data-bind="term: Title, attr: { 'for': DisplayProperty() + '-column-visible-checkbox' }"]`
    }
    getCheckboxList() {
        return '[class*="_checkbox_1yld4_47 _checkbox_"]'
    }

    getA5TableCellRecord() {
        return 'tbody > tr';
    }

    getA5PageHeaderTitle() {
        return 'div#content  .section-title';
    }

    getA5SaveBtn() {
        return `div#sidebar-content > .btn.has-icon.large.submit-edit-content.success`
    }

    getA5CancelBtn() {
        return `div#sidebar-content > .btn.cancel.cancel-edit-content.has-icon.large.margin-bottom-30`
    }
    getUnsavedChangesCancelBtn() {
        return 'div[class*="_child_fzet5_8"] button[data-name="cancel"]'
    }

    getA5AddFilterBtn() {
        return `[title="Add Filter"]`
    }

    getAddFilterResourcesBtn() {
        return `[data-name="add-filter"]`
    }
    getA5PropertyNameDDown() {
        return `[class*="property-select-dropdown"]`
    }

    getA5OperatorDDown() {
        return `[class="operator-select"] > select`
    }

    getA5ValueTxtF() {
        return `.value-select [type]`
    }

    getA5SubmitAddFilterBtn() {
        return `.full-width.margin-bottom-10 > span:nth-of-type(2)`
    }

    getA5MenuActions() {
        return `#sidebar-content [href]`;
    }


    getA5NoResultMsg() {
        return '.grid > div:nth-of-type(2)';
    }

    getA5ClientName() {
        return 'div[class="company-name"';
    }

    getA5ConfirmBtn() {
        return `[data-bind="text: ConfirmText"]`
    }


    // Use this text as value for data-name attribute to get this element
    getTimeZoneMsg() {
        return 'time-zone-message'
    }

    /**
   * This method/function is used to get any of the Edit actions menu items on the right hand side of the Poll's page.
   * The method/function takes a string label exactly the way it is displayed on the front end and returns the selector for the actions menu option
   * @param {String} name The desired action menu option.
   * Example: Use getAddEditMenuActionsByName('Add Tag') to get the selector for the Add Venue Action menu option
   */
    getA5AddEditMenuActionsByNameThenClick(name) {
        cy.get(this.getA5MenuActions() , {timeout:15000}).should('be.visible')
        cy.get(this.getA5MenuActions() , {timeout:15000}).filter(`:contains(${name})`).click({ force: true });
    }



    getA5AddEditMenuActionsByIndex(index = 1) {
        return `div#sidebar-content > a:nth-of-type(${index})`;
    }

    getA5AddEditMenuActionDeleteBtn() {
        return `#sidebar-content > .custom-content`
    }
    //Updated for AR 
    getARAddEditMenuActionsByIndex(index = 1) {

        return ` [class*='context-menu-module__context_menu']`;
    }

    getTableCellContentByIndex(columnIndex = 4) {
        return `tr > td:nth-of-type(${columnIndex})`;
    }

    // ------------------ Function ---------------------

    selectTableCellRecord(name, columnIndex = 2) {
        cy.get(this.getTableCellContentByIndex(columnIndex)).should('contain', name)
        cy.get(this.getTableCellContentByIndex(columnIndex)).contains(name).click()
        cy.get(this.getWaitSpinner()).should('not.exist')
    }

    selectTableCellRecordUsers(name, columnIndex = 4) {
        cy.get(this.getTableCellContentByIndex(columnIndex)).should('contain', name)
        cy.get(this.getTableCellContentByIndex(columnIndex)).contains(name).click()
        cy.get(this.getWaitSpinner()).should('not.exist')
    }

    selectTableCellRecordByIndexAndName(name, columnIndex) {
        cy.get(this.getTableCellContentByIndex(columnIndex)).should('contain', name)
        cy.get(this.getTableCellContentByIndex(columnIndex)).contains(name).click()
        cy.get(this.getWaitSpinner()).should('not.exist')
    }

    selectActionBtnByLevel(label) {
        cy.get(this.getActionBtnByLevel()).filter(`:contains(${label})`).click();
    }

    verifyTableCellRecord(name) {
        cy.get(this.getTableCellName()).contains(`${name}`).should(`be.visible`);
    }

    verifyTableCellRecordDoesNotExist(name) {
        if (cy.get(this.getNoResultMsg()).should('have.text', "No results found.")) {
            return true;
        }
        cy.get(this.getTableCellName()).contains(`${name}`).should(`not.exist`);
    }

    // This method is used to click on the report action button based on the passed action button name.
    reportItemAction(action) {
        cy.wrap(this.WaitForElementStateToChange(this.getActionBtnByTitle(action)))
        cy.get(this.getActionBtnByTitle(action)).should('have.text', action).click()
    }

    selectA5TableCellRecord(name) {
        this.getLShortWait()
        cy.get(this.getA5TableCellRecord()).filter(`:contains(${name})`).first().click();
        cy.get(this.getWaitSpinner()).should('not.exist')
    }

    getA5TableCellRecordByColumn(columnIndex) {
        return `tr > td:nth-of-type(${columnIndex})`;
    }
    getA5ValueDDown() {
        return `[class="value-select"] > select`
    }

    getA5WaitSpinner(){
        return '[id="grid-spinner"] [class="spinner"]'
    }

    A5AddFilter(propertyName, Operator = null, Value = null) {
        this.getShortWait()
        cy.get(this.getA5AddFilterBtn(), {timeout:10000}).scrollIntoView().should('be.visible')
        cy.get(this.getA5AddFilterBtn()).scrollIntoView().click()
        cy.get(this.getA5PropertyNameDDown()).select(propertyName);
        if (Value != null && Operator == null) {
            cy.get(this.getA5ValueDDown()).select(Value)
        }
        if (Value != null && Operator != null) {
            cy.get(this.getA5OperatorDDown()).select(Operator);
            cy.get(this.getA5ValueTxtF()).type(Value);
        }
        cy.get(this.getA5SubmitAddFilterBtn()).click();
        cy.get(this.getA5SubmitAddFilterBtn(), {timeout:10000}).should('not.exist')
    }

    getChooseDDownSearchTxtF(){
        return '[class*="_search_"] [data-name="input"]'
     }

     getChooseFilterIIContainer(){
        return `[data-name="data-filter-menu"]`
     }

    //If passing a date as the Value, use Format '2021-09-29'
    AddFilter(propertyName, Operator = null, Value = null) {
        if (Value == null) {
            cy.get(this.getWaitSpinner(), { timeout: 20000 }).should('not.exist')
            cy.get(this.getAddFilterBtn() , {timeout:20000}).should('be.visible').click();
            cy.get(this.getPropertyName() + this.getDDownField()).eq(0).click();
            cy.get(this.getPropertyNameDDownSearchTxtF()).type(propertyName)
            cy.get(this.getPropertyNameDDownOpt()).contains(new RegExp("^" + propertyName + "$", "g")).click()
            cy.get(this.getOperator() + this.getDDownField()).eq(1).click();
            cy.get(this.getOperatorDDownOpt()).contains(Operator).click({ force: true });
            cy.get(this.getSubmitAddFilterBtn()).click();
            cy.get(this.getWaitSpinner(), { timeout: 20000 }).should('not.exist')
        } else if (Value != null && Operator == null) {
            cy.get(this.getWaitSpinner(), { timeout: 20000 }).should('not.exist')
            cy.get(this.getAddFilterBtn() , {timeout:20000}).should('be.visible').click();
            cy.get(this.getPropertyName() + this.getDDownField()).click();
            cy.get(this.getPropertyNameDDownSearchTxtF()).type(propertyName)
            cy.get(this.getPropertyNameDDownOpt()).contains(new RegExp("^" + propertyName + "$", "g")).click()
            cy.get(this.getElementByAriaLabelAttribute(this.getValueTxt())).type(Value)
            cy.get(this.getSubmitAddFilterBtn()).click();
            cy.get(this.getWaitSpinner(), { timeout: 20000 }).should('not.exist')
        }else if(Value != null && Operator === "Role") {
            cy.get(this.getWaitSpinner(), { timeout: 20000 }).should('not.exist')
            cy.get(this.getAddFilterBtn() , {timeout:20000}).should('be.visible').click();
            cy.get(this.getPropertyName() + this.getDDownField()).eq(0).click();
            cy.get(this.getPropertyNameDDownSearchTxtF()).type(propertyName)
            cy.get(this.getPropertyNameDDownOpt()).contains(new RegExp("^" + propertyName + "$", "g")).click()
            cy.get(this.getElementByDataName("selection")).contains('Choose').click()
            cy.get(this.getChooseDDownSearchTxtF()).last().type(Value);
            cy.get(this.getElementByAriaLabelAttribute('Roles')+' '+this.getDDownOpt()).contains(Value).click()
            cy.get(this.getChooseDDownSearchTxtF()).last().click({force: true})
            cy.get(this.getSubmitAddFilterBtn()).click({force: true});
            cy.get(this.getWaitSpinner(), { timeout: 20000 }).should('not.exist')
        }
        else {
            cy.get(this.getWaitSpinner(), { timeout: 20000 }).should('not.exist')
            cy.get(this.getAddFilterBtn() , {timeout:20000}).should('be.visible').click();
            cy.get(this.getPropertyName() + this.getDDownField()).eq(0).click();
            cy.get(this.getPropertyNameDDownSearchTxtF()).type(propertyName)
            cy.get(this.getPropertyNameDDownOpt2()).contains(new RegExp("^" + propertyName + "$", "g")).click()
            cy.get(this.getOperator() + this.getDDownField()).eq(1).click();
            cy.get(this.getOperatorSearchTxtF()).type(Operator);
            cy.get(this.getOperatorDDownOpt()).contains(Operator).click();
            if (propertyName.includes('Date')) {
                cy.get(this.getElementByAriaLabelAttribute(this.getDateF()) + ' ' + this.getFilterDatePickerBtn()).click()
                this.getSelectDate(Value)
            } else if(propertyName.includes('Department')){
                cy.get(this.getElementByAriaLabelAttribute(this.getDepartmentF())).click()
                cy.get(this.getElementByAriaLabelAttribute('Search')).type(Value)
                cy.get(this.getDeptDDown()).contains(Value).click()
                cy.get(this.getSubmitDeptBtn()).contains('Choose').click()
            }
            else {
                cy.get(this.getElementByAriaLabelAttribute(this.getValueTxt())).type(Value)
            }
            cy.get(this.getSubmitAddFilterBtn()).click();
            cy.get(this.getWaitSpinner(), { timeout: 20000 }).should('not.exist')
        }
    }

    UpdateFilter(filterByItem = null, propertyName = null, Operator = null, Value = null) {
        cy.get(this.getEditFilterBtn).contains(filterByItem).click()
        if (propertyName !== null) {
            cy
                .get(this.getPropertyName() + this.getDDownField()).click()
                .get(this.getPropertyNameDDownSearchTxtF()).type(propertyName)
                .get(this.getOperatorDDownOpt()).contains(propertyName).click()
        }
        if (Operator !== null) {
            cy
                .get(this.getOperator() + this.getDDownField()).eq(1).click()
                .get(this.getOperatorSearchTxtF()).type(Operator)
                .get(this.getOperatorDDownOpt()).contains(Operator).click();
        }
        if (Value !== null) {
            cy.get(this.getElementByAriaLabelAttribute(this.getValueTxt())).clear().type(Value)
        }
        cy.get(this.getDataFilterEditorUpdateBtn()).contains('Update Filter').click()
        cy.get(this.getWaitSpinner(), { timeout: 20000 }).should('not.exist')
    }

    EnrollmentPageFilter(name) {
        cy.get(this.getWaitSpinner()).should('not.exist')
        cy.title().then((title)=>{
            if (title === 'Course Activity - Absorb LMS'){          
                cy.get(this.getDDownFieldII()).click();
                cy.get(this.getEnrollmentPageSearchTxtFII()).type(name)
            }
            else{
                cy.get(this.getDDownField()).click();
                cy.get(this.getEnrollmentPageSearchTxtF()).type(name)
            }
        })
        cy.get(this.getEnrollmentPageDDownOpt()).contains(name).click();
        cy.get(this.getSubmitAddFilterBtn()).click();
        cy.get(this.getWaitSpinner()).should('not.exist')   
    }

    MandatoryReportFilter(name) {
        cy.get(this.getDDownField()).click();
        cy.get(this.getEnrollmentPageSearchTxtF()).type(name)
        cy.get(this.getEnrollmentPageDDownOpt()).contains(name).click();
        cy.get(this.getSubmitAddFilterBtn()).click();
    }

    WaitForElementStateToChange(element, intTimeout = 500) {
        //get the initial value of your object
        //intTimeout = 500
        cy.get(element).invoke('attr', 'aria-disabled').then($initialVal => {
            //It's better if you can do your click operation here

            //Wait untill the element changes
            cy.get(element).then($newVal => {
                cy.waitUntil(() => $newVal[0].value !== $initialVal, {
                    //optional timeouts and error messages
                    errorMsg: "was expeting some other Value but got : " + $initialVal,
                    timeout: 10000,
                    interval: 500
                    //interval: 12000
                }).then(() => {
                    cy.log("Found a difference in values")
                })
            })
            cy.wait(intTimeout)
        })
    }

    A5WaitForElementStateToChange(element, intTimeout = 500) {
        cy.get(element).then($newVal => {
            cy.waitUntil(() => $newVal, {
                //optional timeouts and error messages
                errorMsg: "was expeting some other Value but got : " + $newVal,
                timeout: 10000,
                interval: 500
            }).then(() => {
                cy.log("Found a difference in values")
            })
        })
        cy.wait(intTimeout)
    }

    //------------------- For DatePicker -------------------//

    getMonthDDOwn() {
        return '[title="Select Month"]'
    }
    getYearDDOwn() {
        return '[title="Select Year"]'
    }

    getCalendarMonthTable() {
        return '[class*="CalendarMonth_table"]'
    }

    getActiveTable() {
        return '[class*="CalendarMonthGrid_month"]'
    }

    getCalendarDay() {
        return '[class*="CalendarDay"]'
    }

    getCalenderMonthBackBtn() {
        return '[class*="DayPickerNavigation_leftButton__horizontalDefault"]'
    }

    getCalenderMonthFwdBtn() {
        return '[class*="DayPickerNavigation_rightButton__horizontalDefault"]'
    }

    //The calendar btn will need to be clicked before using this function. (ex. getStartDatePickerBtn in ARILCAddEditPage)
    //Selects a date from the datepicker. Pass in a timestamp with YYYY-MM-DD format (ex. '2021-10-08T13:34:16-06:00' OR '2021-10-08')
    getSelectDate(date) {
        cy.get(this.getMonthDDOwn()).select(parseInt(date.slice(5, 7)) - 1)
        cy.get(this.getYearDDOwn()).select(date.slice(0, 4))
        cy.get(this.getCalendarMonthTable()).eq(1).within(() => { //use .eq(1) here as cypress always finds 3 month tables (prev, current, next)
            cy.get(this.getCalendarDay()).contains(parseInt(date.slice(8, 10))).click({ force: true })
        })
    }

    //Used to select a single day in the current displayed month
    getCalenderSelectSingleDay(day) {
        cy.get(this.getCalendarMonthTable()).eq(1).within(() => { //use .eq(1) here as cypress always finds 3 month tables (prev, current, next)
            cy.get(this.getCalendarDay()).contains(parseInt(day)).click({ force: true })
        })
    }

    //------------------- For TimePicker -------------------//
    getHourIncrementBtn() {
        return 'button[data-name="hour-increment-button"]'
    }

    getHourDecrementBtn() {
        return 'button[data-name="hour-decrement-button"]'
    }

    getDisplayHourTxtF() {
        return '[name="hour"]'
    }

    getMinuteIncrementBtn() {
        return 'button[data-name="minute-increment-button"]'
    }

    getMinuteDecrementBtn() {
        return 'button[data-name="minute-decrement-button"]'
    }

    getDisplayMinuteTxtF() {
        return '[data-name="display-minute"]'
    }

    getAmPmIncrementBtn() {
        return 'button[data-name="am-pm-increment-button"]'
    }

    getAmPmDecrementBtn() {
        return 'button[data-name="am-pm-decrement-button"]'
    }

    getDisplayAmPmTxtF() {
        return '[data-name="display-am-pm"]'
    }

    /**
     * This function selects the time when a date/time filter/rule is selected.
     * @param {Int} hour 
     * @param {Int} minutes 
     * @param {String} ampm 
     */
    SelectTime(hour, minutes, ampm) {
        cy.get('[aria-label="Hours"]').invoke('val').then((val) => {
            let varHour = val
            let varHourDiff = parseInt(varHour) - hour

            if (varHourDiff != 0) {
                for (var i = 0; i < varHourDiff; i++) {
                    cy.get(this.getHourDecrementBtn()).click()
                }
            }
        })

        cy.get('[aria-label="Minutes"]').invoke('val').then((val) => {
            let varMin = val
            let varMinDiff = parseInt(varMin) - minutes

            if (varMinDiff != 0) {
                for (var j = 0; j != varMinDiff; j--) {
                    cy.get(this.getMinuteIncrementBtn()).click()
                }
            }
        })

        /**
        * This needs to be separate because there are scenarios where changing the hour changes the am/pm
        * Need to find the final am/pm once changing the hour and minutes are complete
        */
        cy.get('[aria-label="AM/PM"]').invoke('text').then((text) => {
            let varAmPm = text
            if (varAmPm != ampm) {
                cy.get(this.getAmPmIncrementBtn()).click()
            }
        })
    }
    getToastNotificationMsg() {
        return '[class*="Toastify__toast-body"]'
    }
    getModalFooter() {
        return '[class*="modal_footer"]'
    }
    getListItem() {
        return 'ul > li';
    }
    getTableHeader() {
        return 'tr > th'
    }
    getDisplayColumnsList() {
        return 'div[data-name="expanded-content"][aria-label="Display Columns"]'
    }
    getBoldBtn() {
        return '[id^=bold-]'
    }
    getItalicBtn() {
        return '[id^=italic-]'
    }
    getUnderlineBtn() {
        return '[id^=underline-]'
    }
    getA5FilterItem() {
        return '[class="filter-item applied"]'
    }
    getTableDisplayColumnBtn() {
        return 'button[aria-label="Display Columns"][title="Display Columns"]'
    }
    getDisplayColumnListContainer() {
        return 'div[aria-label="Display Columns"]'
    }
    getDisplayColumnItemByName(name) {
        return `label[class*="_checkbox_1yld4_47"] > span[class*="_label_1yld4_121"]:contains(${name})`
    }
    getCreateLayoutModalSaveBtn() {
        return '[data-name="save"][class="_button_4zm37_1 _success_4zm37_44"][type="submit"]'
    }
    getMenu(name) {
        return this.getElementByAriaLabelAttribute(name)
    }
    getPinReportBtn() {
        return 'button[data-name="pinned-layout"]'
    }
    getSavedReportLayout() {
        return 'button[data-name="saved-layouts"]'
    }
    getMenuItemSubtitle() {
        return 'div[data-name="subtitle"]'
    }
    getFavoriteBtn() {
        return 'button[aria-label="Set as favorite"][data-name="favourite-action"][title="Set as favorite"]'
    }
    getSavedLayoutLabel() {
        return '[class="_label_19x82_12"]'
    }
    getSavedLayoutDeleteBtn() {
        return 'button[data-name="delete-action"]'
    }
    getUploadFileDialog() {
        return 'div[class="_dialog_ixjmy_1 _modal_1u3a6_31"]'
    }

    getGridFilterResultLoader() {
        return '[data-name="grid-table-loader-container"]'
    }

    getA5AddEditMenuActionsDeleteCategoryBtn() {
        return `#sidebar-content > .confirm-modal`
    }

    getLableToggleContainer() {
        return `[class*="_label_container_"]`
    }

     // 
  /**
   * pass the data name attribute to the element and input as ON, OFF , Inactive 
   * @param {String} element ,
   * @param {String} input 
   */
  AssertToggleMessage(element , input) { 
    let isDataName = element.includes(`[data-name="`)
    const message = input.charAt(0).toUpperCase() + input.slice(1);
    let isEnabled = toggleEnableLableArray.includes(message)
    if (isEnabled) {
        if(!isDataName) {
            cy.get(this.getElementByDataNameAttribute(element) + ' '+this.getToggleEnabled()).should('have.text' , message)
          }else {
            cy.get(element + ' '+this.getToggleEnabled()).should('have.text' , message)
          }

    }else {
        if(!isDataName) {
            cy.get(this.getElementByDataNameAttribute(element) + ' '+this.getToggleDisabled()).should('have.text' , message)
          }else {
            cy.get(element + ' '+this.getToggleDisabled()).should('have.text' , message)
          }
    }
   
  }

  AssertToggleDescriptionMessage (element, message) {
    let isDataName = element.includes(`[data-name="`)
    if(!isDataName) {
        cy.get(this.getElementByDataNameAttribute(element) + ' '+this.getStatusFieldText()).should('have.text' , message)
      }else {
        cy.get(element + ' '+this.getStatusFieldText()).should('have.text' , message)
      }

  }

getDashboardDDownOpt() {
    return `[data-name="select-option"]`
}

  getUnCheckedItemsInReportGrid() {
    return 'input[type="checkbox"][aria-checked="false"]'
  }

    getTableRow() {
        return '[data-name="table-container"] tbody tr'
    }

    getGridLoaderOverlay() {
        return 'div[id="grid-loader"]'
    }
    
    getConfirmBtn() {
        return 'button[data-name="confirm"]'
    }

    getSelectedGridRow() {
        return 'tr[class*="_selected"] span[class*="_checkmark_"]'
    }
    
    deselectAllGridRows() {
        cy.get(this.getSelectedGridRow()).click({multiple: true})
    }

    verifyColumnSelected(columnName, status) {
        cy.get(`[value="${columnName}"]`).should('have.attr', 'aria-checked', status)
    }

    getIsOverdue() {
        return '[data-name="isOverdue"]'
    }

    getDaysUntilDue() {
        return '[data-name="daysUntilDue"]'
    }

    getReportLayoutsBtn () {
        return '[data-name="saved-layouts"]'
    }

    getCreateNewBtn() {
        return '[data-name="create-full"]'
    }

    getNicknameF() {
        return '[aria-label="Nickname"]'
    }

    getDeleteLayoutBtn() {
        return '[title="Delete Layout"]'
    }

    getSavedLayoutList() {
        return '[data-name="saved-layout-list"] [role="option"]'
    }

    getResetLayoutBtn() {
        return '[data-name="reset-layout"]'
    }

    createLayout(layoutName) {
        cy.get(this.getReportLayoutsBtn()).click()
        cy.get(this.getWaitSpinner()).should('not.exist')
        cy.get(this.getCreateNewBtn()).click()
        cy.get(this.getNicknameF()).type(layoutName)
        cy.get(this.getModalSaveBtn()).should('have.attr', 'aria-disabled', 'false').click()
        cy.get(this.getModalSaveBtn()).should('not.exist')
        cy.get(this.getWaitSpinner()).should('not.exist')
    }

    selectLayout(layoutName) {
        cy.get(this.getReportLayoutsBtn()).click()
        cy.get(this.getWaitSpinner()).should('not.exist')
        cy.get(this.getSavedLayoutList()).filter(`:contains(${layoutName})`).invoke('attr', 'aria-selected').then((value) => {
            if(value === 'true') {
                cy.get(this.getSavedLayoutList()).filter(`:contains(${layoutName})`).should('have.attr', 'aria-selected', 'true')
            } else {
                cy.get(this.getSavedLayoutList()).contains(layoutName).click()
                cy.get(this.getWaitSpinner()).should('not.exist')
            }
        })
        this.getShortWait()
        cy.get(this.getWaitSpinner()).should('not.exist')
    }

    resetLayout() {
        cy.get(this.getReportLayoutsBtn()).click()
        cy.get(this.getWaitSpinner()).should('not.exist')
        cy.get(this.getResetLayoutBtn()).click()
        cy.wrap(this.WaitForElementStateToChange(this.defaultLayoutBtn(), 1000))
        cy.get(this.getWaitSpinner()).should('not.exist')
    }

    deleteLayout() {
        cy.get(this.getReportLayoutsBtn()).click()
        cy.get(this.getWaitSpinner()).should('not.exist')
        cy.get(this.getDeleteLayoutBtn()).should('have.attr', 'aria-disabled', 'false').click()
        cy.get(this.getWaitSpinner()).should('not.exist')
        this.getShortWait()
        cy.get(this.getWaitSpinner()).should('not.exist')
    }

    veriftLayoutDeleted(layoutName) {
        cy.get(this.getReportLayoutsBtn()).click()
        cy.get(this.getWaitSpinner()).should('not.exist')
        cy.get('body').then($body => {
            if ($body.find(this.getSavedLayoutList()).length) {
                cy.get(this.getSavedLayoutList()).should('not.contain', layoutName)
            }
            else{
                cy.get(this.getSavedLayoutList()).should('not.exist')
            }
        })
        cy.get(this.getResetLayoutBtn()).click()
        this.getShortWait()
    }

    defaultLayoutBtn() {
        return '[data-name="client-default-layout"]'
    }

    getResetBtn() {
        return '[data-name="reset"]'
    }

    setOrganizationDefault() {
        cy.get(this.defaultLayoutBtn()).should('have.attr', 'title', 'Set Organization Default')
        cy.get(this.defaultLayoutBtn()).click()
        cy.get(this.getConfirmBtn()).click()
        cy.wrap(this.WaitForElementStateToChange(this.defaultLayoutBtn(), 1000))
    }

    resetOrganizationDefault() {
        cy.get(this.defaultLayoutBtn()).should('have.attr', 'title', 'Viewing Organization Default')
        cy.get(this.defaultLayoutBtn()).click()
        cy.get(this.getResetBtn()).should('be.visible').click()
        cy.wrap(this.WaitForElementStateToChange(this.defaultLayoutBtn(), 1000))
    }
}
