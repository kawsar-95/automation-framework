import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../helpers/TestData/users/users'
import AREnrollUsersPage from '../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage'
import { ocDetails } from '../../../../../../helpers/TestData/Courses/oc'
import ARSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'

describe('C7279 AUT-679, AR - Regression - Report - Learner Progress - View Enrollments', function(){
    before('Create OC, Publish Course', () => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPageDashboardPage.getCoursesReport()
        

        // Create Online Course
        cy.createCourse("Online Course");

        // Publish Online Course
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
    })

    beforeEach(() => {
        //Sign into admin side as sys admin
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
    })

    after(function() {
        cy.deleteCourse(commonDetails.courseID);
    })

    it('View Learner Progress And Add Enrollment', () => {
        //Choose In Learner Progress from reports
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Reports'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Learner Progress'))   

        // Verify learner progress page should be opened
        cy.get(arDashboardPage.getPageHeaderTitle()).should('contain', "Learner Progress")

        // Select any existing learner progress
        arDashboardPage.AddFilter('Username', 'Contains', users.learner01.learner_01_username)
        arDashboardPage.getShortWait()

        // Click on View Enrollments
        cy.get(arDashboardPage.getTableCellRecord(users.learner01.learner_01_username)).click()
        arDashboardPage.getShortWait()

        // Verify User Enrollment page should be displayed
        cy.get(arDashboardPage.getAddEditMenuActionsByName('View Enrollments')).click()
        arDashboardPage.getMediumWait()

        // Verify User Enrollment page should be displayed
        cy.get(arDashboardPage.getPageHeaderTitle()).should('contain', "User Enrollments")

        // Click on Add enrollment
        cy.wrap(AREnrollUsersPage.WaitForElementStateToChange(arDashboardPage.getAddEditMenuActionsByName('Add Enrollment')), 1000)
        cy.get(arDashboardPage.getAddEditMenuActionsByName('Add Enrollment')).click()
        arDashboardPage.getShortWait()

        // Add Course
        cy.get(arDashboardPage.getElementByDataNameAttribute(AREnrollUsersPage.getEnrollUsersAddCourseBtn())).click()
        //Search and select course 
        cy.get(ARSelectModal.getSearchTxtF()).clear().type(ocDetails.courseName);
        arDashboardPage.getShortWait()

        cy.get(arDashboardPage.getElementByAriaLabelAttribute(ocDetails.courseName)).should('have.attr', 'aria-selected', 'false')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(ocDetails.courseName)).click()
        arDashboardPage.getShortWait()

        cy.get(arDashboardPage.getElementByAriaLabelAttribute(ocDetails.courseName)).should('have.attr', 'aria-selected', 'true')

        cy.get(ARSelectModal.getChooseBtn()).contains('Choose').click();
        arDashboardPage.getShortWait()

        // Verify course is selected
        cy.get(AREnrollUsersPage.getCourseNameModule()).should('have.text', ocDetails.courseName)

        // Vrify Enrollment should be saved successfully
        cy.get(AREnrollUsersPage.getSaveBtn()).click()

        // Verify that a toast message is displayed when user is successfully enrolled
        cy.get(arDashboardPage.getToastNotificationMsg()).should('contain', 'User has been enrolled.')
    })
})
