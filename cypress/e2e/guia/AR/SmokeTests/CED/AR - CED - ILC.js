/// <reference types="cypress" />
import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import arILCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage'
import arDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import { ilcDetails } from '../../../../../../helpers/TestData/Courses/ilc'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../helpers/TestData/users/users'

describe('AR - CED - ILC T832337', function () {

    beforeEach(function () {
        // Sign in with System Admin account
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        // Click the Courses menu item
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        arDashboardPage.getMenuItemOptionByName('Courses')
        ;
    })

    it('should allow admin to create an ILC', () => {
        // Create ILC
        cy.createCourse('Instructor Led')
        // Publish ILC
        cy.publishCourse()
    })

    it('should allow admin to edit an ILC', () => {
        // Search and edit ILC
        cy.editCourse(ilcDetails.courseName)
        arCoursesPage.getLongWait()
        cy.get(arILCAddEditPage.getGeneralTitleTxtF()).type(`${commonDetails.appendText}`)
        // Publish course
        cy.publishCourse()
    })

    it('should allow admin to delete an ILC', () => {
        //Filter for ILC
        cy.wrap(arCoursesPage.AddFilter('Name', 'Contains', `${ilcDetails.courseName}${commonDetails.appendText}`))
        arCoursesPage.getShortWait()
        cy.get(arCoursesPage.getTableCellName(2)).contains(`${ilcDetails.courseName}${commonDetails.appendText}`).click()
        cy.wrap(arCoursesPage.WaitForElementStateToChange(arCoursesPage.getAddEditMenuActionsByName('Delete'), 1000))
        cy.get(arCoursesPage.getAddEditMenuActionsByName('Delete')).click()
        cy.get(arCoursesPage.getElementByDataNameAttribute(arDeleteModal.getDeleteBtn())).click()
        cy.get(arCoursesPage.getWaitSpinner(), {timeout: 15000}).should('not.exist')
        // Verify ILC is deleted
        cy.get(arCoursesPage.getNoResultMsg()).should('have.text', 'No results found.')
    })
})