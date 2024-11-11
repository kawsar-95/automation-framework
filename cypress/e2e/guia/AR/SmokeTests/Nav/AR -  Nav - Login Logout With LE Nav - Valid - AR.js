// AR -  Nav - Login Logout With LE Nav - Valid - AR.js
import users from '../../../../../fixtures/users.json'
import arDashboardAccountMenu from '../../../../../../helpers/AR/pageObjects/Menu/ARDashboardAccount.menu'
import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import leDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import arLoginPage from '../../../../../../helpers/AR/pageObjects/Auth/ARLoginPage'

describe('AR - Smoke - Nav - Login Logout With LE Nav - Valid - AR', () => {

    beforeEach(function() {
        cy.loginAdmin(users.adminLogInOut.ADMIN_LOGINOUT_USERNAME, users.adminLogInOut.ADMIN_LOGINOUT_PASSWORD);
    })

   it('should login with a valid admin', () =>{ 
    })

    it('should verify first name and last names on the top toolbar', () =>{ 
        cy.get(arDashboardPage.getCurrentUserLabel()).contains(`${users.adminLogInOut.ADMIN_LOGINOUT_FNAME} ${users.adminLogInOut.ADMIN_LOGINOUT_LNAME}`)
    })

    it('should navigate to the Learners page', () =>{ 
        cy.get(arDashboardPage.getElementByDataNameAttribute(arDashboardPage.getAccountBtn())).click()
        arDashboardAccountMenu.getLearnerOrReviewerExperienceBtnByName('Learner Experience')
        cy.intercept('GET','/api/rest/v2/my-courses?_sort=-enrolledDate&showCompleted=true').as('getDashboard1').get(leDashboardPage.getDashboardPageTitle()).contains('Welcome').wait('@getDashboard1')
    })

    it('should navigate back to the AR side and logout from the AR side and arrive at the login page', () =>{ 
        cy.get(arDashboardPage.getElementByDataNameAttribute(arDashboardPage.getAccountBtn())).click()
        arDashboardAccountMenu.getLearnerOrReviewerExperienceBtnByName('Learner Experience')
        cy.intercept('GET','/api/rest/v2/my-courses?_sort=-enrolledDate&showCompleted=true').as('getDashboard1').get(leDashboardPage.getDashboardPageTitle()).contains('Welcome').wait('@getDashboard1')
        cy.get(leDashboardPage.getNavMenu()).click()
        cy.get(leDashboardPage.getMenuItems()).find('span').contains('Admin').click()
        cy.logoutAdmin()
        cy.get(arLoginPage.getUsernameTxtF()).should('be.visible')
    })
})