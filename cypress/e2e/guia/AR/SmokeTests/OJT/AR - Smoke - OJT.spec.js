/// <reference types="cypress" />
// import miscData from '../../../../../fixtures/miscData.json'
import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arUserPage from '../../../../../../helpers/AR/pageObjects/User/ARUserPage'
import arCoursePage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import arEnrollUsersPage from '../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage'
import arUserAddEditPage from '../../../../../../helpers/AR/pageObjects/User/ARUserAddEditPage'
import arDashboardAccountMenu from '../../../../../../helpers/AR/pageObjects/Menu/ARDashboardAccount.menu'
import arReviewerLearnersPage from '../../../../../../helpers/AR/pageObjects/OJT/ARReviewerLearnersPage'
import ARReviewChecklistPage from '../../../../../../helpers/AR/pageObjects/OJT/ARReviewChecklistPage.js'
import ReviewerReviewPage from '../../../../../../helpers/Reviewer/pageObjects/Pages/ReviewerReviewPage.js'
import ReviewerMarkAsReadyModal from '../../../../../../helpers/Reviewer/pageObjects/Modals/ReviewerMarkAsReadyModal.js'
import ReviewerStepResultPage from '../../../../../../helpers/Reviewer/pageObjects/Pages/ReviewerStepResultPage.js'
import ReviewerStepObservationPage from '../../../../../../helpers/Reviewer/pageObjects/Pages/ReviewerStepObservationPage.js'
import ReviewerStepRatingPage from '../../../../../../helpers/Reviewer/pageObjects/Pages/ReviewerStepRatingPage.js'
import ReviewerBottomToolbar from '../../../../../../helpers/Reviewer/pageObjects/Menu/ReviewerBottomToolbar.js'
import ReviewerCompletedModal from '../../../../../../helpers/Reviewer/pageObjects/Modals/ReviewerCompletedModal.js'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage.js'
import LESideMenu from '../../../../../../helpers/LE/pageObjects/Menu/LESideMenu'
import LETranscriptPage from '../../../../../../helpers/LE/pageObjects/User/LETranscriptPage'
import ARObservationChecklistsPage from '../../../../../../helpers/AR/pageObjects/OJT/ARObservationChecklistsPage'
import ARObservationChecklistActivitiesPage from '../../../../../../helpers/AR/pageObjects/OJT/ARObservationChecklistActivitiesPage'
import AROJTUserChecklistSummaryPage from '../../../../../../helpers/AR/pageObjects/OJT/AROJTUserChecklistSummaryPage'
import { courses } from '../../../../../../helpers/TestData/Courses/courses'
import { miscData } from '../../../../../../helpers/TestData/Misc/misc'
import { users } from '../../../../../../helpers/TestData/users/users'
import { ojtDetails } from '../../../../../../helpers/TestData/OJT/ojtDetails'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'

// let timestamp = arUserPage.getTimeStamp();
// const OJT_USER_FNAME_PREFIX = 'GUIA';
// const OJT_USER_LNAME_PREFIX = 'OJT-User';

// -------TestData---------------

// const OJT_USER_NAME_PREFIX = 'GUIA-OJT-USER-';
// const OJT_USER_NAME = `${OJT_USER_NAME_PREFIX}.${timestamp}`;
// const OJT_USER_FNAME = `${OJT_USER_FNAME_PREFIX}.${timestamp}`;
// const OJT_USER_LNAME = `${OJT_USER_LNAME_PREFIX}.${timestamp}`;
// let userID;

