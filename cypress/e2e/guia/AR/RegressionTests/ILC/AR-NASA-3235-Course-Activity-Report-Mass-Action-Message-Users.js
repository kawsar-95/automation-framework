import { users } from '../../../../../../helpers/TestData/users/users'
import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arUserPage from '../../../../../../helpers/AR/pageObjects/User/ARUserPage'
import { adminRoles, userDetails } from '../../../../../../helpers/TestData/users/UserDetails'
import { commonDetails, credit } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { ocDetails } from '../../../../../../helpers/TestData/Courses/oc'
import ARCourseSettingsEnrollmentRulesModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module"
import ARCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import AREnrollUsersPage from "../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage"
import arDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import ARCourseActivityReportPage from "../../../../../../helpers/AR/pageObjects/Reports/ARCourseActivityReportPage"
import arComposeMessage from '../../../../../../helpers/AR/pageObjects/Departments/arComposeMessage'
import { departmentDetails } from '../../../../../../helpers/TestData/Department/departmentDetails'
import LEMessagesMenu from '../../../../../../helpers/LE/pageObjects/Menu/LEMessagesMenu'
import ARUserAddEditPage from '../../../../../../helpers/AR/pageObjects/User/ARUserAddEditPage'
import ARSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import { departments } from '../../../../../../helpers/TestData/Department/departments'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LEProfilePage from '../../../../../../helpers/LE/pageObjects/User/LEProfilePage'
import LECatalogPage from '../../../../../../helpers/LE/pageObjects/Catalog/LECatalogPage'
import ARAddEditCategoryPage from '../../../../../../helpers/AR/pageObjects/Category/ARAddEditCategoryPage'

