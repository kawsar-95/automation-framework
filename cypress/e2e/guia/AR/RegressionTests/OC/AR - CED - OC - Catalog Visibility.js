import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARCourseSettingsCatalogVisibilityModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCatalogVisibility.module'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import arCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import AROCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage'
import ARUploadFileModal from '../../../../../../helpers/AR/pageObjects/Modals/ARUploadFileModal'
import arSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import { ocDetails, catalogVisibility } from '../../../../../../helpers/TestData/Courses/oc'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../helpers/TestData/users/users'
import { courses } from '../../../../../../helpers/TestData/Courses/courses'
import { miscData } from '../../../../../../helpers/TestData/Misc/misc'

describe('AR - CED - OC - Catalog Visibility - Create Course', function () {

  beforeEach(() => {
    //Sign into admin side as sys admin, navigate to Courses
    cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
    cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
    cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
    
  })

  it('Verify Catalog Visibility Toggles, Radio Buttons and Fields, Upload Images, & Publish OC Course', () => {
    cy.createCourse('Online Course')

    //Open Catalog Visibility Section
    cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Catalog Visibility')).click()
    AROCAddEditPage.getShortWait()

    //Select a Category
    cy.get(ARCourseSettingsCatalogVisibilityModule.getChooseCategoryBtn()).click()
    arSelectModal.SearchAndSelectFunction([courses.category_01_name])
    AROCAddEditPage.getShortWait()

    //Add a Thumbnail Via URL Source
    cy.get(ARCourseSettingsCatalogVisibilityModule.getThumbnailRadioBtn()).contains('Url').click()
    cy.get(ARCourseSettingsCatalogVisibilityModule.getThumbnailUrlTxtF()).type(miscData.switching_to_absorb_img_url)

    //Add a Poster Via File Source
    cy.get(ARCourseSettingsCatalogVisibilityModule.getAddPosterBtn()).click()
    cy.get(arCoursesPage.getElementByDataNameAttributeAndIndex(ARCourseSettingsCatalogVisibilityModule.getPosterGroup(), 0) + ' ' +
      ARCourseSettingsCatalogVisibilityModule.getPosterChooseFileBtn()).click()
    cy.get(ARCourseSettingsCatalogVisibilityModule.getUploadFileBtn()).click()

    cy.get(ARUploadFileModal.getFilePathTxt()).attachFile(commonDetails.filePath + commonDetails.posterImgName)
    cy.get(ARUploadFileModal.getChooseFileBtn()).click()
    ARUploadFileModal.getVShortWait()

    cy.get(ARUploadFileModal.getSaveBtn()).click()
    ARUploadFileModal.getLShortWait()

    //Verify Mandatory, Featured, Enable for Mobile App, and Recommended Course Toggles are OFF by Default, Then Turn Them ON
    for (let i = 0; i < catalogVisibility.toggleFuncs.length; i++) {
      //Verify Toggle is OFF By Default
      cy.get(AROCAddEditPage.getElementByDataNameAttribute(catalogVisibility.toggleFuncs[i]) + ' ' + AROCAddEditPage.getToggleStatus())
        .should('have.attr', 'aria-checked', 'false')
      //Turn Toggle ON
      cy.get(AROCAddEditPage.getElementByDataNameAttribute(catalogVisibility.toggleFuncs[i]) + ' ' + AROCAddEditPage.getToggleDisabled()).click()
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
    cy.get(ARCourseSettingsCatalogVisibilityModule.getRecommendationTagsSearchTxt())
      .type(miscData.auto_tag1)
    ARCourseSettingsCatalogVisibilityModule.getRecommendationTagOpt(miscData.auto_tag1)

    //Publish Course
    cy.publishCourseAndReturnId().then((id) => {
      commonDetails.courseID = id.request.url.slice(-36);
    })
  })
})

describe('AR - CED - OC - Catalog Visibility', function () {

  beforeEach(() => {
    //Sign into admin side as sys admin, navigate to Courses
    cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
    cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
    cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
    
    //Filter for Course & Edit it
    cy.editCourse(ocDetails.courseName)
    AROCAddEditPage.getMediumWait()
    //Open Catalog Visibility Section
    cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Catalog Visibility')).click()
    AROCAddEditPage.getShortWait()
  })

  after(function () {
    //Delete Course
    cy.deleteCourse(commonDetails.courseID)
  })

  it('Edit OC Course & Verify Images, Radio Buttons, Toggles, and Fields Have Been Persisted, Edit Images', () => {
    cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Catalog Visibility')).click()
    // Click again to scroll down to the settings
    cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Catalog Visibility')).click()


    AROCAddEditPage.getShortWait()
    //Assert Catagory Selection Persisted
    cy.get(ARCourseSettingsCatalogVisibilityModule.getCatagoryPickerF()).should('contain.text', courses.category_01_name)

    //Assert Thumbnail Image (Name and Size)
    cy.get(ARCourseSettingsCatalogVisibilityModule.getThumbnailSize()).should('contain', 'Thumbnail 229 x 173px')

    //Add Thumbnail Via File Upload
    cy.get(ARCourseSettingsCatalogVisibilityModule.getThumbnailRadioBtn()).contains('File').click()
    cy.get(ARCourseSettingsCatalogVisibilityModule.getChooseThumbnailBtn()).click()
    cy.get(ARCourseSettingsCatalogVisibilityModule.getUploadFileBtn()).click()
    cy.get(ARUploadFileModal.getFilePathTxt()).attachFile(commonDetails.filePath + commonDetails.thumbnailImgName)
    cy.get(ARUploadFileModal.getChooseFileBtn()).click
    ARUploadFileModal.getVShortWait()
    cy.get(ARUploadFileModal.getSaveBtn()).click()
    ARUploadFileModal.getLShortWait()

    //Assert Poster Via Url Radio Button Option
    cy.get(arCoursesPage.getElementByDataNameAttributeAndIndex(ARCourseSettingsCatalogVisibilityModule.getPosterGroup(), 0) + ' ' +
      ARCourseSettingsCatalogVisibilityModule.getPosterRadioBtn()).contains('Url').click().click()
    //Verify Poster Url Field Does Not Accept >850 Chars
    cy.get(arCoursesPage.getElementByDataNameAttributeAndIndex(ARCourseSettingsCatalogVisibilityModule.getPosterGroup(), 0) + ' ' +
      ARCourseSettingsCatalogVisibilityModule.getPosterFilePathTxtF()).invoke('val', AROCAddEditPage.getLongString(850)).type('a')
    cy.get(arCoursesPage.getElementByDataNameAttributeAndIndex(ARCourseSettingsCatalogVisibilityModule.getPosterGroup(), 0) + ' ' +
      ARCourseSettingsCatalogVisibilityModule.getPosterUrlErrorMsg()).should('contain', miscData.char_850_error)
    //Verify Poster Url Field Does Not Accept HTML
    cy.get(arCoursesPage.getElementByDataNameAttributeAndIndex(ARCourseSettingsCatalogVisibilityModule.getPosterGroup(), 0) + ' ' +
      ARCourseSettingsCatalogVisibilityModule.getPosterFilePathTxtF()).clear().type(commonDetails.textWithHtmlTag)
    AROCAddEditPage.getVShortWait()
    cy.get(arCoursesPage.getPublishBtn()).click()
    AROCAddEditPage.getShortWait()
    cy.get(ARCourseSettingsCatalogVisibilityModule.getCatalogVisibiltySectionErrorMsg()).should('contain', miscData.invalid_chars_error)

    //Assert No More Than 5 Posters Can Be Added
    for (let i = 0; i < 5; i++) {
      cy.get(ARCourseSettingsCatalogVisibilityModule.getAddPosterBtn()).click()
      cy.get(arCoursesPage.getElementByDataNameAttributeAndIndex(ARCourseSettingsCatalogVisibilityModule.getPosterGroup(), i) + ' ' +
        ARCourseSettingsCatalogVisibilityModule.getPosterRadioBtn()).contains('Url').click().click()
      cy.get(arCoursesPage.getElementByDataNameAttributeAndIndex(ARCourseSettingsCatalogVisibilityModule.getPosterGroup(), i) + ' ' +
        ARCourseSettingsCatalogVisibilityModule.getPosterFilePathTxtF()).clear().type(miscData.switching_to_absorb_img_url)
    }
    cy.get(ARCourseSettingsCatalogVisibilityModule.getAddPosterBtnContainer()).should('have.attr', 'aria-disabled', 'true')

    //Delete 4 Posters (Delete lowest -> highest)
    for (let i = 6; i > 2; i--) {
      ARCourseSettingsCatalogVisibilityModule.getPosterDeleteBtnByIndexThenClick(i)
    }

    //Assert Mandatory, Featured, Enable for Mobile App, and Recommended Course Toggles are ON
    for (let i = 0; i < catalogVisibility.toggleFuncs.length; i++) {
      //Verify Toggle is ON
      cy.get(AROCAddEditPage.getElementByDataNameAttribute(catalogVisibility.toggleFuncs[i]) + ' ' + AROCAddEditPage.getToggleStatus())
        .should('have.attr', 'aria-checked', 'true')
    }

    //Assert Featured Course Order Field Persisted
    cy.get(ARCourseSettingsCatalogVisibilityModule.getFeaturedCourseSortOrderTxtF()).should('have.value', '4')

    //Assert Recommended Course Tag Selection Persisted
    cy.get(ARCourseSettingsCatalogVisibilityModule.getRecommendationTagsDDown()).should('contain.text', miscData.auto_tag1)
    //Remove Recommended Course Tag
    cy.get(ARCourseSettingsCatalogVisibilityModule.getRecommendationTagClearBtn()).click()

    //Publish Course
    cy.publishCourse()
  })

  it('Edit OC Course & Verify Image Edits Persisted, Turn Mandatory, Featured Course, and Enable for Mobile App Toggles Off', () => {
    //Assert Thumbnail Image (Name and Size)
    cy.get(ARCourseSettingsCatalogVisibilityModule.getThumbnailSize()).should('contain', 'Thumbnail 229 x 173px')

    //Turn Mandatory, Featured Course, and Enable for Mobile App Toggles OFF
    for (let i = 0; i < catalogVisibility.toggleFuncs.length - 1; i++) {
      cy.get(AROCAddEditPage.getElementByDataNameAttribute(catalogVisibility.toggleFuncs[i]) + ' ' + AROCAddEditPage.getToggleEnabled()).click()
    }

    //Publish Course
    cy.publishCourse()
  })

  it('Edit OC Course & Verify Tag Removal and Toggles are OFF', () => {
    //Assert Mandatory and Featured Course, and Enable for Mobile App Toggles are OFF
    //Assert Recommended Tags Were Removed (Toggle is Now OFF)
    for (let i = 0; i < catalogVisibility.toggleFuncs.length; i++) {
      //Verify Toggle is OFF
      cy.get(AROCAddEditPage.getElementByDataNameAttribute(catalogVisibility.toggleFuncs[i]) + ' ' + AROCAddEditPage.getToggleStatus())
        .should('have.attr', 'aria-checked', 'false')
    }
  })
})