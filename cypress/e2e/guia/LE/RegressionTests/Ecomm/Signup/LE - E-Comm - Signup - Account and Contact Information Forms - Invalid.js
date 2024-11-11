import courses from '../../../../../../fixtures/courses.json'
import DefaultTestData from '../../../../../../fixtures/defaultTestData.json'
import LEDashboardPage from '../../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LESideMenu from '../../../../../../../helpers/LE/pageObjects/Menu/LESideMenu'
import LEFilterMenu from '../../../../../../../helpers/LE/pageObjects/Menu/LEFilterMenu'
import LEShoppingMenu from '../../../../../../../helpers/LE/pageObjects/Menu/LEShoppingMenu'
import LEShoppingPage from '../../../../../../../helpers/LE/pageObjects/ECommerce/LEShoppingPage'
import LEAccountPage from '../../../../../../../helpers/LE/pageObjects/ECommerce/LEAccountPage'

describe('LE - E-Comm - Signup - Account and Contact Information Forms - Invalid - Account Info', function(){

    beforeEach(() => {
        //Add course to cart
        cy.visit("/#/public-dashboard")
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('Catalog')
        LEFilterMenu.SearchForCourseByName(courses.OC_ECOMM_01_NAME)
        LEDashboardPage.getMediumWait()
        LEDashboardPage.getCourseCardBtnThenClick(courses.OC_ECOMM_01_NAME)
        LEDashboardPage.getMediumWait()
        //Navigate to cart -> signup form, and fill out all fields with valid input before each test
        cy.get(LEDashboardPage.getNavShoppingCart()).click()
        cy.get(LEShoppingMenu.getViewShoppingCart()).click()
        cy.get(LEShoppingPage.getCheckoutBtn()).should('be.visible').click()
        cy.get(LEAccountPage.getSignupBtn()).click()
        cy.get(LEAccountPage.getFirstNameTxtF()).type(DefaultTestData.USER_LEARNER_FNAME)
        cy.get(LEAccountPage.getLastNameTxtF()).type(DefaultTestData.USER_LEARNER_LNAME)
        cy.get(LEAccountPage.getUsernameTxtF()).type(DefaultTestData.USER_LEARNER_UNAME_PRE)
        cy.get(LEAccountPage.getEmailTxtF()).type(DefaultTestData.USER_LEARNER_EMAIL)
        cy.get(LEAccountPage.getPasswordTxtF()).type(DefaultTestData.USER_PASSWORD)
        cy.get(LEAccountPage.getReEnterPasswordTxtF()).type(DefaultTestData.USER_PASSWORD)
    })

    it('Account Info - Signup - Verify First and Last Name fields', () => {
        //Verify that you cannot proceed with a blank first name field
        cy.get(LEAccountPage.getFirstNameTxtF()).clear()
        cy.get(LEAccountPage.getProceedBtn()).click()
        //Verify user remains on the signup form after the button is pressed
        cy.url().should('contain', '/#/cart/signup')

        //Verify that first name field does not accept >255 character string
        cy.get(LEAccountPage.getFirstNameTxtF()).clear().invoke('val', LEDashboardPage.getLongString()).type('a')
        cy.get(LEAccountPage.getProceedBtn()).click()
        cy.url().should('contain', '/#/cart/signup')

        //Verify that you cannot proceed with a blank last name field
        cy.get(LEAccountPage.getLastNameTxtF()).clear()
        cy.get(LEAccountPage.getProceedBtn()).click()
        cy.url().should('contain', '/#/cart/signup')

        //Verify that last name field does not accept >255 character string
        cy.get(LEAccountPage.getLastNameTxtF()).clear().invoke('val', LEDashboardPage.getLongString()).type('a')
        cy.get(LEAccountPage.getProceedBtn()).click()
        cy.url().should('contain', '/#/cart/signup')
    })

    it('Account Info - Signup - Verify Username field', () => {
        //Verify that you cannot proceed with a blank username field
        cy.get(LEAccountPage.getUsernameTxtF()).clear()
        cy.get(LEAccountPage.getProceedBtn()).click()
        cy.url().should('contain', '/#/cart/signup')

        //Verify that username field does not accept >255 character string
        cy.get(LEAccountPage.getUsernameTxtF()).clear().invoke('val', LEDashboardPage.getLongString()).type('a')
        cy.get(LEAccountPage.getProceedBtn()).click()
        cy.url().should('contain', '/#/cart/signup')
    })

    it('Account Info - Signup - Verify Email Address field', () => {
        //Verify that you cannot proceed with a blank email address field
        cy.get(LEAccountPage.getEmailTxtF()).clear()
        cy.get(LEAccountPage.getProceedBtn()).click()
        cy.url().should('contain', '/#/cart/signup')

        //Verify that email address  field does not accept >255 character string
        cy.get(LEAccountPage.getEmailTxtF()).clear().invoke('val', LEDashboardPage.getLongString()).type('@absorblms.com')
        cy.get(LEAccountPage.getProceedBtn()).click()
        cy.url().should('contain', '/#/cart/signup')

        //Verify that you cannot proceed with an invalid email address format (no top-level domain)
        cy.get(LEAccountPage.getEmailTxtF()).clear().type('NO_TOP_LVL_DOMAIN@2ND_LVL_DOMAIN.')
        cy.get(LEAccountPage.getProceedBtn()).click()
        cy.url().should('contain', '/#/cart/signup')

        //Verify that you cannot proceed with an invalid email address format (no 2nd-level domain)
        cy.get(LEAccountPage.getEmailTxtF()).clear().type('NO_2ND_LVL_DOMAIN@.TOP_LVL_DOMAIN')
        cy.get(LEAccountPage.getProceedBtn()).click()
        cy.url().should('contain', '/#/cart/signup')

        //Verify that you cannot proceed with an invalid email address format (no local part)
        cy.get(LEAccountPage.getEmailTxtF()).clear().type('@2ND_LVL_DOMAIN.TOP_LVL_DOMAIN')
        cy.get(LEAccountPage.getProceedBtn()).click()
        cy.url().should('contain', '/#/cart/signup')

        //Verify that you cannot proceed with an invalid email address format (no dot in domain)
        cy.get(LEAccountPage.getEmailTxtF()).clear().type('@2ND_LVL_DOMAIN.TOP_LVL_DOMAIN')
        cy.get(LEAccountPage.getProceedBtn()).click()
        cy.url().should('contain', '/#/cart/signup')

        //Verify that you cannot proceed with an invalid email address format (no @ symbol)
        cy.get(LEAccountPage.getEmailTxtF()).clear().type('NO_AT_SYMBOL.TOP_LVL_DOMAIN')
        cy.get(LEAccountPage.getProceedBtn()).click()
        cy.url().should('contain', '/#/cart/signup')
    })

    it('Account Info - Signup - Verify Password field', () => {
        //Verify that you cannot proceed with a blank password field
        cy.get(LEAccountPage.getPasswordTxtF()).clear()
        cy.get(LEAccountPage.getProceedBtn()).click()
        cy.url().should('contain', '/#/cart/signup')

        //Verify that you cannot proceed with a short password and short Re-enter Password
        cy.get(LEAccountPage.getPasswordTxtF()).clear().type('abcd123')
        cy.get(LEAccountPage.getReEnterPasswordTxtF()).clear().type('abcd123')
        cy.get(LEAccountPage.getProceedBtn()).click()
        cy.url().should('contain', '/#/cart/signup')

        //Verify that you cannot proceed with a password that do not match
        cy.get(LEAccountPage.getPasswordTxtF()).clear().type(DefaultTestData.USER_PASSWORD)
        cy.get(LEAccountPage.getReEnterPasswordTxtF()).clear().type(DefaultTestData.USER_PASSWORD + '!')
        cy.get(LEAccountPage.getProceedBtn()).click()
        cy.url().should('contain', '/#/cart/signup')
    })
})

