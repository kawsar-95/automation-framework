import users from '../../../../../fixtures/users.json'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LESideMenu from '../../../../../../helpers/LE/pageObjects/Menu/LESideMenu'
import LEManageTemplatePrivateDashboardPage from '../../../../../../helpers/LE/pageObjects/Template/LEManageTemplatePrivateDashboardPage'
import LEManageTemplateTiles from '../../../../../../helpers/LE/pageObjects/Template/LEManageTemplateTiles'
import LEEditTileModal from '../../../../../../helpers/LE/pageObjects/Modals/LEEditTile.modal'

let newColors = ['#5D798E', '#355a75', '#ffffff'];
let newColorsRGB = ['rgb(93, 121, 142)', 'rgb(53, 90, 117)', 'rgb(255, 255, 255)'];
let elements = ['Background', 'Text', 'Icon'];

let tileNames = ['My Courses', 'Messages', 'Resources', 'Catalog', 'Polls & Surveys', 'FAQs', 'Latest News', 
'Enrollment Key', 'Facebook', 'Twitter', 'External Training', 'Leaderboards', 'Collaborations Activity'];

describe('LE - Nav - Customize Dashboard Tile Colors', function () {

    beforeEach(() => {
        
        cy.viewport(1200, 850) //Enlarge viewport so tiles display text within them
        
        // sign in and navigate to manage template before each test
        cy.apiLoginWithSession(users.sysAdmin.ADMIN_SYS_01_USERNAME, users.sysAdmin.ADMIN_SYS_01_PASSWORD, "#/login")
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('Manage Template')
        
        // Open content container
        LEManageTemplatePrivateDashboardPage.getManageTemplatePrivateDashContainerByNameThenClick('Content')
    })

    // Delete External Training container
    after(()=>{
        cy.get(LEManageTemplateTiles.getContainerByIndex(2)).within(() => {
            LEManageTemplateTiles.getTileEditBtnByTileName('External Training')
        })
    })

    it('Verify Tile Text, Background, and Icon Color Can Be Customized', () => {
        
        // Edit Resume Tile in the Tile container
        cy.get(LEManageTemplateTiles.getContainerByIndex(2)).within(() => {
            LEManageTemplateTiles.getTileEditBtnByTileName('Resume')
        })
        LEEditTileModal. getTurnOnOffCustomizeTileThemeToggleBtn('true')

        // Edit the tile background, text, and icon color with the color picker
        for (let i = 0; i < elements.length; i++) {
            LEEditTileModal.getPickTileElementColorByName(elements[i], newColors[i])
        }

        // Verify tile preview displays the correct tile color for each element
        if (Cypress.isBrowser('firefox')) {
            cy.get(LEEditTileModal.getColorPickerBox()).eq(2).should('have.attr', 'style', `background-color: ${newColorsRGB[0]} none repeat scroll 0% 0%;`)
        } else {
            cy.get(LEEditTileModal.getColorPickerBox()).eq(2).should('have.attr', 'style', `background-color: ${newColorsRGB[0]};`)
        }
        cy.get(LEEditTileModal.getColorPickerBox()).eq(1).should('have.attr', 'style', `background-color: ${newColorsRGB[1]};`)
        cy.get(LEEditTileModal.getColorPickerBox()).eq(0).should('have.attr', 'style', `background-color: ${newColorsRGB[2]};`)

        // Save Changes
        cy.get(LEEditTileModal.getSaveBtn()).click({force:true})
        cy.get(LEManageTemplateTiles.getContainerSaveBtn(), {timeout: 10000}).click({force:true})
   
        // Go to dashboard and verify only the resume tile's text has been updated
        cy.get(LEDashboardPage.getHeaderLogoBtn()).click({force:true})
        cy.get(LEDashboardPage.getResumeTile(), {timeout: 10000}).parents(LEDashboardPage.getTile(), {timeout: 10000}).should('have.attr', 'style')
        .should('exist', `background-color: ${newColorsRGB[0]};`)
    })

    it('Verify Tile Colors Return to Default When Customize Toggle is Turned Off', () => {
        
        // Edit Resume Tile in the Tile container
        cy.get(LEManageTemplateTiles.getContainerByIndex(2)).within(() => {
            LEManageTemplateTiles.getTileEditBtnByTileName('Resume')
        })

        // Turn Customize Tile Toggle OFF
        LEEditTileModal. getTurnOnOffCustomizeTileThemeToggleBtn('false')
        
        // Save Changes
        cy.get(LEEditTileModal.getSaveBtn()).click({force:true})
        cy.get(LEManageTemplateTiles.getContainerSaveBtn()).click({force:true})


        // Go to dashboard and verify resume tile has been reset to default
        cy.get(LEDashboardPage.getHeaderLogoBtn(), {timeout: 10000}).click({force:true})
 
        cy.get(LEDashboardPage.getResumeTile(), {timeout: 10000}).parents(LEDashboardPage.getTile()).should('have.attr', 'style').should('not.include',`background-color: ${newColorsRGB[0]};`)
        cy.get(LEDashboardPage.getResumeTile()).parents(LEDashboardPage.getTile()).within(() => {
            cy.get(LEDashboardPage.getResumeTileName()).should('have.attr', 'style').should('not.include',`color: ${newColorsRGB[0]};`)
        })
    })

    it('Verify All Applicable Tiles Colors Can Be Customized', () => {
       
        cy.get(LEManageTemplateTiles.getContainerByIndex(2)).within(() => {
            cy.get(LEManageTemplateTiles.getAddTileButton()).eq(0).click()
                    cy.get(LEManageTemplateTiles.getAddTileName()).contains('External Training').click()
                    cy.get(LEManageTemplateTiles.getSaveBtn()).click()                 
        })
    
        for (let i = 0; i < tileNames.length; i++) {
            
            // Open tile edit modal
            cy.get(LEManageTemplateTiles.getContainerByIndex(2)).within(() => {
                LEManageTemplateTiles.getTileEditBtnByTileName(tileNames[i])
            })

            // Turn Customize Tile Toggle ON
            cy.get(LEEditTileModal.getCustomizeTileToggle()).click({force:true})

            // Verify Tile Text, Background, and Icon Color pickers exists
            for (let j = 0; j < elements.length; j++) {
                cy.get(LEEditTileModal.getTileThemeColorContainer()).contains(`Tile ${elements[j]} Color`).should('exist')
            }

            // Close Edit modal
            cy.get(LEEditTileModal.getModalCloseBtn()).click({force:true})
        }
    })
})