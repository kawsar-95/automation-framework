import ARCourseSettingsAvailabilityModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsAvailability.module'
import arSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import AROCAddEditPage, { coursePageMessages } from '../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage'
import { courses } from '../../../../../../helpers/TestData/Courses/courses'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../helpers/TestData/users/users'
import { miscData } from '../../../../../../helpers/TestData/Misc/misc'
import ARDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'

describe('AUT-96 - C880 - GUIA-Story - NASA-2318 - Online Course - Prerequisites (cloned)', function () {

    after('Delete course created for the test', () => {
        // Delete Course
        cy.deleteCourse(commonDetails.courseID)
    })

    beforeEach('Sign into admin side as sys admin, navigate to Courses', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getCoursesReport()
    })

    it('Create Online Course With All the Prerequisites in the Availability Sections', () => {
        // Create Online Course
        cy.createCourse('Online Course')
        // Open Availability Section
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Availability')).click()
        // Assert Allow Enrollment Description When Toggle is OFF
        cy.get(ARCourseSettingsAvailabilityModule.getAllowEnrollmentToggleDescription()).should('contain', coursePageMessages.COURSE_ENROLLMENT_REQUIRES_PREREQUISITES)
        // Toggle Allow Enrollment to ON and Verify Description
        AROCAddEditPage.generalToggleSwitch('true', ARCourseSettingsAvailabilityModule.getAllowEnrollmentToggleContainer())
        cy.get(ARCourseSettingsAvailabilityModule.getAllowEnrollmentToggleDescription()).should('contain', coursePageMessages.COURSE_INTAKE_REQUIRES_PREREQUISITES)
        // Add Prerequisite
        cy.get(ARCourseSettingsAvailabilityModule.getAddPrerequisiteBtn()).click()
        // Add Valid Input to Prerequisite Name Field
        cy.get(ARCourseSettingsAvailabilityModule.getPrerequisiteNameTxt()).clear().type(commonDetails.prerequisiteName)
        
        // Complete Courses Section
        // Click On RequirementType Complete Courses
        cy.get(ARCourseSettingsAvailabilityModule.getRequirementTypeRadioBtn()).contains('Complete Courses').click()
        // Add Course to Prerequisite
        cy.get(ARCourseSettingsAvailabilityModule.getPrerequisiteCourseDDown()).click()
        cy.get(ARCourseSettingsAvailabilityModule.getPrerequisiteCourseSearchTxtF()).type(courses.oc_02_admin_approval_naNAME)
        ARCourseSettingsAvailabilityModule.getPrerequisiteCourseOpt(courses.oc_02_admin_approval_naNAME)
        // Select Completion Type 'Must complete all' Option
        cy.get(ARCourseSettingsAvailabilityModule.getPrerequisiteContainer()).click()
        cy.get(ARCourseSettingsAvailabilityModule.getCompletionTypeRadioBtn()).contains('Must complete all').click()
        // Select Completion Type 'Required to Complete' Option
        cy.get(ARCourseSettingsAvailabilityModule.getCompletionTypeRadioBtn()).contains('Required to complete').click()
        // Enter Valid Input in Required Course Count Field
        cy.get(AROCAddEditPage.getElementByAriaLabelAttribute(ARCourseSettingsAvailabilityModule.getRequiredCourseCountTxt())).clear().type('1')
        
        // Valid Certificates Section
        // Click On RequirementType Valid Certificates
        cy.get(ARCourseSettingsAvailabilityModule.getRequirementTypeRadioBtn()).contains('Valid Certificates').click()
        // Click On Course DropDown
        cy.get(ARCourseSettingsAvailabilityModule.getValidCertPrerequisiteCourseDDown()).click()
        // Add a course with a certificate
        cy.get(ARCourseSettingsAvailabilityModule.getValidCertPrerequisiteCourseSearchTxtF()).clear().type(courses.oc_filter_01_name)
        ARCourseSettingsAvailabilityModule.getPrerequisiteCourseOpt(courses.oc_filter_01_name)
        cy.get(ARCourseSettingsAvailabilityModule.getCoursesContainer()).click()
        // Select Completion Type 'Must complete all' Option
        cy.get(ARCourseSettingsAvailabilityModule.getCompletionTypeRadioBtn()).contains('Must complete all').click()
        // Select Completion Type 'Required to Complete' Option
        cy.get(ARCourseSettingsAvailabilityModule.getCompletionTypeRadioBtn()).contains('Required to complete').click()
        // Enter Valid Input in Required Course Count Field
        cy.get(AROCAddEditPage.getElementByAriaLabelAttribute(ARCourseSettingsAvailabilityModule.getRequiredCourseCountTxt())).clear().type('1')

        // Competencies Section
        // Click On RequirementType Competencies
        cy.get(ARCourseSettingsAvailabilityModule.getRequirementTypeRadioBtn()).contains('Competencies').click()
        // Add Competency to Prerequisite
        cy.get(ARCourseSettingsAvailabilityModule.getAddCompetenciesBtn()).click()
        // Search For and Select Multiple Competency
        arSelectModal.SearchAndSelectCompetencies([miscData.competency_01, miscData.competency_02])
        // Publish OC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
    })
})