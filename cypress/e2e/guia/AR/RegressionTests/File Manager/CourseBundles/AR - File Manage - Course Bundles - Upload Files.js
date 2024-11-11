import ARCoursesPage from "../../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage"
import ARAddMoreCourseSettingsModule from "../../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module"
import { commonDetails } from "../../../../../../../helpers/TestData/Courses/commonDetails"
import { users } from '../../../../../../../helpers/TestData/users/users'
import ARSelectModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import { courses } from '../../../../../../../helpers/TestData/Courses/courses'
import arCBAddEditPage from "../../../../../../../helpers/AR/pageObjects/Courses/CB/ARCBAddEditPage"
import { cbDetails } from "../../../../../../../helpers/TestData/Courses/cb"
import ARUploadFileModal from "../../../../../../../helpers/AR/pageObjects/Modals/ARUploadFileModal"
import ARCourseSettingsCatalogVisibilityModule from "../../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCatalogVisibility.module"

describe('GUIA-Story - NASA-7504 - File Manager - Upload Images and Verify Course Bundles - T288885', function() {

    beforeEach(() => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARCoursesPage.getAddCourseBundle()
    })

    afterEach(() => {
        //Delete Course Bundle
        cy.deleteCourse(commonDetails.courseID, 'course-bundles')
    })

    it('Create Course Bundle and upload images for poster and thumbnails and verify them', () => {
        cy.createCourse('Course Bundle', cbDetails.courseName)
        
        //Add Course
        ARSelectModal.SearchAndSelectFunction([courses.oc_filter_01_name])
        ARSelectModal.getMediumWait()
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Catalog Visibility')).click()
        arCBAddEditPage.getMediumWait() //wait for toggle to become enabled
        
        // upload thumbnail
         cy.get(ARCourseSettingsCatalogVisibilityModule.getThumbnailRadioBtn()).contains('File').click()
         cy.get(ARCourseSettingsCatalogVisibilityModule.getChooseThumbnailBtn()).click()
         cy.get(ARUploadFileModal.getMediaLibraryUploadBtn()).click()
         cy.get(ARUploadFileModal.getFilePathTxt()).attachFile(commonDetails.filePath + commonDetails.thumbnailImgName)
         cy.get(ARUploadFileModal.getChooseFileBtn()).click
         ARUploadFileModal.getVShortWait()
         cy.get(ARUploadFileModal.getSaveBtn()).click()
         ARUploadFileModal.getLShortWait()
 
         //upload poster
         cy.get(ARCourseSettingsCatalogVisibilityModule.getAddPosterBtnContainer()).click()
         cy.get(ARCourseSettingsCatalogVisibilityModule.getPosterRadioBtn()).contains('File').click()
         cy.get(ARCoursesPage.getElementByDataNameAttributeAndIndex(ARCourseSettingsCatalogVisibilityModule.getPosterGroup(), 0) + ' ' +
         ARCourseSettingsCatalogVisibilityModule.getPosterChooseFileBtn()).click()        
         cy.get(ARUploadFileModal.getMediaLibraryUploadBtn()).click()
         cy.get(ARUploadFileModal.getFilePathTxt()).attachFile(commonDetails.filePath + commonDetails.posterImgName)
         cy.get(ARUploadFileModal.getChooseFileBtn()).click
         ARUploadFileModal.getVShortWait()
         cy.get(ARUploadFileModal.getSaveBtn()).click()
         ARUploadFileModal.getLShortWait()
 
         cy.publishCourse()

          //verify poster and thumbnail exists
        ARCoursesPage.getShortWait()
        cy.editCourse(cbDetails.courseName)
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Catalog Visibility')).click()
        arCBAddEditPage.getShortWait() //wait for toggle to become enabled
        cy.get(arCBAddEditPage.getElementByAriaLabelAttribute(ARCourseSettingsCatalogVisibilityModule.getPosterFileByName('image Absorb%20logo%20small.png')))
            .should('exist')
        cy.get(arCBAddEditPage.getElementByAriaLabelAttribute(ARCourseSettingsCatalogVisibilityModule.getThumbnailFileByName('image billboard%20(tasty).jpg')))
            .should('exist')

        //grab course id
        cy.url().should('contain', 'edit').then((currentURL) => {
            commonDetails.courseID = currentURL.slice(-36); //Store courseID
        })
    })
})