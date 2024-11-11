import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arGroupAddEditPage from '../../../../../../helpers/AR/pageObjects/Groups/ARGroupAddEditPage'
import arReportPage from '../../../../../../helpers/AR/pageObjects/ARReportsPage'
import arSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import { departments } from '../../../../../../helpers/TestData/Department/departments'
import { groupDetails } from '../../../../../../helpers/TestData/Groups/groupDetails'
import { users } from '../../../../../../helpers/TestData/users/users'
import ARViewHistoryModal from '../../../../../../helpers/AR/pageObjects/Modals/ARViewHistoryModal'
import ARGlobalResourcePage from '../../../../../../helpers/AR/pageObjects/GlobalResources/ARGlobalResourcePage'

describe('C1927 AUT-486, AR - Groups Report - View History', function () {
    before('Create a Group', () => {
        cy.apiLoginWithSession(users.sysAdmin2.admin_sys_02_username, users.sysAdmin2.admin_sys_02_password, '/admin')
        arDashboardPage.getGroupsReport()

        // "Add Group" button should be visible at the right sidebar
        cy.get(arReportPage.getAddEditMenuActionsByName('Add Group')).should('be.visible').click()

        // Verify that the add new group page heading is "Add Group"
        cy.get(arDashboardPage.getPageHeaderTitle()).should('have.text', 'Add Group')

        // Create Group with Valid Name
        cy.get(arGroupAddEditPage.getNameTxtF()).type(groupDetails.groupName)

        // Group creation should be defaulted to Manual
        arGroupAddEditPage.verifyAssignmentRadioBtn('Manual', 'true')

        // Verify that an admin can add one or more users to the group manually
        cy.get(arGroupAddEditPage.getUserProperty()).find(arGroupAddEditPage.getUsersDDownField()).click()
        cy.get(arGroupAddEditPage.getUsersDDownSearchTxtF()).type('GUIAutoL01')
        cy.get(arGroupAddEditPage.getUsersDDownOpt()).contains(`${users.learner01.learner_01_fname} ${users.learner01.learner_01_lname}`).click()
        cy.get(arGroupAddEditPage.getWaitSpinner()).should('not.exist')
        // verify user is Selected
        arGroupAddEditPage.verifyUserIsSelected(`${users.learner01.learner_01_fname} ${users.learner01.learner_01_lname}`)

        cy.get(arGroupAddEditPage.getUserProperty()).find(arGroupAddEditPage.getUsersDDownField()).click()
        cy.get(arGroupAddEditPage.getWaitSpinner()).should('not.exist')

        // verify user are Selected
        cy.get(arGroupAddEditPage.getSelectedUser()).should('have.length', 1).and('contain', `${users.learner01.learner_01_fname} ${users.learner01.learner_01_lname}`)

        // Save Group
        arGroupAddEditPage.saveGroup()
    })

    after('should allow admin to delete a group', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getGroupsReport()

        // Search and delete Groups
        arGroupAddEditPage.deleteGroupByName(groupDetails.groupName)
    })

    it('Blatant Admin makes changes to the Group and View History', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getGroupsReport()

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

        cy.get(arGroupAddEditPage.getAddEditMenuActionsByName('View History')).should('be.visible').click()

        // Group history modal should be displayed
        cy.get(ARViewHistoryModal.getViewHistoryModalTitle()).should('contain', 'Group History')
        cy.get(arGroupAddEditPage.getWaitSpinner()).should('not.exist')

        // Name of the user admin should be displayed
        cy.get(ARViewHistoryModal.getViewHistoryCreatedBy()).should('contain', `${users.sysAdmin2.admin_sys_02_fname} ${users.sysAdmin2.admin_sys_02_lname}`)

        // Date and time of the Group creation should be displayed
        cy.get(ARViewHistoryModal.getViewHistoryDate()).should('be.visible')
        cy.get(ARViewHistoryModal.getViewHistoryTime()).should('be.visible').its('length').as('elementLength')

        cy.get(ARViewHistoryModal.getViewHistoryCloseBtn()).click()

        // Admin can Edit Group Name
        cy.get(arGroupAddEditPage.getNameTxtF()).should('have.value', groupDetails.groupName)
        cy.get(arGroupAddEditPage.getNameTxtF()).type(groupDetails.appendText)

        // set Assignment Automatic
        cy.get(arGroupAddEditPage.getAssignmentRadioBtn()).contains('Automatic').click()
        arGroupAddEditPage.verifyAssignmentRadioBtn('Automatic', 'true')
        // Verify that One or More Rules can be Added
        cy.get(arGroupAddEditPage.getAddRuleBtn()).should('be.visible').click()
        ARGlobalResourcePage.getAddRule(cy.get(ARGlobalResourcePage.getFirstRulesContainer()), 'First Name', 'Contains', users.learner02.learner_02_fname)

        // Select Department
        cy.get(arGroupAddEditPage.getDepartmentBtn()).click()
        arSelectModal.SearchAndSelectFunction([departments.dept_top_name])
        cy.get(arGroupAddEditPage.getWaitSpinner()).should('not.exist')

        // Save Department
        arGroupAddEditPage.saveGroup()
    })

    it('Again Edit Group and View History', () => {
        cy.apiLoginWithSession(users.sysAdmin2.admin_sys_02_username, users.sysAdmin2.admin_sys_02_password, '/admin')
        arDashboardPage.getGroupsReport()

        arGroupAddEditPage.AddFilter('Name', 'Starts With', groupDetails.groupName)
        cy.get(arGroupAddEditPage.getTableCellContentByIndex(2)).should('contain', groupDetails.groupName)
        cy.get(arGroupAddEditPage.getTableCellContentByIndex(2)).contains(groupDetails.groupName).click()
    
        // "Edit Group" button should be visible at the right sidebar
        cy.wrap(arGroupAddEditPage.WaitForElementStateToChange(arGroupAddEditPage.getAddEditMenuActionsByName('Edit Group'), 1000))
        cy.get(arGroupAddEditPage.getAddEditMenuActionsByName('Edit Group')).should('be.visible').click()

        // Edit Group Page is Opened as Expected
        cy.get(arDashboardPage.getPageHeaderTitle()).should('have.text', 'Edit Group')
        cy.get(arGroupAddEditPage.getWaitSpinner()).should('not.exist')

        cy.get(arGroupAddEditPage.getAddEditMenuActionsByName('View History')).should('be.visible').click()

        // Group history modal should be displayed
        cy.get(ARViewHistoryModal.getViewHistoryModalTitle()).should('contain', 'Group History')
        cy.get(arGroupAddEditPage.getWaitSpinner()).should('not.exist')

        // Verify that the history content is updated
        // Old and new value should be displayed
        cy.get(ARViewHistoryModal.getViewHistoryChange()).should('contain', `Changed Group Name From ${groupDetails.groupName} To ${groupDetails.groupName}${groupDetails.appendText}`)
        cy.get(ARViewHistoryModal.getViewHistoryChange()).should('contain', `Changed Group IsAutomatic From false To true`)
        cy.get(ARViewHistoryModal.getViewHistoryChange()).should('contain', `Changed Group ScopedDepartmentId From None To`)

        // Update content should contain date and time changes were made
        cy.get(ARViewHistoryModal.getViewHistoryTime()).its('length').then(function ($length) {
            expect(this.elementLength+1).to.eq($length)
        })
        cy.get(ARViewHistoryModal.getViewHistoryTime()).should('be.visible').its('length').as('newElementLength')

        // Update content should contain the name of the Admin user that made the changes
        cy.get(ARViewHistoryModal.getViewHistoryEditedBy()).should('contain', 'System')

        cy.get(ARViewHistoryModal.getViewHistoryCloseBtn()).click()

        // Admin can Edit Group Name
        cy.get(arGroupAddEditPage.getNameTxtF()).should('have.value', `${groupDetails.groupName}${groupDetails.appendText}`)
        cy.get(arGroupAddEditPage.getNameTxtF()).clear().type(groupDetails.groupName)

        // set Assignment Automatic
        cy.get(arGroupAddEditPage.getAssignmentRadioBtn()).contains('Manual').click()
        arGroupAddEditPage.verifyAssignmentRadioBtn('Manual', 'true')

        // Verify that an admin can add one or more users to the group manually
        cy.get(arGroupAddEditPage.getUserProperty()).find(arGroupAddEditPage.getUsersDDownField()).click()
        cy.get(arGroupAddEditPage.getUsersDDownSearchTxtF()).type('GUIAutoL01')
        cy.get(arGroupAddEditPage.getUsersDDownOpt()).contains(`${users.learner01.learner_01_fname} ${users.learner01.learner_01_lname}`).click()
        cy.get(arGroupAddEditPage.getWaitSpinner()).should('not.exist')
        // verify user is Selected
        arGroupAddEditPage.verifyUserIsSelected(`${users.learner01.learner_01_fname} ${users.learner01.learner_01_lname}`)

        cy.get(arGroupAddEditPage.getUserProperty()).find(arGroupAddEditPage.getUsersDDownField()).click()
        cy.get(arGroupAddEditPage.getWaitSpinner()).should('not.exist')

        // verify user are Selected
        cy.get(arGroupAddEditPage.getSelectedUser()).should('have.length', 1).and('contain', `${users.learner01.learner_01_fname} ${users.learner01.learner_01_lname}`)

        // Save Department
        arGroupAddEditPage.saveGroup()
    })

    it('verify Changes Reflect on View History', () => {
        cy.apiLoginWithSession(users.sysAdmin2.admin_sys_02_username, users.sysAdmin2.admin_sys_02_password, '/admin')
        arDashboardPage.getGroupsReport()

        arGroupAddEditPage.AddFilter('Name', 'Starts With', groupDetails.groupName)
        cy.get(arGroupAddEditPage.getTableCellContentByIndex(2)).should('contain', groupDetails.groupName)
        cy.get(arGroupAddEditPage.getTableCellContentByIndex(2)).contains(groupDetails.groupName).click()
    
        // "Edit Group" button should be visible at the right sidebar
        cy.wrap(arGroupAddEditPage.WaitForElementStateToChange(arGroupAddEditPage.getAddEditMenuActionsByName('Edit Group'), 1000))
        cy.get(arGroupAddEditPage.getAddEditMenuActionsByName('Edit Group')).should('be.visible').click()

        // Edit Group Page is Opened as Expected
        cy.get(arDashboardPage.getPageHeaderTitle()).should('have.text', 'Edit Group')
        cy.get(arGroupAddEditPage.getWaitSpinner()).should('not.exist')

        cy.get(arGroupAddEditPage.getAddEditMenuActionsByName('View History')).should('be.visible').click()

        // Group history modal should be displayed
        cy.get(ARViewHistoryModal.getViewHistoryModalTitle()).should('contain', 'Group History')
        cy.get(arGroupAddEditPage.getWaitSpinner()).should('not.exist')

        // Verify that the history content is updated
        // Old and new value should be displayed
        cy.get(ARViewHistoryModal.getViewHistoryChange()).should('contain', `Changed Group Name From ${groupDetails.groupName}${groupDetails.appendText} To ${groupDetails.groupName}`)
        cy.get(ARViewHistoryModal.getViewHistoryChange()).should('contain', `Changed Group IsAutomatic From true To false`)

        // Update content should contain date and time changes were made
        cy.get(ARViewHistoryModal.getViewHistoryTime()).its('length').then(function ($length) {
            expect(this.newElementLength+1).to.eq($length)
        })

        // Update content should contain the name of the Admin user that made the changes
        cy.get(ARViewHistoryModal.getViewHistoryEditedBy()).should('contain',  `${users.sysAdmin2.admin_sys_02_fname} ${users.sysAdmin2.admin_sys_02_lname}`)
    })
})

