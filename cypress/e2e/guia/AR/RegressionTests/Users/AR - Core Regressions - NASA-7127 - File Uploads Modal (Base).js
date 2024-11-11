import AdminNavationModuleModule from "../../../../../../helpers/AR/modules/AdminNavationModule.module"
import ARBillboardsAddEditPage from "../../../../../../helpers/AR/pageObjects/Billboards/arBillboardsAddEditPage"
import ARBillboardsPage from "../../../../../../helpers/AR/pageObjects/Billboards/ARBillboardsPage"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import A5GlobalResourceAddEditPage from "../../../../../../helpers/AR/pageObjects/GlobalResources/A5GlobalResourceAddEditPage"
import ARGlobalResourcePage from "../../../../../../helpers/AR/pageObjects/GlobalResources/ARGlobalResourcePage"
import ARDeleteModal from "../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal"
import ARUploadFileModal from "../../../../../../helpers/AR/pageObjects/Modals/ARUploadFileModal"
import ARNewsArticlesAddEditPage from "../../../../../../helpers/AR/pageObjects/NewsArticles/ARNewsArticlesAddEditPage"
import ARPollsAddEditPage from "../../../../../../helpers/AR/pageObjects/Polls/ARPollsAddEditPage"
import ARPollsPage from "../../../../../../helpers/AR/pageObjects/Polls/ARPollsPage"
import AREditClientUserPage from "../../../../../../helpers/AR/pageObjects/PortalSettings/AREditClientUserPage"
import adminUserMenu from "../../../../../../helpers/ML/mlPageObjects/adminUserMenu"
import { billboardsDetails } from "../../../../../../helpers/TestData/Billboard/billboardsDetails"
import { commonDetails } from "../../../../../../helpers/TestData/Courses/commonDetails"
import { newsArticleDetails } from "../../../../../../helpers/TestData/NewsArticle/NewsArticleDetails"
import { images, resourcePaths } from "../../../../../../helpers/TestData/resources/resources"
import { users } from '../../../../../../helpers/TestData/users/users'

