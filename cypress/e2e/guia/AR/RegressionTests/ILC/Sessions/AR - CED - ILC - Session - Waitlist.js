import arDashboardPage from '../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arCoursesPage from '../../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import ARILCAddEditPage from '../../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage'
import AREnrollUsersPage from '../../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage'
import arAddMoreCourseSettingsModule from '../../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import ARCourseSettingsEnrollmentRulesModule from '../../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
import LEDashboardPage from '../../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LECourseDetailsILCModule from '../../../../../../../helpers/LE/pageObjects/Courses/LECourseDetailsILCModule'
import LESelectILCSession from '../../../../../../../helpers/LE/pageObjects/Modals/LESelectILCSession.modal'
import LEFilterMenu from '../../../../../../../helpers/LE/pageObjects/Menu/LEFilterMenu'
import LEProfilePage from '../../../../../../../helpers/LE/pageObjects/User/LEProfilePage'
import { ilcDetails, sessions } from '../../../../../../../helpers/TestData/Courses/ilc'
import { commonDetails } from '../../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../../helpers/TestData/users/users'
import { userDetails } from '../../../../../../../helpers/TestData/users/UserDetails'

describe('AR - CED - ILC - Sessions - Waitlist', function(){

    before(function() {
        //Create a new user
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
    })

    after(function() {
        cy.deleteCourse(commonDetails.courseID, 'instructor-led-courses-new')
        cy.get(LEDashboardPage.getNavProfile()).click()  
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
        cy.url().then((currentURL) => {
            cy.deleteUser(currentURL.slice(-36));
        })
    })

    it('Create ILC with Session of Max Capacity = 1, and Enroll Learner', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        
        cy.createCourse('Instructor Led')

        //Set self enrollment = all learners
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        ARILCAddEditPage.getShortWait()
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')

        //Edit session
        ARILCAddEditPage.getEditSessionByName(ilcDetails.sessionName)
        //Set self enrollment = all learners
        cy.get(arCoursesPage.getElementByAriaLabelAttribute(ARILCAddEditPage.getExpandEnrollmentRulesBtn())).click()
        ARILCAddEditPage.getShortWait()
        cy.get(ARILCAddEditPage.getAllowSelfEnrollmentRadioBtn()).contains('All Learners').click()
        //Set max class size = 1
        cy.get(ARILCAddEditPage.getMaximumClassSizeTxtF()).clear().type('1')
        //Enable Waitlist toggle
        cy.get(ARILCAddEditPage.getEnableWaitlistToggle()).click()
        //Update session name
        cy.get(ARILCAddEditPage.getSessionDetailsTitleTxtF()).should('have.attr', 'aria-invalid', 'false').clear().type(ilcDetails.sessionNameTimeStamp)
        //Save session
        cy.get(ARILCAddEditPage.getAddEditSessionSaveBtn()).click()
        cy.intercept('**/sessions/report').as(`getSession`).wait(`@getSession`)

        //Publish ILC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = (id.request.url.slice(-36));
        })
    })

    it('Enroll Learner in ILC and Session', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        
        AREnrollUsersPage.getEnrollUserByCourseAndUsername([ilcDetails.courseName], [users.learner02.learner_02_username], ilcDetails.sessionNameTimeStamp)
    })

    it('Login to LE, Attempt to Enroll in Full Session, Verify Waitlist Warning', () => {
        //Login and enroll in session
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword) 
        LEDashboardPage.getTileByNameThenClick('Catalog')
        LEFilterMenu.SearchForCourseByName(ilcDetails.courseName)
        LEDashboardPage.getMediumWait()
        cy.get(LEDashboardPage.getCourseCardName()).should('contain', ilcDetails.courseName).click()
        LEDashboardPage.getShortWait()
        LESelectILCSession.getSessionByNameAndAddToCart(ilcDetails.sessionNameTimeStamp)
        LEDashboardPage.getMediumWait()

        //Verify waitlist banner
        cy.get(LECourseDetailsILCModule.getWaitListBanner()).should('contain', LECourseDetailsILCModule.getWaitListMsg())

        //Verify Add to Calender button is disabled
        cy.get(LECourseDetailsILCModule.getAddToCalendarBtnDisabled()).should('contain', 'Add to Calendar')
    })

    it('Verify Learner in Waitlist Report, Edit Session and Increase Max Capacity', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Reports'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Sessions'))
        arDashboardPage.getLShortWait()
        
        //Filter for session and verify number of learners on waitlist = 1
        arDashboardPage.A5AddFilter('Session', 'Contains', ilcDetails.sessionNameTimeStamp)
        arDashboardPage.getShortWait()
        //Add/remove columns from report
        cy.get(arDashboardPage.getDisplayColumns()).click() 
        cy.get(arDashboardPage.getA5ChkBoxLabel()).contains('Learners on Waitlist').click()
        cy.get(arDashboardPage.getDisplayColumns()).click() //Close menu
        //Verify num learners on waitlist
        cy.get(arDashboardPage.getTableCellContentByIndex(12)).invoke('text').then((text) =>{
            expect(text).to.eq('1')
        })

        //Edit course and session, increase max capacity of class
        cy.visit('/admin') //navigate away from A5 page
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        
        cy.editCourse(ilcDetails.courseName)
        ARILCAddEditPage.getMediumWait()
        ARILCAddEditPage.getEditSessionByName(ilcDetails.sessionNameTimeStamp)
        //Set max class size = 2
        cy.get(arCoursesPage.getElementByAriaLabelAttribute(ARILCAddEditPage.getExpandEnrollmentRulesBtn())).click()
        ARILCAddEditPage.getShortWait()
        cy.get(ARILCAddEditPage.getMaximumClassSizeTxtF()).clear().type('2')
        //Save session
        cy.get(ARILCAddEditPage.getAddEditSessionSaveBtn()).click()
        cy.intercept('**/sessions/report').as(`getSession`).wait(`@getSession`)

        //Publish ILC
        cy.publishCourse()
    })

    it('Verify Learner is Now Enrolled in Session', () => {
        //Login and enroll in session
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword) 
        LEDashboardPage.getTileByNameThenClick('My Courses')
        LEDashboardPage.getShortWait()
        cy.get(LEDashboardPage.getCourseCardName()).should('contain', ilcDetails.courseName).click()
        LEDashboardPage.getMediumWait()

        //Verify waitlist banner no longer exists
        cy.get(LECourseDetailsILCModule.getWaitListBanner()).should('not.exist')

        //Verify Add to Calender button is now enabled
        cy.get(LECourseDetailsILCModule.getAddToCalendarBtn()).should('be.visible')
    })
})