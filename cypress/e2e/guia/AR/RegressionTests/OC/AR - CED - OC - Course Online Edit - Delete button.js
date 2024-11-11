import AROCAddEditPage from "../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARDeleteModal from "../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal"
import ARUnsavedChangesModal from "../../../../../../helpers/AR/pageObjects/Modals/ARUnsavedChangesModal"
import { commonDetails } from "../../../../../../helpers/TestData/Courses/commonDetails"
import { ocDetails } from "../../../../../../helpers/TestData/Courses/oc"
import { users } from "../../../../../../helpers/TestData/users/users"

describe('C6342 - Course Online Edit - Delete button', () => {
    beforeEach(() => {
        cy.apiLoginWithSession(
            users.sysAdmin.admin_sys_01_username,
            users.sysAdmin.admin_sys_01_password,
            '/admin'
        )
    })
    it('Create temporary course', () => {
        ARDashboardPage.getMediumWait()
        //Navigate to Course
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute("Courses")).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName("Courses"))
        cy.intercept("/api/rest/v2/admin/reports/courses/operations")
            .as("getCourses")
            .wait("@getCourses");
        cy.createCourse('Online Course')
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        });
        ARDashboardPage.getMediumWait()

    })
    it('Edit created course', () => {
        ARDashboardPage.getMediumWait()
        //Navigate to Course
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute("Courses")).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName("Courses"))
        cy.intercept("/api/rest/v2/admin/reports/courses/operations")
            .as("getCourses")
            .wait("@getCourses");
        // Select any existing Online Course and click on it
        cy.editCourse(ocDetails.courseName)
        cy.get(AROCAddEditPage.getAddEditSection()).within(() => {
            // Verify that [Delete] button has been added to Online course edit page
            cy.get(ARDashboardPage.getAddEditMenuActionsByName('Delete')).should('exist')

            // Verify that clicking [Delete] button will open the Delete Course modal
            cy.get(ARDashboardPage.getAddEditMenuActionsByName('Delete')).click()
        })
        // Verify that clicking [Delete] button will open the Delete Course modal
        cy.get(ARDeleteModal.getElementByDataNameAttribute('delete-course-prompt')).should('exist')
        // Verify that the modal displays message "Are you sure you want to delete 'xxxx'?" where 'xxxx' is the name of the course
        cy.get(ARDeleteModal.getElementByDataNameAttribute('delete-course-prompt')).should('contain', ARDeleteModal.getDeleteMsg(ocDetails.courseName))
        cy.get(ARDeleteModal.getElementByDataNameAttribute('delete-course-prompt')).within(() => {
            // Verify that the modal displays[Delete] and [Cancel] buttons
            cy.get(ARDeleteModal.getElementByDataNameAttribute('confirm')).should('contain', 'Delete')
            cy.get(ARDeleteModal.getElementByDataNameAttribute('cancel')).should('contain', 'Cancel')
            // Verify that selecting the [Cancel] button course is not deleted
            cy.get(ARDeleteModal.getElementByDataNameAttribute('cancel')).click()

        })

        cy.get(ARDashboardPage.getElementByDataNameAttribute('cancel')).click()
        ARDashboardPage.getShortWait()
        cy.get(ARUnsavedChangesModal.getOKBtn()).click()
        ARDashboardPage.getLongWait()
        // Online Course remains in the list of courses
        cy.get(ARDashboardPage.getTableCellName(2)).should('contain', ocDetails.courseName)
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Remove All')).click()
        ARDashboardPage.getShortWait()
        cy.editCourse(ocDetails.courseName)
        ARDashboardPage.getMediumWait()


        cy.get(AROCAddEditPage.getAddEditSection()).within(() => {
            // Verify that [Delete] button has been added to Online course edit page
            cy.get(ARDashboardPage.getAddEditMenuActionsByName('Delete')).should('exist')

            // Verify that clicking [Delete] button will open the Delete Course modal
            cy.get(ARDashboardPage.getAddEditMenuActionsByName('Delete')).click()
        })
        cy.get(ARDeleteModal.getElementByDataNameAttribute('confirm')).click()
        // Verify that a toast message is displayed when course is successfully
        cy.get(ARDashboardPage.getToastNotificationMsg()).should('contain', 'Course has been deleted successfully.')
        cy.get(ARDashboardPage.getElementByDataNameAttribute('cancel')).click()
        ARDashboardPage.getShortWait()
        cy.get(ARUnsavedChangesModal.getOKBtn()).click()
        ARDashboardPage.getLongWait()
        // Verify that selecting the [Delete] button deletes the course from list of courses
        cy.get(ARDashboardPage.getARLeftMenuByLabel('div')).should('contain', 'No results found.')



    })
})