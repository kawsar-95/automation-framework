import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage";
import ARDeleteModal from "../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal";
import ARSelectModal from "../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal";
import ARUserAddEditPage from "../../../../../../helpers/AR/pageObjects/User/ARUserAddEditPage";
import { userDetails } from "../../../../../../helpers/TestData/users/UserDetails";
import { users } from "../../../../../../helpers/TestData/users/users";
import departments from "../../../../../fixtures/departments.json";


describe("C6308 AR - Reports - User History report", function () {

    before(function () {
        //Create a new user
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
    })

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Users
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Users'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Users'))
        cy.intercept('/api/rest/v2/admin/reports/users/operations').as('getUsers').wait('@getUsers')
        ARDashboardPage.getMediumWait()
    })

    it("View User history report ", function () {
        //Filtering out newly created user
        ARDashboardPage.AddFilter('Username', 'Contains', userDetails.username)
        ARDashboardPage.getMediumWait()
        //Selecting user from the table 
        cy.get(ARDashboardPage.getGridTable()).eq(0).click()
        ARDashboardPage.getMediumWait()
        //Click on Edit User
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Edit User')).click()
        cy.get(ARUserAddEditPage.getFirstNameTxtF()).clear().type(userDetails.firstName)
        cy.get(ARUserAddEditPage.getLastNameTxtF()).clear().type(userDetails.lastName)
        cy.get(ARUserAddEditPage.getEmailAddressTxtF()).clear().type(userDetails.emailAddress)
        cy.get(ARUserAddEditPage.getDepartmentTxtF()).click()
        ARSelectModal.SearchAndSelectFunction([departments.DEPTB_NAME])
        cy.get(ARUserAddEditPage.getSaveBtn()).click()

        //2nd User
        //Click on Edit User
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Edit User')).click()
        cy.get(ARUserAddEditPage.getAddEditMenuActionsByName('View History')).click()
        ARUserAddEditPage.getMediumWait()

        cy.get(ARUserAddEditPage.getUserHistoryModalFocus()).within(function () {
            cy.get(ARDashboardPage.getElementByDataNameAttribute('dialog-title')).should('have.text', 'User History')
            cy.get(ARDashboardPage.getElementByDataNameAttribute('close')).should('have.text', 'Close').click()

        })

    })

    after("delete the created user", function () {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getShortWait()
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Users'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Users'))
        ARDashboardPage.getMediumWait()
        ARDashboardPage.AddFilter('Username', 'Contains', userDetails.username)
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getGridTable()).eq(0).click()
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Delete')).click()
        ARDashboardPage.getShortWait()
        cy.get(ARDashboardPage.getElementByDataNameAttribute(ARDeleteModal.getDeleteBtn())).click()
        ARDashboardPage.getMediumWait()
    })


})