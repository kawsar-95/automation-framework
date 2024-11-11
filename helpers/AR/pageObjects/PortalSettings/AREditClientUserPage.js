import arBasePage from "../../ARBasePage";

export default new (class AREditClientUserPage extends arBasePage {

    getNextgenLEflag() {
        return '[id="IsNextGenLearnerExperienceEnabled"]'
    }

    getSaveBtn() {
        return `div#sidebar-content > .btn.has-icon.large.submit-edit-content.success`
    }

    getNextgenToggleBtn() {
        return '[id="IsNextGenLearnerExperienceEnabled"]>a'
    }

    getUserWarningMsgToggleBtn() {
        return '[id="UserWarningMessageEnabled"]>a'
    }

    getLearnerUnenrollmentToggleBtn() {
        return '[id="IsLearnerUnEnrollEnabled"]>a'
    }

    /*
     These methods are to turn on and off for toggle buttons of Edit Client User Page. 
    */

    getTurnOnNextgenToggle() {
        cy.get(this.getNextgenToggleBtn()).then(($btn) => {
            if ($btn.hasClass('toggle on')) {
                cy.get(this.getNextgenToggleBtn()).should('have.class', 'toggle on')
            }
            else {
                cy.get(this.getNextgenLEflag()).click()
            }
        })
    }

    getTurnOffNextgenToggle() {
        let value = 'toggle'
        cy.get(this.getNextgenToggleBtn()).invoke('attr', 'class').then((status) => {
            if (status === value) {
                cy.get(this.getNextgenToggleBtn()).should('have.attr', 'class', value)
            }
            else {
                cy.get(this.getNextgenLEflag()).click()
                this.getShortWait()
                cy.get(this.getNextgenToggleBtn()).should('have.attr', 'class', value)
            }
        })
    }

    getAdminRefreshFlag() {
        return '[id="IsNasaEnabled"]'
    }

    getAdminRefreshToggleBtn() {
        return `${this.getAdminRefreshFlag()} > a`
    }

    switchAdminRegreshToggle(turnOn) {
        let status = turnOn === 'true' ? 'toggle on' : 'toggle'
        cy.get(this.getAdminRefreshToggleBtn()).then(($btn) => {
            if ($btn.hasClass(status)) {
                cy.get(this.getAdminRefreshToggleBtn()).should('have.class', status)
            }
            else {
                cy.get(this.getAdminRefreshToggleBtn()).click()
                this.getVShortWait()
                cy.get(this.getAdminRefreshToggleBtn()).should('have.attr', 'class', status)
            }
        })
    }

    getEnableTranscriptImprovementsToggleBtn() {
        return '[class*="katana-toggle"]'
    }

    getToggleLable() {
        return '[data-bind*="text: Name"]';
    }

    getToggleButtns() {
        return '[data-bind="click: ToggleChecked"]';
    }


    getTurnOnOffUserWarningMessageToggleBtn(value) {
        this.getShortWait()
        value = (value === 'true') ? 'toggle on' : 'toggle'
        cy.get(this.getUserWarningMsgToggleBtn()).invoke('attr', 'class').then((status) => {
            if (status === value) {
                cy.get(this.getUserWarningMsgToggleBtn()).should('have.attr', 'class', value)
            }
            else {
                cy.get(this.getUserWarningMsgToggleBtn()).click()
                this.getShortWait()
            }
        })
    }

    getTurnOnOffLearnerUnenrollmentToggleBtn(value) {
        this.getShortWait()
        value = (value === 'true') ? 'toggle on' : 'toggle'
        cy.get(this.getLearnerUnenrollmentToggleBtn()).invoke('attr', 'class').then((status) => {
            if (status === value) {
                cy.get(this.getLearnerUnenrollmentToggleBtn()).should('have.attr', 'class', value)
            }
            else {
                cy.get(this.getLearnerUnenrollmentToggleBtn()).click()
                this.getShortWait()
            }
        })
    }

    getLearnerSocialProfileDescriptionMessage() {
        return "Allow learners to view other learners' profiles. This feature can be configured within the Templates report."
    }

    getLearnerSocialProfileToggleBtn() {
        return '[id="IsLearnerSocialProfileEnabled"]>a'
    }

    getTurnOnOffLearnerSocialProfileToggleBtn(value) {
        this.getShortWait()
        value = (value === 'true') ? 'toggle on' : 'toggle'
        cy.get(this.getLearnerSocialProfileToggleBtn()).invoke('attr', 'class').then((status) => {
            if (status === value) {
                cy.get(this.getLearnerSocialProfileToggleBtn()).should('have.attr', 'class', value)
            }
            else {
                cy.get(this.getLearnerSocialProfileToggleBtn()).click()
                this.getShortWait()
            }
        })
    }

    getDescriptionDiv() {
        return `[class="highlight"]`;
    }
})