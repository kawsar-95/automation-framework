import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARUserTranscriptPage from "../../../../../../helpers/AR/pageObjects/User/ARUserTranscriptPage"
import { users } from "../../../../../../helpers/TestData/users/users"

describe('AUT-680 - C7299 - User Transcript Print Version should be', () => {
    beforeEach(() => {
        // Log in as a blatant admin, system admin, admin, Dept admin or group admin.
        cy.apiLoginWithSession(
            users.sysAdmin.admin_sys_01_username,
            users.sysAdmin.admin_sys_01_password,
            "/admin"
        )
    })

    it('User Transcript', () => {
        ARDashboardPage.getMediumWait()
        // Click on Users from left side panel.
        cy.get(ARDashboardPage.getMenu('Reports')).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Certificates'))
        ARDashboardPage.getMediumWait()

        ARDashboardPage.A5AddFilter('Username', 'Equals', users.sysAdmin.admin_sys_01_username)
        ARDashboardPage.getMediumWait()
        cy.get('tbody').within(() => {
            cy.get('tr').its('length').as('certificateCount')
        })
        cy.visit('/admin')
        ARDashboardPage.getMediumWait()
        // Click on Users from left side panel.
        cy.get(ARDashboardPage.getMenu('Users')).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Users'))
        ARDashboardPage.getMediumWait()
        // Select user that mentioned in pre-condition and click on user transcript
        ARDashboardPage.AddFilter('Username', 'Equals', users.sysAdmin.admin_sys_01_username)
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getGridTable()).eq(0).click()
        ARDashboardPage.getMediumWait()
        // Click on user transcript for that user
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('User Transcript')).click()
        ARDashboardPage.getMediumWait()
        // Certificate received by the user is the accurate number when compared to the View certificate page
        cy.get(ARUserTranscriptPage.getCertificateContainer()).within(() => {
            cy.get('a').its('length').then((length) => {
                cy.get('@certificateCount').then((count) => {
                    expect(count).eq(length)
                })
            })

        })
        // Click on Print Transcript button
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Print Transcript')).click()
        cy.window().then((win) => {
            cy.stub(win, 'open', url => {
                win.location.href = Cypress.config().baseUrl + url
            }).as('popup')
        })
        cy.get(ARUserTranscriptPage.getElementByDataNameAttribute(ARUserTranscriptPage.getTranscriptPageTitle())).should('contain.text', 'Transcript for ' + users.sysAdmin.admin_sys_01_fname)
        // The learner has correct number of # Certificates
        cy.get(ARUserTranscriptPage.getCertificateContainer()).within(() => {
            cy.get('a').its('length').then((length) => {
                cy.get('@certificateCount').then((count) => {
                    expect(count).eq(length)
                })
            })

        })
    })
})