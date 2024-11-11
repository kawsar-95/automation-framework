import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARCourseSettingsAvailabilityModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsAvailability.module'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import ARCURRAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/CURR/ARCURRAddEditPage'
import ARSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import AROCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage'
import { currDetails } from '../../../../../../helpers/TestData/Courses/curr'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { miscData } from '../../../../../../helpers/TestData/Misc/misc'
import { users } from '../../../../../../helpers/TestData/users/users'
import { courses } from '../../../../../../helpers/TestData/Courses/courses'
import ARDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'

describe('AR - CED - Curriculum - Availability Section - Create Course', function(){

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getCoursesReport()
        
    })

    it('Create Curriculum, Verify Availability Section Buttons, Fields, Toggles, Courses Prerequisites, & Publish Course', () => {
        //Create curriculum
        cy.createCourse('Curriculum')
        ARSelectModal.SearchAndSelectFunction([courses.oc_filter_01_name])
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Availability'),{timeout: 15000}).should('be.visible')

        //Open Availability section
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Availability')).click()
        cy.get(ARCourseSettingsAvailabilityModule.getAvailabilitySectionTitle(),{timeout: 15000}).scrollIntoView().should('be.visible').and('contain','Availability') //Wait for toggles to become enabled

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
        cy.get(ARCourseSettingsAvailabilityModule.getDueDateDatePickerErrorMsg()).should('contain', miscData.field_required_error)
        //Select a Date
        cy.get(ARCourseSettingsAvailabilityModule.getDueDateDatePickerBtn()).click()
        ARCourseSettingsAvailabilityModule.getSelectDate(commonDetails.date2)

        /* //mobile app needs to be enabled to test this
        //Toggle Allow Course Content Download to ON and Verify Description
        cy.get(ARCURRAddEditPage.getElementByDataNameAttribute(ARCourseSettingsAvailabilityModule.getAllowContentDownloadToggleContainer()) + ' ' + ARCURRAddEditPage.getToggleDisabled()).click()
        cy.get(ARCourseSettingsAvailabilityModule.getAllowContentDownloadToggleDescription()).should('contain', 'Allows users to download and complete this course while offline.')
        */

        //Add Prerequisite
        cy.get(ARCourseSettingsAvailabilityModule.getAddPrerequisiteBtn()).click()

        //Add Course to Prerequisite
        cy.get(ARCourseSettingsAvailabilityModule.getPrerequisiteCourseDDown()).click()
        cy.get(ARCourseSettingsAvailabilityModule.getPrerequisiteCourseSearchTxtF()).type(courses.ilc_filter_01_name)
        ARCourseSettingsAvailabilityModule.getPrerequisiteCourseOpt(courses.ilc_filter_01_name)

        //Verify Prerequisite Name Field Cannot be Blank
        cy.get(ARCourseSettingsAvailabilityModule.getPrerequisiteNameTxt()).clear()
        cy.get(ARCourseSettingsAvailabilityModule.getErrorMsg()).should('contain', miscData.field_required_error)

        //Verify Prerequisite Name Field Does Not Allow >255 Chars
        cy.get(ARCourseSettingsAvailabilityModule.getPrerequisiteNameTxt()).clear().invoke('val', ARCURRAddEditPage.getLongString()).type('a')
        cy.get(ARCourseSettingsAvailabilityModule.getErrorMsg()).should('contain', miscData.char_255_error)

        //Add Valid Input to Prerequisite Name Field
        cy.get(ARCourseSettingsAvailabilityModule.getPrerequisiteNameTxt()).clear().type(commonDetails.prerequisiteName)

        //Verify Courses Dropdown Cannot Be Empty
        cy.get(ARCourseSettingsAvailabilityModule.getPerequisiteCourseContainer(),{timeout: 15000}).should('be.visible')
        cy.get(ARCourseSettingsAvailabilityModule.getPerequisiteCourseContainer()).within(()=>{
            cy.get(ARCourseSettingsAvailabilityModule.getClearAllBtn()).click()
            cy.get(ARCourseSettingsAvailabilityModule.getErrorMsg()).should('contain', 'At least one course must be selected.')
        })
        

        //Select Completion Type 'Required to Complete' Option
        cy.get(ARCourseSettingsAvailabilityModule.getCompletionTypeRadioBtn()).contains('Required to complete').click().click()

        //Add multiple Courses to Prerequisite
        cy.get(ARCourseSettingsAvailabilityModule.getPrerequisiteCourseDDown()).click()
        cy.get(ARCourseSettingsAvailabilityModule.getPrerequisiteCourseSearchTxtF()).type(courses.ilc_filter_01_name)
        ARCourseSettingsAvailabilityModule.getPrerequisiteCourseOpt(courses.ilc_filter_01_name)
        cy.get(ARCourseSettingsAvailabilityModule.getPrerequisiteNameTxt()).click()
        cy.get(ARCourseSettingsAvailabilityModule.getPrerequisiteCourseDDown()).click()
        cy.get(ARCourseSettingsAvailabilityModule.getPrerequisiteCourseSearchTxtF()).type(courses.curr_filter_01_name)
        ARCourseSettingsAvailabilityModule.getPrerequisiteCourseOpt(courses.curr_filter_01_name)
        cy.get(ARCURRAddEditPage.getElementByAriaLabelAttribute(ARCourseSettingsAvailabilityModule.getRequiredCourseCountTxt()),{timeout: 50000}).should('be.visible')

        //Verify Required Course Count Field Cannot Be Empty
        cy.get(ARCURRAddEditPage.getElementByAriaLabelAttribute(ARCourseSettingsAvailabilityModule.getRequiredCourseCountTxt())).clear()
        cy.get(ARCourseSettingsAvailabilityModule.getErrorMsg()).should('contain', miscData.field_required_error)

        //Verify Required Course Count Field Cannot Accept Large Value
        cy.get(ARCURRAddEditPage.getElementByAriaLabelAttribute(ARCourseSettingsAvailabilityModule.getRequiredCourseCountTxt())).type('4')
        cy.get(ARCourseSettingsAvailabilityModule.getErrorMsg()).should('contain', 'Field must be less than or equal to 2.')

        //Enter Valid Input in Required Course Count Field
        cy.get(ARCURRAddEditPage.getElementByAriaLabelAttribute(ARCourseSettingsAvailabilityModule.getRequiredCourseCountTxt())).clear().type('1')
        cy.get(ARCURRAddEditPage.getElementByAriaLabelAttribute(ARCourseSettingsAvailabilityModule.getRequiredCourseCountTxt()),{timeout: 50000}).should('be.visible').and('have.value',`1`)

        //Publish Curriculum
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
        cy.get(ARCourseSettingsAvailabilityModule.getToastSuccessMsg(), {timeout: 15000}).should('be.visible')
    })
})

