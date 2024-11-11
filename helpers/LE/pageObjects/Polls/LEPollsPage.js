import { pollDetails } from '../../../TestData/poll/pollDetails';
import LEBasePage from '../../LEBasePage'

export default new class LEPollsPage extends LEBasePage {
   
    getPollsPageTitle() {
        return `[class*="banner-title-module__title"]`;
    }

    getPollQuestionByName(name) {
        return cy.get('[class*="poll__question"]').contains(name)
    }

    getRadioBtnByIndex(index=1) {
        return `[class*="polls-module__poll"]:nth-of-type(${index}) [class*="radio-module__round_radio"]`
    }

    getPollSubmitBtnByName(pollName) {
        return `[title='Submit ${pollName}']`
    }


getPollQ(name){
    return cy.get('[class*="poll-module__header"]').contains(name)
}
}