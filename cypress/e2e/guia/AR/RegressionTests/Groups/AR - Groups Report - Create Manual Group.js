import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import arGroupAddEditPage from '../../../../../../helpers/AR/pageObjects/Groups/ARGroupAddEditPage'
import arReportPage from '../../../../../../helpers/AR/pageObjects/ARReportsPage'
import arSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import { departments } from '../../../../../../helpers/TestData/Department/departments'
import { miscData } from '../../../../../../helpers/TestData/Misc/misc'
import { groupDetails } from '../../../../../../helpers/TestData/Groups/groupDetails'
import { users } from '../../../../../../helpers/TestData/users/users'
import ARUnsavedChangesModal from '../../../../../../helpers/AR/pageObjects/Modals/ARUnsavedChangesModal'

describe('C1905 AUT-471, AR - Groups Report - Create Manual Group', function () {
    beforeEach(() => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getGroupsReport()
    })

    it('should allow admin to create a group', () => {
        // "Add Group" button should be visible at the right sidebar
        cy.get(arReportPage.getAddEditMenuActionsByName('Add Group')).should('be.visible').click()

        // Verify that the add new group page heading is "Add Group"
        cy.get(arDashboardPage.getPageHeaderTitle()).should('have.text', 'Add Group')

        // Error message "Field is required" should be displayed
        cy.get(arGroupAddEditPage.getNameTxtF()).type('a').clear()
        cy.get(arGroupAddEditPage.getNameErrorMsg()).should('have.text', miscData.field_required_error)

        // Create Group with Valid Name
        cy.get(arGroupAddEditPage.getNameTxtF()).type(groupDetails.groupName)

        // Select Department
        cy.get(arGroupAddEditPage.getDepartmentBtn()).click()
        arSelectModal.SearchAndSelectFunction([departments.dept_top_name])

        // Group creation should be defaulted to Manual
        arGroupAddEditPage.verifyAssignmentRadioBtn('Manual', 'true')

        // Verify that an admin can add one or more users to the group manually
        cy.get(arGroupAddEditPage.getUserProperty()).find(arGroupAddEditPage.getUsersDDownField()).click()
        cy.get(arGroupAddEditPage.getUsersDDownSearchTxtF()).type('GUIAutoL0')
        cy.get(arGroupAddEditPage.getUsersDDownOpt()).contains(`${users.learner01.learner_01_fname} ${users.learner01.learner_01_lname}`).click()
        cy.get(arGroupAddEditPage.getWaitSpinner()).should('not.exist')
        // verify user is Selected
        arGroupAddEditPage.verifyUserIsSelected(`${users.learner01.learner_01_fname} ${users.learner01.learner_01_lname}`)

        cy.get(arGroupAddEditPage.getUsersDDownOpt()).contains(`${users.learner02.learner_02_fname} ${users.learner02.learner_02_lname}`).click()
        cy.get(arGroupAddEditPage.getWaitSpinner()).should('not.exist')
        // verify user is Selected
        arGroupAddEditPage.verifyUserIsSelected(`${users.learner02.learner_02_fname} ${users.learner02.learner_02_lname}`)

        cy.get(arGroupAddEditPage.getUserProperty()).find(arGroupAddEditPage.getUsersDDownField()).click()
        cy.get(arGroupAddEditPage.getWaitSpinner()).should('not.exist')

        // verify user are Selected
        cy.get(arGroupAddEditPage.getSelectedUser()).should('have.length', 2).and('contain', `${users.learner02.learner_02_fname} ${users.learner02.learner_02_lname}`)
        cy.get(arGroupAddEditPage.getSelectedUser()).should('contain', `${users.learner01.learner_01_fname} ${users.learner01.learner_01_lname}`)

        // clicks the "Cancel" button when no data has been added
        cy.get(arDeleteModal.getARCancelBtn()).should('be.visible').click()
        cy.get(ARUnsavedChangesModal.getPromptHeader()).should('have.text', 'Unsaved Changes')
        // verify warning message
        cy.get(ARUnsavedChangesModal.getPromptContent()).find('span').should('have.text', ARUnsavedChangesModal.getUnsavedChangesMsg())
        // two button options "OK", and "Cancel" is displayed
        cy.get(ARUnsavedChangesModal.getPromptFooter()).find(arDeleteModal.getARDeleteBtn()).should('be.visible')
        cy.get(ARUnsavedChangesModal.getPromptFooter()).find(arDeleteModal.getARCancelBtn()).should('be.visible').click()
        cy.get(arDeleteModal.getUnsavedChangesPrompt()).should('not.exist')
        
        // Admin should be returned to the form
        cy.get(arDashboardPage.getPageHeaderTitle()).should('have.text', 'Add Group')

        // Save Group
        cy.get(arGroupAddEditPage.getSaveBtn()).click()
        cy.get(arGroupAddEditPage.getToastSuccessMsg()).should('contain', 'Group has been created.')
    })

    it('should allow admin to create a group and Cancel the changes', () => {
        // "Add Group" button should be visible at the right sidebar
        cy.get(arReportPage.getAddEditMenuActionsByName('Add Group')).should('be.visible').click()

        // Verify that the add new group page heading is "Add Group"
        cy.get(arDashboardPage.getPageHeaderTitle()).should('have.text', 'Add Group')

        // clicks the "Cancel" button when no data has been added
        cy.get(arDeleteModal.getARCancelBtn()).should('be.visible').click()
        cy.get(arGroupAddEditPage.getWaitSpinner()).should('not.exist')
        // Admin should be redirected to the groups report
        cy.get(arDashboardPage.getPageHeaderTitle()).should('have.text', 'Groups')

        // clicking the "Add Group" button
        cy.get(arReportPage.getAddEditMenuActionsByName('Add Group')).should('be.visible').click()
        // Verify that the add new group page heading is "Add Group"
        cy.get(arDashboardPage.getPageHeaderTitle()).should('have.text', 'Add Group')

        // Create Group with Valid Name
        cy.get(arGroupAddEditPage.getNameTxtF()).type(groupDetails.groupName)

        // Select Department
        cy.get(arGroupAddEditPage.getDepartmentBtn()).click()
        arSelectModal.SearchAndSelectFunction([departments.dept_top_name])

        // Group creation should be defaulted to Manual
        arGroupAddEditPage.verifyAssignmentRadioBtn('Manual', 'true')

        // Verify that an admin can add one or more users to the group manually
        cy.get(arGroupAddEditPage.getUserProperty()).find(arGroupAddEditPage.getUsersDDownField()).click()
        cy.get(arGroupAddEditPage.getUsersDDownSearchTxtF()).type(`${users.learner01.learner_01_fname} ${users.learner01.learner_01_lname}`)
        cy.get(arGroupAddEditPage.getUsersDDownOpt()).contains(`${users.learner01.learner_01_fname} ${users.learner01.learner_01_lname}`).click()
        cy.get(arGroupAddEditPage.getWaitSpinner()).should('not.exist')
        // verify user is Selected
        arGroupAddEditPage.verifyUserIsSelected(`${users.learner01.learner_01_fname} ${users.learner01.learner_01_lname}`)
        cy.get(arGroupAddEditPage.getSelectedUser()).should('contain', `${users.learner01.learner_01_fname} ${users.learner01.learner_01_lname}`)

        // admin has added data to the form and clicks the Cancel
        cy.get(arDeleteModal.getARCancelBtn()).should('be.visible').click()
        cy.get(ARUnsavedChangesModal.getPromptHeader()).should('have.text', 'Unsaved Changes')
        // verify warning message
        cy.get(ARUnsavedChangesModal.getPromptContent()).find('span').should('have.text', ARUnsavedChangesModal.getUnsavedChangesMsg())
        // two button options "OK", and "Cancel" is displayed
        cy.get(ARUnsavedChangesModal.getPromptFooter()).find(arDeleteModal.getARCancelBtn()).should('be.visible')
        cy.get(ARUnsavedChangesModal.getPromptFooter()).find(arDeleteModal.getARDeleteBtn()).should('be.visible').click()
        cy.get(arDeleteModal.getUnsavedChangesPrompt()).should('not.exist')
        cy.get(arGroupAddEditPage.getWaitSpinner()).should('not.exist')
        
        // Admin should be returned to the group report
        cy.get(arDashboardPage.getPageHeaderTitle()).should('have.text', 'Groups')
    })

    it('should allow admin to delete a group', () => {
        // Search and delete Groups
        arGroupAddEditPage.AddFilter('Name', 'Contains', groupDetails.groupName)
        cy.get(arGroupAddEditPage.getTableCellContentByIndex(2)).should('contain', groupDetails.groupName)
        cy.get(arGroupAddEditPage.getTableCellContentByIndex(2)).contains(groupDetails.groupName).click()

        cy.wrap(arGroupAddEditPage.WaitForElementStateToChange(arGroupAddEditPage.getAddEditMenuActionsByName('Delete Group'), 1000))
        cy.get(arGroupAddEditPage.getAddEditMenuActionsByName('Delete Group')).click()
        cy.get(arDeleteModal.getARDeleteBtn()).should('be.visible').click()
        cy.get(arDeleteModal.getARDeleteBtn()).should('not.exist')
    })
})

