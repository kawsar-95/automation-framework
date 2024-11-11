import { users } from '../../../../../../helpers/TestData/users/users'
import { courses } from '../../../../../../helpers/TestData/Courses/courses'
import { images, resourcePaths } from '../../../../../../helpers/TestData/resources/resources'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LESideMenu from '../../../../../../helpers/LE/pageObjects/Menu/LESideMenu'
import LECourseDetailsModal from '../../../../../../helpers/LE/pageObjects/Modals/LECourseDetails.modal'
import LEFilterMenu from '../../../../../../helpers/LE/pageObjects/Menu/LEFilterMenu'
import LEManageTemplateMenu from '../../../../../../helpers/LE/pageObjects/Template/LEManageTemplateMenu'
import LEManageTemplateCoursesPage from '../../../../../../helpers/LE/pageObjects/Template/LEManageTemplateCoursesPage'


describe('LE - Nav - Customize Courses Template Settings - Course Details', function () {
  //This script uses indexes to identify elements for the menus as there was no way to define them another way
  beforeEach(() => {
      //sign in and navigate to manage template before each test
      cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, "#/login")
      cy.get(LEDashboardPage.getNavMenu()).click()
      LESideMenu.getLEMenuItemsByNameThenClick('Manage Template')
      LEManageTemplateMenu.getManageTemplateMenuItemsByName('Courses').should('be.visible').click()
      LEManageTemplateCoursesPage.getManageTemplateCoursesContainerByNameThenClick('Course Details')
      cy.url().should('include', '/#/learner-mgmt/courses')
  })

  it('Verify Banner Image Can be added', () => {
      
      LEManageTemplateCoursesPage.getUploadAnImage(LEManageTemplateCoursesPage.getBannerImageUploadModuleLabel(), 'Banner Image', LEManageTemplateCoursesPage.getBannerImageUploadContainer(), resourcePaths.resource_image_folder + images.moose_filename, 'Upload processing', 'Upload verified')
      cy.get(LEManageTemplateCoursesPage.getUploadImagePreview()).should('have.attr', 'style').should('include','data:image/jpeg')
      cy.get(LEManageTemplateCoursesPage.getContainerSaveBtn()).click()
      cy.get(LEManageTemplateCoursesPage.getSuccessMessage()).should('have.text', 'Changes Saved.')
      //Verify Banner Image has been uploaded in Course Details
      cy.get(LEDashboardPage.getNavMenu()).click()
      LESideMenu.getLEMenuItemsByNameThenClick('Catalog')
      LEFilterMenu.SearchForCourseByName(courses.oc_filter_01_name)
      cy.get(LEDashboardPage.getCourseCardName(), { timeout: 15000 }).contains(courses.oc_filter_01_name, { timeout: 15000 }).click()
        cy.get(LECourseDetailsModal.getCourseDetailsBanner()).should('have.attr', 'style').should('include', 'moose')
      cy.get(LECourseDetailsModal.getModal() + ' ' + LECourseDetailsModal.getXBtn()).click()
  })

      it('Verify Banner Image can be Deleted', () => {
        cy.get(LEManageTemplateCoursesPage.getBannerImageUploadModuleLabel()).contains('Banner Image').parents(LEManageTemplateCoursesPage.getBannerImageUploadContainer()).within(() => {
        cy.get(LEManageTemplateCoursesPage.getDeleteImageBtn()).click()
        })
        cy.get(LEManageTemplateCoursesPage.getContainerSaveBtn()).click()
        cy.get(LEManageTemplateCoursesPage.getSuccessMessage()).should('have.text', 'Changes Saved.')
        //Verify Banner Image has been removed
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('Catalog')
        LEFilterMenu.SearchForCourseByName(courses.oc_filter_01_name)
        cy.get(LEDashboardPage.getCourseCardName(), { timeout: 15000 }).contains(courses.oc_filter_01_name, { timeout: 15000 }).click()
        cy.get(LECourseDetailsModal.getCourseDetailsBanner()).should('have.attr', 'style').should('not.include', images.moose_filename)

})

})