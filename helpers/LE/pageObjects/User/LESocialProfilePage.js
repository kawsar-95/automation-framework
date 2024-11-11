import leBasePage from '../../LEBasePage'
let count

export default new class LEProfilePage extends leBasePage {

    getSocialProfilePreviewBackBtn() {
        return `a[title='View Profile']`;
    }

    getSocialProfilePreviewBarDescriptionMsg() {
        return `[class*="social-profile-preview-bar-module__description"]`;
    }

    getSocialProfilePreviewBarDescriptionTxt() {
        return `This is a preview of how other Learners see your profile.`
    }

    getSocialProfileHeaderName() {
        return `.social-profile-header__name`;
    }

    getSocialProfileModuleCount() {
        return `[class*="social-profile-count-module__count"]`;
    }

    getSocialProfileModuleType() {
        return `[class*="social-profile-count-module__type"]`;
    }

    getSocialProfileModuleAnchor() {
        return `[class*="anchor-link-module__btn"]`;
    }

    getSocialProfileRows() {
       return `[class*="table-row-module__table_row___"]`;
    }

    getSocialProfileCourses() {
        return `[class*="panel-module__panel_header_focus"]`;
    }

    getSocialProfileSendMessageBtn() {
        return `[class*="social-profile__send_message_button"]`;
    }

    getTable(){
        return `[class*="sortable-table-module__table"]`
    }

    getSocialProfileBadgesModuleTitle() {
        return `[class*="social-profile-badges-module__title"]`
    }

    getSocialProfileCompetenciesModuleTitle() {
        return `[class*="social-profile-competencies-module__title"]`
    }

    getSocialProfileCertificcatesModuleTitle() {
        return `[class*="social-profile-certificates-module__title"]`
    }

    getSocialProfileCoursesModuleTitle() {
        return `[class*="social-profile-courses-module__title"]`
    }

    getModuleCountbyName(name) {
        cy.get(this.getSocialProfileModuleType()).contains(name).parents(this.getSocialProfileModuleAnchor()).within(() => {
            cy.get(this.getSocialProfileModuleCount()).then((ct) => {
               count = ct.text() })
        })
    }

    verifySocialProfileItemsInTable(title, name) {
        this.getModuleCountbyName(name)
        cy.get(this.getTable()).contains(title).parents(this.getTable()).within(() => {
           return cy.get(this.getSocialProfileRows()).should('have.length', count)})
    }

    verifySocialProfileCourses(text) {
        this.getModuleCountbyName(text)
        cy.get(this.getSocialProfileCourses()).then((ct) => { expect(ct).to.have.lengthOf(count)  })
    }

    getBadgeBtn() {
        return `button[class*="social-profile-badge__button"]`
    }

    verifySocialProfileBadges(text) {
        this.getModuleCountbyName(text)
        cy.get(this.getBadgeBtn()).then((ct) => { expect(ct).to.have.lengthOf(count)  })
    }

    getCompetencyDialogueModal() {
        return `[role="dialog"][aria-label="Competencies"]`
    }

    getCompetencyModalDate(){
        return `[class*="competency-module__date_acquired___UB7Ky competency__date_acquired"]`
    }
    
    getSocialProfileNoInformationDiv() {
        return '[class*="social-profile__no_information_to_display"]'
    }

    socialProfileNoInformationMsg() {
        return "We couldn't find any information."
    }

    getNotFoundModuleHeader() {
        return '[class*="not-found-module__header"]'
    }

    getNotFoundModuleDescription() {
        return '[class*="not-found-module__description"]'
    }

    getNotFoundModuleDescriptionMsg() {
        return "We're sorry, we cannot find what you are looking for."
    }

    getNotFoundModuleLink() {
        return '[class*="not-found-module__link"]'
    }

    getNotFoundModuleIcon() {
        return '[class*="not-found-module__icon"]'
    }
}

export const userProfileURLs ={
    "blatantAdminProfileURL": "https://guiaar.qa.myabsorb.com/#/social-profile/ca6cad0e-8d7c-434d-b39e-d0991716e2fd"
}