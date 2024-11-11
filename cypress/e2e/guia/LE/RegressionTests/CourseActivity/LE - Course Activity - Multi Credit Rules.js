import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LESideMenu from '../../../../../../helpers/LE/pageObjects/Menu/LESideMenu'
import LEFilterMenu from '../../../../../../helpers/LE/pageObjects/Menu/LEFilterMenu'
import LEProfilePage from '../../../../../../helpers/LE/pageObjects/User/LEProfilePage'
import LECoursesPage from '../../../../../../helpers/LE/pageObjects/Courses/LECoursesPage'
import LETranscriptPage from '../../../../../../helpers/LE/pageObjects/User/LETranscriptPage'
import ARCourseSettingsCompletionModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCompletion.module'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import ARCourseSettingsEnrollmentRulesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import AROCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage'
import { userDetails } from '../../../../../../helpers/TestData/users/UserDetails'
import { users } from '../../../../../../helpers/TestData/users/users'
import { ocDetails } from '../../../../../../helpers/TestData/Courses/oc'
import { commonDetails, credit } from '../../../../../../helpers/TestData/Courses/commonDetails'

let userNames = [userDetails.username, userDetails.username2];

describe('LE - Course Activity - Multi Credit Rules - Create Course', function(){

    it('Create OC Course with Variable Multi Credit Rules & Publish', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getCoursesReport()
        cy.createCourse('Online Course')
        
        //Set All Learner Enrollment Rule
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')
        cy.get(ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentAllLearnersRadioBtn()).should('have.attr','aria-checked','true')

        //Open Completion Section
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Completion')).click()
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Completion'),{timeout:10000}).should('have.attr','class').and('include','enabled') //Verify that completion button is clicked
        
        //Add Multi Credits
        for (let i = 0; i < credit.credits.length; i++) {
            cy.get(ARCourseSettingsCompletionModule.getAddCreditBtn()).click()
            cy.get(ARCourseSettingsCompletionModule.getCreditTypeDDown()).eq(i).click()
            cy.get(ARCourseSettingsCompletionModule.getCreditTypeSearchF()).eq(i).type(credit.credits[i])
            cy.get(ARCourseSettingsCompletionModule.getCreditTypeSearchF()).eq(i).type(`{downArrow}{enter}`)
            if (credit.credits[i] === 'General') { //Add General Credit without Rule
                cy.get(AROCAddEditPage.getElementByAriaLabelAttribute(ARCourseSettingsCompletionModule.getVariableCreditAmountTxt()))
                    .eq(i).clear().type(credit.creditAmounts2[i])
            } else { //Add Credit Rule for Multi Credits
                cy.get(ARCourseSettingsCompletionModule.getCreditContainer()).eq(i).within(() => {
                    cy.get(ARCourseSettingsCompletionModule.getAddVariableCreditRuleBtn()).click()
                    cy.get(ARCourseSettingsCompletionModule.getVariableCreditFieldDDown()).eq(0).click()
                    cy.get(ARCourseSettingsCompletionModule.getVariableCreditFieldOpt()).contains('Username').click()
                    cy.get(ARCourseSettingsCompletionModule.getVariableCreditFieldDDown()).eq(1).click()
                    cy.get(ARCourseSettingsCompletionModule.getVariableCreditFieldOpt()).contains('Contains').click()
                    cy.get(ARCourseSettingsCompletionModule.getVariableCreditTxtF()).type(userDetails.username2.slice(0, -26))
                    cy.get(AROCAddEditPage.getElementByAriaLabelAttribute(ARCourseSettingsCompletionModule.getVariableCreditAmountTxt()))
                        .clear().type(credit.creditAmounts2[i])
                })
            }
        }

        //Publish course
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36)
        })
    })
})

