import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arDashboardAccountMenu from '../../../../../../helpers/AR/pageObjects/Menu/ARDashboardAccount.menu'
import { users } from '../../../../../../helpers/TestData/users/users'
import { userDetails} from '../../../../../../helpers/TestData/users/UserDetails'
import { courses } from '../../../../../../helpers/TestData/Courses/courses'
import LEProfilePage from '../../../../../../helpers/LE/pageObjects/User/LEProfilePage'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LEFilterMenu from '../../../../../../helpers/LE/pageObjects/Menu/LEFilterMenu'
import DefaultTestData from '../../../../../fixtures/defaultTestData.json'
import LEInactivityTimeoutModal from '../../../../../../helpers/LE/pageObjects/Modals/LEInactivityTimeout.modal'
import LECourseDetailsOCModule from '../../../../../../helpers/LE/pageObjects/Courses/LECourseDetailsOCModule'
import LECourseLessonPlayerPage from '../../../../../../helpers/LE/pageObjects/Courses/LECourseLessonPlayerPage'
import AREditClientInfoPage from '../../../../../../helpers/AR/pageObjects/PortalSettings/AREditClientInfoPage'
import ARDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'

describe('LE - Auth - Inactivity Timeout', function(){
    before(function () {
         cy.createUser(void 0, userDetails.username, ["Learner"], void 0);
         //Signin with system admin
         cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
         cy.get(arDashboardPage.getCurrentUserLabel()).should('contain.text',"GUI_Auto Sys_Admin_01")
         cy.get(arDashboardPage.getElementByDataNameAttribute(arDashboardPage.getHelpAndSupportBtn())).should('be.visible')
         //Select Account Menu 
         cy.get(arDashboardPage.getElementByDataNameAttribute(arDashboardPage.getAccountBtn())).click()
         //Select Portal Setting option from account menu 
         cy.get(arDashboardAccountMenu.getPortalSettingsBtn()).should('exist').click()
         //Validate portal setting page header, and turn on Learner Idle Timeout toggle and set to 2 min with verification code
         cy.get(arDashboardPage.getAccountHeaderLabel()).should('have.text','Edit Client')
         AREditClientInfoPage.getTurnOnEnableLearnerIdleTimeoutSettingsToggleBtn()
         ARDashboardPage.getShortWait()
         AREditClientInfoPage.getTurnOnEnableMandatoryVerificationCodeforTimeoutExtensionToggleBtn()
         cy.get(arDashboardPage.getLearnerIdleTimeoutTxtF()).clear()
         cy.get(arDashboardPage.getLearnerIdleTimeoutTxtF()).type('2')
         ARDashboardPage.getShortWait()
         //Select save button within Portal settings
         cy.get(arDashboardPage.getA5SaveBtn()).click()
         //Navigate to dashboard page
         cy.get(arDashboardPage.getCurrentUserLabel()).should('contain.text',"GUI_Auto Sys_Admin_01")
        });

      after(function() {
        //Cleanup - delete learner
        cy.get(LEDashboardPage.getNavProfile()).click()  
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
        cy.url().then((currentURL) => {
        cy.deleteUser(currentURL.slice(-36));
        })
        //Signin with system admin
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getCurrentUserLabel()).should('contain.text',"GUI_Auto Sys_Admin_01")
        cy.get(arDashboardPage.getElementByDataNameAttribute(arDashboardPage.getHelpAndSupportBtn())).should('be.visible')
        //Select Account Menu 
        cy.get(arDashboardPage.getElementByDataNameAttribute(arDashboardPage.getAccountBtn())).click()
        //Select Portal Setting option from account menu 
        cy.get(arDashboardAccountMenu.getPortalSettingsBtn()).should('exist').click()
        //Validate portal setting page header, and turn off Learner Idle Timeout toggle
        cy.get(arDashboardPage.getAccountHeaderLabel()).should('have.text','Edit Client')
        cy.get(arDashboardPage.getLearnerIdleTimeouttoggle()).click()
        //Select save button within Portal settings
        cy.get(arDashboardPage.getA5SaveBtn()).click()
        //Navigate to dashboard page
        cy.get(arDashboardPage.getCurrentUserLabel()).should('contain.text',"GUI_Auto Sys_Admin_01")

    })

    beforeEach(() => {
        cy.apiLoginWithSession(userDetails.username, DefaultTestData.USER_PASSWORD)
        cy.get(LEDashboardPage.getDashboardPageTitle()).should('have.text', "Welcome, " + DefaultTestData.USER_LEARNER_FNAME + " " + DefaultTestData.USER_LEARNER_LNAME + "We are happy you stopped by.")
    })


    it('Verify Inactivity Timeout Modal appears after x min, modal countdown is set to 1 minute, and user can enter the 5 digit verification code to continue session', () => {    
        cy.get(LEInactivityTimeoutModal.getContinueSessionBtn(), {timeout: 125000}).should('exist')
        cy.get(LEInactivityTimeoutModal.getCountdown()).should('have.text', ' 59 seconds ')
        cy.get(LEInactivityTimeoutModal.getVerificationNumber()).invoke('text').then((text1) => {
            cy.get(LEInactivityTimeoutModal.getInactivityVerificationTxtF()).type(text1)
        })
        cy.get(LEInactivityTimeoutModal.getContinueSessionBtn()).should('have.attr', 'role', 'button').click()
            
    })

    it('Verify entering an incorrect 5 digit verification code and clicking outside of modal does not continue session', () => {    
        cy.get(LEInactivityTimeoutModal.getContinueSessionBtn(), {timeout: 125000}).should('exist')
        cy.get(LEInactivityTimeoutModal.getInactivityVerificationTxtF()).type('55555')
        cy.get(LEInactivityTimeoutModal.getContinueSessionBtn(), {timeout: 2000}).should('be.disabled')
        cy.get(LEDashboardPage.getNavMenu()).should('be.visible').click({force:true})
        cy.get(LEInactivityTimeoutModal.getContinueSessionBtn(), {timeout: 2000}).should('be.disabled')
            
    })
    
    it('Verify after Inactivity modal appears, after 1 minute countdown, user is automatically logged out and user is able to log back in', () => {   
        cy.get(LEInactivityTimeoutModal.getContinueSessionBtn(), {timeout: 125000}).should('exist')
        cy.get(LEInactivityTimeoutModal.getContinueSessionBtn(), {timeout: 60000}).should('not.exist')
        cy.get(LEInactivityTimeoutModal.getModalMessage(), {timeout: 50000}).should('have.text', 'You have been logged out due to inactivity.')
        cy.get(LEInactivityTimeoutModal.getOKBtn()).click()
        cy.learnerLoginThruDashboardPage(userDetails.username, DefaultTestData.USER_PASSWORD)
    })

    it('Verify when an Assessment (player) lesson is started or action is performed within the lesson, the timeout resets', () => { 
        LEDashboardPage.getTileByNameThenClick('Catalog')
        cy.get(LEDashboardPage.getLEEllipsesLoader(), {timeout: 15000}).should('not.exist')
        cy.get(LEDashboardPage.getLEWaitSpinner(), {timeout: 15000}).should('not.exist')
        LEFilterMenu.SearchForCourseByName(courses.oc_lesson_act_ovas_name)
        LEDashboardPage.getCourseCardBtnThenClick(courses.oc_lesson_act_ovas_name)
        LEDashboardPage.getCourseCardBtnThenClick(courses.oc_lesson_act_ovas_name)
        LECourseDetailsOCModule.getLongWait()
        cy.get(LECourseDetailsOCModule.getLessonContentName()).contains(courses.oc_lesson_act_ovas_assessment_name).click()
        //Wait for inactivity Modal to appear and close
        cy.wait(50000)
        cy.get(LEInactivityTimeoutModal.getContinueSessionBtn(), {timeout: 65000}).should('exist')
        cy.get(LEInactivityTimeoutModal.getCountdown()).should('have.text', ' 59 seconds ')
        cy.get(LEInactivityTimeoutModal.getVerificationNumber()).invoke('text').then((text1) => {
            cy.get(LEInactivityTimeoutModal.getInactivityVerificationTxtF()).type(text1)
        })
        cy.get(LEInactivityTimeoutModal.getContinueSessionBtn()).should('have.attr', 'role', 'button').click()
        //Perform and action within lesson player and verify timer has reset
        cy.get(LECourseDetailsOCModule.getLessonContentName()).contains(courses.oc_lesson_act_ovas_survey_name).click()
        LECourseDetailsOCModule.getShortWait()
        cy.get(LECourseLessonPlayerPage.getCollapseDetailsBtn()).click()
        LECourseDetailsOCModule.getVLongWait()
        LECourseLessonPlayerPage.getIframeLessonPlayerTxtFElementandTypeText(LECourseLessonPlayerPage.getSurveyTxtF(), '1234')
        LECourseDetailsOCModule.getVLongWait()
        //LECourseLessonPlayerPage.getIframeType('1234')
        LECourseLessonPlayerPage.getIframeLessonPlayerElementandClick(LECourseLessonPlayerPage.getQuestionContainer(), LECourseLessonPlayerPage.getSubmitResponseBtn())
        LECourseDetailsOCModule.getVLongWait()
        cy.get(LEInactivityTimeoutModal.getContinueSessionBtn()).should('not.exist')
        cy.get(LEInactivityTimeoutModal.getContinueSessionBtn(), {timeout: 65000}).should('exist')
        cy.get(LEInactivityTimeoutModal.getCountdown()).should('have.text', ' 59 seconds ')
        cy.get(LEInactivityTimeoutModal.getVerificationNumber()).invoke('text').then((text1) => {
            cy.get(LEInactivityTimeoutModal.getInactivityVerificationTxtF()).type(text1)
        })
        cy.get(LEInactivityTimeoutModal.getContinueSessionBtn()).should('have.attr', 'role', 'button').click()
        LECourseDetailsOCModule.getLShortWait()
        cy.get(LECourseLessonPlayerPage.getCloseBtn()).click()
        LECourseDetailsOCModule.getLShortWait()
    })


    it('Verify after Inactivity modal appears, clicking logout button directs you to the public dashboard', () => {   
        cy.get(LEInactivityTimeoutModal.getContinueSessionBtn(), {timeout: 125000}).should('exist')
    cy.get(LEInactivityTimeoutModal.getLogoutBtn()).click()
    cy.get(LEDashboardPage.getPublicDashboardLoginBtn()).should('be.visible')
    cy.apiLoginWithSession(userDetails.username, DefaultTestData.USER_PASSWORD)
    })

})