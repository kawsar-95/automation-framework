import LECatalogPage from "../../../../../../helpers/LE/pageObjects/Catalog/LECatalogPage"
import LEDashboardPage from "../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage"
import { users } from "../../../../../../helpers/TestData/users/users"
import { ocDetails } from "../../../../../../helpers/TestData/Courses/oc"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import { commonDetails } from "../../../../../../helpers/TestData/Courses/commonDetails"
import ARCourseSettingsEnrollmentRulesModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module"


describe('C6323, LE - Catalog - Load More', function () {

    before('Create 3 courses to exceed the total course number in the catalog over 30 to make the boundary test', () => {

        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getCoursesReport()
        // Create a course
        for (let i = 0; i <= 4 ; i++) {
            cy.createCourse('Online Course', ocDetails.courseName)
            // Set enrollment rule - Allow self enrollment for all learners
            cy.get(ARCourseSettingsEnrollmentRulesModule.getRadioBtnContainer()).contains('All Learners').click()
            // Store the course id for later use
            cy.publishCourseAndReturnId().then((id) => {
               commonDetails.courseIDs.push(id.request.url.slice(-36))
               
            })
        }
        ARDashboardPage.getMediumWait()
    })

    after('Delete This Courses Bundle', () => {

        let set = new Set(commonDetails.courseIDs);
        const array = Array.from(set)
        for (let i = 0; i < array.length; i++) {
            cy.deleteCourse(array[i])
        }
    })

    beforeEach(() => {
        // As a learner, Login into the LE portal
        cy.apiLoginWithSession(users.learner01.learner_01_username, users.learner01.learner_01_password, '/#/catalog')
    })

    it('Choose Card View', function () {
        // Click on the 'Choose View'
        cy.get(LECatalogPage.getElementByTitleAttribute('Choose View')).click()
        cy.get(LEDashboardPage.getLEEllipsesLoader()).should('not.exist', { timeout: 30000 })

        //Click on the 'Card View'
        cy.get(LECatalogPage.getElementByTitleAttribute('Card View')).click()

        // Assert that number of courses appearing is equal to 30
        cy.get(LECatalogPage.getCardCourse()).should('have.length', 30)

        // Assert that load more button has a count on the RHS as "30/'
        cy.get(LECatalogPage.getLoadMoreBtn()).contains('span', "30 /").should('exist')
        cy.get(LECatalogPage.getPageSizeModuleLoader()).should('not.exist')

        // Click on the 'Load More' button
        cy.get(LECatalogPage.getLoadMoreBtn()).contains('span', "Load more...").scrollIntoView().click()
        cy.get(LECatalogPage.getPageSizeModuleLoader()).should('not.exist')

        // Assert that "Load More" button is visible, if number of courses more than 60.
        cy.get(LECatalogPage.getCardCourse()).then(($button) => {

            if ($button.length >= 60) {
                // Assert that load more button has a count on the RHS as "60/'
                cy.get(LECatalogPage.getLoadMoreBtn()).contains('span', "60 /").should('exist')
            }
            else {
                cy.get(LECatalogPage.getLoadMoreBtn()).should('not.exist')
            }
        })
    })

    it('Choose List View', function () {
        // Click on the 'Choose View'
        cy.get(LECatalogPage.getElementByTitleAttribute('Choose View')).click()
        LECatalogPage.getShortWait()
        cy.get(LEDashboardPage.getLEEllipsesLoader()).should('not.exist', { timeout: 30000 })

        // Click on the 'List View'
        cy.get(LECatalogPage.getElementByTitleAttribute('List View')).click()

        // Assert that number of courses appearing is equal to 30
        cy.get(LECatalogPage.getListCourse()).should('have.length', 30)

        // Assert that load more button has a count on the RHS as "30/'
        cy.get(LECatalogPage.getLoadMoreBtn()).contains('span', "30 /").should('exist')
        cy.get(LECatalogPage.getPageSizeModuleLoader()).should('not.exist')
        // Click on the 'Load More' button
        cy.get(LECatalogPage.getLoadMoreBtn()).contains('span', "Load more...").click()
        cy.get(LECatalogPage.getPageSizeModuleLoader()).should('not.exist')

        // Assert that "Load More" button is visible, if number of courses more than 60.
        cy.get(LECatalogPage.getListCourse()).then(($button) => {

            if ($button.length >= 60) {
                // Assert that load more button has a count on the RHS as "60/'
                cy.get(LECatalogPage.getLoadMoreBtn()).contains('span', "60 /").should('exist')
            }
            else {
                cy.get(LECatalogPage.getLoadMoreBtn()).should('not.exist')
            }
        })
    })

    it('Choose Detail View', function () {
        // Click on the 'Choose View'
        cy.get(LECatalogPage.getElementByTitleAttribute('Choose View')).click()
        LECatalogPage.getShortWait()
        cy.get(LEDashboardPage.getLEEllipsesLoader()).should('not.exist', { timeout: 30000 })

        // Click on the 'Detail View'
        cy.get(LECatalogPage.getElementByTitleAttribute('Detail View')).click()
        LECatalogPage.getMediumWait()

        // Assert that number of courses appearing is equal to 30
        cy.get(LECatalogPage.getDetailCourse()).should('have.length', 30)

        // Assert that load more button has a count on the RHS as "30/'
        cy.get(LECatalogPage.getLoadMoreBtn()).contains('span', "30 /").should('exist')
        cy.get(LECatalogPage.getPageSizeModuleLoader()).should('not.exist')
        // Click on the 'Load More' button
        cy.get(LECatalogPage.getLoadMoreBtn()).contains('span', "Load more...").click()
        cy.get(LECatalogPage.getPageSizeModuleLoader()).should('not.exist')

        // Assert that "Load More" button is visible, if number of courses more than 60.
        cy.get(LECatalogPage.getDetailCourse()).then(($button) => {

            if ($button.length >= 60) {
                // Assert that load more button has a count on the RHS as "60/'
                cy.get(LECatalogPage.getLoadMoreBtn()).contains('span', "60 /").should('exist')
            }
            else {
                cy.get(LECatalogPage.getLoadMoreBtn()).should('not.exist')
            }
        })

        // Logout learner
        cy.logoutLearner()
        // Assert that learner has logged out successfully and page is redirected to public-dashboard page
        cy.url().should('include', '/#/public-dashboard')
    })
})