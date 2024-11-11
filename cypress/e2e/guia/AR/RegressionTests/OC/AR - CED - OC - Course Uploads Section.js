import miscData from '../../../../../fixtures/miscData.json'
import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARCourseSettingsCourseUploadsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCourseUploads.module'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import arCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import AROCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage'
import ARUploadInstructionsModal from '../../../../../../helpers/AR/pageObjects/Modals/ARUploadInstructionsModal'
import { ocDetails, courseUploadSection } from '../../../../../../helpers/TestData/Courses/oc'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../helpers/TestData/users/users'


describe('AR - CED - OC - Course Uploads Section - Create Course', function(){

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        
    })

    it('Create OC Course, Verify Course Uploads Section Fields, Publish Course', () => {
        cy.createCourse('Online Course')

        //Open Course Uploads Section
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Course Uploads')).click()
        AROCAddEditPage.getShortWait()

        //Verify No Course Uploads Banner
        cy.get(ARCourseSettingsCourseUploadsModule.getNoCourseUploadsBanner()).should('contain', 'This course has no files set-up for uploads.')

        //Add a Course Upload and Edit Upload Instructions
        cy.get(ARCourseSettingsCourseUploadsModule.getAddUploadBtn()).click()
        cy.get(ARCourseSettingsCourseUploadsModule.getEditUploadInstructionsBtn()).click()
        AROCAddEditPage.getShortWait()

        //Verify Upload Instructions Field Does Not Allow > 4000 Chars (Unable to Save)
        cy.get(AROCAddEditPage.getElementByAriaLabelAttribute(ARUploadInstructionsModal.getUploadFileInstructionsTxt()))
            .invoke('text', AROCAddEditPage.getLongString(4001)).type('a', { force: true })        
        cy.get(ARUploadInstructionsModal.getApplyBtn()).should('have.attr', 'aria-disabled', 'true')
        AROCAddEditPage.getShortWait()

        //Verify Upload Instructions Field Allows HTML, Save Changes
        cy.get(AROCAddEditPage.getElementByAriaLabelAttribute(ARUploadInstructionsModal.getUploadFileInstructionsTxt()))
            .clear().type(`${courseUploadSection.uploadInstructions} ${commonDetails.textWithHtmlTag}`).click()
        AROCAddEditPage.getVShortWait() //Wait for Apply Btn to become enabled
        cy.get(ARUploadInstructionsModal.getApplyBtn()).click()


        //Verify Label Name Does Not Allow > 255 Chars
        cy.get(AROCAddEditPage.getElementByAriaLabelAttribute(ARCourseSettingsCourseUploadsModule.getLabelTxt()))
            .clear().invoke('val', AROCAddEditPage.getLongString()).type('a')
        cy.get(ARCourseSettingsCourseUploadsModule.getLabelErrorMsg()).should('contain', miscData.CHAR_255_ERROR)
        AROCAddEditPage.getShortWait()

        //Enter Valid Label Name
        cy.get(AROCAddEditPage.getElementByAriaLabelAttribute(ARCourseSettingsCourseUploadsModule.getLabelTxt()))
            .clear().type(courseUploadSection.uploadLabel)
        //Set Approval Type to Course Editor
        cy.get(ARCourseSettingsCourseUploadsModule.getApprovalRadioBtn()).contains('Course Editor').click()

        //Publish Course
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = (id.request.url.slice(-36));
        })
    })
})

describe('AR - CED - OC - Course Uploads Section', function(){

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        
        //Filter for Course & Edit it
        cy.editCourse(ocDetails.courseName)
        AROCAddEditPage.getMediumWait()
        //Open Course Uploads Section
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Course Uploads')).click()
        AROCAddEditPage.getShortWait()
    })

    after(function() {
        //Delete Course
        cy.deleteCourse(commonDetails.courseID)
    })

    it('Edit OC Course, Verify Fields Persisted, Edit Approval Type, Add 2nd Course Upload', () => {
        //Verify Upload Instructions Persisted
        cy.get(ARCourseSettingsCourseUploadsModule.getEditUploadInstructionsBtn()).click()
        cy.get(AROCAddEditPage.getElementByAriaLabelAttribute(ARUploadInstructionsModal.getUploadFileInstructionsTxt()))
            .should('contain.text', `${courseUploadSection.uploadInstructions} ${commonDetails.textWithHtmlTag}`)
        cy.get(ARUploadInstructionsModal.getCancelBtn()).click()
        AROCAddEditPage.getShortWait() //Wait for modal to close

        //Set Approval Type to Other and Select Approval User
        ARCourseSettingsCourseUploadsModule.getExpandUploadByNameThenClick(courseUploadSection.uploadLabel)
        cy.get(ARCourseSettingsCourseUploadsModule.getApprovalRadioBtn()).contains('Other').click().click()
        cy.get(ARCourseSettingsCourseUploadsModule.getApprovalUserDDown()).click()
        cy.get(ARCourseSettingsCourseUploadsModule.getApprovalUserSearchTxtF()).type(users.sysAdmin.admin_sys_01_fname)
        ARCourseSettingsCourseUploadsModule.getApprovalUserOpt(users.sysAdmin.admin_sys_01_username)

        //Add a Second Course Upload
        cy.get(ARCourseSettingsCourseUploadsModule.getAddUploadBtn()).click()
        AROCAddEditPage.getLShortWait() //Wait for 2nd Upload to load

        //Verify Default Label
        cy.get(AROCAddEditPage.getElementByAriaLabelAttribute(ARCourseSettingsCourseUploadsModule.getLabelTxt()))
            .eq(1).should('have.value', 'Course Upload 2')
        
        //Edit Label
        cy.get(AROCAddEditPage.getElementByAriaLabelAttribute(ARCourseSettingsCourseUploadsModule.getLabelTxt()))
            .eq(1).clear().type(`${courseUploadSection.uploadLabel} 2`)

        //Publish Course
        cy.publishCourse()
    })

    it('Edit OC Course, Verify 2nd Course Upload Persisted', () => {
        cy.get(ARCourseSettingsCourseUploadsModule.getVerifyUploadExists()).contains(`${courseUploadSection.uploadLabel} 2`).should('exist')
    })
})
