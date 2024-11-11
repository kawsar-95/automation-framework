import ARAddMoreCourseSettingsModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module"
import ARCourseSettingsEnrollmentRulesModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARDeleteModal from "../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal"
import ARSelectModal from "../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal"
import ARCurriculaActivityReportPage from "../../../../../../helpers/AR/pageObjects/Reports/ARCurriculaActivityReportPage"
import ARUserPage from "../../../../../../helpers/AR/pageObjects/User/ARUserPage"
import { cbDetails } from "../../../../../../helpers/TestData/Courses/cb"
import { commonDetails } from "../../../../../../helpers/TestData/Courses/commonDetails"
import { courses } from "../../../../../../helpers/TestData/Courses/courses"
import { users } from "../../../../../../helpers/TestData/users/users"

describe('C7334 - AUT-696 - AE - Regression Course Bundle - Delete Course Bundle', () => {
    before('Create a Course Bundle for the test ', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getCoursesReport()
        cy.createCourse('Course Bundle')
        ARSelectModal.SearchAndSelectFunction([courses.oc_filter_01_name])
        cy.get(ARDashboardPage.getWaitSpinner() , {timeout:15000}).should('not.exist')
        // Open Enrollment Rules
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        // Select Allow Self Enrollment Alll learner Radio Button
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')
        // Publish Course
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36)
        })
        cy.get(ARDashboardPage.getWaitSpinner() , {timeout:15000}).should('not.exist')
    })

    it('Delete the Course from the Course report', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getCoursesReport()
       

        // Filter course
        ARDashboardPage.AddFilter('Name', 'Contains', cbDetails.courseName)
        cy.get(ARDashboardPage.getWaitSpinner() , {timeout:15000}).should('not.exist')
       
        
        // Assert that there is a difference in right context menu BEFORE selecting an item
        // That is, Deselect menu item is not present
        cy.get(ARCurriculaActivityReportPage.getRightContextMenu()).children().should(($child) => {            
            expect($child).to.not.contain('Deselect')
        }) 

        // Select filtered course
        cy.get(ARDashboardPage.getTableCellRecord(cbDetails.courseName)).eq(0).click()
        cy.wrap(ARDashboardPage.A5WaitForElementStateToChange(ARDashboardPage.getElementByDataNameAttribute(ARCurriculaActivityReportPage.getActionRightMenuDeletebtn())))

        // Assert that there is a difference in right context menu AFTER selecting an item
        // That is, Deselect menu item is present
        cy.get(ARCurriculaActivityReportPage.getRightContextMenu()).children().should(($child) => {            
            expect($child).to.contain('Deselect')
        })

        // Click on Delete button from the right menu 
        cy.get(ARDashboardPage.getElementByDataNameAttribute(ARCurriculaActivityReportPage.getActionRightMenuDeletebtn())).click({force: true})
        cy.get(ARDashboardPage.getWaitSpinner() , {timeout:15000}).should('not.exist')
        // Assert that the delete modal's header is as expected
        cy.get(ARDashboardPage.getElementByDataNameAttribute(ARDeleteModal.getDeletePromptHeader())).should('contain', "Delete Course")
        // Assert that the delete modal's content is as expected
        cy.get(ARDeleteModal.getDeletePromptContent()).should('contain', ARDeleteModal.getDeleteMsg(cbDetails.courseName))
        // Click Cancel to cancel the delete attempt
        cy.get(ARDashboardPage.getElementByDataNameAttribute("cancel")).contains('Cancel').click()
        // Assert that the Admin remains on the same page
        cy.get(ARDashboardPage.getPageHeaderTitle()).should('exist').and('be.visible')
        cy.get(ARDashboardPage.getPageHeaderTitle()).should('contain', 'Courses')
        // Attempt to delete the course once again
        cy.get(ARDashboardPage.getElementByDataNameAttribute(ARCurriculaActivityReportPage.getActionRightMenuDeletebtn())).click({force:true})
        cy.get(ARDashboardPage.getElementByDataNameAttribute(ARDeleteModal.getDeletePromptHeader())).should('be.visible')
        // Click Delete button on modal to confirm deletion
        cy.get(ARDashboardPage.getElementByDataNameAttribute("confirm")).contains('Delete').click()
        // Assert that the course has been deleted successfully
        cy.get(ARUserPage.getNoResultMsg()).contains('No results found.').should('exist')
    })
})