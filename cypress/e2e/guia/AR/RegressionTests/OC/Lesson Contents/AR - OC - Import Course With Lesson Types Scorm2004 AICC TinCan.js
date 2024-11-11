import ARCoursesPage from "../../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage"
import ARDashboardPage from "../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARDeleteModal from "../../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal"
import ARSelectLearningObjectModal from "../../../../../../../helpers/AR/pageObjects/Modals/ARSelectLearningObjectModal"
import ARUploadFileModal from "../../../../../../../helpers/AR/pageObjects/Modals/ARUploadFileModal"
import { lessons, resourcePaths } from "../../../../../../../helpers/TestData/resources/resources"
import { users } from "../../../../../../../helpers/TestData/users/users"


describe("C985 AR - OC - Import Course With Lesson Types Scorm2004 AICC TinCan", function () {

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, "/admin")
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Courses'))
        
        ARDashboardPage.getMediumWait()
    })

    //Selecting Scorm 2004 but uploading Scorm 1.2 type file
    it("Import Course - File Type Does not Match", () => {
        //Click on import Courses
        cy.get(ARCoursesPage.getCoursesActionsButtonsByLabel("Import Course")).click()
        ARCoursesPage.getShortWait()

        //Selecting SCORM 2004
        ARSelectLearningObjectModal.getObjectTypeByName('SCORM 2004')

        //Uploading Scorm1.2 Type Lesson Zip file in the Upload modal, file type different it should be scorm 2004 type zip file
        cy.get(ARUploadFileModal.getChooseFileBtn()).contains('Choose File').click()
        cy.get(ARUploadFileModal.getFilePathTxt()).attachFile(resourcePaths.resource_lessons_folder + lessons.turtles_scorm12_filename)
        ARCoursesPage.getMediumWait()

        //Clicking on Import Button
        cy.get(ARCoursesPage.getElementByDataNameAttribute("import")).click()
        ARCoursesPage.getLongWait()

    })

    it("Import Course - Failed Because File Type Does not Match", () => {

        cy.wrap(ARCoursesPage.AddFilter('Name', 'Contains', lessons.turtles_scorm12_filename.replace(/(\.[^/.]+)+$/, "")))
        ARCoursesPage.getMediumWait()

        //Asserting course import failed because file type didn't match
        cy.get(ARCoursesPage.getNoResultMsg()).should('have.text', 'No results found.')

    })


    it("Import Course - SCORM 2004", () => {
        //Click on import Courses
        cy.get(ARCoursesPage.getCoursesActionsButtonsByLabel("Import Course")).click()
        ARCoursesPage.getShortWait()

        //Selecting SCORM 2004
        ARSelectLearningObjectModal.getObjectTypeByName('SCORM 2004')

        //Uploading SCORM 2004 type zip file
        cy.get(ARUploadFileModal.getChooseFileBtn()).contains('Choose File').click()
        cy.get(ARUploadFileModal.getFilePathTxt()).attachFile(resourcePaths.resource_lessons_folder + lessons.sample_mc_scorm2004_filename)
        ARCoursesPage.getMediumWait()

        //Clicking on Import Button
        cy.get(ARCoursesPage.getElementByDataNameAttribute("import")).click()
        ARCoursesPage.getVLongWait()

    })


    it("Verify Import Course - SCORM 2004 Uploaded Successfully and Delete the Course", () => {
        //Filter Course Name
        cy.wrap(ARCoursesPage.AddFilter('Name', 'Contains', lessons.sample_mc_scorm2004_filename.replace(/(\.[^/.]+)+$/, "")))
        ARCoursesPage.getShortWait()
        cy.get(ARCoursesPage.getTableCellName(2)).contains(lessons.sample_mc_scorm2004_filename.replace(/(\.[^/.]+)+$/, "")).click()
        cy.wrap(ARCoursesPage.WaitForElementStateToChange(ARCoursesPage.getAddEditMenuActionsByName('Edit'), 1000))

        //Asserting Course Uploaded Successfully
        cy.get(ARCoursesPage.getAddEditMenuActionsByName('Edit')).should('have.attr', 'aria-disabled', 'false')

        //Now Delete the Imported Course
        cy.get(ARCoursesPage.getElementByDataNameAttribute('delete-course-context-button')).click()

        //Click on Delete button
        cy.get(ARDeleteModal.getElementByDataNameAttribute('delete-course-prompt')).within(() => {
            cy.get(ARDeleteModal.getElementByDataNameAttribute('confirm')).click()

        })

    })

    it("Import Course - AICC", () => {
        //Click on import Courses
        cy.get(ARCoursesPage.getCoursesActionsButtonsByLabel("Import Course")).click()
        ARCoursesPage.getShortWait()

        //Selecting AICC
        ARSelectLearningObjectModal.getObjectTypeByName('AICC')

        //Uploading AICC type zip file
        cy.get(ARUploadFileModal.getChooseFileBtn()).contains('Choose File').click()
        cy.get(ARUploadFileModal.getFilePathTxt()).attachFile(resourcePaths.resource_lessons_folder + lessons.aicc_bunnies_filename)
        ARCoursesPage.getMediumWait()

        //Clicking on Import Button
        cy.get(ARCoursesPage.getElementByDataNameAttribute("import")).click()
        ARCoursesPage.getVLongWait()

    })


    it("Verify Import Course - AICC Uploaded Successfully and Delete the Course", () => {
        //Filter Course Name
        cy.wrap(ARCoursesPage.AddFilter('Name', 'Contains', 'Adobe Captivate'))
        ARCoursesPage.getShortWait()
        cy.get(ARCoursesPage.getTableCellName(2)).contains('Adobe Captivate').click()
        cy.wrap(ARCoursesPage.WaitForElementStateToChange(ARCoursesPage.getAddEditMenuActionsByName('Edit'), 1000))

        //Asserting Course Uploaded Successfully
        cy.get(ARCoursesPage.getAddEditMenuActionsByName('Edit')).should('have.attr', 'aria-disabled', 'false')

        //Now Delete the Imported Course
        cy.get(ARCoursesPage.getElementByDataNameAttribute('delete-course-context-button')).click()

        //Click on Delete button
        cy.get(ARDeleteModal.getElementByDataNameAttribute('delete-course-prompt')).within(() => {
            cy.get(ARDeleteModal.getElementByDataNameAttribute('confirm')).click()

        })

    })

    it("Import Course - TinCan", () => {
        //Click on import Courses
        cy.get(ARCoursesPage.getCoursesActionsButtonsByLabel("Import Course")).click()
        ARCoursesPage.getShortWait()

        //Selecting Tin Can
        ARSelectLearningObjectModal.getObjectTypeByName('Tin Can')

        //Uploading Tin Can type zip file
        cy.get(ARUploadFileModal.getChooseFileBtn()).contains('Choose File').click()
        cy.get(ARUploadFileModal.getFilePathTxt()).attachFile(resourcePaths.resource_lessons_folder + lessons.tincan_quiz_filename)
        ARCoursesPage.getMediumWait()

        //Clicking on Import Button
        cy.get(ARCoursesPage.getElementByDataNameAttribute("import")).click()
        ARCoursesPage.getVLongWait()

    })


    it("Verify Import Course - Tin Can Uploaded Successfully and Delete the Course", () => {
        //Filter Course Name
        cy.wrap(ARCoursesPage.AddFilter('Name', 'Contains', lessons.tincan_quiz_filename.replace(/(\.[^/.]+)+$/, "")))
        ARCoursesPage.getShortWait()
        cy.get(ARCoursesPage.getTableCellName(2)).contains(lessons.tincan_quiz_filename.replace(/(\.[^/.]+)+$/, "")).click()
        cy.wrap(ARCoursesPage.WaitForElementStateToChange(ARCoursesPage.getAddEditMenuActionsByName('Edit'), 1000))

        //Asserting Course Uploaded Successfully
        cy.get(ARCoursesPage.getAddEditMenuActionsByName('Edit')).should('have.attr', 'aria-disabled', 'false')

        //Now Delete the Imported Course
        cy.get(ARCoursesPage.getElementByDataNameAttribute('delete-course-context-button')).click()

        //Click on Delete button
        cy.get(ARDeleteModal.getElementByDataNameAttribute('delete-course-prompt')).within(() => {
            cy.get(ARDeleteModal.getElementByDataNameAttribute('confirm')).click()

        })

    })


})
