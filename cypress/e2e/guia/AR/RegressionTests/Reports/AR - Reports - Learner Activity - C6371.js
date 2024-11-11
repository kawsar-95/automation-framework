import ARCollaborationAddEditPage from "../../../../../../helpers/AR/pageObjects/Collaborations/ARCollaborationAddEditPage"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARDeleteModal from "../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal"
import ARCourseActivityReportPage from "../../../../../../helpers/AR/pageObjects/Reports/ARCourseActivityReportPage"
import ARILCActivityReportPage from "../../../../../../helpers/AR/pageObjects/Reports/ARILCActivityReportPage"
import ARUserEnrollmentPage from "../../../../../../helpers/AR/pageObjects/User/ARUserEnrollmentPage"
import { departments } from "../../../../../../helpers/TestData/Department/departments"
import { userDetails } from "../../../../../../helpers/TestData/users/UserDetails"
import { users } from "../../../../../../helpers/TestData/users/users"
import defaultTestData from '../../../../../fixtures/defaultTestData.json'
describe('C6371 - Learner Activity', () => {
    before(function () {
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
    })
    beforeEach(() => {
        cy.apiLoginWithSession(
            users.sysAdmin.admin_sys_01_username,
            users.sysAdmin.admin_sys_01_password,
            '/admin'
        )
    })
    after(function () {
        //Delete user
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Users'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Users'))
        cy.intercept('**/users/operations').as('getUser').wait('@getUser');
        cy.wrap(ARDashboardPage.AddFilter('Username', 'Equals', userDetails.username))
        cy.wrap(ARDashboardPage.selectTableCellRecord(userDetails.username))
        cy.wrap(ARDashboardPage.WaitForElementStateToChange(ARDashboardPage.getAddEditMenuActionsByName('Delete'), ARDashboardPage.getShortWait()))
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Delete')).click()
        cy.wrap(ARDashboardPage.WaitForElementStateToChange(ARDashboardPage.getElementByDataNameAttribute(ARDeleteModal.getDeleteBtn()), ARDashboardPage.getLShortWait()))
        cy.get(ARDashboardPage.getElementByDataNameAttribute(ARDeleteModal.getDeleteBtn())).click().wait('@getUser')
        cy.get(ARDashboardPage.getNoResultMsg()).contains('No results found.').should('exist')
    })
    it('Learner Activity', () => {
        //Navigate to Learner Activity
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Reports')).click()
        ARDashboardPage.getMenuItemOptionByName('Learner Activity')
        ARDashboardPage.getMediumWait()

        //Learner activity should be displayed as per Sorting Like as
        cy.get(ARDashboardPage.getTableHeader()).eq(1).should('contain', 'First Name')
        cy.get(ARDashboardPage.getTableHeader()).eq(2).should('contain', 'Department')
        cy.get(ARDashboardPage.getTableHeader()).eq(3).should('contain', 'Status')

        // Apply filter by department
        ARDashboardPage.AddFilter('Department', 'Is Only', departments.dept_top_name)
        //Apply filter by First Name
        ARDashboardPage.getMediumWait()
        ARDashboardPage.AddFilter('First Name', 'Contains', defaultTestData.USER_LEARNER_FNAME)
        ARDashboardPage.getMediumWait()
        //Apply filter by Last Name
        ARDashboardPage.getMediumWait()
        ARDashboardPage.AddFilter('Last Name', 'Contains', defaultTestData.USER_LEARNER_LNAME)
        ARDashboardPage.getMediumWait()
        //Apply filter by user name
        ARDashboardPage.getMediumWait()
        ARDashboardPage.AddFilter('Username', 'Contains', userDetails.username)
        ARDashboardPage.getMediumWait()
        // Select any existing Learner activity
        cy.get(ARDashboardPage.getGridTable()).eq(0).click()
        ARDashboardPage.getMediumWait()
        // Action items Should be displayed
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Edit User')).should('exist')
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Message User')).should('exist')
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('User Transcript')).should('exist')
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('View Enrollments')).should('exist')
        cy.get(ARDashboardPage.getDeselectBtn()).should('exist')
        //Click on Edit user
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Edit User')).click()
        ARDashboardPage.getMediumWait()
        cy.get(ARCollaborationAddEditPage.getPageHeader()).should('contain', 'Edit User')
        cy.get(ARDashboardPage.getElementByDataNameAttribute('cancel')).click()
        ARDashboardPage.getMediumWait()
        // Click on Messege user
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Message User')).click()
        ARDashboardPage.getMediumWait()
        cy.get(ARCollaborationAddEditPage.getPageHeader()).should('contain', 'Compose Message')
        cy.get(ARDashboardPage.getElementByDataNameAttribute('cancel')).click()
        ARDashboardPage.getMediumWait()
        //Click on User Transcript
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('User Transcript')).click()
        ARDashboardPage.getMediumWait()
        cy.get(ARCollaborationAddEditPage.getPageHeader()).should('contain', 'User Transcript')
        cy.get(ARDashboardPage.getElementByDataNameAttribute('back')).click()
        ARDashboardPage.getMediumWait()
        //Click on View Enrollment
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('View Enrollments')).click()
        ARDashboardPage.getMediumWait()
        cy.get(ARUserEnrollmentPage.getPageHeader()).should('contain', 'User Enrollments')
        cy.get(ARDashboardPage.getElementByDataNameAttribute('back')).click()
        ARDashboardPage.getMediumWait()

        //Click on deselect
        cy.get(ARDashboardPage.getDeselectBtn()).click()




    })
})