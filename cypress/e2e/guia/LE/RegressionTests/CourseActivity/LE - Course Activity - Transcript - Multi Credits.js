import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LESideMenu from '../../../../../../helpers/LE/pageObjects/Menu/LESideMenu'
import LEFilterMenu from '../../../../../../helpers/LE/pageObjects/Menu/LEFilterMenu'
import LEProfilePage from '../../../../../../helpers/LE/pageObjects/User/LEProfilePage'
import LETranscriptPage from '../../../../../../helpers/LE/pageObjects/User/LETranscriptPage'
import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARCourseSettingsCompletionModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCompletion.module'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import ARCourseSettingsEnrollmentRulesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
import arCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import AROCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage'
import ARUserTranscriptPage from '../../../../../../helpers/AR/pageObjects/User/ARUserTranscriptPage'
import { userDetails } from '../../../../../../helpers/TestData/users/UserDetails'
import { users } from '../../../../../../helpers/TestData/users/users'
import { ocDetails } from '../../../../../../helpers/TestData/Courses/oc'
import { commonDetails, credit } from '../../../../../../helpers/TestData/Courses/commonDetails'

describe('LE - Course Activity - Transcript - Multi Credit - Create Course', function(){

    it('Create OC Course with Multi Credit & Publish', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getCoursesReport()
        cy.createCourse('Online Course')

        //Set All Learner Enrollment Rule
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules'),{timeout:10000}).should('have.attr','class').and('include','enabled')
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')

        //Open Completion Section
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Completion')).click()
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Completion'),{timeout:10000}).should('have.attr','class').and('include','enabled')//Wait for toggles to become enabled
        
        //Add Multi Credits
        for (let i = 0; i < credit.credits2.length; i++) {
            cy.get(ARCourseSettingsCompletionModule.getAddCreditBtn()).click()
            cy.get(ARCourseSettingsCompletionModule.getCreditTypeDDown()).eq(i).click()
            cy.get(ARCourseSettingsCompletionModule.getCreditTypeSearchF()).eq(i).type(credit.credits2[i])
            cy.get(ARCourseSettingsCompletionModule.getCreditTypeSearchF()).eq(i).type(`{downArrow}{enter}`)
            cy.get(AROCAddEditPage.getElementByAriaLabelAttribute(ARCourseSettingsCompletionModule.getVariableCreditAmountTxt()))
            .eq(i).clear().type(credit.creditAmounts2[i])
        }
        //Publish OC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36)
        })
        cy.get(arDashboardPage.getToastSuccessMsg(), {timeout: 15000}).should('be.visible')
    })
})

describe('LE - Course Activity - Transcript - Multi Credit', function(){

    before(function() {
        //Create Learner, Login, Go to Catalog & Enroll in Course
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        //Get UserID for Later
        cy.get(LEDashboardPage.getNavProfile()).click()  
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
        cy.url().then((currentURL) => {
            userDetails.userID = currentURL.slice(-36);
        })
        cy.visit('/#/catalog')
        LEFilterMenu.getSearchAndEnrollInCourseByName(ocDetails.courseName)
    })

    after(function() {
        //Cleanup - Delete Course and User
        cy.deleteCourse(commonDetails.courseID)
        cy.deleteUser(userDetails.userID)
    })

    it('Verify AR User Transcript', () => {
        //Login as Admin, Filter for User and View Transcript
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARUserTranscriptPage.getUserTranscriptPage(userDetails.userID) //Go to User Transcript

        //Verify Credits Section
        for (let i = 0; i < credit.credits2.length; i++) {
            cy.get(ARUserTranscriptPage.getCreditTypeName()).contains(credit.credits2[i]).parents(ARUserTranscriptPage.getCreditItemContainer())
                .within(() => { //Verify Credit Amount Matches Credit Type
                    cy.get(ARUserTranscriptPage.getCreditAmount()).should('contain', credit.creditAmounts2[i])
                })
        }

        //Verify Total Credits in Course Enrollment
        cy.get(ARUserTranscriptPage.getCourseNameCol()).contains(ocDetails.courseName).parents(ARUserTranscriptPage.getCourseContainer()).within(() => {
            cy.get(arDashboardPage.getElementByDataNameAttribute(ARUserTranscriptPage.getCreditsCol())).should('contain', credit.totalCredit)
        })
    })

    it('Verify LE Transcript', () => {
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('Transcript') 

        //Verify Multi Credit Items in Credit Section
        for (let i = 0; i < credit.credits2.length; i++) {
            cy.get(LETranscriptPage.getCreditTotal()).contains(credit.creditAmounts2[i]).parent().should('contain', credit.credits2[i])
        }

        //Verify Multi Credits in Course List
        cy.get(LETranscriptPage.getCourseTitleCol()).contains(ocDetails.courseName).parents(LETranscriptPage.getCourseContainer()).within(() => {
            cy.get(LETranscriptPage.getCreditsCol()).eq(1).within(() => {
                for (let i = 0; i < credit.credits2.length; i++) {
                    cy.get(LETranscriptPage.getCreditItem()).should('contain', credit.creditAmounts2[i]).and('contain', credit.credits2[i])
                }
            })
        })
    })
})