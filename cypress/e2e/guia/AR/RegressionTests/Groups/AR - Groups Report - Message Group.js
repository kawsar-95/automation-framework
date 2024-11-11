import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import arGroupAddEditPage from '../../../../../../helpers/AR/pageObjects/Groups/ARGroupAddEditPage'
import { groupDetails } from '../../../../../../helpers/TestData/Groups/groupDetails'
import { users } from '../../../../../../helpers/TestData/users/users'
import ARGlobalResourcePage from '../../../../../../helpers/AR/pageObjects/GlobalResources/ARGlobalResourcePage'
import ARDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARComposeMessage from '../../../../../../helpers/AR/pageObjects/Departments/ARComposeMessage'
import ARUnsavedChangesModal from '../../../../../../helpers/AR/pageObjects/Modals/ARUnsavedChangesModal'
import ARDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'


describe('C1935 AUT-494, AR - Groups Report - Message Group', function () {
    beforeEach(() => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getGroupsReport()
    })

    it('should allow admin to create a group', () => {
        cy.get(arDashboardPage.getAddEditMenuActionsByName('Add Group')).should('be.visible').click()
        cy.get(arGroupAddEditPage.getNameTxtF()).type(groupDetails.groupName)

        // set Assignment Automatic
        cy.get(arGroupAddEditPage.getAssignmentRadioBtn()).contains('Automatic').click()
        arGroupAddEditPage.verifyAssignmentRadioBtn('Automatic', 'true')

        // Verify that One or More Rules can be Added
        cy.get(arGroupAddEditPage.getAddRuleBtn()).should('be.visible').click()
        ARGlobalResourcePage.getAddRule(cy.get(ARGlobalResourcePage.getFirstRulesContainer()), 'First Name', 'Contains', users.learner01.learner_01_fname)

        //Add second availabilty rule
        cy.get(ARGlobalResourcePage.getAddRuleBtn()).click()
        ARGlobalResourcePage.getAddRule(cy.get(ARGlobalResourcePage.getSecondRulesContainer()), 'First Name', 'Equals', users.learner02.learner_02_fname)

        // Save Group
        arGroupAddEditPage.saveGroup()
    })

    it('Compose Message Cancel Changes', () => {
        arGroupAddEditPage.AddFilter('Name', 'Contains', groupDetails.groupName)
        cy.get(ARDashboardPage.getTableCellRecord()).contains(groupDetails.groupName).click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should("not.exist")
        
        //Asserting that Message Group button is present 
        cy.wrap(arGroupAddEditPage.WaitForElementStateToChange(arGroupAddEditPage.getAddEditMenuActionsByName('Message Group')))
        cy.get(arGroupAddEditPage.getAddEditMenuActionsByName('Message Group')).should('have.attr', 'aria-disabled', 'false').click()
        cy.get(ARDashboardPage.getPageHeaderTitle()).should('be.visible').and('contain', 'Compose Message')
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should("not.exist")

        // Verify that when [Cancel] button is selected and NO data have been added,
        // the admin is returned to the group report with the group still selected
        cy.get(arDashboardPage.getCancelBtn()).click()
        cy.get(arDashboardPage.getPageHeaderTitle()).should('have.text', 'Groups')
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should("not.exist")
        cy.get(arDashboardPage.getSelectRowCheckbox()).should('have.attr', 'aria-checked', 'true')

        cy.wrap(arGroupAddEditPage.WaitForElementStateToChange(arGroupAddEditPage.getAddEditMenuActionsByName('Message Group')))
        cy.get(arGroupAddEditPage.getAddEditMenuActionsByName('Message Group')).should('have.attr', 'aria-disabled', 'false').click()
        cy.get(ARDashboardPage.getPageHeaderTitle()).should('be.visible').and('contain', 'Compose Message')
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should("not.exist")

        // 1. "Send to groups" radio button should be selected
        ARComposeMessage.verifySendToRadioBtn('Send to groups', 'true')

        // 2. Total count of users should be displayed
        cy.get(ARComposeMessage.getRecipientCount()).should('contain', `This message will be sent to 2 Users.`)

        // 3. Group field should be populated with group name
        cy.get(ARComposeMessage.getRecipientGroupIds()).should('contain', groupDetails.groupName)

        // 4. Verify that the "To" field will be blank
        cy.get(ARComposeMessage.getRecipientIndividualUserIds()).should('contain', 'Choose')

        // 5. Users should be successfully added to the "To" field
        ARComposeMessage.addRecipientIndividualUser(users.depAdminDEPTD.admin_dep_fname, users.depAdminDEPTD.admin_dep_lname)

        // 6. Total count should be updated
        cy.get(ARComposeMessage.getRecipientCount()).should('contain', `This message will be sent to 3 Users.`)

        // 7. Non-learner notification should be displayed
        cy.get(ARComposeMessage.getNonlearnersMsg()).should('contain', 'Your selection contains non-learners')

        // 8. Inactive users notification should be displayed
        ARComposeMessage.addRecipientGroup('GROUPTG')
        cy.get(ARComposeMessage.getInactiveLearnersMsg()).should('contain', 'Your selection contains inactive learners')

        // remove Selected Group
        ARComposeMessage.removeRecipientGroupByName('GROUPTG')
        cy.get(ARComposeMessage.getRecipientGroupIds()).should('not.contain', 'GROUPTG')
        
        cy.get(ARComposeMessage.getSubjectTxtF()).type(groupDetails.messageSubject)
        cy.get(ARComposeMessage.getMessageBodyText()).type(groupDetails.messageBody)

        // 15. Verify that selecting the [OK] button returns the admin to the group report and group is still selected
        cy.get(arDashboardPage.getCancelBtn()).click()
        cy.get(ARUnsavedChangesModal.getPromptHeader()).should('have.text', 'Unsaved Changes')
        cy.get(ARUnsavedChangesModal.getPromptContent()).find('span').should('have.text', ARUnsavedChangesModal.getUnsavedChangesMsg())
        cy.get(ARUnsavedChangesModal.getOKBtn()).click()
        cy.get(ARDeleteModal.getUnsavedChangesPrompt()).should('not.exist')

        cy.get(ARDashboardPage.getPageHeaderTitle()).should('have.text', "Groups")
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should("not.exist")
        cy.get(arDashboardPage.getSelectRowCheckbox()).should('have.attr', 'aria-checked', 'true')
    })

    it('Compose Message and Send', () => {
        // Search  Group by name
        arGroupAddEditPage.AddFilter('Name', 'Contains', groupDetails.groupName)
        cy.get(ARDashboardPage.getTableCellRecord()).contains(groupDetails.groupName).click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should("not.exist")

        //Asserting that Message Group button is present 
        cy.wrap(arGroupAddEditPage.WaitForElementStateToChange(arGroupAddEditPage.getAddEditMenuActionsByName('Message Group')))
        cy.get(arGroupAddEditPage.getAddEditMenuActionsByName('Message Group')).should('have.attr', 'aria-disabled', 'false').click()
        cy.get(ARDashboardPage.getPageHeaderTitle()).should('be.visible').and('contain', 'Compose Message')
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should("not.exist")

        // 1. "Send to groups" radio button should be selected
        ARComposeMessage.verifySendToRadioBtn('Send to groups', 'true')

        // 2. Total count of users should be displayed
        cy.get(ARComposeMessage.getRecipientCount()).should('contain', `This message will be sent to 2 Users.`)

        // 3. Group field should be populated with group name
        cy.get(ARComposeMessage.getRecipientGroupIds()).should('contain', groupDetails.groupName)

        // 4. Verify that the "To" field will be blank
        cy.get(ARComposeMessage.getRecipientIndividualUserIds()).should('contain', 'Choose')

        // 5. Users should be successfully added to the "To" field
        ARComposeMessage.addRecipientIndividualUser(users.depAdminDEPTD.admin_dep_fname, users.depAdminDEPTD.admin_dep_lname)

        // 6. Total count should be updated
        cy.get(ARComposeMessage.getRecipientCount()).should('contain', `This message will be sent to 3 Users.`)

        // 7. Non-learner notification should be displayed
        cy.get(ARComposeMessage.getNonlearnersMsg()).should('contain', 'Your selection contains non-learners')

        // 8. Inactive users notification should be displayed
        ARComposeMessage.addRecipientGroup('GROUPTG')
        cy.get(ARComposeMessage.getInactiveLearnersMsg()).should('contain', 'Your selection contains inactive learners')

        // remove Selected Group
        ARComposeMessage.removeRecipientGroupByName('GROUPTG')
        cy.get(ARComposeMessage.getRecipientGroupIds()).should('not.contain', 'GROUPTG')

        cy.get(ARComposeMessage.getSubjectTxtF()).type(groupDetails.messageSubject)
        cy.get(ARComposeMessage.getMessageBodyText()).type(groupDetails.messageBody)

        // 16. Verify that selecting the [Cancel] the admin remains in the compose message page will all data still intact
        cy.get(arDashboardPage.getCancelBtn()).click()
        cy.get(ARUnsavedChangesModal.getPromptHeader()).should('have.text', 'Unsaved Changes')
        cy.get(ARUnsavedChangesModal.getPromptContent()).find('span').should('have.text', ARUnsavedChangesModal.getUnsavedChangesMsg())
        cy.get(ARUnsavedChangesModal.getPromptFooter()).find(arDashboardPage.getCancelBtn()).click()
        cy.get(ARDeleteModal.getUnsavedChangesPrompt()).should('not.exist')

        cy.get(ARDashboardPage.getPageHeaderTitle()).should('be.visible').and('contain', 'Compose Message')
        cy.get(ARComposeMessage.getSubjectTxtF()).should('have.value', groupDetails.messageSubject)
        cy.get(ARComposeMessage.getMessageBodyText()).should('contain', groupDetails.messageBody)

        // 17. Verify that selecting the [Send] button sends message to the users in the selected group
        cy.get(ARComposeMessage.getSendButton(), {timeout:10000}).should('have.attr', 'aria-disabled', 'false')
        cy.get(ARComposeMessage.getSendButton()).click()
        cy.get(ARDashboardPage.getPageHeaderTitle()).should('have.text', "Groups")
    })

    after('should allow admin to delete a group', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getGroupsReport()

        // Search and delete Groups
        arGroupAddEditPage.deleteGroupByName(groupDetails.groupName)
    })
})

