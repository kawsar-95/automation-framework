import arDashboardPage from '../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import { users } from '../../../../../../../helpers/TestData/users/users'
import AROCAddEditPage from '../../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage'
import LEDashboardPage from '../../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import AREditClientUserPage from "../../../../../../../helpers/AR/pageObjects/PortalSettings/AREditClientUserPage"
import A5FeatureFlagsPage, { featureFlagDetails } from '../../../../../../../helpers/AR/pageObjects/FeatureFlags/A5FeatureFlagsPage'
import ARDashboardAccountMenu from '../../../../../../../helpers/AR/pageObjects/Menu/ARDashboardAccount.menu'
import { courses } from '../../../../../../../helpers/TestData/Courses/courses'
import ARThirdPartyPreviewCoursePage from '../../../../../../../helpers/AR/pageObjects/Courses/ARThirdPartyPreviewCoursePage'
import arRolesAddEditPage from '../../../../../../../helpers/AR/pageObjects/Roles/ARRolesAddEditPage'
import ARUserAddEditPage from '../../../../../../../helpers/AR/pageObjects/User/ARUserAddEditPage'
import ARCollaborationAddEditPage from '../../../../../../../helpers/AR/pageObjects/Collaborations/ARCollaborationAddEditPage'
import ARAddObjectLessonModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARAddObjectLessonModal'
import ARSelectLearningObjectModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARSelectLearningObjectModal'
import arUploadFileModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARUploadFileModal'
import { lessons, resourcePaths } from '../../../../../../../helpers/TestData/resources/resources'
import arCoursesPage from '../../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import arAddEditCategoryPage from '../../../../../../../helpers/AR/pageObjects/Category/ARAddEditCategoryPage'
import { userDetails } from '../../../../../../../helpers/TestData/users/UserDetails'
import ARDashboardPage from '../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import { rolesDetails } from '../../../../../../../helpers/TestData/Roles/rolesDetails'
import ARRolesAddEditPage from '../../../../../../../helpers/AR/pageObjects/Roles/ARRolesAddEditPage'
import arDeleteModal from "../../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal";


describe('C7309 - AUT686 -  NASA-6892 Admin Lesson Preview - Learning Object Type of TinCan - Verify that the Preview button not display by the Tin Can ', function () {
    
    before(function () {
        //Signin as blat admin and navigate to feature flags
        cy.apiLoginWithSession(users.blatAdmin.admin_blat_01_username, users.blatAdmin.admin_blat_01_password, '/admin')
        A5FeatureFlagsPage.turnOnOffFeatureFlagbyName(featureFlagDetails.EnableThirdPartyLessonPreview,'false')
    })

    after(function () {
        //Signin as blat admin and navigate to feature flags and Toggle on the feature flag
        cy.apiLoginWithSession(users.blatAdmin.admin_blat_01_username, users.blatAdmin.admin_blat_01_password, '/admin')
        A5FeatureFlagsPage.turnOnOffFeatureFlagbyName(featureFlagDetails.EnableThirdPartyLessonPreview,'true')
    })    
    
    it('Verify that the Preview button not display by the Tin Can', () =>{ 
       //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Courses'))
        
        cy.editCourse(courses.oc_lesson_act_ssta_tin_can_name)
        ARDashboardPage.getShortWait()
        cy.get(AROCAddEditPage.getLearningObjectPreviewBtn()).should('not.exist')
        ARDashboardPage.getShortWait()      
    })

})

