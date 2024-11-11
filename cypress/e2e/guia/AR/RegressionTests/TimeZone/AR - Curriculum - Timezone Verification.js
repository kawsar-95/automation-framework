import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import arCourseSettingsAvailabilityModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsAvailability.module'
import arCourseSettingsCompletionModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCompletion.module'
import arCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arDashboardAccountMenu from '../../../../../../helpers/AR/pageObjects/Menu/ARDashboardAccount.menu'
import arOCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage'
import { courses } from '../../../../../../helpers/TestData/Courses/courses'
import { users } from '../../../../../../helpers/TestData/users/users'
import { reports } from '../../../../../../helpers/TestData/Reports/reports'



describe('AR - Curriculum - Timezone Verification', function () {

    after(function () {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByDataNameAttribute(arDashboardPage.getAccountBtn())).click()
        cy.get(arDashboardAccountMenu.getElementByDataName(arDashboardAccountMenu.getTimezoneContainer())).within(()=>{
        cy.get(arDashboardAccountMenu.getDDown()).scrollIntoView().click()
        arDashboardPage.getVShortWait()
        cy.get(arDashboardAccountMenu.getDDownSearchTxtF()).click()
        cy.get(arDashboardAccountMenu.getDDownSearchTxtF()).type('Mountain')
        cy.get(arDashboardAccountMenu.getDDownOpt()).contains('Mountain').click()
        })
    })


    it('should allow admin user to set a timezone in LMS', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        //cy.get(arDashboardPage.getSysAdminDashboardPageTitle()).should('have.text', arDashboardPage.getSysAdminDashboardPageTitleTxt())
        cy.get(arDashboardPage.getElementByDataNameAttribute(arDashboardPage.getAccountBtn())).click()
        cy.get(arDashboardAccountMenu.getElementByDataName(arDashboardAccountMenu.getTimezoneContainer())).within(()=>{
        cy.get(arDashboardAccountMenu.getDDown()).scrollIntoView().click()
        arDashboardPage.getVShortWait()
        cy.get(arDashboardAccountMenu.getDDownSearchTxtF()).click()
        cy.get(arDashboardAccountMenu.getDDownSearchTxtF()).type('Alaska')
        cy.get(arDashboardAccountMenu.getDDownOpt()).contains('Alaska').click()
        })
    })


    describe('Timezone Verification', function () {

        beforeEach(function () {
            // Sign in with System Admin account
            cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
            //cy.get(arDashboardPage.getSysAdminDashboardPageTitle()).should('have.text', arDashboardPage.getSysAdminDashboardPageTitleTxt())
            cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
            cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
            
        })

        it('should show correct timezone for completion certificate expiry date section', () => {
            //Filter for Course & Edit it
            arCoursesPage.AddFilter('Name', 'Contains', courses.curr_filter_01_name)
            arDashboardPage.getMediumWait()
            cy.get(arCoursesPage.getTableCellName(2)).contains(courses.curr_filter_01_name).click()
            cy.wrap(arCoursesPage.WaitForElementStateToChange(arCoursesPage.getAddEditMenuActionsByName('Edit'), 1000))
            cy.get(arCoursesPage.getAddEditMenuActionsByName('Edit')).click()
            arOCAddEditPage.getMediumWait()

            //Open Completion Section
            cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Completion')).click()
            arCourseSettingsCompletionModule.getMediumWait()
            arCourseSettingsCompletionModule.getToggleByNameThenClick('Certificate')
            cy.get(arCourseSettingsCompletionModule.getExpiryRadioBtn()).contains(/^Date$/).click()

            // Verify that correct timezone is displayed
            cy.get(arCourseSettingsCompletionModule.getElementByDataNameAttribute(arCourseSettingsCompletionModule.getTimeZoneMsg())).should('have.text', reports.timezoneName)
        })

        it('shows correct timezone for Curriculum access, expiration and due date', () => {
            //Filter for Course & Edit it
            arCoursesPage.AddFilter('Name', 'Contains', courses.curr_filter_01_name)
            arDashboardPage.getMediumWait()
            cy.get(arCoursesPage.getTableCellName(2)).contains(courses.curr_filter_01_name).click()
            cy.wrap(arCoursesPage.WaitForElementStateToChange(arCoursesPage.getAddEditMenuActionsByName('Edit'), 1000))
            cy.get(arCoursesPage.getAddEditMenuActionsByName('Edit')).click()
            arOCAddEditPage.getMediumWait()

            //Open Availability Section
            cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Availability')).click()
            arOCAddEditPage.getShortWait() //Wait

            // Verify that correct timezone is displayed
            cy.get(arCourseSettingsAvailabilityModule.getAccessDateRadioBtn()).contains(/^Date$/).click()
            cy.get(arCourseSettingsAvailabilityModule.getAccessDateTimeZoneText()).should('have.text', reports.timezoneName)
            cy.get(arCourseSettingsAvailabilityModule.getExpirationRadioBtn()).contains(/^Date$/).click()
            cy.get(arCourseSettingsAvailabilityModule.getExpirationTimeZoneText()).should('have.text', reports.timezoneName)
            cy.get(arCourseSettingsAvailabilityModule.getDueDateRadioBtn()).contains(/^Date$/).click()
            cy.get(arCourseSettingsAvailabilityModule.getDueDateTimeZoneText()).should('have.text', reports.timezoneName)
        })
    })

})