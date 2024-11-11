import courses from '../../../../../../fixtures/courses.json'
import departments from '../../../../../../fixtures/departments.json'
import LEDashboardPage from '../../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LEEnrollmentKeyModal from '../../../../../../../helpers/LE/pageObjects/Modals/LEEnrollmentKeyModal'
import defaultTestData from '../../../../../../fixtures/defaultTestData.json'
import LEAccountPage from '../../../../../../../helpers/LE/pageObjects/ECommerce/LEAccountPage'
import LESideMenu from '../../../../../../../helpers/LE/pageObjects/Menu/LESideMenu'
import LEProfilePage from '../../../../../../../helpers/LE/pageObjects/User/LEProfilePage'

let username = defaultTestData.USER_LEARNER_FNAME + '.' + defaultTestData.USER_LEARNER_LNAME
let userID;

describe('LE - E-Comm - Signup - With EKey - Valid', function(){

    before(function() {
        cy.visit("/#/public-dashboard")
        cy.get(LEDashboardPage.getPublicDashboardSignupBtn()).click()
    })

    it('Enter valid E-Key, Click Signup Button', () => {     
        cy.get(LEEnrollmentKeyModal.getKeyNameTxtF()).type(defaultTestData.E_KEY_01)
        //VShort wait is required here as bot protection will detect submissions <900ms
        LEDashboardPage.getVShortWait()
        cy.get(LEEnrollmentKeyModal.getSignupBtn()).click()

        //Enter new user details and complete signup
        cy.get(LEAccountPage.getFirstNameTxtF()).type(defaultTestData.USER_LEARNER_FNAME)
        cy.get(LEAccountPage.getLastNameTxtF()).type(defaultTestData.USER_LEARNER_LNAME)
        cy.get(LEAccountPage.getEmailTxtF()).type(defaultTestData.USER_LEARNER_EMAIL)
        cy.get(LEAccountPage.getPasswordTxtF()).type(defaultTestData.USER_PASSWORD)
        cy.get(LEAccountPage.getReEnterPasswordTxtF()).type(defaultTestData.USER_PASSWORD)
        cy.get(LEAccountPage.getProceedBtn()).click()
        LEDashboardPage.getShortWait()
    }) 
})

describe('LE - E-Comm - Signup - With EKey - Valid - Verify Auto-Enrollments', function(){
    
    beforeEach(() => {
        cy.learnerLoginThruDashboardPage(username, defaultTestData.USER_PASSWORD) 
    })

    after(function() {
        //Cleanup - Get userID, logout, and delete them
        cy.get(LEDashboardPage.getNavProfile()).click()
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
        cy.url().then((currentURL) => {
            userID = currentURL.slice(48);
            cy.logoutLearner();
            cy.deleteUser(userID);
        })
    })

    it('Verify each course card', () => {     
        //Navigate to user courses
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('My Courses')

        //Verify Curr 01
        LEDashboardPage.getVerifyCourseCardNameAndBtn(courses.CURR_ECOMM_01_NAME, 'Start')

        //Verify ILC Child 01
        LEDashboardPage.getVerifyCourseCardNameAndBtn(courses.ILC_ECOMM_CHILD_01_NAME, 'Choose Session')

        //Verify ILC Free 01
        LEDashboardPage.getVerifyCourseCardNameAndBtn(courses.ILC_ECOMM_FREE_COURSE_01_NAME, 'Choose Session')

        //Verify OC Free 01
        LEDashboardPage.getVerifyCourseCardNameAndBtn(courses.OC_ECOMM_FREE_COURSE_01_NAME, 'Start')
    }) 

    it('Verify Users Department', () => {     
        cy.get(LEDashboardPage.getNavProfile()).click()
        cy.get(LEProfilePage.getLearnerDepartment()).should('contain', departments.SUB_DEPT_A_NAME)
    }) 
})