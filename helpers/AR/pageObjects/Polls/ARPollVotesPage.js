import arBasePage from "../../ARBasePage";

export default new class ARPollVotesPage extends arBasePage {
  
  // Poll Vote Elements

  getTotalVotesCount() {
    return "#edit-content tr td:nth-of-type(3)";
  }

};
