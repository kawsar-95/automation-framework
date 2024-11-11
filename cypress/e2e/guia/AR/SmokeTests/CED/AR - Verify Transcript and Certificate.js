/// <reference types="cypress" />
import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arEnrollUsersPage from '../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage'
import arSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import arUserTranscriptPage from '../../../../../../helpers/AR/pageObjects/User/ARUserTranscriptPage'
import arUserPage from '../../../../../../helpers/AR/pageObjects/User/ARUserPage'
import { courses } from '../../../../../../helpers/TestData/Courses/courses'
import { users } from '../../../../../../helpers/TestData/users/users'
import { userDetails } from '../../../../../../helpers/TestData/users/UserDetails'



describe('AR - Verify Transcript and Certificate', function () {


    before(function() {
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
    })

    beforeEach(function() {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        //cy.get(arDashboardPage.getSysAdminDashboardPageTitle()).should('have.text', arDashboardPage.getSysAdminDashboardPageTitleTxt())
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Users'))).click()
        arDashboardPage.getMenuItemOptionByName('Users')
        cy.intercept('**/users/operations').as('getUser').wait('@getUser');
    })

    after(function () {
        cy.deleteUser(userDetails.userID);
    })

    it('Enroll User in a course with certificate', () => {
        // Filter for the Learner
        arUserPage.AddFilter('Username', 'Starts With', userDetails.username)
        arUserPage.selectTableCellRecord(userDetails.username)
        // Enroll Learner in a Course
        arUserPage.WaitForElementStateToChange(arUserPage.getAddEditMenuActionsByName('Enroll User'), 1000)
        cy.get(arUserPage.getAddEditMenuActionsByName('Enroll User')).click()
        cy.get(arEnrollUsersPage.getElementByDataName(arEnrollUsersPage.getEnrollUsersAddCourseBtn())).click()
        arSelectModal.SearchAndSelectFunction([courses.oc_filter_01_name]);
        // Save the Enrollment
        arEnrollUsersPage.WaitForElementStateToChange(arEnrollUsersPage.getSaveBtn(), 1000)
        cy.get(arEnrollUsersPage.getSaveBtn()).click()
        arUserPage.getShortWait()
        arUserPage.selectTableCellRecord(userDetails.username)
        arUserPage.getVShortWait()
        cy.get(arUserPage.getAddEditMenuActionsByName('Edit User')).click()
        arUserPage.getShortWait()
        cy.url().then((currentUrl) => { userDetails.userID = currentUrl.slice(48) })
    })

    it('Check Certificate and open Transcript', () => {
        // Filter for the Learner
        arUserPage.AddFilter('Username', 'Starts With', userDetails.username)
        arUserPage.selectTableCellRecord(userDetails.username)
        arUserPage.WaitForElementStateToChange(arUserPage.getAddEditMenuActionsByName('User Transcript'), 1000)
        cy.get(arUserPage.getAddEditMenuActionsByName('User Transcript')).click();
        cy.intercept('**/api/rest/v2/admin/reports/credit-types/operations').as('getTranscript').wait('@getTranscript');
        // Verify Certificate 
        cy.get(arUserTranscriptPage.getCertificateWrapper()).then(() => {
           cy.get(arUserTranscriptPage.getCertificateImage()).should('exist')
           cy.get(arUserTranscriptPage.getCertificateName()).should('have.text', courses.oc_filter_01_name)
        })
        // cy.get(arUserTranscriptPage.getCertificateWrapper()).click()
        cy.get(arUserTranscriptPage.getCertificateWrapper()).should('have.attr', 'target', '_blank')
        arUserTranscriptPage.getShortWait()
    })

    it('Click Print Transcript and Verify the Transcript page is opened', () => {
        // Filter for the Learner
        arUserPage.AddFilter('Username', 'Starts With', userDetails.username)
        arUserPage.selectTableCellRecord(userDetails.username)
        arUserPage.WaitForElementStateToChange(arUserPage.getAddEditMenuActionsByName('User Transcript'), 1000)
        cy.get(arUserPage.getAddEditMenuActionsByName('User Transcript')).click();
        cy.intercept('**/api/rest/v2/admin/reports/credit-types/operations').as('getTranscript').wait('@getTranscript');
        // Verify Print Certificate
        arUserTranscriptPage.getShortWait()
        cy.get(arUserPage.getAddEditMenuActionsByName('Print Transcript')).click();
        cy.window().then((win) => {
            // Replace window.open(url, target)-function with our own arrow function
            cy.stub(win, 'open', url => 
            {
              // change window location to be same as the popup url
              win.location.href = Cypress.config().baseUrl + url;
            }).as("popup") // alias it with popup, so we can wait refer it with @popup
          })
        cy.get(arUserTranscriptPage.getElementByDataNameAttribute(arUserTranscriptPage.getTranscriptPageTitle())).should('contain.text', 'Transcript for GUIA-CED User')
        arUserPage.getShortWait()
    })

})