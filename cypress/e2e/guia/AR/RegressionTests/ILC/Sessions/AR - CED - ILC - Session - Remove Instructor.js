import arDashboardPage from '../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arCoursesPage from '../../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import ARILCAddEditPage from '../../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage'
import ARDeleteModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import ARHangfireJobsPage from '../../../../../../../helpers/AR/pageObjects/Hangfire/ARHangfireJobsPage'
import { ilcDetails, sessions } from '../../../../../../../helpers/TestData/Courses/ilc'
import { ilcSessionJobs } from '../../../../../../../helpers/TestData/Hangfire/jobNames'
import { commonDetails } from '../../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../../helpers/TestData/users/users'

describe('AR - CED - ILC - Session - Remove Instructor', function(){

    before(function() {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        
        cy.createCourse('Instructor Led')
        //Delete created session
        ARILCAddEditPage.getDeleteSessionByName(ilcDetails.sessionName)
        cy.get(arCoursesPage.getElementByDataNameAttribute(ARDeleteModal.getDeleteBtn())).click()
        ARILCAddEditPage.getShortWait()
        //Add new session with instructor
        ARILCAddEditPage.getAddSession(sessions.sessionName_1, ARILCAddEditPage.getFutureDate(2))
        cy.intercept('PUT', 'api/rest/v2/admin/instructor-led-courses-new/**').as('getSessionId')
        cy.get(ARILCAddEditPage.getSessionDetailsInstructorsDDown()).click()
        cy.get(ARILCAddEditPage.getSessionDetailsInstructorsTxtF())
            .type(users.instructor01.instructor_01_username)
        cy.get(ARILCAddEditPage.getSessionDetailsInstructorsDDownOpt()).contains(users.instructor01.instructor_01_lname).click()
        cy.get(ARILCAddEditPage.getSessionDetailsDescriptionTxtF()).click()
        //Save session and store session ID for HF email job verification
        cy.get(ARILCAddEditPage.getAddEditSessionSaveBtn()).click()
        cy.wait('@getSessionId').then((request) => {
            sessions.sessionId = request.request.url.slice(-36);
        })   
        //Publish ILC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = (id.request.url.slice(-36));
        })
    })

    after(function() {
        cy.deleteCourse(commonDetails.courseID, 'instructor-led-courses-new')
    })

    it('Remove Instructor From Existing Session', () => {
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        
        //Edit course and session
        cy.editCourse(ilcDetails.courseName)
        ARILCAddEditPage.getMediumWait()
        ARILCAddEditPage.getEditSessionByName(sessions.sessionName_1)

        //Remove instructor from session
        cy.get(ARILCAddEditPage.getSessionDetailsInstructorsClearBtn()).click()
        cy.get(ARILCAddEditPage.getAddEditSessionSaveBtn()).click()
        ARILCAddEditPage.getLShortWait()

        //Publish ILC
        cy.publishCourse()
        ARILCAddEditPage.getHFJobWait() //Wait for job to complete
    })

    it('Verify Email Job Succeeds When Instructor is Removed from Existing Session', () => {
        cy.loginBlatantAdmin()
        let instructorId;
        //Go to Hangfire as Blatant admin, verify email jobs
        if (Cypress.env('environment') === "qamain") {
            ARHangfireJobsPage.goToSucceededJobsQAMain()
            instructorId = users.instructor01.instructor_01_qamain_id;
        } else if (Cypress.env('environment') === "qa2") {
            ARHangfireJobsPage.goToSucceededJobsQASecondary()
            instructorId = users.instructor01.instructor_01_qa2_id;
        }
            
        //Verify SendInstructorRemovedFromSessionEmailJob
        cy.get(ARHangfireJobsPage.getJobName()).contains(ilcSessionJobs.SendInstructorRemovedFromSessionEmailJob).eq(0).click() //click most recent job of this type
        //Verfify correct client ID, session ID, and instructor ID exists in job
        cy.get(ARHangfireJobsPage.getParameterString()).invoke('text').then((text) => {
            let params = JSON.parse(text)
            expect(params.ClientId).to.equal(Cypress.env('client_ID'))
            expect(params.SessionId).to.equal(sessions.sessionId)
            expect(params.InstructorId).to.equal(instructorId)
        })
    })
})