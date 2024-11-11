import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LECollaborationsActivityPage from '../../../../../../helpers/LE/pageObjects/Collaborations/LECollaborationsActivityPage'
import LECollaborationPage from '../../../../../../helpers/LE/pageObjects/Collaborations/LECollaborationPage'
import LEYourCollaborationModal from '../../../../../../helpers/LE/pageObjects/Modals/LEYourCollaborations.modal'
import { users } from '../../../../../../helpers/TestData/users/users'
import { collabNames } from '../../../../../../helpers/TestData/Collaborations/collaborationDetails'


let Collabs = collabNames.splice(0,11) //Array of All Collaboration Names minus the last

describe('LE - Collaborations - Collaboration List', function(){

    beforeEach(() => {
        cy.viewport(1280, 720) //Enlarge viewport so Collaborations side menu is visible
        //Sign in, navigate to Collaborations
        cy.apiLoginWithSession(users.learner01.learner_01_username, users.learner01.learner_01_password)
        LEDashboardPage.getTileByNameThenClick('Collaborations')
    })

    it('Verify List of Collaborations in Right Pane', () => {  
        cy.get(LECollaborationsActivityPage.getPageTitle()).should('contain', 'Collaborations Activity')
        //Assert List of Collaborations Can be Seen in the Right Pane
        cy.get(LECollaborationsActivityPage.getCollaborationsList()).should('be.visible')

        //Assert the Pill Shows the Total Count of Collaborations the User is a Member Of
        cy.get(LECollaborationsActivityPage.getCollaborationCountPill()).should('contain.text', Collabs.length)

        //Assert the List Has a Max of 10 Collaborations Displayed
        cy.get(LECollaborationsActivityPage.getCollaborationsList()).its('length').should('eq', 10)

        //Assert the List is Alphabetical
        cy.get(LECollaborationsActivityPage.getCollaborationsList()).invoke('text')
            .should('eq', Collabs.slice(0,10).join(''));

        //Assert Collaborations in the List Can be Clicked on and Navigated To (Check every 2nd)
        for (let i = 0; i < Collabs.slice(0,10).length; i+=2){
            cy.get(LECollaborationsActivityPage.getCollaborationsList()).contains(Collabs[i]).click()
            cy.get(LECollaborationPage.getPageTitle()).should('contain', Collabs[i]) //Verify Collaboration Name
            cy.get(LECollaborationPage.getCreatePostBtn()).should('be.visible') //Verify Create Post Button is Visible
            cy.go('back')
        }
    })

    it('Verify Your Collaborations Modal', () => {  
        //Assert Clicking View All Opens the Modal
        cy.get(LECollaborationsActivityPage.getElementByAriaLabelAttribute(LECollaborationsActivityPage.getViewAllBtn())).click()

        //Assert Modal Shows Max of 10 Collaborations Initally
        cy.get(LEYourCollaborationModal.getCollaborationContainer()).should('have.length', 10)

        //Assert the Modal List is Alphabetical
        cy.get(LEYourCollaborationModal.getCollaborationContainer()).then(($names) => {
            let names = $names.text()
            names = names.slice(16) //Line 54 and 55 to modiyf dom, text to clear all extra texts coming with collaboration names in the dom
            return names.replace(/undefined: View/g, '') //Remove all occurences of 'undefined: View' in the String
        }).should('eq', Collabs.slice(0,10).join('Collaborations: ')); //Add all array instances together with 'Collaborations: ' string to match text coming from the dom
        //Assert Clicking Load More Displays All Collaborations
        cy.get(LEYourCollaborationModal.getLoadMoreBtn()).click()
        cy.get(LEYourCollaborationModal.getCollaborationContainer()).should('have.length', Collabs.length)

        //Assert Modal Can be Closed
        cy.get(LEYourCollaborationModal.getModal()).within(()=>{ 
            cy.get(LEYourCollaborationModal.getModalCloseBtn()).click()
        })

        //Assert Clicking Your Collaborations Header opens the modal
        cy.get(LECollaborationPage.getRightPaneModuleHeader()).contains('Your Collaborations').click()
        
        cy.get(LEYourCollaborationModal.getModal()).within(()=>{ 
            cy.get(LEYourCollaborationModal.getModalCloseBtn()).click()
        })
        //Assert Collaborations in the Modal Can be Clicked on and Navigated To (Check Collaborations Missed in First Test)
        for (let i = 1; i < Collabs.slice(0,10).length; i+=2){
            cy.get(LECollaborationsActivityPage.getElementByAriaLabelAttribute(LECollaborationsActivityPage.getViewAllBtn())).click()
            cy.get(LEYourCollaborationModal.getCollaborationContainer()).contains(Collabs[i]).click()
            cy.get(LECollaborationPage.getPageTitle()).should('contain', Collabs[i]) //Verify Collaboration Name
            cy.get(LECollaborationPage.getCreatePostBtn()).should('be.visible') //Verify Create Post Button is Visible
            cy.go('back')
        }
    })
})