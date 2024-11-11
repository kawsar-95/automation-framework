import ARBasePage from "../../AR/ARBasePage";

export default new class adminUserMenu extends ARBasePage {

    userAccount() {
        return `[data-name="button-account"]`;
    }

    portalSettings() {
        return `[title="Portal Settings"]`;
    }

    autoTaggingEnabled() {
        return `[id="IsAutoTaggingEnabled"]`;
    }

    btnPortalSettingsSave() {
        return `[class="has-icon btn submit-edit-content success large"]`;
    }

    /**
     * Added for the TC# C7367
     * @param {string} idName ID Name 
     */
    getElementById(idName){
        return `[id="${idName}"]`;
    }

    /**
     * Added for the TC# C7367
     * @param {string} idName Parent ID Name of an 'a' tag
     */
    getToggleBtn(idName) {
        return `[id="${idName}"]>a`;
    }

    /**
     * Added for the TC# C7367
     * Turn Toggle On/Off by ID
     * @param {string} toggleId The Toggle ID. i.e. IsNewFileManagerEnabled
     * @param {string} toggleType The new status of the toggle. 'on' for turning the toggle on and  'off'/'' for turning the toggle off
     */
    clickToggleMenu(toggleId, toggleType = 'off') {
        cy.get(this.getToggleBtn(toggleId)).then(($btn) => {
            if($btn.hasClass('toggle on')) {
                cy.get(this.getToggleBtn(toggleId)).should('have.class','toggle on')
                if (toggleType === '' || toggleType === 'off'){
                    cy.get(this.getToggleBtn(toggleId)).click();
                }
            } else {
                cy.get(this.getToggleBtn(toggleId)).should('not.have.class','on')
                if (toggleType === 'on'){
                    cy.get(this.getToggleBtn(toggleId)).click();
                }
            }
        })
    }

    // Added for the JIRA# AUT-447, TC# C1849 
    getAccountMenu() {
        return '[class*="_account_menu"]'
    }

    assertAdminAccountMenus() {
        cy.get(this.getAccountMenu()).children().should(($child) => {
            expect($child).to.contain('Change Password')
            expect($child).to.contain('User Settings')
            expect($child).to.contain('Portal Settings')
            expect($child).to.contain('Learner Experience')
            expect($child).to.contain('Logout')
        })
    }
}