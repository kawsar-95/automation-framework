import users from '../../../../../fixtures/users.json'
import courses from '../../../../../fixtures/courses.json'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LESideMenu from '../../../../../../helpers/LE/pageObjects/Menu/LESideMenu'
import LEManageTemplatePublicDashboardPage from '../../../../../../helpers/LE/pageObjects/Template/LEManageTemplatePublicDashboardPage'
import LEManageTemplateMenu from '../../../../../../helpers/LE/pageObjects/Template/LEManageTemplateMenu'
import LEManageTemplateContainerItems from '../../../../../../helpers/LE/pageObjects/Template/LEManageTemplateTiles'
import LEEditTileModal from '../../../../../../helpers/LE/pageObjects/Modals/LEEditTile.modal'
import LECoursesPage from '../../../../../../helpers/LE/pageObjects/Courses/LECoursesPage'


describe('LE - Nav - Deeplink Tiles', function () {

    before('Disable NextGen Learner Experience', () => {
        cy.apiLoginWithSession(users.sysAdmin.ADMIN_SYS_01_USERNAME, users.sysAdmin.ADMIN_SYS_01_PASSWORD, '/admin')
        LEDashboardPage.turnOffNextgenToggle()
    })

    beforeEach(() => {
        //Log in and navigate to manage template before each test
        cy.apiLoginWithSession(users.sysAdmin.ADMIN_SYS_01_USERNAME, users.sysAdmin.ADMIN_SYS_01_PASSWORD, "#/login")
        cy.get(LEDashboardPage.getNavMenu()).should('be.visible').click()
        //Need to scroll to bottom of side menu to see template button
        cy.get(LESideMenu.getSideMenu()).should('be.visible').scrollTo('bottom')
        LESideMenu.getLEMenuItemsByNameThenClick('Manage Template')
    })

    it('Manage Template - Public Dashboard tab - Delete Tiles from previous runs & add new ones', () => {
        LEManageTemplateMenu.getManageTemplateMenuItemsByName('Public Dashboard').should('be.visible').click()
        cy.url().should('include', '/#/learner-mgmt/public-dashboard')
        LEManageTemplatePublicDashboardPage.getManageTemplatePublicDashContainerByNameThenClick('Content')
        //Wait till expanded container loads then scroll to bottom
        cy.window().scrollTo('bottom')

        //Delete both existing tiles
        LEManageTemplateContainerItems.getTileDeleteBtnByLabelandTileName('GUIA - Nav - Deeplink Tile', 'Hyperlink')
        LEManageTemplateContainerItems.getTileDeleteBtnByLabelandTileName('GUIA - Nav - Deeplink Tile', 'Hyperlink')

        //Add new deeplink tiles
        LEManageTemplateContainerItems.getAddNewTile('GUIA - Nav - Deeplink Tile', 'Hyperlink')
        LEManageTemplateContainerItems.getAddNewTile('GUIA - Nav - Deeplink Tile', 'Hyperlink')

        //Edit Tile 1 and add info to OC course
        LEManageTemplateContainerItems.getTileEditBtnByLabelNameAndIndex('GUIA - Nav - Deeplink Tile', 7)
        //Add random number to end of title so a save is triggered each run
        cy.get(LEEditTileModal.getTitleTxtField()).type('GUIA - Nav - Deeplink Tile 1 - My Courses' + Math.floor(Math.random() * 100))
        cy.get(LEEditTileModal.getLinkTxtField()).type(Cypress.config('baseUrl') + '#/online-courses/' + Cypress.env('COURSE_OC_02_ADMIN_APPROVAL_ID'))
        cy.get(LEEditTileModal.getTargetDDown()).select('_self')
        cy.get(LEEditTileModal.getSaveBtn()).click()

        //Edit Tile 2 and add info to my courses
        LEManageTemplateContainerItems.getTileEditBtnByLabelNameAndIndex('GUIA - Nav - Deeplink Tile', 8)
        cy.get(LEEditTileModal.getTitleTxtField()).type('GUIA - Nav - Deeplink Tile 2 - My Courses' + Math.floor(Math.random() * 100))
        cy.get(LEEditTileModal.getLinkTxtField()).type(Cypress.config('baseUrl') + '#/courses')
        cy.get(LEEditTileModal.getTargetDDown()).select('_self')
        cy.get(LEEditTileModal.getSaveBtn()).click()

        //Save changes
        cy.get(LEManageTemplateContainerItems.getContainerSaveBtn(), { timeout: 15000 }).click()
    })
})


