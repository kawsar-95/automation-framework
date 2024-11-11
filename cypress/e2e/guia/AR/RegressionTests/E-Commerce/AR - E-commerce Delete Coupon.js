import ARDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARCouponsAddEditPage, { AddCouponsData } from '../../../../../../helpers/AR/pageObjects/E-commerce/Coupons/ARCouponsAddEditPage'
import ARDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import { users } from '../../../../../../helpers/TestData/users/users'


describe("C6278 - AR E-commerce Delete Coupon " , function () {

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

    it("Verify Delete Modal , press OK Button " , function () {
        ARCouponsAddEditPage.A5AddFilter("Name", "Contains", AddCouponsData.NAME)
        cy.get(ARCouponsAddEditPage.getA5TableCellRecordByColumn(2), {timeout:10000}).should('have.text', AddCouponsData.NAME).click()
        cy.get(ARCouponsAddEditPage.getCouponsActionHeader(), {timeout:10000}).should('contain', 'Actions')        

        cy.get(ARCouponsAddEditPage.getA5AddEditMenuActionsByIndex(1), {timeout:10000}).should('contain', 'Edit')
        cy.get(ARCouponsAddEditPage.getA5AddEditMenuActionsByIndex(2), {timeout:10000}).should('contain', 'Duplicate')
        cy.get(ARCouponsAddEditPage.getA5AddEditMenuActionsByIndex(3), {timeout:10000}).should('contain', 'Delete Coupon')
        cy.get(ARCouponsAddEditPage.getA5AddEditMenuActionsByIndex(4), {timeout:10000}).should('contain', 'Deselect')
        //Click on Delete and press Cancel Button
        cy.get(ARCouponsAddEditPage.getA5AddEditMenuActionsByIndex(3)).click()

        /* Verify that the modal displays[OK] and [Cancel] buttons and message
          "Are you sure you want to delete 'xxxx'? , xxxx is name of the Coupon */
        cy.get(ARDeleteModal.getA5ModalContent()).should('contain', ARDeleteModal.getDeleteMsg(AddCouponsData.NAME))
        cy.get(ARDeleteModal.getA5CancelBtn(), {timeout:10000}).should('be.visible').click()
        cy.get(ARDeleteModal.getA5CancelBtn(), {timeout:10000}).should('not.be.visible')

        //Click on Delete and press OK Button
        cy.get(ARCouponsAddEditPage.getA5AddEditMenuActionsByIndex(3), {timeout:10000}).should('contain', 'Delete Coupon').click()
        cy.get(ARDeleteModal.getA5OKBtn(), {timeout:10000}).should('be.visible').click()
        cy.get(ARDeleteModal.getA5OKBtn(), {timeout:10000}).should('not.be.visible')
    })
})