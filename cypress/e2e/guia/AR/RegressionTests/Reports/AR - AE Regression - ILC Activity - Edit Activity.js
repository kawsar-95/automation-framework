import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../helpers/TestData/users/users'
import ARILCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage'
import { ilcDetails } from '../../../../../../helpers/TestData/Courses/ilc'
import ARCourseSettingsEnrollmentRulesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
import LESideMenu from '../../../../../../helpers/LE/pageObjects/Menu/LESideMenu'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LEFilterMenu from '../../../../../../helpers/LE/pageObjects/Menu/LEFilterMenu'
import LECatalogPage from '../../../../../../helpers/LE/pageObjects/Catalog/LECatalogPage'
import ARILCActivityReportPage from '../../../../../../helpers/AR/pageObjects/Reports/ARILCActivityReportPage'
import AREditActivityPage from '../../../../../../helpers/AR/pageObjects/Enrollment/AREditActivityPage'
import ARILCEditActivityPage from '../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCEditActivityPage'
import { reports } from '../../../../../../helpers/TestData/Reports/reports'

describe('C7266, AR - AE Regression - ILC Activity - Edit Activity', function(){
    before('Create ILC with Course Upload and Sessions', () => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        
        
        // Create ILC course
        cy.createCourse('Instructor Led', ilcDetails.courseName, false)

        //Open Enrollment Rules
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBannerBtn('Enrollment Rules')).click()
        ARILCAddEditPage.getShortWait()

        //Select Allow Self Enrollment Specific Radio Button
        cy.get(ARCourseSettingsEnrollmentRulesModule.getRadioBtnContainer()).contains('All Learners').click()

        //Add a session and open enrollment section
        ARILCAddEditPage.getAddSession(ilcDetails.sessionName, ARILCAddEditPage.getFutureDate(2))
        cy.get(ARILCAddEditPage.getSessionDetailsDescriptionTxtF()).type(`${ilcDetails.sessionDescription}`)
              
        cy.get(ARILCAddEditPage.getElementByAriaLabelAttribute(ARILCAddEditPage.getExpandEnrollmentRulesBtn())).click()
        cy.get(ARILCAddEditPage.getAllowSelfEnrollmentRadioBtn()).contains('All Learners').click()
        
        // Save Session
        cy.get(ARILCAddEditPage.getAddEditSessionSaveBtn()).click()
        cy.intercept('**/sessions/report').as(`getSession`).wait(`@getSession`)  
        ARILCAddEditPage.getMediumWait()

        //Publish ILC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
    })
    
    after('Delete Created Course', function() {
        cy.deleteCourse(commonDetails.courseID, 'instructor-led-courses-new')
    })

    it('Login as Learner and Enroll Course', () => {
        cy.apiLoginWithSession(users.learner01.learner_01_username, users.learner01.learner_01_password)
        arDashboardPage.getMediumWait()

        // / Navigate to Catalog
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('Catalog')
        arDashboardPage.getMediumWait()
        LEFilterMenu.SearchForCourseByName(ilcDetails.courseName);
        arDashboardPage.getLongWait()

        // enroll course
        cy.get(LECatalogPage.getElementByTitleAttribute(ilcDetails.courseName)).should('exist')
        LEDashboardPage.getCourseCardBtnThenClick(ilcDetails.courseName)
        arDashboardPage.getMediumWait()

        // enroll session
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(`Enroll ${ilcDetails.sessionName}`)).contains('Enroll').click()
        arDashboardPage.getMediumWait()
    })

    it('Make Changes to the Edit Activity Page', () => {
        // Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Reports'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('ILC Activity'))
        arDashboardPage.getMediumWait()
        cy.get(arDashboardPage.getPageHeaderTitle()).should('have.text', 'ILC Activity')

        // Choose Course In ILC Activity 
        ARILCActivityReportPage.courseFilter(ilcDetails.courseName)
        arDashboardPage.getMediumWait()
    
        // Filter User name 
        arDashboardPage.AddFilter('Username', 'Starts With', users.learner01.learner_01_username)

        // Select Session
        arDashboardPage.selectA5TableCellRecord(ilcDetails.sessionName)
        arDashboardPage.getMediumWait()

        // Navigate to Mark Attendence
        cy.get(arDashboardPage.getAddEditMenuActionsByName('Edit Activity')).click()
        arDashboardPage.getMediumWait()
        cy.get(arDashboardPage.getPageHeaderTitle()).should('have.text', 'Edit Activity')

        // Mark ILC Activity as Complete 
        // cy.get(ARILCAddEditPage.getElementByDataNameAttribute(ARILCEditActivityPage.getUsernameF())).should('contain',  users.learner01.learner_01_username) 
        cy.get(ARILCEditActivityPage.getMarkAsRadioBtn()).contains(/^Completed$/).click().click() //Do regex for exact text match here

        //Enter score in score section
        cy.get(AREditActivityPage.getScoreEnrollmentTxtF()).clear().type(reports.score)

        cy.get(arDashboardPage.getSaveBtn()).click()
        arDashboardPage.getMediumWait()


        // Changes are saved successfully and admin user gets redirected to the ILC Activity page
        cy.get(arDashboardPage.getPageHeaderTitle()).should('have.text', 'ILC Activity')
    })
})