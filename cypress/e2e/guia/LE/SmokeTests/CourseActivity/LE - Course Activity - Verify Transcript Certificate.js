import users from '../../../../../fixtures/users.json'
import courses from '../../../../../fixtures/courses.json'
import departments from '../../../../../fixtures/departments.json'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LESideMenu from '../../../../../../helpers/LE/pageObjects/Menu/LESideMenu'
import LETranscriptPage from '../../../../../../helpers/LE/pageObjects/User/LETranscriptPage'

describe('LE - Course Activity - Verify Transcript and Certificate', function(){

    beforeEach(() => {
        //Sign in as learner, navigate to Transcript before each
        cy.apiLoginWithSession(users.learnerTransCert.LEARNER_TRANSCERT_USERNAME, users.learnerTransCert.LEARNER_TRANSCERT_PASSWORD, '/')
        //Adding this wait because for some reason the cy.visit repeats in Firefox because of a signal r error
        LEDashboardPage.getVLongWait()
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('Transcript') 
    })

    it('Open Transcript and Verify Content', () => { 
        cy.get(LETranscriptPage.getTranscriptPageTitle()).should('contain', 'Transcript for ' + users.learnerTransCert.LEARNER_TRANSCERT_FNAME + ' ' + users.learnerTransCert.LEARNER_TRANSCERT_LNAME)
        cy.get(LETranscriptPage.getUsername()).should('contain', users.learnerTransCert.LEARNER_TRANSCERT_USERNAME)
        cy.get(LETranscriptPage.getEmail()).should('contain', users.learnerTransCert.LEARNER_TRANSCERT_EMAIL)
        cy.get(LETranscriptPage.getDepartment()).should('contain', departments.DEPT_TOP_NAME)
    })

    it('Verify Awarded Certificates and Print Button are Visible', () => { 
        cy.get(LETranscriptPage.getPrintTranscriptBtn()).should('be.visible')
        LETranscriptPage.getCertificateByCourseName(courses.OC_02_ADMIN_APPROVAL_NAME)
        LETranscriptPage.getCertificateByCourseName(courses.OC_LESSON_ACT_OVAS_NAME)
    })

    it('Verify Completed Course Status', () => { 
        LETranscriptPage.getCourseCompletionStatusByCourseName(courses.OC_02_ADMIN_APPROVAL_NAME, 'Complete')
        LETranscriptPage.getCourseCompletionStatusByCourseName(courses.OC_LESSON_ACT_OVAS_NAME, 'Complete')
    })
})