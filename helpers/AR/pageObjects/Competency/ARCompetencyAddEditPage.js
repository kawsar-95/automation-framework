import { competencyDetails } from "../../../TestData/Competency/competencyDetails";
import { images, resourcePaths } from "../../../TestData/resources/resources";
import arBasePage from "../../ARBasePage";
import ARDashboardPage from "../Dashboard/ARDashboardPage";
import A5GlobalResourceAddEditPage, { helperTextMessages } from "../GlobalResources/A5GlobalResourceAddEditPage";
import ARDeleteModal from "../Modals/ARDeleteModal";
import ARUploadFileModal from "../Modals/ARUploadFileModal";
import ARCompetencyPage from "./ARCompetencyPage";

export default new (class ARCompetencyAddEditPage extends arBasePage {

  // Competency AddEdit Elements
  getNameTxtF() {
    return "input#Name";
  }

  getNameErrorMsg() {
    return '[class="validation-summary-errors"]';
  }

  getDescriptionTxtA() {
    return "[name] p";
  }

  getLeaderboardTxtF() {
    return "div#EarnPoints > input[name='EarnPoints']";
  }

  getHasBadgeImageToggleON() {
    return '[id="HasBadge"] [class*="txt-on"]';
  }

  getChooseBtn() {
    return '[class="input-group-btn"]';
  }

  getBadgeUrlTxtF() {
    return '[name="BadgeUrl"]';
  }

  getViewSocialProfile() {
    return '[class*="btn my-profile__view_social_profile_btn my-profile-module__btn"]' 
  }

  getViewAddedCompetency() {
    return '[class*="social-profile-badge-module__wrapper___"] [class*="social-profile-badge__button"]' 
  }
  getViewCompetenciesBtn(){
    return '[class*="social-profile-count-module__type___LPasr social-profile-count__type"]'
  }
  getCompetencyCardView(){
    return '[class*="competency-module__content___FCHWn"]'
  }

  getAssignCompetenciesBtn() {
    return '[title="Assign Competencies"]'
  }

  createSampleCompetencies(competenciesArr) {
    cy.visit('/admin', {timeout: 15000})
    ARDashboardPage.getCompetenciesReport()

    for(let i = 0; i < competenciesArr.length; i++) {
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:15000}).should("not.exist")
        cy.get(ARCompetencyPage.getA5PageHeaderTitle()).should('have.text', "Competencies")
        ARCompetencyPage.getA5AddEditMenuActionsByNameThenClick('Competency')
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:15000}).should("not.exist")

        // Create Competency
        cy.get(this.getNameTxtF()).type(competenciesArr[i])
        cy.get(this.getNameTxtF()).invoke('val').then((value) => { // name may truncated during type
            competenciesArr[i] = value
        })
        cy.get(this.getDescriptionTxtA()).type(competencyDetails.description)
        cy.get(this.getLeaderboardTxtF()).type(competencyDetails.competencyLeaderboard)

        cy.get(this.getHasBadgeImageToggleON(), {timeout:15000}).click()
        //Open Upload File Pop up
        cy.get(A5GlobalResourceAddEditPage.getChooseFileBtn()).click()
        // Check if Upload File pop up is opened
        A5GlobalResourceAddEditPage.getUploadFilePopUpWindow()
        cy.get(ARUploadFileModal.getA5ChooseFileBtn()).click({force:true})
        cy.get(ARUploadFileModal.getFilePathTxt()).attachFile(resourcePaths.resource_image_folder + images.moose_filename)
        cy.get(ARCompetencyPage.getWaitSpinner()).should('not.exist')
        
        // Check Helper text when private radio button is selecetd
        cy.get(A5GlobalResourceAddEditPage.getPrivateRadioBtnHelperText()).should('have.text', helperTextMessages.privateMessage)

        //Change Visibiliy to Public
        A5GlobalResourceAddEditPage.getAvailabilityPublicBtn() 

        // Check Helper text when Public radio button is selecetd
        cy.get(A5GlobalResourceAddEditPage.getPublicRadioBtnHelperText()).should('have.text', helperTextMessages.publicMessage)
        cy.get(ARUploadFileModal.getA5SaveBtn()).click()  
        cy.get(ARCompetencyPage.getWaitSpinner()).should('not.exist')
        // Save Competency
        cy.get(this.getA5SaveBtn()).click()
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:15000}).should("not.exist")
    }
    return competenciesArr
  }

  deleteCompetencies(competenciesArr) {
    ARDashboardPage.getCompetenciesReport()
    if (competenciesArr != null) {
        for(let i = 0; i < competenciesArr.length; i++) {
            // Search and delete Competency
            ARCompetencyPage.A5AddFilter('Name', 'Starts With', competenciesArr[i])
            ARCompetencyPage.getVShortWait()
            ARCompetencyPage.selectA5TableCellRecord(competenciesArr[i])
            ARCompetencyPage.A5WaitForElementStateToChange(ARCompetencyPage.getA5AddEditMenuActionsByIndex(4))
            ARCompetencyPage.getA5AddEditMenuActionsByNameThenClick('Delete')
            cy.get(ARDeleteModal.getA5OKBtn()).click()
            // Verify Competency is deleted
            cy.get(ARCompetencyPage.getA5NoResultMsg(), {timeout: 5000}).should('have.text', "Sorry, no results found.")
            cy.get(ARCompetencyPage.getGridFilterResultLoader(), {timeout: 5000}).should('not.exist')
        }
    }
  }
})();

