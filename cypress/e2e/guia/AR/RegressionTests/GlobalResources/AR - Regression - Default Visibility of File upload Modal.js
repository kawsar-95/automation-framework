import ARCompetencyAddEditPage from "../../../../../../helpers/AR/pageObjects/Competency/ARCompetencyAddEditPage"
import ARCompetencyPage from "../../../../../../helpers/AR/pageObjects/Competency/ARCompetencyPage"
import ARCoursesPage from "../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage"
import ARAddMoreCourseSettingsModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module"
import ARCourseSettingsCatalogVisibilityModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCatalogVisibility.module"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARCouponsAddEditPage from "../../../../../../helpers/AR/pageObjects/E-commerce/Coupons/ARCouponsAddEditPage"
import A5GlobalResourceAddEditPage from "../../../../../../helpers/AR/pageObjects/GlobalResources/A5GlobalResourceAddEditPage"
import ARGlobalResourcePage from "../../../../../../helpers/AR/pageObjects/GlobalResources/ARGlobalResourcePage"
import ARFileManagerUploadsModal from "../../../../../../helpers/AR/pageObjects/Modals/ARFileManagerUploadsModal"
import ARSelectModal from "../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal"
import ARUploadFileModal from "../../../../../../helpers/AR/pageObjects/Modals/ARUploadFileModal"
import ARNewsArticlesAddEditPage from "../../../../../../helpers/AR/pageObjects/NewsArticles/ARNewsArticlesAddEditPage"
import ARPollsPage from "../../../../../../helpers/AR/pageObjects/Polls/ARPollsPage"
import ARQuestionBanksAddEditPage from "../../../../../../helpers/AR/pageObjects/QuestionBanks/ARQuestionBanksAddEditPage"
import ARQuestionBanksPage from "../../../../../../helpers/AR/pageObjects/QuestionBanks/ARQuestionBanksPage"
import { competencyDetails } from "../../../../../../helpers/TestData/Competency/competencyDetails"
import { courses } from "../../../../../../helpers/TestData/Courses/courses"
import { resourceDetails } from "../../../../../../helpers/TestData/GlobalResources/globalResources"
import { miscData } from "../../../../../../helpers/TestData/Misc/misc"
import { helperTextMessages, newsArticleDetails } from "../../../../../../helpers/TestData/NewsArticle/NewsArticleDetails"
import { qbDetails } from "../../../../../../helpers/TestData/QuestionBank/questionBanksDetails"
import { users } from "../../../../../../helpers/TestData/users/users"


