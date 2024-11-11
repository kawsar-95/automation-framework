import { users } from '../../../../../../helpers/TestData/users/users'
import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arBillboardsAddEditPage from '../../../../../../helpers/AR/pageObjects/Billboards/ARBillboardsAddEditPage'
import { billboardsDetails } from '../../../../../../helpers/TestData/Billboard/billboardsDetails'
import { miscData } from '../../../../../../helpers/TestData/Misc/misc'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'

describe('C2001 AUT-551, AR - Billboards Report - Delete Billboard Mass Action', () => {
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

        arBillboardsAddEditPage.getBillBoardImageRadioBtn("Image")
        cy.get(arBillboardsAddEditPage.getgetBillBoardImageSourceTypeRadioBtn()).contains('Url').click().click()
        cy.get(arBillboardsAddEditPage.getBillboardImageTxtF()).type(miscData.switching_to_absorb_img_url)

        // Save the billboard
        cy.get(arBillboardsAddEditPage.getSaveBtn()).should('not.have.attr','aria-disabled')
        cy.get(arBillboardsAddEditPage.getSaveBtn()).click()
        cy.get(arDashboardPage.getToastSuccessMsg()).should('be.visible').and('contain','Billboard has been created.')
        cy.get(arDashboardPage.getPageHeaderTitle()).should('have.text', "Billboards")

        // add another Billboard
        cy.wrap(arDashboardPage.WaitForElementStateToChange(arDashboardPage.getAddEditMenuActionsByName('Add Billboard'), 1000))
        cy.get(arDashboardPage.getAddEditMenuActionsByName('Add Billboard')).click()
        cy.get(arDashboardPage.getPageHeaderTitle()).should('have.text', "Add Billboard")
        
        // Verify that the default value is "Active" when creating a new billboard
        arDashboardPage.generalToggleSwitch('true' , arBillboardsAddEditPage.getGeneralPublishedToggleContainer())

        // enter valid title
        cy.get(arBillboardsAddEditPage.getGeneralTitleTxtF()).clear().type(billboardsDetails.billboardName2)

        // enter valid description
        cy.get(arBillboardsAddEditPage.getGeneralDescriptionTxtF()).clear()
        cy.get(arBillboardsAddEditPage.getGeneralDescriptionTxtF()).type(billboardsDetails.billboardDescription)

        // Verify Admin will be the default author
        cy.get(arBillboardsAddEditPage.getAuthorDDown()).should('have.text', users.sysAdmin.admin_sys_01_fname + " " + users.sysAdmin.admin_sys_01_lname)

        arBillboardsAddEditPage.getBillBoardImageRadioBtn("Image")
        cy.get(arBillboardsAddEditPage.getgetBillBoardImageSourceTypeRadioBtn()).contains('Url').click().click()
        cy.get(arBillboardsAddEditPage.getBillboardImageTxtF()).type(miscData.switching_to_absorb_img_url)

        // Save the billboard
        cy.get(arBillboardsAddEditPage.getSaveBtn()).should('not.have.attr','aria-disabled')
        cy.get(arBillboardsAddEditPage.getSaveBtn()).click()
        cy.get(arDashboardPage.getToastSuccessMsg()).should('be.visible').and('contain','Billboard has been created.')
        cy.get(arDashboardPage.getPageHeaderTitle()).should('have.text', "Billboards")
    })

    it("Learner should see billboard", () => {
        cy.apiLoginWithSession(users.learner01.learner_01_username, users.learner01.learner_01_password)
        cy.get(LEDashboardPage.getLEEllipsesLoader(), {timeout: 15000}).should('not.exist')
        cy.get(LEDashboardPage.getDashboardPageTitle()).should('contain', `Welcome, ${users.learner01.learner_01_fname} ${users.learner01.learner_01_lname}`)
        cy.get(LEDashboardPage.getLEEllipsesLoader(), {timeout: 15000}).should('not.exist')
        LEDashboardPage.getMediumWait()

        cy.get(LEDashboardPage.getBillboardTile()).should('exist').scrollIntoView()
        LEDashboardPage.verifyBillboardVisibilityByName(billboardsDetails.billboardName)
    })

    it('Delete Billboards', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getBillboardsReport()
        arDashboardPage.AddFilter('Title', 'Contains', billboardsDetails.billboardName)
        arDashboardPage.AddFilter('Title', 'Contains', billboardsDetails.billboardName2)

        cy.get(arDashboardPage.getRowSelectOptionsBtn()).click({ force: true })
        cy.get(arDashboardPage.getSelectThisPageOptionBtn()).click()

        // Cancel out of deleting a billboard from the warning modal
        cy.get(arDashboardPage.getAddEditMenuActionsByName('Delete Billboards')).should('be.visible').click()
        cy.get(arDashboardPage.getCancelBtn()).should('be.visible').click()
        cy.get(arDashboardPage.getCancelBtn()).should('not.exist')
        cy.get(arDashboardPage.getPageHeaderTitle()).should('have.text', "Billboards").and('be.visible')

        // Delete Billboards
        cy.get(arDashboardPage.getAddEditMenuActionsByName('Delete Billboards')).should('be.visible').click()
        arDashboardPage.getConfirmModalBtnByText('Delete')

        // Verify Billboards are deleted
        cy.get(arDashboardPage.getNoResultMsg()).should('have.text', "No results found.")
    })

    it("Leaner should NOT be able to see billboard", () => {
        cy.apiLoginWithSession(users.learner01.learner_01_username, users.learner01.learner_01_password)
        cy.get(LEDashboardPage.getLEEllipsesLoader(), {timeout: 15000}).should('not.exist')
        cy.get(LEDashboardPage.getDashboardPageTitle()).should('contain', `Welcome, ${users.learner01.learner_01_fname} ${users.learner01.learner_01_lname}`)
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
})