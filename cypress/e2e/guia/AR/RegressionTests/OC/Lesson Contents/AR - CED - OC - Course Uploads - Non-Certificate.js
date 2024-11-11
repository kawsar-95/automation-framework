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
import ARCourseSettingsCourseUploadsModule from '../../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCourseUploads.module'
import ARUploadInstructionsModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARUploadInstructionsModal'
import { userDetails } from '../../../../../../../helpers/TestData/users/UserDetails'
import { users } from '../../../../../../../helpers/TestData/users/users'
import { ocDetails, courseUploadSection } from '../../../../../../../helpers/TestData/Courses/oc'
import { commonDetails } from '../../../../../../../helpers/TestData/Courses/commonDetails'
import { resourcePaths, images } from '../../../../../../../helpers/TestData/resources/resources'

describe('AR - CED - OC - Course Uploads - Non-Certificate - Admin Side', function(){

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

    it('Admin - Create New OC Course and Add Upload Instructions', () => { 
        cy.createCourse('Online Course')

        //Set Course Upload info
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Course Uploads')).click()
        LEDashboardPage.getShortWait()

        //Add two course uploads - No Approval and Administrator Approval
        for (let i = 0; i < courseUploadSection.uploadLabelNames.length; i++) {
            cy.get(ARCourseSettingsCourseUploadsModule.getAddUploadBtn()).click()
            arOCAddEditPage.getShortWait()
            cy.get(ARCourseSettingsCourseUploadsModule.getCourseUploadHeader()).contains(`${courseUploadSection.uploadLabelDefaultPrefix} ${i+1}`)
                .parents(ARCourseSettingsCourseUploadsModule.getCourseUploadContainer()).within(() => {
                    cy.get(arOCAddEditPage.getElementByAriaLabelAttribute(ARCourseSettingsCourseUploadsModule.getLabelTxt())).clear().type(courseUploadSection.uploadLabelNames[i])
                    if (i === courseUploadSection.uploadLabelNames.length - 1) {
                        cy.get(ARCourseSettingsCourseUploadsModule.getApprovalRadioBtn()).contains('Administrator').click()
                        //Add reviewer note
                        cy.get(ARCourseSettingsCourseUploadsModule.getReviewersNotesTxtF()).type(courseUploadSection.reviewerNotes)
                    }
                })
        }

        //Add upload instructions
        cy.get(ARCourseSettingsCourseUploadsModule.getEditUploadInstructionsBtn()).click()
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

describe('AR - CED - OC - Course Uploads - Non-Certificate', function(){

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

    it('Start Course, Verify Upload Instructions, Upload Files, Verify Course Progress, Replace Pending Upload File', () => { 
        //Go to course
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        LEDashboardPage.getTileByNameThenClick('My Courses')
        LEDashboardPage.getCourseCardBtnThenClick(ocDetails.courseName)
        LEDashboardPage.getLShortWait()
        //Go to uploads tab
        LECoursesPage.getCoursesPageTabBtnByName('Uploads')

        //Verify upload instructions
        cy.get(LECourseDetailsOCModule.getUploadInstructions()).should('contain', courseUploadSection.uploadInstructions)

        //Complete both uploads
        for (let i = 0; i < courseUploadSection.uploadLabelNames.length; i++) {
            LECourseDetailsOCModule.getCourseUploadActionBtnThenClick(courseUploadSection.uploadLabelNames[i])
            cy.get(LEUploadFileModal.getUploadLabel()).should('contain', courseUploadSection.uploadLabelNames[i])
            cy.get('input[type="file"]').attachFile(resourcePaths.resource_image_folder + images.moose_filename)
            cy.intercept('**/uploads/files').as(`getUpload${i}`).wait(`@getUpload${i}`)
            cy.get(LEUploadFileModal.getUploadedFileTxtF()).should('contain', images.moose_filename)
            cy.get(LEUploadFileModal.getUploadNotesTxtF()).type(courseUploadSection.uploadNotes)
            cy.get(LEUploadFileModal.getSaveBtn()).click()
            LEDashboardPage.getLShortWait()
        }
        //Verify half completion
        cy.get(LECourseDetailsOCModule.getCourseProgressPercentText()).should('contain', '50%')

        //Verify file upload cannot be replaced on No Approval upload
        LECourseDetailsOCModule.getCourseUploadActionBtnThenClick(courseUploadSection.uploadLabel)
        cy.get(LEUploadFileModal.getUploadLabel()).should('not.exist') //clicking should not open upload modal

        //Verify file upload can be replaced on a pending Admin Approval upload
        LECourseDetailsOCModule.getCourseUploadActionBtnThenClick(courseUploadSection.uploadLabelApproval)
        cy.get(LEUploadFileModal.getUploadLabel()).should('contain', courseUploadSection.uploadLabelApproval)
        cy.get('input[type="file"]').attachFile(resourcePaths.resource_image_folder + images.simpsons_gif_filename)
        cy.intercept('**/uploads/files').as(`getUpload`).wait(`@getUpload`)
        cy.get(LEUploadFileModal.getUploadedFileTxtF()).should('contain', images.simpsons_gif_filename)
        cy.get(LEUploadFileModal.getSaveBtn()).click()
        LEDashboardPage.getLShortWait()
    })

    it('Verify Replaced File, Approve Upload, Verify Course Completion', () => { 
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
    })
})