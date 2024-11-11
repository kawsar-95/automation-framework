import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import { users } from '../../../../../../helpers/TestData/users/users'
import LECourseLessonPlayerPage from '../../../../../../helpers/LE/pageObjects/Courses/LECourseLessonPlayerPage'
import ARDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import { ocDetails } from '../../../../../../helpers/TestData/Courses/oc'
import AROCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage'
import ARSelectLearningObjectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectLearningObjectModal'
import { userDetails } from '../../../../../../helpers/TestData/users/UserDetails'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import arEnrollUsersPage from '../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import ARCourseSettingsEnrollmentRulesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import AREditClientUserPage from "../../../../../../helpers/AR/pageObjects/PortalSettings/AREditClientUserPage"
import { lessonAssessment } from '../../../../../../helpers/TestData/Courses/oc'
import ARDashboardAccountMenu from '../../../../../../helpers/AR/pageObjects/Menu/ARDashboardAccount.menu'
import ARAddObjectLessonModal from '../../../../../../helpers/AR/pageObjects/Modals/ARAddObjectLessonModal'
import LEManageTemplateCoursesPage from '../../../../../../helpers/LE/pageObjects/Template/LEManageTemplateCoursesPage'
import ARCouponsAddEditPage from '../../../../../../helpers/AR/pageObjects/E-commerce/Coupons/ARCouponsAddEditPage'
import ARTemplatesReportPage from '../../../../../../helpers/AR/pageObjects/Reports/ARTemplatesReportPage'
import { departments } from '../../../../../../helpers/TestData/Department/departments'
import LEManageTemplateMenu from '../../../../../../helpers/LE/pageObjects/Template/LEManageTemplateMenu'
import LEManageTemplateLoginPage from '../../../../../../helpers/LE/pageObjects/Template/LEManageTemplateLoginPage'
import ARDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'



