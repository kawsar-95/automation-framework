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
import ARReviewerLearnersPage from '../../../../../../helpers/AR/pageObjects/OJT/ARReviewerLearnersPage'
import ReviewerStepResultPage from '../../../../../../helpers/Reviewer/pageObjects/Pages/ReviewerStepResultPage'
import ReviewerReviewPage from '../../../../../../helpers/Reviewer/pageObjects/Pages/ReviewerReviewPage'
import ARReviewChecklistPage from '../../../../../../helpers/AR/pageObjects/OJT/ARReviewChecklistPage.js'
import ReviewerBottomToolbar from '../../../../../../helpers/Reviewer/pageObjects/Menu/ReviewerBottomToolbar.js'
import ReviewerCompletedModal from '../../../../../../helpers/Reviewer/pageObjects/Modals/ReviewerCompletedModal.js'


let userNames = [userDetails.username, userDetails.username2]

describe('C2593 AUT-395, LE - Course Player - View and complete an OJT lesson', function () {
    before(function () {
        //Create 2 new users, Change All Learner's First names
        for (let i = 0; i < userNames.length; i++) {
            cy.createUser(void 0, userNames[i], ["Learner"], void 0)
            cy.apiLoginWithSession(userNames[i], userDetails.validPassword) 
            cy.get(LEDashboardPage.getNavProfile()).click()  
            cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
            cy.url().then((currentURL) => {
                userDetails.userID = currentURL.slice(-36)
                userDetails.userIDs.push(userDetails.userID) //Save userID
                cy.editUser(userDetails.userID, userNames[i], userNames[i], userDetails.lastName)
            })
        }

        // Signin with system admin
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        LEDashboardPage.turnOnNextgenToggle()
    })

    after(() => {
        for (let i = 0; i < userNames.length; i++) {
            cy.deleteUser(userDetails.userIDs[i])
        }

        // Delete Created Course
        cy.deleteCourse(commonDetails.courseID)
        
        // Signin with system admin
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        LEDashboardPage.turnOffNextgenToggle()
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
        arEnrollUsersPage.getEnrollUserByCourseAndUsername([ocDetails.courseName], [userDetails.username, userDetails.username2])
    })

    it('Log in as the learner 1 and launch this course', () =>{
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

    it('Log in as the learner 2 and launch this course', () =>{
        cy.apiLoginWithSession(userDetails.username2, userDetails.validPassword)

        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('My Courses')
        LEDashboardPage.getShortWait()
        cy.get(LEDashboardPage.getLEEllipsesLoader(), {timeout: 15000}).should('not.exist')
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

    it('Log in as the Reviewer, go into the Reviewer Experience', () =>{ 
        cy.loginReviewer(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password)

        cy.get(ARReviewerLearnersPage.getElementByDataName(ARReviewerLearnersPage.getReviewerPageTitle())).should('contain', 'Learners')
        ARDashboardPage.getMediumWait()

        // review 1st learner
        cy.get(ARReviewerLearnersPage.getLearnerSearchTxtF()).type(userDetails.username)
        ARDashboardPage.getShortWait()
        cy.get(ARReviewerLearnersPage.getReviewerNameList()).should('contain', userDetails.username)
        cy.get(ARReviewerLearnersPage.getReviewerNameList()).contains(userDetails.username).click()
        cy.get(ARDashboardPage.getElementByDataNameAttribute(ARReviewerLearnersPage.getReviewerPageTitle())).contains(`Checklists`)
        cy.get(ARReviewChecklistPage.getReviewerCourseLabel()).contains(ocDetails.courseName).should('be.visible').click()

        ReviewerReviewPage.getStep(1,1)
        ReviewerStepResultPage.getReviewListBtn('Yes')
        cy.get(ReviewerStepResultPage.getCommentsField()).type('Comment for Step 1 Result Section')
        cy.get(ReviewerStepResultPage.getPostBtn()).click()
        cy.get(ReviewerBottomToolbar.getNextBtn()).click()

        ReviewerStepResultPage.getReviewListBtn('N/A')
        cy.get(ReviewerStepResultPage.getCommentsField()).type('Comment for Step 2 Result Section')
        cy.get(ReviewerStepResultPage.getPostBtn()).click()
        cy.get(ReviewerBottomToolbar.getNextBtn()).click()

        cy.get(ReviewerReviewPage.getElementByDataNameAttribute(ReviewerReviewPage.getPassBtn())).click()
        cy.get(ReviewerReviewPage.getCommentsField()).type('Comment for Review Page')
        cy.get(ARDashboardPage.getSubmitBtn()).click()
        cy.get(ARDashboardPage.getSubmitBtn()).should('have.attr', 'aria-disabled', 'true')

        ReviewerReviewPage.getSubmitOrCloseBtn('Submit Review')
        cy.get(ReviewerCompletedModal.getContinueToDashboardBtn()).should('contain', 'Continue to Dashboard')
        cy.get(ReviewerCompletedModal.getContinueToDashboardBtn()).click()
        cy.get(ReviewerCompletedModal.getContinueToDashboardBtn()).should('not.exist')
        cy.get(ARReviewerLearnersPage.getElementByDataName(ARReviewerLearnersPage.getReviewerPageTitle())).should('contain', 'Learners')
        ARDashboardPage.getMediumWait()
        
        // review 2nd learner
        cy.get(ARReviewerLearnersPage.getLearnerSearchTxtF()).type(userDetails.username2)
        ARDashboardPage.getShortWait()
        cy.get(ARReviewerLearnersPage.getReviewerNameList()).should('contain', userDetails.username2)
        cy.get(ARReviewerLearnersPage.getReviewerNameList()).contains(userDetails.username2).click()
        cy.get(ARDashboardPage.getElementByDataNameAttribute(ARReviewerLearnersPage.getReviewerPageTitle())).contains(`Checklists`)
        cy.get(ARReviewChecklistPage.getReviewerCourseLabel()).contains(ocDetails.courseName).should('be.visible').click()

        ReviewerReviewPage.getStep(1,1)
        ReviewerStepResultPage.getReviewListBtn('Yes')
        cy.get(ReviewerStepResultPage.getCommentsField()).type('Comment for Step 1 Result Section')
        cy.get(ReviewerStepResultPage.getPostBtn()).click()
        cy.get(ReviewerBottomToolbar.getNextBtn()).click()

        ReviewerStepResultPage.getReviewListBtn('No')
        cy.get(ReviewerStepResultPage.getCommentsField()).type('Comment for Step 2 Result Section')
        cy.get(ReviewerStepResultPage.getPostBtn()).click()
        cy.get(ReviewerBottomToolbar.getNextBtn()).click()

        cy.get(ReviewerReviewPage.getElementByDataNameAttribute(ReviewerReviewPage.getFailBtn())).click()
        cy.get(ReviewerReviewPage.getCommentsField()).type('Comment for Review Page')
        cy.get(ARDashboardPage.getSubmitBtn()).click()
        cy.get(ARDashboardPage.getSubmitBtn()).should('have.attr', 'aria-disabled', 'true')

        ReviewerReviewPage.getSubmitOrCloseBtn('Submit Review')

        cy.get(ReviewerCompletedModal.getContinueToDashboardBtn()).should('contain', 'Continue to Dashboard')
        cy.get(ReviewerCompletedModal.getContinueToDashboardBtn()).click()
        cy.get(ReviewerCompletedModal.getContinueToDashboardBtn()).should('not.exist')
    })

    it('Log in as the learner 1 and verify review', () =>{
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

        // verify header
        cy.get(LECourseLessonPlayerPage.getEarlyLeavePromptHeader()).should('be.visible').and('contain', 'Course Complete')

        // Status should be Completed
        cy.get(LECourseLessonPlayerPage.getCoursePlayerStatusModule()).eq(0).should('be.visible').and('contain','Status')
        cy.get(LECourseLessonPlayerPage.getCoursePlayerStatusModule()).eq(1).should('be.visible').and('contain','Completed')
        
        cy.get(LECourseLessonPlayerPage.getViewBtn()).should('contain', 'View').click()

        // verify header
        cy.get(LECourseLessonPlayerPage.getEarlyLeavePromptHeader()).should('be.visible').and('contain', 'Lesson Complete')

        // Status should be Completed
        cy.get(LECourseLessonPlayerPage.getCoursePlayerStatusModule()).eq(0).should('be.visible').and('contain','Status')
        cy.get(LECourseLessonPlayerPage.getCoursePlayerStatusModule()).eq(1).should('be.visible').and('contain','Completed')
        
        cy.get(LECourseLessonPlayerPage.getCloseBtn()).click()
        cy.get(LEDashboardPage.getLEEllipsesLoader(), {timeout: 15000}).should('not.exist')
    })

    it('Log in as the learner 2 and verify review', () =>{
        cy.apiLoginWithSession(userDetails.username2, userDetails.validPassword)

        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('My Courses')
        LEDashboardPage.getShortWait()
        cy.get(LEDashboardPage.getLEEllipsesLoader(), {timeout: 15000}).should('not.exist')
        cy.get(LEDashboardPage.getCourseCardName()).contains(ocDetails.courseName).click()

        //Start Lesson
        cy.get(LECourseLessonPlayerPage.getLEWaitSpinner(), {timeout: 15000}).should('not.exist', {timeout: 10000})
        cy.get(LECourseDetailsOCModule.getStartBtn()).should('have.attr', 'aria-disabled', 'false').click()
        cy.get(LEDashboardPage.getLEEllipsesLoader(), {timeout: 15000}).should('not.exist')

        // verify header
        cy.get(LECourseLessonPlayerPage.getEarlyLeavePromptHeader()).should('be.visible').and('contain', 'Course Incomplete')

        // Status should be Completed
        cy.get(LECourseLessonPlayerPage.getCoursePlayerStatusModule()).eq(0).should('be.visible').and('contain','Status')
        cy.get(LECourseLessonPlayerPage.getCoursePlayerStatusModule()).eq(1).should('be.visible').and('contain','Not Complete')
        
        cy.get(LECourseLessonPlayerPage.getViewBtn()).should('contain', 'View').click()

        // verify header
        cy.get(LECourseLessonPlayerPage.getEarlyLeavePromptHeader()).should('be.visible').and('contain', 'Lesson Failed')

        // Status should be Completed
        cy.get(LECourseLessonPlayerPage.getCoursePlayerStatusModule()).eq(0).should('be.visible').and('contain','Status')
        cy.get(LECourseLessonPlayerPage.getCoursePlayerStatusModule()).eq(1).should('be.visible').and('contain','Failed')
        
        cy.get(LECourseLessonPlayerPage.getCloseBtn()).click()
        cy.get(LEDashboardPage.getLEEllipsesLoader(), {timeout: 15000}).should('not.exist')
    })
})


