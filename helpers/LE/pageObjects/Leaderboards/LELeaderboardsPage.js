import LEBasePage from '../../LEBasePage'

export default new class LELeaderboardsPage extends LEBasePage {

    getLeaderboardName() {
        return '[class*="leaderboard__user_name"]'
    }

    //Pass user first and last name to navigate to their social profile from the leaderboard list
    getUserSocialProfileByName(fName, lName) {
        cy.get(this.getLeaderboardName()).contains(fName + ' ' + lName).click()
    }
}