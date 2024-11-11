import LEProfilePage from '../../../../../../../helpers/LE/pageObjects/User/LEProfilePage'
import LEDashboardPage from '../../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LECourseDetailsOCModule from '../../../../../../../helpers/LE/pageObjects/Courses/LECourseDetailsOCModule'
import LECoursesPage from '../../../../../../../helpers/LE/pageObjects/Courses/LECoursesPage'
import LEUploadFileModal from '../../../../../../../helpers/LE/pageObjects/Modals/LEUploadFileModal'
import arDashboardPage from '../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arCoursesPage from '../../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import arOCAddEditPage from '../../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage'
import arEnrollUsersPage from '../../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage'
import arAddMoreCourseSettingsModule from '../../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import ARCourseSettingsCompletionModule from '../../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCompletion.module'
import ARUploadInstructionsModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARUploadInstructionsModal'
import { userDetails } from '../../../../../../../helpers/TestData/users/UserDetails'
import { users } from '../../../../../../../helpers/TestData/users/users'
import { ocDetails, courseUploadSection } from '../../../../../../../helpers/TestData/Courses/oc'
import { commonDetails } from '../../../../../../../helpers/TestData/Courses/commonDetails'
import { resourcePaths, images } from '../../../../../../../helpers/TestData/resources/resources'

describe('AR - CED - OC - Course Uploads - Certificate - Admin Side', function(){

    before(function() {
        //Create a new user
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
    })

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        
    })

    it('Admin - Create New OC Course and Add Certificate Upload', () => { 
        cy.createCourse('Online Course')

        //Open Completion Section
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Completion')).click()
        arOCAddEditPage.getMediumWait() //Wait for toggles to become enabled

        //Toggle Certificate to ON
        ARCourseSettingsCompletionModule.getToggleByNameThenClick('Certificate')

        //Add Certificate Upload - Set approval type to Administrator
        cy.get(ARCourseSettingsCompletionModule.getAddCertificateUploadBtn()).click()
        cy.get(ARCourseSettingsCompletionModule.getCertificateLabelTxtF()).type(courseUploadSection.uploadLabelApproval)
        cy.get(ARCourseSettingsCompletionModule.getCertificateApprovalRadioBtn()).contains('Administrator').click()
        cy.get(ARCourseSettingsCompletionModule.getReviewersNotesTxtF()).type(courseUploadSection.reviewerNotes)

        //Add upload instructions
        cy.get(ARCourseSettingsCompletionModule.getEditUploadInstructionsBtn()).click()
        arOCAddEditPage.getShortWait()
        cy.get(arOCAddEditPage.getElementByAriaLabelAttribute(ARUploadInstructionsModal.getUploadFileInstructionsTxt())).type(courseUploadSection.uploadInstructions)
        arOCAddEditPage.getVShortWait() //wait for Apply button to be enabled
        cy.get(ARUploadInstructionsModal.getApplyBtn()).click()
        arOCAddEditPage.getShortWait()

        //Publish course
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36)
        })
    })

    it('Admin - Enroll User in New OC Course', () => { 
        arEnrollUsersPage.getEnrollUserByCourseAndUsername([ocDetails.courseName], [userDetails.username])
    })
})

