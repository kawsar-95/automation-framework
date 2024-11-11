import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import { users } from '../../../../../../helpers/TestData/users/users'
import ARCourseSettingsEnrollmentRulesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { currDetails } from '../../../../../../helpers/TestData/Courses/curr'
import ARSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import { courses } from '../../../../../../helpers/TestData/Courses/courses'
import ARCURRAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/CURR/ARCURRAddEditPage'
import ARDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'

describe('C839 - AR - CURR - An Administrator can require Approval on Learner enrollments in to a Curriculum (cloned)', function(){
    before('Create Curriculum, Publish Course', () => {
        // Sign into admin side as sys admin 
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getCoursesReport()  

        // Create Curriculum Course
        cy.createCourse('Curriculum')

        //Add courses to curriculum - verify multiple courses are added in the order they are selected
        ARSelectModal.SearchAndSelectFunction([courses.oc_filter_01_name, courses.oc_filter_02_name])
        ARSelectModal.getLShortWait()

        //Verify courses were added in correct order
        cy.get(ARCURRAddEditPage.getElementByAriaLabelAttribute('Course 1 of 2')).should('contain', courses.oc_filter_01_name)
        cy.get(ARCURRAddEditPage.getElementByAriaLabelAttribute('Course 2 of 2')).should('contain', courses.oc_filter_02_name)

        // Publish Curriculum
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
    })

    beforeEach(() => {
        // Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getCoursesReport() 
        
    })

    after('Delete Course',function() {
        cy.deleteCourse(commonDetails.courseID, 'curricula')
    })

    it('Edit a cirriculum and verify radio buttons and messages', () => {
        // Edit a cirriculum
        cy.editCourse(currDetails.courseName)

        //Verfiy course status as active
        cy.get(arDashboardPage.getToggleStatus()).first().should('have.attr', 'aria-checked', 'true')
        
        //verfiy Enrollment Radio Buttons  
        cy.get(ARCourseSettingsEnrollmentRulesModule.getEnrollmentRulesBtn()).first().click()
        ARCourseSettingsEnrollmentRulesModule.scrollToEnrolmentRule()
    
        cy.get(arDashboardPage.getElementByDataNameAttribute('approvalType')).within(() => {
            ARCourseSettingsEnrollmentRulesModule.verifyApprovalOptions()

            // Verify default approver selection is "None"
            cy.get(arDashboardPage.getElementByDataNameAttribute('radio-button-None')).should('have.attr', 'aria-checked', 'true')

            //click one Approval radio buttons and verify messages 
            cy.contains('Course Editor').click()
            cy.get(arDashboardPage.getElementByDataNameAttribute('radio-button-CourseEditor')).should('have.attr', 'aria-checked', 'true')
            ARCourseSettingsEnrollmentRulesModule.verifyApproval_CourseEditorMessage()

            cy.contains('Supervisor').click()
            cy.get(arDashboardPage.getElementByDataNameAttribute('radio-button-Supervisor')).should('have.attr', 'aria-checked', 'true')
            ARCourseSettingsEnrollmentRulesModule.verifyApproval_SupervisorMessage()

            cy.contains('Administrator').click()
            cy.get(arDashboardPage.getElementByDataNameAttribute('radio-button-Administrator')).should('have.attr', 'aria-checked', 'true')
            ARCourseSettingsEnrollmentRulesModule.verifyApproval_AdminMessage()

            cy.contains('None').click()
            cy.get(arDashboardPage.getElementByDataNameAttribute('radio-button-None')).should('have.attr', 'aria-checked', 'true')
            ARCourseSettingsEnrollmentRulesModule.verifyApproval_NoneMessage()

            cy.contains('Other').click()
            cy.get(arDashboardPage.getElementByDataNameAttribute('radio-button-Other')).should('have.attr', 'aria-checked', 'true')
            ARCourseSettingsEnrollmentRulesModule.verifyApproval_OtherMessage()
        })

        // Multiple administrators can be selected when the "Other" option is selected
        cy.get(arDashboardPage.getElementByDataNameAttribute('approvalUserIds')).contains('Choose').click()
        arDashboardPage.getShortWait()

        cy.get(arDashboardPage.getElementByAriaLabelAttribute('Other Approval')).eq(1).should('have.attr', 'aria-multiselectable', 'true')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute('Other Approval')).eq(1).find('li').first().click()
        cy.get(arDashboardPage.getElementByAriaLabelAttribute('Other Approval')).eq(1).find('li').last().click({force:true})
        arDashboardPage.getShortWait()

        //Verify course can be published
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36));
        }) 
    })
})

