import arBasePage from "../../ARBasePage"
import ARCoursesPage from "../Courses/ARCoursesPage"

export default new class ARRolesAddEditPage extends arBasePage {

    getGeneralNameTxtF() {
        return 'input[aria-label="Name"]'
    }
    getGeneralDescriptionTxtF() {
        return 'textarea[aria-label="Description"]'
    }
    getCourseSelectAllCheckBox() {
        return '[data-name="edit-role-select-all-permissions"]'
    }
    getCourseDeselectAllCheckBox() {
        return '[data-name="edit-role-deselect-all-permissions"] >div'
    }
    getILCAndOCPermission() {
        return '[data-name="courses-section"] [class*="checkbox--uqfnd checkbox"] [class*="module__label--IWdmJ"]'
    }
    getUserPermission() {
        return '[data-name="users-section"] [class*="checkbox--uqfnd checkbox"] [class*="module__label--IWdmJ"]'
    }
    getEngagePermission() {
        return '[data-name="engage-section"] [class*="checkbox--uqfnd checkbox"] [class*="module__label--IWdmJ"]'
    }
    getReportsPermission() {
        return '[data-name="reports-section"] [class*="checkbox--uqfnd checkbox"] [class*="module__label--IWdmJ"]'
    }
    getDeleteRolePopUpText() {
        return "div[class*='_prompt_content_23g16_1']>span"
    }
    getCheckboxRadioBtn() {
        return `[class="_label_1yld4_121"]`
    }
    getSelectBySectionName(sectionName) {
        return `[data-name="${sectionName}-section"]`
    }
    getCheckboxContainer() {
        return `[data-name="rolesPermissionTypes"]`
    }
    //to select a spesific checkbox, pass the section name, index and checkbox name
    //Indexs starts from 0
    getSelectCheckboxBySectionNameAndIndexNumber(sectionName, index, checkboxName) {
        cy.get(this.getSelectBySectionName(sectionName) + ' ' + this.getCheckboxContainer()).eq(index).within(() => {
            cy.get(this.getCheckboxRadioBtn()).contains(checkboxName).click()
        })
    }

    getRolePermissionsForm() {
        return `[data-name="edit-role-permission"]`
    }

    getSectionExpandibleBtn(name) {
        return cy.get(`[data-name="header"]`).contains(name).parent().parent().find('button')
    }

    getCheckBoxes() {
        return `[class="_input_container_1yld4_69"]`
    }

    getCheckBoxInput() {
        return 'input[type="checkbox"]'
    }

    getA5SetupBtn() {
        return `[data-submenu="submenu-system"][title="Setup"]`
    }

    getA5GeneratedReportSubMenu() {
        return `[class="generatedreports submenu-item"]`
    }

    AssertDefaultRoles(roleNames) {

        roleNames.forEach((roleName) => {
            this.AddFilter('Name', 'Equals', roleName)
            //clicking the role to select
            cy.get(this.getTableCellRecord()).contains(roleName).click()
            cy.get(this.getWaitSpinner(), { timeout: 150000 }).should('not.exist')
            cy.wrap(this.WaitForElementStateToChange(ARCoursesPage.getCoursesActionsButtonsByLabel('View Role')))
            cy.get(ARCoursesPage.getCoursesActionsButtonsByLabel('View Role')).click()
            cy.get(this.getWaitSpinner(), { timeout: 150000 }).should('not.exist')
            cy.get(this.getPageHeaderTitle()).should('have.text', "View Role")
            this.AssertBreadCrumbOderedList(roleName)
            cy.go('back')
            cy.get(this.getWaitSpinner(), { timeout: 150000 }).should('not.exist')
            cy.get(this.getRemoveAllBtn()).click()
            cy.get(this.getWaitSpinner(), { timeout: 150000 }).should('not.exist')

        })
    }

    AssertBreadCrumbOderedList(name) {
        cy.get(this.getBreadCrumOrderItem()).eq(0).should('have.text', 'Roles')
        cy.get(this.getBreadCrumOrderItem()).eq(1).should('have.text', 'View Role')
        cy.get(this.getBreadCrumOrderItem()).eq(2).should('have.text', name)
    }

    getBreadCrumOrderItem() {
        return `[aria-label="Breadcrumb"] [data-name="item"]`
    }

    getLableCheckbox() {
        return '[class *="_parent_checkbox_2l92s_1"]'
    }

    getSelectCheckboxSubMenuBySectionNameAndIndexNumber(sectionName, index, checkboxName) {
        cy.get(this.getSelectBySectionName(sectionName) + ' ' + this.getCheckboxContainer()).eq(index).within(() => {          
            cy.get(this.getLableCheckbox()+" "+this.getCheckboxRadioBtn()).contains(checkboxName).click()
        })
    }

    getSubSection() {
        return `[class *="_checkbox_group_ghhpd_1"]`
    }

    getModifyBtn() {
        return `[class*="_checkbox_group_ghhpd_1"] [class *="_parent_checkbox_2l92s_1"] [class="_label_1yld4_121"]`;
    }
    // Added for the JIRA# AUT-585, TC# C2045
    getParentPermissionCheckbox(permission) {
        return `input[type="checkbox"][value="${permission}"]`
    }

    getChildPermissionCheckbox(permission) {
        return `input[type="checkbox"][value="${permission}"]`
    }

    assertChildPermission(parentPermission, childPermission, authorized = 'true') {
        cy.get(this.getParentPermissionCheckbox(parentPermission)).parent().parent().siblings('div').within(() => {
            cy.get(this.getChildPermissionCheckbox(childPermission)).should('have.attr', 'aria-checked', authorized)
        })
    }

    getSelectCheckboxBySectionNameAndIndexNumberAndSaveAsAlias(sectionName, index, checkboxName , aliasName = "element") {
        cy.get(this.getSelectBySectionName(sectionName) + ' ' + this.getCheckboxContainer()).eq(index).within(() => {
            cy.get(this.getCheckboxRadioBtn()).contains(checkboxName).as(aliasName)
        })
    }

}