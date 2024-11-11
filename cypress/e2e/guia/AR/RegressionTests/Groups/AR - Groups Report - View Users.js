import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import arGroupAddEditPage from '../../../../../../helpers/AR/pageObjects/Groups/ARGroupAddEditPage'
import arSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import { departments } from '../../../../../../helpers/TestData/Department/departments'
import { groupDetails } from '../../../../../../helpers/TestData/Groups/groupDetails'
import { users } from '../../../../../../helpers/TestData/users/users'

describe('C1901 AUT-468, AR - Groups Report - View Users', function () {
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

        // Create another Group
        cy.get(arDashboardPage.getAddEditMenuActionsByName('Add Group')).should('be.visible').click()
        cy.get(arGroupAddEditPage.getNameTxtF()).type(groupDetails.groupName2)

        // set Assignment Automatic
        cy.get(arGroupAddEditPage.getAssignmentRadioBtn()).contains('Automatic').click()
        arGroupAddEditPage.verifyAssignmentRadioBtn('Automatic', 'true')

        cy.get(arGroupAddEditPage.getAddRuleBtn()).click()
        cy.get(arGroupAddEditPage.getRuleValueF()).type('Manitoba').blur()

        // verify User Count
        arGroupAddEditPage.verifyUserCount(0)

        cy.get(arGroupAddEditPage.getSaveBtn(), {timeout:15000}).should('not.have.attr', 'aria-disabled')
        cy.get(arGroupAddEditPage.getSaveBtn()).click()
        cy.get(arGroupAddEditPage.getToastSuccessMsg()).should('contain', 'Group has been created.')
    })

    it('should allow admin View Users', () => {
        arGroupAddEditPage.AddFilter('Name', 'Contains', groupDetails.groupName)
        cy.get(arGroupAddEditPage.getTableCellContentByIndex(2)).should('contain', groupDetails.groupName)
        cy.get(arGroupAddEditPage.getTableCellContentByIndex(2)).contains(groupDetails.groupName).click()
    
        // View user option should appear
        cy.wrap(arGroupAddEditPage.WaitForElementStateToChange(arGroupAddEditPage.getAddEditMenuActionsByName('View Users'), 1000))
        cy.get(arGroupAddEditPage.getAddEditMenuActionsByName('View Users')).should('be.visible').click()

        // Admin should be directed to user report 
        cy.get(arDashboardPage.getPageHeaderTitle()).should('have.text', 'Users')
        cy.get(arGroupAddEditPage.getWaitSpinner()).should('not.exist')

        // users should be filtered based on the group selected
        cy.get(arGroupAddEditPage.getFilterEdit()).contains('Group').click()
        cy.get(arGroupAddEditPage.getFilteredValue()).should('contain', groupDetails.groupName)
        cy.get(arGroupAddEditPage.getFilterEdit()).contains('Group').click({force:true})

        // Users in the group should be displayed
        cy.get(arGroupAddEditPage.getTableCellContentByIndex(4)).should('contain', users.learner01.learner_01_username)
        cy.get(arGroupAddEditPage.getTableCellContentByIndex(4)).should('contain', users.learner02.learner_02_username)
    })

    it('should allow admin View Users and the grid appears empty', () => {
        // Verify that IF there are  no users in the group, the grid appears empty
        arGroupAddEditPage.AddFilter('Name', 'Contains', groupDetails.groupName2)
        cy.get(arGroupAddEditPage.getTableCellContentByIndex(2)).should('contain', groupDetails.groupName2)
        cy.get(arGroupAddEditPage.getTableCellContentByIndex(2)).contains(groupDetails.groupName2).click()
    
        // View user option should appear
        cy.wrap(arGroupAddEditPage.WaitForElementStateToChange(arGroupAddEditPage.getAddEditMenuActionsByName('View Users'), 1000))
        cy.get(arGroupAddEditPage.getAddEditMenuActionsByName('View Users')).should('be.visible').click()

        // Admin should be directed to user report 
        cy.get(arDashboardPage.getPageHeaderTitle()).should('have.text', 'Users')
        cy.get(arGroupAddEditPage.getWaitSpinner()).should('not.exist')

        // users should be filtered based on the group selected
        cy.get(arGroupAddEditPage.getFilterEdit()).contains('Group').click()
        cy.get(arGroupAddEditPage.getFilteredValue()).should('contain', groupDetails.groupName2)
        cy.get(arGroupAddEditPage.getFilterEdit()).contains('Group').click({force:true})

        cy.get(arDeleteModal.getNoResultMsg()).should('have.text', "No results found.")
    })

    it('should allow admin to delete a group', () => {
        // Search and delete Groups
        arGroupAddEditPage.AddFilter('Name', 'Contains', groupDetails.groupName)
        cy.get(arGroupAddEditPage.getTableCellContentByIndex(2)).should('contain', groupDetails.groupName)
        cy.get(arGroupAddEditPage.getTableCellContentByIndex(2)).contains(groupDetails.groupName).click()
        cy.wrap(arGroupAddEditPage.WaitForElementStateToChange(arGroupAddEditPage.getAddEditMenuActionsByName('Delete Group'), 1000))
        cy.get(arGroupAddEditPage.getAddEditMenuActionsByName('Delete Group')).click()
        cy.get(arDeleteModal.getARDeleteBtn()).should('be.visible').click()
        cy.get(arGroupAddEditPage.getWaitSpinner()).should('not.exist')

        arGroupAddEditPage.AddFilter('Name', 'Contains', groupDetails.groupName2)
        cy.get(arGroupAddEditPage.getTableCellContentByIndex(2)).should('contain', groupDetails.groupName2)
        cy.get(arGroupAddEditPage.getTableCellContentByIndex(2)).contains(groupDetails.groupName2).click()
        cy.wrap(arGroupAddEditPage.WaitForElementStateToChange(arGroupAddEditPage.getAddEditMenuActionsByName('Delete Group'), 1000))
        cy.get(arGroupAddEditPage.getAddEditMenuActionsByName('Delete Group')).click()
        cy.get(arDeleteModal.getARDeleteBtn()).should('be.visible').click()
        cy.get(arGroupAddEditPage.getWaitSpinner()).should('not.exist')

        cy.get(arDeleteModal.getNoResultMsg()).should('have.text', "No results found.")
    })
})