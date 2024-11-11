import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import { users } from '../../../../../../helpers/TestData/users/users'
import ARCourseSettingsEnrollmentRulesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
import AROCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage'
import arPublishModal from '../../../../../../helpers/AR/pageObjects/Modals/ARPublishModal'
import ARCURRAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/CURR/ARCURRAddEditPage'
import ARSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { courses } from '../../../../../../helpers/TestData/Courses/courses'
import { currDetails } from '../../../../../../helpers/TestData/Courses/curr'

describe('C5164,C7321 - GUIA-Auto-AE Regression - Edit Curriculum - Edit Course Approval', function(){
    before('Create Curriculum, Publish Course', () => {
        // Sign into admin side as sys admin 
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getCoursesReport() 
        
        // Create Curriculum Course
        cy.createCourse('Curriculum')

        //Add courses to curriculum - verify multiple courses are added in the order they are selected
        ARSelectModal.SearchAndSelectFunction([courses.oc_filter_01_name, courses.oc_filter_02_name])

        //Verify courses were added in correct order
        cy.get(ARCURRAddEditPage.getElementByAriaLabelAttribute('Course 1 of 2'),{timeout: 10000}).should('contain', courses.oc_filter_01_name)
        cy.get(ARCURRAddEditPage.getElementByAriaLabelAttribute('Course 2 of 2')).should('contain', courses.oc_filter_02_name)

        // Publish Curriculum
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
    })
    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getCoursesReport() 
        
    })

    it('Edit a cirriculum and verify radio buttons and messages', () => {        
        //Edit a cirriculum
       cy.editCourse(currDetails.courseName)

        //Verfiy course status as active
        cy.get(arDashboardPage.getToggleStatus()).first().should('have.attr', 'aria-checked', 'true')
        
        //verfiy Enrollment Radio Buttons  
        cy.get(ARCourseSettingsEnrollmentRulesModule.getEnrollmentRulesBtn()).first().click()
        ARCourseSettingsEnrollmentRulesModule.scrollToEnrolmentRule()
        ARCourseSettingsEnrollmentRulesModule.verifyAllowSelfEnrollmentOption()
        ARCourseSettingsEnrollmentRulesModule.verifyAutoEnrollmentOption()
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
