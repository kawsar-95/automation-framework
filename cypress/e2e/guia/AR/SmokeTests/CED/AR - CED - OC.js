/// <reference types="cypress" />
import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import arOCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage'
import arDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import { ocDetails } from '../../../../../../helpers/TestData/Courses/oc'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../helpers/TestData/users/users'

describe('AR - Smoke - CED - OC T832324', function () {

    beforeEach(function () {
        // Sign in with System Admin account
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        // Click the Courses menu item
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        arDashboardPage.getMenuItemOptionByName('Courses')
        cy.intercept('/**/reports/courses/operations').as('getCourses').wait('@getCourses')
    })

    it('should allow admin to create an OC', () => {
        // Create OC
        cy.createCourse('Online Course')
        // Publish course
        cy.publishCourse()
    })

    it('should allow admin to edit an OC', () => {
        cy.editCourse(ocDetails.courseName)
        arCoursesPage.getLongWait()
        cy.get(arOCAddEditPage.getGeneralTitleTxtF()).type(`${commonDetails.appendText}`)
        // Publish course
        cy.publishCourse()
    })

    it('should allow admin to delete an OC', () => {
        //Filter for OC
        cy.wrap(arCoursesPage.AddFilter('Name', 'Contains', `${ocDetails.courseName}${commonDetails.appendText}`))
        arCoursesPage.getShortWait()
        cy.get(arCoursesPage.getTableCellName(2)).contains(`${ocDetails.courseName}${commonDetails.appendText}`).click()
        cy.wrap(arCoursesPage.WaitForElementStateToChange(arCoursesPage.getAddEditMenuActionsByName('Delete'), 1000))
        cy.get(arCoursesPage.getAddEditMenuActionsByName('Delete')).click()
        cy.get(arCoursesPage.getElementByDataNameAttribute(arDeleteModal.getDeleteBtn())).click()
        cy.get(arCoursesPage.getWaitSpinner(), {timeout: 15000}).should('not.exist')
        // Verify OC is deleted
        cy.get(arCoursesPage.getNoResultMsg()).should('have.text', 'No results found.')
    })
})