describe('LE - E-Comm - Signup - Account and Contact Information Forms - Invalid - Shipping Info', function(){
//This block tests the shipping information form after the account information signup form has been completed

    before(function() {
        //Complete and submit valid account info form in the signup process
       cy.visit("/#/public-dashboard")
       cy.get(LEDashboardPage.getNavMenu()).click()
       LESideMenu.getLEMenuItemsByNameThenClick('Catalog')
       LEFilterMenu.SearchForCourseByName(courses.OC_ECOMM_01_NAME)
       LEDashboardPage.getMediumWait()
       LEDashboardPage.getCourseCardBtnThenClick(courses.OC_ECOMM_01_NAME)
       LEDashboardPage.getMediumWait()
       //Navigate to cart -> signup form, and fill out all fields with valid input before each test
       cy.get(LEDashboardPage.getNavShoppingCart()).click()
       cy.get(LEShoppingMenu.getViewShoppingCart()).click()
       cy.get(LEShoppingPage.getCheckoutBtn()).should('be.visible').click()
       cy.get(LEAccountPage.getSignupBtn()).click()
       cy.get(LEAccountPage.getFirstNameTxtF()).type(DefaultTestData.USER_LEARNER_FNAME)
       cy.get(LEAccountPage.getLastNameTxtF()).type(DefaultTestData.USER_LEARNER_LNAME)
       cy.get(LEAccountPage.getUsernameTxtF()).type(DefaultTestData.USER_LEARNER_UNAME_PRE)
       cy.get(LEAccountPage.getEmailTxtF()).type(DefaultTestData.USER_LEARNER_EMAIL)
       cy.get(LEAccountPage.getPasswordTxtF()).type(DefaultTestData.USER_PASSWORD)
       cy.get(LEAccountPage.getReEnterPasswordTxtF()).type(DefaultTestData.USER_PASSWORD)
       cy.get(LEAccountPage.getJobTitleTxtF()).type(DefaultTestData.USER_LEARNER_JOB_TITLE)
       cy.get(LEAccountPage.getProceedBtn()).click()
    })

    it('Shipping Info - Signup - Verify Fields', () => {
        //Fill out All Fields
        cy.get(LEAccountPage.getPhoneTxtF()).type(DefaultTestData.USER_LEARNER_PHONE)
        cy.get(LEAccountPage.getAddressTxtF()).type(DefaultTestData.USER_LEARNER_ADDRESS)
        cy.get(LEAccountPage.getCountryDDown()).select(DefaultTestData.USER_LEARNER_COUNTRY_CODE)
        cy.get(LEAccountPage.getProvinceDDown()).select(DefaultTestData.USER_LEARNER_PROVINCE)
        cy.get(LEAccountPage.getCityTxtF()).type(DefaultTestData.USER_LEARNER_CITY)
        cy.get(LEAccountPage.getPostalCodeTxtF()).type(DefaultTestData.USER_LEARNER_POSTALCODE)

        //Verify that you cannot proceed with a blank address field
        cy.get(LEAccountPage.getAddressTxtF()).clear()
        cy.get(LEAccountPage.getProceedToCheckoutBtn()).should('be.disabled')
        cy.get(LEAccountPage.getAddressTxtF()).type(DefaultTestData.USER_LEARNER_ADDRESS)

        //Verify that you cannot proceed if country is not selected
        //Set country dropdown back to placeholder value
        cy.get(LEAccountPage.getCountryDDown()).select('Country')
        cy.get(LEAccountPage.getProceedToCheckoutBtn()).should('be.disabled')
        cy.get(LEAccountPage.getCountryDDown()).select(DefaultTestData.USER_LEARNER_COUNTRY_CODE)

        //Verify that you cannot proceed with a blank state/province field
        //Set province dropdown back to placeholder value
        cy.get(LEAccountPage.getProvinceDDown()).select('State/Province')
        cy.get(LEAccountPage.getProceedToCheckoutBtn()).should('be.disabled')
        cy.get(LEAccountPage.getProvinceDDown()).select(DefaultTestData.USER_LEARNER_PROVINCE)

        //Verify that you cannot proceed with a blank city field
        cy.get(LEAccountPage.getCityTxtF()).clear()
        cy.get(LEAccountPage.getProceedToCheckoutBtn()).should('be.disabled')
        cy.get(LEAccountPage.getCityTxtF()).type(DefaultTestData.USER_LEARNER_CITY)

        //Verify that you cannot proceed with a blank postal code field
        cy.get(LEAccountPage.getPostalCodeTxtF()).clear()
        cy.get(LEAccountPage.getProceedToCheckoutBtn()).should('be.disabled')
    })
})