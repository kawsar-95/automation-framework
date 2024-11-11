import arDashboardPage from '../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARCourseSettingsCompletionModule from '../../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCompletion.module'
import arAddMoreCourseSettingsModule from '../../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import arCoursesPage from '../../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import AROCAddEditPage from '../../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage'
import ARUploadFileModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARUploadFileModal'
import { courses } from '../../../../../../../helpers/TestData/Courses/courses'
import { ocDetails } from '../../../../../../../helpers/TestData/Courses/oc'
import { commonDetails, credit, completion } from '../../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../../helpers/TestData/users/users'
import { miscData } from '../../../../../../../helpers/TestData/Misc/misc'

/**
 * Testrail URL:
 * https://absorblms.testrail.io//index.php?/tests/view/288885
 * Original NASA story: https://absorblms.atlassian.net/browse/NASA-6779
 * Automation Subtask: https://absorblms.atlassian.net/browse/NASA-7502
 */

describe('AR - CED - OC - Course Uploads - Certificate - Admin Side - T288885', function(){

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        
    })

    after(function() {
        //Delete course
        cy.deleteCourse(commonDetails.courseID)
    })

    it('Admin - Create New OC Course and Add Certificate Upload', () => { 
        cy.createCourse('Online Course')

        //Open Completion Section
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Completion')).click()
        AROCAddEditPage.getMediumWait() //Wait for toggles to become enabled

        //Toggle Certificate to ON
        cy.get(ARCourseSettingsCompletionModule.getCertificateToggle()).click()

        //Set Source to be file. force:true used here because the radio button was being covered, even though it wasn't. This is due to the way radio buttons are being coded
        //Tested to make sure the correct button was being selected, it is. 
        //There are 2 instances of the radio button that is implemented and no way to seperate them; using eq to select the correct one
        cy.get(ARCourseSettingsCompletionModule.getSelectFileBtnOption()).click({force:true})
       // cy.get(ARCourseSettingsCompletionModule.getSelectFileBtnOption()).click() ///kept original code, but original code does not work to select the radio button, see above to see why

         //Select a Certificate File
         cy.get(ARCourseSettingsCompletionModule.getCertificateChooseFileBtn()).click()

         //Select upload from the media library and upload a file
         cy.get(ARUploadFileModal.getMediaLibraryUploadBtn()).click()

         cy.get(ARUploadFileModal.getFilePathTxt()).attachFile(commonDetails.filePath + commonDetails.certficateFMUploadFile)
         cy.get(ARUploadFileModal.getChooseFileBtn()).click
         AROCAddEditPage.getMediumWait() //Wait for file upload to appear
         cy.get(ARUploadFileModal.getSaveBtn()).click()
         AROCAddEditPage.getMediumWait() //Wait for Course details to appear

         //Publish course
         cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36)     
        })
    
    })

})