describe('AUT-379 T151422 GUIA-Story NLE-4039 : Course Player - Admin default view settings ', function () {
    before(function () {
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0);
        //Sign in as system admin a
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getShortWait()
        cy.get(arDashboardPage.getCurrentUserLabel()).should('contain', "GUI_Auto Sys_Admin_01")
        cy.get(arDashboardPage.getElementByDataNameAttribute(arDashboardPage.getHelpAndSupportBtn())).should('be.visible')
        //Select Account Menu 
        cy.get(arDashboardPage.getElementByDataNameAttribute(arDashboardPage.getAccountBtn())).click()
        //Select Portal Setting option from account menu
        cy.get(ARDashboardAccountMenu.getPortalSettingsBtn()).should('exist').click()
        //Validate portal setting page header
        cy.get(arDashboardPage.getAccountHeaderLabel()).should('have.text', 'Edit Client')
        cy.get(arDashboardPage.getUsersTab()).click()
        //Turn on next gen toggle button
        AREditClientUserPage.getTurnOnNextgenToggle()
        cy.get(AREditClientUserPage.getSaveBtn()).click()
        //Navigate to dashboard page
        arDashboardPage.getShortWait()
        cy.get(arDashboardPage.getCurrentUserLabel()).should('contain', "GUI_Auto Sys_Admin_01")
    })
    beforeEach(function () {
        //Sign in as system admin 
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getMediumWait()
    })

    after(function () {
        //Sign in as system admin 
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getShortWait()
        cy.get(arDashboardPage.getCurrentUserLabel()).should('contain', "GUI_Auto Sys_Admin_01")
        cy.get(arDashboardPage.getElementByDataNameAttribute(arDashboardPage.getHelpAndSupportBtn())).should('be.visible')
        //Select Account Menu 
        cy.get(arDashboardPage.getElementByDataNameAttribute(arDashboardPage.getAccountBtn())).click()
        //Select Portal Setting option from account menu
        cy.get(ARDashboardAccountMenu.getPortalSettingsBtn()).should('exist').click()
        //Validate portal setting page header
        cy.get(arDashboardPage.getAccountHeaderLabel()).should('have.text', 'Edit Client')
        cy.get(arDashboardPage.getUsersTab()).click()
        //Turn on next gen toggle button
        AREditClientUserPage.getTurnOffNextgenToggle()
        cy.get(AREditClientUserPage.getSaveBtn()).click()
        //Navigate to dashboard page
        arDashboardPage.getShortWait()
        cy.get(arDashboardPage.getCurrentUserLabel()).should('contain', "GUI_Auto Sys_Admin_01")
        //Delete the course 
        cy.deleteCourse(commonDetails.courseID)
        //Delete user via API
        cy.deleteUser(userDetails.userID)


    })

    it('Create an Online Course with course details and add a lesson', () => {
        //Sign in as system admin, navigate to Courses
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Courses'))
        
        cy.createCourse('Online Course', ocDetails.courseName)
        //Set enrollment rule - Allow self enrollment for all learners
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        LEDashboardPage.getShortWait()
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')
        //Add Assessment lesson object to the course 
        cy.get(AROCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
        ARSelectLearningObjectModal.getObjectTypeByName('Assessment')
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()
        arDashboardPage.getMediumWait()
        ARAddObjectLessonModal.getTxtFByName('Assessment Name', lessonAssessment.ocAssessmentName)
        arDashboardPage.getShortWait()
        cy.get(ARAddObjectLessonModal.getandClickApplybutton()).click()
        arDashboardPage.getMediumWait()
        //Add learning object Assessment  
        arDashboardPage.getShortWait()
        //Publish OC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36))
        })

        //Enroll User
        arEnrollUsersPage.getEnrollUserByCourseAndUsername([ocDetails.courseName], [userDetails.username])
        arDashboardPage.getShortWait()
    })

    it('As a System Admin, navigate to the Template/Learner Management and go to the Courses tab', () => {

        //Navigate to Templates
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Setup'))).click()
        ARTemplatesReportPage.getTemplatesPage()
        cy.get(ARDashboardPage.getA5PageHeaderTitle()).should('have.text', 'Templates')
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getGridTable()).eq(0).click()
        ARDashboardPage.getShortWait()
        cy.get(ARTemplatesReportPage.getSectionHeader()).contains('Templates').should('have.text', 'Templates')
        ARDashboardPage.getMediumWait()
        //Clicking on Edit Action Menu button
        cy.get(ARCouponsAddEditPage.getSideBarContent()).within(function () {
            LEDashboardPage.getMediumWait()
            cy.get(ARTemplatesReportPage.getTemplateEditbutton()).eq(0).click()
        })
        ARDashboardPage.getMediumWait()
        //Manage Template - Courses tab - Verify URL & Contents
        LEManageTemplateMenu.getManageTemplateMenuItemsByName('Courses').should('be.visible').click()
        cy.url().should('include', '/#/learner-mgmt/courses')
        LEManageTemplateCoursesPage.getManageTemplateCoursesContainerByNameThenClick('Courses').should('be.visible')
        //Verify that Default Views are available
        LEManageTemplateCoursesPage.getDefaultViewBtn('Combined')
        LECourseLessonPlayerPage.getVShortWait()
        LEManageTemplateCoursesPage.getDefaultViewBtn('Sidebar')
        LECourseLessonPlayerPage.getVShortWait()
        LEManageTemplateCoursesPage.getDefaultViewBtn('Details')
        LECourseLessonPlayerPage.getVShortWait()
        LEManageTemplateCoursesPage.getDefaultViewBtn('Compact')
        LECourseLessonPlayerPage.getVShortWait()
        cy.get(LEManageTemplateCoursesPage.getViewSidebarButtn()).click()

    })

    it('As a System Admin, create a child department of the template you edited in the previous steps', () => {

        //Navigate to Templates
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Setup'))).click()
        ARTemplatesReportPage.getTemplatesPage()
        cy.get(ARDashboardPage.getA5PageHeaderTitle()).should('have.text', 'Templates')
        ARDashboardPage.getMediumWait()
        //Navigating to Add template Page
        cy.get(ARCouponsAddEditPage.getSideBarContent()).within(function () {
            cy.get(ARTemplatesReportPage.getAddtemplateButton()).click()
        })
        ARDashboardPage.getShortWait()
        cy.get(ARTemplatesReportPage.getSectionHeader()).contains('Add Template').should('have.text', 'Add Template')
        ARTemplatesReportPage.SearchAndSelectFunction([departments.Dept_E_name])
        ARDashboardPage.getShortWait()
        cy.get(ARTemplatesReportPage.getWarningBanner()).should('not.be.false')
        //Click on Add Template 
        cy.get(ARDashboardPage.gettemplateAddbutton()).click({ force: true })
        ARDashboardPage.getLongWait()
        //Manage Template - Courses tab 
        LEManageTemplateMenu.getManageTemplateMenuItemsByName('Courses').should('be.visible').click()
        cy.url().should('include', '/#/learner-mgmt/courses')
        LEManageTemplateCoursesPage.getManageTemplateCoursesContainerByNameThenClick('Courses').should('be.visible')
        LEManageTemplateLoginPage.getInheritSettingsOfParentDepartmentToggle('false')
        cy.get(LEManageTemplateCoursesPage.getLayoutBtn()).eq(0).click()
        cy.get(LEManageTemplateCoursesPage.getCourseDetailsSaveButtn()).click()
        LECourseLessonPlayerPage.getVShortWait()

    })
    it('Delete Template', () => {

        //Deleting Template
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Setup'))).click()
        ARTemplatesReportPage.getTemplatesPage()
        cy.get(ARDashboardPage.getA5PageHeaderTitle()).should('have.text', 'Templates')
        ARDashboardPage.getMediumWait()
        //Filterting the Dept 
        ARTemplatesReportPage.A5AddFilter('Department', 'Is Only', departments.Dept_E_name)
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getGridTable()).eq(0).click()
        cy.get(ARCouponsAddEditPage.getSideBarContent()).within(function () {
            cy.get(ARTemplatesReportPage.getTemplateDeletebutton()).click()
        })
        cy.get(ARDeleteModal.getA5OKBtn()).click()
        //Clear All Filters 
        cy.get(ARTemplatesReportPage.getCLearAllFiltersButton()).click()
        ARDashboardPage.getShortWait()
        //Filterting the Dept 
        ARTemplatesReportPage.A5AddFilter('Department', 'Is Only', departments.Dept_E_name)
        //Asserting Template was deleted
        ARDashboardPage.getShortWait()
        cy.get(ARDashboardPage.getA5NoResultMsg()).should('have.text', "Sorry, no results found.")
    })
})

