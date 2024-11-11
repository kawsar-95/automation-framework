import arDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import { users } from "../../../../../../helpers/TestData/users/users"
import ARExternalTrainingPage, { externalTrainingDetails } from "../../../../../../helpers/AR/pageObjects/Reports/ARExternalTrainingPage"
import ARTemplatesReportPage from "../../../../../../helpers/AR/pageObjects/Reports/ARTemplatesReportPage"
import LEManageTemplatePrivateDashboardPage from '../../../../../../helpers/LE/pageObjects/Template/LEManageTemplatePrivateDashboardPage'
import LEManageTemplateTiles from "../../../../../../helpers/LE/pageObjects/Template/LEManageTemplateTiles"
import LEManageTemplateSettingsPage from "../../../../../../helpers/LE/pageObjects/Template/LEManageTemplateSettingsPage"
import ARDashboardAccountMenu from '../../../../../../helpers/AR/pageObjects/Menu/ARDashboardAccount.menu'
import LEDashboardPage from "../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage"
import LEExternalTrainingModal from "../../../../../../helpers/LE/pageObjects/Modals/LEExternalTraining.modal"
import { commonDetails } from "../../../../../../helpers/TestData/Courses/commonDetails"
import LESideMenu from '../../../../../../helpers/LE/pageObjects/Menu/LESideMenu'

describe('C7555 - AUT776 - Regression - LE - External Training', function(){
    
    beforeEach('Login as an Admin go to External Training', function(){
        //Sign in as system admin a
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getShortWait()
        cy.get(arDashboardPage.getCurrentUserLabel()).should('contain', "GUI_Auto Sys_Admin_01")
        cy.get(arDashboardPage.getElementByDataNameAttribute(arDashboardPage.getHelpAndSupportBtn())).should('be.visible')
        //Select Account Menu 
        cy.get(arDashboardPage.getElementByDataNameAttribute(arDashboardPage.getAccountBtn())).click()
        //Select Portal Setting option from account menu
        cy.get(ARDashboardAccountMenu.getPortalSettingsBtn()).should('exist').click()
        //Click on Manage External Training Templete button
        ARExternalTrainingPage.getActionMenuItemsByName('Manage External Training Templates')
        arDashboardPage.getShortWait()       
    })

    it('Create an external training without file upload section', function(){
        //Click on External Training Templates button
        ARExternalTrainingPage.getActionMenuItemsByName('External Training Templates')
        arDashboardPage.getShortWait()         
        cy.get(ARExternalTrainingPage.getNameTextF()).type(externalTrainingDetails.externalTrainingName)
        cy.get(ARExternalTrainingPage.getInActiveToggleBtn()).click()
        arDashboardPage.getShortWait()
        cy.get(ARExternalTrainingPage.getFieldsTabsMenuItem()).click()
        arDashboardPage.getShortWait()
        cy.get(ARExternalTrainingPage.getUploadFileDDownBtn()).select('Hidden')
        cy.get(ARExternalTrainingPage.getSaveBtn()).click()
        arDashboardPage.getShortWait()
    })

    it('Create an external training with file upload section', function(){
        //Click on External Training Templates button
        ARExternalTrainingPage.getActionMenuItemsByName('External Training Templates')
        arDashboardPage.getShortWait()         
        cy.get(ARExternalTrainingPage.getNameTextF()).type(externalTrainingDetails.externalTrainingName2)
        cy.get(ARExternalTrainingPage.getInActiveToggleBtn()).click()
        arDashboardPage.getShortWait()
        cy.get(ARExternalTrainingPage.getFieldsTabsMenuItem()).click()
        arDashboardPage.getShortWait()
        cy.get(ARExternalTrainingPage.getUploadFileDDownBtn()).select('Required')
        cy.get(ARExternalTrainingPage.getSaveBtn()).click()
        arDashboardPage.getShortWait()
    })

    it('Verify created external trainings', function(){
        arDashboardPage.getShortWait()
        cy.get(ARExternalTrainingPage.getExternalTrainingNameLabel()).contains(externalTrainingDetails.externalTrainingName).should('exist')
        arDashboardPage.getShortWait()
        cy.get(ARExternalTrainingPage.getExternalTrainingNameLabel()).contains(externalTrainingDetails.externalTrainingName2).should('exist')
    })

})

