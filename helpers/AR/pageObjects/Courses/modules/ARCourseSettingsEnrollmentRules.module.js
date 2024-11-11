import ARBasePage from "../../../ARBasePage";
import ARSelectModal from '../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'

export default new class ARCourseSettingsEnrollmentRulesModule extends ARBasePage {


    getSelectLockedDeptBtn() {
        //return this.getElementByDataNameAttribute('locked-department-select') + ' ' + '[class*="department-select-module__select_department_button"]' //Keeping old call for reference if needed
        return '[data-name="locked-department-form"] [data-name="department-input"]'
    }

    getAllowSelfEnrollmentForm() {
        return '[id="selfEnrollmentAvailability"]'
    }

    getEnableAutomaticEnrollmentForm() {
        return '[id="automaticEnrollmentAvailability"]'
    }

    getSessionSelfEnrollmentForm() {
        return '#sessionSelfEnrollmentAvailability'
    }

    getEnrollmentRuleGroup() {
        return '[class*="_availability_rule_"]'
    }

    getEnrollmentRuleItem() {
        return '[data-name="availability-rule-item"]'
    }

    getApprovalForm() {
        return '#courseApprovalSettings'
    }

    getRadioBtnLabel() {
        return '[aria-label="Allow Self Enrollment"] > [data-name="radio-button"] [data-name="label"]'
    }

    getEnrollmentRadioBtnLable () {
        return '[data-name="radio-button"] [data-name="label"]'
    }

    getToggleText() {
        return '[data-name="description"]'
    }

    clickAllowSelfEnrollmentRadioBtn(selfEnrollmentRadioBtn) {

        cy.get(this.getAllowSelfEnrollmentForm()).children().find(this.getRadioBtnLabel()).contains(selfEnrollmentRadioBtn).click()
    }

    getAllowSelfEnrollmentDescription(description) {
        cy.get(this.getAllowSelfEnrollmentForm() + this.getEnrollmentDescription()).should("have.text", description)
    }

    getDefaultAllowSelfEnrollmentRadioBtn(selfEnrollmentRadioBtn) {
        cy.get(this.getRadioBtnLabel()).contains(selfEnrollmentRadioBtn).parent().find('input').should('be.checked')
    }
    getDefaultEnableAutomaticEnrollmentRadioBtn(selfEnrollmentRadioBtn) {
        cy.get('[aria-label="Enable Automatic Enrollment"] > [data-name="radio-button"] [data-name="label"]').contains(selfEnrollmentRadioBtn).parent().find('input').should('be.checked')
    }

    getEnableAutomaticEnrollmentDescription(description) {
        cy.get(this.getEnableAutomaticEnrollmentForm() + this.getEnrollmentDescription()).should("have.text", description)
    }

    getNoneApprovalRadioBtn(selfEnrollmentRadioBtn) {
        cy.get('[aria-label="Approval"] > [data-name="radio-button"] [data-name="label"]').contains(selfEnrollmentRadioBtn).parent().find('input').should('be.checked')
    }
    getAllowSelfEnrollmentToggleInfo() {
        cy.get('[data-name="course-enrollment"] [data-name="description"]').should('contain', 'Self enrollment for this course is off.')
    }
    getEnableAutomaticEnrollmentToggleInfo() {
        cy.get(this.getEnableAutomaticEnrollmentForm()).within(() => {
            cy.get(this.getToggleText()).contains('Automatic enrollment for this course is off.')
        })
    }

    getApprovalToggleInfo() {
        cy.get('[data-name="course-approval-settings"] [data-name="description"]').should('contain', 'No approval is required to enroll.')
    }

    clickEnableAutomaticEnrollmentRadioBtn(automaticEnrollmentRadioBtn) {
        cy.get(this.getEnableAutomaticEnrollmentForm()).children().find(this.getRadioBtnLabel()).contains(automaticEnrollmentRadioBtn).click()
    }

    getApprovalRadioBtn() {
        return 'span[id*="radio-button-"][data-name="label"]'
    }

    getRadioBtnContainer() { //Can be used as the parents() class to check if an option is selected
        return '[data-name="course-enrollment"]'
    }

    //use to verify if a radio btn option is selected - Pass the label name
    getVerifyRadioBtn(label) {
        cy.get(this.getRadioBtnLabel()).contains(label).parent().children().should('have.attr', 'aria-checked', 'true')
    }

    getAddRuleBtn() {
        return 'button[data-name="add-rule"]'
    }

    getAllowAllSelfEnrollmentDisabledRadioBtn() {
        return 'input[data-name="radio-button-AllLearners"][aria-disabled="true"]'
    }

    getAllowSelfEnrollmentRadioBtn(titleText) {
        cy.get('[aria-label="Allow Self Enrollment"] > [data-name="radio-button"]').contains(titleText).click()
    }

    getAllowSelfEnrollmentAllLearnersRadioBtn() {
        return `[id="selfEnrollmentAvailability"] [data-name="radio-button-AllLearners"]`
    }

    getAllEnrollmentRadioBtn() {
        return '[data-name="enrollmentAvailabilityType"] [data-name="radio-group"] [data-name="radio-button"] [data-name="radio-button-AllLearners"]'
    }

    getAutoEnrollmentRadioBtn() {
        return '[data-name="enrollmentAvailabilityType"] [data-name="radio-group"] [data-name="radio-button"] [data-name="radio-button-Specific"]'
    }

    getAutoAllUserEnrollmentRadioBtn() {
        return '[data-name="enrollmentAvailabilityType"] [data-name="radio-group"] [data-name="radio-button"] [data-name="radio-button-AllLearners"]'
    }

    getRefineRuleBtn() {
        return 'button[data-name="add"]'
    }

    getSelectionTypeDDown() {
        return '[class="_select_field_4ffxm_1"]'
    }

    getAddDepartmentSelection() {
        return '[data-name="select-departments"]'

    }

    getRuleSelectionTypeDDown() {
        return '[aria-label="Rule Filter 1 of 1"] [data-name="field"]'
    }

    getDepartmentDDownF() {
        return '[data-name="availability-rule-item"] > [data-name="content"] [data-name="department-input"]'
    }

    getSelectionTypeSearchTxt() {
        return 'input[data-name="input"]';
    }

    getDepartmentTypeSearchtxt() {
        return '[data-name="list-content"] > [aria-label="Property"]'
    }

    getSelectionTypeOpt() {
        return '[data-name="options"] > [aria-label="Property"]'
    }

    getRuleTxtF() {
        return 'input[aria-label="Value"]'
    }

     getNumRuleTxtF() {
        return 'input[class*="_input_19krc_"]'
    }

    getDepartmentRuleBtn() {
        return 'button[class*="_select_department_button_"]'
    }

    getDateTxtF() {
        return '[class*="DateInput_input"]'
    }

    getTimeTxtF() {
        return 'input[aria-label="Time"]'
    }

    getDeleteRuleBtn() {
        return 'button[class*="_remove"]'
    }

    /**
     * This function adds a self or automatic enrollment rule to any course type.
     * @param {String} ruleType 'Self' to add a self-enrollment rule
     *                          'Auto' to add an automatic enrollment rule
     *                          'Session' to add an ILC session self-enrollment rule
     * @param {String} filter Enrollment filter from the rules filter drop down
     * @param {*} operator Should be left null if the rule added is a list or boolean type
     * @param {*} value Value of the rule. If it's a date, it should follow the format "YYYY-MM-DD". If it's date/time, "YYYY-MM-DD hh mm am" as it is parsed by space
     * @param {*} value2 If the rule is a date or date/time, and the operator is 'Between', value2 should be provided, otherwise should be left as null. 
     *                   Follows the same format "YYYY-MM-DD" for date and "YYYY-MM-DD hh mm am" for date/time
     */
    AddEnrollmentRule(ruleType, filter, operator = null, value = null, value2 = null) {
        let varRuleType
        if (ruleType == 'Self') {
            varRuleType = this.getAllowSelfEnrollmentForm()
        } else if (ruleType == 'Auto') {
            varRuleType = this.getEnableAutomaticEnrollmentForm()
        } else if (ruleType == 'Session') {
            varRuleType = this.getSessionSelfEnrollmentForm()
        }

        cy.get(varRuleType).within(() => {
            cy.get(this.getAddRuleBtn()).click()

            // Need to accommodate a scenario when there is already an existing group of rules after a new rule is added
            // to ensure we are updating the newly added rule
            // A new rule is always added at the end
            cy.get('[class*="_content_ytgx5_16"]').last().then(($rule) => {

                cy.get($rule).find(this.getSelectionTypeDDown()).first().click()
                cy.get($rule).find(this.getSelectionTypeSearchTxt()).first().type(filter)
                cy.get($rule).find(this.getSelectionTypeOpt()).contains(filter).click()
                cy.get($rule).find(this.getSelectionTypeDDown()).last().click()
                if (operator == null) {
                    cy.get($rule).find(`input[data-name="input"]`).last().type(value)
                    cy.get($rule).find(`[aria-label="Value"] [class*="_label"]`).contains(value).click()
                } else {
                    cy.get($rule).find(this.getListItem()).contains(operator).click()

                    if (filter == 'Department') {
                        cy.get($rule).find(this.getDepartmentRuleBtn()).click()
                    } else {
                        if (operator == 'After' || operator == "Before" || operator == "Between") {
                            const arrDate = value.split(" ")
                            cy.get($rule).find(this.getDateTxtF()).eq(0).click()
                            cy.wrap(this.getSelectDate(arrDate[0]))
                            if (arrDate.length == 4) {
                                cy.get($rule).find(this.getTimeTxtF()).eq(0).click()
                                cy.wrap(this.SelectTime(parseInt(arrDate[1]), parseInt(arrDate[2]), arrDate[3]))
                            }

                            if (operator == "Between") {
                                const arrEndDate = value2.split(" ")
                                cy.get($rule).find(this.getDateTxtF()).eq(1).click()
                                cy.wrap(this.getSelectDate(arrEndDate[0]))
                                if (arrDate.length == 4) {
                                    cy.get($rule).find(this.getTimeTxtF()).eq(1).click()
                                    cy.wrap(this.SelectTime(parseInt(arrEndDate[1]), parseInt(arrEndDate[2]), arrEndDate[3]))
                                }
                            }
                        } else {
                            if (value != null) {
                                if (operator === 'Greater Than' || operator === 'Less Than') {
                                    cy.get($rule).find(this.getNumRuleTxtF()).last().click().type(value)
                                } else if (operator === 'Equals') {
                                    switch (filter) { //Text field cases
                                        case 'City':
                                        case 'Country':
                                        case 'Email Address':
                                        case 'Employee Number':
                                        case 'First Name':
                                        case 'Full Name':
                                        case 'Job Title':
                                        case 'Language':
                                        case 'Last Name':
                                        case 'Location':
                                        case 'State/Province':
                                        case 'Username':
                                            cy.get($rule).find(this.getRuleTxtF()).last().click().type(value)
                                            break;
                                        case 'Email Address': //Num field cases
                                        case 'GUIA Decimal Custom Field':
                                        case 'GUIA Number Custom Field':
                                            cy.get($rule).find(this.getNumRuleTxtF()).last().click().type(value)
                                            break;
                                        default:
                                            console.log(`Sorry, ${filter} type does not exist.`);
                                    }
                                } else {
                                    cy.get($rule).find(this.getRuleTxtF()).last().click().type(value)
                                }
                            }
                        }
                    }
                }
            })
        })
        // Need to take this out of the within because it searches for the Select Modal elements within the 
        // #selfEnrollmentAvailability/#automaticEnrollmentAvailability
        if (filter == 'Department') {
            ARSelectModal.SearchAndSelectFunction([value])
        }
    }

    /**
     * This function adds an 'And' condition to an existing enrollment rule group.
     * @param {String} ruleType Is either 'Self' or 'Auto' to specify if the rule to be added is a self or automatic enrollment rule.
     * @param {Int} ruleGroupIndex The index of an enrollment rule group.
     * @param {String} filter Enrollment filter from the rules filter drop down
     * @param {String} operator Should be left null if the rule added is a list or boolean type
     * @param {String} value Value of the rule. If it's a date, it should follow the format "YYYY-MM-DD". If it's date/time, "YYYY-MM-DD hh mm am" as it is parsed by space
     * @param {String} value2 If the rule is a date or date/time, and the operator is 'Between', value2 should be provided, otherwise should be left as null. 
     *                   Follows the same format "YYYY-MM-DD" for date and "YYYY-MM-DD hh mm am" for date/time
     */
    RefineEnrollmentRule(ruleType, ruleGroupIndex, filter, operator = null, value = null, value2 = null) {
        let varRuleType
        if (ruleType == 'Self') {
            varRuleType = this.getAllowSelfEnrollmentForm()
        } else if (ruleType == 'Auto') {
            varRuleType = this.getEnableAutomaticEnrollmentForm()
        } else if (ruleType == 'Session') {
            varRuleType = this.getSessionSelfEnrollmentForm()
        }

        cy.get(varRuleType).find(this.getEnrollmentRuleGroup()).eq(ruleGroupIndex).within(($ruleGroup) => {
            // Need to accommodate a scenario when there is already an existing group of rules after a new rule is added
            // to ensure we are updating the newly added rule
            // A new rule is always added at the end
            // If it's a boolean, also leave 'operator' as null
            cy.get($ruleGroup).find(this.getRefineRuleBtn()).click()
            cy.get($ruleGroup).find(this.getEnrollmentRuleItem()).last().then(($rule) => { 
                cy.get($rule).find(this.getSelectionTypeDDown()).first().click()
                cy.get($rule).find(this.getSelectionTypeSearchTxt()).first().click().type(filter)
                cy.get($rule).find(this.getSelectionTypeOpt()).contains(filter).click()
                cy.get($rule).find(this.getSelectionTypeDDown()).last().click()
                if (operator == null) {
                    // which means it must be a list type
                    // List drop down has a search text field
                    cy.get($rule).find(`input[data-name="input"]`).last().type(value)
                    cy.get($rule).find(`[aria-label="Value"] [class*="_label"]`).contains(value).click()
                
                } else {
                    cy.get($rule).find(this.getListItem()).contains(operator).click()

                    if (filter == 'Department') {
                        cy.get($rule).find(this.getDepartmentRuleBtn()).click()
                        cy.wrap(ARSelectModal.SearchAndSelectFunction([value]))
                    } else {
                        if (operator == 'After' || operator == "Before" || operator == "Between") {
                            const arrDate = value.split(" ")
                            cy.get($rule).find(this.getDateTxtF()).eq(0).click()
                            cy.wrap(this.getSelectDate(arrDate[0]))
                            if (arrDate.length == 4) {
                                cy.get($rule).find(this.getTimeTxtF()).eq(0).click()
                                cy.wrap(this.SelectTime(parseInt(arrDate[1]), parseInt(arrDate[2]), arrDate[3]))
                            }

                            if (operator == "Between") {
                                const arrEndDate = value2.split(" ")
                                cy.get($rule).find(this.getDateTxtF()).eq(1).click()
                                cy.wrap(this.getSelectDate(arrEndDate[0]))
                                if (arrDate.length == 4) {
                                    cy.get($rule).find(this.getTimeTxtF()).eq(1).click()
                                    cy.wrap(this.SelectTime(parseInt(arrEndDate[1]), parseInt(arrEndDate[2]), arrEndDate[3]))
                                }
                            }
                        } else {
                            if (value != null) {
                                if (operator === 'Greater Than' || operator === 'Less Than' || operator === 'Equals') {
                                    cy.get($rule).find(this.getNumRuleTxtF()).last().click().type(value)
                                } else {
                                    cy.get($rule).find(this.getRuleTxtF()).last().click().type(value)
                                }
                            }
                        }
                    }
                }
            })
        })
        if (filter == 'Department') {
            cy.wrap(ARSelectModal.SearchAndSelectFunction([value]))
        }
    }

    /**
     * This function deletes an existing rule in a rule group
     * @param {String} ruleType Is either 'Self' or 'Auto' to specify if the rule to be added is a self or automatic enrollment rule.
     * @param {Int} ruleGroupIndex The index of enrollment rule group where the rule is to be deleted from
     * @param {Int} ruleIndex The index of the rule within the rule group since a rule group can contain several rules.
     */
    RemoveEnrollmentRule(ruleType, ruleGroupIndex, ruleIndex) {
        let varRuleType
        if (ruleType == 'Self') {
            varRuleType = this.getAllowSelfEnrollmentForm()
        } else {
            varRuleType = this.getEnableAutomaticEnrollmentForm()
        }

        cy.get(varRuleType).find(this.getEnrollmentRuleGroup()).eq(ruleGroupIndex).within(($rule) => {
            cy.get($rule).find(this.getDeleteRuleBtn()).eq(ruleIndex).click()
        })
    }

    getUserCountBanner() {
        return '[data-name="learner-count"]'
    }

    getCountBanner() {
        return '[data-name="user-count"]'
    }

    getEnrollmentDescription() {
        return '[data-name="course-enrollment"] [class*="_description"]'
    }


    //----- For Approval Section -----//

    //Available if the 'Other' radio btn has been selected
    getOtherApprovalDDown() {
        return '[data-name="approvalUserIds"] [class*="_selection"]'
    }

    getOtherApprovalSearchTxt() {
        return '[class*="_search_7teu8_76"] [aria-label="Other Approval"]';
    }

    getOtherApprovalOptList(){
        return '[class*="_select_list_m6elk_1"][aria-label="Other Approval"]'
    }

    getOtherApprovalOpt(opt) {
        cy.get(this.getOtherApprovalOptList()).contains(opt).click()
    }

    getApprovalDescription() {
        return '[data-name="course-approval-settings"] [class*="_description"]'
    }

    getOtherApprovalOptFullName(opt) {
        return '[class*="_full_name"]'
    }


    //----- For E-Commerce Section -----//

    getEnableEcommToggleContainer() {
        return "enableEcommerce";
    }

    getEnablePublicPurchaseContainer() {
        return "allowPublicPurchase";
    }

    getEcommerceToggleDescription() {
        return '[class*="_description"]'
    }

    getDefaultPriceTxtF() {
        return '[data-name="defaultCoursePrice"] [name="defaultCoursePrice"]'
    }

    //--- For Variable Price Groups ---//

    getVariablePriceContainer() {
        return '[class*="course-e-commerce-settings-module__variable_price"]'
    }

    getNoVariablePriceTxt() {
        return '[data-name="no-variable-prices"]'
    }

    getAddVariablePriceBtn() {
        return '[data-name="add-variable-price"] [class*="icon icon-plus"]'
    }

    getVariablePriceGroup() {
        return "variable-price"
    }

    //Use getElementByDataNameAttributeAndIndex(getVariablePriceGroup(), index) function along with the following variable price group functions

    getVariablePriceDeptBtn() {
        return `[class*="select_department_button"] [class*="icon icon-flowchart"]`
    }

    getVariablePriceDeptF() {
        return '[data-name="department-input"]'
    }

    getVariablePriceTxtF() {
        return `[class="_input_19krc_4"]`
    }

    getDeleteVariablePriceBtn() {
        return `[class*="icon icon-trash"]`
    }

    //--- For Course Extensions ---//

    getAddExtensionBtn() {
        return '[data-name="add-extension"]'
    }

    getExtensionsList() {
        return '[class*="course-extensions-module__extensions_list"]'
    }

    getExtensionGroup() {
        return "extensions"
    }

    //Use getElementByDataNameAttributeAndIndex(getExtensionGroup(), index) function along with the following extension group functions

    getExtensionDaysTxtF() {
        return `[aria-label="Days"]`
    }

    getExtensionPriceTxtF() {
        return `[aria-label="Price"]`
    }

    getExtensionErrorMsg() {
        return `[data-name="error"]`
    }

    getDeleteExtensionBtn() {
        return `[class*="icon icon-trash"]`
    }

    getEnrollmentRulesBtn() {
        return '[title="Enrollment Rules"]'
    }

    clickEnrollMentRuleOption() {
        cy.get('[title="Enrollment Rules"]').eq(0).click()
    }

    scrollToEnrolmentRule() {
        cy.contains('Allow Self Enrollment').scrollIntoView()
    }

    verifyAllowSelfEnrollmentOption() {
        cy.contains('Allow Self Enrollment').should('be.visible')
    }

    verifySelfEnrollment_SpecificOption() {
        cy.contains('Specific').should('be.visible')
    }

    verifySelfEnrollment_AllLearnersOption() {
        cy.contains('All Learners').should('be.visible')
    }

    verifySelfEnrollment_OffOption() {
        cy.contains('Off').should('be.visible')
    }

    verifyAutoEnrollmentOption() {
        cy.contains('Enable Automatic Enrollment').should('be.visible')
    }

    verifyApprovalOption() {
        cy.contains('Approval').should('be.visible')
    }

    verifyApproval_NoneOption() {
        cy.contains('None').should('be.visible')
    }

    verifyApproval_CourseEditorOption() {
        cy.contains('Course Editor').should('be.visible')
    }

    verifyApprovalOptions() {
        cy.contains('None').should('be.visible')
        cy.contains('Course Editor').should('be.visible')
        cy.contains('Supervisor').should('be.visible')
        cy.contains('Administrator').should('be.visible')
        cy.contains('Other').should('be.visible')
    }

    getSelectSelfEnrollmentRadioBtnbyName(name) {
        cy.get(this.getAllowSelfEnrollmentForm()).within(() => {
            cy.get(this.getRadioBtnLabel()).contains(name).click()
        })
        cy.wait(100)
        switch (name) {
            case 'Off':
                this.verifySelfEnrollment_OffMessage()
                break
            case 'Specific':
                break
            case 'All Learners':
                this.verifySelfEnrollment_AllLearnersMessage()
                break
        }
    }

    getapprovalTypeRadioBtnLabel() {
        return '[data-name="approvalType"] [data-name="radio-button"] [data-name="label"]'
    }

    // This method is used to select Approval radio button abd verify its message according to given parameter
    getSelectApprovalRadioBtnbyName(name) {
        cy.get(this.getapprovalTypeRadioBtnLabel()).contains(name).click()
        
        cy.wait(1000)
        switch (name) {
            case 'None':
                this.verifyApproval_NoneMessage()
                break
            case 'Course Editor':
                this.verifyApproval_CourseEditorMessage()
                break
            case 'Supervisor':
                this.verifyApproval_SupervisorMessage()
                break
            case 'Administrator':
                this.verifyApproval_AdminMessage()
                break
            case 'Other':
                this.verifyApproval_OtherMessage()
                break
        }
    }
    //Self enrollment for this course is off.

    verifySelfEnrollment_OffMessage() {
        cy.contains('Self enrollment for this course is off.').should('be.visible')
    }

    verifySelfEnrollment_AllLearnersMessage() {
        cy.contains('This course will be available for all learners to self-enroll in. If E-Commerce is enabled, it will also be available publicly.').should('be.visible')
    }

    verifyApproval_NoneMessage() {
        cy.contains('No approval is required to enroll.').should('be.visible')
    }

    verifyApproval_CourseEditorMessage() {
        cy.contains('A course editor must approve all enrollments.').should('be.visible')
    }

    verifyApproval_SupervisorMessage() {
        cy.contains("A user's supervisor must approve all enrollments.").should('be.visible')
    }

    verifyApproval_AdminMessage() {
        cy.contains("A user's department administrator must approve all enrollments.").should('be.visible')
    }

    verifyApproval_OtherMessage() {
        cy.contains("Specify the users that are responsible for approving enrollments.").should('be.visible')
    }

    getOtherAprrovalSearchF() {
        return '[name="approvalUserIds"]'
    }
    getEnableAutomaticEnrollmentRadioBtn(type) {
        cy.get('[aria-label="Enable Automatic Enrollment"] > [data-name="radio-button"]').contains(type).click()
    }

    getChoseApprovedUsersDDown() {
        return '[data-name="selection"]'
    }

    getApprovedUserIDsTxt() {
        return '[name="approvalUserIds"]'
    }

    getGroupIdsDDown() {
        return '[data-name="groupIds"] [data-name="field"]'
    }

    getGroupIdsDDownSearchF() {
        return '[name="groupIds"]'
    }

    getGroupIdsDDownOpt() {
        return 'ul[aria-label="Groups"]'
    }

    getApprovalTypeContainer() {
        return '[data-name="approvalType"]'
    }

    getApprovalTypeRadioButtonOther() {
        return '[data-name="radio-button-Other"]'
    }
}