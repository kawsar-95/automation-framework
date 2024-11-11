import arDashboardPage from '../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARILCAddEditPage from '../../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage'
import { ilcDetails, sessions, enrollment } from '../../../../../../../helpers/TestData/Courses/ilc'
import { commonDetails } from '../../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../../helpers/TestData/users/users'

describe('AR - CED - ILC - Session - Approval', function(){

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        
    })

    after(function() {
        cy.deleteCourse(commonDetails.courseID, 'instructor-led-courses-new')
    })

    it('Create ILC, Add Session with each Type of Approval', () => {
        cy.createCourse('Instructor Led', ilcDetails.courseName, false)

        //Create four sessions each with a different approval type
        for (let i = 0; i < enrollment.approvalTypes.length; i++) {
            //Create session
            ARILCAddEditPage.getAddSession(`${ilcDetails.sessionName} - ${enrollment.approvalTypes[i]}`)

            //Open enrollment rules, allow all learners to self enroll, select approval type
            cy.get(ARILCAddEditPage.getElementByAriaLabelAttribute(ARILCAddEditPage.getExpandEnrollmentRulesBtn())).click()
            cy.get(ARILCAddEditPage.getAllowSelfEnrollmentRadioBtn()).contains('All Learners').click()
            cy.get(ARILCAddEditPage.getApprovalTypeRadioBtn()).contains(enrollment.approvalTypes[i]).click()

            //Verify approval type description
            cy.get(ARILCAddEditPage.getApprovalTypeDescriptionTxt()).should('contain', enrollment.approvalDescriptions[i])

            if (enrollment.approvalTypes[i] == 'Other') {
                //Select user from dropdown for Other approval type
                cy.get(ARILCAddEditPage.getOtherApprovalDDown()).click()
                cy.get(ARILCAddEditPage.getOtherApprovalDDownTxtF()).type(enrollment.approvalAccount)
                cy.get(ARILCAddEditPage.getOtherApprovalDDownOpt()).contains(enrollment.approvalAccount).click()
            }

            //Save session
            cy.get(ARILCAddEditPage.getAddEditSessionSaveBtn()).click()
            cy.intercept('**/sessions/report').as(`getSession${i}`).wait(`@getSession${i}`)
        }

        //Publish ILC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = (id.request.url.slice(-36));
        })
    })

    it('Verify Session Approval Options Persisted', () => {
        //Edit ILC
        cy.editCourse(ilcDetails.courseName)
        ARILCAddEditPage.getMediumWait()

        //Edit each session and verify approval options persisted
        for (let i = 0; i < enrollment.approvalTypes.length; i++) {
            ARILCAddEditPage.getEditSessionByName(`${ilcDetails.sessionName} - ${enrollment.approvalTypes[i]}`)
            cy.get(ARILCAddEditPage.getElementByAriaLabelAttribute(ARILCAddEditPage.getExpandEnrollmentRulesBtn())).click()

            //Verify approval selection persisted and correct description is still displayed
            cy.get(ARILCAddEditPage.getApprovalTypeRadioBtn()).contains(enrollment.approvalTypes[i]).parent().children()
                .should('have.attr', 'aria-checked', 'true')
            cy.get(ARILCAddEditPage.getApprovalTypeDescriptionTxt()).should('contain', enrollment.approvalDescriptions[i])

            if (enrollment.approvalTypes[i] == 'Other') {
                //Verify Other approval type user selection persisted
                cy.get(ARILCAddEditPage.getOtherApprovalDDown()).should('contain.text', enrollment.approvalAccount)
            }
            cy.get(ARILCAddEditPage.getAddEditSessionCancelBtn()).click()
        }
    })
})