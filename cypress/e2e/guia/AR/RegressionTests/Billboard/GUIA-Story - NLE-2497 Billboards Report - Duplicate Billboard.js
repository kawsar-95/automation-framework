import ARBillboardsAddEditPage from "../../../../../../helpers/AR/pageObjects/Billboards/ARBillboardsAddEditPage"
import ARBillboardsPage from "../../../../../../helpers/AR/pageObjects/Billboards/ARBillboardsPage"
import ARAddEditCategoryPage from "../../../../../../helpers/AR/pageObjects/Category/ARAddEditCategoryPage"
import ARCoursesPage from "../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARGroupAddEditPage from "../../../../../../helpers/AR/pageObjects/Groups/ARGroupAddEditPage"
import ARUploadFileModal from "../../../../../../helpers/AR/pageObjects/Modals/ARUploadFileModal"
import { billboardsDetails } from "../../../../../../helpers/TestData/Billboard/billboardsDetails"
import { users } from "../../../../../../helpers/TestData/users/users"

describe('AUT-556 - C2011 - GUIA-Story - NLE-2497 Billboards Report - Duplicate Billboard', () => {
    after('Delete billboards', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getBillboardsReport()
        ARBillboardsPage.deleteBillboards([ billboardsDetails.billboardName,  billboardsDetails.billboardName + " - Copy",  billboardsDetails.billboardName2,  billboardsDetails.billboardName2 + " - Copy"])
      })

    it('Create billboards with image and video', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getBillboardsReport()
        cy.get(ARCoursesPage.getPageHeaderTitle()).should('have.text', 'Billboards')
        cy.wrap(ARDashboardPage.WaitForElementStateToChange(ARDashboardPage.getAddEditMenuActionsByName('Add Billboard'), 1000))
        cy.get(ARCoursesPage.getCoursesActionsButtonsByLabel('Add Billboard')).click()
        cy.get(ARAddEditCategoryPage.getPageHeaderTitle()).should('have.text', 'Add Billboard')
        ARDashboardPage.generalToggleSwitch('true' , ARBillboardsAddEditPage.getGeneralPublishedToggleContainer())
        cy.get(ARBillboardsAddEditPage.getGeneralTitleTxtF()).clear().type(billboardsDetails.billboardName)
        
        // Verify Save button should be disabled
        cy.get(ARBillboardsAddEditPage.getSaveBtn()).should('have.attr', 'aria-disabled', 'true')

        ARBillboardsAddEditPage.getBillBoardVideoRadioBtn("Video")
        cy.get(ARBillboardsAddEditPage.getWebMChosseBtn()).click()
        cy.get(ARUploadFileModal.getMediaLibraryUploadBtn()).click()
        cy.get(ARUploadFileModal.getFilePathTxt()).attachFile(billboardsDetails.uploadPathW)
        cy.get(ARBillboardsAddEditPage.getSaveBtn()).eq(0).should('have.attr', 'aria-disabled', 'false').click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout:60000 }).should('not.exist')

        // Specifying availability rules should be possible
        cy.get(ARBillboardsAddEditPage.getAvailabilityAddRuleBtn()).click()

        // Verify Availability Rules
        cy.get(ARBillboardsAddEditPage.getFirstRulesContainer()).within(() => {
            cy.get(ARBillboardsAddEditPage.getRuleDropDownBtn()).eq(0).click()
            ARBillboardsAddEditPage.verifyAvailabilityRules()
            cy.get(ARBillboardsAddEditPage.getRuleDropDownOptions()).contains('Username').click()
            cy.get(ARBillboardsAddEditPage.getRuleDropDownBtn()).eq(1).click()
            cy.get(ARBillboardsAddEditPage.getRuleDropDownOptions()).contains('Equals').click()
            cy.get(ARBillboardsAddEditPage.getRuleTextF()).type(users.learner01.learner_01_username)
        })

        // Verify User Count
        ARGroupAddEditPage.verifyUserCount(1)

        cy.get(ARBillboardsAddEditPage.getSaveBtn()).should('not.have.attr','aria-disabled', 'true').click()
        cy.get(ARDashboardPage.getToastSuccessMsg()).should('be.visible').and('contain','Billboard has been created.')
        cy.get(ARDashboardPage.getPageHeaderTitle()).should('have.text', 'Billboards')
        ARBillboardsPage.addSampleBillboard(billboardsDetails.billboardName2)
    })

    it('Image billboard can be duplicate', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getBillboardsReport()
        cy.get(ARCoursesPage.getPageHeaderTitle()).should('have.text', 'Billboards')
        ARBillboardsAddEditPage.AddFilter('Title', 'Contains', billboardsDetails.billboardName2)
        cy.get(ARDashboardPage.getTableCellName()).contains(billboardsDetails.billboardName2).click()

        // Select any existing Billboard and Verify that [Duplicate] button has been added to Billboard page
        cy.get(ARBillboardsPage.getDuplicateBillboardBtn()).should('exist')

        // Click on Duplicate Billboard Button
        cy.get(ARBillboardsPage.getDuplicateBillboardBtn()).click({ force: true })

        cy.get(ARAddEditCategoryPage.getPageHeaderTitle()).should('have.text', 'Add Billboard')

        cy.get(ARBillboardsAddEditPage.getGeneralTitleTxtF()).should('have.value', billboardsDetails.billboardName2 + " - Copy")

        cy.get(ARDashboardPage.getWaitSpinner(), { timeout:60000 }).should('not.exist')
        cy.get(ARBillboardsAddEditPage.getSaveBtn()).should('not.have.attr','aria-disabled', 'true').click()
        cy.get(ARDashboardPage.getToastSuccessMsg()).should('be.visible').and('contain','Billboard has been created.')
        cy.get(ARDashboardPage.getPageHeaderTitle()).should('have.text', 'Billboards')
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout:60000 }).should('not.exist')
        cy.get(ARDashboardPage.getTableCellName()).should('contain', billboardsDetails.billboardName2 + " - Copy")

        // Select any existing Billboard and Verify that [Duplicate] button has been added to Billboard page
        cy.get(ARBillboardsPage.getDuplicateBillboardBtn()).should('exist').click({ force: true })

        cy.get(ARAddEditCategoryPage.getPageHeaderTitle()).should('have.text', 'Add Billboard')

        cy.get(ARBillboardsAddEditPage.getGeneralTitleTxtF()).should('have.value', billboardsDetails.billboardName2 + " - Copy")
    
        // Click on cancel button
        cy.get(ARBillboardsAddEditPage.getCancelBtn()).click()
        
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout:60000 }).should('not.exist')
        
        // Admin will returns to the Billboards page
        cy.get(ARBillboardsAddEditPage.getPageHeaderTitle()).should('have.text', "Billboards")

        // Selected the row
        cy.get(ARDashboardPage.getTableRow()).eq(0).find('input').should('have.attr', 'aria-checked', 'true')
    })

    it('Video billboard can be duplicate with persist and default value', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getBillboardsReport()
        cy.get(ARCoursesPage.getPageHeaderTitle()).should('have.text', 'Billboards')
        ARBillboardsAddEditPage.AddFilter('Title', 'Contains', billboardsDetails.billboardName)
        cy.get(ARDashboardPage.getTableCellName()).contains(billboardsDetails.billboardName).click()
        cy.get(ARDashboardPage.getTableRow()).eq(0).find('input').should('have.attr', 'aria-checked', 'true')

        // Select any existing Billboard and Verify that [Duplicate] button has been added to Billboard page
        cy.get(ARBillboardsPage.getDuplicateBillboardBtn()).should('exist').click({ force: true })

        cy.get(ARAddEditCategoryPage.getPageHeaderTitle()).should('have.text', 'Add Billboard')

        cy.get(ARBillboardsAddEditPage.getGeneralTitleTxtF()).should('have.value', billboardsDetails.billboardName + " - Copy")

        cy.get(ARBillboardsAddEditPage.getPublishedToggleInput()).should('have.attr', 'aria-checked', 'false')

        // Verify Availability Rules
        cy.get(ARBillboardsAddEditPage.getFirstRulesContainer()).within(() => {
            cy.get(ARBillboardsAddEditPage.getRuleTextF()).should('have.value', users.learner01.learner_01_username)
        })

        // Verify User Count
        ARGroupAddEditPage.verifyUserCount(1)

        cy.get(ARDashboardPage.getWaitSpinner(), { timeout:60000 }).should('not.exist')
        cy.get(ARBillboardsAddEditPage.getGeneralDescriptionTxtF()).should('exist').clear()
        cy.get(ARBillboardsAddEditPage.getGeneralDescriptionTxtF()).type(billboardsDetails.billboardDescription)

        cy.get(ARDashboardPage.getWaitSpinner(), { timeout:60000 }).should('not.exist')
        cy.get(ARBillboardsAddEditPage.getSaveBtn()).should('not.have.attr','aria-disabled', 'true').click()
        cy.get(ARDashboardPage.getToastSuccessMsg()).should('be.visible').and('contain','Billboard has been created.')
        cy.get(ARDashboardPage.getPageHeaderTitle()).should('have.text', 'Billboards')
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout:60000 }).should('not.exist')
        cy.get(ARDashboardPage.getTableCellName()).should('contain', billboardsDetails.billboardName + " - Copy")
    
        cy.get(ARDashboardPage.getTableRow()).eq(0).find('input').should('have.attr', 'aria-checked', 'true')
    })
})