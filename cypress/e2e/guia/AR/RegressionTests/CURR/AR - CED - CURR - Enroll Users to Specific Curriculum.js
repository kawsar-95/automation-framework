import ARCURRAddEditPage from "../../../../../../helpers/AR/pageObjects/Courses/CURR/ARCURRAddEditPage"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARSelectModal from "../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal"
import AREnrollUsersPage from "../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage"
import LEDashboardPage from "../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage"
import { commonDetails } from "../../../../../../helpers/TestData/Courses/commonDetails"
import { courses } from "../../../../../../helpers/TestData/Courses/courses"
import { currDetails } from "../../../../../../helpers/TestData/Courses/curr"
import { userDetails } from "../../../../../../helpers/TestData/users/UserDetails"
import { users } from "../../../../../../helpers/TestData/users/users"
const userNames = [
    userDetails.username, userDetails.username2, userDetails.username3,
    userDetails.username4, userDetails.username5, userDetails.username6, userDetails.username7
]
var i = 0;
describe('C6525 - Enroll Users to Specific Curriculam', () => {
    before(() => {
        for (i = 0; i < userNames.length; i++) {
            cy.log('User : ' + userNames[i])
            cy.createUser(void 0, userNames[i], ["Learner"], void 0)
        }
    })
    beforeEach(() => {
        // Login as admin/ Blatant admin.
        cy.apiLoginWithSession(
            users.sysAdmin.admin_sys_01_username,
            users.sysAdmin.admin_sys_01_password,
            '/admin'
        )
    })
    after(() => {
        //Delete Course
        cy.deleteCourse(commonDetails.courseID, 'curricula')
    })
    it('Create Curriculam Course', () => {
        //Navigate to Course
        ARDashboardPage.getCoursesReport()
        // Click on Add Curriculum from right panel. Fill values in all required fields and toggle on status to active.
        cy.createCourse('Curriculum')
        // Select any no of courses from the pop-up and click on choose button.
        ARSelectModal.SearchAndSelectFunction([courses.oc_filter_01_name, courses.oc_filter_02_name])
        // Select "Minimum Credits" option for both of the groups.
        cy.get(ARCURRAddEditPage.getGroupTitle())
            .contains(currDetails.defaultGroupName)
            .parents(ARCURRAddEditPage.getGroupContainer()).within(() => {
                cy.get(ARDashboardPage.getElementByDataNameAttribute('radio-button')).contains('Minimum credits').click({ force: true })
                // Enter any value in text box
                cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Minimum credits')).type('3')
            })
        cy.get(ARCURRAddEditPage.getAddGroupBtn()).click()
        cy.get(ARCURRAddEditPage.getGroupTitle(), { timeout: 10000 }).should('be.visible')
            .contains(currDetails.defaultGroupName2)
            .parents(ARCURRAddEditPage.getGroupContainer()).within(() => {
                cy.get(ARCURRAddEditPage.getAddCoursesBtn()).should('have.attr', 'aria-disabled', 'false').click()
            })
        ARSelectModal.SearchAndSelectFunction([courses.oc_filter_03_name, courses.oc_filter_04_ojt])
        // Select "Minimum Credits" option for both of the groups.
        cy.get(ARCURRAddEditPage.getGroupTitle())
            .contains(currDetails.defaultGroupName2)
            .parents(ARCURRAddEditPage.getGroupContainer()).within(() => {
                cy.get(ARDashboardPage.getElementByDataNameAttribute('radio-button')).contains('Minimum credits').click({ force: true })
                // Enter any value in text box
                cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Minimum credits')).type('3')
            })

        //Publish Curriculum
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
        
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 10000 }).should('not.exist')
        AREnrollUsersPage.getEnrollUserByCourseAndUsername([currDetails.courseName], userNames)
    })

    it('Start Course in group 1 from user 1 but dont complete', () => {
        cy.viewport(1600, 900)
        //Click on users
        ARDashboardPage.getUsersReport()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 10000 }).should('not.exist')
        ARDashboardPage.AddFilter('Username', 'Contains', userNames[0])
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 10000 }).should('not.exist')

        cy.get(ARDashboardPage.getGridTable()).eq(0).click()
        //Impersonate as Learner
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Impersonate'), { timeout: 10000 }).should('have.attr', 'aria-disabled', 'false').click()
        LEDashboardPage.waitForLoader(LEDashboardPage.getInitialLoader())
        LEDashboardPage.getTileByNameThenClick('My Courses')
        ARDashboardPage.getMediumWait()

        LEDashboardPage.getCourseCardBtnThenClick(currDetails.courseName)
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(`Enroll ${courses.oc_filter_02_name}`)).click()
    })
    it('Complete the course activities ', () => {
        cy.viewport(1600, 900)
        //Click on users
        ARDashboardPage.getUsersReport()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 10000 }).should('not.exist')
        ARDashboardPage.AddFilter('Username', 'Contains', userNames[0])
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 10000 }).should('not.exist')
        cy.get(ARDashboardPage.getGridTable()).eq(0).click()
        //Impersonate as Learner
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Impersonate'), { timeout: 10000 }).should('have.attr', 'aria-disabled', 'false').click()
        LEDashboardPage.waitForLoader(LEDashboardPage.getInitialLoader())
        LEDashboardPage.getTileByNameThenClick('My Courses')
        ARDashboardPage.getMediumWait()

        LEDashboardPage.getCourseCardBtnThenClick(currDetails.courseName)
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(`Enroll ${courses.oc_filter_01_name}`)).click()
    })
    it('Delete users', () => {
        //Delete Users
        ARDashboardPage.deleteUsers(userNames)
    })
})