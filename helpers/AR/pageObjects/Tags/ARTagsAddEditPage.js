import ARBasePage from "../../ARBasePage";

export default new (class ARTagsAddEditPage extends ARBasePage {
    // Tag Page Elements

    // Use this text as value for aria-label attribute to get this element
    getNameTxtF() {
        return "Name";
    }

    navigateToTag() {
        cy.get("#form-control-undefined-3").scrollIntoView({ easing: "linear" });
    }

    getChooseAndClick() {
        cy.get("#form-control-undefined-3").contains("Choose").click();
    }

    getTagInput() {
        return `[data-name="courseTagIds"] [data-name="input"]`
    }

    getSearchOptions() {
        return `[data-name="options"] [role="option"]`
    }

    getTagSearchOptionsDDownOpt() {
        return cy.get("#select-1-options");
    }

    getAddedTagContainer() {
        return '[class*="select-module__all_selections"]';
    }

    getLogoutBtn() {
        return `button[data-name="logout"]`;
    }

    getLearnerExperienceBtn() {
        return `[class*="_button_link"]`
    }

    getMyCourse() {
        return '[title="My Courses"]';
    }

    getSearchedTag() {
        return cy.get("#select-0-options");
    }

    getSelectedTags() {
        return '[data-name="courseTagIds"] [data-name="selection"]'
    }

    deselectTagByLabel(label){
        cy.get(this.getSelectedTags()).contains(label).parent().find(this.getXBtn()).click()
    }
})();
