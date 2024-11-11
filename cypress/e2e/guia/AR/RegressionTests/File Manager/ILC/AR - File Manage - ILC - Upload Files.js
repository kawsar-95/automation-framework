import ARCoursesPage from "../../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage"
import ARILCAddEditPage from "../../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage"
import ARAddMoreCourseSettingsModule from "../../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module"
import ARCourseSettingsCatalogVisibilityModule from "../../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCatalogVisibility.module"
import ARCourseSettingsCompletionModule from "../../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCompletion.module"
import ARCourseSettingsResourcesModule from "../../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsResources.module"
import ARUploadFileModal from "../../../../../../../helpers/AR/pageObjects/Modals/ARUploadFileModal"
import { commonDetails } from "../../../../../../../helpers/TestData/Courses/commonDetails"
import { ilcDetails } from "../../../../../../../helpers/TestData/Courses/ilc"
import { users } from '../../../../../../../helpers/TestData/users/users'

describe('GUIA-Story - NASA-7503 - File Manager - Upload Images and Verify ILC - T288885 T832336', function(){

    beforeEach(() => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARCoursesPage.getAddInstructorLed()
    })

    afterEach(() => {
        //Delete ILC
        cy.deleteCourse(commonDetails.courseID, 'instructor-led-courses-new')
    })

    it('Create ILC and upload images for poster and thumbnails and verify them', () => {
        //navigate to catalog visibility
        cy.createCourse('Instructor Led', ilcDetails.courseName, false)
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Catalog Visibility')).click()
        ARILCAddEditPage.getShortWait() //wait for toggle to become enabled

        //upload thumbnail
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
        cy.editCourse(ilcDetails.courseName)
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Catalog Visibility')).click()
        ARILCAddEditPage.getShortWait() //wait for toggle to become enabled
        cy.get(ARILCAddEditPage.getElementByAriaLabelAttribute(ARCourseSettingsCatalogVisibilityModule.getPosterFileByName('image Absorb%20logo%20small.png')))
            .should('exist')
        cy.get(ARILCAddEditPage.getElementByAriaLabelAttribute(ARCourseSettingsCatalogVisibilityModule.getThumbnailFileByName('image billboard%20(tasty).jpg')))
            .should('exist')

        //grab course id
        cy.url().should('contain', 'edit').then((currentURL) => {
            commonDetails.courseID = currentURL.slice(-36); //Store courseID
        })
    })

    it('Create ILC and upload images for certificate and verify them', () => {
        //navigate to certificates
        cy.createCourse('Instructor Led', ilcDetails.courseName, false)
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Completion')).click()
        ARILCAddEditPage.getShortWait() //wait for toggle to become enabled
        cy.get(ARILCAddEditPage.getElementByDataNameAttribute(ARCourseSettingsCompletionModule.getCertificateToggleContainer()) + ' ' + ARILCAddEditPage.getToggleEnabled()).click().should('have.text', 'On')

        //upload Certificate
        cy.get(ARCourseSettingsCompletionModule.getCertificateSourceRadioBtn()).contains('File').click()
        cy.get(ARCourseSettingsCompletionModule.getCertificateChooseFileBtn()).click()
        cy.get(ARUploadFileModal.getMediaLibraryUploadBtn()).click()
        cy.get(ARUploadFileModal.getFilePathTxt()).attachFile(commonDetails.filePath + commonDetails.posterImgName)
        cy.get(ARUploadFileModal.getChooseFileBtn()).click
        ARUploadFileModal.getVShortWait()
        cy.get(ARUploadFileModal.getSaveBtn()).click()
        ARUploadFileModal.getLShortWait()

        cy.publishCourse()

        // verify certificate exists
        ARCoursesPage.getShortWait()
        cy.editCourse(ilcDetails.courseName)
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Completion')).click()
        ARILCAddEditPage.getShortWait() //wait for toggle to become enabled
        cy.get(ARILCAddEditPage.getElementByDataName(ARCourseSettingsCompletionModule.getCertificateSectionDataName())).within(() => {
            cy.get(ARCourseSettingsCompletionModule.getCertificateFileF()).should('have.value', `${commonDetails.posterImgName}`)
        })

        //grab course id
        cy.url().should('contain', 'edit').then((currentURL) => {
            commonDetails.courseID = currentURL.slice(-36); //Store courseID
        })
    })

    it('Create ILC and upload images for Course Resource and verify them', () => {
        //navigate to resources
        cy.createCourse('Instructor Led', ilcDetails.courseName, false)
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Resources')).click()
        ARILCAddEditPage.getShortWait() //wait for toggle to become enabled
        cy.get(ARCourseSettingsResourcesModule.getAddResourceBtn()).click()

        //upload course resource
        cy.get(ARCourseSettingsResourcesModule.setResourceTxtName('course resource'))
        cy.get(ARCourseSettingsResourcesModule.clickChooseFileBtn())
        cy.get(ARUploadFileModal.getMediaLibraryUploadBtn()).click()
        cy.get(ARUploadFileModal.getFilePathTxt()).attachFile(commonDetails.filePath + commonDetails.posterImgName)
        cy.get(ARUploadFileModal.getChooseFileBtn()).click
        ARUploadFileModal.getVShortWait()
        cy.get(ARUploadFileModal.getSaveBtn()).click()
        ARUploadFileModal.getMediumWait()

        cy.publishCourse()

        //verify course resource exists
        ARCoursesPage.getShortWait()
        cy.editCourse(ilcDetails.courseName)
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Resources')).click()
        ARILCAddEditPage.getShortWait() //wait for toggle to become enabled
        cy.get(ARCourseSettingsResourcesModule.clickResourceEditExpandBtn())
        cy.get(ARCourseSettingsResourcesModule.getResourceFileF()).should('have.value', `${commonDetails.posterImgName}`)
        //grab course id
        cy.url().should('contain', 'edit').then((currentURL) => {
            commonDetails.courseID = currentURL.slice(-36); //Store courseID
        })
    })
})