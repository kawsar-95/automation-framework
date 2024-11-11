import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LECoursesPage from '../../../../../../helpers/LE/pageObjects/Courses/LECoursesPage'
import LESideMenu from '../../../../../../helpers/LE/pageObjects/Menu/LESideMenu'
import LEProfilePage from '../../../../../../helpers/LE/pageObjects/User/LEProfilePage'
import LETranscriptPage from '../../../../../../helpers/LE/pageObjects/User/LETranscriptPage'
import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARCourseSettingsCompletionModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCompletion.module'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import arCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import ARILCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage'
import arEnrollUsersPage from '../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage'
import ARILCEditActivityPage from '../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCEditActivityPage'
import { ilcDetails, sessions } from '../../../../../../helpers/TestData/Courses/ilc'
import { commonDetails, credit } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../helpers/TestData/users/users'
import { userDetails } from '../../../../../../helpers/TestData/users/UserDetails'
import LEFilterMenu from '../../../../../../helpers/LE/pageObjects/Menu/LEFilterMenu'


describe('AR - CED - ILC - Edit Activity - Multi Credit - AR Side', function(){
    before(function () {
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
    })

    after(function() {
        //Cleanup - Delete Course and User
        cy.deleteCourse(commonDetails.courseID, 'instructor-led-courses-new')

        //Sign into learner side as new learner
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        cy.get(LEDashboardPage.getNavMenu()).click()

        cy.get(LEDashboardPage.getNavProfile()).click()  
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
        cy.url().then((currentURL) => {
            cy.deleteUser(currentURL.slice(-36))
        })
    })

    it('Create ILC Course & Session with Multi Credit, Publish, and Enroll User', () => {
        //Sign into admin side as sys admin
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')

        arCoursesPage.getAddInstructorLed()
        cy.createCourse('Instructor Led', ilcDetails.creditCourseName)

        //Open Completion Section
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Completion')).click()
        ARILCAddEditPage.getShortWait() //Wait for toggles to become enabled
        
        //Add Multi Credits
        for (let i = 1; i < credit.credits.length; i++) {
            cy.get(ARCourseSettingsCompletionModule.getAddCreditBtn()).click()
            cy.get(ARCourseSettingsCompletionModule.getCreditTypeDDown()).eq(i-1).click()
            cy.get(ARCourseSettingsCompletionModule.getCreditTypeSearchF()).eq(i-1).clear().type(credit.credits[i])
            arCoursesPage.getShortWait()

            cy.get(ARCourseSettingsCompletionModule.getAllCreditTypeOptionsContainer()).eq(i-1).contains(new RegExp("^" + credit.credits[i] + "$", "g")).click()
            cy.get(ARILCAddEditPage.getElementByAriaLabelAttribute(ARCourseSettingsCompletionModule.getVariableCreditAmountTxt()))
                .eq(i-1).clear().type(credit.creditAmounts[i-1])
        }

        //Publish ILC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })

        arCoursesPage.getMediumWait()
        arEnrollUsersPage.getEnrollUserByCourseAndUsername([ilcDetails.creditCourseName], [userDetails.username], ilcDetails.sessionName)
    })

    it('View Course Enrollments - Edit Learner Enrollment', () => {
        //Sign into admin side as sys admin
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')

        arCoursesPage.getCoursesReport()
        //Filter for Course 
        cy.wrap(arCoursesPage.AddFilter('Name', 'Contains', ilcDetails.creditCourseName))
        arCoursesPage.getMediumWait()

        cy.get(arCoursesPage.getTableCellName(2)).contains(ilcDetails.creditCourseName).click()
        cy.wrap(arCoursesPage.WaitForElementStateToChange(arCoursesPage.getAddEditMenuActionsByName('Course Enrollments'), 1000))
        cy.get(arCoursesPage.getAddEditMenuActionsByName('Course Enrollments')).click()
        cy.intercept('/api/rest/v2/admin/reports/course-enrollments/operations').as('getEnrollments').wait('@getEnrollments')

        //Add Filter and Edit Learner Enrollment
        cy.get(arCoursesPage.getTableCellName(4)).contains(userDetails.username).click()
        cy.wrap(arCoursesPage.WaitForElementStateToChange(arCoursesPage.getAddEditMenuActionsByName('Edit Enrollment'), 1000))
        cy.get(arCoursesPage.getAddEditMenuActionsByName('Edit Enrollment')).click()
        arDashboardPage.getLongWait()

        //Mark ILC Activity as Complete 
        cy.get(ARILCAddEditPage.getElementByDataNameAttribute(ARILCEditActivityPage.getUsernameF())).should('contain', userDetails.username) 
        cy.get(ARILCEditActivityPage.getMarkAsRadioBtn()).contains(/^Completed$/).click().click() //Do regex for exact text match here
        arDashboardPage.getLShortWait()

        cy.get(ARILCEditActivityPage.getMarkAsCompleteRadioBtn()).should('have.attr', 'aria-checked', 'true')

        //Verify Credit Values can be Edited
        for (let i = 1; i < credit.credits.length; i++) {
            cy.get(ARILCEditActivityPage.getCreditTypesContainer()).contains(credit.credits[i]).parents(ARILCEditActivityPage.getCreditContainer())
                .within(() => {
                    cy.get(ARILCEditActivityPage.getCreditTxtF()).clear().type(credit.newCreditAmounts[i-1])
                })
        }

        //Mark Session Attendance as Present
        cy.get(ARILCEditActivityPage.getAttendanceToggleContainer()).click()
        cy.get(ARILCEditActivityPage.getAttendanceToggleContainer()).invoke('attr', 'title').then((value) => {
            expect(value).to.include('Present')
        })

        //Save Activity
        cy.get(arDashboardPage.getSaveBtn()).click()
        arDashboardPage.getLShortWait()
    })

    it('View Credit Report, Verify Edits Persisted', () => {
        //Sign into admin side as sys admin
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')

        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Reports'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Credits'))
        cy.intercept('/api/rest/v2/admin/reports/credits/operations').as('getCredits').wait('@getCredits')
        cy.wrap(arCoursesPage.AddFilter('Course Name', 'Contains', ilcDetails.creditCourseName))
        cy.get(arDashboardPage.getWaitSpinner()).should('not.exist')
        arDashboardPage.getMediumWait()
        //Verify Each Credit has Correct Updated Value
        for (let i = 1; i < credit.credits.length; i++) {
            cy.get(arCoursesPage.getTableCellRecord()).contains(credit.credits[i]).parent().within(() => {
                cy.get('td').eq(5).should('have.text', credit.newCreditAmounts[i-1])
            })
        }
    })

    it('Verify Updated Credit Values in Course Details', () => {
        //Sign into learner side as new learner
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)

        //Go to Course Details
        LEDashboardPage.getTileByNameThenClick('My Courses')
        LEDashboardPage.getMediumWait()
        LEFilterMenu.SearchForCourseByName(ilcDetails.creditCourseName)
        LEDashboardPage.getMediumWait()
        
        LEDashboardPage.getCourseCardBtnThenClick(ilcDetails.creditCourseName)
        LEDashboardPage.getLongWait()

        //Verify Credit Values in Course Details
        cy.get(LECoursesPage.getTotalCredits()).should('contain', credit.newTotalCredit)
        cy.get(LECoursesPage.getMultiCreditsTable()).find('tr').each(($span) => {
            if ($span.text().slice(0,2) === credit.newCreditAmounts[0]) {
                cy.get('td').contains($span.text().slice(0,2)).parent().within(() => {
                    cy.get('td').contains(credit.credits[1]).should('exist')
                })
            } else {
                cy.get('td').contains($span.text().slice(0,2)).parent().within(() => {
                    cy.get('td').contains(credit.credits[2]).should('exist')
                })
            }
        })
    })

    it('Verify Updated Credit Values in Learner Transcript', () => {
        //Sign into learner side as new learner
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)

        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('Transcript') 

        //Verify Total Credits
        cy.get(LETranscriptPage.getTotalCredits()).should('contain', credit.newTotalCredit)

        //Verify Multi Credit Items in Credit Section
        for (let i = 1; i < credit.credits.length; i++) {
            cy.get(LETranscriptPage.getCreditTotal()).contains(credit.newCreditAmounts[i-1]).parent().should('contain', credit.credits[i])
        }

        //Verify Multi Credits in Course List
        cy.get(LETranscriptPage.getCourseTitleCol()).contains(ilcDetails.creditCourseName).parents(LETranscriptPage.getCourseContainer()).within(() => {
            cy.get(LETranscriptPage.getCreditsCol()).within(() => {
                for (let i = 1; i < credit.credits.length; i++) {
                    cy.get(LETranscriptPage.getCreditItem()).should('contain', credit.newCreditAmounts[i-1]).and('contain', credit.credits[i])
                }
            })
        })
    })
})