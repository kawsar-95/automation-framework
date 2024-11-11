import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARCourseSettingsCompletionModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCompletion.module'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import arCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import AROCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage'
import ARUploadFileModal from '../../../../../../helpers/AR/pageObjects/Modals/ARUploadFileModal'
import { courses } from '../../../../../../helpers/TestData/Courses/courses'
import { ocDetails } from '../../../../../../helpers/TestData/Courses/oc'
import { commonDetails, credit, completion } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../helpers/TestData/users/users'
import { miscData } from '../../../../../../helpers/TestData/Misc/misc'

describe('AR - CED - OC - Completion Section - Create Course', function(){

    beforeEach(() => {        
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
    })

    it('Create OC Course, Verify Completion Section Toggles, Radio Buttons and Fields, Upload Certificate, & Publish Course', () => {
        arCoursesPage.getAddOnlineCourse()
        cy.createCourse('Online Course', ocDetails.creditCourseName)
        
        //Open Completion Section
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Completion')).click()

        //Toggle Certificate to ON
        ARCourseSettingsCompletionModule.getToggleByNameThenClick('Certificate')

        //Select a Certificate File
        cy.get(ARCourseSettingsCompletionModule.getCertificateChooseFileBtn()).click()
        cy.get(ARUploadFileModal.getMediaLibraryUploadBtn()).click()
        cy.get(ARUploadFileModal.getFilePathTxt()).attachFile(commonDetails.filePath + commonDetails.mooseFileName)
        cy.get(ARUploadFileModal.getChooseFileBtn()).click
        cy.get(ARUploadFileModal.getSaveBtn()).should('have.attr', 'aria-disabled', 'false').click()
        cy.get(ARUploadFileModal.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
        //Toggle Use Custom Title to ON
        ARCourseSettingsCompletionModule.generalToggleSwitch('true', ARCourseSettingsCompletionModule.getCustomTitleToggleContainer())
        cy.get(ARCourseSettingsCompletionModule.getCustomTitleTxtF()).invoke('val', AROCAddEditPage.getLongString()).type('a')
        cy.get(ARCourseSettingsCompletionModule.getCustomTitleErrorMsg()).should('contain', miscData.char_255_error)

        ARCourseSettingsCompletionModule.generalToggleSwitch('true', ARCourseSettingsCompletionModule.getAllowReEnrollmentToggleContainer())

        //Verify Custom Title Field Does Not Accept HTML
        cy.get(ARCourseSettingsCompletionModule.getCustomTitleTxtF()).clear().type(commonDetails.textWithHtmlTag)
        cy.get(AROCAddEditPage.getPublishBtn()).should('have.attr', 'aria-disabled', 'false').click()
        cy.get(AROCAddEditPage.getPublishBtn()).click()
        cy.get(ARCourseSettingsCompletionModule.getCompletionSectionErrorMsg(), {timeout: 3000}).should('exist').and('contain', miscData.invalid_chars_error)

        //Enter Valid Value Into Custom Title Field
        cy.get(ARCourseSettingsCompletionModule.getCustomTitleTxtF()).clear().type(commonDetails.customTitle)

        //Verify Custom Notes Field Does Not Accept HTML
        cy.get(ARCourseSettingsCompletionModule.getCustomNotesTxtF()).type(commonDetails.textWithHtmlTag)
        cy.get(AROCAddEditPage.getPublishBtn()).click()
        cy.get(ARCourseSettingsCompletionModule.getCompletionSectionErrorMsg(), {timeout: 3000}).should('exist')
        cy.get(ARCourseSettingsCompletionModule.getCompletionSectionErrorMsg()).should('contain', miscData.invalid_chars_error)

        //Enter Valid Value Into Custom Notes Field
        cy.get(ARCourseSettingsCompletionModule.getCustomNotesTxtF()).clear().type(commonDetails.customNotes)

        //Select the Time from Completion For Course Expiry Option
        cy.get(ARCourseSettingsCompletionModule.getExpiryRadioBtn()).contains('Time from completion').click().click()
        
        //Specify Time From Completion Expire In Time
        cy.get(ARCourseSettingsCompletionModule.getExpireYearsTxtF()).clear().type(completion.expireYear)
        cy.get(ARCourseSettingsCompletionModule.getExpireMonthsTxtF()).clear().type(completion.expireMonth)
        cy.get(ARCourseSettingsCompletionModule.getExpireDaysTxtF()).clear().type(completion.expireDay)

        //Toggle Allow Re-enrollment to ON
        ARCourseSettingsCompletionModule.generalToggleSwitch('true', ARCourseSettingsCompletionModule.getAllowReEnrollmentToggleContainer())

        //Enter Valid Values Into Years/Months/Days Fields Under Allow Re-Enrollment
        cy.get(ARCourseSettingsCompletionModule.getDurationYearsTxtF(), {timeout: 3000}).clear().type(completion.durationYear)
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
            cy.get(ARCourseSettingsCompletionModule.getCreditTypeDDown()).eq(i).click()
            cy.get(ARCourseSettingsCompletionModule.getCreditTypeSearchF()).eq(i).clear().type(credit.credits[i])
            // Select the credit type
            cy.get(ARCourseSettingsCompletionModule.getAllCreditTypeOptionsContainer()).eq(i).contains(new RegExp("^" + credit.credits[i] + "$", "g")).click()
            if (credit.credits[i] === 'General') { 
                
                //Add General Credit with Rule

                cy.get(ARCourseSettingsCompletionModule.getAddVariableCreditRuleBtn()).click()
                cy.get(ARCourseSettingsCompletionModule.getVariableCreditFieldDDown()).eq(0).click()
                cy.get(ARCourseSettingsCompletionModule.getVariableCreditFieldOpt()).contains('First Name').click()
                cy.get(ARCourseSettingsCompletionModule.getVariableCreditTxtF()).type(commonDetails.variableCreditRuleName)
                cy.get(AROCAddEditPage.getElementByAriaLabelAttribute(ARCourseSettingsCompletionModule.getVariableCreditAmountTxt())).eq(i).clear().type(credit.creditAmounts[i])
            } else { 
                cy.get(ARCourseSettingsCompletionModule.getCreditContainer()).eq(i).within(() => {
                    
                    //Verify Credit Value can only be Numeric
                    cy.get(AROCAddEditPage.getElementByAriaLabelAttribute(ARCourseSettingsCompletionModule.getVariableCreditAmountTxt())).type('abc').blur() //Field Should reset to default value
                    cy.get(AROCAddEditPage.getElementByAriaLabelAttribute(ARCourseSettingsCompletionModule.getVariableCreditAmountTxt())).should('have.value', '0').clear()
                    
                    //Assert that Credits Field for Variable Credit Rules is Required
                    cy.get(ARCourseSettingsCompletionModule.getCreditAmountErrorMsg()).should('contain', 'Field is required.')
                    cy.get(AROCAddEditPage.getElementByAriaLabelAttribute(ARCourseSettingsCompletionModule.getVariableCreditAmountTxt())).type(credit.creditAmounts[i]) //Enter Valid Value
                
                })
            }
        }

       //Toggle Allow Failure to ON
       ARCourseSettingsCompletionModule.generalToggleSwitch('true', ARCourseSettingsCompletionModule.getAllowFailureToggleContainer())

       //Toggle Re-enrollment On Failure to ON
       ARCourseSettingsCompletionModule.generalToggleSwitch('true', ARCourseSettingsCompletionModule.getAllowReEnrollmentOnFailureToggleContainer())
       
       //Specify Re-enrollment After Failure Time
       cy.get(ARCourseSettingsCompletionModule.getAllowReEnrollmentYearsTxtF()).clear().type(completion.enrollmentYear)
       cy.get(ARCourseSettingsCompletionModule.getAllowReEnrollmentMonthsTxtF()).clear().type(completion.enrollmentMonth)
       cy.get(ARCourseSettingsCompletionModule.getAllowReEnrollmentDaysTxtF()).clear().type(completion.enrollmentDay)

       //Add Post Enrollment
       cy.get(ARCourseSettingsCompletionModule.getAddPostEnrollmentBtn()).click()
       ARCourseSettingsCompletionModule.getPostEnrollmentWhenDDownByOpt('Completed')
       ARCourseSettingsCompletionModule.getPostEnrollmentCoursesDDownByOpt(courses.oc_filter_01_name)

       //Publish OC
       cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
    })
})