describe('AR - CED - Curriculum - Availability Section', function(){

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getCoursesReport()
        
        //Edit curriculum
        cy.editCourse(currDetails.courseName)
        //Open Availability Section
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Availability')).click()
        cy.get(ARCourseSettingsAvailabilityModule.getAvailabilitySectionTitle(),{timeout: 15000}).scrollIntoView().should('be.visible').and('contain','Availability') //Wait for toggles to become enabled
    })

    after(function() {
        //Delete Course
        cy.deleteCourse(commonDetails.courseID, 'curricula')
    })

    it('Edit Curriculum, Verify Fields and Prerequisite Perisisted, Change Dates, Add Competencies, & Publish Course', () => {
        //Assert Access Date Value Persisted
        cy.get(ARCourseSettingsAvailabilityModule.getAccessDateTxtF()).should('have.value', commonDetails.date1)

        //Assert Expiration Time from enrollment Fields Persisted
        cy.get(ARCourseSettingsAvailabilityModule.getExpireInYearsTxtF()).should('have.value', '1')
        cy.get(ARCourseSettingsAvailabilityModule.getExpireInMonthsTxtF()).should('have.value', '6')
        cy.get(ARCourseSettingsAvailabilityModule.getExpireInDaysTxtF()).should('have.value', '2')

        //Assert Due Date Value Persisted
        cy.get(ARCourseSettingsAvailabilityModule.getDueDateTxtF()).should('have.value', commonDetails.date2)

        /* //mobile app needs to be enabled to test this
        //Assert Allow Course Content Download Toggle is ON
        cy.get(ARCURRAddEditPage.getElementByDataNameAttribute(ARCourseSettingsAvailabilityModule.getAllowContentDownloadToggleContainer()) + ' ' + ARCURRAddEditPage.getToggleStatus())
            .should('have.attr', 'aria-checked', 'true')
        */

        //Assert Prerequisite Name Persisted
        cy.get(ARCourseSettingsAvailabilityModule.getPrerequisiteNameTxt()).should('have.value', commonDetails.prerequisiteName)

        //Assert Correct Prerequisite Courses are Selected
        cy.get(ARCourseSettingsAvailabilityModule.getPrerequisiteCourseDDown())
            .should('contain.text', courses.ilc_filter_01_name).and('contain.text', courses.curr_filter_01_name)

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
        cy.get(ARCourseSettingsAvailabilityModule.getErrorMsg()).should('contain', miscData.field_required_error)
        //Select a Date
        cy.get(ARCourseSettingsAvailabilityModule.getDateExpiresDatePickerBtn()).click()
        ARCourseSettingsAvailabilityModule.getSelectDate(commonDetails.date2)

        //Edit the Due Date - Select Time from enrollment option
        cy.get(ARCourseSettingsAvailabilityModule.getDueDateRadioBtn()).contains('Time from enrollment').click().click()
        cy.get(ARCourseSettingsAvailabilityModule.getDueInYearsTxtF()).type('1')
        cy.get(ARCourseSettingsAvailabilityModule.getDueInMonthsTxtF()).type('6')
        cy.get(ARCourseSettingsAvailabilityModule.getDueInDaysTxtF()).type('2')

        //Add Competency to Prerequisite
        cy.get(ARCourseSettingsAvailabilityModule.getRequirementTypeRadioBtn()).contains('Competencies').click()
        cy.get(ARCourseSettingsAvailabilityModule.getAddCompetenciesBtn()).click()
        //Search For and Select Competency
        ARSelectModal.SearchAndSelectCompetencies([miscData.competency_01])
        ARCURRAddEditPage.getShortWait()

        //Publish Curriculum
        cy.publishCourse()
        cy.get(ARCourseSettingsAvailabilityModule.getToastSuccessMsg(), {timeout: 15000}).should('be.visible')
    })

    it('Edit Curriculum, Verify Changes and Competency Persisted, Delete Competency, Set Prerequisite to Valid Certificate', () => {
        //Assert Access Date Edit Persisted
        cy.get(ARCourseSettingsAvailabilityModule.getAccessDateTxtF()).should('have.value', commonDetails.date3)
        
        //Assert Expiration Date
        cy.get(ARCourseSettingsAvailabilityModule.getDateExpiresTxtF()).should('have.value', commonDetails.date2)
        
        //Assert Due Date Time From Enrollment Fields
        cy.get(ARCourseSettingsAvailabilityModule.getDueInYearsTxtF()).should('have.value', '1')
        cy.get(ARCourseSettingsAvailabilityModule.getDueInMonthsTxtF()).should('have.value', '6')
        cy.get(ARCourseSettingsAvailabilityModule.getDueInDaysTxtF()).should('have.value', '2')

        //Verify Competency persisted
        cy.get(ARCURRAddEditPage.getElementByDataNameAttribute(ARCourseSettingsAvailabilityModule.getCompetencyName()))
            .should('contain', miscData.competency_01)
        
        //Delete competency
        ARCourseSettingsAvailabilityModule.getDeleteCompetencyByName(miscData.competency_01)

        //Set prereq to Valid Certificate and add course
        cy.get(ARCourseSettingsAvailabilityModule.getRequirementTypeRadioBtn()).contains('Valid Certificates').click()
        cy.get(ARCourseSettingsAvailabilityModule.getValidCertPrerequisiteCourseDDown()).click()
        //Verify courses without a certificate are not displayed in the dropdown
        cy.get(ARCourseSettingsAvailabilityModule.getValidCertPrerequisiteCourseSearchTxtF()).type(courses.ilc_filter_01_name)
        cy.get(ARCourseSettingsAvailabilityModule.getDDownNoResults()).should('contain', 'No matches found')
        //Add a course with a certificate
        cy.get(ARCourseSettingsAvailabilityModule.getValidCertPrerequisiteCourseSearchTxtF()).clear().type(courses.oc_filter_01_name)
        ARCourseSettingsAvailabilityModule.getPrerequisiteCourseOpt(courses.oc_filter_01_name)
        arDashboardPage.getShortWait()
        //Publish Curriculum
        cy.publishCourse()
        cy.get(ARCourseSettingsAvailabilityModule.getToastSuccessMsg(), {timeout: 15000}).should('be.visible')
    })
})