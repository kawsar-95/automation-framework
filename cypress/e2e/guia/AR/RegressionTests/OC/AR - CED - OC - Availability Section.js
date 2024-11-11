import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARCourseSettingsAvailabilityModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsAvailability.module'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import arSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import AROCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage'
import { courses } from '../../../../../../helpers/TestData/Courses/courses'
import { ocDetails } from '../../../../../../helpers/TestData/Courses/oc'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../helpers/TestData/users/users'
import { miscData } from '../../../../../../helpers/TestData/Misc/misc'

describe('AR - Regress - CED - OC - Availability Section - Create Course T832320', function(){

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getCoursesReport()
        
    })

    it('Verify Availability Section Buttons, Fields, Toggles, Complete Courses Prerequisites, Publish OC Course', () => {
        cy.createCourse('Online Course')

        //Open Availability Section
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Availability')).click()
        AROCAddEditPage.getShortWait()

        //Select Access Date 'Date' Option
        cy.get(ARCourseSettingsAvailabilityModule.getAccessDateRadioBtn()).contains(/^Date$/).click().click()
        
        //Select a Date
        cy.get(ARCourseSettingsAvailabilityModule.getAccessDateDatePickerBtn()).click()
        ARCourseSettingsAvailabilityModule.getSelectDate(commonDetails.date1)

        //Select Expiration 'Time from enrollment' Option
        cy.get(ARCourseSettingsAvailabilityModule.getExpirationRadioBtn()).contains('Time from enrollment').click().click()
        //Add Valid Values to Year/Month/Day Fields
        cy.get(ARCourseSettingsAvailabilityModule.getExpireInYearsTxtF()).type('1')
        cy.get(ARCourseSettingsAvailabilityModule.getExpireInMonthsTxtF()).type('6')
        cy.get(ARCourseSettingsAvailabilityModule.getExpireInDaysTxtF()).type('2')

        //Select Due Date 'Date' Option
        cy.get(ARCourseSettingsAvailabilityModule.getDueDateRadioBtn()).contains(/^Date$/).click().click()
        //Select a Date
        cy.get(ARCourseSettingsAvailabilityModule.getDueDateDatePickerBtn()).click()
        ARCourseSettingsAvailabilityModule.getSelectDate(commonDetails.date2)
        //Clear Date & Verify Error Message
        cy.get(ARCourseSettingsAvailabilityModule.getDueDateDatePickerClearBtn()).click()
        cy.get(ARCourseSettingsAvailabilityModule.getDueDateDatePickerErrorMsg()).should('contain', 'Field is required.')
        //Select a Date
        cy.get(ARCourseSettingsAvailabilityModule.getDueDateDatePickerBtn()).click()
        ARCourseSettingsAvailabilityModule.getSelectDate(commonDetails.date2)

        //Assert Allow Enrollment Description When Toggle is OFF
        cy.get(ARCourseSettingsAvailabilityModule.getAllowEnrollmentToggleDescription())
            .should('contain', 'Learners will not be able to enroll in this course until all prerequisites are met.')

        //Toggle Allow Enrollment to ON and Verify Description
        cy.get(AROCAddEditPage.getElementByDataNameAttribute(ARCourseSettingsAvailabilityModule.getAllowEnrollmentToggleContainer()) + ' ' + AROCAddEditPage.getToggleDisabled()).click()
        cy.get(ARCourseSettingsAvailabilityModule.getAllowEnrollmentToggleDescription())
            .should('contain', 'Learners will be allowed to enroll in the course, but will be unable to take it until all prerequisites are met.')

        //Add Prerequisite
        cy.get(ARCourseSettingsAvailabilityModule.getAddPrerequisiteBtn()).click()

        //Add Course to Prerequisite
        cy.get(ARCourseSettingsAvailabilityModule.getPrerequisiteCourseDDown()).click()
        cy.get(ARCourseSettingsAvailabilityModule.getPrerequisiteCourseSearchTxtF()).type(courses.oc_02_admin_approval_naNAME)
        ARCourseSettingsAvailabilityModule.getPrerequisiteCourseOpt(courses.oc_02_admin_approval_naNAME)

        //Verify Prerequisite Name Field Cannot be Blank
        cy.get(ARCourseSettingsAvailabilityModule.getPrerequisiteNameTxt()).clear()
        cy.get(ARCourseSettingsAvailabilityModule.getErrorMsg()).should('contain', 'Field is required.')

        //Verify Prerequisite Name Field Does Not Allow >255 Chars
        cy.get(ARCourseSettingsAvailabilityModule.getPrerequisiteNameTxt()).clear().invoke('val', AROCAddEditPage.getLongString()).type('a')
        cy.get(ARCourseSettingsAvailabilityModule.getErrorMsg()).should('contain', 'Field cannot be more than 255 characters.')

        //Add Valid Input to Prerequisite Name Field
        cy.get(ARCourseSettingsAvailabilityModule.getPrerequisiteNameTxt()).clear().type(commonDetails.prerequisiteName)

        //Verify Courses Dropdown Cannot Be Empty
        cy.get(ARCourseSettingsAvailabilityModule.getClearAllBtn()).click()
        cy.get(ARCourseSettingsAvailabilityModule.getCoursesErrorMsg()).should('contain', 'At least one course must be selected.')

        //Select Completion Type 'Required to Complete' Option
        cy.get(ARCourseSettingsAvailabilityModule.getCompletionTypeRadioBtn()).contains('Required to complete').click().click()

        //Add Course to Prerequisite
        cy.get(ARCourseSettingsAvailabilityModule.getPrerequisiteCourseDDown()).click()
        cy.get(ARCourseSettingsAvailabilityModule.getPrerequisiteCourseSearchTxtF()).type(courses.oc_02_admin_approval_naNAME)
        ARCourseSettingsAvailabilityModule.getPrerequisiteCourseOpt(courses.oc_02_admin_approval_naNAME)
        AROCAddEditPage.getShortWait()

        //Verify Required Course Count Field Cannot Be Empty
        cy.get(AROCAddEditPage.getElementByAriaLabelAttribute(ARCourseSettingsAvailabilityModule.getRequiredCourseCountTxt())).clear()
        cy.get(ARCourseSettingsAvailabilityModule.getRequiredCourseCountErrorMsg()).should('contain', 'Field is required.')

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
})