describe('AR - CED - OC - Completion Section', function(){

    beforeEach(() => {
        
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        
        
        //Filter for Course & Edit it
        cy.editCourse(ocDetails.creditCourseName)
        
        //Open Completion Section
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Completion')).click()
    })

    after(function() {        
        //Delete Course
        cy.deleteCourse(commonDetails.courseID)
    })

    it('Edit OC Course, Verify Completion Section Toggles, Radio Buttons and Fields Persisted, Add a Post Enrollment', () => {
        cy.get(ARCourseSettingsCompletionModule.getCertificateFileF()).should('have.value', 'moose.jpg')
        //Change Certificate Source to Url
        cy.get(ARCourseSettingsCompletionModule.getCertificateSourceRadioBtn()).contains('Url').click().click()

        //Verify Certificate Url Source Field Does Not Accept >255 Chars
        cy.get(ARCourseSettingsCompletionModule.getCertificateFileUrlTxtF()).invoke('val', AROCAddEditPage.getLongString()).type('a')
        cy.get(ARCourseSettingsCompletionModule.getCertificateFileErrorMsg(), {timeout: 3000}).should('contain', 'Field cannot be more than 255 characters.')

        //Verify Certificate Url Source Field Does Not Accept HTML
        cy.get(ARCourseSettingsCompletionModule.getCertificateFileUrlTxtF()).clear().type(commonDetails.textWithHtmlTag)
        cy.get(AROCAddEditPage.getPublishBtn()).should('have.attr', 'aria-disabled', 'false').click()
        cy.get(ARCourseSettingsCompletionModule.getCompletionSectionErrorMsg()).should('contain', 'Field contains invalid characters.')

        //Enter a Valid Url
        cy.get(ARCourseSettingsCompletionModule.getCertificateFileUrlTxtF()).clear().type(miscData.switching_to_absorb_img_url)

        //Assert Notes Field Persisted
        cy.get(ARCourseSettingsCompletionModule.getCustomNotesTxtF()).should('have.value', commonDetails.customNotes)

        //Assert Custom Title Field Persisted
        cy.get(ARCourseSettingsCompletionModule.getCustomTitleTxtF()).should('have.value', commonDetails.customTitle)

        //Assert Time from Completion was selected for Course Expiry Option and Field Values Persisted
        cy.get(ARCourseSettingsCompletionModule.getExpireYearsTxtF()).should('have.value', completion.expireYear)
        cy.get(ARCourseSettingsCompletionModule.getExpireMonthsTxtF()).should('have.value', completion.expireMonth)
        cy.get(ARCourseSettingsCompletionModule.getExpireDaysTxtF()).should('have.value', completion.expireDay)

        //Set Certificate Date Expiry Radio button
        cy.get(ARCourseSettingsCompletionModule.getExpiryRadioBtn()).contains('Date').click().click()

        //Set Valid Certificate Expiry Date and Time
        cy.get(ARCourseSettingsCompletionModule.getExpiryDatePickerBtn()).click()
        AROCAddEditPage.getSelectDate(commonDetails.date)

        //Assert Competency Option Persisted
        ARCourseSettingsCompletionModule.getCompetencyDDown().should('contain.text', miscData.competency_01)

        //Verify Credit Type can Be Changed for Existing Credit
        cy.get(ARCourseSettingsCompletionModule.getCreditContainerLabel()).contains(credit.credits[credit.credits.length-2]).parents(ARCourseSettingsCompletionModule.getCreditContainer())
            .within(() => {
                cy.get(ARCourseSettingsCompletionModule.getEditCreditBtn()).click()
                cy.get(ARCourseSettingsCompletionModule.getCreditTypeDDown()).click()
                cy.get(ARCourseSettingsCompletionModule.getAllCreditTypeOptions()).contains(miscData.guia_credit_2_name).click()
            })

        //Assert Allow Failure Only & Allow Re-enrollment After Failure Field Persisted
        cy.get(ARCourseSettingsCompletionModule.getAllowReEnrollmentYearsTxtF()).should('have.value', completion.enrollmentYear)
        cy.get(ARCourseSettingsCompletionModule.getAllowReEnrollmentMonthsTxtF()).should('have.value', completion.enrollmentMonth)
        cy.get(ARCourseSettingsCompletionModule.getAllowReEnrollmentDaysTxtF()).should('have.value', completion.enrollmentDay)

        //Change Allow Re-enrollment to Time before certificate expires
        cy.get(ARCourseSettingsCompletionModule.getAllowReEnrollmentRadioBtn()).contains('Time before certificate expires').click()

        //Turn on re-enroll automatically toggle
        ARCourseSettingsCompletionModule.generalToggleSwitch('true', ARCourseSettingsCompletionModule.getReEnrollAutomaticallyToggleContainer())

        //Assert Post Enrollments When Option Persisted
        ARCourseSettingsCompletionModule.getVerifyPostEnrollmentByCourseName(courses.oc_filter_01_name)

        //Add Second Post Enrollment
        cy.get(ARCourseSettingsCompletionModule.getAddPostEnrollmentBtn()).click()
        ARCourseSettingsCompletionModule.getPostEnrollmentWhenDDownByOpt('Failed', completion.postValue - 1)
        ARCourseSettingsCompletionModule.getPostEnrollmentCoursesDDownByOpt(courses.ilc_filter_01_name, completion.postValue - 1)
        cy.get(AROCAddEditPage.getPublishBtn()).should('have.attr', 'aria-disabled', 'false').should('be.visible')

        //Publish the courese
        cy.publishCourse()
    })

    it('Edit OC Course, Verify Completion Section Field Changes Have Been Persisted, Delete a Post Enrollment and Credit', () => {
        
        //Assert there are Two Post Enrollments
        ARCourseSettingsCompletionModule.getVerifyPostEnrollmentByCourseName(courses.oc_filter_01_name)
        ARCourseSettingsCompletionModule.getVerifyPostEnrollmentByCourseName(courses.ilc_filter_01_name)

        //Delete a Post Enrollment
        ARCourseSettingsCompletionModule.getDeletePostEnrollmentByCourseName(courses.ilc_filter_01_name)

        //Add another Post Enrollment for when user is Enrolled
        cy.get(ARCourseSettingsCompletionModule.getAddPostEnrollmentBtn(), {timeout: 3000}).click()
        ARCourseSettingsCompletionModule.getPostEnrollmentWhenDDownByOpt('Enrolled', completion.postValue - 1)
        ARCourseSettingsCompletionModule.getPostEnrollmentCoursesDDownByOpt(courses.oc_filter_02_name, completion.postValue - 1)

        //Delete a Credit
        cy.get(ARCourseSettingsCompletionModule.getCreditContainerLabel(), {timeout: 3000}).contains(miscData.guia_credit_2_name).parents(ARCourseSettingsCompletionModule.getCreditContainer())
            .within(() => {
                cy.get(ARCourseSettingsCompletionModule.getDeleteCreditBtn()).click()
            })

        //Publish OC
        cy.publishCourse()
    })

    it('Edit OC Course, Verify Post Enrollment and Credit Deletion Persisted', () => {
        
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

