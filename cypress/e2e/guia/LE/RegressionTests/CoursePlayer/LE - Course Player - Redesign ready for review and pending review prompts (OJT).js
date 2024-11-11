import { users } from '../../../../../../helpers/TestData/users/users'
import ARDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import {ocDetails} from '../../../../../../helpers/TestData/Courses/oc'
import { userDetails } from '../../../../../../helpers/TestData/users/UserDetails'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import arEnrollUsersPage from '../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage'
import LESideMenu from '../../../../../../helpers/LE/pageObjects/Menu/LESideMenu'
import LEProfilePage from '../../../../../../helpers/LE/pageObjects/User/LEProfilePage'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import ARAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import LECourseDetailsOCModule from '../../../../../../helpers/LE/pageObjects/Courses/LECourseDetailsOCModule'
import LECourseLessonPlayerPage from '../../../../../../helpers/LE/pageObjects/Courses/LECourseLessonPlayerPage'
import ARCourseSettingsEnrollmentRulesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
import ARAddObjectLessonModal from '../../../../../../helpers/AR/pageObjects/Modals/ARAddObjectLessonModal'
import ARSelectLearningObjectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectLearningObjectModal'
import AROCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage'
import ARObservationChecklistsPage from '../../../../../../helpers/AR/pageObjects/OJT/ARObservationChecklistsPage'
import { ojtDetails } from '../../../../../../helpers/TestData/OJT/ojtDetails'
import LEAboutCollaborationModal from '../../../../../../helpers/LE/pageObjects/Modals/LEAboutCollaboration.modal'


describe('C2609 AUT-397, LE - Course Player - Redesign ready for review and pending review prompts (OJT)', function () {
    before(function () {
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)

        // Signin with system admin
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        LEDashboardPage.turnOnNextgenToggle()
    })

    after(() => {
        // Delete learner
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        cy.get(LEDashboardPage.getNavProfile()).click({force: true})  
        LEDashboardPage.getMediumWait()
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click({force: true})
        cy.url().then((currentURL) => {
            cy.deleteUser(currentURL.slice(-36))
        })

        // Signin with system admin
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        LEDashboardPage.turnOffNextgenToggle()

        // Delete Created Course
        cy.deleteCourse(commonDetails.courseID)
    })

    it('Create Online Course, enable Allow Comments and Course Rating Also enroll the Learner', () =>{ 
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getCoursesReport()

        cy.createCourse('Online Course', ocDetails.courseName)

        // Open Enrollment Rules
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click().click()

        // Select Allow Self Enrollment Specific Radio Button
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')

        // Click on Add learning object tab
        cy.get(AROCAddEditPage.getAddLearningObjectBtn()).click()
        ARSelectLearningObjectModal.getObjectTypeByName('Observation Checklist')
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()
        cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')

        // Enter name in name  field under details
        cy.get(ARObservationChecklistsPage.getDetailsNameTxt()).clear().type(ojtDetails.ojtName)
        cy.get(ARObservationChecklistsPage.getDetailsDescription()).type(ojtDetails.ojtDescription)

        cy.get(ARObservationChecklistsPage.getReviewerIdsDDown()).click()
        cy.get(ARObservationChecklistsPage.getReviewerIdsDDownTxtF()).clear().type(users.sysAdmin.admin_sys_01_username)
        cy.get(ARObservationChecklistsPage.getReviewerIdsDDownOpt()).should('contain',users.sysAdmin.admin_sys_01_full_name)
        cy.get(ARObservationChecklistsPage.getReviewerIdsDDownOpt()).contains(users.sysAdmin.admin_sys_01_full_name).click()

        // In checklist,Click on Add section button and enter section name in name field
        cy.get(ARObservationChecklistsPage.getExpandChecklistBtn()).click()
        cy.get(ARObservationChecklistsPage.getSectionNameTxt()).clear().type(ojtDetails.ojtSectionName)
        
        // Click on Manage Steps button under section
        cy.get(ARAddObjectLessonModal.getManageStepsBtn()).click()
        cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')

        cy.get(ARObservationChecklistsPage.getAddStepBtn()).click()
        cy.get(ARObservationChecklistsPage.getStepTitle()).clear().type(ojtDetails.ojtStepTitle)
        cy.get(ARObservationChecklistsPage.getSubmitBtn()).should('have.attr', 'aria-disabled', 'false').click()
        cy.get(ARObservationChecklistsPage.getSubmitBtn()).should('not.exist')

        cy.get(ARObservationChecklistsPage.getStepsApplyBtn()).click()
        cy.get(ARObservationChecklistsPage.getStepsApplyBtn()).should('not.exist')
        cy.get(ARDashboardPage.getModalSaveBtn()).should('have.attr', 'aria-disabled', 'false').click()
        cy.get(ARDashboardPage.getModalSaveBtn()).should('not.exist')

        // Publish OC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36)
        })
        cy.get(ARDashboardPage.getToastSuccessMsg(), {timeout: 10000}).should('contain', 'Course successfully published')

        // Enroll User
        arEnrollUsersPage.getEnrollUserByCourseAndUsername([ocDetails.courseName], [userDetails.username])
    })

    it('Log in as the learner and launch this course', () =>{
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)

        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('My Courses')
        LEDashboardPage.getShortWait()
        cy.get(LEDashboardPage.getLEEllipsesLoader(), {timeout: 15000}).should('not.exist', {timeout: 15000})
        cy.get(LEDashboardPage.getCourseCardName()).contains(ocDetails.courseName).click()

        //Start Lesson
        cy.get(LECourseLessonPlayerPage.getLEWaitSpinner(), {timeout: 15000}).should('not.exist', {timeout: 10000})
        cy.get(LECourseDetailsOCModule.getStartBtn()).should('have.attr', 'aria-disabled', 'false').click()
        cy.get(LEDashboardPage.getLEEllipsesLoader(), {timeout: 15000}).should('not.exist')

        // OJT lesson name in header
        cy.get(LECourseLessonPlayerPage.getEarlyLeavePromptHeader()).should('be.visible').and('contain',ojtDetails.ojtName)

        // OJT Description
        cy.get(LEAboutCollaborationModal.getDescriptionTxt()).should('be.visible').and('contain', ojtDetails.ojtDescription)

        // Button: Ready for Review
        cy.get(LECourseLessonPlayerPage.getSendNotificationBtn()).should('be.visible').and('contain', 'Ready for Review')

        // Ready for the review button should be enabled
        cy.get(LECourseLessonPlayerPage.getSendNotificationBtn()).click()

        // Status should be Pending Review
        cy.get(LECourseLessonPlayerPage.getCoursePlayerStatusModule()).eq(0).should('be.visible').and('contain','Status')
        cy.get(LECourseLessonPlayerPage.getCoursePlayerStatusModule()).eq(1).should('be.visible').and('contain','Pending Review')
        
        // OJT lesson name in header
        cy.get(LECourseLessonPlayerPage.getEarlyLeavePromptHeader()).should('be.visible').and('contain',ojtDetails.ojtName)

        // OJT Description
        cy.get(LEAboutCollaborationModal.getDescriptionTxt()).should('be.visible').and('contain', ojtDetails.ojtDescription)

        cy.get(LECourseLessonPlayerPage.getCloseBtn()).click()
        cy.get(LEDashboardPage.getLEEllipsesLoader(), {timeout: 15000}).should('not.exist')
    })
})


