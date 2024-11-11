// AR - RP - User and Course Visibility - Reviewer.js
import arDashboardAccountMenu from '../../../../../../../helpers/AR/pageObjects/Menu/ARDashboardAccount.menu'
import arDashboardPage from '../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arReviewerLearnersPage from '../../../../../../../helpers/AR/pageObjects/OJT/ARReviewerLearnersPage'
import arReviewerChecklistPage from '../../../../../../../helpers/AR/pageObjects/OJT/ARReviewChecklistPage'
import arReviewerMenu from '../../../../../../../helpers/AR/pageObjects/Menu/ARReviewer.menu'
import { users } from '../../../../../../../helpers/TestData/users/users'
import { arrayOfUsers } from '../../../../../../../helpers/TestData/users/UserDetails'
import { arrayOfCourses } from '../../../../../../../helpers/TestData/Courses/commonDetails'


describe('AR - Regress - RP - User and Course Visibility - Reviewer', function () {


    it('Reviewer can see users within the department in which it is assigned', () => {
        cy.loginAdmin(users.reviewer.reviewer_username, users.reviewer.reviewer_password)
        cy.get(arDashboardPage.getElementByDataNameAttribute(arDashboardPage.getAccountBtn())).click()
        arDashboardAccountMenu.getLearnerOrReviewerExperienceBtnByName('Reviewer Experience')
        cy.get(arDashboardPage.getElementByDataNameAttribute(arReviewerLearnersPage.getReviewerPageTitle())).contains(`Learners`)
        cy.wrap(arReviewerLearnersPage.getThemedToggleBtn('Not Ready'))
        arReviewerLearnersPage.getShortWait()
        arReviewerLearnersPage.getReviewerName(arrayOfUsers.reviewUsers[1]).should('be.visible')
        cy.get(arReviewerLearnersPage.getReviewerNameList()).contains(arrayOfUsers.reviewUsers[0]).should('be.visible')
        cy.get(arReviewerLearnersPage.getHeaderMenuBtn()).click()
        cy.get(arReviewerMenu.getMenuItemsBtn()).contains('Admin Experience').click()
        cy.logoutAdmin()
    })

    it('Reviewer can see courses within the department in which it is assigned', () => {
        cy.loginReviewer(users.reviewer.reviewer_username, users.reviewer.reviewer_password)
        cy.get(arDashboardPage.getElementByDataNameAttribute(arReviewerLearnersPage.getReviewerPageTitle())).contains(`Learners`)
        arReviewerLearnersPage.getShortWait()
        cy.wrap(arReviewerLearnersPage.getThemedToggleBtn('Not Ready'))
        cy.get(arReviewerLearnersPage.getReviewerNameList()).contains(arrayOfUsers.reviewUsers[0]).click();
        cy.get(arDashboardPage.getElementByDataNameAttribute(arReviewerLearnersPage.getReviewerPageTitle())).contains(`Checklists`)
        cy.get(arReviewerChecklistPage.getReviewerCourseLabel()).contains(arrayOfCourses.reviewCourses[0]).should('be.visible')
        cy.get(arReviewerChecklistPage.getReviewerCourseLabel()).contains(arrayOfCourses.reviewCourses[1]).should('be.visible')
        cy.get(arReviewerLearnersPage.getHeaderMenuBtn()).click()
        cy.get(arReviewerMenu.getMenuItemsBtn()).contains('Log Off').click()
    })

})
