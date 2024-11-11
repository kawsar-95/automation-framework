import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARCourseSettingsAvailabilityModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsAvailability.module'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import ARILCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage'
import { ilcDetails } from '../../../../../../helpers/TestData/Courses/ilc'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { courses } from '../../../../../../helpers/TestData/Courses/courses'
import { miscData } from '../../../../../../helpers/TestData/Misc/misc'
import { users } from '../../../../../../helpers/TestData/users/users'
import ARCURRAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/CURR/ARCURRAddEditPage'
import ARSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'

describe('T832335 AR - Regress - CED - ILC - Availability Section - Create Course', function(){

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getCoursesReport()
        
    })

    it('Verify Availability Section Toggles, Complete Courses Prerequisites, Publish ILC Course', () => {
        //Create course
        cy.createCourse('Instructor Led')

        //Open Availability Section
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Availability')).click()
        ARILCAddEditPage.getShortWait()

        //Toggle Allow Enrollment to ON
        cy.get(ARILCAddEditPage.getElementByDataNameAttribute(ARCourseSettingsAvailabilityModule.getAllowEnrollmentToggleContainer()) + ' ' + ARILCAddEditPage.getToggleDisabled()).click()

        //Add Prerequisite
        cy.get(ARCourseSettingsAvailabilityModule.getAddPrerequisiteBtn()).click()

        //Add Course to Prerequisite
        cy.get(ARCourseSettingsAvailabilityModule.getPrerequisiteCourseDDown()).click()
        cy.get(ARCourseSettingsAvailabilityModule.getPrerequisiteCourseSearchTxtF()).type(courses.ilc_filter_01_name)
        ARCourseSettingsAvailabilityModule.getPrerequisiteCourseOpt(courses.ilc_filter_01_name)

        //Verify Prerequisite Name Field Cannot be Blank
        cy.get(ARCourseSettingsAvailabilityModule.getPrerequisiteNameTxt()).clear()
        cy.get(ARCourseSettingsAvailabilityModule.getErrorMsg()).should('contain', 'Field is required.')

        //Verify Prerequisite Name Field Does Not Accept HTML
        cy.get(ARCourseSettingsAvailabilityModule.getPrerequisiteNameTxt()).type(commonDetails.textWithHtmlTag)
        ARILCAddEditPage.getVShortWait()
        cy.get(ARILCAddEditPage.getPublishBtn()).click()
        ARILCAddEditPage.getLShortWait()

        cy.get(ARCourseSettingsAvailabilityModule.getAvailabilitySectionErrorMsg()).should('contain', 'Field contains invalid characters.')

        //Verify Prerequisite Name Field Does Not Allow >255 Chars
        cy.get(ARCourseSettingsAvailabilityModule.getPrerequisiteNameTxt()).clear().invoke('val', ARILCAddEditPage.getLongString()).type('a')
        cy.get(ARCourseSettingsAvailabilityModule.getErrorMsg()).should('contain', 'Field cannot be more than 255 characters.')

        //Verify Prerequisite Name Field Can Start With Numbers
        cy.get(ARCourseSettingsAvailabilityModule.getPrerequisiteNameTxt()).clear().type('123Test')
        cy.get(ARCourseSettingsAvailabilityModule.getErrorMsg()).should('not.be.visible')

        //Add Valid Input to Prerequisite Name Field
        cy.get(ARCourseSettingsAvailabilityModule.getPrerequisiteNameTxt()).clear().type(commonDetails.prerequisiteName)

        //Verify Required Course Count Field Cannot Be Empty
        cy.get(ARCourseSettingsAvailabilityModule.getCompletionTypeRadioBtn()).contains('Required to complete').click().click()
        cy.get(ARILCAddEditPage.getElementByAriaLabelAttribute(ARCourseSettingsAvailabilityModule.getRequiredCourseCountTxt())).clear()
        cy.get(ARCourseSettingsAvailabilityModule.getRequiredCourseCountErrorMsg()).should('contain', 'Field is required.')

        //Enter Valid Input in Required Course Count Field
        cy.get(ARILCAddEditPage.getElementByAriaLabelAttribute(ARCourseSettingsAvailabilityModule.getRequiredCourseCountTxt())).type('1')

        //Verify Courses Dropdown Cannot Be Empty
        cy.get(ARCourseSettingsAvailabilityModule.getClearAllBtn()).click()
        cy.get(ARCourseSettingsAvailabilityModule.getCoursesErrorMsg()).should('contain', 'At least one course must be selected.')

        //Add Course to Prerequisite
        cy.get(ARCourseSettingsAvailabilityModule.getPrerequisiteCourseDDown()).click()
        cy.get(ARCourseSettingsAvailabilityModule.getPrerequisiteCourseSearchTxtF()).type(courses.ilc_filter_01_name)
        ARCourseSettingsAvailabilityModule.getPrerequisiteCourseOpt(courses.ilc_filter_01_name)
        ARILCAddEditPage.getShortWait()

        //Publish ILC 
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
    })
})