describe('Learning Object Type of TinCan - Verify that the Preview button should display by the Tin Can ', function () {
    
    before(function () {
        //Signin as blat admin and navigate to feature flags
        cy.apiLoginWithSession(users.blatAdmin.admin_blat_01_username, users.blatAdmin.admin_blat_01_password, '/admin')
        cy.get(arDashboardPage.getCurrentUserLabel()).should('contain',"GUI_Auto Blat_Admin_01")
        cy.visit('/admin/featureflags')
        //Validate portal setting page header and turn off the feature flag
        cy.get(arDashboardPage.getAccountHeaderLabel()).should('have.text','Feature Flags')
        A5FeatureFlagsPage.getTurnOnOffFeatureFlagbyName(featureFlagDetails.EnableThirdPartyLessonPreview,'true')
        //Select save button within Portal settings 
        cy.get(AREditClientUserPage.getSaveBtn()).click()
        LEDashboardPage.getShortWait()
    })

    after(function () {
        //Signin as blat admin and navigate to feature flags and Toggle on the feature flag
        cy.apiLoginWithSession(users.blatAdmin.admin_blat_01_username, users.blatAdmin.admin_blat_01_password, '/admin')
        cy.get(arDashboardPage.getCurrentUserLabel()).should('contain',"GUI_Auto Blat_Admin_01")
        cy.visit('/admin/featureflags')
        //Validate portal setting page header
        cy.get(arDashboardPage.getAccountHeaderLabel()).should('have.text','Feature Flags')
        A5FeatureFlagsPage.getTurnOnOffFeatureFlagbyName(featureFlagDetails.EnableThirdPartyLessonPreview,'true')
        //Select save button within Portal settings 
        cy.get(AREditClientUserPage.getSaveBtn()).click()
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardAccountMenu.getA5AccountSettingsBtn()).click()
        ARDashboardPage.getShortWait()
        cy.get(ARDashboardAccountMenu.getA5LogOffBtn()).click()
    })    
    
    it('Verify that the Preview button should display by the Tin Can', () =>{ 
       //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Courses'))
        
        cy.editCourse(courses.oc_lesson_act_ssta_tin_can_name)
        ARDashboardPage.getShortWait()
        cy.get(AROCAddEditPage.getLearningObjectPreviewBtn()).should('exist').click()
        ARDashboardPage.getShortWait()
        cy.get(ARThirdPartyPreviewCoursePage.getCourseTitle()).should('exist').and('contain','598 - All Questions type - test1')
        ARDashboardPage.getShortWait()      
    })

})