describe('C4929 - AUT-37 - GUIA-Auto-AE Regression - File Upload | Default Visibility Check', () => {
    it('Default Visibility of Global Resource is Public', () => {
        //Login as an Admin
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        //Go to Global Resource Report
        ARDashboardPage.getGlobalResourcesReport()
        // Create Global Resource
        cy.get(ARGlobalResourcePage.getAddGlobalresourceBtn()).click()
        // Check if User is navigated to Add resource page
        ARGlobalResourcePage.getAddGlobalResourcePage()

        // Enter valid resource name
        cy.get(ARGlobalResourcePage.getNameField()).type(resourceDetails.resourceName)

        // Open Upload File Manager
        cy.get(ARGlobalResourcePage.getARSourceChooseFileBtn()).click()

        //Clicking on the upload button
        cy.get(ARFileManagerUploadsModal.getUploadButton()).click()

        //Asserting that Public is selected by default 
        cy.get(ARUploadFileModal.getPublicPrivateRadioBtn()).contains('Public').parent().find('input').should('have.attr', 'aria-checked', 'true')

        // Change the Visibility to Private from Public.
        cy.get(ARUploadFileModal.getPublicPrivateRadioBtn()).contains('Public').click()

        // Check Helper text when Public radio button is selecetd
        cy.get(ARUploadFileModal.getPublicPrivateHelperText()).should('have.text', helperTextMessages.textWhenPublicSelecetd)

        // Change the Visibility to Private from Public.
        cy.get(ARUploadFileModal.getPublicPrivateRadioBtn()).contains('Private').click()

        // Check Helper text when private radio button is selecetd
        cy.get(ARUploadFileModal.getPublicPrivateHelperText()).should('have.text', helperTextMessages.textWhenPrivateSelecetd)


    })

    it('Default Visibility of News Article is public', () => {
        // Sign in with System Admin account
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getNewsArticlesReport()
        cy.get(ARCouponsAddEditPage.getA5PageHeaderTitle()).should('contain', 'News Articles')
        ARPollsPage.getA5AddEditMenuActionsByNameThenClick('News Articles')
        ARNewsArticlesAddEditPage.getAddResourcePage()

        //Open Upload File Pop up
        cy.get(A5GlobalResourceAddEditPage.getChooseFileBtn()).click()
        //Asserting that Public is selected
        cy.get(ARNewsArticlesAddEditPage.getA5UploadFormDialogue()).within(() => {
            cy.get(ARNewsArticlesAddEditPage.getRadioSourceTitle()).contains("Public").parent().within(() => {
                cy.get(ARNewsArticlesAddEditPage.getSelectedIconBox()).should('have.css', 'display', 'none')
            })
        })

    })

    it("Default Visibility of Question Bank is public", () => {
        // Sign in with System Admin account
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        // Click the Courses menu item
        ARDashboardPage.getQuestionBankReport()
        // Create Question 1
        cy.get(ARQuestionBanksPage.getA5PageHeaderTitle()).should('have.text', "Question Banks")
        ARQuestionBanksPage.getA5AddEditMenuActionsByNameThenClick('Question Bank')
        ARQuestionBanksPage.A5WaitForElementStateToChange(ARQuestionBanksAddEditPage.getA5NameTxtF())

        // Enter a name in the name text field
        cy.get(ARQuestionBanksAddEditPage.getA5NameTxtF()).type(qbDetails.questionBanksName)
        cy.get(ARQuestionBanksAddEditPage.getA5CreateQuestionBtn()).click()
        cy.get(ARQuestionBanksAddEditPage.getA5OptionAnswerBtn()).click()

        //Open Upload File Pop up
        cy.get(A5GlobalResourceAddEditPage.getChooseFileBtn()).click()
        // Check if Upload File pop up is opened
        A5GlobalResourceAddEditPage.getUploadFilePopUpWindow()
        cy.get(ARUploadFileModal.getA5ChooseFileBtn()).click({ force: true })

        //Asserting that Private is selected and Default
        cy.get(ARNewsArticlesAddEditPage.getA5UploadFormDialogue()).within(() => {
            cy.get(ARNewsArticlesAddEditPage.getRadioSourceTitle()).contains("Private").parent().within(() => {
                cy.get(ARNewsArticlesAddEditPage.getSelectedIconBox()).should('have.css', 'display', 'none')
            })
        })

    })


    it(' Default Visibility of Competency  Badge is public ', () => {
        // Sign in with System Admin account
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getCompetenciesReport()
        ARCompetencyPage.getA5AddEditMenuActionsByNameThenClick('Competency')
        cy.get(ARCompetencyAddEditPage.getA5SaveBtn()).click()
        cy.get(ARCompetencyAddEditPage.getNameErrorMsg(), { timeout: 15000 }).should('have.text', 'Name is required')

        // Create Competency
        cy.get(ARCompetencyAddEditPage.getNameTxtF()).type(competencyDetails.competencyName)
        cy.get(ARCompetencyAddEditPage.getDescriptionTxtA()).type(competencyDetails.description)
        cy.get(ARCompetencyAddEditPage.getLeaderboardTxtF()).type(competencyDetails.competencyLeaderboard)

        cy.get(ARCompetencyAddEditPage.getHasBadgeImageToggleON()).click()

        // Open Upload File Pop up
        cy.get(A5GlobalResourceAddEditPage.getChooseFileBtn()).click()
        // Check if Upload File pop up is opened
        A5GlobalResourceAddEditPage.getUploadFilePopUpWindow()
        cy.get(ARUploadFileModal.getA5ChooseFileBtn()).click({ force: true })

        //Asserting that Private is selected and Default
        cy.get(ARNewsArticlesAddEditPage.getA5UploadFormDialogue()).within(() => {
            cy.get(ARNewsArticlesAddEditPage.getRadioSourceTitle()).contains("Private").parent().within(() => {
                cy.get(ARNewsArticlesAddEditPage.getSelectedIconBox()).should('have.css', 'display', 'none')
            })
        })


    })

    it(' Default Visibility of  Catalog Visibility is public ', () => {

        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getCoursesReport()
        cy.createCourse('Online Course')

        //Open Catalog Visibility Section
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Catalog Visibility')).click()


        //Select a Category
        cy.get(ARCourseSettingsCatalogVisibilityModule.getChooseCategoryBtn()).click()
        ARSelectModal.SearchAndSelectFunction([courses.category_01_name])


        //Add a Thumbnail Via URL Source
        cy.get(ARCourseSettingsCatalogVisibilityModule.getThumbnailRadioBtn()).contains('Url').click()
        cy.get(ARCourseSettingsCatalogVisibilityModule.getThumbnailUrlTxtF()).type(miscData.switching_to_absorb_img_url)

        //Add a Poster Via File Source
        cy.get(ARCourseSettingsCatalogVisibilityModule.getAddPosterBtn()).click()
        cy.get(ARCoursesPage.getElementByDataNameAttributeAndIndex(ARCourseSettingsCatalogVisibilityModule.getPosterGroup(), 0) + ' ' +
            ARCourseSettingsCatalogVisibilityModule.getPosterChooseFileBtn()).click()
        cy.get(ARCourseSettingsCatalogVisibilityModule.getUploadFileBtn()).click()


        cy.get(ARUploadFileModal.getChooseFileBtn()).click()
      
         //Asserting that Public is selected by default 
         cy.get(ARUploadFileModal.getPublicPrivateRadioBtn()).contains('Public').parent().find('input').should('have.attr', 'aria-checked', 'true')

         // Change the Visibility to Private from Public.
         cy.get(ARUploadFileModal.getPublicPrivateRadioBtn()).contains('Public').click()
 
         // Check Helper text when Public radio button is selecetd
         cy.get(ARUploadFileModal.getPublicPrivateHelperText()).should('have.text', helperTextMessages.textWhenPublicSelecetd)
 
         // Change the Visibility to Private from Public.
         cy.get(ARUploadFileModal.getPublicPrivateRadioBtn()).contains('Private').click()
 
         // Check Helper text when private radio button is selecetd
         cy.get(ARUploadFileModal.getPublicPrivateHelperText()).should('have.text', helperTextMessages.textWhenPrivateSelecetd)


    })

})