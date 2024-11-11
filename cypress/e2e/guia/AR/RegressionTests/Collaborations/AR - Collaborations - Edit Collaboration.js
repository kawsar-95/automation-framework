import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARCollaborationAddEditPage from '../../../../../../helpers/AR/pageObjects/Collaborations/ARCollaborationAddEditPage'
import { collaborationDetails, collaborationNames } from '../../../../../../helpers/TestData/Collaborations/collaborationDetails'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../helpers/TestData/users/users'

//This test could be updated later to create/delete a collaboration once NLE-3136 has been completed
describe('AR - Collaborations - Edit Collaboration', function(){

    let collabName, collabDescription; //placeholders to store previous name and description

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Collaborations
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Engage'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Collaborations'))
        cy.get(arDashboardPage.getWaitSpinner(),{timeout:15000}).should('not.exist')
    })

    it('Verify Collaboration can be Filtered for and Edited', () => {
        //Filter for existing collaboration and edit it
        cy.wrap(arDashboardPage.AddFilter('Name', 'Contains', collaborationNames.collaborationNameToEditPrefix))
        cy.get(arDashboardPage.getWaitSpinner(),{timeout:15000}).should('not.exist')
        cy.get(arDashboardPage.getTableCellName(2)).invoke('text').then((text) => {
            collabName = text; //store old name for comparing later
        })
        cy.get(arDashboardPage.getTableCellName(2)).contains(collaborationNames.collaborationNameToEditPrefix).click()
        cy.wrap(ARCollaborationAddEditPage.WaitForElementStateToChange(ARCollaborationAddEditPage.getAddEditMenuActionsByName('Edit Collaboration'), 1000))
        cy.get(ARCollaborationAddEditPage.getAddEditMenuActionsByName('Edit Collaboration')).click()
        cy.get(ARCollaborationAddEditPage.getPageHeader(),{timeout:15000}).should('contain', 'Edit Collaboration')

        //Verify browser refresh keeps admin on edit collaboration page
        cy.reload()
        cy.get(arDashboardPage.getWaitSpinner(),{timeout:15000}).should('not.exist')
        cy.get(ARCollaborationAddEditPage.getPageHeader()).should('contain', 'Edit Collaboration')

        //Verify edits do not persist if browser back button is pressed
        cy.get(ARCollaborationAddEditPage.getNameTxtF()).type(commonDetails.appendText)
        cy.go('back')
        cy.wrap(ARCollaborationAddEditPage.WaitForElementStateToChange(ARCollaborationAddEditPage.getAddEditMenuActionsByName('Edit Collaboration'), 1000))
        cy.get(ARCollaborationAddEditPage.getAddEditMenuActionsByName('Edit Collaboration'),{timeout:15000}).should('have.attr' , 'aria-disabled' , 'false')
        cy.get(ARCollaborationAddEditPage.getAddEditMenuActionsByName('Edit Collaboration')).click()
       
        cy.get(ARCollaborationAddEditPage.getNameTxtF()).should('not.contain', commonDetails.appendText)

        //Edit Name and Description
        cy.get(ARCollaborationAddEditPage.getNameTxtF()).clear().type(collaborationNames.collaborationNameToEditPrefix + commonDetails.timestamp)
        cy.get(ARCollaborationAddEditPage.getDescriptionTxtF()).invoke('text').then((text) => {
            collabDescription = text; //store old description for comparing later
        })
        cy.get(ARCollaborationAddEditPage.getDescriptionTxtF()).clear().type(collaborationDetails.postDescription  + commonDetails.timestamp)

        //Save the changes
        cy.get(arDashboardPage.getSaveBtn()).click()
        cy.get(arDashboardPage.getToastSuccessMsg(), {timeout: 10000}).should('contain', 'Collaboration has been updated.')
        cy.get(arDashboardPage.getToastCloseBtn()).click()
    })

    it('Verify Collaboration Edits Persisted', () => {
        cy.wrap(arDashboardPage.AddFilter('Name', 'Contains', collaborationNames.collaborationNameToEditPrefix + commonDetails.timestamp))
        cy.get(arDashboardPage.getWaitSpinner(),{timeout:15000}).should('not.exist')
        cy.get(arDashboardPage.getTableCellName(2)).contains(collaborationNames.collaborationNameToEditPrefix + commonDetails.timestamp).click()
        cy.wrap(ARCollaborationAddEditPage.WaitForElementStateToChange(ARCollaborationAddEditPage.getAddEditMenuActionsByName('Edit Collaboration'), 1000))

        //Verify collaboration can be de-selected
        cy.get(arDashboardPage.getTableCellName(2)).click()
        cy.get(arDashboardPage.getTableCellContentByIndex(1)).should('not.be.checked')
        cy.get(arDashboardPage.getTableCellName(2)).click()

        //Edit collaboration
        cy.wrap(ARCollaborationAddEditPage.WaitForElementStateToChange(ARCollaborationAddEditPage.getAddEditMenuActionsByName('Edit Collaboration'), 1000))
        cy.get(ARCollaborationAddEditPage.getAddEditMenuActionsByName('Edit Collaboration')).click()
      
        

        //Verify fields persisted
        cy.get(ARCollaborationAddEditPage.getNameTxtF()).should('have.value', collaborationNames.collaborationNameToEditPrefix + commonDetails.timestamp)
        cy.get(ARCollaborationAddEditPage.getDescriptionTxtF()).should('contain.text', collaborationDetails.postDescription  + commonDetails.timestamp)

        //Verify fields do not match the previous test's values
        cy.get(ARCollaborationAddEditPage.getNameTxtF()).invoke('val').then((val) => {
            expect(val).to.not.equal(collabName)
        })
        cy.get(ARCollaborationAddEditPage.getDescriptionTxtF()).invoke('text').then((text) => {
            expect(text).to.not.equal(collabDescription)
        })
    })
})