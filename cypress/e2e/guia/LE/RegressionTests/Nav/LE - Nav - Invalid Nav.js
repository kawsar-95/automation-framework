import users from '../../../../../fixtures/users.json'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LESideMenu from '../../../../../../helpers/LE/pageObjects/Menu/LESideMenu'

describe('LE - Nav - Invalid Nav', function () {

    beforeEach(() => {
        cy.learnerLoginThruLoginPage(users.learner01.LEARNER_01_USERNAME, users.learner01.LEARNER_01_PASSWORD)
    })

    it('Navigate to user page after logout & verify redirect', () => {
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('Log Off')
        cy.visit('#/profile')
        cy.url().should('include', '#/public-dashboard')
    })

    it('Navigate to non-existent page while logged in & verify page not found message', () => {
        cy.visit('/#/profle')
        LEDashboardPage.getPageNotFoundMsg()
    })

    it('Navigate to invalid course ID while logged in & verify course not found error msg', () => {
        cy.visit('/#/online-courses/invalidCourseID')
        LEDashboardPage.getCatalogCourseNotFoundErrorMsg()
        cy.url().should('include', '#/catalog')
    })

    it('Navigate back after logout & verify redirect to public dashboard', () => {
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('Log Off')
        cy.go('back')
        cy.url().should('include', '#/public-dashboard')
    })

    it('Navigate back after login & verify user is not logged out', () => {
        cy.go('back')
        cy.url().should('include', '#/dashboard')
    })

    //COMMENTED OUT AS THERE IS NO REDIRECT WHEN USING AE (only works in A5)
    /*it('Navigate to admin side via URL while logged in as learner & verify no access + redirect', () => {      
        cy.learnerLoginThruLoginPage(users.learner01.LEARNER_01_USERNAME, users.learner01.LEARNER_01_PASSWORD) 
        cy.vist('/admin')
        cy.url().should('include', '#/dashboard')
        cy.get(LEDashboardPage.getDashboardPageTitle()).should('contain', 'Welcome, ' + users.learner01.LEARNER_01_FNAME + ' ' + users.learner01.LEARNER_01_LNAME)
    })*/
})

describe('LE - Nav - Invalid Nav - 404 Page', function () {

    it('Navigate to wrong url in our domain & verify 404 page', () => {
        cy.visit({
            url: Cypress.config('baseUrl') + 'prfl',
            failOnStatusCode: false,
        })
        LEDashboardPage.get404Page()
    })
})