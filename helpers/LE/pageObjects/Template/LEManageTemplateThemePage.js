import LEBasePage from '../../LEBasePage'

export default new class LEManageTemplateThemePage extends LEBasePage {
    
    getManageTemplateThemeContainerByNameThenClick(name) {
        return cy.get('[class*="theme-settings-module__wrapper"] div').contains(name).click()
    }

    //pass color picker label and desired color in hex format (ex. #355a75) to change the element's color via color picker
    getPickColorByName(label, color) {
        cy.get(this.getColorPickerLabel()).contains(`${label}`).parents(this.getColorPickerContainer()).within(() => {
            cy.get(this.getColorPickerBtn()).click({force:true})
        })
        cy.get(this.getColorPickerTxtF()).clear().type(color)
        cy.get(this.getColorPickerLabel()).contains(`${label}`).parents(this.getColorPickerContainer()).within(() => {
            cy.get(this.getColorPickerBtn()).click({force:true}) //close color picker
        })
    }

    getColorPickerBtn() {
        return '[class*="eyedropper"]'
    }

    getColorPickerTxtF() {
        return '[id*="rc-editable-input"]'
    }

    getColorPickerLabel() {
        return `[class*="color-selector-module__title"]`
    }

    getColorPickerContainer() {
        return `[class*="color-selector-module__wrapper"]`
    }

    getHeaderFontNameTextF() {
        return `[name="headerFontName"]`
    }

    getBodyFontNameTextF() {
        return `[name="bodyFontName"]`
    }

    getSaveBtn() {
        return `[type="submit"]`
    }

    getDefaultFont() {
        return `[href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700&subset=latin-ext"]`
    }

    getGoogleFont() {
        return `[href="https://fonts.googleapis.com/css?family=Dancing+Script%7CLobster"]`
    }
    
}

export const googleFontDetails = {
    default:"defaultFontName",
    lobster: "Lobster",
    dynaPuff: "DynaPuff",
    dancingScript: "Dancing Script"
}