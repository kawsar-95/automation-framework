import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import arGroupAddEditPage from '../../../../../../helpers/AR/pageObjects/Groups/ARGroupAddEditPage'
import arReportPage from '../../../../../../helpers/AR/pageObjects/ARReportsPage'
import arSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import { departments } from '../../../../../../helpers/TestData/Department/departments'
import { groupDetails } from '../../../../../../helpers/TestData/Groups/groupDetails'
import { users } from '../../../../../../helpers/TestData/users/users'
import ARUnsavedChangesModal from '../../../../../../helpers/AR/pageObjects/Modals/ARUnsavedChangesModal'

describe('C1910 AUT-473, AR - Groups Report - Edit Manual Group', function () {
    beforeEach(() => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getGroupsReport()
    })

    it('should allow admin to create a group', () => {
        // "Add Group" button should be visible at the right sidebar
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

        // Save Group
        cy.get(arGroupAddEditPage.getSaveBtn(), {timeout:15000}).should('not.have.attr', 'aria-disabled')
        cy.get(arGroupAddEditPage.getSaveBtn()).click()
        cy.get(arGroupAddEditPage.getToastSuccessMsg()).should('contain', 'Group has been created.')
    })

    it('should allow admin to edit a group and Save changes', () => {
        // Search and Edit Groups
        arGroupAddEditPage.AddFilter('Name', 'Contains', groupDetails.groupName)
        cy.get(arGroupAddEditPage.getTableCellContentByIndex(2)).should('contain', groupDetails.groupName)
        cy.get(arGroupAddEditPage.getTableCellContentByIndex(2)).contains(groupDetails.groupName).click()
    
        // "Edit Group" button should be visible at the right sidebar
        cy.wrap(arGroupAddEditPage.WaitForElementStateToChange(arGroupAddEditPage.getAddEditMenuActionsByName('Edit Group'), 1000))
        cy.get(arGroupAddEditPage.getAddEditMenuActionsByName('Edit Group')).should('be.visible').click()

        //Edit Group Page is Opened as Expected
        cy.get(arDashboardPage.getPageHeaderTitle()).should('have.text', 'Edit Group')
        cy.get(arGroupAddEditPage.getWaitSpinner()).should('not.exist')

        // Admin can Edit Group Name
        cy.get(arGroupAddEditPage.getNameTxtF()).should('have.value', groupDetails.groupName)
        cy.get(arGroupAddEditPage.getNameTxtF()).type(groupDetails.appendText)

        // Group creation should be defaulted to Manual
        arGroupAddEditPage.verifyAssignmentRadioBtn('Manual', 'true')

        // verify Selected user
        cy.get(arGroupAddEditPage.getSelectedUser()).should('contain', `${users.learner01.learner_01_fname} ${users.learner01.learner_01_lname}`)
        cy.get(arGroupAddEditPage.getSelectedUser()).should('contain', `${users.learner02.learner_02_fname} ${users.learner02.learner_02_lname}`)

        // User's can be removed
        arGroupAddEditPage.removeSelectedUserByName(`${users.learner01.learner_01_fname} ${users.learner01.learner_01_lname}`)
        cy.get(arGroupAddEditPage.getSelectedUser()).should('not.contain', `${users.learner01.learner_01_fname} ${users.learner01.learner_01_lname}`)

        // Add another User
        cy.get(arGroupAddEditPage.getUserProperty()).find(arGroupAddEditPage.getUsersDDownField()).click()
        cy.get(arGroupAddEditPage.getUsersDDownSearchTxtF()).type(`${users.learner03.learner_03_fname} ${users.learner03.learner_03_lname}`)
        cy.get(arGroupAddEditPage.getUsersDDownOpt()).contains(`${users.learner03.learner_03_fname} ${users.learner03.learner_03_lname}`).click()
        // verify user is Selected
        arGroupAddEditPage.verifyUserIsSelected(`${users.learner03.learner_03_fname} ${users.learner03.learner_03_lname}`)

        cy.get(arGroupAddEditPage.getUserProperty()).find(arGroupAddEditPage.getUsersDDownField()).click()
        cy.get(arGroupAddEditPage.getWaitSpinner()).should('not.exist')

        // verify user are Selected
        cy.get(arGroupAddEditPage.getSelectedUser()).should('have.length', 2).and('contain', `${users.learner02.learner_02_fname} ${users.learner02.learner_02_lname}`)
        cy.get(arGroupAddEditPage.getSelectedUser()).should('contain', `${users.learner03.learner_03_fname} ${users.learner03.learner_03_lname}`)
        
        // Save Group
        cy.get(arGroupAddEditPage.getSaveBtn()).click()
        cy.get(arGroupAddEditPage.getToastSuccessMsg()).should('contain', 'Group has been updated.')
    })

    it('should allow admin to edit a group and Cancel the changes', () => {
        // Search and Edit Groups
        arGroupAddEditPage.AddFilter('Name', 'Contains', groupDetails.groupName)
        cy.get(arGroupAddEditPage.getTableCellContentByIndex(2)).should('contain', groupDetails.groupName)
        cy.get(arGroupAddEditPage.getTableCellContentByIndex(2)).contains(groupDetails.groupName).click()

        // "Edit Group" button should be visible at the right sidebar
        cy.wrap(arGroupAddEditPage.WaitForElementStateToChange(arGroupAddEditPage.getAddEditMenuActionsByName('Edit Group'), 1000))
        cy.get(arGroupAddEditPage.getAddEditMenuActionsByName('Edit Group')).should('be.visible').click()

        //Edit Group Page is Opened as Expected
        cy.get(arDashboardPage.getPageHeaderTitle()).should('have.text', 'Edit Group')
        cy.get(arGroupAddEditPage.getWaitSpinner()).should('not.exist')

        // Admin can Edit Group Name
        cy.get(arGroupAddEditPage.getNameTxtF()).should('have.value', `${groupDetails.groupName}${groupDetails.appendText}`)
        cy.get(arGroupAddEditPage.getNameTxtF()).clear().type(groupDetails.appendText)

        // Group creation should be defaulted to Manual
        arGroupAddEditPage.verifyAssignmentRadioBtn('Manual', 'true')

        // verify Selected user
        cy.get(arGroupAddEditPage.getSelectedUser()).should('contain', `${users.learner03.learner_03_fname} ${users.learner03.learner_03_lname}`)
        cy.get(arGroupAddEditPage.getSelectedUser()).should('contain', `${users.learner02.learner_02_fname} ${users.learner02.learner_02_lname}`)

        // User's can be removed
        arGroupAddEditPage.removeSelectedUserByName(`${users.learner03.learner_03_fname} ${users.learner03.learner_03_lname}`)
        cy.get(arGroupAddEditPage.getSelectedUser()).should('not.contain', `${users.learner03.learner_03_fname} ${users.learner03.learner_03_lname}`)

        // Verify that clicking the Cancel Button Cancels any changes made
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
        arGroupAddEditPage.AddFilter('Name', 'Contains', `${groupDetails.groupName}${groupDetails.appendText}`)
        cy.get(arGroupAddEditPage.getTableCellContentByIndex(2)).should('contain', `${groupDetails.groupName}${groupDetails.appendText}`)
        cy.get(arGroupAddEditPage.getTableCellContentByIndex(2)).contains(`${groupDetails.groupName}${groupDetails.appendText}`).click()

        cy.wrap(arGroupAddEditPage.WaitForElementStateToChange(arGroupAddEditPage.getAddEditMenuActionsByName('Delete Group'), 1000))
        cy.get(arGroupAddEditPage.getAddEditMenuActionsByName('Delete Group')).click()
        cy.get(arDeleteModal.getARDeleteBtn()).should('be.visible').click()
        cy.get(arDeleteModal.getARDeleteBtn()).should('not.exist')
    })
})

