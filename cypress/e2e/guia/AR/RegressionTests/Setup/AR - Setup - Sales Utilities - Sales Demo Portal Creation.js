import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARClientsPage from "../../../../../../helpers/AR/pageObjects/Setup/ARClientsPage"
import ARSalesUtilitiesPage, { accountIdentification, portalName, subdomainName, targetDatabaseName } from "../../../../../../helpers/AR/pageObjects/Setup/ARSalesUtilitiesPage"
import { users } from "../../../../../../helpers/TestData/users/users"
import arAddCommentsPage from '../../../../../../helpers/AR/pageObjects/Comments/ARAddCommentsPage'

const subdomain= subdomainName.subdomainNameDynamic

describe('C6865 - Sales Demo Portal Creation', () => {
    beforeEach(() => {
        cy.loginBlatantAdmin()
    })

    it('Navigate Sales Utilities and Create Demo Portal', () => {
        //Navigate to Setup Sales Utilities and verify 
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Setup'))).click()
        ARDashboardPage.getShortWait()
        ARDashboardPage.getMenuItemOptionByName('Sales Utilities')
        ARDashboardPage.getShortWait()
        cy.get(ARSalesUtilitiesPage.getPageTitle()).contains('Sales Utilities').should('contain','Sales Utilities')
        //click on create free trial Button
        cy.get(ARSalesUtilitiesPage.getCreateFreeTrialBtn()).click()
        ARDashboardPage.getShortWait()
        //select data from source portal
        ARSalesUtilitiesPage.getSelectSourcePrtalByName(portalName["7284DEmoClient"])
        //select target databese


        ARSalesUtilitiesPage.getSelectTargetDatabasebyName(targetDatabaseName.Main)
        //type company name
        cy.get(ARSalesUtilitiesPage.getCompanyNameField()).clear().type(accountIdentification.companyName)
        //type LMS name
        cy.get(ARSalesUtilitiesPage.getLMSNameField()).clear().type(accountIdentification.lmsName)
        //type AccountID
        cy.get(ARSalesUtilitiesPage.getAccountIDField()).clear().type(accountIdentification.LeadIDFirst)

        //Select Date --It seems that this feature is removed from the page therefore commented out for now.
        // cy.get(ARSalesUtilitiesPage.getCalenderButton()).click()
        // ARSalesUtilitiesPage.getSelectDate(accountIdentification.futuredate1)
        // ARSalesUtilitiesPage.getSelectDay('19')
        
        //Type LeadID
        cy.get(ARSalesUtilitiesPage.getLeadIDField()).clear().type(accountIdentification.LeadIDFirst)
        //Type Subdomain
        cy.get(ARSalesUtilitiesPage.getSubdomainField()).clear().type(subdomain)
        
        //submit changes and verfiy 
        cy.get(ARSalesUtilitiesPage.getSubmitBtn()).contains('Submit').click()
        cy.get(ARSalesUtilitiesPage.getconfirmationSubmit()).click()
        ARDashboardPage.getShortWait()
        cy.get(ARSalesUtilitiesPage.getPageTitle()).contains('Sales Utilities').should('contain','Sales Utilities')

    })

    it('Verfiy Created Demo Portal', () => {
        //Navigate to Setup Sales Utilities and verify 
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Setup'))).click()
        ARDashboardPage.getMenuItemOptionByName('Clients')
        ARDashboardPage.getShortWait()
        cy.get(ARSalesUtilitiesPage.getPageTitle()).contains('Clients').should('contain','Clients')
        //filter and verify to created demo portal 
        cy.get(ARClientsPage.getClientsFilterBtn()).click()
        arAddCommentsPage.A5AddFilter('Primary Route URL', 'Starts With', subdomain)
        ARDashboardPage.getLongWait()
        cy.get(ARDashboardPage.getGridTable()).eq(0).click()
        cy.get(ARClientsPage.getClientTableColumns()).eq(0).should('contain',`#Demo ${accountIdentification.companyName}`)


    })
    
})







