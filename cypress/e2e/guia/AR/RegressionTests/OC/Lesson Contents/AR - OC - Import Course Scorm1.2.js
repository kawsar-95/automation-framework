import ARCoursesPage from "../../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage"
import ARDashboardPage from "../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import AROCAddEditPage from "../../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage"
import ARDeleteModal from "../../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal"
import ARSelectLearningObjectModal from "../../../../../../../helpers/AR/pageObjects/Modals/ARSelectLearningObjectModal"
import ARCBAddEditPage from "../../../../../../../helpers/AR/pageObjects/Courses/CB/ARCBAddEditPage"
import ARUploadFileModal from "../../../../../../../helpers/AR/pageObjects/Modals/ARUploadFileModal"
import { lessons, resourcePaths } from "../../../../../../../helpers/TestData/resources/resources"
import { users } from "../../../../../../../helpers/TestData/users/users"


describe("C785 AR - OC - Import Course Scorm1.2", function () {

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, "/admin")
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Courses'))
        
        ARDashboardPage.getMediumWait()
    })



    it("Import Course - SCORM 1.2", () => {
        //Click on import Courses
        cy.get(ARCoursesPage.getCoursesActionsButtonsByLabel("Import Course")).click()
        ARCoursesPage.getShortWait()

        //Selecting SCORM 1.2
        ARSelectLearningObjectModal.getObjectTypeByName('SCORM 1.2')

        //Uploading SCORM 1.2 type zip file
        cy.get(ARUploadFileModal.getChooseFileBtn()).contains('Choose File').click()
        cy.get(ARUploadFileModal.getFilePathTxt()).attachFile(resourcePaths.resource_lessons_folder + lessons.turtles_scorm12_filename)
        ARCoursesPage.getMediumWait()

        //Clicking on Import Button
        cy.get(ARCoursesPage.getElementByDataNameAttribute("import")).click()
        ARCoursesPage.getVLongWait()

    })


    it("Verify Import Course - SCORM 1.2 Uploaded Successfully", () => {
        //Filter Course Name
        cy.wrap(ARCoursesPage.AddFilter('Name', 'Contains', lessons.turtles_scorm12_filename.replace(/(\.[^/.]+)+$/, "")))
        ARCoursesPage.getShortWait()
        cy.get(ARCoursesPage.getTableCellName(2)).contains(lessons.turtles_scorm12_filename.replace(/(\.[^/.]+)+$/, "")).click()
        cy.wrap(ARCoursesPage.WaitForElementStateToChange(ARCoursesPage.getAddEditMenuActionsByName('Edit'), 1000))

        //Asserting Course Uploaded Successfully
        cy.get(ARCoursesPage.getAddEditMenuActionsByName('Edit')).should('have.attr', 'aria-disabled', 'false')

        //Asserting when imported course is selected 'Import Course' is hidden
        cy.get(ARCoursesPage.getCoursesActionsButtonsByLabel("Import Course")).should('not.exist')

        //Click on Edit Button to edit the imported course 
        cy.get(ARCoursesPage.getAddEditMenuActionsByName('Edit')).click()
        ARCoursesPage.getMediumWait()

        //Asserting imported course is private
        cy.get(ARCBAddEditPage.getCouseGeneralHeader()+ ' ' +ARCBAddEditPage.getHeaderLabel()).should('have.text','General')
        cy.get(ARCBAddEditPage.getGeneralStatusToggleContainer() + ARCBAddEditPage.getToggleDisabled()).should('have.text', "Inactive")

        //Asserting imported course name exists under chapter
        cy.get(AROCAddEditPage.getLearningObjectName()).should('contain', lessons.turtles_scorm12_filename.replace(/(\.[^/.]+)+$/, ""))


    })


    it("Delete the Imported Course", () => {
        //Filter Course Name
        cy.wrap(ARCoursesPage.AddFilter('Name', 'Contains', lessons.turtles_scorm12_filename.replace(/(\.[^/.]+)+$/, "")))
        ARCoursesPage.getShortWait()
        cy.get(ARCoursesPage.getTableCellName(2)).contains(lessons.turtles_scorm12_filename.replace(/(\.[^/.]+)+$/, "")).click()
        cy.wrap(ARCoursesPage.WaitForElementStateToChange(ARCoursesPage.getAddEditMenuActionsByName('Edit'), 1000))

        //Asserting Delete Button is Enabled
        cy.get(ARCoursesPage.getAddEditMenuActionsByName('Delete')).should('have.attr', 'aria-disabled', 'false')

        //Now Delete the Imported Course
        cy.get(ARCoursesPage.getAddEditMenuActionsByName('Delete')).click()

        //Click on Delete button
        cy.get(ARDeleteModal.getElementByDataNameAttribute('delete-course-prompt')).within(() => {
            cy.get(ARDeleteModal.getElementByDataNameAttribute('confirm')).click()

        })

    })


})
