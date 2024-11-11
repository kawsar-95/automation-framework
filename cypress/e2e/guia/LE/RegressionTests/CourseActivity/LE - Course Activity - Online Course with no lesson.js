import ARCourseSettingsEnrollmentRulesModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import LECatalogPage from "../../../../../../helpers/LE/pageObjects/Catalog/LECatalogPage"
import LEDashboardPage from "../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage"
import { commonDetails } from "../../../../../../helpers/TestData/Courses/commonDetails"
import { ocDetails } from "../../../../../../helpers/TestData/Courses/oc"
import { users } from "../../../../../../helpers/TestData/users/users"
import arCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import LEFilterMenu from '../../../../../../helpers/LE/pageObjects/Menu/LEFilterMenu'
import ARDeleteModal from "../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal"

describe('C6339 - LE - Regression - Course Activity - Online Course with no Lesson', function(){
    before(function() {
        // Login as a sys admin and visit to course page
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getCoursesReport()
        // Create a course for all learners without any content
        cy.createCourse('Online Course', ocDetails.courseName)
        // Set enrollment rule - Allow self enrollment for all learners
        cy.get(ARCourseSettingsEnrollmentRulesModule.getRadioBtnContainer()).contains('All Learners').click()
        
        // Make sure course has no content
        // Click on remove chapter icon, and confirm deletion
        cy.get(arCoursesPage.getRemoveChapterOption()).click()
        cy.get(ARDashboardPage.getElementByDataNameAttribute(ARDeleteModal.getDeleteBtn())).click()
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })  
    })

    // Delete course
    after(function() {
        cy.deleteCourse(commonDetails.courseID)
    })

    it('Verify No Content Appeared on Course Details Page ', () => {
        // Login as a learner
        cy.viewport(1280,720) 
        cy.apiLoginWithSession(users.learner01.learner_01_username, users.learner01.learner_01_password)
        // Search for Online Course created earlier in the Catalog
        cy.get(LEDashboardPage.getNavMenu()).should('be.visible').click()
        cy.get(LECatalogPage.getLEMenuItems()).contains('Catalog').click()
        LEFilterMenu.SearchForCourseByName(ocDetails.courseName)
        cy.get(LEDashboardPage.getLEWaitSpinner(), {timeout: 10000}).should('not.exist', {timeout: 10000})
        LEDashboardPage.getSpecificCourseCardBtnThenClickOnName(ocDetails.courseName)
        
        // Check Enroll Button
        cy.get(LECatalogPage.getEnrollBtn()).should('have.text', 'Enroll').and('be.visible')
        cy.get(LECatalogPage.getCoursesModal()).within(()=>{
           cy.get(LECatalogPage.getEnrollBtn()).contains('Enroll').click()
        })

        // Verify Enrolled button converted to "completed"
        cy.get(LECatalogPage.getEnrollBtn()).should('have.text', 'Completed')

        cy.get(LECatalogPage.getCourseChapters()).should('not.exist')
    })
})
