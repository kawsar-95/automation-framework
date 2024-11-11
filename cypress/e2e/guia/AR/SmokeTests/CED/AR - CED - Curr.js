/// <reference types="cypress" />
import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import arCURRAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/CURR/ARCURRAddEditPage'
import arSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import arDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import { currDetails } from '../../../../../../helpers/TestData/Courses/curr'
import { commonDetails, arrayOfCourses } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../helpers/TestData/users/users'

describe('AR - CED - Curriculum', function () {

    beforeEach(function () {
        // Sign in with System Admin account
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        // Click the Courses menu item
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        arDashboardPage.getMenuItemOptionByName('Courses')
        cy.intercept('**/operations').as('getCourses').wait('@getCourses');
        cy.get(arCoursesPage.getPageHeaderTitle()).should('have.text', "Courses")
    })

    it('should allow admin to create Curriculum', () => {
        // Create Curriculum
        cy.createCourse('Curriculum')
        // Add Courses to Curriculum
        arSelectModal.SearchAndSelectFunction(arrayOfCourses.twoElementsArray)
        // Publish Curriculum
        cy.publishCourse()
    })

    it('should allow admin to edit a Curriculum', () => {
        //Edit Curriculum
        cy.editCourse(currDetails.courseName)
        arCoursesPage.getLongWait()
        cy.get(arCURRAddEditPage.getElementByAriaLabelAttribute(arCURRAddEditPage.getGeneralTitleTxtF())).type(`${commonDetails.appendText}`)
        //Edit group name and verify courses
        cy.get(arCURRAddEditPage.getGroupNameTxtF()).clear().type(`${currDetails.curriculumGroupName}${commonDetails.timestamp}`)
        cy.get(arCURRAddEditPage.getGroupRadioBtn()).contains('Minimum courses').click()
        cy.get(arCURRAddEditPage.getRequiredCourseCountTxtF()).clear().type(2)
        // Verify courses added to Curriculum
        cy.get(arCURRAddEditPage.getGroupCourseNameLbl(1)).should('have.text', arrayOfCourses.twoElementsArray[0])
        cy.get(arCURRAddEditPage.getGroupCourseNameLbl(2)).should('have.text', arrayOfCourses.twoElementsArray[1])
        cy.get(arCURRAddEditPage.getAddGroupBtn()).click()
        // Publish Curriculum
        cy.publishCourse()
    })

    it('should allow admin to delete a Curriculum', () => {
        //Filter for Curriculum
        cy.wrap(arCoursesPage.AddFilter('Name', 'Contains', `${currDetails.courseName}${commonDetails.appendText}`))
        arCoursesPage.getShortWait()
        cy.get(arCoursesPage.getTableCellName(2)).contains(`${currDetails.courseName}${commonDetails.appendText}`).click()
        cy.wrap(arCoursesPage.WaitForElementStateToChange(arCoursesPage.getAddEditMenuActionsByName('Delete'), 1000))
        cy.get(arCoursesPage.getAddEditMenuActionsByName('Delete')).click()
        cy.get(arCoursesPage.getElementByDataNameAttribute(arDeleteModal.getDeleteBtn())).click()
        cy.get(arCoursesPage.getWaitSpinner(), {timeout: 15000}).should('not.exist')
        // Verify Curriculum is deleted
        cy.get(arCoursesPage.getNoResultMsg()).should('have.text', 'No results found.')
    })
})