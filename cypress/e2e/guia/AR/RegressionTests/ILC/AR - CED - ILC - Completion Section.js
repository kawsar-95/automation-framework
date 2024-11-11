import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARCourseSettingsCompletionModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCompletion.module'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import ARILCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage'
import ARUploadFileModal from '../../../../../../helpers/AR/pageObjects/Modals/ARUploadFileModal'
import { ilcDetails } from '../../../../../../helpers/TestData/Courses/ilc'
import { commonDetails, credit, completion } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { courses } from '../../../../../../helpers/TestData/Courses/courses'
import { miscData } from '../../../../../../helpers/TestData/Misc/misc'
import { users } from '../../../../../../helpers/TestData/users/users'
import ARDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'

describe('AR - CED - ILC - Completion Section - Create Course', function(){
    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getCoursesReport()
        
    })

    after(function() {
        cy.deleteCourse(commonDetails.courseID, 'instructor-led-courses-new')
    })

    it('Verify Completion Section Fields, Publish ILC Course', () => {
        cy.createCourse('Instructor Led', ilcDetails.courseName, false)

        //Open Completion Section
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Completion')).click()
        ARILCAddEditPage.getMediumWait() //Wait for toggles to become enabled

        //Toggle Certificate to ON
        cy.get(ARILCAddEditPage.getElementByDataNameAttribute(ARCourseSettingsCompletionModule.getCertificateToggleContainer()) + ' ' + ARILCAddEditPage.getToggleDisabled()).click()

        //Select a Certificate File
        cy.get(ARCourseSettingsCompletionModule.getCertificateChooseFileBtn()).click()
        arDashboardPage.getShortWait()

        //Select upload from the media library
        cy.get(ARUploadFileModal.getMediaLibraryUploadBtn()).click()

        cy.get(ARUploadFileModal.getFilePathTxt()).attachFile(commonDetails.filePath + commonDetails.mooseFileName)
        cy.get(ARUploadFileModal.getChooseFileBtn()).click
        ARUploadFileModal.getVShortWait()
        cy.get(ARUploadFileModal.getSaveBtn()).click()
        ARUploadFileModal.getLShortWait()

        //Toggle Use Custom Title to ON
        cy.get(ARILCAddEditPage.getElementByDataNameAttribute(ARCourseSettingsCompletionModule.getCustomTitleToggleContainer()) + ' ' + ARILCAddEditPage.getToggleDisabled()).click()

        //Verify Custom Title Field Does Not Accept >255 Chars
        cy.get(ARCourseSettingsCompletionModule.getCustomTitleTxtF()).invoke('val', ARILCAddEditPage.getLongString()).type('a')
        cy.get(ARCourseSettingsCompletionModule.getCustomTitleErrorMsg()).should('contain', 'Field cannot be more than 255 characters.')

        //Verify Custom Title Field Does Not Accept HTML
        cy.get(ARCourseSettingsCompletionModule.getCustomTitleTxtF()).clear().type(commonDetails.textWithHtmlTag)
        ARUploadFileModal.getVShortWait()
        cy.get(ARILCAddEditPage.getPublishBtn()).click()
        ARUploadFileModal.getLShortWait()
        cy.get(ARCourseSettingsCompletionModule.getCompletionSectionErrorMsg()).should('contain', 'Field contains invalid characters.')

        //Enter Valid Value Into Custom Title Field
        cy.get(ARCourseSettingsCompletionModule.getCustomTitleTxtF()).clear().type(commonDetails.customTitle)

        //Verify Custom Notes Field Does Not Accept HTML
        cy.get(ARCourseSettingsCompletionModule.getCustomNotesTxtF()).type(commonDetails.textWithHtmlTag)
        ARUploadFileModal.getVShortWait()
        cy.get(ARILCAddEditPage.getPublishBtn()).click()
        ARUploadFileModal.getLShortWait()
        cy.get(ARCourseSettingsCompletionModule.getCompletionSectionErrorMsg()).should('contain', 'Field contains invalid characters.')

        //Enter Valid Value Into Custom Notes Field
        cy.get(ARCourseSettingsCompletionModule.getCustomNotesTxtF()).clear().type(commonDetails.customNotes)

        //Select the Time from Completion For Course Expiry Option
        cy.get(ARCourseSettingsCompletionModule.getExpiryRadioBtn()).contains('Time from completion').click().click()

        //Specify Time From Completion Expire In Time
        cy.get(ARCourseSettingsCompletionModule.getExpireYearsTxtF()).clear().type(completion.expireYear)
        cy.get(ARCourseSettingsCompletionModule.getExpireMonthsTxtF()).clear().type(completion.expireMonth)
        cy.get(ARCourseSettingsCompletionModule.getExpireDaysTxtF()).clear().type(completion.expireDay)

        //Toggle Allow Re-enrollment to ON
        cy.get(ARILCAddEditPage.getElementByDataNameAttribute(ARCourseSettingsCompletionModule.getAllowReEnrollmentToggleContainer()) + ' ' + ARILCAddEditPage.getToggleDisabled()).click()

        //Asset Years/Months/Days Fields Under Allow Re-Enrollment Do Not Allow Negative Values
        cy.get(ARCourseSettingsCompletionModule.getDurationYearsTxtF()).clear().type(completion.negativeValue)
        cy.get(ARCourseSettingsCompletionModule.getDurationYearsErrorMsg()).should('contain', 'Field must be greater than or equal to 0.')

        cy.get(ARCourseSettingsCompletionModule.getDurationMonthsTxtF()).clear().type(completion.negativeValue)
        cy.get(ARCourseSettingsCompletionModule.getDurationMonthsErrorMsg()).should('contain', 'Field must be greater than or equal to 0.')

        cy.get(ARCourseSettingsCompletionModule.getDurationDaysTxtF()).clear().type(completion.negativeValue)
        cy.get(ARCourseSettingsCompletionModule.getDurationDaysErrorMsg()).should('contain', 'Field must be greater than or equal to 0.')

        //Enter Valid Values Into Years/Months/Days Fields Under Allow Re-Enrollment
        cy.get(ARCourseSettingsCompletionModule.getDurationYearsTxtF()).clear().type(completion.durationYear)
        cy.get(ARCourseSettingsCompletionModule.getDurationMonthsTxtF()).clear().type(completion.durationMonth)
        cy.get(ARCourseSettingsCompletionModule.getDurationDaysTxtF()).clear().type(completion.durationDay)

        //Choose Competency For Completion
        cy.get(ARCourseSettingsCompletionModule.getAddCompetencyBtn()).click()
        ARCourseSettingsCompletionModule.getCompetencyDDownThenClick()
        ARCourseSettingsCompletionModule.getCompetencySearchTxtF(miscData.competency_01)
        ARCourseSettingsCompletionModule.getCompetencyOpt(miscData.competency_01)
        //Select a Competency level
        ARCourseSettingsCompletionModule.getCompetencyLevelDDownThenClick()
        ARCourseSettingsCompletionModule.getCompetencyLevelOpt('1')
         
        //Add Multi Credits
        for (let i = 0; i < credit.credits.length-1; i++) {
            cy.get(ARCourseSettingsCompletionModule.getAddCreditBtn()).click()
        
            if (credit.credits[i] === 'General') { //Add General Credit with Rule
                cy.get(ARCourseSettingsCompletionModule.getCreditTypeDDown()).click()
                cy.get(ARCourseSettingsCompletionModule.getAllCreditTypeOptions()).contains(credit.credits[i]).click({force:true})

                cy.get(ARCourseSettingsCompletionModule.getAddVariableCreditRuleBtn()).click()
                cy.get(ARCourseSettingsCompletionModule.getVariableCreditFieldDDown()).eq(0).click()
                cy.get(ARCourseSettingsCompletionModule.getVariableCreditFieldOpt()).contains('First Name').click()
                cy.get(ARCourseSettingsCompletionModule.getVariableCreditTxtF()).type(commonDetails.variableCreditRuleName)
                cy.get(ARILCAddEditPage.getElementByAriaLabelAttribute(ARCourseSettingsCompletionModule.getVariableCreditAmountTxt()))
                    .eq(i).clear().type(credit.creditAmounts[i])
            } else { //Add Multi Credit
                cy.get(ARCourseSettingsCompletionModule.getCreditContainer()).eq(i).within(() => {
                    cy.get(ARCourseSettingsCompletionModule.getCreditTypeDDown()).click()
                    cy.get(ARCourseSettingsCompletionModule.getAllCreditTypeOptions()).contains(credit.credits[i]).click({force:true})
                    //Verify Credit Value can only be Numeric
                    cy.get(ARILCAddEditPage.getElementByAriaLabelAttribute(ARCourseSettingsCompletionModule.getVariableCreditAmountTxt()))
                        .type('abc').blur() //Field Should reset to default value
                    cy.get(ARILCAddEditPage.getElementByAriaLabelAttribute(ARCourseSettingsCompletionModule.getVariableCreditAmountTxt()))
                        .should('have.value', '0').clear()
                    //Assert that Credits Field for Variable Credit Rules is Required
                    cy.get(ARCourseSettingsCompletionModule.getCreditAmountErrorMsg()).should('contain', 'Field is required.')
                    cy.get(ARILCAddEditPage.getElementByAriaLabelAttribute(ARCourseSettingsCompletionModule.getVariableCreditAmountTxt()))
                        .type(credit.creditAmounts[i]) //Enter Valid Value
                })
            }
        }
       
        //Toggle Allow Failure to ON
        ARILCAddEditPage.generalToggleSwitch('true',ARCourseSettingsCompletionModule.getAllowFailureToggleContainer())
        //cy.get(ARILCAddEditPage.getElementByDataNameAttribute(ARCourseSettingsCompletionModule.getAllowFailureToggleContainer()) + ' ' + ARILCAddEditPage.getToggleDisabled()).click()

        //Toggle Re-enrollment On Failure to ON
        cy.get(ARILCAddEditPage.getElementByDataNameAttribute(ARCourseSettingsCompletionModule.getAllowReEnrollmentOnFailureToggleContainer()) + ' ' + ARILCAddEditPage.getToggleDisabled()).click()
        
        //Specify Re-enrollment After Failure Time
        cy.get(ARCourseSettingsCompletionModule.getAllowReEnrollmentYearsTxtF()).clear().type(completion.enrollmentYear)
        cy.get(ARCourseSettingsCompletionModule.getAllowReEnrollmentMonthsTxtF()).clear().type(completion.enrollmentMonth)
        cy.get(ARCourseSettingsCompletionModule.getAllowReEnrollmentDaysTxtF()).clear().type(completion.enrollmentDay)

        //Add Post Enrollment
        cy.get(ARCourseSettingsCompletionModule.getAddPostEnrollmentBtn()).click()
        ARCourseSettingsCompletionModule.getPostEnrollmentWhenDDownByOpt('Completed')
        ARCourseSettingsCompletionModule.getPostEnrollmentCoursesDDownByOpt(courses.oc_filter_01_name)
        ARILCAddEditPage.getShortWait()

        //Publish ILC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
    })

    it('Edit ILC Course & Verify Completion Section Fields Have Been Persisted', () => {
        // Filter for Course & Edit it
        cy.editCourse(ilcDetails.courseName)
        ARILCAddEditPage.getMediumWait()

        //Open Completion Section
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Completion')).click()
        ARILCAddEditPage.getMediumWait() //Wait for toggles to become enabled

        //Assert Certificate Toggle is Turned ON
        cy.get(ARILCAddEditPage.getElementByDataNameAttribute(ARCourseSettingsCompletionModule.getCertificateToggleContainer()) + ' ' + ARILCAddEditPage.getToggleStatus())
            .should('have.attr', 'aria-checked', 'true')

        //Assert Certificate Filed Was Saved
        cy.get(ARCourseSettingsCompletionModule.getCertificateFileF()).should('have.value', 'moose.jpg')

        //Change Certificate Source to Url
        cy.get(ARCourseSettingsCompletionModule.getCertificateSourceRadioBtn()).contains('Url').click().click()

        //Verify Certificate Url Source Field Does Not Accept >255 Chars
        cy.get(ARCourseSettingsCompletionModule.getCertificateFileUrlTxtF()).invoke('val', ARILCAddEditPage.getLongString()).type('a')
        cy.get(ARCourseSettingsCompletionModule.getCertificateFileErrorMsg()).should('contain', 'Field cannot be more than 255 characters.')

        //Verify Certificate Url Source Field Does Not Accept HTML
        cy.get(ARCourseSettingsCompletionModule.getCertificateFileUrlTxtF()).clear().type(commonDetails.textWithHtmlTag)
        ARUploadFileModal.getVShortWait()
        cy.get(ARILCAddEditPage.getPublishBtn()).click()
        ARUploadFileModal.getLShortWait()
        cy.get(ARCourseSettingsCompletionModule.getCompletionSectionErrorMsg()).should('contain', 'Field contains invalid characters.')

        //Enter a Valid Url
        cy.get(ARCourseSettingsCompletionModule.getCertificateFileUrlTxtF()).clear().type(miscData.switching_to_absorb_img_url)

        //Assert Time from Completion was selected for Course Expiry Option and Field Values Persisted
        cy.get(ARCourseSettingsCompletionModule.getExpireYearsTxtF()).should('have.value', completion.expireYear)
        cy.get(ARCourseSettingsCompletionModule.getExpireMonthsTxtF()).should('have.value', completion.expireMonth)
        cy.get(ARCourseSettingsCompletionModule.getExpireDaysTxtF()).should('have.value', completion.expireDay)

        //Set Certificate Date Expiry Radio button
        cy.get(ARCourseSettingsCompletionModule.getExpiryRadioBtn()).contains('Date').click().click()

        //Set Valid Certificate Expiry Date and Time
        cy.get(ARCourseSettingsCompletionModule.getExpiryDatePickerBtn()).click()
        ARILCAddEditPage.getSelectDate(commonDetails.date)

        //Assert the Years/Months/Days Values Under Time After Completion Persisted
        cy.get(ARCourseSettingsCompletionModule.getDurationYearsTxtF()).should('have.value', completion.durationYear)
        cy.get(ARCourseSettingsCompletionModule.getDurationMonthsTxtF()).should('have.value', completion.durationMonth)
        cy.get(ARCourseSettingsCompletionModule.getDurationDaysTxtF()).should('have.value', completion.durationDay)

        //Assert Competency Option Persisted
        ARCourseSettingsCompletionModule.getCompetencyDDown().should('contain.text', miscData.competency_01)

        //Verify Credit Type can Be Changed for Existing Credit
        cy.get(ARCourseSettingsCompletionModule.getCreditContainerLabel()).contains(credit.credits[credit.credits.length-2]).parents(ARCourseSettingsCompletionModule.getCreditContainer())
            .within(() => {
                cy.get(ARCourseSettingsCompletionModule.getEditCreditBtn()).click()
                cy.get(ARCourseSettingsCompletionModule.getCreditTypeDDown()).click()
                cy.get(ARCourseSettingsCompletionModule.getAllCreditTypeOptions()).contains(miscData.guia_credit_2_name).click()
            })

        ARCourseSettingsCompletionModule.getVShortWait()
        //Assert Allow Failure Only & Allow Re-enrollment After Failure Field Persisted
        cy.get(ARCourseSettingsCompletionModule.getAllowReEnrollmentYearsTxtF()).should('have.value', completion.enrollmentYear)
        cy.get(ARCourseSettingsCompletionModule.getAllowReEnrollmentMonthsTxtF()).should('have.value', completion.enrollmentMonth)
        cy.get(ARCourseSettingsCompletionModule.getAllowReEnrollmentDaysTxtF()).should('have.value', completion.enrollmentDay)

        //Change Allow Re-enrollment to Time before certificate expires
        cy.get(ARCourseSettingsCompletionModule.getAllowReEnrollmentRadioBtn()).contains('Time before certificate expires').click()

        //Turn on re-enroll automatically toggle
        cy.get(ARILCAddEditPage.getElementByDataNameAttribute(ARCourseSettingsCompletionModule.getReEnrollAutomaticallyToggleContainer()) + ' ' + ARILCAddEditPage.getToggleDisabled()).click()


        //Assert Post Enrollments When Option Persisted
        ARCourseSettingsCompletionModule.getVerifyPostEnrollmentByCourseName(courses.oc_filter_01_name)

        //Add Second Post Enrollment
        cy.get(ARCourseSettingsCompletionModule.getAddPostEnrollmentBtn()).click()
        ARCourseSettingsCompletionModule.getPostEnrollmentWhenDDownByOpt('Failed', completion.postValue - 1)
        ARCourseSettingsCompletionModule.getPostEnrollmentCoursesDDownByOpt(courses.ilc_filter_01_name, completion.postValue - 1)
        ARILCAddEditPage.getShortWait()

        //Publish ILC
        cy.publishCourse()
    })

    it('Edit ILC Course & Verify Completion Section Field Changes Have Been Persisted, Delete a Post Enrollment and Credit', () => {
        //Filter for Course & Edit it
        cy.editCourse(ilcDetails.courseName)
        ARILCAddEditPage.getMediumWait()
        //Open Completion Section
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Completion')).click()
        ARILCAddEditPage.getMediumWait() //Wait for toggles to become enabled

        //Assert that the Allow Re-enrollment Years/Months/Days Fields do not Accept Characters
        cy.get(ARCourseSettingsCompletionModule.getAllowReEnrollmentYearsTxtF()).type('a').blur()
        cy.get(ARCourseSettingsCompletionModule.getAllowReEnrollmentYearsTxtF()).should('have.value', completion.enrollmentYear)
        cy.get(ARCourseSettingsCompletionModule.getAllowReEnrollmentMonthsTxtF()).type('a').blur()
        cy.get(ARCourseSettingsCompletionModule.getAllowReEnrollmentMonthsTxtF()).should('have.value', completion.enrollmentMonth)
        cy.get(ARCourseSettingsCompletionModule.getAllowReEnrollmentDaysTxtF()).type('a').blur()
        cy.get(ARCourseSettingsCompletionModule.getAllowReEnrollmentDaysTxtF()).should('have.value', completion.enrollmentDay)

        //Assert there are Two Post Enrollments
        ARCourseSettingsCompletionModule.getVerifyPostEnrollmentByCourseName(courses.oc_filter_01_name)
        ARCourseSettingsCompletionModule.getVerifyPostEnrollmentByCourseName(courses.ilc_filter_01_name)

        //Delete a Post Enrollment
        ARCourseSettingsCompletionModule.getDeletePostEnrollmentByCourseName(courses.ilc_filter_01_name)
        ARILCAddEditPage.getShortWait()

        //Add another Post Enrollment for when user is Enrolled
        cy.get(ARCourseSettingsCompletionModule.getAddPostEnrollmentBtn()).click()
        ARCourseSettingsCompletionModule.getPostEnrollmentWhenDDownByOpt('Enrolled', completion.postValue - 1)
        ARCourseSettingsCompletionModule.getPostEnrollmentCoursesDDownByOpt(courses.oc_filter_02_name, completion.postValue - 1)
        ARILCAddEditPage.getShortWait()

        //Delete a Credit
        cy.get(ARCourseSettingsCompletionModule.getCreditContainerLabel()).contains(miscData.guia_credit_2_name).parents(ARCourseSettingsCompletionModule.getCreditContainer())
            .within(() => {
                cy.get(ARCourseSettingsCompletionModule.getDeleteCreditBtn()).click()
            })

        //Publish ILC
        cy.publishCourse()
    })

    it('Edit ILC Course, Verify Post Enrollment and Credit Deletion Persisted', () => {
        //Filter for Course & Edit it
        cy.editCourse(ilcDetails.courseName)
        ARILCAddEditPage.getMediumWait()
        //Open Completion Section
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Completion')).click()
        ARILCAddEditPage.getMediumWait() //Wait for toggles to become enabled

        //Assert First Post Enrollment Still Exists
        ARCourseSettingsCompletionModule.getVerifyPostEnrollmentByCourseName(courses.oc_filter_01_name)
        //Assert New Enrolled Type Post Enrollment Persisted
        ARCourseSettingsCompletionModule.getVerifyPostEnrollmentByCourseName(courses.oc_filter_02_name)

        //Assert Second Post Enrollment is Deleted
        cy.get(ARCourseSettingsCompletionModule.getVerifyPostEnrollment()).contains(courses.ilc_filter_01_name).should('not.exist')

        //Assert Credit is Deleted
        cy.get(ARCourseSettingsCompletionModule.getCreditContainerLabel()).contains(miscData.guia_credit_2_name).should('not.exist')
    })
})