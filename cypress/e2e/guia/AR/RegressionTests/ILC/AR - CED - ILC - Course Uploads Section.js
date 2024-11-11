import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARCourseSettingsCourseUploadsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCourseUploads.module'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import ARUploadInstructionsModal from '../../../../../../helpers/AR/pageObjects/Modals/ARUploadInstructionsModal'
import ARILCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage'
import ARDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import { ilcDetails } from '../../../../../../helpers/TestData/Courses/ilc'
import { courseUploadSection } from '../../../../../../helpers/TestData/Courses/oc'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../helpers/TestData/users/users'
import { miscData } from '../../../../../../helpers/TestData/Misc/misc'

describe('AR - CED - ILC - Course Uploads Section - Create Course', function(){
    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        
    })

    after(function() {
        cy.deleteCourse(commonDetails.courseID, 'instructor-led-courses-new')
    })

    it('Create ILC, Verify Course Uploads Section Fields, Publish Course', () => {
        cy.createCourse('Instructor Led', ilcDetails.courseName, false)

        //Open Course Uploads Section
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Course Uploads')).click()
        ARILCAddEditPage.getShortWait()

        //Verify No Course Uploads Banner
        cy.get(ARCourseSettingsCourseUploadsModule.getNoCourseUploadsBanner()).should('contain', 'This course has no files set-up for uploads.')

        //Add a Course Upload and Edit Upload Instructions
        cy.get(ARCourseSettingsCourseUploadsModule.getAddUploadBtn()).click()
        cy.get(ARCourseSettingsCourseUploadsModule.getEditUploadInstructionsBtn()).click()
        ARILCAddEditPage.getShortWait()

        //Verify Upload Instructions Field Does Not Allow > 4000 Chars (Unable to Save)
        cy.get(ARILCAddEditPage.getElementByAriaLabelAttribute(ARUploadInstructionsModal.getUploadFileInstructionsTxt()))
            .invoke('text', ARILCAddEditPage.getLongString(4001)).type('a', { force: true })
        cy.get(ARUploadInstructionsModal.getApplyBtn()).should('have.attr', 'aria-disabled', 'true')
        ARILCAddEditPage.getShortWait()

        //Verify Upload Instructions Field Allows HTML, Save Changes
        cy.get(ARILCAddEditPage.getElementByAriaLabelAttribute(ARUploadInstructionsModal.getUploadFileInstructionsTxt()))
            .clear().type(`${courseUploadSection.uploadInstructions} ${commonDetails.textWithHtmlTag}`).click()
            ARILCAddEditPage.getVShortWait() //Wait for Apply Btn to become enabled
        cy.get(ARUploadInstructionsModal.getApplyBtn()).click()

        //Verify Label Name Does Not Allow > 255 Chars
        cy.get(ARILCAddEditPage.getElementByAriaLabelAttribute(ARCourseSettingsCourseUploadsModule.getLabelTxt()))
            .clear().invoke('val', ARILCAddEditPage.getLongString()).type('a')
        ARILCAddEditPage.getShortWait()
        
        cy.get(ARCourseSettingsCourseUploadsModule.getLabelErrorMsg()).should('contain', miscData.char_255_error)
        ARILCAddEditPage.getShortWait()

        //Enter Valid Label Name
        cy.get(ARILCAddEditPage.getElementByAriaLabelAttribute(ARCourseSettingsCourseUploadsModule.getLabelTxt()))
            .clear().type(courseUploadSection.uploadLabel)

        //Verify each approval type and message
        for (let i = 0; i < courseUploadSection.approvalTypes.length; i++) {
            cy.get(ARCourseSettingsCourseUploadsModule.getApprovalRadioBtn()).contains(courseUploadSection.approvalTypes[i]).click()
            cy.get(ARCourseSettingsCourseUploadsModule.getApprovalBanner()).should('contain', courseUploadSection.approvalMessages[i])
        }

        //Set Approval Type to Course Editor
        cy.get(ARCourseSettingsCourseUploadsModule.getApprovalRadioBtn()).contains('Course Editor').click()
        //Enter reviewer notes
        cy.get(ARCourseSettingsCourseUploadsModule.getReviewersNotesTxtF()).type(courseUploadSection.reviewerNotes)

        //Publish Course
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
    }) 

    it('Edit ILC, Verify Fields Persisted, Edit Approval Type, Add 2nd Course Upload', () => {
        cy.editCourse(ilcDetails.courseName)
        ARILCAddEditPage.getMediumWait()
        //Open Course Uploads Section
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Course Uploads')).click()
        ARILCAddEditPage.getShortWait()

        //Verify Upload Instructions Persisted
        cy.get(ARCourseSettingsCourseUploadsModule.getEditUploadInstructionsBtn()).click()
        cy.get(ARILCAddEditPage.getElementByAriaLabelAttribute(ARUploadInstructionsModal.getUploadFileInstructionsTxt()))
            .should('contain.text', `${courseUploadSection.uploadInstructions} ${commonDetails.textWithHtmlTag}`)
        cy.get(ARUploadInstructionsModal.getCancelBtn()).click()
        ARILCAddEditPage.getShortWait() //Wait for modal to close

        //Verify reviewers notes persisted
        cy.get(ARCourseSettingsCourseUploadsModule.getReviewersNotesTxtF()).should('contain.text', courseUploadSection.reviewerNotes)

        //Set Approval Type to Other and Select Approval User
        ARCourseSettingsCourseUploadsModule.getExpandUploadByNameThenClick(courseUploadSection.uploadLabel)
        cy.get(ARCourseSettingsCourseUploadsModule.getApprovalRadioBtn()).contains('Other').click().click()
        cy.get(ARCourseSettingsCourseUploadsModule.getApprovalUserDDown()).click()
        cy.get(ARCourseSettingsCourseUploadsModule.getApprovalUserSearchTxtF()).type(users.sysAdmin.admin_sys_01_fname)
        ARCourseSettingsCourseUploadsModule.getApprovalUserOpt(users.sysAdmin.admin_sys_01_username)

        //Add a Second Course Upload
        cy.get(ARCourseSettingsCourseUploadsModule.getAddUploadBtn()).click()
        ARILCAddEditPage.getLShortWait() //Wait for 2nd Upload to load

        //Verify Default Label
        cy.get(ARCourseSettingsCourseUploadsModule.getLabelTxtF()).eq(1).should('have.value', 'Course Upload 2')
        
        //Edit Label
        cy.get(ARCourseSettingsCourseUploadsModule.getLabelTxtF()).eq(1).clear().type(`${courseUploadSection.uploadLabel} 2`)

        //Publish Course
        cy.publishCourse()
    })

    it('Edit ILC, Verify 2nd Course Upload Persisted, Delete Course Upload', () => {
        cy.editCourse(ilcDetails.courseName)
        ARILCAddEditPage.getMediumWait()
        //Open Course Uploads Section
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Course Uploads')).click()
        ARILCAddEditPage.getShortWait()

        ARCourseSettingsCourseUploadsModule.geDeleteUploadByNameThenClick(`${courseUploadSection.uploadLabel} 2`)
        ARILCAddEditPage.getLShortWait()
        
        cy.get(ARDeleteModal.getARDeleteBtn()).click()
        ARILCAddEditPage.getLShortWait()
        
        //Publish Course
        cy.publishCourse()
    })

    it('Edit ILC, Verify Course Upload Delete Persisted', () => {
        cy.editCourse(ilcDetails.courseName)
        ARILCAddEditPage.getMediumWait()
        //Open Course Uploads Section
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Course Uploads')).click()
        ARILCAddEditPage.getShortWait()

        cy.get(ARCourseSettingsCourseUploadsModule.getVerifyUploadExists()).contains(`${courseUploadSection.uploadLabel} 2`).should('not.exist')
    })
})
