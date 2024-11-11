import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARGlobalResourcePage from "../../../../../../helpers/AR/pageObjects/GlobalResources/ARGlobalResourcePage"
import ARGroupAddEditPage from "../../../../../../helpers/AR/pageObjects/Groups/ARGroupAddEditPage"
import ARDeleteModal from "../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal"
import { groupDetails } from "../../../../../../helpers/TestData/Groups/groupDetails"
import { users } from "../../../../../../helpers/TestData/users/users"
import ARGroupPage from "../../../../../../helpers/AR/pageObjects/User/ARGroupPage"


describe('AUT-487 - C1928 - GUIA-Story - Acceptance Test - NLE-2210 - Groups Report - Duplicate Group', () => {
    before('Create Group', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getGroupsReport()

        // "Add Group" button should be visible at the right sidebar
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Add Group')).should('be.visible').click()

        // Verify that the add new group page heading is "Add Group"
        cy.get(ARDashboardPage.getPageHeaderTitle()).should('have.text', 'Add Group')
        // Create Group with Valid Name
        cy.get(ARGroupAddEditPage.getNameTxtF()).type(groupDetails.groupName)

        // Set Assignment Automatic
        cy.get(ARGroupAddEditPage.getAssignmentRadioBtn()).contains('Automatic').click()
        ARGroupAddEditPage.verifyAssignmentRadioBtn('Automatic', 'true')

        // Verify that One or More Rules can be Added
        cy.get(ARGroupAddEditPage.getAddRuleBtn()).should('be.visible').click()
        ARGlobalResourcePage.getAddRule(cy.get(ARGlobalResourcePage.getFirstRulesContainer()),'First Name','Contains',users.learner01.learner_01_fname)

        // Save Group
        cy.get(ARGroupAddEditPage.getSaveBtn()).should('not.have.attr', 'aria-disabled', 'true').click()
        cy.get(ARGroupAddEditPage.getToastSuccessMsg()).should('contain', 'Group has been created.')
    })

    after('Delete Group', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getGroupsReport()

        // Filter group
        ARGroupAddEditPage.AddFilter('Name', 'Contains', groupDetails.groupName)
        cy.get(ARGroupAddEditPage.getTableCellContentByIndex(2)).contains(groupDetails.groupName).click()
        // Delete group
        cy.wrap(ARGroupAddEditPage.WaitForElementStateToChange(ARGroupAddEditPage.getDeleteGroupBtn(), 1000))
        cy.get(ARGroupAddEditPage.getDeleteGroupBtn()).click()
        cy.get(ARDeleteModal.getARDeleteBtn()).should('be.visible').click()
        cy.get(ARDeleteModal.getARDeleteBtn()).should('not.exist')
    })

    it('[Duplicate] button should be visible and functional', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getGroupsReport()

        // Filter group
        ARGroupAddEditPage.AddFilter('Name', 'Contains', groupDetails.groupName)
        cy.get(ARGroupAddEditPage.getTableCellContentByIndex(2)).contains(groupDetails.groupName).click()
        // Duplicate btn should functional
        cy.wrap(ARGroupAddEditPage.WaitForElementStateToChange(ARGroupPage.getDuplicateGroupBtn(), 1000))
        cy.get(ARGroupPage.getDuplicateGroupBtn()).click()

        cy.get(ARGroupAddEditPage.getNameTxtF()).should('have.value', groupDetails.groupName + ' - Copy')
    })
})