describe('AR - Regress - CED - ILC - Availability Section', function(){

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses, filter for and edit course
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getCoursesReport()
        
        //Filter for Course & Edit it
        cy.editCourse(ilcDetails.courseName)
        ARILCAddEditPage.getMediumWait()
        //Open Availability Section
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Availability')).click()
        ARILCAddEditPage.getShortWait()
    })

    after(function() {
        //Delete Course
        cy.deleteCourse(commonDetails.courseID, 'instructor-led-courses-new')
    })

    it('Edit ILC Course, Verify Valid Certificates Prerequisites', () => {
        //Assert Prerequisite Name Persisted
        cy.get(ARCourseSettingsAvailabilityModule.getPrerequisiteNameTxt()).should('have.value', commonDetails.prerequisiteName)

        //Assert Valid Certificates
        cy.get(ARCourseSettingsAvailabilityModule.getRequirementTypeRadioBtn()).contains('Valid Certificates').click().click()

        //Verify Required Course Count Field Under Valid Certificates Cannot be >0 Initially
        cy.get(ARILCAddEditPage.getElementByAriaLabelAttribute(ARCourseSettingsAvailabilityModule.getRequiredCourseCountTxt())).clear().type('1')
        cy.get(ARCourseSettingsAvailabilityModule.getRequiredCourseCountErrorMsg()).should('contain', 'Field must be less than or equal to 0.')
        cy.get(ARILCAddEditPage.getElementByAriaLabelAttribute(ARCourseSettingsAvailabilityModule.getRequiredCourseCountTxt())).clear().type('0')

        //Verify Required Course Count Field Does Not Accept Letters
        cy.get(ARILCAddEditPage.getElementByAriaLabelAttribute(ARCourseSettingsAvailabilityModule.getRequiredCourseCountTxt())).type('a').blur()
        cy.get(ARILCAddEditPage.getElementByAriaLabelAttribute(ARCourseSettingsAvailabilityModule.getRequiredCourseCountTxt())).should('have.value', '0') //Field should reset to previous numeric value
    })

    it('Edit ILC Course, Verify Competencies Prerequisites, Delete Prerequisite', () => {
        //Assert Competencies
        cy.get(ARCourseSettingsAvailabilityModule.getRequirementTypeRadioBtn()).contains('Competencies').click().click()

        //Add Competencies
        cy.get(ARCourseSettingsAvailabilityModule.getAddCompetenciesBtn()).click()

        //Search For and Select Competency
        // ARSelectModal.SearchAndSelectFunction([miscData.competency_01])

        // Select competency
        cy.get(ARSelectModal.getSearchTxtF()).clear().type(miscData.competency_01)        
        arDashboardPage.getMediumWait()

        cy.get(ARCURRAddEditPage.getCompetencySelectList()).contains(miscData.competency_01).click()
        // Click on choose btn
        cy.get(ARCURRAddEditPage.getFooterChoosebtn()).click()
        arDashboardPage.getShortWait()

        //Delete Competency
        ARCourseSettingsAvailabilityModule.getDeleteCompetencyByName(miscData.competency_01)

        //Delete Prerequisite
        ARCourseSettingsAvailabilityModule.getDeletePrerequisiteByName(commonDetails.prerequisiteName)
        ARILCAddEditPage.getShortWait()

        //Publish ILC 
        cy.publishCourse()
    })

    it('Edit ILC Course, Verify Prerequisite Has Been Deleted', () => {
        //Assert Prerequisite Has Been Deleted
        ARCourseSettingsAvailabilityModule.getNoPrerequisiteDescription()
    })
})