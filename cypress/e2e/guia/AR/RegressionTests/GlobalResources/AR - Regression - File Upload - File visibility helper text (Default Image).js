import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import A5GlobalResourceAddEditPage, { helperTextMessages } from "../../../../../../helpers/AR/pageObjects/GlobalResources/A5GlobalResourceAddEditPage"
import { users } from "../../../../../../helpers/TestData/users/users"
import AREditClientInfoPage from "../../../../../../helpers/AR/pageObjects/PortalSettings/AREditClientInfoPage"
import ARUploadFileModal from "../../../../../../helpers/AR/pageObjects/Modals/ARUploadFileModal"
import { images, resourcePaths } from "../../../../../../helpers/TestData/resources/resources"



describe("C5173 - AE Regression - File Upload - File visibility - helper text (Default Image)" , function(){
    
    
    it(" File Upload - File visibility - helper text (Default Image) ",function(){
        cy.viewport(1280, 720)
        //Log in to admin side 
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getShortWait()
        //Clicking On Account Button
        cy.get(ARDashboardPage.getElementByDataNameAttribute('button-account')).click()
        ARDashboardPage.getShortWait()
        //Asserting Account and Clicking on Portal Settings
        cy.get(ARDashboardPage.getElementByDataNameAttribute("panels")).within(() => {
            cy.get(ARDashboardPage.getElementByDataNameAttribute("title")).should('have.text', 'Account')
            //Click on Portal Settings button
            cy.get(ARDashboardPage.getPortalSettingsBtn()).click()
        })
        ARDashboardPage.getLongWait()
        //Asserting Client Page
        cy.get(ARDashboardPage.getAccountHeaderLabel()).should('have.text', 'Edit Client')
        //Click on Defaults Tab
        cy.get(AREditClientInfoPage.getTabsMenu()).contains('Defaults').click()
        ARDashboardPage.getShortWait()

        //Open Upload File Pop up
        cy.contains("Default Certificate URL").parent().within(()=>{
            cy.get(A5GlobalResourceAddEditPage.getChooseFileBtn()).click()
        })
        
        // Check if Upload File pop up is opened
        A5GlobalResourceAddEditPage.getUploadFilePopUpWindow()
        //Clicking on Choose File Button
        cy.get(ARUploadFileModal.getA5ChooseFileBtn()).click({ force: true })
        //Uploading File 
        cy.get(ARUploadFileModal.getFilePathTxt()).attachFile(resourcePaths.resource_image_folder + images.moose_filename)
        ARDashboardPage.getShortWait()
        //Check If Public radio button is selected
        A5GlobalResourceAddEditPage.getAvailabilityPublicRadoioBtnSelected()
        cy.get(A5GlobalResourceAddEditPage.getPublicRadioBtnHelperText()).should('have.text',helperTextMessages.publicMessage)
        //Change Visibiliy to Private
        A5GlobalResourceAddEditPage.getAvailabilityPrivateBtn()
        //Asserting Private message 
        cy.get(A5GlobalResourceAddEditPage.getPrivateRadioBtnHelperText()).should('have.text',helperTextMessages.privateMessage)
        //Cicking on Save Button
        cy.get(ARUploadFileModal.getA5SaveBtn()).click()
    })

})