import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import AREnrollUsersPage from "../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage"
import LECourseLessonPlayerPage from "../../../../../../helpers/LE/pageObjects/Courses/LECourseLessonPlayerPage"
import LEDashboardPage from "../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage"
import LESideMenu from "../../../../../../helpers/LE/pageObjects/Menu/LESideMenu"
import LEResourcesPage from "../../../../../../helpers/LE/pageObjects/Resources/LEResourcesPage"
import LEProfilePage from "../../../../../../helpers/LE/pageObjects/User/LEProfilePage"
import LESocialProfilePage from "../../../../../../helpers/LE/pageObjects/User/LESocialProfilePage"
import { courses } from "../../../../../../helpers/TestData/Courses/courses"
import { ocDetails } from "../../../../../../helpers/TestData/Courses/oc"
import { userDetails } from "../../../../../../helpers/TestData/users/UserDetails"
import { users } from "../../../../../../helpers/TestData/users/users"


describe('C1805 - AUT-428 - GUIA-Story - NLE-1872 - A learner has a social profile view - certificates and total', () => {
    it('Create a new learner and enroll that learner with certificates course', () => {
        //Creating a new learner
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)

        //Log into the admin side 
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        //Go to course Report 
        ARDashboardPage.getCoursesReport()
        //Emroll the newly created learner to that course
        AREnrollUsersPage.getEnrollUserByCourseAndUsername([courses.oc_filter_01_name], [userDetails.username])

    })

    it('Log in to the LE side and go to course', () => {
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('My Courses')
        cy.get(LEDashboardPage.getLEEllipsesLoader(), { timeout: 15000 }).should('not.exist', { timeout: 15000 })

        cy.get(LEResourcesPage.getCourseCardName()).should('contain', courses.oc_filter_01_name).click()

    })

    it("Verify that the Certificates section is displayed in a learner's social profile", () => {
        // login in the learner side with the newly created user  
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        //Click on nav profile button
        cy.get(LEDashboardPage.getNavProfile()).click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
        //Clicking on the Social Profile button
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')

        //Verify that the top banner section has been laid out
        cy.get(LESocialProfilePage.getSocialProfileModuleType()).contains('Certificates').should('be.visible')


        //Sections should be laid out
        cy.get(LESocialProfilePage.getSocialProfileCertificcatesModuleTitle()).should('be.visible')
        LESocialProfilePage.verifySocialProfileItemsInTable('Certificate Title', 'Certificates')

    })


    it("Clean Up ", () => {
        //Delete the created User
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        //Cleanup - Get userID and delete them
        cy.get(LEDashboardPage.getNavProfile()).click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
        cy.url().then((currentURL) => {
            cy.deleteUser(currentURL.slice(-36));
        })

    })


})