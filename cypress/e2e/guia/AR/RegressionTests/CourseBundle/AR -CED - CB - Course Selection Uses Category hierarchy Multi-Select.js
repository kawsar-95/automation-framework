import ARCBAddEditPage from "../../../../../../helpers/AR/pageObjects/Courses/CB/ARCBAddEditPage"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARSelectModal from "../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal"
import ARUserAddEditPage from "../../../../../../helpers/AR/pageObjects/User/ARUserAddEditPage"
import { commonDetails } from "../../../../../../helpers/TestData/Courses/commonDetails"
import { courses } from "../../../../../../helpers/TestData/Courses/courses"
import { ocDetails } from "../../../../../../helpers/TestData/Courses/oc"
import { users } from "../../../../../../helpers/TestData/users/users"

describe('C958 - Course Selection Uses Category Hierarchy Multi-Select', () => {
    beforeEach(() => {
        cy.apiLoginWithSession(
            users.sysAdmin.admin_sys_01_username,
            users.sysAdmin.admin_sys_01_password,
            "/admin"
        )
    })
    after(() => {
        //Delete created course
        cy.deleteCourse(commonDetails.courseID)
    })

    it('Create Inactive course', () => {
      
        // Navigate to courses
        ARDashboardPage.getCoursesReport()
        cy.createCourse('Online Course')

        ARCBAddEditPage.generalToggleSwitch('false',ARUserAddEditPage.getIsActiveToggleContainer())

        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
      
    })
    it('Course Selection Uses Category Hierarchy Multi-Select', () => {
      
        // Navigate to courses
        ARDashboardPage.getCoursesReport()
        cy.createCourse('Course Bundle')
        // The "Add Courses" button brings up the category hierachy multi-select modal
        cy.get(ARCBAddEditPage.getCourseHierarchySelectModal()).should('exist')
        // Selected course are added to the course bundle in the order they are selected
        ARSelectModal.SearchAndSelectFunction([courses.oc_filter_01_name, courses.oc_filter_02_name])
        cy.get(ARDashboardPage.getWaitSpinner() , {timeout:15000}).should("not.exist")
        cy.get(ARDashboardPage.getElementByDataNameAttribute('add-courses')).click()
        // A selected course can be unselected
        ARSelectModal.SearchAndSelectFunction([courses.oc_filter_02_name])
        cy.get(ARDashboardPage.getWaitSpinner() , {timeout:15000}).should("not.exist")
        // A selected course can be removed via the trashcan icon and stays removed when selecting further courses
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Delete Course')).first().click()
        cy.get(ARDashboardPage.getElementByDataNameAttribute('confirm')).contains('Remove').click()

        // Test for Inactive course
        cy.get(ARDashboardPage.getElementByDataNameAttribute('add-courses')).click()
        ARSelectModal.SearchAndSelectFunction([ocDetails.courseName])
        cy.get(ARDashboardPage.getWaitSpinner() , {timeout:15000}).should("not.exist")

        // Test for Curriculam course
        cy.get(ARDashboardPage.getElementByDataNameAttribute('add-courses')).click()
        ARSelectModal.SearchAndSelectFunction([courses.curr_filter_01_name])
        cy.get(ARDashboardPage.getWaitSpinner() , {timeout:15000}).should("not.exist")


    })
})