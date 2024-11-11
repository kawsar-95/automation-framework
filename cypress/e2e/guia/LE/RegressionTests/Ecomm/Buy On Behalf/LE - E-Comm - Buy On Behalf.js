import { users } from '../../../../../../../helpers/TestData/users/users';
import LECurrencySelection from '../../../../../../../helpers/LE/pageObjects/ECommerce/LECurrencySelection';
import LEDashboardPage from '../../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import DefaultTestData from '../../../../../../fixtures/defaultTestData.json'
import A5ECommerceSettingPage from '../../../../../../../helpers/AR/pageObjects/E-commerce/Settings/A5ECommerceSettingPage';
import LEBuyOnBehalf from '../../../../../../../helpers/LE/pageObjects/ECommerce/LEBuyOnBehalf';
import LECatalogPage from '../../../../../../../helpers/LE/pageObjects/Catalog/LECatalogPage';
import LEShoppingPage from '../../../../../../../helpers/LE/pageObjects/ECommerce/LEShoppingPage';

describe('Buy On Behalf', function () {

    before('Prerequisite',  () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        A5ECommerceSettingPage.visitECommertSettings()
        LEDashboardPage.getMediumWait()
        
        A5ECommerceSettingPage.turnOnMultiSeatToggle()

        A5ECommerceSettingPage.turnOnSingleSeatEnrollmentKeyPurchase()

        LEDashboardPage.getShortWait()
        A5ECommerceSettingPage.saveSettings() 
    })

    beforeEach(() => {
        //Login & navigate to catalog before each test
        cy.apiLoginWithSession(users.learner01.learner_01_username, DefaultTestData.USER_PASSWORD) 

        LEShoppingPage.removeItemsFromShoppingCart()

        cy.get(LEDashboardPage.getHeaderLogoBtn()).click()

        // add course with price to cart
        cy.get(LECurrencySelection.getCoursesWithShoppingCartIcon()).should('exist')
        cy.get(LECurrencySelection.getCoursesWithShoppingCartIcon()).first().click()
        LEDashboardPage.getMediumWait()   
        cy.get(LECurrencySelection.getShoppingCartIconFromNavBar()).click()
                
        cy.get(LECurrencySelection.getViewShoppingCart()).click()

        LEDashboardPage.getMediumWait()
        LEDashboardPage.getMediumWait()

        LEBuyOnBehalf.turnByOnBehalfOff()
    })

    it(
'Learner has a course in shopping cart, on checkout page the quantity and refresh button is greyed out and cannot be clicked on', () => { 
        cy.get(LECurrencySelection.getShoppingCartIconFromNavBar()).should('exist')
        cy.get(LECurrencySelection.getShoppingCartIconFromNavBar()).click()

       // select view shopping cart
       cy.get(LECurrencySelection.getViewShoppingCart()).should('exist')
       cy.get(LECurrencySelection.getViewShoppingCart()).click()

       cy.get(LEBuyOnBehalf.getDisabledUpdateQuanitityButton()).should('exist')

       cy.get(LEBuyOnBehalf.getCartQuantityInputBox()).should('be.disabled')
    })

    it('The purchase on behalf of checkbox is off by default', () => { 
        cy.get(LECurrencySelection.getShoppingCartIconFromNavBar()).should('exist')
        cy.get(LECurrencySelection.getShoppingCartIconFromNavBar()).click()

       // select view shopping cart
       cy.get(LECurrencySelection.getViewShoppingCart()).should('exist')
       cy.get(LECurrencySelection.getViewShoppingCart()).click()

       cy.get(LEBuyOnBehalf.getCheckBox()).eq(0).should('exist')
       cy.get(LEBuyOnBehalf.getOnBehalfOfOthersCheckBox()).should('have.attr', 'aria-checked', 'false')

       cy.get(LEBuyOnBehalf.getCartQuantityInputBox()).should('be.disabled')

        cy.get(LEBuyOnBehalf.getUpdateQuanitityButton()).should('exist')
        cy.get(LEBuyOnBehalf.getUpdateQuanitityButton()).should('be.disabled')
    })

    it('Learner can check purchase on behalf of box and leave the quantity at one, then proceed to next page', () => { 
        cy.get(LECurrencySelection.getShoppingCartIconFromNavBar()).should('exist')
        cy.get(LECurrencySelection.getShoppingCartIconFromNavBar()).click()

       // select view shopping cart
       cy.get(LECurrencySelection.getViewShoppingCart()).should('exist')
       cy.get(LECurrencySelection.getViewShoppingCart()).click()

       LEDashboardPage.getShortWait()

       cy.get(LEBuyOnBehalf.getCheckBox()).eq(0).should('exist')
       cy.get(LEBuyOnBehalf.getCheckBox()).click()
       
       cy.get(LECatalogPage.getProceedToCheckoutBtn()).should('exist')
       cy.get(LECatalogPage.getProceedToCheckoutBtn()).click()

       LEDashboardPage.getShortWait()
       
       // Go back so before each part can run
       cy.get(LEBuyOnBehalf.getPreviousButton()).click()
       cy.get(LEBuyOnBehalf.getCheckBox()).click()

       LEDashboardPage.getShortWait()
    })

    it('Learner has a course in shopping cart, the learner must check the purchase of behalf on box to increase the quantity of the item.', () => { 
        cy.get(LECurrencySelection.getShoppingCartIconFromNavBar()).should('exist')
        cy.get(LECurrencySelection.getShoppingCartIconFromNavBar()).click()

       // select view shopping cart
       cy.get(LECurrencySelection.getViewShoppingCart()).should('exist')
       cy.get(LECurrencySelection.getViewShoppingCart()).click()

       cy.get(LEBuyOnBehalf.getCheckBox()).eq(0).should('exist')
       cy.get(LEBuyOnBehalf.getCheckBox()).click()

       LEDashboardPage.getLongWait()

       //  cart-quantity-cell-module__quantity_input
       cy.get(LEBuyOnBehalf.getCartQuantityInputBox()).should('exist')
       cy.get(LEBuyOnBehalf.getCartQuantityInputBox()).eq(0).type('2')

       cy.get(LEBuyOnBehalf.getUpdateQuanitityButton()).click()

       LEDashboardPage.getMediumWait()
    })

    it('As a learner, if the cart quantity is increased past one, I cannot uncheck the purchase on behalf of checkbox', () => { 
        cy.get(LECurrencySelection.getShoppingCartIconFromNavBar()).should('exist')
        cy.get(LECurrencySelection.getShoppingCartIconFromNavBar()).click()

        // select view shopping cart
        cy.get(LECurrencySelection.getViewShoppingCart()).should('exist')
        cy.get(LECurrencySelection.getViewShoppingCart()).click()

        cy.get(LEBuyOnBehalf.getCheckBox()).eq(0).should('exist')
        cy.get(LEBuyOnBehalf.getCheckBox()).click()

        LEDashboardPage.getMediumWait()

        cy.get(LEBuyOnBehalf.getCartQuantityInputBox()).should('exist')
        cy.get(LEBuyOnBehalf.getCartQuantityInputBox()).eq(0).clear().type('2')
        LEDashboardPage.getShortWait()
        cy.get(LEBuyOnBehalf.getUpdateQuanitityButton()).click()

        LEDashboardPage.getMediumWait()

        cy.get(LEBuyOnBehalf.getOnBehalfOfOthersCheckBox()).should('be.disabled')
    })
})
