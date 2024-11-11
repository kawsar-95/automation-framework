import leBasePage from '../../LEBasePage'

export default new class LEResourcesPage extends leBasePage {


    getResourcesPageTitle() {
        return `[class*="banner-title-module__title"]`;
    }

    getViewBtn() {
        return `[class*="icon-view-list"]`;
    }

    getResourceName() {
        return `[class*="resource-list-module__resource_name_container"]`;
    }

    getResourceCardThumbnail() {
        return '[class*="thumbnail-module__container___vo29K"]'
    }
    getResourceCardThumbnailImg() {
        return '[class="thumbnail-module__img___hL_Ee"]'
    }
    getChooseViewBtn() {
        return 'button[title="Choose View"][aria-label="Choose View"]'
    }
    getChooseCardViewBtn() {
        return 'button[title="Card View"]'
    }

    getClearResourceName() {
        return '[title="Clear Search Name"]'
    }

    getResourceNameSearchTxtField() {
        return `[aria-label="Advanced Filtering"] [data-name="text-input"] input`
    }

    getSearchNameBtn() {
        return `button[title="Search Name"]`
    }
}