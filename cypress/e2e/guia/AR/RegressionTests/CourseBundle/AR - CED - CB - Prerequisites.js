import ARDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARCourseSettingsAvailabilityModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsAvailability.module'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import ARSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import AROCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage'
import { courses } from '../../../../../../helpers/TestData/Courses/courses'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../helpers/TestData/users/users'
import { miscData } from '../../../../../../helpers/TestData/Misc/misc'
import { cbDetails } from '../../../../../../helpers/TestData/Courses/cb'


describe('C842,C954  AR - CED - CB - Prerequisites', function () {

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getCoursesReport()

    })

    it('Create CourseBundle With RequiremntType Complete Courses', () => {
        //Create Online Course
        cy.createCourse('Course Bundle')

        //Add course to course bundle
        ARSelectModal.SearchAndSelectFunction([courses.oc_filter_01_name])
        ARSelectModal.getLShortWait()


        //Open Availability Section
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Availability')).click()
        AROCAddEditPage.getShortWait()


        //Verify Add Prerequisite Button Exist
        cy.get(ARCourseSettingsAvailabilityModule.getAddPrerequisiteBtn()).should('exist')

        //Add Prerequisite
        cy.get(ARCourseSettingsAvailabilityModule.getAddPrerequisiteBtn()).click()
        AROCAddEditPage.getShortWait()

        //Verify Add Prerequisite Button Disappear
        cy.get(ARCourseSettingsAvailabilityModule.getAddPrerequisiteBtn()).should('not.exist')


        //Add Valid Input to Prerequisite Name Field
        cy.get(ARCourseSettingsAvailabilityModule.getPrerequisiteNameTxt()).clear().type(commonDetails.prerequisiteName)


        //Complete Courses Section
        //Check On RequiremntType Complete Courses is by default selected
        cy.get(ARCourseSettingsAvailabilityModule.getRequirementTypeRadioBtn()).contains('Complete Courses').click()


        //Select Completion Type 'Must complete all' Option
        cy.get(ARCourseSettingsAvailabilityModule.getCompletionTypeRadioBtn()).contains('Must complete all').click()

        //Verify Required Course Count Field is disabled
        cy.get(AROCAddEditPage.getElementByAriaLabelAttribute(ARCourseSettingsAvailabilityModule.getRequiredCourseCountTxt())).should('have.attr', 'readonly')


        //Add Course to Prerequisite
        cy.get(ARCourseSettingsAvailabilityModule.getPrerequisiteCourseDDown()).click()
        cy.get(ARCourseSettingsAvailabilityModule.getPrerequisiteCourseSearchTxtF()).type(courses.oc_02_admin_approval_naNAME)
        ARCourseSettingsAvailabilityModule.getPrerequisiteCourseOpt(courses.oc_02_admin_approval_naNAME)
        AROCAddEditPage.getShortWait()


        //Select Completion Type 'Required to Complete' Option
        cy.get(ARCourseSettingsAvailabilityModule.getCompletionTypeRadioBtn()).contains('Required to complete').click({force:true})

        //Verify Required Course Count Field Cannot Accept Large Value
        cy.get(AROCAddEditPage.getElementByAriaLabelAttribute(ARCourseSettingsAvailabilityModule.getRequiredCourseCountTxt())).type('4')
        cy.get(ARCourseSettingsAvailabilityModule.getRequiredCourseCountErrorMsg()).should('contain', 'Field must be less than or equal to 1.')

        //Enter Valid Input in Required Course Count Field
        cy.get(AROCAddEditPage.getElementByAriaLabelAttribute(ARCourseSettingsAvailabilityModule.getRequiredCourseCountTxt())).clear().type('1')
        AROCAddEditPage.getVShortWait()


        //Publish OC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })

    })


    it('Edit CourseBundle With RequiremntType Valid Certificates', () => {
        //Edit Course Bundle
        cy.editCourse(cbDetails.courseName)

        //Open Availability Section
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Availability')).click()
        AROCAddEditPage.getShortWait()


        //Valid Certificates Section
        //Click On RequiremntType Valid Certificates
        cy.get(ARCourseSettingsAvailabilityModule.getRequirementTypeRadioBtn()).contains('Valid Certificates').click()


        //Select Completion Type 'Must complete all' Option
        cy.get(ARCourseSettingsAvailabilityModule.getCompletionTypeRadioBtn()).contains('Must complete all').click()

        //Verify Required Course Count Field is disabled
        cy.get(AROCAddEditPage.getElementByAriaLabelAttribute(ARCourseSettingsAvailabilityModule.getRequiredCourseCountTxt())).should('have.attr', 'readonly')

        //Click On Course DropDown
        cy.get(ARCourseSettingsAvailabilityModule.getValidCertPrerequisiteCourseDDown()).click()

        //Add a course with a certificate
        cy.get(ARCourseSettingsAvailabilityModule.getValidCertPrerequisiteCourseSearchTxtF()).type(courses.oc_filter_01_name)
        ARCourseSettingsAvailabilityModule.getPrerequisiteCourseOpt(courses.oc_filter_01_name)
        

        //Select Completion Type 'Required to Complete' Option
        cy.get(ARCourseSettingsAvailabilityModule.getCompletionTypeRadioBtn()).should('be.visible').and('contain','Required to complete')
        cy.get(ARCourseSettingsAvailabilityModule.getCompletionTypeRadioBtn()).contains('Required to complete').click()

        //Verify Required Course Count Field Cannot Accept Large Value
        cy.get(AROCAddEditPage.getElementByAriaLabelAttribute(ARCourseSettingsAvailabilityModule.getRequiredCourseCountTxt())).type('4')
        cy.get(ARCourseSettingsAvailabilityModule.getRequiredCourseCountErrorMsg()).should('contain', 'Field must be less than or equal to 1.')

        //Enter Valid Input in Required Course Count Field
        cy.get(AROCAddEditPage.getElementByAriaLabelAttribute(ARCourseSettingsAvailabilityModule.getRequiredCourseCountTxt())).clear().type('1')
        AROCAddEditPage.getVShortWait()

        //Publish OC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
    })

    it('Edit CourseBundle With RequiremntType Competencies', () => {
        //Edit Course Bundle
        cy.editCourse(cbDetails.courseName)

        //Open Availability Section
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Availability')).click()
        AROCAddEditPage.getShortWait()


        //Competencies Section
        //Click On RequiremntType Competencies
        cy.get(ARCourseSettingsAvailabilityModule.getRequirementTypeRadioBtn()).contains('Competencies').click()

        //Add Competency to Prerequisite
        cy.get(ARCourseSettingsAvailabilityModule.getAddCompetenciesBtn()).click()

        //Search For and Select Multiple Competency
        ARSelectModal.SearchAndSelectCompetencies([miscData.competency_01, miscData.competency_02, miscData.competency_03])
        AROCAddEditPage.getShortWait()


        //Delete competency
        ARCourseSettingsAvailabilityModule.getDeleteCompetencyByName(miscData.competency_03)
        AROCAddEditPage.getShortWait()


        //Publish OC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
    })


    after(function () {
        //Delete Course Bundle
        cy.deleteCourse(commonDetails.courseID, 'course-bundles')
    })
})

