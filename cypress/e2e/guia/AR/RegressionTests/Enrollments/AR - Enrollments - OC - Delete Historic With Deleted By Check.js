import { users } from "../../../../../../helpers/TestData/users/users"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import { commonDetails } from "../../../../../../helpers/TestData/Courses/commonDetails"
import ARUpdateScriptPage from "../../../../../../helpers/AR/pageObjects/UpdateScript/ARUpdateScriptPage"
import { ocDetails } from '../../../../../../helpers/TestData/Courses/oc'
import ARUserAddEditPage from '../../../../../../helpers/AR/pageObjects/User/ARUserAddEditPage'
import { userDetails, generalSectionFieldNames } from "../../../../../../helpers/TestData/users/UserDetails"
import ARUserEnrollmentPage from '../../../../../../helpers/AR/pageObjects/User/ARUserEnrollmentPage'
import AREnrollUsersPage from '../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage'
import ARUserPage from "../../../../../../helpers/AR/pageObjects/User/ARUserPage"
import AR5EnrollmentHistoryPage from "../../../../../../helpers/AR/pageObjects/Enrollment/A5EnrollmentHistoryPage"
import ARUserReEnrollModal from "../../../../../../helpers/AR/pageObjects/modals/ARUserReEnrollModal"

describe('MT-10722 - Delete enrollment with deleted by check', () => {

    let enrollmentId // Declare

    beforeEach('Login as an System Admin create a course, a user, an enrollment and a historic enrollment then delete distoric enrollment', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
    
        ARDashboardPage.getUsersReport()
        
        //Get admin User Id
        cy.wrap(ARUserPage.editUser(generalSectionFieldNames.username, users.sysAdmin.admin_sys_01_username))
        ARDashboardPage.getLongWait()
        cy.url().then((currentUrl) => { 
            users.sysAdmin.admin_sys_01_id = currentUrl.slice(-36) 
        })

        ARDashboardPage.getCoursesReport()
        // Create an online course
        cy.createCourse('Online Course')
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36)
        })

        ARDashboardPage.getUsersReport()
        ARDashboardPage.getLongWait()

        //Create user
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)

        //Get User Id
        cy.wrap(ARUserPage.editUser(generalSectionFieldNames.username, userDetails.username))
        ARDashboardPage.getLongWait()
        cy.url().then((currentUrl) => { 
            userDetails.userID = currentUrl.slice(-36) 
        })

        cy.wrap(ARDashboardPage.getUsersReport())
        ARDashboardPage.getLongWait()

        //Enroll User
        ARDashboardPage.getCoursesReport()
        ARUserAddEditPage.getShortWait()
        AREnrollUsersPage.getEnrollUserByCourseAndUsername([ocDetails.courseName], [userDetails.username])

        //Go to User Enrollment
        ARDashboardPage.getUserEnrollmentsReport()

        //Filter and select enrollment
        ARUserEnrollmentPage.ChooseUserAddFilter(userDetails.username)
        ARUserEnrollmentPage.AddFilter('Name', 'Starts With', ocDetails.courseName)
        ARUserEnrollmentPage.selectTableCellRecord(ocDetails.courseName)
        ARDashboardPage.getShortWait()

        //Re-enroll the user
        cy.get(ARUserEnrollmentPage.getReEnrollUserButton()).click()
        ARDashboardPage.getShortWait()
        cy.wrap(ARUserReEnrollModal.selectApplyBtn())
        ARDashboardPage.getMediumWait()

        //Go to historic enrollments
        cy.get(ARUserEnrollmentPage.getViewHistoricButton()).click()
        ARDashboardPage.getLongWait()

        cy.wrap(AR5EnrollmentHistoryPage.selectA5TableCellRecord(ocDetails.courseName))
        ARDashboardPage.getMediumWait()
        
        //Edit enrollment to get Id from URL and go back to Historic Enrollment page
        cy.contains(AR5EnrollmentHistoryPage.getEditActivityBtn()).click().wait(10000)
        cy.url().then(currentUrl => { 
            enrollmentId = currentUrl.slice(-36)   
        })
        cy.contains('Cancel').click()

        ARDashboardPage.getLongWait()

        //Delete Historic Enrollment
        cy.wrap(AR5EnrollmentHistoryPage.selectA5TableCellRecord(ocDetails.courseName))
        ARUserAddEditPage.getMediumWait()
        cy.wrap(AR5EnrollmentHistoryPage.deleteHistoricEnrollment())
        ARUserAddEditPage.getShortWait()
    })

    it('Deleted by check for historic enrollment',() => {        
        //Log in as Blatant admin
        cy.apiLoginWithSession(users.blatAdmin.admin_blat_01_username, users.blatAdmin.admin_blat_01_password, '/admin')

        //Go to UpdateScriptPage
        ARDashboardPage.getMediumWait()
        cy.visit(ARUpdateScriptPage.getUpdateScriptUrlExtension())

        //Run Get Deleted By Object Id
        ARDashboardPage.getMediumWait()
        ARUpdateScriptPage.getDeletedByUserId(enrollmentId, "CourseEnrollment")
        
        //wait till redirected to new page
        ARDashboardPage.getShortWait()
        cy.get('body').should('contain', users.sysAdmin.admin_sys_01_id)
    })

    after('MT-10722 - delete course and user',()=>{
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.deleteCourse(commonDetails.courseID)
        cy.deleteUser(userDetails.userID) 
    })
})