import LECollaborationsActivityPage from "../../../../../../helpers/LE/pageObjects/Collaborations/LECollaborationsActivityPage"
import LECoursesPage from "../../../../../../helpers/LE/pageObjects/Courses/LECoursesPage"
import LEDashboardPage from "../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage"
import LEConversationsModal from "../../../../../../helpers/LE/pageObjects/Modals/LEConversations.modal"
import { chatMessages } from "../../../../../../helpers/TestData/Collaborations/collaborationDetails"
import { users } from "../../../../../../helpers/TestData/users/users"

describe('C6335 - Learner can initiate a 1:1 chat with another learner via social profile',()=>{
    beforeEach(()=>{
        // Login as Learner
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/#/collaborations')
    })
    it('One To One Chat',()=>{
        // LEDashboardPage.getTileByNameThenClick('Collaborations')
        LEDashboardPage.getVLongWait()
        // Go to collaboration and click on any learner's profile
        cy.get(LECollaborationsActivityPage.getPostAvatarContainer()).eq(0).click()
        LEDashboardPage.getMediumWait()
        // click on send message
        cy.get(LECoursesPage.getEnrollBtn()).contains('Send Message').click()
        LEDashboardPage.getMediumWait()
        // Message must be sent to other learner
        cy.get(LEConversationsModal.getMessageTxtF()).type(chatMessages.msg_1)
        cy.get(LEConversationsModal.getMessageSendBtn()).click()
        LEDashboardPage.getShortWait()
        cy.get(LEConversationsModal.getModalCloseBtn()).click()
        LEDashboardPage.getShortWait()
        cy.get(LEDashboardPage.getElementByTitleAttribute('Messages')).click()
        LEDashboardPage.getMediumWait()
        cy.get('a').contains('View All Messages').click()
        //Under the conversations-All the chats are appeared
        cy.get('div').should('contain',chatMessages.msg_1)

    })
})