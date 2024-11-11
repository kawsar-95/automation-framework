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
import arEnrollUsersPage from '../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage'
import { ocDetails } from '../../../../../../helpers/TestData/Courses/oc'
import { commonDetails, credit } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../helpers/TestData/users/users'
import { userDetails } from '../../../../../../helpers/TestData/users/UserDetails'
import ARILCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage'
import LEFilterMenu from '../../../../../../helpers/LE/pageObjects/Menu/LEFilterMenu'
import ARILCEditActivityPage from '../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCEditActivityPage'
import LECatalogPage from '../../../../../../helpers/LE/pageObjects/Catalog/LECatalogPage'


describe('AR - CED - OC - Edit Activity - Multi Credit - AR Side', function () {

    before(function () {
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        LEDashboardPage.turnOffNextgenToggle()
    })

    after('MT-10722 - delete course and user', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.deleteCourse(commonDetails.courseID)
        //Sign into learner side as new learner
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        cy.get(LEDashboardPage.getNavMenu()).click()

        cy.get(LEDashboardPage.getNavProfile()).click()
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
        cy.url().then((currentURL) => {
            cy.deleteUser(currentURL.slice(-36))
        })
    })

    it('Create OC Course with Multi Credit, Publish, and Enroll User', () => {
        //Sign into admin side as sys admin
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')

        arCoursesPage.getAddOnlineCourse()
        cy.createCourse('Online Course', ocDetails.creditCourseName)
        //Open Completion Section
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Completion')).click()
        //Add Multi Credits
        for (let i = 1; i < credit.credits.length; i++) {
            cy.get(ARCourseSettingsCompletionModule.getAddCreditBtn()).click()
            cy.get(ARCourseSettingsCompletionModule.getCreditTypeDDown()).eq(i - 1).click()
            cy.get(ARCourseSettingsCompletionModule.getCreditTypeSearchF()).eq(i - 1).clear().type(credit.credits[i])

            cy.get(ARCourseSettingsCompletionModule.getAllCreditTypeOptionsContainer(), {timeout: 1000}).eq(i - 1).contains(new RegExp("^" + credit.credits[i] + "$", "g")).click()
            cy.get(ARILCAddEditPage.getElementByAriaLabelAttribute(ARCourseSettingsCompletionModule.getVariableCreditAmountTxt()))
                .eq(i - 1).clear().type(credit.creditAmounts[i - 1])
        }
        //Publish OC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = (id.request.url.slice(-36));
        })

    })
    it('Enroll User', () => {
        //Sign into admin side as sys admin
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        //Enroll Learner
        arCoursesPage.getCoursesReport()
        arEnrollUsersPage.getEnrollUserByCourseAndUsername([ocDetails.creditCourseName], [userDetails.username])
    })

    it('View Course Enrollments - Edit Learner Enrollment', () => {
        //Sign into admin side as sys admin
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')

        arCoursesPage.getCoursesReport()
        //Filter for Course 
        cy.wrap(arCoursesPage.AddFilter('Name', 'Contains', ocDetails.creditCourseName))
        cy.get(arCoursesPage.getGridFilterResultLoader(), {timeout: 5000}).should('not.exist')
        cy.get(arCoursesPage.getTableCellName(2)).contains(ocDetails.creditCourseName).click()
        cy.wrap(arCoursesPage.WaitForElementStateToChange(arCoursesPage.getAddEditMenuActionsByName('Course Enrollments'), 1000))
        cy.get(arCoursesPage.getAddEditMenuActionsByName('Course Enrollments')).click()
        cy.get(arCoursesPage.getPageHeaderTitle(), {timeout: 5000}).should('contain', 'Course Enrollments')
        cy.get(arCoursesPage.getGridFilterResultLoader(), {timeout: 5000}).should('not.exist')

        //Add Filter and Edit Learner Enrollment
        cy.get(arCoursesPage.getTableCellName(4)).contains(userDetails.username).click()
        cy.wrap(arCoursesPage.WaitForElementStateToChange(arCoursesPage.getAddEditMenuActionsByName('Edit Enrollment'), 1000))
        cy.get(arCoursesPage.getAddEditMenuActionsByName('Edit Enrollment')).click()

        //Mark ILC Activity as Complete 
        cy.get(ARILCAddEditPage.getElementByDataNameAttribute(ARILCEditActivityPage.getUsernameF()), {timeout: 7500}).should('contain', userDetails.username)
        cy.get(ARILCEditActivityPage.getMarkAsRadioBtn()).contains(/^Completed$/).click().click() //Do regex for exact text match here

        cy.get(ARILCEditActivityPage.getMarkAsCompleteRadioBtn(), {timeout: 1000}).should('have.attr', 'aria-checked', 'true')

        //Verify Credit Values can be Edited
        for (let i = 1; i < credit.credits.length; i++) {
            cy.get(ARILCEditActivityPage.getCreditTypesContainer()).contains(credit.credits[i]).parents(ARILCEditActivityPage.getCreditContainer())
                .within(() => {
                    cy.get(ARILCEditActivityPage.getCreditTxtF()).clear().type(credit.newCreditAmounts[i - 1])
                })
        }
        //Save Activity
        cy.get(arDashboardPage.getSaveBtn()).click()
    })

    it('View Course Activity Report - Edit Learner Activity', () => {
        //Sign into admin side as sys admin
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arCoursesPage.getCoursesReport()
        //Filter for Course (Edit quickly to store courseID)
        cy.wrap(arCoursesPage.AddFilter('Name', 'Contains', ocDetails.creditCourseName))
        cy.get(arCoursesPage.getGridTable()).eq(0).click({ force: true })

        cy.wrap(arCoursesPage.WaitForElementStateToChange(arCoursesPage.getAddEditMenuActionsByName('Edit'), 1000))
        cy.get(arCoursesPage.getAddEditMenuActionsByName('Edit')).click({ force: true })
        cy.url().should('contain', 'edit').then((currentURL) => {
            commonDetails.courseID = currentURL.slice(-36);
        })
        //Go to Course Activity Report 
        cy.go('back')
        cy.wrap(arCoursesPage.WaitForElementStateToChange(arCoursesPage.getAddEditMenuActionsByName('View Activity Report'), 1000))
        cy.get(arCoursesPage.getAddEditMenuActionsByName('View Activity Report')).click()
        cy.get(arCoursesPage.getPageHeaderTitle(), {timeout: 5000}).should('contain', 'Course Activity')
        cy.get(arCoursesPage.getGridFilterResultLoader(), {timeout: 5000}).should('not.exist')

        //Edit Single Activity
        cy.get(arCoursesPage.getTableCellName(3)).contains(DefaultTestData.USER_LEARNER_FNAME).click()
        cy.wrap(arCoursesPage.WaitForElementStateToChange(arCoursesPage.getAddEditMenuActionsByName('Edit Activity'), 1000))
        cy.get(arCoursesPage.getAddEditMenuActionsByName('Edit Activity')).click()
        //Save Activity
        cy.get(arDashboardPage.getSaveBtn(), {timeout: 5000}).click()
        cy.get(arCoursesPage.getGridFilterResultLoader(), {timeout: 5000}).should('not.exist')
    })

    it('View Credit Report, Verify Edits Persisted', () => {
        //Sign into admin side as sys admin
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Reports'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Credits'))
        cy.get(arCoursesPage.getGridFilterResultLoader(), {timeout: 5000}).should('not.exist')
        cy.wrap(arCoursesPage.AddFilter('Course Name', 'Contains', ocDetails.creditCourseName))
 
        //Verify Each Credit has Correct Updated Value
        for (let i = 1; i < credit.credits.length; i++) {
            cy.get(arCoursesPage.getTableCellRecord()).contains(credit.credits[i]).parent().within(() => {
                cy.get('td').eq(5).should('have.text', credit.newCreditAmounts[i - 1])
            })
        }
    })

    it('Verify Updated Credit Values in Course Details', () => {
        //Sign into learner side as new learner
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)

        //Go to Course Details
        LEDashboardPage.getTileByNameThenClick('My Courses')
        LEFilterMenu.SearchForCourseByName(ocDetails.creditCourseName)
        cy.get(LECatalogPage.getCourseLoader(), {timeout: 3000}).should('not.exist')

        LEDashboardPage.getCourseCardBtnThenClick(ocDetails.creditCourseName)
        cy.get(LECoursesPage.getCourseTitleInBanner(), {timeout: 5000}).should('exist')
        cy.get(LECatalogPage.getLEWaitSpinner(), {timeout: 7500}).should('not.exist')

        //Verify Credit Values in Course Details
        cy.get(LECoursesPage.getTotalCredits()).should('contain', credit.newTotalCredit)
        cy.get(LECoursesPage.getMultiCreditsTable()).find('tr').each(($span) => {
            if ($span.text().slice(0, 2) === credit.newCreditAmounts[0]) {
                cy.get('td').contains($span.text().slice(0, 2)).parent().within(() => {
                    cy.get('td').contains(credit.credits[1]).should('exist')
                })
            } else {
                cy.get('td').contains($span.text().slice(0, 2)).parent().within(() => {
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
            cy.get(LETranscriptPage.getCreditTotal()).contains(credit.newCreditAmounts[i - 1]).parent().should('contain', credit.credits[i])
        }

        //Verify Multi Credits in Course List
        cy.get(LETranscriptPage.getCourseTitleCol()).contains(ocDetails.creditCourseName).parents(LETranscriptPage.getCourseContainer()).within(() => {
            cy.get(LETranscriptPage.getCreditsCol()).within(() => {
                for (let i = 1; i < credit.credits.length; i++) {
                    cy.get(LETranscriptPage.getCreditItem()).should('contain', credit.newCreditAmounts[i - 1]).and('contain', credit.credits[i])
                }
            })
        })
    })
})

