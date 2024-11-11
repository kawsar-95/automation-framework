import { departments } from "../../../TestData/Department/departments"
import { adminRoles, userDetails } from "../../../TestData/users/UserDetails"
import ARBasePage from "../../ARBasePage"
import ARSelectModal from "../Modals/ARSelectModal"

export default new class ARUserAddEditPage extends ARBasePage {

    getEditUserByUsername(username) {
        cy.wrap(this.AddFilter('Username', 'Equals', username))
        cy.get(this.getWaitSpinner() , {timeout : 1500000}).should('not.exist')
        cy.get(this.getTableCellName(4)).contains(username).click()
        cy.get(this.getWaitSpinner() , {timeout : 1500000}).should('not.exist')
        cy.wrap(this.WaitForElementStateToChange(this.getAddEditMenuActionsByName('Edit User'), 1000))
        cy.get(this.getAddEditMenuActionsByName('Edit User')).click({force:true})
    }
  
     // User Page Elements

     // General Section Elements

    getFirstNameTxtF() {
        return this.getElementByAriaLabelAttribute("First Name");
    }

    getMiddleNameTxtF() {
        return this.getElementByAriaLabelAttribute("Middle Name");
    }

    getLastNameTxtF() {
        return this.getElementByAriaLabelAttribute("Last Name");
    }

    getEmailAddressTxtF() {
        return this.getElementByNameAttribute('emailAddress')
    }

    getUsernameTxtF() {
        return this.getElementByAriaLabelAttribute("Username");
    }

    getPasswordTxtF() {
        return this.getElementByAriaLabelAttribute("Password");
    }

    getConfirmPasswordTxtF() {
        return this.getElementByAriaLabelAttribute("Confirm Password");
    }

    getDepartmentTxtF() {
        return this.getElementByAriaLabelAttribute("Department");
    }

    getDepartmentBtn() {
        return '[data-name="select"][aria-haspopup="dialog"]';
    }

    getMessagesChkBok() {
        return 'input[name="sendNewUserEmail"]';
    }

    getUseCustomTemplateToggle() {
        return "isCustom";
    }

    // Use this text as value for dataname attribute to get this element
    getIsActiveToggleContainer() {
        return "isActive";
    }

    // Account Section Elements
    getNewTemporaryPasswordTxtF() {
        return this.getElementByAriaLabelAttribute("New Temporary Password");
    }

    getConfirmTemporaryPasswordTxtF() {
        return this.getElementByAriaLabelAttribute("Confirm Temporary Password");
    }

    // Account Section Elements

    getToggleDescriptionBanner() {
        return '[class*="_description"]'
    }

    // Use this text as value for dataname attribute to get this element
    getLearnerToggleContainer() {
        return "isLearner";
    }

    getLearnerToggleOnMsg() {
        return "This user will be able to access the learner portal."
    }

    // Use this text as value for dataname attribute to get this element
    getReviewerToggleContainer() {
        return "isReviewer";
    }

    getReviewerToggleOnMsg() {
        return "The user will be able to access the reviewer experience and view all learners; enabling the Admin user type will restrict access based on the User Management scope."
    }

    // Use this text as value for dataname attribute to get this element
    getInstructorToggleContainer() {
        return "isInstructor";
    }

    getInstructorToggleOnMsg() {
        return "This user will be an instructor."
    }

     // Use this text as value for dataname attribute to get this element
    getAdminToggleContainer() {
        return "isAdmin";
    }

    getLearnerToggleContainer() {
        return "isLearner";
    }

    getAdminToggleOnMsg() {
        return "This user will be able to access the admin portal."
    }

    getUserManagementRadioBtn() {
        return this.getElementByDataNameAttribute("userManagementType") + ' ' + '[class*="_label"]'
    }

    getAdminUserManagementAddRuleBtn() {
        return this.getElementByDataNameAttribute("add-rule");
    }

    getRightActionMenuLabel(){
        cy.get('[class*="edit_context_menu_"]').children().should(($child)=>{
        expect($child).to.contain('Enroll User');
        expect($child).to.contain('Assign Competencies');
        expect($child).to.contain('Message User');
        expect($child).to.contain('User Transcript');
        expect($child).to.contain('View History');
        expect($child).to.contain('Reset Password');
        expect($child).to.contain('Merge User');
        expect($child).to.contain('Duplicate');
        expect($child).to.contain('Delete');
     })
 }
    
    getRightActionAddUserMenu(){
        cy.get('[class*="_child_w33d3_9"]').children().should(($child)=>{
            expect($child).to.contain('Edit User');
            expect($child).to.contain('Duplicate');
            expect($child).to.contain('Enroll User');
            expect($child).to.contain('User Transcript');
            expect($child).to.contain('Message User');
            expect($child).to.contain('Reset Password');
            expect($child).to.contain('Merge User');
            expect($child).to.contain('Impersonate');
            expect($child).to.contain('View Enrollments');
            expect($child).to.contain('View Competencies');
            expect($child).to.contain('View Activity Feed');
            expect($child).to.contain('Delete');
            expect($child).to.contain('Deselect');
         })
        
    }

    // The following elements uses odd indexes only
    getManageDepartmentDDown(dDownIndex) {
        return `[role="listitem"]:nth-of-type(${dDownIndex}) [class*="select-field-module__selection"]`;
    }

    getManageDepartmentTxtF(txtFIndex) {
       return `[role="listitem"]:nth-of-type(${txtFIndex}) [data-name="department-input"]`;
    }

    getSelectDepartmentBtn(btnIndex) {
        return `[role="listitem"]:nth-of-type(${btnIndex}) [class*="_select_department_button"]`;
    }

    getManageDepartmentDeleteBtn(btnIndex) {
        return `[role="listitem"]:nth-of-type(${btnIndex}) [aria-label="Delete"]`;
    }

    getAddDepartmentBtn() {
        return this.getElementByDataNameAttribute("add-predicate");
    }

    getGroupsDDown() {
        return this.getElementByDataNameAttribute("managedGroupId") + ' ' + '[data-name="field"]'
    }

    getGroupsDDownSearchTxtF() {
        return this.getElementByDataNameAttribute("managedGroupId") + ' ' + ' [data-name="input"]'
    }

    getGroupsDDownOpt() {
        return '[class*="_select_option_ledtw_1"]'
    }

    getRolesDDown() {
        return `${this.getElementByDataNameAttribute("roleIds")} ${this.getElementByDataNameAttribute('control_wrapper')} > div > div > div:nth-of-type(1)`;
    }

    getRolesDDownSearchTxtF() {
        return '[data-name="roleIds"] [data-name="input"]';
    }

    getRolesByNameInsideSelected(name) {
        return `[data-name="roleIds"] [title="${name}"]`
    }

    // Use cypress contains command to filter by text
    getRolesDDownOpt() {
        return 'ul[aria-label="Roles"] li:nth-of-type(1)'
    }

    getPermissionsBtn() {
        return '[class*=" _permission_overview"]'
    }

    getAddRoleByName(roleName) {
        cy.get(this.getRolesDDown()).click()
        cy.get(this.getRolesDDownSearchTxtF()).type(roleName)
        this.getShortWait()
        cy.get(this.getRolesDDownOpt()).contains(roleName).click()
    }

    getAccountToggleBtnByName(name) {
        return `[data-name="is${name}"]`
    }

    getSelectAccountToggleBtnByName(name) {
        cy.get( this.getAccountToggleBtnByName(name) +' '+this.getToggleBtn()).click()
    }


    // Contact Information Section Elements

    getAddressTxtF() {
        return this.getElementByAriaLabelAttribute("Address");
    }

    getAddress2TxtF() {
        return this.getElementByAriaLabelAttribute('Address 2');
    }

    getCountryDDown() {
        return '[data-name="countryCode"] [data-name="field"]'
    }

    getCountryDDownSearchTxtF() {
        return this.getElementByAriaLabelAttribute("Country");
    }

    getCountryDDownSearchInputTxt() {
        return 'input[aria-label="Country"]';
    }

    getCountryDDownOpt() {
        return '[class*=_label_ledtw_62]'
    }

    getStateProvinceDDown() {
        return '[data-name="provinceCode"] [class*=_select_field_4ffxm_1]'
    }

    getStateProvinceDDownSearchTxtF() {
        return this.getElementByAriaLabelAttribute("State/Province");
    }

    getStateProvinceDDownSearchInputTxt(){
        return 'input[aria-label="State/Province"]';
    }

    getStateProvinceDDownOpt() {
        return '[class*="_label_ledtw_62"]'
    }

    getCityTxtF() {
        return this.getElementByAriaLabelAttribute('City');
    }

    getZipPostalCodeTxtF() {
        return this.getElementByAriaLabelAttribute('Zip/Postal Code');
    }

    getPhoneTxtF() {
        return this.getElementByAriaLabelAttribute('Phone');
    }

    // Employment Details Section Elements

    getEmployeeNumberTxtF() {
        return this.getElementByAriaLabelAttribute('Employee Number');
    }

    getJobTitleTxtF() {
        return this.getElementByAriaLabelAttribute('Job Title');
    }

    getLocationTxtF() {
        return this.getElementByAriaLabelAttribute('Location');
    }

    getSupervisorDDown() {
        return '[data-name="supervisorId"] [class*="_select_field_4ffxm_1"]'
    }

    getSupervisorDDownSearchTxtF() {
        return this.getElementByAriaLabelAttribute('Supervisor');
    }

    getSupervisorDDownSearchInputTxt(){
        return 'input[aria-label="Supervisor"]';
    }

    getSupervisorDDownOpt() {
        return '[class*="_user_name_email_4qguj_70"]'
    }

    getSupervisorDDownOption() {
        return '[class*="select-module__list"]';
    }

    getGenderDDown() {
        return '[data-name="gender"] [class*="_select_field_4ffxm_1"]'
    }

    getGenderDDownSearchTxtF() {
        return this.getElementByAriaLabelAttribute('Gender');
    }

    getGenderDDownOpt() {
        return '[class*="_label_ledtw_62"]'
    }

    getDateHiredBtn() {
        return '[data-name="dateHired"] [class*="icon-calendar"]'
    }

    getDateHiredTxtF() {
        return this.getElementByAriaLabelAttribute("Date Hired")
    }

    getDateTerminatedBtn() {
        return '[data-name="dateTerminated"] [class*="icon-calendar"]'
    }

    getDateTerminatedTxtF() {
        return this.getElementByAriaLabelAttribute("Date Terminated")
    }


    // Details Section Elements

    // Use cypress contains command to filter radio button text
    getAvatarRadioBtn() {
        return this.getElementByDataNameAttribute("avatar") + ' ' + '[data-name="label"]'
    }

    getFileTxtF() {
        return this.getElementByDataNameAttribute("avatar") + ' ' + '[data-name="text-input"]'
    }

    getUrlTxtF() {
        return this.getElementByDataNameAttribute("avatar") + ' ' + this.getTxtF()
    }

    getChooseFileBtn() {
        return this.getElementByDataNameAttribute("avatar") + ' ' + this.getFolderBtn();
    }

    getLanguageDDown() {
        return '[data-name="languageCode"] [data-name="field"]';
    }

    getLanguageDDownSearchTxtF() {
        return this.getElementByAriaLabelAttribute('Language');
    }

    getLanguageDDownSearchInputTxt(){
        return 'input[aria-label="Language"]';
    }

    // Use cypress contains command to filter Language option by text
    getLanguageDDownOpt() {
        return '[class*="_label_ledtw_62"]';
    }

    getCCEmailAddresses() {
        return 'button[data-name="add-text-input"]';
    }
    
    getLanguageClearBtn() {
        return `[data-name="languageCode"] [data-name="clear"]`
    }

    getCCEmailAddressTxtF() {
        return this.getElementByDataNameAttribute('ccEmailAddresses') + ' ' + this.getTxtF()
    }

    getCCEmailAddressDeleteBtn(){
        return this.getElementByDataNameAttribute('ccEmailAddresses') + ' ' +this.getElementByPartialAriaLabelAttribute("Delete")
    }
    getExternalIdTxtF() {
        return this.getElementByAriaLabelAttribute("External Id");
    }

    getNotesTxtA() {
        return this.getElementByAriaLabelAttribute("Notes");
    }

    getUserHistoryModalFocus() {
        return '[class*="_focus_area_ixjmy_9"]'
    }

    getModalFooter() {
        return '[class*="_modal_footer"]'
    }

    // Added for the TC# C7345
    getIsActiveAriaLabel() {
        return '[aria-label="Is Active"]'
    }

    getAriaCheckedAttribute() {
        return 'aria-checked'
    }

    getEnableLabelAttributeName() {
        return '[data-name="enable-label"]'
    }

    getSubmitDataNameAttribute() {
        return '[data-name="submit"]'
    }

    // Added for the TC# C7344
    getSendResetPasswordAlert() {
        return '[role="alert"]'
    }

    getAdminToggleCheckbox() {
        return '[aria-label="Admin"]'
    }

    getGUIADecimalCustomField(){
        return '[aria-label="GUIA Decimal Custom Field"]'
    }

    getGUIANumberCustomField(){
        return '[aria-label="GUIA Number Custom Field"]'
    }

    getGUIAListCustomFieldDDown(){
        return '[data-name="String1"] [data-name="field"]'
    }

    getGUIAListCustomFieldLabel(){
        return '[data-name="String1"] [data-name="selection"] [data-name="label"]'
    }

    getGUIAListCustomFieldOpt(){
        return 'ul[aria-label="GUIA List Custom Field"] li'
    }

    getCustomFieldByName(attrValue) {
        return `[aria-label="${attrValue}"]`
    }

    setAdminToggle(value){
        cy.wait(2000)
        cy.get(this.getAdminToggleCheckbox()).invoke('attr','aria-checked').then((status) =>{
            if(status === value){
                cy.get(this.getAdminToggleCheckbox()).should('have.attr', 'aria-checked', value)
            }
            else{
                cy.get(this.getAdminToggleCheckbox()).siblings('div').click()
                cy.wait(1000)
                cy.get(this.getAdminToggleCheckbox()).should('have.attr', 'aria-checked', value)
            }
        })
    }
    /**
     * Pass the username to be assigned for this AdminRole
     * @param {String} username 
     * @param {String} adminRole 
     */

     createAdminUser(username = userDetails.username , adminRole = adminRoles.admin) { 
        // Add new user
        cy.wrap(this.WaitForElementStateToChange(this.getAddEditMenuActionsByName('Add User'), 1000))
        cy.get(this.getAddEditMenuActionsByName('Add User')).click()
     
        // Fill out general section fields
        cy.get(this.getFirstNameTxtF()).type(userDetails.userWithAdminRoleOnly)
        cy.get(this.getLastNameTxtF()).type(userDetails.lastName)
        cy.get(this.getEmailAddressTxtF()).type(userDetails.emailAddress)
        cy.get(this.getUsernameTxtF()).type(username)
        cy.get(this.getPasswordTxtF()).type(userDetails.validPassword)
        cy.get(this.getConfirmPasswordTxtF()).type(userDetails.validPassword)
        cy.get(this.getDepartmentBtn()).click()
        ARSelectModal.SearchAndSelectFunction([departments.dept_top_name])
        
       
        // Turn Admin toggle ON
        this.generalToggleSwitch('true' , this.getAdminToggleContainer())
        
        cy.get(this.getUserManagementRadioBtn()).contains('All').click()
        this.getAddRoleByName(adminRole)
    
        // Save user
        this.WaitForElementStateToChange(this.getSaveBtn())
        cy.get(this.getSaveBtn()).click()
    }

    getManagedGroupDDown() {
        return '[data-name="managedGroupId"] [data-name="field"]'
    }

    getManagedGroupDDownSearchF() {
        return '[name="managedGroupId"]'
    }

    getManagedGroupDDownOpt() {
        return 'ul[aria-label="Manage Group"]'
    }

    getIsActiveToggleLabel() {
        return '[data-name="isActive"] [data-name="label"]'
    }

    getDefaultAvatar() {
        return '[data-name="default-avatar"]'
    }

    getAvatarImageContainer () {
        return '[class*="_avatar_image"][class*="_image_container"]'
    }

    getSummaryFieldIcon() {
        return '[data-name="content-fields"] [class*="_field_icon"]'
    }

    verifySummaryFieldIcon() {
        cy.get(this.getSummaryFieldIcon()).should('have.class', 'icon-pencil-rename')
        cy.get(this.getSummaryFieldIcon()).should('have.class', 'icon-at-symbol')
        cy.get(this.getSummaryFieldIcon()).should('have.class', 'icon-flowchart')
        cy.get(this.getSummaryFieldIcon()).should('have.class', 'icon-course-curriculum')
        cy.get(this.getSummaryFieldIcon()).should('have.class', 'icon-people-three')
        cy.get(this.getSummaryFieldIcon()).should('have.class', 'icon-badge')
    }

    getSummaryUsername () {
        return '[data-name="content-fields"] [data-name="username"]'
    }

    getSummaryEmailAddress () {
        return '[data-name="content-fields"] [data-name="emailAddress"]'
    }

    getSummaryDepartment () {
        return '[data-name="content-fields"] [data-name="department"]'
    }

    getSummaryCurriculaCount () {
        return '[data-name="content-fields"] [data-name="curriculaCount"]'
    }

    getSummaryEnrollmentsInProgressCount () {
        return '[data-name="content-fields"] [data-name="enrollmentsInProgressCount"]'
    }

    getSummaryEnrollmentsCompletedCount () {
        return '[data-name="content-fields"] [data-name="enrollmentsCompletedCount"]'
    }

    getSummaryCompetenciesCount () {
        return '[data-name="content-fields"] [data-name="competenciesCount"]'
    }
}