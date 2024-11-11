
import ARDashboardPage from "../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARFileManagerUploadsModal, { uploadTypes } from "../../../../../../../helpers/AR/pageObjects/Modals/ARFileManagerUploadsModal"
import { users } from "../../../../../../../helpers/TestData/users/users"

describe("C7377 - AUT-745 - NASA-7134 - Uploads - Filter by Upload Type ", () => {

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



    it("The left panel of the modal displays filter controls for Upload Type” ", () => {
        // Asserting File Manager Upload Modal has been opened
        cy.get(ARFileManagerUploadsModal.getModalHeader()).should('have.text', 'File Manager')
        //Selecting Filter type from sidebar 
        cy.get(ARFileManagerUploadsModal.getMediaLibrarySidebar()).within(() => {
            //Asserting Upload Type is present 
            cy.get(ARFileManagerUploadsModal.getUploadTypeFromSidebar()).within(() => {
                //Asserting Uploads Type lable is present
                cy.get(ARFileManagerUploadsModal.getLableByDataName()).should('have.text', 'Upload Type')

            })

            cy.get(ARFileManagerUploadsModal.getUploadTypeFromSidebar()).within(() => {

                cy.get(ARFileManagerUploadsModal.getCoursesControlWrapper()).within(() => {

                    cy.get(ARFileManagerUploadsModal.getCheckboxGroup()).find('label').should(($child) => {

                        expect($child).to.contain(uploadTypes.Billboards)
                        expect($child).to.contain(uploadTypes.Certificates)
                        expect($child).to.contain(uploadTypes.Competencies)
                        expect($child).to.contain(uploadTypes["Department Templates"])
                        expect($child).to.contain(uploadTypes.Descriptions)
                        expect($child).to.contain(uploadTypes.Lessons)
                        expect($child).to.contain(uploadTypes["News Articles"])
                        expect($child).to.contain(uploadTypes.Posters)
                        expect($child).to.contain(uploadTypes["Question Banks"])
                        expect($child).to.contain(uploadTypes.Resources)
                        expect($child).to.contain(uploadTypes.Thumbnails)
                    })
                })
            })
        })
    })

    
    it("Unchecking the filter(s) in the left-hand pane will remove the corresponding filter chiclet from the Uploads section of the modal" , ()=>{
        //To deselect it as its already selected filter
        ARFileManagerUploadsModal.getFilterItemDeselectFromValueAndClickAndAsserting(uploadTypes.Resources)

        //Asserting Billoards Upload types
        ARFileManagerUploadsModal.ClickSideBarMenuItemAndAssertingInFilterItems(uploadTypes.Billboards)
        //Asserting Certificate Upload types
        ARFileManagerUploadsModal.ClickSideBarMenuItemAndAssertingInFilterItems(uploadTypes.Certificates)
        //Asserting Competencies Upload types
        ARFileManagerUploadsModal.ClickSideBarMenuItemAndAssertingInFilterItems(uploadTypes.Competencies)
        //Asserting Departments Upload types
        ARFileManagerUploadsModal.ClickSideBarMenuItemAndAssertingInFilterItems(uploadTypes["Department Templates"])
        //Asserting Descriptors Upload types
        ARFileManagerUploadsModal.ClickSideBarMenuItemAndAssertingInFilterItems(uploadTypes.Descriptions)
        //Asserting Lessons Upload types
        ARFileManagerUploadsModal.ClickSideBarMenuItemAndAssertingInFilterItems(uploadTypes.Lessons)
        //Asserting News Articles Uploads types
        ARFileManagerUploadsModal.ClickSideBarMenuItemAndAssertingInFilterItems(uploadTypes["News Articles"])
        //Asserting Posters Upload types
        ARFileManagerUploadsModal.ClickSideBarMenuItemAndAssertingInFilterItems(uploadTypes.Posters)
        //Asserting Question Bank Upload types
        ARFileManagerUploadsModal.ClickSideBarMenuItemAndAssertingInFilterItems(uploadTypes["Question Banks"])
        //Asserting Resourced Upload types
        ARFileManagerUploadsModal.ClickSideBarMenuItemAndAssertingInFilterItems(uploadTypes.Resources)
        //Asserting Thumbnail Upload types
        ARFileManagerUploadsModal.ClickSideBarMenuItemAndAssertingInFilterItems(uploadTypes.Thumbnails)

        //Asserting Billboard upload type removed from upload section also unchecked in sidebar
        ARFileManagerUploadsModal.getFilterItemDeselectFromValueAndClickAndAsserting(uploadTypes.Billboards)

        //Asserting certificate upload type removed from upload section also unchecked in sidebar
        ARFileManagerUploadsModal.getFilterItemDeselectFromValueAndClickAndAsserting(uploadTypes.Certificates)

        //Asserting Competencies upload type removed from upload section also unchecked in sidebar
        ARFileManagerUploadsModal.getFilterItemDeselectFromValueAndClickAndAsserting(uploadTypes.Competencies)

        //Asserting Department template upload type removed from upload section also unchecked in sidebar
        ARFileManagerUploadsModal.getFilterItemDeselectFromValueAndClickAndAsserting(uploadTypes["Department Templates"])

        //Asserting Descriptions upload type removed from upload section also unchecked in sidebar
        ARFileManagerUploadsModal.getFilterItemDeselectFromValueAndClickAndAsserting(uploadTypes.Descriptions)

        //Asserting Lessons upload type removed from upload section also unchecked in sidebar
        ARFileManagerUploadsModal.getFilterItemDeselectFromValueAndClickAndAsserting(uploadTypes.Lessons)

        //Asserting News Articles type removed from upload section also unchecked in sidebar
        ARFileManagerUploadsModal.getFilterItemDeselectFromValueAndClickAndAsserting(uploadTypes["News Articles"])

        //Asserting Posters upload type removed from upload section also unchecked in sidebar
        ARFileManagerUploadsModal.getFilterItemDeselectFromValueAndClickAndAsserting(uploadTypes.Posters)

        //Asserting Question Bank upload type removed from upload section also unchecked in sidebar
        ARFileManagerUploadsModal.getFilterItemDeselectFromValueAndClickAndAsserting(uploadTypes["Question Banks"])

        //Asserting Resources upload type removed from upload section also unchecked in sidebar
        ARFileManagerUploadsModal.getFilterItemDeselectFromValueAndClickAndAsserting(uploadTypes.Resources)

        //Asserting Thumbnails upload type removed from upload section also unchecked in sidebar
        ARFileManagerUploadsModal.getFilterItemDeselectFromValueAndClickAndAsserting(uploadTypes.Thumbnails)

    })



})


