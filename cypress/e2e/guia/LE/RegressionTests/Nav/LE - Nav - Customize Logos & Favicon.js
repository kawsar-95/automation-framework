import { users } from '../../../../../../helpers/TestData/users/users'
import { miscData } from '../../../../../../helpers/TestData/Misc/misc'
import { images, resourcePaths } from '../../../../../../helpers/TestData/resources/resources'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LESideMenu from '../../../../../../helpers/LE/pageObjects/Menu/LESideMenu'
import LEManageTemplateMenu from '../../../../../../helpers/LE/pageObjects/Template/LEManageTemplateMenu'
import LEManageTemplateSettingsPage from '../../../../../../helpers/LE/pageObjects/Template/LEManageTemplateSettingsPage'


describe('LE - Nav - Customize Logos and Favicon', function () {
    beforeEach(() => {
        //sign in and navigate to manage template before each test
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, "#/login")
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('Manage Template')
        //Open Logo Settings
        
        LEManageTemplateMenu.getManageTemplateMenuItemsByName('Settings').should('be.visible').click()
        LEManageTemplateSettingsPage.getManageTemplateSettingsContainerByNameThenClick('Logo')
        cy.url().should('include', '/#/learner-mgmt/settings')
    })

    it('Verify New Header Logo Image, Mobile App Logo image and Favicon can be added and visible in Learner Experience', () => {
        //Upload Header Logo
        LEManageTemplateSettingsPage.getUploadAnImage(LEManageTemplateSettingsPage.getUploadHeaderLogoImageModuleLabel(), '(Suggested size 200 x 54 px and 300 KB max size)', LEManageTemplateSettingsPage.getUploadHeaderLogoImageContainer(), resourcePaths.resource_image_folder + images.paw_print_logo_filename, 'Upload processing', 'Upload verified')
        //Upload Mobile Header Logo
        LEManageTemplateSettingsPage.getUploadAnImage(LEManageTemplateSettingsPage.getUploadHeaderLogoImageModuleLabel(), '(Suggested size 1240 x 624 px and 600 KB max size)', LEManageTemplateSettingsPage.getUploadHeaderLogoImageContainer(), resourcePaths.resource_image_folder + images.umbrella_icon_filename, 'Upload processing', 'Upload verified')
        //Upload Favicon
        LEManageTemplateSettingsPage.getUploadAnImage(LEManageTemplateSettingsPage.getUploadHeaderLogoImageModuleLabel(), '(Suggested size 16 x 16 px and 300 KB max size)', LEManageTemplateSettingsPage.getUploadHeaderLogoImageContainer(), resourcePaths.resource_image_folder + images.umbrella_icon_filename, 'Upload processing', 'Upload verified')
        cy.get(LEManageTemplateSettingsPage.getContainerSaveBtn()).click()
        cy.get(LEManageTemplateSettingsPage.getSuccessMessage()).should('have.text', 'Changes Saved.')
        cy.get(LEManageTemplateSettingsPage.getHeaderLogoBtn()).click()
        //Verify Header Logo has been updated
        cy.get(LEManageTemplateSettingsPage.getHeaderLogoBtn(), {timeout: 15000}).should('have.attr', 'style').should('include','paw')
        //Verify Favicon has been updated - two attributes in document head
        cy.visit('/').document().its('head').find(LEManageTemplateSettingsPage.getHeadShortcutIcon()).should('have.attr', 'href').should('include', 'umbrella')
        cy.visit('/').document().its('head').find(LEManageTemplateSettingsPage.getHeadAppleTouchIcon()).should('have.attr', 'href').should('include', 'umbrella')
    })

    it('Delete Header Logo and Favicon and verify they have been deleted in in Learner Experience', () => {
        //Delete logo and favicon images
        cy.get(LEManageTemplateSettingsPage.getUploadHeaderLogoImageModuleLabel()).contains(`(Suggested size 200 x 54 px and 300 KB max size)`).parents(LEManageTemplateSettingsPage.getUploadHeaderLogoImageContainer()).within(() => {
            cy.get(LEManageTemplateSettingsPage.getDeleteImageBtn()).click()
        })
        cy.get(LEManageTemplateSettingsPage.getUploadHeaderLogoImageModuleLabel()).contains(`(Suggested size 1240 x 624 px and 600 KB max size)`).parents(LEManageTemplateSettingsPage.getUploadHeaderLogoImageContainer()).within(() => {
            cy.get(LEManageTemplateSettingsPage.getDeleteImageBtn()).click()
        })
        cy.get(LEManageTemplateSettingsPage.getUploadHeaderLogoImageModuleLabel()).contains(`(Suggested size 16 x 16 px and 300 KB max size)`).parents(LEManageTemplateSettingsPage.getUploadHeaderLogoImageContainer()).within(() => {
            cy.get(LEManageTemplateSettingsPage.getDeleteImageBtn()).click()
        })
        cy.get(LEManageTemplateSettingsPage.getContainerSaveBtn()).click()
        cy.get(LEManageTemplateSettingsPage.getSuccessMessage()).should('have.text', 'Changes Saved.')
        //Verify preview tile has default background
        cy.get(LEManageTemplateSettingsPage.getUploadImagePreview()).should('not.exist')
        cy.get(LEManageTemplateSettingsPage.getHeaderLogoBtn()).click()
        cy.get(LEManageTemplateSettingsPage.getHeaderLogoBtn()).should('have.attr', 'style').should('include','logo.png')
        cy.visit('/').document().its('head').get(LEManageTemplateSettingsPage.getHeadShortcutIcon()).should('not.exist')
        cy.visit('/').document().its('head').get(LEManageTemplateSettingsPage.getHeadAppleTouchIcon()).should('not.exist')
    })
})