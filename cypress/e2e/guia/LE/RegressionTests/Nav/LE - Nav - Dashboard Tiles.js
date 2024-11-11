import users from '../../../../../fixtures/users.json'
import courses from '../../../../../fixtures/courses.json'
import miscData from '../../../../../fixtures/miscData.json'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LECourseDetailsOCModule from '../../../../../../helpers/LE/pageObjects/Courses/LECourseDetailsOCModule'
import LEEnrollmentKeyModal from '../../../../../../helpers/LE/pageObjects/Modals/LEEnrollmentKeyModal'
import LEPollsPage from '../../../../../../helpers/LE/pageObjects/Polls/LEPollsPage'
import LEFAQsPage from '../../../../../../helpers/LE/pageObjects/FAQs/LEFAQsPage'
import LENewsPage from '../../../../../../helpers/LE/pageObjects/News/LENewsPage'


describe('LE - Nav - Public Dashboard Tiles', function () {

    it('Verify public catalog carousel cards are visible', () => {
        cy.visit("/")
        cy.url().should('include', '/#/public-dashboard')
        LEDashboardPage.getRibbonCardsByLabelName('Catalog')
    })

})

describe('LE - Nav - Private Dashboard Tiles', function () {

    beforeEach(() => {
        //sign in through public dashboard
        cy.apiLoginWithSession(users.learner01.LEARNER_01_USERNAME, users.learner01.LEARNER_01_PASSWORD)
        //very short wait as we are no longer using the intercept
        LEDashboardPage.getVShortWait()
    })

    it('Verify Billboard Contents', () => {
        cy.url().should('include', '/#/dashboard')
        cy.get(LEDashboardPage.getDashboardPageTitle()).should('contain', 'Welcome, ' + users.learner01.LEARNER_01_FNAME + ' ' + users.learner01.LEARNER_01_LNAME)
    })

    it('Verify Private Catalog ribbon label & cards are visible', () => {
        LEDashboardPage.getMediumWait()
        cy.scrollTo('bottom')
        LEDashboardPage.getShortWait()
        LEDashboardPage.getRibbonLabelByName('Catalog').should('be.visible')
        //Verify cards exist within the ribbon
        LEDashboardPage.getRibbonCardsByLabelName('Catalog')
    })

    it('Verify Resume Courses ribbon label & cards are visible, Verify OC progress', () => {
        LEDashboardPage.getMediumWait()
        LEDashboardPage.getRibbonLabelByName('Resume Courses').should('be.visible')
        LEDashboardPage.getRibbonCardsByLabelName('Resume Courses')
        LEDashboardPage.getRibbonCardByCourseNameThenClick('Resume Courses', courses.OC_LESSON_ACT_OVAS_NAME)
        cy.get(LECourseDetailsOCModule.getCourseProgressPercentText()).should('contain', '25%')
        LECourseDetailsOCModule.getCourseLessonActionBtn(courses.OC_LESSON_ACT_OVAS_OBJECT_NAME, 'Complete')
        LECourseDetailsOCModule.getCourseLessonActionBtn(courses.OC_LESSON_ACT_OVAS_VIDEO_NAME, 'Start')
    })

    it('Verify My Courses ribbon label & card are visible', () => {
        LEDashboardPage.getMediumWait()
        LEDashboardPage.getRibbonLabelByName('My Courses').should('be.visible')
        LEDashboardPage.getRibbonCardsByLabelName('My Courses')
    })

    it('Verify Featured Courses ribbon label & cards are visible', () => {
        LEDashboardPage.getMediumWait()
        LEDashboardPage.getRibbonLabelByName('Featured Courses').should('be.visible')
        LEDashboardPage.getRibbonCardsByLabelName('Featured Courses')
    })

    it('Verify Pinned Courses ribbon label & cards are visible', () => {
        LEDashboardPage.getMediumWait()
        LEDashboardPage.getRibbonLabelByName('My Pinned Courses').should('be.visible')
        LEDashboardPage.getRibbonCardsByLabelName('My Pinned Courses')
    })

    it('Verify Mandatory Courses ribbon label & cards are visible', () => {
        LEDashboardPage.getMediumWait()
        LEDashboardPage.getRibbonLabelByName('Mandatory Courses').should('be.visible')
        LEDashboardPage.getRibbonCardsByLabelName('Mandatory Courses')
    })

    it('Verify Tiles and URLs', () => {
        //Verify Polls tile, content, and URL
        LEDashboardPage.getTileByNameThenClick('Polls & Surveys')
        cy.get(LEPollsPage.getPollsPageTitle()).should('contain', 'Polls & Surveys')
        LEPollsPage.getPollQuestionByName(miscData.POLL_01_TITLE).should('be.visible')
        LEDashboardPage.getShortWait()
        LEPollsPage.getPollQuestionByName(miscData.POLL_02_TITLE).should('be.visible')
        cy.url().should('include', '/#/polls').go('back')

        //Verify FAQ tile, content, and URL
        LEDashboardPage.getTileByNameThenClick('FAQs')
        cy.get(LEFAQsPage.getFAQsPageTitle()).should('contain', 'Frequently Asked Questions')
        LEFAQsPage.getFAQsByTitle(miscData.FAQ_01_TITLE).should('be.visible')
        LEFAQsPage.getFAQsByTitle(miscData.FAQ_02_TITLE).should('be.visible')
        LEFAQsPage.getFAQsByTitle(miscData.FAQ_03_TITLE).should('be.visible')
        cy.url().should('include', '/#/faq').go('back')

        //Verify News tile, content, and URL
        LEDashboardPage.getTileByNameThenClick('Latest News')
        cy.get(LENewsPage.getNewsPageTitle()).should('contain', 'Latest News')
        LENewsPage.getNewsArticleByTitle(miscData.NEWS_ART_01_TITLE).should('be.visible')
        LENewsPage.getNewsArticleByTitle(miscData.NEWS_ART_02_TITLE).should('be.visible')
        LENewsPage.getNewsArticleAuthorByTitle(miscData.NEWS_ART_01_TITLE, users.sysAdmin.ADMIN_SYS_01_FNAME, users.sysAdmin.ADMIN_SYS_01_LNAME)
        LENewsPage.getNewsArticleAuthorByTitle(miscData.NEWS_ART_02_TITLE, users.sysAdmin.ADMIN_SYS_01_FNAME, users.sysAdmin.ADMIN_SYS_01_LNAME)
        cy.url().should('include', '/#/news').go('back')

        //Verify enrollment tile, content, and URL
        LEDashboardPage.getTileByNameThenClick('Enrollment Key')
        cy.get(LEEnrollmentKeyModal.getModalTitle()).should('contain', 'Enrollment Key')
        cy.get(LEEnrollmentKeyModal.getModalBodyTxt()).should('contain', 'Please enter the enrollment key name, then click')
        cy.get(LEEnrollmentKeyModal.getModalCloseBtn()).click()

        //Verify external link tiles will open in new tabs by checking that their target attribute is _blank
        LEDashboardPage.getExternalLinkTileByName('Facebook Feed').should('have.attr', 'target', '_blank')
        LEDashboardPage.getExternalLinkTileByName('Twitter Feed').should('have.attr', 'target', '_blank')
        LEDashboardPage.getExternalLinkTileByName('Course Deep Link').should('have.attr', 'target', '_blank')
        LEDashboardPage.getExternalLinkTileByName('External Link').should('have.attr', 'target', '_blank')

        //Verify tiles and URLs. Content verified in LE Nav - Side Menu.js
        LEDashboardPage.getTileByNameThenClick('My Courses')
        cy.url().should('include', '/#/courses').go('back')
        LEDashboardPage.getTileByNameThenClick('Inbox')
        cy.url().should('include', '#/profile/inbox').go('back')
        LEDashboardPage.getTileByNameThenClick('Resources')
        cy.url().should('include', '/#/resources').go('back')
        LEDashboardPage.getTileByNameThenClick('Catalog')
        cy.url().should('include', '/#/catalog').go('back')
    })

})