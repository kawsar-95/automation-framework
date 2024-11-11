import leBasePage from '../../LEBasePage'

export default new class LEProfilePage extends leBasePage {

    getAvatarContainer() {
        return '[class*="my-profile-module__avatar_container"]'
    }

    getAvatarPlaceholder() {
        return '[class*="my-profile__avatar my-profile__avatar_placeholder"]'
    }

    getAvatar() {
        return '[class*="my-profile__avatar"]'
    }

    getUploadAvatarBtn() {
        return '[class*="icon icon-camera"]'
    }


    // Profile Page Tab Elements
    getProfileTabListByIndex(tabIndex=1) {
        return `div:nth-of-type(${tabIndex}) > [class*="tab-list-module__tab_btn"]`
    }

    //Pass the name of the tab you want to navigate to
    getProfileTabByName(name) {
        cy.get(`[class*="tab-list__tab"]`).contains(name).click()
    }

    // My Profile Module Elements
    getEditProfileBtn() {
        return `.my-profile__edit_profile > .btn`;
    }

    getChangePasswordBtn() {
        return `.my-profile__edit_password > .btn`;
    }

    getViewSocialProfileBtn() {
        return `.my-profile__view_social_profile > .btn`;
    }

    getProfilePageTitle() {
        return `[class*="banner-title-module__title"]`;
    }

    getLearnerFName(tabIndex=1) {
        return `div:nth-of-type(${tabIndex}) > [class*="read-only-form-value-field-module__value"]`
    }

    getLearnerLName(tabIndex=3) {
        return `div:nth-of-type(${tabIndex}) > [class*="read-only-form-value-field-module__value"]`
    }

    getLearnerUName(tabIndex=4) {
        return `div:nth-of-type(${tabIndex}) > [class*="read-only-form-value-field-module__value"]`
    }

    getLearnerEmail(tabIndex=5) {
        return `div:nth-of-type(${tabIndex}) > [class*="read-only-form-value-field-module__value"]`
    }

    getLearnerDepartment() {
        return `[class*="profile_field_department"]`;
    }

    getProfileFullName() {
        return `[class*="my-profile-module__profile_field_value_name___"]`
    }



}