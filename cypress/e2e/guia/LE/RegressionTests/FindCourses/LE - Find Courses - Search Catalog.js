import courses from '../../../../../fixtures/courses.json'
import miscData from '../../../../../fixtures/miscData.json'
import DefaultTestData from '../../../../../fixtures/defaultTestData.json'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LECoursesPage from '../../../../../../helpers/LE/pageObjects/Courses/LECoursesPage'
import LESideMenu from '../../../../../../helpers/LE/pageObjects/Menu/LESideMenu'
import LEFilterMenu from '../../../../../../helpers/LE/pageObjects/Menu/LEFilterMenu'
import LECourseDetailsModal from '../../../../../../helpers/LE/pageObjects/Modals/LECourseDetails.modal'
import LEProfilePage from '../../../../../../helpers/LE/pageObjects/User/LEProfilePage'

let timestamp = LEDashboardPage.getTimeStamp()
let username = 'GUIA-SEARCH-USER-' + timestamp

describe('LE - Find Courses - Search Catalog - Public Catalog', function(){

    it('Go to Public Catalog, Search For OC Course with Course Name Filter & Verify Details Can be Viewed', () => {
        cy.visit("/#/public-dashboard")
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('Catalog')
        LEFilterMenu.SearchForCourseByName(courses.OC_FILTER_01_NAME)
        LEDashboardPage.getMediumWait()
        cy.get(LECoursesPage.getCourseCardName()).should('contain', courses.OC_FILTER_01_NAME).click()
        cy.get(LECourseDetailsModal.getCourseName()).should('contain', courses.OC_FILTER_01_NAME)
    })
})

describe('LE - Find Courses - Search Catalog - Private Catalog', function(){

    before(function() {
        //Create a new user
        cy.createUser(void 0, username, ["Learner"], void 0)
    })

    beforeEach(() => {
        //Login, go to catalog, and open the filter menu before each test
        cy.apiLoginWithSession(username, DefaultTestData.USER_PASSWORD)
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('Catalog')
    })

    after(function() {
        //Cleanup - Get userID, logout, and delete them
        cy.get(LEDashboardPage.getNavProfile()).click()  
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
        cy.url().then((currentURL) => {
            cy.deleteUser(currentURL.slice(-36));
        })
    })

    it('Search For OC Course with Course Name Filter & Verify Details Can be Viewed', () => {
        LEFilterMenu.SearchForCourseByName(courses.OC_FILTER_01_NAME)
        LEDashboardPage.getMediumWait()
        cy.get(LECoursesPage.getCourseCardName()).should('contain', courses.OC_FILTER_01_NAME).eq(0).click()
        cy.get(LECourseDetailsModal.getCourseName()).should('contain', courses.OC_FILTER_01_NAME)
    })

    it('Search For Invalid Course with Course Name Filter & Verify Error Message', () => {
        LEFilterMenu.SearchForCourseByName('This course does not exist')
        LEDashboardPage.getMediumWait()
        LEDashboardPage.getSearchCourseNotFoundMsg()
    })

    it('Search For OC Course with Advanced Filter (Tags) & Verify Details Can be Viewed', () => {
        cy.get(LEFilterMenu.getAdvancedFilterDDown()).select('Tags')
        cy.get(LEFilterMenu.getTagsDDown()).click()
        cy.get(LEFilterMenu.getSelectTagFromDDown()).contains(miscData.AUTO_TAG1).click()
        LEFilterMenu.SearchForCourseByName(courses.OC_FILTER_01_NAME)
        LEDashboardPage.getMediumWait()
        cy.get(LECoursesPage.getCourseCardName()).should('contain', courses.OC_FILTER_01_NAME).click()
        cy.get(LECourseDetailsModal.getCourseName()).should('contain', courses.OC_FILTER_01_NAME)
        cy.get(LECourseDetailsModal.getModalCloseBtn()).click()
    })
})