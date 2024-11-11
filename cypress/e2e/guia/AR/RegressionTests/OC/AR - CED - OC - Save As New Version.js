import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARAddThirdPartyLessonModal from "../../../../../../helpers/AR/pageObjects/Modals/ARAddThirdPartyLessonModal"
import ARCourseActivityReportPage from "../../../../../../helpers/AR/pageObjects/Reports/ARCourseActivityReportPage"
import { commonDetails } from "../../../../../../helpers/TestData/Courses/commonDetails"
import { ocDetails } from "../../../../../../helpers/TestData/Courses/oc"
import { users } from "../../../../../../helpers/TestData/users/users"

describe('C916 - Save As New Version', () => {
    beforeEach(() => {
        cy.apiLoginWithSession(
            users.sysAdmin.admin_sys_01_username,
            users.sysAdmin.admin_sys_01_password,
            "/admin"
        )
    })
    after(function () {
        //Delete Course
        cy.deleteCourse(commonDetails.courseID)
    })
    it('Create Course',()=>{
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Courses'))
        
        cy.createCourse('Online Course')

        //Publish OC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
        ARDashboardPage.getLongWait()
    })
    it('Edit Course', () => {
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Courses'))
        
        cy.editCourse(ocDetails.courseName)

        // "Save As New Version" Action Tool appears on the right hand menu when
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Save as New Version')).should('exist')
        //Check that "Save As New Version" Action Tool is available
        cy.get(ARDashboardPage.getElementByDataNameAttribute('save_as_new_version')).should('exist').click()

        // There is a new "Save as New Version" modal
        cy.get(ARAddThirdPartyLessonModal.getModal()).should('contain', 'Save as New Version')
        //set version number
        cy.get(ARDashboardPage.getElementByNameAttribute('versionNumber')).type('1.0')
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getElementByDataNameAttribute('save-as-new-version')).click({force: true})
        ARDashboardPage.getShortWait()
        //  The appropriate Publish modal is displayed after the Admin clicks the "Save Version" button in the Save As New Version modal
        cy.get(ARDashboardPage.getElementByDataNameAttribute('publish-course-prompt')).should('exist')
        cy.get(ARDashboardPage.getElementByDataNameAttribute('publish-course-prompt')).within(() => {
            cy.get(ARDashboardPage.getElementByDataNameAttribute('cancel')).click()
        })

        // Course Version Number (if any) shows up below all the other Action Tools
        cy.get(ARDashboardPage.getElementByDataNameAttribute('course-version')).should('contain', 'Current Version:')

        //Publish course
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
        ARDashboardPage.getLongWait()
        // Navigate to Course Activity
        cy.visit('admin/onlineCourseActivity')
        ARDashboardPage.getMediumWait()

        ARCourseActivityReportPage.ChooseAddFilter(ocDetails.courseName)
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getElementByTitleAttribute('Display Columns')).click()
        //  The "Course Version Number" and "Course Version Notes" are available
        cy.get(
            ARDashboardPage.getElementByAriaLabelAttribute('Display Columns')
        ).find('span').contains('Course Version').click({ force: true, multiple:true })
        cy.get(
            ARDashboardPage.getElementByAriaLabelAttribute('Display Columns')
        ).find('span').contains('Course Version Notes').click({ force: true })
        
    })

})