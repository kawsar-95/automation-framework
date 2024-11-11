import users from '../../../../../fixtures/users.json'
import courses from '../../../../../fixtures/courses.json'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LEProfilePage from '../../../../../../helpers/LE/pageObjects/User/LEProfilePage'
import LEMessagesMenu from '../../../../../../helpers/LE/pageObjects/Menu/LEMessagesMenu'
import LEMessagesPage from '../../../../../../helpers/LE/pageObjects/User/LEMessagesPage'
import LEShoppingMenu from '../../../../../../helpers/LE/pageObjects/Menu/LEShoppingMenu'
import LEShoppingPage from '../../../../../../helpers/LE/pageObjects/ECommerce/LEShoppingPage'

describe('LE - Nav - Top Toolbar', function () {

    beforeEach(() => {
        //sign in before each test block
        cy.apiLoginWithSession(users.learner01.LEARNER_01_USERNAME, users.learner01.LEARNER_01_PASSWORD, "#/login")
    })

    it('Profile - Verify Contents & URL', () => {
        cy.get(LEDashboardPage.getNavProfile()).should('be.visible').click()
        cy.url().should('include', '/#/profile')
        cy.get(LEProfilePage.getProfilePageTitle()).should('contain.text', 'Profile')
        cy.get(LEProfilePage.getEditProfileBtn()).should('be.visible')
        cy.get(LEProfilePage.getChangePasswordBtn()).should('be.visible')
        cy.get(LEProfilePage.getViewSocialProfileBtn()).should('be.visible')
        cy.get(LEProfilePage.getLearnerFName()).should('contain.text', users.learner01.LEARNER_01_FNAME)
        cy.get(LEProfilePage.getLearnerLName()).should('contain.text', users.learner01.LEARNER_01_LNAME)
        cy.get(LEProfilePage.getLearnerUName()).should('contain.text', users.learner01.LEARNER_01_USERNAME)
    })

    it('Messages - Verify Contents & URL - View All Messages', () => {
        cy.get(LEDashboardPage.getNavMessages()).should('be.visible').click()
        cy.get(LEMessagesMenu.getNoConversations()).should('contain.text', 'You currently have no messages.')
        cy.get(LEMessagesMenu.getViewAllMessagesBtn()).should('be.visible').click()
        cy.url().should('include', '/#/profile/inbox')
        cy.get(LEMessagesPage.getMessagesPageTitle()).should('contain.text', 'Messages')
        //Clicks through each conversation tab
        cy.get(LEMessagesPage.getConversations()).should('be.visible').click({ multiple: true })
    })

    it('Shopping Cart - Verify Contents & URL', () => {
        cy.get(LEDashboardPage.getNavShoppingCart()).should('be.visible').click()
        cy.get(LEShoppingMenu.getViewShoppingCart()).should('be.visible').click()
        cy.url().should('include', '/#/cart')
        cy.get(LEShoppingPage.getContinueShopping()).should('be.visible')
        cy.get(LEShoppingPage.getCourseName()).should('contain.text', courses.ILC_FILTER_01_NAME)
        cy.get(LEShoppingPage.getTotalPrice()).should('contain.text', '0.00')
        cy.get(LEShoppingPage.getCourseQuantity()).should('be.visible').clear().type('4')
        cy.get(LEShoppingPage.getQuantityUpdateBtn()).should('be.visible').click()
        cy.get(LEShoppingPage.getCouponCode()).should('be.visible').type('1111')
        cy.get(LEShoppingPage.getApplyCouponCode()).should('be.visible').click()
        cy.get(LEShoppingPage.getCheckoutBtn()).should('be.visible').click()
        cy.url().should('include', '#/cart/account')
    })
})