describe('LE - Course Activity - Multi Credit Rules', function(){

    before(function() {
        //Create Learners Login, Go to Catalog & Enroll in Course
        for (let i = 0; i < userNames.length; i++) {
            cy.createUser(void 0, userNames[i], ["Learner"], void 0)
        }
    })

    after(function() {
        //Cleanup - Delete Course and Users
        cy.deleteCourse(commonDetails.courseID)
        for (let i = 0; i < userDetails.userIDs.length; i++) {
            cy.deleteUser(userDetails.userIDs[i])
        }
    })

    for (let i = 0; i < userNames.length; i++) {
        it(`Verify Credits in Course Details for ${userNames[i].slice(0, -26)}`, () => {
            //Login and go to Catalog
            cy.apiLoginWithSession(userNames[i], userDetails.validPassword ,'/#/catalog')
            LEFilterMenu.SearchForCourseByName(ocDetails.courseName)
            cy.get(LEDashboardPage.getLEWaitSpinner(), {timeout: 10000}).should('not.exist', {timeout: 10000})
            LEDashboardPage.getSpecificCourseCardBtnThenClickOnName(ocDetails.courseName)
            
            //Verify Correct Credits are Displayed in Course Details Prior to Earning
            // if (userNames[i] === userDetails.username) { //Verify For General Credit Learner
            //     cy.get(LECoursesPage.getTotalCredits()).should('be.visible').and('contain', credit.creditAmounts2[0])
            //     cy.get(LECoursesPage.getMultiCreditsTable()).should('not.exist') //Verify Multi-Credits do not exist
            // } else { //Verify for Multi Credit Learner
                    cy.get(LECoursesPage.getTotalCredits()).should('contain', credit.totalCredit2)
                    cy.get(LECoursesPage.getMultiCreditsTable()).find(`td:nth-child(1)`).each(($item, j) => {
                        expect($item.text()).to.eq(credit.creditAmounts2[j])
                    })
                    cy.get(LECoursesPage.getMultiCreditsTable()).find(`td:nth-child(2)`).each(($item, j) => {
                        expect($item.text()).to.eq(credit.credits[j])
                    }) 
            //}

            //Enroll in Course
            cy.get(LECoursesPage.getModalEnrollBtn()).click()
            cy.get(LECoursesPage.getToastNotificationMsg()).should('be.visible')//Additional wait time for Course and HF job to complete and display credits
        })

        it(`Verify Credits in Transcript for ${userNames[i].slice(0, -26)}`, () => {
            //Login and go to Transcript
            cy.apiLoginWithSession(userNames[i], userDetails.validPassword)
            cy.get(LEDashboardPage.getNavMenu()).click()
            LESideMenu.getLEMenuItemsByNameThenClick('Transcript') 

            
            if (userNames[i] === userDetails.username) { //Verify For General Credit Learner
                cy.get(LETranscriptPage.getTotalCredits(),{timeout:5000}).should('contain', credit.totalCredit2)
                //Verify General Credit in Course List
                cy.get(LETranscriptPage.getCourseTitleCol()).contains(ocDetails.courseName).parents(LETranscriptPage.getCourseContainer()).within(() => {
                    cy.get(LETranscriptPage.getCreditsCol()).eq(1).within(() => {
                        cy.get(LETranscriptPage.getCreditItem()).should('contain', credit.creditAmounts2[0]).and('contain', credit.credits[0])
                    })
                })
            } else { //Verify for Multi Credit Learner
                cy.get(LETranscriptPage.getTotalCredits()).should('contain', credit.totalCredit2)
                //Verify Multi Credit Items in Credit Section
                for (let j = 0; j < credit.credits.length; j++) {
                    cy.get(LETranscriptPage.getCreditTotal()).contains(credit.creditAmounts2[j]).parent().should('contain', credit.credits[j])
                }
                //Verify Multi Credits in Course List
                cy.get(LETranscriptPage.getCourseTitleCol()).contains(ocDetails.courseName).parents(LETranscriptPage.getCourseContainer()).within(() => {
                    cy.get(LETranscriptPage.getCreditsCol()).eq(1).within(() => {
                        for (let j = 0; j < credit.credits.length; j++) {
                            cy.get(LETranscriptPage.getCreditItem()).should('contain', credit.creditAmounts2[j]).and('contain', credit.credits[j])
                        }
                    })
                })
            }

            //Get UserID for Deletion After
            cy.get(LEDashboardPage.getNavProfile()).click()  
            cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
            cy.url().then((currentURL) => {
                userDetails.userIDs.push(currentURL.slice(-36));
            })
        })
    }
})