describe('C1079 - GUIA-Story - NASA-3235 - Course Activity Report Mass Action Message Users (cloned)', () => {

    it('Create a user and course for mass messaging', () => {

        // Create a user for enrollment
        cy.createUser(void 0, userDetails.username2, ["Learner"], void 0)


        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')

        arDashboardPage.getUsersReport()

        // Createing an Admin user for the test
        ARUserAddEditPage.createAdminUser(userDetails.username)

        // Create a course to enroll in
        arDashboardPage.getCoursesReport()


        // Create a course for all learners without any content
        cy.createCourse('Online Course', ocDetails.courseName)
        // Set enrollment rule - Allow self enrollment for all learners
        cy.get(ARCourseSettingsEnrollmentRulesModule.getRadioBtnContainer()).contains('All Learners').click()
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })

        // Enroll users
        AREnrollUsersPage.getEnrollUserByCourseAndUsername([ocDetails.courseName], [userDetails.username, userDetails.username2])

        //Make first user only admin
        arDashboardPage.getUsersReport()
        ARUserAddEditPage.getEditUserByUsername(userDetails.username)
        cy.get(arDashboardPage.getPageHeaderTitle()).should('have.text', "Edit User")
        //This wait is necessary
        arDashboardPage.getMediumWait()
        ARUserAddEditPage.generalToggleSwitch('false', ARUserAddEditPage.getLearnerToggleContainer())
        ARUserAddEditPage.WaitForElementStateToChange(ARUserAddEditPage.getSaveBtn())
        cy.get(ARUserAddEditPage.getSaveBtn()).click()
        cy.get(arDashboardPage.getWaitSpinner(), { timeout: 1500000 }).should('not.exist')
        cy.get(arDashboardPage.getPageHeaderTitle()).should('have.text', 'Users')


    })

    after('Delete the course and the user as part of clen up', () => {
        // Delete Course
        cy.deleteCourse(commonDetails.courseID)

        // Delete user 1
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        cy.get(arDashboardPage.getWaitSpinner(), { timeout: 1500000 }).should('not.exist')
        cy.get(LEDashboardPage.getNavProfile()).click()
        cy.get(arDashboardPage.getWaitSpinner(), { timeout: 1500000 }).should('not.exist')
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
        cy.get(arDashboardPage.getWaitSpinner(), { timeout: 1500000 }).should('not.exist')
        cy.url().then((currentURL) => {
            cy.deleteUser(currentURL.slice(-36));
        })

        // Delete the test Admin
        cy.apiLoginWithSession(userDetails.username2, userDetails.validPassword)
        cy.get(arDashboardPage.getWaitSpinner(), { timeout: 1500000 }).should('not.exist')
        cy.get(LEDashboardPage.getNavProfile()).click()
        cy.get(arDashboardPage.getWaitSpinner(), { timeout: 1500000 }).should('not.exist')
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
        cy.get(arDashboardPage.getWaitSpinner(), { timeout: 1500000 }).should('not.exist')
        cy.url().then((currentURL) => {
            cy.deleteUser(currentURL.slice(-36));
        })



    })

    it('Send mass message to learners and admin', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        // Navigate to course activity
        arDashboardPage.getCoursesActivityReport()
        // Select any course from drop down and click on add filter
        ARCourseActivityReportPage.ChooseAddFilter(ocDetails.courseName)
        //Adding userName to the table so that it can be searched out later
        // The Username column does not appear by default
        cy.get(arDashboardPage.getTableHeader()).should('not.contain', 'Username')

        cy.get(arDashboardPage.getTableDisplayColumnBtn()).click()
        // The Username column appears in the Additional Columns list.
        cy.get(arDashboardPage.getDisplayColumnItemByName('Username')).should('exist')
        // The Username column can be added to the Course Enrollments Report
        cy.get(arDashboardPage.getDisplayColumnItemByName('Username')).click()
        cy.get(arDashboardPage.getTableDisplayColumnBtn()).click({ force: true })
        // The Username column is added to the existing columns
        // The Column is called Username
        cy.get(arDashboardPage.getTableHeader()).should('contain', 'Username')
        cy.get(arDashboardPage.getWaitSpinner(), { timeout: 1500000 }).should('not.exist')
        arDashboardPage.AddFilter('Username', 'Equals', userDetails.username)
        cy.get(arDashboardPage.getWaitSpinner(), { timeout: 1500000 }).should('not.exist')
        cy.get(arDashboardPage.getTableCellRecord()).contains(userDetails.username).click()
        cy.get(arDashboardPage.getWaitSpinner(), { timeout: 1500000 }).should('not.exist')
        arDashboardPage.AddFilter('Username', 'Equals', userDetails.username2)
        cy.get(arDashboardPage.getWaitSpinner(), { timeout: 1500000 }).should('not.exist')
        cy.get(arDashboardPage.getTableCellRecord()).contains(userDetails.username2).click()
        cy.get(arDashboardPage.getWaitSpinner(), { timeout: 1500000 }).should('not.exist')
        //Here this wait is necessary 
        arDashboardPage.getMediumWait()


        // Asset that menu options are available 
        cy.get(ARCoursesPage.getAddEditMenuActionsByName('Edit Multiple')).should('exist').and('be.visible')
        cy.get(ARCoursesPage.getAddEditMenuActionsByName('Message Users')).should('exist').and('be.visible')
        cy.get(ARCoursesPage.getAddEditMenuActionsByName('Change Department')).should('exist').and('be.visible')
        cy.get(ARCoursesPage.getAddEditMenuActionsByName('Enroll Users')).should('exist').and('be.visible')
        cy.get(ARCoursesPage.getAddEditMenuActionsByName('Un-enroll Users')).should('exist').and('be.visible')

        // Send message to learners only
        cy.get(ARCoursesPage.getAddEditMenuActionsByName('Message Users')).click()
        cy.get(arDashboardPage.getWaitSpinner(), { timeout: 1500000 }).should('not.exist')
        cy.get(ARCoursesPage.getPageHeaderTitle()).should('have.text', "Compose Message")
        // Assert that the number of message recipeints are 2
        cy.get(arComposeMessage.getRecipientCountTxtField()).should("contain", "This message will be sent to 2 Users.")

        cy.get(arComposeMessage.getNonLearnersMessageContainer()).contains('Your selection contains non-learners')

        // Compose message and send
        cy.get(arComposeMessage.getSubjectTxtF()).click().type(`${departmentDetails.messageSubject}-2`)
        cy.get(arComposeMessage.getElementByAriaLabelAttribute(arComposeMessage.getTextArea())).type(`${departmentDetails.messageBody}-2`)
        cy.wrap(arDashboardPage.WaitForElementStateToChange(arComposeMessage.getElementByDataNameAttribute(arComposeMessage.getSendBtn()), 1000))
        cy.get(arComposeMessage.getElementByDataNameAttribute(arComposeMessage.getSendBtn())).click({ force: true })
        cy.get(ARCoursesPage.getPageHeaderTitle()).should('not.have.text', "Compose Message")

    })

    it('Verify that the learner recieves the later message', () => {
        cy.apiLoginWithSession(userDetails.username2, userDetails.validPassword)
        
        cy.get(LEMessagesMenu.getMessageMenuBtn()).click()
        cy.get(LEMessagesMenu.getAllMessagesContainer()).within(() => {
            cy.get(LEMessagesMenu.getPriorityMessagesLinkBtn()).click()
        })
       
        cy.get(LEMessagesMenu.getConversationsExpandedSection()).within(() => {
            cy.get(LEMessagesMenu.getMessageSubjectByTitle(`${departmentDetails.messageSubject}-2`)).should('exist')
        })
    })

    it('Send mass message only to learners', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        //Navigate to course activity
        arDashboardPage.getCoursesActivityReport()


        //Select any course from drop down and click on add filter
        ARCourseActivityReportPage.ChooseAddFilter(ocDetails.courseName)
        //Adding userName to the table so that it can be searched out later
        // The Username column does not appear by default
        cy.get(arDashboardPage.getTableHeader()).should('not.contain', 'Username')

        cy.get(arDashboardPage.getTableDisplayColumnBtn()).click()
        // The Username column appears in the Additional Columns list.
        cy.get(arDashboardPage.getDisplayColumnItemByName('Username')).should('exist')
        // The Username column can be added to the Course Enrollments Report
        cy.get(arDashboardPage.getDisplayColumnItemByName('Username')).click()
        cy.get(arDashboardPage.getTableDisplayColumnBtn()).click({ force: true })
        // The Username column is added to the existing columns
        // The Column is called Username
        cy.get(arDashboardPage.getTableHeader()).should('contain', 'Username')
        cy.get(arDashboardPage.getWaitSpinner(), { timeout: 1500000 }).should('not.exist')
        arDashboardPage.AddFilter('Username', 'Equals', userDetails.username)
        cy.get(arDashboardPage.getWaitSpinner(), { timeout: 1500000 }).should('not.exist')
        cy.get(arDashboardPage.getTableCellRecord()).contains(userDetails.username).click()
        cy.get(arDashboardPage.getWaitSpinner(), { timeout: 1500000 }).should('not.exist')
        arDashboardPage.AddFilter('Username', 'Equals', userDetails.username2)
        cy.get(arDashboardPage.getWaitSpinner(), { timeout: 1500000 }).should('not.exist')
        cy.get(arDashboardPage.getTableCellRecord()).contains(userDetails.username2).click()
        //Here this wait is necessary
        arDashboardPage.getMediumWait()
        // Asset that menu options are available 
        cy.get(ARCoursesPage.getAddEditMenuActionsByName('Edit Multiple')).should('exist').and('be.visible')
        cy.get(ARCoursesPage.getAddEditMenuActionsByName('Message Users')).should('exist').and('be.visible')
        cy.get(ARCoursesPage.getAddEditMenuActionsByName('Change Department')).should('exist').and('be.visible')
        cy.get(ARCoursesPage.getAddEditMenuActionsByName('Enroll Users')).should('exist').and('be.visible')
        cy.get(ARCoursesPage.getAddEditMenuActionsByName('Un-enroll Users')).should('exist').and('be.visible')

        // Send message to learners only
        cy.get(ARCoursesPage.getAddEditMenuActionsByName('Message Users')).click()
        cy.get(arDashboardPage.getWaitSpinner(), { timeout: 1500000 }).should('not.exist')
        cy.get(ARCoursesPage.getPageHeaderTitle()).should('have.text', "Compose Message")
        // Assert that the number of message recipeints are 2
        cy.get(arComposeMessage.getRecipientCountTxtField()).should("contain", "This message will be sent to 2 Users.")
        // Remove one user
        cy.get(arComposeMessage.getElementByDataNameAttribute(arComposeMessage.getToTextFieldDDown())).within(() => {
            cy.get(arComposeMessage.getSelectedRecipientElement(`${userDetails.userWithAdminRoleOnly} ${userDetails.lastName}`)).siblings('div').click()
        })
        // Assert that the number of message recipeints adjusted to 1
        cy.get(arComposeMessage.getRecipientCountTxtField()).should("contain", "This message will be sent to 1 Users.")

        // Compose message and send
        cy.get(arComposeMessage.getSubjectTxtF()).click().type(`${departmentDetails.messageSubject}-1`)
        cy.get(arComposeMessage.getElementByAriaLabelAttribute(arComposeMessage.getTextArea())).type(`${departmentDetails.messageBody}-1`)
        cy.wrap(arDashboardPage.WaitForElementStateToChange(arComposeMessage.getElementByDataNameAttribute(arComposeMessage.getSendBtn()), 1000))
        cy.get(arComposeMessage.getElementByDataNameAttribute(arComposeMessage.getSendBtn())).click({ force: true })
        cy.get(ARCoursesPage.getPageHeaderTitle()).should('not.have.text', "Compose Message")
    })

    it('Verify that the learner recieves the message', () => {
        cy.apiLoginWithSession(userDetails.username2, userDetails.validPassword)
        cy.get(arDashboardPage.getWaitSpinner(), { timeout: 1500000 }).should('not.exist')
        cy.get(LEMessagesMenu.getMessageMenuBtn()).click()
        cy.get(LEMessagesMenu.getAllMessagesContainer()).within(() => {
            cy.get(LEMessagesMenu.getPriorityMessagesLinkBtn()).click()
        })
       
        cy.get(LEMessagesMenu.getConversationsExpandedSection()).within(() => {
            cy.get(LEMessagesMenu.getMessageSubjectByTitle(`${departmentDetails.messageSubject}-1`)).should('exist')
        })
    })

 
})


