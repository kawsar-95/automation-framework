import ARDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARCollaborationAddEditPage from '../../../../../../helpers/AR/pageObjects/Collaborations/ARCollaborationAddEditPage'
import ARCollaborationActivityEditPage from '../../../../../../helpers/AR/pageObjects/Collaborations/ARCollaborationActivityEditPage'
import { collaborationDetails } from '../../../../../../helpers/TestData/Collaborations/collaborationDetails'
import { users } from '../../../../../../helpers/TestData/users/users'

//This test could be updated later to create/delete a collaboration once NLE-3136 has been completed
describe('AR - Collaborations - Cancel Collaboration', function () {

    before(() => {
        // Sign in with System Admin account
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Engage'))).click()

        //Navigate to Collaborations
        ARDashboardPage.getMenuItemOptionByName('Collaborations')
        ARDashboardPage.getMediumWait()
    })

    it('Verify Collaboration Creation can be Cancelled', () => {

        //Click on Add Collaboration Button To Add New Collaboration
        cy.get(ARCollaborationActivityEditPage.getAddCollaborationBtn()).click()
        ARDashboardPage.getMediumWait()

        //Verify We are Actually on Add Collaboration Page
        cy.get(ARCollaborationAddEditPage.getCollaborationPageTitleTxt()).should('contain', 'Add Collaboration')

        //Mark Collaboration Checkbox Toggle Status Active from Inactive
        ARCollaborationAddEditPage.getCollaborationStatusToggleChckbx()

        //Enter Collaboration Name
        cy.get(ARCollaborationAddEditPage.getNameTxtF()).type(collaborationDetails.collaborationName)

        //Enter Collaborartion Description
        cy.get(ARCollaborationAddEditPage.getDescriptionTxtF()).type(collaborationDetails.postDescription)

        //Choose Collaboration Tag
        ARCollaborationAddEditPage.getCollaborationTagChooser()

        //Choose Collaboration Course
        ARCollaborationAddEditPage.getCollaborationCourseChooser()

        //Choose Assignment User
        ARCollaborationAddEditPage.getCollaborationAssignmentUserChooser()

        //Choose Assignment Group
        ARCollaborationAddEditPage.getCollaborationAssignmentGroupChooser()

        //Add Resource
        ARCollaborationAddEditPage.getCollaborationAddResource()

        //Click On Cancel Button
        ARCollaborationAddEditPage.getCollaborationCancelBtn()
        ARDashboardPage.getShortWait()

        //Click on Unsaved Changes Cancel Button
        cy.get(ARCollaborationAddEditPage.getCollaborationUnsaveFooter()).within(() => {
            cy.get(ARCollaborationAddEditPage.getCollaborationUnsaveCancelBtn()).click()
        })
        ARDashboardPage.getShortWait()

        //Click On Righ Panel Cancel Button 
        ARCollaborationAddEditPage.getCollaborationCancelBtn()
        ARDashboardPage.getShortWait()

        //Click on Unsaved Changes Ok/Confirm Button
        cy.get(ARCollaborationAddEditPage.getCollaborationUnsaveFooter()).within(() => {
            cy.get(ARCollaborationAddEditPage.getCollaborationUnsaveOKBtn()).click()
        })
        ARDashboardPage.getMediumWait()

        //Search the Cancelled or Unsaved Collaboration
        cy.wrap(ARCollaborationAddEditPage.AddFilter('Name', 'Contains', collaborationDetails.collaborationName))
        ARDashboardPage.getMediumWait()

        //Collaboration Not Found
        cy.get(ARDashboardPage.getNoResultMsg()).should('have.text', "No results found.")

        ARDashboardPage.getMediumWait()

    })

    //No option to delete created collaboration

})