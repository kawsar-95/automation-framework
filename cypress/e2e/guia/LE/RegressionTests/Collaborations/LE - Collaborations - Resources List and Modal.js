import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LECollaborationsActivityPage from '../../../../../../helpers/LE/pageObjects/Collaborations/LECollaborationsActivityPage'
import LECollaborationPage from '../../../../../../helpers/LE/pageObjects/Collaborations/LECollaborationPage'
import LEResourcesCollaborationModal from '../../../../../../helpers/LE/pageObjects/Modals/LEResourcesCollaboration.modal'
import { users } from '../../../../../../helpers/TestData/users/users'
import { collaborationNames } from '../../../../../../helpers/TestData/Collaborations/collaborationDetails'

let numResources, quotient, remainder;
let resources = [], resourcesSorted = [], allResources = [], allResourcesSorted = [];

describe('LE - Collaborations - Resources List and Modal', function(){

    beforeEach(() => {
        cy.viewport(1280, 720) //Enlarge viewport so Collaborations side menu is visible
        //Sign in, navigate to Collaboration
        cy.apiLoginWithSession(users.learner01.learner_01_username, users.learner01.learner_01_password)
        LEDashboardPage.getTileByNameThenClick('Collaborations')
        LEDashboardPage.getShortWait()
        cy.get(LECollaborationsActivityPage.getCollaborationsList()).contains(collaborationNames.A_COLLABORATION_NAME).click()
    })

    it('Verify List of Resources in Right Pane', () => { 
        //Verify Max of 5 Resources are Displayed in the Right Pane
        cy.get(LECollaborationPage.getRightPaneModuleHeader()).contains('Resources').parents(LECollaborationPage.getSectionContainer())
            .within(() => {
                cy.get(LECollaborationPage.getSectionList()).should('have.length', 5)
                //Verify resource items have an icon associated with them
                cy.get(LECollaborationPage.getResourceListItemIcon()).should('have.length', 5)
                //Verify Resources are Sorted Alphabetically
                cy.get(LECollaborationPage.getResourceListItem()).invoke('text').then(($resource) => {
                    resources.push($resource) //Get Each Resource Name
                });
            })

        //Create New Array by Sorting Original Alphabetically
        //Compare Both Arrays to Verify Original is Sorted Alphabetically
        resourcesSorted = resources.sort()
        cy.get(resourcesSorted).each(($span, i) => {
            expect($span).to.equal(resources[i]);
        }); 

        //Cannot test clicking on resources as they open in a new tab.
    })

    it('Verify Resource Modal', () => { 
        //Verify the Modal can be Opened and Dismissed with the view all button and Resources header
        cy.get(LECollaborationsActivityPage.getElementByAriaLabelAttribute(LECollaborationPage.getViewAllResourcesBtn())).click()
        cy.get(LEResourcesCollaborationModal.getModalCloseBtn()).click()
        cy.get(LECollaborationPage.getRightPaneModuleHeader()).contains('Resources').click()
        cy.get(LEResourcesCollaborationModal.getModalCloseBtn()).click()

        //Verify Pill Shows Total Number of Resources Available
        cy.get(LECollaborationPage.getRightPaneModuleHeader()).contains('Resources').parent().within(() => {
            cy.get(LECollaborationPage.getCountPill()).then(($numResources) => {
                numResources = parseInt($numResources.text()) //Get total number of resources
            })
        }).then(() => {
            remainder = numResources % 10; //Find the remainder when total # resources is divided by 10
            //Get # of times we need to load resources in the modal
            if(remainder === 0) {
                quotient = Math.floor(numResources/10) - 1;
            }
            else {
                quotient = Math.floor(numResources/10);
            }
            //Verify View All Button Launches Resources Modal
            cy.get(LECollaborationsActivityPage.getElementByAriaLabelAttribute(LECollaborationPage.getViewAllResourcesBtn())).click()
        
            //Verify Modal Initially Only Displays 10 Resources
            cy.get(LEResourcesCollaborationModal.getResourceContainer()).should('have.length', 10)
        
            //Verify All Resources can Be Loaded By Pressing the Load More Button
            //Loads 10 resources each time, so we use the quotient value found above
            for (let i = 0; i < quotient; i++) {
                cy.get(LEResourcesCollaborationModal.getLoadMoreBtn()).click()
                LEDashboardPage.getVShortWait() 
            }
        
            //Verify All Resources have been Loaded in the Modal - Should Match Pill Value
            cy.get(LEResourcesCollaborationModal.getResourceContainer()).should('have.length', numResources)
        
            //Verify Resources are in Alphabetical Order
            cy.get(LEResourcesCollaborationModal.getResourceName()).invoke('text').then(($resource) => {
                allResources.push($resource) //Get Each Resource Name
            });
        
            //Compare New Sorted Array with Original to Verify Members Modal is Sorted Alphabetically
            allResourcesSorted = allResources.sort()
            cy.get(allResourcesSorted).each(($span, i) => {
                expect($span).to.equal(allResources[i]);
            }); 
            //Cannot test clicking on resources as they open in a new tab.
        })  
    })
})