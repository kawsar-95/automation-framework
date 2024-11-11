/// <reference types="cypress" />

import ARDashboardPage from "../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARILCActivityReportPage from "../../../../../../../helpers/AR/pageObjects/Reports/ARILCActivityReportPage"
import ARILCSessionReportPage from "../../../../../../../helpers/AR/pageObjects/Reports/ARILCSessionReportPage"
import { users } from "../../../../../../../helpers/TestData/users/users"



describe(" Sanity check for MT-8900 ", function () {
    beforeEach(function () {
        cy.adminLoginWithSession(users.instructor01.instructor_01_username, users.instructor01.instructor_01_password)
    })


    it("Check for Sessions", function () {
        ARDashboardPage.getShortWait()
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Reports'))).click()
        ARDashboardPage.getMenuItemOptionByName('ILC Sessions')
        cy.get(ARILCSessionReportPage.getSectionHeader()).should('contain', 'ILC Sessions')

    })

    it("Check for Activity", function () {
        ARDashboardPage.getShortWait()
        //Choose In ILC Activity from reports
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Reports'))).click()
        ARDashboardPage.getMenuItemOptionByName('ILC Activity')
        cy.get(ARILCActivityReportPage.getSectionHeader()).should('contain', "ILC Activity")
    })


    it("Check for Session Approval", function () {
        ARDashboardPage.getShortWait()
        //Choose In ILC Activity from reports
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Reports'))).click()
        ARDashboardPage.getMenuItemOptionByName('Session Approvals')
        cy.get(ARILCActivityReportPage.getSectionHeader()).should('contain', "Session Approvals")
    })



}) 
