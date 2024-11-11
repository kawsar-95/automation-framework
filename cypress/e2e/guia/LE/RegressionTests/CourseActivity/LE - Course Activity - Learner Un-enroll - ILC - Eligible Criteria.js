import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LESideMenu from '../../../../../../helpers/LE/pageObjects/Menu/LESideMenu'
import LEProfilePage from '../../../../../../helpers/LE/pageObjects/User/LEProfilePage'
import LECourseLessonPlayerPage from '../../../../../../helpers/LE/pageObjects/Courses/LECourseLessonPlayerPage'
import LECourseDetailsOCModule from '../../../../../../helpers/LE/pageObjects/Courses/LECourseDetailsOCModule'
import LECourseDetailsILCModule from '../../../../../../helpers/LE/pageObjects/Courses/LECourseDetailsILCModule'
import LELearnerUnenrollModal from '../../../../../../helpers/LE/pageObjects/Modals/LELearnerUnenroll.modal'
import LEFilterMenu from '../../../../../../helpers/LE/pageObjects/Menu/LEFilterMenu'
import { userDetails } from '../../../../../../helpers/TestData/users/UserDetails'
import { courses } from "../../../../../../helpers/TestData/Courses/courses";
import arDashboardAccountMenu from '../../../../../../helpers/AR/pageObjects/Menu/ARDashboardAccount.menu'
import AREditClientUserPage from '../../../../../../helpers/AR/pageObjects/PortalSettings/AREditClientUserPage'
import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import { users } from '../../../../../../helpers/TestData/users/users'

describe('LE - Course Activity - Learner Un-enroll - ILC - Eligible Criteria', function () {

    before(function () {
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0);
        //Signin with system admin and turn off next gen toggle
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        LEDashboardPage.turnOffNextgenToggle()
    })

    after(function() {
        //Cleanup - Get userID, logout, and delete them
        cy.get(LEDashboardPage.getNavProfile()).click()  
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
        cy.url().then((currentURL) => {
            cy.deleteUser(currentURL.slice(-36));
        })
    })

    beforeEach(() => {
        //Login and go to the course before each test
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        cy.get(LEDashboardPage.getNavMenu()).click() 
        LESideMenu.getLEMenuItemsByNameThenClick('Catalog')
        LEFilterMenu.SearchForCourseByName(courses.ilc_03_learner_unenroll_name)
        LEDashboardPage.getCourseCardBtnThenClick(courses.ilc_03_learner_unenroll_name)
    })

    it('Verify a user can Unenroll from an ILC in the Not Started status', () => {
        cy.get(LECourseDetailsILCModule.getLEWaitSpinner()).should('not.exist')
        //cy.get(LECourseDetailsILCModule.getEnrollBtn()).should('contain', 'Choose Sessions').click()
        cy.get(LECourseDetailsILCModule.getSessionContainer()).within(()=>{
            cy.get(LECourseDetailsILCModule.getEnrollBtn()).click()
        })
        cy.get(LECourseLessonPlayerPage.getLEWaitSpinner(), {timeout:10000}).should('not.exist')
        cy.get(LECourseDetailsILCModule.getOverflowMenuBtn()).should('be.visible').click()
        LECourseDetailsOCModule.getOverflowMenuOptThenClick('Unenroll from Course')
        cy.get(LELearnerUnenrollModal.getUnenrollBtn()).click()
        cy.get(LECourseDetailsILCModule.getToastNotificationMsg()).should('contain', 'Unenrolled successfully.')
        cy.get(LECourseDetailsILCModule.getToastNotificationCloseBtn()).click({multiple:true})
        cy.get(LECourseDetailsILCModule.getToastNotificationMsg()).should('not.be.visible')
        LEFilterMenu.SearchForCourseByName(courses.ilc_03_learner_unenroll_name)
        cy.get(LEDashboardPage.getCourseCardName()).should('not.exist')
    })     

})

