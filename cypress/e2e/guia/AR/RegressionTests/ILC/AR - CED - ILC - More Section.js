// import users from '../../../../../fixtures/users.json'
import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARCourseSettingsMoreModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsMore.module'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import arCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import ARILCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage'
import arPublishModal from '../../../../../../helpers/AR/pageObjects/Modals/ARPublishModal'
import { ilcDetails } from '../../../../../../helpers/TestData/Courses/ilc'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../helpers/TestData/users/users'


describe('AR - Regress - CED - ILC - More Section', function(){

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        
    })

    after(function() {
        //Delete Course
        cy.deleteCourse(commonDetails.courseID, 'instructor-led-courses-new')
    })

    it('Verify More Section Fields, Publish ILC Course', () => {
        cy.createCourse('Instructor Led')

        //Open More Section
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('More')).click()
        ARILCAddEditPage.getShortWait()

        //Enter Text into the Notes Field
        cy.get(ARCourseSettingsMoreModule.getNotesTxtF()).type('This is used for GUIA Regression Testing')

        //Publish ILC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
    })

    it('Edit ILC Course & Verify More Section Fields Have Been Persisted', () => {
        //Filter for Course & Edit it
        cy.editCourse(ilcDetails.courseName)
        ARILCAddEditPage.getMediumWait()
        
        //Open More Section
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('More')).click()
        ARILCAddEditPage.getShortWait()

        //Assert Notes Field Value
        cy.get(ARCourseSettingsMoreModule.getNotesTxtF()).should('have.value', 'This is used for GUIA Regression Testing')
    })
})