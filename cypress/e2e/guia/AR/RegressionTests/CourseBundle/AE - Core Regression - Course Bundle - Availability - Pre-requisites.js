import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import ARCourseSettingsAvailabilityModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsAvailability.module'
import arCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import ARSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { courses } from '../../../../../../helpers/TestData/Courses/courses'
import { users } from '../../../../../../helpers/TestData/users/users'
import ARILCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage'
import { addCompetenciesData } from '../../../../../../helpers/TestData/Dashboard/dashboardDetails'
import ARCBAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/CB/ARCBAddEditPage'
import ARDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'


describe('C7332 - AUT-694 - AE - Core Regression - Course Bundle - Availability - Pre-requisites', function () {

    beforeEach('Login as Admin and create course for add bundle course', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin/dashboard')
        ARDashboardPage.getCoursesReport()
    })

    after('Delete This Courses Bundle', () => {
        for (let i = 0; i < commonDetails.courseIDs.length; i++) {
            cy.deleteCourse(commonDetails.courseIDs[i], 'course-bundles')
        }
    })

    it('Create Course Bundle, validate pre-requites for valid certificate', () => {
        // Add to course bundle with all mandatory field should be filled correctly.
        cy.createCourse('Course Bundle')
        cy.get(ARCBAddEditPage.getWaitSpinner(),{timeout:15000}).should('not.exist')
        ARSelectModal.SearchAndSelectFunction([courses.oc_filter_01_name])
        cy.get(ARCBAddEditPage.getWaitSpinner(),{timeout:15000}).should('not.exist')
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBannerBtn('Availability')).should('exist')
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBannerBtn('Availability')).click().click()
        arCoursesPage.getShortWait()

        // Asserting Access date
        cy.get(ARILCAddEditPage.getAddSessionModalSubTitle()).contains('Access Date').should('exist')
        // Asserting Expiration
        cy.get(ARILCAddEditPage.getAddSessionModalSubTitle()).contains('Expiration').should('exist')
        // Asserting Pre-requisites
        cy.get(ARCourseSettingsAvailabilityModule.getAddPrerequisiteBtn(), { timeout: 15000 }).contains('Prerequisite').should('exist')

        // Asserting Add Prerequisite
        cy.get(ARCourseSettingsAvailabilityModule.getAddPrerequisiteButton(), { timeout: 15000 }).should('have.text', 'Add Prerequisite')

        // Click on Add Pre-requisites button
        cy.get(ARCourseSettingsAvailabilityModule.getAddPrerequisiteButton(), { timeout: 15000 }).click()
        // Asserting field should be displayed correctly.
        cy.get(ARCourseSettingsAvailabilityModule.getPrerequisiteNameTxtPreqOn(), { timeout: 15000 }).should('exist')
        // User should be able to add the Pre-requisites name sucessfully  
        cy.get(ARCourseSettingsAvailabilityModule.getPrerequisiteNameTxtPreqOn(), { timeout: 15000 }).clear().type(commonDetails.prerequisiteName)
        // Asserting Sub option should be displayed

        // Asserting  Complete Courses
        cy.get(ARCourseSettingsAvailabilityModule.getRequirementTypeRadioBtn(), { timeout: 15000 }).contains('Complete Courses')
        // Assert Valid Certificates
        cy.get(ARCourseSettingsAvailabilityModule.getRequirementTypeRadioBtn(), { timeout: 15000 }).contains('Valid Certificates')
        // Assert Competencies
        cy.get(ARCourseSettingsAvailabilityModule.getRequirementTypeRadioBtn(), { timeout: 15000 }).contains('Competencies')
        cy.get(ARCourseSettingsAvailabilityModule.getRequirementTypeRadioBtn(), { timeout: 15000 }).contains('Complete Courses').click().click()

        // Select a course
        cy.get(ARCourseSettingsAvailabilityModule.getValidCertPrerequisiteCourseDDownPreqOn()).click()
        cy.get(ARCourseSettingsAvailabilityModule.getValidCertPrerequisiteCourseSearchTxtInput(), { timeout: 15000 }).clear().type(courses.oc_filter_01_name)
        ARCourseSettingsAvailabilityModule.getPrerequisiteCourseOpt(courses.oc_filter_01_name)
        arCoursesPage.getShortWait()
        // Assert Must complete all and select
        cy.get(ARCourseSettingsAvailabilityModule.getCompletionTypeRadioBtn()).contains('Must complete all').click({ force: true })
        // Assert Required to complete and select
        cy.get(ARCourseSettingsAvailabilityModule.getCompletionTypeRadioBtn()).contains('Required to complete').click({ force: true })
        arCoursesPage.getShortWait()

        cy.get(ARCourseSettingsAvailabilityModule.getRequirementTypeRadioBtn()).contains('Valid Certificates').click({ force: true })
        arCoursesPage.getMediumWait()
        // Assert Valid certificate is selected 
        cy.get(ARCBAddEditPage.getCertificatedIDs()).within(() => {
            cy.get(ARCBAddEditPage.getCertificatedIDField()).scrollIntoView()
            cy.get(ARCBAddEditPage.getCertificatedIDField()).click()
            cy.get(ARCBAddEditPage.getCertificatedIDsInput()).type(courses.oc_02_admin_approval_naNAME)
            cy.get(ARCBAddEditPage.getCertificateIdDDownItem()).eq(0).invoke('show').click({ force: true })
        })

        // Assert required condition to create course with pre-requisites for certificates are met
        cy.get(ARCBAddEditPage.getEnabledPublishedBtn(), { timeout: 15000 }).should('exist').and('be.visible')

        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36))
        })
    })

    it('Create Course Bundle and check competencies', () => {
        cy.createCourse('Course Bundle')
        cy.get(ARCBAddEditPage.getWaitSpinner(),{timeout:15000}).should('not.exist')
        ARSelectModal.SearchAndSelectFunction([courses.oc_filter_01_name])
        cy.get(ARCBAddEditPage.getWaitSpinner(),{timeout:15000}).should('not.exist')
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBannerBtn('Availability')).click().click()
        // Click on Add Pre-requisites button
        cy.get(ARCourseSettingsAvailabilityModule.getAddPrerequisiteButton()).should('exist')
        cy.get(ARCourseSettingsAvailabilityModule.getAddPrerequisiteButton()).click()
       

        // User should be able to add the Pre-requisites name sucessfully  
        cy.get(ARCourseSettingsAvailabilityModule.getPrerequisiteNameTxtPreqOn()).clear().type(commonDetails.prerequisiteName)
        cy.get(ARCourseSettingsAvailabilityModule.getRequirementTypeRadioBtn()).should('exist')
        cy.get(ARCourseSettingsAvailabilityModule.getRequirementTypeRadioBtn()).contains('Complete Courses').click().click()
        // Asserting options should be displayed
        cy.get(ARCourseSettingsAvailabilityModule.getRequirementTypeRadioBtn()).contains('Competencies').click()
        cy.get(ARCourseSettingsAvailabilityModule.getAddCompetenciesButton()).should('have.text', 'Add Competencies')
        cy.get(ARCourseSettingsAvailabilityModule.getAddCompetenciesButton()).click()
        // Assert Competencies should be opened.
        cy.get(ARCourseSettingsAvailabilityModule.getDialogTitle()).should('have.text', 'Select Competencies')
        // Click on Cancel button
        cy.get(ARCourseSettingsAvailabilityModule.getCompetencieSearchSelect()).clear().type(addCompetenciesData.competency1)
        
        cy.get(ARCourseSettingsAvailabilityModule.getModalFooterCancelBtn()).click({force:true})
        
        // Competencies level should be displayed.
        cy.get(ARCourseSettingsAvailabilityModule.getAddCompetenciesButton()).should('have.text', 'Add Competencies')
        cy.get(ARCourseSettingsAvailabilityModule.getAddCompetenciesButton()).click()
        cy.get(ARCourseSettingsAvailabilityModule.getCompetencieSearchSelect()).clear().type(addCompetenciesData.competency1)
        cy.get(ARCourseSettingsAvailabilityModule.getCompetencieSearchSelectIteam(addCompetenciesData.competency1)).eq(0).click()
       
        cy.get(ARCourseSettingsAvailabilityModule.getModalFooterChooseBtn()).click()
        cy.get(ARCBAddEditPage.getWaitSpinner(),{timeout:15000}).should('not.exist')
        // Click on Delete button
        cy.get(ARCourseSettingsAvailabilityModule.getRemoveCompetency()).click({ force: true })
      
        // Assert required condition to craete course with pre-requisites for competencies are met
        cy.get(ARCBAddEditPage.getEnabledPublishedBtn() , {timeout:15000}).should('exist').and('be.visible')

        // Publish and Course saved sucessfully.
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36))
        })
        cy.get(ARCBAddEditPage.getWaitSpinner(),{timeout:15000}).should('not.exist')
    })
})

