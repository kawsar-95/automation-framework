import LEBasePage from '../../LEBasePage'

export default new class LEManageTemplateLoginPage extends LEBasePage {

    getInheritSettingsOfParentDepartmentToggleBtn(){
        return `[class*="toggle-module__toggle___qh202 inherit-settings-module__toggle"]`
    }
    getPublicSignupEKeyToggleBtnContainer(){
        return `[class*="public_signup_enrollment_key_enabled_toggle"]`
    }
    getHideSignupButtonToggleContainer(){
        return `[class*="hide_signup_enabled_toggle"]`
    }

    getToggleSlider(){
        return `[class*="toggle__slider"]`
    }

    getToggleCheck(){
        return `[class*="redux-form-toggle__checkbox"]`
    }

    getInheritSettingsOfParentDepartmentToggleCheck(){
        return `[class="toggle-module__checkbox___r1NCJ toggle__checkbox"]`
    }
    
    getManageTemplateLoginContainerByNameThenClick(name) {
        return cy.get('[class*="login-page-settings-module__wrapper"] div').contains(name).click()
    }

    //Turns on/off the public signup EKey & Hide Sign Up Btn toggle and asserts the expected value - pass either 'true' or 'false'
    //pass 'true' to turn the toggle on, pass 'false' to turn the toggle off
    getPublicSignupEKeyToggle(value) {
        cy.get(this.getPublicSignupEKeyToggleBtnContainer()).within(() => {
            cy.get(this.getToggleCheck()).invoke('attr','value').then((status) =>{
                if(status === value){
                    cy.get(this.getToggleCheck()).should('have.attr', 'value', value)
                }
                else{
                cy.get(this.getToggleSlider()).click()
                    cy.wait(1000)
                    cy.get(this.getToggleCheck()).should('have.attr', 'value', value)
                }
            })
        })
    }

    getHideSignupButtonToggle(value) {
        cy.get(this.getHideSignupButtonToggleContainer()).within(() => {
            cy.get(this.getToggleCheck()).invoke('attr','value').then((status) =>{
                if(status === value){
                    cy.get(this.getToggleCheck()).should('have.attr', 'value', value)
                }
                else{
                cy.get(this.getToggleSlider()).click()
                    cy.wait(1000)
                    cy.get(this.getToggleCheck()).should('have.attr', 'value', value)
                }
            })
        })
    }

 //Turns on/off the Inherit Settings Of Parent Department Btn toggle and asserts the expected value - pass either 'true' or 'false'
 //pass 'true' to turn the toggle on, pass 'false' to turn the toggle off
    getInheritSettingsOfParentDepartmentToggle(value){

        cy.get(this.getInheritSettingsOfParentDepartmentToggleBtn()).within(()=>{
            cy.get(this.getInheritSettingsOfParentDepartmentToggleCheck()).invoke('attr','aria-checked').then((status) =>{
                if(status === value){
                    cy.get(this.getInheritSettingsOfParentDepartmentToggleCheck()).should('have.attr', 'aria-checked', value)
                }
                else{
                cy.get(this.getToggleSlider()).click()
                    cy.wait(1000)
                    cy.get(this.getInheritSettingsOfParentDepartmentToggleCheck()).should('have.attr', 'aria-checked', value)
                }
            })
        })
    }


    getEKeyTxtF() {
        return '[name="keyName"]'
    }

}