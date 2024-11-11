import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import { users } from '../../../../../../helpers/TestData/users/users'
import ARCourseSettingsEnrollmentRulesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { ilcDetails } from '../../../../../../helpers/TestData/Courses/ilc'
import ARILCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage'
import AREditClientInfoPage from '../../../../../../helpers/AR/pageObjects/PortalSettings/AREditClientInfoPage'

describe('C816 - AR - ILC - Enable E-commerce (cloned)', function(){
    before('Create ILC with Sessions, Publish Course', () => {
        //Sign into admin side as sys admin 
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        

        arDashboardPage.getMediumWait()

        // Create ILC course
        cy.createCourse('Instructor Led', ilcDetails.courseName, false)

        //Publish ILC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36)
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

    it('Edit a ILC and verify Approval radio buttons and messages', () => {
        arDashboardPage.getMediumWait()

        cy.editCourse(ilcDetails.courseName)
        arDashboardPage.getMediumWait()
        
        // Open Enrollment Rules
        cy.get(ARCourseSettingsEnrollmentRulesModule.getEnrollmentRulesBtn()).first().click()
        ARCourseSettingsEnrollmentRulesModule.scrollToEnrolmentRule()

        // "Enable E-Commerce" toggle is visible but greyed out when self enrollment is disabled
        cy.get(arDashboardPage.getElementByDataNameAttribute('radio-button-Off')).should('have.attr', 'aria-checked', 'true');

        // Verify "Enable E-Commerce" toggle is available
        cy.get(arDashboardPage.getElementByDataNameAttribute(ARCourseSettingsEnrollmentRulesModule.getEnableEcommToggleContainer()))
            .find(ARILCAddEditPage.getAddSessionModalSubTitle()).should('have.text', 'Enable E-Commerce')

        //Enable E-Commerce and updates as expected  and updates as expected
        cy.get(arDashboardPage.getElementByAriaLabelAttribute('Enable E-Commerce')).should('have.attr', 'aria-checked', 'false')
        cy.get(arDashboardPage.getElementByDataNameAttribute(ARCourseSettingsEnrollmentRulesModule.getEnableEcommToggleContainer()) + ' ' + arDashboardPage.getToggleEnabled()).click()
        cy.get(arDashboardPage.getElementByAriaLabelAttribute('Enable E-Commerce')).should('have.attr', 'aria-checked', 'true')
        arDashboardPage.getShortWait()

        // "Require Learners to Choose Session on Purchase" toggle is available and updates as expected
        cy.get(ARILCAddEditPage.getElementByDataNameAttribute('requireSessionSelection')).should('exist')
        cy.get(ARILCAddEditPage.getElementByAriaLabelAttribute('Require Learner to Choose Session Upon Purchase')).should('have.attr', 'aria-checked', 'true')
        cy.get(ARILCAddEditPage.getElementByDataNameAttribute('requireSessionSelection')).find(ARILCAddEditPage.getToggleEnabled()).click()
        cy.get(ARILCAddEditPage.getElementByAriaLabelAttribute('Require Learner to Choose Session Upon Purchase')).should('have.attr', 'aria-checked', 'false')
        
        // Verify "Allow Public Purchase" toggle is available and updates as expected
        cy.get(ARILCAddEditPage.getElementByDataNameAttribute('allowPublicPurchase')).should('exist')
        cy.get(ARILCAddEditPage.getElementByAriaLabelAttribute('Allow Public Purchase')).should('have.attr', 'aria-checked', 'false')
        cy.get(ARILCAddEditPage.getElementByDataNameAttribute('allowPublicPurchase')).find(ARILCAddEditPage.getToggleEnabled()).click()
        cy.get(ARILCAddEditPage.getElementByAriaLabelAttribute('Allow Public Purchase')).should('have.attr', 'aria-checked', 'true')

        // Verify "Default Price" field only accepts numbers up to two decimal places
        cy.get(ARILCAddEditPage.getElementByAriaLabelAttribute('Default Price')).clear().type(5.7659)
        cy.get(ARILCAddEditPage.getElementByAriaLabelAttribute('Default Price')).siblings('div').click()
        cy.get(ARILCAddEditPage.getElementByAriaLabelAttribute('Default Price')).should('have.value', '5.77')

        // Verify "Default Currency" field accurately reflects the portal default Currency set at the portal level
        cy.get(ARILCAddEditPage.getElementByAriaLabelAttribute('Default Price')).next().find('span').invoke('text').as('defaultCurrency')   

        cy.visit('/admin')
        arDashboardPage.getMediumWait()

        //Clicking On Account Button
        cy.get(arDashboardPage.getElementByDataNameAttribute('button-account')).click()

        //Click on Portal Settings button
        cy.get(arDashboardPage.getPortalSettingsBtn()).click()
        arDashboardPage.getLongWait()
        //Asserting Client Page
        cy.get(arDashboardPage.getAccountHeaderLabel()).should('have.text', 'Edit Client')

        // Click Manage E-Commerce Settings Sidebar Menu
        arDashboardPage.getA5AddEditMenuActionsByNameThenClick('Manage E-Commerce Settings')
        arDashboardPage.getMediumWait()

        // Click PaymentGateways Tab Menu
        cy.get(AREditClientInfoPage.getPaymentGatewaysTabMenu()).click()
        arDashboardPage.getMediumWait()

        // Get Default Currency
        cy.get(AREditClientInfoPage.getDefaultCurrency()).invoke('text').then((text) => {
            cy.get('@defaultCurrency').then((defaultCurrency)=> {
                expect(text).to.eq(defaultCurrency)
            })
        })
    })
})
