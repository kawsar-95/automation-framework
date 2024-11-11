import LEDashboardPage from "../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage"
import LESideMenu from "../../../../../../helpers/LE/pageObjects/Menu/LESideMenu"
import LEManageTemplateCoursesPage from "../../../../../../helpers/LE/pageObjects/Template/LEManageTemplateCoursesPage"
import LEManageTemplateMenu from "../../../../../../helpers/LE/pageObjects/Template/LEManageTemplateMenu"
import { images, resourcePaths } from "../../../../../../helpers/TestData/resources/resources"
import { users } from "../../../../../../helpers/TestData/users/users"

describe("C6360 - LE - Regress - Manage Template - My Courses and Catalog - Banner Image ", () => {
    beforeEach(() => {
        //sign in and navigate to manage template before each test
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, "#/login")
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('Manage Template')
        LEManageTemplateMenu.getManageTemplateMenuItemsByName('Courses').should('be.visible').click()
        cy.url().should('include', '/#/learner-mgmt/courses')
        //cy.get(LEDashboardPage.getElementByTitleAttribute("User Warning Message")).click()
        LEManageTemplateCoursesPage.getManageTemplateCoursesContainerByNameThenClick('My Courses and Catalog')

    })

    it('Verify My Courses, Catalog & Resources Banner Image and Filter Search Expanded by Default', () => {
        //Upload Large Image
        LEManageTemplateCoursesPage.getUploadWrongImage(LEManageTemplateCoursesPage.getCoursesAndCatalogBannerImageUploadModuleLabel(), 'Banner Image', LEManageTemplateCoursesPage.getCoursesAndCatalogBannerImageUploadContainer(), resourcePaths.resource_image_folder + images.wave_filename, 'Maximum file size exceeded')
        //Delete the uploaded image 
        cy.get(LEManageTemplateCoursesPage.getCoursesAndCatalogBannerImageUploadModuleLabel()).contains('Banner Image').parents(LEManageTemplateCoursesPage.getCoursesAndCatalogBannerImageUploadContainer()).within(() => {
            cy.get(LEManageTemplateCoursesPage.getDeleteImageBtn()).click()
        })
        //Uploading Correct image 
        LEManageTemplateCoursesPage.getUploadAnImage(LEManageTemplateCoursesPage.getCoursesAndCatalogBannerImageUploadModuleLabel(), 'Banner Image', LEManageTemplateCoursesPage.getCoursesAndCatalogBannerImageUploadContainer(), resourcePaths.resource_image_folder + images.moose_filename, 'Upload processing', 'Upload verified')
        LEManageTemplateCoursesPage.getToggleClickVerifyStatus(LEManageTemplateCoursesPage.getExpandRefineSearchToggleModule(), 'true')
        cy.get(LEManageTemplateCoursesPage.getUploadImagePreview()).should('have.attr', 'style').should('include', 'data:image/jpeg')
        cy.get(LEManageTemplateCoursesPage.getContainerSaveBtn()).click({ force: true })
        cy.get(LEManageTemplateCoursesPage.getSuccessMessage()).should('have.text', 'Changes Saved.')
        //Verify Banner Image has been removed and Filter is collapsed
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('Catalog')
        cy.get(LEDashboardPage.getMyCoursesCatalogResourcesBanner()).should('have.attr', 'style').should('not.include', images.moose_filename)
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('My Courses')
        cy.get(LEDashboardPage.getMyCoursesCatalogResourcesBanner()).should('have.attr', 'style').should('not.include', images.moose_filename)
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('Resources')
        cy.get(LEDashboardPage.getMyCoursesCatalogResourcesBanner()).should('have.attr', 'style').should('not.include', images.moose_filename)
        cy.get(LEDashboardPage.getNavMenu()).click()
    })

    it('Verify My Courses, Catalog & Resources Banner Image can be deleted and Filter Search Collapsed by Default', () => {
        cy.get(LEManageTemplateCoursesPage.getCoursesAndCatalogBannerImageUploadModuleLabel()).contains('Banner Image').parents(LEManageTemplateCoursesPage.getCoursesAndCatalogBannerImageUploadContainer()).within(() => {
            cy.get(LEManageTemplateCoursesPage.getDeleteImageBtn()).click()
        })
        LEManageTemplateCoursesPage.getToggleClickVerifyStatus(LEManageTemplateCoursesPage.getExpandRefineSearchToggleModule(), 'false')
        cy.get(LEManageTemplateCoursesPage.getContainerSaveBtn()).click({ force: true })
        cy.get(LEManageTemplateCoursesPage.getSuccessMessage()).should('have.text', 'Changes Saved.')
        //Verify Banner Image has been removed and Filter is collapsed
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('Catalog')
        cy.get(LEDashboardPage.getMyCoursesCatalogResourcesBanner()).should('have.attr', 'style').should('not.include', images.moose_filename)
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('My Courses')
        cy.get(LEDashboardPage.getMyCoursesCatalogResourcesBanner()).should('have.attr', 'style').should('not.include', images.moose_filename)
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('Resources')
        cy.get(LEDashboardPage.getMyCoursesCatalogResourcesBanner()).should('have.attr', 'style').should('not.include', images.moose_filename)
        cy.get(LEDashboardPage.getNavMenu()).click()

    })
})