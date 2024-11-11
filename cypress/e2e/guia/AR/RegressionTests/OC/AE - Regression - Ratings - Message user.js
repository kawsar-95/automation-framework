import { users } from '../../../../../../helpers/TestData/users/users'
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARRatingPage from "../../../../../../helpers/AR/pageObjects/Courses/ARRatingPage"
import { userDetails } from '../../../../../../helpers/TestData/users/UserDetails'
import AREnrollUsersPage from "../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage"
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LECatalogPage from '../../../../../../helpers/LE/pageObjects/Catalog/LECatalogPage'
import LEFilterMenu from '../../../../../../helpers/LE/pageObjects/Menu/LEFilterMenu'
import { ocDetails } from "../../../../../../helpers/TestData/Courses/oc"
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import ARILCAddEditPage from "../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage";
import ARCourseSettingsCompletionModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCompletion.module'
import LEMessagesMenu from '../../../../../../helpers/LE/pageObjects/Menu/LEMessagesMenu'
import ARILCActivityReportPage from "../../../../../../helpers/AR/pageObjects/Reports/ARILCActivityReportPage"
import ARComposeMessage from '../../../../../../helpers/AR/pageObjects/Departments/ARComposeMessage'
import LEProfilePage from '../../../../../../helpers/LE/pageObjects/User/LEProfilePage'
import AdminNavationModuleModule from '../../../../../../helpers/AR/modules/AdminNavationModule.module'
import LECourseDetailsModal from '../../../../../../helpers/LE/pageObjects/Modals/LECourseDetails.modal'
import { messages } from '../../../../../../helpers/TestData/Courses/ilc'


describe('C7417 - AUT 718 - AE - Regression - Ratings - Message user', function() {

    before(() => {
        cy.createUser(void 0, userDetails.username5, ["Learner"], void 0)

        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        LECatalogPage.turnOnNextgenToggle()
        AdminNavationModuleModule.navigateToCoursesPage()
        cy.createCourse('Online Course', ocDetails.courseName)

        //Open Attributes Section
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Attributes')).click()
        ARILCAddEditPage.getMediumWait() //Wait for toggles to become enabled
        //Toggle Certificate to ON
        ARCourseSettingsCompletionModule.getToggleByNameThenClick('Enable Course Rating')

        //publish Course
        cy.publishCourseAndReturnId().then((id)=> {
            commonDetails.courseID = id.request.url.slice(-36)
        })

        AREnrollUsersPage.getEnrollUserByCourseAndUsername([ocDetails.courseName], [userDetails.username5])

        // Login as a learner to rate the course
        cy.apiLoginWithSession(userDetails.username5, users.learner01.learner_01_password)
        // Search for Online Course created earlier in the Catalog
        cy.get(LEDashboardPage.getNavMenu()).click()
        cy.get(LECatalogPage.getLEMenuItems()).contains('Catalog').click()
        cy.get(LECatalogPage.getSearchByNameTxtF()).click().type(ocDetails.courseName)
        LECatalogPage.getShortWait()
        cy.get(LECatalogPage.getRightArrowIcon()).click()
        LECatalogPage.getLongWait()
    })

    it('Give rating to course', () => {        
        ARDashboardPage.getMediumWait()
        cy.visit('#/courses')
        ARDashboardPage.getMediumWait()
        LEFilterMenu.SearchForCourseByName(ocDetails.courseName)
        ARDashboardPage.getMediumWait()
        cy.get(LEDashboardPage.getCourseTitleFromCard(ocDetails.courseName)).click()
        cy.get(LECourseDetailsModal.getTabByName('Reviews')).invoke('show').click({force: true})
        cy.get(LECourseDetailsModal.getRatingStar()).eq(3).click()
        ARDashboardPage.getMediumWait()
    })

    it('Rating page send Message', () => {
        // Sign in with System Admin account
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        // 3. Courses panel should be open
        cy.get(ARDashboardPage.getElementByDataName(ARDashboardPage.getMenuHeaderTitleDataName())).should('contain', 'Courses')
        ARDashboardPage.getMenuItemOptionByName('Ratings')
        ARDashboardPage.getMediumWait()
        // 4. Displays Course Ratings list page
        cy.get(ARRatingPage.getSectionHeader()).should('contain.text', 'Ratings')

        // 5. User should be able to select Rating
        cy.wrap(ARRatingPage.AddCourseFilter(ocDetails.courseName))
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getGridTable()).eq(0).click()
        // 6. Navigate to Compose Message page
        cy.get(ARRatingPage.getMessageUserBtn()).click()

        ARILCActivityReportPage.getMediumWait()
        // 7. User should be able to enter subject and text in body
        cy.get(ARComposeMessage.getUserSelectionDDown()).click()
        cy.get(ARComposeMessage.getToTextFieldDDownSearchTxtF()).type(userDetails.username5)
        ARComposeMessage.getMediumWait()
        cy.get(ARComposeMessage.getListOptions()).first().click()
        cy.get(ARRatingPage.getSubjectTxtF()).type('C7417-test-subject')
        cy.get(ARRatingPage.getTextArea()).type(messages.emailTemplateBody)
        ARILCActivityReportPage.getVLongWait()
        // When all required information is entered the Send button is enabled
        cy.get(ARRatingPage.getSaveAnchor()).click()
        ARILCActivityReportPage.getVLongWait()
    })

    it('message appears to the user', function() {
        // Verify message appears to the selected users 
        cy.apiLoginWithSession(userDetails.username5, userDetails.validPassword, '/#/dashboard')
        LEDashboardPage.getVLongWait()
        cy.get(LEMessagesMenu.getMessageMenuBtn()).click()
        cy.get(LEMessagesMenu.getAllMessagesContainer()).within(() => {
            cy.get(LEMessagesMenu.getPriorityMessagesLinkBtn()).click()            
        })

        cy.get(LEMessagesMenu.getMessagesMenuMessageItem()).should('contain','C7417-test-subject')
    })

    after(function() {
        // Delete Course
        cy.deleteCourse(commonDetails.courseID)

        // Delete User
        cy.apiLoginWithSession(userDetails.username5, users.sysAdmin.admin_sys_01_password)
        cy.get(LEDashboardPage.getNavProfile()).click()  
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
        cy.url().then((currentURL) => {
            cy.deleteUser(currentURL.slice(-36));
        })

        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getMediumWait()
        LECatalogPage.turnOffNextgenToggle()
    })
})