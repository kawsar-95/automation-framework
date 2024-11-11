import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage";
import { users } from "../../../../../../helpers/TestData/users/users";
import { adminRoles, userDetails } from "../../../../../../helpers/TestData/users/UserDetails"
import ARUserAddEditPage from "../../../../../../helpers/AR/pageObjects/User/ARUserAddEditPage";
import ARUserPage from "../../../../../../helpers/AR/pageObjects/User/ARUserPage"
import ARComposeMessage from "../../../../../../helpers/AR/pageObjects/Departments/ARComposeMessage";
import { messages } from "../../../../../../helpers/TestData/Courses/ilc";
import ARSelectModal from "../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal";
import departments from '../../../../../fixtures/departments.json'


describe('AUT-373- C1078 - AE - Admin Regression - NASA-715 - Messages - Recipient Count calculation (cloned)', () => {
    before('Create an Admin, and one Learner Users', () => {        
        cy.createUser(void 0, userDetails.username, ["Admin"], "ALL")
        // All users default depatment is Top Level Department if department param is not provided
        cy.createUser(void 0, userDetails.username2, ["Learner"], void 0)
        cy.createUser(void 0, userDetails.username3, ["Learner"], void 0)
    })

    beforeEach('Login as an System Admin and navigate to the Users Report', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin') 
        ARDashboardPage.getUsersReport()
    })

    after('Delete new Admin user', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(ARDashboardPage.getWaitSpinner() , {timeout:15000}).should("not.exist")
        ARDashboardPage.deleteUsers([userDetails.username, userDetails.username2, userDetails.username3])
    })

    it('Edit new Admin user and set Admin Role', () => {
        // Filter and select new Learner User and click on it
        ARUserPage.AddFilter('Username', 'Equals', userDetails.username)
        cy.get(ARUserPage.getGridTable(), {timeout: 3000}).eq(0).click()
        cy.get(ARUserPage.getAddEditMenuActionsByName('Edit User'), {timeout: 3000}).click()

        cy.get(ARUserAddEditPage.getPageHeaderTitle(), {timeout: 7500}).should('contain', 'Edit User')

        // Setup user management and select all admin roles
        cy.get(ARUserAddEditPage.getUserManagementRadioBtn()).contains('All').click()

        cy.get(ARUserAddEditPage.getRolesDDown()).click()
        cy.get(ARUserAddEditPage.getRolesDDownSearchTxtF(), {timeout: 3000}).type(adminRoles.admin) 
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout: 3000}).should('not.exist')
        cy.get(ARUserAddEditPage.getRolesDDownOpt()).contains(new RegExp(`^(${adminRoles.admin})$`, "g"), {timeout: 3000}).click()
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout: 3000}).should('not.exist')

        // Save user
        ARUserAddEditPage.WaitForElementStateToChange(ARUserAddEditPage.getSaveBtn())
        cy.get(ARUserAddEditPage.getSaveBtn()).click()
        cy.get(ARDashboardPage.getPageHeaderTitle(), { timeout: 15000 }).should('contain', 'Users')
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout: 3000}).should('not.exist')
    })

    it('Edit the 2nd Learner user and inactivate him', () => {
        // Filter and select new Learner User and click on it
        ARUserPage.AddFilter('Username', 'Equals', userDetails.username3)
        cy.get(ARUserPage.getGridTable(), {timeout: 3000}).eq(0).click()
        cy.get(ARUserPage.getAddEditMenuActionsByName('Edit User'), {timeout: 3000}).click()

        cy.get(ARUserAddEditPage.getPageHeaderTitle(), {timeout: 7500}).should('contain', 'Edit User')

        // Assert that the user is active
        cy.get(ARUserAddEditPage.getIsActiveAriaLabel()).should('have.attr', ARUserAddEditPage.getAriaCheckedAttribute(), 'true')
        // Inactivate the user
        cy.get(ARUserAddEditPage.getEnableLabelAttributeName()).contains('Active').click()

        // Save user
        ARUserAddEditPage.WaitForElementStateToChange(ARUserAddEditPage.getSaveBtn())
        cy.get(ARUserAddEditPage.getSaveBtn()).click()
        cy.get(ARDashboardPage.getPageHeaderTitle(), { timeout: 15000 }).should('contain', 'Users')
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout: 3000}).should('not.exist')
    })

    it('Verify message recipient count', () => {
        ARDashboardPage.AddFilter('Username', 'Equals', userDetails.username2)
        cy.get(ARUserPage.getGridTable(), {timeout: 3000}).eq(0).click()
        cy.get(ARUserPage.getAddEditMenuActionsByName('Message User'), {timeout: 1000}).click()
        cy.get(ARComposeMessage.getPageHeaderTitle(), {timeout: 7500}).should('contain', 'Compose Message')

        cy.get(ARComposeMessage.getRecipientCount(), {timeout: 7500}).invoke('text').then(recipientCountMessage => {
            const recipientCount = parseInt(recipientCountMessage.replace(/\D/g,''))

            // Add anoterh Adminstrator only recipient
            cy.get(ARComposeMessage.getElementByDataNameAttribute(ARComposeMessage.getToTextFieldDDown())).click()
            cy.get(ARComposeMessage.getToTextFieldDDownSearchTxtF()).type(userDetails.username)
            ARComposeMessage.getToTextFieldDDownUserNameOpt(userDetails.username).click()
            cy.get(ARComposeMessage.getNonlearnersMsg(), {timeout: 7500}).should('contain', messages.recipientContainsNonLearners)
            cy.get(ARComposeMessage.getRecipientCount(), {timeout: 1000}).invoke('text').then(moreRecipientCountMessage => {
                const moreRecipientCount = parseInt(moreRecipientCountMessage.replace(/\D/g,''))
                expect(moreRecipientCount).to.be.greaterThan(recipientCount)

                cy.get(ARComposeMessage.getSendToRadioBtn()).contains('Send to departments').click()
                cy.get(ARDashboardPage.getAddDepartmentsBtn()).click()
                ARSelectModal.SearchAndSelectFunction([departments.DEPT_TOP_NAME])
                cy.get(ARComposeMessage.getInactiveLearnersMsg(), {timeout: 7500}).should('contain', messages.recipientContainsInactiveLearners)

                cy.get(ARComposeMessage.getRecipientCount(), {timeout: 1000}).invoke('text').then(departmentRecipientCountMessage => {
                    const departmentRecipientCount = parseInt(departmentRecipientCountMessage.replace(/\D/g,''))
                    expect(departmentRecipientCount).to.be.greaterThan(recipientCount + moreRecipientCount)
                })
            })
        })
    })

    it('Edit the 2nd Learner user to activate for deletion', () => {
        // Filter and select new Learner User and click on it
        ARUserPage.AddFilter('Status', 'Inactive')
        ARUserPage.AddFilter('Username', 'Equals', userDetails.username3)
        cy.get(ARUserPage.getGridTable(), {timeout: 3000}).eq(0).click()
        cy.get(ARUserPage.getAddEditMenuActionsByName('Edit User'), {timeout: 3000}).click()

        cy.get(ARUserAddEditPage.getPageHeaderTitle(), {timeout: 7500}).should('contain', 'Edit User')

        // Assert that the user is active
        cy.get(ARUserAddEditPage.getIsActiveAriaLabel()).should('have.attr', ARUserAddEditPage.getAriaCheckedAttribute(), 'false')
        // Activate the user
        cy.get(ARUserAddEditPage.getEnableLabelAttributeName()).contains('Active').click()

        // Save user
        ARUserAddEditPage.WaitForElementStateToChange(ARUserAddEditPage.getSaveBtn())
        cy.get(ARUserAddEditPage.getSaveBtn()).click()
        cy.get(ARDashboardPage.getPageHeaderTitle(), { timeout: 15000 }).should('contain', 'Users')
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout: 3000}).should('not.exist')
    })
})