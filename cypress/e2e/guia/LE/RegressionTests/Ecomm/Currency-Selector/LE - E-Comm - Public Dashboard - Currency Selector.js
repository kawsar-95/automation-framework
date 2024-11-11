import LEDashboardPage from '../../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import DefaultTestData from '../../../../../../fixtures/defaultTestData.json'
import LECurrencySelection from '../../../../../../../helpers/LE/pageObjects/ECommerce/LECurrencySelection';
import { users } from '../../../../../../../helpers/TestData/users/users';
    
describe('Multi Currency Settings', function () {

    beforeEach(() => {
        cy.visit("/#/public-dashboard")
        LEDashboardPage.getLongWait()
    })

    this.afterEach(() => {
        cy.get(LECurrencySelection.getHeaderButtons()).then(($btn) =>{
            if (!$btn.text().includes('Login')) {
                cy.logoutLearner()
            }
        })
    })
    
    it('Learner on public dashboard changes currency then courses on dashboard and catalog show in that currency', () => { 
        // Learner selects a currency
        cy.get(LECurrencySelection.getCurrencySelector()).should('exist')
        cy.get(LECurrencySelection.getCurrencySelector()).click()
        LEDashboardPage.getMediumWait()
        cy.get(LECurrencySelection.getCurrencyModal()).should('exist')
        cy.contains('EUR Euro €').click()
        cy.get(LECurrencySelection.getCurrencyButtonByNameThenClick('Save'))

        // confirm price is in euro
        cy.get(LECurrencySelection.getCoursePrices()).first().contains('€').should('exist')
    })

    it('Learner on public dashboard adds a course to their cart and proceedes to check out, Learner will be directed to Log in. When logged in Shopping Cart shows in selected currency.', () => { 

        // changed to EUR because it is easier to identify
        cy.get(LECurrencySelection.getCurrencySelector()).should('exist')
        cy.get(LECurrencySelection.getCurrencySelector()).click()
        LEDashboardPage.getLShortWait()
        cy.get(LECurrencySelection.getCurrencyModal()).should('exist')
        cy.contains('EUR Euro €').click()
        cy.get(LECurrencySelection.getCurrencyButtonByNameThenClick('Save'))

        cy.get(LECurrencySelection.getCoursesWithShoppingCartIcon()).should('exist')
        cy.get(LECurrencySelection.getCoursesWithShoppingCartIcon()).first().click()

        // select shopping cart icon
        cy.get(LECurrencySelection.getShoppingCartIconFromNavBar()).should('exist')
        cy.get(LECurrencySelection.getShoppingCartIconFromNavBar()).click()
         
        // select view shopping cart
        cy.get(LECurrencySelection.getViewShoppingCart()).should('exist')
        cy.get(LECurrencySelection.getViewShoppingCart()).click()
     
        // click procceed to checkout
        cy.get(LECurrencySelection.getProceedToCheckout()).click()
        LEDashboardPage.getLShortWait()

        cy.get(LEDashboardPage.getUsernameTxtF()).should('be.visible').type(users.learner01.learner_01_username)
        cy.get(LEDashboardPage.getPasswordTxtF()).should('be.visible').type(DefaultTestData.USER_PASSWORD)
        
        cy.get(LECurrencySelection.getCheckoutLoginButton()).should('exist')
        cy.get(LECurrencySelection.getCheckoutLoginButton()).click()

        // assert shopping cart page contains expected currency abbreviation of EUR
        cy.get(LECurrencySelection.getShoppingCartTotal()).should('exist')
        cy.get(LECurrencySelection.getShoppingCartTotal()).contains('€').should('exist')
        LEDashboardPage.getLongWait()
    })
});