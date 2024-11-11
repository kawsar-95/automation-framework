import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import arGroupAddEditPage from '../../../../../../helpers/AR/pageObjects/Groups/ARGroupAddEditPage'
import arSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import { departments } from '../../../../../../helpers/TestData/Department/departments'
import { groupDetails } from '../../../../../../helpers/TestData/Groups/groupDetails'
import { users } from '../../../../../../helpers/TestData/users/users'

describe('C1919 AUT-480, AR - Groups Report - Delete Group', function () {
    beforeEach(() => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getGroupsReport()
    })

    it('should allow admin to create a group', () => {
        // "Add Group" button should be visible at the right sidebar
        cy.get(arDashboardPage.getAddEditMenuActionsByName('Add Group')).should('be.visible').click()

        // Verify that the add new group page heading is "Add Group"
        cy.get(arDashboardPage.getPageHeaderTitle()).should('have.text', 'Add Group')

        // Create Group with Valid Name
        cy.get(arGroupAddEditPage.getNameTxtF()).type(groupDetails.groupName)

        // Select Department
        cy.get(arGroupAddEditPage.getDepartmentBtn()).click()
        arSelectModal.SearchAndSelectFunction([departments.dept_top_name])

        // Verify that an admin can add one or more users to the group manually
        cy.get(arGroupAddEditPage.getUserProperty()).find(arGroupAddEditPage.getUsersDDownField()).click()
        cy.get(arGroupAddEditPage.getUsersDDownSearchTxtF()).type('GUIAutoL0')
        cy.get(arGroupAddEditPage.getUsersDDownOpt()).contains(`${users.learner01.learner_01_fname} ${users.learner01.learner_01_lname}`).click()
        cy.get(arGroupAddEditPage.getWaitSpinner()).should('not.exist')
        // verify user is Selected
        arGroupAddEditPage.verifyUserIsSelected(`${users.learner01.learner_01_fname} ${users.learner01.learner_01_lname}`)

        cy.get(arGroupAddEditPage.getUserProperty()).find(arGroupAddEditPage.getUsersDDownField()).click()
        cy.get(arGroupAddEditPage.getWaitSpinner()).should('not.exist')

        // verify user are Selected
        cy.get(arGroupAddEditPage.getSelectedUser()).should('contain', `${users.learner01.learner_01_fname} ${users.learner01.learner_01_lname}`)

        // Save Group
        cy.get(arGroupAddEditPage.getSaveBtn()).click()
        cy.get(arGroupAddEditPage.getToastSuccessMsg()).should('contain', 'Group has been created.')
    })

    it('should allow admin to delete a group', () => {
        // Search and delete Groups
        arGroupAddEditPage.AddFilter('Name', 'Contains', groupDetails.groupName)
        cy.get(arGroupAddEditPage.getTableCellContentByIndex(2)).should('contain', groupDetails.groupName)
        cy.get(arGroupAddEditPage.getTableCellContentByIndex(2)).contains(groupDetails.groupName).click()

        cy.wrap(arGroupAddEditPage.WaitForElementStateToChange(arGroupAddEditPage.getAddEditMenuActionsByName('Delete Group'), 1000))
        cy.get(arGroupAddEditPage.getAddEditMenuActionsByName('Delete Group')).click()

        // Modal should appear
        // The title should be "Delete Group"
        cy.get(arDeleteModal.getModalHeader()).should('contain', "Delete Group")

        // Delete icon should be visible on the modal
        cy.get(arDeleteModal.getPromptIcon()).should('have.class', 'icon icon-trash')

        // verify Warning message
        cy.get(arDeleteModal.getModalContent()).should('contain', arDeleteModal.getDeleteMsg(groupDetails.groupName))

        // [Delete] and [Cancel] buttons should be visible
        cy.get(arDeleteModal.getARDeleteBtn()).should('be.visible')
        cy.get(arDeleteModal.getARCancelBtn()).should('be.visible').click()

        // Modal should disappear
        cy.get(arDeleteModal.getARCancelBtn()).should('not.exist')

        // user should be returned to the group report page
        cy.get(arDashboardPage.getPageHeaderTitle()).should('have.text', 'Groups')

        // the selected group should still remain selected
        cy.get(arDashboardPage.getSelectRowCheckbox()).should('have.attr', 'aria-checked', 'true')

        cy.wrap(arGroupAddEditPage.WaitForElementStateToChange(arGroupAddEditPage.getAddEditMenuActionsByName('Delete Group'), 1000))
        cy.get(arGroupAddEditPage.getAddEditMenuActionsByName('Delete Group')).click()

        cy.get(arDeleteModal.getARDeleteBtn()).should('be.visible').click()
        // Verify that selecting the [Delete] button deletes the group
        cy.get(arGroupAddEditPage.getToastSuccessMsg()).should('contain', 'Group has been deleted successfully.')
        cy.get(arDeleteModal.getNoResultMsg()).should('have.text', "No results found.")
    })
})

