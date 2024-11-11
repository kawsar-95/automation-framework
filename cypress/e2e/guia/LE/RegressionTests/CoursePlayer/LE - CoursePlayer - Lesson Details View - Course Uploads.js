import ARCourseSettingsCourseUploadsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCourseUploads.module'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import { courseUploadSection, lessonAssessment, ocDetails } from '../../../../../../helpers/TestData/Courses/oc'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../helpers/TestData/users/users'
import AROCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage'
import ARDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import LECatalogPage from '../../../../../../helpers/LE/pageObjects/Catalog/LECatalogPage'
import { userDetails } from '../../../../../../helpers/TestData/users/UserDetails'
import ARDashboardAccountMenu from '../../../../../../helpers/AR/pageObjects/Menu/ARDashboardAccount.menu'
import AREditClientUserPage from '../../../../../../helpers/AR/pageObjects/PortalSettings/AREditClientUserPage'
import ARAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import ARCourseSettingsEnrollmentRulesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
import AREnrollUsersPage from '../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage'
import LEFilterMenu from '../../../../../../helpers/LE/pageObjects/Menu/LEFilterMenu'
import LESideMenu from '../../../../../../helpers/LE/pageObjects/Menu/LESideMenu'
import LEResourcesPage from '../../../../../../helpers/LE/pageObjects/Resources/LEResourcesPage'
import ARSelectLearningObjectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectLearningObjectModal'
import ARAddObjectLessonModal from '../../../../../../helpers/AR/pageObjects/Modals/ARAddObjectLessonModal'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'


