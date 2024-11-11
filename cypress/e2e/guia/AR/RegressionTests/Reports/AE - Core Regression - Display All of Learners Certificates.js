import ARReportsPage from "../../../../../../helpers/AR/pageObjects/ARReportsPage";
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage";
import ARUserTranscriptPage from "../../../../../../helpers/AR/pageObjects/User/ARUserTranscriptPage";
import arUserTranscriptPage from "../../../../../../helpers/AR/pageObjects/User/ARUserTranscriptPage";
import { users } from "../../../../../../helpers/TestData/users/users";

const username = 'GUIAutoL TransCert'

describe('MT-9124 - User Transcript Print Version should be Displayed All of Learners Certificates from Admin (cloned) T832323', function () {

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')

    })

    it('Check Certificate and open Transcript', () => {
        // Go to users page
        ARDashboardPage.getUsersReport()
        ARDashboardPage.AddFilter('Username', 'Contains', username)
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getGridTable()).eq(0).click()
        ARDashboardPage.getShortWait()
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('User Transcript')).click()

        cy.get(ARUserTranscriptPage.getCertificateWrapper()).its('length').then((length1) => {
            cy.wrap(length1).as('length_one')
        })
        ARDashboardPage.getMediumWait()

        // Go to reports page
        //Click on certificates
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Reports'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Certificates'))
        ARDashboardPage.getMediumWait()

        // Select the user
        ARDashboardPage.A5AddFilter('Username', 'Contains', username)
        ARDashboardPage.getMediumWait()

          cy.get(ARReportsPage.getReportTotalNumberofRecords()).its('length').then((length2) => {
            cy.get('@length_one').then((lengthOne) => {
                expect(lengthOne).equals(length2)
            })
        })
        
    })  
    
    it('Click Print Transcript and Verify the Transcript page is opened', () => {
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Users'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Users'))
        ARDashboardPage.getMediumWait()
        ARDashboardPage.AddFilter('Username', 'Contains', username)
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getGridTable()).eq(0).click()
        ARDashboardPage.getShortWait()
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('User Transcript')).click()
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Print Transcript')).click()
        cy.window().then((win) => {
            // Replace window.open(url, target)-function with our own arrow function
            cy.stub(win, 'open', url => 
            {
              // change window location to be same as the popup url
              win.location.href = Cypress.config().baseUrl + url;
            }).as("popup") // alias it with popup, so we can wait refer it with @popup
          })
          cy.get(arUserTranscriptPage.getCertificateWrapper()).should('exist')
       
    })
})