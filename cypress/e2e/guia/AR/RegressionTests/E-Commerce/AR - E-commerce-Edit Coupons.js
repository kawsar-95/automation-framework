import ARDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARCouponsAddEditPage, { AddCouponsData, ExtentionsData } from '../../../../../../helpers/AR/pageObjects/E-commerce/Coupons/ARCouponsAddEditPage'
import A5ECommerceSettingPage from '../../../../../../helpers/AR/pageObjects/E-commerce/Settings/A5ECommerceSettingPage'
import ARDepartmentProgressReportPage from '../../../../../../helpers/AR/pageObjects/Reports/ARDepartmentProgressReportPage'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { courses } from '../../../../../../helpers/TestData/Courses/courses'
import { departments } from '../../../../../../helpers/TestData/Department/departments'
import { users } from '../../../../../../helpers/TestData/users/users'

describe("C7361 - AR E-Commerce Edit Coupons", function () {
    before(() => {
        // Toggle Off multi currency and Set Default Currency 'CAD'
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        A5ECommerceSettingPage.visitECommertSettings()
        A5ECommerceSettingPage.clickSettingsTab('PaymentGateways')

        A5ECommerceSettingPage.getTurnOnOffAllowMultipleCurrencies(false)
        A5ECommerceSettingPage.setDefaultCurrency('CAD')
        A5ECommerceSettingPage.saveSettings()
    })

    beforeEach(() => {
        //Login into the admin side 
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, "/admin")        
        // Goto Coupons menu
        ARDashboardPage.getCouponsReport()
    })

    it("Create Coupon", () => {
        //create coupon
        cy.createCoupon(AddCouponsData.NAME,AddCouponsData.CODE) 
        //Add 40% Discount
        ARCouponsAddEditPage.getSetDiscountType('Currency')
        ARCouponsAddEditPage.getAddDiscount('Currency', 10)
        //Set date
        ARCouponsAddEditPage.getSelectFullDate('February 2024',1)
        //Set department
        ARCouponsAddEditPage.getSelectDepartmentByName(departments.Dept_E_name)

        //Set Extention
        ARCouponsAddEditPage.getExtentionsByName(ExtentionsData['5_DAYS'])
        
        //Save Coupon
        cy.saveCoupon()
    })

    it("Edit Coupon And Cancel Changes", () => {
        ARCouponsAddEditPage.A5AddFilter("Name", "Contains", AddCouponsData.NAME)
        cy.get(ARDepartmentProgressReportPage.getA5TableCellRecordByColumn(2), {timeout:10000}).should('have.text', AddCouponsData.NAME).click()
        cy.get(ARCouponsAddEditPage.getCouponsActionHeader(), {timeout:10000}).should('contain', 'Actions')

        //Click on Edit from Right Sidebar
        cy.get(ARCouponsAddEditPage.getA5AddEditMenuActionsByIndex(1), {timeout:10000}).should('have.text', 'Edit').click()
        cy.get(ARCouponsAddEditPage.getPageHeadertitleName(), {timeout:10000}).should('contain', 'Edit Coupon').and('be.visible')
        cy.get(ARCouponsAddEditPage.getGeneralTabMenu(), {timeout:10000}).should('be.visible')

        cy.get(ARDashboardPage.getElementByPlaceholderAttribute('Name'), {timeout:10000}).should('be.visible').type(commonDetails.appendText, {force:true})
        cy.get(ARCouponsAddEditPage.getDescriptionTxtF()).type(commonDetails.appendText)

        cy.get(ARCouponsAddEditPage.getGenerateBtn()).click()

        cy.get(ARCouponsAddEditPage.getDepartmentField()).click()
        cy.get(ARDashboardPage.getElementByPlaceholderAttribute('Search')).click().type(departments.Dept_C_name)
        cy.get(ARCouponsAddEditPage.getDepartmentItem(), {timeout:10000}).should('contain' , departments.Dept_C_name)
        cy.get(ARCouponsAddEditPage.getDepartmentItem()).contains(departments.Dept_C_name).click({ force: true })

        ARCouponsAddEditPage.getCourseByName(courses.oc_filter_02_name)
        ARCouponsAddEditPage.getExtentionsByName(ExtentionsData['3_DAYS'])

        // Click Cancel
        cy.get(ARCouponsAddEditPage.getA5AddEditMenuActionsByIndex(2), {timeout:10000}).should('contain', 'Cancel')
        cy.get(ARCouponsAddEditPage.getA5AddEditMenuActionsByIndex(2)).click({force:true})

        // Click Again Cancel
        cy.get(ARCouponsAddEditPage.getConfirmModalBtn()).should('contain', 'Cancel')
        cy.get(ARCouponsAddEditPage.getConfirmModalBtn()).contains('Cancel').click()

        // Click Cancel
        cy.get(ARCouponsAddEditPage.getA5AddEditMenuActionsByIndex(2), {timeout:10000}).should('contain', 'Cancel')
        cy.get(ARCouponsAddEditPage.getA5AddEditMenuActionsByIndex(2)).click({force:true})

        // Click Save
        cy.get(ARCouponsAddEditPage.getModalSaveBtn(), {timeout:10000}).should('be.visible')
        cy.get(ARCouponsAddEditPage.getModalSaveBtn()).click()
        cy.get(ARCouponsAddEditPage.getA5PageHeaderTitle(), {timeout:10000}).should('have.text', 'Coupons')
    })

    it("Edit Coupon And Don't Save", () => {
        ARCouponsAddEditPage.A5AddFilter("Name", "Contains", `${AddCouponsData.NAME}${commonDetails.appendText}`)
        cy.get(ARDepartmentProgressReportPage.getA5TableCellRecordByColumn(2)).should('have.text', `${AddCouponsData.NAME}${commonDetails.appendText}`).click()
        cy.get(ARCouponsAddEditPage.getCouponsActionHeader(), {timeout:10000}).should('contain', 'Actions')

        //Click on Edit from Right Sidebar
        cy.get(ARCouponsAddEditPage.getA5AddEditMenuActionsByIndex(1), {timeout:10000}).should('have.text', 'Edit').click()
        cy.get(ARCouponsAddEditPage.getPageHeadertitleName(), {timeout:10000}).should('contain', 'Edit Coupon')
        cy.get(ARCouponsAddEditPage.getGeneralTabMenu(), {timeout:10000}).should('be.visible')

        cy.get(ARDashboardPage.getElementByPlaceholderAttribute('Name'), {timeout:10000}).should('be.visible').clear().type(AddCouponsData.NAME, {force:true})
        cy.get(ARCouponsAddEditPage.getDescriptionTxtF()).type(commonDetails.appendText)

        cy.get(ARCouponsAddEditPage.getGenerateBtn()).click()
        
        // Click Cancel
        cy.get(ARCouponsAddEditPage.getA5AddEditMenuActionsByIndex(2), {timeout:10000}).should('have.text', 'Cancel').click({force:true})

        // Click Again Cancel
        cy.get(ARCouponsAddEditPage.getConfirmModalBtn(), {timeout:10000}).should('contain', "Don't Save")
        cy.get(ARCouponsAddEditPage.getConfirmModalBtn()).contains("Don't Save").click()
        cy.get(ARCouponsAddEditPage.getA5PageHeaderTitle(), {timeout:10000}).should('have.text', 'Coupons')
    })

    it("Edit Coupon And Save Changes", () => {
        ARCouponsAddEditPage.A5AddFilter("Name", "Contains", `${AddCouponsData.NAME}${commonDetails.appendText}`)
        cy.get(ARDepartmentProgressReportPage.getA5TableCellRecordByColumn(2)).should('have.text', `${AddCouponsData.NAME}${commonDetails.appendText}`).click()
        cy.get(ARCouponsAddEditPage.getCouponsActionHeader(), {timeout:10000}).should('contain', 'Actions')

        //Click on Edit from Right Sidebar
        cy.get(ARCouponsAddEditPage.getA5AddEditMenuActionsByIndex(1), {timeout:10000}).should('have.text', 'Edit').click()
        cy.get(ARCouponsAddEditPage.getPageHeadertitleName(), {timeout:10000}).should('contain', 'Edit Coupon')
        cy.get(ARCouponsAddEditPage.getGeneralTabMenu(), {timeout:10000}).should('be.visible')

        cy.get(ARDashboardPage.getElementByPlaceholderAttribute('Name'), {timeout:10000}).should('be.visible').clear().type(AddCouponsData.NAME, {force:true})
        cy.get(ARCouponsAddEditPage.getDescriptionTxtF()).type(commonDetails.appendText)

        cy.get(ARCouponsAddEditPage.getElementByNameAttribute('Code')).clear().type(AddCouponsData.CODE)
        
        //Save Coupon
        cy.saveCoupon()
    })

    it('cleaning up the created coupon', () => {
        cy.deleteCoupon(AddCouponsData.CODE)  
    })
})