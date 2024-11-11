import ARAssignCompetencyPage from "../../../../../../helpers/AR/pageObjects/Competency/ARAssignCompetencyPage"
import ARCompetencyAddEditPage from "../../../../../../helpers/AR/pageObjects/Competency/ARCompetencyAddEditPage"
import ARCompetencyPage from "../../../../../../helpers/AR/pageObjects/Competency/ARCompetencyPage"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARDeleteModal from "../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal"
import ARUnsavedChangesModal from "../../../../../../helpers/AR/pageObjects/Modals/ARUnsavedChangesModal"
import LEDashboardPage from "../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage"
import LEProfilePage from "../../../../../../helpers/LE/pageObjects/User/LEProfilePage"
import { competencyDetails } from "../../../../../../helpers/TestData/Competency/competencyDetails"
import { userDetails } from "../../../../../../helpers/TestData/users/UserDetails"
import { users } from "../../../../../../helpers/TestData/users/users"

describe('C6312 - Admin Assign competency to user', () => {
    before(() => {
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
    })

    beforeEach(() => {
        //Login as admin
        cy.apiLoginWithSession(
            users.sysAdmin.admin_sys_01_username,
            users.sysAdmin.admin_sys_01_password,
            '/admin'
        )
        cy.get(ARDashboardPage.getWaitSpinner(),{timeout:15000}).should('not.exist')
    })

    
    it('Create a temporary Competency', () => {
        // Click the Courses menu item
        ARDashboardPage.getCompetenciesReport()
        // Verify that 
        cy.get(ARCompetencyPage.getA5PageHeaderTitle()).should('have.text', "Competencies")
        ARCompetencyPage.getA5AddEditMenuActionsByNameThenClick('Competency')
        cy.get(ARCompetencyAddEditPage.getA5SaveBtn()).click()
        cy.get(ARCompetencyAddEditPage.getNameErrorMsg()).should('have.text', 'Name is required')

        // Create Competency
        cy.get(ARCompetencyAddEditPage.getNameTxtF()).type(competencyDetails.competencyName)
        cy.get(ARCompetencyAddEditPage.getDescriptionTxtA()).type(competencyDetails.description)
        cy.get(ARCompetencyAddEditPage.getLeaderboardTxtF()).type(competencyDetails.competencyLeaderboard)

        // Upload modal does not work on Admin Side, Code will be written for this when it is implemented in AE

        // Save Competency
        cy.get(ARCompetencyAddEditPage.getA5SaveBtn()).click()
        cy.get(ARDashboardPage.getWaitSpinner(),{timeout:15000}).should('not.exist')
    })
    it('Assign Competency', () => {
       
        //Click on users
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Users')).click()
        //Click on users
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Users'))
        cy.get(ARDashboardPage.getWaitSpinner(),{timeout:15000}).should('not.exist')
      
        //Verify that Users page is open
        cy.get(ARDashboardPage.getPageHeaderTitle()).should('be.visible').and('exist') 
        cy.get(ARDashboardPage.getPageHeaderTitle()).should('contain', 'Users')
        //Select any user
        ARDashboardPage.AddFilter('Username', 'Contains', userDetails.username)
        cy.get(ARDashboardPage.getWaitSpinner(),{timeout:15000}).should('not.exist')
       
        cy.get(ARDashboardPage.getA5TableCellRecordByColumn(4)).contains(userDetails.username).click()
        cy.get(ARDashboardPage.getWaitSpinner(),{timeout:15000}).should('not.exist')
        //Click on edit
        cy.get(ARDashboardPage.getElementByTitleAttribute('Edit User'),{timeout:15000}).should('have.attr',"aria-disabled" , 'false')
        cy.get(ARDashboardPage.getElementByTitleAttribute('Edit User')).click({force:true})
        cy.get(ARDashboardPage.getWaitSpinner(),{timeout:15000}).should('not.exist')
        cy.get(ARDashboardPage.getPageHeaderTitle(),{timeout:15000}).should('be.visible').and('contain','Edit User')
       
        //Click On Assign Competency
        cy.get(ARDashboardPage.getElementByTitleAttribute('Assign Competencies')).click()

        //Search for competency and cancel
        //Click on Add Competencies
        cy.get(ARAssignCompetencyPage.getAddCompetenciesBtn()).click()
        
        cy.get(ARAssignCompetencyPage.getChooseCompetencyCancelBtn()).click()
        cy.get(ARDashboardPage.getAccountHeaderLabel(),{timeout:15000}).should('exist')
        cy.get(ARDashboardPage.getAccountHeaderLabel()).should('contain', 'Assign Competencies')
        

        //Search for competency and continue
        //Click on Add Competencies
        cy.get(ARAssignCompetencyPage.getAddCompetenciesBtn()).click()
        
        cy.get(ARAssignCompetencyPage.getSearchCompetencies()).type('GUIA-CED')
       
        ARAssignCompetencyPage.getCompetenciesDDownOpt('GUIA-CED')
        cy.get(ARAssignCompetencyPage.getCompetenciesChoseBtn()).click()
     

        //User can set level for competencies
        //TODO

        //Click on plus icon to select user
        cy.get(ARAssignCompetencyPage.getUsersDDown()).click()
        cy.get(ARAssignCompetencyPage.getAddUserTextF()).type(userDetails.username)
        cy.get(ARDashboardPage.getWaitSpinner(),{timeout:15000}).should('not.exist')
        ARAssignCompetencyPage.getUsersDDownOpt(userDetails.firstName.substring(0, 5))
        cy.get(ARDashboardPage.getWaitSpinner(),{timeout:15000}).should('not.exist')
        cy.get(ARAssignCompetencyPage.getA5SaveBtn()).click({force:true})
        cy.get(ARDashboardPage.getWaitSpinner(),{timeout:15000}).should('not.exist')

    })

    after( "Clean Up ", () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getCompetenciesReport()
        //Delete created competency
        cy.get(ARDashboardPage.getWaitSpinner(),{timeout:15000}).should('not.exist')
        ARDashboardPage.A5AddFilter('Name', 'Contains', competencyDetails.competencyName)
        cy.get(ARDashboardPage.getWaitSpinner(),{timeout:15000}).should('not.exist')
        cy.get(ARDashboardPage.getA5RemoveAllFilterBtn()).should('be.visible')
        //Here , little wait is required
        ARDashboardPage.getShortWait()
        cy.get(ARDashboardPage.getA5TableCellRecord()).contains(competencyDetails.competencyName).click()
        cy.get(ARDashboardPage.getWaitSpinner(),{timeout:15000}).should('not.exist')
        ARDashboardPage.getShortWait()
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(4)).should('exist')
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(4)).click({force:true})
       
        cy.get(ARDeleteModal.getA5OKBtn()).click()
        cy.get(ARDashboardPage.getWaitSpinner(),{timeout:15000}).should('not.exist')
       

        
        //Delete the created User
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        //Cleanup - Get userID and delete them
        cy.get(LEDashboardPage.getNavProfile()).click()  
        cy.get(ARDashboardPage.getWaitSpinner(),{timeout:15000}).should('not.exist')
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
        cy.get(ARDashboardPage.getWaitSpinner(),{timeout:15000}).should('not.exist')
        cy.url().then((currentURL) => {
            cy.deleteUser(currentURL.slice(-36));
        })
       
    })

})