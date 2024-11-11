import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARFilesPage from "../../../../../../helpers/AR/pageObjects/Setup/ARFilesPage"
import { users } from "../../../../../../helpers/TestData/users/users"
import ARUnsavedChangesModal from "../../../../../../helpers/AR/pageObjects/Modals/ARUnsavedChangesModal"

const EXCLUDED_FILE_EXTENSIONS = ['jpg', 'png', 'gif']
const PATH = require("path")

describe('C6315 - AR - Setup - Download file', function () {
    beforeEach(function() {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
    })

    it('Open File Manager and Close it', () => {
        // Click on Setup
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Setup'))).click()
        // Click on files options
        ARDashboardPage.getMenuItemOptionByName('Files')
        ARDashboardPage.getMediumWait()

        // Assert that File Manager pops up
        cy.get(ARFilesPage.getFileManagerModal()).should('exist')        
        ARDashboardPage.getMediumWait()

        // Click on close button
        cy.get(ARFilesPage.getFileBrowserFooter()).contains('Close').click()
        ARDashboardPage.getShortWait()
    })

    it('Open File Manager, Open a Sub-Folder and Validate Files are Displayed', () => {
        // Click on Setup
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Setup'))).click()
        // Click on files options
        ARDashboardPage.getMenuItemOptionByName('Files')
        ARDashboardPage.getMediumWait()
        cy.reload()
           
        // Assert that File Manager pops up
        cy.get(ARFilesPage.getFileManagerModal()).should('exist')        
        ARDashboardPage.getMediumWait()

        // Select a sub-folder to select a file inside it
        cy.get(ARFilesPage.getSubFolder('WelcomeTiles')).eq(1).click({force: true})

        // Select a file other than image file types that a browser can display
        cy.get(ARFilesPage.getFileList()).then($els => {
            return $els.filter((i, el) => {
                return !EXCLUDED_FILE_EXTENSIONS.filter(str => Cypress.$(el).text().includes(str)).length
            })
        }).as('downloadableFiles')
        cy.get('@downloadableFiles').then(files => files[0].click())

        // Assert that there is a file preview option
        cy.get(ARFilesPage.getFileBrowserToolBar()).within(() => {
            cy.get(ARFilesPage.getFielPreviewIcon()).eq(0).find('span').should('exist')
        })
        // Assert that there is a file delete option
        cy.get(ARFilesPage.getFileBrowserToolBar()).within(() => {
            cy.get(ARFilesPage.getFielDeleteIcon()).eq(0).find('span').should('exist')
        })
        // Assert that there is a file download option
        cy.get(ARFilesPage.getFileDownloadBtn()).should('exist')

        // TODO: Clicking on download button doesn't work due clipping or modal pop-up 
        // Download the file
        cy.get(ARFilesPage.getFileManagerModal()).should('exist').within(() => {
           cy.get(ARUnsavedChangesModal.getSaveBtn()).click()
        })

        ARFilesPage.getMediumWait()

        // Assert that the selected file has been downloaded successfully
        cy.get(ARFilesPage.getFileBrowserFooter()).within(() => {
            cy.get(ARUnsavedChangesModal.getSaveBtn()).invoke('attr', 'download').then(fileName => {
                cy.readFile(PATH.join(Cypress.config('downloadsFolder'), fileName)).should("exist");
            })
        })
    })
})