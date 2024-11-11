import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARCourseSettingsCompletionModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCompletion.module'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import ARCURRAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/CURR/ARCURRAddEditPage'
import ARSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import ARUploadFileModal from '../../../../../../helpers/AR/pageObjects/Modals/ARUploadFileModal'
import { currDetails } from '../../../../../../helpers/TestData/Courses/curr'
import { commonDetails, credit, completion } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { miscData } from '../../../../../../helpers/TestData/Misc/misc'
import { users } from '../../../../../../helpers/TestData/users/users'
import { courses } from '../../../../../../helpers/TestData/Courses/courses'
import ARDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'

describe('AR - CED - Curriculum - Completion Section', function(){

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getCoursesReport()
     
    })
    
    after(function() {
        cy.deleteCourse(commonDetails.courseID, 'curricula')
    })

    it('Create Curriculum, Verify Completion Section Toggles, Radio Buttons and Fields, Upload Certificate, & Publish Course', () => {        
        //Create curriculum and add single course
        cy.createCourse('Curriculum')
        //Add course to curriculum
        ARSelectModal.SearchAndSelectFunction([courses.oc_filter_01_name])
        ARSelectModal.getLShortWait()

        //Open Completion Section
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Completion')).click()
        ARCURRAddEditPage.getMediumWait() //Wait for toggles to become enabled

        //Toggle Certificate to ON
        ARCourseSettingsCompletionModule.getToggleByNameThenClick('Certificate')

        //Select a Certificate File
        cy.get(ARCourseSettingsCompletionModule.getCertificateChooseFileBtn()).click()
        //Opening Media Library 
        cy.get(ARUploadFileModal.getMediaLibraryUploadBtn()).click()
        cy.get(ARUploadFileModal.getFilePathTxt()).attachFile(commonDetails.filePath + commonDetails.mooseFileName)
        cy.get(ARUploadFileModal.getChooseFileBtn()).click
        ARCURRAddEditPage.getVShortWait()
        cy.get(ARUploadFileModal.getSaveBtn()).click()
        ARCURRAddEditPage.getMediumWait()

        //Toggle Use Custom Title to ON
        cy.get(ARCURRAddEditPage.getElementByDataNameAttribute(ARCourseSettingsCompletionModule.getCustomTitleToggleContainer()) + ' ' + ARCURRAddEditPage.getToggleDisabled()).click()

        //Verify Custom Title Field Does Not Accept >255 Chars
        cy.get(ARCourseSettingsCompletionModule.getCustomTitleTxtF()).invoke('val', ARCURRAddEditPage.getLongString()).type('a')
        cy.get(ARCourseSettingsCompletionModule.getCustomTitleErrorMsg()).should('contain', miscData.char_255_error)

        //Verify Custom Title Field Does Not Accept HTML
        cy.get(ARCourseSettingsCompletionModule.getCustomTitleTxtF()).clear().type(commonDetails.textWithHtmlTag)
        ARCURRAddEditPage.getVShortWait()
        cy.get(ARCURRAddEditPage.getPublishBtn()).click()
        ARCURRAddEditPage.getLShortWait()
        cy.get(ARCourseSettingsCompletionModule.getCompletionSectionErrorMsg()).should('contain', miscData.invalid_chars_error)

        //Enter Valid Value Into Custom Title Field
        cy.get(ARCourseSettingsCompletionModule.getCustomTitleTxtF()).clear().type(commonDetails.customTitle)

        //Verify Custom Notes Field Does Not Accept HTML
        cy.get(ARCourseSettingsCompletionModule.getCustomNotesTxtF()).type(commonDetails.textWithHtmlTag)
        ARCURRAddEditPage.getVShortWait()
        cy.get(ARCURRAddEditPage.getPublishBtn()).click()
        ARCURRAddEditPage.getLShortWait()
        cy.get(ARCourseSettingsCompletionModule.getCompletionSectionErrorMsg()).should('contain', miscData.invalid_chars_error)

        //Enter Valid Value Into Custom Notes Field
        cy.get(ARCourseSettingsCompletionModule.getCustomNotesTxtF()).clear().type(commonDetails.customNotes)

        //Select the Time from Completion For Course Expiry Option
        cy.get(ARCourseSettingsCompletionModule.getExpiryRadioBtn()).contains('Time from completion').click().click()
        
        //Specify Time From Completion Expire In Time
        cy.get(ARCourseSettingsCompletionModule.getExpireYearsTxtF()).clear().type(completion.expireYear)
        cy.get(ARCourseSettingsCompletionModule.getExpireMonthsTxtF()).clear().type(completion.expireMonth)
        cy.get(ARCourseSettingsCompletionModule.getExpireDaysTxtF()).clear().type(completion.expireDay)

        //Choose Competency For Completion
        cy.get(ARCourseSettingsCompletionModule.getAddCompetencyBtn()).click()
        ARCURRAddEditPage.getLShortWait()
        ARCourseSettingsCompletionModule.getCompetencyDDownThenClick()
        ARCourseSettingsCompletionModule.getCompetencySearchTxtF(miscData.competency_01)
        ARCURRAddEditPage.getLShortWait()
        ARCourseSettingsCompletionModule.getCompetencyOpt(miscData.competency_01)
        
        //Select a Competency level
        ARCourseSettingsCompletionModule.getCompetencyLevelDDownThenClick()
        ARCURRAddEditPage.getMediumWait()
        ARCourseSettingsCompletionModule.getCompetencyLevelOpt('1')

        //Add Multi Credits
        /**Note the second credit option list is not a separate item, but is instead concatenated to the first  item. 
        This makes it impossible to the first instance of the credit type as the first instance is from the first item and is hidden; 
        a specific location for the second item is needed. If this test breaks, check the location of the item that is being tested.*/
        for (let i = 0; i < credit.credits.length-1; i++) {                      
            cy.get(ARCourseSettingsCompletionModule.getAddCreditBtn()).click()

            if (credit.credits[i] === 'General') { //Add General Credit with Rule
                cy.get(ARCourseSettingsCompletionModule.getCreditTypeDDown()).click()
                cy.get(ARCourseSettingsCompletionModule.getAllCreditTypeOptions()).contains(credit.credits[i]).click({force:true})

                cy.get(ARCourseSettingsCompletionModule.getAddVariableCreditRuleBtn()).click()
                cy.get(ARCourseSettingsCompletionModule.getVariableCreditFieldDDown()).eq(0).click()
                cy.get(ARCourseSettingsCompletionModule.getVariableCreditFieldOpt()).contains('First Name').click()
                cy.get(ARCourseSettingsCompletionModule.getVariableCreditTxtF()).type(commonDetails.variableCreditRuleName)
                cy.get(ARCURRAddEditPage.getElementByAriaLabelAttribute(ARCourseSettingsCompletionModule.getVariableCreditAmountTxt())).eq(i).clear().type(credit.creditAmounts[i])
            } else { //Add Multi Credit
                cy.get(ARCourseSettingsCompletionModule.getCreditContainer()).eq(i).within(() => {
                    cy.get(ARCourseSettingsCompletionModule.getCreditTypeDDown()).click()
                    cy.get(ARCourseSettingsCompletionModule.getAllCreditTypeOptions()).contains(credit.credits[i]).click({force:true})
                        
                    //Verify Credit Value can only be Numeric
                    cy.get(ARCURRAddEditPage.getElementByAriaLabelAttribute(ARCourseSettingsCompletionModule.getVariableCreditAmountTxt())).type('abc').blur() //Field Should reset to default value
                    cy.get(ARCURRAddEditPage.getElementByAriaLabelAttribute(ARCourseSettingsCompletionModule.getVariableCreditAmountTxt())).should('have.value', '0').clear()
                    
                    //Assert that Credits Field for Variable Credit Rules is Required
                    cy.get(ARCourseSettingsCompletionModule.getCreditAmountErrorMsg()).should('contain', 'Field is required.')
                    cy.get(ARCURRAddEditPage.getElementByAriaLabelAttribute(ARCourseSettingsCompletionModule.getVariableCreditAmountTxt())).type(credit.creditAmounts[i]) //Enter Valid Value
                })
            }   
        }

        //Toggle Allow Re-enrollment to ON
        cy.get(ARCURRAddEditPage.getElementByDataNameAttribute(ARCourseSettingsCompletionModule.getAllowReEnrollmentToggleContainer()) + ' ' + ARCURRAddEditPage.getToggleDisabled()).click()
       
        //Specify Re-enrollment Time
        cy.get(ARCourseSettingsCompletionModule.getDurationYearsTxtF()).clear().type(completion.enrollmentYear)
        cy.get(ARCourseSettingsCompletionModule.getDurationMonthsTxtF()).clear().type(completion.enrollmentMonth)
        cy.get(ARCourseSettingsCompletionModule.getDurationDaysTxtF()).clear().type(completion.enrollmentDay)

        //Verify leaderboard points field accepts only positive numeric values les than 100
        cy.get(ARCourseSettingsCompletionModule.getLeaderboardPointsTxtF()).type('abc').blur() //Field Should reset to default value
        cy.get(ARCourseSettingsCompletionModule.getLeaderboardPointsTxtF()).should('have.value', '')
        cy.get(ARCourseSettingsCompletionModule.getLeaderboardPointsTxtF()).type('-2')
        cy.get(ARCourseSettingsCompletionModule.getErrorMsg()).should('contain', miscData.negative_chars_error)

        cy.get(ARCourseSettingsCompletionModule.getLeaderboardPointsTxtF()).clear().type('1000')
        cy.get(ARCourseSettingsCompletionModule.getErrorMsg()).should('contain', miscData.char_1000_error)
        
        //Enter valid point value
        cy.get(ARCourseSettingsCompletionModule.getLeaderboardPointsTxtF()).clear().type(completion.leaderboardPoints)

        //Add Post Enrollment
        cy.get(ARCourseSettingsCompletionModule.getAddPostEnrollmentBtn()).click()
        ARCourseSettingsCompletionModule.getPostEnrollmentWhenDDownByOpt('Completed')
        ARCourseSettingsCompletionModule.getPostEnrollmentCoursesDDownByOpt(courses.oc_filter_01_name)        
        ARCURRAddEditPage.getShortWait()

        //Publish Curriculum
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
    })

    it('Edit Curriculum, Verify Completion Section Toggles, Radio Buttons and Fields Persisted, Add a Post Enrollment', () => {
        //Edit curriculum
        cy.editCourse(currDetails.courseName)
        ARCURRAddEditPage.getMediumWait()
        //Open Completion Section
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Completion')).click()
        ARCURRAddEditPage.getMediumWait() //Wait for toggles to become enabled

        //Assert Certificate File Was Saved
        cy.get(ARCourseSettingsCompletionModule.getCertificateFileF()).should('have.value', 'moose.jpg')

        //Change Certificate Source to Url
        cy.get(ARCourseSettingsCompletionModule.getCertificateSourceRadioBtn()).contains('Url').click().click()

        //Verify Certificate Url Source Field Does Not Accept >255 Chars
        cy.get(ARCourseSettingsCompletionModule.getCertificateFileUrlTxtF()).invoke('val', ARCURRAddEditPage.getLongString()).type('a')
        cy.get(ARCourseSettingsCompletionModule.getCertificateFileErrorMsg()).should('contain', 'Field cannot be more than 255 characters.')

        //Verify Certificate Url Source Field Does Not Accept HTML
        cy.get(ARCourseSettingsCompletionModule.getCertificateFileUrlTxtF()).clear().type(commonDetails.textWithHtmlTag)
        ARCURRAddEditPage.getVShortWait()
        cy.get(ARCURRAddEditPage.getPublishBtn()).click()
        ARCURRAddEditPage.getLShortWait()
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
        ARCURRAddEditPage.getSelectDate(commonDetails.date)

        //Assert Competency Option  and level Persisted
        ARCourseSettingsCompletionModule.getCompetencyDDown().should('contain.text', miscData.competency_01)
        ARCourseSettingsCompletionModule.getCompetencyLevelDDown().should('contain.text', '1')

        //Verify Credit Type can Be Changed for Existing Credit
        cy.get(ARCourseSettingsCompletionModule.getCreditContainerLabel()).contains(credit.credits[credit.credits.length-2]).parents(ARCourseSettingsCompletionModule.getCreditContainer())
            .within(() => {
                cy.get(ARCourseSettingsCompletionModule.getEditCreditBtn()).click()

                //Select the Credit dropdown box to be able to type in the box
                cy.get(ARCourseSettingsCompletionModule.getCreditTypeDDown()).click()
            
                //Type the credit type in the box and select the matching credit type in the list
                cy.get(ARCourseSettingsCompletionModule.getAllCreditTypeSelections()).get(ARCourseSettingsCompletionModule.getAllCreditTypeOptions()).contains(miscData.guia_credit_2_name).click()
                
            })

        //Assert Allow Re-enrollment Field Persisted
        cy.get(ARCourseSettingsCompletionModule.getDurationYearsTxtF()).should('have.value', completion.enrollmentYear)
        cy.get(ARCourseSettingsCompletionModule.getDurationMonthsTxtF()).should('have.value', completion.enrollmentMonth)
        cy.get(ARCourseSettingsCompletionModule.getDurationDaysTxtF()).should('have.value', completion.enrollmentDay)

        //Change Allow Re-enrollment to Time before certificate expires
        cy.get(ARCourseSettingsCompletionModule.getAllowReEnrollmentRadioBtn()).contains('Time before certificate expires').click()

        //Turn on re-enroll automatically toggle
        cy.get(ARCURRAddEditPage.getElementByDataNameAttribute(ARCourseSettingsCompletionModule.getReEnrollAutomaticallyToggleContainer()) + ' ' + ARCURRAddEditPage.getToggleDisabled()).click()

        //Assert leaderboard points persisted 
        cy.get(ARCourseSettingsCompletionModule.getLeaderboardPointsTxtF()).should('have.value', completion.leaderboardPoints)

        //Assert Post Enrollments When Option Persisted
        ARCourseSettingsCompletionModule.getVerifyPostEnrollmentByCourseName(courses.oc_filter_01_name)

        //Add Second Post Enrollment
        cy.get(ARCourseSettingsCompletionModule.getAddPostEnrollmentBtn()).click()
        ARCourseSettingsCompletionModule.getPostEnrollmentWhenDDownByOpt('Enrolled', completion.postValue - 1)
        ARCourseSettingsCompletionModule.getPostEnrollmentCoursesDDownByOpt(courses.ilc_filter_01_name, completion.postValue - 1)
        ARCURRAddEditPage.getShortWait()

        //Publish curriculum
        cy.publishCourse()
    })

    it('Edit Curriculum, Verify Completion Section Field Changes Have Been Persisted, Delete a Post Enrollment and Credit', () => {
        //Edit curriculum
        cy.editCourse(currDetails.courseName)
        ARCURRAddEditPage.getMediumWait()
        //Open Completion Section
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Completion')).click()
        ARCURRAddEditPage.getMediumWait() //Wait for toggles to become enabled

        //Assert there are Two Post Enrollments
        ARCourseSettingsCompletionModule.getVerifyPostEnrollmentByCourseName(courses.oc_filter_01_name)
        ARCourseSettingsCompletionModule.getVerifyPostEnrollmentByCourseName(courses.ilc_filter_01_name)

        //Delete a Post Enrollment
        ARCourseSettingsCompletionModule.getDeletePostEnrollmentByCourseName(courses.ilc_filter_01_name)
        ARCURRAddEditPage.getShortWait()

        //Add another Post Enrollment for when user is Enrolled
        cy.get(ARCourseSettingsCompletionModule.getAddPostEnrollmentBtn()).click()
        ARCourseSettingsCompletionModule.getPostEnrollmentWhenDDownByOpt('Enrolled', completion.postValue - 1)
        ARCourseSettingsCompletionModule.getPostEnrollmentCoursesDDownByOpt(courses.oc_filter_02_name, completion.postValue - 1)
        ARCURRAddEditPage.getShortWait()
        
        //Delete a Credit
        cy.get(ARCourseSettingsCompletionModule.getCreditContainerLabel()).contains(miscData.guia_credit_2_name).parents(ARCourseSettingsCompletionModule.getCreditContainer())
            .within(() => {
                cy.get(ARCourseSettingsCompletionModule.getDeleteCreditBtn()).click()
            })

        //Publish curriculum
        cy.publishCourse()
    })

    it('Edit Curriculum Course, Verify Post Enrollment and Credit Deletion Persisted', () => {
        //Edit curriculum
        cy.editCourse(currDetails.courseName)
        ARCURRAddEditPage.getMediumWait()
        //Open Completion Section
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Completion')).click()
        ARCURRAddEditPage.getMediumWait() //Wait for toggles to become enabled

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