describe('Edit external training templates', function(){
    
    beforeEach(function () {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')

    })

    after(function () {
        cy.learnerLoginThruDashboardPageWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password)
        LEDashboardPage.getShortWait()
        cy.get(LEDashboardPage.getNavMenu()).click()
        LEDashboardPage.getVShortWait()
        LESideMenu.getLEMenuItemsByNameThenClick('Manage Template')
        LEDashboardPage.getShortWait()
        LEManageTemplatePrivateDashboardPage.getManageTemplatePrivateDashContainerByNameThenClick('Content').should('be.visible')
        LEManageTemplateTiles.getDeleteLastTileByLabelName('Tile')
        cy.get(LEManageTemplateTiles.getWelcomeTileSavebutton()).click()
        LEDashboardPage.getMediumWait()
        LEManageTemplateTiles.getSelectHorizontalMenuItemsByName('Settings')
        LEDashboardPage.getShortWait()
        LEManageTemplateSettingsPage.getContentMenuItemByName('Private Menu')
        LEDashboardPage.getShortWait()
        cy.get(LEManageTemplateSettingsPage.getContainerByIndex(3)).within(()=>{
            cy.get(LEManageTemplateSettingsPage.getDeleteBtn()).last().click()
            LEDashboardPage.getVShortWait()
            cy.get(LEManageTemplateSettingsPage.getWelcomeTileSavebutton()).click()
            LEDashboardPage.getShortWait() 
        })
        LEDashboardPage.getShortWait()
        cy.get(LEDashboardPage.getNavMenu()).click()
        LEDashboardPage.getShortWait()
        cy.get(LESideMenu.getAdminMenuItem()).click()
        LEDashboardPage.getShortWait()
        cy.get(arDashboardPage.getCurrentUserLabel()).should('contain', "GUI_Auto Sys_Admin_01")
        cy.get(arDashboardPage.getElementByDataNameAttribute(arDashboardPage.getHelpAndSupportBtn())).should('be.visible')
        //Select Account Menu 
        cy.get(arDashboardPage.getElementByDataNameAttribute(arDashboardPage.getAccountBtn())).click()
        //Select Portal Setting option from account menu
        cy.get(ARDashboardAccountMenu.getPortalSettingsBtn()).should('exist').click()
        //Click on Manage External Training Templete button
        ARExternalTrainingPage.getActionMenuItemsByName('Manage External Training Templates')
        arDashboardPage.getShortWait()
        arDashboardPage.A5AddFilter('Name', 'Equals', externalTrainingDetails.externalTrainingName)
        LEDashboardPage.getShortWait()
        cy.get(arDashboardPage.getGridTable()).eq(0).click()
        LEDashboardPage.getVShortWait()
        arDashboardPage.getA5AddEditMenuActionsByNameThenClick('Delete')
        LEDashboardPage.getVShortWait()
        cy.get(arDashboardPage.getA5ConfirmBtn()).contains('OK').click()
        LEDashboardPage.getShortWait()
        arDashboardPage.A5AddFilter('Name', 'Equals', externalTrainingDetails.externalTrainingName2)
        LEDashboardPage.getShortWait()
        cy.get(arDashboardPage.getGridTable()).eq(0).click()
        LEDashboardPage.getVShortWait()
        arDashboardPage.getA5AddEditMenuActionsByNameThenClick('Delete')
        LEDashboardPage.getVShortWait()
        cy.get(arDashboardPage.getA5ConfirmBtn()).contains('OK').click()
        LEDashboardPage.getShortWait()  
    })    

    it('Create Templates for created external trainings', function(){
        //Navigate to Templates
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Setup'))).click()
        ARTemplatesReportPage.getTemplatesPage()
        cy.get(arDashboardPage.getA5PageHeaderTitle()).should('have.text', 'Templates')
        arDashboardPage.getShortWait()
        cy.get(arDashboardPage.getGridTable()).eq(0).click()
        arDashboardPage.getShortWait()
        ARExternalTrainingPage.getActionMenuItemsByName('Edit')
        arDashboardPage.getMediumWait()
        LEManageTemplatePrivateDashboardPage.getManageTemplatePrivateDashContainerByNameThenClick('Content').should('be.visible')        
        LEManageTemplateTiles.getAddAndEditTileByLabelName(externalTrainingDetails.externalTrainingName,'Tile','External Training')
        arDashboardPage.getShortWait()
        cy.get(LEManageTemplateTiles.getWelcomeTileSavebutton()).click()
        arDashboardPage.getMediumWait()
        LEManageTemplateTiles.getSelectHorizontalMenuItemsByName('Settings')
        arDashboardPage.getShortWait()
        LEManageTemplateSettingsPage.getContentMenuItemByName('Private Menu')
        LEManageTemplateSettingsPage.getAddPrivateMenuItem(externalTrainingDetails.externalTrainingName2,'Tile','External Training')     
    })



    it('Verfiy created external training is accessable', function(){
        arDashboardPage.getShortWait()
        cy.get(arDashboardPage.getCurrentUserLabel()).should('contain', "GUI_Auto Sys_Admin_01")
        cy.get(arDashboardPage.getElementByDataNameAttribute(arDashboardPage.getAccountBtn())).click()
        //Select Account Menu 
        cy.get(arDashboardPage.getLearnerAndReviwerExperienceBtn()).contains('Learner Experience').click()
        LEDashboardPage.getLongWait()
        cy.get(LEDashboardPage.getTileName()).contains(externalTrainingDetails.externalTrainingName).should('exist').click()
        LEDashboardPage.getShortWait()
        cy.get(LEExternalTrainingModal.getModalTitle()).should('exist').and('contain',externalTrainingDetails.externalTrainingName) 
        cy.get(LEExternalTrainingModal.getFileUploadModuleContainer()).should('not.exist')
        cy.get(LEExternalTrainingModal.getCloseModalBtn()).click() 
        LEDashboardPage.getShortWait()
        cy.get(LEDashboardPage.getNavMenu()).click()
        LEDashboardPage.getVShortWait()
        LESideMenu.getLEMenuItemsByNameThenClick(externalTrainingDetails.externalTrainingName2)
        LEDashboardPage.getShortWait()
        cy.get(LEExternalTrainingModal.getModalTitle()).should('exist').and('contain',externalTrainingDetails.externalTrainingName2) 
        cy.get(LEExternalTrainingModal.getFileUploadModuleContainer()).should('exist')
        LEDashboardPage.getShortWait()
        cy.get(LEExternalTrainingModal.getCourseNameTextF()).type(externalTrainingDetails.externalTrainingName2)
        LEDashboardPage.getVShortWait()
        cy.get(LEExternalTrainingModal.getCompletionDateTextF()).first().click()
        LEDashboardPage.getVShortWait()
        cy.get(LEExternalTrainingModal.getCalenderTodayDay()).first().click()
        LEDashboardPage.getVShortWait()
        cy.get(LEExternalTrainingModal.getFileUploadBtn()).click()
        LEDashboardPage.getVShortWait()
        cy.get(LEExternalTrainingModal.getFilePathTxt()).attachFile(commonDetails.filePath + commonDetails.posterFMUploadName)
        LEDashboardPage.getVShortWait()
        cy.get(LEExternalTrainingModal.getSubmitBtn()).click()
        LEDashboardPage.getVShortWait()
    })

    it('Navigate to reports page and delete submission', function(){
        arDashboardPage.getMediumWait()
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel("Reports"))).click()
        arDashboardPage.getMenuItemOptionByName('External Training')
        LEDashboardPage.getVShortWait()
        arDashboardPage.A5AddFilter('Course Name', 'Equals', externalTrainingDetails.externalTrainingName2)
        LEDashboardPage.getShortWait()
        cy.get(arDashboardPage.getGridTable()).eq(0).click()
        LEDashboardPage.getVShortWait()
        arDashboardPage.getA5AddEditMenuActionsByNameThenClick('Delete')
        LEDashboardPage.getVShortWait()
        cy.get(arDashboardPage.getA5ConfirmBtn()).contains('OK').click()
        LEDashboardPage.getShortWait()
    })
})