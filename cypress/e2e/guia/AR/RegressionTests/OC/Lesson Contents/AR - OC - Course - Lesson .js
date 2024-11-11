import ARAddEditCategoryPage from "../../../../../../../helpers/AR/pageObjects/Category/ARAddEditCategoryPage"
import ARCoursesPage from "../../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage"
import ARDashboardPage from "../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARSelectLearningObjectModal, { ImportCourseData } from "../../../../../../../helpers/AR/pageObjects/Modals/ARSelectLearningObjectModal"
import ARUploadFileModal from "../../../../../../../helpers/AR/pageObjects/Modals/ARUploadFileModal"
import { lessons, resourcePaths } from "../../../../../../../helpers/TestData/resources/resources"

import { users } from "../../../../../../../helpers/TestData/users/users"


describe("C6362 - AR - Regress - OC - Course Lesson T832325", function () {

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, "/admin")
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Courses'))
        
    })

    it("Import Courses - Press Cancel Button", () => {
        //Click on import Courses
        cy.get(ARCoursesPage.getCoursesActionsButtonsByLabel("Import Course")).click()
        ARCoursesPage.getShortWait()
        //Asserting Learning Objects
        cy.get(ARSelectLearningObjectModal.getObjectRadioBtn()).eq(0).should('have.text', ImportCourseData["SCORM_1.2"])
        cy.get(ARSelectLearningObjectModal.getObjectRadioBtn()).eq(1).should('have.text', ImportCourseData.SCORM_2004)
        cy.get(ARSelectLearningObjectModal.getObjectRadioBtn()).eq(2).should('have.text', ImportCourseData.Tin_Can)
        cy.get(ARSelectLearningObjectModal.getObjectRadioBtn()).eq(3).should('have.text', ImportCourseData.AICC)
        //Selecting SCORM_1.2
        ARSelectLearningObjectModal.getObjectTypeByName('SCORM 1.2')
        //Selecting AICC
        ARSelectLearningObjectModal.getObjectTypeByName(ImportCourseData.AICC)
        //Selecting SCORM_1.2 again
        ARSelectLearningObjectModal.getObjectTypeByName(ImportCourseData["SCORM_1.2"])
        //Uploading Zip the file in the Upload modal
        cy.get(ARUploadFileModal.getChooseFileBtn()).contains('Choose File').click()
        cy.get(ARUploadFileModal.getFilePathTxt()).attachFile(resourcePaths.resource_lessons_folder + lessons.scorm_12_complete_Failed_filename)
        ARCoursesPage.getMediumWait()
        //Clicking on Cancel Button
        cy.get(ARCoursesPage.getElementByDataNameAttribute("cancel")).click()
        //Asserting Course Page
        cy.get(ARAddEditCategoryPage.getReportPageTitle()).should("have.text", "Courses")

    })

    it("Import Course - Press OK Buttton ", function () {
        //Click on import Courses
        cy.get(ARCoursesPage.getCoursesActionsButtonsByLabel("Import Course")).click()
        ARCoursesPage.getShortWait()
        //Asserting Learning Objects
        cy.get(ARSelectLearningObjectModal.getObjectRadioBtn()).eq(0).should('have.text', ImportCourseData["SCORM_1.2"])
        cy.get(ARSelectLearningObjectModal.getObjectRadioBtn()).eq(1).should('have.text', ImportCourseData.SCORM_2004)
        cy.get(ARSelectLearningObjectModal.getObjectRadioBtn()).eq(2).should('have.text', ImportCourseData.Tin_Can)
        cy.get(ARSelectLearningObjectModal.getObjectRadioBtn()).eq(3).should('have.text', ImportCourseData.AICC)
        //Selecting SCORM_1.2
        ARSelectLearningObjectModal.getObjectTypeByName('SCORM 1.2')
        //Selecting AICC
        ARSelectLearningObjectModal.getObjectTypeByName(ImportCourseData.AICC)
        //Selecting SCORM_1.2 again
        ARSelectLearningObjectModal.getObjectTypeByName(ImportCourseData["SCORM_1.2"])
        //Uploading Zip the file in the Upload modal
        cy.get(ARUploadFileModal.getChooseFileBtn()).contains('Choose File').click()
        cy.get(ARUploadFileModal.getFilePathTxt()).attachFile(resourcePaths.resource_lessons_folder + lessons.scorm_12_complete_Failed_filename)
        ARCoursesPage.getMediumWait()
        //Clicking on Import Button
        cy.get(ARCoursesPage.getElementByDataNameAttribute("import")).click()
        ARCoursesPage.getMediumWait()
        //Clicking on OK button
        cy.get(ARCoursesPage.getCheckMarkBtn()).click()
        //Asserting Course Page
        cy.get(ARAddEditCategoryPage.getReportPageTitle()).should("have.text", "Courses")


    })

})