describe('AR - Regress - CED - OC - Availability Section', function(){

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getCoursesReport()
        
        //Filter for Course & Edit it
        cy.editCourse(ocDetails.courseName)
        AROCAddEditPage.getMediumWait()
        //Open Availability Section
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Availability')).click()
        AROCAddEditPage.getShortWait()
    })

    after(function() {
        //Delete Course
        cy.deleteCourse(commonDetails.courseID)
    })

    it('Edit OC Course, Verify Fields and Prerequisite Perisisted, Change Dates, Add Competencies', () => {
        //Assert Access Date Value Persisted
        cy.get(ARCourseSettingsAvailabilityModule.getAccessDateTxtF()).should('have.value', '2018-08-01')

        //Assert Expiration Time from enrollment Fields Persisted
        cy.get(ARCourseSettingsAvailabilityModule.getExpireInYearsTxtF()).should('have.value', '1')
        cy.get(ARCourseSettingsAvailabilityModule.getExpireInMonthsTxtF()).should('have.value', '6')
        cy.get(ARCourseSettingsAvailabilityModule.getExpireInDaysTxtF()).should('have.value', '2')

        //Assert Due Date Value Persisted
        cy.get(ARCourseSettingsAvailabilityModule.getDueDateTxtF()).should('have.value', '2020-11-30')

        //Assert Allow Enrollment Toggle is ON
        cy.get(AROCAddEditPage.getElementByDataNameAttribute(ARCourseSettingsAvailabilityModule.getAllowEnrollmentToggleContainer()) + ' ' + AROCAddEditPage.getToggleStatus())
            .should('have.attr', 'aria-checked', 'true')

        //Assert Prerequisite Name Persisted
        cy.get(ARCourseSettingsAvailabilityModule.getPrerequisiteNameTxt()).should('have.value', commonDetails.prerequisiteName)

        //Assert Correct Prerequisite Course is Selected
        cy.get(ARCourseSettingsAvailabilityModule.getPrerequisiteCourseDDown()).should('contain.text', courses.oc_02_admin_approval_naNAME)

        //Edit Access Date
        cy.get(ARCourseSettingsAvailabilityModule.getAccessDateDatePickerBtn()).click()
        ARCourseSettingsAvailabilityModule.getSelectDate(commonDetails.date3)

        //Select Expiration 'Date' Option
        cy.get(ARCourseSettingsAvailabilityModule.getExpirationRadioBtn()).contains('Date').click().click()
        //Select a Date 
        cy.get(ARCourseSettingsAvailabilityModule.getDateExpiresDatePickerBtn()).click()
        ARCourseSettingsAvailabilityModule.getSelectDate(commonDetails.date2)
        //Clear Date & Verify Error Message
        cy.get(ARCourseSettingsAvailabilityModule.getDateExpiresPickerClearBtn()).click()
        cy.get(ARCourseSettingsAvailabilityModule.getDateExpiresPickerErrorMsg()).should('contain', 'Field is required.')
        //Select a Date
        cy.get(ARCourseSettingsAvailabilityModule.getDateExpiresDatePickerBtn()).click()
        ARCourseSettingsAvailabilityModule.getSelectDate(commonDetails.date2)

        //Edit the Due Date - Select Time from enrollment option
        cy.get(ARCourseSettingsAvailabilityModule.getDueDateRadioBtn()).contains('Time from enrollment').click().click()
        cy.get(ARCourseSettingsAvailabilityModule.getDueInYearsTxtF()).type('1')
        cy.get(ARCourseSettingsAvailabilityModule.getDueInMonthsTxtF()).type('6')
        cy.get(ARCourseSettingsAvailabilityModule.getDueInDaysTxtF()).type('2')

        //Add Competency to Prerequisite
        cy.get(ARCourseSettingsAvailabilityModule.getRequirementTypeRadioBtn()).contains('Competencies').click().click()
        cy.get(ARCourseSettingsAvailabilityModule.getAddCompetenciesBtn()).click()
        //Search For and Select Competency
        arSelectModal.SearchAndSelectFunction([miscData.competency_01])
        AROCAddEditPage.getShortWait()

        //Publish OC
        cy.publishCourse()
    })

    it('Edit OC Course, Verify Edits and Competency', () => {
        //Assert Access Date Edit Persisted
        cy.get(ARCourseSettingsAvailabilityModule.getAccessDateTxtF()).should('have.value', '2018-08-10')
        
        //Assert Expiration Date
        cy.get(ARCourseSettingsAvailabilityModule.getDateExpiresTxtF()).should('have.value', '2020-11-30')
        
        //Assert Due Date Time From Enrollment Fields
        cy.get(ARCourseSettingsAvailabilityModule.getDueInYearsTxtF()).should('have.value', '1')
        cy.get(ARCourseSettingsAvailabilityModule.getDueInMonthsTxtF()).should('have.value', '6')
        cy.get(ARCourseSettingsAvailabilityModule.getDueInDaysTxtF()).should('have.value', '2')

        //Assert Competency
        cy.get(AROCAddEditPage.getElementByDataNameAttribute(ARCourseSettingsAvailabilityModule.getCompetencyName()))
            .should('contain.text', miscData.competency_01)
    })
})