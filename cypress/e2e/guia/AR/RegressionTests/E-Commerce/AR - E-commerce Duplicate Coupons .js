
import ARDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARCouponsAddEditPage, { AddCouponsData } from '../../../../../../helpers/AR/pageObjects/E-commerce/Coupons/ARCouponsAddEditPage'
import ARDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import { users } from '../../../../../../helpers/TestData/users/users'


describe("C6277 - AE - E-commerce duplicate coupons ", function () {

    beforeEach(() => {
        //Login into the admin side 
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, "/admin") 
        // Goto Coupons menu
         ARDashboardPage.getCouponsReport()
    })

    it("Create Coupon", () => {
        //create coupon
        cy.createCoupon(AddCouponsData.NAME,AddCouponsData.CODE) 
        //Save Coupon
        cy.saveCoupon()
    })

    it("Duplicate Coupon", function () {
        ARCouponsAddEditPage.A5AddFilter("Name", "Contains", AddCouponsData.NAME)
        cy.get(ARCouponsAddEditPage.getA5TableCellRecordByColumn(2), {timeout:10000}).should('have.text', AddCouponsData.NAME).click()
        cy.get(ARCouponsAddEditPage.getCouponsActionHeader(), {timeout:10000}).should('contain', 'Actions')        

        cy.get(ARCouponsAddEditPage.getA5AddEditMenuActionsByIndex(1), {timeout:10000}).should('contain', 'Edit')
        cy.get(ARCouponsAddEditPage.getA5AddEditMenuActionsByIndex(2), {timeout:10000}).should('contain', 'Duplicate')
        cy.get(ARCouponsAddEditPage.getA5AddEditMenuActionsByIndex(3), {timeout:10000}).should('contain', 'Delete Coupon')
        cy.get(ARCouponsAddEditPage.getA5AddEditMenuActionsByIndex(4), {timeout:10000}).should('contain', 'Deselect')
        //Click on Duplicate
        cy.get(ARCouponsAddEditPage.getA5AddEditMenuActionsByIndex(2)).click()

        // Verify redirect to Add Coupon Page
        cy.get(ARCouponsAddEditPage.getPageHeadertitleName(), {timeout:10000}).should('have.text', 'Add Coupon').and('be.visible')
        cy.get(ARCouponsAddEditPage.getGeneralTabMenu(), {timeout:10000}).should('be.visible')

        // Verify Name
        cy.get(ARDashboardPage.getElementByPlaceholderAttribute('Name'), {timeout:10000}).should('have.value', `${AddCouponsData.NAME} - Copy`)

        // Generate the code
        cy.get(ARCouponsAddEditPage.getGenerateBtn(), {timeout:10000}).should('be.visible').click()

        //Save Coupon
        cy.saveCoupon()
    })

    it("deleting the created and duplicate coupon", function () {
        ARCouponsAddEditPage.A5AddFilter("Name", "Contains", `${AddCouponsData.NAME} - Copy`)
        cy.get(ARCouponsAddEditPage.getA5TableCellRecordByColumn(2), {timeout:10000}).should('have.text', `${AddCouponsData.NAME} - Copy`).click()
        cy.get(ARCouponsAddEditPage.getCouponsActionHeader(), {timeout:10000}).should('contain', 'Actions')

        // Click on Delete from Right Sidebar
        cy.get(ARCouponsAddEditPage.getA5AddEditMenuActionsByIndex(3), {timeout:10000}).should('contain', 'Delete Coupon').click()
        cy.get(ARDeleteModal.getA5OKBtn(), {timeout:10000}).should('be.visible').click()
        cy.get(ARDeleteModal.getA5OKBtn(), {timeout:10000}).should('not.be.visible')

        cy.get(ARCouponsAddEditPage.getRemoveAllFilterBtn(), {timeout:10000}).should('be.visible').click()
        cy.deleteCoupon(AddCouponsData.CODE)
    })
})