describe('AR - Smoke - OJT', function () {

    before(function () {
        cy.createUser(void 0, ojtDetails.userName, ["Learner"], void 0)
    })

    after(function() {
     cy.deleteUser(commonDetails.userID);
    })
    
    beforeEach(function() {
        //Login as reviewer
        cy.loginAdmin(users.reviewer.reviewer_username, users.reviewer.reviewer_password)
    })

    it('Enroll the user in to OJT course', () => {
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        cy.intercept('/**/reports/courses/operations').as('getCourses').wait('@getCourses')
        arEnrollUsersPage.getEnrollUserByCourseAndUsername([courses.oc_filter_04_ojt], [ojtDetails.userName])
      });
    
    it('verify enrollments to OJT course exist', function() {
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Users'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Users'))
        cy.intercept('**/users/operations').as('getUser').wait('@getUser');
        cy.wrap(arUserPage.AddFilter('Username', 'Contains', ojtDetails.userName))
        arUserPage.getShortWait()
        cy.get(arUserPage.getTableCellName(4)).contains(ojtDetails.userName).click()
        cy.wrap(arUserPage.WaitForElementStateToChange(arUserPage.getAddEditMenuActionsByName('Edit User'), 1000))
        cy.get(arUserPage.getAddEditMenuActionsByName('Edit User')).click()
        cy.intercept('/api/rest/v2/admin/reports/departments').as('getUser').wait('@getUser')
        cy.get(arUserAddEditPage.getFirstNameTxtF()).clear().type(ojtDetails.user_fname_pefix + commonDetails.timestamp)
        cy.get(arUserAddEditPage.getLastNameTxtF()).clear().type(ojtDetails.user_lname_prefix + commonDetails.timestamp)
        cy.url().then((currentUrl) => { 
            commonDetails.userID = currentUrl.slice(-36)      
        })
        cy.get(arUserAddEditPage.getSaveBtn()).click()
        cy.wrap(arUserPage.WaitForElementStateToChange(arUserPage.getAddEditMenuActionsByName('View Enrollments'), 1000))
        cy.get(arUserPage.getAddEditMenuActionsByName('View Enrollments')).click()
        cy.intercept('/**/reports/user-enrollments/operations').as('getUserEnrollments').wait('@getUserEnrollments')
        cy.get(arUserPage.getTableCellRecord()).contains(courses.oc_filter_04_ojt).should('exist')
    });

 it('Start and submit review', function() {
        cy.get(arDashboardPage.getElementByDataNameAttribute(arDashboardPage.getAccountBtn())).click()
        arDashboardAccountMenu.getLearnerOrReviewerExperienceBtnByName('Reviewer Experience')
        cy.get(arReviewerLearnersPage.getElementByDataName(arReviewerLearnersPage.getReviewerPageTitle())).contains(`Learners`)
        cy.wrap(arReviewerLearnersPage.getThemedToggleBtn('Not Ready'))
        cy.get(arReviewerLearnersPage.getLearnerSearchTxtF()).type(`${ojtDetails.user_fname_pefix + commonDetails.timestamp} ${ojtDetails.user_lname_prefix + commonDetails.timestamp}`)
        arReviewerLearnersPage.getShortWait()
        cy.get(arReviewerLearnersPage.getReviewerNameList()).contains(`${ojtDetails.user_fname_pefix + commonDetails.timestamp} ${ojtDetails.user_lname_prefix + commonDetails.timestamp}`).should('exist')
        cy.get(arReviewerLearnersPage.getReviewerNameList()).contains(`${ojtDetails.user_fname_pefix + commonDetails.timestamp} ${ojtDetails.user_lname_prefix + commonDetails.timestamp}`).click()
        cy.get(ARReviewChecklistPage.getLearnerNameLabel()).contains(`${ojtDetails.user_fname_pefix + commonDetails.timestamp} ${ojtDetails.user_lname_prefix + commonDetails.timestamp}`).should('be.visible')
        cy.get(ARReviewChecklistPage.getReviewerCourseLabel()).contains(courses.oc_filter_04_ojt).click()
        cy.get(ReviewerMarkAsReadyModal.getMarkReadyStartReviewBtn()).click()
        cy.get(ReviewerReviewPage.getStep('1', '1')).click()
        ReviewerStepResultPage.getReviewListBtn('Yes')
        cy.get(ReviewerStepResultPage.getCommentsField()).click()
        cy.get(ReviewerStepResultPage.getCommentsField()).type('Comment for Step Result Section')
        cy.get(ReviewerStepResultPage.getPostBtn()).click()
        cy.get(ReviewerBottomToolbar.getNextBtn()).click()
        cy.get(ReviewerStepObservationPage.getObservationTextArea()).click()
        cy.get(ReviewerStepObservationPage.getObservationTextArea()).type('Observation Section input')
        cy.get(ReviewerStepObservationPage.getObservationPostBtn()).click()
        cy.get(ReviewerStepObservationPage.getCommentsField()).click()
        cy.get(ReviewerStepObservationPage.getCommentsField()).type('Comment for Observation Section')
        cy.get(ReviewerStepObservationPage.getCommentsPostBtn()).click()
        cy.get(ReviewerBottomToolbar.getNextBtn()).click()
        cy.get(ReviewerStepRatingPage.getRatingDDown()).click()
        cy.get(ReviewerStepRatingPage.getRatingDDownOpt('3')).click()
        cy.get(ReviewerStepRatingPage.getCommentsField()).click()
        cy.get(ReviewerStepRatingPage.getCommentsField()).type('Comment for Rating Section')
        cy.get(ReviewerStepRatingPage.getCommentsPostBtn()).click()
        cy.get(ReviewerBottomToolbar.getNextBtn()).click()
        cy.get(ReviewerReviewPage.getElementByDataNameAttribute(ReviewerReviewPage.getPassBtn())).click()
        cy.get(ReviewerReviewPage.getCommentsField()).click()
        cy.get(ReviewerReviewPage.getCommentsField()).type('Comment for Review Page')
        ReviewerReviewPage.getPostBtn()
        ReviewerReviewPage.getSubmitOrCloseBtn('Submit Review')
        cy.get(ReviewerCompletedModal.getContinueToDashboardBtn()).click()
    });

 it('Verify enrollment status for a completed OJT review', function() {
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Users'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Users'))
        cy.intercept('**/users/operations').as('getUser').wait('@getUser');
        cy.wrap(arUserPage.AddFilter('Username', 'Starts With', ojtDetails.userName))
        cy.wrap(arUserPage.selectTableCellRecord(ojtDetails.userName))
        cy.wrap(arUserPage.WaitForElementStateToChange(arUserPage.getAddEditMenuActionsByName('Impersonate'), 5000))
        cy.get(arUserPage.getAddEditMenuActionsByName('Impersonate')).click()
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('Transcript')
        cy.get(LETranscriptPage.getUsername()).should('contain', ojtDetails.userName)
        LETranscriptPage.getCertificateByCourseName(courses.oc_filter_04_ojt)
        LETranscriptPage.getCompetencyByCompetencyName(miscData.competency_01)
        LETranscriptPage.getCourseCompletionStatusByCourseName(courses.oc_filter_04_ojt, 'Complete')
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('Stop Impersonating') 
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Observation Checklists'))
        cy.wrap(ARObservationChecklistsPage.EnrollmentPageFilter(courses.oc_filter_04_ojt))
        cy.wrap(ARObservationChecklistsPage.selectTableCellRecord('GUIA_Test'))
        cy.wrap(ARObservationChecklistsPage.WaitForElementStateToChange(ARObservationChecklistsPage.getAddEditMenuActionsByName('Observation Checklist Activity')), 1000)
        cy.get(ARObservationChecklistsPage.getAddEditMenuActionsByName('Observation Checklist Activity')).click()
        cy.wrap(ARObservationChecklistsPage.WaitForElementStateToChange(ARObservationChecklistsPage.getAddEditMenuActionsByName('Observation Checklist Activity'), 2000))
        cy.wrap(ARObservationChecklistsPage.AddFilter('First Name', 'Equals', ojtDetails.user_fname_pefix + commonDetails.timestamp))
        cy.wrap(ARObservationChecklistActivitiesPage.selectTableCellRecord(ojtDetails.user_fname_pefix + commonDetails.timestamp))
        cy.wrap(ARObservationChecklistActivitiesPage.WaitForElementStateToChange(ARObservationChecklistActivitiesPage.getAddEditMenuActionsByName('Checklist Summary'), 2000))
        cy.get(ARObservationChecklistActivitiesPage.getAddEditMenuActionsByName('Checklist Summary')).click()
        cy.intercept('**/user-checklist-steps').as('getReviewer').wait('@getReviewer')
        cy.get(AROJTUserChecklistSummaryPage.getNameField()).contains(`${ojtDetails.user_fname_pefix + commonDetails.timestamp} ${ojtDetails.user_lname_prefix + commonDetails.timestamp}`).should('exist')
        cy.get(AROJTUserChecklistSummaryPage.getOverallComments() ).contains('Comment for Review Page').should('exist')
        cy.get(AROJTUserChecklistSummaryPage.getReviewResult() ).contains('Final Result of Review: Pass').should('exist')
    });
})







