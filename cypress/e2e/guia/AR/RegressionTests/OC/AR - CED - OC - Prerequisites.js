import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARCourseSettingsAvailabilityModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsAvailability.module'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import arSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import AROCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage'
import { courses } from '../../../../../../helpers/TestData/Courses/courses'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../helpers/TestData/users/users'
import { miscData } from '../../../../../../helpers/TestData/Misc/misc'

describe('C768 AR - CED - OC - Prerequisites', function () {

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        
    })

    it('Create Online Course With All the Prerequisites in the Availability Sections', () => {
        //Create Online Course
        cy.createCourse('Online Course')

        //Open Availability Section
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Availability')).click()
        AROCAddEditPage.getShortWait()


        //Assert Allow Enrollment Description When Toggle is OFF
        cy.get(ARCourseSettingsAvailabilityModule.getAllowEnrollmentToggleDescription())
            .should('contain', 'Learners will not be able to enroll in this course until all prerequisites are met.')

        //Toggle Allow Enrollment to ON and Verify Description
        cy.get(ARCourseSettingsAvailabilityModule.getAllowEnrollmentContainer()).click()
        cy.get(ARCourseSettingsAvailabilityModule.getAllowEnrollmentDescription())
            .should('contain', 'Learners will be allowed to enroll in the course, but will be unable to take it until all prerequisites are met.')

        //Add Prerequisite
        cy.get(ARCourseSettingsAvailabilityModule.getAddPrerequisiteBtn()).click()
        AROCAddEditPage.getShortWait()

        //Add Valid Input to Prerequisite Name Field
        cy.get(ARCourseSettingsAvailabilityModule.getPrerequisiteNameTxt()).clear().type(commonDetails.prerequisiteName)


        //Complete Courses Section
        //Click On RequiremntType Complete Courses
        cy.get(ARCourseSettingsAvailabilityModule.getRequirementTypeRadioBtn()).contains('Complete Courses').click()

        //Add Course to Prerequisite
        cy.get(ARCourseSettingsAvailabilityModule.getPrerequisiteCourseDDown()).click()
        cy.get(ARCourseSettingsAvailabilityModule.getPrerequisiteCourseSearchTxtF()).type(courses.oc_02_admin_approval_naNAME)
        ARCourseSettingsAvailabilityModule.getPrerequisiteCourseOpt(courses.oc_02_admin_approval_naNAME)
        AROCAddEditPage.getShortWait()


        //Select Completion Type 'Must complete all' Option
        cy.get(ARCourseSettingsAvailabilityModule.getPrerequisiteContainer()).click()
        cy.get(ARCourseSettingsAvailabilityModule.getCompletionTypeRadioBtn()).contains('Must complete all').click()

        //Select Completion Type 'Required to Complete' Option
        cy.get(ARCourseSettingsAvailabilityModule.getCompletionTypeRadioBtn()).contains('Required to complete').click()

        //Enter Valid Input in Required Course Count Field
        cy.get(AROCAddEditPage.getElementByAriaLabelAttribute(ARCourseSettingsAvailabilityModule.getRequiredCourseCountTxt())).clear().type('1')
        AROCAddEditPage.getVShortWait()


        //Valid Certificates Section
        //Click On RequiremntType Valid Certificates
        cy.get(ARCourseSettingsAvailabilityModule.getRequirementTypeRadioBtn()).contains('Valid Certificates').click()

        //Click On Course DropDown
        cy.get(ARCourseSettingsAvailabilityModule.getValidCertPrerequisiteCourseDDown()).click()

        //Add a course with a certificate
        cy.get(ARCourseSettingsAvailabilityModule.getValidCertPrerequisiteCourseSearchTxtF()).clear().type(courses.oc_filter_01_name)
        ARCourseSettingsAvailabilityModule.getPrerequisiteCourseOpt(courses.oc_filter_01_name)
        AROCAddEditPage.getShortWait()
        cy.get(ARCourseSettingsAvailabilityModule.getCoursesContainer()).click()

        //Select Completion Type 'Must complete all' Option
        cy.get(ARCourseSettingsAvailabilityModule.getCompletionTypeRadioBtn()).contains('Must complete all').click()

        //Select Completion Type 'Required to Complete' Option
        cy.get(ARCourseSettingsAvailabilityModule.getCompletionTypeRadioBtn()).contains('Required to complete').click()

        //Enter Valid Input in Required Course Count Field
        cy.get(AROCAddEditPage.getElementByAriaLabelAttribute(ARCourseSettingsAvailabilityModule.getRequiredCourseCountTxt())).clear().type('1')
        AROCAddEditPage.getVShortWait()


        //Competencies Section
        //Click On RequiremntType Competencies
        cy.get(ARCourseSettingsAvailabilityModule.getRequirementTypeRadioBtn()).contains('Competencies').click()

        //Add Competency to Prerequisite
        cy.get(ARCourseSettingsAvailabilityModule.getAddCompetenciesBtn()).click()

        //Search For and Select Multiple Competency
        arSelectModal.SearchAndSelectCompetencies([miscData.competency_01, miscData.competency_02])
        AROCAddEditPage.getShortWait()


        //Publish OC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
    })


    after(function () {
        //Delete Course
        cy.deleteCourse(commonDetails.courseID)
    })
})

