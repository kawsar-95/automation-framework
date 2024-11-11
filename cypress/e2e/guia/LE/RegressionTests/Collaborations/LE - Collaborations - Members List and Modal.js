import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LECollaborationsActivityPage from '../../../../../../helpers/LE/pageObjects/Collaborations/LECollaborationsActivityPage'
import LECollaborationPage from '../../../../../../helpers/LE/pageObjects/Collaborations/LECollaborationPage'
import LEMembersCollaborationModal from '../../../../../../helpers/LE/pageObjects/Modals/LEMembersCollaboration.modal'
import LESocialProfilePage from '../../../../../../helpers/LE/pageObjects/User/LESocialProfilePage'
import { users } from '../../../../../../helpers/TestData/users/users'
import { collaborationDetails, collaborationNames } from '../../../../../../helpers/TestData/Collaborations/collaborationDetails'
import ARBasePage from '../../../../../../helpers/AR/ARBasePage'

let numMembers, quotient, remainder;
let avatars = [], avatarsSorted = [], members = [], membersSorted = [];

describe('LE - Collaborations - Members List and Modal', function(){

    beforeEach(() => {
        cy.viewport(1280, 720) //Enlarge viewport so Collaborations side menu is visible
        //Sign in, navigate to Collaboration
        cy.apiLoginWithSession(users.learner01.learner_01_username, users.learner01.learner_01_password)
        LEDashboardPage.getTileByNameThenClick('Collaborations')
        cy.get(LECollaborationPage.getPageTitle(),{timeout:15000}).should('be.visible').and('contain','Collaborations Activity')
        cy.get(LECollaborationsActivityPage.getCollaborationsList()).contains(collaborationNames.A_COLLABORATION_NAME).click()
    })

    it('Verify List of Members and Avatars in Right Pane', () => { 
        //Verify Max of 5 Avatars is Displayed in the Right Pane
        cy.get(LECollaborationPage.getMemberAvatars()).find('li').should('have.length', 5)

        //Verify Avatars are Sorted Alphabetically
        for (let i = 0; i < 5; i++) {
            cy.get(LECollaborationPage.getMemberAvatar(i+1)).invoke('attr', 'title').then(($name) => {
                cy.wrap($name).as(`name_${i+1}`) //Get Title Attr of Each Avatar
                    cy.get(`@name_${i+1}`).then(name_1 => {
                        avatars.push(String(name_1)) //Store Title Attr of Each Avatar
                    })
            })
        }
        //Create New Array by Sorting Original Alphabetically
        //Compare Both Arrays to Verify Original is Sorted Alphabetically
        avatarsSorted = avatars.sort()
        cy.get(avatarsSorted).each(($span, i) => {
            expect($span).to.equal(avatars[i]);
        });
    })

    it('Verify Members Modal', () => { 
        //Verify the Modal can be Opened and Dismissed with the view all button and Members header
        cy.get(LECollaborationsActivityPage.getElementByAriaLabelAttribute(LECollaborationPage.getViewAllMembersBtn())).click()
        cy.get(LEMembersCollaborationModal.getModalCloseBtn()).click()
        cy.get(LECollaborationPage.getRightPaneModuleHeader()).contains('Members').click()
        cy.get(LEMembersCollaborationModal.getModalCloseBtn()).click()

        //Verify Pill Displays Total Number of Users in Collaboration
        cy.get(LECollaborationPage.getRightPaneModuleHeader()).contains('Members').parent().within(() => {
            cy.get(LECollaborationPage.getCountPill()).then(($numMembers) => {
                numMembers = parseInt($numMembers.text()) //Get total number of members
            })
        }).then(() => {
            //Verify View All Button Launches Members Modal
            cy.get(LECollaborationsActivityPage.getElementByAriaLabelAttribute(LECollaborationPage.getViewAllMembersBtn())).click()
            
            if (numMembers > 100) { //if more than 100 members, skip loading all as it takes too long - load once to verify
                cy.get(LEMembersCollaborationModal.getLoadMoreBtn()).click()
                //Verify list now shows 20 members
                cy.get(LEMembersCollaborationModal.getMemberContainer()).should('have.length', 20)
            } else {
                remainder = numMembers % 10; //Find the remainder when total # members is divided by 10
                //Get # of times we need to load members in the modal
                if(remainder === 0) {
                    quotient = Math.floor(numMembers/10) - 1;
                }
                else {
                    quotient = Math.floor(numMembers/10);
                }

                //Verify Modal Initially Only Displays 10 Members
                cy.get(LEMembersCollaborationModal.getMemberContainer()).should('have.length', 10)

                //Verify All Members can Be Loaded By Pressing the Load More Button
                //Loads 10 members each time, so we use the quotient value found above
                for (let i = 0; i < quotient; i++) {
                    cy.get(LEMembersCollaborationModal.getLoadMoreBtn()).click()
                    LEDashboardPage.getVShortWait() 
                }

                //Verify All Members have been Loaded in the Modal - Should Match Pill Value
                cy.get(LEMembersCollaborationModal.getMemberContainer()).should('have.length', numMembers)

                //Verify Members are in Alphabetical Order
                cy.get(LEMembersCollaborationModal.getMemberName()).invoke('text').then(($member) => {
                    members.push($member) //Get Each Members Name
                });

                //Compare New Sorted Array with Original to Verify Members Modal is Sorted Alphabetically
                membersSorted = members.sort()
                cy.get(membersSorted).each(($span, i) => {
                    expect($span).to.equal(members[i]);
                }); 
            }           
        })

        //Verify Members Can be Filtered For
        cy.get(LECollaborationPage.getElementByDataNameAttribute(LEMembersCollaborationModal.getMemberSearch()))
            .type(collaborationDetails.l02Name)

        //Verify Member Item Displays an Avatar, First Name, Last Name, and View Profile Link
        cy.get(LEMembersCollaborationModal.getMemberAvatar(),{timeout:10000}).should('exist')
        cy.get(LEMembersCollaborationModal.getMemberName(),{timeout:10000})
            .should('be.visible').and('contain', collaborationDetails.l02Name)
        //Verify Pressing the View Profile Link Navigates to the Member's Social Profile
        LEDashboardPage.getShortWait()
        cy.get(LEMembersCollaborationModal.getViewProfileBtn()).click()
        cy.get(LESocialProfilePage.getSocialProfileHeaderName())
            .should('contain', collaborationDetails.l02Name)
    })
})