///<reference types="cypress"/>

import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage";
import A5GlobalResourceAddEditPage from "../../../../../../helpers/AR/pageObjects/GlobalResources/A5GlobalResourceAddEditPage";
import ARDeleteModal from "../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal";
import ARUnsavedChangesModal from "../../../../../../helpers/AR/pageObjects/Modals/ARUnsavedChangesModal";
import ARUploadFileModal from "../../../../../../helpers/AR/pageObjects/Modals/ARUploadFileModal";
import ARNewsArticlesAddEditPage from "../../../../../../helpers/AR/pageObjects/NewsArticles/ARNewsArticlesAddEditPage";
import ARPollsAddEditPage from "../../../../../../helpers/AR/pageObjects/Polls/ARPollsAddEditPage";
import ARPollsPage from "../../../../../../helpers/AR/pageObjects/Polls/ARPollsPage";
import { newsArticleDetails } from "../../../../../../helpers/TestData/NewsArticle/NewsArticleDetails";
import { images, resourcePaths } from "../../../../../../helpers/TestData/resources/resources";
import { users } from "../../../../../../helpers/TestData/users/users";
/**
 * Testrail URL 
 * https://absorblms.testrail.io/index.php?/cases/view/6297
 */
describe('Update Edit News Article - C6297', () => {
    beforeEach(() => {
        cy.apiLoginWithSession(
            users.sysAdmin.admin_sys_01_username,
            users.sysAdmin.admin_sys_01_password,
            "/admin"
        );
    })

    it('Create temporary Article', () => {
        cy.get(
            ARDashboardPage.getElementByAriaLabelAttribute(
                ARDashboardPage.getARLeftMenuByLabel('Engage')
            )
        ).click();
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('News Article'));
        ARPollsPage.getA5AddEditMenuActionsByNameThenClick('News Articles')
        ARPollsPage.getMediumWait()
        ARNewsArticlesAddEditPage.getAddResourcePage()
        //Enter valid title 
        cy.get(ARNewsArticlesAddEditPage.getNameTxtF()).type(newsArticleDetails.newsArticleName)
        //Enter description
        cy.get(ARNewsArticlesAddEditPage.getDescriptionTxtF()).type(newsArticleDetails.description)
        //Open Upload File Pop up
        cy.get(A5GlobalResourceAddEditPage.getChooseFileBtn()).click()

        cy.get(ARUploadFileModal.getA5ChooseFileBtn()).click({ force: true })
        cy.get(ARUploadFileModal.getFilePathTxt()).attachFile(resourcePaths.resource_image_folder + images.moose_filename)
        ARDashboardPage.getMediumWait()
        //Check If Public radio button is selected
        A5GlobalResourceAddEditPage.getAvailabilityPublicRadoioBtnSelected()
        cy.get(ARUploadFileModal.getA5SaveBtn()).click()
        ARDashboardPage.getShortWait()
        cy.get(ARPollsAddEditPage.getA5IsPublishedToggleON()).click()
        ARDashboardPage.getShortWait()
        cy.get(A5GlobalResourceAddEditPage.getA5SaveBtn()).click()
        ARDashboardPage.getMediumWait()


    })
    it('Update Edit News Article', () => {
        // const articleTitle = 'NASA set for third attempt to launch Artemis rocket to the moon'
        const articleTitle = newsArticleDetails.newsArticleName
        cy.get(
            ARDashboardPage.getElementByAriaLabelAttribute(
                ARDashboardPage.getARLeftMenuByLabel('Engage')
            )
        ).click();
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('News Article'));
        cy.wrap(ARDashboardPage.A5AddFilter('Title', 'Starts With', articleTitle))
        ARDashboardPage.getShortWait()
        cy.get(ARDashboardPage.getGridTable()).eq(0).click();


        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(1)).should('contain', 'Edit')

        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(1)).click({ force: true });
        ARDashboardPage.getShortWait();

        // cy.get(ARDashboardPage.getElementByNameAttribute('Title')).clear().type(articleTitle + '_Edited_');

        cy.get(ARDashboardPage.getElementByNameAttribute('redactor-editor-0')).within(() => {
            // cy.get('p').clear()
            cy.get('p').first().type('{end}{enter}----Edited----')
        })
        cy.get(ARDashboardPage.getA5SaveBtn()).click()

        //Check Cancel button when no changes are made
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(1)).click({ force: true });
        ARDashboardPage.getShortWait();
        cy.get(ARDashboardPage.getA5CancelBtn()).click({ force: true });
        cy.get(ARDashboardPage.getAccountHeaderLabel()).should('not.exist')

        //Check Cancel button when changes are made and click Cancel
        ARDashboardPage.getShortWait()
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(1)).click({ force: true });
        ARDashboardPage.getShortWait();
        cy.get(ARDashboardPage.getElementByNameAttribute('Title')).clear().type(articleTitle);
        cy.get(ARDashboardPage.getA5CancelBtn()).click({ force: true });
        cy.get(ARUnsavedChangesModal.getBlatantUnsavedChangesTxt())
            .should('contain', ARUnsavedChangesModal.getUnsavedChangesMsg())
        ARUnsavedChangesModal.getClickUnsavedActionBtnByName(`Cancel`)
        cy.get(ARDashboardPage.getAccountHeaderLabel()).should('exist')

        //Check Cancel button when changes are made and click Don't Save
        ARDashboardPage.getShortWait()
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(1)).click({ force: true });
        ARDashboardPage.getShortWait();
        cy.get(ARDashboardPage.getElementByNameAttribute('Title')).clear().type(articleTitle);
        cy.get(ARDashboardPage.getA5CancelBtn()).click({ force: true });
        cy.get(ARUnsavedChangesModal.getBlatantUnsavedChangesTxt())
            .should('contain', ARUnsavedChangesModal.getUnsavedChangesMsg())
        ARUnsavedChangesModal.getClickUnsavedActionBtnByName(`Don't Save`)
        cy.get(ARDashboardPage.getAccountHeaderLabel()).should('not.exist')

        //Delete Article
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(2)).click({ force: true });
        ARDashboardPage.getShortWait();
        cy.get(ARDeleteModal.getA5OKBtn()).click()








    })

})