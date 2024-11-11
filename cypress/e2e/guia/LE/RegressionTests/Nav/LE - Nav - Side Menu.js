import users from '../../../../../fixtures/users.json'
import courses from '../../../../../fixtures/courses.json'
import miscData from '../../../../../fixtures/miscData.json'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LESideMenu from '../../../../../../helpers/LE/pageObjects/Menu/LESideMenu'
import LECoursesPage from '../../../../../../helpers/LE/pageObjects/Courses/LECoursesPage'
import LEFilterMenu from '../../../../../../helpers/LE/pageObjects/Menu/LEFilterMenu'
import LECatalogPage from '../../../../../../helpers/LE/pageObjects/Catalog/LECatalogPage'
import LEResourcesPage from '../../../../../../helpers/LE/pageObjects/Resources/LEResourcesPage'
import LECalendarPage from '../../../../../../helpers/LE/pageObjects/Courses/LECalendarPage'
import LETranscriptPage from '../../../../../../helpers/LE/pageObjects/User/LETranscriptPage'


describe('LE - Nav - Side Menu', function () {


    beforeEach(() => {
        //sign in before each test block
        cy.apiLoginWithSession(users.learner01.LEARNER_01_USERNAME, users.learner01.LEARNER_01_PASSWORD, "#/login")
    })

    it('Navigation Side Menu - Verify Contents & Click Dashboard', () => {
        cy.get(LEDashboardPage.getNavMenu()).should('be.visible').click()
        LESideMenu.getLEMenuItemsByName('Dashboard').should('be.visible')
        LESideMenu.getLEMenuItemsByName('My Courses').should('be.visible')
        LESideMenu.getLEMenuItemsByName('Catalog').should('be.visible')
        LESideMenu.getLEMenuItemsByName('Resources').should('be.visible')
        LESideMenu.getLEMenuItemsByName('Calendar').should('be.visible')
        LESideMenu.getLEMenuItemsByName('Transcript').should('be.visible')
        LESideMenu.getLEMenuItemsByName('Profile').should('be.visible')
        LESideMenu.getLEMenuItemsByName('Log Off').should('be.visible')
        //Contents verified, click dashboard button and assert URL
        LESideMenu.getLEMenuItemsByName('Dashboard').click()
        cy.url().should('include', '/#/dashboard')
    })

    it('Click My Courses - Verify URL & Page Contents', () => {
        cy.get(LEDashboardPage.getNavMenu()).should('be.visible').click()
        LESideMenu.getLEMenuItemsByNameThenClick('My Courses')
        cy.url().should('include', '/#/courses/')
        cy.get(LECoursesPage.getCoursesPageTitle()).should('contain', 'My Courses')
        cy.get(LECoursesPage.getCourseCardName(), {timeout: 5000}).should('contain', courses.OC_LESSON_ACT_OVAS_NAME)
        cy.get(LEFilterMenu.getFilterBtn()).should('be.visible').click()
        cy.get(LEFilterMenu.getHideRefineSearchTxt()).should('be.visible')
        cy.get(LEFilterMenu.getShowCategoriesTxt()).should('be.visible')
        cy.get(LEFilterMenu.getShowCompletedTxt()).should('be.visible')
        cy.get(LEFilterMenu.getOCChkBox()).should('be.visible').click()
        cy.get(LEFilterMenu.getILCChkBox()).should('be.visible').click()
        cy.get(LEFilterMenu.getCURRChkBox()).should('be.visible').click()
        cy.get(LEFilterMenu.getSearchFilterTxtF()).should('be.visible').type('test')
        cy.get(LEFilterMenu.getSearchFilterBtn()).should('be.visible').click()
        cy.get(LEFilterMenu.getAdvancedFilterDDown()).should('be.visible')
    })

    it('Click My Catalog - Verify URL & Page Contents', () => {
        cy.get(LEDashboardPage.getNavMenu()).should('be.visible').click()
        LESideMenu.getLEMenuItemsByNameThenClick('Catalog')
        cy.url().should('include', '#/catalog/')
        cy.get(LECatalogPage.getCatalogPageTitle()).should('contain', 'Catalog')
        cy.get(LECatalogPage.getSortDDown()).should('be.visible').click()
        cy.get(LEFilterMenu.getFilterBtn()).should('be.visible').click()
        cy.get(LEFilterMenu.getHideRefineSearchTxt()).should('be.visible')
        cy.get(LEFilterMenu.getShowCategoriesTxt()).should('be.visible')
        cy.get(LEFilterMenu.getOCChkBox()).should('be.visible').click()
        cy.get(LEFilterMenu.getILCChkBox()).should('be.visible').click()
        cy.get(LEFilterMenu.getCURRChkBox()).should('be.visible').click()
        cy.get(LEFilterMenu.getCBChkBox()).should('be.visible').click()
        LEFilterMenu.SearchForCourseByName(courses.OC_LESSON_ACT_OVAS_NAME)
        cy.get(LECoursesPage.getCourseCardName()).should('contain', courses.OC_LESSON_ACT_OVAS_NAME)
        cy.get(LEFilterMenu.getAdvancedFilterDDown()).should('be.visible')

    })

    it('Click Resources - Verify URL & Page Contents', () => {
        cy.get(LEDashboardPage.getNavMenu()).should('be.visible').click()
        LESideMenu.getLEMenuItemsByNameThenClick('Resources')
        cy.url().should('include', '#/resources')
        cy.get(LEResourcesPage.getResourcesPageTitle()).should('contain', 'Resources')
        LEFilterMenu.getSearchForResourceByName(miscData.RESOURCE_GLOBAL_01)
        cy.get(LEResourcesPage.getResourceName(), {timeout: 3000}).should('contain', miscData.RESOURCE_GLOBAL_01)
        cy.get(LEResourcesPage.getViewBtn()).should('be.visible')
        cy.get(LEResourcesPage.getClearResourceName()).click()
        //Filter menu begins in an expanded state in the resources page 
        cy.get(LEFilterMenu.getHideRefineSearchTxt()).should('be.visible')
        cy.get(LEFilterMenu.getSearchFilterTxtF()).should('be.visible').type('test')
        cy.get(LEFilterMenu.getSearchFilterBtn()).should('be.visible').click()
        cy.get(LEFilterMenu.getTagsDDown()).should('be.visible').click()
    })

    it('Click Calendar - Verify URL & Page Contents', () => {
        cy.get(LEDashboardPage.getNavMenu()).should('be.visible').click()
        LESideMenu.getLEMenuItemsByNameThenClick('Calendar')
        cy.url().should('include', '#/courses/?viewType=Calendar')
        cy.get(LECalendarPage.getCalendarPageTitle()).should('contain', 'My Courses')
        cy.get(LECalendarPage.getViewBtn()).should('be.visible')
        cy.get(LECalendarPage.getCalendarMonthYearBtn()).should('be.visible').click()
        cy.get(LECalendarPage.getCalendarPrevMonthBtn()).should('be.visible').click()
        cy.get(LECalendarPage.getCalendarNextMonthBtn()).should('be.visible').click()
        cy.get(LECalendarPage.getCalendarDayofMonth()).should('be.visible')
    })

    it('Click Transcript - Verify URL & Page Contents', () => {
        cy.get(LEDashboardPage.getNavMenu()).should('be.visible').click()
        LESideMenu.getLEMenuItemsByNameThenClick('Transcript')
        cy.url().should('include', '#/transcript')
        cy.get(LETranscriptPage.getTranscriptPageTitle()).should('contain', 'Transcript for ' + users.learner01.LEARNER_01_FNAME + ' ' + users.learner01.LEARNER_01_LNAME)
        cy.get(LETranscriptPage.getUsername()).should('contain', users.learner01.LEARNER_01_USERNAME)
        cy.get(LETranscriptPage.getEmail()).should('contain', users.learner01.LEARNER_01_EMAIL)
        cy.get(LETranscriptPage.getPrintTranscriptBtn()).should('be.visible')
    })

    it('Click Profile - Verify URL', () => {
        cy.get(LEDashboardPage.getNavMenu()).should('be.visible').click()
        LESideMenu.getLEMenuItemsByNameThenClick('Profile')
        cy.url().should('include', '#/profile')
        //Profile page elements verified in LE Nav - Top Toolbar.js
    })

    it('Click Log out - Verify Log Off & URL', () => {
        cy.get(LEDashboardPage.getNavMenu()).should('be.visible').click()
        LESideMenu.getLEMenuItemsByNameThenClick('Log Off')
        cy.url().should('include', '#/public-dashboard')
    })
})

