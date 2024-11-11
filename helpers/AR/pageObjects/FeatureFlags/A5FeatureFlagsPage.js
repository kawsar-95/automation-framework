import arBasePage from "../../ARBasePage";
import ARDashboardAccountMenu from "../Menu/ARDashboardAccount.menu";
import AREditClientUserPage from "../PortalSettings/AREditClientUserPage";

export default new class A5FeatureFlagsPags extends arBasePage {
    getFeatureFlagToggle(featureFlag) {
        return cy.get(`label:contains("${featureFlag}")`).parent().find('div.katana-toggle')
    }

    getFeatureFlagContainer() {
        return `[class="field"]`
    }

    getFeatureFlagNameContainer() {
        return `[data-bind="text: Name"]`
    }

    getFeatureFlagToggleBtn() {
        return `[class="katana-toggle"]`
    }

    getFeatureFlagPageTitle() {
        return `[class="section-title"]`
    }

    /* 
    This method is used to toggle the feature flags, pass the feature flag name and   
    to turn on the toggle pass the value as 'true', to turn off the toggle button pass the value as 'false'
    */
    getTurnOnOffFeatureFlagbyName(name, value) {
        cy.wait(1000)
        value = (value === 'true') ? 'toggle on' : 'toggle'
        cy.get(this.getFeatureFlagNameContainer()).contains(name).parent(this.getFeatureFlagContainer()).within(() => {
            cy.wait(2000)
            cy.get(this.getFeatureFlagToggleBtn()).children().invoke('attr', 'class').then((status) => {
                if (status === value) {
                    cy.get(this.getFeatureFlagToggleBtn()).children().should('have.attr', 'class', value)
                }
                else {
                    cy.get(this.getFeatureFlagToggleBtn()).click()
                    cy.wait(1000)
                    cy.get(this.getFeatureFlagToggleBtn()).children().should('have.attr', 'class', value)
                }
            })
        })
    }

    turnOnOffFeatureFlagbyName(name,value){
        cy.get(this.getWaitSpinner()).should('not.exist')
        // Go to feature flags
        cy.visit('admin/featureflags')
        cy.get(this.getFeatureFlagPageTitle()).should('be.visible').and('contain','Feature Flags')
        //Turn the EnableTranscriptImprovements feature flag off
        this.getTurnOnOffFeatureFlagbyName(name, value)
        //Select save button within Portal settings 
        cy.get(AREditClientUserPage.getSaveBtn()).click()
        cy.get(ARDashboardAccountMenu.getA5MessageCountIcon()).should('be.visible')
        cy.get(ARDashboardAccountMenu.getA5AccountSettingsBtn()).should('be.visible')
    }
}

export const featureFlagDetails = {
    "EnablePlaybackSpeedSelection": "EnablePlaybackSpeedSelection",
    "EnableThirdPartyLessonPreview": "EnableThirdPartyLessonPreview",
    "EnableGlobalResourceThumbnails": "EnableGlobalResourceThumbnails",
    "EnableTranscriptImprovements": "EnableTranscriptImprovements",
}