describe('LE - Nav - Deeplink Tiles - Verify Errors', function () {

    it('OC Via Tile - Click OC Deeplink tile, Verify Error & URL', () => {
        //Visit public dashboard and do not login
        cy.visit('/')
        //Wait till expanded container loads then scroll to bottom
        cy.window().scrollTo('bottom')
        LEDashboardPage.getExternalLinkTileByName('GUIA - Nav - Deeplink Tile 1').click()
        LEDashboardPage.getCatalogCourseNotFoundErrorMsg()
        cy.url().should('include', '#/catalog')
    })

    it('My Courses Via Tile - Click My Courses Deeplink tile & Verify URL', () => {
        //Visit public dashboard and do not login
        cy.visit('/')
        //Wait till expanded container loads then scroll to bottom
        cy.window().scrollTo('bottom')
        LEDashboardPage.getExternalLinkTileByName('GUIA - Nav - Deeplink Tile 2').click()
        cy.url().should('include', '/#/public-dashboard')
    })
})

describe('LE - Nav - Deeplink Tiles - Navigate Directly to Deeplinks', function () {

    it('ILC via Deeplink, Verify Error & Redirect', () => {
        //Verify catalog error message when using deeplink to ILC course
        cy.visit('/#/instructor-led-courses/' + Cypress.env('COURSE_ILC_02_ADMIN_APPROVAL_ID'))
        LEDashboardPage.getCatalogCourseNotFoundErrorMsg()
        cy.url().should('include', '#/catalog')
        //Login and verify user is redirected to the deeplink ILC course
        cy.get(LEDashboardPage.getPublicDashboardLoginBtn()).click()
        cy.get(LEDashboardPage.getUsernameTxtF()).type(users.learner01.LEARNER_01_USERNAME)
        cy.get(LEDashboardPage.getPasswordTxtF()).type(users.learner01.LEARNER_01_PASSWORD)
        cy.get(LEDashboardPage.getLoginBtn(), { timeout: 15000 }).contains('Login').click()
        cy.visit(`/#/catalog?name=${courses.ILC_FILTER_01_NAME}`)
        cy.get(LEDashboardPage.getCourseTitleBtn(), {timeout: 15000}).contains(courses.ILC_FILTER_01_NAME)
    })

    it('OC via Deeplink, Verify Error & Redirect', () => {
        //Verify catalog error message when using deeplink to OC course
        cy.visit('/#/online-courses/' + Cypress.env('COURSE_OC_02_ADMIN_APPROVAL_ID'))
        LEDashboardPage.getCatalogCourseNotFoundErrorMsg()
        cy.url().should('include', '#/catalog')
        //Login and verify user is redirected to the deeplink OC course
        cy.get(LEDashboardPage.getPublicDashboardLoginBtn()).click()
        cy.get(LEDashboardPage.getUsernameTxtF()).type(users.learner01.LEARNER_01_USERNAME)
        cy.get(LEDashboardPage.getPasswordTxtF()).type(users.learner01.LEARNER_01_PASSWORD)
        cy.get(LEDashboardPage.getLoginBtn(), { timeout: 15000 }).contains('Login').click()
        cy.get(LECoursesPage.getCourseTitleWhenNextGenDisabled(), { timeout: 15000 }).contains(courses.OC_02_ADMIN_APPROVAL_NAME)
    })

    it('Curriculum via Deeplink, Verify Error & Redirect', () => {
        //Verify catalog error message when using deeplink to curricula course
        cy.visit('/#/curricula/' + Cypress.env('COURSE_CURR_02_ADMIN_APPROVAL_ID'))
        LEDashboardPage.getCatalogCourseNotFoundErrorMsg()
        cy.url().should('include', '#/catalog')
        //Login and verify user is redirected to the deeplink curricula course
        cy.get(LEDashboardPage.getPublicDashboardLoginBtn()).click()
        cy.get(LEDashboardPage.getUsernameTxtF()).type(users.learner01.LEARNER_01_USERNAME)
        cy.get(LEDashboardPage.getPasswordTxtF()).type(users.learner01.LEARNER_01_PASSWORD)
        cy.get(LEDashboardPage.getLoginBtn(), { timeout: 15000 }).contains('Login').click()
        cy.get(LECoursesPage.getCourseTitleWhenNextGenDisabled(), { timeout: 15000 }).contains(courses.CURR_02_ADMIN_APPROVAL_NAME)
    })

    it('My courses via Deeplink, Verify Error & Redirect', () => {
        //Verify user is redirect to the public dash when using deeplink to my courses
        cy.visit('/#/courses')
        cy.url().should('include', '/#/public-dashboard')
        //Login and verify user is redirected to my courses
        cy.get(LEDashboardPage.getPublicDashboardLoginBtn()).click()
        cy.get(LEDashboardPage.getUsernameTxtF()).type(users.learner01.LEARNER_01_USERNAME)
        cy.get(LEDashboardPage.getPasswordTxtF()).type(users.learner01.LEARNER_01_PASSWORD)
        cy.get(LEDashboardPage.getLoginBtn()).contains('Login').click()
        cy.get(LECoursesPage.getCoursesPageTitle()).contains('My Courses')
    })

})