import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../helpers/TestData/users/users'
import ARAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import ARCourseSettingsEnrollmentRulesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'

describe('C987 AUT-188, AR - OC - Add Value Filtering for Custom Number Fields to Enrollment Rule Builders (cloned)', function(){
    beforeEach(() => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getCoursesReport()
    })

    after(function() {        
        cy.deleteCourse(commonDetails.courseID)
    })

    it('Create Online Course', () => {
        cy.createCourse('Online Course')

        //Open Enrollment Rules
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()

        // 1. Select Allow Self Enrollment Specific Radio Button
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('Specific')

        // Add Number custom field - Equals operator to the Self Enrollment rule
        ARCourseSettingsEnrollmentRulesModule.AddEnrollmentRule('Self', 'GUIA Number Custom Field', 'Equals', '5', null)
        cy.get(ARCourseSettingsEnrollmentRulesModule.getUserCountBanner())
            .should(`have.text`,`This course will be available for 1 learners to self-enroll in.`)
        // remove rule 
        ARCourseSettingsEnrollmentRulesModule.RemoveEnrollmentRule('Self', 0, 0)

        // Add Number custom field - Greater than operator to the Self Enrollment rule
        ARCourseSettingsEnrollmentRulesModule.AddEnrollmentRule('Self', 'GUIA Number Custom Field', 'Greater Than', '5', null)
        cy.get(ARCourseSettingsEnrollmentRulesModule.getUserCountBanner())
            .should(`have.text`,`This course will be available for 1 learners to self-enroll in.`)
        // remove rule 
        ARCourseSettingsEnrollmentRulesModule.RemoveEnrollmentRule('Self', 0, 0)
          
        // Add Number custom field - Less Than operator to the Self Enrollment rule
        ARCourseSettingsEnrollmentRulesModule.AddEnrollmentRule('Self', 'GUIA Number Custom Field', 'Less Than', '5', null)
        cy.get(ARCourseSettingsEnrollmentRulesModule.getUserCountBanner())
            .should(`have.text`,`This course will be available for 1 learners to self-enroll in.`)

        // Validation: Doesn't accept decimal value
        cy.get(ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentForm() + ' ' + ARCourseSettingsEnrollmentRulesModule.getRuleTxtF()).clear().type(5.36).blur()
        cy.get(ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentForm() + ' ' + ARCourseSettingsEnrollmentRulesModule.getRuleTxtF()).should('have.value', 5)

        // Number custom field can be combined with other rules
        ARCourseSettingsEnrollmentRulesModule.RefineEnrollmentRule('Self', 0, 'GUIA Decimal Custom Field', 'Equals', '12.23', null)
        cy.get(ARCourseSettingsEnrollmentRulesModule.getUserCountBanner())
        	.should(`have.text`,`This course will be available for 1 learners to self-enroll in.`)

        // 2. Select Allow Automatic Enrollment Specific Radio Button
        ARCourseSettingsEnrollmentRulesModule.getEnableAutomaticEnrollmentRadioBtn('Specific')
        // Add Number custom field - Equals operator to the Automatic Enrollment rule
        ARCourseSettingsEnrollmentRulesModule.AddEnrollmentRule('Auto', 'GUIA Number Custom Field', 'Equals', '5', null)
        cy.get(ARCourseSettingsEnrollmentRulesModule.getCountBanner())
            .should(`have.text`,`1 users meet the automatic enrollment rules you have set. 0 have an existing enrollment, with 1 receiving a new enrollment.`)
        // remove rule 
        ARCourseSettingsEnrollmentRulesModule.RemoveEnrollmentRule('Auto', 0, 0)

        // Add Number custom field - Greater than operator to the Automatic Enrollment rule
        ARCourseSettingsEnrollmentRulesModule.AddEnrollmentRule('Auto', 'GUIA Number Custom Field', 'Greater Than', '5', null)
        cy.get(ARCourseSettingsEnrollmentRulesModule.getCountBanner())
            .should(`have.text`,`1 users meet the automatic enrollment rules you have set. 0 have an existing enrollment, with 1 receiving a new enrollment.`)
        // remove rule 
        ARCourseSettingsEnrollmentRulesModule.RemoveEnrollmentRule('Auto', 0, 0)
          
        // Add Number custom field - Less Than operator to the Automatic Enrollment rule
        ARCourseSettingsEnrollmentRulesModule.AddEnrollmentRule('Auto', 'GUIA Number Custom Field', 'Less Than', '5', null)
        cy.get(ARCourseSettingsEnrollmentRulesModule.getCountBanner())
            .should(`have.text`,`1 users meet the automatic enrollment rules you have set. 0 have an existing enrollment, with 1 receiving a new enrollment.`)

        // Validation: Doesn't accept decimal value
        cy.get(ARCourseSettingsEnrollmentRulesModule.getEnableAutomaticEnrollmentForm() + ' ' + ARCourseSettingsEnrollmentRulesModule.getRuleTxtF()).clear().type(5.36).blur()
        cy.get(ARCourseSettingsEnrollmentRulesModule.getEnableAutomaticEnrollmentForm() + ' ' + ARCourseSettingsEnrollmentRulesModule.getRuleTxtF()).should('have.value', 5)
        
        // Number custom field can be combined with other rules
        ARCourseSettingsEnrollmentRulesModule.RefineEnrollmentRule('Self', 0, 'GUIA Decimal Custom Field', 'Equals', '12.23', null)
        cy.get(ARCourseSettingsEnrollmentRulesModule.getCountBanner())
        	.should(`have.text`,`1 users meet the automatic enrollment rules you have set. 0 have an existing enrollment, with 1 receiving a new enrollment.`)
        
        // Publish OC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
    })
})
