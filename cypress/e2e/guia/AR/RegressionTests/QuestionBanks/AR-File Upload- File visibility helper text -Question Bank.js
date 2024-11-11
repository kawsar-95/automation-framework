import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import A5GlobalResourceAddEditPage from '../../../../../../helpers/AR/pageObjects/GlobalResources/A5GlobalResourceAddEditPage'
import arDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import ARUploadFileModal from '../../../../../../helpers/AR/pageObjects/Modals/ARUploadFileModal'
import { users } from '../../../../../../helpers/TestData/users/users'
import { resourcePaths, images } from '../../../../../../helpers/TestData/resources/resources'
import ARUnsavedChangesModal from '../../../../../../helpers/AR/pageObjects/Modals/ARUnsavedChangesModal'
import { helperTextMessages } from '../../../../../../helpers/TestData/NewsArticle/NewsArticleDetails'
import arQuestionBanksPage from '../../../../../../helpers/AR/pageObjects/QuestionBanks/ARQuestionBanksPage'
import arQuestionBanksAddEditPage from '../../../../../../helpers/AR/pageObjects/QuestionBanks/ARQuestionBanksAddEditPage'

describe('AR - File Visibility - Helper Text', function () {

    beforeEach(function () {
          // Sign in with System Admin account
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        //cy.get(arDashboardPage.getSysAdminDashboardPageTitle()).should('have.text', arDashboardPage.getSysAdminDashboardPageTitleTxt())
        // Click the Courses menu item
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        arDashboardPage.getMenuItemOptionByName('Question Banks')
        cy.intercept('**/Admin/QuestionBanks/DefaultGridActionsMenu').as('getQuestionBanks').wait('@getQuestionBanks');
    })


    after(function() {
        
        cy.get(A5GlobalResourceAddEditPage.getCancelBtn()).click()
        cy.get(A5GlobalResourceAddEditPage.getUnsavedChangesTxt()).should('contain', ARUnsavedChangesModal.getUnsavedChangesMsg())
        ARUnsavedChangesModal.getClickUnsavedActionBtnByName("Don't Save")
        cy.wait('@getQuestionBanks')
    })


    it('Verify Helper Text in Global Resource', () => {
        cy.get(arQuestionBanksPage.getA5PageHeaderTitle()).should('have.text', "Question Banks")
        arQuestionBanksPage.getA5AddEditMenuActionsByNameThenClick('Question Bank')
        arDashboardPage.getShortWait()
        cy.get(arQuestionBanksAddEditPage.getA5CreateQuestionBtn()).click()
        //Open Upload File Pop up
        cy.get(A5GlobalResourceAddEditPage.getChooseFileBtn()).click()
        // Check if Upload File pop up is opened
       A5GlobalResourceAddEditPage.getUploadFilePopUpWindow()
        cy.get(ARUploadFileModal.getA5ChooseFileBtn()).click({force:true})
        cy.get('input[type="file"]').attachFile(resourcePaths.resource_image_folder + images.moose_filename)
        arDashboardPage.getShortWait()

        // Check Helper text when private radio button is selecetd
        cy.get(A5GlobalResourceAddEditPage.getPrivateRadioBtnHelperText()).should('have.text',helperTextMessages.textWhenPrivateSelecetd)

        //Change Visibiliy to Public
        A5GlobalResourceAddEditPage.getAvailabilityPublicBtn() 

        // Check Helper text when Public radio button is selecetd
        cy.get(A5GlobalResourceAddEditPage.getPublicRadioBtnHelperText()).should('have.text',helperTextMessages.textWhenPublicSelecetd)
        cy.get(ARUploadFileModal.getA5SaveBtn()).click()     

})   
}) 
 