describe('C7367 - AUT-735 - NASA-7127 - AR - Core Regressions - File Uploads Modal (Base)', () => {

    after('Remove News Article and Billboar as part of clean-up', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getMediumWait()
        // Remove News Article
        AdminNavationModuleModule.navigateToNewsArticlesPage()        
        A5GlobalResourceAddEditPage.A5AddFilter('Title', 'Contains', newsArticleDetails.newsArticleName)
        ARDashboardPage.getShortWait()
        cy.get(ARDashboardPage.getA5TableCellRecordByColumn(2)).contains(newsArticleDetails.newsArticleName).click()
        cy.wrap(ARDashboardPage.A5WaitForElementStateToChange(ARDashboardPage.getA5AddEditMenuActionsByIndex(2), 1000))
        ARDashboardPage.getA5AddEditMenuActionsByNameThenClick('Delete News Article')
        cy.get(ARDeleteModal.getA5OKBtn()).click()
        ARDashboardPage.getShortWait()

        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        // Remove BillBoard
        AdminNavationModuleModule.navigateToBillboardsPage()        
        ARDashboardPage.AddFilter('Title', 'Contains', `${billboardsDetails.billboardName}`)
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getGridTable()).eq(0).click()
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Delete Billboard')).click()
        ARDashboardPage.getMediumWait()
        cy.get(ARDeleteModal.getARDeleteBtn()).click()
    })

    it('Navigate to Feature Flag Page and Turn Off the flag "EnableAdminRefreshFileReuse"', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getShortWait()
        cy.get(adminUserMenu.userAccount()).click()
        cy.get(adminUserMenu.portalSettings()).click()
        ARDashboardPage.getShortWait()
        cy.get(ARDashboardPage.getUsersTab()).click()
        adminUserMenu.clickToggleMenu('IsNewFileManagerEnabled', 'off')
        cy.get(AREditClientUserPage.getSaveBtn()).click()
    })

    it('File Upload Modal Verification with "EnableAdminRefreshFileReuse" Off : Refresh Page', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getMediumWait()
        // Go to the Billboard page
        AdminNavationModuleModule.navigateToBillboardsPage()
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Add Billboard')).click()
        ARDashboardPage.getMediumWait()

        cy.get(ARBillboardsAddEditPage.getGeneralTitleTxtF()).clear().type(billboardsDetails.billboardName)
        ARDashboardPage.getShortWait()
        cy.get(ARBillboardsAddEditPage.getGeneralDescriptionTxtF()).type('This is Billboard automation test to edit it and change')
        // Set the Billboard tyep as image
        ARBillboardsAddEditPage.getBillBoardImageRadioBtn('Image')
        cy.get(ARBillboardsAddEditPage.getChooseFileBtn()).click()

        cy.get('label').contains('Choose File').should('exist')
        cy.get(ARUploadFileModal.getVisibilityBtnByName('Public')).should('exist')
        cy.get(ARUploadFileModal.getVisibilityBtnByName('Private')).should('exist')
        cy.get(ARUploadFileModal.getSubmitBtn()).eq(0).should('exist')
        cy.get(ARUploadFileModal.getCancelModalBtn()).eq(0).should('exist')
        cy.get(ARUploadFileModal.getFilePathTxt()).attachFile(`${commonDetails.filePath}${commonDetails.posterImgName}`)
        ARDashboardPage.getLShortWait()
        cy.get(ARUploadFileModal.getSubmitBtn()).eq(0).click()
        ARDashboardPage.getMediumWait()
        cy.get(ARBillboardsAddEditPage.getSaveBtn()).click()
        ARDashboardPage.getMediumWait()

        
    })

    it('Filter Billboards and verify poster image', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getMediumWait()
        // Go to the Billboard page
        AdminNavationModuleModule.navigateToBillboardsPage()
        ARBillboardsPage.getMediumWait()
        
        ARBillboardsPage.AddFilter('Title', 'Contains', billboardsDetails.billboardName)
        ARBillboardsPage.getLongWait()
        cy.get(ARDashboardPage.getGridTable()).eq(0).click()
        cy.wrap(ARBillboardsPage.WaitForElementStateToChange(ARBillboardsPage.getAddEditMenuActionsByName('Edit Billboard'), 1000))
        cy.get(ARBillboardsPage.getAddEditMenuActionsByName('Edit Billboard')).click()
        ARBillboardsPage.getMediumWait()
        cy.get(ARBillboardsAddEditPage.getChooseFileBtn()).click()

        cy.get(ARBillboardsAddEditPage.getSelectedImageName()).should('contain', commonDetails.posterImgName)
        cy.get(ARBillboardsAddEditPage.getItemLastModified()).contains('Last modified by').should('exist')
        cy.get(ARUploadFileModal.getVisibilityBtnByName('Public')).should('have.attr', 'aria-checked', 'true')

        cy.get(ARUploadFileModal.getFilePathTxt()).attachFile(`${commonDetails.filePath}${commonDetails.posterFMUploadOCImgName}`)
        ARBillboardsAddEditPage.getLShortWait()
        cy.get(ARBillboardsAddEditPage.getSubmitBtn()).eq(0).click()
        ARBillboardsAddEditPage.getMediumWait()
        cy.get(ARBillboardsAddEditPage.getSaveBtn()).click()
    })

    it('File Upload Modal Verification with "EnableAdminRefreshFileReuse" Off : A5 Page ', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        AdminNavationModuleModule.navigateToNewsArticlesPage()
        ARPollsPage.getA5AddEditMenuActionsByNameThenClick('News Articles')
        ARPollsPage.getShortWait()
        ARNewsArticlesAddEditPage.getAddResourcePage()
        cy.get(ARNewsArticlesAddEditPage.getNameTxtF()).type(newsArticleDetails.newsArticleName)
        cy.get(ARNewsArticlesAddEditPage.getDescriptionTxtF()).type(newsArticleDetails.description)
        cy.get(A5GlobalResourceAddEditPage.getChooseFileBtn()).should('contain', 'Choose File')
        cy.get(A5GlobalResourceAddEditPage.getChooseFileBtn()).click()
        cy.get(ARUploadFileModal.getA5ChooseFileBtn()).click({ force: true })
        cy.get(A5GlobalResourceAddEditPage.getAvailabilityBtn('Public')).should('exist')
        cy.get(A5GlobalResourceAddEditPage.getAvailabilityBtn('Private')).should('exist')

        cy.get(ARUploadFileModal.getFilePathTxt()).attachFile(resourcePaths.resource_image_folder + images.moose_filename)
        ARDashboardPage.getShortWait()
        //Check If Public radio button is selected
        A5GlobalResourceAddEditPage.getAvailabilityPublicRadoioBtnSelected()
        cy.get(ARUploadFileModal.getA5SaveBtn()).click()
        ARDashboardPage.getShortWait()
        cy.get(ARPollsAddEditPage.getA5IsPublishedToggleON()).click()
        ARDashboardPage.getShortWait()
        cy.get(A5GlobalResourceAddEditPage.getA5SaveBtn()).should('exist')
        cy.get(A5GlobalResourceAddEditPage.getA5CancelBtn()).should('exist')
        cy.get(A5GlobalResourceAddEditPage.getA5SaveBtn()).click()
        ARDashboardPage.getShortWait()


        // Re-modify News Article
        A5GlobalResourceAddEditPage.A5AddFilter('Title', 'Contains', newsArticleDetails.newsArticleName)
        ARDashboardPage.getLongWait()
        cy.get(ARDashboardPage.getA5TableCellRecordByColumn(2)).contains(newsArticleDetails.newsArticleName).click()
        cy.wrap(ARDashboardPage.A5WaitForElementStateToChange(ARDashboardPage.getA5AddEditMenuActionsByIndex(1), 1000))
        ARDashboardPage.getA5AddEditMenuActionsByNameThenClick('Edit')
        ARDashboardPage.getShortWait()

        cy.get(A5GlobalResourceAddEditPage.getChooseFileBtn()).click()
        cy.get(ARUploadFileModal.getA5ChooseFileBtn()).click({ force: true })
        cy.get(ARUploadFileModal.getFilePathTxt()).attachFile(resourcePaths.resource_image_folder + images.happy_qas_filename)
        ARDashboardPage.getShortWait()
        cy.get(A5GlobalResourceAddEditPage.getFileUpdateInformationText()).should('contain', 'Last modified by')
        A5GlobalResourceAddEditPage.getAvailabilityPublicRadoioBtnSelected()
        cy.get(ARUploadFileModal.getA5SaveBtn()).click()
        ARDashboardPage.getShortWait()
        cy.get(A5GlobalResourceAddEditPage.getA5SaveBtn()).click()

    })

    it('Navigate to Feature Flag Page and Turn On the flag "EnableAdminRefreshFileReuse"', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getShortWait()
        cy.get(adminUserMenu.userAccount()).click()
        cy.get(adminUserMenu.portalSettings()).click()
        ARDashboardPage.getShortWait()
        cy.get(ARDashboardPage.getUsersTab()).click()
        adminUserMenu.clickToggleMenu('IsNewFileManagerEnabled', 'on')
        cy.get(AREditClientUserPage.getSaveBtn()).click()
    })

    it('New File Upload Modal Verification with "EnableAdminRefreshFileReuse" On : Refresh Page', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        AdminNavationModuleModule.navigateToBillboardsPage()
                
        ARDashboardPage.AddFilter('Title', 'Contains', billboardsDetails.billboardName)
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getGridTable()).eq(0).click()
        cy.wrap(ARBillboardsPage.WaitForElementStateToChange(ARBillboardsPage.getAddEditMenuActionsByName('Edit Billboard'), 1000))
        cy.get(ARBillboardsPage.getAddEditMenuActionsByName('Edit Billboard')).click()
        ARDashboardPage.getMediumWait()
        cy.get(ARBillboardsAddEditPage.getChooseFileBtn()).click()

        cy.get(ARBillboardsAddEditPage.getSearchResultMsg()).should('exist')
        cy.get(ARUploadFileModal.getMediaLibraryUploadBtn()).should('exist')
        cy.get(ARGlobalResourcePage.getFileCancelBtn()).should('exist')
        cy.get(ARGlobalResourcePage.getFileCancelBtn()).click()

        cy.get(ARBillboardsAddEditPage.getChooseFileBtn()).click()
        cy.get(ARUploadFileModal.getImagePreviewBtn()).eq(0).click()
        cy.get(ARUploadFileModal.getApplyBtn()).click()
    })
})



