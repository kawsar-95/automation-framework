import { users } from '../../../../../../helpers/TestData/users/users'
import { images, resourcePaths } from '../../../../../../helpers/TestData/resources/resources'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LESideMenu from '../../../../../../helpers/LE/pageObjects/Menu/LESideMenu'
import LEFilterMenu from '../../../../../../helpers/LE/pageObjects/Menu/LEFilterMenu'
import LEManageTemplateMenu from '../../../../../../helpers/LE/pageObjects/Template/LEManageTemplateMenu'
import LEManageTemplateCoursesPage from '../../../../../../helpers/LE/pageObjects/Template/LEManageTemplateCoursesPage'


describe('LE - Nav - Customize Courses Template Settings - My Courses and Catalog', function () {
  //This script uses indexes to identify elements for the menus as there was no way to define them another way
  beforeEach(() => {
      //sign in and navigate to manage template before each test
      cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, "#/login")
      cy.get(LEDashboardPage.getNavMenu()).click()
      LESideMenu.getLEMenuItemsByNameThenClick('Manage Template')
      LEManageTemplateMenu.getManageTemplateMenuItemsByName('Courses').should('be.visible').click()
      cy.url().should('include', '/#/learner-mgmt/courses')
      LEManageTemplateCoursesPage.getManageTemplateCoursesContainerByNameThenClick('My Courses and Catalog')
      
  })

  it('Verify My Courses, Catalog & Resources Banner Image and Filter Search Expanded by Default', () => {
      LEManageTemplateCoursesPage.getTurnOnOffExpandRefineSearchByDefaultToggleBtn('true')
      LEManageTemplateCoursesPage.getUploadAnImage(LEManageTemplateCoursesPage.getCoursesAndCatalogBannerImageUploadModuleLabel(), 'Banner Image', LEManageTemplateCoursesPage.getCoursesAndCatalogBannerImageUploadContainer(), resourcePaths.resource_image_folder + images.moose_filename, 'Upload processing', 'Upload verified')
      cy.get(LEManageTemplateCoursesPage.getUploadImagePreview()).should('have.attr', 'style').should('include','data:image/jpeg')
      cy.get(LEManageTemplateCoursesPage.getContainerSaveBtn()).click()
      cy.get(LEManageTemplateCoursesPage.getSuccessMessage()).should('have.text', 'Changes Saved.')
      //Verify Banner Image has been uploaded in Catalog and Filter Panel is expanded
      cy.get(LEDashboardPage.getNavMenu()).click()
      LESideMenu.getLEMenuItemsByNameThenClick('Catalog')
      cy.get(LEDashboardPage.getMyCoursesCatalogResourcesBanner()).should('have.attr', 'style').should('include', images.moose122_filename)
      cy.get(LEDashboardPage.getNavMenu()).click()
      LESideMenu.getLEMenuItemsByNameThenClick('My Courses')
      cy.get(LEDashboardPage.getMyCoursesCatalogResourcesBanner()).should('have.attr', 'style').should('include', images.moose122_filename)
      cy.get(LEFilterMenu.getSearchFilterTxtF()).should('be.visible')
      cy.get(LEDashboardPage.getNavMenu()).click()
      LESideMenu.getLEMenuItemsByNameThenClick('Resources')
      cy.get(LEDashboardPage.getMyCoursesCatalogResourcesBanner()).should('have.attr', 'style').should('include', images.moose122_filename)
      cy.get(LEDashboardPage.getNavMenu()).click()
      //Going to Catalog a second time because sometimes the Filter Menu is not immediatley expanded on the first Catalog load
      LESideMenu.getLEMenuItemsByNameThenClick('Catalog')
      cy.get(LEFilterMenu.getSearchFilterTxtF()).should('be.visible')
  })

      it('Verify My Courses, Catalog & Resources Banner Image can be deleted and Filter Search Collapsed by Default', () => {
        LEManageTemplateCoursesPage.getToggleClickVerifyStatus(LEManageTemplateCoursesPage.getExpandRefineSearchToggleModule(), 'false')
        cy.get(LEManageTemplateCoursesPage.getCoursesAndCatalogBannerImageUploadModuleLabel()).contains('Banner Image').parents(LEManageTemplateCoursesPage.getCoursesAndCatalogBannerImageUploadContainer()).within(() => {
        cy.get(LEManageTemplateCoursesPage.getDeleteImageBtn()).click()
        })
        cy.get(LEManageTemplateCoursesPage.getContainerSaveBtn()).click()
        cy.get(LEManageTemplateCoursesPage.getSuccessMessage()).should('have.text', 'Changes Saved.')
        //Verify Banner Image has been removed and Filter is collapsed
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('Catalog')
        cy.get(LEDashboardPage.getMyCoursesCatalogResourcesBanner()).should('have.attr', 'style').should('not.include', images.moose_filename)
      cy.get(LEDashboardPage.getNavMenu()).click()
      LESideMenu.getLEMenuItemsByNameThenClick('My Courses')
      cy.get(LEDashboardPage.getMyCoursesCatalogResourcesBanner()).should('have.attr', 'style').should('not.include', images.moose_filename)
      cy.get(LEFilterMenu.getSearchFilterTxtF()).should('not.be.visible')
      cy.get(LEDashboardPage.getNavMenu()).click()
      LESideMenu.getLEMenuItemsByNameThenClick('Resources')
      cy.get(LEDashboardPage.getMyCoursesCatalogResourcesBanner()).should('have.attr', 'style').should('not.include', images.moose_filename)
      cy.get(LEDashboardPage.getNavMenu()).click()
      //Going to Catalog a second time because sometimes the Filter Menu is not immediatley collapsed on the first Catalog load
      LESideMenu.getLEMenuItemsByNameThenClick('Catalog')
      cy.get(LEFilterMenu.getSearchFilterTxtF()).should('not.be.visible')
  })



})