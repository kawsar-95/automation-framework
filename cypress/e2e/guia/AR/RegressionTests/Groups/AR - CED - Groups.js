/// <reference types="cypress" />
import actionButtons from '../../../../../fixtures/actionButtons.json'
import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import arGroupAddEditPage from '../../../../../../helpers/AR/pageObjects/Groups/ARGroupAddEditPage'
import arReportPage from '../../../../../../helpers/AR/pageObjects/ARReportsPage'
import arUserPage from '../../../../../../helpers/AR/pageObjects/User/ARUserPage'
import arSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import { departments } from '../../../../../../helpers/TestData/Department/departments'
import { miscData } from '../../../../../../helpers/TestData/Misc/misc'
import { groupDetails } from '../../../../../../helpers/TestData/Groups/groupDetails'
import { users } from '../../../../../../helpers/TestData/users/users'

describe('T832339 T832340 T832338 T832341 AR - CED - Groups', function () {
    beforeEach(() => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arUserPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel(actionButtons.USER_MENU))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName(actionButtons.GROUP_MENU))
        arUserPage.getMediumWait()
    })

    it('should allow admin to create a group', () => {
        // Verify that Group Name field cannot be empty
        cy.get(arReportPage.getPageHeaderTitle()).should('have.text', "Groups")

        cy.get(arReportPage.getAddEditMenuActionsByName('Add Group')).click()
        cy.get(arGroupAddEditPage.getNameTxtF()).type('a').clear()
        cy.get(arGroupAddEditPage.getNameErrorMsg()).should('have.text', miscData.field_required_error)

        // Create Group with Valid Name
        cy.get(arGroupAddEditPage.getNameTxtF()).type(groupDetails.groupName)
        cy.get(arGroupAddEditPage.getDepartmentBtn()).click()

        // Select Department
        arSelectModal.SearchAndSelectFunction([departments.dept_top_name])

        // Select Users
        cy.get(arGroupAddEditPage.getUserProperty()).find(arGroupAddEditPage.getUsersDDownField()).click()
        arDashboardPage.getShortWait()
        cy.get(arGroupAddEditPage.getUsersDDownSearchTxtF()).type(`${users.learner01.learner_01_fname} ${users.learner01.learner_01_lname}`)
        cy.get(arGroupAddEditPage.getUsersDDownOpt()).contains(`${users.learner01.learner_01_fname} ${users.learner01.learner_01_lname}`).click()

        // Save Group
        arGroupAddEditPage.getShortWait()
        cy.get(arGroupAddEditPage.getSaveBtn()).click()
        arGroupAddEditPage.getShortWait()
    })

    it('should allow admin to edit a group', () => {
        // Search and edit Group
        arGroupAddEditPage.AddFilter('Name', 'Starts With', groupDetails.groupName)
        cy.get(arGroupAddEditPage.getTableCellContentByIndex(2)).contains(groupDetails.groupName).click()

        // arGroupAddEditPage.selectTableCellRecord(groupDetails.groupName, 2)
        cy.wrap(arGroupAddEditPage.WaitForElementStateToChange(arGroupAddEditPage.getAddEditMenuActionsByName('Edit Group'), 1000))
        cy.get(arGroupAddEditPage.getAddEditMenuActionsByName('Edit Group')).click()
        arUserPage.getMediumWait()

        cy.get(arGroupAddEditPage.getNameTxtF()).type(groupDetails.appendText)

        arGroupAddEditPage.getShortWait()
        cy.get(arGroupAddEditPage.getSaveBtn()).click()
        arGroupAddEditPage.getShortWait()
    })

    it('should allow admin to duplicate a group', () => {
        // Search and duplicate Group
        arGroupAddEditPage.AddFilter('Name', 'Starts With', `${groupDetails.groupName}${groupDetails.appendText}`) 
        cy.get(arGroupAddEditPage.getTableCellContentByIndex(2)).contains(`${groupDetails.groupName}${groupDetails.appendText}`).click()

        cy.wrap(arGroupAddEditPage.WaitForElementStateToChange(arGroupAddEditPage.getAddEditMenuActionsByName('Duplicate Group'), 1000))
        cy.get(arGroupAddEditPage.getAddEditMenuActionsByName('Duplicate Group')).click()
        cy.intercept('**/api/rest/v2/admin/automatic-group-filter-availability').as('getGroupDup').wait('@getGroupDup')
        cy.get(arGroupAddEditPage.getNameTxtF()).clear().type(groupDetails.groupNameDuplicate)

        // Save Group
        arGroupAddEditPage.getShortWait()
        cy.get(arGroupAddEditPage.getSaveBtn()).click()
    })

    it('should allow admin to deselect a group', () => {
        // Search Group
        arGroupAddEditPage.AddFilter('Name', 'Starts With', `${groupDetails.groupName}${groupDetails.appendText}`)
        cy.get(arGroupAddEditPage.getTableCellContentByIndex(2)).contains(`${groupDetails.groupName}${groupDetails.appendText}`).click()

        // Deselect Group
        cy.get(arGroupAddEditPage.getDeselectBtn()).click()

        // Verify that the Poll question is deselected
        cy.get(arGroupAddEditPage.getTableCellContentByIndex(1)).should('not.be.checked')
    })

    it('should allow admin to delete a group', () => {
        // Search, delete edited and duplicate Groups
        arGroupAddEditPage.AddFilter('Name', 'Starts With', `${groupDetails.groupName}${groupDetails.appendText}`)
        arGroupAddEditPage.AddFilter('Name', 'Starts With', groupDetails.groupNameDuplicate)
        cy.get(arGroupAddEditPage.getTableCellContentByIndex(2)).contains(`${groupDetails.groupName}${groupDetails.appendText}`).click()

        cy.wrap(arGroupAddEditPage.WaitForElementStateToChange(arGroupAddEditPage.getAddEditMenuActionsByName('Delete Group'), 1000))
        cy.get(arGroupAddEditPage.getAddEditMenuActionsByName('Delete Group')).click()
        arUserPage.getMediumWait()

        cy.get(arDeleteModal.getElementByDataName(arDeleteModal.getDeleteBtn())).click()
        cy.get(arGroupAddEditPage.getTableCellContentByIndex(2)).contains(groupDetails.groupNameDuplicate).click()

        cy.get(arGroupAddEditPage.getAddEditMenuActionsByName('Delete Group')).click()
        cy.get(arDeleteModal.getElementByDataName(arDeleteModal.getDeleteBtn())).click()
        arUserPage.getShortWait()
    })
})

