import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import { users } from '../../../../../../helpers/TestData/users/users'
import arCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import AROCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage'
import arCBAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/CB/ARCBAddEditPage'
import ARILCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage'
import ARCourseSettingsEnrollmentRulesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import ARCourseSettingsCompletionModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCompletion.module'
import ARCourseSettingsAvailabilityModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsAvailability.module'
import arOCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage'

describe('AR - Regress - OC - Create Course & publish course and validate default view of all section', function(){
 beforeEach(() => {
    //Sign into admin side as sys admin, navigate to Courses
    cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
    cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
    cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
    cy.intercept('/api/rest/v2/admin/reports/courses/operations').as('getCourses').wait(6000).wait('@getCourses')
})

it('Validate course default view of all sections', () => {
    arCBAddEditPage.getMediumWait()
    cy.createCourse('Online Course')
    cy.get(arCBAddEditPage.getAutomaticTaggingToggle()+ ' '+arCoursesPage.getEnableToggleStatus()).should('have.text','On')
     cy.get(arCBAddEditPage.getAutomaticTaggingToggle()+ ' ' +arCBAddEditPage.getStatusFieldText()).should('have.text',"Automatically generate tags based on course content. These tags are marked with an asterisk (*).")

     cy.get(arCBAddEditPage.getCouseSyllabusHeader()+ ' ' +arCBAddEditPage.getHeaderLabel()).should('have.text','Syllabus')
     cy.get(AROCAddEditPage.getSyllabusRadioButtonLabel()).contains('All lessons, in any order').parent().find('input').should('be.checked')
     
     //Validate Show term & Condition toggle status and description
     cy.get(AROCAddEditPage.getElementByDataNameAttribute(arCoursesPage.getShowTermAndCondition()) + ' ' + arCoursesPage.getDisableToggleStatus())
     .should('have.text','Off')
     cy.get(arCBAddEditPage.getShowTermAndConditionToggle()+ ' ' +arCBAddEditPage.getStatusFieldText()).should('have.text',"User must accept terms & conditions to gain access to the course.")

     //Validate Mobile Device Alert toggle status and description
     cy.get(AROCAddEditPage.getElementByDataNameAttribute(arCoursesPage.getMobileDeviceAlert()) + ' ' + arCoursesPage.getDisableToggleStatus())
     .should('have.text','Off')
     cy.get(arCBAddEditPage.getShowTermAndConditionToggle()+ ' ' +arCBAddEditPage.getStatusFieldText()).should('have.text',"User must accept terms & conditions to gain access to the course.")

     //Validate Proctor toggle status and description
     cy.get(AROCAddEditPage.getElementByDataNameAttribute(arCoursesPage.getProctor()) + ' ' +arCoursesPage.getDisableToggleStatus())
     .should('have.text','Off')
     cy.get(arCBAddEditPage.getProctorToggle()+ ' ' +arCBAddEditPage.getStatusFieldText()).should('have.text',"Turning this option 'on' will proctor weighted Absorb assessments.")
     
     //Validate Outline chapter Name
     cy.get(arOCAddEditPage.getRequiredInRedColorForChapter()).should('have.css','background-color', 'rgba(0, 0, 0, 0)')
     cy.get(AROCAddEditPage.getElementByDataNameAttribute(arCoursesPage.getChapterName()) + ' ' + arCoursesPage.getChapterNameStatus()).should('have.value','Chapter 1')
     cy.get(arCBAddEditPage.getChapterName()+ ' ' +arCBAddEditPage.getChapterNameToggleText()).should('have.text',"No learning objects have been added.")

    //Open Enrollment Rules
     cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
     ARILCAddEditPage.getShortWait()

     //Select Allow Self Enrollment off Radio Button
     ARCourseSettingsEnrollmentRulesModule.getDefaultAllowSelfEnrollmentRadioBtn('Off')
     ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentToggleInfo()
   
     //Select Enable Automatic Enrollment off Radio Button
     ARCourseSettingsEnrollmentRulesModule.getDefaultEnableAutomaticEnrollmentRadioBtn('Off')
     ARCourseSettingsEnrollmentRulesModule.getEnableAutomaticEnrollmentToggleInfo()

     //Select Approval none Radio Button   
     ARCourseSettingsEnrollmentRulesModule.getNoneApprovalRadioBtn('None')
     ARCourseSettingsEnrollmentRulesModule.getApprovalToggleInfo()

     //Verify Enable E-Commerce toggle and get toggle info
     cy.get(AROCAddEditPage.getElementByDataNameAttribute(arCoursesPage.getEnableECommerceLabel()) + ' ' + arCoursesPage.getDisableToggleStatus())
     .should('have.text','Off')
     //cy.get(arCBAddEditPage.getEnableRuleECommerceToggle()+ ' ' +arCBAddEditPage.getStatusFieldText()).should('have.text',"Turning this option 'on' will make this course available for purchase through the shopping cart.")
    
     //Open Completion Section
     cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Completion')).click()
     ARILCAddEditPage.getMediumWait() //Wait for toggles to become enabled
    
     //Toggle Certificate Button
     ARCourseSettingsCompletionModule.getToggleByNameAndVerify('Certificate')
     //Certificate Toggle text data verification
     ARCourseSettingsCompletionModule.getToggleByNameAndVerifyToggleStatus('Certificate')
    
     //Toggle Allow Re-enrollment Button
     ARCourseSettingsCompletionModule.getToggleByNameAndVerify('Allow Re-enrollment')
     //Certificate Toggle text data verification
     ARCourseSettingsCompletionModule.getToggleByNameAndVerifyAllowReEnrollment('Allow Re-enrollment')

     //Choose Competency For Completion and verify toggle
     cy.get(ARCourseSettingsCompletionModule.getAddCompetencyBtnTxt()).should('have.text','Add Competency')
     cy.get(arCBAddEditPage.getCompetenciesToggleText() + arCBAddEditPage.getCompetenciesToggleText()+ ' ' +arCBAddEditPage.getCompetenciesToggledescriiption()).should('have.text',"This course grants no competencies.")

     //Choose Credit for completion and verify toggle 
     cy.get(ARCourseSettingsCompletionModule.getAddCreditBtn()).should('have.text','Add Credit')
     cy.get(arCBAddEditPage.getCreditToggle()+ ' ' +arCBAddEditPage.getCreditToggleText()).should('have.text',"This course will award no credits on completion.")  
    
     //Allow failure toggle button and text verification
     cy.get(AROCAddEditPage.getElementByDataNameAttribute(arCoursesPage.getAllowFailureToggleBtn()) + ' ' + arCoursesPage.getDisableToggleStatus())
     .should('have.text','Off')
     cy.get(arCBAddEditPage.getAllowFailureText()+ ' ' +arCBAddEditPage.getAllowFailureToggleText()).should('have.text',"Enabling this will allow the course to be marked as failed if a learner does not achieve a passing grade.")  

     //LeaderBoardPoint toggle validation
     cy.get(arCBAddEditPage.getLeaderboardPointToggleTxt()+ ' ' +arCBAddEditPage.getLeaderboardPointsToggleText()).should('have.text',"Override the default point value")

     //Choose Credit for completion and verify toggle 
     cy.get(ARCourseSettingsCompletionModule.getAddPostEnrollmentButton()).should('have.text','Add Post Enrollment')
     cy.get(arCBAddEditPage.getPostEnrollmentToggle()+ ' ' +arCBAddEditPage.getPostEnrollmentToggleText()).should('have.text',"This course has no post enrollment triggers.")

     //Open Availability Section
     cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Availability')).click()
     AROCAddEditPage.getShortWait()

     //Select Access Date 'Date' Option
     cy.get(ARCourseSettingsAvailabilityModule.getAccessDateRadioBtn()).contains('No Access Date').parent().find('input').should('be.checked')

     //Select Expiration 'Time from enrollment' Option
     cy.get(ARCourseSettingsAvailabilityModule.getExpirationRadioBtn()).contains('No Expiration').parent().find('input').should('be.checked')

     //Select Due Date 'Date' Option
     cy.get(ARCourseSettingsAvailabilityModule.getDueDateRadioBtn()).contains('No Due Date').parent().find('input').should('be.checked')
    
     //Assert Allow course Content Download 
     cy.get(ARCourseSettingsAvailabilityModule.getAllowCourseContentToggleDescription()).should('have.text','Allows users to download and complete this course while offline.')

      //Assert Allow Enrollment Description When Toggle is OFF
     cy.get(ARCourseSettingsAvailabilityModule.getAllowEnrollmentToggleDescription())
    .should('contain', 'Learners will not be able to enroll in this course until all prerequisites are met.')

      //Verify Add prerequisite button text and toggle description
    cy.get(ARCourseSettingsAvailabilityModule.getAddPrerequisiteBtnTxt()).should('have.text','Add Prerequisite')
    cy.get(ARCourseSettingsAvailabilityModule.getNoPrerequisitesContainerDescription()).should('have.text','This course has no prerequisites.')

    //Open Catalog Visibility Section
    cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Catalog Visibility')).click()
    AROCAddEditPage.getShortWait()
    cy.get(arCBAddEditPage.getCatalogVisibilityVerification()).should('have.text','Catalog Visibility')
  })
})