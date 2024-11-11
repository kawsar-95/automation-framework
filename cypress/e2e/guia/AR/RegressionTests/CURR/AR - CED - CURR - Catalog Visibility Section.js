import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import ARCURRAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/CURR/ARCURRAddEditPage'
import ARSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import ARUploadFileModal from '../../../../../../helpers/AR/pageObjects/Modals/ARUploadFileModal'
import arCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import { currDetails } from '../../../../../../helpers/TestData/Courses/curr'
import { catalogVisibility } from '../../../../../../helpers/TestData/Courses/oc'
import { commonDetails, credit, completion } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { miscData } from '../../../../../../helpers/TestData/Misc/misc'
import { users } from '../../../../../../helpers/TestData/users/users'
import { courses } from '../../../../../../helpers/TestData/Courses/courses'
import ARDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARCourseSettingsEnrollmentRulesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
import ARCourseSettingsCatalogVisibilityModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCatalogVisibility.module'

describe('AR - CED - CURR - Catalog Visibility Section - Create Course', function(){

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.blatAdmin.admin_blat_01_username, users.blatAdmin.admin_blat_01_password, '/admin')
        ARDashboardPage.getCoursesReport()
        
    })

    it('Verify Catalog Visibility Toggles, Radio Buttons and Fields, Upload Images, & Publish Curriculum', () => {
        //Create curriculum
        cy.createCourse('Curriculum')
        
        //Add course to curriculum
        ARSelectModal.SearchAndSelectFunction([courses.oc_filter_01_name])
        ARSelectModal.getLShortWait()

        // Select Allow Self Enrollment Alll learner Radio Button
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')

        //Open Catalog Visibility Section
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Catalog Visibility')).click()
        ARCURRAddEditPage.getShortWait()

        //Select a Category
        cy.get(ARCourseSettingsCatalogVisibilityModule.getChooseCategoryBtn()).click()
        ARSelectModal.SearchAndSelectFunction([courses.category_01_name])
        ARCURRAddEditPage.getShortWait()

        //Add a Thumbnail Via URL Source
        ARSelectModal.getLShortWait()
        cy.contains(ARCourseSettingsCatalogVisibilityModule.getAddImageBtn(), "File").click()
        ARUploadFileModal.getVShortWait()
        cy.contains(ARCourseSettingsCatalogVisibilityModule.getAddUrlBtn(), "Url").click()
        
        ARUploadFileModal.getVShortWait()
        cy.get(ARCourseSettingsCatalogVisibilityModule.getUrlTypeinput()).type(miscData.switching_to_absorb_img_url)
        ARUploadFileModal.getVShortWait()
        cy.get(ARUploadFileModal.getThumbnailUrlFilePAthTxtF()).type(miscData.remote_image0_url)

        //Add a Poster Via File Source
        cy.get(ARCourseSettingsCatalogVisibilityModule.getAddPosterBtn()).click()
        cy.get(arCoursesPage.getElementByDataNameAttributeAndIndex(ARCourseSettingsCatalogVisibilityModule.getPosterGroup(), 0) + ' ' +
            ARCourseSettingsCatalogVisibilityModule.getPosterChooseFileBtn()).click()
        //Opening Media Library 
        cy.get(ARUploadFileModal.getMediaLibraryUploadBtn()).click()
        cy.get(ARUploadFileModal.getChooseFileBtn()).click()
        ARUploadFileModal.getShortWait()
        cy.get(ARUploadFileModal.getFilePathTxt()).attachFile(commonDetails.filePath + commonDetails.posterImgName)
        ARUploadFileModal.getVShortWait()
        cy.get(ARUploadFileModal.getSaveBtn()).click()
        cy.get(ARUploadFileModal.getPageHeaderTitle(),{timeout:50000}).should('be.visible').should('contain', 'Add Curriculum')

        //Verify Mandatory, Featured, Enable for Mobile App, and Recommended Course Toggles are OFF by Default, Then Turn Them ON
        for (let i = 0; i < catalogVisibility.toggleFuncs.length-1; i++) {
            //Verify Toggle is OFF By Default
            cy.get(ARCURRAddEditPage.getElementByDataNameAttribute(catalogVisibility.toggleFuncs[i]) + ' ' + ARCURRAddEditPage.getToggleStatus())
                .should('have.attr', 'aria-checked', 'false')
            //Turn Toggle ON
            ARCURRAddEditPage.generalToggleSwitch("true", catalogVisibility.toggleFuncs[i])
        }

        //Assert Featured Course Sort Order Field Does Not Accept Negative Values
        cy.get(ARCourseSettingsCatalogVisibilityModule.getFeaturedCourseSortOrderTxtF()).type('-1')
        cy.get(ARCourseSettingsCatalogVisibilityModule.getFeaturedCourseSortOrderErrorMsg()).should('contain', miscData.negative_chars_error)

        //Assert Featured Course Sort Order Field Does Not Accept Non-Numeric Characters
        cy.get(ARCourseSettingsCatalogVisibilityModule.getFeaturedCourseSortOrderTxtF()).clear().type('a').blur()
        cy.get(ARCourseSettingsCatalogVisibilityModule.getFeaturedCourseSortOrderTxtF()).should('have.value', '')

        //Add Valid Featured Course Sort Order
        cy.get(ARCourseSettingsCatalogVisibilityModule.getFeaturedCourseSortOrderTxtF()).type('4')

        //Add Recommended Course Tags
        cy.get(ARCourseSettingsCatalogVisibilityModule.getRecommendationTagsDDown()).click()
        cy.get(ARCourseSettingsCatalogVisibilityModule.getRecommendationTagsSearchTxt()).should('be.visible')
        cy.get(ARCourseSettingsCatalogVisibilityModule.getRecommendationTagsSearchTxt()).type('- Free{downArrow}{enter}')
        cy.get(ARCourseSettingsCatalogVisibilityModule.getRecommendationTagsSearchTxt()).should('not.be.visible')

        //Publish Curriculum
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
        cy.get(ARCourseSettingsCatalogVisibilityModule.getToastSuccessMsg(), {timeout: 40000}).should('be.visible')
    })
})

