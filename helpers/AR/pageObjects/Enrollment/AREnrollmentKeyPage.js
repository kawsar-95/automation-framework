import arBasePage from "../../ARBasePage";
import ARSelectModal from "../../pageObjects/Modals/ARSelectModal"

export default new class AREnrollmentKeyPage extends arBasePage {

    getNameTxtF() {
        return `input[aria-label="Name"]`
    }

    getDepartmentF() {

        return '[data-name="department-input"] '
    }

    getSelectDeparmentBtn() {
        return '[data-name="departmentId"] [class*="icon icon-flowchart"]'
    }

    getUsernameRadioBtn() {

        return `[data-name="radio-button"]`
    }

    getAddCoursesBtn() {

        return '[data-name="add_courses"]'
    }

    getCourseName() {

        return '[class*="_enroll_course_item_"]'
    }

    getCourseContainer() {
        return '[class*="enroll-course-item-module"]'
    }

    getCourseList() {
        return '[class*="edit-enrollment-key-general-module__course_list"]'
    }

    getILCSessionDDown() {
        return '[data-name="selection"]'
    }

    getSelectILCSessionByName(course, session) {
        cy.get(this.getCourseName()).contains(course).parents(this.getCourseName()).within(() => {
            cy.get(`[data-name="session-details"] `).within(() => {
                cy.get(this.getILCSessionDDown()).click()
            })
            cy.get('[class*="_session_"]').contains(session).click()
        })
    }

    getDeleteCourseByName(name) {
        cy.get(this.getCourseName()).contains(name).parent().within(() => {
            cy.get(this.getTrashBtn()).click()
        })
    }

    getNoCoursesMsg() {

        return `[data-name="no-courses"]`
    }

    getGenerateKeyToggleContainer() {
        return "isBulk"
    }

    //--- For Single Key ---//

    getKeyNameTxtF() {

        return `input[name="keyName"]`
    }

    getGenerateKeyBtn() {
        return '[data-name="keyName"] [class*="icon icon-gear"]'
    }

    getDirectLinkUrl() {

        return `[class*="_direct_link_url_"]`
    }

    //-------------------//


    //--- For Bulk Keys ---// 

    getKeyNameToggleContainer() {
        return "isBulkKeyGenerationAutomatic"
    }

    getKeyNameMsg() {

        return '[data-name="isBulkKeyGenerationAutomatic"] [data-name="description"]'
    }

    getManualKeyNameTxtF() {
        return 'input[name="keyNamePrefix"]'
    }

    getReferenceIDToggleContainer() {
        return "isBulkReferenceAutomatic"
    }

    getReferenceIDMsg() {
        return '[data-name="isBulkReferenceAutomatic"] [data-name="description"]'
    }

    getManualReferenceIDTxtF() {

        return 'input[name="reference"]'
    }

    getNumGeneratedKeysTxtF() {

        return 'input[name="generatedKeyCount"]'
    }

    //-------------------//

    getStartDatePickerBtn() {
        return '[data-name="startDate"] [class*="icon icon-calendar"]'
    }

    getStartDateF() {
        return '[data-name="startDate"] [class*="DateInput_input"]'
    }

    getExpiryDatePickerBtn() {
        return '[data-name="expiryDate"] [class*="icon icon-calendar"]'
    }

    getExpiryDateF() {
        return '[data-name="expiryDate"] [class*="DateInput_input"]'
    }

    getNumberUsesTxtF() {

        return 'input[name="maxUseCount"] '
    }

    getLanguageDDown() {
        return '[data-name="languageCode"] [data-name="field"]'
    }

    getLanguageOpt() {
        return '[class*="_select_option_ledtw_1"]'
    }

    //----- For Messages Section -----//

    getSendEmailChkBoxContainer() {
        return '[data-name="sendNewUserEmail"]'
    }

    getSendEmailChkBoxSelector() {
        return 'input[name="sendNewUserEmail"] '
    }

    getSendEmailChkBox() {
        return '[data-name="sendNewUserEmail"] '
       
    }

    getCustomTemplateToggleContainer() {
        return "isCustomTemplate" //data-name
    }

    getEditTemplateBtn() {
        return '[data-name="edit-template"]' + ' ' + this.getPencilBtn()
    }


    //----- For Fields Section -----//

    getFieldsTable() {
       
       return `[data-name="edit-user-custom-fields-section"]`
    }

    getReadOnlyTxtF() {
        return '[class*="text-input-module__read_only"]'
    }

    getTxtF() {
       
       return `input[class*="_text_input_"]`
    }

    getReadOnlyDDown() {
        return '[class*="select-option-value-module__deselect"]'
    }

    getBehaviourDDown() {
       
       return `[data-name="field"] [class*="_select_field_"]`
    }

    getDDownList() {
        return '[class*="select-list-module__select_list"]'
    }

    getInputDDown() {
        return '[class*="select-field-module__select_field"]'
    }

    getDDownTxtF() {
       
       return `input[data-name="input"]`
    }

    getDDownOpt() {
       
       return `[class*="_select_option_"]`
    }

    //Pass ekey name, department, and array of courses to be added
    getAddEKey(name, department, courses) {
        cy.wrap(this.WaitForElementStateToChange(this.getAddEditMenuActionsByName('Add Enrollment Key'), 2000))
        cy.get(this.getAddEditMenuActionsByName('Add Enrollment Key')).click()
        this.getLShortWait()
        cy.get(this.getNameTxtF()).type(name)
        cy.get(this.getSelectDeparmentBtn()).click()
        ARSelectModal.SearchAndSelectFunction([department])
        this.getShortWait()
        cy.get(this.getAddCoursesBtn()).click()
        ARSelectModal.SearchAndSelectFunction(courses)
        this.getShortWait()
        cy.get(this.getGenerateKeyBtn()).click()
    }


    //Delete an enrollment key via API - pass the admins username & password, and the enrollment key ID
    deleteEKeyViaAPI(username, password, ID) {
        cy.apiAuth(username, password).then((response) => {
            const token = response.body.token
            cy.request({
                method: "DELETE",
                url: `/api/rest/v2/admin/enrollment-keys/${ID}`,
                headers: {
                    Authorization: `Bearer ${token}`,
                    "X-Absorb-API-Key": Cypress.env('api_Key'),
                },
            }).then((response) => {
                expect(response.status).to.eql(200);
            })
        })
    }

}