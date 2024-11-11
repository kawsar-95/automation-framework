import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import AREnrollmentKeyPage from '../../../../../../helpers/AR/pageObjects/Enrollment/AREnrollmentKeyPage'
import arCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LEEnrollmentKeyModal from '../../../../../../helpers/LE/pageObjects/Modals/LEEnrollmentKeyModal'
import LEProfilePage from '../../../../../../helpers/LE/pageObjects/User/LEProfilePage'
import { generalFields } from '../../../../../../helpers/TestData/Enrollments/enrollmentKeys'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../helpers/TestData/users/users'
import { userDetails } from '../../../../../../helpers/TestData/users/UserDetails'
import { ocDetails } from '../../../../../../helpers/TestData/Courses/oc'
import { departments } from '../../../../../../helpers/TestData/Department/departments'

describe('AR - Enrollment Key - Usage', function(){

    before(function() {
        //Create a user and online course
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        
        cy.createCourse('Online Course')
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
    })

    after(function() {
        //Delete enrollment key, course, and user via API
        cy.deleteCourse(commonDetails.courseID)
        cy.deleteUser(userDetails.userID)
        AREnrollmentKeyPage.deleteEKeyViaAPI(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, generalFields.eKeyId)
    })
    
    it('Create an Enrollment Key', () => {
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Users'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Enrollment Keys'))
        cy.intercept('/api/rest/v2/admin/reports/enrollment-keys/operations').as('getEKeys').wait('@getEKeys')
        //Create an enrollment key and add new OC
        AREnrollmentKeyPage.getAddEKey(generalFields.singleEKeyName, departments.dept_top_name, [ocDetails.courseName])

        //Store enrollment key url
        cy.get(AREnrollmentKeyPage.getDirectLinkUrl()).invoke('text').then((text) => {
            generalFields.eKeyUrl = text;
        })
        arDashboardPage.getVShortWait() //wait for publish button to become enabled
        
        //Save ekey and store ID
        cy.intercept('POST', '/api/rest/v2/admin/enrollment-keys').as('getEKeyId')
        cy.get(AREnrollmentKeyPage.getSaveBtn()).click()
        cy.wait('@getEKeyId').then((request) => {
            generalFields.eKeyId = request.request.body.id;
        })
    })

    it('Login Learner, Use Enrollment Key', () => {
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        //Enroll in course via ekey
        cy.visit(generalFields.eKeyUrl)
        cy.get(LEEnrollmentKeyModal.getEnrollBtn()).click()
        //Verify course exists in my courses
        cy.get(LEEnrollmentKeyModal.getMyCoursesBtn()).click()
        cy.get(LEDashboardPage.getCourseCardName()).should('contain', ocDetails.courseName)
        //store user ID for deletion later
        cy.get(LEDashboardPage.getNavProfile()).click()  
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
        cy.url().then((currentURL) => {
            userDetails.userID = currentURL.slice(-36)
        })
    })

    it('Verify Enrollment Key Usage', () => {
        //Login as admin, filter for enrollment key
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Users'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Enrollment Keys'))
        cy.intercept('/api/rest/v2/admin/reports/enrollment-keys/operations').as('getEKeys').wait('@getEKeys')
        cy.wrap(arCoursesPage.AddFilter('Name', 'Contains', generalFields.singleEKeyName))
        arCoursesPage.getShortWait()

        //Verify Times Used column
        cy.get(arCoursesPage.getTableCellName(6)).should('contain', '1')

        //Select ekey and go to enrollment key uses
        cy.get(arCoursesPage.getTableCellName(2)).contains(generalFields.singleEKeyName).click()
        cy.wrap(arCoursesPage.WaitForElementStateToChange(arCoursesPage.getAddEditMenuActionsByName('Enrollment Key Uses'), 1000))
        cy.get(arCoursesPage.getAddEditMenuActionsByName('Enrollment Key Uses')).click()
        cy.intercept('/api/rest/v2/admin/reports/users/operations').as('getUsers').wait('@getUsers')

        //Verify user exists in enrollment key uses report
        arCoursesPage.getShortWait()
        cy.get(arCoursesPage.getTableCellName(4)).should('contain', userDetails.username)
    })
})