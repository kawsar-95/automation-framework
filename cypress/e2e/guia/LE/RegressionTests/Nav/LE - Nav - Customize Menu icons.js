import { users } from '../../../../../../helpers/TestData/users/users'
import { images, resourcePaths } from '../../../../../../helpers/TestData/resources/resources'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LESideMenu from '../../../../../../helpers/LE/pageObjects/Menu/LESideMenu'
import LEManageTemplateMenu from '../../../../../../helpers/LE/pageObjects/Template/LEManageTemplateMenu'
import LEManageTemplateSettingsPage from '../../../../../../helpers/LE/pageObjects/Template/LEManageTemplateSettingsPage'
import LEEditMenuModal from '../../../../../../helpers/LE/pageObjects/Modals/LEEditMenu.modal'


describe('LE - Nav - Customize Menu Icons', function () {
    //This script uses indexes to identify elements for the menus as there was no way to define them another way
    beforeEach(() => {
        cy.viewport(1200, 850) //Enlarge viewport so tiles display text within them
        //sign in and navigate to manage template before each test
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, "#/login")
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('Manage Template')
        //Open content container
        LEManageTemplateMenu.getManageTemplateMenuItemsByName('Settings').should('be.visible').click()
        LEManageTemplateSettingsPage.getManageTemplateSettingsContainerByNameThenClick('Private Menu')
        cy.url().should('include', '/#/learner-mgmt/settings')
    })

    it('Verify New Menu Icon can be added and Customized', () => {
        //Edit Catalog Tile in the Tile container
        cy.get(LEManageTemplateSettingsPage.getMenuItemDropDByIndex(1, 1)).select('Admin')
        cy.get(LEManageTemplateSettingsPage.getAddMenuBtn()).click()
        cy.get(LEManageTemplateSettingsPage.getMenuEditBtnByIndex(10)).click()
        LEEditMenuModal.getUploadAnImage(LEEditMenuModal.getUploadMenuImageModuleLabel(), 'Customize Menu Icon', 'div', resourcePaths.resource_image_folder + images.umbrella_icon_filename, 'Upload processing', 'Upload verified')
        cy.get(LEEditMenuModal.getUploadImagePreview()).should('have.attr', 'style').should('include','data:image/png')
        cy.get(LEEditMenuModal.getSaveBtn()).click()
        cy.get(LEManageTemplateSettingsPage.getContainerSaveBtn()).click()
        //Verify new customized icon in menu
        cy.get(LEDashboardPage.getNavMenu()).click()
        LEDashboardPage.getVerifyHamburgerMenuItemsIcon('Dashboard','umbrella')
    })

        it('Verify Menu Item is removed after Deleted', () => {
        //Delete Menu Item
        cy.get(LEManageTemplateSettingsPage.getMenuItemDeleteBtnByIndex(10)).click()
        cy.get(LEManageTemplateSettingsPage.getContainerSaveBtn()).click()
        //Verify new customized icon in menu
        cy.get(LEDashboardPage.getNavMenu()).click()
        LEDashboardPage.getVerifyHamburgerMenuItemsIcon('Dashboard','umbrella','notExist')
    })
})