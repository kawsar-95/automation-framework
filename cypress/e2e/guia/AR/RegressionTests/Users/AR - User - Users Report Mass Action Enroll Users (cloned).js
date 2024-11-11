import ARAddEditCategoryPage from "../../../../../../helpers/AR/pageObjects/Category/ARAddEditCategoryPage"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARCouponsAddEditPage from "../../../../../../helpers/AR/pageObjects/E-commerce/Coupons/ARCouponsAddEditPage"
import ARSelectModal from "../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal"
import ARDepartmentProgressReportPage from "../../../../../../helpers/AR/pageObjects/Reports/ARDepartmentProgressReportPage"
import AREnrollUsersPage from "../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage"
import ARUserPage from "../../../../../../helpers/AR/pageObjects/User/ARUserPage"
import { users } from "../../../../../../helpers/TestData/users/users"
import { courses } from '../../../../../../helpers/TestData/Courses/courses'

describe("C998 - AR - Users Report Mass Action Enroll Users (cloned)", function () {

    beforeEach("Prerequisite", () => {
        //Login into the admin side 
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, "/admin")
        //Click on Users from left panel
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Users'))).click()
        cy.get(ARDashboardPage.getElementByDataName(ARDashboardPage.getMenuHeaderTitleDataName())).should('contain', 'Users')
        // Goto Users menu
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Users'))
        ARDashboardPage.getShortWait()
        cy.get(ARAddEditCategoryPage.getReportPageTitle()).should('contain', 'Users')

    })

    it("Verify Admin can select multiple items in User report ", function () {
        //Selecting first row 
        cy.get(ARDashboardPage.getGridTable()).eq(0).click()
        cy.get(ARDashboardPage.getGridTable()).eq(0).should('have.attr', 'class').should('include', AREnrollUsersPage.getSelectedRowCssClass())
        //Selecting Second Row
        ARDashboardPage.getVShortWait()
        cy.get(ARDashboardPage.getGridTable()).eq(1).click()
        cy.get(ARDashboardPage.getGridTable()).eq(1).should('have.attr', 'class').should('include', AREnrollUsersPage.getSelectedRowCssClass())
        //Verifying Enroll Users mass action button
        ARDashboardPage.getShortWait()
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Enroll Users')).should('exist')
        //Clicking on Enroll Users Button 
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Enroll Users')).click()
        ARDashboardPage.getShortWait()
        //Verifying Enroll users Page
        cy.get(ARDashboardPage.getElementByDataNameAttribute("enroll-users-section")).within(() => {
            cy.get(ARDashboardPage.getElementByDataNameAttribute("header")).should('have.text', 'Enroll Users')
        })

        //Clicking in add course button 
        cy.get(ARDashboardPage.getElementByDataNameAttribute(AREnrollUsersPage.getEnrollUsersAddCourseBtn())).click()
        //Searching the course 
        ARSelectModal.SearchAndSelectFunction([courses.oc_filter_01_name])
        //Short wait 
        ARDashboardPage.getShortWait()
        cy.get(AREnrollUsersPage.getEnrollCourseModuleDetails()).within(()=>{
            cy.get(ARDashboardPage.getElementByDataNameAttribute("name")).should('have.text',courses.oc_filter_01_name)
        })

        //Selecting cancel Button
        cy.get(AREnrollUsersPage.getEnrollUsersContextMenu()).within(() => {
            cy.get(AREnrollUsersPage.getElementByDataNameAttribute("cancel")).click()
        })
        //clicking on OK button
        cy.get(ARAddEditCategoryPage.getAlertOKBtn()).click()
        ARDashboardPage.getShortWait()
        //Moving back to Users Page 
        cy.get(ARAddEditCategoryPage.getReportPageTitle()).should('contain', 'Users')
        //Asserting Selected Row Persists 
        cy.get(ARDashboardPage.getGridTable()).eq(0).should('have.attr', 'class').should('include', AREnrollUsersPage.getSelectedRowCssClass())
        cy.get(ARDashboardPage.getGridTable()).eq(1).should('have.attr', 'class').should('include', AREnrollUsersPage.getSelectedRowCssClass())

    })


})