describe('AR - CED - CURR - Catalog Visibility Section', function(){

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getCoursesReport()
        
        //Filter for Course & Edit it
        cy.editCourse(currDetails.courseName)
        ARCURRAddEditPage.getMediumWait()
        //Open Catalog Visibility Section
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Catalog Visibility')).click()
        ARCURRAddEditPage.getShortWait()
    })

    after(function() {
        //Delete Course
        cy.deleteCourse(commonDetails.courseID, 'curricula')
    })

    it('Edit Curriculum & Verify Images, Radio Buttons, Toggles, and Fields Have Been Persisted, Edit Images', () => { 
        //Assert Catagory Selection Persisted
        cy.get(ARCourseSettingsCatalogVisibilityModule.getCatagoryPickerF()).should('contain.text', courses.category_01_name)

        //Assert Thumbnail Image (Name and Size)
        cy.get(ARCourseSettingsCatalogVisibilityModule.getThumbnailSize()).should('contain', 'Thumbnail 229 x 173px')
        cy.get(ARCURRAddEditPage.getElementByAriaLabelAttribute(ARCourseSettingsCatalogVisibilityModule.getThumbnailFileByName('image Absorb%20logo%20small.png')))
            .should('exist')


        /* These error checks will need to be updated once the development is complete

        //Verify Thumbnail Url Field Does Not Accept >255 Chars
        cy.get(ARCourseSettingsCatalogVisibilityModule.getChooseThumbnailBtn()).click()
        cy.get(ARUploadFileModal.getAddUrlBtn()).click()
        cy.get(ARUploadFileModal.getUrlTxtF()).invoke('val', ARCURRAddEditPage.getLongString()).type('a')
        cy.get(ARUploadFileModal.getUrlApplyBtn()).click()
        
        //*Verify 255 char error here - todo

        //Verify Thumbnail Url Field Does Not Accept HTML
        cy.get(ARCourseSettingsCatalogVisibilityModule.getChooseThumbnailBtn()).click()
        cy.get(ARUploadFileModal.getAddUrlBtn()).click()
        cy.get(ARUploadFileModal.getUrlTxtF()).type(commonDetails.textWithHtmlTag)
        cy.get(ARUploadFileModal.getUrlApplyBtn()).click()

        //*Verify html error here - todo

        */

        //Add Thumbnail Via File Upload
        cy.get(ARCourseSettingsCatalogVisibilityModule.getThumbnailRadioBtn()).contains('File').click()
        cy.get(ARCourseSettingsCatalogVisibilityModule.getChooseThumbnailBtn()).click()
        cy.get(ARUploadFileModal.getMediaLibraryUploadBtn()).click()  
        cy.get(ARUploadFileModal.getFilePathTxt()).attachFile(commonDetails.filePath + commonDetails.thumbnailImgName)
        cy.get(ARUploadFileModal.getChooseFileBtn()).click
        ARUploadFileModal.getVShortWait()
        cy.get(ARUploadFileModal.getSaveBtn()).click()
        ARUploadFileModal.getLShortWait()

        //Assert Poster Image (Name and Size)
        cy.get(ARCURRAddEditPage.getElementByAriaLabelAttribute(ARCourseSettingsCatalogVisibilityModule.getPosterFileByName(`image Absorb%20logo%20small.png`)))
            .should('have.attr', 'style', 'min-height: 188px; min-width: 450px; max-height: 188px; max-width: 450px; object-fit: contain;')
        
        //Assert Poster Via Url Radio Button Option
        cy.get(arCoursesPage.getElementByDataNameAttributeAndIndex(ARCourseSettingsCatalogVisibilityModule.getPosterGroup(), 0) + ' ' +
            ARCourseSettingsCatalogVisibilityModule.getPosterRadioBtn()).contains('Url').click().click()
        //Verify Poster Url Field Does Not Accept >850 Chars
        cy.get(arCoursesPage.getElementByDataNameAttributeAndIndex(ARCourseSettingsCatalogVisibilityModule.getPosterGroup(), 0) + ' ' +
            ARCourseSettingsCatalogVisibilityModule.getPosterFilePathTxtF()).invoke('val', ARCURRAddEditPage.getLongString(850)).type('a')
        cy.get(arCoursesPage.getElementByDataNameAttributeAndIndex(ARCourseSettingsCatalogVisibilityModule.getPosterGroup(), 0) + ' ' +
            ARCourseSettingsCatalogVisibilityModule.getPosterUrlErrorMsg()).should('contain', miscData.char_850_error)
        //Verify Poster Url Field Does Not Accept HTML
        cy.get(arCoursesPage.getElementByDataNameAttributeAndIndex(ARCourseSettingsCatalogVisibilityModule.getPosterGroup(), 0) + ' ' +
            ARCourseSettingsCatalogVisibilityModule.getPosterFilePathTxtF()).clear().type(commonDetails.textWithHtmlTag)
            ARCURRAddEditPage.getVShortWait()
        cy.get(arCoursesPage.getPublishBtn()).click()
        ARCURRAddEditPage.getShortWait()
        cy.get(ARCourseSettingsCatalogVisibilityModule.getToastErrorMsg()).should('contain', 'Visibility save failed.')
        //Delete Poster Image
        cy.get(ARCourseSettingsCatalogVisibilityModule.getPosterDeleteBtn()).click()

        //Assert No More Than 5 Posters Can Be Added
        for (let i = 0; i < 5; i++) {
            cy.get(ARCourseSettingsCatalogVisibilityModule.getAddPosterBtn()).click()
            cy.get(arCoursesPage.getElementByDataNameAttributeAndIndex(ARCourseSettingsCatalogVisibilityModule.getPosterGroup(), i) + ' ' +
                ARCourseSettingsCatalogVisibilityModule.getPosterRadioBtn()).contains('Url').click().click()
            cy.get(arCoursesPage.getElementByDataNameAttributeAndIndex(ARCourseSettingsCatalogVisibilityModule.getPosterGroup(), i) + ' ' +
                ARCourseSettingsCatalogVisibilityModule.getPosterFilePathTxtF()).type(miscData.switching_to_absorb_img_url)
        }
        cy.get(ARCourseSettingsCatalogVisibilityModule.getAddPosterBtnContainer()).should('have.attr', 'aria-disabled', 'true')

        //Delete 4 Posters (Delete lowest -> highest)
        for (let i = 6; i > 2; i--) {
            ARCourseSettingsCatalogVisibilityModule.getPosterDeleteBtnByIndexThenClick(i)
        }

        //Assert Mandatory, Featured, Enable for Mobile App, and Recommended Course Toggles are ON
        for (let i = 0; i < catalogVisibility.toggleFuncs.length-1; i++) {
            //Verify Toggle is ON
            cy.get(ARCURRAddEditPage.getElementByDataNameAttribute(catalogVisibility.toggleFuncs[i]) + ' ' + ARCURRAddEditPage.getToggleStatus())
                .should('have.attr', 'aria-checked', 'true')
        }

        //Assert Featured Course Order Field Persisted
        cy.get(ARCourseSettingsCatalogVisibilityModule.getFeaturedCourseSortOrderTxtF()).should('have.value', '4')

        //Assert Recommended Course Tag Selection Persisted
        cy.get(ARCourseSettingsCatalogVisibilityModule.getRecommendationTagsDDown()).should('contain.text', miscData.auto_tag3)
        //Remove Recommended Course Tag
        cy.get(ARCourseSettingsCatalogVisibilityModule.getRecommendationTagClearBtn()).click()
        //ARCURRAddEditPage.getShortWait()
        ARCURRAddEditPage.getLongWait()
        //Publish Course
        cy.publishCourse()
        cy.get(ARCourseSettingsCatalogVisibilityModule.getToastSuccessMsg(), {timeout: 40000}).should('be.visible')
    })

    it('Edit Curriculum & Verify Image Edits Persisted, Turn Mandatory, Featured Course, and Enable for Mobile App Toggles Off', () => {   
        //Assert Thumbnail Image (Name and Size)
        cy.get(ARCourseSettingsCatalogVisibilityModule.getThumbnailSize()).should('contain', 'Thumbnail 229 x 173px')
        cy.get(ARCURRAddEditPage.getElementByPartialAriaLabelAttribute(ARCourseSettingsCatalogVisibilityModule.getThumbnailFileByName(`image billboard%20(tasty).jpg`)))
            .should('exist')

        //Assert Poster Image (Name)
        cy.get(ARCourseSettingsCatalogVisibilityModule.getPostUrlExists()).should('have.value', `${miscData.switching_to_absorb_img_url}`)

        //Turn Mandatory, Featured Course, and Enable for Mobile App Toggles OFF
        for (let i = 0; i < catalogVisibility.toggleFuncs.length; i++) {
            ARCURRAddEditPage.generalToggleSwitch("false", catalogVisibility.toggleFuncs[i])
        }

        //Publish Course
        cy.publishCourse()
        cy.get(ARCourseSettingsCatalogVisibilityModule.getToastSuccessMsg(), {timeout: 40000}).should('be.visible')
    })

    it('Edit Curriculum & Verify Tag Removal and Toggles are OFF', () => {   
        //Assert Mandatory, Featured Course, and Enable for Mobile App Toggles are OFF
        //Assert Recommended Tags Were Removed (Toggle is Now OFF)
        for (let i = 0; i < catalogVisibility.toggleFuncs.length-1; i++) {
            //Verify Toggle is OFF
            cy.get(ARCURRAddEditPage.getElementByDataNameAttribute(catalogVisibility.toggleFuncs[i]) + ' ' + ARCURRAddEditPage.getToggleStatus())
                .should('have.attr', 'aria-checked', 'false')
        }
    })
})

