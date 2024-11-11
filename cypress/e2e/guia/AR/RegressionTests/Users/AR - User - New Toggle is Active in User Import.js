import arDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARGroupAddEditPage from "../../../../../../helpers/AR/pageObjects/Groups/ARGroupAddEditPage"
import A5LeaderboardsAddEditPage from "../../../../../../helpers/AR/pageObjects/Leaderboards/A5LeaderboardsAddEditPage"
import ARDeleteModal from "../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal"
import ARUploadFileModal from "../../../../../../helpers/AR/pageObjects/Modals/ARUploadFileModal"
import A5ClientsPage from "../../../../../../helpers/AR/pageObjects/Setup/A5ClientsPage"
import ARUserImportPage from "../../../../../../helpers/AR/pageObjects/User/ARUserImportPage"
import { others, resourcePaths } from "../../../../../../helpers/TestData/resources/resources"
import { userDetails } from "../../../../../../helpers/TestData/users/UserDetails"
import { users } from "../../../../../../helpers/TestData/users/users"

describe('C7340 AUT-706, AR - User - New Toggle is Active in User Import', function () {
    before(() => {
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0) //Create a Learner
    })

    beforeEach(() => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getUsersReport()
    })

    after(() => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getUsersReport()

        arDashboardPage.AddFilter('Username', 'Contains', userDetails.username)
        arDashboardPage.getMediumWait()

        cy.wrap(arDashboardPage.selectTableCellRecord(userDetails.username))
        cy.wrap(arDashboardPage.WaitForElementStateToChange(arDashboardPage.getAddEditMenuActionsByName('Delete'), 1000))
        cy.get(arDashboardPage.getAddEditMenuActionsByName('Delete')).click()
        cy.wrap(arDashboardPage.WaitForElementStateToChange(arDashboardPage.getElementByDataNameAttribute(ARDeleteModal.getDeleteBtn()), 1000))
        cy.get(arDashboardPage.getElementByDataNameAttribute(ARDeleteModal.getDeleteBtn())).click()
    })

    it('imported users be active and validate', () => {
        // Verify User page should be displayed
        cy.get(arDashboardPage.getPageHeaderTitle()).should('have.text', "Users")

        // Click on User Import button
        cy.get(arDashboardPage.getAddEditMenuActionsByName('User Import')).click()
        arDashboardPage.getMediumWait()

        // Verify Add user Page should be displayed
        cy.get(A5LeaderboardsAddEditPage.getA5EditPageHeadertitle()).should('contain', 'User Import')

        cy.get(ARGroupAddEditPage.getUserImportChooseFileBtn()).click()
        arDashboardPage.getShortWait()

        // Check if Upload File pop up is opened
        cy.contains('Upload File').should('be.visible')

        cy.get(ARUploadFileModal.getA5ChooseFileBtn()).click({force:true})
        arDashboardPage.getShortWait()

        cy.get(arDashboardPage.getInputFileTxtF()).attachFile(resourcePaths.resource_user_import_csv_file + others.user_import_csv_filename)
        arDashboardPage.getMediumWait()

        cy.get(ARUploadFileModal.getA5SaveBtn()).click()
        arDashboardPage.getMediumWait()

        cy.get(A5LeaderboardsAddEditPage.getA5EditPageHeadertitle()).should('contain', 'User Import')

        cy.get(ARGroupAddEditPage.getLMSUserName()).find('select').select('First Name')
        arDashboardPage.getShortWait()

        // Verify toggle is called Active Status
        ARUserImportPage.verifyToggleIsCalledActiveStatus()

        // Verify toggle is active by default
        cy.get(ARUserImportPage.getActiveStatusToggle()).should('have.class', 'on')

        // Verify support message displays that all users will be marked as active
        cy.get(ARUserImportPage.getActiveStatusOnTxt()).should('have.text', ARUserImportPage.activeStatusOnMsg())

        // Set Update Existing Users On
        ARUserImportPage.verifyToggleIsCalledUpdateExistingUsers()
        cy.get(ARUserImportPage.getUpdateExistingUsersToggle()).should('not.have.class', 'on')
        cy.get(ARUserImportPage.getUpdateExistingUsersToggle()).click()
        arDashboardPage.getShortWait()
        cy.get(ARUserImportPage.getUpdateExistingUsersToggle()).should('have.class', 'on')
        cy.get(ARUserImportPage.getLinkSpreadsheetField()).select('First Name')
        cy.get(ARUserImportPage.getUniqueLMSField()).select('Username')

        // From the User Import screen Select validate
        cy.wrap(A5ClientsPage.getA5ClientPageSidebar('Validate'))
        arDashboardPage.getMediumWait()

        // Verify Preview Summary
        cy.get(ARUserImportPage.getSuccessHighlightMsg()).should('contain.text', 'Preview Summary:')

        // 1 Users will be added as Active
        cy.get(ARUserImportPage.getSuccessHighlightMsg()).should('contain.text', '1 Users will be added as Active')

        // 1 Users will be updated as Active
        cy.get(ARUserImportPage.getSuccessHighlightMsg()).should('contain.text', '1 Users will be updated as Active')
    })

    it('imported users be Inactive and validate', () => {
        // Verify User page should be displayed
        cy.get(arDashboardPage.getPageHeaderTitle()).should('have.text', "Users")

        // Click on User Import button
        cy.get(arDashboardPage.getAddEditMenuActionsByName('User Import')).click()
        arDashboardPage.getMediumWait()

        // Verify Add user Page should be displayed
        cy.get(A5LeaderboardsAddEditPage.getA5EditPageHeadertitle()).should('contain', 'User Import')

        cy.get(ARGroupAddEditPage.getUserImportChooseFileBtn()).click()
        arDashboardPage.getShortWait()

        // Check if Upload File pop up is opened
        cy.contains('Upload File').should('be.visible')

        cy.get(ARUploadFileModal.getA5ChooseFileBtn()).click({force:true})
        arDashboardPage.getShortWait()

        cy.get(arDashboardPage.getInputFileTxtF()).attachFile(resourcePaths.resource_user_import_csv_file + others.user_import_csv_filename)
        arDashboardPage.getMediumWait()

        cy.get(ARUploadFileModal.getA5SaveBtn()).click()
        arDashboardPage.getMediumWait()

        cy.get(A5LeaderboardsAddEditPage.getA5EditPageHeadertitle()).should('contain', 'User Import')

        cy.get(ARGroupAddEditPage.getLMSUserName()).find('select').select('First Name')
        arDashboardPage.getShortWait()

        // Verify toggle is called Active Status
        ARUserImportPage.verifyToggleIsCalledActiveStatus()

        // Verify toggle is active by default
        cy.get(ARUserImportPage.getActiveStatusToggle()).should('have.class', 'on')

        // Verify support message displays that all users will be marked as active
        cy.get(ARUserImportPage.getActiveStatusOnTxt()).should('have.text', ARUserImportPage.activeStatusOnMsg())

        // Set toggle inactive
        cy.get(ARUserImportPage.getActiveStatusToggle()).click()

        // Verify toggle is Inactive
        cy.get(ARUserImportPage.getActiveStatusToggle()).should('not.have.class', 'on')

        // Verify support message displays that all users will be marked as inactive
        cy.get(ARUserImportPage.getActiveStatusOffTxt()).should('have.text', ARUserImportPage.activeStatusOffMsg())

        // Set Update Existing Users On
        ARUserImportPage.verifyToggleIsCalledUpdateExistingUsers()
        cy.get(ARUserImportPage.getUpdateExistingUsersToggle()).should('not.have.class', 'on')
        cy.get(ARUserImportPage.getUpdateExistingUsersToggle()).click()
        arDashboardPage.getShortWait()
        cy.get(ARUserImportPage.getUpdateExistingUsersToggle()).should('have.class', 'on')
        cy.get(ARUserImportPage.getLinkSpreadsheetField()).select('First Name')
        cy.get(ARUserImportPage.getUniqueLMSField()).select('Username')


        cy.wrap(A5ClientsPage.getA5ClientPageSidebar('Validate'))
        arDashboardPage.getMediumWait()

        // Verify Preview Summary
        cy.get(ARUserImportPage.getSuccessHighlightMsg()).should('contain.text', 'Preview Summary:')

        // 1 Users will be added as Active
        cy.get(ARUserImportPage.getSuccessHighlightMsg()).should('contain.text', '1 Users will be added as Inactive')

        // 1 Users will be updated as Active
        cy.get(ARUserImportPage.getSuccessHighlightMsg()).should('contain.text', '1 Users will be updated as Inactive')
    })   
})