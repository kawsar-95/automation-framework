import { users } from '../../../../../../../helpers/TestData/users/users';
import LECurrencySelection from '../../../../../../../helpers/LE/pageObjects/ECommerce/LECurrencySelection';
import LEDashboardPage from '../../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import DefaultTestData from '../../../../../../fixtures/defaultTestData.json'
import A5ECommerceSettingPage from '../../../../../../../helpers/AR/pageObjects/E-commerce/Settings/A5ECommerceSettingPage';
import LEBuyOnBehalf from '../../../../../../../helpers/LE/pageObjects/ECommerce/LEBuyOnBehalf';
import LEShoppingPage from '../../../../../../../helpers/LE/pageObjects/ECommerce/LEShoppingPage';

describe('Buy On Behalf and multi seat is disabled', function () {

    before('Prerequisite',  () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        A5ECommerceSettingPage.visitECommertSettings()

        LEDashboardPage.getMediumWait()
        
        A5ECommerceSettingPage.turnOffMultiSeatToggle()

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

    it('Learner has a course in shopping cart, on checkout page the checkbox to buy on behalf is still available, but the quantity is not changable', () => { 
        cy.get(LECurrencySelection.getShoppingCartIconFromNavBar()).should('exist')
        cy.get(LECurrencySelection.getShoppingCartIconFromNavBar()).click()

       // select view shopping cart
       cy.get(LECurrencySelection.getViewShoppingCart()).should('exist')
       cy.get(LECurrencySelection.getViewShoppingCart()).click()

       cy.get(LEBuyOnBehalf.getCheckBox()).eq(0).should('exist')
       cy.get(LEBuyOnBehalf.getCheckBox()).click()

       cy.get(LEShoppingPage.getCourseQuantity()).should('not.exist')
    })
})