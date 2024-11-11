import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARCourseSettingsCatalogVisibilityModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCatalogVisibility.module'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import arCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import ARILCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage'
import { ilcDetails, catalogVisibility } from '../../../../../../helpers/TestData/Courses/ilc'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { miscData } from '../../../../../../helpers/TestData/Misc/misc'
import { users } from '../../../../../../helpers/TestData/users/users'

describe('AR - CED - ILC - Catalog Visibility Section', function(){

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Course
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        
    })

    after(function() {
        //Delete Course
        cy.deleteCourse(commonDetails.courseID, 'instructor-led-courses-new')
    })

    it('Verify Catalog Visibility Toggles, Radio Buttons and Fields, Upload Images, & Publish ILC Course', () => {
        cy.createCourse('Instructor Led')

        //Open Catalog Visibility Section
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Catalog Visibility')).click()
        ARILCAddEditPage.getShortWait()

        //Add a Thumbnail Via URL Source
        cy.get(ARCourseSettingsCatalogVisibilityModule.getThumbnailRadioBtn()).contains('Url').click()
        cy.get(ARCourseSettingsCatalogVisibilityModule.getThumbnailUrlTxtF()).type(miscData.switching_to_absorb_img_url)

        //Add Poster Via URL Radio Button Option
        cy.get(ARCourseSettingsCatalogVisibilityModule.getAddPosterBtn()).click()
        cy.get(arCoursesPage.getElementByDataNameAttributeAndIndex(ARCourseSettingsCatalogVisibilityModule.getPosterGroup(), 0) + ' ' +
            ARCourseSettingsCatalogVisibilityModule.getPosterRadioBtn()).contains('Url').click().click()

        cy.get(arCoursesPage.getElementByDataNameAttributeAndIndex(ARCourseSettingsCatalogVisibilityModule.getPosterGroup(), 0) + ' ' +
            ARCourseSettingsCatalogVisibilityModule.getPosterFilePathTxtF()).type(catalogVisibility.posterUrl)

        //Toggle Mandatory Course to ON
        cy.get(ARILCAddEditPage.getElementByDataNameAttribute(ARCourseSettingsCatalogVisibilityModule.getMandatoryCourseToggleContainer()) + ' ' + ARILCAddEditPage.getToggleDisabled()).click()

        //Toggle Featured Course to ON
        cy.get(ARILCAddEditPage.getElementByDataNameAttribute(ARCourseSettingsCatalogVisibilityModule.getFeaturedCourseToggleContainer()) + ' ' + ARILCAddEditPage.getToggleDisabled()).click()

        //Enter Featured Course Sort Order
        cy.get(ARCourseSettingsCatalogVisibilityModule.getFeaturedCourseSortOrderTxtF()).type('5')

        //Toggle Enable Recommended Course to ON
        cy.get(ARILCAddEditPage.getElementByDataNameAttribute(ARCourseSettingsCatalogVisibilityModule.getRecommendedCoursesToggleContainer()) + ' ' + ARILCAddEditPage.getToggleDisabled()).click()
        ARILCAddEditPage.getShortWait()

        //Add Recommendation Tags
        cy.get(ARCourseSettingsCatalogVisibilityModule.getRecommendationTagsDDown()).click()
        cy.get(ARCourseSettingsCatalogVisibilityModule.getRecommendationTagsSearchTxt()).type(miscData.auto_tag1)
        ARCourseSettingsCatalogVisibilityModule.getRecommendationTagOpt(miscData.auto_tag1)
        ARILCAddEditPage.getMediumWait()

        cy.get(ARCourseSettingsCatalogVisibilityModule.getRecommendationTagsDDown()).click()
        ARILCAddEditPage.getShortWait()

        //Publish ILC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
    })

    it('Edit ILC Course & Verify Images, Radio Buttons, Toggles, and Fields Have Been Persisted, Delete Poster', () => {
        //Filter for Course & Edit it
        cy.editCourse(ilcDetails.courseName)

        //Open Catalog Visibility Section
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Catalog Visibility')).click()
        ARILCAddEditPage.getShortWait()

        //Assert Thumbnail Image Name and Size
        cy.get(ARCourseSettingsCatalogVisibilityModule.getThumbnailSize()).should('contain', 'Thumbnail 229 x 173px')

        //Assert Poster Image Name and Size
        cy.get(ARILCAddEditPage.getElementByAriaLabelAttribute(ARCourseSettingsCatalogVisibilityModule.getPosterFileByName(commonDetails.posterImgName_1)))
            .should('have.attr', 'style', 'min-height: 173px; min-width: 229px; max-height: 173px; max-width: 229px; object-fit: contain;')

        //Delete Poster Image
        ARCourseSettingsCatalogVisibilityModule.getPosterDeleteBtnThenClick(commonDetails.posterImgName_1)
        ARILCAddEditPage.getShortWait()

        //Assert All Toggles are ON
        cy.get(ARILCAddEditPage.getElementByDataNameAttribute(ARCourseSettingsCatalogVisibilityModule.getMandatoryCourseToggleContainer()) + ' ' + ARILCAddEditPage.getToggleStatus())
            .should('have.attr', 'aria-checked', 'true')
        cy.get(ARILCAddEditPage.getElementByDataNameAttribute(ARCourseSettingsCatalogVisibilityModule.getFeaturedCourseToggleContainer()) + ' ' + ARILCAddEditPage.getToggleStatus())
            .should('have.attr', 'aria-checked', 'true')
        cy.get(ARILCAddEditPage.getElementByDataNameAttribute(ARCourseSettingsCatalogVisibilityModule.getRecommendedCoursesToggleContainer()) + ' ' + ARILCAddEditPage.getToggleStatus())
            .should('have.attr', 'aria-checked', 'true')

        //Publish ILC
        cy.publishCourse()
    })

    it('Edit ILC Course & Assert Poster Was Deleted', () => {
        //Filter for Course & Edit it
        cy.editCourse(ilcDetails.courseName)
        ARILCAddEditPage.getMediumWait()

        //Open Catalog Visibility Section
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Catalog Visibility')).click()
        ARILCAddEditPage.getShortWait()

        //Assert That There are No Posters in the ILC
        ARCourseSettingsCatalogVisibilityModule.getNoPostersDescription()
    })
})