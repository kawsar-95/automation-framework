




import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import arGroupAddEditPage from '../../../../../../helpers/AR/pageObjects/Groups/ARGroupAddEditPage'
import arSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import { departments } from '../../../../../../helpers/TestData/Department/departments'
import { groupDetails } from '../../../../../../helpers/TestData/Groups/groupDetails'
import { users } from '../../../../../../helpers/TestData/users/users'
import ARGlobalResourcePage from '../../../../../../helpers/AR/pageObjects/GlobalResources/ARGlobalResourcePage'
import ARDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'

describe('C1934 AUT-493, GUIA-Story - Acceptance Test - NLE-2213 - Groups Report - Message Group', function () {
    beforeEach(() => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
    })

    it('should allow admin to create a group', () => {
        arDashboardPage.getGroupsReport()

        // "Add Group" button should be visible at the right sidebar
        cy.get(arDashboardPage.getAddEditMenuActionsByName('Add Group')).should('be.visible').click()

        // Verify that the add new group page heading is "Add Group"
        cy.get(arDashboardPage.getPageHeaderTitle()).should('have.text', 'Add Group')

        // Create Group with Valid Name
        cy.get(arGroupAddEditPage.getNameTxtF()).type(groupDetails.groupName)

        // Group creation should be defaulted to Manual
        arGroupAddEditPage.verifyAssignmentRadioBtn('Manual', 'true')

        // set Assignment Automatic
        cy.get(arGroupAddEditPage.getAssignmentRadioBtn()).contains('Automatic').click()
        arGroupAddEditPage.verifyAssignmentRadioBtn('Automatic', 'true')

        // a message is displayed as expected
        cy.get(arGroupAddEditPage.getRulesPlaceholder()).should('contain', 'There are no rule filters set - no users will be affected.')

        // Verify that One or More Rules can be Added
        cy.get(arGroupAddEditPage.getAddRuleBtn()).should('be.visible').click()
        ARGlobalResourcePage.getAddRule(cy.get(ARGlobalResourcePage.getFirstRulesContainer()), 'First Name', 'Contains', users.learner01.learner_01_fname)

        //Add second availabilty rule
        cy.get(ARGlobalResourcePage.getAddRuleBtn()).click()
        // Add an avialabilit rules
        ARGlobalResourcePage.getAddRule(cy.get(ARGlobalResourcePage.getSecondRulesContainer()), 'First Name', 'Equals', users.learner02.learner_02_fname)

        // Save Group
        cy.get(arGroupAddEditPage.getSaveBtn()).should('not.have.attr', 'aria-disabled')
        cy.get(arGroupAddEditPage.getSaveBtn()).click()
        cy.get(arGroupAddEditPage.getToastSuccessMsg()).should('contain', 'Group has been created.')
    })
    it(`Verify that the [Message Group] button appears in the side bar when a group in the group report page is selected`, () => {
        arDashboardPage.getGroupsReport()

        // Search  Group by name
        arGroupAddEditPage.AddFilter('Name', 'Contains', groupDetails.groupName)
        cy.get(ARDashboardPage.getTableCellRecord()).contains(groupDetails.groupName).click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should("not.exist")
        cy.wrap(arGroupAddEditPage.WaitForElementStateToChange(arGroupAddEditPage.getAddEditMenuActionsByName('Message Group')))
        //Asserting that Message Group button is present 
        cy.get(arGroupAddEditPage.getAddEditMenuActionsByName('Message Group')).should('have.attr', 'aria-disabled', 'false')

    })

    after('should allow admin to delete a group', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getGroupsReport()

        // Search and delete Groups
        arGroupAddEditPage.AddFilter('Name', 'Contains', groupDetails.groupName)
        cy.get(ARDashboardPage.getTableCellRecord()).should('contain', groupDetails.groupName).click()
        
        cy.wrap(arGroupAddEditPage.WaitForElementStateToChange(arGroupAddEditPage.getAddEditMenuActionsByName('Delete Group'), 1000))
        cy.get(arGroupAddEditPage.getAddEditMenuActionsByName('Delete Group')).click()
        cy.get(arDeleteModal.getARDeleteBtn()).should('be.visible').click()
        cy.get(arDeleteModal.getARDeleteBtn()).should('not.exist')
    })
})

