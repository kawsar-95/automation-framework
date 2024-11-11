import ARBasePage from "../../ARBasePage";

export default new (class ARFAQAddEditPage extends ARBasePage {
  
   // FAQ AddEdit Elements

  getQuestionTxtF() {
    return "input#Question";
  }

  getAnswerTxtA() {
    return 'div[role="application"]  p';
  }

})();