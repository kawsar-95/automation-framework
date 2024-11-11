import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LECollaborationsActivityPage from '../../../../../../helpers/LE/pageObjects/Collaborations/LECollaborationsActivityPage'
import LEReportCollaborationActivityModal from '../../../../../../helpers/LE/pageObjects/Modals/LEReportCollaborationActivity.modal'
import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import ARCollaborationActivityEditPage from '../../../../../../helpers/AR/pageObjects/Collaborations/ARCollaborationActivityEditPage'
import { collaborationDetails } from '../../../../../../helpers/TestData/Collaborations/collaborationDetails'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../helpers/TestData/users/users'

describe('AR - Collaborations - Collaboration Activity - Moderate Flagged Content', function(){

    before(function() {
        //Create a post with Learner 1
        cy.createCollaborationPost(Cypress.env('B_COLLABORATION_ID'), collaborationDetails.postSummary, collaborationDetails.postDescription, "General")
        cy.viewport(1280, 720) //Enlarge viewport so Collaborations side menu is visible
        cy.apiLoginWithSession(users.learner02.learner_02_username, users.learner02.learner_02_password) 
        LEDashboardPage.getTileByNameThenClick('Collaborations')
        cy.get(arDashboardPage.getWaitSpinner(),{timeout:15000}).should('not.exist')
        //Flag the Post 3x
        for (let i = 0; i < collaborationDetails.reportType.length; i++) {
            LECollaborationsActivityPage.getPostOptionsBtnByTitle(collaborationDetails.postSummary)
            cy.get(LECollaborationsActivityPage.getPostOptionBtn()).contains(`Report Post`).click()
            cy.get(LEReportCollaborationActivityModal.getReasonRadioBtn()).contains(collaborationDetails.reportType[i]).click()
            if (collaborationDetails.reportType[i]==='Other') {
                cy.get(LEReportCollaborationActivityModal.getOtherTxtF()).clear().type(collaborationDetails.reasons[0])
            }
            cy.get(LEReportCollaborationActivityModal.getReportBtn()).click()
            LEDashboardPage.getShortWait() //Wait for Toast Notification
            cy.get(LEDashboardPage.getToastNotificationCloseBtn()).click()
            //Wait for Toast Notification to clear
        }
    })

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Collaboration Activity
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Engage'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Collaboration Activity'))
        cy.get(arDashboardPage.getWaitSpinner(),{timeout:15000}).should('not.exist')
        //Add Flag Count Column to Report
        cy.get(arDashboardPage.getDisplayColumns()).click({force:true})
        cy.get(arDashboardPage.getChkBoxLabel()).contains('Flag Count').click()
        cy.get(arDashboardPage.getDisplayColumns()).click({force:true}) //Close menu
        //Filter for Collaboration Activity and Edit it
        cy.wrap(arDashboardPage.AddFilter('Summary', 'Contains', collaborationDetails.postSummary))
        cy.get(arDashboardPage.getWaitSpinner(),{timeout:15000}).should('not.exist')
        //Verify Flag Count in Collaborations Activity Report
        
        cy.get(arDashboardPage.getTableCellName(9)).should('contain', collaborationDetails.reportType.length)
        //Edit Activity
        cy.get(arDashboardPage.getTableCellName(8)).contains(collaborationDetails.postSummary).click()
        cy.wrap(arDashboardPage.WaitForElementStateToChange(arDashboardPage.getAddEditMenuActionsByName('Edit Activity'), 1000))
        cy.get(arDashboardPage.getAddEditMenuActionsByName('Edit Activity')).click()
        cy.get(arDashboardPage.getWaitSpinner(),{timeout:15000}).should('not.exist')
    })

    after(function() {
        //Delete Collaboration Activity'
        cy.go('back')
        cy.wrap(arDashboardPage.WaitForElementStateToChange(arDashboardPage.getAddEditMenuActionsByName('Delete Activity'), 1000))
        cy.get(arDashboardPage.getAddEditMenuActionsByName('Delete Activity')).click()
        cy.get(arDashboardPage.getElementByDataNameAttribute(arDeleteModal.getDeleteBtn())).click()
        cy.get(arDashboardPage.getWaitSpinner(),{timeout:15000}).should('not.exist')
    })

    it('Verify Collaboration Activity Status and Reports Table', () => {  
        //Verify Collaboration Activity Status Pill
        cy.get(ARCollaborationActivityEditPage.getPostStatus()).should('contain', 'Pending Moderation')

        //Verify Collaboration Activity Report Table 
        cy.get(ARCollaborationActivityEditPage.getReportTable()).find('tr').should('have.length', collaborationDetails.reportType.length + 1) //+1 for table header
        for (let i = 0; i < collaborationDetails.reportType.length; i++) {
            ARCollaborationActivityEditPage.getVerifyReportContent(i+1, collaborationDetails.l02Name, commonDetails.timestamp.slice(0, 10), 'Pending', collaborationDetails.reasons[i])
        }

        //Mark All as Reviewed
        ARCollaborationActivityEditPage.getMarkAllAsReviewedBtnThenClick()
        //Verify all Statuses Update
        cy.get(ARCollaborationActivityEditPage.getPostStatus()).should('contain', 'Reviewed')
        for (let i = 0; i < collaborationDetails.reportType.length; i++) {
            cy.get(ARCollaborationActivityEditPage.getReportTable()).find('tr').eq(i+1).within(() => {
                cy.get(ARCollaborationActivityEditPage.getStatus()).should('contain', 'Reviewed')
            })
        }

        //Cancel Changes
        cy.get(arDashboardPage.getCancelBtn()).click()
        cy.get(arDashboardPage.getElementByDataNameAttribute(arDeleteModal.getDeleteBtn())).click()
       

        //Verify Flag Count Remains as non-zero
        cy.get(arDashboardPage.getTableCellName(9)).should('contain', collaborationDetails.reportType.length)
    })

    it('Mark All as Reviewed, Verify Report Statuses Persist, Delete Collaboration Activity', () => {
        //Verify Collaboration Activity Status Pill has not Changed
        cy.get(ARCollaborationActivityEditPage.getPostStatus()).should('contain', 'Pending Moderation')

        //Verify Collaboration Activity Report Table has not Changed
        cy.get(ARCollaborationActivityEditPage.getReportTable()).find('tr').should('have.length', collaborationDetails.reportType.length + 1) //+1 for table header
        for (let i = 0; i < collaborationDetails.reportType.length; i++) {
            ARCollaborationActivityEditPage.getVerifyReportContent(i+1, collaborationDetails.l02Name, commonDetails.timestamp.slice(0, 10), 'Pending', collaborationDetails.reasons[i])
        }

        //Mark All as Reviewed
        ARCollaborationActivityEditPage.getMarkAllAsReviewedBtnThenClick()

        //Save the Changes
        cy.get(arDashboardPage.getSaveBtn()).click()
       

        //Edit the Collaboration Activity Again
        cy.get(arDashboardPage.getAddEditMenuActionsByName('Edit Activity')).click()

        //Verify Status, and All Reports are Marked as Reviewed
        cy.get(ARCollaborationActivityEditPage.getPostStatus()).should('contain', 'Reviewed')
        for (let i = 0; i < collaborationDetails.reportType.length; i++) {
            cy.get(ARCollaborationActivityEditPage.getReportTable()).find('tr').eq(i+1).within(() => {
                cy.get(ARCollaborationActivityEditPage.getStatus()).should('contain', 'Reviewed')
            })
        }
    })
})