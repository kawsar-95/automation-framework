import DefaultTestData from '../../../../../fixtures/defaultTestData.json'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LECollaborationsActivityPage from '../../../../../../helpers/LE/pageObjects/Collaborations/LECollaborationsActivityPage'
import LECollaborationPage from '../../../../../../helpers/LE/pageObjects/Collaborations/LECollaborationPage'
import LEProfilePage from '../../../../../../helpers/LE/pageObjects/User/LEProfilePage'
import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARUserAddEditPage from '../../../../../../helpers/AR/pageObjects/User/ARUserAddEditPage'
import arDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import { collaborationDetails } from '../../../../../../helpers/TestData/Collaborations/collaborationDetails'
import { users } from '../../../../../../helpers/TestData/users/users'
import { userDetails } from '../../../../../../helpers/TestData/users/UserDetails'
import ARBillboardsAddEditPage from '../../../../../../helpers/AR/pageObjects/Billboards/ARBillboardsAddEditPage'

describe('AR - Collaborations - Collaboration Activity - Inactive User', function(){

        before(function() {
            cy.createUser(void 0, collaborationDetails.userName, ["Learner"], void 0) //Create a Learner
            
            //Create a post via API with new Learner
            cy.createCollaborationPost(Cypress.env('B_COLLABORATION_ID'), collaborationDetails.postSummary, collaborationDetails.postDescription, "General", collaborationDetails.userName, DefaultTestData.USER_PASSWORD)
            cy.viewport(1280, 720) //Enlarge viewport so Collaborations side menu is visible
            cy.apiLoginWithSession(collaborationDetails.userName, DefaultTestData.USER_PASSWORD) 
            LEDashboardPage.getTileByNameThenClick('Collaborations')
            cy.get(arDashboardPage.getWaitSpinner(),{timeout:15000}).should('not.exist')
            
            //Select the Post and Add a Comment
            cy.get(LECollaborationsActivityPage.getPostTitle()).contains(collaborationDetails.postSummary).click()
            LECollaborationPage.getAddComment(collaborationDetails.postComment) 
            
            //Add a Reply to the Comment
            LECollaborationPage.getAddReplyByCommentContent(collaborationDetails.postComment, collaborationDetails.commentReply)
            
            //Get userID for deletion later
            cy.get(LEDashboardPage.getNavProfile()).click()  
            cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
            cy.get(arDashboardPage.getWaitSpinner(),{timeout:15000}).should('not.exist')
            cy.url().then((currentURL) => {
                userDetails.userID = currentURL.slice(-36);
            })
        }) 
    
        beforeEach(() => {
            //Sign into admin side as sys admin
            cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        })
    
        it('Set New Learner as Inactive', () => {
            
            cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Users'))).click()
            cy.wrap(arDashboardPage.getMenuItemOptionByName('Users'))  
            cy.get(arDashboardPage.getWaitSpinner(),{timeout:15000}).should('not.exist')
            //Set Learner as Inactive
            cy.wrap(arDashboardPage.AddFilter('Username', 'Contains', collaborationDetails.userName))
            cy.get(arDashboardPage.getWaitSpinner(),{timeout:15000}).should('not.exist')
            cy.get(arDashboardPage.getTableCellName(4)).contains(collaborationDetails.userName).click();
            cy.get(arDashboardPage.getWaitSpinner(),{timeout:15000}).should('not.exist')
            cy.get(arDashboardPage.getAddEditMenuActionsByName('Edit User'),{timeout:15000}).should('have.attr' , 'aria-disabled' , 'false')
            cy.get(arDashboardPage.getAddEditMenuActionsByName('Edit User')).click({force:true})
            cy.get(arDashboardPage.getPageHeaderTitle(),{timeout:15000}).should('contain', 'Edit User')
            //turning off the Is Active toggle
            ARUserAddEditPage.generalToggleSwitch('false' , ARBillboardsAddEditPage.getGeneralPublishedToggleContainer())
            //here the wait is necessary
            arDashboardPage.getShortWait()
            cy.get(arDashboardPage.getSaveBtn()).click({force:true})
            cy.get(arDashboardPage.getPageHeaderTitle(),{timeout:15000}).should('contain', 'Users')
        })
    
        it('Verify Inactive User Collaboration Activities are Visible in Report and Can be Filtered', () => {
            cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Engage'))).click()
            cy.wrap(arDashboardPage.getMenuItemOptionByName('Collaboration Activity'))
            cy.get(arDashboardPage.getWaitSpinner(),{timeout:15000}).should('not.exist')
            
            //Add User Status Column to Report
            cy.get(arDashboardPage.getDisplayColumns()).click({force:true})
            cy.get(arDashboardPage.getChkBoxLabel()).contains('User Status').click()
            cy.get(arDashboardPage.getDisplayColumns()).click({force:true}) //Close menu
            
            //Filter for Inactive User Status
            cy.wrap(arDashboardPage.AddFilter('User Status', 'Inactive'))
            cy.get(arDashboardPage.getWaitSpinner(),{timeout:15000}).should('not.exist')
    
            //Verify All Activities For the User Have a User Status of Inactive
            for (let i = 0; i< collaborationDetails.activityType.length; i++) {
                cy.get(arDashboardPage.getTableCellName(4)).eq(i).should('contain', DefaultTestData.USER_LEARNER_FNAME)
                cy.get(arDashboardPage.getTableCellName(5)).eq(i).should('contain', collaborationDetails.activityType[i]) //Verify Date Sorting
                cy.get(arDashboardPage.getTableCellName(9)).eq(i).should('contain', 'Inactive')
            }
        })
    
    
        after('Cleanup - Delete Collaboration Activity and User', () => {
            cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
            cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Engage'))).click()
            cy.wrap(arDashboardPage.getMenuItemOptionByName('Collaboration Activity'))
            cy.get(arDashboardPage.getWaitSpinner(),{timeout:15000}).should('not.exist')
            //Filter for Inactive User Status
            cy.wrap(arDashboardPage.AddFilter('User Status', 'Inactive'))
            cy.get(arDashboardPage.getWaitSpinner(),{timeout:15000}).should('not.exist')
            //Delete the Activities (Deleting Post will Auto Delete Associated Comments and Replies)
            cy.get(arDashboardPage.getTableCellName(5)).contains('General').click()
            cy.wrap(arDashboardPage.WaitForElementStateToChange(arDashboardPage.getAddEditMenuActionsByName('Delete Activity'), 1000))
            cy.get(arDashboardPage.getAddEditMenuActionsByName('Delete Activity')).click()
            cy.get(arDashboardPage.getElementByDataNameAttribute(arDeleteModal.getDeleteBtn())).click()
            cy.get(arDashboardPage.getWaitSpinner(),{timeout:15000}).should('not.exist')
            //Cleanup - Delete Learner
            cy.deleteUser(userDetails.userID);
        })
    
})