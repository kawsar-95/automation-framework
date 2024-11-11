import LEBasePage from '../../LEBasePage'

export default new class LECollaborationsActivityTile extends LEBasePage {

    getTileHeader() {
        return '[class*="dashboard-tile-title-module__title"]'
    }

    getPostContainer() {
        return '[class*="tile-row-module__post"]'
    }

    getPostDate() {
        return '[class*="tile-row-module__date"]'
    }

    getLearnerName() {
        return '[class*="tile-row-module__name"]'
    }

    getCollaborationName() {
        return '[class*="tile-row-module__collaboration_name"]'
    }

    getPostSummary() {
        return '[class*="tile-row-module__link"]'
    }

    getPostDescription() {
        return '[class*="tile-row-module__post_description"]'
    }

    getViewAllBtn() {
        return '[class*="collaborations-activity-dashboard-tile-module__footer_link"]'
    }


}