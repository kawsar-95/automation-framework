import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import ARCourseSettingsEnrollmentRulesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
import arCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import ARSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import { commonDetails} from '../../../../../../helpers/TestData/Courses/commonDetails'
import { courses } from '../../../../../../helpers/TestData/Courses/courses'
import { users } from '../../../../../../helpers/TestData/users/users'
import ARCourseSettingsCatalogVisibilityModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCatalogVisibility.module'
import { miscData } from '../../../../../../helpers/TestData/Misc/misc'
import ARTagsAddEditPage from '../../../../../../helpers/AR/pageObjects/Tags/ARTagsAddEditPage'
import { cbDetails } from '../../../../../../helpers/TestData/Courses/cb'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LECatalogPage from '../../../../../../helpers/LE/pageObjects/Catalog/LECatalogPage'
import LEFilterMenu from '../../../../../../helpers/LE/pageObjects/Menu/LEFilterMenu'
import LESideMenu from '../../../../../../helpers/LE/pageObjects/Menu/LESideMenu'
import ARCBAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/CB/ARCBAddEditPage'

describe('C961 AUT-163, AR - CB - An Administrator can set Catalog Visibility Settings for a Course Bundle (cloned)', () => {

    after(() => {
        cy.deleteCourse(commonDetails.courseID, 'course-bundles')
    })

    it('Create Course Bundle', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getCoursesReport()
        cy.createCourse('Course Bundle')
        ARSelectModal.SearchAndSelectFunction([courses.oc_filter_01_name])

        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')
     
        // 2. Add Tag(s)
        ARTagsAddEditPage.navigateToTag()
        ARTagsAddEditPage.getChooseAndClick()
        cy.get(ARTagsAddEditPage.getTagInput()).click().type(commonDetails.tagName)
        cy.get(ARTagsAddEditPage.getSearchOptions()).contains(commonDetails.tagName).click()

        // Open Catalog Visibility Section
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Catalog Visibility')).click()

        // 1. Add Category 
        cy.get(ARCourseSettingsCatalogVisibilityModule.getChooseCategoryBtn()).click()
        ARSelectModal.SearchAndSelectFunction([courses.category_01_name])
    	
        // 3. Add a Thumbnail Via URL Source
        cy.get(ARCourseSettingsCatalogVisibilityModule.getThumbnailRadioBtn()).contains('Url').click()
        cy.get(ARCourseSettingsCatalogVisibilityModule.getThumbnailUrlTxtF()).type(miscData.switching_to_absorb_img_url)

        // 4. Add one or up to 5 posters
        // Assert No More Than 5 Posters Can Be Added
        for (let i = 0; i < 5; i++) {
            cy.get(ARCourseSettingsCatalogVisibilityModule.getAddPosterBtn()).click()
            cy.get(arCoursesPage.getElementByDataNameAttributeAndIndex(ARCourseSettingsCatalogVisibilityModule.getPosterGroup(), i) + ' ' +
            ARCourseSettingsCatalogVisibilityModule.getPosterRadioBtn()).contains('Url').click().click()
            cy.get(arCoursesPage.getElementByDataNameAttributeAndIndex(ARCourseSettingsCatalogVisibilityModule.getPosterGroup(), i) + ' ' +
            ARCourseSettingsCatalogVisibilityModule.getPosterFilePathTxtF()).clear().type(miscData.switching_to_absorb_img_url)
        }
        cy.get(ARCourseSettingsCatalogVisibilityModule.getAddPosterBtnContainer()).should('have.attr', 'aria-disabled', 'true')

        // Delete 4 Posters (Delete lowest -> highest)
        for (let i = 6; i > 2; i--) {
            ARCourseSettingsCatalogVisibilityModule.getPosterDeleteBtnByIndexThenClick(i)
        }

        // 5. Turn on Featured Course toggle
        arDashboardPage.generalToggleSwitch('true' , ARCourseSettingsCatalogVisibilityModule.getFeaturedCourseToggleContainer())

        // Assert Featured Course Sort Order Field Does Not Accept Negative Values
        cy.get(ARCourseSettingsCatalogVisibilityModule.getFeaturedCourseSortOrderTxtF()).type('-1')
        cy.get(ARCourseSettingsCatalogVisibilityModule.getFeaturedCourseSortOrderErrorMsg()).should('contain', miscData.negative_chars_error)

        // Assert Featured Course Sort Order Field Does Not Accept Non-Numeric Characters
        cy.get(ARCourseSettingsCatalogVisibilityModule.getFeaturedCourseSortOrderTxtF()).clear().type('a').blur()
        cy.get(ARCourseSettingsCatalogVisibilityModule.getFeaturedCourseSortOrderTxtF()).should('have.value', '')

        // Add Valid Featured Course Sort Order
        cy.get(ARCourseSettingsCatalogVisibilityModule.getFeaturedCourseSortOrderTxtF()).type('4')

        // 6. Turn on Recommended Courses toggle
        arDashboardPage.generalToggleSwitch('true' , ARCourseSettingsCatalogVisibilityModule.getRecommendedCoursesToggleContainer())

        // Add Recommendation Tag(s)
        cy.get(ARCourseSettingsCatalogVisibilityModule.getRecommendationTagsDDown()).click()
        cy.get(ARCourseSettingsCatalogVisibilityModule.getRecommendationTagsSearchTxt()).type(miscData.auto_tag2)
        ARCourseSettingsCatalogVisibilityModule.getRecommendationTagOpt(miscData.auto_tag2)
        cy.get(ARCourseSettingsCatalogVisibilityModule.getRecommendationTagsDDown()).click()
        cy.get(arDashboardPage.getWaitSpinner()).should('not.exist')

        // Asserting Course should be saved sucessfully.
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
    })

    it('Login to LE, Attempt to Enroll in Full Session, Verify Waitlist Warning', () => {
        cy.apiLoginWithSession(users.learner01.learner_01_username, users.learner01.learner_01_password)

        // 5. verify Course Bundle shows up in the Featured Courses ribbon on the learner side
        // and in the correct order specified
        LEDashboardPage.verifyRibbonCardByCourseName('Featured Courses', cbDetails.courseName)

        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('Catalog')
        cy.get(LECatalogPage.getCatalogPageTitle(), {timeout: 30000}).contains('Catalog')
        // 1. verify Category visible in learner side
        LEFilterMenu.showfilters()
        LEFilterMenu.setShowCategories('true')
        cy.get(LECatalogPage.getCategorySelector(courses.category_01_name)).should('be.visible').click()
        cy.get(LECatalogPage.getCourseCrdName(), { timeout: 100000 }).should('be.visible').and('contain',`${cbDetails.courseName}`)

        // 3. verify thumbnail displays on the learner sides
        LECatalogPage.verifyThumbnailByCourseName(cbDetails.courseName, miscData.switching_to_absorb_img_url)

        // 2. verify Tag(s) visible in learner side
        LEDashboardPage. getSpecificCourseCardBtnThenClickOnName(cbDetails.courseName)
        cy.get(LECatalogPage.getTagList()).should('contain', commonDetails.tagName)

        // 4. verify Posters displays on the learner side
        cy.get(LECatalogPage.getPosterImage()).should('be.visible')
    })

    it('Edit Course Bundle', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getCoursesReport()
        cy.editCourse(cbDetails.courseName)

        // 2. Edit Tag(s)
        ARTagsAddEditPage.navigateToTag()
        cy.get(ARTagsAddEditPage.getSelectedTags()).should('contain', commonDetails.tagName)

        ARTagsAddEditPage.getChooseAndClick()
        cy.get(ARTagsAddEditPage.getTagInput()).click().type(miscData.auto_tag3)
        cy.get(ARTagsAddEditPage.getSearchOptions()).contains(miscData.auto_tag3).click()

        // Open Catalog Visibility Section
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Catalog Visibility')).click()

        // 1. Edit Category 
        cy.get(ARCourseSettingsCatalogVisibilityModule.getCatagoryPickerF()).should('contain.text', courses.category_01_name)
        cy.get(ARCourseSettingsCatalogVisibilityModule.getChooseCategoryBtn()).click()
        ARSelectModal.SearchAndSelectFunction([courses.category_02_name])
    	
        // 3. Edit a Thumbnail Via URL Source
        cy.get(ARCourseSettingsCatalogVisibilityModule.getThumbnailRadioBtn()).contains('Url').click()
        cy.get(ARCourseSettingsCatalogVisibilityModule.getThumbnailUrlTxtF()).clear().type(miscData.switching_to_absorb_img_url)

        // 4. Edit Posters
        cy.get(arCoursesPage.getElementByDataNameAttributeAndIndex(ARCourseSettingsCatalogVisibilityModule.getPosterGroup(), 0) + ' ' +
        ARCourseSettingsCatalogVisibilityModule.getPosterFilePathTxtF()).clear().type(miscData.switching_to_absorb_img_url)
        
        //5. Edit Featured Course Sort Order
        cy.get(ARCourseSettingsCatalogVisibilityModule.getFeaturedCourseSortOrderTxtF()).type(3)    
        
        //6. edit Recommendation Tag(s)
        cy.get(ARCourseSettingsCatalogVisibilityModule.getRecommendationTagsDDown()).click()
        cy.get(ARCourseSettingsCatalogVisibilityModule.getRecommendationTagsSearchTxt()).type(miscData.auto_tag2)
        ARCourseSettingsCatalogVisibilityModule.getRecommendationTagOpt(miscData.auto_tag2)
        cy.get(ARCourseSettingsCatalogVisibilityModule.getRecommendationTagsDDown()).click()
        cy.get(arDashboardPage.getWaitSpinner()).should('not.exist')

        // Asserting Course should be saved sucessfully
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
    })

    it('Edit Course Bundle and romove Category and Tag(s)', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getCoursesReport()
        cy.editCourse(cbDetails.courseName)

        // 2. Remove Tag(s)
        ARTagsAddEditPage.navigateToTag()
        ARTagsAddEditPage.deselectTagByLabel(commonDetails.tagName)
        ARTagsAddEditPage.deselectTagByLabel(miscData.auto_tag3)

        // Open Catalog Visibility Section
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Catalog Visibility')).click()

        // 1. remove Category 
        cy.get(ARCourseSettingsCatalogVisibilityModule.getCatagoryPickerF()).should('contain.text', courses.category_02_name)
        cy.get(ARCourseSettingsCatalogVisibilityModule.getClearCatagoryBtn()).click()
        cy.get(ARCourseSettingsCatalogVisibilityModule.getCatagoryPickerF()).should('contain.text', 'No Category')

        // 3. Remove Thumbnail 
        cy.get(ARCourseSettingsCatalogVisibilityModule.getThumbnailDeleteBtn()).click()

        // 4. Remove Posters
        ARCourseSettingsCatalogVisibilityModule.getPosterDeleteBtnByIndexThenClick()

        // 5. Turn off Featured Course toggle
        arDashboardPage.generalToggleSwitch('false' , ARCourseSettingsCatalogVisibilityModule.getFeaturedCourseToggleContainer())

       // 6. Turn off Recommended Courses toggle
       arDashboardPage.generalToggleSwitch('false' , ARCourseSettingsCatalogVisibilityModule.getRecommendedCoursesToggleContainer())

        // Asserting Course should be saved sucessfully
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
    })
})