import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARDashboardAccountMenu from "../../../../../../helpers/AR/pageObjects/Menu/ARDashboardAccount.menu"
import ARUserTranscriptPage, { TranscriptTimeZones } from "../../../../../../helpers/AR/pageObjects/User/ARUserTranscriptPage"
import { userDetails } from "../../../../../../helpers/TestData/users/UserDetails"
import { users } from "../../../../../../helpers/TestData/users/users"


describe('AUT-602 - C2086 - GUIA-Story - NLE - 2901 - Address mismatch between transcript, certificate, and admin report completion times', () => {
    
    after('Delete user', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout:15000 }).should("not.exist")
        ARDashboardPage.deleteUsers([userDetails.username])
    })

    it('User transcript time-zome change assert', () => {
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
       
        // Click on users
        ARDashboardPage.getUsersReport()
        ARDashboardPage.AddFilter('Username', 'Contains', userDetails.username)
        cy.get(ARDashboardPage.getGridTable()).eq(0).click()

        // User Transcript 
        cy.get(ARUserTranscriptPage.getUserTranscriptMenu(), { timeout: 10000 }).should('have.attr', 'aria-disabled', 'false').click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 10000 }).should('not.exist')
        cy.get(ARUserTranscriptPage.getUserTranscriptUserProfile(), { timeout: 10000 }).should('be.visible')
        cy.get(ARUserTranscriptPage.getUserTranscriptTimeMsg()).should('contain', ARUserTranscriptPage.getTranscriptTimeDisplayMessage(TranscriptTimeZones.Alaska))

        cy.get(ARUserTranscriptPage.getUserTranscriptTimeMsg(), { timeout: 10000 }).invoke('text').then((text) => {
            cy.wrap(text).as('dateTime')
        })

        cy.get(ARDashboardPage.getUserAccountBtn(), { timeout: 10000 }).should('be.visible').click()
        cy.get(ARDashboardAccountMenu.getTimeSelected(TranscriptTimeZones.Alaska), { timeout: 10000 }).should('exist')
        cy.get(ARDashboardAccountMenu.getLanguageBar(), { timeout: 10000 }).scrollIntoView().should('be.visible').click({force:true})
        cy.get(ARDashboardAccountMenu.getLanguageOpt()).contains('Italiano').parent().parent().click()
        cy.get(ARDashboardPage.getUserAccountBtn(), { timeout: 10000 }).click()

        // Assert that after changing the language, display time format is also changed
        cy.get('@dateTime').then((dateTime) => {
            cy.get(ARUserTranscriptPage.getUserTranscriptTimeMsg()).should('not.equal', dateTime)
        })

        cy.get(ARDashboardPage.getUserAccountBtn(), { timeout: 10000 }).click()
        cy.get(ARDashboardAccountMenu.getLanguageBar(), { timeout: 10000 }).scrollIntoView().should('be.visible').click({force:true})
        cy.get(ARDashboardAccountMenu.getLanguageOpt()).contains('English').parent().parent().click()
        cy.get(ARDashboardPage.getUserAccountBtn(), { timeout: 10000 }).click()
    })
})