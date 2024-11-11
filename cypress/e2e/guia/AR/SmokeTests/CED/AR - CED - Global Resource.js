/// <reference types="cypress" />
import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import A5GlobalResourceAddEditPage from '../../../../../../helpers/AR/pageObjects/GlobalResources/A5GlobalResourceAddEditPage'
import arDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import { users } from '../../../../../../helpers/TestData/users/users'
import { resourceDetails } from '../../../../../../helpers/TestData/GlobalResources/globalResources'
import { miscData } from '../../../../../../helpers/TestData/Misc/misc'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import ARCourseSettingsCatalogVisibilityModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCatalogVisibility.module'
import ARCourseSettingsEnrollmentRulesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
import A5LeaderboardsAddEditPage from '../../../../../../helpers/AR/pageObjects/Leaderboards/A5LeaderboardsAddEditPage'
import ARNewsArticlesAddEditPage from '../../../../../../helpers/AR/pageObjects/NewsArticles/ARNewsArticlesAddEditPage'
import ARGlobalResourcePage from '../../../../../../helpers/AR/pageObjects/GlobalResources/ARGlobalResourcePage'

describe('AR - CED - Global Resource', function () {

    beforeEach(function () {
        // Sign in with System Admin account
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        //cy.get(arDashboardPage.getSysAdminDashboardPageTitle()).should('have.text', arDashboardPage.getSysAdminDashboardPageTitleTxt())
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        arDashboardPage.getMenuItemOptionByName('Global Resources')
        arDashboardPage.getMediumWait()
    })

    it('Verify Admin Can Create a Global Resource', () => {
        // Create Global Resource
        cy.get(arDashboardPage.getAddEditMenuActionsByName('Add Global Resource')).should('exist').and('have.text', 'Add Global Resource').click()
        arDashboardPage.getShortWait()

        //Add name and description
        cy.get(A5GlobalResourceAddEditPage.getNameTxtF()).type(resourceDetails.resourceName)
        cy.get(A5GlobalResourceAddEditPage.getDescriptionTxtF()).type(resourceDetails.description)

        //Add Url
        cy.get(ARCourseSettingsCatalogVisibilityModule.getSouceRadioBtn()).contains('Url').click()
        arDashboardPage.getMediumWait()
        cy.get(A5GlobalResourceAddEditPage.getFileTxtF()).type(miscData.switching_to_absorb_img_url)

        //Add tag
        cy.get(A5GlobalResourceAddEditPage.getTagsTxtF()).type(commonDetails.tagName)
        cy.get(A5GlobalResourceAddEditPage.getTagsOpt()).contains(commonDetails.tagName).click()

        //Add availability rule
        cy.get(ARGlobalResourcePage.getAddRuleBtn()).click()
        // Add an avialabilit rules
        ARGlobalResourcePage.getAddRule(cy.get(ARGlobalResourcePage.getFirstRulesContainer()),'First Name','Equals',users.learner01.learner_01_fname)
        //Save Global Resource
        cy.get(ARGlobalResourcePage.getFileSaveBtn()).click()
        ARGlobalResourcePage.getShortWait()
    })

    it('Verify Admin Can Edit a Global Resource', () => {
        //Filter for, edit Global Resource and verify fields persisted
        arDashboardPage.AddFilter('Name', 'Contains', resourceDetails.resourceName)
        arDashboardPage.getShortWait()
        cy.get(arDashboardPage.getA5TableCellRecordByColumn(2)).contains(resourceDetails.resourceName).click()
        arDashboardPage.getMediumWait()
        cy.get(ARGlobalResourcePage.getEditGlobalRecourseBtn()).click()
        arDashboardPage.getMediumWait()

        //Edit Name and Description
        cy.get(A5GlobalResourceAddEditPage.getNameTxtF()).type(commonDetails.appendText)
        cy.get(A5GlobalResourceAddEditPage.getDescriptionTxtF()).should('have.value', resourceDetails.description).type(commonDetails.appendText)
        
        //Remove attachment
        cy.get(A5GlobalResourceAddEditPage.getFileTxtF()).clear()

        //Remove tag
        cy.get(ARGlobalResourcePage.getTagsContainer()).within(()=>{
            cy.get(ARGlobalResourcePage.getClearTagBtn()).click()
        })

        //Add second availabilty rule
        cy.get(ARGlobalResourcePage.getAddRuleBtn()).click()
        // Add an avialabilit rules
        ARGlobalResourcePage.getAddRule(cy.get(ARGlobalResourcePage.getSecondRulesContainer()),'First Name','Equals',users.learner01.learner_01_fname)
        //Save Global Resource
        cy.get(ARGlobalResourcePage.getFileSaveBtn()).click()
    })

    it('Verify Admin Can Delete a Global Resource', () => {
        //Filter for and Delete Global Resource
        arDashboardPage.AddFilter('Name', 'Contains', resourceDetails.resourceName + commonDetails.appendText)
        arDashboardPage.getShortWait()
        cy.get(arDashboardPage.getA5TableCellRecordByColumn(2)).contains(resourceDetails.resourceName + commonDetails.appendText).click()
        arDashboardPage.getMediumWait()
        cy.get(ARGlobalResourcePage.getDeleteGlobalRecourseBtn()).click()
        arDashboardPage.getMediumWait()
        cy.get(arDeleteModal.getARDeleteBtn()).click()
        arDashboardPage.getShortWait()
        cy.get(ARGlobalResourcePage.getNoResultMsg()).should('be.visible').and('contain','No results found.')
    })
})