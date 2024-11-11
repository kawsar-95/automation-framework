import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import { users } from "../../../../../../helpers/TestData/users/users"
import arUserPage from '../../../../../../helpers/AR/pageObjects/User/ARUserPage'
import { userPageUrl } from '../../../../../../helpers/AR/pageObjects/User/ARUserPage'
import { userDetails } from "../../../../../../helpers/TestData/users/UserDetails"

describe('C6328 - Edit User - User Transcript', function(){
    before(function(){
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
    })
    beforeEach(() => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
    })

    it('Go to Users page and Select a User to Edit and View Transacript', () => {
        ARDashboardPage.getMediumWait()

        // Go to users page
        //Click on users
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Users')).click()
        //Click on Users menu item
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Users'))
        ARDashboardPage.getMediumWait()
        
        //Filter user
        ARDashboardPage.AddFilter('Username', 'Contains', userDetails.username)
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getGridTable()).eq(0).click()
        ARDashboardPage.getMediumWait()
        // Capture the selected user's full name
        cy.get(ARDashboardPage.getGridTable()).eq(0).find('td').eq(1).invoke('text').as('firstName')
        cy.get(ARDashboardPage.getGridTable()).eq(0).find('td').eq(2).invoke('text').as('lastName')
        cy.get('@firstName').then(firstName => {
            cy.get('@lastName').then(lastName => {
                cy.wrap({fullName: `${lastName} ${firstName}`}).as('selectedUser')
            })
        })        

        // Click on Edit to edit the select user
        cy.wrap(arUserPage.WaitForElementStateToChange(arUserPage.getAddEditMenuActionsByName('Edit User'), 1000))
        cy.get(arUserPage.getAddEditMenuActionsByName('Edit User')).click({force:true})
        arUserPage.getMediumWait()

        // Select User Transcript Button 
        cy.wrap(arUserPage.WaitForElementStateToChange(arUserPage.getAddEditMenuActionsByName('User Transcript'), 1000))
        // Assert 'User Transcript' button is visible 
        cy.get(arUserPage.getAddEditMenuActionsByName('User Transcript')).should('be.visible')

        // Stores the total count of buttons present in the context menu
        let lastMenuGroup = cy.get(arUserPage.getCotextMenu()).find(arUserPage.getContextMenuButtons()).last()

        // Stores the 'User Transcript' menu item along with index for later assertions
        lastMenuGroup.find('button').each((el, index) => {
            if (el.find('div').text() == 'User Transcript') {
                cy.wrap({index: index}).as('transcriptMenu')
            }
        })

        // Assert that
        // 1. 'Message User' menu is above the 'User Transcript' menu item
        // 1. 'View History' menu is below the 'User Transcript' menu item
        cy.get('@transcriptMenu').then(menu => {
            let lastMenuGroup = cy.get(arUserPage.getCotextMenu()).find(arUserPage.getContextMenuButtons()).last()
            lastMenuGroup.find('button').each((el, index) => {
                if (el.find('div').text() == 'Message User') {
                    cy.wrap(menu.index).should('be.gt', index)
                } else if (el.find('div').text() == 'Reset Password') {
                    cy.wrap(menu.index).should('be.lt', index)
                }
            })
        })

        // Assert that admin can click the 'User Transcript' button
        cy.get(arUserPage.getAddEditMenuActionsByName('User Transcript')).click({force:true})
        // Assert tha the admin user is now in the user's transcript page
        cy.url().should('contain', userPageUrl.transcriptPage)

        // Asserting other transcript page information 
        // Assert header contains the user name
        cy.get('@selectedUser').then(selectedUser => {
            cy.get(arUserPage.getHeaderBreadCrumb()).find('li').eq(2).contains(selectedUser.fullName)
        })
        // Assert that the transcript page body contains user's avatar
        cy.get(arUserPage.getUserProfile()).find(arUserPage.getUserAvatar()).should('exist')
        // Assert that the Username field is not empty
        cy.get(arUserPage.getTranscriptFieldByName('username')).invoke('text').should('not.be.empty')
        // Assert that the Department field is not empty
        cy.get(arUserPage.getTranscriptFieldByName('department')).invoke('text').should('not.be.empty')
        // Assert that the Email Address field is not empty
        cy.get(arUserPage.getTranscriptFieldByName('email')).invoke('text').should('not.be.empty')
        // Assert that the Total Credits field is not empty
        cy.get(arUserPage.getTranscriptFieldByName('credits')).invoke('text').should('not.be.empty')
        // Assert that the Last Logged In field is not empty
        cy.get(arUserPage.getTranscriptFieldByName('login')).invoke('text').should('not.be.empty')
        // Assert that the Total Time Spent field is not empty
        cy.get(arUserPage.getTranscriptFieldByName('time')).invoke('text').should('not.be.empty')

        // Click the Back button to back to the user edit page
        cy.get(arUserPage.getBackButtonFromTranscriptPage()).click()
        ARDashboardPage.getMediumWait()
        cy.url().should('contain', userPageUrl.userEditPage)
    })
})