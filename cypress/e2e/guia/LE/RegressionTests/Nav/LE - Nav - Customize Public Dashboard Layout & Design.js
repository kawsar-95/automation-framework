import { users } from '../../../../../../helpers/TestData/users/users'
import { miscData } from '../../../../../../helpers/TestData/Misc/misc'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LESideMenu from '../../../../../../helpers/LE/pageObjects/Menu/LESideMenu'
import LEManageTemplateMenu from '../../../../../../helpers/LE/pageObjects/Template/LEManageTemplateMenu'
import LEManageTemplatePublicDashboardPage from '../../../../../../helpers/LE/pageObjects/Template/LEManageTemplatePublicDashboardPage'
import LEManageTemplateAndDesign from '../../../../../../helpers/LE/pageObjects/Template/LEManageTemplateAndDesign'

describe('LE - Nav - Customize Public Dashboard Layout & Design', function () {

    beforeEach(() => {
        
        cy.viewport(1200, 850) //Enlarge viewport so tiles display text within them
        
        // Sign in and navigate to manage template before each test
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, "#/login")
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('Manage Template')
        
        // Open content container
        LEManageTemplateMenu.getManageTemplateMenuItemsByName('Public Dashboard').should('be.visible').click()
        LEManageTemplatePublicDashboardPage.getManageTemplatePublicDashContainerByNameThenClick('Advanced')
        cy.url().should('include', '/#/learner-mgmt/public-dashboard')
    })

    it('Verify Dashboard Layout & Design can be Customized', () => {
        
        // Edit Catalog Tile in the Tile container
        cy.get(LEManageTemplateAndDesign.getMaxScreenWidthDDown()).select('Custom')
        cy.get(LEManageTemplateAndDesign.getMaxScreenWidthDDown()).find('option:selected').should('have.text', 'Custom', 'be.visible')
        cy.get(LEManageTemplateAndDesign.getCustomMaxWidthTxtF()).type('800')

        // Verify custom background can be uploaded
        LEManageTemplateAndDesign.getUploadAnImage(LEManageTemplateAndDesign.getBackgroundImageModuleLabelElement(), 'Background Image', LEManageTemplateAndDesign.getBackgroundImageModuleContainer(), miscData.resource_image_folder_path + miscData.billboard_01_filename, 'Upload processing', 'Upload verified')

        // Select "Repeat" Background Image Display
        LEManageTemplateAndDesign.getBackgroundDisplayRadioBtnAndClick(LEManageTemplateAndDesign.getBackgroundImageDisplayContainer(), 'Repeat')
        cy.get(LEManageTemplateAndDesign.getUploadImagePreview()).should('have.attr', 'class').should('include','background_image_repeat')
        LEManageTemplateAndDesign.getBackgroundDisplayRadioBtnAndClick(LEManageTemplateAndDesign.getBackgroundImageDisplayContainer(), 'Full Screen')
        cy.get(LEManageTemplateAndDesign.getUploadImagePreview()).should('have.attr', 'class').should('not.include','background_image_repeat')

        // Verify all background image alignments can be set
        for (let i = 0; i < miscData.background_image_alignments[0].length; i++ ) {
            let prefix = miscData.background_image_alignments[0][i];
                for (let j = 0; j < miscData.background_image_alignments[0].length; j++) {
                    cy.get(LEManageTemplateAndDesign.getBackgroundAlignmentBtn(`${prefix} ${miscData.background_image_alignments[1][j]}`)).click()
                    cy.get(LEManageTemplateAndDesign.getUploadImagePreview()).should('have.attr', 'style')
                        .should('include',`background-position: ${miscData.background_image_alignments[1][j].toLowerCase()} ${prefix.toLowerCase()};`)
                }
        }

        // Verify background image opacity can be set (ex. 50%)
        LEManageTemplateAndDesign.getSetBackgroundOpacity('50')
        cy.get(LEManageTemplateAndDesign.getUploadImagePreview()).should('have.attr', 'style')
            .should('include','background-image: linear-gradient(rgba(218, 221, 222, 0.5), rgba(218, 221, 222, 0.5))')

        // Save Changes
        cy.get(LEManageTemplateAndDesign.getContainerSaveBtn()).click()

        // Go to public dashboard and verify only the catalog tile's background has been updated
        cy.logoutLearner()
        cy.get(LEDashboardPage.getHeaderLogoBtn(), {timeout: 1000}).click()

        // Verify Max Width, image name, display, alignment & opacity
        cy.get(LEDashboardPage.getContainerByIndex(1), {timeout: 1000}).should('have.attr', 'style').should('include', 'max-width: 800px')
        cy.get(LEDashboardPage.getPublicDashboardBackground()).should('have.attr', 'style')
            .should('include','billboard (tasty)').and('include', 'background-image: linear-gradient(rgba(218, 221, 222, 0.5), rgba(218, 221, 222, 0.5))')
                .and('include', 'background-size: cover').and('include', 'background-position: right bottom')
      
        cy.get(LEDashboardPage.getTileName()).contains('Enrollment Key').parents(LEDashboardPage.getTile()).should('have.attr', 'style').and('include','background-color: rgb(255, 255, 255);')
    })
    
    it('Delete Image and Verify Public Dashboard', () => {
        
        // Set Width to Default
        cy.get(LEManageTemplateAndDesign.getMaxScreenWidthDDown()).select('Fill/Responsive')
        cy.get(LEManageTemplateAndDesign.getMaxScreenWidthDDown()).find('option:selected').should('have.text', 'Fill/Responsive', 'be.visible')

        // Delete uploaded background image
        cy.get(LEManageTemplateAndDesign.getBackgroundImageModuleLabelElement()).contains(`Background Image`).parents(LEManageTemplateAndDesign.getBackgroundImageModuleContainer()).within(() => {
            cy.get(LEManageTemplateAndDesign.getDeleteImageBtn()).click()
        })
        
        // Verify preview tile has default background
        cy.get(LEManageTemplateAndDesign.getUploadImagePreview()).should('not.exist')

        // Save Changes
        cy.get(LEManageTemplateAndDesign.getContainerSaveBtn()).click()

        // Go to dashboard and verify catalog tile background has been reset to default
        cy.logoutLearner()
        cy.get(LEDashboardPage.getHeaderLogoBtn(), {timeout: 1000}).click()
        
        cy.get(LEDashboardPage.getContainerByIndex(1), {timeout: 1000}).should('not.have.attr', 'style')
        cy.get(LEDashboardPage.getTileName()).contains('Catalog').parents(LEDashboardPage.getTile()).should('have.attr', 'style').and('include','background-color: rgb(255, 255, 255);')
    })

})