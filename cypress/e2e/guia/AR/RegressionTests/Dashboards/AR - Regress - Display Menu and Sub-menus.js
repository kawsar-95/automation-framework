import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import { users } from "../../../../../../helpers/TestData/users/users"

describe('C734 - Display All Menus and Sub-menus',()=>{
    beforeEach(()=>{
        cy.apiLoginWithSession(
            users.sysAdmin.admin_sys_01_username,
            users.sysAdmin.admin_sys_01_password,
            "/admin"
          )
    })

    it('Main Menu appears correctly',()=>{
        // As an Admin I navigate to the NASA side and examine the main menu
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute("Courses"), {timeout: 7500}).should('exist')
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute("Users")).should('exist')
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute("Engage")).should('exist')
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute("E-Commerce")).should('exist')
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute("Reports")).should('exist')
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute("Setup")).should('exist')
    })

    it('Examine the Sub menus',()=>{
        //Examine Courses sub menus
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute("Courses"), {timeout: 7500}).click()
        cy.get(ARDashboardPage.getMenuItem()).should('contain','Courses')
        cy.get(ARDashboardPage.getMenuItem()).should('contain','Lessons')
        cy.get(ARDashboardPage.getMenuItem()).should('contain','Question Banks')
        cy.get(ARDashboardPage.getMenuItem()).should('contain','Venues')
        cy.get(ARDashboardPage.getMenuItem()).should('contain','Global Resources')
        cy.get(ARDashboardPage.getMenuItem()).should('contain','Competencies')
        cy.get(ARDashboardPage.getMenuItem()).should('contain','Tags')
        cy.get(ARDashboardPage.getMenuItem()).should('contain','Comments')
        cy.get(ARDashboardPage.getMenuItem()).should('contain','Ratings')
        cy.get(ARDashboardPage.getMenuItem()).should('contain','Enrollments')

        // Examine Users sub menus
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute("Users")).click()
        cy.get(ARDashboardPage.getMenuItem()).should('contain','Users')
        cy.get(ARDashboardPage.getMenuItem()).should('contain','Roles')
        cy.get(ARDashboardPage.getMenuItem()).should('contain','Departments')
        cy.get(ARDashboardPage.getMenuItem()).should('contain','Groups')
        cy.get(ARDashboardPage.getMenuItem()).should('contain','Enrollment Keys')
        cy.get(ARDashboardPage.getMenuItem()).should('contain','Enrollments')

        // Examine Engage sub menus
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute("Engage")).click()
        cy.get(ARDashboardPage.getMenuItem()).should('contain','News Article')
        cy.get(ARDashboardPage.getMenuItem()).should('contain','Billboards')
        cy.get(ARDashboardPage.getMenuItem()).should('contain','Polls')
        cy.get(ARDashboardPage.getMenuItem()).should('contain','Leaderboards')
        cy.get(ARDashboardPage.getMenuItem()).should('contain','Collaborations')
        cy.get(ARDashboardPage.getMenuItem()).should('contain','Collaboration Activity')

        // Examine E-commerce sub menus
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute("E-Commerce")).click()
        cy.get(ARDashboardPage.getMenuItem()).should('contain','Transactions')
        cy.get(ARDashboardPage.getMenuItem()).should('contain','Transaction Details')
        cy.get(ARDashboardPage.getMenuItem()).should('contain','Coupons')

        // Examine Reports sub menus
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute("Reports")).click()
        cy.get(ARDashboardPage.getMenuItem()).should('contain','Learner Activity')
        cy.get(ARDashboardPage.getMenuItem()).should('contain','Learner Progress')
        cy.get(ARDashboardPage.getMenuItem()).should('contain','Department Progress')
        cy.get(ARDashboardPage.getMenuItem()).should('contain','Learner Competencies')
        
        // Examine Setup sub menus
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute("Setup")).click()
        cy.get(ARDashboardPage.getMenuItem()).should('contain','Files')
        cy.get(ARDashboardPage.getMenuItem()).should('contain','Generated Reports')
        cy.get(ARDashboardPage.getMenuItem()).should('contain','Saved Reports')
        cy.get(ARDashboardPage.getMenuItem()).should('contain','Message Templates')
        cy.get(ARDashboardPage.getMenuItem()).should('contain','Translations')
        cy.get(ARDashboardPage.getMenuItem()).should('contain','FAQs')
        cy.get(ARDashboardPage.getMenuItem()).should('contain','System Usage')
        cy.get(ARDashboardPage.getMenuItem()).should('contain','Logins')
        cy.get(ARDashboardPage.getMenuItem()).should('contain','Search Analytics')
        cy.get(ARDashboardPage.getMenuItem()).should('contain','Templates')
    })
})