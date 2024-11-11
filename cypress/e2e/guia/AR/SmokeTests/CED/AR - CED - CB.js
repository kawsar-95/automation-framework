/// <reference types="cypress" />
import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import arCBAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/CB/ARCBAddEditPage'
import arSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import arDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import { cbDetails } from '../../../../../../helpers/TestData/Courses/cb'
import { commonDetails, arrayOfCourses } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../helpers/TestData/users/users'

describe('AR - CED - CB', function () {

    beforeEach(function () {
        // Sign in with System Admin account
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        // Click the Courses menu item
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        arDashboardPage.getMenuItemOptionByName('Courses')
        cy.intercept('**/operations').as('getCourses').wait('@getCourses');
    })

    it('should allow admin to create CB', () => {
        // Create Course Bundle
        cy.createCourse('course bundle')
        // Add Courses to Course Bundle
        arSelectModal.SearchAndSelectFunction(arrayOfCourses.twoElementsArray)
        // Publish Course Bundle
        cy.publishCourse()
    })

    it('should allow admin to edit a CB', () => {
        // Search and edit Course Bundle
        cy.editCourse(cbDetails.courseName)
        arCoursesPage.getLongWait()
        cy.get(arCBAddEditPage.getGeneralTitleTxtF()).type(`${commonDetails.appendText}`)
        // Publish course
        cy.publishCourse()
    })

    it('should allow admin to delete a CB', () => {
        //Filter for CB
        cy.wrap(arCoursesPage.AddFilter('Name', 'Contains', `${cbDetails.courseName}${commonDetails.appendText}`))
        arCoursesPage.getShortWait()
        cy.get(arCoursesPage.getTableCellName(2)).contains(`${cbDetails.courseName}${commonDetails.appendText}`).click()
        cy.wrap(arCoursesPage.WaitForElementStateToChange(arCoursesPage.getAddEditMenuActionsByName('Delete'), 1000))
        cy.get(arCoursesPage.getAddEditMenuActionsByName('Delete')).click()
        cy.get(arCoursesPage.getElementByDataNameAttribute(arDeleteModal.getDeleteBtn())).click()
        cy.get(arCoursesPage.getWaitSpinner(), {timeout: 15000}).should('not.exist')
        // Verify CB is deleted
        cy.get(arCoursesPage.getNoResultMsg()).should('have.text', 'No results found.')
    })
});