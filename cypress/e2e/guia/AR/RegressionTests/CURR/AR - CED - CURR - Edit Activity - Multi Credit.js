import users from '../../../../../fixtures/users.json'
import DefaultTestData from '../../../../../fixtures/defaultTestData.json'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LECoursesPage from '../../../../../../helpers/LE/pageObjects/Courses/LECoursesPage'
import LESideMenu from '../../../../../../helpers/LE/pageObjects/Menu/LESideMenu'
import LEProfilePage from '../../../../../../helpers/LE/pageObjects/User/LEProfilePage'
import LETranscriptPage from '../../../../../../helpers/LE/pageObjects/User/LETranscriptPage'
import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARCourseSettingsCompletionModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCompletion.module'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import arCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import ARSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import ARCURRAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/CURR/ARCURRAddEditPage'
import arEnrollUsersPage from '../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage'
import ARCURREditActivityPage from '../../../../../../helpers/AR/pageObjects/Courses/CURR/ARCURREditActivityPage'
import { commonDetails, courseExtension, credit } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { currDetails } from '../../../../../../helpers/TestData/Courses/curr'
import { userDetails } from '../../../../../../helpers/TestData/users/UserDetails'
import LEFilterMenu from '../../../../../../helpers/LE/pageObjects/Menu/LEFilterMenu'
import ARDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'

describe('AR - CED - CURR - Edit Activity - Multi Credit - AR Side', function(){

    before(function () {
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
    })

    after(function() {
        cy.deleteCourse(commonDetails.courseID, 'curricula')

        //Cleanup - Delete Course and User
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        cy.get(LEDashboardPage.getNavMenu()).click()

        cy.get(LEDashboardPage.getNavProfile()).click()  
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
        cy.url().then((currentURL) => {
            cy.deleteUser(currentURL.slice(-36))
        })
    })

    it('Create CURR Course with Multi Credit and Publish', () => {
        //Sign into admin side as sys admin
        cy.viewport(1200, 850)
        cy.apiLoginWithSession(users.sysAdmin.ADMIN_SYS_01_USERNAME, users.sysAdmin.ADMIN_SYS_01_PASSWORD, '/admin')

        arCoursesPage.getAddCurricula()
        cy.createCourse('Curriculum')
        cy.get(ARSelectModal.getCancelBtn()).click()
        ARSelectModal.getShortWait()

        //Open Completion Section
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Completion')).click()
        ARCURRAddEditPage.getShortWait() //Wait for toggles to become enabled
        
        //Add Multi Credits
        for (let i = 1; i < credit.credits.length; i++) {
            cy.get(ARCourseSettingsCompletionModule.getAddCreditBtn()).click()
            cy.get(ARCourseSettingsCompletionModule.getCreditTypeDDown()).eq(i-1).click()
            cy.get(ARCourseSettingsCompletionModule.getCreditTypeSearchF()).eq(i-1).clear().type(credit.credits[i])
            arCoursesPage.getShortWait()

            cy.get(ARCourseSettingsCompletionModule.getAllCreditTypeOptionsContainer()).eq(i-1).contains(new RegExp("^" + credit.credits[i] + "$", "g")).click()
            cy.get(ARCURRAddEditPage.getElementByAriaLabelAttribute(ARCourseSettingsCompletionModule.getVariableCreditAmountTxt()))
                .eq(i-1).clear().type(credit.creditAmounts[i-1])
        }

        //Publish Curr
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })

        ARCURRAddEditPage.getMediumWait()
        arEnrollUsersPage.getEnrollUserByCourseAndUsername([currDetails.courseName], [userDetails.username])
    })

    it('View Course Activity Report - Edit Learner Activity', () => {
        //Sign into admin side as sys admin
        cy.viewport(1200, 850)
        cy.apiLoginWithSession(users.sysAdmin.ADMIN_SYS_01_USERNAME, users.sysAdmin.ADMIN_SYS_01_PASSWORD, '/admin')

        arCoursesPage.getCoursesReport()
        cy.wrap(arCoursesPage.AddFilter('Name', 'Contains', currDetails.courseName))
        cy.get(arDashboardPage.getWaitSpinner(), {timeout:10*1000}).should('not.exist')

        cy.get(arCoursesPage.getTableCellName(2)).contains(currDetails.courseName).click()
        cy.wrap(arCoursesPage.WaitForElementStateToChange(arCoursesPage.getAddEditMenuActionsByName('View Activity Report'), 1000))
        cy.get(arCoursesPage.getAddEditMenuActionsByName('View Activity Report')).click()
        cy.intercept('/api/rest/v2/admin/reports/curriculum-activities/operations').as('getActivity').wait('@getActivity')

        //Edit Single Activity
        cy.get(arCoursesPage.getTableCellName(3)).contains(DefaultTestData.USER_LEARNER_FNAME).click()
        cy.wrap(arCoursesPage.WaitForElementStateToChange(arCoursesPage.getAddEditMenuActionsByName('Edit Activity'), 1000))
        cy.get(arCoursesPage.getAddEditMenuActionsByName('Edit Activity')).click()

        //Verify Credit Values can be Edited
        for (let i = 1; i < credit.credits.length; i++) {
            cy.get(ARCURREditActivityPage.getCreditTypesContainer()).contains(credit.credits[i]).parents(ARCURREditActivityPage.getCreditContainer())
                .within(() => {
                    cy.get(ARCURREditActivityPage.getCreditTxtF()).clear().type(credit.newCreditAmounts[i-1])
                })
        }

        //Save Activity
        cy.get(arDashboardPage.getSaveBtn()).click()
        arDashboardPage.getLShortWait()
    })

    it('View Credit Report, Verify Edits Persisted', () => {
        //Sign into admin side as sys admin
        cy.viewport(1200, 850)
        cy.apiLoginWithSession(users.sysAdmin.ADMIN_SYS_01_USERNAME, users.sysAdmin.ADMIN_SYS_01_PASSWORD, '/admin')
        ARDashboardPage.getCreditsReport()
        cy.wrap(arCoursesPage.AddFilter('Course Name', 'Contains', currDetails.courseName))
        cy.get(arDashboardPage.getWaitSpinner(), {timeout:10*1000}).should('not.exist')

        //Verify Each Credit has Correct Updated Value
        for (let i = 1; i < credit.credits.length; i++) {
            cy.get(arCoursesPage.getTableCellRecord()).contains(credit.credits[i]).parent().within(() => {
                cy.get('td').eq(5).should('have.text', credit.newCreditAmounts[i-1])
            })
        }
    })

    it('Verify Updated Credit Values in Course Details', () => {
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)

        //Go to Course Details
        LEDashboardPage.getTileByNameThenClick('My Courses')
        LEDashboardPage.getMediumWait()

        
        LEFilterMenu.SearchForCourseByName(currDetails.courseName)
        LEDashboardPage.getMediumWait()
        
        LEDashboardPage.getCourseCardBtnThenClick(currDetails.courseName)
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
        cy.get(LETranscriptPage.getCourseTitleCol()).contains(currDetails.courseName).parents(LETranscriptPage.getCourseContainer()).within(() => {
            cy.get(LETranscriptPage.getCreditsCol()).eq(1).within(() => {
                for (let i = 1; i < credit.credits.length; i++) {
                    cy.get(LETranscriptPage.getCreditItem()).should('contain', credit.newCreditAmounts[i-1]).and('contain', credit.credits[i])
                }
            })
        })
    })
})