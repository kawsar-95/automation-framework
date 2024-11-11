import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import { users } from '../../../../../../helpers/TestData/users/users'
import arCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import ARCourseSettingsEnrollmentRulesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
import AROCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage'
import arPublishModal from '../../../../../../helpers/AR/pageObjects/Modals/ARPublishModal'
import ARDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import { courses } from '../../../../../../helpers/TestData/Courses/courses'


describe('C5163 - AE Regression - Edit Online Course - Course Approval', function(){

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        
    })

    it('Edit a Online Course and verify radio buttons and messages', () => {
        
        //Edit a ILC
        arDashboardPage.AddFilter('Name','Equals',courses.oc_filter_01_name)
        arCoursesPage.getMediumWait()
        cy.get(arCoursesPage.getTableCellName(2)).click()
        cy.wrap(arCoursesPage.WaitForElementStateToChange(arCoursesPage.getAddEditMenuActionsByName('Edit'), 1000))
        cy.get(arCoursesPage.getAddEditMenuActionsByName('Edit')).click()
        ARDashboardPage.getMediumWait()
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBannerBtn('More')).should('exist')
        arCoursesPage.getMediumWait()

        //Verfiy course status as active
        cy.get(arDashboardPage.getToggleStatus()).first().should('have.attr', 'aria-checked', 'true')
        
        //verfiy Enrollment Radio Buttons  
        cy.get(ARCourseSettingsEnrollmentRulesModule.getEnrollmentRulesBtn()).first().click()
        ARCourseSettingsEnrollmentRulesModule.scrollToEnrolmentRule()
        ARCourseSettingsEnrollmentRulesModule.verifyAllowSelfEnrollmentOption()
        ARCourseSettingsEnrollmentRulesModule.verifyApprovalOption()
        ARCourseSettingsEnrollmentRulesModule.verifySelfEnrollment_SpecificOption()
        ARCourseSettingsEnrollmentRulesModule.verifySelfEnrollment_AllLearnersOption()
        ARCourseSettingsEnrollmentRulesModule.verifyApprovalOptions()

        //click on All Learners radio button and verfiy message
        ARCourseSettingsEnrollmentRulesModule.getSelectSelfEnrollmentRadioBtnbyName('All Learners')
        ARCourseSettingsEnrollmentRulesModule.getSelectSelfEnrollmentRadioBtnbyName('Specific')
        ARCourseSettingsEnrollmentRulesModule.getSelectSelfEnrollmentRadioBtnbyName('Off')

        //click one Approval radio buttons and verify messages 
        ARCourseSettingsEnrollmentRulesModule.verifyApprovalOptions()
        ARCourseSettingsEnrollmentRulesModule.getSelectApprovalRadioBtnbyName('Course Editor')
        ARCourseSettingsEnrollmentRulesModule.getSelectApprovalRadioBtnbyName('Supervisor')
        ARCourseSettingsEnrollmentRulesModule.getSelectApprovalRadioBtnbyName('Administrator')
        ARCourseSettingsEnrollmentRulesModule.getSelectApprovalRadioBtnbyName('Other')
        ARCourseSettingsEnrollmentRulesModule.getSelectApprovalRadioBtnbyName('None')

        //Publish Course
        cy.get(AROCAddEditPage.getPublishBtn()).click()
        cy.get(arPublishModal.getContinueBtn()).click()
        

    })
})
