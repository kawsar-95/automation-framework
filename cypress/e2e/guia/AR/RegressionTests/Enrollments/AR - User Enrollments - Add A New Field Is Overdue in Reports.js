import { users } from '../../../../../../helpers/TestData/users/users'
import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import {userDetails}  from '../../../../../../helpers/TestData/users/UserDetails'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { ocDetails } from '../../../../../../helpers/TestData/Courses/oc'
import AREnrollUsersPage from "../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage"
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LEProfilePage from '../../../../../../helpers/LE/pageObjects/User/LEProfilePage'
import AREditActivityPage from '../../../../../../helpers/AR/pageObjects/Enrollment/AREditActivityPage'
import ARUserEnrollmentPage from '../../../../../../helpers/AR/pageObjects/User/ARUserEnrollmentPage'
import { miscData } from '../../../../../../helpers/TestData/Misc/misc'

describe('C7305 AUT-689, AR - User Enrollments - Add A New Field Is Overdue in Reports', () => {
    
    before(() => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getCoursesReport()
        cy.createCourse('Online Course')

        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36)
        })
        cy.get(arDashboardPage.getToastSuccessMsg()).should('be.visible')

        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)

        // Enroll User
        AREnrollUsersPage.getEnrollUserByCourseAndUsername([ocDetails.courseName], [userDetails.username])
    })

    after(() => {
        // Delete learner
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        cy.get(LEDashboardPage.getNavProfile()).click({force: true})  
        LEDashboardPage.getMediumWait()
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click({force: true})
        cy.url().then((currentURL) => {
            cy.deleteUser(currentURL.slice(-36))
        })

        cy.deleteCourse(commonDetails.courseID)
    })

    beforeEach('Login as an admin to execute the tests', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
    })

    it('See Enrollments for a course that has a due date from User Enrollments', () => {
        arDashboardPage.getUserEnrollmentsReport()
        ARUserEnrollmentPage.ChooseUserAddFilter(userDetails.username)

        // The new field “Is Overdue” will not be on the default view
        cy.get(arDashboardPage.getTableHeader()).should('not.contain', 'Is Overdue')
        cy.get(arDashboardPage.getTableDisplayColumnBtn()).click()
        arDashboardPage.verifyColumnSelected('Is Overdue', 'false')

        // The new field “Is Overdue” can be selected
        cy.get(arDashboardPage.getDisplayColumnItemByName('Is Overdue')).should('exist').scrollIntoView().click()
        cy.get(arDashboardPage.getDisplayColumnItemByName('Days Until Due')).should('exist').scrollIntoView().click()

        cy.get(arDashboardPage.getWaitSpinner()).should('not.exist')
        arDashboardPage.verifyColumnSelected('Is Overdue', 'true')
        arDashboardPage.verifyColumnSelected('Days Until Due', 'true')
        cy.get(arDashboardPage.getTableDisplayColumnBtn()).click({force:true})
        cy.get(arDashboardPage.getTableHeader()).should('contain', 'Is Overdue')
        cy.get(arDashboardPage.getTableHeader()).should('contain', 'Days Until Due')

        // Enrollments that have not passed the due date are marked as “No” in the “Is Overdue” field
        cy.get(arDashboardPage.getDaysUntilDue()).should('not.contain', '-')
        cy.get(arDashboardPage.getIsOverdue()).should('contain', 'No')

        // Select the course that is found from the filter
        cy.get(AREnrollUsersPage.getTableCellName()).contains(ocDetails.courseName).click()

        // Select Edit enrollment button 
        cy.wrap(AREnrollUsersPage.WaitForElementStateToChange(AREnrollUsersPage.getAddEditMenuActionsByName('Edit Enrollment'), 1000))
        cy.get(AREnrollUsersPage.getAddEditMenuActionsByName('Edit Enrollment')).click()
        cy.get(arDashboardPage.getPageHeaderTitle()).should('be.visible').and('contain', 'Edit Activity')
        cy.get(arDashboardPage.getWaitSpinner()).should('not.exist')

        // Select due date 
        AREditActivityPage.getDueDatePickerBtnThenClick()
        AREditActivityPage.getSelectDate(AREditActivityPage.getPastDate(4))
        cy.get(AREditActivityPage.getDuetDateTimeBtn()).click()
        AREditActivityPage.SelectTime('01', '00', 'PM')

        // Saved edit enrollment details 
        cy.wrap(AREditActivityPage.WaitForElementStateToChange(AREditActivityPage.getSaveBtn()), 1000)
        cy.get(AREditActivityPage.getSaveBtn()).click()
        cy.get(arDashboardPage.getToastSuccessMsg()).should('have.text', 'Course activity has been updated')
        
        cy.get(arDashboardPage.getPageHeaderTitle()).should('be.visible').and('contain', 'User Enrollments')

        // marked as “Yes” in the “Is Overdue” field (when the “Days until due” < 0)
        cy.get(arDashboardPage.getDaysUntilDue()).should('contain', '-')
        cy.get(arDashboardPage.getIsOverdue()).should('contain', 'Yes')

        // create layout
        arDashboardPage.createLayout(miscData.layout_name_1)
        cy.get(arDashboardPage.getWaitSpinner()).should('not.exist')

        // reset layout
        arDashboardPage.resetLayout()
        cy.get(arDashboardPage.getCancelBtn()).should('be.visible').click()

        // select layout
        arDashboardPage.selectLayout(miscData.layout_name_1)

        // Set the page as the Organization Default
        arDashboardPage.setOrganizationDefault()

        // delete layout
        arDashboardPage.deleteLayout()

        // verify delete layout
        cy.get(arDashboardPage.getCancelBtn()).should('be.visible').click()
        arDashboardPage.veriftLayoutDeleted(miscData.layout_name_1)

        // Reset Organization Default
        arDashboardPage.resetOrganizationDefault()
        cy.get(arDashboardPage.getTableHeader()).should('not.contain', 'Is Overdue')
    })
})