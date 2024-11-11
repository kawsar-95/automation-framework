import arDashboardPage from '../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARCourseSettingsCatalogVisibilityModule from '../../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCatalogVisibility.module'
import arAddMoreCourseSettingsModule from '../../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import arCoursesPage from '../../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import AROCAddEditPage from '../../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage'
import ARUploadFileModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARUploadFileModal'
import arSelectModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import { ocDetails, catalogVisibility } from '../../../../../../../helpers/TestData/Courses/oc'
import { commonDetails } from '../../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../../helpers/TestData/users/users'
import { courses } from '../../../../../../../helpers/TestData/Courses/courses'
import { miscData } from '../../../../../../../helpers/TestData/Misc/misc'

/**
 * Testrail URL:
 * https://absorblms.testrail.io//index.php?/tests/view/288885
 * Original NASA story: https://absorblms.atlassian.net/browse/NASA-6779
 * Automation Subtask: https://absorblms.atlassian.net/browse/NASA-7502
 */

describe('AR - CED - OC - Catalog Visibility - Create Course - T288885', function(){

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        
    })

    after(function() {
        //Delete Course
        cy.deleteCourse(commonDetails.courseID)
    }) 


    it('Verify Catalog Visibility Thumbnail and Poster can be uploaded', () => {
        cy.createCourse('Online Course')

        //Open Catalog Visibility Section
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Catalog Visibility')).click()
        AROCAddEditPage.getShortWait()

         //Set Source to be file. force:true used here because the radio button was being covered, even though it wasn;t. This is due to the way radio buttons are being coded
         //Tested to make sure the correct button was being selected, it is.
        cy.get(ARCourseSettingsCatalogVisibilityModule.getSelectFileBtnOption()).click({force:true})

        //Choose a File
        cy.get(ARCourseSettingsCatalogVisibilityModule.getChooseFileBtn()).click()
      
        //Select upload from the media library and upload a file
        cy.get(ARUploadFileModal.getMediaLibraryUploadBtn()).click()
        cy.get(ARUploadFileModal.getFilePathTxt()).attachFile(commonDetails.filePath + commonDetails.THUMBNAIL_01_FILENAME)
  

        //Save Thumbnail
        ARUploadFileModal.getVShortWait()
        cy.get(ARUploadFileModal.getSaveBtn()).click()
        ARUploadFileModal.getVShortWait()

        //Add a Poster Via File Source
        cy.get(ARCourseSettingsCatalogVisibilityModule.getAddPosterBtn()).click()
        cy.get(arCoursesPage.getElementByDataNameAttributeAndIndex(ARCourseSettingsCatalogVisibilityModule.getPosterGroup(), 0) + ' ' +
            ARCourseSettingsCatalogVisibilityModule.getPosterChooseFileBtn()).click()

        //Select upload from the media library  and upload a file
        cy.get(ARUploadFileModal.getMediaLibraryUploadBtn()).click()
        cy.get(ARUploadFileModal.getFilePathTxt()).attachFile(commonDetails.filePath + commonDetails.posterFMUploadOCImgName)
    
        //Save the uplaoded poster
        cy.get(ARUploadFileModal.getChooseFileBtn()).click
        ARUploadFileModal.getVShortWait()
        cy.get(ARUploadFileModal.getSaveBtn()).click()
        ARUploadFileModal.getLongWait()

        //Publish Course
        cy.publishCourse()
    })

})