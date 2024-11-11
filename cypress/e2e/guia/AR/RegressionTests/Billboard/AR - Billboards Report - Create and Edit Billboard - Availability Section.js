import { users } from '../../../../../../helpers/TestData/users/users'
import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arBillboardsAddEditPage from '../../../../../../helpers/AR/pageObjects/Billboards/ARBillboardsAddEditPage'
import { billboardsDetails } from '../../../../../../helpers/TestData/Billboard/billboardsDetails'
import ARUnsavedChangesModal from '../../../../../../helpers/AR/pageObjects/Modals/ARUnsavedChangesModal'
import ARDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import { miscData } from '../../../../../../helpers/TestData/Misc/misc'
import ARGroupAddEditPage from '../../../../../../helpers/AR/pageObjects/Groups/ARGroupAddEditPage'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import ARDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARFileManagerUploadsModal from '../../../../../../helpers/AR/pageObjects/Modals/ARFileManagerUploadsModal'

describe('C2004,C7351,C7355 AUT-554, AR - Billboards Report - Create and Edit Billboard - Availability Section', () => {
    let renamedFileName = ARFileManagerUploadsModal.getRenamedFileName()

    it("Create Billboard", () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getBillboardsReport()

        cy.wrap(arDashboardPage.WaitForElementStateToChange(arDashboardPage.getAddEditMenuActionsByName('Add Billboard'), 1000))
        cy.get(arDashboardPage.getAddEditMenuActionsByName('Add Billboard')).click()
        cy.get(arDashboardPage.getPageHeaderTitle()).should('have.text', "Add Billboard")
        
        // Verify that the default value is "Active" when creating a new billboard
        arDashboardPage.generalToggleSwitch('true' , arBillboardsAddEditPage.getGeneralPublishedToggleContainer())

        // enter valid title
        cy.get(arBillboardsAddEditPage.getGeneralTitleTxtF()).clear().type(billboardsDetails.billboardName)

        // enter valid description
        cy.get(arBillboardsAddEditPage.getGeneralDescriptionTxtF()).clear()
        cy.get(arBillboardsAddEditPage.getGeneralDescriptionTxtF()).type(billboardsDetails.billboardDescription)

        // Verify Admin will be the default author
        cy.get(arBillboardsAddEditPage.getAuthorDDown()).should('have.text', users.sysAdmin.admin_sys_01_fname + " " + users.sysAdmin.admin_sys_01_lname)
        
        //Upload an image and rename it to prevent the same name conflict.
        ARFileManagerUploadsModal.renameAndSelectUploadedFile('Image',miscData.billboard_01_filename,renamedFileName)

        // Specifying availability rules should be possible
        cy.get(arBillboardsAddEditPage.getAvailabilityAddRuleBtn()).click()

        // verify Availability Rules
        cy.get(arBillboardsAddEditPage.getFirstRulesContainer()).within(() => {
            cy.get(arBillboardsAddEditPage.getRuleDropDownBtn()).eq(0).click()
            arBillboardsAddEditPage.verifyAvailabilityRules()
            cy.get(arBillboardsAddEditPage.getRuleDropDownOptions()).contains('Username').click()
            cy.get(arBillboardsAddEditPage.getRuleDropDownBtn()).eq(1).click()
            cy.get(arBillboardsAddEditPage.getRuleDropDownOptions()).contains('Equals').click()
            cy.get(arBillboardsAddEditPage.getRuleTextF()).type(users.learner01.learner_01_username)
        })

        // verify User Count
        ARGroupAddEditPage.verifyUserCount(1)

        // Save the billboard
        cy.get(arBillboardsAddEditPage.getSaveBtn()).should('not.have.attr','aria-disabled')
        cy.get(arBillboardsAddEditPage.getSaveBtn()).click()
        cy.get(arDashboardPage.getToastSuccessMsg()).should('be.visible').and('contain','Billboard has been created.')
        cy.get(arDashboardPage.getPageHeaderTitle()).should('have.text', "Billboards")
    })

    it('Update and Persist Newly Created Existing Billboard', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getBillboardsReport()

        //Filter and Find the existing billboard
        arBillboardsAddEditPage.AddFilter('Title', 'Contains', billboardsDetails.billboardName)

        //Select Billboard
        cy.get(arDashboardPage.getTableCellName()).contains(billboardsDetails.billboardName).click();

        //Select Edit BillBoard Button
        cy.get(arBillboardsAddEditPage.getAddEditMenuActionsByName('Edit Billboard'),{timeout:15000}).should('have.attr' , 'aria-disabled' , 'false')
        cy.get(arBillboardsAddEditPage.getAddEditMenuActionsByName('Edit Billboard')).click()
        cy.get(arDashboardPage.getPageHeaderTitle()).should('have.text', "Edit Billboard")
        cy.get(arDashboardPage.getWaitSpinner(), { timeout: 20000 }).should('not.exist')

        cy.get(arBillboardsAddEditPage.getGeneralTitleTxtF()).should('have.value', billboardsDetails.billboardName)
        cy.get(arBillboardsAddEditPage.getGeneralDescriptionTxtF()).clear()
        cy.get(arBillboardsAddEditPage.getGeneralDescriptionTxtF()).type(billboardsDetails.billboardDescription+commonDetails.appendText)
        ARDashboardPage.getMediumWait()
        // verify Availability Rules
        cy.get(arBillboardsAddEditPage.getFirstRulesContainer()).within(() => {
            cy.get(arBillboardsAddEditPage.getRuleTextF()).should('have.value', users.learner01.learner_01_username)
        })

        // verify User Count
        ARGroupAddEditPage.verifyUserCount(1)

        // Save the billboard
        cy.get(arBillboardsAddEditPage.getSaveBtn()).should('not.have.attr','aria-disabled')
        cy.get(arBillboardsAddEditPage.getSaveBtn()).click()
        cy.get(arDashboardPage.getToastSuccessMsg()).should('be.visible').and('contain','Billboard has been updated.')
        cy.get(arDashboardPage.getPageHeaderTitle()).should('have.text', "Billboards")
    })

    it("Learner should see billboard", () => {
        cy.apiLoginWithSession(users.learner01.learner_01_username, users.learner01.learner_01_password)
        cy.get(LEDashboardPage.getLEEllipsesLoader(), {timeout: 15000}).should('not.exist')
        cy.get(LEDashboardPage.getDashboardPageTitle()).should('contain', `Welcome, ${users.learner01.learner_01_fname} ${users.learner01.learner_01_lname}`)
        cy.get(LEDashboardPage.getBillboardTile()).should('exist').scrollIntoView()
        LEDashboardPage.verifyBillboardVisibilityByName(billboardsDetails.billboardName)
    })

    it("Leaner should NOT be able to see billboard", () => {
        cy.apiLoginWithSession(users.learner02.learner_02_username, users.learner02.learner_02_password)
        cy.get(LEDashboardPage.getLEEllipsesLoader(), {timeout: 15000}).should('not.exist')
        cy.get(LEDashboardPage.getDashboardPageTitle()).should('contain', `Welcome, ${users.learner02.learner_02_fname} ${users.learner02.learner_02_lname}`)
        cy.get(LEDashboardPage.getLEEllipsesLoader(), {timeout: 15000}).should('not.exist')
        LEDashboardPage.getMediumWait()

        // Leaner should NOT be able to see billboard
        cy.get('body').then($body => {
            if ($body.find(LEDashboardPage.getBillboardTile()).length) {
                cy.get(LEDashboardPage.getBillboardTile()).should('exist').scrollIntoView()
                LEDashboardPage.verifyBillboardVisibilityByName(billboardsDetails.billboardName, false)
            }
            else{
                cy.get(LEDashboardPage.getBillboardTile()).should('not.exist')
            }
        })
    })

    it("Click on cancel button", () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getBillboardsReport()

        cy.wrap(arDashboardPage.WaitForElementStateToChange(arDashboardPage.getAddEditMenuActionsByName('Add Billboard'), 1000))
        cy.get(arDashboardPage.getAddEditMenuActionsByName('Add Billboard')).click()
        cy.get(arDashboardPage.getPageHeaderTitle()).should('have.text', "Add Billboard")
        cy.get(arBillboardsAddEditPage.getCancelBtn()).click()

        // Admin will returns to the Billboards page
        cy.get(arDashboardPage.getPageHeaderTitle()).should('have.text', "Billboards")

        cy.wrap(arDashboardPage.WaitForElementStateToChange(arDashboardPage.getAddEditMenuActionsByName('Add Billboard'), 1000))
        cy.get(arDashboardPage.getAddEditMenuActionsByName('Add Billboard')).click()
        cy.get(arDashboardPage.getPageHeaderTitle()).should('have.text', "Add Billboard")

        // enter valid title
        cy.get(arBillboardsAddEditPage.getGeneralTitleTxtF()).clear().type(billboardsDetails.billboardName)

        // enter valid description
        cy.get(arBillboardsAddEditPage.getGeneralDescriptionTxtF()).clear()
        cy.get(arBillboardsAddEditPage.getGeneralDescriptionTxtF()).type(billboardsDetails.billboardDescription)

        // Verify Admin will be the default author
        cy.get(arBillboardsAddEditPage.getAuthorDDown()).should('have.text', users.sysAdmin.admin_sys_01_fname + " " + users.sysAdmin.admin_sys_01_lname)

        arBillboardsAddEditPage.getBillBoardImageRadioBtn("Image")
        cy.get(arBillboardsAddEditPage.getgetBillBoardImageSourceTypeRadioBtn()).contains('Url').click().click()
        cy.get(arBillboardsAddEditPage.getBillboardImageTxtF()).type(miscData.switching_to_absorb_img_url)

        // Specifying availability rules should be possible
        cy.get(arBillboardsAddEditPage.getAvailabilityAddRuleBtn()).click()

        // verify Availability Rules
        cy.get(arBillboardsAddEditPage.getFirstRulesContainer()).within(() => {
            cy.get(arBillboardsAddEditPage.getRuleDropDownBtn()).eq(0).click()
            arBillboardsAddEditPage.verifyAvailabilityRules()
            cy.get(arBillboardsAddEditPage.getRuleDropDownOptions()).contains('Username').click()
            cy.get(arBillboardsAddEditPage.getRuleDropDownBtn()).eq(1).click()
            cy.get(arBillboardsAddEditPage.getRuleDropDownOptions()).contains('Equals').click()
            cy.get(arBillboardsAddEditPage.getRuleTextF()).type(users.learner01.learner_01_username)
        })

        // verify User Count
        ARGroupAddEditPage.verifyUserCount(1)

        // 11. Click on cancel button Again click cancel prom modal
        cy.get(arBillboardsAddEditPage.getCancelBtn()).click()
        cy.get(ARUnsavedChangesModal.getPromptHeader()).should('have.text', 'Unsaved Changes')
        cy.get(ARUnsavedChangesModal.getPromptContent()).find('span').should('have.text', ARUnsavedChangesModal.getUnsavedChangesMsg())
        
        // two button options "OK", and "Cancel" is displayed
        cy.get(ARUnsavedChangesModal.getPromptFooter()).find(ARDeleteModal.getARDeleteBtn()).should('be.visible')
        cy.get(ARUnsavedChangesModal.getPromptFooter()).find(ARDeleteModal.getARCancelBtn()).should('be.visible').click()    
        cy.get(ARDeleteModal.getUnsavedChangesPrompt()).should('not.exist')
        
        // Admin will returns to the Add Billboards page
        cy.get(arBillboardsAddEditPage.getPageHeaderTitle()).should('have.text', "Add Billboard")

        // Click on cancel button Again click OK prom modal
        cy.get(arBillboardsAddEditPage.getCancelBtn()).click()
        cy.get(ARDeleteModal.getUnsavedChangesPrompt()).should('be.visible')
        cy.get(ARUnsavedChangesModal.getPromptHeader()).should('have.text', 'Unsaved Changes')
        cy.get(ARUnsavedChangesModal.getPromptContent()).find('span').should('have.text', ARUnsavedChangesModal.getUnsavedChangesMsg())
        
        // two button options "OK", and "Cancel" is displayed
        cy.get(ARUnsavedChangesModal.getPromptFooter()).find(ARDeleteModal.getARCancelBtn()).should('be.visible')
        cy.get(ARUnsavedChangesModal.getPromptFooter()).find(ARDeleteModal.getARDeleteBtn()).should('be.visible').click()
        cy.get(ARDeleteModal.getUnsavedChangesPrompt()).should('not.exist')

        // Admin will returns to the Billboards page
        cy.get(arDashboardPage.getPageHeaderTitle()).should('have.text', "Billboards")
    })

    it('Delete Billboard', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getBillboardsReport()

        arDashboardPage.AddFilter('Title', 'Contains', billboardsDetails.billboardName)
        arDashboardPage.selectTableCellRecord(billboardsDetails.billboardName, 2)
        arDashboardPage.WaitForElementStateToChange(arDashboardPage.getAddEditMenuActionsByName('Delete Billboard'))
        cy.get(arDashboardPage.getAddEditMenuActionsByName('Delete Billboard')).click()
        arDashboardPage.getConfirmModalBtnByText('Delete')
        cy.get(arDashboardPage.getNoResultMsg()).should('have.text', "No results found.")
    })
})