describe('AR - CED - OC - Course Uploads - Certificate', function(){

    after(function() {
        //Delete course
        cy.deleteCourse(commonDetails.courseID)
        //Get userID and delete them
        cy.get(LEDashboardPage.getNavProfile()).click()  
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
        cy.url().then((currentURL) => {
            cy.deleteUser(currentURL.slice(-36));
        })
    })

    it('Start Course, Verify Upload Instructions, Upload File, Verify Course Progress, Replace Pending Upload File, Verify Certificate Details', () => { 
        //Go to course
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        LEDashboardPage.getTileByNameThenClick('My Courses')
        LEDashboardPage.getCourseCardBtnThenClick(ocDetails.courseName)
        LEDashboardPage.getLShortWait()
        //Go to uploads tab
        LECoursesPage.getCoursesPageTabBtnByName('Uploads')

        //Verify upload instructions
        cy.get(LECourseDetailsOCModule.getUploadInstructions()).should('contain', courseUploadSection.uploadInstructions)

        //Complete upload
        LECourseDetailsOCModule.getCourseUploadActionBtnThenClick(courseUploadSection.uploadLabelApproval)
        cy.get(LEUploadFileModal.getUploadLabel()).should('contain', courseUploadSection.uploadLabelApproval)
        cy.get('input[type="file"]').attachFile(resourcePaths.resource_image_folder + images.moose_filename)
        cy.intercept('**/uploads/files').as(`getUpload`).wait(`@getUpload`)
        cy.get(LEUploadFileModal.getUploadedFileTxtF()).should('contain', images.moose_filename)
        //Enter date issued
        LEUploadFileModal.getDateIssuedTxtF(courseUploadSection.dateIssued)
        //Toggle OFF Has Expiry Date and verify expiration date field is hidden
        cy.get(LEUploadFileModal.getHasExpiryDateToggle()).click()
        LECoursesPage.getVShortWait()
        cy.get(LEUploadFileModal.getDateFHeader()).contains('Expiry Date').should('not.exist')
        //Turn toggle back ON and enter expiry date
        cy.get(LEUploadFileModal.getHasExpiryDateToggle()).click()
        LECoursesPage.getVShortWait()
        LEUploadFileModal.getExpiryDateTxtF(courseUploadSection.dateExpired)
        //Enter Issuer
        cy.get(LEUploadFileModal.getIssuerTxtF()).type(courseUploadSection.issuer)
        //Enter upload note and save
        cy.get(LEUploadFileModal.getUploadNotesTxtF()).type(courseUploadSection.uploadNotes)
        cy.get(LEUploadFileModal.getSaveBtn()).click()
        LEDashboardPage.getLShortWait()
        //Verify course is not yet completed
        cy.get(LECourseDetailsOCModule.getCourseProgressPercentText()).should('contain', '0%')

        //Verify file upload can be replaced on a pending Admin Approval upload
        LECourseDetailsOCModule.getCourseUploadActionBtnThenClick(courseUploadSection.uploadLabelApproval)
        cy.get(LEUploadFileModal.getUploadLabel()).should('contain', courseUploadSection.uploadLabelApproval)
        cy.get('input[type="file"]').attachFile(resourcePaths.resource_image_folder + images.simpsons_gif_filename)
        cy.intercept('**/uploads/files').as(`getUpload2`).wait(`@getUpload2`)
        cy.get(LEUploadFileModal.getUploadedFileTxtF()).should('contain', images.simpsons_gif_filename)
        LEUploadFileModal.getDateIssuedTxtF(courseUploadSection.dateIssued2)
        LEUploadFileModal.getExpiryDateTxtF(courseUploadSection.dateExpired2)
        cy.get(LEUploadFileModal.getIssuerTxtF()).type(courseUploadSection.issuer2)
        cy.get(LEUploadFileModal.getUploadNotesTxtF()).type(courseUploadSection.uploadNotes)
        cy.get(LEUploadFileModal.getSaveBtn()).click()
        LEDashboardPage.getLShortWait()

        //Verify Certificate information is correctly displayed
        cy.get(LECourseDetailsOCModule.getUploadStatus()).should('contain', 'Pending Approval')
        cy.get(LECourseDetailsOCModule.getCertificateDateIssued()).should('contain', courseUploadSection.dateIssued2Long)
        cy.get(LECourseDetailsOCModule.getCertificateExpiryDate()).should('contain', courseUploadSection.dateExpired2Long)
        cy.get(LECourseDetailsOCModule.getCertificateIssuer()).should('contain', courseUploadSection.issuer2)
    })

    it('Verify Replaced File, Approve Upload, Verify Course Completion and Certificate', () => { 
        //Sign into admin side as sys admin, navigate to and filter for Course Upload to be approved
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Reports'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Course Uploads'))
        cy.intercept('/api/rest/v2/admin/reports/course-uploads').as('getUploads').wait('@getUploads')

        //Verify correct file was replaced - add filename column to report and filter for upload
        cy.get(arCoursesPage.getDisplayColumns()).click({force:true})
        cy.get(arCoursesPage.getChkBoxLabel()).contains('File Name').click()
        cy.get(arCoursesPage.getDisplayColumns()).click({force:true})
        cy.wrap(arCoursesPage.AddFilter('Course', 'Contains', ocDetails.courseName))
        cy.wrap(arCoursesPage.AddFilter('Type', 'Contains', courseUploadSection.uploadLabelApproval))

        //Verify filename and Approve upload
        cy.get(arCoursesPage.getTableCellName(9)).should('contain', images.simpsons_gif_filename)
        cy.get(arCoursesPage.getTableCellName(2)).contains(courseUploadSection.uploadLabelApproval).click()
        cy.wrap(arCoursesPage.WaitForElementStateToChange(arCoursesPage.getAddEditMenuActionsByName('Approve'), 1000))
        cy.get(arCoursesPage.getAddEditMenuActionsByName('Approve')).click()
        cy.get(arCoursesPage.getToastSuccessMsg()).should('contain', 'Course upload status successfully updated.')

        //Verify course completion in LE
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        LEDashboardPage.getTileByNameThenClick('My Courses')
        LEDashboardPage.getCourseCardBtnThenClick(ocDetails.courseName)
        LEDashboardPage.getLShortWait()
        cy.get(LECourseDetailsOCModule.getCourseProgressPercentText()).should('contain', '100%')

        //Verify approved upload can no longer be replaced
        LECoursesPage.getCoursesPageTabBtnByName('Uploads')
        LECourseDetailsOCModule.getCourseUploadActionBtnThenClick(courseUploadSection.uploadLabelApproval)
        cy.get(LEUploadFileModal.getUploadLabel()).should('not.exist') //clicking should not open upload modal

        //Verify Certificate
        cy.get(LECoursesPage.getCertificateIcon()).should('be.visible')
        cy.get(LECoursesPage.getCertificateTitle()).should('contain', ocDetails.courseName)
    })
})