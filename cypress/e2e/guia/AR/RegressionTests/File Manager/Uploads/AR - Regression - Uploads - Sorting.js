import { users } from "../../../../../../../helpers/TestData/users/users"
import ARFileManagerUploadsModal from "../../../../../../../helpers/AR/pageObjects/Modals/ARFileManagerUploadsModal"
import ARDashboardPage from "../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"


describe("C7369 - AUT-737 - AR - Regression - Uploads - Sorting", () => {

    let ShortName = " ";
    let firstD = " ";
    let secondD = " ";

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

    it("Asserting Sorting option appears in order", () => {
        // Asserting File Manager Upload Modal has been opened
        cy.get(ARFileManagerUploadsModal.getModalHeader()).should('have.text', 'File Manager')
        //Opening Sorting List
        ARFileManagerUploadsModal.getSortingFilesClick()
        //Asserting Sorting List is in order
        ARFileManagerUploadsModal.getSortingFlyoutMenu()

    })

    it("Asserting File Manager Upload Sorting Alphabetically ", () => {

        // Asserting File Manager Upload Modal has been opened
        cy.get(ARFileManagerUploadsModal.getModalHeader()).should('have.text', 'File Manager')
        //Opening Sorting List
        ARFileManagerUploadsModal.getSortingFilesClick()
        //Clicking on the Alphabetically sorting options 
        ARFileManagerUploadsModal.getSortingOptionsByIndexAndClick(0)


    })


    it("Asserting File Manager is sorted by Date Added (Newest) ", () => {

        // Asserting File Manager Upload Modal has been opened
        cy.get(ARFileManagerUploadsModal.getModalHeader()).should('have.text', 'File Manager')
        //Opening Sorting List
        ARFileManagerUploadsModal.getSortingFilesClick()
        //Clicking on the File Manager  by Date Added (Newest) sorting options 
        ARFileManagerUploadsModal.getSortingOptionsByIndexAndClick(1)
        //click on media library button
        cy.get(ARFileManagerUploadsModal.getMediaLibraryViewBtn()).click()
        //Clicking on the List View button
        cy.get(ARFileManagerUploadsModal.getFlyoutMenu()).within(() => {
            cy.get(ARFileManagerUploadsModal.getListViewBtn()).click()
        })

        cy.get(ARFileManagerUploadsModal.getMediaLibrarySidebar()).parent().within(() => {

            cy.get(ARFileManagerUploadsModal.getTableRow()).first().within(() => {
                cy.get(ARFileManagerUploadsModal.getDateAddedField()).invoke('text').then((firstDate) => {
                    firstD = firstDate;
                    
                })
            })
        })

        cy.get(ARFileManagerUploadsModal.getMediaLibrarySidebar()).parent().within(() => {

            cy.get(ARFileManagerUploadsModal.getTableRow()).eq(1).within(() => {
                cy.get(ARFileManagerUploadsModal.getDateAddedField()).invoke('text').then((secondDate) => {
                    secondD = secondDate;
                    

                    let fdate = new Date(firstD)
                    let sDate = new Date(secondD)

                    expect(fdate).to.be.gt(sDate)

                })
            })
        })



    })

    it("Asserting The File Manager is sorted by Date Added (Oldest) ", () => {

        // Asserting File Manager Upload Modal has been opened
        cy.get(ARFileManagerUploadsModal.getModalHeader()).should('have.text', 'File Manager')
        //Opening Sorting List
        ARFileManagerUploadsModal.getSortingFilesClick()
        //Clicking on The File Manager by Date Added (Oldest) sorting options 
        ARFileManagerUploadsModal.getSortingOptionsByIndexAndClick(2)

        //click on media library button
        cy.get(ARFileManagerUploadsModal.getMediaLibraryViewBtn()).click()
        //Clicking on the List View button
        cy.get(ARFileManagerUploadsModal.getFlyoutMenu()).within(() => {
            cy.get(ARFileManagerUploadsModal.getListViewBtn()).click()
        })

        cy.get(ARFileManagerUploadsModal.getMediaLibrarySidebar()).parent().within(() => {

            cy.get(ARFileManagerUploadsModal.getTableRow()).first().within(() => {
                cy.get(ARFileManagerUploadsModal.getDateAddedField()).invoke('text').then((firstDate) => {
                    firstD = firstDate;
                    cy.log(firstD)
                })
            })
        })

        cy.get(ARFileManagerUploadsModal.getMediaLibrarySidebar()).parent().within(() => {

            cy.get(ARFileManagerUploadsModal.getTableRow()).eq(1).within(() => {
                cy.get(ARFileManagerUploadsModal.getDateAddedField()).invoke('text').then((secondDate) => {
                    secondD = secondDate;
                    cy.log(secondD)

                    let fdate = new Date(firstD)
                    let sDate = new Date(secondD)

                    expect(sDate).to.be.lt(fdate)

                })
            })
        })
    })

    it("Asserting The File Manager is sorted by Popular ", () => {

        // Asserting File Manager Upload Modal has been opened
        cy.get(ARFileManagerUploadsModal.getModalHeader()).should('have.text', 'File Manager')
        //Opening Sorting List
        ARFileManagerUploadsModal.getSortingFilesClick()
        //Clicking on The File Manager is sorted by Popular sorting options 
        ARFileManagerUploadsModal.getSortingOptionsByIndexAndClick(3)


    })



    it("Sorting UI element should be match with mock-up", () => {
        //Slecting the Sorting options
        cy.get(ARFileManagerUploadsModal.getMediaLibraryCount()).parent().within(() => {
            cy.get(ARFileManagerUploadsModal.getSelection()).click()
        })

        //Capturing the name of the Sort Option
        cy.get(ARFileManagerUploadsModal.getFlyoutMenu()).within(() => {
            cy.get(ARFileManagerUploadsModal.getOptionsList()).within(() => {
                cy.get(ARFileManagerUploadsModal.getSortingOptionSelectClass()).eq(0).find('span').invoke('text').then((text) => {
                    ShortName = text;
                })
            })
        })

        //clicking on the sorting option 
        ARFileManagerUploadsModal.getSortingOptionsByIndexAndClick(0)
        //Asserting the sorting options matches with saved one 
        cy.get(ARFileManagerUploadsModal.getMediaLibraryCount()).parent().within(() => {
            cy.get(ARFileManagerUploadsModal.getSelection()).within(() => {
                cy.get(ARFileManagerUploadsModal.getSelectionLabel()).invoke('text').then((value) => {
                    expect(ShortName).to.equal(value)
                })
            })
        })


    })



})