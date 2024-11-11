import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import { users } from '../../../../../../helpers/TestData/users/users'
import ARCourseSettingsEnrollmentRulesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
import AROCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage'
import arPublishModal from '../../../../../../helpers/AR/pageObjects/Modals/ARPublishModal'
import { ilcDetails } from '../../../../../../helpers/TestData/Courses/ilc'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'

describe('C5165 - GUIA-Auto-AE Regression - Edit ILC - Course Approval', function(){
    before('Create ILC, Publish Course', () => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        
        arDashboardPage.getMediumWait()

        // Create ILC course
        cy.createCourse('Instructor Led', ilcDetails.courseName, false)

        //Publish ILC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
    })

    after('Delete Created Course', function() {
        cy.deleteCourse(commonDetails.courseID, 'instructor-led-courses-new')
    })

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        
    })

    it('Edit a ILC and verify radio buttons and messages', () => {
        arDashboardPage.getMediumWait()

        //Edit a ILC
        cy.editCourse(ilcDetails.courseName)
        arDashboardPage.getMediumWait()

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