describe('AUT-780 C7536 GUIA-Story - NLE-1532 - Update Course Details view when no lessons exist', function(){

    const courseName1 = 'CourseUploadTest'

    before(function () {
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0);
        //Sign in as system admin a
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getShortWait()
        cy.get(ARDashboardPage.getCurrentUserLabel()).should('contain', "GUI_Auto Sys_Admin_01")
        cy.get(ARDashboardPage.getElementByDataNameAttribute(ARDashboardPage.getHelpAndSupportBtn())).should('be.visible')
        //Select Account Menu 
        cy.get(ARDashboardPage.getElementByDataNameAttribute(ARDashboardPage.getAccountBtn())).click()
        //Select Portal Setting option from account menu
        cy.get(ARDashboardAccountMenu.getPortalSettingsBtn()).should('exist').click()
        //Validate portal setting page header
        cy.get(ARDashboardPage.getAccountHeaderLabel()).should('have.text', 'Edit Client')
        cy.get(ARDashboardPage.getUsersTab()).click()
        //Turn on next gen toggle button
        AREditClientUserPage.getTurnOnNextgenToggle()
        cy.get(AREditClientUserPage.getSaveBtn()).click()
        //Navigate to dashboard page
        ARDashboardPage.getShortWait()
        cy.get(ARDashboardPage.getCurrentUserLabel()).should('contain', "GUI_Auto Sys_Admin_01")
    })
    after(function () {
        //Sign in as system admin 
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getShortWait()
        cy.get(ARDashboardPage.getCurrentUserLabel()).should('contain', "GUI_Auto Sys_Admin_01")
        cy.get(ARDashboardPage.getElementByDataNameAttribute(ARDashboardPage.getHelpAndSupportBtn())).should('be.visible')
        //Select Account Menu 
        cy.get(ARDashboardPage.getElementByDataNameAttribute(ARDashboardPage.getAccountBtn())).click()
        //Select Portal Setting option from account menu
        cy.get(ARDashboardAccountMenu.getPortalSettingsBtn()).should('exist').click()
        //Validate portal setting page header
        cy.get(ARDashboardPage.getAccountHeaderLabel()).should('have.text', 'Edit Client')
        cy.get(ARDashboardPage.getUsersTab()).click()
        //Turn on next gen toggle button
        AREditClientUserPage.getTurnOffNextgenToggle()
        cy.get(AREditClientUserPage.getSaveBtn()).click()
        //Navigate to dashboard page
        ARDashboardPage.getShortWait()
        cy.get(ARDashboardPage.getCurrentUserLabel()).should('contain', "GUI_Auto Sys_Admin_01")
        ARDashboardPage.getShortWait()
        //Delete user via API
        cy.deleteUser(userDetails.userID)
        ARDashboardPage.getMediumWait()
        //Delete the course 
        cy.deleteCourse(commonDetails.courseID)
         
        

    })

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Courses'))
        
    })

    

    it('Create an Online course without Lessons with a Course Upload with course approval', () => {
        
        cy.createCourse('Online Course',  courseName1)
         // Open Enrollment Rules
         cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click().click()
         // Select Allow Self Enrollment Alll learner Radio Button
         ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')
        //Open Course Uploads Section
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Course Uploads')).click().click()
        AROCAddEditPage.getShortWait()

        //Add a Course Upload and Edit Upload Instructions
        cy.get(ARCourseSettingsCourseUploadsModule.getAddUploadBtn()).click()
        AROCAddEditPage.getShortWait()

        //Enter Valid Label Name
        cy.get(AROCAddEditPage.getElementByAriaLabelAttribute(ARCourseSettingsCourseUploadsModule.getLabelTxt()))
            .clear().type(courseUploadSection.uploadLabel)

        //Set Approval Type to Course Editor
        cy.get(ARCourseSettingsCourseUploadsModule.getApprovalRadioBtn()).contains('Administrator').click()
        //Enter reviewer notes
        cy.get(ARCourseSettingsCourseUploadsModule.getReviewersNotesTxtF()).type(courseUploadSection.reviewerNotes)
        ARDashboardPage.getMediumWait()
        
         //Publish Course
         cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
         //Enroll User
         AREnrollUsersPage.getEnrollUserByCourseAndUsername([courseName1], [userDetails.username])
         ARDashboardPage.getShortWait()


         //Login as a learner 
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        LEDashboardPage.getLongWait()
         //Search for OC
         cy.get(LEDashboardPage.getNavMenu()).click()
         LESideMenu.getLEMenuItemsByNameThenClick('My Courses')
         cy.get(LEDashboardPage.getLEEllipsesLoader(), { timeout: 15000 }).should('not.exist', { timeout: 15000 })
         LEFilterMenu.SearchForCourseByName(courseName1)
         LEDashboardPage.getMediumWait()
         cy.get(LEResourcesPage.getCourseCardName()).should('contain', courseName1).should('be.visible')
         LEDashboardPage.getMediumWait()
         //Start course
         cy.get(LEDashboardPage.getCoursestartbutton()).click({ force: true })
         LEDashboardPage.getMediumWait()
            // Assert that there are only one course expand icon (double up), and click it to expand course details
        cy.get(LECatalogPage.getCoursePalyerDetails()).within(() => {
            cy.get(LECatalogPage.getCourseDetailsTabConainer()).contains('Overview').should('exist').and('be.visible').click()
            cy.get(LECatalogPage.getCourseDetailsContent()).should('exist').and('be.visible')
            cy.get(LECatalogPage.getCourseDetailsContent()).should('contain',courseName1)
            cy.get(LECatalogPage.getCourseDetailsContent()).should('contain', 'Not Started')

        })

    })
 
    it('Edit an Online Course with a lesson and without  course upload', () => {
       
        cy.editCourse( courseName1)
        // Open Enrollment Rules
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click().click()
        // Select Allow Self Enrollment Alll learner Radio Button
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')
        //Add Assessment lesson object to the course 
        cy.get(AROCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
        ARSelectLearningObjectModal.getObjectTypeByName('Assessment')
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()
        ARDashboardPage.getMediumWait()
        ARAddObjectLessonModal.getTxtFByName('Assessment Name', lessonAssessment.ocAssessmentName)
        ARDashboardPage.getShortWait()
        cy.get(ARAddObjectLessonModal.getandClickApplybutton()).click()
        ARDashboardPage.getMediumWait()
       //Open Course Uploads Section
       cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Course Uploads')).click().click()
       AROCAddEditPage.getShortWait()
       cy.get(ARCourseSettingsCourseUploadsModule.getDeleteCourseUpload()).click()
       cy.get(ARCourseSettingsCourseUploadsModule.getConfirmDeleteBtn()).click()
       cy.get(ARCourseSettingsCourseUploadsModule.getHideCourseUploadBtn()).click()

       //Publish course
       cy.publishCourse()

    })
    it('Edit an Online Course with a lesson and with a  course upload', () => {
       
    cy.editCourse( courseName1)
    // Open Enrollment Rules
    cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click().click()
    // Select Allow Self Enrollment Alll learner Radio Button
    ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')
    //Open Course Uploads Section
    cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Course Uploads')).click().click()
    ARDashboardPage.getMediumWait()
  
    //Add a Course Upload and Edit Upload Instructions
    cy.get(ARCourseSettingsCourseUploadsModule.getAddUploadBtn()).click()
    AROCAddEditPage.getShortWait()
  
    //Enter Valid Label Name
    cy.get(AROCAddEditPage.getElementByAriaLabelAttribute(ARCourseSettingsCourseUploadsModule.getLabelTxt())).clear().type(courseUploadSection.uploadLabel)
  
    //Set Approval Type to Course Editor
    cy.get(ARCourseSettingsCourseUploadsModule.getApprovalRadioBtn()).contains('Administrator').click()
    //Enter reviewer notes
    cy.get(ARCourseSettingsCourseUploadsModule.getReviewersNotesTxtF()).type(courseUploadSection.reviewerNotes)
      
    //Add Assessment lesson object to the course 
    cy.get(AROCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
    ARSelectLearningObjectModal.getObjectTypeByName('Assessment')
    cy.get(ARSelectLearningObjectModal.getNextBtn()).click()
    ARDashboardPage.getMediumWait()
    ARAddObjectLessonModal.getTxtFByName('Assessment Name', lessonAssessment.ocAssessmentName)
    ARDashboardPage.getShortWait()
    cy.get(ARAddObjectLessonModal.getandClickApplybutton()).click()
    ARDashboardPage.getMediumWait()
    //Publish course
    cy.publishCourse()

    })

    it('Edit an Online Course without a lesson and without a  course upload', () => {

    cy.editCourse( courseName1)
    // Open Enrollment Rules
    cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click().click()
    // Select Allow Self Enrollment Alll learner Radio Button
    ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')
    ARDashboardPage.getMediumWait()
    //Publish course
    cy.publishCourse()
            
     })
   
})