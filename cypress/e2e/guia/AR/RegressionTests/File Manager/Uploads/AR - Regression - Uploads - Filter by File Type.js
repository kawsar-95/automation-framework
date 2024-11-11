import ARDashboardPage from "../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARFileManagerUploadsModal, { fileTypes } from "../../../../../../../helpers/AR/pageObjects/Modals/ARFileManagerUploadsModal"
import { users } from "../../../../../../../helpers/TestData/users/users"

describe("C7372 - AUT-740 - NASA-7135 - Uploads - Filter by File Type ", () => {
    beforeEach("Navigate to File Upload Modal ", () => {
        //login as an admin
        cy.loginAdmin(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password)
        ARDashboardPage.getMediumWait()
        // Navigate to collaboration
        // Click on Engage From Left Panel.
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Engage'))).click()
        // Click on Collaborations
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Collaborations'))
        cy.intercept('/api/rest/v2/admin/reports/collaborations/operations').as('getCollaborations').wait('@getCollaborations')
        ARDashboardPage.getMediumWait()
        // Click on Add Collaboration option from RHS
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Add Collaboration')).click()
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getElementByDataNameAttribute('title')).should('contain', 'Add Collaboration')
        //Clicking on Add Resource button
        cy.get(ARFileManagerUploadsModal.getAddResourceBtn()).click()
        //Clickig on Choose file button to open the file dialog
        cy.get(ARFileManagerUploadsModal.getChooseFileBtn()).click()
        // Asserting File Manager Upload Modal has been opened
        cy.get(ARFileManagerUploadsModal.getModalHeader()).should('have.text', 'File Manager')

    })

    it("The left panel of the modal displays filter controls for “File Type” ", () => {
        // Asserting File Manager Upload Modal has been opened
        cy.get(ARFileManagerUploadsModal.getModalHeader()).should('have.text', 'File Manager')
        //Selecting Filter type from sidebar 
        cy.get(ARFileManagerUploadsModal.getMediaLibrarySidebar()).within(() => {
            //Asserting Filter Type is present 
            cy.get(ARFileManagerUploadsModal.getFileTypesFromSidebar()).find('span').contains('File Type')

            cy.get(ARFileManagerUploadsModal.getCoursesControlWrapper()).within(() => {
                //Asserting different file types
                cy.get(ARFileManagerUploadsModal.getCheckBoxGroupRole()).children(ARFileManagerUploadsModal.getCheckBoxClass()).should(($child) => {
                    
                    expect($child).to.contain(fileTypes.image)
                    expect($child).to.contain(fileTypes.word)
                    expect($child).to.contain(fileTypes.powerPoint)
                    expect($child).to.contain(fileTypes.excel)
                    expect($child).to.contain(fileTypes.pdf)
                    expect($child).to.contain(fileTypes.video)
                    expect($child).to.contain(fileTypes.other)
                })
            })
        })
    })

    it("Unchecking the filter(s) in the left-hand pane will remove the corresponding filter chiclet from the Uploads section of the modal" , ()=>{
        //Asserting Image File Types
        ARFileManagerUploadsModal.ClickSideBarMenuItemAndAssertingInFilterItems(fileTypes.image , true)
        //Asserting Word File Types
        ARFileManagerUploadsModal.ClickSideBarMenuItemAndAssertingInFilterItems(fileTypes.word , true)
        //Asserting PowerPoint File Types
        ARFileManagerUploadsModal.ClickSideBarMenuItemAndAssertingInFilterItems(fileTypes.powerPoint , true)
        //Asserting Excel File Types
        ARFileManagerUploadsModal.ClickSideBarMenuItemAndAssertingInFilterItems(fileTypes.excel , true)
        //Asserting PDF File Types
        ARFileManagerUploadsModal.ClickSideBarMenuItemAndAssertingInFilterItems(fileTypes.pdf , true)
        //Asserting Video File Types
        ARFileManagerUploadsModal.ClickSideBarMenuItemAndAssertingInFilterItems(fileTypes.video , true)
        //Asserting Other File Types
        ARFileManagerUploadsModal.ClickSideBarMenuItemAndAssertingInFilterItems(fileTypes.other , true)

        //Asserting image file type removed from upload section also unchecked in sidebar
        ARFileManagerUploadsModal.getFilterItemDeselectFromValueAndClickAndAsserting(fileTypes.image , true)

        //Asserting word file type removed from upload section also unchecked in sidebar
        ARFileManagerUploadsModal.getFilterItemDeselectFromValueAndClickAndAsserting(fileTypes.word , true)

        //Asserting powerpoint file type removed from upload section also unchecked in sidebar
        ARFileManagerUploadsModal.getFilterItemDeselectFromValueAndClickAndAsserting(fileTypes.powerPoint , true)

        //Asserting excel file type removed from upload section also unchecked in sidebar
        ARFileManagerUploadsModal.getFilterItemDeselectFromValueAndClickAndAsserting(fileTypes.excel , true)

        //Asserting pdf file type removed from upload section also unchecked in sidebar
        ARFileManagerUploadsModal.getFilterItemDeselectFromValueAndClickAndAsserting(fileTypes.pdf , true)

        //Asserting video file type removed from upload section also unchecked in sidebar
        ARFileManagerUploadsModal.getFilterItemDeselectFromValueAndClickAndAsserting(fileTypes.video , true)

        //Asserting other file type removed from upload section also unchecked in sidebar
        ARFileManagerUploadsModal.getFilterItemDeselectFromValueAndClickAndAsserting(fileTypes.other , true)
        
    })
})