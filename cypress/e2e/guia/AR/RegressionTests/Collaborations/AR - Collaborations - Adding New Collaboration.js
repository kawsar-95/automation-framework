import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import { users } from "../../../../../../helpers/TestData/users/users"
import ARCollaborationAddEditPage from '../../../../../../helpers/AR/pageObjects/Collaborations/ARCollaborationAddEditPage.js'
import { collaborationDetails } from "../../../../../../helpers/TestData/Collaborations/collaborationDetails"
import ARCollaborationActivityEditPage from "../../../../../../helpers/AR/pageObjects/Collaborations/ARCollaborationActivityEditPage"

describe('C7400 - AR - Collaborations - Adding New Collaboration', () => {


    beforeEach(function () {

        // Sign in with System Admin account
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Engage'))).click()

        //Navigate to Collaborations
        ARDashboardPage.getMenuItemOptionByName('Collaborations')
        ARDashboardPage.getMediumWait()

    })

    it('Add a New Collaboration then No Need To Save Click On Cancel', () => {

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

    })
    it('Add a New Collaboration then Save it', () => {
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

        ARCollaborationAddEditPage.getCollaborationSaveBtn()

        ARDashboardPage.getMediumWait()
    })

    it('Delete Created Collaboration', () => {

        //Filter and Find the created Collaboration
        cy.wrap(ARCollaborationAddEditPage.AddFilter('Name', 'Contains', collaborationDetails.collaborationName))
        ARDashboardPage.getMediumWait()
        //Select Collaboration
        cy.get(ARDashboardPage.getGridTable()).eq(0).click()
        ARDashboardPage.getMediumWait()

        // No Delete Button to Delete any existing/creted Collaboration

    })
})