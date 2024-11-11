import A5ECommerceSettingPage from '../../../../../../../helpers/AR/pageObjects/E-commerce/Settings/A5ECommerceSettingPage';
import { users } from '../../../../../../../helpers/TestData/users/users';
import { settingsDetails } from '../../../../../../../helpers/TestData/ECommerce/SettingsDetails';
import LEDashboardPage from '../../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import DefaultTestData from '../../../../../../fixtures/defaultTestData.json'
import LESideMenu from '../../../../../../../helpers/LE/pageObjects/Menu/LESideMenu';
import LECurrencySelection from '../../../../../../../helpers/LE/pageObjects/ECommerce/LECurrencySelection';
import LECatalogPage from '../../../../../../../helpers/LE/pageObjects/Catalog/LECatalogPage';
import LESearchResultsPage from '../../../../../../../helpers/LE/pageObjects/SearchResults/LESearchResultsPage';

describe('Multi Currency Selector', function () {

    before('Prerequisite',  () => {
        // Remove any existing multi currency setting
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        A5ECommerceSettingPage.visitECommertSettings()
        A5ECommerceSettingPage.clickSettingsTab('PaymentGateways')
       
        A5ECommerceSettingPage.getPaymentGatewayDropdown().type('Stripe').then(() => {
            A5ECommerceSettingPage.getShortWait()
            A5ECommerceSettingPage.getSelect2Dropdown().first().click()
        })

        A5ECommerceSettingPage.getAllowMultiCurrencyToggle().then($toggle => {
            if (!$toggle.find('a').hasClass('on')) {
                A5ECommerceSettingPage.getAllowMultiCurrencyToggle().click()
                LEDashboardPage.getShortWait()

                // set additional currencies to euro
                A5ECommerceSettingPage.getAddCurrencyBtn().click()
                A5ECommerceSettingPage.scrollToTop()
                A5ECommerceSettingPage.getDefaultCurrencyChangeWarning().should('be.visible')
                A5ECommerceSettingPage.getCurrencySelector().eq(0).click()
                A5ECommerceSettingPage.clickSelect2Item(1)
                A5ECommerceSettingPage.getConversionRateTxt(0).type(settingsDetails.EUR.conversionRate)
                A5ECommerceSettingPage.getShortWait() // give Knockout a short time for computed value
                A5ECommerceSettingPage.getDefaultCurrencyDropdown().children('div').should('have.attr', 'class').and('contain', 'select2-container-disabled')
                A5ECommerceSettingPage.getExpandAvailableCurrency().click()              
            }
        })

        A5ECommerceSettingPage.getVariablePriceGroupWarning().should('be.visible')        
        A5ECommerceSettingPage.getAddCurrencyBtn().should('be.visible')
        A5ECommerceSettingPage.getNoAdditionalCurrencyWarning().should('be.visible')

        A5ECommerceSettingPage.getSecretKeyTxt().type(settingsDetails.secretKey)
        A5ECommerceSettingPage.saveSettings() 
    })

    beforeEach(() => {
            //Login & navigate to catalog before each test
            cy.apiLoginWithSession(users.learner01.learner_01_username, DefaultTestData.USER_PASSWORD) 
    })

    this.afterEach(() => {     
        // check if currency selector is set to CAD (default currency) if it is not change it to CAD
        cy.get(LECurrencySelection.getHeaderButtons()).then(($btn) => {
            
            // if currency not CAD change to CAD
            if (!$btn.text().includes('CAD')) {                  
                cy.get(LECurrencySelection.getCurrencySelector()).click()
        
                cy.contains(LECurrencySelection.getCanadianCurrencyButtonInModal()).click()
                LECurrencySelection.getCurrencyButtonByNameThenClick('Save')
            
                // if shopping cart exists warning message will appear
                if ($btn.text().includes('Shopping Cart')) {   
                    LEDashboardPage.getMediumWait()        
                    cy.get(LECurrencySelection.getOkFromWarningMessage()).click()
                }
                LEDashboardPage.getMediumWait()
            }                      
        })

        // if currency already set to CAD AND items in cart then remove items from cart
        cy.get(LECurrencySelection.getHeaderButtons()).then(($btn) =>{
            if ($btn.text().includes('CAD') && $btn.text().includes('Shopping Cart')) {
                cy.get(LECurrencySelection.getShoppingCartIconFromNavBar()).click()
                cy.get(LECurrencySelection.getRemoveItemFromCheckoutButton()).click()
                LEDashboardPage.getMediumWait()
            }
        })
    })
 
    it('When Feature Flag is On AND Multi Currency is ON and additional currencies added then Learner UI shows currency selector', () => { 
        cy.get(LECurrencySelection.getCurrencySelector()).should('exist')
    })

    it('Learner selects a currency and adds a course to the shopping cart AND views shopping cart then shopping cart shows courses in selected currency', () => {      
        // Learner selects a currency
        cy.get(LECurrencySelection.getCurrencySelector()).should('exist')

        cy.get(LECurrencySelection.getCurrencySelector()).click()

        cy.contains(LECurrencySelection.getEuroCurrencyButtonInModal()).click()

        LECurrencySelection.getCurrencyButtonByNameThenClick('Save')
        LEDashboardPage.getMediumWait()

        // add course with price to cart
        cy.get(LECurrencySelection.getCoursesWithShoppingCartIcon()).should('exist')
        cy.get(LECurrencySelection.getCoursesWithShoppingCartIcon()).first().click()

        cy.get(LECurrencySelection.getShoppingCartIconFromNavBar()).should('exist')
        cy.get(LECurrencySelection.getShoppingCartIconFromNavBar()).click()

       // select view shopping cart
       cy.get(LECurrencySelection.getViewShoppingCart()).should('exist')
       cy.get(LECurrencySelection.getViewShoppingCart()).click()

       // assert shopping cart page contains expected currency abbreviation of EUR
       cy.get(LECurrencySelection.getShoppingCartTotal()).should('exist')
       LEDashboardPage.getShortWait()        
       cy.get(LECurrencySelection.getShoppingCartTotal()).contains('EUR').should('exist')    
    })

    it('Learner adds course to the shopping cart then goes to change the currency, a warning should be displayed, learner clicks ok and the course is removed from the shopping cart', () => { 
        // add course with price to cart
        cy.get(LECurrencySelection.getCoursesWithShoppingCartIcon()).should('exist')
        cy.get(LECurrencySelection.getCoursesWithShoppingCartIcon()).first().click()

        cy.get(LECurrencySelection.getShoppingCartIconFromNavBar()).should('exist')

        // Learner selects another currency
        cy.get(LECurrencySelection.getCurrencySelector()).should('exist')
        cy.get(LECurrencySelection.getCurrencySelector()).click()

        cy.get(LECurrencySelection.getCurrencyModal()).should('exist')
        cy.contains('EUR Euro €').click()
        cy.get(LECurrencySelection.getCurrencyModalSaveContainer()).contains('Save').click()

        // warning message should exist
        cy.get(LECurrencySelection.getWarningMessage()).should('exist')
        cy.get(LECurrencySelection.getWarningMessage()).contains('Changing your currency will empty your current cart. Are you sure you want to continue?').should('exist')

        // clicks OK on warning page
        cy.get(LECurrencySelection.getOkFromWarningMessage()).click()
        
        // confirm that shopping cart no longer exists in top right since no item is in the cart
        cy.get(LECurrencySelection.getShoppingCartIconFromNavBar()).should('not.exist')
    })

    it('Currency selector is clicked - client default currency is checked', () => { 
        //open modal
        cy.get(LECurrencySelection.getCurrencySelector()).should('exist')
        cy.get(LECurrencySelection.getCurrencySelector()).click()
        cy.get(LECurrencySelection.getCurrencySelectorModal).should('exist')

        //check default currency is checked
        cy.get(LECurrencySelection.getSelectedCurrency()).contains('CAD Canadian Dollar $').should('exist')

        //close modal
        LECurrencySelection.getCurrencyButtonByNameThenClick('Cancel')
    })

    it('Currency selector is clicked - different currency selected - courses on dashboard and catalog displayed in selected currency', () => { 
        // Learner selects a currency and saves
        cy.get(LECurrencySelection.getCurrencySelector()).should('exist')
        cy.get(LECurrencySelection.getCurrencySelector()).click()
        cy.contains(LECurrencySelection.getEuroCurrencyButtonInModal()).click()
        LECurrencySelection.getCurrencyButtonByNameThenClick('Save')

        //currency modal reflects new currency
        LEDashboardPage.getLongWait()        

        cy.get(LECurrencySelection.getCurrencySelector()).should('exist')
        cy.get(LECurrencySelection.getCurrencySelector()).contains('EUR').should('exist')

        //course on dashboard reflects new currency
        LEDashboardPage.getLongWait()        
        cy.get(LEDashboardPage.getCourseCarousel()).first().contains('€').should('exist')

        //navigate to catalog
        LESideMenu.openSideMenu()
        LESideMenu.getLEMenuItemsByNameThenClick('Catalog')

        //course on catalog reflects new currency
        cy.get(LECatalogPage.getCardCourse()).contains('€').should('exist')
    })

    it('Search term is added - search results are returned with price set in currency selector', () => { 
        // Learner selects a currency and saves
        cy.get(LECurrencySelection.getCurrencySelector()).should('exist')
        cy.get(LECurrencySelection.getCurrencySelector()).click()
        cy.contains(LECurrencySelection.getEuroCurrencyButtonInModal()).click()
        LECurrencySelection.getCurrencyButtonByNameThenClick('Save')

        //search for E-comm courses 
        LEDashboardPage.getLongWait()        
        cy.get(LEDashboardPage.getNavSearch()).click()
        cy.get(LEDashboardPage.getNavSearchTxtF()).eq(0).type('E-comm').type('{enter}')

        //course on search results reflect currency change
        cy.get(LESearchResultsPage.getFirstSearchResult()).contains('€').should('exist')
    })
});