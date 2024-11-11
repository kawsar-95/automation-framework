import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARCourseSettingsMoreModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsMore.module'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import arCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import AROCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage'
import { ocDetails, moreSection } from '../../../../../../helpers/TestData/Courses/oc'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../helpers/TestData/users/users'


describe('AR - Regress - CED - OC - More Section - Create Course', function(){

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        
    })

    it('Verify More Section Fields, Publish OC Course', () => {
        cy.createCourse('Online Course')

        //Open More Section
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('More')).click()
        AROCAddEditPage.getShortWait()

        //Hide the More Section
        cy.get(arAddMoreCourseSettingsModule.getCollapseCourseSettingByNameBtn('More')).click()

        //Re-Open the More Section
        cy.get(arAddMoreCourseSettingsModule.getExpandCourseSettingByNameBtn('More')).click()

        //Enter >10,000 Chars into the Notes Field
        cy.get(ARCourseSettingsMoreModule.getNotesTxtF()).invoke('val', moreSection.ocNotes).type('a')

        //Hide the More Section
        cy.get(arAddMoreCourseSettingsModule.getCollapseCourseSettingByNameBtn('More')).click()

        //Re-Open the More Section, Verify Notes Text Still Exists
        cy.get(arAddMoreCourseSettingsModule.getExpandCourseSettingByNameBtn('More')).click()
        cy.get(ARCourseSettingsMoreModule.getNotesTxtF()).should('have.value', moreSection.ocNotes + 'a')

        //Publish OC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
    })
})

describe('AR - Regress - CED - OC - More Section', function(){

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        
        //Filter for Course & Edit it
        cy.editCourse(ocDetails.courseName)
        AROCAddEditPage.getMediumWait()
        //Open More Section
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('More')).click()
        AROCAddEditPage.getShortWait()
    })

    after(function() {
        //Delete Course
        cy.deleteCourse(commonDetails.courseID)
    })

    it('Edit OC Course & Verify More Section Fields Have Been Persisted, Edit Notes', () => {
        //Assert Notes Field Value
        cy.get(ARCourseSettingsMoreModule.getNotesTxtF()).should('have.value', moreSection.ocNotes + 'a')
        //Edit Notes Field Value
        cy.get(ARCourseSettingsMoreModule.getNotesTxtF()).clear().type(moreSection.ocNotesEdited)

        //Publish OC
        cy.publishCourse()
    })

    it('Edit OC Course & Verify Notes Change has Been Persisted', () => {
        //Assert Notes Field Value
        cy.get(ARCourseSettingsMoreModule.getNotesTxtF()).should('have.value', moreSection.ocNotesEdited)
    })
})