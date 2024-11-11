import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import { users } from '../../../../../../helpers/TestData/users/users'
import ARCourseSettingsEnrollmentRulesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { ocDetails } from '../../../../../../helpers/TestData/Courses/oc'

describe('C764 AUT-196, AR - OC - Course Approval (cloned)', function(){
    before('Create Online Course', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getCoursesReport()        
        
        // Create Online course
        cy.createCourse('Online Course')

        //Publish Online course
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })

        cy.get(arDashboardPage.getPageHeaderTitle(), { timeout: 15000 }).should('be.visible').and('contain', 'Courses')
        cy.get(arDashboardPage.getWaitSpinner()).should('not.exist')

        arDashboardPage.getUsersReport()
        arDashboardPage.AddFilter('Is Admin', 'Yes')
        cy.get(arDashboardPage.getTableRow()).its('length').as('adminUserNumber')
    })

    after(function() {
        cy.deleteCourse(commonDetails.courseID)
    })

    beforeEach(() => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getCoursesReport()        
    })

    it('Edit OC and verify Approval radio buttons and messages', () => {
        cy.editCourse(ocDetails.courseName)
        
        //verfiy Enrollment Radio Buttons
        cy.get(ARCourseSettingsEnrollmentRulesModule.getEnrollmentRulesBtn()).first().click()
        ARCourseSettingsEnrollmentRulesModule.scrollToEnrolmentRule()

        cy.get(ARCourseSettingsEnrollmentRulesModule.getApprovalTypeContainer()).within(() => {
            // The "Other" option is available as an approval selection
            cy.contains('Other').should('be.visible')

            //click Other Approval radio buttons and verify messages
            cy.contains('span', 'Other').click()
            cy.get(ARCourseSettingsEnrollmentRulesModule.getApprovalTypeRadioButtonOther()).should('have.attr', 'aria-checked', 'true')
            ARCourseSettingsEnrollmentRulesModule.verifyApproval_OtherMessage()
        })

        // Multiple administrators can be selected when the "Other" option is selected
        cy.get(ARCourseSettingsEnrollmentRulesModule.getOtherApprovalDDown()).click()

        cy.get(ARCourseSettingsEnrollmentRulesModule.getOtherApprovalOptList()).should('have.attr', 'aria-multiselectable', 'true')
        cy.get(ARCourseSettingsEnrollmentRulesModule.getOtherApprovalOptList()).find('li').first().click()
        cy.get(ARCourseSettingsEnrollmentRulesModule.getOtherApprovalOptList()).find('li').last().click({force:true})

        // Verify Only administrators appear in the drop down
        cy.get(ARCourseSettingsEnrollmentRulesModule.getOtherApprovalOptList()).find('li').its('length').then(function($length){
            expect(this.adminUserNumber).to.eq($length)
        })
    })
})
