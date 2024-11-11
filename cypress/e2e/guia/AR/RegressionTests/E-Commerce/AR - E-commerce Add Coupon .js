import ARDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARCouponsAddEditPage, { AddCouponsData, ExtentionsData } from '../../../../../../helpers/AR/pageObjects/E-commerce/Coupons/ARCouponsAddEditPage'
import A5ECommerceSettingPage from '../../../../../../helpers/AR/pageObjects/E-commerce/Settings/A5ECommerceSettingPage'
import ARDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import ARDepartmentProgressReportPage from '../../../../../../helpers/AR/pageObjects/Reports/ARDepartmentProgressReportPage'
import { courses } from '../../../../../../helpers/TestData/Courses/courses'
import { departments } from '../../../../../../helpers/TestData/Department/departments'
import { users } from '../../../../../../helpers/TestData/users/users'

describe("C6279 - AR E-Commerce Add Coupon", function () {

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
        //Goto Coupons menu
        ARDashboardPage.getCouponsReport()
    })

    it("Add Coupon", () => {
        //create coupon
        cy.createCoupon(AddCouponsData.NAME,AddCouponsData.CODE)

        cy.get(ARCouponsAddEditPage.getGenerateBtn()).click()

        //Add 20 CAD Discount
        ARCouponsAddEditPage.getSetDiscountType('Percentage')
        ARCouponsAddEditPage.getAddDiscount('Percentage', 10)
        //Set date
        ARCouponsAddEditPage.getSelectFullDate('February 2024',1)
        //Set department
        ARCouponsAddEditPage.getSelectDepartmentByName(departments.Dept_E_name)

        ARCouponsAddEditPage.getCourseByName(courses.oc_filter_01_name)

        //Set Extention
        ARCouponsAddEditPage.getExtentionsByName(ExtentionsData['5_DAYS'])
        
        //Save Coupon
        cy.saveCoupon()
    })
    
    it("Add Coupon, click Cancel and Don't Save Changes", () => {
        //create coupon
        cy.createCoupon(AddCouponsData.NAME,AddCouponsData.CODE)

        //Add 20 CAD Discount
        ARCouponsAddEditPage.getSetDiscountType('Percentage')
        ARCouponsAddEditPage.getAddDiscount('Percentage', 10)
        //Set date
        ARCouponsAddEditPage.getSelectFullDate('March 2024',1)
        //Set department
        ARCouponsAddEditPage.getSelectDepartmentByName(departments.Dept_F_name)

        ARCouponsAddEditPage.getCourseByName(courses.oc_filter_02_name)

        //Set Extention
        ARCouponsAddEditPage.getExtentionsByName(ExtentionsData['3_DAYS'])

        // Click Cancel
        cy.get(ARCouponsAddEditPage.getA5AddEditMenuActionsByIndex(2), {timeout:10000}).should('have.text', 'Cancel').click({force:true})

        // Click Again Cancel
        cy.get(ARCouponsAddEditPage.getConfirmModalBtn(), {timeout:10000}).should('contain', "Don't Save")
        cy.get(ARCouponsAddEditPage.getConfirmModalBtn()).contains("Don't Save").click()
        cy.get(ARCouponsAddEditPage.getConfirmModalBtn()).should('not.be.visible')
        cy.get(ARCouponsAddEditPage.getA5PageHeaderTitle(), {timeout:10000}).should('have.text', 'Coupons')
    })

    it("Add Coupon, click Cancel and Save Changes", () => {
        //create coupon
        cy.createCoupon(AddCouponsData.NAME2,AddCouponsData.CODE)

        //Add 20 CAD Discount
        ARCouponsAddEditPage.getSetDiscountType('Percentage')
        ARCouponsAddEditPage.getAddDiscount('Percentage', 10)
        //Set date
        ARCouponsAddEditPage.getSelectFullDate('March 2024',1)
        //Set department
        ARCouponsAddEditPage.getSelectDepartmentByName(departments.Dept_F_name)

        ARCouponsAddEditPage.getCourseByName(courses.oc_filter_02_name)

        //Set Extention
        ARCouponsAddEditPage.getExtentionsByName(ExtentionsData['3_DAYS'])

        // Click Cancel
        cy.get(ARCouponsAddEditPage.getA5AddEditMenuActionsByIndex(2), {timeout:10000}).should('contain', 'Cancel')
        cy.get(ARCouponsAddEditPage.getA5AddEditMenuActionsByIndex(2)).click({force:true})

        // Click Save
        cy.get(ARCouponsAddEditPage.getModalSaveBtn(), {timeout:10000}).should('be.visible')
        cy.get(ARCouponsAddEditPage.getModalSaveBtn()).click()
        cy.get(ARCouponsAddEditPage.getModalSaveBtn(), {timeout:10000}).should('not.be.visible')
        cy.get(ARCouponsAddEditPage.getA5PageHeaderTitle(), {timeout:10000}).should('have.text', 'Coupons')
    })

    it('cleaning up the created coupon', () => {
        ARCouponsAddEditPage.A5AddFilter("Name", "Contains", AddCouponsData.NAME)
        cy.get(ARDepartmentProgressReportPage.getA5TableCellRecordByColumn(2), {timeout:10000}).should('have.text', AddCouponsData.NAME).click()
        cy.get(ARCouponsAddEditPage.getCouponsActionHeader(), {timeout:10000}).should('contain', 'Actions')

        // Click on Delete from Right Sidebar
        cy.get(ARCouponsAddEditPage.getA5AddEditMenuActionsByIndex(3), {timeout:10000}).should('contain', 'Delete Coupon').click()
        cy.get(ARDeleteModal.getA5OKBtn(), {timeout:10000}).should('be.visible').click()
        cy.get(ARDeleteModal.getA5OKBtn(), {timeout:10000}).should('not.be.visible')

        cy.get(ARCouponsAddEditPage.getRemoveAllFilterBtn(), {timeout:10000}).should('be.visible').click()

        cy.deleteCoupon(AddCouponsData.CODE)
    })
})