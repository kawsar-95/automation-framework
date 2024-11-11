import arDashboardPage from '../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arCoursesPage from '../../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import ARILCAddEditPage from '../../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage'
import ARDeleteModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import ARHangfireJobsPage from '../../../../../../../helpers/AR/pageObjects/Hangfire/ARHangfireJobsPage'
import { ilcDetails, sessions } from '../../../../../../../helpers/TestData/Courses/ilc'
import { ilcSessionJobs } from '../../../../../../../helpers/TestData/Hangfire/jobNames'
import { commonDetails } from '../../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../../helpers/TestData/users/users'

describe('AR - CED - ILC - Session - Add Instructor', function(){

    after(function() {
        cy.deleteCourse(commonDetails.courseID, 'instructor-led-courses-new')
    })

    it('Add Instructor to New Session', () => {
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
        
        //Add second session with no instructor for next test 
        ARILCAddEditPage.getAddSession(sessions.sessionName_2, ARILCAddEditPage.getFutureDate(2))
        cy.intercept('PUT', 'api/rest/v2/admin/instructor-led-courses-new/**').as('getSessionId2')
        cy.get(ARILCAddEditPage.getAddEditSessionSaveBtn()).click()
        cy.wait('@getSessionId2').then((request) => {
            sessions.sessionId2 = request.request.url.slice(-36);
        })

        //Publish ILC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = (id.request.url.slice(-36));
        })
        ARILCAddEditPage.getHFJobWait() //Wait for jobs to complete
    })

    it('Verify Email Jobs Succeed When Instructor is Added to New Session', () => {
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
            
        //Verify SendInstructorAddedToSessionEmailJob 
        cy.get(ARHangfireJobsPage.getJobName()).contains(ilcSessionJobs.SendInstructorAddedToSessionEmailJob).eq(0).click() //click most recent job of this type
        //Verfify correct client ID, session ID, and instructor ID exists in job
        cy.get(ARHangfireJobsPage.getParameterString()).invoke('text').then((text) => {
            let params = JSON.parse(text)
            expect(params.ClientId).to.equal(Cypress.env('client_ID'))
            expect(params.SessionId).to.equal(sessions.sessionId)
            expect(params.InstructorId).to.equal(instructorId)
        })
    
        //Verify SendInstructorSessionUpdatedEmailJob
        cy.go('back')
        cy.get(ARHangfireJobsPage.getJobName()).contains(ilcSessionJobs.SendInstructorSessionUpdatedEmailJob).eq(0).click() //click most recent job of this type
        //Verfify correct client ID, session ID, and instructor ID exists in job
        cy.get(ARHangfireJobsPage.getParameterString()).invoke('text').then((text) => {
            let params = JSON.parse(text)
            expect(params.ClientId).to.equal(Cypress.env('client_ID'))
            expect(params.SessionId).to.equal(sessions.sessionId)
            expect(params.InstructorId).to.equal(instructorId)
        })
    })

    it('Add Instructor to Existing Session, Verify Time Conflict Warning, Publish Course', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        
        cy.editCourse(ilcDetails.courseName)
        //Edit session
        ARILCAddEditPage.getEditSessionByName(sessions.sessionName_2)
        cy.intercept('PUT', 'api/rest/v2/admin/instructor-led-courses-new/**').as('getSessionId')

        //Add same instructor
        cy.get(ARILCAddEditPage.getSessionDetailsInstructorsDDown()).click()
        cy.get(ARILCAddEditPage.getSessionDetailsInstructorsTxtF())
            .type(users.instructor01.instructor_01_username)
        cy.get(ARILCAddEditPage.getSessionDetailsInstructorsDDownOpt()).contains(users.instructor01.instructor_01_lname).click()
        cy.get(ARILCAddEditPage.getSessionDetailsDescriptionTxtF()).click()

        //verify time conflict warning
        cy.get(ARILCAddEditPage.getSessionInstructorWarningBanner()).should('contain', ARILCAddEditPage.getInstructorTimeConflictWarningMsg())

        //Select new date and save session
        ARILCAddEditPage.getStartDatePickerBtnThenClick()
        ARILCAddEditPage.getSelectDate(commonDetails.date)
        cy.get(ARILCAddEditPage.getAddEditSessionSaveBtn()).click()
        cy.intercept('**/sessions/report').as(`getSession2`).wait(`@getSession2`)

        //Publish ILC
        cy.publishCourse()
        ARILCAddEditPage.getHFJobWait() //Wait for jobs to complete
    })

    it('Verify Email Jobs Succeed When Instructor is Added to an Existing Session', () => {
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
            
        //Verify SendInstructorAddedToSessionEmailJob 
        cy.get(ARHangfireJobsPage.getJobName()).contains(ilcSessionJobs.SendInstructorAddedToSessionEmailJob).eq(0).click() //click most recent job of this type
        //Verfify correct client ID, session ID, and instructor ID exists in job
        cy.get(ARHangfireJobsPage.getParameterString()).invoke('text').then((text) => {
            let params = JSON.parse(text)
            expect(params.ClientId).to.equal(Cypress.env('client_ID'))
            expect(params.SessionId).to.equal(sessions.sessionId2)
            expect(params.InstructorId).to.equal(instructorId)
        })
    
        //Verify SendInstructorSessionUpdatedEmailJob
        cy.go('back')
        cy.get(ARHangfireJobsPage.getJobName()).contains(ilcSessionJobs.SendInstructorSessionUpdatedEmailJob).eq(0).click() //click most recent job of this type
        //Verfify correct client ID, session ID, and instructor ID exists in job
        cy.get(ARHangfireJobsPage.getParameterString()).invoke('text').then((text) => {
            let params = JSON.parse(text)
            expect(params.ClientId).to.equal(Cypress.env('client_ID'))
            expect(params.SessionId).to.equal(sessions.sessionId2)
            expect(params.InstructorId).to.equal(instructorId)
        })
    })
})