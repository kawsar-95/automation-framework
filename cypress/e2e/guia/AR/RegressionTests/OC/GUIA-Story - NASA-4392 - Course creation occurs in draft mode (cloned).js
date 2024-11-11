import ARCoursesPage from "../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage"
import ARCBAddEditPage from "../../../../../../helpers/AR/pageObjects/Courses/CB/ARCBAddEditPage"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARUnsavedChangesModal from "../../../../../../helpers/AR/pageObjects/Modals/ARUnsavedChangesModal"
import ARUserPage from "../../../../../../helpers/AR/pageObjects/User/ARUserPage"
import { ocDetails } from "../../../../../../helpers/TestData/Courses/oc"
import { users } from "../../../../../../helpers/TestData/users/users"
import menuItems from '../../../../../../cypress/fixtures/menuItems.json'
import { commonDetails } from "../../../../../../helpers/TestData/Courses/commonDetails"
import AROCAddEditPage from "../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage"
import AdminNavationModuleModule from "../../../../../../helpers/AR/modules/AdminNavationModule.module"

describe('AUT-283 C851 - GUIA-Story - NASA-4392 - Course creation occurs in draft mode (cloned)', () => {
    beforeEach('Login and navigate course reports', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getCoursesReport()
    })
    
    before('Create Online Course', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getCoursesReport()
        cy.createCourse('Online Course', ocDetails.courseName2)
        // Publish Online Course
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
    })

    after('Delete Online Course', () => {
        cy.deleteCourse(commonDetails.courseID)
    })
    
    it('Add an Online Course Click Cancel', () => {
        ARCoursesPage.storeTotalCourses()
        // Add Online Course button
        cy.get(ARCoursesPage.getCoursesActionsButtonsByLabel('Add Online Course')).should('have.text', 'Add Online Course').should('have.attr', 'aria-disabled', 'false').click()
        cy.get(ARCBAddEditPage.getCouseGeneralHeader() + ' ' + ARCBAddEditPage.getHeaderLabel()).should('have.text', 'General')
        // Cancel course publish
        AROCAddEditPage.cancelPublish()
        // Total courses assertion
        ARCoursesPage.checkTotalCourse()
    })

    it('Add an Online Course Make edits and click cancel', () => {
        // Store total courses
        ARCoursesPage.storeTotalCourses()

        cy.createCourse('Online Course', ocDetails.courseName)

        // Cancel course publish
        AROCAddEditPage.cancelPublish()

        // Total courses assertion
        ARCoursesPage.checkTotalCourse()

        // Filter course
        ARDashboardPage.AddFilter('Name', 'Contains', ocDetails.courseName)
        cy.get(ARDashboardPage.getWaitSpinner() , {timeout:15000}).should('not.exist')
        cy.get(ARUserPage.getNoResultMsg()).contains('No results found.').should('exist')
    })

    it('Add an Online Course Make edits and log out without clicking cancel or save', () => {
        // Store total courses
        ARCoursesPage.storeTotalCourses()

        cy.createCourse('Online Course', ocDetails.courseName)
        // Logout
        cy.logoutAdmin()

        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getCoursesReport()
        // Total courses assertion
        ARCoursesPage.checkTotalCourse()

        // Filter course
        ARDashboardPage.AddFilter('Name', 'Contains', ocDetails.courseName)
        cy.get(ARDashboardPage.getWaitSpinner() , {timeout:15000}).should('not.exist')
        cy.get(ARUserPage.getNoResultMsg()).contains('No results found.').should('exist')
    })

    it('Add Online Course Make edits and navigate to a different page without canceling or saving the course', () => {
        // Store total courses
        ARCoursesPage.storeTotalCourses()

        cy.createCourse('Online Course', ocDetails.courseName)

        // Navigate course menu
        cy.get(AdminNavationModuleModule.getCourseMenu()).click()
        // Click on competency sub-menu
        cy.get(ARDashboardPage.getMenuItem()).contains(menuItems.COMPETENCIES).should('be.visible').click()

        cy.get(ARUnsavedChangesModal.getPromptHeader(), {timeout : 15000}).should('have.text', 'Unsaved Changes')
        cy.get(ARUnsavedChangesModal.getOKBtn()).click()
        cy.get(ARUnsavedChangesModal.getOKBtn()).should('not.exist')
        cy.get(ARDashboardPage.getToastSuccessMsg(), {timeout: 15000}).should('not.exist')

        ARDashboardPage.getCoursesReport()
        // Total courses assertion
        ARCoursesPage.checkTotalCourse()

        // Filter course
        ARDashboardPage.AddFilter('Name', 'Contains', ocDetails.courseName)
        cy.get(ARDashboardPage.getWaitSpinner() , {timeout:15000}).should('not.exist')
        cy.get(ARUserPage.getNoResultMsg()).contains('No results found.').should('exist')
    })

    it('Edit an Online Course Click Cancel', () => {
        // Store total courses
        ARCoursesPage.storeTotalCourses()

        // Edit course
        cy.editCourse(ocDetails.courseName2)
        // Cancel course publish
        AROCAddEditPage.cancelPublish()

        ARDashboardPage.getCoursesReport()
        // Total courses assertion
        ARCoursesPage.checkTotalCourse()
    })

    it('Edit an Online Course Make edits and click cancel', () => {
        // Store total courses
        ARCoursesPage.storeTotalCourses()

        // Edit course
        cy.editCourse(ocDetails.courseName2)

        cy.get(AROCAddEditPage.getGeneralTitleTxtF()).invoke('val', ocDetails.courseName3.slice(0, -1)).type(ocDetails.courseName3.slice(-1))

        // Cancel course publish
        AROCAddEditPage.cancelPublish()

        ARDashboardPage.getCoursesReport()
        // Total courses assertion
        ARCoursesPage.checkTotalCourse()

        // Filter course
        ARDashboardPage.AddFilter('Name', 'Contains', ocDetails.courseName3)
        cy.get(ARDashboardPage.getWaitSpinner() , {timeout:15000}).should('not.exist')
        cy.get(ARUserPage.getNoResultMsg()).contains('No results found.').should('exist')
    })

    it('Edit an Online Course Make edits and log out without clicking cancel or save', () => {
        ARCoursesPage.storeTotalCourses()

        // Edit course
        cy.editCourse(ocDetails.courseName2)

        cy.get(AROCAddEditPage.getGeneralTitleTxtF()).invoke('val', ocDetails.courseName3.slice(0, -1)).type(ocDetails.courseName3.slice(-1))
        // Logout
        cy.logoutAdmin()

        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getCoursesReport()
        // Total courses assertion
        ARCoursesPage.checkTotalCourse()

        // Filter course
        ARDashboardPage.AddFilter('Name', 'Contains', ocDetails.courseName3)
        cy.get(ARDashboardPage.getWaitSpinner() , {timeout:15000}).should('not.exist')
        cy.get(ARUserPage.getNoResultMsg()).contains('No results found.').should('exist')
    })

    it.only('Edit Online Course Make edits and navigate to a different page without canceling or saving the course', () => {
        ARCoursesPage.storeTotalCourses()
        // Edit course
        cy.editCourse(ocDetails.courseName2)

        cy.get(AROCAddEditPage.getGeneralTitleTxtF()).invoke('val', ocDetails.courseName3.slice(0, -1)).type(ocDetails.courseName3.slice(-1))

        // Navigate course menu
        cy.get(AdminNavationModuleModule.getCourseMenu()).click()
        // Click on competency sub-menu
        cy.get(ARDashboardPage.getMenuItem()).contains(menuItems.COMPETENCIES).should('be.visible').click()

        cy.get(ARUnsavedChangesModal.getPromptHeader(), {timeout : 15000}).should('have.text', 'Unsaved Changes')
        cy.get(ARUnsavedChangesModal.getOKBtn()).click()
        cy.get(ARUnsavedChangesModal.getOKBtn()).should('not.exist')
        cy.get(ARDashboardPage.getToastSuccessMsg(), {timeout: 15000}).should('not.exist')

        ARDashboardPage.getCoursesReport()
        cy.get(ARDashboardPage.getWaitSpinner() , {timeout:15000}).should('not.exist')
        // Total courses assertion
        ARCoursesPage.checkTotalCourse()

        // Filter course
        ARDashboardPage.AddFilter('Name', 'Contains', ocDetails.courseName3)
        cy.get(ARDashboardPage.getWaitSpinner() , {timeout:15000}).should('not.exist')
        cy.get(ARUserPage.getNoResultMsg()).contains('No results found.').should('exist')
    })
})