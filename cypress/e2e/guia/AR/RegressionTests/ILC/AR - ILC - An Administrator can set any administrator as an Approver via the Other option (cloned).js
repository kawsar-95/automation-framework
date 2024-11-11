import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import { users } from '../../../../../../helpers/TestData/users/users'
import arCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import ARCourseSettingsEnrollmentRulesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { ilcDetails } from '../../../../../../helpers/TestData/Courses/ilc'

describe('C810 - AR - ILC - An Administrator can set any administrator as an Approver via the Other option (cloned)', function(){
    before('Create ILC with Sessions, Publish Course', () => {
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
        arCoursesPage.getMediumWait()

        //Redirect to the left panel and click on the Users Icon
        cy.get(arDashboardPage.getElementByAriaLabelAttribute('Users')).click()
        //Click on Users button
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Users'))
        cy.intercept('**/users/operations').as('getUser').wait('@getUser');
        cy.wrap(arDashboardPage.AddFilter('Is Admin', 'Yes'))
        arCoursesPage.getMediumWait()

        cy.get(arDashboardPage.getElementByDataNameAttribute('table-container')).find('tbody > tr').its('length').as('adminUserNumber')
        arCoursesPage.getShortWait()
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

    it('Edit a ILC and verify Approval radio buttons and messages', () => {
        arDashboardPage.getMediumWait()

        cy.editCourse(ilcDetails.courseName)
        arDashboardPage.getMediumWait()
        
        //verfiy Enrollment Radio Buttons  
        cy.get(ARCourseSettingsEnrollmentRulesModule.getEnrollmentRulesBtn()).first().click()
        ARCourseSettingsEnrollmentRulesModule.scrollToEnrolmentRule()
        ARCourseSettingsEnrollmentRulesModule.verifyAllowSelfEnrollmentOption()

        cy.get(arDashboardPage.getElementByDataNameAttribute('approvalType')).within(() => {
            // The "Other" option is available as an approval selection
            cy.contains('Other').should('be.visible')

            //click Other Approval radio buttons and verify messages 
            cy.contains('Other').click()
            cy.get(arCoursesPage.getElementByDataNameAttribute('radio-button-Other')).should('have.attr', 'aria-checked', 'true')
            ARCourseSettingsEnrollmentRulesModule.verifyApproval_OtherMessage()
        })

        // Multiple administrators can be selected when the "Other" option is selected
        cy.get(arCoursesPage.getElementByDataNameAttribute('approvalUserIds')).contains('Choose').click()
        arCoursesPage.getShortWait()

        cy.get(arCoursesPage.getElementByAriaLabelAttribute('Other Approval')).eq(1).should('have.attr', 'aria-multiselectable', 'true')
        cy.get(arCoursesPage.getElementByAriaLabelAttribute('Other Approval')).eq(1).find('li').first().click()
        cy.get(arCoursesPage.getElementByAriaLabelAttribute('Other Approval')).eq(1).find('li').last().click({force:true})
        arCoursesPage.getShortWait()

        // Verify Only administrators appear in the drop down
        cy.get(arCoursesPage.getElementByAriaLabelAttribute('Other Approval')).eq(1).find('li').its('length').then(($length) => {
            cy.get('@adminUserNumber').then((adminUserNumber)=> {
                expect(adminUserNumber).to.eq($length)
            })
        })
    })
})
