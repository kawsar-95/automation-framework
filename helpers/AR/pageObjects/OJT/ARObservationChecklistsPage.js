import arBasePage from "../../ARBasePage";

export default new class ARObservationChecklistsPage extends arBasePage {

     // Inherits elements from ARBasePage
     getDetailsNameTxt() {
          return '[data-name="details"] [name="name"]'
     }

     getDetailsDescription() {
          return '[data-name="details"] [aria-label="Description"]'
     }

     getAddStepBtn() {
          return '[data-name="add-step"]'
     }

     getExpandChecklistBtn() {
          return '[title="Expand Checklist"]'
     }

     getSectionNameTxt() {
          return '[aria-label*="Section"] [name="name"]'
     }

     getReviewerIdsDDown() {
          return '[data-name="reviewerIds"] [data-name="selection"]'
     }

     getReviewerIdsDDownTxtF() {
          return '[name="reviewerIds"]'
     }

     getReviewerIdsDDownOpt() {
          return '[aria-label="Reviewer(s)"] [role="option"]'
     }

     getStepTitle() {
          return '[name="title"]'
     }

     getStepsApplyBtn() {
          return '[data-name="on-the-job_training-steps-modal"] [data-name="submit"]'
     }

}