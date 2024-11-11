import { courses } from "../../../TestData/Courses/courses";
import arBasePage from "../../ARBasePage";
import ARDashboardPage from "../Dashboard/ARDashboardPage";
import ARSelectModal from "../Modals/ARSelectModal";
import ARCBAddEditPage from "./CB/ARCBAddEditPage";

export default new class ARCoursesPage extends arBasePage {

    // For Test Setups

    getCoursesReport() {
        cy.visit('/admin/courses')
        cy.get(this.getWaitSpinner()).should('not.exist')
        cy.get(this.getPageHeaderTitle(),{timeout:15000}).scrollIntoView().should('be.visible').and("have.text", `Courses`)
    }

    getAddOnlineCourse() {
        this.getCoursesReport()
        cy.get(this.getCoursesActionsButtonsByLabel('Add Online Course')).should('have.text', "Add Online Course").click()
    }
  
    getAddCurricula() {
        this.getCoursesReport()
        cy.get(this.getCoursesActionsButtonsByLabel('Add Curriculum')).should('have.text', "Add Curriculum").click()
    }

    getToggleStatus() {
        return this.getElementByDataNameAttribute("checkbox")
    }
    getDisableToggleStatus() {
        return this.getElementByDataNameAttribute("disable-label")
    }
    getEnableToggleStatus() {
        return this.getElementByDataNameAttribute("enable-label")
    }
    getChapterNameStatus() {
        return this.getElementByDataNameAttribute("name")+ ' ' + this.getTxtF()
    }
    getLearnerToggleContainer() {
        return "isLearner";
    }
    getShowTermAndCondition(){
        return "isDisplayedToLearner"
    }
    getMobileDeviceAlert(){
        return "mobileDeviceAlert"
    }
    getEnableECommerceLabel(){
        return "enableEcommerce"
    }
    getMobileDeviceAlert(){
        return "mobileDeviceAlert"
    }
    getAllowFailureToggleBtn(){
        return "allowFailure"
    }
    getProctor(){
        return "edit-online-course-proctor"
    }
    getChapterName(){
        return "chapters"
    }

    getMessageUsersBtn() {
        return `[data-name="message-user-multi-context-button"]`;
    }

    getAddInstructorLed() {
        this.getCoursesReport()
        cy.get(this.getCoursesActionsButtonsByLabel('Add Instructor Led')).should('have.text', "Add Instructor Led").click()
    }

    getAddCourseBundle() {
        this.getCoursesReport()
        cy.get(this.getCoursesActionsButtonsByLabel('Add Course Bundle')).should('have.text', "Add Course Bundle").click()
    }

    /**
   * This method/function is used to get any of the Add/Edit menu items on the right hand side of the Courses page on Admin Refresh LMS.
   * The method/function takes a string label exactly the way it is displayed on the front end and returns the selector for the menu option 
   * @param {String} label The desired menu option.
   * Example: Use getCoursesActionButtonByLabel('Add Online Course') to get the selector for the Courses menu option
   */
    getCoursesActionsButtonsByLabel(label) {
        return `button[title="${label}"]`;
    }

    getImportCourseBtn() {
        return `button[title="Import Course"]`;
    }

    getAddInstructorLedBtn() {
        return `button[title="Add Instructor Led"]`;
    }

    getAddCurriculaBtn() {
        return `button[title="Add Curriculum"]`;
    }

    getAddCourseBundleBtn() {
        return `button[title="Add Course Bundle"]`;
    }

    getAddOnlineCourseBtn() {
        return `button[title="Add Online Course"]`;
    }

    selectTableCellRecord(rowValue) {
        cy.get('[data-name="table-container"]').within(() =>{
            cy.contains(rowValue).click()
        })
    }

    // Edit Action Elements
    getEditBtn() {
        return 'button[title="Edit"]';
    }

    getDuplicateBtn() {
        return '[title="Duplicate"]'
    }

    getDeleteBtn() {
        return '[title="Delete"]'
    }
    
    getInstructorfromlist(){
         return '[data-name="input"][aria-label="Instructors"]'        
    }

    getVenuefromlist(){
        return '[data-name="input"][aria-label="Venue"]'        
   }
    getCourseEnrollmentActionHeader() {
        return '[data-name="courseEnrollments-actions"]';
    }

    CheckElementChange (path) {
        //get the initial value of your object
        cy.get(path).invoke('attr', 'aria-disabled').then($initialVal => {

            //Wait untill the element changes
            cy.get(path).then($newVal => {
                cy.waitUntil(() => $newVal[0].value !== $initialVal, {
                    //optional timeouts and error messages
                    errorMsg: "was expeting some other Value but got : " + $initialVal,
                    timeout: 10000, 
                    interval: 500 
                  }).then(() => {
                    cy.log("Found a difference in values")
                })
            })
            cy.wait(500)
        })
    }

    getTermsAndConditionsTxtF(msg) {
        return '[data-name="termsAndConditions"] [class*="fr-element fr-view"]'
    }

    getEditCourseByName(name) {
        this.getCoursesReport()
        cy.wrap(this.AddFilter('Name', 'Contains', name))
        this.getShortWait()
        cy.get(this.getTableCellName(2)).contains(name).click()
        cy.wrap(this.WaitForElementStateToChange(this.getAddEditMenuActionsByName('Edit'), 1000))
        cy.get(this.getAddEditMenuActionsByName('Edit')).click()
        cy.intercept('/api/rest/v2/admin/reports/courses/operations').as('getCourseEdit').wait('@getCourseEdit')
    }

    // Added on the 23rd November 2022
    getRemoveChapterOption() {
        return '[data-name="remove"]'
    }
    
    getDeleteBtnToRemoveChapter() {
        return 'div[data-name="prompt-footer"] div[class*="prompt-footer-module__child"]:nth-child(1) > button'
    }

    // Added for the TC# C1057
    getContextMenuByName($name) {
        return cy.get('div [class*="_content_4zm37_17"]').filter(`:contains(${$name})`)
    }

    getCheckboxContainer() {
        return 'div[class*="managed-checkbox-module__input_container"]'
    }

    getCheckedInput() {
        return 'input[aria-checked="true"]'
    }

    // Added for TC# C846
    getAddedCoursesInBundle() {
        return '[aria-label="Courses"] div[role="listitem"]'
    }

    getDeleteCourseBtn() {
        return 'button[aria-label="Delete Course"]'
    }

    getAddCoursesBtn() {
        return 'button[data-name="add-courses"]'
    }

    getRemoveCourseConfirmModal() {
        return 'div[class*="prompts-module__content"] div[data-name="remove-course-bundle-course-prompt"] '
    }

    getRemoveCourseBtnFromBundle() {
       return `div[data-name="remove-course-bundle-course-prompt"] [data-name="prompt-footer"] button[data-name="confirm"]`
        
    }

    getAllowAdditionalAttemptsAfterPassToggleBtn(){
        return `[data-name="allowAdditionalAttemptsAfterPass"] [data-name="toggle-button"]`
    }

    getTagOperatorSearchF() {
        return 'input[aria-label="Tag"]'
    }

    getLabel() {
        return '[data-name="label"]'
    }

    // Added for the TC# C7327
    getGridTableColumnCourseName(name) {
        return `tbody > tr > :nth-child(2):contains(${name})`
    }

    getGridTableNameColumn() {
        return '[data-name="firstName"]'
    }

    // Added for the JIRA# AUT-550, TC# C2000
    getAddRoleBtn() {
        return 'button[title="Add Role"]'
    }

    getDeselectBtn() {
        return '[data-name="deselect-button"]'
    }
    
    //Added for JIRA #AUT-869, TC# C7840
    AddSubCategoryFilterCourseReport(propertyName) {
        cy.get(this.getCategoryColumnFilterBtn()).click({force:true});
        cy.get(this.getCategoryFilterOptPicker()).click();
        cy.get(this.getOperatorNameDDownOpt()).contains(propertyName).click();
        cy.get(this.getChooseCategoryBtn()).click();
        cy.get(this.getCategorySelectBox()).eq(1).click()
        cy.get(this.getCategoryChooseBtn()).click()
        cy.get(this.getSubmitAddFilterBtn()).should('be.visible',{timeout:3000}).click()
     }

     getCategoryColumnFilterBtn(){
        return 'button[title="Category Filter"]'
     }

     getCategoryFilterOptPicker(){
        return 'div[data-name="field"] [title="Is Only"]'
     }

     getChooseCategoryBtn(){
        return '[data-name="select"]'
     }

     getCategorySelectBox(){
        return '[data-name="select-box"]'
    }

    getCategoryChooseBtn(){
        return 'button[data-name="submit"]'
    }

    createCourseAndCancel(courseType, courseName, coursesToInclude = [courses.oc_filter_01_name]) {
        cy.createCourse(courseType, courseName)  
        if (courseType === 'Course Bundle' || courseType === 'Curriculum') {
            ARSelectModal.SearchAndSelectFunction(coursesToInclude)
            cy.get(ARDashboardPage.getWaitSpinner(),{timeout:15000}).should('not.exist')
        }
        cy.get(ARCBAddEditPage.getCancelBtn(), {timeout: 1000}).click()
        cy.get(ARCBAddEditPage.getConfirmBtn(), {timeout: 1000}).click()
        cy.get(this.getPageHeaderTitle(), {timeout: 75000}).contains('Courses')
    }

    verifyNoCourseIsCreated(courses = []) {
        if (courses != undefined && Array.isArray(courses) && courses.length > 0) {
            let i = 0
            for (; i < courses.length; i++) {
                this.AddFilter('Name', 'Contains', courses[i])
                cy.get(this.getWaitSpinner()).should('not.exist')
                cy.get(this.getNoResultMsg()).should('have.text', "No results found.")
            }
        }
    }

    storeTotalCourses() {
        cy.get(this.getFooterCount()).invoke('text').then((text) => {
            cy.wrap(text).as('totalPublishCourses')
        })
    } 

    checkTotalCourse() {
        cy.get(this.getFooterCount()).invoke('text').then((text) => {
            cy.get('@totalPublishCourses').then((courses) => {
                expect(text).to.eq(courses)
            })
        })
    }
}