describe('Create a role to verify preview button ', function () {
    
    before(function () {
      cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
      cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
      ARDashboardPage.getRolesReport()
      //Verify navigated window
      cy.get(arCoursesPage.getPageHeaderTitle()).should('have.text', "Roles") 
      cy.wrap(arDashboardPage.WaitForElementStateToChange(arDashboardPage.getAddEditMenuActionsByName('Add Role'), 1000))
      cy.get(arCoursesPage.getCoursesActionsButtonsByLabel('Add Role')).click()
      cy.get(arAddEditCategoryPage.getPageHeaderTitle()).should('have.text', "Add Role")
      cy.get(arRolesAddEditPage.getGeneralNameTxtF()).clear().type(rolesDetails.roleName)
      cy.get(arRolesAddEditPage.getGeneralDescriptionTxtF()).clear().type(rolesDetails.roleDescription)
      cy.get(arRolesAddEditPage.getCourseSelectAllCheckBox()).should("have.text","Select All").click({force:true})
      arRolesAddEditPage.getSelectCheckboxBySectionNameAndIndexNumber('manage',2,'Files')
      arRolesAddEditPage.getVShortWait()
      // Save Roles
      cy.get(arRolesAddEditPage.getSaveBtn()).contains('Save').click()
      ARUserAddEditPage.getMediumWait()
      //Add the role to new user
      cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Users',{timeout:5000}))).click()
      arDashboardPage.getMenuItemOptionByName('Users')
      ARUserAddEditPage.getShortWait()
      ARUserAddEditPage.getEditUserByUsername(userDetails.username)
      ARUserAddEditPage.getMediumWait()
      //Give the user admin permission
      ARUserAddEditPage.getSelectAccountToggleBtnByName('Admin')
      ARUserAddEditPage.getShortWait()
      ARUserAddEditPage.getAddRoleByName(rolesDetails.roleName)
      ARUserAddEditPage.getShortWait()
      ARUserAddEditPage.WaitForElementStateToChange(ARUserAddEditPage.getSaveBtn())
      ARUserAddEditPage.getShortWait()
      cy.get(ARUserAddEditPage.getSaveBtn()).click()
      ARUserAddEditPage.getMediumWait()
    })

    after(function () {
      //delete the role
      cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
      ARDashboardPage.getRolesReport()
      //Verify navigated window
      cy.get(arCoursesPage.getPageHeaderTitle()).should('have.text', "Roles")
      ARDashboardPage.AddFilter('Name','Equals',rolesDetails.roleName)
      arRolesAddEditPage.getMediumWait()
      cy.get(ARDashboardPage.getGridTable()).eq(0).click()
      arRolesAddEditPage.getVShortWait()
      cy.get(arCoursesPage.getCoursesActionsButtonsByLabel('Delete Role')).click()
      arRolesAddEditPage.getVShortWait()
      //Close the delete role pop up
      cy.get(arRolesAddEditPage.getElementByDataNameAttribute(arDeleteModal.getDeleteBtn())).click()
      //delete user
      ARDashboardPage.deleteUsers([userDetails.username])
      arRolesAddEditPage.getVShortWait()
    })    
    
    it('Verify that the Preview button should not  display with Role permission', () =>{ 
       //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(userDetails.username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getCoursesReport()
        
        cy.editCourse(courses.oc_lesson_act_ssta_tin_can_name)
        ARDashboardPage.getShortWait()
        cy.get(AROCAddEditPage.getLearningObjectPreviewBtn()).should('not.exist')
        ARDashboardPage.getShortWait()    
    })

    it('Edit the role with unpermit Files option', () =>{ 
      cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
      ARDashboardPage.getRolesReport()
      //Verify navigated window
      cy.get(arCoursesPage.getPageHeaderTitle()).should('have.text', "Roles")
      arRolesAddEditPage.AddFilter('Name', 'Starts With', rolesDetails.roleName)
      arRolesAddEditPage.getMediumWait()
      cy.get(ARDashboardPage.getGridTable()).eq(0).click()
      arRolesAddEditPage.getVShortWait()
      cy.get(arCoursesPage.getCoursesActionsButtonsByLabel('Edit Role')).click()
      arRolesAddEditPage.getVShortWait()
      cy.get(arAddEditCategoryPage.getPageHeaderTitle()).should('have.text', "Edit Role")
      cy.get(arRolesAddEditPage.getCourseSelectAllCheckBox()).should("have.text","Select All").click()
      arRolesAddEditPage.getVShortWait()
      // Save Roles
      cy.get(arRolesAddEditPage.getSaveBtn()).contains('Save').click()
      ARUserAddEditPage.getMediumWait()
    })

    it('Verify that the Preview button should display with Role Permission', () =>{ 
       //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(userDetails.username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getCoursesReport()
        
        cy.editCourse(courses.oc_lesson_act_ssta_tin_can_name)
        ARDashboardPage.getShortWait()
        cy.get(AROCAddEditPage.getLearningObjectPreviewBtn()).should('exist')
        ARDashboardPage.getShortWait()
        //Clicking on Add Learning Object
        cy.get(AROCAddEditPage.getAddLearningObjectBtn()).click()
        //Selecting Leaning Object as AICC
        ARSelectLearningObjectModal.getObjectTypeByName('Tin Can')
        //Clicking on Next Button
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()
        ARDashboardPage.getMediumWait()
        cy.get(ARAddObjectLessonModal.getSkipBtn()).click()
        ARDashboardPage.getLongWait()
        //type something in the title and description of the page
        cy.get(ARAddObjectLessonModal.getAddLessonObjectModule()).find(ARAddObjectLessonModal.getTitleTextF()).type(lessons.aicc_bunnies_filename, { delay: 50 })
        cy.get(ARAddObjectLessonModal.getAddLessonObjectModule()).find(ARAddObjectLessonModal.getSourceRadioBtn()).contains('Url').click()
        cy.get(ARAddObjectLessonModal.getAddLessonObjectModule()).find(ARAddObjectLessonModal.getURLTxtF()).type('www.absorblms.com', { delay: 50 })
        cy.get(ARAddObjectLessonModal.getApplyBtn()).click()
        ARDashboardPage.getShortWait() 
        cy.get(AROCAddEditPage.getLearningObjectPreviewBtn()).should('exist').and('have.length','2')
        ARDashboardPage.getMediumWait()    
    })

})