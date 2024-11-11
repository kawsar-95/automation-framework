import courses from '../../../../../fixtures/courses.json'
import DefaultTestData from '../../../../../fixtures/defaultTestData.json'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LESideMenu from '../../../../../../helpers/LE/pageObjects/Menu/LESideMenu'
import LEFilterMenu from '../../../../../../helpers/LE/pageObjects/Menu/LEFilterMenu'
import LEProfilePage from '../../../../../../helpers/LE/pageObjects/User/LEProfilePage'
import LECourseDetailsModal from '../../../../../../helpers/LE/pageObjects/Modals/LECourseDetails.modal'

let timestamp = LEDashboardPage.getTimeStamp()
let username = 'GUIA-SEARCH-USER-' + timestamp
let userID;

let courseAbrv = ['OC', 'ILC', 'Curriculum'];
let courseNames = [courses.OC_FILTER_01_NAME, courses.ILC_FILTER_01_NAME, courses.CURR_FILTER_01_NAME];


describe('LE - Find Courses - Course Pins', function(){

    before(function() {
        //Create a new user
        cy.createUser(void 0, username, ["Learner"], void 0)
    })

    beforeEach(() => {
        //Login before each test
        cy.apiLoginWithSession(username, DefaultTestData.USER_PASSWORD)
    })

    after(function() {
        //Cleanup - Get userID, logout, and delete them
        cy.get(LEDashboardPage.getNavProfile()).click()  
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
        cy.url().then((currentURL) => {
            cy.deleteUser(currentURL.slice(-36));
        })
    })

    //Loop through each course type
    for (let i = 0; i < courseNames.length; i++) {

        it(`Search Catalog For ${courseAbrv[i]} Course and Pin Course`, () => {
            cy.get(LEDashboardPage.getNavMenu()).click()
            LESideMenu.getLEMenuItemsByNameThenClick('Catalog')
            LEFilterMenu.SearchForCourseByName(courseNames[i])
            LEDashboardPage.getMediumWait()
            //Pin course
            LEDashboardPage.getCourseCardPinBtnThenClick(courseNames[i])
            LEDashboardPage.getShortWait()
        })
    
        it(`Verify Pinned ${courseAbrv[i]} Course Appears First in the Catalog`, () => {
            cy.get(LEDashboardPage.getNavMenu()).click()
            LESideMenu.getLEMenuItemsByNameThenClick('Catalog')
            LEDashboardPage.getMediumWait()
            LEDashboardPage.getVerifyCourseCardPositionAndName(0, courseNames[i])
        })
    
        it(`Verify Pinned ${courseAbrv[i]} Course Appears in the Dashboard Pinned Courses Ribbon`, () => {
            cy.window().scrollTo('bottom')
            LEDashboardPage.getLShortWait()
            //Verify course exists in the pinned courses ribbon
            LEDashboardPage.getRibbonCardByCourseNameThenClick('My Pinned Courses', courseNames[i])
            //Unpin course
            LECourseDetailsModal.getCoursePinBtnThenClick()
            LEDashboardPage.getLShortWait()
            cy.get(LECourseDetailsModal.getModalCloseBtn()).click()
        })
    }
})